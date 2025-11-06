import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
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
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Difficulty } from "@/data/Difficulty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface MindmapFormProps {
  model?: MindmapDTO | undefined;
  onSubmit: (data: MindmapDTO) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const mindmapSchema = z.object({
  title: z.string().min(1, "A title is required"),
  description: z.string().min(1, "A description is required"),
  difficulty: z.enum(Difficulty),
});

export default function MindmapsForm({
  model,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}: MindmapFormProps) {
  const { selectedGroupId } = useVariableContext();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof mindmapSchema>>({
    resolver: zodResolver(mindmapSchema),
    defaultValues: {
      title: model?.title ?? "",
      description: model?.description ?? "",
      difficulty: model?.difficulty ?? Difficulty.Easy,
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        title: model.title,
        description: model.description,
        difficulty: model.difficulty,
      });
    }
  }, [model, form]);

  function handleSubmit(values: z.infer<typeof mindmapSchema>) {
    onSubmit({
      ...model!,
      ...values,
      materialSubGroupId: model?.materialSubGroupId ?? selectedGroupId!,
      data: model?.data ?? { nodes: [], edges: [] },
      subjectId: model?.subjectId ?? 0,
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
              <FormLabel>{t(keys.title)}</FormLabel>
              <FormControl>
                <Input placeholder={t("Enter mindmap title...")} {...field} />
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
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("Enter a short description...")}
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
                      <SelectValue placeholder={t("Select difficulty")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Difficulty.Easy.toString()}>
                        {t("Easy")}
                      </SelectItem>
                      <SelectItem value={Difficulty.Medium.toString()}>
                        {t("Medium")}
                      </SelectItem>
                      <SelectItem value={Difficulty.Hard.toString()}>
                        {t("Hard")}
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
