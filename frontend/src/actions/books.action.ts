import { BookFormData } from "../pages/CeateBook";
import newRequest, { getErrorMessage } from "../utils/newRequest";

export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    main_cover?: string;
    generes?: string[];
    created_at?: string;
}

/** Rows returned by /users/:id/books - the book sits under `.book`. */
export interface UserBookRow {
    id: number;
    created_at: string;
    book: Book;
}

const fetchUserBooks = async (userId: number | string): Promise<UserBookRow[]> => {
    try {
        const response = await newRequest.get(`/api/users/${userId}/books`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to fetch user's books."));
    }
};

const fetchFollowingBooks = async (userId: number | string): Promise<UserBookRow[]> => {
    try {
        const response = await newRequest.get(`/api/users/${userId}/followed-books`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw new Error(getErrorMessage(error, "Error fetching following books."));
    }
};

const createBook = async (data: BookFormData) => {
    try {
        const response = await newRequest.post("/api/books", data);
        return response.data as { book: Book; conversation: { id: number } };
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the book."));
    }
};

export { fetchFollowingBooks, fetchUserBooks, createBook };
