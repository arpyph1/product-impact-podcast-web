import { Sponsor } from "@/components/Sponsors";
import { FAQItem } from "@/components/FAQ";

export interface CMSContent {
  // Hero
  heroTitle: string;

  // Three hero video cards — each has a source mode + optional custom URL
  // mode: "custom" | "latest" | "second"
  heroVideo1Mode: string;
  heroVideo1Url: string;
  heroVideo1Label: string;
  heroVideo2Mode: string;
  heroVideo2Url: string;
  heroVideo2Label: string;
  heroVideo3Mode: string;
  heroVideo3Url: string;
  heroVideo3Label: string;

  // About section
  aboutDescription: string;

  // Hosts — name, role, bio (250 char max), image
  host1Name: string;
  host1Bio: string;
  host1ImageUrl: string;
  host1Role: string;
  host2Name: string;
  host2Bio: string;
  host2ImageUrl: string;
  host2Role: string;
  host1LinkedinUrl: string;
  host2LinkedinUrl: string;

  // Engage
  engageTitle: string;
  engageDescription: string;
  spotifyUrl: string;
  appleUrl: string;
  youtubeUrl: string;
  youtubeChannelId: string;
  substackUrl: string;
  linkedinUrl: string;
  twitterUrl: string;

  // Contact
  contactEmail: string;
  contactSubject: string;

  // Footer
  footerTagline: string;

  // RSS
  rssFeedUrl: string;

  // Podcast name & logo text
  podcastName: string;

  // Nav links (label|href pairs, pipe-separated)
  navLink1Label: string;
  navLink1Href: string;
  navLink2Label: string;
  navLink2Href: string;
  navLink3Label: string;
  navLink3Href: string;

  // Sponsors
  sponsors: Sponsor[];

  // Section ordering
  sectionOrder?: string[];

  // Editable section titles
  episodesTitle: string;
  sponsorsTitle: string;
  blogTitle: string;

  // Typography styling
  h1FontSize: string;
  h1FontWeight: string;
  h2FontSize: string;
  h2FontWeight: string;

  // FAQ
  faqs: FAQItem[];
  faqTitle: string;
}


export const defaultCMS: CMSContent = {
  heroTitle: "Product Impact Podcast",

  heroVideo1Mode: "latest_short",
  heroVideo1Url: "",
  heroVideo1Label: "Latest Short",
  heroVideo2Mode: "second_short",
  heroVideo2Url: "",
  heroVideo2Label: "2nd Latest Short",
  heroVideo3Mode: "custom",
  heroVideo3Url: "https://www.youtube.com/watch?v=B4EPW7JUMTM",
  heroVideo3Label: "Top Episode",

  aboutDescription: "Deep insights about how to improve the impact of your product. We focus on how to measure AI product success, scale impact, and ensure positive outcomes to teams, businesses, and communities.",

  host1Name: "Arpy Dragffy Guerrero",
  host1Bio: "",
  host1ImageUrl: "",
  host1Role: "Host",
  host2Name: "Brittany Hobbs",
  host2Bio: "",
  host2ImageUrl: "",
  host2Role: "Co-Host",
  host1LinkedinUrl: "https://www.linkedin.com/in/adragffy/",
  host2LinkedinUrl: "https://www.linkedin.com/in/brittanyhobbs/",

  engageTitle: "Join the Community",
  engageDescription: "Get exclusive behind-the-scenes content, early access to episodes, and connect with fellow product leaders from around the world.",
  spotifyUrl: "#",
  appleUrl: "#",
  youtubeUrl: "#",
  youtubeChannelId: "UCb1nY02YcJYZZ_XtvcIBcrw",
  substackUrl: "https://designofai.substack.com",
  linkedinUrl: "",
  twitterUrl: "",

  contactEmail: "hello@productimpactpodcast.com",
  contactSubject: "Podcast Inquiry",

  footerTagline: "Product stories that actually matter.",

  rssFeedUrl: "https://anchor.fm/s/f32cce5c/podcast/rss",

  podcastName: "Product Impact Podcast",

  navLink1Label: "Episodes",
  navLink1Href: "#episodes",
  navLink2Label: "About",
  navLink2Href: "#about",
  navLink3Label: "Listen",
  navLink3Href: "#engage",

  sponsors: [],
  sectionOrder: ["episodes", "acclaim", "hosts", "sponsors", "newsletter", "testimonials", "faq"],

  episodesTitle: "Latest Episodes",
  sponsorsTitle: "Our Sponsors",
  blogTitle: "From the Blog",

  h1FontSize: "clamp(2.4rem, 6vw, 5.5rem)",
  h1FontWeight: "900",
  h2FontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
  h2FontWeight: "800",

  faqs: [],
  faqTitle: "Frequently Asked Questions",
};
