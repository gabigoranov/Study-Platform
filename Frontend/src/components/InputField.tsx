import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};
