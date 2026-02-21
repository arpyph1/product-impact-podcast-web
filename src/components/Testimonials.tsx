import { useState, useEffect } from "react";
import { Quote, Plus, X } from "lucide-react";
import { CMSContent } from "@/types/cms";

const DEFAULT_REVIEWS = [
  "Great episode! Thoroughly enjoyed it! Learned a lot and very inspirational! Thank you",
  "Thank you for the sanity. I am a data scientist and the hype is completely out of control in my field. I have been pushing hard in my professional communities that we need to be more honest about the capabilities and limitations of LLMs",
  "Great episode. I love the show and always have great takeaways that help me. Big thank you to the team that makes this happen",
];

interface TestimonialsProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function Testimonials({ content, isEditing, onUpdate }: TestimonialsProps) {
  const reviews = (content.testimonials && content.testimonials.length > 0) ? content.testimonials : DEFAULT_REVIEWS;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isEditing) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length, isEditing]);

  // Keep current in bounds
  useEffect(() => {
    if (current >= reviews.length) setCurrent(0);
  }, [reviews.length, current]);

  const updateReview = (idx: number, value: string) => {
    const next = [...reviews];
    next[idx] = value;
    onUpdate("testimonials", next);
  };

  const addReview = () => {
    onUpdate("testimonials", [...reviews, "New testimonial…"]);
  };

  const removeReview = (idx: number) => {
    const next = reviews.filter((_, i) => i !== idx);
    onUpdate("testimonials", next);
  };

  return (
    <section className="bg-background" aria-label="Listener testimonials">
      <div className="container mx-auto px-6">
        <div className="py-20 border-b border-border">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-10 h-10 text-primary mx-auto mb-8 opacity-60" />

            {isEditing ? (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="relative">
                    <textarea
                      rows={3}
                      className="w-full bg-card border border-amber/50 text-foreground rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber resize-none"
                      value={review}
                      onChange={e => updateReview(i, e.target.value)}
                    />
                    <button
                      onClick={() => removeReview(i)}
                      className="absolute top-2 right-2 p-1 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addReview}
                  className="flex items-center gap-1.5 text-xs text-amber hover:text-amber/80 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add testimonial
                </button>
              </div>
            ) : (
              <>
                <div className="relative min-h-[168px] flex items-center justify-center">
                  {reviews.map((review, i) => (
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
                <div className="flex items-center justify-center gap-2 mt-10">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === current ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
