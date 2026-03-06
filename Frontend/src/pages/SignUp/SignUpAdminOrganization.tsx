/**
 * SignUpAdminOrganization - Organization Details Form
 *
 * This component handles the organization details step of the admin sign-up flow.
 * It collects organization information: title, town, country, and address.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

type AdminData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

type SignUpAdminOrganizationProps = {
  adminData: AdminData;
  onBack: () => void;
  onSubmit: (adminData: AdminData, organizationData: OrganizationData) => void;
};

type OrganizationData = {
  organizationTitle: string;
  organizationTown: string;
  organizationCountry: string;
  organizationAddress: string;
};

export default function SignUpAdminOrganization({
  adminData,
  onBack,
  onSubmit,
}: SignUpAdminOrganizationProps) {
  const { t } = useTranslation();

  const [organizationTitle, setOrganizationTitle] = useState("");
  const [organizationTown, setOrganizationTown] = useState("");
  const [organizationCountry, setOrganizationCountry] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const organizationSchema = z.object({
    organizationTitle: z.string().min(1, t(keys.organizationTitleRequired)),
    organizationTown: z.string().min(1, t(keys.organizationTownRequired)),
    organizationCountry: z.string().min(1, t(keys.organizationCountryRequired)),
    organizationAddress: z.string().min(1, t(keys.organizationAddressRequired)),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = organizationSchema.safeParse({
      organizationTitle,
      organizationTown,
      organizationCountry,
      organizationAddress,
    });

    if (!result.success) {
      const zodErrors = result.error.issues.map((issue) => issue.message);
      setErrors(zodErrors);
      return;
    }

    onSubmit(adminData, {
      organizationTitle,
      organizationTown,
      organizationCountry,
      organizationAddress,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="text-error text-sm italic">{errors[0]}</div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="p-0 h-auto text-text-muted hover:text-text"
        >
          ←
        </Button>
        <div>
          <p className="text-text-muted text-xs">{t(keys.step2Of2)}</p>
          <h3 className="text-text font-medium">{t(keys.organizationDetailsStep)}</h3>
        </div>
      </div>

      <p className="text-text-muted text-sm">
        {t(keys.signUpAdminDescription2)}
      </p>

      <div className="space-y-2">
        <Input
          id="organizationTitle"
          type="text"
          placeholder={t(keys.organizationTitle)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={organizationTitle}
          onChange={(e) => setOrganizationTitle(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            id="organizationTown"
            type="text"
            placeholder={t(keys.organizationTown)}
            className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
            value={organizationTown}
            onChange={(e) => setOrganizationTown(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Input
            id="organizationCountry"
            type="text"
            placeholder={t(keys.organizationCountry)}
            className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
            value={organizationCountry}
            onChange={(e) => setOrganizationCountry(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Input
          id="organizationAddress"
          type="text"
          placeholder={t(keys.organizationAddress)}
          className="bg-surface-muted border-none text-text h-12 focus-visible:ring-2 focus-visible:ring-primary"
          value={organizationAddress}
          onChange={(e) => setOrganizationAddress(e.target.value)}
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
