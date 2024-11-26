import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect, useNavigate } from "react-router-dom";
import CustomInput from "../shared/CustomInput";
import Button from "../shared/Button";
import Header from "../shared/Header";
import { createBook } from "../../actions/books.action";

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
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    generes: [],
    main_cover: "",
  });
  const mutation = useMutation<BookFormData, Error, BookFormData>({
    mutationFn: createBook,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
      navigate(`/books/${data.book.id}`);
    },
    onError: (error: any) => {
      console.error("Error creating book:", error.message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlegeneresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const generesArray = value.split(",").map((genre) => genre.trim());
    setFormData((prev) => ({ ...prev, generes: generesArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div>
      <Header profile />
      <div className="bg-[#DDD1BB] flex flex-col mx-auto max-w-xl w-full rounded-lg p-6 mt-5 shadow-xl border-black border">
        <h2 className="text-4xl font-bold mb-4 uppercase text-center font-voyage">
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
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter the book description"
              className="p-3 bg-transparent border-black border-opacity-30 w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="generes">
              generes (comma-separated)
            </label>
            <CustomInput
              id="generes"
              name="generes"
              className="border w-full p-2 rounded"
              value={formData.generes.join(", ")}
              onChange={handlegeneresChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="main_cover">
              Main Cover URL
            </label>
            <CustomInput
              id="main_cover"
              name="main_cover"
              className="border w-full p-2 rounded"
              value={formData.main_cover}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
            <Button
              type="button"
              onClick={() => redirect("/tree")}
              variant="outline"
              className="border-none">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookPage;
