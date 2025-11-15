import { Brain, Mail, Twitter, Github, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { ThemeToggle } from "../Common/ThemeToggle";
import LanguageToggle from "../Common/LanguageToggle";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="section-container container mx-auto py-12 text-right">
        <div className="grid md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-text">
                {t(keys.aiLearningPlatform)}
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed text-left mb-6">
              {t(keys.transformYourLearning)}
            </p>
            <div className="flex">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>

          {/* Product */}
          <div className="md:text-right">
            <h3 className="font-semibold text-text mb-4">{t(keys.product)}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.featuresText)}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.howItWorksText)}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.pricing)}
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.demoText)}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:text-right">
            <h3 className="font-semibold text-text mb-4">{t(keys.company)}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.aboutUs)}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.contact)}
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.careers)}
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.blog)}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:text-right">
            <h3 className="font-semibold text-text mb-4">{t(keys.legal)}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#privacy"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.privacyPolicy)}
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.termsOfService)}
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.cookiePolicy)}
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                  {t(keys.security)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
            {/* Social links */}
            <div className="flex gap-4">
                <a
                href="https://github.com/gabigoranov/Study-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                aria-label={t(keys.github)}
              >
                <Github className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              </a>
              <a
                href="mailto:contact@ailearning.com"
                className="w-10 h-10 rounded-full bg-surface-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                aria-label={t(keys.email)}
              >
                <Mail className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <p className="text-text-muted text-sm text-center mt-4">
            © {currentYear} {t(keys.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
