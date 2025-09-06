import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";

export default function ErrorPage({ error }: { error?: any }) {
  const { t } = useTranslation();

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">{t(keys.errorHeading)}</h1>
      <p className="text-red-500">{error?.statusText || t(keys.defaultErrorMessage)}</p>
      <p className="mt-2">{error?.data || error?.message || ""}</p>
    </div>
  );
}