import { keys } from "@/types/keys";
import { t } from "i18next";
import { CheckCircle2 } from "lucide-react";

type ChooseOptionBlockProps = {
  Icon: React.ElementType;
  title: string;
  description: string;
  isSelected: boolean;
  type: string;
  onSelect: (value: string) => void;
};

export default function ChooseOptionBlock({
  Icon,
  title,
  description,
  isSelected,
  type,
  onSelect,
}: ChooseOptionBlockProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={`group relative flex flex-row items-start gap-4 rounded-lg border-2 p-6 transition-all hover:shadow-soft 
              ${
                isSelected
                  ? "border-primary bg-surface ring-1 ring-primary"
                  : "border-border bg-surface-muted hover:border-primary/50"
              }`}
    >
      <div
        className={`mt-1 rounded-full p-2 transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-surface text-text-muted group-hover:text-primary"}`}
      >
        <Icon size={24} />
      </div>

      <div className="flex flex-col items-start text-left">
        <span className="text-lg font-semibold text-text">{title}</span>
        <span className="text-sm text-text-muted leading-relaxed">
          {description}
        </span>
      </div>

      {isSelected && (
        <CheckCircle2
          size={18}
          className="absolute top-4 right-4 text-primary"
        />
      )}
    </button>
  );
}
