import { useEffect, useState } from "react";
import Button from "../shared/Button";
import Modal from "./Modal";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { useNovelModal } from "../../hooks/useNovelModal";
import FileUploader from "./components/FileUploader";
import TabButton from "./components/TabButton";
import Loader from "../shared/Loader";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
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
  const [isLoading, setIsLoading ] = useState(false);
  const { isOpen, closeModal, contentType} = useNovelModal();
  const [fileType, setFileType] = useState("");
  const [activeTab, setActiveTab] = useState<ContentType>("visual");
  const [title, setTitle] = useState("");
  const { id } = useParams();
  useEffect(() => {
    if (contentType) {
      setActiveTab(contentType);
    }
 },[contentType])
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setIsLoading(true);

    if (uploadedFile) {
      try {
        const fileType = uploadedFile.type.split("/")[0] as "image" | "audio";
        if (fileType === "image" || fileType === "audio") {
          const fileUrl = await uploadFile(uploadedFile, fileType);

          console.log(fileUrl);
          setFile(fileUrl);
          setFileType(fileType);
        } else {
          toast.error(
            "Unsupported file type! Only images and audio files are allowed."
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error uploading file!";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("No file selected!");
      setIsLoading(false);
    }
  };

  // Handle chapter creation
  const handleChapterCreation = async () => {
    if (!file && !textInput) {
      toast.error("Please upload a file or add text.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await newRequest.post(`/api/books/${id}/chapters`, {
        title,
        cover_image: file,
      });

      if (response.status === 201) {
        toast.success("Chapter created successfully!");
        closeModal();
      } else {
        toast.error("Error creating chapter!");
      }
    } catch (error) {
      toast.error("Error creating chapter!");
    } finally {
      setIsLoading(false);
    }
  };
  const createChapterContent = async () => {
    try {
      const response = await newRequest.post(
        `/api/chapters/${id}/content`,
        {
          audio: file
        }
      );
      console.log(response.data , file)
    } catch (error) {
      console.log(error);
    }
  };
  
  // Render content based on the active tab (visual, audio, or text)
  const renderTabContent = () => {
    switch (activeTab) {
      case "text":
        return (
          <div className="mt-5">
            <textarea
              className="w-full h-[155px] p-3 border border-black rounded-lg bg-transparent placeholder-black placeholder-opacity-40"
              placeholder="Write your text here..."
              maxLength={400}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <p className="text-right text-sm text-[#181818]">
              {textInput.length}/400
            </p>
          </div>
        );
      case "visual":
        if (isLoading) return <Loader />;
        return (
          <div>
            <FileUploader
              file={file}
              onFileChange={handleFileUpload}
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
        if (isLoading) return <Loader />;
        return (
          <FileUploader
            file={file}
            onFileChange={handleFileUpload}
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
          onClick={createChapterContent}
          disabled={isLoading}
          className={twMerge(
            "w-[250px] mt-5 border-none font-baskervville font-bold",
            !textInput.length && ""
          )}
          variant={!file || !textInput.length ? "outline" : ""}>
          Create Chapter
        </Button>
      </div>
    </Modal>
  );
};

export default NovelModal;
