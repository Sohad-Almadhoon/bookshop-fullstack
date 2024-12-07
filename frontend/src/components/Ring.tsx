import { FC, ReactNode, useEffect, useRef, useState } from "react";
import ReactCurvedText from "react-curved-text";
import { Link } from "react-router-dom";

interface RingProps {
  text: string;
  content: ReactNode;
  href: string;
}

const Ring: FC<RingProps> = ({ text, content, href }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);

      const handleResize = () => {
        setContainerWidth(containerRef.current!.clientWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [containerRef.current]);

  return (
    <Link
      to={href}
      className="rounded-full w-full h-full z-50 border border-black flex justify-center items-center"
      ref={containerRef}>
      {/* @ts-ignore: Suppressing TS2786 error for ReactCurvedText usage */}
      <ReactCurvedText
        width={containerWidth || 250}
        height={containerWidth || 250}
        cx={containerWidth ? containerWidth / 2 : 125}
        cy={containerWidth ? containerWidth / 2 : 125}
        rx={containerWidth ? containerWidth * 0.32 : 80}
        ry={containerWidth ? containerWidth * 0.32 : 80}
        startOffset={0}
        reversed={true}
        text={text}
        textProps={{
          className: `text-black tracking-[0.2em] uppercase`,
          style: {
            fontSize: containerWidth ? `${containerWidth / 11}px` : "22.5px",
          },
        }}
        tspanProps={{
          dy: containerWidth ? -(containerWidth / 12.5) : -20,
        }}
      />
      <div
        className="absolute"
        style={{
          width: containerWidth ? `${containerWidth * 0.76}px` : "190px",
          height: containerWidth ? `${containerWidth * 0.76}px` : "190px",
        }}>
        <div className="w-full h-full aspect-square rounded-full border border-black" />
      </div>
      <div className="absolute w-full h-full flex justify-center items-center">
        {content}
      </div>
    </Link>
  );
};

export default Ring;
