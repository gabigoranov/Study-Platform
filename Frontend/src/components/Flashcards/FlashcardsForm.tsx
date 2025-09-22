import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useVariableContext } from "@/context/VariableContext";
import { useEffect } from "react";
import { Difficulty } from "@/data/Difficulty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FlashcardsFormProps {
  model?: FlashcardDTO;
  onSubmit: (data: FlashcardDTO) => void;
  submitLabel?: string;
  onCancel?: () => void; // optional for edit mode
}

const flashcardSchema = z.object({
  title: z.string().min(1, "A title is required"),
  front: z.string().min(1, "Front side is required"),
  back: z.string().min(1, "Back side is required"),
  difficulty: z.enum(Difficulty),
});

export default function FlashcardsForm({
  model,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}: FlashcardsFormProps) {
  const { selectedGroupId } = useVariableContext();

  const form = useForm<z.infer<typeof flashcardSchema>>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      title: model?.title ?? "",
      front: model?.front ?? "",
      back: model?.back ?? "",
      difficulty: model?.difficulty ?? Difficulty.Easy,
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        title: model.title,
        front: model.front,
        back: model.back,
        difficulty: model?.difficulty ?? Difficulty.Easy,
      });
    }
  }, [model, form]);

  function handleSubmit(values: z.infer<typeof flashcardSchema>) {
    onSubmit({
      ...model,
      ...values,
      materialSubGroupId: model?.materialSubGroupId ?? selectedGroupId!,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 w-full md:max-w-[50%] mx-auto py-8 px-6 bg-white rounded shadow dark:bg-surface"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front</FormLabel>
              <FormControl>
                <Input placeholder="Enter question here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter answer here..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => {
            const stringValue = field.value.toString(); // convert enum number to string

            return (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select
                    value={stringValue}
                    onValueChange={(val) => field.onChange(Number(val))} // convert back to number
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Difficulty.Easy.toString()}>
                        Easy
                      </SelectItem>
                      <SelectItem value={Difficulty.Medium.toString()}>
                        Medium
                      </SelectItem>
                      <SelectItem value={Difficulty.Hard.toString()}>
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="rounded-xl"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" className="rounded-xl">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
