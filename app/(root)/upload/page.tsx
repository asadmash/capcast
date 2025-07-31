"use client"; // This makes the component run on the client side, enabling hooks like useState
import FileInput from "@/components/FileInput"; // Custom file input component for video and thumbnail
import FormField from "@/components/FormField"; // Custom form field component for text inputs
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants"; // Size limits for uploads
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from "@/lib/actions/video"; // Server action to get video upload URL and access key
import { useFileInput } from "@/lib/hooks/useFileInput"; // Custom hook to manage file input state
import { log } from "console";
import React, { ChangeEvent, FormEvent, useState } from "react";

// Function to upload a file to Bunny.net using a pre-signed URL and access key
const uploadFileToBunny = (
  file: File,
  uploadUrl: string,
  accessKey: string
): Promise<void> => {
  return fetch(uploadUrl, {
    method: "PUT", // Use PUT method for direct upload
    headers: {
      "Content-Type": file.type, // Set the file's MIME type
      AccessKey: accessKey, // Bunny.net access key for authentication
    },
    body: file, // The file to upload
  }).then((response) => {
    if (!response.ok) throw new Error("Upload failed"); // Throw error if upload fails
  });
};

// Main upload page component
const Page = () => {
  // State to handle submit button loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to handle video duration
  const [videoDuration, setVideoDuration] = useState(0);

  // State to manage form data for video details
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  });

  // State and handlers for video file input
  const video = useFileInput(MAX_VIDEO_SIZE);
  // State and handlers for thumbnail file input
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  // State for error messages
  const [error, setError] = useState("");

  // Handle changes to text inputs (title, description, visibility)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form behavior
    setIsSubmitting(true); // Show loading state

    try {
      // Validate that both video and thumbnail files are selected
      if (!video.file || !thumbnail.file) {
        setError("Please upload video and thumbnail.");
        return;
      }
      // Validate that title and description are filled
      if (!formData.title || !formData.description) {
        setError("Please fill in all the details.");
        return;
      }

      // Get upload URL and access key from server
      const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey,
      } = await getVideoUploadUrl();

      // Error handling for missing upload credentials
      if (!videoUploadUrl || !videoAccessKey)
        throw new Error("Failed to get video upload credentials");

      // Upload the video file to Bunny.net
      await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);

     // Get upload URL and access key from server
      const {
        uploadUrl: thumbnailUploadUrl,
        accessKey: thumbnailAccessKey,
        cdnUrl:thumbnailCdnUrl,
      } = await getThumbnailUploadUrl(videoId);

 // Error handling for missing upload credentials
      if (!thumbnailUploadUrl || !thumbnailCdnUrl || !thumbnailAccessKey)
        throw new Error("Failed to get thumbnail upload credentials");

      //Attach thumbnail
      await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey);

      //Create a new DB entry for the video details(url, data)
      await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration,
      })

    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="wrapper-md upload-page">
      <h1>Upload a video</h1>
      {/* Show error message if any */}
      {error && <div className="erro-field">{error}</div>}
      {/* Form for video upload */}
      <form
        className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
        onSubmit={handleSubmit}
      >
        {/* Title input field */}
        <FormField
          id="title"
          label="Title"
          placeholder="Enter a clear and concise video title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {/* Description input field */}
        <FormField
          id="description"
          label="Description"
          placeholder="Describe what this video is about"
          value={formData.description}
          as="textarea"
          onChange={handleInputChange}
        />
        {/* Video file input */}
        <FileInput
          id="video"
          label="video"
          accept="video/*"
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type="video"
        />
        {/* Thumbnail file input */}
        <FileInput
          id="thumbnail"
          label="Thumbnail"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type="image"
        />
        {/* Visibility select field */}
        <FormField
          id="visibility"
          label="Visibility"
          value={formData.visibility}
          as="select"
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
          onChange={handleInputChange}
        />
        {/* Submit button */}
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Uploading..." : "Upload video"}
        </button>
      </form>
    </div>
  );
};

export default Page;
