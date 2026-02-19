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

  // Hosts
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

  // Podcast name & logo text
  podcastName: string;
  podcastTagline: string;
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
  featuredVideoUrl: "",

  aboutTitle: "About the Show",
  aboutDescription: "We go deep with product leaders, founders, and innovators to unpack the decisions, frameworks, and mindsets behind impactful products.",
  aboutCta: "All Episodes",
  aboutCardBg: "teal",
  tags: ["Product", "Strategy", "Leadership", "Innovation"],

  host1Name: "Host Name",
  host1Bio: "Product leader and podcast host.",
  host1ImageUrl: "",
  host1Role: "Host",
  host2Name: "Co-Host Name",
  host2Bio: "Product strategist and speaker.",
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

  podcastName: "Product Impact Podcast",
  podcastTagline: "Product stories that actually matter.",
};
