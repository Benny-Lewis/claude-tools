---
name: notebooklm
description: >
  Use this skill for anything involving NotebookLM — setting up notebooks,
  curating sources, writing audio overview prompts, or optimizing
  configurations. Also use this skill when users want to turn any topic,
  documents, or research into listenable audio content for learning — even
  without naming NotebookLM. This includes: creating audio deep dives,
  audio briefings, or podcast-style summaries of a subject; converting PDFs
  or articles into something to listen to on a commute; preparing for
  interviews, exams, presentations, or onboarding through audio study
  materials; or requesting an AI-hosted audio discussion or critique of any
  material. Trigger signals include "audio overview", "audio deep dive",
  "audio briefing", "listen to while driving", "study podcast", and any
  request combining a learning goal with an audio or podcast format. Do NOT
  trigger for building audio player software, recording voice memos,
  producing marketing podcasts, or general document creation.
---

# NotebookLM Notebook & Audio Overview Builder

Build optimized NotebookLM notebooks and audio overviews for any topic. This skill handles the full pipeline: understanding the user's goal, researching high-quality sources, curating the optimal source set, crafting a tailored audio overview prompt, and producing a ready-to-use output file.

## Why This Matters

NotebookLM audio overviews are powerful but highly sensitive to input quality. The difference between a generic, wandering podcast and a focused, actionable one comes down to three things: source curation, source format, and prompt engineering. A notebook stuffed with 50 uncurated URLs will produce worse audio than one with 4 carefully chosen sources and a prescriptive prompt. This skill encodes those hard-won lessons so every notebook starts strong.

---

## Workflow

Follow these five phases in order. Each builds on the previous.

### Phase 1: Interview the User

This is the most important phase. A thorough understanding of the user's goal determines everything downstream — which sources matter, how to frame the prompt, and what depth to target. Don't rush it.

**Ask about:**

- **Topic** — What subject, project, or domain?
- **Goal** — What outcome? Learning a new field, interview prep, auditing their own writing, teaching someone else, decision support, exam prep, project onboarding?
- **Audience** — Who listens? The user themselves, a team, students?
- **Knowledge level** — What does the listener already know? What's genuinely new? (This calibrates how much the AI hosts should explain vs. assume.)
- **Angle** — Business vs. technical? Practical vs. theoretical? Breadth vs. depth? A company overview hits differently than a deep-dive into their engineering stack.
- **What to emphasize** — Specific people, numbers, concepts, terms they want named in the audio
- **What to skip** — Topics the listener already knows or that would pull the audio off-topic
- **Existing materials** — Does the user already have documents, URLs, research, or notes? These may become sources or inform what additional research is needed.
- **Timeline and listening context** — When do they need this? How will they listen? (Commute, study session, background while working?) This determines audio length.

Ask follow-up questions. Clarify ambiguities. The more specific your understanding, the better everything downstream.

**Scope management:** Always produce **one notebook** with **one audio overview**. If the topic feels too broad for a single focused audio, narrow it during the interview — help the user pick the most valuable angle rather than trying to cover everything. A focused 20-minute deep dive is more useful than three shallow 10-minute overviews that each require separate notebook setup.

---

### Phase 2: Research Sources

Use web search to find high-quality sources. The goal is the *best* available material, not the *most*.

**Source quality hierarchy (prefer higher):**
1. **Primary/original** — Official docs, research papers, company pages, government publications, press releases
2. **In-depth journalism** — Long-form articles with original reporting, interviews, facility tours
3. **Expert practitioner content** — Podcast appearances by domain experts, conference talks, technical blogs
4. **Encyclopedic** — Wikipedia articles (surprisingly effective as NotebookLM sources — well-structured, comprehensive, freely accessible)
5. **Secondary analysis** — News summaries, aggregator content (use sparingly — low information density)

**The triangulated source strategy:**
For richer audio discussion, aim for a mix across these three dimensions:
- **Practical/applied** — The user's own documents, job postings, project specs, prep notes
- **Authoritative/factual** — Official docs, papers, standards, company pages with concrete data
- **Contextual/analytical** — Strategy documents, expert commentary, research reports that provide framing

**Search approach:**
- Start broad to map the landscape, then narrow to the highest-value sources
- Look for "anchor" sources — the one or two definitive references that cover the topic comprehensively (e.g., a Wikipedia overview article, an industry reference book, a government report)
- Find at least one source with named people, specific dollar amounts, or concrete examples — these give the AI hosts vivid material to discuss
- Verify URLs are publicly accessible (no paywalls, no login walls). NotebookLM cannot access paywalled content.
- YouTube URLs work if the video has captions — NotebookLM imports the transcript

**Known problematic URL domains — avoid or compile instead:**
- **Paywalled news**: NYT, WSJ, Bloomberg, Financial Times, The Atlantic
- **Metered/paywalled platforms**: Medium (frequently metered for non-subscribers), Substack (premium posts)
- **Academic journals**: Many require institutional access (Nature, Science, IEEE, Wiley, Taylor & Francis, NEJM). Use open-access versions (PMC, arXiv, OSTI, NTRS) when available.
- **Data-only pages**: FRED charts, raw datasets — NotebookLM can't extract chart data. Compile the key statistics into a .md file instead.
- **Portal/landing pages**: Zillow Research hub, company career pages — these scrape poorly. Find the specific article or report URL instead.

When a high-value source is on a problematic domain, fetch the content yourself and compile it into a .md file rather than hoping NotebookLM can scrape it.

---

### Phase 3: Curate Sources

This is where quality beats quantity. NotebookLM uses RAG (retrieval-augmented generation) internally. More sources means more noise for the retrieval step, which degrades the quality of the audio output.

**Optimal source count:**
- **3–5 focused sources** is the proven sweet spot for audio quality
- Up to ~8 sources works if they're well-organized and don't overlap
- Beyond 10, expect the audio to become more superficial as it spreads attention thin
- If you find yourself wanting 15+ sources, you're trying to cover too much — narrow the topic instead

**Source format — what NotebookLM handles best:**
1. **Markdown (.md)** — Best format. Machine-readable, preserved structure, no parsing errors.
2. **Plain text (.txt)** — Great. Clean input, no interpretation needed.
3. **Google Docs** — Great. Native integration, multi-tab support.
4. **PDF (text-based)** — Good, if text is selectable. Scanned/image PDFs and complex multi-column layouts cause problems.
5. **Web URLs** — Acceptable but lossy. Only text is scraped — images, structure, and embedded media are lost.
6. **YouTube URLs** — Niche. Only the caption transcript is imported. Good for talks and interviews.

**Always produce a compiled intelligence brief:**

This is the skill's most impactful contribution. For every notebook, create a custom .md file that synthesizes the most actionable content from your research. This brief becomes the anchor source — the one document that ensures the AI hosts discuss specific facts, names, numbers, and practical details rather than staying generic.

The intelligence brief should contain:
- **The most specific, concrete content** — named people with titles, dollar amounts, dates, technical specs, commands, error states. NotebookLM's RAG system pulls from this to make the discussion vivid.
- **Practical/operational content** — step-by-step workflows, debugging procedures, decision frameworks, checklists. This is the content that web sources often lack but listeners find most valuable.
- **Structured sections with clear headings** — H1/H2/H3 headings help NotebookLM's retrieval. Bullet points over dense paragraphs.
- **An executive summary at the top** — NotebookLM weights document beginnings.
- **Bold key terms and names** — signals importance to the retrieval system.

The brief typically runs 1,500–3,500 words. Name it descriptively (e.g., `spacex-propulsion-intelligence-brief.md`, `k8s-core-concepts-brief.md`).

**When to use original URLs vs. compiled documents:**

Use **original URLs** when:
- The source is publicly accessible, well-structured, and on a reliable domain
- You want NotebookLM to find connections the user hasn't noticed
- Source fidelity and direct citations matter

**Compile into the intelligence brief** when:
- The source is paywalled or on a problematic domain
- Multiple fragmented sources need synthesis
- You need the audio to reliably hit specific points, names, and numbers
- The original source has too much noise or irrelevant content

**Curation checklist:**
- Each source has a clear, non-overlapping reason for inclusion
- No duplicate coverage (same story from multiple outlets wastes a source slot)
- Technical depth matches the listener's knowledge level
- Source mix is balanced across the topics the user wants covered (if sources skew heavily toward one topic, the audio will too — add or remove to rebalance)
- Sources that would pull the audio off-topic are removed, not just deselected
- Any potentially problematic sources are flagged (paywalls, video-only, very large documents)
- The intelligence brief is included and listed as the primary/anchor source

---

### Phase 4: Write the Audio Overview Prompt

The prompt goes into NotebookLM's "What should the AI hosts focus on?" field. This is the single highest-leverage piece of the entire output — a well-crafted prompt with adequate sources consistently beats vague prompts with perfect sources.

**Prompt structure — always follow this pattern:**

1. **"Skip the introduction"** — Always start the prompt with this directive. It consistently reclaims 60–90 seconds that NotebookLM otherwise spends on generic preamble ("Hey everyone, today we're going to explore..."). This is the single most reliably effective prompt engineering pattern — it works almost every time and the time savings directly translates to more substantive content.
2. **Context** — One sentence: who the listener is and what they're preparing for.
3. **Focus directive** — What the AI hosts should emphasize and explore.
4. **Specific content requests** — Enumerate the topics, people, numbers, and terms to cover. Be prescriptive — list exactly what to discuss, in what order, with what level of detail. Vague prompts produce vague audio.
5. **Balance directives** — If the audio should cover multiple themes (e.g., business + technical + people), explicitly state they should receive roughly equal weight. Without this instruction, NotebookLM's default behavior is to go deep on technically rich content and skip softer topics like people, culture, or business context entirely.
6. **Negative constraints** — What NOT to cover. "Don't explain how X works — the listener already knows this." This reclaims airtime for what actually matters and prevents the audio from spending time on content below the listener's level.
7. **Audience framing** — "The audience is [specific person/role] — help them [specific outcome]."

**Additional effective techniques:**

| Technique | What It Does | Example |
|-----------|-------------|---------|
| Name-dropping | Forces the AI to weave specifics into conversation instead of staying high-level | "Cover Tyler Bernstein (CEO), the $50M Series B, and the DOE BUP-500 partnership by name." |
| Expertise calibration | Adjusts explanation depth immediately | "Speak to someone who has already read the material and doesn't need basic definitions." |
| "Take your time" | Gives the model permission to be thorough on complex content | "Take your time with the manufacturing steps — that's the part the listener specifically wants to understand." |

**Prompt length:** 100–250 words. Shorter for focused single-topic notebooks; longer when balancing multiple themes or requiring prescriptive coverage of many named items.

**Select the right format:**

| Format | Best For | Length Options |
|--------|---------|----------------|
| **Deep Dive** | Learning, comprehensive understanding, interview prep, most use cases | Shorter (~5 min), Default (~10 min), Longer (~20 min) |
| **Brief** | Quick recaps, morning-of refreshers, time-constrained review | Fixed (~1–2 min) |
| **Critique** | Auditing your own drafts, proposals, or presentations | Fixed |
| **Debate** | Exploring opposing perspectives, preparing for counterarguments | Fixed |

Deep Dive is the right default for most situations. Only recommend Brief, Critique, or Debate when the user's goal specifically calls for it.

**Select the right length (Deep Dive only) — consider the user's context:**
- **Shorter (~5 min)** — Day-of refreshers, quick recaps, simple focused topics
- **Default (~10 min)** — Moderate depth, time-constrained listeners
- **Longer (~20 min)** — Use this when: the user has time (>1 week before they need the material), they'll listen during commute/exercise, the topic has 3+ facets to balance, or they explicitly want depth. When in doubt for learning or interview prep, default to Longer — the extra depth is almost always more valuable than saving 10 minutes.

---

### Phase 5: Produce the Output

Generate a single .md setup file plus the compiled intelligence brief. These two files contain everything the user needs to create the notebook in NotebookLM.

**Setup file template:**

```
# NotebookLM Setup: [Notebook Name]

> **Goal:** [One sentence — what this notebook is for and who the listener is]

---

## Quick Copy — All URLs

Paste these into NotebookLM's "Add source" > "Website" input:

\```
[url1]
[url2]
[url3]
\```

## Local Files to Upload

| File | Description |
|------|-------------|
| `intelligence-brief.md` | **Primary source.** [What it contains and why it's the anchor source] |

---

## Audio Overview Settings

- **Format:** [Deep Dive / Brief / Critique / Debate]
- **Length:** [Shorter / Default / Longer] — [brief rationale for the choice]

### Customization Prompt

Paste into "What should the AI hosts focus on?":

> [The full prompt text — always starting with "Skip the introduction"]

---

## Source Library

### [Category 1 Name]

| # | Title | URL or File | Notes |
|---|-------|-------------|-------|
| 1 | Source title | URL | Why included, what it covers |

### [Category 2 Name]

| # | Title | URL or File | Notes |
|---|-------|-------------|-------|

---

## Ingestion Notes

- [Known issues: paywalled sources, video URLs, very large documents]
- [Format tips: "Convert X to markdown before uploading for better results"]
- [Priority guidance: "If hitting the source limit, drop Category N first — the intelligence brief is the must-keep source"]
- [Regeneration tip: "If the first generation over-indexes on X, regenerate with: 'The first version went too deep on X and skipped Y entirely. Rebalance.'"]
```

**URL block formatting:** One URL per line inside the code fence — easier to scan, edit, and debug than a wall of space-separated URLs.

**Always produce two output files:**
1. The setup .md file (template above)
2. The compiled intelligence brief .md file (referenced in the Local Files table)

Name both files descriptively. Reference the brief in the setup file's Local Files table with a clear note that it's the primary/anchor source.

---

## Reference: NotebookLM Tier Limits

| Feature | Free | Plus | Pro | Ultra |
|---------|------|------|-----|-------|
| Sources per notebook | 50 | 300 | 300 | 600 |
| Audio overviews/day | 3 | — | 20 | 200 |
| Max words per source | 500K | 500K | 500K | 500K |
| Max file size | 200 MB | 200 MB | 200 MB | 200 MB |

On the free tier (3 audio/day), plan the notebook and prompt before generating. Each generation should be deliberate.

---

## Common Pitfalls

These are the most frequent mistakes — knowing them prevents wasted generations:

- **Selecting all sources by default** — Always curate which sources are active. Generating with everything selected produces unfocused audio.
- **Skipping the Customize panel** — Never generate without a focus prompt. Default audio without customization is generic and shallow.
- **Too many sources** — The retrieval system degrades as source count increases. 5 great sources beat 30 mediocre ones.
- **No balance directives** — Without explicit instructions to balance topics, technical content dominates and business/people/culture context gets skipped entirely.
- **Uploading raw unstructured text** — Structure documents with headings and bullet points before uploading. Messy input produces messy audio.
- **Trusting URLs to capture everything** — Web scraping is lossy. When a source is critical, compile it into the intelligence brief instead.
- **Using Medium or paywalled URLs** — Medium articles are frequently metered and fail to ingest. NYT, WSJ, and academic journals have the same problem. Compile the content into a .md file instead.
- **Choosing Default length when Longer is appropriate** — For interview prep, deep learning, or any situation where the user has >1 week and will listen during commute/exercise, choose Longer. The extra depth is almost always worth it.
- **Not flagging the first-generation problem** — NotebookLM's first attempt often over-indexes on one topic. If regenerating, tell the prompt what the previous version got wrong: "The first version went too deep on X and skipped Y entirely."
