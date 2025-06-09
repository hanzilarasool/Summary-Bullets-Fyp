import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams} from 'react-router-dom';
import right from "../assets/right.svg";
import BlogCard from "../Components/BlogCard";
import ReactPaginate from "react-paginate";
import { setCurrentPage } from "../redux/blog/blogSlice";
import config from "../config";
import lefta from "../assets/lefta.svg";
import righta from "../assets/righta.svg";

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

const Category = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categorySlug } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const { currentPage } = useSelector((state) => state.blog);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (categorySlug) {
            const decodedCategory = decodeURIComponent(categorySlug.replace(/-/g, ' '));
            setSelectedCategory(decodedCategory);
        } else {
            setSelectedCategory(null);
        }
    }, [categorySlug]);

    useEffect(() => {
        if (selectedCategory) {
            fetchBooks();
        }
    }, [selectedCategory, currentPage]);

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const url = `${config.API_URL}/api/v1/getallblogs?page=${currentPage}&category=${encodeURIComponent(selectedCategory)}`;
            const response = await fetch(url);
            const data = await response.json();
            const filteredBooks = currentUser
                ? data.blogs
                : data.blogs.filter((book) => !book.isDraft);
            setBooks(filteredBooks);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        dispatch(setCurrentPage(1));
        navigate(`/book-categories/${category

             }`);
    };

    const handlePageChange = (selectedItem) => {
        dispatch(setCurrentPage(selectedItem.selected + 1));
    };


    const limitChar = (str, limit) => {
        const words = str.split("");
        return words.length > limit ? `${words.slice(0, limit).join("")}...` : str;
      };
    const renderPagination = () => (
        <div className="">
            <ReactPaginate
                previousLabel={
                    <div className="flex items-center p-1 sm:p-2 mr-2 sm:mr-4 rounded hover:bg-gray-100 justify-center">
                        <img
                            src={lefta}
                            alt="Previous"
                            className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
                        />
                        <span className="text-xs sm:text-sm font-['Inter']">Previous</span>
                    </div>
                }
                nextLabel={
                    <div className="flex items-center justify-center p-1 sm:p-2 ml-2 sm:ml-4 rounded hover:bg-gray-100">
                        <span className="text-xs sm:text-sm font-['Inter']">Next</span>
                        <img
                            src={righta}
                            alt="Next"
                            className="w-4 h-4 sm:w-5 sm:h-5 ml-1"
                        />
                    </div>
                }
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={3}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={
                    "pagination flex justify-between items-center mb-[50px] sm:mb-[100px] mx-[20px] sm:mx-[70px] pt-[24px] mt-[30px]"
                }
                pageClassName={"mx-1 hidden sm:block"}
                pageLinkClassName={
                    "px-3 py-2 rounded hover:bg-gray-200 text-sm font-['Inter']"
                }
                activeClassName={"bg-gray-300 py-1 rounded"}
                previousClassName={"mr-auto"}
                nextClassName={"ml-auto"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                breakClassName={"mx-1 hidden sm:block"}
                renderOnZeroPageCount={null}
            />
        </div>
    );

    return (
        <div className="w-full">
            <div className="h-auto py-12 w-full bg-[#f8f9fb] border-b border-[#cfd4dc] flex flex-col justify-center items-center gap-3">
                <div className="text-black text-base font-medium font-['Inter'] leading-normal">
                    Book Categories
                </div>
                <div className="w-full max-w-[612px] text-center px-4">
                    <span className="text-black text-3xl md:text-5xl font-semibold font-['Inter'] leading-tight md:leading-[60px]">
                        {selectedCategory ? `${selectedCategory}` : 'Explore Book Summaries by '}
                    </span>
                    {!selectedCategory && (
                        <span className="text-[#513deb] text-3xl md:text-5xl font-semibold font-['Inter'] leading-tight md:leading-[60px]">
                            Category
                        </span>
                    )}
                </div>
            </div>
            <div className="container mx-auto py-8">
                {!selectedCategory ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:mx-6 mx-3">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="h-[72px] px-4 py-6 bg-white rounded-lg shadow border border-[#cfd4dc] flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="text-black text-sm font-semibold font-['Inter'] leading-tight">
                                    {category}
                                </div>
                                <div className="w-6 h-6 relative">
                                    <img src={right} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {isLoading ? (
                            <div className="flex-wrap w-full flex justify-center">
                                {Array(8).fill().map((_, index) => (
                                    <div
                                        key={index}
                                        className="my-[8px] sm:my-[16px] mx-[4px] sm:mx-[16px] sm:w-[250px] w-[180px] bg-white sm:h-[411px] h-[322px] p-[12px] sm:p-[16px]-[16px] flex flex-col rounded-lg shadow border border-gray-300 items-start justify-between"
                                    >
                                        <div className="sm:w-[218px] w-[154px] h-[150px] sm:h-[222px] bg-gray-100 rounded" />
                                        <div className="flex flex-col items-start justify-start">
                                            <div className="sm:w-[86px] sm:h-[19px] w-[73px] h-[13px] bg-gray-100 rounded" />
                                            <div className="sm:w-[208px] sm:h-[43px] w-[154px] h-[56px] bg-gray-100 rounded mt-[4px]" />
                                        </div>
                                        <div className="flex flex-col items-start justify-start">
                                            <div className="sm:w-[189px] sm:h-[19px] w-[142px] h-[13px] bg-gray-100 rounded" />
                                            <div className="sm:w-[143px] sm:h-[19px] w-[101px] h-[13px] mt-[4px] bg-gray-100 rounded" />
                                        </div>
                                        <div className="sm:w-[60px] sm:h-[10px] w-[101px] h-[13px] bg-gray-100 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {books.length === 0 ? (
                                    <div className="text-center text-gray-500">No books found in this category.</div>
                                ) : (
                                    <div className="flex-wrap w-full flex justify-evenly sm:justify-center">
                                        {books.map((book) => (
                                            <BlogCard
                                                key={book._id}
                                                blog={book}
                                                currentUser={currentUser}
                                                limitChar={limitChar}
                                            />
                                        ))}
                                    </div>
                                )}
                                {books.length > 0 && renderPagination()}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;