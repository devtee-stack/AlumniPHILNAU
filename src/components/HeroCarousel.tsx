import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroCarouselProps {
  openAuthModal: (mode: "login" | "register") => void;
}

const slides = [
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
    title: "Welcome to the Alumni Association of the Department of Philosophy, UNIZIK",
    description: "Connect with fellow alumni, discover career paths, attend events, and mentor the next generation.",
    cta1: "Join Now",
    cta2: "Explore Directory",
    cta2Link: "directory",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    title: "Mentorship & Careers",
    description: "Sign up to apply for mentorships, browse exclusive job postings, and access career resources.",
    cta1: "Apply for Mentorship",
    cta1Link: "mentorship",
    cta2: "See Jobs",
    cta2Link: "careers",
  },
  {
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
    title: "Events & Webinars",
    description: "Attend workshops and reunions — keep an eye on our events calendar for upcoming sessions.",
    cta1: "View Events",
    cta1Link: "events",
    cta2: "Join Discussion",
    cta2Link: "forum",
  },
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    title: "Alumni Stories",
    description: "Read spotlights and achievements from our distinguished alumni network across the world.",
    cta1: "Latest News",
    cta1Link: "news",
    cta2: "Meet the Team",
    cta2Link: "about",
  },
];

const HeroCarousel = ({ openAuthModal }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
          
          <div className="relative h-full container mx-auto px-4 flex items-center justify-center">
            <div className="text-center max-w-4xl animate-fade-in">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() =>
                    slide.cta1Link ? scrollToSection(slide.cta1Link) : openAuthModal("register")
                  }
                  size="lg"
                  variant="gold"
                >
                  {slide.cta1}
                </Button>
                <Button
                  onClick={() => slide.cta2Link && scrollToSection(slide.cta2Link)}
                  size="lg"
                  variant="hero"
                >
                  {slide.cta2}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-gold w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
