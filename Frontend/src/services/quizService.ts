import { Quiz } from "@/data/Quiz";
import { apiService } from "./apiService";
import { QuizDTO } from "@/data/DTOs/QuizDTO";
import { BASE_URL } from "@/types/urls";
import { CreateQuizDTO } from "@/data/DTOs/CreateQuizDTO";

const quizServiceBase = apiService<Quiz, CreateQuizDTO, QuizDTO>("quizzes");

// Helper functions to convert between models and DTOs
export const quizToDTO = (quiz: Quiz): QuizDTO => {
  return {
    id: quiz.id,
    title: quiz.title,
    userId: quiz.userId,
    materialSubGroupId: quiz.materialSubGroupId,
    dateCreated: quiz.dateCreated,
    difficulty: quiz.difficulty,
    description: quiz.description,
    questions: quiz.questions
  };
};

export const quizFromDTO = (dto: QuizDTO): Quiz => {
  return {
    id: dto.id || "",
    title: dto.title,
    userId: dto.userId || "",
    materialSubGroupId: dto.materialSubGroupId,
    dateCreated: dto.dateCreated || new Date(),
    difficulty: dto.difficulty,
    description: dto.description,
    questions: dto.questions
  };
};

// Additional methods for quiz management
const addQuestionsToQuiz = async (token: string, quizId: string, questions: any[]): Promise<any> => {
  const response = await fetch(`${BASE_URL}/quizzes/${quizId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(questions)
  });
  
  if (!response.ok) {
    throw new Error('Failed to add questions to quiz');
  }
  
  return response.json();
};

// Create the service with helper functions
export const quizService = {
  ...quizServiceBase,
  quizToDTO,
  quizFromDTO,
  addQuestionsToQuiz
};