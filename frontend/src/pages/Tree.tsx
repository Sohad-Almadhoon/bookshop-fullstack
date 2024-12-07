import React from "react";
import Header from "../components/shared/Header";
import Ring from "../components/Ring";
const Tree = () => {
  const treeRef = React.useRef<HTMLImageElement>(null);
  const [treeRect, setTreeRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    if (treeRef.current) {
      setTreeRect(treeRef.current.getBoundingClientRect());

      const handleResize = () => {
        setTreeRect(treeRef.current!.getBoundingClientRect());
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [treeRef.current]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="relative flex pt-12 justify-center w-full items-end flex-1 min-h-screen  border-black border">
        <div
          className="absolute w-[20%] lg:w-[13%] aspect-square left-[25%] z-10 bottom-[20%] bg-[#ddd1bb]"
          style={
            !treeRect
              ? { left: "25%" }
              : {
                  left: treeRect.x > 20 ? `calc(${treeRect.x}px - 10%)` : 0,
                }
          }>
          <Ring
            content={
              <img
                className="h-[60%] w-auto object-contain"
                src="/assets/owl.png"
                alt=""
              />
            }
            text="Profile&nbsp;Profile&nbsp;Profile&nbsp;Profile"
            href="/profile"
          />
        </div>
        <div
          className="absolute z-10 w-[20%] lg:w-[13%] aspect-square left-[25%] bottom-[56%] bg-[#ddd1bb]"
          style={
            !treeRect
              ? { left: "25%", bottom: "56%" }
              : {
                  left: treeRect.x > 20 ? `calc(${treeRect.x}px - 6%)` : 0,
                  bottom: `${treeRect.height - (30 / 100) * treeRect.height}px`,
                }
          }>
          <Ring
            content={
              <img
                className="h-[60%] w-auto object-contain"
                src="/assets/dog.png"
                alt=""
              />
            }
            text="Discover&nbsp;&nbsp;Discover&nbsp;&nbsp;Discover"
            href="/discover"
          />
        </div>
        <div
          className="absolute z-10 left-[44%] w-[20%] lg:w-[13%] aspect-square bg-[#ddd1bb]"
          style={
            treeRect
              ? {
                  bottom: `${treeRect.width + 20}px`,
                }
              : {
                  top: 0,
                }
          }>
          <Ring
            content={
              <img
                className="h-[60%] w-auto object-contain"
                src="/assets/fish.png"
                alt=""
              />
            }
            text="Create&nbsp;&nbsp;Book&nbsp;Create&nbsp;&nbsp;Book&nbsp;"
            href="/create-book"
          />
        </div>
        <div
          className="absolute z-10 right-[25%] w-[20%] lg:w-[13%] aspect-square bottom-[56%] bg-[#ddd1bb]"
          style={
            !treeRect
              ? { right: "25%", bottom: "56%" }
              : {
                  right: treeRect.x > 20 ? `calc(${treeRect.x}px - 6%)` : 0,
                  bottom: `${treeRect.height - (30 / 100) * treeRect.height}px`,
                }
          }>
          <Ring
            content={
              <img
                className="h-[60%] w-auto object-contain"
                src="/assets/bat.png"
                alt=""
              />
            }
            text="How it works&nbsp;&nbsp;How it works"
            href="/coming-soon"
          />
        </div>
        <div
          className="absolute z-10 right-[25%] bottom-[20%] w-[20%] lg:w-[13%] aspect-square bg-[#ddd1bb]"
          style={
            !treeRect
              ? { right: "25%" }
              : {
                  right: treeRect.x > 20 ? `calc(${treeRect.x}px - 10%)` : 0,
                }
          }>
          <Ring
            content={
              <img
                className="h-[60%] w-auto object-contain"
                src="./assets/fish-2.png"
                alt=""
              />
            }
            text="About&nbsp;About&nbsp;About&nbsp;&nbsp;About&nbsp;"
            href="/coming-soon"
          />
        </div>
        <img
          src="/assets/tree.svg"
          alt="tree"
          className="mt-28 w-full z-0 relative lg:w-[35%]"
          ref={treeRef}
        />
      </div>
    </div>
  );
};

export default Tree;
