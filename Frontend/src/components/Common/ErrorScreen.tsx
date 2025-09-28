import React from "react";
import { Button } from "../ui/button";

type ErrorScreenProps = {
  /** Main error message */
  label?: string;
  /** Handler for retry button */
  onRetry?: () => void;
  /** Handler for cancel button */
  onCancel?: () => void;
  /** Optional custom text for retry button */
  retryLabel?: string;
  /** Optional custom text for cancel button */
  cancelLabel?: string;
  /** Optional custom image URL */
  imageUrl?: string;
  /** Additional className for container */
  className?: string;
};

export default function ErrorScreen({
  label = "Oops! Something went wrong.",
  onRetry,
  onCancel,
  retryLabel = "Retry",
  cancelLabel = "Cancel",
  imageUrl = "https://cdn-icons-png.flaticon.com/512/1828/1828843.png", // Example error illustration
  className = "",
} : ErrorScreenProps) {
  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center gap-6 p-6 bg-background text-error rounded-xl ${className}`}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Error"
          className="w-32 h-32 object-contain animate-bounce"
        />
      )}
      <h2 className="text-2xl font-semibold text-center">{label}</h2>

      <div className="flex gap-4 mt-4">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="px-6 py-2 bg-error hover:bg-error-light text-text-inverted rounded-xl transition-transform transform hover:scale-105"
          >
            {retryLabel}
          </Button>
        )}
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-6 py-2 border border-error-light text-error hover:bg-surface rounded-xl transition-transform transform hover:scale-105"
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
