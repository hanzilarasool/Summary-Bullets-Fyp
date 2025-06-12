
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import config from "../config.js";
import Editor from "../Components/CreateBook/Editor.jsx";
import { useCreateBlockNote } from "@blocknote/react";

const EditPrivacy = () => {
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null); // Initialize as null
  const [isSaving, setIsSaving] = useState(false); // Loading state for save operation
  const editor = useCreateBlockNote();

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/v1/getprivacy`, {
        credentials: "include", // Ensure cookies are sent if authentication is required
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { content } = await response.json();
      // Validate and parse content
      let parsedContent;
      try {
        parsedContent = content ? JSON.parse(content) : [];
      } catch (parseError) {
        console.warn("Invalid JSON in content, using default:", parseError);
        parsedContent = []; // Default to empty BlockNote content
      }
      setContent(parsedContent);
    } catch (error) {
      console.error("Error fetching privacy policy data:", error);
      setError("Failed to load privacy policy. Please try again.");
    }
  };

  const handleContentChange = useCallback((newContent) => {
    setContent(newContent); // Update as JSON object
  }, []);

  const handleSave = async (isDraft) => {
    setIsSaving(true); // Start loading state
    try {
      const response = await fetch(`${config.API_URL}/api/v1/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(content), isDraft }),
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      // toast.success("Privacy policy updated successfully!", {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
      console.log("Privacy policy saved successfully");
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      setError("Failed to save privacy policy. Please try again.");
      // toast.error("Failed to update privacy policy.", {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
    } finally {
      setIsSaving(false); // End loading state
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1000px] p-6 bg-white rounded-xl shadow border border-gray-300 flex-col gap-8 sm:my-[32px] my-[12px] mx-[20px]">
        <h1 className="text-slate-800 text-[28px] font-semibold font-['Inter']">
          Privacy Policy
        </h1>
        <div
          className="flex-col gap-3 mt-[20px]"
          style={{ opacity: isSaving ? 0.5 : 1, transition: "opacity 0.3s ease" }}
        >
          {content !== null ? (
            <Editor
              initialContent={content}
              onChange={handleContentChange}
              editor={editor}
            />
          ) : (
            <p>Loading editor...</p>
          )}
          <div className="flex gap-3 mt-4">
        
            <button
              onClick={() => handleSave(false)}
              className="flex-1 h-11 p-2.5 bg-emerald-500 rounded-lg shadow text-white text-base font-medium font-['Inter']"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save and Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPrivacy;
    // <button
    //           onClick={() => handleSave(true)}
    //           className="flex-1 h-11 p-2.5 bg-white rounded-lg shadow border border-gray-300 text-black text-base font-medium font-['Inter']"
    //           disabled={isSaving}
    //         >
    //           {isSaving ? "Saving..." : "Save as Draft"}
    //         </button>