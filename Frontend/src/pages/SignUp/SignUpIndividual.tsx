import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../lib/supabaseClient";
import InputComponent from "../../components/Login/InputComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/Supabase/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegEye } from "react-icons/fa";
import { LucideStepBack } from "lucide-react";
import { z } from "zod";

/**
 * SignUpIndividual - Individual Sign Up Page
 *
 * This page handles the sign-up flow for individual users (students learning independently).
 * It is called from the central SignUp.tsx hub after the user selects "Individual" as their
 * sign-up type.
 *
 * Features:
 * - Email/password registration with validation
 * - Google OAuth sign-up
 * - Terms & Conditions acceptance
 * - Email confirmation flow
 * - Phone number field for contact
 */
export default function SignUpIndividual() {
  const { t, i18n } = useTranslation();
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [emailConfirmation, setEmailConfirmation] = useState(false);

  // Zod schema matching backend/Supabase requirements
  const signUpSchema = z.object({
    firstName: z.string().min(1, t(keys.firstNameRequired)),
    lastName: z.string().min(1, t(keys.lastNameRequired)),
    email: z.string().email(t(keys.invalidEmailError)),
    phoneNumber: z.string().optional(),
    password: z
      .string()
      .min(8, t(keys.passwordLengthError))
      .regex(/[a-z]/, t(keys.passwordLowercaseError))
      .regex(/[A-Z]/, t(keys.passwordUppercaseError))
      .regex(/[0-9]/, t(keys.passwordDigitError))
      .regex(/[!@#$%^&*(),.?":{}|<>]/, t(keys.passwordSpecialCharError)),
  });

  if (loading) return <p className="text-center mt-10">{t(keys.loading)}</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setEmailConfirmation(false);

    // Validate with Zod
    const result = signUpSchema.safeParse({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    if (!result.success) {
      const zodErrors = result.error.issues.map((issue) => issue.message);
      setErrors(zodErrors);
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
            phone: phoneNumber
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
    <div className="flex flex-col space-y-4">
      {emailConfirmation && (
        <div className="text-green-600 text-sm">
          {t(keys.confirmEmailMessage).replace("{email}", email)}
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-error text-sm italic">{errors[0]}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder={t(keys.firstNamePlaceholder)}
            className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            type="text"
            placeholder={t(keys.lastNamePlaceholder)}
            className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Input
          type="email"
          placeholder={t(keys.email)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="phone"
          type="tel"
          placeholder={t(keys.phoneNumberPlaceholder)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          <label htmlFor="terms" className="text-xs text-text-muted">
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
  );
}