import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Button } from "@/components/ui/button";
import ChooseSignUpType from "@/components/SignUp/ChooseSignUpType";
import { LucideStepBack } from "lucide-react";
import ChooseSignUpOrganizationType from "@/components/SignUp/ChooseSignUpOrganizationType";
import SignUpIndividual from "./SignUpIndividual";
import SignUpWithOrganization from "./SignUpWithOrganization";

/**
 * SignUp - Central Sign Up Hub
 *
 * This is the main entry point for the sign-up process. It acts as a central hub that:
 * 1. First displays the sign-up type selection (Individual vs Organization)
 * 2. Then delegates to the appropriate sign-up flow based on user selection
 *
 * The sign-up process is split into separate pages:
 * - SignUpIndividual.tsx: Handles individual user registration (independent learners)
 * - SignUpWithOrganization.tsx: Handles organization-based registration (students, teachers, admins)
 *
 * This hub manages the initial type selection and provides navigation between flows.
 */
export default function SignUp() {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const [signUpType, setSignUpType] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen w-full bg-background text-text font-sans p-4 md:p-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl">
        {/* Left Side: Form */}
        <div className="relative w-full h-full max-w-md mx-auto flex flex-col justify-center bg-surface">
          {/* Title */}
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-semibold mb-2 text-text">
              {t(keys.signUpTitle)}
            </h1>
            {/* Display a back button if a sign up type has been selected */}
            {signUpType && (
              <Button variant="outline" onClick={() => setSignUpType(null)}>
                <LucideStepBack />
                Back
              </Button>
            )}
          </div>

          <p className="text-text-muted mb-10 text-sm">
            {t(keys.haveAccountText)}{" "}
            <Link
              to="/login"
              className="text-primary underline underline-offset-4 font-medium"
            >
              {t(keys.signInButton)}
            </Link>
          </p>

          {/*
            Render the appropriate sign-up flow based on user selection:
            - "individual": Delegate to SignUpIndividual.tsx for individual registration
            - "organization": Show organization role selection (ChooseSignUpOrganizationType)
               via the SignUpWithOrganization, which also acts as a central hub
            - null: Show initial type selection (ChooseSignUpType)
          */}
          {signUpType === "individual" ? (
            <SignUpIndividual />
          ) : signUpType === "organization" ? (
            <SignUpWithOrganization />
          ) : (
            <ChooseSignUpType selectType={setSignUpType} />
          )}
        </div>

        {/* Right Side: Decorative Image */}
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
