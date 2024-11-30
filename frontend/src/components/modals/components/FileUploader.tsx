import { FC } from "react";
import { BsTrash } from "react-icons/bs";
import VoicePlayer from "../../shared/VoicePlayer";

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  accept: string;
  description: string;
  file?: string;
}

const FileUploader: FC<FileUploadProps> = ({
  onFileChange,
  label,
  accept,
  description,
  file,
}) => {
  // Check if the file is an image or audio by examining its extension
  const isImage =
    typeof file === "string" &&
    (file.endsWith(".jpg") ||
      file.endsWith(".jpeg") ||
      file.endsWith(".png") ||
      file.endsWith(".gif"));
  const isAudio =
    typeof file === "string" &&
    (file.endsWith(".mp3") || file.endsWith(".wav") || file.endsWith(".ogg"));

  return (
    <>
      {file ? (
        <div>
          {isImage ? (
            <div className="flex justify-center mx-auto mt-3 relative h-56 w-40 object-cover">
              <img
                src={file}
                alt="Uploaded file"
                className="bg-black rounded-xl"
              />
              <BsTrash className="absolute -top-2 -right-3 text-4xl bg-black cursor-pointer text-white border-white border-4 p-1 rounded-full" />
            </div>
          ) : isAudio ? (
            <div className="flex gap-2 items-center mt-12">
              <VoicePlayer url="https://res.cloudinary.com/di3wcajzm/raw/upload/v1732977379/audio/dnh74pb1n1yzhoffq9fi" />
              <BsTrash className="text-3xl bg-black cursor-pointer text-white  p-1 rounded-full" />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="h-[180px] w-full mt-5 p-6 border border-dashed border-black rounded-lg flex flex-col justify-center items-center cursor-pointer">
          <label className="cursor-pointer text-sm">
            <span className="border-b border-black">{label}</span> or drag and
            drop
            <p className="text-xs mt-1">{description}</p>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={onFileChange}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default FileUploader;
