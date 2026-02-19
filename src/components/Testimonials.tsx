import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const REVIEWS = [
  "Great episode! Thoroughly enjoyed it! Learned a lot and very inspirational! Thank you",
  "Thank you for the sanity. I am a data scientist and the hype is completely out of control in my field. I have been pushing hard in my professional communities that we need to be more honest about the capabilities and limitations of LLMs",
  "Great episode. I love the show and always have great takeaways that help me. Big thank you to the team that makes this happen",
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-background">
      <div className="container mx-auto px-6">
        <div className="py-20 border-b border-border">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-10 h-10 text-primary mx-auto mb-8 opacity-60" />
            <div className="relative min-h-[120px] flex items-center justify-center">
              {REVIEWS.map((review, i) => (
                <p
                  key={i}
                  className="absolute inset-0 flex items-center justify-center font-display text-foreground leading-relaxed transition-all duration-700"
                  style={{
                    fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                    opacity: i === current ? 1 : 0,
                    transform: i === current ? "translateY(0)" : "translateY(12px)",
                  }}
                >
                  "{review}"
                </p>
              ))}
            </div>
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
