import React, { useState } from "react";
import { InputField } from "./InputField";
import { TextAreaField } from "./TextAreaField";
import { Button } from "./Button";
import { Flashcard } from "../data/Flashcard";

interface FlashcardFormProps {
  initialData?: Omit<Flashcard, "id">;
  onSubmit: (data: Omit<Flashcard, "id">) => void;
  submitLabel: string;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({ initialData, onSubmit, submitLabel }) => {
  const [front, setFront] = useState(initialData?.front || "");
  const [back, setBack] = useState(initialData?.back || "");
  const [userId, setUserId] = useState(initialData?.userId || "");
  const [errors, setErrors] = useState<{ front?: string; back?: string; userId?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!front.trim()) newErrors.front = "Front side is required";
    if (!back.trim()) newErrors.back = "Back side is required";
    if (!userId.trim()) newErrors.userId = "User ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ front, back, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <InputField id="front" label="Front" value={front} onChange={e => setFront(e.target.value)} error={errors.front} />
      <TextAreaField id="back" label="Back" value={back} onChange={e => setBack(e.target.value)} error={errors.back} rows={4} />
      <InputField id="userId" label="User ID" value={userId} onChange={e => setUserId(e.target.value)} error={errors.userId} />
      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );
};
