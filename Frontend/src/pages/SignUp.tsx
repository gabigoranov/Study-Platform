import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient";
import InputComponent from "../components/Login/InputComponent";
import { useTranslation } from "react-i18next";
import { keys } from '../types/keys';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const { t, i18n } = useTranslation();
  
  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [emailConfirmation, setEmailConfirmation] = useState(false);

  //if (loading) return <p className="text-center mt-10">{t(keys.loading)}</p>;
  // if (user) {
  //   navigate("/");
  //   return null;
  // }

  const validatePassword = (pwd: string) => {
    const errs: string[] = [];
    if (pwd.length < 8) errs.push(t(keys.passwordLengthError));
    if (!/[a-z]/.test(pwd)) errs.push(t(keys.passwordLowercaseError));
    if (!/[A-Z]/.test(pwd)) errs.push(t(keys.passwordUppercaseError));
    if (!/[0-9]/.test(pwd)) errs.push(t(keys.passwordDigitError));
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) errs.push(t(keys.passwordSpecialCharError));
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setEmailConfirmation(false);

    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setErrors(pwdErrors);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            display_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) {
        setErrors([error.message]);
        return;
      }

      if (data.user?.confirmation_sent_at) {
        setEmailConfirmation(true);
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
      <div className="bg-surface p-8 rounded-lg shadow-md w-80 sm:w-96 text-center">
        {!emailConfirmation ? (
          <>
            <h1 className="text-2xl font-bold mb-6">{t(keys.signUpTitle)}</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
              {errors.length > 0 && (
                <div className="text-left text-red-500 text-sm">
                  {errors.map((err, idx) => (
                    <p key={idx}>{err}</p>
                  ))}
                </div>
              )}

              <Input type="text" placeholder={t(keys.firstNamePlaceholder)} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <Input type="text" placeholder={t(keys.lastNamePlaceholder)} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <Input type="email" placeholder={t(keys.emailPlaceholder)} value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder={t(keys.passwordPlaceholder)} value={password} onChange={(e) => setPassword(e.target.value)} required />
              
              <Button
                type="submit"
                variant="outline"
                className="rounded-full hover:bg-blue-600 transition-colors"
              >
                {t(keys.signUpButton)}
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
              className="flex items-center justify-center w-full px-4 py-2 rounded-2xl hover:bg-neutral-200 hover:text-text transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              {t(keys.signInWithGoogle)}
            </Button>

            <p className="mt-6 text-sm text-gray-600">
              {t(keys.haveAccountText)}{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                {t(keys.signInButton)}
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">{t(keys.confirmEmailTitle)}</h1>
            <p className="mb-4 text-gray-700">
              {t(keys.confirmEmailMessage, { email })}
            </p>

            <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 hover:text-white transition-colors">{t(keys.signInButton)}</a>
          </>
        )}
      </div>
    </div>
  );
}