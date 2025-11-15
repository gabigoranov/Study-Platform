import { useState } from "react";
import { Quiz } from "@/data/Quiz";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit3 } from "lucide-react";
import DifficultyTag from "../Common/DifficultyTag";

interface QuizListProps {
  quizzes: Quiz[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
  onRevise?: (id: string) => void;
  loading?: boolean;
}

export default function QuizList({ 
  quizzes, 
  onEdit, 
  onDelete,
  onView,
  onRevise,
  loading = false 
}: QuizListProps) {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t(keys.title)}</TableHead>
            <TableHead>{t(keys.Description)}</TableHead>
            <TableHead>{t(keys.difficulty)}</TableHead>
            <TableHead>{t(keys.actions)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                {t(keys.loading)}
              </TableCell>
            </TableRow>
          ) : quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>
                  <DifficultyTag difficulty={quiz.difficulty} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRevise?.(quiz.id)}
                    >
                      {t(keys.reviseButtonLabel)}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(quiz.id)}
                    >
                      {t(keys.viewButton)}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(quiz)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(quiz.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                {t("noQuizzes")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}