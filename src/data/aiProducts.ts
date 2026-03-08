export interface Product {
  name: string;
  url: string;
  category: string;
  unique: string;
}

// 200 AI-native products ordered by inferred usage among product teams.
// Categories reflect PM use-cases. Excludes frontier model providers (OpenAI, Anthropic, etc.).
export const AI_PRODUCTS: Product[] = [
  // — Meetings & Collaboration (highest daily usage) —
  { name: "Notion AI", url: "https://notion.so", category: "Meetings & Collaboration", unique: "AI assistant embedded in collaborative workspace" },
  { name: "Otter.ai", url: "https://otter.ai", category: "Meetings & Collaboration", unique: "Real-time transcription with speaker identification" },
  { name: "Grammarly", url: "https://grammarly.com", category: "Content & Go-to-Market", unique: "Context-aware writing with tone and brand detection" },
  { name: "Miro AI", url: "https://miro.com", category: "Stakeholder Communication", unique: "AI-powered whiteboard for team brainstorming" },
  { name: "Loom AI", url: "https://loom.com", category: "Stakeholder Communication", unique: "AI-generated video summaries and chapters" },
  { name: "Granola", url: "https://granola.ai", category: "Meetings & Collaboration", unique: "AI notepad that enhances your own meeting notes" },
  { name: "Fireflies.ai", url: "https://fireflies.ai", category: "Meetings & Collaboration", unique: "Cross-platform meeting recording with topic detection" },
  { name: "Krisp", url: "https://krisp.ai", category: "Meetings & Collaboration", unique: "AI noise cancellation and meeting transcription" },
  { name: "Coda AI", url: "https://coda.io", category: "Meetings & Collaboration", unique: "AI-powered docs that work like apps" },
  { name: "Taskade", url: "https://taskade.com", category: "Meetings & Collaboration", unique: "AI agents that automate entire project workflows" },
  { name: "Mem", url: "https://mem.ai", category: "Meetings & Collaboration", unique: "Self-organizing AI knowledge base for teams" },
  { name: "Fathom", url: "https://fathom.video", category: "Meetings & Collaboration", unique: "Free AI meeting assistant with auto-highlights" },
  { name: "Supernormal", url: "https://supernormal.com", category: "Meetings & Collaboration", unique: "AI meeting notes integrated with CRM and PM tools" },
  { name: "Tactiq", url: "https://tactiq.io", category: "Meetings & Collaboration", unique: "Real-time meeting transcripts with AI action items" },
  { name: "Avoma", url: "https://avoma.com", category: "Meetings & Collaboration", unique: "AI meeting lifecycle assistant from scheduling to follow-up" },

  // — User Research & Insights —
  { name: "Perplexity", url: "https://perplexity.ai", category: "User Research & Insights", unique: "AI answer engine with real-time source citations" },
  { name: "Glean", url: "https://glean.com", category: "User Research & Insights", unique: "AI-powered work assistant that searches all company apps" },
  { name: "Yutori", url: "https://yutori.app", category: "User Research & Insights", unique: "AI-powered online research agents for deep web research" },
  { name: "Elicit", url: "https://elicit.com", category: "User Research & Insights", unique: "AI research assistant for academic paper analysis" },
  { name: "Consensus", url: "https://consensus.app", category: "User Research & Insights", unique: "AI search engine for peer-reviewed scientific claims" },
  { name: "Dovetail", url: "https://dovetail.com", category: "User Research & Insights", unique: "AI-powered user research analysis and repository" },
  { name: "Maze AI", url: "https://maze.co", category: "User Research & Insights", unique: "AI-assisted rapid product testing and user research" },
  { name: "UserTesting AI", url: "https://usertesting.com", category: "User Research & Insights", unique: "AI-powered human insight platform for experience research" },
  { name: "Sprig", url: "https://sprig.com", category: "User Research & Insights", unique: "AI analysis of in-product surveys and session replays" },
  { name: "Hotjar AI", url: "https://hotjar.com", category: "User Research & Insights", unique: "AI survey analysis and heatmap insights" },
  { name: "Notably", url: "https://notably.ai", category: "User Research & Insights", unique: "AI-powered qualitative research synthesis" },
  { name: "MonkeyLearn", url: "https://monkeylearn.com", category: "User Research & Insights", unique: "No-code AI text analytics for feedback classification" },

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
  { name: "Sourcegraph Cody", url: "https://sourcegraph.com/cody", category: "Product Development", unique: "AI code assistant with full codebase context" },
  { name: "Devin", url: "https://cognition.ai", category: "Product Development", unique: "Autonomous AI software engineer agent" },
  { name: "Pieces", url: "https://pieces.app", category: "Product Development", unique: "AI-powered developer productivity with snippet management" },
  { name: "Sweep", url: "https://sweep.dev", category: "Product Development", unique: "AI junior developer that handles GitHub issues" },
  { name: "Codeium", url: "https://codeium.com", category: "Product Development", unique: "Free AI code completion with multi-language support" },
  { name: "Mintlify", url: "https://mintlify.com", category: "Product Development", unique: "AI-powered documentation that stays up to date" },

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
  { name: "Khroma", url: "https://khroma.co", category: "Prototyping & Design", unique: "AI color palette generator trained on your preferences" },
  { name: "Locofy", url: "https://locofy.ai", category: "Prototyping & Design", unique: "Convert Figma designs to production code with AI" },
  { name: "Visily", url: "https://visily.ai", category: "Prototyping & Design", unique: "AI wireframe and mockup generator from text or screenshots" },
  { name: "Relume", url: "https://relume.io", category: "Prototyping & Design", unique: "AI-powered sitemap and wireframe generator for websites" },

  // — Stakeholder Communication & Presentations —
  { name: "Gamma", url: "https://gamma.app", category: "Stakeholder Communication", unique: "AI-native slide deck and document creation" },
  { name: "Tome", url: "https://tome.app", category: "Stakeholder Communication", unique: "AI storytelling and narrative building for teams" },
  { name: "Beautiful.ai", url: "https://beautiful.ai", category: "Stakeholder Communication", unique: "Smart slide design with adaptive AI layouts" },
  { name: "Pitch", url: "https://pitch.com", category: "Stakeholder Communication", unique: "AI-assisted collaborative presentation platform" },
  { name: "Decktopus", url: "https://decktopus.com", category: "Stakeholder Communication", unique: "AI presentation creator with audience-aware content" },
  { name: "Slidesgo AI", url: "https://slidesgo.com", category: "Stakeholder Communication", unique: "AI presentation templates with smart customization" },
  { name: "Plus AI", url: "https://plusdocs.com", category: "Stakeholder Communication", unique: "AI slide creation inside Google Slides" },

  // — Roadmap & Planning —
  { name: "Motion", url: "https://usemotion.com", category: "Roadmap & Planning", unique: "AI auto-schedules tasks across calendar" },
  { name: "Clockwise", url: "https://clockwise.com", category: "Roadmap & Planning", unique: "AI calendar optimization for focus time" },
  { name: "Reclaim.ai", url: "https://reclaim.ai", category: "Roadmap & Planning", unique: "AI scheduling for habits, tasks, and meetings" },
  { name: "Linear", url: "https://linear.app", category: "Roadmap & Planning", unique: "AI-powered issue tracking with auto-prioritization" },
  { name: "Productboard AI", url: "https://productboard.com", category: "Roadmap & Planning", unique: "AI feature prioritization from customer feedback" },
  { name: "Airfocus", url: "https://airfocus.com", category: "Roadmap & Planning", unique: "AI-powered product strategy and roadmap prioritization" },
  { name: "Craft AI", url: "https://craft.do", category: "Roadmap & Planning", unique: "AI document and project planning workspace" },
  { name: "Hive AI", url: "https://hive.com", category: "Roadmap & Planning", unique: "AI project management with predictive analytics" },

  // — Content & Go-to-Market —
  { name: "Jasper", url: "https://jasper.ai", category: "Content & Go-to-Market", unique: "Brand voice-aware AI marketing content engine" },
  { name: "Copy.ai", url: "https://copy.ai", category: "Content & Go-to-Market", unique: "Go-to-market AI workflows for sales & marketing" },
  { name: "Writer", url: "https://writer.com", category: "Content & Go-to-Market", unique: "Full-stack generative AI for enterprise content governance" },
  { name: "Typeface", url: "https://typeface.ai", category: "Content & Go-to-Market", unique: "Brand-safe generative AI for enterprise marketing" },
  { name: "Anyword", url: "https://anyword.com", category: "Content & Go-to-Market", unique: "Predictive performance scoring for AI copy" },
  { name: "Phrasee", url: "https://phrasee.co", category: "Content & Go-to-Market", unique: "AI-optimized brand language for email & push" },
  { name: "Pencil", url: "https://trypencil.com", category: "Content & Go-to-Market", unique: "AI-generated ad creatives with performance prediction" },
  { name: "Surfer SEO", url: "https://surferseo.com", category: "Content & Go-to-Market", unique: "AI content optimization for search rankings" },
  { name: "Clearscope", url: "https://clearscope.io", category: "Content & Go-to-Market", unique: "AI-powered SEO content optimization platform" },
  { name: "MarketMuse", url: "https://marketmuse.com", category: "Content & Go-to-Market", unique: "AI content strategy and planning with topic authority" },
  { name: "Writesonic", url: "https://writesonic.com", category: "Content & Go-to-Market", unique: "AI writing assistant with SEO-optimized blog generation" },
  { name: "Lately", url: "https://lately.ai", category: "Content & Go-to-Market", unique: "AI that repurposes long-form into social posts" },
  { name: "Narrato", url: "https://narrato.io", category: "Content & Go-to-Market", unique: "AI content workspace for team content operations" },
  { name: "ContentBot", url: "https://contentbot.ai", category: "Content & Go-to-Market", unique: "AI content automation with workflow builders" },

  // — Customer Feedback & Support —
  { name: "Intercom Fin", url: "https://intercom.com", category: "Customer Feedback & Support", unique: "AI chatbot that resolves 50%+ support tickets" },
  { name: "Ada", url: "https://ada.cx", category: "Customer Feedback & Support", unique: "AI-first customer service automation platform" },
  { name: "Hiver", url: "https://hiverhq.com", category: "Customer Feedback & Support", unique: "AI-powered shared inbox for Gmail teams" },
  { name: "Zendesk AI", url: "https://zendesk.com", category: "Customer Feedback & Support", unique: "AI agents and workforce tools for CX automation" },
  { name: "Tidio AI", url: "https://tidio.com", category: "Customer Feedback & Support", unique: "AI chatbot Lyro that resolves customer queries instantly" },
  { name: "Forethought", url: "https://forethought.ai", category: "Customer Feedback & Support", unique: "AI agent for customer support ticket resolution" },
  { name: "Kapture CX", url: "https://kapture.cx", category: "Customer Feedback & Support", unique: "AI-powered omnichannel customer experience platform" },
  { name: "Viable", url: "https://askviable.com", category: "Customer Feedback & Support", unique: "AI analysis of qualitative customer feedback at scale" },
  { name: "Syncly", url: "https://syncly.app", category: "Customer Feedback & Support", unique: "AI-powered customer feedback categorization and sentiment" },

  // — Sales & Revenue Intelligence —
  { name: "Gong", url: "https://gong.io", category: "Sales & Revenue Intelligence", unique: "AI conversation analytics for sales teams" },
  { name: "Apollo.io", url: "https://apollo.io", category: "Sales & Revenue Intelligence", unique: "AI-powered sales intelligence and engagement" },
  { name: "Clay", url: "https://clay.com", category: "Sales & Revenue Intelligence", unique: "AI data enrichment and personalized outreach at scale" },
  { name: "Lavender", url: "https://lavender.ai", category: "Sales & Revenue Intelligence", unique: "AI email coaching for sales outreach" },
  { name: "Chorus.ai", url: "https://chorus.ai", category: "Sales & Revenue Intelligence", unique: "AI meeting analysis for deal insights" },
  { name: "Superhuman", url: "https://superhuman.com", category: "Sales & Revenue Intelligence", unique: "AI-powered email with instant reply drafts" },
  { name: "Shortwave", url: "https://shortwave.com", category: "Sales & Revenue Intelligence", unique: "AI-first email client with smart bundling" },
  { name: "Clari", url: "https://clari.com", category: "Sales & Revenue Intelligence", unique: "AI revenue platform with pipeline predictability" },
  { name: "People.ai", url: "https://people.ai", category: "Sales & Revenue Intelligence", unique: "AI revenue intelligence from activity capture" },
  { name: "Regie.ai", url: "https://regie.ai", category: "Sales & Revenue Intelligence", unique: "AI-powered sales prospecting and content generation" },
  { name: "Outreach AI", url: "https://outreach.io", category: "Sales & Revenue Intelligence", unique: "AI-driven sales execution and engagement platform" },

  // — Analytics & Data —
  { name: "Amplitude AI", url: "https://amplitude.com", category: "Analytics & Data", unique: "AI-powered product analytics with natural language queries" },
  { name: "Mixpanel Spark", url: "https://mixpanel.com", category: "Analytics & Data", unique: "AI assistant for product analytics insights" },
  { name: "Heap", url: "https://heap.io", category: "Analytics & Data", unique: "AI-powered auto-capture digital analytics" },
  { name: "FullStory", url: "https://fullstory.com", category: "Analytics & Data", unique: "AI-powered digital experience analytics with session replay" },
  { name: "Obviously AI", url: "https://obviously.ai", category: "Analytics & Data", unique: "No-code AI predictions from any dataset" },
  { name: "Thoughtspot", url: "https://thoughtspot.com", category: "Analytics & Data", unique: "AI-powered analytics with natural language search" },
  { name: "Akkio", url: "https://akkio.com", category: "Analytics & Data", unique: "No-code predictive AI for business analytics" },

  // — Video & Demo Creation —
  { name: "Runway", url: "https://runwayml.com", category: "Video & Demo Creation", unique: "Gen-3 video generation from text and images" },
  { name: "Descript", url: "https://descript.com", category: "Video & Demo Creation", unique: "Edit video by editing text transcript" },
  { name: "Synthesia", url: "https://synthesia.io", category: "Video & Demo Creation", unique: "AI avatars for corporate video at scale" },
  { name: "HeyGen", url: "https://heygen.com", category: "Video & Demo Creation", unique: "Multilingual AI avatar videos with lip-sync" },
  { name: "Pika", url: "https://pika.art", category: "Video & Demo Creation", unique: "Cinematic AI video with lip-sync and effects" },
  { name: "Luma AI", url: "https://lumalabs.ai", category: "Video & Demo Creation", unique: "NeRF-based 3D capture and Dream Machine video" },
  { name: "Opus Clip", url: "https://opus.pro", category: "Video & Demo Creation", unique: "AI short-form clip extraction from long videos" },
  { name: "Captions", url: "https://captions.ai", category: "Video & Demo Creation", unique: "AI-powered video editing with auto-captions and eye contact" },
  { name: "Colossyan", url: "https://colossyan.com", category: "Video & Demo Creation", unique: "AI video platform for workplace learning" },
  { name: "Elai.io", url: "https://elai.io", category: "Video & Demo Creation", unique: "Text-to-video with AI presenter avatars" },
  { name: "Fliki", url: "https://fliki.ai", category: "Video & Demo Creation", unique: "Text-to-video with AI voices and stock media" },
  { name: "Invideo AI", url: "https://invideo.io", category: "Video & Demo Creation", unique: "Prompt-to-video creation for marketing content" },

  // — Documentation & Process Capture —
  { name: "Tango", url: "https://tango.us", category: "Documentation & Process", unique: "Auto-generates step-by-step guides from screen recordings" },
  { name: "Scribe", url: "https://scribehow.com", category: "Documentation & Process", unique: "AI process documentation from workflow capture" },
  { name: "Guidde", url: "https://guidde.com", category: "Documentation & Process", unique: "AI-powered video documentation for how-to guides" },
  { name: "Archbee", url: "https://archbee.com", category: "Documentation & Process", unique: "AI-powered product documentation with smart search" },
  { name: "Document360 AI", url: "https://document360.com", category: "Documentation & Process", unique: "AI knowledge base with content generation and search" },

  // — Landing Pages & Websites —
  { name: "Framer AI", url: "https://framer.com", category: "Landing Pages & Websites", unique: "AI-powered site generation with visual editing" },
  { name: "Mixo", url: "https://mixo.io", category: "Landing Pages & Websites", unique: "AI-generated landing pages in seconds" },
  { name: "Durable", url: "https://durable.co", category: "Landing Pages & Websites", unique: "AI business website builder with CRM" },
  { name: "Hostinger AI", url: "https://hostinger.com", category: "Landing Pages & Websites", unique: "AI website builder with hosting included" },
  { name: "10Web AI", url: "https://10web.io", category: "Landing Pages & Websites", unique: "AI WordPress website builder with hosting" },
  { name: "Unbounce Smart Builder", url: "https://unbounce.com", category: "Landing Pages & Websites", unique: "AI-optimized landing page builder with smart traffic" },

  // — Voice & Audio —
  { name: "ElevenLabs", url: "https://elevenlabs.io", category: "Voice & Audio", unique: "Ultra-realistic voice cloning and synthesis" },
  { name: "Murf.ai", url: "https://murf.ai", category: "Voice & Audio", unique: "Studio-quality AI voiceovers for enterprises" },
  { name: "Bland AI", url: "https://bland.ai", category: "Voice & Audio", unique: "AI phone agents for enterprise calling at scale" },
  { name: "Vapi", url: "https://vapi.ai", category: "Voice & Audio", unique: "Developer platform for building voice AI agents" },
  { name: "Resemble AI", url: "https://resemble.ai", category: "Voice & Audio", unique: "Real-time voice cloning with emotional speech synthesis" },
  { name: "Play.ht", url: "https://play.ht", category: "Voice & Audio", unique: "AI text-to-speech with ultra-realistic voices" },

  // — Podcasting & Content —
  { name: "Riverside", url: "https://riverside.fm", category: "Podcasting & Content", unique: "AI-powered remote recording with magic clips" },
  { name: "Podcastle", url: "https://podcastle.ai", category: "Podcasting & Content", unique: "AI audio/video editing for podcast production" },
  { name: "Castmagic", url: "https://castmagic.io", category: "Podcasting & Content", unique: "AI content generation from podcast audio" },

  // — Music & Sound —
  { name: "Suno", url: "https://suno.ai", category: "Music & Sound", unique: "AI music creation from text prompts" },
  { name: "Udio", url: "https://udio.com", category: "Music & Sound", unique: "High-fidelity AI music with vocal generation" },
  { name: "AIVA", url: "https://aiva.ai", category: "Music & Sound", unique: "AI composer for film, game, and ad soundtracks" },
  { name: "Soundraw", url: "https://soundraw.io", category: "Music & Sound", unique: "Customizable AI music for content creators" },

  // — Image Editing & Assets —
  { name: "PhotoRoom", url: "https://photoroom.com", category: "Image Editing & Assets", unique: "AI background removal and product photography" },
  { name: "ClipDrop", url: "https://clipdrop.co", category: "Image Editing & Assets", unique: "Stability AI-powered image editing toolkit" },
  { name: "Stability AI", url: "https://stability.ai", category: "Image Editing & Assets", unique: "Open-source foundation models for image generation" },
  { name: "Krea AI", url: "https://krea.ai", category: "Image Editing & Assets", unique: "Real-time AI image generation and enhancement" },
  { name: "Picsart AI", url: "https://picsart.com", category: "Image Editing & Assets", unique: "AI photo and video editing suite for creators" },

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
  { name: "Chroma", url: "https://trychroma.com", category: "AI Infrastructure & Data", unique: "Open-source embedding database for AI applications" },
  { name: "Replicate", url: "https://replicate.com", category: "AI Infrastructure & Data", unique: "Run open-source ML models via API" },

  // — Workflow Automation —
  { name: "Zapier AI", url: "https://zapier.com", category: "Workflow Automation", unique: "AI-powered no-code workflow automation across apps" },
  { name: "Make AI", url: "https://make.com", category: "Workflow Automation", unique: "Visual AI workflow automation with 1500+ integrations" },
  { name: "Bardeen", url: "https://bardeen.ai", category: "Workflow Automation", unique: "AI browser automation for repetitive workflows" },
  { name: "Magical", url: "https://getmagical.com", category: "Workflow Automation", unique: "AI text expander and autofill for productivity" },
  { name: "Levity", url: "https://levity.ai", category: "Workflow Automation", unique: "No-code AI workflow automation for documents and emails" },
  { name: "n8n AI", url: "https://n8n.io", category: "Workflow Automation", unique: "Open-source AI workflow automation with code flexibility" },

  // — Education & Learning —
  { name: "Duolingo Max", url: "https://duolingo.com", category: "Education & Learning", unique: "GPT-4 powered roleplay and explanations" },
  { name: "Speak", url: "https://speak.com", category: "Education & Learning", unique: "AI-powered conversational language learning" },
  { name: "Khanmigo", url: "https://khanacademy.org", category: "Education & Learning", unique: "AI tutor by Khan Academy for personalized learning" },
  { name: "Coursera Coach", url: "https://coursera.org", category: "Education & Learning", unique: "AI learning assistant across professional courses" },
  { name: "Synthesis AI Tutor", url: "https://synthesis.ai", category: "Education & Learning", unique: "AI-powered math and reasoning tutor for teams" },

  // — Security & Compliance —
  { name: "Snyk AI", url: "https://snyk.io", category: "Security & Compliance", unique: "AI-powered code security and vulnerability detection" },
  { name: "Darktrace", url: "https://darktrace.com", category: "Security & Compliance", unique: "Self-learning AI for enterprise cyber defense" },
  { name: "Orca Security", url: "https://orca.security", category: "Security & Compliance", unique: "AI-powered agentless cloud security platform" },

  // — Recruiting & HR —
  { name: "HireVue", url: "https://hirevue.com", category: "Recruiting & HR", unique: "AI-powered video interviewing and assessment" },
  { name: "Textio", url: "https://textio.com", category: "Recruiting & HR", unique: "AI writing platform for inclusive job postings" },
  { name: "Eightfold AI", url: "https://eightfold.ai", category: "Recruiting & HR", unique: "AI talent intelligence for hiring and retention" },
  { name: "Paradox AI", url: "https://paradox.ai", category: "Recruiting & HR", unique: "Conversational AI assistant for recruiting automation" },
];
