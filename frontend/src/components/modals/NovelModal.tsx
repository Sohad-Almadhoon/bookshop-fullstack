import { useState } from "react";
import Button from "../shared/Button";
import Modal from "./Modal";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import upload from "../../utils/upload";
import { useNovelModal } from "../../hooks/useNovelModal";
import FileUploader from "./components/FileUploader";
import TabButton from "./components/TabButton";
import Loader from "../Loader";

// Define tab configurations in a reusable format
const tabs = [
  { title: "VISUAL", icon: BsImageFill },
  { title: "AUDIO", icon: BsMusicNote },
  { title: "TEXT", icon: BsFileTextFill },
];

const NovelModal = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<string>("");
  const [fileType, setFileType] = useState<string>(""); // Keep track of the file type (image or audio)
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeModal } = useNovelModal();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setIsLoading(true);
    if (uploadedFile) {
      try {
        const imageUrl = await upload(uploadedFile);
        setFile(imageUrl);
        setFileType(uploadedFile.type); // Set the file type based on the uploaded file
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 2: // Text Input
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
      case 0: // Image Upload
        if (isLoading) return <Loader />;
        return (
          <FileUploader
            // file={fileType.startsWith("image/") || file ? file : ""} // Show image file if it's an image
           file="/assets/dog.png"
            onFileChange={handleFileUpload}
            label="Click to upload"
            accept="image/*"
            description="SVG, PNG, JPG, or GIF (max 800x400px, 20MB)"
          />
        );
      case 1: // Audio Upload
        if (isLoading) return <Loader />;
        return (
          <FileUploader
            // file={fileType.startsWith("audio/") || file ? file : ""} // Show audio file if it's audio
           file="/assets/voice.mp3"
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
      image="/assets/modal1.png"
      title={<h3 className="text-5xl">mint block</h3>}
      modalLogo="/assets/modal-icon.svg"
      description="Select your contribution type">
      <div>
        <div className="grid grid-cols-3 max-w-md w-full">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              title={tab.title}
              Icon={tab.icon}
              active={index === activeTab}
              index={index}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </div>

        {renderTabContent()}

        <Button
          disabled={isLoading}
          className={twMerge(
            "w-[250px] mt-12",
            !textInput.length || !file
              ? "text-white bg-black border border-white"
              : "" // outline when no input or file
          )}
          variant={!textInput.length || !file ? "outline" : ""} // outline variant condition
        >
          MINT FOR{" "}
          <strong className="ml-3">
            <sup>$</sup>10
          </strong>
        </Button>
      </div>
    </Modal>
  );
};

export default NovelModal;
