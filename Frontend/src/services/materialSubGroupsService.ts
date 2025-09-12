import { MaterialSubGroup } from "@/data/MaterialSubGroup";
import { apiService } from "./apiService";
import { MaterialSubGroupDTO } from "@/data/DTOs/MaterialSubGroupDTO";

export const materialSubGroupsService = apiService<MaterialSubGroup, MaterialSubGroupDTO, MaterialSubGroupDTO>("materialSubGroups");


// import { MaterialSubGroup } from "@/data/MaterialSubGroup";
// import { Subject } from "@/data/Subject";
// import { BASE_URL } from "@/types/urls";



// export const materialSubGroupsService = {
//   getAll: async (token: string, subjectId: string): Promise<MaterialSubGroup[]> => {
//     const response = await fetch(`${BASE_URL}/materialSubGroups/subject/${subjectId}?includeMaterials=true`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     console.log("API asdasdas");
//     console.log(data);

//     return data;
//   },

//   // getById: async (id: string, token: string): Promise<Subject> => {
//   //   const response = await fetch(`${BASE_URL}/subjects/${id}`, {
//   //     method: "GET",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //       Authorization: `Bearer ${token}`,
//   //     }
//   //   });

//   //   return response.json();
//   // },

//   // // create: async (flashcard: FlashcardDTO, token: string): Promise<Flashcard> => {
//   // //   const response = await fetch(`${BASE_URL}/flashcards`, {
//   // //     method: "POST",
//   // //     headers: {
//   // //       "Content-Type": "application/json",
//   // //       Authorization: `Bearer ${token}`,
//   // //     },
//   // //     body: JSON.stringify(flashcard),
//   // //   });

//   // //   return response.json();
//   // // },

//   // // update: async (id: string, flashcard: FlashcardDTO, token: string): Promise<Flashcard> => {
//   // //   const response = await fetch(`${BASE_URL}/flashcards/${id}`, {
//   // //     method: "PUT",
//   // //     headers: {
//   // //       "Content-Type": "application/json",
//   // //       Authorization: `Bearer ${token}`,
//   // //     },
//   // //     body: JSON.stringify(flashcard),
//   // //   });

//   // //   return response.json();
//   // // },

//   // delete: async (id: string, token: string): Promise<void> => {
//   //   await fetch(`${BASE_URL}/subjects/${id}`, {
//   //     method: "DELETE",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //       Authorization: `Bearer ${token}`,
//   //     }
//   //   });
//   // },
// };
