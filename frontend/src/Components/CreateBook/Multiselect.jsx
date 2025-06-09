/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const Multiselect = ({ options, selected, onChange, maxSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(selected);
 
  useEffect(() => {
    setSelectedOptions(selected);
    console.log(selected);
  }, [selected]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    let newSelected;
    if (selectedOptions.includes(option)) {
      newSelected = selectedOptions.filter((item) => item !== option);
    } else if (selectedOptions.length < maxSelected) {
      newSelected = [...selectedOptions, option];
    } else {
      return; // Max selection reached
    }
    setSelectedOptions(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
      >
        {selectedOptions.length === 0 ? 'Select categories...' : `${selectedOptions.length} selected`}
        <div className="absolute top-1/2 end-3 -translate-y-1/2">
          <svg className="shrink-0 size-3.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 15 5 5 5-5"/>
            <path d="m7 9 5-5 5 5"/>
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className="py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100"
            >
              <div className="flex items-center">
                <div className="me-2"></div>
                <div>
                  <div className={`text-sm text-gray-800 ${selectedOptions.includes(option) ? 'font-semibold' : ''}`}>
                    {option}
                  </div>
                </div>
                <div className="ms-auto">
                  {selectedOptions.includes(option) && (
                    <span>
                      <svg className="shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Multiselect;