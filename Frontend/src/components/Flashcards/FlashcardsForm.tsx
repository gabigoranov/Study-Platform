import React, { useState } from "react";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useVariableContext } from "@/context/VariableContext";

interface FlashcardsFormProps {
  model?: FlashcardDTO;
  onSubmit: (data: FlashcardDTO) => void;
  submitLabel: string;
}

export default function FlashcardsForm({ model, onSubmit, submitLabel }: FlashcardsFormProps) {
  const { selectedGroupId } = useVariableContext();
  const [data, setData] = useState<FlashcardDTO>(model || { front: "", back: "", title: "", materialSubGroupId: selectedGroupId!});
  const [errors, setErrors] = useState<Partial<Record<keyof FlashcardDTO, string>>>({});

  const handleChange = (field: keyof FlashcardDTO, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!data.front.trim()) newErrors.front = "Front side is required";
    if (!data.back.trim()) newErrors.back = "Back side is required";
    if (!data.title.trim()) newErrors.title = "A title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full h-full md:max-w-[50%] md:max-h-[75%] mx-auto py-8 px-6 bg-white rounded shadow dark:bg-surface"
    >
      <div>
        <Label htmlFor="front">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={e => handleChange("title", e.target.value)}
          required
        />
        {errors.front && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="front">Front of the card</Label>
        <Input
          id="front"
          value={data.front}
          onChange={e => handleChange("front", e.target.value)}
          required
        />
        {errors.front && <p className="text-red-500 text-sm mt-1">{errors.front}</p>}
      </div>

      <div>
        <Label htmlFor="back">Back of the card</Label>
        <Textarea
          id="back"
          value={data.back}
          onChange={e => handleChange("back", e.target.value)}
          rows={4}
          required
        />
        {errors.back && <p className="text-red-500 text-sm mt-1">{errors.back}</p>}
      </div>

      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );
}
