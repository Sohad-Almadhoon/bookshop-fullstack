import { useEffect, useState } from "react";
import { BsImageFill, BsMusicNote } from "react-icons/bs";
import { useMatch } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import Modal from "./Modal";
import { useNovelModal } from "../../hooks/useNovelModal";
import TabButton from "./components/TabButton";
import Loader from "../shared/Loader";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import FileUploader from "./components/FileUploader";
import CustomInput from "../shared/CustomInput";
import uploadFile from "../../utils/upload";

// Text is written straight into the chapter page now, so this modal only
// handles the two things that need a file upload.
type ContentType = "visual" | "audio";

const tabs: { title: ContentType; label: string; icon: React.ComponentType }[] = [
  { title: "visual", label: "New chapter", icon: BsImageFill },
  { title: "audio", label: "Audio", icon: BsMusicNote },
];

const NovelModal = () => {
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
  const canAddAudio = Boolean(chapterId);

  useEffect(() => {
    if (!isOpen) return;
    // "text" can still arrive from an old link; fall back to the sensible tab.
    const requested: ContentType =
      contentType === "audio" && canAddAudio ? "audio" : "visual";
    setActiveTab(requested);
    setFile("");
    setTitle("");
  }, [contentType, isOpen, canAddAudio]);

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

  const addAudioMutation = useMutation({
    mutationFn: async () => {
      const response = await newRequest.post(`/api/chapters/${chapterId}/content`, {
        audio: file,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Audio added!");
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      setFile("");
      closeModal();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to upload audio!")),
  });

  const isSubmitting = createChapterMutation.isPending || addAudioMutation.isPending;

  const handleSubmit = () => {
    if (activeTab === "visual") {
      if (!canCreateChapter) return toast.error("Open a book first to create a chapter.");
      if (!file) return toast.error("Please upload a cover image first.");
      if (!title.trim()) return toast.error("Please enter a chapter title.");
      return createChapterMutation.mutate();
    }

    if (!canAddAudio) return toast.error("Open a chapter first to add audio.");
    if (!file) return toast.error("Please upload an audio file.");
    addAudioMutation.mutate();
  };

  const handleTabClick = (tab: ContentType) => {
    if (tab === "visual" && !canCreateChapter) {
      return toast.error("Chapters can only be created from a book page.");
    }
    if (tab === "audio" && !canAddAudio) {
      return toast.error("Open a chapter to add audio.");
    }
    setActiveTab(tab);
    setFile("");
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      modalLogo="/assets/modal-icon.svg"
      title={activeTab === "visual" ? "Create a chapter" : "Add audio"}>
      <div className="w-full max-w-md">
        <div className="grid grid-cols-2">
          {tabs.map((tab, index) => (
            <TabButton
              key={tab.title}
              title={tab.label}
              Icon={tab.icon}
              active={tab.title === activeTab}
              index={index === 0 ? 0 : 2}
              onClick={() => handleTabClick(tab.title)}
            />
          ))}
        </div>

        {isFileUploading ? (
          <Loader />
        ) : activeTab === "visual" ? (
          <div>
            <FileUploader
              file={file}
              setFile={setFile}
              type="visual"
              onFileChange={handleFileChange}
              label="Click to upload"
              accept="image/*"
              description="PNG, JPG, or WEBP (max 5MB)"
            />
            <CustomInput
              onChange={(e) => setTitle(e.target.value)}
              className="mt-4 w-full"
              value={title}
              maxLength={120}
              placeholder="Enter the chapter title..."
            />
          </div>
        ) : (
          <FileUploader
            file={file}
            setFile={setFile}
            onFileChange={handleFileChange}
            type="audio"
            label="Click to upload"
            accept="audio/*"
            description="MP3 or WAV (max 20MB)"
          />
        )}

        <Button
          onClick={handleSubmit}
          disabled={isFileUploading || isSubmitting}
          className="mx-auto mt-5 w-full max-w-[250px] border-none font-baskervville font-bold">
          {isSubmitting ? (
            <Loader />
          ) : activeTab === "visual" ? (
            "Create chapter"
          ) : (
            "Add audio"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default NovelModal;
