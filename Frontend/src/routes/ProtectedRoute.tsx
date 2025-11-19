import { useAuth } from "@/hooks/Supabase/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // small skeleton or nothing

  return user ? <>{children}</> : <Navigate to="/landing" />;
}
