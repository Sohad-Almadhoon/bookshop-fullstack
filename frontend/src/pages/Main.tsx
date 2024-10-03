import React from "react";
import Heading from "../components/Heading";
import Button from "../components/Button";

const Main = () => {
  return (
    <div>
      <div>
        <div>Menu Bar</div>
        <h1 className="text-6xl">BlockBook</h1>
        <Heading size="sm" className="" />
        <Button>login</Button>
        <Button>register</Button>
      </div>
      <div>
        <span>DISCOVER</span>
        <span>👇🏻</span>
      </div>
    </div>
  );
};

export default Main;
