import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import BookGrid from "../components/profile/BookGrid";
import Header from "../components/shared/Header";
import newRequest from "../utils/newRequest";
import { jwtDecode } from "jwt-decode";

const Profile: React.FC = () => {
  interface DecodedToken {
    id: string; // Replace with actual fields in your JWT
    email?: string;
    iat?: number;
    exp?: number;
  }

  const [tab, setTab] = useState(0);
  const [books, setBooks] = useState<any[]>([]); // State to store fetched books
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const token = localStorage.getItem("token");
  let decodedToken: DecodedToken | null = null;
  let userId: string | null = null;

  if (token) {
    decodedToken = jwtDecode<DecodedToken>(token);
    userId = decodedToken.id;
  }
  console.log("Decoded User ID:", token);

  // Tab configuration
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

  useEffect(() => {
    if (token) {
   const fetchUserBooks = async () => {
     try {
       const response = await newRequest.get(`/api/users/${userId}/books`, {
         headers: { Authorization: `Bearer ${token}` },
       });
       console.log(response.data); // Log the response data
       if (response.data.length === 0) {
         setError("No books found");
       } else {
         setBooks(response.data); // If data is found, update the state
       }
       setLoading(false);
     } catch (error) {
       setError("Error fetching user books");
       console.error("Error fetching user books:", error);
       setLoading(false);
     }
   };


      fetchUserBooks();
    } else {
      setLoading(false);
    }
  }, [token , userId]); 

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton UI
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div className="p-2">
      <Header profile />
      <div className="px-24 border-black border">
        <ProfileInfo id={userId!} />
        <div>
          <ProfileActions tabs={tabs} tab={tab} setTab={setTab} />
          <BookGrid tab={tab} books={books} /> {/* Pass books to BookGrid */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
