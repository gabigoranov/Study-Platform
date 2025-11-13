import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CheckCircle, Edit, Trash2, XCircle } from "lucide-react";
import Loading from "../Common/Loading";
import ErrorScreen from "../Common/ErrorScreen";
import { t } from "i18next";
import { keys } from "@/types/keys";
import { GeneratedQuizDTO } from "@/data/DTOs/GeneratedQuizDTO";

type ReviewGeneratedQuizProps = {
  quiz: GeneratedQuizDTO;
  onApprove: (quiz: GeneratedQuizDTO) => void;
  loading?: boolean;
  onCancel: () => void;
  error?: boolean;
};

export default function ReviewGeneratedQuiz({
  quiz,
  onApprove,
  loading = false,
  error = false,
  onCancel,
}: ReviewGeneratedQuizProps) {
  // If an error occurs, show the error screen with buttons to retry or cancel
  if (error) {
    return <ErrorScreen onRetry={() => onApprove(quiz)} onCancel={onCancel} />;
  }

  const [data, setData] = useState<GeneratedQuizDTO>(quiz);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  function handleDeleteQuestion(index: number) {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== index),
    }));
  }

  function handleDeleteAnswer(questionIndex: number, answerIndex: number) {
    setData((prev) => {
      const updated = { ...prev };
      updated.questions = [...prev.questions];
      updated.questions[questionIndex] = {
        ...prev.questions[questionIndex],
        answers: prev.questions[questionIndex].answers.filter(
          (_, idx) => idx !== answerIndex
        ),
      };
      return updated;
    });
  }

  function handleToggleCorrectAnswer(questionIndex: number, answerIndex: number) {
    setData((prev) => {
      const updated = { ...prev };
      updated.questions = [...prev.questions];
      updated.questions[questionIndex] = {
        ...prev.questions[questionIndex],
        answers: prev.questions[questionIndex].answers.map((ans, idx) => ({
          ...ans,
          isCorrect: idx === answerIndex,
        })),
      };
      return updated;
    });
  }

  if (loading) {
    return <Loading isLoading={loading} label={t(keys.submittingQuizLabel)} />;
  }

  return (
    <div className="relative flex flex-col gap-6 w-full h-full p-4 max-w-6xl mx-auto">
      {/* Quiz Title */}
      <div className="bg-card border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-foreground">{data.title}</h2>
        <h4 className="text-xl font-normal text-text-muted">{data.description}</h4>
        <p className="text-muted-foreground mt-2">
          {data.questions.length} {data.questions.length === 1 ? "Question" : "Questions"}
        </p>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-6">
        {data.questions.map((question, qIdx) => (
          <Card key={qIdx} className="shadow-xl border-0 bg-gradient-to-br from-surface to-surface-muted">
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-lg px-3 py-1 rounded-full bg-primary/10 text-primary">
                      Q{qIdx + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground">
                      {question.description}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsEditing(true);
                      setEditingQuestionIndex(qIdx);
                    }}
                    className="hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteQuestion(qIdx)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Answers */}
              <div className="grid gap-3 ml-12">
                {question.answers.map((answer, aIdx) => {
                  const isCorrect = answer.isCorrect;
                  return (
                    <div
                      key={aIdx}
                      className={`p-4 rounded-lg border-2 flex items-center justify-between transition-all ${
                        isCorrect
                          ? "bg-success/10 border-success"
                          : "bg-muted border-muted-foreground/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-mono font-bold text-sm min-w-[28px] h-[28px] flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          {String.fromCharCode(65 + aIdx)}
                        </span>
                        <span className="text-base font-medium">{answer.description}</span>
                        {isCorrect && (
                          <CheckCircle className="h-5 w-5 text-success ml-2" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCorrectAnswer(qIdx, aIdx)}
                          className={`text-xs ${
                            isCorrect ? "text-success" : "text-muted-foreground"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Mark Correct"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAnswer(qIdx, aIdx)}
                          className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      {onApprove && (
        <div className="fixed bottom-[2rem] right-[3rem] sm:bottom-[4rem] sm:right-[4rem] flex gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl shadow-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onApprove(data)}
            className="px-6 py-3 rounded-xl shadow-lg"
            disabled={data.questions.length === 0}
          >
            Approve Quiz
          </Button>
        </div>
      )}
    </div>
  );
}