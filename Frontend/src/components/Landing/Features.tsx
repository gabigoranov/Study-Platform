import { Brain, Lightbulb, MapPin, ListChecks, Podcast, Trophy } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Personalized Materials",
    description: "AI analyzes your learning style and creates custom study materials tailored to your needs.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Lightbulb,
    title: "Smart Flashcards",
    description: "Auto-generated flashcards from your lectures with spaced repetition algorithms for optimal retention.",
    gradient: "from-warning to-warning-light",
  },
  {
    icon: MapPin,
    title: "Visual Mindmaps",
    description: "Complex topics transformed into interactive mindmaps for better understanding and memory.",
    gradient: "from-success to-success-light",
  },
  {
    icon: ListChecks,
    title: "Adaptive Quizzes",
    description: "Intelligent quizzes that adapt to your knowledge level and focus on areas needing improvement.",
    gradient: "from-info to-info-light",
  },
  {
    icon: Podcast,
    title: "AI Podcasts",
    description: "Convert your study materials into engaging audio podcasts for learning on the go.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Trophy,
    title: "Compete & Earn Points",
    description: "Race with friends, earn points for completing tasks, and climb the leaderboard together.",
    gradient: "from-error to-warning",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="section-container container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
            Powerful Features for
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Smarter Learning</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Everything you need to transform your study experience and achieve your goals faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-surface border border-border rounded-2xl p-8 hover:shadow-glow transition-all duration-300 animate-slide-up hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              
              <div className="relative z-10">
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-soft`}>
                  <feature.icon className="w-7 h-7 text-text-inverted" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-text transition-colors text-left">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed text-left">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
