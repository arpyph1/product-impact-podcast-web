import { Sponsor } from "@/components/Sponsors";

export interface CMSContent {
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroCardBg: string;
  heroImageUrl: string;
  featuredVideoUrl: string;

  // Podcast / About section
  aboutTitle: string;
  aboutDescription: string;
  aboutCta: string;
  aboutCardBg: string;
  tags: string[];

  // Hosts — name, role, bio (250 char max), image
  host1Name: string;
  host1Bio: string;
  host1ImageUrl: string;
  host1Role: string;
  host2Name: string;
  host2Bio: string;
  host2ImageUrl: string;
  host2Role: string;

  // Engage
  engageTitle: string;
  engageDescription: string;
  engageCta: string;
  spotifyUrl: string;
  appleUrl: string;
  youtubeUrl: string;

  // Contact
  contactEmail: string;
  contactSubject: string;

  // Footer
  footerTagline: string;

  // RSS
  rssFeedUrl: string;

  // Newsletter (Substack)
  substackUrl: string;

  // Podcast name & logo text
  podcastName: string;
  podcastTagline: string;

  // Nav links (label|href pairs, pipe-separated)
  navLink1Label: string;
  navLink1Href: string;
  navLink2Label: string;
  navLink2Href: string;
  navLink3Label: string;
  navLink3Href: string;

  // Sponsors
  sponsors: Sponsor[];
}

export const defaultCMS: CMSContent = {
  heroTitle: "Product Impact Podcast",
  heroSubtitle: "The Podcast",
  heroDescription: "Conversations at the intersection of product, people, and purpose. Real stories from product leaders who are building what's next.",
  heroCta1Text: "Listen Now",
  heroCta1Link: "#episodes",
  heroCta2Text: "Subscribe",
  heroCta2Link: "#engage",
  heroCardBg: "coral",
  heroImageUrl: "",
  featuredVideoUrl: "https://www.youtube.com/watch?v=B4EPW7JUMTM",

  aboutTitle: "About the Show",
  aboutDescription: "We go deep with product leaders, founders, and innovators to unpack the decisions, frameworks, and mindsets behind impactful products.",
  aboutCta: "All Episodes",
  aboutCardBg: "teal",
  tags: ["Product", "Strategy", "Leadership", "Innovation"],

  host1Name: "Host Name",
  host1Bio: "Former VP of Product at a Fortune 500 company turned podcast host. A decade building products at the intersection of design, data, and human behaviour.",
  host1ImageUrl: "",
  host1Role: "Host",
  host2Name: "Co-Host Name",
  host2Bio: "Product strategist, speaker, and advisor. Has helped scale teams at three unicorn startups and writes about product culture for leading industry publications.",
  host2ImageUrl: "",
  host2Role: "Co-Host",

  engageTitle: "Join the Community",
  engageDescription: "Get exclusive behind-the-scenes content, early access to episodes, and connect with fellow product leaders from around the world.",
  engageCta: "Get in Touch",
  spotifyUrl: "#",
  appleUrl: "#",
  youtubeUrl: "#",

  contactEmail: "hello@productimpactpodcast.com",
  contactSubject: "Podcast Inquiry",

  footerTagline: "Product stories that actually matter.",

  rssFeedUrl: "https://feeds.megaphone.fm/darknet-diaries",
  substackUrl: "",

  podcastName: "Product Impact Podcast",
  podcastTagline: "Product stories that actually matter.",

  navLink1Label: "Episodes",
  navLink1Href: "#episodes",
  navLink2Label: "About",
  navLink2Href: "#about",
  navLink3Label: "Listen",
  navLink3Href: "#engage",

  sponsors: [],
};
