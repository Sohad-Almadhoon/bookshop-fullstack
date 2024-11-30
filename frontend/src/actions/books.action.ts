import { BookFormData } from "../components/modals/CeateBook";
import newRequest from "../utils/newRequest";

export interface Book {
    id: string;
    title: string;
    author: string;
    [key: string]: any;
}

const fetchUserBooks = async (userId: string, token: string) => {
    try {
        const response = await newRequest.get(`/api/users/${userId}/books`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(
                error.response.data?.message || "Failed to fetch user's books."
            );
        } else if (error.request) {
            // No response received from the server
            throw new Error("No response from server. Please check the API.");
        } else {
            // Some other error occurred
            throw new Error(error.message || "Unexpected error occurred.");
        }
    }
};
const createBook = async (data: BookFormData) => {
    try {
        const response = await newRequest.post("/api/books", data);

        if (response.status !== 201) {
            throw new Error(response.data.message || "Failed to create book.");
        }

        return response.data as BookFormData;
    } catch (error: any) {
        throw new Error(
            error.message || "An error occurred while creating the book."
        );
    }
};
const fetchFollowingBooks = async (id: string, token: string) => {
    try {
        const response = await newRequest.get(`/api/users/${id}/followed-books`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch following books:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || "Error fetching following books");
    }
};
const createComment = () => {

}
export { fetchFollowingBooks, fetchUserBooks, createComment, createBook };
