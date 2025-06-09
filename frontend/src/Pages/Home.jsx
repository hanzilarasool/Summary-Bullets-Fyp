import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getStorage, ref, deleteObject } from "firebase/storage";
import lefta from "../assets/lefta.svg";
import righta from "../assets/righta.svg";
import SearchComponent from "../Components/Search";
import { app } from "../firebase";
import config from "../config";
import BlogCard from "../Components/BlogCard";
import ReactPaginate from "react-paginate";
import {
  setCurrentPage,
  setSearchTerm,
  setSearchGenres,
} from "../redux/blog/blogSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentPage, searchTerm, searchGenres } = useSelector(
    (state) => state.blog
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const storage = getStorage(app);
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const updateSearchParams = useCallback(
    (newParams) => {
      const updatedParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value && !(key === "page" && value === "1")) {
          updatedParams.set(key, value);
        } else {
          updatedParams.delete(key);
        }
      });
      setSearchParams(updatedParams);
    },
    [setSearchParams, searchParams]
  );

  useEffect(() => {
    const page = searchParams.get("page");
    const search = searchParams.get("search") || "";
    const genres = searchParams.get("genres")
      ? searchParams.get("genres").split(",")
      : [];

    dispatch(setCurrentPage(page ? parseInt(page, 10) : 1));
    dispatch(setSearchTerm(search));
    dispatch(setSearchGenres(genres));
  }, [searchParams, dispatch]);

  useEffect(() => {
    updateSearchParams({
      page: currentPage === 1 ? null : currentPage.toString(),
      search: searchTerm,
      genres: searchGenres.join(","),
    });
  }, [currentPage, searchTerm, searchGenres, updateSearchParams]);

  const handleSearch = useCallback(
    (newSearchTerm, newGenres) => {
      dispatch(setCurrentPage(1));
      dispatch(setSearchTerm(newSearchTerm));
      dispatch(setSearchGenres(newGenres));
    },
    [dispatch]
  );

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `${config.API_URL}/api/v1/getallblogs?page=${currentPage}`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      if (searchGenres.length > 0) {
        url += `&genres=${searchGenres.join(",")}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      const filteredBlogs = currentUser
        ? data.blogs
        : data.blogs.filter((blog) => !blog.isDraft);
      setBlogs(filteredBlogs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, searchGenres, currentUser]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const limitChar = useCallback((str, limit) => {
    const words = str.split("");
    return words.length > limit ? `${words.slice(0, limit).join("")}...` : str;
  }, []);

  const handleDelete = useCallback((blogId, coverImage) => {
    setBlogToDelete({ id: blogId, coverImage });
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!blogToDelete) return;

    try {
      const response = await fetch(
        `${config.API_URL}/api/v1/deleteblog/${blogToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete blog post ${blogToDelete.id}`);
      }

      try {
        const imageRef = ref(storage, blogToDelete.coverImage);
        await deleteObject(imageRef);
      } catch (imageError) {
        console.warn(
          "Failed to delete image, but blog post was deleted:",
          imageError
        );
      }

      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== blogToDelete.id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  }, [blogToDelete, storage]);

  const handlePageChange = useCallback(
    (selectedItem) => {
      dispatch(setCurrentPage(selectedItem.selected + 1));
    },
    [dispatch]
  );

  const renderPagination = useMemo(
    () => (
      <ReactPaginate
        previousLabel={
          <div className="flex items-center p-1 sm:p-2 mr-2 sm:mr-4 rounded hover:bg-gray-100 justify-center ">
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
        activeClassName={"bg-gray-300  py-1 rounded"}
        previousClassName={"mr-auto"}
        nextClassName={"ml-auto"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
        breakClassName={"mx-1 hidden sm:block"}
        renderOnZeroPageCount={null}
      />
    ),
    [totalPages, handlePageChange]
  );

  const memoizedBlogCards = useMemo(
    () =>
      blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          currentUser={currentUser}
          onDelete={handleDelete}
          limitChar={limitChar}
        />
      )),
    [blogs, currentUser, handleDelete, limitChar]
  );

  return (
    <div className="">
      <SearchComponent
        onSearch={handleSearch}
        initialSearchTerm={searchTerm}
        initialGenres={searchGenres}
      />

      <div className="pt-[10px] flex justify-center">
        {isLoading ? (
          <div className="flex-wrap w-full flex justify-center ">
            {Array(8)
              .fill()
              .map((_, index) => (
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
            {blogs.length === 0 ? (
              <div className="my-[100px] justify-center flex-col items-center inline-flex px-[10px]">
                <div className="justify-center items-center gap-2.5 inline-flex flex-wrap">
                  <div className="text-slate-800 text-[28px] font-semibold font-['Inter']">
                    No results found{" "}
                  </div>
                  <div className="px-2 py-1 bg-red-100 rounded-md justify-center items-center gap-2.5 flex">
                    <div className="text-red-700 text-[10px] font-semibold font-['Inter']">
                      Empty
                    </div>
                  </div>
                </div>
                <div className="self-stretch text-center text-gray-500 text-sm font-medium font-['Inter'] leading-tight">
                  Please make sure your words are spelled correctly or use less
                  or different keywords
                </div>
              </div>
            ) : (
              <div className="flex-wrap w-full flex justify-evenly sm:justify-center">
                {memoizedBlogCards}
              </div>
            )}
          </>
        )}
      </div>

      {blogs.length > 0 && renderPagination}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this blog post?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
