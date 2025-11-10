import { MaterialSubGroupDTO } from "@/data/DTOs/MaterialSubGroupDTO";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type MaterialSubGroupFormProps = {
  onSubmit: (data: MaterialSubGroupDTO) => void;
  submitLabel: string;
  model?: MaterialSubGroupDTO;
  subjectId: string; // Need subjectId to create the material sub group
};

const materialSubGroupSchema = z.object({
  title: z.string().min(1, "A title is required"),
  materialGroupType: z.string().min(1, "A group type is required"),
});

export default function MaterialSubGroupForm({ 
  onSubmit, 
  submitLabel, 
  model, 
  subjectId 
}: MaterialSubGroupFormProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof materialSubGroupSchema>>({
    resolver: zodResolver(materialSubGroupSchema),
    defaultValues: {
      title: model?.title ?? "",
      materialGroupType: model?.materialGroupType ?? "",
    },
  });

  function handleSubmit(values: z.infer<typeof materialSubGroupSchema>) {
    onSubmit({
      ...values,
      subjectId: subjectId
    });
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(keys.title) || "Title"}</FormLabel>
              <FormControl>
                <Input placeholder={t("Enter title")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="materialGroupType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Type</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}