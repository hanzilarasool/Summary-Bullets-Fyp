

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import amazon from "../assets/amazon.svg";
import { FaChevronRight, FaRegClock } from "react-icons/fa6";
import config from "../config";
import PDFdownload from "../Components/PDFdownload";
import AudioPlayer from "../Components/AudioPlayer";
import ShowBook from "./ShowBook";
import OtherBooks1 from "../Components/OtherBooks1";
import BookCarousel from "../Components/BookCarousel";
import OtherBooks2 from "../Components/OtherBooks2";
import SEO from "../Components/SEO";
import TableOfContents from "../Components/TableOfContents";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Book = () => {
  const [blogData, setBlogData] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { urlSlug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/v1/getblog/${urlSlug}`);
        const data = await response.json();
        console.log(data);
        if (!data || !data.content) {
          navigate("/NotFound");
          return;
        }
        setBlogData(data);

        const booksResponse = await fetch(
          `${config.API_URL}/api/v1/related-books/${data.categories[0]}?exclude=${urlSlug}`
        );
        const booksData = await booksResponse.json();
        setRecommendedBooks(booksData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [urlSlug, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-7 border-t-transparent border-gray-400 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  const parsedContent = JSON.parse(blogData.content);
  const firstHalfBooks = recommendedBooks.slice(0, 4);
  const secondHalfBooks = recommendedBooks.slice(4, 9);
const handlePDFDownload = async (generatePDF) => {
  if (!currentUser) {
    toast.info("Please log in to download PDF.", {
      onClose: () => navigate("/login"),
    });
    return;
  }

  try {
    const userId = currentUser.user._id;
    console.log("Fetching user data for userId:", userId); // Debug log
    const response = await fetch(`${config.API_URL}/api/v1/user/${userId}`, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    console.log("User data received:", userData); // Debug log

    const planLimits = {
      free: 0,
      basic: 20,
      standard: 50,
      premium: Infinity,
    };
    const plan = userData.plan?.toLowerCase(); // Convert plan to lowercase
    const limit = planLimits[plan] || 0; // Use the lowercase plan
    const downloadsUsed = userData.subscription?.pdfDownloadsUsed || 0; // Handle undefined
    const downloadHistory = userData.subscription?.downloadHistory || [];

    console.log("Plan:", userData.plan, "Normalized Plan:", plan, "Limit:", limit, "Downloads Used:", downloadsUsed); // Updated debug log

    if (downloadsUsed >= limit && limit !== Infinity) {
      console.log("Limit exceeded condition triggered"); // Debug log
      toast.error("You have exceeded your PDF download limit for this plan.");
      return;
    }

    // Check if this book was already downloaded
    const bookId = blogData._id; // Assuming blog has an _id
    console.log("Book ID:", bookId, "Download History:", downloadHistory); // Debug log
    if (!downloadHistory.includes(bookId)) {
      console.log("Updating download count for new book"); // Debug log
      await fetch(`${config.API_URL}/api/v1/update-pdf-download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ userId, bookId }),
      });
    }

    // Generate and download PDF
    await generatePDF();
    toast.success("PDF downloaded successfully!");
  } catch (error) {
    console.error("PDF download error:", error);
    toast.error("Failed to process PDF download: " + error.message);
  }
};
  return (
    <div>
      {blogData && <SEO blogData={blogData} />}
      <div className="flex flex-col sm:flex-row sm:pt-[48px] pt-[24px] sm:px-[90px] px-[16px] bg-gray-50 bookShadow sm:pb-[30px] pb-[30px]">
        <div className="flex-grow sm:mr-[24px] mt-6 sm:mt-0 order-2 sm:order-1">
          <div className="flex-col justify-start items-start gap-6 flex mt-[14px]">
            <div className="w-full justify-between items-start inline-flex">
              <div className="text-slate-700 text-lg font-semibold font-['Inter']">
                SUMMARY
              </div>
              <div className="justify-start items-center gap-1 flex">
                <FaRegClock className="w-3.5 h-3.5 text-slate-700" />
                <div className="text-slate-700 text-xs font-normal font-['Inter'] leading-[18px]">
                  {blogData.readingTime} minutes
                </div>
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-2 flex">
              <div
                className="text-slate-800 text-2xl sm:text-[40px] font-semibold font-['Inter']"
                style={{ lineHeight: "1.5" }}
              >
                {blogData.bookName}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 text-base font-normal font-['Inter']">
                    by
                  </div>
                  <div className="text-slate-700 text-base font-normal font-['Inter']">
                    {blogData.author}
                  </div>
                </div>
                {blogData.genres &&
                  blogData.genres.map((genre, index) => (
                    <div
                      key={index}
                      className="px-4 py-2.5 bg-white rounded-3xl shadow border border-gray-300 flex items-center"
                    >
                      <div className="text-black text-xs font-normal font-['Inter'] leading-[18px]">
                        {genre}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="text-slate-600 text-base font-normal font-['Inter'] leading-normal">
              {blogData.introduction}
            </div>
          </div>
        </div>

        <div className="sm:flex-shrink-0 order-1 sm:order-2 flex justify-center sm:justify-start">
          <div className="flex flex-col items-center items-end">
            <div className="flex mb-5">
              <PDFdownload
                bookName={blogData.bookName}
                content={blogData.content}
                onDownload={handlePDFDownload}
              />
              {blogData && <AudioPlayer bookName={blogData.bookName} content={blogData.content} />}
            </div>
            <img
              src={blogData.coverImage}
              alt="bookcover"
              className="w-[195px] h-[297.67px] sm:w-[262.03px] sm:h-[400px] object-cover shadow"
            />
            {blogData.amazonLink && (
              <a
                href={blogData.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[270px] py-[10px] px-[16px] mt-[24px] bg-white rounded-lg shadow border border-gray-300 justify-start items-center inline-flex"
              >
                <img src={amazon} alt="amazon" className="w-6 h-6" />
                <div className="text-slate-700 mx-[8px] text-xs sm:text-base font-medium font-['Inter'] whitespace-nowrap leading-[18px] sm:leading-normal flex-grow">
                  Buy Original Book Now
                </div>
                <FaChevronRight className="w-4 h-4 sm:flex hidden" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="flex flex-col lg:flex-row justify-around">
          <div className="lg:w-2/3">
            <div className="flex-col justify-start items-start gap-2 flex mb-6">
              <div
                className="text-slate-800 text-2xl sm:text-[42px] font-semibold font-['Inter'] title-wrapper px-11"
                style={{ lineHeight: "1.5" }}
              >
                {blogData.title}
              </div>
            </div>
            <ShowBook initialContent={parsedContent} />
          </div>

          <div className="hidden lg:block w-auto pr-[40px]">
            <OtherBooks1 books={firstHalfBooks} />
          </div>
        </div>
        <div className="hidden lg:block w-auto">
          <OtherBooks2 books={secondHalfBooks} />
        </div>

        <div className="lg:hidden space-y-8">
          <div>
            <BookCarousel
              books={firstHalfBooks}
              title="You may also like these books"
            />
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <div>
            <BookCarousel
              books={secondHalfBooks}
              title="Popular Books Summaries"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;