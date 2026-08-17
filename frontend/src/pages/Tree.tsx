import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/shared/Header";
import Ring from "../components/Ring";

interface Destination {
  icon: string;
  label: string;
  ringText: string;
  href: string;
  /** Position of the ring around the tree on large screens. */
  desktop: string;
}

const destinations: Destination[] = [
  {
    icon: "/assets/owl.png",
    label: "Profile",
    ringText: "Profile Profile Profile Profile",
    href: "/profile",
    desktop: "left-[14%] bottom-[16%]",
  },
  {
    icon: "/assets/dog.png",
    label: "Discover",
    ringText: "Discover  Discover  Discover",
    href: "/discover",
    desktop: "left-[20%] bottom-[52%]",
  },
  {
    icon: "/assets/fish.png",
    label: "Create Book",
    ringText: "Create  Book Create  Book ",
    href: "/create-book",
    desktop: "left-1/2 -translate-x-1/2 top-[6%]",
  },
  {
    icon: "/assets/bat.png",
    label: "How it works",
    ringText: "How it works  How it works",
    href: "/coming-soon",
    desktop: "right-[20%] bottom-[52%]",
  },
  {
    icon: "/assets/fish-2.png",
    label: "About",
    ringText: "About About About  About ",
    href: "/coming-soon",
    desktop: "right-[14%] bottom-[16%]",
  },
];

const Tree = () => (
  <div className="flex flex-col min-h-screen">
    <Header />

    {/* Phones and tablets: a plain, tappable grid. The decorative tree with
        absolutely positioned rings only appears once there is room for it -
        it used to be computed from getBoundingClientRect and collapsed into
        an unusable pile on small screens. */}
    <div className="lg:hidden border-black border flex-1 p-4">
      <img
        src="/assets/tree.svg"
        alt=""
        className="w-40 mx-auto mb-6 opacity-80"
        aria-hidden="true"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
        {destinations.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="border border-black rounded-2xl p-4 flex flex-col items-center gap-2 text-center bg-[#d5c9b3] active:scale-95 transition-transform">
            <img src={item.icon} alt="" className="h-16 w-auto object-contain" />
            <span className="uppercase text-sm tracking-wide">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>

    <div className="hidden lg:flex relative pt-12 justify-center w-full items-end flex-1 min-h-[80vh] border-black border">
      {destinations.map((item) => (
        <div
          key={item.label}
          className={`absolute z-10 w-[13%] aspect-square bg-[#ddd1bb] ${item.desktop}`}>
          <Ring
            content={
              <img
                className="h-[60%] w-auto object-contain"
                src={item.icon}
                alt=""
              />
            }
            text={item.ringText}
            href={item.href}
          />
        </div>
      ))}
      <img
        src="/assets/tree.svg"
        alt="tree"
        className="mt-28 w-[35%] z-0 relative"
      />
    </div>
  </div>
);

export default Tree;
