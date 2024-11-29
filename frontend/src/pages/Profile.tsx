import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import {
  Book,
  fetchFollowingBooks,
  fetchUserBooks,
} from "../actions/books.action";
import { useLocation } from "react-router-dom";

interface DecodedToken {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

const Profile: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [userId, setUserId] = useState<string>(localStorage.getItem("token")!);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const id = location.state?.userId;


  const { data: books = [], isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ["userBooks", userId],
    queryFn: () => fetchUserBooks(userId, token!),
    enabled: !!userId,
  });

  const { data: followingBooks = [], isLoading: isLoadingFollowingBooks } =
    useQuery<Book[]>({
      queryKey: ["followingBooks", userId],
      queryFn: () => fetchFollowingBooks(userId),
      enabled: !!userId,
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
    <div className="p-2">
      <Header  />
      <div className="px-24 border-black border">
        {userId && <ProfileInfo id={id ? id : userId} />}
        <div>
          <ProfileActions tabs={tabs} tab={tab} setTab={setTab} />
          {tab === 0 ? (
            <BookGrid tab={tab} books={books} />
          ) : (
            <BookGrid tab={tab} books={followingBooks} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
