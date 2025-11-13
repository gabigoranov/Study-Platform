import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Button } from "../ui/button";

const VideoDemo = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [inView, setInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Observe when the section gets into view
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Set videoLoaded when section is in view
  useEffect(() => {
    if (inView && !videoLoaded) {
      setVideoLoaded(true);
    }
  }, [inView, videoLoaded]);

  // Try to play video when loaded
  useEffect(() => {
    if (!videoLoaded) return;

    const tryPlay = async () => {
      const v = videoRef.current;
      if (!v) return;

      try {
        await v.play();
      } catch (err) {
        v.controls = true;
      }
    };

    const id = window.setTimeout(tryPlay, 50);
    return () => window.clearTimeout(id);
  }, [videoLoaded]);

  // Replay when ended
  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {
      v.controls = true;
    });
  };

  // Handle zoom toggle
  const handleZoom = () => {
    setIsZoomed(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
    document.body.style.overflow = "";
  };

  // Handle scroll to close zoom
  useEffect(() => {
    if (!isZoomed) return;

    const handleScroll = () => {
      handleCloseZoom();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isZoomed]);

  // Handle click outside to close zoom
  const handleOverlayClick = (e: React.MouseEvent) => {
    console.log("clicked");

    handleCloseZoom();
  };

  return (
    <>
      <section
        id="demo"
        ref={containerRef as any}
        className="py-20 px-4 bg-background"
      >
        <div className="section-container container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
                {t(keys.seeItInAction)}
              </h2>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                {t(keys.watchHowAIDataTransforms)}
              </p>
            </div>

            <div className="relative group animate-scale-in flex flex-col items-center justify-center">
              <div className="relative bg-surface-muted rounded-2xl overflow-hidden shadow-glow">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-success/20 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={videoLoaded ? "/demo.webm" : undefined}
                    playsInline
                    muted
                    preload={videoLoaded ? "metadata" : "none"}
                    onEnded={handleEnded}
                  />

                  {!videoLoaded && (
                    <>
                      <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700" />
                      </div>

                      <div className="absolute top-8 left-8 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-soft animate-slide-up">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium text-text">
                            {t(keys.flashcardsGenerated)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="hidden sm:grid md:grid-cols-3 gap-6 p-8 bg-surface">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      30 sec
                    </div>
                    <div className="text-sm text-text-muted">
                      {t(keys.processingTime)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">
                      50+
                    </div>
                    <div className="text-sm text-text-muted">
                      {t(keys.materialsCreated)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      100%
                    </div>
                    <div className="text-sm text-text-muted">
                      {t(keys.customized)}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                className="sm:hidden py-6 px-10 mt-6 mx-auto"
                onClick={handleZoom}
              >
                {t(keys.zoomIn)}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Zoom Overlay */}
      {isZoomed && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in duration-300"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <video
                className="w-full h-full object-contain"
                src="/demo.webm"
                playsInline
                muted
                autoPlay
                loop
              />
            </div>

            <div className="absolute bottom-8 text-center text-white/60 text-sm">
              {t(keys.clickOutside)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDemo;
