/**
 * SignUpAdmin - Admin Sign Up Form (Step 1)
 *
 * This component handles the first step of the admin sign-up flow.
 * It collects admin personal information and then proceeds to organization details.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import SignUpAdminOrganization from "./SignUpAdminOrganization";

type SignUpAdminProps = {
  onBack: () => void;
};

type OrganizationData = {
  organizationTitle: string;
  organizationTown: string;
  organizationCountry: string;
  organizationAddress: string;
};

export default function SignUpAdmin({ onBack }: SignUpAdminProps) {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showOrganizationStep, setShowOrganizationStep] = useState(false);

  const adminSignUpSchema = z.object({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = adminSignUpSchema.safeParse({
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

    setShowOrganizationStep(true);
  };

  const handleOrganizationSubmit = (
    adminData: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      password: string;
    },
    organizationData: OrganizationData
  ) => {
    console.log("Admin sign up complete:", {
      ...adminData,
      ...organizationData,
    });
  };

  if (showOrganizationStep) {
    return (
      <SignUpAdminOrganization
        adminData={{
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
        }}
        onBack={() => setShowOrganizationStep(false)}
        onSubmit={handleOrganizationSubmit}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="text-error text-sm italic">{errors[0]}</div>
      )}

      <div className="mb-4">
        <p className="text-text-muted text-xs">{t(keys.step1Of2)}</p>
        <h3 className="text-text font-medium">{t(keys.adminDetailsStep)}</h3>
      </div>

      <p className="text-text-muted text-sm">
        {t(keys.signUpAdminDescription2)}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
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
