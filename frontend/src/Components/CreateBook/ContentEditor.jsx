/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";

const ContentEditor = ({
  contentSections,
  handleContentSectionChange,
  addContentSection,
}) => {
  const textareaRefs = useRef([]);

  useEffect(() => {
    textareaRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
      }
    });
  }, [contentSections]);

  const handleContentChange = (index, value) => {
    handleContentSectionChange(index, value);
  };

  const renderContent = (section, index) => {
    // Check if section type is "pre" and treat it as "p" for content handling
    const isPreType = section.type.toUpperCase() === "PRE";

    return (
      <div
        key={index}
        className="self-stretch h-auto flex-col justify-start items-start gap-3 flex"
      >
        <label className="self-stretch text-black text-base font-medium leading-normal">
          {isPreType ? "P Content" : section.type.toUpperCase() + " Content"}
        </label>
        <textarea
          ref={(el) => (textareaRefs.current[index] = el)}
          value={isPreType ? section.content : section.content}
          onChange={(e) => handleContentChange(index, e.target.value)}
          className="self-stretch px-3.5 py-4 bg-white rounded-lg shadow border border-gray-300 text-gray-500 text-sm font-normal leading-tight focus:outline-none focus:text-black resize-none overflow-hidden"
          placeholder={`Enter ${
            isPreType ? "paragraph" : section.type
          } content`}
        />
      </div>
    );
  };

  return (
    <>
      <h2 className="text-slate-800 text-28px font-semibold">Main Content</h2>
      {contentSections.map((section, index) => renderContent(section, index))}
      <div className="justify-start items-start gap-6 flex-wrap flex">
        <div className="flex gap-6">
          <button
            onClick={() => addContentSection("h1")}
            className="h-38px px-6 py-2.5 bg-indigo-50 rounded-lg border border-indigo-700 flex items-center gap-2"
          >
            <span className="text-black text-xs font-normal">Add Heading</span>
            <span className="text-black text-xs font-medium underline">H1</span>
          </button>
          <button
            onClick={() => addContentSection("h2")}
            className="h-38px px-6 py-2.5 bg-indigo-50 rounded-lg border border-indigo-700 flex items-center gap-2"
          >
            <span className="text-black text-xs font-normal">Add Heading</span>
            <span className="text-black text-xs font-medium underline">H2</span>
          </button>
        </div>
        <div className="flex gap-6">
          <button
            onClick={() => addContentSection("h3")}
            className="h-38px px-6 py-2.5 bg-indigo-50 rounded-lg border border-indigo-700 flex items-center gap-2"
          >
            <span className="text-black text-xs font-normal">Add Heading</span>
            <span className="text-black text-xs font-medium underline">H3</span>
          </button>
          <button
            onClick={() => addContentSection("pre")}
            className="h-38px px-6 py-2.5 bg-indigo-50 rounded-lg border border-indigo-700 flex items-center gap-2"
          >
            <span className="text-black text-xs font-normal">
              Add Paragraph
            </span>
            <span className="text-black text-xs font-medium underline">P</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ContentEditor;
