import { supabase } from "@/lib/supabaseClient";

export const storageService = {
  // Upload a file to user-specific folder
  async uploadFile(userId: string, file: File, bucket: string): Promise<string> {
    const filePath = `${userId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  // List all files for a user
  async listFiles(userId: string, bucket: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(userId, { limit: 100, offset: 0 });

    if (error) throw error;

    return data;
  },

  // Delete a user file
  async deleteFile(userId: string, fileName: string, bucket: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([`${userId}/${fileName}`]);

    if (error) throw error;

    return true;
  },

  // Get public URL for a file
  async getPublicUrl(filePath: string, bucket: string) {
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};