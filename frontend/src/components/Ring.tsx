import { FC, ReactNode } from "react";
import ReactCurvedText from "react-curved-text";
import { Link } from "react-router-dom";

interface RingProps {
  text: string;
  content: ReactNode;
  href: string;
}

const Ring: FC<RingProps> = ({ text, content, href }) => {
  return (
    <Link
      to={href}
      className="rounded-full w-[250px] h-[250px] z-50 border border-black flex justify-center items-center">
      <ReactCurvedText
        width={250}
        height={250}
        cx={125}
        cy={125}
        rx={80}
        ry={80}
        startOffset={0}
        reversed={true}
        text={text}
        textProps={{
          className: "text-black text-[22.5px] tracking-[0.2em] uppercase",
        }}
        tspanProps={{
          dy: -20,
        }}
      />
      <div className="w-[190px] h-[190px] rounded-full border border-black absolute" />
      <div className="absolute">{content}</div>
    </Link>
  );
};

export default Ring;
