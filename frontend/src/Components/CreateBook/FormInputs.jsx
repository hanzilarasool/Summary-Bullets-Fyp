/* eslint-disable react/prop-types */
import  { useRef, useEffect } from 'react';
import Multiselect from './Multiselect';

const categories = [
  "Business & Entrepreneurship",
  "Economics & Finance",
  "Personal Development & Success",
  "Science & Technology",
  "Society, Culture & Politics",
  "Psychology & Human Behavior",
  "Health & Well-being",
  "Relationships & Family",
  "Education & Learning"
];

const FormInputs = ({ formData, onChange }) => {
  const introTextRef = useRef(null);

  useEffect(() => {
    if (introTextRef.current) {
      introTextRef.current.style.height = 'auto';
      introTextRef.current.style.height = introTextRef.current.scrollHeight + 'px';
    }
  }, [formData.introduction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleGenreChange = (e) => {
    const genres = e.target.value.split(",").map((genre) => genre.trim());
    onChange('genres', genres);
  };

  const handleCategoryChange = (selectedCategories) => {
    onChange('categories', selectedCategories);
  };

  return (
    <>
      <div className="self-stretch h-[92px] flex-col justify-start items-start gap-3 flex">
        <label className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
          Post Title
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
          placeholder="Enter post title"
        />
      </div>

      <div className="self-stretch justify-start items-start gap-4 flex flex-col md:flex-row">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
          <label className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
            Author Name
          </label>
          <input
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
            placeholder="Enter author name"
          />
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
          <label className="text-black text-base font-medium font-['Inter'] leading-normal">
            Book Name
          </label>
          <input
            name="bookName"
            value={formData.bookName}
            onChange={handleInputChange}
            className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
            placeholder="Enter book name"
          />
        </div>
      </div>

      <div className="self-stretch h-[106px] flex-col justify-start items-start gap-3 flex">
        <label className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
          Add Genres
        </label>
        <input
          name="genres"
          value={formData.genres.join(", ")}
          onChange={handleGenreChange}
          className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
          placeholder="Enter genres separated by commas"
        />
      </div>

      <div className="self-stretch h-auto flex-col justify-start items-start gap-3 flex">
        <label className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
          Categories (Select up to 3)
        </label>
        <Multiselect
          options={categories}
          selected={formData.categories}
          onChange={handleCategoryChange}
          maxSelected={3}
        />
      </div>
      
      <div className="self-stretch h-[92px] flex-col justify-start items-start gap-3 flex">
        <label className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
          Amazon Link
        </label>
        <input
          name="amazonLink"
          value={formData.amazonLink}
          onChange={handleInputChange}
          className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
          placeholder="Enter Amazon link"
        />
      </div>

      <div className="self-stretch h-auto flex-col justify-start items-start gap-3 flex">
        <label className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
          Intro Paragraph
        </label>
        <textarea
          ref={introTextRef}
          name="introduction"
          value={formData.introduction}
          onChange={handleInputChange}
          className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black resize-none overflow-hidden"
          placeholder="Enter introduction text"
        />
      </div>
    </>
  );
};

export default FormInputs;