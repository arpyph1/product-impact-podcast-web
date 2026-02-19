import { useState } from "react";
import { useCMS } from "@/hooks/useCMS";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Episodes from "@/components/Episodes";
import Hosts from "@/components/Hosts";
import Stats from "@/components/Stats";
import Sponsors from "@/components/Sponsors";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import CMSPanel from "@/components/CMSPanel";

// Section ordering — about is now merged into hero
type SectionId = "acclaim" | "episodes" | "hosts" | "sponsors" | "newsletter" | "testimonials" | "faq";

const DEFAULT_ORDER: SectionId[] = ["episodes", "acclaim", "hosts", "sponsors", "newsletter", "testimonials", "faq"];

const Index = () => {
  const { content, update, updateMany, reset, isEditing, setIsEditing } = useCMS();
  const { episodes, loading, error, podcastTitle } = useRSSFeed(content.rssFeedUrl);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInquiry, setContactInquiry] = useState("");

  const rawOrder = ((content as any).sectionOrder as string[] | undefined) || DEFAULT_ORDER;
  const knownIds = new Set<SectionId>(["acclaim", "episodes", "hosts", "sponsors", "newsletter", "testimonials", "faq"]);
  const sectionOrder: SectionId[] = rawOrder.filter(id => knownIds.has(id as SectionId)) as SectionId[];
  DEFAULT_ORDER.forEach(id => { if (!sectionOrder.includes(id)) sectionOrder.push(id); });

  const moveSectionUp = (id: SectionId) => {
    const idx = sectionOrder.indexOf(id);
    if (idx <= 0) return;
    const next = [...sectionOrder];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    update("sectionOrder" as keyof typeof content, next);
  };

  const moveSectionDown = (id: SectionId) => {
    const idx = sectionOrder.indexOf(id);
    if (idx < 0 || idx >= sectionOrder.length - 1) return;
    const next = [...sectionOrder];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    update("sectionOrder" as keyof typeof content, next);
  };

  const latestEp = episodes[0];

  const renderSection = (id: SectionId) => {
    const controls = isEditing ? (
      <div className="flex items-center justify-end gap-2 px-6 py-1 bg-amber/10 border-b border-amber/20">
        <span className="text-[10px] uppercase tracking-widest text-amber/60 mr-auto font-semibold">{id}</span>
        <button onClick={() => moveSectionUp(id)} className="text-[10px] px-2 py-0.5 rounded border border-amber/30 text-amber hover:bg-amber/20 transition-colors">↑ Move Up</button>
        <button onClick={() => moveSectionDown(id)} className="text-[10px] px-2 py-0.5 rounded border border-amber/30 text-amber hover:bg-amber/20 transition-colors">↓ Move Down</button>
      </div>
    ) : null;

    switch (id) {
      case "acclaim":
        return <div key="acclaim">{controls}<Stats /></div>;
      case "episodes":
        return (
          <div key="episodes">
            {controls}
            <Episodes content={content} isEditing={isEditing} onUpdate={update} episodes={episodes} loading={loading} error={error} podcastTitle={podcastTitle} />
          </div>
        );
      case "hosts":
        return <div key="hosts">{controls}<Hosts content={content} isEditing={isEditing} onUpdate={update} /></div>;
      case "sponsors":
        return <div key="sponsors">{controls}<Sponsors content={content} isEditing={isEditing} onUpdate={update} onContactClick={(t) => { setContactInquiry(t || ""); setContactOpen(true); }} /></div>;
      case "newsletter":
        return <div key="newsletter">{controls}<Newsletter content={content} isEditing={isEditing} onUpdate={update} /></div>;
      case "testimonials":
        return <div key="testimonials">{controls}<Testimonials /></div>;
      case "faq":
        return <div key="faq">{controls}<FAQ content={content} isEditing={isEditing} onUpdate={update} /></div>;
      default:
        return null;
    }
  };

  return (
    <div className={isEditing ? "cms-editing" : ""}>
      <Navbar content={content} isEditing={isEditing} onToggleEdit={() => setIsEditing(v => !v)} onContactClick={() => { setContactInquiry(""); setContactOpen(true); }} onUpdate={update} />

      <main>
        <Hero content={content} isEditing={isEditing} onUpdate={update} latestEpisodeAudio={latestEp?.audioUrl} latestEpisodeTitle={latestEp?.title} latestEpisodeLink={latestEp?.link} episodes={episodes} />
        {sectionOrder.map(id => renderSection(id))}
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => { setContactInquiry(""); setContactOpen(true); }} />

      {contactOpen && <ContactModal content={content} isEditing={isEditing} onUpdate={update} onClose={() => setContactOpen(false)} defaultInquiryType={contactInquiry} />}

      {isEditing && <CMSPanel content={content} onUpdate={update} onReset={reset} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

export default Index;
