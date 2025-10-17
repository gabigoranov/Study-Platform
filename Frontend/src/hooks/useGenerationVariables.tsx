import { useState, useEffect, ChangeEvent } from "react";

export function useGenerationVariables() {
  const [customPrompt, setCustomPrompt] = useState<string>();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    console.log("file updated", file);
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
  };

  return {
    customPrompt,
    setCustomPrompt,
    file,
    setFile,
    loading,
    setLoading,
    error,
    setError,
    reviewing,
    setReviewing,
    handleFileChange,
  };
}
