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
  heroTitle: "Dark Mode",
  heroSubtitle: "The Podcast",
  heroDescription: "Conversations at the intersection of technology, creativity, and culture. We go deep so you don't have to.",
  heroCta1Text: "Listen Now",
  heroCta1Link: "#episodes",
  heroCta2Text: "Subscribe",
  heroCta2Link: "#engage",
  heroCardBg: "coral",
  heroImageUrl: "",
  featuredVideoUrl: "",

  aboutTitle: "About the Show",
  aboutDescription: "We dive deep into the topics that shape our digital world. Expect candid conversations, bold opinions, and perspectives you won't hear anywhere else.",
  aboutCta: "All Episodes",
  aboutCardBg: "teal",
  tags: ["Tech", "Design", "Culture", "Future"],

  host1Name: "Alex Rivera",
  host1Bio: "Tech journalist & digital culture writer with a decade covering Silicon Valley.",
  host1ImageUrl: "",
  host1Role: "Co-Host",
  host2Name: "Sam Chen",
  host2Bio: "Product designer & researcher obsessed with how technology shapes human behavior.",
  host2ImageUrl: "",
  host2Role: "Co-Host",

  engageTitle: "Join the Community",
  engageDescription: "Get exclusive behind-the-scenes content, early access to episodes, and connect with fellow listeners from around the world.",
  engageCta: "Get in Touch",
  spotifyUrl: "#",
  appleUrl: "#",
  youtubeUrl: "#",

  contactEmail: "hello@darkmodepodcast.com",
  contactSubject: "Podcast Inquiry",

  footerTagline: "Broadcasting from the dark side.",

  rssFeedUrl: "https://feeds.megaphone.fm/darknet-diaries",

  podcastName: "Dark Mode",
  podcastTagline: "Go deep or go home.",
};
