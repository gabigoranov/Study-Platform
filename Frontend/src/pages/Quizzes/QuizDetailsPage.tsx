import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { quizService } from "@/services/quizService";
import { useAuth } from "@/hooks/useAuth";
import { Quiz } from "@/data/Quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit3, Trash2, Save, AlertCircle } from "lucide-react";
import DifficultyTag from "../../components/Common/DifficultyTag";
import { QuizQuestionDTO } from "@/data/DTOs/QuizQuestionDTO";
import { QuizDTO } from "@/data/DTOs/QuizDTO";

interface QuizDetailsPageProps {
  quizId: string;
  onBack: () => void;
}

export default function QuizDetailsPage({
  quizId,
  onBack,
}: QuizDetailsPageProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // State for creating a new question (step by step)
  const [newQuestion, setNewQuestion] = useState({
    description: "",
    answers: Array(4).fill(""),
  });

  // State for answers being entered
  const [answerInputs, setAnswerInputs] = useState(Array(4).fill(""));
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  // State for editing questions
  const [editModeQuestions, setEditModeQuestions] = useState<Set<string>>(
    new Set()
  );
  const [questionTexts, setQuestionTexts] = useState<Record<string, string>>(
    {}
  );
  const [answerTexts, setAnswerTexts] = useState<
    Record<string, Record<string, string>>
  >({});

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getById(quizId, token!),
  });

  // Mutation for adding questions to quiz
  const addQuestionsMutation = useMutation({
    mutationFn: (questions: any[]) =>
      quizService.addQuestionsToQuiz(token!, quizId, questions),
    onSuccess: (quizDto: QuizDTO) => {
      console.log(quizDto)

      queryClient.setQueryData(["quiz", quizId], (old: Quiz | undefined) => {
        if (!old) return old;
        return quizDto;
      });
      
      //queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // Update mutation for entire quiz
  const updateQuizMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Quiz }) =>
      quizService.update(id, quizService.quizToDTO(data), token!),
    onSuccess: (updatedQuiz) => {
      // Directly update the quiz cache to avoid reorder flicker
      queryClient.setQueryData(["quiz", quizId], (old: Quiz | undefined) => {
        if (!old) return updatedQuiz;
        return {
          ...old,
          ...updatedQuiz,
          questions: updatedQuiz.questions ?? old.questions, // preserve stable order
        };
      });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // Mutation for deleting a question
  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) =>
      quizService.deleteSingle(token!, questionId, "question"),
    onSuccess: (_, questionId) => {
      queryClient.setQueryData(["quiz", quizId], (old: Quiz | undefined) => {
        if (!old) return old;
        return {
          ...old,
          questions: old.questions.filter((q) => q.id !== questionId),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // Initialize question texts when quiz loads - MOVED BEFORE EARLY RETURNS
  useEffect(() => {
    if (quiz && quiz.questions) {
      const initialQuestionTexts: Record<string, string> = {};
      const initialAnswerTexts: Record<string, Record<string, string>> = {};

      quiz.questions.forEach((question) => {
        initialQuestionTexts[question.id] = question.description;
        initialAnswerTexts[question.id] = {};
        question.answers.forEach((answer) => {
          initialAnswerTexts[question.id][answer.id] = answer.description;
        });
      });

      setQuestionTexts(initialQuestionTexts);
      setAnswerTexts(initialAnswerTexts);
    }
  }, [quiz]);

  // Helper function to check if a question is in edit mode
  const isQuestionInEditMode = (questionId: string) => {
    return editModeQuestions.has(questionId);
  };

  // Helper function to toggle edit mode for a question
  const toggleQuestionEditMode = (questionId: string) => {
    const newSet = new Set(editModeQuestions);
    if (newSet.has(questionId)) {
      newSet.delete(questionId);
    } else {
      newSet.add(questionId);
    }
    setEditModeQuestions(newSet);
  };

  // Update question text in local state
  const updateQuestionText = (questionId: string, text: string) => {
    setQuestionTexts((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  // Update answer text in local state
  const updateAnswerText = (
    questionId: string,
    answerId: string,
    text: string
  ) => {
    setAnswerTexts((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [answerId]: text,
      },
    }));
  };

  // Handle answer input changes
  const handleAnswerChange = (index: number, value: string) => {
    const newInputs = [...answerInputs];
    newInputs[index] = value;
    setAnswerInputs(newInputs);
  };

  // Handle setting correct answer
  const handleSetCorrectAnswer = (index: number) => {
    setCorrectAnswerIndex(index);
  };

  // Start creating a question process
  const startCreatingQuestion = () => {
    setIsCreatingQuestion(true);
    setNewQuestion({
      description: "",
      answers: Array(4).fill(""),
    });
    setAnswerInputs(Array(4).fill(""));
    setCorrectAnswerIndex(null);
  };

  // Finish creating a question process
  const finishCreatingQuestion = () => {
    if (
      newQuestion.description.trim() === "" ||
      answerInputs.some((a) => a.trim() === "")
    ) {
      return;
    }

    if (correctAnswerIndex === null) {
      return;
    }

    // Create question with answers in the format expected by the API
    const questionToSubmit = {
      description: newQuestion.description,
      quizId: quiz!.id,
      answers: answerInputs.map((desc, idx) => ({
        description: desc,
        isCorrect: idx === correctAnswerIndex,
      })),
    } as QuizQuestionDTO;

    addQuestionsMutation.mutate([questionToSubmit]);
    setIsCreatingQuestion(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (
      window.confirm(
        t(
          "Are you sure you want to delete this question? This action cannot be undone."
        )
      )
    ) {
      deleteQuestionMutation.mutate(questionId);
    }
  };

  const saveQuestionEdits = (questionId: string) => {
    if (!quiz) return;

    const updatedQuiz: Quiz = {
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              description: questionTexts[questionId] || q.description,
              answers: q.answers.map((a) => ({
                ...a,
                description: answerTexts[questionId]?.[a.id] || a.description,
              })),
            }
          : q
      ),
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
    toggleQuestionEditMode(questionId);
  };

  const cancelQuestionEdits = (questionId: string) => {
    if (!quiz) return;

    const question = quiz.questions.find((q) => q.id === questionId);
    if (question) {
      // Revert to original text
      setQuestionTexts((prev) => ({
        ...prev,
        [questionId]: question.description,
      }));

      const revertedAnswers: Record<string, string> = {};
      question.answers.forEach((answer) => {
        revertedAnswers[answer.id] = answer.description;
      });

      setAnswerTexts((prev) => ({
        ...prev,
        [questionId]: revertedAnswers,
      }));
    }
    toggleQuestionEditMode(questionId);
  };

  const deleteAnswerFromQuestion = (questionId: string, answerId: string) => {
    if (!quiz) return;

    const question = quiz.questions.find((q) => q.id === questionId);
    if (question && question.answers.length <= 2) {
      alert(t("A question must have at least 2 answers"));
      return;
    }

    const updatedQuiz: Quiz = {
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.filter((a) => a.id !== answerId),
            }
          : q
      ),
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
  };

  const setCorrectAnswerForQuestion = (
    questionId: string,
    answerId: string
  ) => {
    if (!quiz) return;

    const updatedQuiz: Quiz = {
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              correctQuizQuestionAnswerId: answerId,
            }
          : q
      ),
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t(keys.loading)}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-xl font-semibold">{t("Quiz not found")}</p>
        </div>
      </div>
    );
  }

  const filledAnswersCount = answerInputs.filter((a) => a.trim() !== "").length;
  const canAddQuestion =
    newQuestion.description.trim() !== "" &&
    filledAnswersCount >= 2 &&
    correctAnswerIndex !== null;

  return (
    <div className="w-full sm:max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← {t("backToList")}
        </Button>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <DifficultyTag difficulty={quiz.difficulty} />
        </div>

        <p className="text-muted-foreground">{quiz.description}</p>
      </div>

      {/* Add New Question Section */}
      <div className="mb-8">
        {isCreatingQuestion ? (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t(keys.addNewQuestion)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t(keys.Question)} <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder={t(keys.enterQuestionText)}
                  value={newQuestion.description}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  {t(keys.answers)} <span className="text-destructive">*</span>
                  <span className="text-muted-foreground text-xs ml-2">
                    (At least 2 answers required)
                  </span>
                </label>
                {answerInputs.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`${t(keys.answer)} ${index + 1}`}
                        value={answer}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant={
                        correctAnswerIndex === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleSetCorrectAnswer(index)}
                      disabled={answer.trim() === ""}
                      className="min-w-[120px]"
                    >
                      {correctAnswerIndex === index
                        ? "✓ " + t(keys.CorrectAnswer)
                        : t(keys.setCorrect)}
                    </Button>
                  </div>
                ))}
                {correctAnswerIndex === null && filledAnswersCount >= 2 && (
                  <p className="text-sm text-warning flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Please select the correct answer
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={finishCreatingQuestion}
                  disabled={!canAddQuestion || addQuestionsMutation.isPending}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {addQuestionsMutation.isPending
                    ? t("Adding...")
                    : t(keys.addQuestion)}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingQuestion(false)}
                  disabled={addQuestionsMutation.isPending}
                >
                  {t(keys.cancel)}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={startCreatingQuestion} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            {t(keys.addQuestion)}
          </Button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {t("Questions")} ({quiz.questions?.length || 0})
        </h2>

        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((question, qIndex) => (
            <Card
              key={question.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {isQuestionInEditMode(question.id) ? (
                      <Textarea
                        value={
                          questionTexts[question.id] || question.description
                        }
                        onChange={(e) =>
                          updateQuestionText(question.id, e.target.value)
                        }
                        className="mb-3"
                        rows={2}
                      />
                    ) : (
                      <CardTitle className="text-lg flex items-start gap-2">
                        <span className="text-muted-foreground">
                          Q{qIndex + 1}.
                        </span>
                        <span>{question.description}</span>
                      </CardTitle>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isQuestionInEditMode(question.id) ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveQuestionEdits(question.id)}
                          disabled={updateQuizMutation.isPending}
                          className="gap-1"
                        >
                          <Save className="h-4 w-4" />
                          {t(keys.save)}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelQuestionEdits(question.id)}
                          disabled={updateQuizMutation.isPending}
                        >
                          {t(keys.cancel)}
                        </Button>
                      </>
                    ) : (
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleQuestionEditMode(question.id)}
                          className="gap-1"
                        >
                          <Edit3 className="h-4 w-4" />
                          {t(keys.edit)}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-destructive hover:text-destructive gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t(keys.delete)}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {question.answers && question.answers.length > 0 ? (
                    question.answers.map((answer, aIndex) => {
                      const isCorrect =
                        question.correctQuizQuestionAnswerId === answer.id;
                      return (
                        <div
                          key={answer.id}
                          className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            isCorrect && !isQuestionInEditMode(question.id)
                              ? "bg-success-light/10 border-success-light/20 dark:text-text-inverted dark:bg-success-dark dark:border-success-dark"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-muted-foreground font-medium min-w-[24px]">
                              {String.fromCharCode(65 + aIndex)}.
                            </span>
                            {isQuestionInEditMode(question.id) ? (
                              <Input
                                defaultValue={answer.description}
                                onChange={(e) =>
                                  updateAnswerText(
                                    question.id,
                                    answer.id,
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                            ) : (
                              <span className="flex-1">
                                {answer.description}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isCorrect &&
                              !isQuestionInEditMode(question.id) && (
                                <Badge
                                  variant="default"
                                  className="bg-success hover:bg-success py-1.5"
                                >
                                  {t(keys.CorrectAnswer)}
                                </Badge>
                              )}
                            {isQuestionInEditMode(question.id) && (
                              <Button
                                variant={isCorrect ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setCorrectAnswerForQuestion(
                                    question.id,
                                    answer.id
                                  )
                                }
                                disabled={updateQuizMutation.isPending}
                              >
                                {isCorrect
                                  ? "✓ " + t("Correct")
                                  : t("setCorrect")}
                              </Button>
                            )}
                            {isQuestionInEditMode(question.id) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteAnswerFromQuestion(
                                    question.id,
                                    answer.id
                                  )
                                }
                                className="text-destructive hover:text-destructive"
                                disabled={updateQuizMutation.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      {t(keys.noAnswersAddedYet)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {t(keys.noQuestionsAddedYet)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the "Add Question" button above to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
