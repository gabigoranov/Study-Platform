import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient";
import InputComponent from "../components/Login/InputComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/Supabase/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegEye } from "react-icons/fa";

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

  if (loading) return <p className="text-center mt-10">{t(keys.loading)}</p>;


  const validatePassword = (pwd: string) => {
    const errs: string[] = [];
    if (pwd.length < 8) errs.push(t(keys.passwordLengthError));
    if (!/[a-z]/.test(pwd)) errs.push(t(keys.passwordLowercaseError));
    if (!/[A-Z]/.test(pwd)) errs.push(t(keys.passwordUppercaseError));
    if (!/[0-9]/.test(pwd)) errs.push(t(keys.passwordDigitError));
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd))
      errs.push(t(keys.passwordSpecialCharError));
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
    <div className="flex min-h-screen w-full bg-background text-text font-sans p-4 md:p-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl">
        {/* Left Side: Form */}
        <div className="w-full h-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-surface">
          <div className="max-w-md mx-auto w-full">
            {/* title */}
            <h1 className="text-4xl font-semibold mb-2 text-text">
              {t(keys.signUpTitle)}
            </h1>
            <p className="text-text-muted mb-10 text-sm">
              {t(keys.haveAccountText)}{" "}
              <Link
                to="/login"
                className="text-primary underline underline-offset-4 font-medium"
              >
                {t(keys.signInButton)}
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.length > 0 && (
                <div className="text-error text-sm italic">
                  {errors[0]}
                </div>
              )}

              <Input
                type="email"
                placeholder={t(keys.email)}
                className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <Input
                  type="password"
                  placeholder={t(keys.passwordPlaceholder)}
                  className="bg-surface-muted border-none text-text h-12 pr-10 focus-visible:ring-2 focus-visible:ring-primary"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaRegEye className="absolute right-3 top-4 text-text-muted cursor-pointer hover:text-text transition-colors" />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="terms"
                  className="border-border data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-text-muted"
                >
                  {t(keys.agreeTo)}{" "}
                  <span className="underline cursor-pointer text-text">
                    {t(keys.termsAndConditions)}
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground rounded-xl text-md font-medium transition-all shadow-soft"
              >
                {t(keys.signUpButton)}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-4 text-text-muted font-medium">
                  {t(keys.registerWith)}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogle}
              className="bg-transparent w-full border-border rounded-xl hover:bg-surface-muted h-12 text-text"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Google
            </Button>
          </div>
        </div>

        <div
          className="relative hidden md:flex md:w-1/2 bg-cover bg-center p-12 flex-col justify-between"
          style={{ backgroundImage: "url('register.jpg')" }}
        >
          <div className="absolute inset-0 bg-background-muted/10 backdrop-blur-[2px]"></div>

          <div className="relative z-10 flex justify-end items-center">
            <Link
              to="/"
              className="text-xs border border-white/40 rounded-full px-4 py-1.5 bg-background-muted/50 hover:bg-background-muted/80 transition"
            >
              Back to website →
            </Link>
          </div>

          <div className="relative z-10 text-center text-white">
            <h2 className="text-3xl font-medium mb-8 leading-tight">
              Study Smarter,
              <br />
              Study Faster
            </h2>
            <div className="flex justify-center gap-2">
              <span className="h-1 w-8 bg-white/20 rounded-full"></span>
              <span className="h-1 w-12 bg-white rounded-full"></span>
              <span className="h-1 w-8 bg-white/20 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}