import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaRegEye } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/Supabase/useAuth";
import AppLogo from "@/components/Common/AppLogo";

export default function Login() {
  const { t } = useTranslation();
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen w-full bg-background dark:bg-background-dark text-text dark:text-text-dark font-sans p-4 md:p-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto overflow-hidden rounded-3xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-2xl">
        {/* Left Side: Image & Branding */}
        <div className="relative hidden md:flex md:w-1/2 bg-cover bg-center p-12 flex-col justify-between" 
             style={{ backgroundImage: "url('login.jpg')" }}>
          <div className="absolute inset-0 bg-background-muted/10 dark:bg-background-muted-dark/40 backdrop-blur-[2px]"></div>
          
          {/* Return button */}
          <div className="relative z-10 flex justify-end items-center">
            <Link to="/" className="text-xs border border-white/40 rounded-full px-4 py-1.5 bg-background-muted/50 dark:bg-background-muted-dark/50 hover:bg-background-muted/80 dark:hover:bg-background-muted-dark/80 transition">
              Back to website →
            </Link>
          </div>

          {/* Image title text */}
          <div className="relative z-10 text-center text-white">
            <h2 className="text-3xl font-medium mb-8 leading-tight">
              Study Smarter,<br />Study Faster
            </h2>
            <div className="flex justify-center gap-2">
              <span className="h-1 w-8 bg-white/20 rounded-full"></span>
              <span className="h-1 w-12 bg-white rounded-full"></span>
              <span className="h-1 w-8 bg-white/20 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-surface dark:bg-surface-dark">
          <div className="max-w-md mx-auto w-full">
            {/* title */}
            <h1 className="text-4xl font-semibold mb-2 text-text dark:text-text-dark">{t(keys.signInTitle)}</h1>
            <p className="text-text-muted dark:text-text-muted-dark mb-10 text-sm">
              {t(keys.dontHaveAccount)} <Link to="/login" className="text-primary dark:text-primary-dark underline underline-offset-4 font-medium">{t(keys.signUpButton)}</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.length > 0 && (
                <div className="text-error dark:text-error-dark text-sm italic">{errors[0]}</div>
              )}

              {/* Form fields */}
              <Input
                type="email"
                placeholder={t(keys.email)}
                className="bg-surface-muted dark:bg-surface-muted-dark border-none text-text dark:text-text-dark h-12 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark"
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <Input
                  type="password"
                  placeholder={t(keys.passwordPlaceholder)}
                  className="bg-surface-muted dark:bg-surface-muted-dark border-none text-text dark:text-text-dark h-12 pr-10 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaRegEye className="absolute right-3 top-4 text-text-muted dark:text-text-muted-dark cursor-pointer hover:text-text dark:hover:text-text-dark transition-colors" />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox id="terms" className="border-border dark:border-border-dark data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-dark" />
                <label htmlFor="terms" className="text-xs text-text-muted dark:text-text-muted-dark">
                  {t(keys.agreeTo)} <span className="underline cursor-pointer text-text dark:text-text-dark">{t(keys.termsAndConditions)}</span>
                </label>
              </div>

              <Button type="submit" className="w-full h-12 bg-primary dark:bg-primary-dark hover:opacity-90 text-primary-foreground dark:text-primary-foreground-dark rounded-xl text-md font-medium transition-all shadow-soft">
                {t(keys.signInButton)}
              </Button>
            </form>

            {/* Other options */}
            <div className="relative my-8">
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface dark:bg-surface-dark px-4 text-text-muted dark:text-text-muted-dark font-medium">{t(keys.registerWith)}</span>
              </div>
            </div>

            <Button variant="outline" onClick={signInWithGoogle} className="bg-transparent w-full border-border dark:border-border-dark rounded-xl hover:bg-surface-muted dark:hover:bg-surface-muted-dark h-12 text-text dark:text-text-dark">
               <FcGoogle className="mr-2 h-5 w-5" /> Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}