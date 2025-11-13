import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Input } from "@/components/ui/input";
import UploadFileButton from "../Common/UploadFileButton";

interface QuizDashboardHeaderProps {
  onCreateNew: () => void;
  onSearch: (value: string) => void;
  searchValue: string;
}

export default function QuizDashboardHeader({
  onCreateNew,
  onSearch,
  searchValue,
}: QuizDashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{t(keys.quizzesDashboardTitle)}</h1>
        <p className="text-muted-foreground">{t(keys.quizzesDashboardText)}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Input
          placeholder={t(keys.searchPlaceholder)}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full sm:w-[200px]"
        />
        <UploadFileButton defaultActionId={"generateQuizzes"} />
        <Button onClick={onCreateNew} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t(keys.createNewQuiz)}
        </Button>
      </div>
    </div>
  );
}