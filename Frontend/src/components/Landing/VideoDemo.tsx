import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoDemo = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="section-container container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
              See It in Action
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Watch how AI transforms your study materials in seconds
            </p>
          </div>

          {/* Video container with interactive preview */}
          <div className="relative group animate-scale-in">
            {/* Gradient border effect */}
            <div className="absolute -inset-1 bg-gradient-primary rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative bg-surface-muted rounded-2xl overflow-hidden shadow-glow">
              {/* Video placeholder with play button */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-success/20 flex items-center justify-center">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700"></div>
                </div>

                {/* Play button */}
                <Button
                  size="lg"
                  className="relative z-10 w-20 h-20 rounded-full bg-gradient-primary hover:scale-110 transition-transform shadow-glow"
                >
                  <Play className="w-8 h-8 text-text-inverted ml-1" fill="currentColor" />
                </Button>

                {/* Floating feature cards */}
                <div className="absolute top-8 left-8 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-soft animate-slide-up">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-text">Flashcards Generated</span>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-soft animate-slide-up" style={{ animationDelay: "200ms" }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-text">Quiz Created</span>
                  </div>
                </div>
              </div>

              {/* Demo features */}
              <div className="grid md:grid-cols-3 gap-6 p-8 bg-surface">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">30 sec</div>
                  <div className="text-sm text-text-muted">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">50+</div>
                  <div className="text-sm text-text-muted">Materials Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">100%</div>
                  <div className="text-sm text-text-muted">Customized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;
