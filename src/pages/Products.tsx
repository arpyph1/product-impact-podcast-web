import { useState } from "react";
import { useCMS } from "@/hooks/useCMS";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight, Star } from "lucide-react";

interface Product {
  name: string;
  url: string;
  category: string;
  unique: string;
}

// Ordered by approximate online popularity/mentions (highest first).
// Categories reflect PM use-cases.
const AI_PRODUCTS: Product[] = [
  // — User Research & Insights —
  { name: "Perplexity", url: "https://perplexity.ai", category: "User Research & Insights", unique: "AI answer engine with real-time source citations" },
  { name: "Yutori", url: "https://yutori.app", category: "User Research & Insights", unique: "AI-powered online research agents for deep web research" },
  { name: "Elicit", url: "https://elicit.com", category: "User Research & Insights", unique: "AI research assistant for academic paper analysis" },
  { name: "Consensus", url: "https://consensus.app", category: "User Research & Insights", unique: "AI search engine for peer-reviewed scientific claims" },
  { name: "Glean", url: "https://glean.com", category: "User Research & Insights", unique: "AI-powered work assistant that searches all company apps" },

  // — Prototyping & Design —
  { name: "Figma AI", url: "https://figma.com", category: "Prototyping & Design", unique: "AI-powered design features inside collaborative canvas" },
  { name: "Canva Magic Studio", url: "https://canva.com", category: "Prototyping & Design", unique: "AI creative suite inside visual design platform" },
  { name: "Midjourney", url: "https://midjourney.com", category: "Prototyping & Design", unique: "Artistic AI image generation with distinctive aesthetics" },
  { name: "Galileo AI", url: "https://usegalileo.ai", category: "Prototyping & Design", unique: "Text-to-UI design generation for product teams" },
  { name: "Uizard", url: "https://uizard.io", category: "Prototyping & Design", unique: "Sketch-to-prototype with AI design assistance" },
  { name: "Magician (Diagram)", url: "https://diagram.com", category: "Prototyping & Design", unique: "AI design tools plugin suite for Figma" },
  { name: "Recraft", url: "https://recraft.ai", category: "Prototyping & Design", unique: "AI vector and raster image generation with brand consistency" },
  { name: "Spline AI", url: "https://spline.design", category: "Prototyping & Design", unique: "AI-assisted 3D object and scene generation" },
  { name: "Ideogram", url: "https://ideogram.ai", category: "Prototyping & Design", unique: "Best-in-class text rendering in AI images" },
  { name: "Leonardo.ai", url: "https://leonardo.ai", category: "Prototyping & Design", unique: "AI image generation with fine-tuned gaming/design models" },

  // — Product Development & Engineering —
  { name: "Cursor", url: "https://cursor.sh", category: "Product Development", unique: "AI-first code editor with codebase-aware completions" },
  { name: "Replit", url: "https://replit.com", category: "Product Development", unique: "AI-native IDE with instant deployment" },
  { name: "Lovable", url: "https://lovable.dev", category: "Product Development", unique: "AI full-stack web app builder from natural language" },
  { name: "v0", url: "https://v0.dev", category: "Product Development", unique: "Generative UI from Vercel using shadcn components" },
  { name: "Bolt", url: "https://bolt.new", category: "Product Development", unique: "Prompt-to-full-stack app in the browser" },
  { name: "Windsurf", url: "https://codeium.com", category: "Product Development", unique: "AI-powered IDE with Cascade agentic flows" },
  { name: "Tabnine", url: "https://tabnine.com", category: "Product Development", unique: "Privacy-focused AI code assistant for enterprises" },
  { name: "Codium AI", url: "https://codium.ai", category: "Product Development", unique: "AI test generation and code integrity checking" },
  { name: "Retool AI", url: "https://retool.com", category: "Product Development", unique: "AI-enhanced internal tool builder for enterprises" },

  // — Stakeholder Communication & Presentations —
  { name: "Gamma", url: "https://gamma.app", category: "Stakeholder Communication", unique: "AI-native slide deck and document creation" },
  { name: "Tome", url: "https://tome.app", category: "Stakeholder Communication", unique: "AI storytelling and narrative building for teams" },
  { name: "Beautiful.ai", url: "https://beautiful.ai", category: "Stakeholder Communication", unique: "Smart slide design with adaptive AI layouts" },
  { name: "Loom AI", url: "https://loom.com", category: "Stakeholder Communication", unique: "AI-generated video summaries and chapters" },
  { name: "Miro AI", url: "https://miro.com", category: "Stakeholder Communication", unique: "AI-powered whiteboard for team brainstorming" },

  // — Meeting & Collaboration —
  { name: "Otter.ai", url: "https://otter.ai", category: "Meetings & Collaboration", unique: "Real-time transcription with speaker identification" },
  { name: "Granola", url: "https://granola.ai", category: "Meetings & Collaboration", unique: "AI notepad that enhances your own meeting notes" },
  { name: "Fireflies.ai", url: "https://fireflies.ai", category: "Meetings & Collaboration", unique: "Cross-platform meeting recording with topic detection" },
  { name: "Krisp", url: "https://krisp.ai", category: "Meetings & Collaboration", unique: "AI noise cancellation and meeting transcription" },
  { name: "Notion AI", url: "https://notion.so", category: "Meetings & Collaboration", unique: "AI assistant embedded in collaborative workspace" },
  { name: "Coda AI", url: "https://coda.io", category: "Meetings & Collaboration", unique: "AI-powered docs that work like apps" },
  { name: "Taskade", url: "https://taskade.com", category: "Meetings & Collaboration", unique: "AI agents that automate entire project workflows" },
  { name: "Mem", url: "https://mem.ai", category: "Meetings & Collaboration", unique: "Self-organizing AI knowledge base for teams" },

  // — Roadmap & Project Management —
  { name: "Motion", url: "https://usemotion.com", category: "Roadmap & Planning", unique: "AI auto-schedules tasks across calendar" },
  { name: "Clockwise", url: "https://clockwise.com", category: "Roadmap & Planning", unique: "AI calendar optimization for focus time" },
  { name: "Reclaim.ai", url: "https://reclaim.ai", category: "Roadmap & Planning", unique: "AI scheduling for habits, tasks, and meetings" },

  // — Content & Go-to-Market —
  { name: "Jasper", url: "https://jasper.ai", category: "Content & Go-to-Market", unique: "Brand voice-aware AI marketing content engine" },
  { name: "Copy.ai", url: "https://copy.ai", category: "Content & Go-to-Market", unique: "Go-to-market AI workflows for sales & marketing" },
  { name: "Writer", url: "https://writer.com", category: "Content & Go-to-Market", unique: "Full-stack generative AI for enterprise content governance" },
  { name: "Grammarly", url: "https://grammarly.com", category: "Content & Go-to-Market", unique: "Context-aware writing with tone and brand detection" },
  { name: "Typeface", url: "https://typeface.ai", category: "Content & Go-to-Market", unique: "Brand-safe generative AI for enterprise marketing" },
  { name: "Anyword", url: "https://anyword.com", category: "Content & Go-to-Market", unique: "Predictive performance scoring for AI copy" },
  { name: "Phrasee", url: "https://phrasee.co", category: "Content & Go-to-Market", unique: "AI-optimized brand language for email & push" },
  { name: "Pencil", url: "https://trypencil.com", category: "Content & Go-to-Market", unique: "AI-generated ad creatives with performance prediction" },

  // — Customer Feedback & Support —
  { name: "Intercom Fin", url: "https://intercom.com", category: "Customer Feedback & Support", unique: "AI chatbot that resolves 50%+ support tickets" },
  { name: "Ada", url: "https://ada.cx", category: "Customer Feedback & Support", unique: "AI-first customer service automation platform" },
  { name: "Hiver", url: "https://hiverhq.com", category: "Customer Feedback & Support", unique: "AI-powered shared inbox for Gmail teams" },

  // — Sales & Revenue Intelligence —
  { name: "Gong", url: "https://gong.io", category: "Sales & Revenue Intelligence", unique: "AI conversation analytics for sales teams" },
  { name: "Apollo.io", url: "https://apollo.io", category: "Sales & Revenue Intelligence", unique: "AI-powered sales intelligence and engagement" },
  { name: "Clay", url: "https://clay.com", category: "Sales & Revenue Intelligence", unique: "AI data enrichment and personalized outreach at scale" },
  { name: "Lavender", url: "https://lavender.ai", category: "Sales & Revenue Intelligence", unique: "AI email coaching for sales outreach" },
  { name: "Chorus.ai", url: "https://chorus.ai", category: "Sales & Revenue Intelligence", unique: "AI meeting analysis for deal insights" },
  { name: "Superhuman", url: "https://superhuman.com", category: "Sales & Revenue Intelligence", unique: "AI-powered email with instant reply drafts" },
  { name: "Shortwave", url: "https://shortwave.com", category: "Sales & Revenue Intelligence", unique: "AI-first email client with smart bundling" },

  // — Video & Demo Creation —
  { name: "Runway", url: "https://runwayml.com", category: "Video & Demo Creation", unique: "Gen-3 video generation from text and images" },
  { name: "Descript", url: "https://descript.com", category: "Video & Demo Creation", unique: "Edit video by editing text transcript" },
  { name: "Synthesia", url: "https://synthesia.io", category: "Video & Demo Creation", unique: "AI avatars for corporate video at scale" },
  { name: "HeyGen", url: "https://heygen.com", category: "Video & Demo Creation", unique: "Multilingual AI avatar videos with lip-sync" },
  { name: "Pika", url: "https://pika.art", category: "Video & Demo Creation", unique: "Cinematic AI video with lip-sync and effects" },
  { name: "Luma AI", url: "https://lumalabs.ai", category: "Video & Demo Creation", unique: "NeRF-based 3D capture and Dream Machine video" },
  { name: "Opus Clip", url: "https://opus.pro", category: "Video & Demo Creation", unique: "AI short-form clip extraction from long videos" },
  { name: "Captions", url: "https://captions.ai", category: "Video & Demo Creation", unique: "AI-powered video editing with auto-captions and eye contact" },

  // — Documentation & Process Capture —
  { name: "Tango", url: "https://tango.us", category: "Documentation & Process", unique: "Auto-generates step-by-step guides from screen recordings" },
  { name: "Scribe", url: "https://scribehow.com", category: "Documentation & Process", unique: "AI process documentation from workflow capture" },

  // — Landing Pages & Websites —
  { name: "Framer AI", url: "https://framer.com", category: "Landing Pages & Websites", unique: "AI-powered site generation with visual editing" },
  { name: "Mixo", url: "https://mixo.io", category: "Landing Pages & Websites", unique: "AI-generated landing pages in seconds" },
  { name: "Durable", url: "https://durable.co", category: "Landing Pages & Websites", unique: "AI business website builder with CRM" },
  { name: "Hostinger AI", url: "https://hostinger.com", category: "Landing Pages & Websites", unique: "AI website builder with hosting included" },

  // — Voice & Audio —
  { name: "ElevenLabs", url: "https://elevenlabs.io", category: "Voice & Audio", unique: "Ultra-realistic voice cloning and synthesis" },
  { name: "Murf.ai", url: "https://murf.ai", category: "Voice & Audio", unique: "Studio-quality AI voiceovers for enterprises" },
  { name: "Bland AI", url: "https://bland.ai", category: "Voice & Audio", unique: "AI phone agents for enterprise calling at scale" },
  { name: "Vapi", url: "https://vapi.ai", category: "Voice & Audio", unique: "Developer platform for building voice AI agents" },

  // — Podcasting —
  { name: "Riverside", url: "https://riverside.fm", category: "Podcasting & Content", unique: "AI-powered remote recording with magic clips" },
  { name: "Podcastle", url: "https://podcastle.ai", category: "Podcasting & Content", unique: "AI audio/video editing for podcast production" },

  // — Music & Sound —
  { name: "Suno", url: "https://suno.ai", category: "Music & Sound", unique: "AI music creation from text prompts" },
  { name: "Udio", url: "https://udio.com", category: "Music & Sound", unique: "High-fidelity AI music with vocal generation" },
  { name: "AIVA", url: "https://aiva.ai", category: "Music & Sound", unique: "AI composer for film, game, and ad soundtracks" },
  { name: "Soundraw", url: "https://soundraw.io", category: "Music & Sound", unique: "Customizable AI music for content creators" },

  // — Image Editing & Assets —
  { name: "PhotoRoom", url: "https://photoroom.com", category: "Image Editing & Assets", unique: "AI background removal and product photography" },
  { name: "ClipDrop", url: "https://clipdrop.co", category: "Image Editing & Assets", unique: "Stability AI-powered image editing toolkit" },
  { name: "Stability AI", url: "https://stability.ai", category: "Image Editing & Assets", unique: "Open-source foundation models for image generation" },

  // — AI Infrastructure & Data —
  { name: "Hugging Face", url: "https://huggingface.co", category: "AI Infrastructure & Data", unique: "Open-source hub for AI models and datasets" },
  { name: "LangChain", url: "https://langchain.com", category: "AI Infrastructure & Data", unique: "Framework for building LLM-powered applications" },
  { name: "LlamaIndex", url: "https://llamaindex.ai", category: "AI Infrastructure & Data", unique: "Data framework for connecting LLMs to enterprise data" },
  { name: "Pinecone", url: "https://pinecone.io", category: "AI Infrastructure & Data", unique: "Purpose-built vector DB for AI applications" },
  { name: "Weaviate", url: "https://weaviate.io", category: "AI Infrastructure & Data", unique: "Open-source vector search with hybrid capabilities" },
  { name: "Qdrant", url: "https://qdrant.tech", category: "AI Infrastructure & Data", unique: "High-performance vector similarity search engine" },
  { name: "Cohere", url: "https://cohere.com", category: "AI Infrastructure & Data", unique: "Enterprise LLMs with retrieval-augmented generation" },
  { name: "Scale AI", url: "https://scale.com", category: "AI Infrastructure & Data", unique: "Enterprise data engine for AI training" },
  { name: "Labelbox", url: "https://labelbox.com", category: "AI Infrastructure & Data", unique: "AI-assisted data labeling and model evaluation" },
  { name: "Weights & Biases", url: "https://wandb.ai", category: "AI Infrastructure & Data", unique: "Experiment tracking and model evaluation platform" },
  { name: "Unstructured", url: "https://unstructured.io", category: "AI Infrastructure & Data", unique: "ETL for unstructured data into LLM-ready formats" },

  // — Education & Learning —
  { name: "Duolingo Max", url: "https://duolingo.com", category: "Education & Learning", unique: "GPT-4 powered roleplay and explanations" },
  { name: "Speak", url: "https://speak.com", category: "Education & Learning", unique: "AI-powered conversational language learning" },
  { name: "Khanmigo", url: "https://khanacademy.org", category: "Education & Learning", unique: "AI tutor by Khan Academy for personalized learning" },
];

const ITEMS_PER_PAGE = 25;

function StarRating({ rateUrl }: { rateUrl: string }) {
  return (
    <a
      href={rateUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 group"
    >
      <span className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
        ))}
      </span>
      <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
        rate me
      </span>
    </a>
  );
}

export default function Products() {
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(AI_PRODUCTS.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = AI_PRODUCTS.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeadMeta content={content} />
      <Navbar
        content={content}
        isEditing={isEditing}
        onToggleEdit={() => canEdit ? setIsEditing(v => !v) : signInWithGoogle()}
        onContactClick={() => {}}
        onUpdate={update}
        canEdit={canEdit}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
      />

      <main className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            100 Exciting AI-Native Products for Product Teams
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.productsHeading || "Tell us about the AI products you use most"}
          </p>
          {content.productsButtonText && (
            <a
              href={content.productsButtonUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {content.productsButtonText}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Use Case</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">What's Unique</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p, i) => (
                  <tr key={p.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{start + i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        {p.name}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.unique}</td>
                    <td className="px-4 py-3">
                      <StarRating rateUrl={content.productsRateUrl || ""} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Showing {start + 1}–{Math.min(start + ITEMS_PER_PAGE, AI_PRODUCTS.length)} of {AI_PRODUCTS.length} products
        </p>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} />
    </div>
  );
}
