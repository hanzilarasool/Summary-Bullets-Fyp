import { useState, useRef, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import cross from "../assets/cross.svg";
import left from "../assets/leftlight.svg";
import right from "../assets/rightlight.svg";
import UserLinks from "./UserLinks";

const Parent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState({
    mobile: false,
    desktop: true,
  });
  const sidebarRef = useRef(null);

  const toggleSidebar = (type) => {
    setIsSidebarOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  const closeSidebar = () => {
    setIsSidebarOpen((prevState) => ({
      ...prevState,
      mobile: false,
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen((prevState) => ({
          ...prevState,
          mobile: false,
        }));
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen.mobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar.bind(null, "mobile")}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white w-[291px] sm:hidden transform transition-transform ${
          isSidebarOpen.mobile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center pt-[32px] px-[32px]">
          <div className="flex">
            <img className="w-10 h-10" src={logo1} alt="logo" />
            <span className="pl-[8px] flex flex-col">
              <p className="intro-black-caps">SUMMARY</p>
              <p className="intro-bold-caps pt-[2px]">BULLETS</p>
            </span>
          </div>
          <button onClick={closeSidebar}>
            <img src={cross} alt="close" />
          </button>
        </div>
        <UserLinks isOpen={true} />
      </div>

      {/* Desktop sidebar */}
      <div
        ref={sidebarRef}
        className={`hidden sm:block relative sidebarcolor transition-all duration-200 z-10 ${
          isSidebarOpen.desktop ? "w-[280px]" : "w-[104px]"
        } group`}
      >
        <div
          className={`pt-[32px] flex ${
            isSidebarOpen.desktop ? "" : "justify-center"
          }`}
        >
          <img
            className={`w-10 h-10 ${isSidebarOpen.desktop ? "ml-[32px]" : ""}`}
            src={logo1}
            alt="logo"
          />
          {isSidebarOpen.desktop && (
            <span className="pl-[8px] flex flex-col">
              <p className="intro-black-caps">SUMMARY</p>
              <p className="intro-bold-caps pt-[2px]">BULLETS</p>
            </span>
          )}
        </div>
        <UserLinks isOpen={isSidebarOpen.desktop} />
        <div className="sm:flex hidden absolute right-0 top-0 bottom-0 w-[1px] bg-transparent group-hover:bg-black transition-colors duration-200">
          <button
            onClick={toggleSidebar.bind(null, "desktop")}
            className="absolute top-20 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {isSidebarOpen.desktop ? (
              <img src={left} alt="left-arrow" />
            ) : (
              <img src={right} alt="right-arrow" />
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {/* Topbar */}
          <div className="topbar">
            <div className="w-full h-[90px] sm:h-[100px] header flex justify-between sm:justify-end items-center">
              <div className="px-[32px] flex sm:hidden">
                <img className="w-10 h-10" src={logo1} alt="logo" />
                <span className="pl-[8px] flex flex-col">
                  <p className="intro-black-caps">SUMMARY</p>
                  <p className="intro-bold-caps pt-[2px]">BULLETS</p>
                </span>
              </div>
              <button className="hidden sm:flex w-[156px] h-10 mx-[32px] px-[16px] py-[13px] bg-white rounded-lg shadow border border-gray-300 justify-center items-center reqsummarybutton">
                <Link to="/request">Request Summary</Link>
              </button>
              <button
                className="sm:hidden mx-[32px]"
                onClick={toggleSidebar.bind(null, "mobile")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                >
                  <path
                    d="M1 1H17M1 7H17M1 13H17"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Outlet */}
          <div className="overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parent;
