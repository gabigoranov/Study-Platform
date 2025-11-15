import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/services/quizService";
import { useAuth } from "@/hooks/useAuth";
import { Quiz } from "@/data/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, RotateCcw, XCircle } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { usersService } from "@/services/usersService";

interface QuizRevisionProps {
  quizId: string;
  onBack: () => void;
}

export default function QuizRevision({ quizId, onBack }: QuizRevisionProps) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isRevisionFinished, setIsRevisionFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: { selected: string | null, isCorrect: boolean } }>({});

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getById(quizId, token!),
  });

  // Initialize user answers when quiz loads
  useEffect(() => {
    if (quiz) {
      const initialAnswers: { [questionId: string]: { selected: string | null, isCorrect: boolean } } = {};
      quiz.questions.forEach(question => {
        initialAnswers[question.id] = { selected: null, isCorrect: false };
      });
      setUserAnswers(initialAnswers);
    }
  }, [quiz]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t(keys.loading)}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-xl font-semibold">{t("Quiz not found")}</p>
        </div>
      </div>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-xl font-semibold">{t("This quiz has no questions")}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = currentQuestion.correctQuizQuestionAnswerId === selectedAnswer;
    const updatedUserAnswers = { ...userAnswers };
    updatedUserAnswers[currentQuestion.id] = { selected: selectedAnswer, isCorrect };
    setUserAnswers(updatedUserAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      usersService.updateScore(token!, score*10);
      setIsRevisionFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsRevisionFinished(false);
    const resetAnswers: { [questionId: string]: { selected: string | null, isCorrect: boolean } } = {};
    quiz.questions.forEach(question => {
      resetAnswers[question.id] = { selected: null, isCorrect: false };
    });
    setUserAnswers(resetAnswers);
  };

  if (isRevisionFinished) {
    return (
      <div className="flex flex-col bg-background-muted items-center justify-center p-6 max-w-2xl mx-auto rounded-xl">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-6 mb-6 shadow-lg">
          <CheckCircle className="h-16 w-16 text-white mx-auto" />
        </div>
        
        <h2 className="text-3xl font-bold mb-2">{t(keys.revisionComplete)}</h2>
        <p className="text-xl text-muted-foreground mb-8">
          {t(keys.youScored)} <span className="font-bold text-primary">{score}</span> {t(keys.outOf)} {totalQuestions}
        </p>

        <div className="w-full max-w-md bg-card p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">{t(keys.summary)}</h3>
          <div className="space-y-3">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              return (
                <div key={question.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm font-medium">{t(keys.questionNumbering)} {index + 1}</span>
                  <div className="flex items-center gap-2">
                    {userAnswer?.isCorrect ? (
                      <span className="text-success font-medium">{t(keys.correct)}</span>
                    ) : (
                      <span className="text-destructive font-medium">{t(keys.incorrect)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handleRetry} className="px-6">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t(keys.retry)}
          </Button>
          <Button onClick={onBack} className="px-6">
            {t(keys.backToDashboard)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4">
      {/* Progress bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>
            {t(keys.questionNumbering)} {currentQuestionIndex + 1} {t(keys.outOf)} {totalQuestions}
          </span>
          <span>
            {t(keys.score)}: {score}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz content */}
      <Card className="flex-1 flex flex-col shadow-xl border-0 bg-gradient-to-br from-surface to-surface-muted rounded-xl overflow-hidden">
        <CardContent className="flex-1 p-6 flex flex-col relative">
          {/* Question header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-foreground mb-4 px-4">
              {currentQuestion.description}
            </h2>
          </div>

          {/* Answer options */}
          <div className="grid gap-4 flex-1 max-w-2xl mx-auto w-full">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === answer.id;
              const isCorrect = currentQuestion.correctQuizQuestionAnswerId === answer.id;
              
              let answerClass = "border-2 hover:border-primary/50 transition-all duration-300";
              
              if (isAnswerSubmitted) {
                if (isSelected && isCorrect) {
                  answerClass = "bg-success border-success text-text shadow-lg transform scale-[1.02]";
                } else if (isSelected && !isCorrect) {
                  answerClass = "bg-error/20 border-error text-destructive transform scale-[1.02]";
                } else if (!isSelected && isCorrect) {
                  answerClass = "bg-success/30 border-success text-text";
                } else {
                  answerClass = "bg-muted border-muted-foreground/20";
                }
              } else if (isSelected) {
                answerClass = "bg-primary/10 border-primary text-primary transform scale-[1.02]";
              }
              
              return (
                <button
                  key={answer.id}
                  className={`p-5 text-left rounded-xl ${answerClass} transition-all duration-200 flex items-center`}
                  onClick={() => handleAnswerSelect(answer.id)}
                  disabled={isAnswerSubmitted}
                >
                  <div className="flex items-center w-full">
                    <span className="font-mono font-bold text-lg mr-4 min-w-[32px] h-[32px] flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg font-medium flex-1">{answer.description}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle className="ml-4 h-6 w-6 text-current" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="ml-4 h-6 w-6 text-current" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit/Next button */}
          <div className="mt-8 flex justify-center">
            {!isAnswerSubmitted ? (
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={!selectedAnswer}
                className="px-8 py-6 text-lg h-auto rounded-xl shadow-lg"
              >
                {t(keys.submitAnswer)}
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion} 
                className="px-8 py-6 text-lg h-auto rounded-xl shadow-lg"
              >
                {currentQuestionIndex < totalQuestions - 1 ? t(keys.nextQuestion) : t(keys.finishRevision)}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}