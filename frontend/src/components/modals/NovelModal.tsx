import { useEffect, useState } from "react";
import Button from "../shared/Button";
import Modal from "./Modal";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { useNovelModal } from "../../hooks/useNovelModal";
import TabButton from "./components/TabButton";
import Loader from "../shared/Loader";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import TextUploader from "./components/TextUploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FileUploader from "./components/FileUploader";
import handleFileUpload from "../../actions/upload.action";
import CustomInput from "../shared/CustomInput";

type ContentType = "visual" | "audio" | "text";

const tabs: { title: ContentType; icon: React.ComponentType }[] = [
  { title: "visual", icon: BsImageFill },
  { title: "audio", icon: BsMusicNote },
  { title: "text", icon: BsFileTextFill },
];

const NovelModal = () => {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<string>("");
  const { isOpen, closeModal, contentType } = useNovelModal();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentType>("visual");
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (contentType) {
      setActiveTab(contentType);
    }
  }, [contentType]);

  const handleChapterCreationMutation = useMutation({
    mutationFn: async () => {
      const response = await newRequest.post(`/api/books/${id}/chapters`, {
        title,
        cover_image: file,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Chapter created successfully!");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
    onError: () => {
      toast.error("Error creating chapter!");
    },
  });

  // Mutation for uploading chapter content
  const createChapterContentMutation = useMutation({
    mutationFn: async () => {
      const payload: { audio?: string; text?: string } = {};

      if (activeTab === "audio") {
        payload.audio = file;
      } else if (activeTab === "text") {
        payload.text = textInput;
      }

      const response = await newRequest.post(
        `/api/chapters/${id}/content`,
        payload
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Content uploaded successfully!");
      closeModal();
      window.location.reload();
      setTextInput("");
      setFile("");
    },
    onError: () => {
      toast.error("Failed to upload content!");
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "text":
        return <TextUploader setTextInput={setTextInput} text={textInput} />;
      case "visual":
        if (isLoading) <Loader />;
        return (
          <div>
            <FileUploader
              file={file}
              onFileChange={(e) =>
                handleFileUpload(e, setIsLoading, setFile, toast)
              }
              label="Click to upload"
              accept="image/*"
              description="SVG, PNG, JPG, or GIF (max 800x400px, 20MB)"
            />
            <CustomInput
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-4"
              placeholder="Enter the chapter title..."
            />
          </div>
        );
      case "audio":
        if (isLoading) <Loader />;
        return (
          <FileUploader
            file={file}
            onFileChange={(e) =>
              handleFileUpload(e, setIsLoading, setFile, toast)
            }
            label="Click to upload"
            accept="audio/*"
            description="MP3, WAV, FLAC (max 20MB)"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      modalLogo="/assets/modal-icon.svg">
      <div>
        <div className="grid grid-cols-3 max-w-md w-full">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              title={tab.title}
              Icon={tab.icon}
              active={tab.title === activeTab}
              index={index}
            />
          ))}
        </div>
        {renderTabContent()}

        <Button
          onClick={() => {
            if (activeTab === "visual") {
              handleChapterCreationMutation.mutate();
            } else {
              createChapterContentMutation.mutate();
            }
          }}
          disabled={createChapterContentMutation.isPending}
          className="w-[250px] mt-5 border-none font-baskervville font-bold">
          {createChapterContentMutation.isPending ? (
            <Loader />
          ) : (
            "Create Chapter"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default NovelModal;
