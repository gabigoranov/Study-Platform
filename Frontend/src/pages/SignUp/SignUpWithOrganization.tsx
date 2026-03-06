/**
 * SignUpWithOrganization - Organization Sign Up Hub
 *
 * This is the central hub for organization-based sign-up flows. It:
 * 1. First displays the role selection (Student, Teacher, or Admin)
 * 2. Then delegates to the appropriate sign-up form based on role selection
 *
 * The organization sign-up process is split into separate components:
 * - SignUpStudent.tsx: For students joining an existing organization
 * - SignUpTeacher.tsx: For teachers joining/creating courses within an organization
 * - SignUpAdmin.tsx: For admins creating or managing organizations
 *
 * This hub manages the initial role selection and provides navigation between flows.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Button } from "@/components/ui/button";
import { LucideStepBack } from "lucide-react";
import ChooseSignUpOrganizationType from "@/components/SignUp/ChooseSignUpOrganizationType";
import SignUpStudent from "./SignUpStudent";
import SignUpTeacher from "./SignUpTeacher";
import SignUpAdmin from "./SignUpAdmin";

export default function SignUpWithOrganization() {
  const { t } = useTranslation();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-4">
      {/* Render the appropriate sign-up form based on role selection */}
      {!selectedRole ? (
        <ChooseSignUpOrganizationType onSelect={setSelectedRole} />
      ) : selectedRole === "student" ? (
        <SignUpStudent onBack={() => setSelectedRole(null)} />
      ) : selectedRole === "teacher" ? (
        <SignUpTeacher onBack={() => setSelectedRole(null)} />
      ) : selectedRole === "admin" ? (
        <SignUpAdmin onBack={() => setSelectedRole(null)} />
      ) : null}

    </div>
  );
}
