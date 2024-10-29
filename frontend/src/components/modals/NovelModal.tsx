import { useEffect, useState } from "react";
import Button from "../shared/Button";
import Modal from "./Modal";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import upload from "../../utils/upload";
import { useNovelModal } from "../../hooks/useNovelModal";
import FileUploader from "./components/FileUploader";
import TabButton from "./components/TabButton";
import Loader from "../Loader";
import toast from "react-hot-toast";

type ContentType = "visual" | "audio" | "text";

const tabs: { title: ContentType; icon: React.ComponentType }[] = [
  { title: "visual", icon: BsImageFill },
  { title: "audio", icon: BsMusicNote },
  { title: "text", icon: BsFileTextFill },
];

const NovelModal = () => {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<string>("");
  const [fileType, setFileType] = useState<string>(""); // Keep track of the file type (image or audio)
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeModal, contentType } = useNovelModal();
  const [activeTab, setActiveTab] = useState<typeof contentType>("audio");

  useEffect(() => {
    setActiveTab(contentType);
  }, [contentType]);
  useEffect(() => {
    setFile("");
    setTextInput("");
    setFileType("");
  }, [activeTab]);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setIsLoading(true);
    if (uploadedFile) {
      try {
        const imageUrl = await upload(uploadedFile);
        setFile(imageUrl);
        setFileType(uploadedFile.type);
        toast.success("Uploaded Successfully");
      } catch (error) {
        toast.error("Error!!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "text": // Text Input
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
      case "visual": // Image Upload
        if (isLoading) return <Loader />;
        return (
          <FileUploader
            file={fileType.startsWith("image/") ? file : ""}
            onFileChange={handleFileUpload}
            label="Click to upload"
            accept="image/*"
            description="SVG, PNG, JPG, or GIF (max 800x400px, 20MB)"
          />
        );
      case "audio": // Audio Upload
        if (isLoading) return <Loader />;
        return (
          <FileUploader
            file={fileType.startsWith("audio/") ? file : ""} // Show audio file if it's audio
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
              active={tab.title === activeTab}
              index={index}
              onClick={() => setActiveTab(tab.title)}
            />
          ))}
        </div>
        {renderTabContent()}

        <Button
          onClick={()=>{}}
          disabled={isLoading}
          className={twMerge("w-[250px] mt-12", !textInput.length && "")}
          variant={!file ? "outline" : ""} // outline variant condition
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
