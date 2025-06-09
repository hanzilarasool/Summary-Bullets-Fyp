import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import config from "../config.js";
import FormInputs from "../Components/CreateBook/FormInputs.jsx";
import ImageUpload from "../Components/CreateBook/ImageUpload.jsx";
import Editor from "../Components/CreateBook/Editor.jsx";
import UploadSuccess from "../Components/CreateBook/UploadSuccess.jsx";

const CreatePost = () => {
  const { urlSlug } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    coverImage: "",
    author: "",
    genres: [],
    categories: [],
    introduction: "",
    content: null,
    amazonLink: "",
    bookName: "",
    isDraft: false,
  });

  const editor = useCreateBlockNote();

  useEffect(() => {
    if (urlSlug) {
      setIsEditing(true);
      fetchBlogData(urlSlug);
    }
  }, [urlSlug]);

  const fetchBlogData = async (urlSlug) => {
    try {
      const response = await fetch(
        `${config.API_URL}/api/v1/getblog/${urlSlug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blog data");
      }
      const blogData = await response.json();

      setFormData((prevData) => ({
        ...prevData,
        ...blogData,
        content: blogData.content,
      }));
    } catch (error) {
      console.error("Error fetching blog data:", error);
      setErrorMessage("Failed to load blog data. Please try again.");
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContentChange = useCallback((newContent) => {
    setFormData((prevData) => ({
      ...prevData,
      content: newContent,
    }));
  }, []);

  const handleSave = async (isDraft) => {
    try {
      setErrorMessage("");
      const htmlContent = JSON.stringify(formData.content);

      const postData = {
        ...formData,
        isDraft,
        content: htmlContent,
      };

      const url = isEditing
        ? `${config.API_URL}/api/v1/updateblog/${urlSlug}`
        : `${config.API_URL}/api/v1/newblog`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const backendErrorMessage =
            errorData.message ||
            "There was an issue with the data you submitted.";

          throw new Error(backendErrorMessage);
        } else {
          // For other error status codes, use a generic message
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }

      const data = await response.json();
      console.log(
        isEditing ? "Blog post updated:" : "Blog post created:",
        data
      );
      if (!isDraft) {
        setShowSuccessMessage(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        isEditing ? "Error updating blog post:" : "Error creating blog post:",
        error
      );
      setErrorMessage(
        error.message || "An error occurred while saving the post."
      );
    }
  };
  const handleUploadAnother = () => {
    setShowSuccessMessage(false);
    setFormData({
      title: "",
      coverImage: "",
      author: "",
      genres: [],
      categories: [], // Reset categories
      introduction: "",
      content: null,
      amazonLink: "",
      bookName: "",
      isDraft: false,
    });
  };

  const handleViewBook = () => {
    navigate(`/`);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1000px] p-8 h-auto bg-white rounded-xl shadow border border-gray-300 flex-col justify-evenly items-start gap-10 inline-flex sm:my-[40px] my-[20px] mx-[24px]">
        <h1 className="text-slate-800 text-[32px] font-semibold font-['Inter']">
          {isEditing ? "Edit Post" : "Create Post"}
        </h1>

        <ImageUpload
          coverImage={formData.coverImage}
          onImageChange={(value) => handleInputChange("coverImage", value)}
        />

        <FormInputs formData={formData} onChange={handleInputChange} />

        <div className="w-full">
          <h2 className="text-slate-800 text-[24px] font-semibold font-['Inter'] mb-5">
            Content
          </h2>
          <Editor
            initialContent={formData.content}
            onChange={handleContentChange}
            editor={editor}
          />
        </div>

        {errorMessage && (
          <div className="self-stretch text-red-500 text-base font-medium font-['Inter'] mb-4">
            {errorMessage}
          </div>
        )}

        <div className="self-stretch justify-start items-start gap-4 inline-flex">
          <button
            onClick={() => handleSave(true)}
            className="grow shrink basis-0 h-12 p-3 bg-white rounded-lg shadow border border-gray-300 justify-center items-center gap-2.5 flex"
          >
            <span className="text-black text-lg font-medium font-['Inter'] leading-normal">
              Save as Draft
            </span>
          </button>
          <button
            onClick={() => handleSave(false)}
            className="grow shrink basis-0 h-12 p-3 bg-emerald-500 rounded-lg shadow justify-center items-center gap-2.5 flex"
          >
            <span className="text-white text-lg font-medium font-['Inter'] leading-normal">
              Save and Upload
            </span>
          </button>
        </div>
      </div>
      {showSuccessMessage && (
        <UploadSuccess
          onUploadAnother={handleUploadAnother}
          onViewBook={handleViewBook}
        />
      )}
    </div>
  );
};

export default CreatePost;
