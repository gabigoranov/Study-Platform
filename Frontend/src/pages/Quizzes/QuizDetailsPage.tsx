import { useState } from "react";
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
import { Plus, X, Edit3, Trash2, PlusCircle } from "lucide-react";
import DifficultyTag from "../../components/Common/DifficultyTag";
import { QuizQuestionDTO } from "@/data/DTOs/QuizQuestionDTO";

interface QuizDetailsPageProps {
  quizId: string;
  onBack: () => void;
}

export default function QuizDetailsPage({ quizId, onBack }: QuizDetailsPageProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getById(quizId, token!),
  });

  // Mutation for adding questions to quiz
  const addQuestionsMutation = useMutation({
    mutationFn: (questions: any[]) => 
      quizService.addQuestionsToQuiz(token!, quizId, questions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // Update mutation for entire quiz
  const updateQuizMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Quiz }) => 
      quizService.update(id, quizService.quizToDTO(data), token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // State for creating a new question (step by step)
  const [newQuestion, setNewQuestion] = useState({
    description: "",
    answers: Array(4).fill("")
  });

  // State for answers being entered
  const [answerInputs, setAnswerInputs] = useState(Array(4).fill(""));
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  // State for editing questions
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; description: string } | null>(null);

  if (isLoading) {
    return <div>{t(keys.loading)}</div>;
  }

  if (!quiz) {
    return <div>{t("Quiz not found")}</div>;
  }

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
      answers: Array(4).fill("")
    });
    setAnswerInputs(Array(4).fill(""));
    setCorrectAnswerIndex(null);
  };

  // Finish creating a question process
  const finishCreatingQuestion = () => {
    if (newQuestion.description.trim() === "" || answerInputs.some(a => a.trim() === "")) {
      return;
    }

    if (correctAnswerIndex === null) {
      return;
    }

    // Create question with answers in the format expected by the API
    const questionToSubmit = {
      description: newQuestion.description,
      quizId: quiz.id,
      answers: answerInputs.map((desc, idx) => ({
        description: desc,
        isCorrect: idx == correctAnswerIndex
      }))
    } as QuizQuestionDTO;

    console.log(questionToSubmit);

    addQuestionsMutation.mutate([questionToSubmit]);
    setIsCreatingQuestion(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuiz: Quiz = {
      ...quiz,
      questions: quiz.questions.filter(q => q.id !== questionId)
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
  };

  const handleUpdateQuestion = (questionId: string, newDescription: string) => {
    const updatedQuiz: Quiz = {
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === questionId ? { ...q, description: newDescription } : q
      )
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
    setEditingQuestion(null);
  };

  const updateAnswerForQuestion = (questionId: string, answerId: string, newDescription: string) => {
    const updatedQuiz: Quiz = {
      ...quiz,
      questions: quiz.questions.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: q.answers.map(a => 
                a.id === answerId ? { ...a, description: newDescription } : a
              )
            }
          : q
      )
    };
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
  };

  const deleteAnswerFromQuestion = (questionId: string, answerId: string) => {
    const updatedQuiz: Quiz = {
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
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
  };

  const setCorrectAnswerForQuestion = (questionId: string, answerId: string) => {
    const updatedQuiz: Quiz = {
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
    updateQuizMutation.mutate({ id: quiz.id, data: updatedQuiz });
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
        <p className="text-lg"><strong>{t(keys.Description)}: </strong>{quiz.description}</p>
      </div>

      {/* Add new question form */}
      {isCreatingQuestion ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t(keys.addNewQuestion)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t(keys.Question)}</label>
                <Textarea
                  placeholder={t(keys.enterQuestionText)}
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">{t(keys.answers)}</label>
                {answerInputs.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`${t(keys.answer)} ${index + 1}`}
                      value={answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                    <Button
                      variant={correctAnswerIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSetCorrectAnswer(index)}
                    >
                      {correctAnswerIndex === index ? t(keys.CorrectAnswer) : t(keys.setCorrect)}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={finishCreatingQuestion} 
                  disabled={correctAnswerIndex === null || answerInputs.some(a => a.trim() === "")}
                >
                  {t(keys.addQuestion)}
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingQuestion(false)}>
                  {t(keys.cancel)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={startCreatingQuestion} className="mb-6">
          <Plus className="mr-2 h-4 w-4" />
          {t(keys.addQuestion)}
        </Button>
      )}

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
                          {t(keys.save)}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingQuestion(null)}
                        >
                          {t(keys.cancel)}
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
                  <h4 className="font-medium mb-2">{t(keys.answers)}:</h4>
                  <div className="space-y-2">
                    {question.answers && question.answers.length > 0 ? (
                      question.answers.map((answer, index) => (
                        <div key={answer.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{answer.description}</span>
                          <div className="flex gap-2">
                            {question.correctQuizQuestionAnswerId === answer.id && (
                              <Badge variant="secondary">{t(keys.CorrectAnswer)}</Badge>
                            )}
                            <Button 
                              variant={question.correctQuizQuestionAnswerId === answer.id ? "default" : "outline"}
                              size="sm" 
                              onClick={() => setCorrectAnswerForQuestion(question.id, answer.id)}
                            >
                              {t("setCorrect")}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => deleteAnswerFromQuestion(question.id, answer.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">{t(keys.noAnswersAddedYet)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {t(keys.noQuestionsAddedYet)}
          </div>
        )}
      </div>
    </div>
  );
}