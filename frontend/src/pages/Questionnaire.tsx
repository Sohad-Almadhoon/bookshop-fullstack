import React from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";

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
  return (
    <div className="min-h-screen">
      <div className="border border-black p-2 min-h-screen">
        <div className="border border-black p-5">
          <div className="flex flex-col items-center px-12 max-w-xl mx-auto min-h-screen">
            {/* Occupations Section */}
            <div className="flex-1 mt-5 p-5 w-full bg-[#CFC5B0] border-[#868073] rounded-md shadow-md">
              <p className="capitalize font-semibold">
                Are you a writer, reader, musician, visual artist, or other?
              </p>
              <div className="mt-4 space-y-4">
                {occupations.map((occupation) => (
                  <div key={occupation} className="flex items-center gap-2">
                    <CustomInput
                      type="checkbox"
                      className="h-5 w-5 text-black border-[#868073] cursor-pointer rounded shadow-md checked:bg-white"
                    />
                    <label>{occupation}</label>
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
              <p className="capitalize font-semibold">
                What genre are you interested in?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center gap-2">
                    <CustomInput
                      type="checkbox"
                      className="h-5 w-5 appearance-none border-2 border-black bg-transparent cursor-pointer rounded focus:ring-0 checked:border-black relative"
                    />

                    <label>{genre}</label>
                  </div>
                ))}
              </div>
              <CustomInput
                placeholder="Enter your answer here..."
                className="mt-4 w-full max-w-xs"
              />
            </div>

            {/* Register Button */}
            <Button className="w-full max-w-[300px] mt-5">REGISTER</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
