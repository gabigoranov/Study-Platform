import { Quiz } from "@/data/Quiz";
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
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";

interface QuizFormProps {
  model?: Quiz | undefined;
  onSubmit: (data: Quiz) => void;
  submitLabel?: string;
  onCancel?: () => void; // optional for edit mode
}

const quizSchema = z.object({
  title: z.string().min(1, "A title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(Difficulty),
  materialSubGroupId: z.string().min(1, "Material sub group ID is required"),
});

export default function QuizForm({
  model,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}: QuizFormProps) {
  const { selectedGroupId } = useVariableContext();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: model?.title ?? "",
      description: model?.description ?? "",
      difficulty: model?.difficulty ?? Difficulty.Easy,
      materialSubGroupId: model?.materialSubGroupId ?? selectedGroupId!,
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        title: model.title,
        description: model.description,
        difficulty: model?.difficulty ?? Difficulty.Easy,
        materialSubGroupId: model?.materialSubGroupId ?? selectedGroupId!,
      });
    }
  }, [model, form, selectedGroupId]);

  function handleSubmit(values: z.infer<typeof quizSchema>) {
    onSubmit({
      ...model,
      id: model?.id || "",
      userId: model?.userId || "",
      dateCreated: model?.dateCreated || new Date(),
      questions: model?.questions || [],
      ...values,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 w-full md:max-w-[50%] mx-auto py-8 px-6 bg-background-muted rounded shadow dark:bg-surface"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(keys.title)}</FormLabel>
              <FormControl>
                <Input placeholder={t(keys.enterTitle)} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(keys.Description)}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(keys.enterQuizDescription)}
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
                <FormLabel>{t(keys.difficulty)}</FormLabel>
                <FormControl>
                  <Select
                    value={stringValue}
                    onValueChange={(val) => field.onChange(Number(val))} // convert back to number
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t(keys.selectDifficulty)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Difficulty.Easy.toString()}>
                        {t(keys.difficultyEasy)}
                      </SelectItem>
                      <SelectItem value={Difficulty.Medium.toString()}>
                        {t(keys.difficultyMedium)}
                      </SelectItem>
                      <SelectItem value={Difficulty.Hard.toString()}>
                        {t(keys.difficultyHard)}
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