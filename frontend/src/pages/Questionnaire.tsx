import React, { useState } from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import { useNavigate } from "react-router-dom";

const occupations = ["Writer", "Reader", "Musician", "Visual Artist", "Other"];
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
  "Other",
];

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setCheckedItems((prevCheckedItems) =>
      prevCheckedItems.includes(value)
        ? prevCheckedItems.filter((item) => item !== value) // Remove if unchecked
        : [...prevCheckedItems, value] // Add if checked
    );
  };

  console.log(checkedItems); // Updated list of checked items

  return (
    <div className="min-h-screen ">
      <div className="border border-black p-2 min-h-screen font-baskervville">
        <div className="border border-black p-5">
          <div className="flex flex-col items-center px-12 max-w-xl mx-auto min-h-screen">
            {/* Occupations Section */}
            <div className="flex-1 mt-5 p-5 w-full bg-[#CFC5B0] border-[#868073] rounded-md shadow-md">
              <p className="capitalize font-bold text-sm">
                Are you a writer, reader, musician, visual artist, or other?
              </p>
              <div className="mt-4 space-y-4">
                {occupations.map((occupation) => (
                  <div key={occupation} className="flex items-center gap-2">
                    <CustomInput
                      type="checkbox"
                      className="custom-checkbox"
                      onChange={() => handleCheckboxChange(occupation)}
                    />
                    <label className="text-xs">
                      {occupation}
                    </label>
                  </div>
                ))}
              </div>
              <CustomInput
                placeholder="Enter your answer here..."
                className="mt-4 w-full max-w-xs"
              />
            </div>

            {/* Genres Section */}
            <div className="flex-1 mt-5 p-5 w-full bg-[#CFC5B0] border-[#868073] rounded-md shadow-md">
              <p className="capitalize font-semibold text-sm">
                What genre are you interested in?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center gap-2">
                    <CustomInput
                      type="checkbox"
                      className="custom-checkbox"
                      onChange={() => handleCheckboxChange(genre)}
                    />
                    <label className="text-xs">{genre}</label>
                  </div>
                ))}
              </div>
              <CustomInput
                placeholder="Enter your answer here..."
                className="mt-4 w-full max-w-xs"
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full max-w-[300px] mt-5"
              onClick={() => navigate("/register")}>
              REGISTER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Questionnaire;