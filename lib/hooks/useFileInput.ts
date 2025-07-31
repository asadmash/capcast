import { ChangeEvent, useRef, useState } from "react";

export const useFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  //   keep track and deal with file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];

      // check the size of the file
      if (selectedFile.size > maxSize) return; //if larger than maxSize

      if (previewUrl) URL.revokeObjectURL(previewUrl); //remove reference of the previewURL
      setFile(selectedFile); //update the file state with selected file

      const objectURL = URL.createObjectURL(selectedFile);

      setPreviewUrl(objectURL);

      if (selectedFile.type.startsWith("video")) {
        const video = document.createElement("video");

        video.preload = "metadata";

        video.onloadedmetadata = () => {
          if (isFinite(video.duration) && video.duration > 0) {
            setDuration(Math.round(video.duration));
          } else {
            setDuration(0);
          }

          URL.revokeObjectURL(video.src);
        };
        video.src = objectURL;
      }
    }
  };

  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(null);
    setPreviewUrl("");
    setDuration(0);

    if (inputRef.current) inputRef.current.value = "";
  };

  //return everything from this hook
  return { file, previewUrl, duration, inputRef, handleFileChange, resetFile };
};
