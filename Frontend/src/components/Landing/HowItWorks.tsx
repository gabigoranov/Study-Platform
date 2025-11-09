import { UserPlus, Upload, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";

const HowItWorks = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      icon: UserPlus,
      title: t(keys.createAccount),
      description: t(keys.aiLearningDescription),
      step: "01",
      gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20",
      iconColor: "text-violet-600 dark:text-violet-400"
    },
    {
      icon: Upload,
      title: t(keys.uploadMaterials),
      description: t(keys.aiUploadDescription),
      step: "02",
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Sparkles,
      title: t(keys.aiCreatesEverything),
      description: t(keys.aiCreationDescription),
      step: "03",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-surface to-background" id="how-it-works">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">{t(keys.simpleProcess)}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-text">
            {t(keys.howItWorksSection)}
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t(keys.fromUploadToMastery)}
          </p>
        </div>

        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <Card className="relative h-full border border-border bg-card hover:shadow-glow transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                  {/* Smooth gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Animated border gradient */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} blur-xl`}></div>
                  </div>
                  
                  <CardContent className="relative p-10 flex flex-col items-center text-center z-10">
                    {/* Step number with gradient */}
                    <div className={`absolute top-6 right-6 text-7xl font-bold bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-40 group-hover:opacity-60 transition-opacity`}>
                      {step.step}
                    </div>

                    {/* Icon with enhanced styling */}
                    <div className="relative mb-8 transform group-hover:scale-110 transition-transform duration-500 self-center">
                      <div className={`absolute inset-0 ${step.iconBg} rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                      <div className={`relative w-20 h-20 rounded-3xl ${step.iconBg} flex items-center justify-center shadow-soft`}>
                        <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-text transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed text-base">
                      {step.description}
                    </p>
                  </CardContent>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </Card>

                {/* Mobile arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg opacity-50"></div>
                      <div className="relative bg-card border border-border rounded-full p-3 shadow-soft">
                        <ArrowRight className="w-6 h-6 text-text-muted" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <button className="group px-8 py-4 bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-full font-semibold text-lg shadow-glow hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            {t(keys.getStartedNow)}
            <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;