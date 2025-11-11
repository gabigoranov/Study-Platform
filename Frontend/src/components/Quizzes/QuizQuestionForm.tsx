import { QuizQuestionDTO } from "@/data/DTOs/QuizQuestionDTO";
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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface QuizQuestionFormProps {
  model?: QuizQuestionDTO | undefined;
  quizId: string;
  onSubmit: (data: QuizQuestionDTO) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const quizQuestionSchema = z.object({
  description: z.string().min(1, "Question description is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  correctQuizQuestionAnswerId: z.string().min(1, "Correct answer is required"),
});

export default function QuizQuestionForm({
  model,
  quizId,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}: QuizQuestionFormProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof quizQuestionSchema>>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      description: model?.description ?? "",
      quizId: quizId ?? "",
      correctQuizQuestionAnswerId: model?.correctQuizQuestionAnswerId ?? "",
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        description: model.description,
        quizId: model.quizId,
        correctQuizQuestionAnswerId: model.correctQuizQuestionAnswerId,
      });
    }
  }, [model, form]);

  function handleSubmit(values: z.infer<typeof quizQuestionSchema>) {
    onSubmit({
      ...model,
      ...values,
      quizId: quizId, // Ensure quizId is preserved
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(keys.Question)}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("Enter question text")}
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="correctQuizQuestionAnswerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(keys.CorrectAnswer)}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select correct answer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* This would be populated with actual answer options if available */}
                    <SelectItem value="">No answers added yet</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="rounded-xl"
            >
              {t("Cancel")}
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