import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { keys } from "../../types/keys";
import { Link } from "react-router";

export default function AccountSettings() {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  return <Link to="/login" onClick={signOut} className="hover:cursor-pointer">{t(keys.signOut)}</Link>;
}