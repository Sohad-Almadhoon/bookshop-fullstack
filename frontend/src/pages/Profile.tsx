import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";
import newRequest from "../utils/newRequest";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface DecodedToken {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [books, setBooks] = useState<any[]>([]); // State to store fetched books
  const [followingBooks, setFollowingBooks] = useState<any[]>([]); // State for books of followed users
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [userId, setUserId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Decode the token and set user ID
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserId(decodedToken.id);
      } catch (decodeError) {
        console.error("Invalid token format:", decodeError);
        setError("Failed to decode token.");
      }
    }
  }, [token]);

  // Tab configuration
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

  // Fetch books based on the selected tab
  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId || !token) return;

      setLoading(true);
      setError(null); // Reset error state

      try {
        if (tab === 0) {
          // Fetch user's own books
          const response = await newRequest.get(`/api/users/${userId}/books`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBooks(response.data);
        } else if (tab === 1) {
          // Fetch books from followed users
          const response = await newRequest.get(`/api/users/following/books`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFollowingBooks(response.data);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error fetching books:",
            err.response?.data?.message || err.message
          );
          setError(err.response?.data?.message || "Failed to fetch books.");
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [tab, token, userId]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

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
