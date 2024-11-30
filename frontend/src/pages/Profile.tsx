import React, { useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import {
  Book,
  fetchFollowingBooks,
  fetchUserBooks,
} from "../actions/books.action";
import { useLocation } from "react-router-dom";
import { getUser } from "../utils/helpers";

const Profile: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const currentUser = getUser();
  const { user } = currentUser;
  const location = useLocation();
  const id = location.state?.userId;

  const { data: books = [], isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ["userBooks", user.id],
    queryFn: () => fetchUserBooks(user.id, currentUser.token!),
    enabled: !!user.id,
  });

  const { data: followingBooks = [], isLoading: isLoadingFollowingBooks } =
    useQuery<Book[]>({
      queryKey: ["followingBooks", user.id],
      queryFn: () => fetchFollowingBooks(user.id, currentUser.token!),
      enabled: !!user.id,
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

  return (
    <div className="p-2 flex flex-col min-h-screen">
      <Header />
      <div className="px-24 border-black border flex-1">
        {user.id && <ProfileInfo id={id ? id : user.id} />}
        <div className="flex-1">
          <ProfileActions tabs={tabs} tab={tab} setTab={setTab} />
          <BookGrid tab={tab} books={tab === 0 ? books : followingBooks} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
