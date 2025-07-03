// // third
// import { useState, useRef } from "react";
// import envelope from "../assets/envelope.svg";
// import SucessAnimation from "../Components/SucessAnimation";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import config from "../config";


// const RequestSummary = () => {
//   const [isSuccess, setIsSuccess] = useState(false);

//   const form = useRef();
//   // const [loader, setLoader] = useState(false);
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state) => state.user);

//   const sendEmail = async (e) => {

//     e.preventDefault();
// // setLoader(true);
//     if (!currentUser) {
//       toast.info("Please log in to request a summary.", {
//         onClose: () => navigate("/login"),
//       });
//       return;
//     }

//     try {
//       const userId = currentUser.user._id;
//       const response = await fetch(`${config.API_URL}/api/v1/user/${userId}`, {
//         headers: { Authorization: `Bearer ${currentUser.token}` },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const userData = await response.json();

//       const planLimits = {
//         free: 0,
//         basic: 3,
//         standard: 10,
//         premium: Infinity,
//       };
//       const limit = planLimits[userData.plan?.toLowerCase()] || 0;
//       const requestsUsed = userData.subscription?.summaryRequestsUsed || 0;

//       console.log("Plan:", userData.plan, "Limit:", limit, "Requests Used:", requestsUsed);

//       if (requestsUsed >= limit && limit !== Infinity) {
//         toast.error("You have exceeded your summary request limit for this plan.");
//         return;
//       }

//       // Send request to backend for Nodemailer and storage
//       const bookName = form.current.book_name.value;
//       const userEmail = form.current.user_email.value;
//       const summaryResponse = await fetch(`${config.API_URL}/api/v1/send-summary-request`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//         body: JSON.stringify({ userId, bookName, userEmail, status: "pending" }),
//       });
// // setLoader(false);
//       if (!summaryResponse.ok) {
//         throw new Error(`HTTP error! status: ${summaryResponse.status}`);
//         // setLoader(false);
//       }

//       const result = await summaryResponse.json();
//       console.log("SUCCESS!", result);
//       setIsSuccess(true);
//       toast.success("Summary request sent successfully!");
//     } catch (error) {
//       console.error("Failed to send summary request:", error);
//       toast.error("Failed to send summary request: " + error.message);
//       setLoader(false);
//     }
//   };

//   const handleDone = () => {
//     setIsSuccess(false);
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-center items-center pt-[32px]">
//         <div className="w-full max-w-[723px] p-4 sm:p-6 bg-white rounded-xl shadow border border-gray-300 flex-col justify-between items-center inline-flex">
//           {isSuccess ? (
//             <div className="w-full h-full flex flex-col justify-center items-center">
//               <div className="w-full max-w-[403px] flex-col justify-start items-center gap-6 inline-flex">
//                 <div className="self-stretch flex-col justify-start items-center gap-3 flex">
//                   <div className="flex-col justify-center items-center gap-2 flex">
//                     <div className="px-2 py-1 bg-emerald-50 rounded-md justify-center items-center gap-2.5 inline-flex">
//                       <div className="text-emerald-700 text-[10px] font-semibold font-['Inter']">
//                         Success Full
//                       </div>
//                     </div>
//                     <div className="text-slate-800 text-xl sm:text-[28px] font-semibold font-['Inter'] text-center">
//                       Request Sent
//                     </div>
//                   </div>
//                   <div className="w-full text-center text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
//                     We will get back to you with your requested book summary
//                     soon! It won't take long.
//                   </div>
//                 </div>
//                 <SucessAnimation />
//                 <button
//                   className="w-full h-11 flex-col justify-start items-center gap-3 flex"
//                   onClick={handleDone}
//                 >
//                   <div className="w-full h-11 p-2.5 bg-white rounded-lg shadow border border-gray-300 justify-center items-center gap-2.5 inline-flex">
//                     <div className="text-gray-600 text-base font-normal font-['Inter'] leading-normal">
//                       Done
//                     </div>
//                   </div>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="self-stretch flex-col justify-start items-center gap-3 flex">
//                 <div className="justify-center items-center gap-2.5 inline-flex flex-wrap">
//                   <div className="text-slate-800 text-xl sm:text-[28px] font-semibold font-['Inter'] text-center">
//                     Submit your Request
//                   </div>
//                   <div className="px-2 py-1 bg-violet-100 rounded-md justify-center items-center gap-2.5 flex">
//                     <div className="text-violet-700 text-[10px] font-semibold font-['Inter']">
//                       NEW
//                     </div>
//                   </div>
//                 </div>
//                 <div className="self-stretch text-center text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
//                   We welcome requests for summaries of any non-fiction book you
//                   desire. Our goal is to respond within a couple of days and
//                   upload the summary you requested.
//                 </div>
//               </div>
//               <form
//                 ref={form}
//                 onSubmit={sendEmail}
//                 className="w-full max-w-[417px] flex-col justify-start items-center gap-3 flex mt-4"
//               >
//                 <div className="w-full h-11 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-center inline-flex focus-within:border-black focus-within:text-black">
//                   <div className="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
//                     <div className="flex pl-[14px] w-full">
//                       <img src={envelope} alt="message" />
//                       <div className="w-[1px] h-[24px] mx-[8px] bg-gray-300" />
//                       <input
//                         className="grow shrink basis-0 h-auto searchinput text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
//                         placeholder="samplemail@gmail.com"
//                         type="email"
//                         name="user_email"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="w-full h-[126px] px-3.5 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-start focus-within:border-black focus-within:text-black">
//                   <textarea
//                     className="w-full text-gray-500 text-xs h-auto searchinput font-normal font-['Inter'] leading-[18px] focus:outline-none focus:text-black"
//                     placeholder="Enter book name......."
//                     name="book_name"
//                     type="text"
//                     rows={6}
//                     style={{ resize: "none" }}
//                     autoComplete="off"
//                     required
//                   />
//                 </div>
//              <button
//                   type="submit"
//                   className="w-full h-11 p-2.5 bg-black  rounded-lg shadow justify-center items-center gap-2.5 inline-flex"
//                 >
//                   <div className="text-white text-base font-normal font-['Inter'] leading-normal">
//                     Submit Request
//                   </div>
//                 </button>
//               </form>
//               <Link
//                 to="/privacypolicy"
//                 className="self-stretch text-center text-blue-600 text-sm font-normal font-['Inter'] underline leading-tight mt-4"
//               >
//                 Privacy Policy
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RequestSummary;

import { useState, useRef } from "react";
import envelope from "../assets/envelope.svg";
import SucessAnimation from "../Components/SucessAnimation";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import config from "../config";
import { Loader2 } from "lucide-react";

const RequestSummary = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loader, setLoader] = useState(false);

  const form = useRef();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (!currentUser) {
      toast.info("Please log in to request a summary.", {
        onClose: () => navigate("/login"),
      });
      setLoader(false);
      return;
    }

    try {
      const userId = currentUser.user._id;
      const response = await fetch(`${config.API_URL}/api/v1/user/${userId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();

      const planLimits = {
        free: 0,
        basic: 3,
        standard: 10,
        premium: Infinity,
      };
      const limit = planLimits[userData.plan?.toLowerCase()] || 0;
      const requestsUsed = userData.subscription?.summaryRequestsUsed || 0;

      if (requestsUsed >= limit && limit !== Infinity) {
        toast.error("You have exceeded your summary request limit for this plan.");
        setLoader(false);
        return;
      }

      // Send request to backend for Nodemailer and storage
      const bookName = form.current.book_name.value;
      const userEmail = form.current.user_email.value;
      const summaryResponse = await fetch(`${config.API_URL}/api/v1/send-summary-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ userId, bookName, userEmail, status: "pending" }),
      });

      if (!summaryResponse.ok) {
        throw new Error(`HTTP error! status: ${summaryResponse.status}`);
      }

      await summaryResponse.json();
      setIsSuccess(true);
      toast.success("Summary request sent successfully!");
    } catch (error) {
      console.error("Failed to send summary request:", error);
      toast.error("Failed to send summary request: " + error.message);
    }
    setLoader(false);
  };

  const handleDone = () => {
    setIsSuccess(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-center items-center pt-[32px]">
        <div className="w-full max-w-[723px] p-4 sm:p-6 bg-white rounded-xl shadow border border-gray-300 flex-col justify-between items-center inline-flex">
          {isSuccess ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="w-full max-w-[403px] flex-col justify-start items-center gap-6 inline-flex">
                <div className="self-stretch flex-col justify-start items-center gap-3 flex">
                  <div className="flex-col justify-center items-center gap-2 flex">
                    <div className="px-2 py-1 bg-emerald-50 rounded-md justify-center items-center gap-2.5 inline-flex">
                      <div className="text-emerald-700 text-[10px] font-semibold font-['Inter']">
                        Success Full
                      </div>
                    </div>
                    <div className="text-slate-800 text-xl sm:text-[28px] font-semibold font-['Inter'] text-center">
                      Request Sent
                    </div>
                  </div>
                  <div className="w-full text-center text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
                    We will get back to you with your requested book summary
                    soon! It won't take long.
                  </div>
                </div>
                <SucessAnimation />
                <button
                  className="w-full h-11 flex-col justify-start items-center gap-3 flex"
                  onClick={handleDone}
                >
                  <div className="w-full h-11 p-2.5 bg-white rounded-lg shadow border border-gray-300 justify-center items-center gap-2.5 inline-flex">
                    <div className="text-gray-600 text-base font-normal font-['Inter'] leading-normal">
                      Done
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="self-stretch flex-col justify-start items-center gap-3 flex">
                <div className="justify-center items-center gap-2.5 inline-flex flex-wrap">
                  <div className="text-slate-800 text-xl sm:text-[28px] font-semibold font-['Inter'] text-center">
                    Submit your Request
                  </div>
                  <div className="px-2 py-1 bg-violet-100 rounded-md justify-center items-center gap-2.5 flex">
                    <div className="text-violet-700 text-[10px] font-semibold font-['Inter']">
                      NEW
                    </div>
                  </div>
                </div>
                <div className="self-stretch text-center text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
                  We welcome requests for summaries of any non-fiction book you
                  desire. Our goal is to respond within a couple of days and
                  upload the summary you requested.
                </div>
              </div>
              <form
                ref={form}
                onSubmit={sendEmail}
                className="w-full max-w-[417px] flex-col justify-start items-center gap-3 flex mt-4"
              >
                <div className="w-full h-11 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-center inline-flex focus-within:border-black focus-within:text-black">
                  <div className="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
                    <div className="flex pl-[14px] w-full">
                      <img src={envelope} alt="message" />
                      <div className="w-[1px] h-[24px] mx-[8px] bg-gray-300" />
                      <input
                        className="grow shrink basis-0 h-auto searchinput text-gray-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none focus:text-black"
                        placeholder="samplemail@gmail.com"
                        type="email"
                        name="user_email"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-[126px] px-3.5 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-start focus-within:border-black focus-within:text-black">
                  <textarea
                    className="w-full text-gray-500 text-xs h-auto searchinput font-normal font-['Inter'] leading-[18px] focus:outline-none focus:text-black"
                    placeholder="Enter book name......."
                    name="book_name"
                    type="text"
                    rows={6}
                    style={{ resize: "none" }}
                    autoComplete="off"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-11 p-2.5 bg-black rounded-lg shadow justify-center items-center gap-2.5 inline-flex transition flex items-center"
                  disabled={loader}
                >
                  {loader ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      <span className="text-white text-base font-normal font-['Inter'] leading-normal">
                        Submitting...
                      </span>
                    </>
                  ) : (
                    <span className="text-white text-base font-normal font-['Inter'] leading-normal">
                      Submit Request
                    </span>
                  )}
                </button>
              </form>
              <Link
                to="/privacypolicy"
                className="self-stretch text-center text-blue-600 text-sm font-normal font-['Inter'] underline leading-tight mt-4"
              >
                Privacy Policy
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestSummary;