import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/shared/Button";
import { useFormStore } from "../hooks/useFormStore";
import CustomInput from "../components/shared/CustomInput";
import newRequest from "../utils/newRequest";

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
  const { formData, updateFormData } = useFormStore();
  const [selectedOccupation, setSelectedOccupation] = useState<string>(
    ""
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleOccupationChange = (occupation: string) => {
    setSelectedOccupation(occupation); // Update to allow only one occupation
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    );
  };

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

    try {
      console.log(finalData);
      await newRequest.post("/api/auth/register", finalData); // Replace with your API endpoint
      navigate("/success");
    } catch (error) {
      console.error("Failed to submit data", error);
    }
  };

 return (
   <div className="min-h-screen">
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
                     type="radio" // Use radio for single selection
                     name="occupation"
                     value={occupation}
                     checked={selectedOccupation === occupation}
                     onChange={() => handleOccupationChange(occupation)}
                   />
                   <label className="text-xs">{occupation}</label>
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
                     type="checkbox" // Checkbox for multiple genres
                     value={genre}
                     checked={selectedGenres.includes(genre)}
                     onChange={() => handleGenreChange(genre)}
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
             onClick={handleSubmit}>
             SUBMIT
           </Button>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Questionnaire;
