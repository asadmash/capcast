"use client"; //make the entire component client site because we are using useState
import FileInput from "@/components/FileInput"; //
import FormField from "@/components/FormField";
import React, { ChangeEvent, useState } from "react";

const Page = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  });

  // an object to store the videos
  const video = {};
  // an object to store the thumbnails
  const thumbnail = {};

  const [error, setError] = useState(null); //state declaration for error handleing

  // a function to handle input change
  const handleInputChange = (e: ChangeEvent) => {
    const { name, value } = e.target; //extract the name and value from the target

    // set the name value data to the formData
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="wrapper-md upload-page">
      <h1>Upload a video</h1>
      {/* when error become true this div will be show with the error message */}
      {error && <div className="erro-field">{error}</div>}
      {/* a form to take user input */}
      <form className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"></form>
      <FormField
        id="title"
        label="Title"
        placeholder="Enter a clear and concise video title"
        value={formData.title}
        onChange={handleInputChange} //on change event listener
      />
      <FormField
        id="Description"
        label="Description"
        placeholder="Describe what this video is about"
        value={formData.description}
        as="textarea"
        onChange={handleInputChange} //on change event listener
      />
      {/* file input element to render file upload componenet */}
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

      {/* input element to render thumbnail upload component */}
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

      <FormField
        id="visibility"
        label="Visibility"
        value={formData.visibility}
        as="select"
        options={[
          { value: "public", label: "Public" },
          { value: "private", label: "Private" },
        ]}
        onChange={handleInputChange} //on change event listener
      />
    </div>
  );
};

export default Page;
