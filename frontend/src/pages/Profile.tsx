import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  [key: string]: any; // Extendable for other properties
}

const fetchUserBooks = async (
  userId: string,
  token: string
): Promise<Book[]> => {
  const response = await fetch(`/api/users/${userId}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user's books.");
  }

  return response.json();
};

const fetchFollowingBooks = async (token: string): Promise<Book[]> => {
  const response = await fetch(`/api/users/following/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch following books.");
  }

  return response.json();
};

const Profile: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Decode the token and set the user ID
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserId(decodedToken.id);
      } catch (decodeError) {
        console.error("Invalid token format:", decodeError);
      }
    }
  }, [token]);

  const {
    data: books = [],
    isLoading: isLoadingBooks,
    error: errorBooks,
  } = useQuery<Book[], Error>({
    queryKey: ["userBooks", userId, token],
    queryFn: () => fetchUserBooks(userId!, token!),
    enabled: !!userId && tab === 0,
  });

  const {
    data: followingBooks = [],
    isLoading: isLoadingFollowingBooks,
    error: errorFollowingBooks,
  } = useQuery<Book[], Error>({
    queryKey: ["followingBooks", token],
    queryFn: () => fetchFollowingBooks(token!),
    enabled: !!token && tab === 1,
  });

  // Error message helper
  const getErrorMessage = (error: Error | null | undefined): string =>
    error?.message || "An unexpected error occurred.";

  // Loading state
  if (isLoadingBooks || isLoadingFollowingBooks) {
    return <div>Loading...</div>;
  }

  // Error state
  if (errorBooks || errorFollowingBooks) {
    return (
      <div>
        Error:{" "}
        {getErrorMessage(errorBooks) || getErrorMessage(errorFollowingBooks)}
      </div>
    );
  }

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
      <Header profile />
      <div className="px-24 border-black border">
        <ProfileInfo id={userId!} />
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
