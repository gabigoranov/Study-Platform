import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

const AVATAR_CACHE_KEY = "user_avatar_url";

export function useCurrentUserAvatar() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(() => {
    // Load from cache on first render
    return localStorage.getItem(AVATAR_CACHE_KEY) ?? undefined;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setAvatarUrl(undefined);
      localStorage.removeItem(AVATAR_CACHE_KEY);
      return;
    }

    const fetchAvatar = async () => {
      // Skip fetch if we already have cached value
      if (avatarUrl) return;

      setLoading(true);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
        localStorage.setItem(AVATAR_CACHE_KEY, profile.avatar_url);
      }
      setLoading(false);
    };

    fetchAvatar();
  }, [user?.id]);

  return { avatarUrl, loading, setAvatarUrl };
}
