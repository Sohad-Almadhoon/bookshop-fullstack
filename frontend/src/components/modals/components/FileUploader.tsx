import { FC } from "react";
import { BsTrash } from "react-icons/bs";
import VoicePlayer from "../../shared/VoicePlayer";

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  accept: string;
  description: string;
  file?: string;
  type: "visual" | "audio";
  setFile?: (file: string) => void;
}

const FileUploader: FC<FileUploadProps> = ({
  onFileChange,
  label,
  accept,
  description,
  file,
  type,
  setFile,
}) => {
  return (
    <>
      {file ? (
        <div>
          {type === "visual" ? (
            <div className="flex justify-center mx-auto mt-3 relative h-56 w-40 object-cover">
              <img
                src={file}
                alt="Uploaded file"
                className="bg-black rounded-xl"
              />
              <BsTrash
                className="absolute -top-2 -right-3 text-4xl bg-black cursor-pointer text-white border-white border-4 p-1 rounded-full"
                onClick={setFile && (() => setFile(""))}
              />
            </div>
          ) : type === "audio" ? (
            <div className="flex gap-2 items-center mt-12">
              <VoicePlayer url={file} />
              <BsTrash
                className="text-3xl bg-black cursor-pointer text-white  p-1 rounded-full"
                onClick={setFile && (() => setFile(""))}
              />
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
