
/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import book from "../assets/Fr.svg";
import request from "../assets/icon2.svg";
import stars from "../assets/stars.svg";
import store from "../assets/store.svg";
import clickedRequest from "../assets/clickedRequest.svg";
import clickedExplore from "../assets/clickedExplore.svg";
import privacy from "../assets/privacy.svg";
import price from "../assets/price.svg";
import createpost from "../assets/createpost.svg";
import allposts from "../assets/allposts.svg";
import profile from "../assets/profile.svg";
import category from "../assets/category.svg";
import categoryClicked from "../assets/categoryClicked.svg";
import config from "../config";

const UserLinks = ({ isOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const isAdmin = currentUser?.user?.role === "admin";

  const handleSignout = async () => {
    try {
      const res = await fetch(`${config.API_URL}/api/v1/signout`, {
        method: "POST",
      });
      if (res.ok) {
        dispatch(signoutSuccess());
        navigate("/");
      } else {
        console.error("Signout failed");
      }
    } catch (error) {
      console.error("Error during signout:", error);
    }
  };

  return (
    <div
      className={`py-[32px] ${isOpen ? "px-[32px]" : ""} flex flex-col ${
        isOpen ? "" : "items-center"
      }`}
    >
      {/* Admin-only links */}
      {isAdmin ? (
        <>
          <Link
            to="/create"
            className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img
              className="w-6 h-6 my-[12px]"
              src={createpost}
              alt="Create Post"
            />
            {isOpen && <span className="ml-2">Create Post</span>}
          </Link>

          <Link
            to="/"
            className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img className="w-6 h-6 my-[12px]" src={allposts} alt="All Post" />
            {isOpen && <span className="ml-2">All Posts</span>}
          </Link>

          <Link
            to="/book-categories"
            className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            } ${isActive("/book-categories") ? "bg-white border border-gray-300" : ""}`}
          >
            <img
              className="w-6 h-6 my-[12px]"
              src={isActive("/book-categories") ? categoryClicked : category}
              alt="Category"
            />
            {isOpen && <span className="ml-2">Book Categories</span>}
          </Link>

          <Link
            to="/editprivacy"
            className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img className="w-6 h-6 my-[12px]" src={privacy} alt="privacy" />
            {isOpen && <span className="ml-2">Privacy Policy</span>}
          </Link>
          <Link
            to="/generate-summary"
            className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img className="w-6 h-6 my-[12px]" src={stars} alt="privacy" />
            {isOpen && <span className="ml-2">Generate Summary</span>}
          </Link>
          <Link
            to="/profile"
            className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img className="w-6 h-6 my-[12px]" src={profile} alt="Profile" />
            {isOpen && <span className="ml-2">Profile</span>}
          </Link>
        </>
      ) : (
        <>
          {/* Normal user + shared links */}
                <Link
                to="/"
                className={`flex items-center justify-start menu rounded-lg h-12 p-2 ${
                  isOpen ? "w-[230px]" : "w-10"
                } ${isActive("/") ? "bg-white border border-gray-300" : "hover:bg-gray-50"}`}
                >
                <img
                  className="w-6 h-6 my-[12px]"
                  src={isActive("/") ? clickedExplore : book}
                  alt="Dashboard"
                />
                {isOpen && <span className="ml-2">Explore</span>}
                </Link>

                <Link
                to="/book-categories"
                className={`flex items-center justify-start menu hover:bg-gray-50 rounded-lg h-12 p-2 ${
                  isOpen ? "w-[230px]" : "w-10"
                } ${isActive("/book-categories") ? "bg-white border border-gray-300" : ""}`}
                >
                <img
                  className="w-6 h-6 my-[12px]"
                  src={isActive("/book-categories") ? categoryClicked : category}
                  alt="Category"
                />
                {isOpen && <span className="ml-2">Book Categories</span>}
                </Link>

                <Link
                to="/request"
                className={`flex items-center menu rounded-lg h-12 p-2 ${
                  isOpen ? "w-[230px]" : "w-10"
                } ${isActive("/request") ? "bg-white border border-gray-300" : "hover:bg-gray-50"} `}
                >
                <img
                  className="w-6 h-6 my-[12px]"
                  src={isActive("/request") ? clickedRequest : request}
                  alt="Request Summary"
                />
                {isOpen && (
                  <span className="ml-2 flex items-center">
                  <p>Request Summary</p>
                  <div className="w-10 h-5 px-2 py-1 mx-[12px] bg-violet-100 rounded-md justify-center items-center gap-2.5 inline-flex">
                    <div className="text-violet-700 text-[10px] font-semibold font-['Inter']">
                    NEW
                    </div>
                  </div>
                  </span>
                )}
                </Link>
          {/* pricing */}
             <Link
                to="/pricing"
                className={`flex items-center justify-start menu rounded-lg h-12 p-2 ${
                  isOpen ? "w-[230px]" : "w-10"
                } ${isActive("/pricing") ? "bg-white border border-gray-300" : "hover:bg-gray-50"}`}
                >
                <img
                  className="w-6 h-6 my-[12px]"
                  src={isActive("/pricing") ? clickedExplore : book}
                  alt="Dashboard"
                />
                {isOpen && <span className="ml-2">Pricing</span>}
                </Link>
                {currentUser ? (
                <button
                  onClick={handleSignout}
                  className={`flex items-center menu rounded-lg h-12 p-2 ${
                  isOpen ? "w-[230px]" : "w-10"
                  } hover:bg-gray-50`}
                  type="button"
                >
                  <img className="w-6 h-6 my-[12px]" src={privacy} alt="Logout" />
                  {isOpen && <span className="ml-2">Logout</span>}
                </button>
                ) : (
                <Link
                  to="/login"
                  className={`flex items-center menu rounded-lg h-12 p-2 ${
                  isOpen ? "w-[230px]" : "w-10"
                  } ${isActive("/login") ? "bg-white border border-gray-300" : "hover:bg-gray-50"}`}
                >
                  <img className="w-6 h-6 my-[12px]" src={privacy} alt="Login" />
                  {isOpen && <span className="ml-2">Login</span>}
                </Link>
                )}
          <div className="pt-[32px] py-[12px] flex items-center">
            {isOpen && <span className="mr-[12px] feature">OTHER FEATURES</span>}
            <div
              className={`h-px linecolor my-[12px] ${isOpen ? "w-[100px]" : "w-10"}`}
            ></div>
          </div>

          <Link
            to="/"
            className={`flex items-center hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img className="w-6 h-6 my-[12px]" src={store} alt="Store" />
            {isOpen && (
              <span className="ml-2 flex items-center">
                <p className="menu">Book Store</p>
                <div className="w-[46px] h-5 mx-[12px] px-2 py-1 bg-amber-100 rounded-md justify-center items-center gap-2.5 inline-flex">
                  <div className="text-amber-700 text-[10px] font-semibold font-['Inter']">
                    SOON
                  </div>
                </div>
              </span>
            )}
          </Link>

          <Link
            to="/"
            className={`flex items-center hover:bg-gray-50 rounded-lg h-12 p-2 ${
              isOpen ? "w-[230px]" : "w-10"
            }`}
          >
            <img className="w-6 h-6 my-[12px]" src={stars} alt="Summary" />
            {isOpen && (
              <span className="ml-2 flex items-center">
                <p className="menu">Generate Summary</p>
                <div className="w-[46px] h-5 px-2 py-1 mx-[12px] bg-amber-100 rounded-md justify-center items-center gap-2.5 inline-flex">
                  <div className="text-amber-700 text-[10px] font-semibold font-['Inter']">
                    SOON
                  </div>
                </div>
              </span>
            )}
          </Link>

         
        </>
      )}
    </div>
  );
};

export default UserLinks;