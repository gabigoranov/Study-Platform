import { keys } from "@/types/keys";
import { t } from "i18next";
import { User, Building2 } from "lucide-react";
import { useState } from "react";
import ChooseOptionBlock from "../Common/ChooseOptionBlock";

type ChooseSignUpOrganizationTypeProps = {
    onSelect: (value: string) => void;
}

// lets the user choose whether to register as a student, teacher or create a new organization as an admin
export default function ChooseSignUpOrganizationType({onSelect} : ChooseSignUpOrganizationTypeProps) {
    // --- STATE ---
  const [selected, setSelected] = useState<
    string | null
  >(null);

  // --- HANDLERS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="flex h-auto items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-6"
      >
        {/* HEADER SECTION */}
        <p className="text-text-muted">{t(keys.selectSignUpOptionText)}</p>

        {/* SELECTION CARDS SECTION */}
        <div className="flex flex-col gap-4">
          {/* Student Option */}
          <ChooseOptionBlock
            Icon={User}
            title={t(keys.student)}
            description={t(keys.signUpStudentDescription)}
            isSelected={selected === "student"}
            type="student"
            onSelect={setSelected}
          />

          {/* Teacher Option */}
          <ChooseOptionBlock
            Icon={User}
            title={t(keys.teacher)}
            description={t(keys.signUpTeacherDescription)}
            isSelected={selected === "teacher"}
            type="teacher"
            onSelect={setSelected}
          />

          {/* Admin Option */}
          <ChooseOptionBlock
            Icon={Building2}
            title={t(keys.admin)}
            description={t(keys.signUpAdminDescription)}
            isSelected={selected === "admin"}
            type="admin"
            onSelect={setSelected}
          />
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