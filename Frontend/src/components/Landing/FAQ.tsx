import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";

const FAQ = () => {
  const { t } = useTranslation();
  
  const faqs = [
    {
      question: t(keys.howDoesAIGenerate),
      answer: t(keys.aiAnalyzesContent),
    },
    {
      question: t(keys.whatFileFormatsSupported),
      answer: t(keys.supportFileFormats),
    },
    {
      question: t(keys.howPointsSystemWork),
      answer: t(keys.earnPointsByCompleting),
    },
    {
      question: t(keys.isDataSecure),
      answer: t(keys.enterpriseGradeEncryption),
    },
    {
      question: t(keys.canUseAnySubject),
      answer: t(keys.aiWorksAnySubject),
    },
    {
      question: t(keys.howMuchDoesItCost),
      answer: t(keys.freeTierPremiumPlans),
    },
    {
      question: t(keys.whatMakesAIPodcastsSpecial),
      answer: t(keys.aiPodcastsConvert),
    },
    {
      question: t(keys.canICollaborateClassmates),
      answer: t(keys.createStudyGroups),
    },
  ];

  return (
    <section className="py-20 bg-gradient-hero" id="faq">
      <div className="section-container container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
              {t(keys.frequentlyAskedQuestions)}
            </h2>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8 shadow-soft animate-slide-up">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 bg-surface hover:shadow-soft transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="text-lg font-semibold text-text pr-4 text-left">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-text-muted pb-4 leading-relaxed text-left">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-8 animate-fade-in">
            <p className="text-text-muted mb-4">{t(keys.stillHaveQuestions)}</p>
            <a 
              href="#contact" 
              className="text-primary hover:text-primary-glow font-medium underline underline-offset-4 transition-colors"
            >
              {t(keys.contactSupportTeam)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
