import React, { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import slugify from "slugify";
import clock from "../assets/clock.svg";
import write from "../assets/write.svg";
import bin from "../assets/bin.svg";
import { useSelector } from "react-redux";

const limitChar = (str, limit) => {
  if (str.length <= limit) return str;
  return str.slice(0, limit) + "...";
};

const BlogCard = memo(({ blog, currentUser, onDelete }) => {
  console.log(currentUser);

  const navigate = useNavigate();
  const urlSlug = slugify(blog.bookName, { lower: true, strict: true });

  const handleCardClick = useCallback(() => {
    navigate(`/book-summary/${urlSlug}`);
  }, [navigate, urlSlug]);

  const handleDeleteClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onDelete(blog._id, blog.coverImage);
    },
    [blog._id, blog.coverImage, onDelete]
  );

  // Check if the user is an admin
  const isAdmin = currentUser?.user?.role === "admin";

  return (
    <div
      onClick={handleCardClick}
      className="my-[8px] sm:my-[16px] mx-[4px] sm:mx-[16px] w-[180px] sm:w-[250px] bg-white h-auto p-[12px] sm:p-[16px] flex flex-col rounded-lg shadow border border-gray-300 items-start justify-between relative cursor-pointer"
    >
      {currentUser && blog.isDraft && (
        <div className="absolute top-0 right-0">
          <div className="w-[60px] sm:w-[83px] h-8 sm:h-11 px-2 sm:px-6 py-1 sm:py-3 bg-orange-500 rounded-tl rounded-tr rounded-bl-xl rounded-br justify-center items-center gap-2.5 inline-flex ">
            <div className="text-white text-xs sm:text-sm font-semibold font-['Inter'] leading-tight">
              Draft
            </div>
          </div>
        </div>
      )}
      <div className="items-center flex flex-col w-full">
        <img
          src={blog.coverImage}
          alt="bookcover"
          className="w-[100px] sm:w-[170px] h-[130px] sm:h-[222px] object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-start justify-start w-full">
        <div className="text-[8px] sm:text-[10px] font-normal author truncate w-full">
          {blog.author}
        </div>
        <div className="title mt-[4px] text-sm sm:text-base font-medium w-full">
          {limitChar(blog.bookName, 55)}
        </div>
      </div>
      <div className="bookdescr text-xs sm:text-sm">
        {limitChar(blog.introduction, 55)}
      </div>
      <div className="time flex flex-row items-center justify-center text-xs sm:text-sm">
        <img
          src={clock}
          alt="clock"
          className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
        />
        <p className="pl-[4px]">{blog.readingTime} min</p>
      </div>
      {currentUser && isAdmin && ( // Conditionally render edit/delete for admins only
        <div className="w-full h-8 sm:h-11 justify-start items-start gap-2 sm:gap-3 inline-flex mt-[6px] sm:mt-[10px]">
          <Link
            to={`/edit/${urlSlug}`}
            className="grow shrink basis-0 h-full p-1 sm:p-2.5 bg-white rounded-lg border border-gray-300 justify-center items-center gap-1 sm:gap-2.5 flex"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={write} alt="write" className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="text-black text-xs sm:text-base font-medium font-['Inter'] leading-normal">
              Edit
            </div>
          </Link>
          <button
            onClick={handleDeleteClick}
            className="grow shrink basis-0 h-full p-1 sm:p-2.5 bg-red-50 rounded-lg shadow border border-red-300 justify-center items-center gap-1 sm:gap-2 flex"
          >
            <img src={bin} alt="bin" className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="text-red-700 text-xs sm:text-sm font-semibold font-['Inter'] leading-tight">
              Delete
            </div>
          </button>
        </div>
      )}
    </div>
  );
});

BlogCard.displayName = "BlogCard";

export default BlogCard;