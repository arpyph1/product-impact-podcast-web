# What We Can Learn from Airbnb's AI Operating Model

*What Airbnb's CHRO told Stanford about their AI playbook — and what it means for the rest of us trying to do real work with these tools.*

---

**"Slides and PDFs are the enemy of intelligence."**

I've been waiting for someone to say it out loud, and Iain Roberts finally did.

Speaking at Stanford HAI's AI for Organization Conference last week, Airbnb's Chief Human Resources Officer walked through the company's AI operating model — the actual one, not the deck version. The talk was distilled into a now-circulating LinkedIn post by [Mary Kate Stimmler](https://www.linkedin.com/in/marykate-stimmler/) at Stanford's Center for Advanced Study in the Behavioral Sciences, and if you work in any kind of knowledge role, it should be the most-forwarded thing in your team this week.

I want to walk through what Airbnb is actually doing, why it's a meaningful departure from the "let's add AI to our existing workflow" pattern that most companies are stuck in, and — most importantly — how you can apply the same logic to your own work even if you don't run an HR org at a public company. Because here's the thing I've learned from running my own version of this for the last six months: **the operating model is the unlock**. The model itself is almost secondary.

## The chart that explains why this matters

Microsoft's [2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index) — based on a survey of 20,000 knowledge workers across 10 markets — landed on a number that should keep every executive up at night: **only 19% of AI users are in the "Frontier" zone**, where individual capability and organizational readiness reinforce each other. About half are "Emergent." Sixteen percent are stalled. Ten percent are skilled workers stuck in companies that haven't caught up. Five percent are sitting in well-equipped orgs but haven't picked up the tools.

What that data is telling us, if we read it honestly, is that **the bottleneck is no longer the technology**. It's the operating model around the technology. Microsoft's own analysis is blunt about it: organizational factors — culture, manager support, talent practices — account for 67% of AI's real impact. Individual mindset and behavior accounts for 32%.

This lines up with what Anthropic's most recent [Economic Index report](https://www.anthropic.com/research/economic-index-march-2026-report) found: experienced AI users are *dramatically* more successful than newcomers at automating tasks. The gap isn't intelligence. It's reps inside a structure that lets you learn what works.

And it lines up with the Stanford [2026 AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report), which reported that 88% of organizations are using AI but fewer than 10% have fully scaled it inside any single function. Adoption is everywhere. Operationalization is rare.

This is the gap Airbnb is trying to close. Here's how.

## The five things Airbnb is actually doing

### 1. Trade PDFs for markdown files

Roberts's argument: slides and PDFs were built for human consumption in static, presentational settings. They're visually rich and machine-illegible. Markdown is the opposite — lightweight, version-controllable, diff-able, parseable, and trivially ingestible by any model. **It's also the format that made software disruptive in the first place.** His entire leadership team writes in markdown now.

Every PDF in your Drive is a wall between your knowledge and your AI. Every slide is a one-way mirror. The moment your strategy doc, your team update, your project brief, your customer research is in markdown, it becomes part of the substrate the model can reason against.

This is the cheapest, highest-leverage move in the whole playbook, and you can do it tomorrow.

### 2. Train a model on your org's best work, then turn it into a "skill"

Airbnb's HR team historically wasn't known for storytelling. So they did the obvious-in-retrospect thing: they took the company's best executive presentations, trained a model on them, and turned the result into a foundational *skill* that any HR employee can plug data into and get a polished, on-brand narrative back in seconds.

Notice the framing — "skill," not "tool." A skill is reusable, composable, and shared. It's a piece of organizational capability that lives outside any one person.

Context engineering at the org level: you're not asking people to be better prompt engineers. You're giving them pre-loaded context — the gold-standard examples, the brand voice, the structural conventions — so they don't have to reinvent the wheel for every output. The [Anthropic guidance](https://www.anthropic.com/news/the-anthropic-economic-index) on this is increasingly clear: the highest-leverage AI work isn't writing better prompts, it's curating better context.

### 3. Measure communication velocity and dissonance with meeting recordings

Airbnb ingests video from every town hall — VPs, SVPs, C-suite — and uses it to measure two things:

- **Velocity**: How long does a message take to cascade from "here's where we're going" to "here's what it means for your work"?
- **Veracity**: Where is there dissonance between the stated strategy and what a function is actually doing?

For an organizational scientist, this is a holy grail. We have wanted this data forever. Pre-AI, the only way to get it was to interview hundreds of people, and even then you'd have to triangulate. Now you ingest the source material and let a model do the diff.

For a knowledge worker, the implication is the same in miniature: **your meetings are training data for your own operating model.** Most of you are already recording them. Almost none of you are using them as a feedback loop on your own communication.

### 4. Leaders must build. Not delegate. Build.

Iain's team handed him a six-month roadmap for a "gathering tool" to help hybrid teams plan offsites. He built it over a weekend. The line that's going to get tattooed on people: **"If you delegate the building, you delegate the learning."**

He has mandated that his leaders actually build things — not approve roadmaps for things, *build them* — so they're learning and experiencing the AI's capabilities alongside their teams. This is a deeply uncomfortable shift for senior people, and it happens to be the most predictive variable in Microsoft's data. When managers actively model AI use, employees report a **17-point increase in the value they get from AI and a 30-point boost in trust in agents**. When they don't, AI adoption stalls regardless of what the company spends on licenses.

### 5. Forget Forward Deployed Engineers. Hire embedded organizational architects.

Palantir popularized the FDE: plumb the data, map the process, plug AI in. Roberts thinks this misses the point. You don't optimize the existing org around AI — you redesign the org around people and technology together.

His proposed role is an "embedded organizational architect": someone deeply empathic, deeply social, deeply understanding the human condition. "An organization," he says, "is really just a network of individuals trying to get things done collectively."

Most leaders won't internalize this for another two years. The shift isn't from human to AI. It's from hierarchies and reporting lines to networks and workflows. The org chart isn't going away, but it's no longer the unit of analysis — the *flow of work* is.

## What this looks like for one person

Here's where I get personal.

I've been running a version of this internally for about six months. Not at Airbnb scale — I'm one person with a podcast, a research practice, and a pile of weekly artifacts to ship. But the principles transferred almost directly, and I want to tell you what changed.

**My outputs are stronger.** Not because the model got smarter (it did, but that's not the variable here). Because the context I give it is curated and consistent. My drafts now read like *me* on the first pass instead of needing three rounds of voice editing.

**They're easier to challenge.** When the structure is consistent, I can argue with the output. I can point at a section and say "this is the wrong frame" and we can have a conversation about why. Before, every output felt bespoke and hard to critique because I had no baseline.

**My token usage has dropped substantially.** This is the unintuitive one. You'd think a more elaborate system would use more tokens. The opposite has been true. I'm not re-prompting because the first answer was off. I'm not pasting in five examples because the system already has them. Anthropic's [context caching](https://www.anthropic.com/news/prompt-caching) gives me a 90% discount on the stable parts of my context. Multiply that by every interaction and the math gets serious.

That last point matters in the broader story. We're in a moment where the cost of AI is genuinely a line item, not a rounding error. Every product team I talk to is watching their bill creep up. The companies — and the individuals — who get this right won't be the ones with the biggest budget. They'll be the ones who built the operating model that keeps cost flat as usage scales.

## A field guide for knowledge workers (low-to-intermediate operators, this is for you)

If the Airbnb story sounds like something only an HR org with a CHRO and a six-month budget can do — it isn't. Here is a step-by-step version you can run on yourself starting this week.

### Step 1: Convert your "intelligence" to markdown

Pick the five documents you reference most often: a strategy doc, a brand voice guide, a recurring report template, a key customer profile, your weekly update format.

Convert them to markdown. (Most tools — Notion, Google Docs, Word — can export to markdown now, or you can paste them into Claude or ChatGPT and ask for a clean markdown version.)

Put them in one folder. This is your context substrate.

### Step 2: Build one "skill" — a reusable, parameterized prompt

Pick the single highest-frequency output you produce (article drafts for me; customer summaries, status reports, talking points, candidate evaluations, or design rationales for you).

Write a single prompt that loads your context substrate, states the task in plain language, lists the criteria for "good," and has marked input slots ("[topic]", "[audience]", "[length]"). Use it three times. Note what's wrong. Refine. Save it somewhere findable — Notion page, Claude Project, GitHub gist.

### Step 3: Build a feedback loop

Keep a one-line note after every use on what worked and what didn't. After 5–10 uses, patterns emerge. Adjust the prompt, context, and criteria based on what you've seen fail.

90% of people skip this. The skill compounds not from cleverer prompting but from watching it fail in ten specific ways and fixing five of them.

### Step 4: Build it yourself

Don't outsource this to an intern, agency, or platform team — *you* build it. Roberts's line applies to individuals too: if you delegate the building, you delegate the learning. Even if your version is duct tape, building teaches you what's possible.

### Step 5: Add a second skill, then a third

Once one workflow is humming, repeat. Investment per skill drops because your context substrate is already there. Each new skill compounds on the previous ones. Within three months, you should have 4–6 weekly skills, a quietly improving substrate, and measurably lower iteration time.

## Questions to ask yourself

When building a new skill, run through these — they catch most problems that would otherwise take a week to debug.

**On the work:**
- What's the actual output, not just the task?
- Who's the audience, and what would they push back on?
- Do I do this at least once a week?

**On context:**
- What does the model need to know about me (or my org) to get this right on the first pass?
- What good and bad examples can I include?
- Am I including context out of habit that the model doesn't need?

**On evaluation:**
- What does "good" look like concretely?
- What one thing, if wrong, makes the whole output unusable?
- How do I know if a draft is on track without rereading it all?

**On cost and replication:**
- Could a colleague run this workflow and get similar output?
- What context is stable enough to cache?
- Where am I burning tokens on context I sent yesterday?

**On the build:**
- Am I delegating the building itself? Why?
- What do I learn by building this that I can't learn from a finished version?

## The honest part

I want to be clear about something, because the AI discourse is mostly people selling things: this is a costly period of working. The payoff is back-loaded — you won't see compound returns for two or three months. Token bills are real, time investment is real, cognitive cost of changing workflows is real.

The reason I think it's worth it anyway is that the alternative is worse. The alternative is what most knowledge workers are doing right now: ad-hoc prompting, inconsistent outputs, tokens flowing out the door for marginal value, and zero cumulative learning. You wake up six months in with a higher AI bill, no skills you can hand to a colleague, and outputs that are still fundamentally you-with-an-assistant rather than something more interesting.

The Frontier zone isn't a magical place. Individual practice and structural support reinforce each other instead of fighting. You can build that structure deliberately, even at the scale of one person. Slides are the enemy of intelligence. So are workflows without feedback loops, tools without skills, and skills without context.

---

**Which of these five would land hardest at your company?** Reply in the comments — I'm gathering examples for the next issue.

---

*Sources referenced: [Mary Kate Stimmler's LinkedIn summary of Iain Roberts's Stanford HAI talk](https://www.linkedin.com/feed/update/urn:li:activity:7460686634704015360/); [Microsoft 2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index); [Anthropic Economic Index, March 2026 report](https://www.anthropic.com/research/economic-index-march-2026-report); [Stanford HAI 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report); [Airbnb Engineering: Intelligent Automation Platform](https://airbnb.tech/ai-ml/intelligent-automation-platform-empowering-conversational-ai-and-beyond-at-airbnb/).*
