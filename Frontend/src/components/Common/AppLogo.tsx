import { Brain, Link } from "lucide-react";

export default function AppLogo() {
  return (
    <a href="/landing" className="flex items-center gap-2 group">
      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
        <Brain className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-text">AI Learning</span>
    </a>
  );
}
