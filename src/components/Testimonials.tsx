import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { CMSContent } from "@/types/cms";

const REVIEWS = [
  "Great episode! Thoroughly enjoyed it! Learned a lot and very inspirational! Thank you",
  "Thank you for the sanity. I am a data scientist and the hype is completely out of control in my field. I have been pushing hard in my professional communities that we need to be more honest about the capabilities and limitations of LLMs",
  "Great episode. I love the show and always have great takeaways that help me. Big thank you to the team that makes this happen",
];

const SOCIAL_ICONS = [
  {
    name: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "Substack",
    urlKey: "substackUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    urlKey: "linkedinUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    urlKey: "twitterUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

interface TestimonialsProps {
  content: CMSContent;
}

export default function Testimonials({ content }: TestimonialsProps) {
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
            <div className="relative min-h-[168px] flex items-center justify-center">
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

            {/* Social icons */}
            <div className="flex items-center justify-center gap-4 mt-10">
              {SOCIAL_ICONS.map(s => {
                const url = (content[s.urlKey] as string) || "#";
                return (
                  <a
                    key={s.name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200"
                  >
                    {s.svg}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
