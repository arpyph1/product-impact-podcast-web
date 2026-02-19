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

  // Podcast / About section
  aboutTitle: string;
  aboutDescription: string;
  aboutCta: string;
  aboutCardBg: string;
  tags: string[];

  // Engage
  engageTitle: string;
  engageDescription: string;
  engageCta: string;

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
  heroCta1Text: "Our Dark Podcast",
  heroCta1Link: "#episodes",
  heroCta2Text: "Subscribe Now",
  heroCta2Link: "#subscribe",
  heroCardBg: "coral",

  aboutTitle: "First Podcast Episode",
  aboutDescription: "We dive deep into the topics that shape our digital world. Expect candid conversations, bold opinions, and perspectives you won't hear anywhere else.",
  aboutCta: "All Episodes",
  aboutCardBg: "teal",
  tags: ["Tech", "Design", "Culture", "Future"],

  engageTitle: "Join the Community",
  engageDescription: "Get exclusive behind-the-scenes content, early access to episodes, and connect with fellow listeners from around the world.",
  engageCta: "Join Now",

  contactEmail: "hello@darkmodepodcast.com",
  contactSubject: "Podcast Inquiry",

  footerTagline: "Broadcasting from the dark side.",

  rssFeedUrl: "https://feeds.megaphone.fm/darknet-diaries",

  podcastName: "Dark Mode",
  podcastTagline: "Go deep or go home.",
};
