import { useState } from "react";
import { useCMS } from "@/hooks/useCMS";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight } from "lucide-react";

interface Product {
  name: string;
  url: string;
  category: string;
  unique: string;
}

const AI_PRODUCTS: Product[] = [
  { name: "Ideogram", url: "https://ideogram.ai", category: "Image Generation", unique: "Best-in-class text rendering in AI images" },
  { name: "Granola", url: "https://granola.ai", category: "Meeting Notes", unique: "AI notepad that enhances your own meeting notes" },
  { name: "Pencil", url: "https://trypencil.com", category: "Ad Creative", unique: "AI-generated ad creatives with performance prediction" },
  { name: "Yutori", url: "https://yutori.com", category: "Consumer AI", unique: "Personalized AI companion for daily journaling" },
  { name: "Gamma", url: "https://gamma.app", category: "Presentations", unique: "AI-native slide deck and document creation" },
  { name: "Tome", url: "https://tome.app", category: "Presentations", unique: "AI storytelling and narrative building for teams" },
  { name: "Otter.ai", url: "https://otter.ai", category: "Meeting Notes", unique: "Real-time transcription with speaker identification" },
  { name: "Fireflies.ai", url: "https://fireflies.ai", category: "Meeting Notes", unique: "Cross-platform meeting recording with topic detection" },
  { name: "Descript", url: "https://descript.com", category: "Video/Audio Editing", unique: "Edit video by editing text transcript" },
  { name: "Runway", url: "https://runwayml.com", category: "Video Generation", unique: "Gen-3 video generation from text and images" },
  { name: "Pika", url: "https://pika.art", category: "Video Generation", unique: "Cinematic AI video with lip-sync and effects" },
  { name: "Luma AI", url: "https://lumalabs.ai", category: "3D/Video", unique: "NeRF-based 3D capture and Dream Machine video" },
  { name: "ElevenLabs", url: "https://elevenlabs.io", category: "Voice AI", unique: "Ultra-realistic voice cloning and synthesis" },
  { name: "Murf.ai", url: "https://murf.ai", category: "Voice AI", unique: "Studio-quality AI voiceovers for enterprises" },
  { name: "Synthesia", url: "https://synthesia.io", category: "Video Generation", unique: "AI avatars for corporate video at scale" },
  { name: "HeyGen", url: "https://heygen.com", category: "Video Generation", unique: "Multilingual AI avatar videos with lip-sync" },
  { name: "Jasper", url: "https://jasper.ai", category: "Marketing Copy", unique: "Brand voice-aware AI marketing content engine" },
  { name: "Copy.ai", url: "https://copy.ai", category: "Marketing Copy", unique: "Go-to-market AI workflows for sales & marketing" },
  { name: "Writer", url: "https://writer.com", category: "Enterprise Writing", unique: "Full-stack generative AI for enterprise content governance" },
  { name: "Grammarly", url: "https://grammarly.com", category: "Writing Assistant", unique: "Context-aware writing with tone and brand detection" },
  { name: "Notion AI", url: "https://notion.so", category: "Productivity", unique: "AI assistant embedded in collaborative workspace" },
  { name: "Coda AI", url: "https://coda.io", category: "Productivity", unique: "AI-powered docs that work like apps" },
  { name: "Taskade", url: "https://taskade.com", category: "Productivity", unique: "AI agents that automate entire project workflows" },
  { name: "Mem", url: "https://mem.ai", category: "Knowledge Management", unique: "Self-organizing AI knowledge base for teams" },
  { name: "Glean", url: "https://glean.com", category: "Enterprise Search", unique: "AI-powered work assistant that searches all company apps" },
  { name: "Perplexity", url: "https://perplexity.ai", category: "Research", unique: "AI answer engine with real-time source citations" },
  { name: "Elicit", url: "https://elicit.com", category: "Research", unique: "AI research assistant for academic paper analysis" },
  { name: "Consensus", url: "https://consensus.app", category: "Research", unique: "AI search engine for peer-reviewed scientific claims" },
  { name: "Replit", url: "https://replit.com", category: "Development", unique: "AI-native IDE with instant deployment" },
  { name: "Cursor", url: "https://cursor.sh", category: "Development", unique: "AI-first code editor with codebase-aware completions" },
  { name: "Bolt", url: "https://bolt.new", category: "Development", unique: "Prompt-to-full-stack app in the browser" },
  { name: "v0", url: "https://v0.dev", category: "Development", unique: "Generative UI from Vercel using shadcn components" },
  { name: "Retool AI", url: "https://retool.com", category: "Internal Tools", unique: "AI-enhanced internal tool builder for enterprises" },
  { name: "Figma AI", url: "https://figma.com", category: "Design", unique: "AI-powered design features inside collaborative canvas" },
  { name: "Galileo AI", url: "https://usegalileo.ai", category: "Design", unique: "Text-to-UI design generation for product teams" },
  { name: "Uizard", url: "https://uizard.io", category: "Design", unique: "Sketch-to-prototype with AI design assistance" },
  { name: "Magician (Diagram)", url: "https://diagram.com", category: "Design", unique: "AI design tools plugin suite for Figma" },
  { name: "PhotoRoom", url: "https://photoroom.com", category: "Image Editing", unique: "AI background removal and product photography" },
  { name: "ClipDrop", url: "https://clipdrop.co", category: "Image Editing", unique: "Stability AI-powered image editing toolkit" },
  { name: "Canva Magic Studio", url: "https://canva.com", category: "Design", unique: "AI creative suite inside visual design platform" },
  { name: "Beautiful.ai", url: "https://beautiful.ai", category: "Presentations", unique: "Smart slide design with adaptive AI layouts" },
  { name: "Mixo", url: "https://mixo.io", category: "Website Builder", unique: "AI-generated landing pages in seconds" },
  { name: "Durable", url: "https://durable.co", category: "Website Builder", unique: "AI business website builder with CRM" },
  { name: "Framer AI", url: "https://framer.com", category: "Website Builder", unique: "AI-powered site generation with visual editing" },
  { name: "Hostinger AI", url: "https://hostinger.com", category: "Website Builder", unique: "AI website builder with hosting included" },
  { name: "Superhuman", url: "https://superhuman.com", category: "Email", unique: "AI-powered email with instant reply drafts" },
  { name: "Shortwave", url: "https://shortwave.com", category: "Email", unique: "AI-first email client with smart bundling" },
  { name: "Lavender", url: "https://lavender.ai", category: "Sales", unique: "AI email coaching for sales outreach" },
  { name: "Apollo.io", url: "https://apollo.io", category: "Sales", unique: "AI-powered sales intelligence and engagement" },
  { name: "Clay", url: "https://clay.com", category: "Sales", unique: "AI data enrichment and personalized outreach at scale" },
  { name: "Gong", url: "https://gong.io", category: "Revenue Intelligence", unique: "AI conversation analytics for sales teams" },
  { name: "Chorus.ai", url: "https://chorus.ai", category: "Revenue Intelligence", unique: "AI meeting analysis for deal insights" },
  { name: "Loom AI", url: "https://loom.com", category: "Async Video", unique: "AI-generated video summaries and chapters" },
  { name: "Tango", url: "https://tango.us", category: "Documentation", unique: "Auto-generates step-by-step guides from screen recordings" },
  { name: "Scribe", url: "https://scribehow.com", category: "Documentation", unique: "AI process documentation from workflow capture" },
  { name: "Krisp", url: "https://krisp.ai", category: "Audio AI", unique: "AI noise cancellation and meeting transcription" },
  { name: "Speak", url: "https://speak.com", category: "Education", unique: "AI-powered conversational language learning" },
  { name: "Duolingo Max", url: "https://duolingo.com", category: "Education", unique: "GPT-4 powered roleplay and explanations" },
  { name: "Khanmigo", url: "https://khanacademy.org", category: "Education", unique: "AI tutor by Khan Academy for personalized learning" },
  { name: "Spline AI", url: "https://spline.design", category: "3D Design", unique: "AI-assisted 3D object and scene generation" },
  { name: "Miro AI", url: "https://miro.com", category: "Collaboration", unique: "AI-powered whiteboard for team brainstorming" },
  { name: "Clockwise", url: "https://clockwise.com", category: "Calendar", unique: "AI calendar optimization for focus time" },
  { name: "Reclaim.ai", url: "https://reclaim.ai", category: "Calendar", unique: "AI scheduling for habits, tasks, and meetings" },
  { name: "Motion", url: "https://usemotion.com", category: "Project Management", unique: "AI auto-schedules tasks across calendar" },
  { name: "Hiver", url: "https://hiverhq.com", category: "Customer Support", unique: "AI-powered shared inbox for Gmail teams" },
  { name: "Intercom Fin", url: "https://intercom.com", category: "Customer Support", unique: "AI chatbot that resolves 50%+ support tickets" },
  { name: "Ada", url: "https://ada.cx", category: "Customer Support", unique: "AI-first customer service automation platform" },
  { name: "Cohere", url: "https://cohere.com", category: "Enterprise AI", unique: "Enterprise LLMs with retrieval-augmented generation" },
  { name: "Labelbox", url: "https://labelbox.com", category: "Data/ML Ops", unique: "AI-assisted data labeling and model evaluation" },
  { name: "Scale AI", url: "https://scale.com", category: "Data/ML Ops", unique: "Enterprise data engine for AI training" },
  { name: "Weights & Biases", url: "https://wandb.ai", category: "ML Ops", unique: "Experiment tracking and model evaluation platform" },
  { name: "Hugging Face", url: "https://huggingface.co", category: "ML Platform", unique: "Open-source hub for AI models and datasets" },
  { name: "Pinecone", url: "https://pinecone.io", category: "Vector Database", unique: "Purpose-built vector DB for AI applications" },
  { name: "Weaviate", url: "https://weaviate.io", category: "Vector Database", unique: "Open-source vector search with hybrid capabilities" },
  { name: "Qdrant", url: "https://qdrant.tech", category: "Vector Database", unique: "High-performance vector similarity search engine" },
  { name: "LangChain", url: "https://langchain.com", category: "AI Framework", unique: "Framework for building LLM-powered applications" },
  { name: "LlamaIndex", url: "https://llamaindex.ai", category: "AI Framework", unique: "Data framework for connecting LLMs to enterprise data" },
  { name: "Unstructured", url: "https://unstructured.io", category: "Data Processing", unique: "ETL for unstructured data into LLM-ready formats" },
  { name: "Midjourney", url: "https://midjourney.com", category: "Image Generation", unique: "Artistic AI image generation with distinctive aesthetics" },
  { name: "Leonardo.ai", url: "https://leonardo.ai", category: "Image Generation", unique: "AI image generation with fine-tuned gaming/design models" },
  { name: "Stability AI", url: "https://stability.ai", category: "Image Generation", unique: "Open-source foundation models for image generation" },
  { name: "Suno", url: "https://suno.ai", category: "Music Generation", unique: "AI music creation from text prompts" },
  { name: "Udio", url: "https://udio.com", category: "Music Generation", unique: "High-fidelity AI music with vocal generation" },
  { name: "AIVA", url: "https://aiva.ai", category: "Music Generation", unique: "AI composer for film, game, and ad soundtracks" },
  { name: "Soundraw", url: "https://soundraw.io", category: "Music Generation", unique: "Customizable AI music for content creators" },
  { name: "Typeface", url: "https://typeface.ai", category: "Enterprise Content", unique: "Brand-safe generative AI for enterprise marketing" },
  { name: "Anyword", url: "https://anyword.com", category: "Marketing Copy", unique: "Predictive performance scoring for AI copy" },
  { name: "Phrasee", url: "https://phrasee.co", category: "Marketing Copy", unique: "AI-optimized brand language for email & push" },
  { name: "Recraft", url: "https://recraft.ai", category: "Design", unique: "AI vector and raster image generation with brand consistency" },
  { name: "Riverside", url: "https://riverside.fm", category: "Podcasting", unique: "AI-powered remote recording with magic clips" },
  { name: "Podcastle", url: "https://podcastle.ai", category: "Podcasting", unique: "AI audio/video editing for podcast production" },
  { name: "Opus Clip", url: "https://opus.pro", category: "Video Editing", unique: "AI short-form clip extraction from long videos" },
  { name: "Captions", url: "https://captions.ai", category: "Video Editing", unique: "AI-powered video editing with auto-captions and eye contact correction" },
  { name: "Bland AI", url: "https://bland.ai", category: "Voice AI", unique: "AI phone agents for enterprise calling at scale" },
  { name: "Vapi", url: "https://vapi.ai", category: "Voice AI", unique: "Developer platform for building voice AI agents" },
  { name: "Lovable", url: "https://lovable.dev", category: "Development", unique: "AI full-stack web app builder from natural language" },
  { name: "Windsurf", url: "https://codeium.com", category: "Development", unique: "AI-powered IDE with Cascade agentic flows" },
  { name: "Tabnine", url: "https://tabnine.com", category: "Development", unique: "Privacy-focused AI code assistant for enterprises" },
  { name: "Codium AI", url: "https://codium.ai", category: "Development", unique: "AI test generation and code integrity checking" },
];

const ITEMS_PER_PAGE = 25;

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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">What's Unique</th>
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
