import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Zap, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Link } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16"
      id="hero"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-glow/5 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container container px-4 relative z-10 py-2 max-w-5xl mx-auto text-left sm:text-center animate-fade-in">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text leading-tight">
          {t(keys.masterYourStudies)}{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            {t(keys.aiPoweredMaterials)}
          </span>
        </h1>

        {/* Subheading */}
        <p className=" hidden sm:block text-xl md:text-2xl text-text-muted mb-8 max-w-3xl mx-auto">
          {t(keys.uploadLectures)}
        </p>

        {/* Feature highlights */}
        <div className="hidden sm:flex flex-wrap justify-center gap-6 mb-10 text-text-muted">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            <span>{t(keys.aiPoweredContent)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-success" />
            <span>{t(keys.competeWithFriends)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-info" />
            <span>{t(keys.personalizedLearning)}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 sm:mt-0 flex flex-col sm:flex-row gap-4 justify-center items-start sm:items-center">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-full shadow-glow text-text-inverted"
            >
              {t(keys.startLearningFree)}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <a
            href="#demo"
            className="text-lg px-10 py-2 bg-transparent rounded-full border-2 border-dashed border-text/20 text-text"
          >
            {t(keys.watchDemo)}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
