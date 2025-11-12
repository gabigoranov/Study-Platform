import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { quizService } from "@/services/quizService";
import { useAuth } from "@/hooks/useAuth";
import QuizList from "@/components/Quizzes/QuizList";
import QuizForm from "@/components/Quizzes/QuizForm";
import QuizDashboardHeader from "@/components/Quizzes/QuizDashboardHeader";
import QuizDetailsPage from "./QuizDetailsPage";
import { Quiz } from "@/data/Quiz";
import { useVariableContext } from "@/context/VariableContext";

export default function QuizzesDashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>(undefined);
  const [viewingQuizId, setViewingQuizId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {selectedGroupId, selectedSubjectId} = useVariableContext();

  // Fetch quizzes
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes", selectedGroupId, selectedSubjectId],
    queryFn: () => quizService.getAll(token!, `group/${selectedGroupId}`),
  });

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Quiz) => quizService.create(quizService.quizToDTO(data), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", selectedGroupId, selectedSubjectId] });
      setShowForm(false);
      setEditingQuiz(undefined);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Quiz }) =>
      quizService.update(id, quizService.quizToDTO(data), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", selectedGroupId, selectedSubjectId] });
      setShowForm(false);
      setEditingQuiz(undefined);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => quizService.deleteSingle(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", selectedGroupId, selectedSubjectId] });
    },
  });

  const handleSubmit = (data: Quiz) => {
    if (editingQuiz) {
      updateMutation.mutate({ id: editingQuiz.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowForm(true);
  };

  const handleView = (quizId: string) => {
    setViewingQuizId(quizId);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuiz(undefined);
  };

  const handleBackToList = () => {
    setViewingQuizId(null);
  };

  return (
    <div className="w-full h-full">
      {viewingQuizId ? (
        <QuizDetailsPage quizId={viewingQuizId} onBack={handleBackToList} />
      ) : showForm ? (
        <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
          <QuizForm
            model={editingQuiz}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={editingQuiz ? t(keys.updateQuizButton) : t(keys.createQuizButton)}
          />
        </div>
      ) : (
        <>
          <QuizDashboardHeader
            onCreateNew={() => setShowForm(true)}
            onSearch={setSearchTerm}
            searchValue={searchTerm}
          />
          <div className="rounded-md border bg-card p-6">
            <QuizList
              quizzes={filteredQuizzes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              loading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}