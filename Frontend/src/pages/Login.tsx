import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient";
import InputComponent from "../components/Login/InputComponent";
import { useTranslation } from "react-i18next";
import { keys } from '../types/keys';

export default function Login() {
  const { t, i18n } = useTranslation();
  
  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  if (loading) return <p className="text-center mt-10">{t(keys.loading)}</p>;
  if (user) {
    navigate("/");
    return null;
  }

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 sm:w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">{t(keys.signInTitle)}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          {errors.length > 0 && (
            <div className="text-left text-red-500 text-sm">
              {errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
          <InputComponent type="email" placeholder={t(keys.emailPlaceholder)} value={email} onChange={setEmail} required />
          <InputComponent type="password" placeholder={t(keys.passwordPlaceholder)} value={password} onChange={setPassword} required />    
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            {t(keys.signInButton)}
          </button>
        </form>

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">{t(keys.orDivider)}</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogle}
          className="flex items-center justify-center w-full bg-neutral-200 px-4 py-2 rounded-lg shadow hover:bg-neutral-300 transition-colors"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          {t(keys.signInWithGoogle)}
        </button>

        <p className="mt-6 text-sm text-gray-600">
          {t(keys.noAccountText)}{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            {t(keys.signUpLink)}
          </Link>
        </p>
      </div>
    </div>
  );
}