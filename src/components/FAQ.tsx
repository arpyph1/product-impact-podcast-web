import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { Plus, Minus, GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function FAQ({ content, isEditing, onUpdate }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const faqs: FAQItem[] = (content as any).faqs || [];

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  const updateFAQ = (id: string, field: keyof FAQItem, value: string) => {
    const updated = faqs.map(f => (f.id === id ? { ...f, [field]: value } : f));
    onUpdate("faqs" as keyof CMSContent, updated);
  };

  const addFAQ = () => {
    const newItem: FAQItem = {
      id: Date.now().toString(),
      question: "New question?",
      answer: "Answer goes here.",
    };
    onUpdate("faqs" as keyof CMSContent, [...faqs, newItem]);
  };

  const removeFAQ = (id: string) => {
    onUpdate("faqs" as keyof CMSContent, faqs.filter(f => f.id !== id));
  };

  const moveFAQ = (id: string, dir: -1 | 1) => {
    const idx = faqs.findIndex(f => f.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= faqs.length) return;
    const next = [...faqs];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onUpdate("faqs" as keyof CMSContent, next);
  };

  if (!isEditing && faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-background" aria-label="Frequently asked questions">
      <div className="container mx-auto px-6">
        <div className="py-16 border-b border-border">
          {/* Two-column layout: title left, accordion right */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left: Title */}
            <div>
              <h2
                className="font-display font-extrabold uppercase leading-none tracking-tight text-foreground"
                style={{
                  fontSize: content.h2FontSize || "clamp(1.5rem, 3.5vw, 2.8rem)",
                  fontWeight: content.h2FontWeight || "800",
                  letterSpacing: "-0.02em",
                }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                  isEditing && onUpdate("faqTitle" as keyof CMSContent, e.currentTarget.textContent || "")
                }
              >
                {(content as any).faqTitle || "Frequently Asked Questions"}
              </h2>
            </div>

            {/* Right: Accordion */}
            <div className="flex flex-col">
              {faqs.map(faq => (
                <div key={faq.id} className="border-b border-border last:border-b-0">
                  {isEditing ? (
                    /* Edit mode */
                    <div className="py-4 space-y-2 bg-card/50 px-4 my-1 rounded-lg border border-amber/20">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input
                          className="flex-1 bg-muted border border-border rounded px-2 py-1.5 text-sm text-foreground font-semibold focus:outline-none focus:border-primary"
                          defaultValue={faq.question}
                          onBlur={e => updateFAQ(faq.id, "question", e.target.value)}
                          placeholder="Question"
                        />
                        <button
                          onClick={() => moveFAQ(faq.id, -1)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveFAQ(faq.id, 1)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFAQ(faq.id)}
                          className="p-1 text-coral hover:text-coral/80"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        className="w-full bg-muted border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                        rows={3}
                        defaultValue={faq.answer}
                        onBlur={e => updateFAQ(faq.id, "answer", e.target.value)}
                        placeholder="Answer"
                      />
                    </div>
                  ) : (
                    /* Display mode */
                    <div>
                      <button
                        onClick={() => toggle(faq.id)}
                        className="w-full flex items-center justify-between py-6 text-left group"
                      >
                        <span className="font-display font-semibold text-foreground text-lg pr-4 leading-snug">
                          {faq.question}
                        </span>
                        <span className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                          {openId === faq.id ? (
                            <Minus className="w-5 h-5 text-foreground" />
                          ) : (
                            <Plus className="w-5 h-5 text-foreground" />
                          )}
                        </span>
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight: openId === faq.id ? "500px" : "0",
                          opacity: openId === faq.id ? 1 : 0,
                        }}
                      >
                        <p className="text-muted-foreground leading-relaxed pb-6 pr-14">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  onClick={addFAQ}
                  className="mt-4 flex items-center gap-1.5 text-xs text-primary border border-primary/40 rounded px-3 py-1.5 hover:bg-primary/10 transition-colors self-start"
                >
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
