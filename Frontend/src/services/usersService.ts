import { AppUser } from "@/data/AppUser";
import { apiService } from "./apiService";


export const usersService = apiService<AppUser, AppUser, AppUser>("users");