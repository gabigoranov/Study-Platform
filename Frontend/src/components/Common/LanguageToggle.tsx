import { offset, useFloating } from "@floating-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type LanguageToggleProps = {
    className?: string;
};

export default function LanguageToggle({ className }: LanguageToggleProps) {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const {refs, floatingStyles} = useFloating({
        placement: "top-start",
        strategy: "fixed",
        middleware: [offset(10)]
    });

    const languages = [
        { code: "en", label: "English" },
        { code: "bg", label: "Български" }
    ];

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang, (err, t) => {
            if (err) return console.log('something went wrong loading', err);
        });

        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                ref={refs.setReference}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md text-text bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                {languages.find((lang) => lang.code === i18n.language)?.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div ref={refs.setFloating} style={floatingStyles} className="transition-none w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`block w-full px-4 py-2 text-sm text-left text-text ${i18n.language === lang.code ? 'bg-gray-100' : ''}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}