import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../components/shared/Button";
import { useFormStore } from "../hooks/useFormStore";
import CustomInput from "../components/shared/CustomInput";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import { setSession, Session } from "../utils/session";

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
  const { formData, resetFormData } = useFormStore();
  const [selectedOccupation, setSelectedOccupation] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const hasAccountDetails = Boolean(formData.name && formData.email && formData.password);

  // The store lives in memory only, so a refresh here would post an incomplete
  // payload and fail with a confusing validation error.
  useEffect(() => {
    if (!hasAccountDetails) {
      toast.error("Please fill in your account details first.");
      navigate("/register", { replace: true });
    }
  }, [hasAccountDetails, navigate]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
  };

  const mutation = useMutation<Session, Error, void>({
    mutationFn: async () => {
      const response = await newRequest.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedOccupation,
        generes: selectedGenres,
      });
      return response.data as Session;
    },
    onSuccess: (session) => {
      // The API signs the user in directly - no second login round trip.
      setSession(session);
      resetFormData();
      toast.success("Account created successfully. Welcome!");
      navigate("/welcome", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create your account."));
    },
  });

  const handleSubmit = () => {
    if (!selectedOccupation) {
      toast.error("Please choose what describes you best.");
      return;
    }
    if (selectedGenres.length === 0) {
      toast.error("Please pick at least one genre.");
      return;
    }
    mutation.mutate();
  };

  if (!hasAccountDetails) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border border-black p-2 flex-1 flex font-baskervville">
        <div className="border border-black p-3 sm:p-5 flex-1">
          <div className="flex flex-col items-center px-2 sm:px-12 max-w-xl mx-auto w-full">
            {/* Occupations Section */}
            <div className="flex-1 mt-5 p-5 w-full bg-[#CFC5B0] border-[#868073] rounded-md shadow-md">
              <p className="capitalize font-bold text-lg">
                Are you a writer, reader, musician, visual artist, or other?
              </p>
              <div className="mt-4 space-y-4">
                {occupations.map((occupation) => (
                  <label key={occupation} className="flex items-center gap-2 cursor-pointer">
                    <CustomInput
                      type="radio"
                      name="occupation"
                      value={occupation}
                      checked={selectedOccupation === occupation}
                      onChange={() => setSelectedOccupation(occupation)}
                    />
                    <span className="text-sm">{occupation}</span>
                  </label>
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
                  <label key={genre} className="flex items-center gap-2 cursor-pointer">
                    <CustomInput
                      type="checkbox"
                      value={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="button"
              className="w-full max-w-[300px] mt-5"
              onClick={handleSubmit}
              disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "SUBMIT"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
