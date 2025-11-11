import { Quiz } from "@/data/Quiz";
import { apiService } from "./apiService";
import { QuizDTO } from "@/data/DTOs/QuizDTO";

export const quizService = apiService<Quiz, QuizDTO, QuizDTO>("quizzes");