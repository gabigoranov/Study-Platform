import { CreateMindmapDTO } from "@/data/DTOs/CreateMindmapDTO";
import { apiService } from "./apiService";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";

export const mindmapsService = apiService<MindmapDTO, CreateMindmapDTO, MindmapDTO>("mindmaps");
