import { useState } from "react";
import { useCMS } from "@/hooks/useCMS";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Episodes from "@/components/Episodes";
import About from "@/components/About";
import Engage from "@/components/Engage";
import Sponsors from "@/components/Sponsors";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import CMSPanel from "@/components/CMSPanel";

const Index = () => {
  const { content, update, updateMany, reset, isEditing, setIsEditing } = useCMS();
  const { episodes, loading, error, podcastTitle, podcastImage } = useRSSFeed(content.rssFeedUrl);
  const [contactOpen, setContactOpen] = useState(false);

  const latestEp = episodes[0];

  return (
    <div className={isEditing ? "cms-editing" : ""}>
      <Navbar
        content={content}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(v => !v)}
        onContactClick={() => setContactOpen(true)}
        onUpdate={update}
      />

      <main>
        <Hero
          content={content}
          isEditing={isEditing}
          onUpdate={update}
          latestEpisodeAudio={latestEp?.audioUrl}
          latestEpisodeTitle={latestEp?.title}
          latestEpisodeLink={latestEp?.link}
        />

        <Episodes
          content={content}
          isEditing={isEditing}
          onUpdate={update}
          episodes={episodes}
          loading={loading}
          error={error}
          podcastTitle={podcastTitle}
        />

        <About
          content={content}
          isEditing={isEditing}
          onUpdate={update}
          episodes={episodes.slice(0, 4)}
        />

        <Sponsors
          content={content}
          isEditing={isEditing}
          onUpdate={update}
        />

        <Newsletter
          content={content}
          isEditing={isEditing}
          onUpdate={update}
        />

        <Engage
          content={content}
          isEditing={isEditing}
          onUpdate={update}
          onContactClick={() => setContactOpen(true)}
        />
      </main>

      <Footer
        content={content}
        isEditing={isEditing}
        onUpdate={update}
        onContactClick={() => setContactOpen(true)}
      />

      {contactOpen && (
        <ContactModal
          content={content}
          isEditing={isEditing}
          onUpdate={update}
          onClose={() => setContactOpen(false)}
        />
      )}

      {isEditing && (
        <CMSPanel
          content={content}
          onUpdate={update}
          onReset={reset}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Index;
