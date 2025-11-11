import { QuizQuestionAnswerDTO } from "@/data/DTOs/QuizQuestionAnswerDTO";
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

interface QuizQuestionAnswerFormProps {
  model?: QuizQuestionAnswerDTO | undefined;
  quizQuestionId: string;
  onSubmit: (data: QuizQuestionAnswerDTO) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const quizQuestionAnswerSchema = z.object({
  description: z.string().min(1, "Answer description is required"),
  quizQuestionId: z.string().min(1, "Quiz question ID is required"),
});

export default function QuizQuestionAnswerForm({
  model,
  quizQuestionId,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}: QuizQuestionAnswerFormProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof quizQuestionAnswerSchema>>({
    resolver: zodResolver(quizQuestionAnswerSchema),
    defaultValues: {
      description: model?.description ?? "",
      quizQuestionId: quizQuestionId ?? "",
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        description: model.description,
        quizQuestionId: model.quizQuestionId,
      });
    }
  }, [model, form]);

  function handleSubmit(values: z.infer<typeof quizQuestionAnswerSchema>) {
    onSubmit({
      ...model,
      ...values,
      quizQuestionId: quizQuestionId, // Ensure quizQuestionId is preserved
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
              <FormLabel>{t(keys.Answer)}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("Enter answer text")}
                  {...field}
                  rows={3}
                />
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