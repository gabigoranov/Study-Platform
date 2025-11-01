import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Zap, Brain } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-glow/5 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text leading-tight">
            Master Your Studies with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Materials
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-text-muted mb-8 max-w-3xl mx-auto">
            Upload your lectures, get personalized study materials, and race for points with friends. 
            Transform learning into an engaging competition.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-text-muted">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <span>AI-Generated Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-success" />
              <span>Compete with Friends</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-info" />
              <span>Personalized Learning</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-full shadow-glow text-text-inverted"
            >
              Start Learning Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-full border-2 border-border hover:bg-surface-muted text-text"
            >
              Watch Demo
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
