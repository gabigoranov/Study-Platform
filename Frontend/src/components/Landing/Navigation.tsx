import { useState } from "react";
import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../Common/ThemeToggle";
import AppLogo from "../Common/AppLogo";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/Supabase/useAuth";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const { user } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { href: "#features", label: t(keys.features) },
    { href: "#how-it-works", label: t(keys.howItWorksLabel) },
    { href: "#demo", label: t(keys.demo) },
    { href: "#faq", label: t(keys.faq) },
  ];

  function handleGetStarted() {
    if (user) {
      navigate("/");
      return null;
    }
    navigate("/signup");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-text-muted hover:text-text"
              >
                {t(keys.signIn)}
              </Button>
            </Link>
            <Button
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {t(keys.getStarted)}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
            aria-label={t(keys.toggleMenu)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-text-muted hover:text-text w-full"
                  >
                    {t(keys.signIn)}
                  </Button>
                </Link>
                <Button
                  onClick={handleGetStarted}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  {t(keys.getStarted)}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
