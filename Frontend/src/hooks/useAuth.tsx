import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { storageService } from "@/services/storageService";

type UserProfile = {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
};

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    avatar?: File;
    fullName?: string;
    email?: string;
  }) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setToken(data.session?.access_token ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  };

  const updateProfile = async (updates: {
    avatar?: File;
    fullName?: string;
    email?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      if (updates.avatar) {
        const fileExt = updates.avatar.name.split('.').pop();
        const fileName = `avatar`;
        const filePath = `${user?.id}/${fileName}`;

        const publicUrl = await storageService.uploadFile(user?.id as string, updates.avatar, 'avatars');

        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        });

        if (updateError) throw updateError;
      }

      if (updates.fullName || updates.email) {
        const { error } = await supabase.auth.updateUser({
          email: updates.email,
          data: { full_name: updates.fullName }
        });
        if (error) throw error;
      }

      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error,
      signIn, 
      signInWithGoogle, 
      signOut,
      updateProfile,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
