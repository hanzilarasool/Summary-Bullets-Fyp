import { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

const TableOfContents = ({ content }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [toc, setToc] = useState([]);

  useEffect(() => {
    if (content) {
      const parsedContent = content;
      const headings = parsedContent.filter(
        (block) =>
          block.type === "heading" &&
          (block.props.level === 1 || block.props.level === 2)
      );
      setToc(headings);
    }
  }, [content]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md mb-6">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          {/* <BookOpen className="w-5 h-5 mr-2 text-indigo-600" /> */}
          <h2 className="text-lg font-semibold text-gray-800">
            Table of Contents
          </h2>
        </div>
        {/* {isOpen ? (
        //   <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
        //   <ChevronDown className="w-5 h-5 text-gray-600" />
        )} */}
      </div>
      {isOpen && (
        <ul className="p-4 space-y-2">
          {toc.map((heading, index) => (
            <li
              key={index}
              className={`${
                heading.props.level === 1 ? "font-semibold" : "pl-4"
              } text-gray-700 hover:text-indigo-600 cursor-pointer`}
            >
              {heading.content[0].text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableOfContents;
