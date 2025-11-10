import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Flashcard } from "../data/Flashcard";
import { BASE_URL } from "@/types/urls";

// Abstract service for common CRUD Api calls.
export const apiService = <T, TCreate = Partial<T>, TUpdate = Partial<T>>(resource: string) =>
{  
  return {
    getAll: async (
      token: string,
      route?: string | null,
      params?: Record<string, string | number | boolean>
    ): Promise<T[]> => {
      let url = `${BASE_URL}/${resource}`;
      if (route) url += `/${route}`;
      if (params) url += "?" + new URLSearchParams(params as any).toString();    

      const response = await fetch(url, {
        method: "GET",  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });    

      if (!response.ok) throw new Error(`Error fetching ${resource}: ${response.statusText}`);
      return response.json();
    },

    getById: async (id: string, token: string, params?: Record<string, string | number | boolean>): Promise<T> => {
      let url = `${BASE_URL}/${resource}/${id}`;

      if (params) url += "?" + new URLSearchParams(params as any).toString();    

      const response = await fetch(url, {
        method: "GET",  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });    

      if (!response.ok) throw new Error(`Error fetching ${resource}: ${response.statusText}`);
      return response.json();
    },

    create: async (model: TCreate, token: string, params?: Record<string, string | number | boolean>): Promise<T> => {
        let url = `${BASE_URL}/${resource}`;

        if (params) url += "?" + new URLSearchParams(params as any).toString();
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(model),
        });

        return response.json();
    },

    createBulk: async (model: TCreate[], token: string, params?: Record<string, string | number | boolean>): Promise<T[]> => {
        let url = `${BASE_URL}/${resource}/bulk`;

        if (params) url += "?" + new URLSearchParams(params as any).toString();
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(model),
        });
        
        return response.json();
    },

    update: async (id: string, model: TUpdate, token: string, params?: Record<string, string | number | boolean>): Promise<T> => {
        let url = `${BASE_URL}/${resource}/${id}`;

        if (params) url += "?" + new URLSearchParams(params as any).toString();
        
        const response = await fetch(url, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(model),
        });

        return response.json();
    },  
    
    delete: async (token: string, params?: Record<string, string | number | boolean>): Promise<void> => {
        let url = `${BASE_URL}/${resource}`;
        if (params) url += "?" + new URLSearchParams(params as any).toString();
        
        await fetch(url, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          }
        });
    },

    deletesSingle: async (token: string, id:string): Promise<void> => {
        let url = `${BASE_URL}/${resource}/${id}`;
        
        await fetch(url, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          }
        });
    },
  }
};