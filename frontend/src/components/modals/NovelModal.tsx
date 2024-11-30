import { useEffect, useState } from "react";
import Button from "../shared/Button";
import Modal from "./Modal";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import upload from "../../utils/upload"; // Assuming this handles file upload
import { useNovelModal } from "../../hooks/useNovelModal";
import FileUploader from "./components/FileUploader";
import TabButton from "./components/TabButton";
import Loader from "../Loader";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
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
  const [fileType, setFileType] = useState<string>(""); // Keep track of the file type (image or audio)
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeModal, contentType } = useNovelModal();
  const [activeTab, setActiveTab] = useState<typeof contentType>("audio");
  const [title, setTitle] = useState("");
  const { id } = useParams();

  useEffect(() => {
    setActiveTab(contentType);
  }, [contentType]);

  useEffect(() => {
    setFile("");
    setTextInput("");
    setFileType("");
  }, [activeTab]);

  // Handle file upload (image/audio)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setIsLoading(true);

    if (uploadedFile) {
      try {
        let fileUrl;
        // Handle file upload for images and audio
        if (uploadedFile.type.startsWith("image/")) {
          fileUrl = await upload(uploadedFile); 
        } else if (uploadedFile.type.startsWith("audio/")) {
          fileUrl = await upload(uploadedFile); 
        } else {
          throw new Error("Unsupported file type");
        }
        console.log(fileUrl);
        setFile(fileUrl);
        setFileType(uploadedFile.type);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error uploading file!");
        setIsLoading(false);
      }
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
        cover_image: fileType.startsWith("image/")
          ? file
          : "data:image/jpeg;base64,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",
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
              file={fileType.startsWith("image/") ? file : ""}
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
            file={fileType.startsWith("audio/") ? file : ""}
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
      title={<h3 className="text-5xl">Mint Block</h3>}
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
          onClick={handleChapterCreation}
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
