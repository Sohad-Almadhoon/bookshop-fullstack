import { useState } from "react";
import Button from "../components/shared/Button";
import Modal from "../components/Modal";
import { useModalStore } from "../store";
import { BsFileTextFill, BsImageFill, BsMusicNote } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

const tabs = [
  {
    title: "VISUAL",
    icon: BsImageFill,
  },
  {
    title: "AUDIO",
    icon: BsMusicNote,
  },
  {
    title: "TEXT",
    icon: BsFileTextFill,
  },
];

const Example = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [textInput, setTextInput] = useState("");
  const { openModal, isOpen, closeModal } = useModalStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  return (
    <div>
      <Button onClick={openModal} variant="outline">
        Open Modal
      </Button>
      <p className="mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate natus
        aliquid, vel aliquam doloremque atque, molestias ut, harum blanditiis
        itaque porro. Aut, blanditiis corrupti dolorem qui totam amet animi
        omnis.
      </p>

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
              <Button
                key={index}
                onClick={() => setActiveTab(index)}
                variant = {activeTab === index ? "outline" :""}
                className={twMerge(
                  "flex items-center py-3 px-6 text-xl gap-2",
                  index === 0 ? "rounded-r-none" : "",
                  index === tabs.length - 1 ? "rounded-l-none" : "rounded-none"
                )}>
                <tab.icon className="w-6 h-6" />
                {tab.title}
              </Button>
            ))}
          </div>

          {/* Ternary operation for rendering tab content */}
          {activeTab === 0 ? (
            <div className="h-[180px] w-full mt-5 p-6 border border-dashed border-black rounded-lg flex flex-col justify-center items-center cursor-pointer">
              <label className="cursor-pointer text-sm">
                <span className="border-b border-black">Click to upload</span>{" "}
                or drag and drop
                <p className="text-xs mt-1">
                  SVG, PNG, JPG, or GIF (max 800x400px, 20MB)
                </p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : activeTab === 1 ? (
            <div className="h-[180px] w-full mt-5 p-6 border border-dashed border-black rounded-lg flex flex-col justify-center items-center cursor-pointer">
              <label className="cursor-pointer text-sm">
                <span className="border-b border-black">Click to upload</span>{" "}
                or drag and drop
                <p className="text-xs mt-1">MP3, WAV, FLAC (max 20MB)</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            <div className="mt-5">
              <textarea
                className="w-full h-[150px] p-3 border border-black rounded-lg bg-transparent placeholder-black placeholder-opacity-40"
                placeholder="Write your text here..."
                maxLength={400}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <p className="text-right text-sm mt-2 text-[#181818]">
                {textInput.length}/400
              </p>
            </div>
          )}

          <Button className="w-[250px] mt-12">
            MINT FOR{" "}
            <strong className="ml-3">
              <sup>$</sup>10
            </strong>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Example;
