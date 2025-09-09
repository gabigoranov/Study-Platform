import React from "react";

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};
