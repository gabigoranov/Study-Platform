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
import QuizRevision from "./QuizRevision";
import { Route, Routes, useNavigate } from "react-router";
import { queryClient } from "@/main";

type View = "list" | "create" | "edit" | "view" | "revise";

export default function QuizzesDashboard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [view, setView] = useState<View>("list");
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>(undefined);
  const [viewingQuizId, setViewingQuizId] = useState<string | null>(null);
  const [revisingQuizId, setRevisingQuizId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedGroupId, selectedSubjectId } = useVariableContext();
  const navigate = useNavigate();

  // Fetch quizzes
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes", selectedGroupId, selectedSubjectId],
    queryFn: () => quizService.getAll(token!, `group/${selectedGroupId}`),
  });

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Quiz) =>
      quizService.create(quizService.quizToDTO(data), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", selectedGroupId, selectedSubjectId],
      });
      setView("list");
      navigate("/quizzes");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Quiz }) =>
      quizService.update(id, quizService.quizToDTO(data), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", selectedGroupId, selectedSubjectId],
      });
      setView("list");
      navigate("/quizzes");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => quizService.deleteSingle(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes", selectedGroupId, selectedSubjectId],
      });
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
    setView("edit");
    navigate("/quizzes/edit");
  };

  const handleView = (quizId: string) => {
    setViewingQuizId(quizId);
    setView("view");
    navigate(`/quizzes/view/${quizId}`);
  };

  const handleRevise = (quizId: string) => {
    setRevisingQuizId(quizId);
    setView("revise");
    navigate(`/quizzes/revise/${quizId}`);
  };

  const handleCancel = () => {
    setView("list");
    setEditingQuiz(undefined);
    navigate("/quizzes");
  };

  const handleBackToList = () => {
    setView("list");
    setViewingQuizId(null);
    setRevisingQuizId(null);
    navigate("/quizzes");
  };

  const handleBackToView = () => {
    setView("view");
    navigate(`/quizzes/view/${viewingQuizId}`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <QuizDashboardHeader
        onCreateNew={() => {
          setView("create");
          navigate("/quizzes/create");
        }}
        onSearch={setSearchTerm}
        searchValue={searchTerm}
      />
      <div className="w-full h-full flex-1 relative">
        <Routes>
          <Route
            path="/"
            element={
              <div className="rounded-md border bg-card p-6">
                <QuizList
                  quizzes={filteredQuizzes}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onRevise={handleRevise}
                  loading={isLoading}
                />
              </div>
            }
          />
          <Route
            path="create"
            element={
              <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
                <QuizForm
                  model={editingQuiz}
                  onSubmit={(data) => {
                    handleSubmit(data);
                    setView("list");
                    navigate("/quizzes");
                  }}
                  onCancel={handleCancel}
                  submitLabel={t(keys.createQuizButton)}
                />
              </div>
            }
          />
          <Route
            path="edit"
            element={
              <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
                <QuizForm
                  model={editingQuiz}
                  onSubmit={(data) => {
                    handleSubmit(data);
                    setView("list");
                    navigate("/quizzes");
                  }}
                  onCancel={handleCancel}
                  submitLabel={t(keys.updateQuizButton)}
                />
              </div>
            }
          />
          <Route
            path="view/:quizId"
            element={
              viewingQuizId ? (
                <QuizDetailsPage
                  quizId={viewingQuizId}
                  onBack={handleBackToList}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>{t("Quiz not found")}</p>
                </div>
              )
            }
          />
          <Route
            path="revise/:quizId"
            element={
              revisingQuizId ? (
                <div className="flex h-full items-center justify-center">
                  <QuizRevision
                    quizId={revisingQuizId}
                    onBack={handleBackToList}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>{t("Quiz not found")}</p>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}
