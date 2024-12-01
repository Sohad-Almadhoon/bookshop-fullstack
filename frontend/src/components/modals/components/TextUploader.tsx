import React from "react";

interface TextUploaderProps {
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}
const TextUploader = ({ setTextInput, text }: TextUploaderProps) => {
  return (
    <div className="mt-5">
      <textarea
        className="w-full h-[155px] p-3 border border-black rounded-lg bg-transparent placeholder-black placeholder-opacity-40"
        placeholder="Write your text here..."
        maxLength={400}
        value={text}
        onChange={(e) => setTextInput(e.target.value)}
      />
      <p className="text-right text-sm text-[#181818]">{text.length}/400</p>
    </div>
  );
};

export default TextUploader