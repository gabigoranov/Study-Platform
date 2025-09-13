import { useForm } from "react-hook-form";
import { SubjectDTO } from "@/data/DTOs/SubjectDTO";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";

type SubjectFormProps = {
    onSubmit: (data: SubjectDTO) => void;
    submitLabel: string;
    model?: SubjectDTO;
}

export default function SubjectForm({ onSubmit, submitLabel, model }: SubjectFormProps) {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm<SubjectDTO>({
        defaultValues: model
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="title">{t(keys.subjectNameLabel)}</Label>
                <Input
                    id="title"
                    {...register("title", { required: t(keys.requiredField) })}
                    className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full">
                {submitLabel}
            </Button>
        </form>
    );
}
