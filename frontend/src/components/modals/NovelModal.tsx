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
  // New state to handle chapter data
  const [chapterData, setChapterData] = useState({
    image: "",
    audio: "",
    text: "",
  });

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
        const imageUrl = await upload(uploadedFile); // Assuming this function uploads the file and returns a URL
        setFile(imageUrl);
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

    // Prepare chapter data
    const data = {
      image: fileType.startsWith("image/") ? file : "",
      audio: fileType.startsWith("audio/") ? file : "",
      text: textInput,
    };

    try {
      // Send chapter data to the backend to create a new chapter
      await newRequest.post(`/api/books/${id}/chapters`, title);
      await newRequest.post(`/api/books/${id}/chapters`, title);
      
      // if (response.status === 200) {
      //   toast.success("Chapter created successfully!");
      //   closeModal(); // Close the modal after success
      // } else {
      //   toast.error("Error creating chapter!");
      // }
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
            <CustomInput onChange={(e) => setTitle(e.target.value)} className="w-full mt-4" placeholder="Enter the chapter title..."/>
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
          className={twMerge("w-[250px] mt-5 border-none font-baskervville font-bold", !textInput.length && "")}
          variant={!file || !textInput.length ? "outline" : ""}>
          Create Chapter
        </Button>
      </div>
    </Modal>
  );
};

export default NovelModal;
