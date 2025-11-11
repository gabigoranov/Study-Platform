import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { quizService } from "@/services/quizService";
import { useAuth } from "@/hooks/useAuth";
import { QuizDTO } from "@/data/DTOs/QuizDTO";
import { Quiz } from "@/data/Quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit3, Trash2, PlusCircle } from "lucide-react";
import DifficultyTag from "@/components/Common/DifficultyTag";
import { useVariableContext } from "@/context/VariableContext";

interface QuizDetailsPageProps {
  quizId: string;
  onBack: () => void;
}

export default function QuizDetailsPage({ quizId, onBack }: QuizDetailsPageProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const {selectedGroupId, selectedSubjectId} = useVariableContext();
  
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getById(quizId,token!),
  });

  // Update mutation for entire quiz
  const updateQuizMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuizDTO }) => 
      quizService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", selectedGroupId, selectedSubjectId] });
    },
  });

  // State for managing questions and answers
  const [newQuestion, setNewQuestion] = useState({
    description: "",
    answers: [] as { id: string; description: string }[],
    newAnswer: ""
  });

  // State for editing questions
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; description: string } | null>(null);

  if (isLoading) {
    return <div>{t(keys.loading)}</div>;
  }

  if (!quiz) {
    return <div>{t("Quiz not found")}</div>;
  }

  const handleAddQuestion = () => {
    if (newQuestion.description.trim() === "") return;

    const questionId = `temp-${Date.now()}`;
    const updatedQuiz = {
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          id: questionId,
          description: newQuestion.description,
          quizId: quiz.id,
          correctQuizQuestionAnswerId: "",
          answers: [],
          correctQuizQuestionAnswer: {
            id: "",
            description: "",
            quizQuestionId: questionId
          }
        }
      ]
    };

    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz as unknown as QuizDTO });
    setNewQuestion({ description: "", answers: [], newAnswer: "" });
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.filter(q => q.id !== questionId)
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz as unknown as QuizDTO });
  };

  const handleUpdateQuestion = (questionId: string, newDescription: string) => {
    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === questionId ? { ...q, description: newDescription } : q
      )
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz as unknown as QuizDTO });
    setEditingQuestion(null);
  };

  const handleAddAnswer = (questionId: string) => {
    if (newQuestion.newAnswer.trim() === "") return;

    const answerId = `temp-${Date.now()}-${Math.random()}`;
    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: answerId,
                  description: newQuestion.newAnswer,
                  quizQuestionId: questionId
                }
              ]
            }
          : q
      )
    };

    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz as unknown as QuizDTO });
    setNewQuestion({ ...newQuestion, newAnswer: "" });
  };

  const handleDeleteAnswer = (questionId: string, answerId: string) => {
    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: q.answers.filter(a => a.id !== answerId)
            }
          : q
      )
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz as unknown as QuizDTO });
  };

  const handleSetCorrectAnswer = (questionId: string, answerId: string) => {
    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === questionId 
          ? {
              ...q,
              correctQuizQuestionAnswerId: answerId
            }
          : q
      )
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz as unknown as QuizDTO });
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← {t("backToList")}
          </Button>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <DifficultyTag difficulty={quiz.difficulty} />
        </div>
      </div>

      <div className="mb-8 p-4 bg-muted rounded-lg">
        <p className="text-lg"><strong>{t("Description")}: </strong>{quiz.description}</p>
      </div>

      {/* Add new question form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("Add New Question")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder={t("Enter question text")}
              value={newQuestion.description}
              onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                {t("Add Question")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  {editingQuestion && editingQuestion.id === question.id ? (
                    <div className="flex-1 mr-2">
                      <Input
                        value={editingQuestion.description}
                        onChange={(e) => setEditingQuestion({...editingQuestion, description: e.target.value})}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateQuestion(question.id, editingQuestion.description)}
                        >
                          {t("Save")}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingQuestion(null)}
                        >
                          {t("Cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg">{question.description}</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingQuestion({id: question.id, description: question.description})}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">{t("Answers")}:</h4>
                  <div className="space-y-2">
                    {question.answers && question.answers.length > 0 ? (
                      question.answers.map((answer) => (
                        <div key={answer.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{answer.description}</span>
                          <div className="flex gap-2">
                            {question.correctQuizQuestionAnswerId === answer.id && (
                              <Badge variant="secondary">{t("Correct")}</Badge>
                            )}
                            <Button 
                              variant={question.correctQuizQuestionAnswerId === answer.id ? "default" : "outline"}
                              size="sm" 
                              onClick={() => handleSetCorrectAnswer(question.id, answer.id)}
                            >
                              {t("Set Correct")}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteAnswer(question.id, answer.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">{t("No answers added yet")}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder={t("Enter answer text")}
                    value={newQuestion.newAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, newAnswer: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddAnswer(question.id);
                      }
                    }}
                  />
                  <Button onClick={() => handleAddAnswer(question.id)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("Add Answer")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {t("No questions added yet")}
          </div>
        )}
      </div>
    </div>
  );
}