import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

type LanguageToggleProps = {
  className?: string
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation()

  const languages = [
    { code: "en", label: "English" },
    { code: "bg", label: "Български" },
  ]

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang, (err) => {
      if (err) console.error("Failed to load language", err)
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex w-fit shadow-none items-center gap-1 ${className ?? ""}`}
        >
          {languages.find((lang) => lang.code === i18n.language)?.label}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-32">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={
              i18n.language === lang.code ? "bg-surface text-text" : ""
            }
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}