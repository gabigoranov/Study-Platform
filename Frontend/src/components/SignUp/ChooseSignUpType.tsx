import React, { useState } from "react";
import { User, Building2, CheckCircle2 } from "lucide-react";
import { t } from "i18next";
import { keys } from "@/types/keys";

type ChooseSignUpTypeProps = {
  selectType: (selectedType: "organization" | "individual" | null) => void;
};

export default function ChooseSignUpType({
  selectType,
}: ChooseSignUpTypeProps) {
  // --- STATE ---
  const [selected, setSelected] = useState<"organization" | "individual" | null>(null);

  // --- HANDLERS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      selectType(selected);
    }
  };

  return (
    <div className="flex h-auto items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-6"
      >
        {/* HEADER SECTION */}
        <p className="text-text-muted">
          {t(keys.selectSignUpOptionText)}
        </p>

        {/* SELECTION CARDS SECTION */}
        <div className="flex flex-col gap-4">
          
          {/* Individual Option */}
          <button
            type="button"
            onClick={() => setSelected("individual")}
            className={`group relative flex flex-row items-start gap-4 rounded-lg border-2 p-6 transition-all hover:shadow-soft 
              ${
                selected === "individual"
                  ? "border-primary bg-surface ring-1 ring-primary"
                  : "border-border bg-surface-muted hover:border-primary/50"
              }`}
          >
            <div className={`mt-1 rounded-full p-2 transition-colors ${selected === "individual" ? "bg-primary text-primary-foreground" : "bg-surface text-text-muted group-hover:text-primary"}`}>
              <User size={24} />
            </div>
            
            <div className="flex flex-col items-start text-left">
              <span className="text-lg font-semibold text-text">{t(keys.individial)}</span>
              <span className="text-sm text-text-muted leading-relaxed">
                {t(keys.signUpIndividualDescription)}
              </span>
            </div>

            {selected === "individual" && (
              <CheckCircle2 size={18} className="absolute top-4 right-4 text-primary" />
            )}
          </button>

          {/* Organization Option */}
          <button
            type="button"
            onClick={() => setSelected("organization")}
            className={`group relative flex flex-row items-start gap-4 rounded-lg border-2 p-6 transition-all hover:shadow-soft 
              ${
                selected === "organization"
                  ? "border-primary bg-surface ring-1 ring-primary"
                  : "border-border bg-surface-muted hover:border-primary/50"
              }`}
          >
            <div className={`mt-1 rounded-full p-2 transition-colors ${selected === "organization" ? "bg-primary text-primary-foreground" : "bg-surface text-text-muted group-hover:text-primary"}`}>
              <Building2 size={24} />
            </div>

            <div className="flex flex-col items-start text-left">
              <span className="text-lg font-semibold text-text">
                {t(keys.organization)}
              </span>
              <span className="text-sm text-text-muted leading-relaxed">
                {t(keys.signUpOrganizationDescription)}
              </span>
            </div>

            {selected === "organization" && (
              <CheckCircle2 size={18} className="absolute top-4 right-4 text-primary" />
            )}
          </button>
        </div>

        {/* ACTION SECTION */}
        <button
          type="submit"
          disabled={!selected}
          className="mt-2 w-full rounded-md bg-primary py-4 font-bold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-glow"
        >
          {t(keys.signUpButton)}
        </button>
      </form>
    </div>
  );
}