import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query';
import Button from "../components/shared/Button";
import { useFormStore } from "../hooks/useFormStore";
import CustomInput from "../components/shared/CustomInput";
import newRequest from "../utils/newRequest";
import toast from "react-hot-toast";

const occupations = ["Writer", "Reader", "Musician", "Visual Artist"];
const genres = [
  "Fiction",
  "PublicDomain",
  "Sci-fi",
  "Novel",
  "Drama",
  "Fantasy",
  "Thriller",
  "Horror",
  "Poetry",
  "Art",
  "Comedy",
  "InkoMint",
  "ShortStory",
];

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormStore();
  const [selectedOccupation, setSelectedOccupation] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleOccupationChange = (occupation: string) => {
    setSelectedOccupation(occupation);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    );
  };

  const mutation = useMutation({
    mutationFn: async (finalData: { role: string; generes: string[] }) => {
      await newRequest.post("/api/auth/register", finalData);
    },
    onSuccess: () => {
      toast.success("Account created successfully. Please login to continue.");
      navigate("/login");
    },
    onError: (error:any) => {
      const errorMessage =
        error.response?.data?.error === "User already exists with this email"
          ? "User already exists with this email. Please login."
          : error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async () => {
    updateFormData({
      role: selectedOccupation,
      generes: selectedGenres,
    });
    const finalData = {
      ...formData,
      role: selectedOccupation,
      generes: selectedGenres,
    };

    mutation.mutate(finalData);
  };

  return (
    <div className="min-h-screen">
      <div className="border border-black p-2 min-h-screen font-baskervville">
        <div className="border border-black p-5">
          <div className="flex flex-col items-center px-12 max-w-xl mx-auto min-h-screen">
            {/* Occupations Section */}
            <div className="flex-1 mt-5 p-5 w-full bg-[#CFC5B0] border-[#868073] rounded-md shadow-md">
              <p className="capitalize font-bold text-lg">
                Are you a writer, reader, musician, visual artist, or other?
              </p>
              <div className="mt-4 space-y-4">
                {occupations.map((occupation) => (
                  <div key={occupation} className="flex items-center gap-2">
                    <CustomInput
                      type="radio"
                      name="occupation"
                      value={occupation}
                      checked={selectedOccupation === occupation}
                      onChange={() => handleOccupationChange(occupation)}
                    />
                    <label className="text-sm">{occupation}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Genres Section */}
            <div className="flex-1 mt-5 p-5 w-full bg-[#CFC5B0] border-[#868073] rounded-md shadow-md">
              <p className="capitalize font-semibold text-lg">
                What genre are you interested in?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center gap-2">
                    <CustomInput
                      type="checkbox" 
                      value={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                    />
                    <label className="text-sm">{genre}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full max-w-[300px] mt-5"
              onClick={handleSubmit}
              disabled={mutation.isPending} 
            >
              {mutation.isPending ? "Submitting..." : "SUBMIT"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
