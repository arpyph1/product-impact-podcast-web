import { Sponsor } from "@/components/Sponsors";
import { FAQItem } from "@/components/FAQ";

export interface NavItem {
  label: string;
  href: string;
}

export interface CMSContent {
  // Hero
  heroTitle: string;

  // Three hero video cards — each has a source mode + optional custom URL
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

  // Hosts — name, role, bio (400 char max), image
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

  // Hero description (h2)
  heroDescription: string;

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

  // Instagram & TikTok
  instagramUrl: string;
  tiktokUrl: string;

  // Contact
  contactEmail: string;
  contactSubject: string;

  // Footer
  footerTagline: string;

  // RSS
  rssFeedUrl: string;

  // Podcast name & logo text
  podcastName: string;

  // Nav links — dynamic arrays for left/right of logo
  navLeftItems: NavItem[];
  navRightItems: NavItem[];

  // Legacy nav links (kept for migration compat)
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

  // Acclaim / Stats
  acclaimStats: { value: string; label: string }[];

  // FAQ
  faqs: FAQItem[];
  faqTitle: string;

  // Testimonials
  testimonials: string[];

  // Subscribe section
  subscribeLabel: string;
  subscribeUrl: string;

  // Sponsor CTA
  sponsorCtaTitle: string;
  sponsorCtaDescription: string;

  // SEO / Meta
  metaDescription: string;
  googleSearchConsoleId: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
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
  heroVideo3Url: "",
  heroVideo3Label: "Top Episode",

  heroDescription: "Prove impact. Improve impact. Scale impact. Follow the Product Impact Podcast to learn frameworks and strategies to ensure your product is delivering impact to users, teams, businesses, and communities. We investigate enterprise adoption and highlight builders/startups disrupting value creation.",

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
  instagramUrl: "",
  tiktokUrl: "",

  contactEmail: "hello@productimpactpodcast.com",
  contactSubject: "Podcast Inquiry",

  footerTagline: "Product stories that actually matter.",

  rssFeedUrl: "https://anchor.fm/s/f32cce5c/podcast/rss",

  podcastName: "Product Impact Podcast",

  navLeftItems: [
    { label: "Episodes", href: "#episodes" },
    { label: "About", href: "#about" },
  ],
  navRightItems: [
    { label: "Listen", href: "#engage" },
  ],

  // Legacy — kept for backward compat with saved data
  navLink1Label: "Episodes",
  navLink1Href: "#episodes",
  navLink2Label: "About",
  navLink2Href: "#about",
  navLink3Label: "Listen",
  navLink3Href: "#engage",

  sponsors: [],
  sectionOrder: ["episodes", "acclaim", "subscribe", "hosts", "sponsors", "newsletter", "testimonials", "faq"],

  episodesTitle: "Latest Episodes",
  sponsorsTitle: "Our Sponsors",
  blogTitle: "From the Blog",

  h1FontSize: "clamp(2.4rem, 6vw, 5.5rem)",
  h1FontWeight: "900",
  h2FontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
  h2FontWeight: "800",

  acclaimStats: [
    { value: "Top 2%", label: "Most Shared Podcasts" },
    { value: "#1", label: "AI Strategy Podcast" },
    { value: "10,000+", label: "Followers" },
  ],

  faqs: [],
  faqTitle: "Frequently Asked Questions",

  testimonials: [
    "Great episode! Thoroughly enjoyed it! Learned a lot and very inspirational! Thank you",
    "Thank you for the sanity. I am a data scientist and the hype is completely out of control in my field. I have been pushing hard in my professional communities that we need to be more honest about the capabilities and limitations of LLMs",
    "Great episode. I love the show and always have great takeaways that help me. Big thank you to the team that makes this happen",
  ],

  subscribeLabel: "Never miss our AI Strategy Resources",
  subscribeUrl: "https://designofai.substack.com",

  sponsorCtaTitle: "Interested in sponsoring?",
  sponsorCtaDescription: "Reach thousands of engaged product leaders every week.",

  metaDescription: "Uncover the impact of AI on product management, design, GTM. We interview tech leaders to define how AI products create value and scale adoption.",
  googleSearchConsoleId: "",
  ogTitle: "Product Impact Podcast | AI Strategy & Value Creation",
  ogDescription: "Uncover the impact of AI on product management, design, GTM. We interview tech leaders to define how AI products create value and scale adoption.",
  ogImage: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c8de7ab-b8ed-4cbb-865e-e3d5f35b1f5f/id-preview-f59651d7--a4daec39-ad4a-4b53-a16b-06c30201f864.lovable.app-1771517475528.png",
  twitterTitle: "Product Impact Podcast | AI Strategy & Value Creation",
  twitterDescription: "Uncover the impact of AI on product management, design, GTM. We interview tech leaders to define how AI products create value and scale adoption.",
  twitterImage: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c8de7ab-b8ed-4cbb-865e-e3d5f35b1f5f/id-preview-f59651d7--a4daec39-ad4a-4b53-a16b-06c30201f864.lovable.app-1771517475528.png",
};
