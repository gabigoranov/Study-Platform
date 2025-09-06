// src/routes/ProtectedRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) return <p className="text-center mt-10">{t(keys.loading)}</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
