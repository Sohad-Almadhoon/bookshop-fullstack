import React from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";

const Questionare = () => {
  const occupations = ["Writer", "Reader", "Musician", "Visual Artist","Other"];
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
    "Art",
    "InkoMint",
    "ShortStory",
    "Fiction",
    "Other",
  ];

  return (
    <div className="min-h-screen ">
      <div className="border border-black p-2 min-h-screen ">
        <div className="border border-black p-5  ">
          <div className="flex flex-col px-12 items-center max-w-xl  mx-auto min-h-screen">
            <div className="flex-1 rounded-md  mt-5 shadow-md border-[#868073] bg-[#CFC5B0] p-5 w-full">
              <p className="capitalize font-semibold">
                Are you writer/reader/musician/visual artist or other?
              </p>
              {occupations.map((item) => (
                <div key={item} className="my-4 flex gap-2">
                  <CustomInput type="checkbox" />
                  <label>{item}</label>
                </div>
              ))}
              <CustomInput
                placeholder="enter your here..."
                className="max-w-xs w-full"
              />
            </div>
            <div className="flex-1 rounded-md p-2 mt-5 shadow-md border-[#868073] bg-[#CFC5B0]">
              <p className="capitalize font-semibold pl-5">
                What genre you interested in?
              </p>
              <div className="my-5 flex flex-row flex-wrap gap-3 px-5">
                {genres.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 shadow-md border-[#868073] border focus:border-[#868073] focus:border bg-transparent outline-none text-transparent focus:ring-offset-transparent focus:ring-transparent text-red checked:border checked:border-[#868073] rounded"
                    />
                    <label className="text-[#181818]">{item}</label>
                  </div>
                ))}
              </div>
              <CustomInput
                placeholder="enter your here..."
                className="max-w-xs w-full"
              />
            </div>
            <Button className="w-full max-w-[300px] my-5 "> REGISTER</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionare;
