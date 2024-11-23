import React, { useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const tabs = [
    {
      title: "BOOKS",
      activeIcon: "/assets/blocks.svg",
      icon: "/assets/blocks-black.svg",
      total: 1,
    },
    {
      title: "Following",
      activeIcon: "/assets/collection-tab-icon3.svg",
      icon: "/assets/collection-tab-icon3.svg",
      total: 3,
    },
  ];
  return (
    <div className="p-2">
      <Header profile />
      <div className="px-24 border-black border">
        <ProfileInfo />
        <div>
          <ProfileActions tabs={tabs} tab={tab} setTab={setTab} />
          <BookGrid tab={tab} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
