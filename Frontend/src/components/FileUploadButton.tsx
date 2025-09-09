import React, { useRef } from "react";
import { Button } from "./Button";

interface FileUploadButtonProps {
  onFileSelect: (files: FileList) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <>
      <Button type="button" onClick={handleClick}>
        Upload Study Materials
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        aria-label="Upload study materials"
      />
    </>
  );
};
