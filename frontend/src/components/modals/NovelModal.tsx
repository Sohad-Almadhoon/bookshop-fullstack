import { FC, useState } from "react";
import Button from "../shared/Button";
import Modal from "./Modal";
import { useModalStore } from "../../store";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

// Define tab configurations in a reusable format
const tabs = [
  { title: "VISUAL", icon: BsImageFill },
  { title: "AUDIO", icon: BsMusicNote },
  { title: "TEXT", icon: BsFileTextFill },
];
// Define types for props
interface TabButtonProps {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  index?: number;
}

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  accept: string;
  description: string;
}
// Reusable Tab Component
const TabButton: FC<TabButtonProps> = ({
  index,
  title,
  Icon,
  active,
  onClick,
}) => (
  <Button
    onClick={onClick}
    className={twMerge(
      "flex items-center py-3 px-6 text-xl gap-2",
      index === 0
        ? "rounded-r-none"
        : index === 1
        ? "rounded-r-none rounded-l-none"
        : "rounded-l-none"
    )}
    variant={active ? "" : "outline"}>
    <Icon className="w-6 h-6" />
    {title}
  </Button>
);

// Reusable File Upload Input
const FileUpload: FC<FileUploadProps> = ({
  onFileChange,
  label,
  accept,
  description,
}) => (
  <div className="h-[180px] w-full mt-5 p-6 border border-dashed border-black rounded-lg flex flex-col justify-center items-center cursor-pointer">
    <label className="cursor-pointer text-sm">
      <span className="border-b border-black">{label}</span> or drag and drop
      <p className="text-xs mt-1">{description}</p>
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={onFileChange}
      />
    </label>
  </div>
);

const NovelModal = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { isOpen, closeModal } = useModalStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("Uploaded File:", uploadedFile);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Text Input
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
      case 1: // Image Upload
        return (
          <FileUpload
            onFileChange={handleFileUpload}
            label="Click to upload"
            accept="image/*"
            description="SVG, PNG, JPG, or GIF (max 800x400px, 20MB)"
          />
        );
      case 2: // Audio Upload
        return (
          <FileUpload
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
      title="MINT BLOCK"
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
          className={twMerge(
            "w-[250px] mt-12",
            !textInput.length && "text-black text-opacity-30"
          )}
          variant={textInput.length ? "" : "outline"}>
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
