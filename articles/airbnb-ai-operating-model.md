# What We Can Learn from Airbnb's AI Operating Model

*What Airbnb's CHRO told Stanford about their AI playbook — and the org-design work Directors and VPs need to do to move their teams into the Frontier zone.*

---

**"Slides and PDFs are the enemy of intelligence."**

I've been waiting for someone to say it out loud, and Iain Roberts finally did.

Speaking at Stanford HAI's AI for Organization Conference last week, Airbnb's Chief Human Resources Officer walked through the company's AI operating model — the actual one, not the deck version. The talk was distilled into a now-circulating LinkedIn post by [Mary Kate Stimmler](https://www.linkedin.com/in/marykate-stimmler/) at Stanford's Center for Advanced Study in the Behavioral Sciences, and if you work in any kind of knowledge role, it should be the most-forwarded thing in your team this week.

I want to walk through what Airbnb is actually doing, why it's a meaningful departure from the "let's add AI to our existing workflow" pattern that most companies are stuck in, and — most importantly — what Directors, VPs, and functional leads can do inside their own scope to translate it. **The operating model is the unlock.** The model itself is almost secondary.

> If you're an individual contributor figuring out your own AI strategy in this moment, we covered that here: [The Knowledge Worker Playbook: AI, Layoffs, and the Career Reset](https://productimpactpod.com/news/knowledge-worker-playbook-ai-layoffs-career-reset/). This piece is for the managers and leaders designing the systems around them.

## The chart that explains why this matters

Microsoft's [2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index) — based on a survey of 20,000 knowledge workers across 10 markets — landed on a number that should keep every executive up at night: **only 19% of AI users are in the "Frontier" zone**, where individual capability and organizational readiness reinforce each other. About half are "Emergent." Sixteen percent are stalled. Ten percent are skilled workers stuck in companies that haven't caught up. Five percent are sitting in well-equipped orgs but haven't picked up the tools.

What that data is telling us, if we read it honestly, is that **the bottleneck is no longer the technology**. It's the operating model around the technology. Microsoft's own analysis is blunt about it: organizational factors — culture, manager support, talent practices — account for 67% of AI's real impact. Individual mindset and behavior accounts for 32%.

This lines up with what Anthropic's most recent [Economic Index report](https://www.anthropic.com/research/economic-index-march-2026-report) found: experienced AI users are *dramatically* more successful than newcomers at automating tasks. The gap isn't intelligence. It's reps inside a structure that lets you learn what works.

And it lines up with the Stanford [2026 AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report), which reported that 88% of organizations are using AI but fewer than 10% have fully scaled it inside any single function. Adoption is everywhere. Operationalization is rare.

This is the gap Airbnb is trying to close. Here's how.

## The five things Airbnb is actually doing

### 1. Trade PDFs for markdown files

Slides and PDFs were built for human consumption in static, presentational settings. They're visually rich and machine-illegible. Markdown is the opposite — lightweight, version-controllable, diff-able, parseable, and trivially ingestible by any model. **It's also the format that made software disruptive in the first place.** AirBnB's entire leadership team writes in markdown now.

Every PDF in your Drive is a wall between your knowledge and your AI. The moment your strategy doc, your team update, your project brief, your customer research is in markdown, it becomes part of the substrate the model can reason against.

This is the cheapest, highest-leverage move in the whole playbook, and you can do it tomorrow.

### 2. Train a model on your org's best work, then turn it into a "skill"

Airbnb's HR team historically wasn't known for storytelling. So they did the obvious-in-retrospect thing: they took the company's best executive presentations, trained a model on them, and turned the result into a foundational *skill* that any HR employee can plug data into and get a polished, on-brand narrative back in seconds.

A "skill" is a reusable, composable, and shared documentation for a workflow. It's a piece of organizational capability that lives outside any one person.

Context engineering at the org level: you're not asking people to be better prompt engineers. You're giving them pre-loaded context — the gold-standard examples, the brand voice, the structural conventions — so they don't have to reinvent the wheel for every output. The [Anthropic guidance](https://www.anthropic.com/news/the-anthropic-economic-index) on this is increasingly clear: the highest-leverage AI work isn't writing better prompts, it's curating better context.

### 3. Measure communication velocity and dissonance with meeting recordings

Airbnb ingests video from every town hall — VPs, SVPs, C-suite — and uses it to measure two things:

- **Velocity**: How long does a message take to cascade from "here's where we're going" to "here's what it means for your work"?
- **Veracity**: Where is there dissonance between the stated strategy and what a function is actually doing?

Pre-AI, the only way to get this level of insight was to interview hundreds of people, and even then you'd have to triangulate. Now you ingest the source material and let a model do the diff.

For a knowledge worker, the implication is the same in miniature: **your meetings are training data for your own operating model.** Most of you are already recording them. Almost none of you are using them as a feedback loop on your own communication.

### 4. Leaders must build. Not delegate. Build.

Iain's team handed him a six-month roadmap for a "gathering tool" to help hybrid teams plan offsites. He built it over a weekend. The line that's going to get tattooed on people: **"If you delegate the building, you delegate the learning."**

He has mandated that his leaders actually build things — not approve roadmaps for things, *build them* — so they're learning and experiencing the AI's capabilities alongside their teams. This is a deeply uncomfortable shift for senior people, and it happens to be the most predictive variable in Microsoft's data. When managers actively model AI use, employees report a **17-point increase in the value they get from AI and a 30-point boost in trust in agents**. When they don't, AI adoption stalls regardless of what the company spends on licenses.

### 5. Forget Forward Deployed Engineers. Hire embedded organizational architects.

Palantir popularized the FDE: plumb the data, map the process, plug AI in. Roberts thinks this misses the point. You don't optimize the existing org around AI — you redesign the org around people and technology together.

His proposed role is an "embedded organizational architect": someone deeply empathic, deeply social, deeply understanding the human condition. "An organization," he says, "is really just a network of individuals trying to get things done collectively."

Most leaders won't internalize this for another two years. The shift isn't from human to AI. It's from hierarchies and reporting lines to networks and workflows. The org chart isn't going away, but it's no longer the unit of analysis — the *flow of work* is.

## Why this is your org-design problem now

Look at Microsoft's distribution again. 19% Frontier. 50% Emergent. 16% Stalled. 10% Blocked. 5% Unclaimed. If you run a team of 20, the distribution on your floor is roughly four people compounding, ten with private AI practice but no shared norms, three stalled out entirely, two skilled workers held back by your tooling and process, and one with every tool you've licensed sitting unused on their desktop.

Your job isn't to get average AI usage up. Your job is to move people *into the Frontier zone* by changing the conditions around them. Microsoft's analysis is unambiguous: organizational factors account for 67% of AI's real impact at work, and individual mindset for 32%. As a Director or VP, you control most of those factors at the team scope — tooling, norms, what gets rewarded, who gets hired, what gets built and by whom.

The 31% of users who are "misaligned" — Blocked Agency plus Unclaimed Capacity — are the clearest indictment of management on that chart. Blocked people are skilled workers whose orgs haven't kept up with them. Unclaimed people are sitting inside well-equipped orgs without picking up the tools. Both of those failures land at the manager's door, not the individual's.

This is what Roberts is saying when he talks about embedded organizational architects. The unit of analysis is no longer "do we have AI." Every org has AI now. It's: are you designing the work so AI moves people forward, or treating it as a productivity overlay on a structure that's increasingly the wrong shape?

## Five moves to elevate your team to the Frontier

Each move maps to one of Airbnb's, scoped for Director and VP-level authority. None of them require a CHRO title or a six-month budget.

### 1. Fix the substrate — move Blocked → Frontier

Blocked Agency people don't need more training. They need their tools to stop being adversarial. They're already skilled. They're producing work for an environment that won't let the work compound.

What this looks like at your scope: pick the five highest-leverage docs your team produces — strategy briefs, OKRs, customer research, project specs, weekly updates — and mandate they live in markdown in a shared repo your team's AI tools can access. No new tools, no re-org. A substrate change.

You don't have authority to mandate company-wide markdown. You do have authority over what your team produces and where they store it.

### 2. Build team-level "skills" — move Emergent → Frontier

The Emergent 50% already know how to use AI individually. What they lack is shared norms. Three different reports producing customer summaries with three different structures means none of those summaries compound into team capability.

What this looks like: identify the 2–3 workflows your team runs most often and turn each into a reusable "skill" — a parameterized prompt with loaded context, clear criteria, and saved examples. Engineering managers: a feedback-synthesis skill for sprint retros. PMs: a research-to-spec skill. Design leads: a critique-prep skill. Ship one, prove the model, then expand.

This is where your team's token bill starts dropping. Skills run on cached, structured context. Ad-hoc prompting doesn't.

### 3. Audit communication velocity at team scope

You don't have Airbnb's town-hall ingestion pipeline. You have something better at your scope: you can actually listen to your team.

Two metrics translate directly:

- **Velocity**: How long from your communication of strategy to that strategy showing up in your team's actual work?
- **Dissonance**: When your direct reports describe priorities, do their answers match?

A practical diagnostic: each quarter, ask your reports independently to summarize the top three priorities for the team. The gap between answers is your communication debt. Until you close it, no operating-model work downstream is going to stick.

### 4. Build alongside your team — move Unclaimed → Frontier

The Unclaimed Capacity slice is the most damning one on the chart. These are people sitting in well-equipped orgs with the tools and structural support — and they're not picking it up. What they're watching is their managers.

Microsoft's data: when managers actively model AI use, employees report a **17-point increase in the value they get from AI and a 30-point boost in trust in agents**. When they don't, adoption stalls regardless of license count.

This means you, building with AI yourself. Not approving roadmaps. Not giving feedback on builds. *Building.* Your engineering manager ships an evaluation pipeline this quarter? You should be in the codebase with them. Your PM is writing a research skill? You should be testing it on real research.

This cuts hard against everything mid-management is rewarded for. The political risk is real — it can read as micromanagement or as failing to scale. The data says it's the strongest single predictor of team-level AI value.

### 5. Hire for the shape, not the slot — move Stalled → Frontier

The 16% Stalled slice isn't going to move under current incentives. You either restructure the work, hire differently, or accept the cost.

Roberts's "embedded organizational architect" has a concrete version at your level: in your next hiring cycle, prioritize people who can redesign workflows, not just execute them. These hires are hard to evaluate in interviews because there's no clean credential for "deeply empathic and deeply technical." Look for people who've reorganized work, not just done it — engineers who designed handoff systems, PMs who restructured discovery, designers who built systems instead of shipping screens.

This is the slowest of the five moves. It's also the one that determines whether your operating model survives the next reorg.

## Questions to run before your next AI investment

**On where your team actually is:**
- If you mapped your team onto Microsoft's chart, what would the actual distribution be?
- Which of your reports are Blocked Agency — skilled people held back by your structure?
- Who's Unclaimed Capacity, and what would they need to see from you to move?

**On the substrate:**
- What percentage of your team's institutional knowledge is machine-readable vs. trapped in PDFs and slides?
- Where is your team rebuilding the same artifact every week from scratch?
- What docs in your org should not exist in their current form anymore?

**On the structure:**
- Where are you optimizing the existing org around AI vs. redesigning around what AI enables?
- What's one process you could dismantle this quarter rather than make more efficient?
- Does your org chart describe how work actually flows, or just who reports to whom?

**On your own behavior:**
- When was the last thing you built — actually built, not approved — with AI?
- Do your direct reports see you using AI thoughtfully, or avoiding it?
- What's your team's interpretation of the message you're sending about AI?

**On hiring and team design:**
- Are you hiring people who can redesign work, or only people who can execute it as it currently exists?
- Is there a "wedge" hire who could model the new operating norms for the rest?

## Why most orgs won't do this

This work is more politically costly at the org level than at the individual level. You'll be asked to spend budget on substrate changes that won't show ROI for two quarters. You'll push back on senior leadership who want AI deployed as a productivity overlay rather than an organizational redesign. You'll defend hiring profiles that don't pattern-match to your last five hires. You'll model behaviors — building with your team, sitting in the codebase, abandoning the deck — that look like a step down from "managing managers."

This is why the Frontier zone is only 19% of AI users. Elevating people into it is a redesign, not an upgrade. It costs political capital, time, and comfort with familiar structures.

The compounding payoff justifies it. The teams that make this transition won't be the ones with the largest AI budget — they'll be the ones whose managers built the operating model deliberately, with the chart on the wall, before the next reorg made it impossible.

Your individual contributors aren't waiting for you. Many of them are already building their own operating models, with or without organizational support — we covered exactly that scenario in [The Knowledge Worker Playbook](https://productimpactpod.com/news/knowledge-worker-playbook-ai-layoffs-career-reset/). The question is whether they're building it inside your structure or in spite of it. The managers who get this right are the ones who make the structure worth building inside.

The Frontier zone isn't a magical place. Individual practice and structural support reinforce each other instead of fighting. As a manager, you are the structural support. Slides are the enemy of intelligence. So is an org chart treated as a delivery mechanism instead of a flow-of-work model.

---

**Which of these five would land hardest at your company?** Reply in the comments — I'm gathering examples for the next issue.

---

*Sources referenced: [Mary Kate Stimmler's LinkedIn summary of Iain Roberts's Stanford HAI talk](https://www.linkedin.com/feed/update/urn:li:activity:7460686634704015360/); [Microsoft 2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index); [Anthropic Economic Index, March 2026 report](https://www.anthropic.com/research/economic-index-march-2026-report); [Stanford HAI 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report); [Airbnb Engineering: Intelligent Automation Platform](https://airbnb.tech/ai-ml/intelligent-automation-platform-empowering-conversational-ai-and-beyond-at-airbnb/).*
