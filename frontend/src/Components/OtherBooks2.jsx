import React from 'react';

const OtherBooks2 = ({ books }) => {
  const limitChar = (str, limit) => {
    return str.length > limit ? str.substring(0, limit) + '...' : str;
  };

  return (
    <div className="mt-12">
      <h2 className="text-[#344053] text-2xl font-bold font-['Inter'] leading-loose mb-6 text-center">
        You may also like these books
      </h2>
      <div className="flex justify-center overflow-x-auto">
        <div className="flex space-x-8 sm:space-x-12">
          {books.map((book) => (
            <div
              key={book._id}
              onClick={() => window.location.href = `/book-summary/${book.urlSlug}`}
              className="flex-none w-[159.84px] mb-4 cursor-pointer"
            >
              <img
                src={book.coverImage}
                alt={book.bookName}
                className="h-[244px] shadow transition-shadow duration-300 ease-in-out hover:shadow-lg w-full"
              />
              <div className="h-14 flex flex-col justify-center items-start gap-1 mt-2">
                <div className="text-[#667084] text-[12px] font-normal font-['Inter']">
                  {book.author}
                </div>
                <div className="text-black text-sm text-wrap font-semibold font-['Inter'] leading-tight">
                  {limitChar(book.bookName, 40)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherBooks2;
