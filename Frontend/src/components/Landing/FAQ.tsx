import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI generate study materials?",
    answer: "Our advanced AI analyzes your uploaded content, identifies key concepts, and generates personalized study materials including flashcards, quizzes, mindmaps, and audio podcasts. The AI adapts to your learning style and focuses on the most important information.",
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF, PowerPoint (PPT/PPTX), Word documents (DOC/DOCX), text files, and images. You can upload lecture slides, notes, textbooks, or any study material you have.",
  },
  {
    question: "How does the points and racing system work?",
    answer: "You earn points by completing quizzes, reviewing flashcards, and achieving study milestones. You can create or join study groups with friends and compete on leaderboards. The more you study, the more points you earn!",
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We use enterprise-grade encryption to protect your data. Your study materials and personal information are never shared with third parties. You have full control over your data and can delete it at any time.",
  },
  {
    question: "Can I use this for any subject?",
    answer: "Yes! Our AI works with any subject from mathematics and science to languages and humanities. Whether you're in high school, college, or professional training, the platform adapts to your needs.",
  },
  {
    question: "How much does it cost?",
    answer: "We offer a free tier with essential features and premium plans starting at $9.99/month. The premium plans include unlimited AI generations, advanced analytics, priority support, and exclusive features.",
  },
  {
    question: "What makes AI podcasts special?",
    answer: "Our AI podcasts convert your study materials into engaging audio content with natural-sounding voices. Perfect for learning while commuting, exercising, or during breaks. You can adjust the speed and focus on specific topics.",
  },
  {
    question: "Can I collaborate with classmates?",
    answer: "Yes! You can create study groups, share materials, compete on leaderboards, and even quiz each other. Collaboration features help you learn together and stay motivated.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 px-4 bg-gradient-hero">
      <div className="section-container container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-text-muted">
              Everything you need to know about AI Learning Platform
            </p>
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
            <p className="text-text-muted mb-4">Still have questions?</p>
            <a 
              href="#contact" 
              className="text-primary hover:text-primary-glow font-medium underline underline-offset-4 transition-colors"
            >
              Contact our support team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
