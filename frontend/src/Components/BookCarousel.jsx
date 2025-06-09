import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import BlogCard from "./BlogCard";

const BookCarousel = ({ books, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + books.length) % books.length
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (books.length === 0) return null;

  const getVisibleBooks = () => {
    return [-1, 0, 1].map((offset) => {
      const index = (currentIndex + offset + books.length) % books.length;
      return { ...books[index], offset };
    });
  };

  const limitChar = (str, limit) => {
    return str.length > limit ? str.substring(0, limit) + "..." : str;
  };

  return (
    <div className="mt-8 relative" {...handlers}>
      <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
      <div className="overflow-hidden">
        <div className="flex justify-center items-center relative h-[350px]">
          {getVisibleBooks().map((book, index) => {
            const isActive = book.offset === 0;
            return (
              <div
                key={`${book._id}-${index}`}
                className="absolute cursor-pointer"
                style={{
                  transform: `
                    translateX(${book.offset * 100}%)
                    scale(${isActive ? 1 : 0.8})
                    rotateY(${book.offset * -20}deg)
                  `,
                  zIndex: isActive ? 10 : 5,
                  opacity: Math.abs(book.offset) > 1 ? 0 : 1,
                  transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
                }}
                onClick={() => {
                  if (isActive) {
                    window.location.href = `/book-summary/${book.urlSlug}`;
                  } else {
                    book.offset < 0 ? prevSlide() : nextSlide();
                  }
                }}
              >
                <BlogCard blog={book} limitChar={limitChar} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookCarousel;
