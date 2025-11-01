import Features from "@/components/Landing/Features";
import Footer from "@/components/Landing/Footer";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import FAQ from "@/components/Landing/FAQ";
import Navigation from "@/components/Landing/Navigation";
import VideoDemo from "@/components/Landing/VideoDemo";
import "../../Landing.css";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <VideoDemo />
      <FAQ />
      <Footer />
    </div>
  );
}
