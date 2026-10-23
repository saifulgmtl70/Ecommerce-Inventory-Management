
import React, { useEffect, useRef, useState } from "react";
import { FaTags, FaImage, FaPlus, FaArrowLeft, FaTimes, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import axios from "axios";

// Paste your NEW ImgBB API key here.
// Do not use an API key that has already been exposed publicly.
const imgbbAPIKey = "d8071d1fd460bb31d496e9077fef1917";

const AddCategory = () => {
    const navigate = useNavigate();

    // Protected backend API: MongoDB category operations
    const axiosSecure = useAxiosSecure();

    // Public API: ImgBB image upload
    const axiosPublic = useAxiosPublic();

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [imageError, setImageError] = useState("");
    const [saving, setSaving] = useState(false);

    // Create and clean up the local image preview URL.
    useEffect(() => {
        if (!selectedImage) {
            setPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedImage]);

    // Handle category name input.
    const handleNameChange = (event) => {
        setFormData({
            ...formData,
            name: event.target.value
        });
    };

    // Open the device's file picker.
    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    // Validate and select an image.
    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        // Allow selecting the same file again later.
        event.target.value = "";

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setImageError("Please select a JPG, PNG, or WebP image.");
            toast.error("Please select a JPG, PNG, or WebP image.");
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setImageError("Image size must not exceed 5 MB.");
            toast.error("Image size must not exceed 5 MB.");
            return;
        }

        setImageError("");
        setSelectedImage(file);
    };

    // Remove the selected image.
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImageError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Upload the selected image to ImgBB.
    const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) {
    throw new Error("Please select a category image.");
  }

  if (!(imageFile instanceof File)) {
    throw new Error("Invalid image file. Please select the image again.");
  }

  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  if (imageFile.size === 0) {
    throw new Error("The selected image is empty. Please choose another image.");
  }

  const imgbbAPIKey = "d8071d1fd460bb31d496e9077fef1917";

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        params: {
          key: imgbbAPIKey,
        },
        timeout: 60000,
      }
    );

    if (!response.data?.success || !response.data?.data?.url) {
      throw new Error("ImgBB did not return a valid image URL.");
    }

    return response.data.data.url;
  } catch (error) {
    console.error("ImgBB upload failed:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      response: error.response?.data,
    });

    if (error.code === "ECONNABORTED") {
      throw new Error("Image upload timed out. Please try again.");
    }

    if (error.response) {
      throw new Error(
        error.response.data?.error?.message ||
          `Image upload failed. HTTP status: ${error.response.status}`
      );
    }

    throw new Error(
      "Could not upload the image. Please select the image again and retry."
    );
  }
};


    // Save category.
    const handleSubmit = async (event) => {
        event.preventDefault();

        const categoryName = formData.name.trim();

        if (!categoryName) {
            toast.error("Please enter a category name.");
            return;
        }

        if (!selectedImage) {
            setImageError("Please select a category image.");
            toast.error("Please select a category image.");
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            // Step 1: Check whether the category already exists.
            const categoriesResponse = await axiosSecure.get("/categories");

            const categories = Array.isArray(categoriesResponse.data)
                ? categoriesResponse.data
                : [];

            const categoryExists = categories.some(
                (category) =>
                    category.name?.trim().toLowerCase() ===
                    categoryName.toLowerCase()
            );

            if (categoryExists) {
                toast.error("This category already exists.");
                return;
            }


            const imageUrl = await uploadImageToImgBB(selectedImage);

            // Step 3: Save the category name and ImgBB URL in MongoDB.
            await axiosSecure.post("/categories", {
                name: categoryName,
                image: imageUrl
            });

            toast.success("Category added successfully!");

            // Step 4: Reset the form.
            setFormData({
                name: ""
            });

            setSelectedImage(null);
            setImageError("");

            // Step 5: Navigate to the category management page.
            navigate("/admindashboard/manageCategory");
        } catch (error) {
            console.error("Add category error:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 409) {
                toast.error(message || "This category already exists.");
            } else if (status === 401 || status === 403) {
                toast.error(
                    "You are not authorized to add categories. Please check your admin login."
                );
            } else if (
                error.message?.includes("ImgBB API key")
            ) {
                toast.error(error.message);
            } else if (error.response?.config?.url?.includes("api.imgbb.com")) {
                toast.error(
                    error.response?.data?.error?.message ||
                    "Image upload failed. Please check your ImgBB API key and internet connection."
                );
            } else {
                toast.error(
                    message ||
                    "Failed to add category. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="my-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admindashboard/manageCategory")
                            }
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#D51243]"
                        >
                            <FaArrowLeft />
                            Back to Categories
                        </button>

                        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800 sm:text-3xl">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D51243]/10 text-[#D51243]">
                                <FaTags />
                            </span>
                            Add New Category
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Create a category and upload its image.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6">

                    {/* Form */}
                    <div className="w-full">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
                        >
                            <div className="mb-7">
                                <h2 className="text-lg font-bold text-gray-800">
                                    Category Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Enter the category name and choose an image.
                                </p>
                            </div>

                            {/* Category Name */}
                            <div className="mb-7">
                                <label
                                    htmlFor="categoryName"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Category Name
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaTags />
                                    </span>

                                    <input
                                        id="categoryName"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        placeholder="Enter category name"
                                        maxLength={100}
                                        required
                                        disabled={saving}
                                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#D51243] focus:ring-2 focus:ring-[#D51243]/10 disabled:bg-gray-100"
                                    />
                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Choose a clear and descriptive name.
                                </p>
                            </div>

                            {/* Category Image */}
                            <div className="mb-8">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Category Image
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={saving}
                                />

                                {!selectedImage ? (
                                    <button
                                        type="button"
                                        onClick={handleChooseImage}
                                        disabled={saving}
                                        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center transition hover:border-[#D51243] hover:bg-[#D51243]/5 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D51243]/10 text-2xl text-[#D51243]">
                                            <FaUpload />
                                        </span>

                                        <span className="text-sm font-semibold text-gray-700">
                                            Click to choose an image
                                        </span>

                                        <span className="mt-2 text-xs text-gray-400">
                                            JPG, PNG or WebP · Maximum 5 MB
                                        </span>
                                    </button>
                                ) : (
                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <FaImage className="shrink-0 text-[#D51243]" />

                                                <span className="truncate text-sm font-medium text-gray-700">
                                                    {selectedImage.name}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                disabled={saving}
                                                aria-label="Remove selected image"
                                                className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>

                                        {previewUrl && (
                                            <div className="flex min-h-56 items-center justify-center bg-gray-100 p-4">
                                                <img
                                                    src={previewUrl}
                                                    alt="Category preview"
                                                    className="max-h-72 max-w-full rounded-lg object-contain"
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Image selected
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Size:{" "}
                                                    {(
                                                        selectedImage.size /
                                                        (1024 * 1024)
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleChooseImage}
                                                disabled={saving}
                                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#D51243] hover:text-[#D51243] disabled:opacity-50"
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {imageError && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {imageError}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/admindashboard/manageCategory"
                                        )
                                    }
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D51243] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b80f39] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                            Uploading & Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus />
                                            Add Category
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tips Card */}
                    
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
