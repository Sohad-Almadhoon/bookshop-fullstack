import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";
import { createBook } from "../actions/books.action";
import FileUploader from "../components/modals/components/FileUploader";
import uploadFile from "../utils/upload";
import Loader from "../components/shared/Loader";

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  generes: string[];
  main_cover: string;
}

const CreateBookPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [genresInput, setGenresInput] = useState("");
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    generes: [],
    main_cover: "",
  });

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
      toast.success("Book created successfully!");
      navigate(`/books/${data.book.id}`);
    },
    onError: (error: Error) => toast.error(error.message || "Error creating book"),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, "image"),
    onSuccess: (url) => {
      setFormData((prev) => ({ ...prev, main_cover: url }));
      toast.success("Cover uploaded!");
    },
    onError: (error: Error) => toast.error(error.message || "Could not upload the cover"),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setGenresInput(value);
    setFormData((prev) => ({
      ...prev,
      generes: value
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean),
    }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No file selected!");
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    uploadMutation.mutate(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return toast.error("Please add a description.");
    if (formData.generes.length === 0) return toast.error("Please add at least one genre.");
    if (!formData.main_cover) return toast.error("Please upload a cover image.");
    mutation.mutate(formData);
  };

  return (
    <div className="px-3 sm:px-4 pb-6">
      <Header />
      <div className="bg-[#DDD1BB] flex flex-col mx-auto max-w-xl w-full rounded-lg p-4 sm:p-6 mt-5 shadow-xl border-black border">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 uppercase text-center font-voyage">
          Create a New Book
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <CustomInput
              id="title"
              name="title"
              className="border w-full p-2 rounded"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={120}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="author">
              Author
            </label>
            <CustomInput
              id="author"
              name="author"
              className="border w-full p-2 rounded"
              value={formData.author}
              onChange={handleInputChange}
              maxLength={120}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={2000}
              placeholder="Enter the book description"
              className="p-3 bg-transparent border-black border-opacity-30 w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="generes">
              Genres (comma-separated)
            </label>
            <CustomInput
              id="generes"
              name="generes"
              className="border w-full p-2 rounded"
              value={genresInput}
              onChange={handleGenresChange}
              placeholder="Fiction, Drama"
              required
            />
          </div>
          <div className="mb-4">
            <span className="block text-sm font-medium mb-1">Main Cover</span>
            {/* Pasting a raw URL was the only way to set a cover before. */}
            {uploadMutation.isPending ? (
              <Loader />
            ) : (
              <FileUploader
                type="visual"
                file={formData.main_cover}
                setFile={(value) => setFormData((prev) => ({ ...prev, main_cover: value }))}
                onFileChange={handleCoverChange}
                label="Click to upload"
                accept="image/*"
                description="PNG, JPG, or WEBP (max 5MB)"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={mutation.isPending || uploadMutation.isPending}
              className="w-fit">
              {mutation.isPending ? "Creating..." : "Create Book"}
            </Button>
            {/* redirect() from react-router only works inside loaders/actions,
                so this button used to do nothing at all. */}
            <Button
              type="button"
              onClick={() => navigate("/tree")}
              variant="outline"
              className="border-none w-fit">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookPage;
