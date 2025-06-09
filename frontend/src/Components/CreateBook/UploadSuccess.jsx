/* eslint-disable react/prop-types */
import SucessAnimation from "../SucessAnimation";

const UploadSuccess = ({ onUploadAnother, onViewBook }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-[723px] h-auto p-6 bg-white rounded-xl shadow border border-gray-300 flex-col justify-between items-center inline-flex">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full max-w-[403px] flex-col justify-start items-center gap-6 inline-flex">
            <div className="self-stretch flex-col justify-start items-center gap-3 flex">
              <div className="flex-col justify-center items-center gap-2 flex">
                <div className="px-2 py-1 bg-emerald-50 rounded-md justify-center items-center gap-2.5 inline-flex">
                  <div className="text-emerald-700 text-[10px] font-semibold font-['Inter']">
                    Success Full
                  </div>
                </div>
                <div className="text-slate-800 text-[28px] font-semibold font-['Inter'] text-center">
                  Upload Complete
                </div>
              </div>
              <div className="w-full text-center text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
                Book has been uploaded and live for viewing!
              </div>
            </div>
            <SucessAnimation />
            <div className="self-stretch justify-center items-center gap-3 flex flex-col sm:flex-row">
              <button
                onClick={onUploadAnother}
                className="w-full sm:w-[195.50px] h-11 p-2.5 bg-emerald-500 rounded-lg shadow justify-center items-center gap-2.5 inline-flex"
              >
                <div className="text-white text-base font-medium font-['Inter'] leading-normal">
                  Upload another book
                </div>
              </button>
              <button
                onClick={onViewBook}
                className="w-full sm:w-[195.50px] h-11 p-2.5 bg-white rounded-lg border border-gray-300 justify-center items-center gap-2.5 inline-flex"
              >
                <div className="text-gray-500 text-base font-normal font-['Inter'] leading-normal">
                  View book on web
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccess;
