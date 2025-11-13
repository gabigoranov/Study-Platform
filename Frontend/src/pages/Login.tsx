import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient";
import InputComponent from "../components/Login/InputComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { t, i18n } = useTranslation();

  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors([error.message]);
        return;
      }

      navigate("/");
    } catch (err) {
      setErrors([(err as Error).message]);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrors([(err as Error).message]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background-dark">
      <div className="bg-white dark:bg-surface p-8 rounded-lg shadow-lg w-80 sm:w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">{t(keys.signInTitle)}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          {errors.length > 0 && (
            <div className="text-left text-red-500 text-sm">
              {errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
          <Input
            type="email"
            placeholder={t(keys.emailPlaceholder)}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder={t(keys.passwordPlaceholder)}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="outline"
            className="rounded-full hover:bg-primary transition-colors"
          >
            {t(keys.signInButton)}
          </Button>
        </form>

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">{t(keys.orDivider)}</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Button
          onClick={handleGoogle}
          variant="ghost"
          className="flex items-center justify-center w-full px-4 py-2 rounded-2xl transition-colors"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          {t(keys.signInWithGoogle)}
        </Button>

        <p className="mt-4 text-sm text-gray-600">
          {t(keys.noAccountText)}{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            {t(keys.signUpLink)}
          </Link>
        </p>
      </div>
    </div>
  );
}
