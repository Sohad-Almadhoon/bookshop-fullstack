import { useEffect, useState } from "react";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { useMatch } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import Modal from "./Modal";
import { useNovelModal } from "../../hooks/useNovelModal";
import TabButton from "./components/TabButton";
import Loader from "../shared/Loader";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import TextUploader from "./components/TextUploader";
import FileUploader from "./components/FileUploader";
import CustomInput from "../shared/CustomInput";
import uploadFile from "../../utils/upload";

type ContentType = "visual" | "audio" | "text";

const tabs: { title: ContentType; icon: React.ComponentType }[] = [
  { title: "visual", icon: BsImageFill },
  { title: "audio", icon: BsMusicNote },
  { title: "text", icon: BsFileTextFill },
];

const NovelModal = () => {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<string>("");
  const [title, setTitle] = useState("");
  const { isOpen, closeModal, contentType } = useNovelModal();
  const [activeTab, setActiveTab] = useState<ContentType>("visual");
  const queryClient = useQueryClient();

  // The modal is mounted globally, so it has to work out what it is editing.
  const bookMatch = useMatch("/books/:id");
  const chapterMatch = useMatch("/chapters/:id");
  const bookIdFromRoute = bookMatch?.params.id;
  const chapterId = chapterMatch?.params.id;

  // On a chapter page the book id comes from the already cached chapter query.
  const { data: chapter } = useQuery<{ book_id: number }>({
    queryKey: ["chapter", chapterId],
    queryFn: async () => (await newRequest.get(`/api/chapters/${chapterId}`)).data,
    enabled: Boolean(chapterId) && isOpen,
  });

  const bookId = bookIdFromRoute ?? (chapter?.book_id ? String(chapter.book_id) : undefined);
  const canCreateChapter = Boolean(bookId);
  const canAddContent = Boolean(chapterId);

  useEffect(() => {
    if (isOpen && contentType) {
      setActiveTab(contentType);
      setFile("");
      setTextInput("");
      setTitle("");
    }
  }, [contentType, isOpen]);

  const { mutate: uploadMutate, isPending: isFileUploading } = useMutation({
    mutationFn: (uploaded: File) => {
      const fileType = uploaded.type.split("/")[0] as "image" | "audio";
      return uploadFile(uploaded, fileType);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error uploading file!")),
    onSuccess: (fileUrl: string) => {
      setFile(fileUrl);
      toast.success("File uploaded successfully!");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) {
      toast.error("No file selected!");
      return;
    }
    const fileType = uploadedFile.type.split("/")[0];
    if (fileType !== "image" && fileType !== "audio") {
      toast.error("Unsupported file type! Only images and audio files are allowed.");
      return;
    }
    uploadMutate(uploadedFile);
  };

  const createChapterMutation = useMutation({
    mutationFn: async () => {
      const response = await newRequest.post(`/api/books/${bookId}/chapters`, {
        title: title.trim(),
        cover_image: file,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Chapter created successfully!");
      queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      closeModal();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error creating chapter!")),
  });

  const createContentMutation = useMutation({
    mutationFn: async () => {
      const payload =
        activeTab === "audio" ? { audio: file } : { text: textInput.trim() };
      const response = await newRequest.post(`/api/chapters/${chapterId}/content`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Content uploaded successfully!");
      // Refetch instead of a full page reload.
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      setTextInput("");
      setFile("");
      closeModal();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to upload content!")),
  });

  const isSubmitting = createChapterMutation.isPending || createContentMutation.isPending;

  const handleSubmit = () => {
    if (activeTab === "visual") {
      if (!canCreateChapter) return toast.error("Open a book first to create a chapter.");
      if (!file) return toast.error("Please upload a cover image first.");
      if (!title.trim()) return toast.error("Please enter a chapter title.");
      return createChapterMutation.mutate();
    }

    if (!canAddContent) {
      return toast.error("Open a chapter first to add content to it.");
    }
    if (activeTab === "audio" && !file) return toast.error("Please upload an audio file.");
    if (activeTab === "text" && !textInput.trim()) {
      return toast.error("Please write some text first.");
    }
    createContentMutation.mutate();
  };

  const handleTabClick = (tab: ContentType) => {
    if (tab === "visual" && !canCreateChapter) {
      return toast.error("Chapters can only be created from a book page.");
    }
    if (tab !== "visual" && !canAddContent) {
      return toast.error("Open a chapter to add audio or text.");
    }
    setActiveTab(tab);
    setFile("");
  };

  const renderTabContent = () => {
    if (isFileUploading) return <Loader />;

    switch (activeTab) {
      case "text":
        return <TextUploader setTextInput={setTextInput} text={textInput} />;
      case "visual":
        return (
          <div>
            <FileUploader
              file={file}
              setFile={setFile}
              type="visual"
              onFileChange={handleFileChange}
              label="Click to upload"
              accept="image/*"
              description="SVG, PNG, JPG, or GIF (max 5MB)"
            />
            <CustomInput
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-4"
              value={title}
              maxLength={120}
              placeholder="Enter the chapter title..."
            />
          </div>
        );
      case "audio":
        return (
          <FileUploader
            file={file}
            setFile={setFile}
            onFileChange={handleFileChange}
            type="audio"
            label="Click to upload"
            accept="audio/*"
            description="MP3 or WAV (max 20MB)"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={isOpen} onClose={closeModal} modalLogo="/assets/modal-icon.svg">
      <div>
        <div className="grid grid-cols-3 max-w-md w-full mx-auto">
          {tabs.map((tab, index) => (
            <TabButton
              key={tab.title}
              title={tab.title}
              Icon={tab.icon}
              active={tab.title === activeTab}
              index={index}
              onClick={() => handleTabClick(tab.title)}
            />
          ))}
        </div>

        {renderTabContent()}

        <Button
          onClick={handleSubmit}
          disabled={isFileUploading || isSubmitting}
          className="w-full max-w-[250px] mx-auto mt-5 border-none font-baskervville font-bold">
          {isSubmitting ? (
            <Loader />
          ) : activeTab === "visual" ? (
            "Create Chapter"
          ) : activeTab === "audio" ? (
            "Upload Audio"
          ) : (
            "Add Text"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default NovelModal;
