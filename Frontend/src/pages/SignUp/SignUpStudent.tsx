/**
 * SignUpStudent - Student Sign Up Form
 *
 * This component handles the sign-up flow for students joining an organization.
 * Students need to provide their organization code to access their school/university.
 *
 * TODO: Implement form validation and organization code verification logic
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SignUpStudentProps = {
  onBack: () => void;
};

export default function SignUpStudent({ onBack }: SignUpStudentProps) {
  const { t } = useTranslation();

  const [organizationCode, setOrganizationCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // TODO: Implement validation
    if (!organizationCode.trim()) {
      setErrors(["Organization code is required"]);
      return;
    }

    // TODO: Implement organization code verification and sign-up logic
    console.log("Student sign up:", {
      organizationCode,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="text-error text-sm italic">{errors[0]}</div>
      )}

      <p className="text-text-muted text-sm">
        {t(keys.signUpStudentDescription2)}
      </p>

      <div className="space-y-2">
        <label htmlFor="orgCode" className="text-sm font-medium text-text">
          {t(keys.organizationCodePlaceholder)}
        </label>
        <Input
          id="orgCode"
          type="text"
          placeholder={t(keys.organizationCodePlaceholder)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={organizationCode}
          onChange={(e) => setOrganizationCode(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-text">
            {t(keys.firstNamePlaceholder)}
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder={t(keys.firstNamePlaceholder)}
            className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-text">
            {t(keys.lastNamePlaceholder)}
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder={t(keys.lastNamePlaceholder)}
            className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-text">
          {t(keys.email)}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={t(keys.email)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-text">
          {t(keys.phoneNumberPlaceholder)}
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder={t(keys.phoneNumberPlaceholder)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-text">
          {t(keys.passwordPlaceholder)}
        </label>
        <Input
          id="password"
          type="password"
          placeholder={t(keys.passwordPlaceholder)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground rounded-xl text-md font-medium transition-all shadow-soft"
      >
        {t(keys.continueButton)}
      </Button>
    </form>
  );
}
