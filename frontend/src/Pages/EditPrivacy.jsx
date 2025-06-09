import React, { useState, useEffect, useCallback } from "react";
import config from "../config.js";
import Editor from "../Components/CreateBook/Editor.jsx";
import { useCreateBlockNote } from "@blocknote/react";
const EditPrivacy = () => {
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const editor = useCreateBlockNote();
  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/v1/getprivacy`);
      if (!response.ok) throw new Error("Failed to fetch privacy policy data");

      const { content } = await response.json();
      setContent(content);
    } catch (error) {
      console.error("Error fetching privacy policy data:", error);
      setError("Failed to load privacy policy. Please try again.");
    }
  };
  const handleContentChange = useCallback((newContent) => {
    setContent((prevData) => ({
      ...prevData,
      content: newContent,
    }));
  }, []);

  const handleSave = async (isDraft) => {
    try {
      const htmlContent = JSON.stringify(content);
      const response = await fetch(`${config.API_URL}/api/v1/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent, isDraft }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to save privacy policy");
      console.log("Privacy policy saved successfully");
    } catch (error) {
      console.error("Error saving privacy policy:", error);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1000px] p-6 bg-white rounded-xl shadow border border-gray-300 flex-col gap-8 sm:my-[32px] my-[12px] mx-[20px]">
        <h1 className="text-slate-800 text-[28px] font-semibold font-['Inter']">
          Privacy Policy
        </h1>
        <div className="flex-col gap-3 mt-[20px]">
          <Editor
            initialContent={content}
            onChange={handleContentChange}
            editor={editor}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleSave(true)}
              className="flex-1 h-11 p-2.5 bg-white rounded-lg shadow border border-gray-300 text-black text-base font-medium font-['Inter']"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              className="flex-1 h-11 p-2.5 bg-emerald-500 rounded-lg shadow text-white text-base font-medium font-['Inter']"
            >
              Save and Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPrivacy;