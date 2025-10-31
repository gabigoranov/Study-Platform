import { CreateMindmapDTO } from "@/data/DTOs/CreateMindmapDTO";
import { apiService } from "./apiService";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { Mindmap } from "@/data/Mindmap";

export const mindmapsService = apiService<Mindmap, CreateMindmapDTO, MindmapDTO>("mindmaps");
