/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app } from "../../firebase";
import page from "../../assets/page.svg";
import bin from "../../assets/bin.svg";

const ImageUpload = ({ coverImage, onImageChange }) => {
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const handleUploadImage = async (selectedFile) => {
    try {
      if (coverImage) {
        const storage = getStorage(app);
        const oldImageRef = ref(storage, coverImage);
        try {
          await deleteObject(oldImageRef);
        } catch (error) {
          if (error.code !== "storage/object-not-found") {
            console.error("Error deleting old image:", error);
          }
        }
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + selectedFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            onImageChange(downloadURL);
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleUploadImage(selectedFile);
    }
  };

  const handleRemoveImage = async () => {
    if (coverImage) {
      
      const storage = getStorage(app);
      const imageRef = ref(storage, coverImage);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        if (error.code !== "storage/object-not-found") {
          console.error("Error deleting image:", error);
        }
      }
    }
    onImageChange("");
  };

  return (
    <div className="w-full h-auto flex-col justify-start items-start gap-3 inline-flex">
      <div className="self-stretch text-black text-base font-medium font-['Inter'] leading-normal">
        Upload Book Cover
      </div>

      <div className="self-stretch h-[126px] px-3.5 py-2.5 bg-indigo-50 rounded-lg border border-indigo-700 flex-col justify-center items-center gap-2 flex">
        <div className="h-[58px] flex-col justify-start items-center gap-2 flex">
          <img src={page} alt="page" />
          <div className="self-stretch">
            <span className="text-black text-xs font-normal font-['Inter'] leading-[18px]">
              Drag and Drop file here or
            </span>
            <label className="text-black text-xs font-medium font-['Inter'] pl-[2px] underline leading-[18px] cursor-pointer">
              Choose file
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {coverImage && (
        <div className="w-full h-auto flex-col justify-start items-start gap-3 inline-flex">
          <div className="self-stretch px-3.5 py-2.5 bg-slate-100 rounded-lg justify-between items-center inline-flex border-indigo-700">
            <div className="p-1 bg-white rounded border border-gray-300 justify-start items-center gap-2.5 flex">
              <img
                className="w-[68.52px] h-[104px]"
                src={coverImage}
                alt="Book cover"
              />
            </div>
            <div
              onClick={handleRemoveImage}
              className="px-3.5 py-2 bg-red-50 rounded-lg shadow border border-red-300 justify-center items-center gap-2 flex cursor-pointer"
            >
              <img src={bin} alt="bin" />
              <div className="text-red-700 text-sm font-semibold font-['Inter'] leading-tight">
                Remove
              </div>
            </div>
          </div>
        </div>
      )}
      {imageUploadProgress > 0 && (
        <div>
          <p className="text-green-500">
            Upload progress: {imageUploadProgress}%
          </p>
        </div>
      )}
      {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
    </div>
  );
};

export default ImageUpload;