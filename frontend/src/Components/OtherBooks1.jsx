
const OtherBooks1 = ({ books }) => {
  const limitChar = (str, limit) => {
    return str.length > limit ? str.substring(0, limit) + '...' : str;
  };

  return (
    <div className="mt-12 max-w-[350px]">
      <h2 className="text-[#344053] text-2xl font-bold font-['Inter'] leading-loose mb-6">
        You may also like these books
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => window.location.href = `/book-summary/${book.urlSlug}`}
            className="h-[312px] flex flex-col justify-start items-start gap-3 cursor-pointer w-[159.84px] mb-4"
          >
            <img
              src={book.coverImage}
              alt={book.bookName}
              className="h-[244px] shadow transition-shadow duration-300 ease-in-out hover:shadow-lg"
            />
            <div className="self-stretch h-14 flex flex-col justify-center items-start gap-1">
              <div className="text-[#667084] text-[12px] font-normal font-['Inter']">
                {book.author}
              </div>
              <div className="self-stretch text-black text-sm text-wrap font-semibold font-['Inter'] leading-tight">
                {limitChar(book.bookName, 40)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherBooks1;
