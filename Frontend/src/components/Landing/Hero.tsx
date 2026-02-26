import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Zap, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Link } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-screen px-4 flex items-center justify-center overflow-hidden bg-background pt-16"
      id="hero"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-64 left-[-10rem] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-40rem] left-[-20rem] w-[70rem] h-[70rem] bg-accent/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-glow/5 rounded-full blur-3xl"></div>

        <div className="absolute hidden sm:block w-[500px] h-[500px] top-[-110px] right-[-200px] xl:w-[1500px] xl:h-[1500px] xl:right-[-700px] xl:top-[-360px] rounded-full bg-gradient-to-br from-primary/10 to-primary blur-[1px]"></div>
      </div>

      <div className="section-container container flex flex-row">
        {/* Left side - main info */}
        <div className="px-4 relative z-10 py-2 max-w-5xl mx-auto text-left animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text">
            <span className="bg-gradient-primary text-5xl md:text-7xl bg-clip-text text-transparent">
              {t(keys.aiPoweredMaterials)}
            </span>

            <br />

            {t(keys.masterYourStudies)}
          </h1>

          {/* Subheading */}
          <p className="hidden sm:block text-xl md:text-2xl text-text-muted mb-8 max-w-3xl">
            {t(keys.uploadLectures)}
          </p>

          {/* CTA Buttons */}
          <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center">
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
              className="text-lg px-10 py-2 bg-transparent rounded-full border-2 border-dashed border-text/20 text-text whitespace-nowrap"
            >
              {t(keys.watchDemo)}
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <img
          src="/hero-img.png"
          alt="AI study platform"
          className="w-full max-w-xl xl:max-w-4xl object-contain drop-shadow-2xl mr-[-10rem] mt-[-5rem]"
        />
      </div>
    </section>
  );
};

export default Hero;
