import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";
import {
  fetchFollowingBooks,
  fetchUserBooks,
  UserBookRow,
} from "../actions/books.action";
import { getCurrentUser } from "../utils/session";
import Loader from "../components/shared/Loader";

const Profile: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const location = useLocation();
  const currentUser = getCurrentUser();

  // Opening someone else's profile used to show their name with YOUR books,
  // because every query was hard-coded to the logged-in user's id.
  const profileId = (location.state as { userId?: number })?.userId ?? currentUser?.id;
  const isOwnProfile = profileId === currentUser?.id;

  const { data: books = [], isLoading: isLoadingBooks } = useQuery<UserBookRow[]>({
    queryKey: ["userBooks", profileId],
    queryFn: () => fetchUserBooks(profileId!),
    enabled: Boolean(profileId),
  });

  const { data: followingBooks = [], isLoading: isLoadingFollowingBooks } = useQuery<
    UserBookRow[]
  >({
    queryKey: ["followingBooks", profileId],
    queryFn: () => fetchFollowingBooks(profileId!),
    enabled: Boolean(profileId),
  });

  const tabs = [
    {
      title: "BOOKS",
      activeIcon: "/assets/blocks.svg",
      icon: "/assets/blocks-black.svg",
      total: books.length,
    },
    {
      title: "Following",
      activeIcon: "/assets/collection-tab-icon3.svg",
      icon: "/assets/collection-tab-icon3.svg",
      total: followingBooks.length,
    },
  ];

  const isLoading = isLoadingBooks || isLoadingFollowingBooks;

  return (
    <div className="p-2 flex flex-col min-h-screen">
      <Header />
      <div className="p-3 sm:p-6 lg:px-24 border-black border flex-1">
        {profileId && <ProfileInfo id={profileId} />}
        <div className="flex-1">
          <ProfileActions tabs={tabs} tab={tab} setTab={setTab} />
          {isLoading ? (
            <Loader />
          ) : (
            <BookGrid
              tab={tab}
              books={tab === 0 ? books : followingBooks}
              isOwnProfile={isOwnProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
