import { Brain, Mail, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="section-container container mx-auto py-12 text-left">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-text">AI Learning</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed text-left">
              Transform your learning experience with AI-powered study materials and compete with friends.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-text mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-text-muted hover:text-primary transition-colors text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#demo" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-text-muted hover:text-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#blog" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-text mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#security" className="text-text-muted hover:text-primary transition-colors text-sm">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
            {/* Social links */}
            <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </a>
            <a
              href="mailto:contact@ailearning.com"
              className="w-10 h-10 rounded-full bg-surface-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </a>
          </div>
          </div>
          
          <p className="text-text-muted text-sm text-center mt-4">
            © {currentYear} AI Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
