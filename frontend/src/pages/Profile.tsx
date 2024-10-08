import React from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";


const Profile: React.FC = () => {
  return (
    <div className="p-2">

      <Header profile />
      <div className="px-12 border-black border">
        <ProfileInfo />
        <div>
          <ProfileActions />
          <BookGrid />
        </div>
      </div>
    </div>
  );
};

export default Profile;
