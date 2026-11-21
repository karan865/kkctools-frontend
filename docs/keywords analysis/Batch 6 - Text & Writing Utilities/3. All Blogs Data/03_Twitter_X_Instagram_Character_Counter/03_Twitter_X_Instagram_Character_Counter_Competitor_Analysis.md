# Twitter (X) & Instagram Character Counter — Competitor Analysis

> **Target page:** KKCTools `/twitter-character-counter/` (Batch 6, Tool #3 ✅)
> **Primary keyword:** `twitter character counter`: US 1,000 · KD 8. The cluster has 17 keywords and 13,120 US searches, including `twitter character limit` (2,900), `discord character limit` (1,000) and `x character limit` (880).
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors come from live web searches on 2026-11-14 for `twitter character counter tweet` and `instagram character counter caption bio limit`. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 5 read: SocialBee, Hootsuite, CharacterCounter.com/twitter, Inrō (Instagram), and the **official X docs on counting characters**, used as the rules source. ThreadCreator redirected to Pallyy and was not re-fetched.

---

## 0. How this was collected (read first)

- **Who ranks:** the SERP is almost all **social-media SaaS lead-gen**. These counters exist to sell scheduling tools.
  - SocialBee, Hootsuite, Pallyy/ThreadCreator, SuperX, PostSyncer, Ayrshare, PostNext, Schedulala, OpenTweet, PostPlanify, Kollab, SocialCal, Inrō, Bundle.social
  - Plus CharacterCounter.com
- **Official X rules (docs.x.com, "Counting characters"):**
  - The limit is 280 **weighted** characters.
  - Weight 1: Latin letters, punctuation and common symbols.
  - Weight 2: emoji, CJK characters and other Unicode.
  - A ZWJ emoji sequence counts as one emoji (weight 2).
  - Any URL counts as 23.
  - Auto-populated reply @mentions don't count.
  - Media counts as 0.
  - Length is measured after NFC normalisation.
  - The official twitter-text library implements these rules.
  - **Keyword-file rule: implement them in our own code, with no library.** AGENTS.md also restricts dependencies.
- **Competitor errors against the official rules:**
  - SocialBee says emoji count as 1. They count as **2**.
  - CharacterCounter.com contradicts itself on emoji, URLs and hashtags.
  - A search snippet claimed a quote tweet's text counts toward your 280. It doesn't; the quoted post is attached as a link. `TODO(owner)`: confirm against X help.
- **Premium limits disagree:** sources say 4,000 vs 25,000. Platform limits change, so every preset needs a **"checked on <date>" plus an official source**, re-checked quarterly (keyword file).
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | socialbee.com/free-tools/twitter-character-counter/ | Social SaaS | Free Twitter character counter: Check your tweet length instantly | 900–1,100 |
| 2 | hootsuite.com/social-media-tools/character-counter | Social SaaS | Free character counter for social media | ~800 |
| 3 | charactercounter.com/twitter | Counter site | Twitter Character Counter | ~2,500 |
| 4 | inro.social/tools/instagram-character-counter | IG automation SaaS | Instagram Character Counter | 1,700–1,900 |
| 5 | docs.x.com/fundamentals/counting-characters | **Official X docs** | Counting characters | reference |
| — | threadcreator.com → pallyy.com | Social SaaS (thread splitter) | — | **redirect, not read** |

**What this tells us:**
- **No competitor applies X's weighted rules correctly *and* explains them.**
  - SocialBee gets emoji wrong.
  - CharacterCounter.com contradicts itself.
  - Hootsuite counts plain characters with and without spaces only, with no URL or emoji rules.
- **Inrō is the quality benchmark on the Instagram side.**
  - It counts 7 fields (caption, comment, DM, bio, username, hashtags, @mentions).
  - It counts graphemes, code points **and** UTF-16 units, and explains why counters differ.
  - It cites Meta developer documentation with dates.
  - Weak spots: heavy promotion, and some limits are weakly sourced.
- **CharacterCounter.com covers the most X metrics** (Premium, DM, reply, bio, username, name) and a thread converter, but it has contradictions and unsourced statistics.
- **Hootsuite covers the most platforms**, but its "limits" are mostly *engagement recommendations* (e.g. 71–100 characters on X). They aren't hard limits, aren't dated, and some are unsourced.
- **Nobody combines all of these:**
  - correct X weighting
  - one page with presets for X, Instagram, Discord, LinkedIn, Facebook, TikTok and YouTube
  - each preset dated and sourced
  - a thread splitter with 1/n numbering
  - a remaining-characters ring
  - privacy (text stays local)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | SocialBee | Hootsuite | CharacterCounter | Inrō (IG) |
|---|---|---|---|---|
| Live count | ✅ (claimed) | ⚠️ (click Count) | ✅ | ✅ |
| **X weighted count (emoji/CJK = 2)** | ❌ (emoji = 1, **wrong**) | ❌ | ⚠️ (contradictory) | n/a |
| URL = 23 | ✅ (stated) | ❌ | ⚠️ (stated once, vague elsewhere) | n/a |
| NFC normalisation | ❌ | ❌ | ❌ | ⚠️ (UAX #29 graphemes) |
| Remaining characters | ⚠️ | ❌ | ✅ | ✅ |
| X Premium limit | ⚠️ (4,000 / 25,000, vague) | ❌ | ✅ (25,000, undated) | n/a |
| X DM, bio, username, name | ❌ | ❌ | ✅ | n/a |
| Thread splitter (1/n) | ❌ | ❌ | ✅ (link to a maker) | n/a |
| Instagram caption / bio / comment / DM / username | ❌ | ⚠️ (engagement tips) | ❌ | ✅ (7 fields) |
| Hashtag / mention counts | ❌ | ⚠️ | ❌ | ✅ |
| "…more" truncation preview (IG ~125) | ❌ | ⚠️ | ❌ | ✅ (labelled undocumented) |
| Discord / LinkedIn / TikTok / YouTube / Facebook | ❌ | ✅ (mixed units) | ❌ | ❌ |
| Grapheme vs code point vs UTF-16 shown | ❌ | ❌ | ❌ | ✅ |
| Limits dated + sourced | ❌ | ❌ | ❌ | ⚠️ (some) |
| Copy / post button | ⚠️ | ❌ | ✅ | ✅ |
| Privacy (no network) | ❌ | ❌ | ❌ | ✅ (claimed) |

---

## 3. Feature matrix — content and trust

| Item | SocialBee | Hootsuite | CharacterCounter | Inrō |
|---|---|---|---|---|
| Counting rules explained | ⚠️ (emoji wrong) | ⚠️ (spaces only) | ⚠️ (contradictions) | ✅ |
| Official source linked | ❌ | ⚠️ (own blog) | ❌ | ✅ (Meta developer, Help Center) |
| History (140 → 280, 2017) | ✅ | ❌ | ✅ (timeline) | n/a |
| Engagement-length claims | unsourced (70–120) | "Hootsuite data" | unsourced statistics | — |
| FAQ count | 6 | 0 | ~8 | 8 |
| Named author | ❌ | ❌ | ❌ | ✅ (staff) |
| Date | ❌ | ❌ | ❌ | ✅ (Aug 2026) |
| Promotion | ~10 CTAs | heavy | moderate | heavy |

---

## 4. Competitor-by-competitor detail

### 1. SocialBee: Twitter Character Counter
- **Claims:** 280 standard; Premium "4,000 or 25,000 in some regions" (vague); links = 23 ✔.
- **Error:** "each emoji counts as 1". The official rule is **2**. CJK weighting isn't mentioned.
- **FAQs (6):**
  1. Is it still 280?
  2. How X counts characters
  3. The original 140 limit
  4. Mentions and hashtags
  5. Emoji (wrong answer)
  6. Spaces
- **Weak points:**
  - "70–120 characters get more engagement" has no source.
  - Typo "Start you".
  - No author or date.

### 2. Hootsuite: Character Counter for social media
- **Counts:** characters with and without spaces.
- **Per-platform guidance:** X, Instagram, Facebook, LinkedIn, TikTok, Pinterest, YouTube, Snapchat. These are mostly *best-practice* lengths, not limits. Some are in words, some in characters.
- **Weak points:**
  - No URL or emoji rules.
  - No date.
  - Instagram's "optimal 138–150" sits above its "ads < 125" with no explanation.
  - Typo "easy to red".
  - Heavy upselling.

### 3. CharacterCounter.com: Twitter Character Counter
- **Limits listed:** tweet 280 / Premium 25,000 / DM 10,000 / reply 280 / bio 160 / username 5–15 / name 50. Includes a history timeline up to 2023, a thread converter, and a Post on X button.
- **Errors and contradictions:**
  - URLs are "23" in one place and "a fixed number" in another.
  - Emoji are "2" in one place, then "may differ" in another.
  - Says "max two hashtags", then "no hashtag limit".
  - Unsourced usage statistics.
  - Uses "word count" when it means character count.
- **Weak points:** no author or date; padded SEO copy.

### 4. Inrō: Instagram Character Counter (Aug 2026), the Instagram benchmark
- **Fields:**
  - caption 2,200 (Meta developer reference ✔)
  - hashtags 30 / mentions 20 (Meta ✔)
  - in-app hashtags 5
  - bio 150 (Help Center, no link)
  - DM 1,000 (weakly sourced)
  - username 30 (unsourced)
  - comment 2,200 (contradicts its own note)
- **Method:** shows Intl.Segmenter graphemes, code points and UTF-16 units. Recommends using UTF-16 as the safe figure.
- **FAQs (8).**
- **Weak points:**
  - Repeated calls to action.
  - The "Trusted by 10,000+" social proof has no evidence.
  - A source dated after the page's own update date.

### 5. Official X docs: Counting characters (our rules source)
- **Rules:** 280 weighted; weight 1 for Latin/punctuation; weight 2 for emoji, CJK and other Unicode; ZWJ sequences = 1 emoji; URL = 23; auto reply-mentions free; media 0; NFC normalisation.
- **Example:** "Hello, world! 👋" has weighted length 16 ✔ (14 + 2).
- **Library:** twitter-text (Apache-2.0). Reference only. We implement our own code (keyword file / AGENTS dependency rule).

---

## 5. Patterns

**X weighted length (our implementation)**
1. Normalise the text with NFC.
2. Replace each URL match with a 23-character placeholder. Use our own URL regex; `TODO(owner)`: test it against the twitter-text conformance cases (Apache-2.0 test data may be used as fixtures, with attribution).
3. Iterate grapheme clusters:
   - an emoji grapheme (incl. ZWJ, skin tones) → 2
   - a code point inside the weight-1 ranges → 1, otherwise 2
4. Compare the total with the chosen limit (280, or the Premium value from a dated preset).

**Thread splitter**
- Split at sentence or word boundaries so each post is ≤ (limit − suffix length).
- Add a " 1/n" suffix. Its own weighted length is included.
- Never break a URL or an emoji.

**Platform presets (data file: limit, unit, source URL, checked date)**
- X post, X Premium, X bio, X name
- Instagram caption, bio, comment, username, hashtags count
- Discord message and bio
- LinkedIn post
- Facebook post
- TikTok caption
- YouTube title and description
- Every value is `TODO(owner)` to verify against official help pages and re-check quarterly.

**Counting units shown:** graphemes, code points, UTF-16 units, plus the X weighted count.

**What the 4 competitors cover**

| Section | Pages (of 4) |
|---|:---:|
| Correct X emoji weighting | **0** |
| URL = 23 | 2 |
| Multi-platform presets | 1 (mixed) |
| Dated + sourced limits | 1 partial |
| Thread splitter | 1 (link) |
| Grapheme/code-unit explanation | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to the 17-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the Twitter (X) character limit? | all · `twitter character limit`, `x character limit`, `character limit on twitter` |
| 2 | ★ How many characters are in a tweet? | SocialBee · `how many characters are in a tweet` |
| 3 | ★ How does X count emoji, links and mentions? | SocialBee (wrong), CharacterCounter |
| 4 | ★ What is the Instagram caption / bio character limit? | Inrō · `instagram caption character limit`, `instagram character limit` |
| 5 | Do spaces count on X? | SocialBee |
| 6 | What is the X Premium post limit? | SocialBee, CharacterCounter (conflicting) |
| 7 | What is the Discord message / bio limit? | `discord character limit` |
| 8 | Why do different counters show different numbers? | Inrō |
| 9 | How do I split a long post into a thread? | CharacterCounter |
| 10 | How much of an Instagram caption shows before "more"? | Inrō, Hootsuite |
| 11 | Do hashtags count toward the limit? | CharacterCounter, Inrō |

---

## 7. Gaps nobody fills — our opportunities

1. **Correct X weighted counting** to the official rules: NFC, URL = 23, emoji and CJK = 2, ZWJ handled. Written in our own code with conformance fixtures.
2. **One page with all the platform presets**, each showing **"checked on <date>" plus an official source link**. A quarterly re-check is a `TODO(owner)` (keyword file).
3. **Remaining-characters ring** and over-limit highlighting at the exact point where the text goes over.
4. **Thread splitter:** smart boundaries, 1/n numbering, each part counted with the weighted rules, copy for each post.
5. **Instagram fields:** caption (with the ~125 "more" preview, labelled approximate), bio, comment, hashtag and mention counts.
6. **Transparency panel:** graphemes, code points, UTF-16 and X-weighted counts side by side, with a plain explanation.
7. **Accurate FAQ** that fixes the common myths (emoji = 1, quote tweets).
8. **Privacy:** text stays in the browser; no posting integrations.
9. **Brand names used descriptively only** (keyword-file note). No logos.
10. **Links:** Character Counter (#5), Characters to Words (#2), Word Counter (#6).

---

## 8. Blueprint for the KKCTools Twitter (X) & Instagram Character Counter

### 8.1 SEO

- **URL:** `/twitter-character-counter/`
- **Title:** Twitter Character Counter – X & Instagram Limits
- **H1:** Twitter (X) Character Counter: Tweets, Instagram Captions and Bio Limits
- **Meta:** as in the keyword file (145 chars).
- **H2s:** X character limit · Instagram character limit · Discord character limit.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | Textarea (live) |
| Count | X weighted (NFC, URL 23, emoji/CJK 2); graphemes; code points; UTF-16 |
| Presets | X post / Premium / bio / name · IG caption / bio / comment / username · Discord · LinkedIn · Facebook · TikTok · YouTube (data file with source + checked date) |
| Display | Remaining ring, over-limit highlight, IG "more" preview, hashtag/mention count |
| Thread | Split → numbered posts, each counted, copy buttons |
| UX | Copy, clear, no network, local only |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword)
2. How to use
3. X character limit (with dated source)
4. How X counts characters: emoji, links, mentions, CJK
5. Writing threads
6. Instagram limits: caption, bio, comments, hashtags (dated, sourced)
7. Other platforms: Discord, LinkedIn, TikTok, YouTube, Facebook (dated, sourced)
8. Why counters disagree
9. FAQ (10–12)
10. Related tools: Character Counter (#5), Characters to Words (#2), Word Counter (#6)

### 8.4 Quality checks

- **Unit tests:**
  - weighted count against fixtures (e.g. "Hello, world! 👋" = 16)
  - URL forms
  - ZWJ / skin-tone emoji
  - CJK
  - NFC
  - thread splitter boundaries
- Presets data file includes `source` and `checkedOn` fields. No network calls.
- No competitor wording. No logos. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - verify every preset limit against official help pages and set the quarterly re-check
  - confirm whether twitter-text conformance data can be used as test fixtures (licence attribution)
