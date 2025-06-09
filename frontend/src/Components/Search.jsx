/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Search from "../assets/Search.svg";
import cross from "../assets/cross.svg";

const SearchComponent = ({ onSearch, initialSearchTerm, initialGenres }) => {
  const [inputSearchTerm, setInputSearchTerm] = useState(initialSearchTerm);
  const [activeGenres, setActiveGenres] = useState(initialGenres || []);

  useEffect(() => {
    onSearch(inputSearchTerm, activeGenres);
  }, [activeGenres]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(inputSearchTerm, activeGenres);
  };

  const handleGenreClick = (genre) => {
    setActiveGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  return (
    <div className="searchdiv flex justify-center flex-col">
      <form
        onSubmit={handleSearch}
        className="sm:pt-[48px] pt-[24px] flex justify-center mx-[20px]"
      >
        <div className="w-full max-w-[387px] sm:h-[52px] px-3.5 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-center flex  h-[44px] focus-within:border-black">
          <img
            className="mr-[8px] sm:w-[32px] sm:h-[32px] w-[24px] h-[24px]"
            src={Search}
            alt=""
          />
          <div className="flex-grow">
            <input
              className="h-auto searchinput focus:outline-none w-full"
              type="text"
              placeholder="search popular books....."
              value={inputSearchTerm}
              onChange={(e) => setInputSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="ml-[8px] searchbutton w-[73px] sm:h-[52px] h-[44px] p-2.5 bg-black rounded-lg shadow justify-center items-center gap-2.5 inline-flex text-white"
        >
          Search
        </button>
      </form>

      <div className="sm:pt-[32px] pt-[24px] sm:px-[26px] justify-evenly flex categories sm:pb-[24px] pb-[16px]">
        {[
          "Science Based",
          "Mental Health",
          "New",
          "Best Seller",
          "Productivity",
          "Motivation",
          "Inspiring",
          "Trending",
          "Philosophy",
          "Human Behaviors",
        ].map((genre) => (
          <div
            key={genre}
            className={`cattext cursor-pointer transition-all duration-200 ${
              activeGenres.includes(genre)
                ? "bg-black text-white"
                : "hover:shadow-md"
            }`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
            {activeGenres.includes(genre) && (
              <img
                src={cross}
                alt="Remove"
                className="ml-2 w-4 h-4 invert"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenreClick(genre);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
