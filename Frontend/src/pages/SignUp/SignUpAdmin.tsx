/**
 * SignUpAdmin - Admin Sign Up Form
 *
 * This component handles the sign-up flow for administrators creating or managing organizations.
 * Admins can create a new organization or manage an existing one.
 *
 * TODO: Implement form validation and organization creation/management logic
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SignUpAdminProps = {
  onBack: () => void;
};

export default function SignUpAdmin({ onBack }: SignUpAdminProps) {
  const { t } = useTranslation();

  const [organizationName, setOrganizationName] = useState("");
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
    if (!organizationName.trim()) {
      setErrors(["Organization name is required"]);
      return;
    }

    // TODO: Implement organization creation and sign-up logic
    console.log("Admin sign up:", {
      organizationName,
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
        {t(keys.signUpAdminDescription2)}
      </p>

      <div className="space-y-2">
        <label htmlFor="orgName" className="text-sm font-medium text-text">
          {t(keys.organizationNamePlaceholder)}
        </label>
        <Input
          id="orgName"
          type="text"
          placeholder={t(keys.organizationNamePlaceholder)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
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
