import { Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Link } from "react-router-dom";

export default function AppLogo() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 group">
      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
        <Brain className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-text">{t(keys.aiLearning)}</span>
    </div>
  );
}
