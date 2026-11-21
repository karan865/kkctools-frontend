# Twitter (X) & Instagram Character Counter — Build Spec

> **URL:** `/twitter-character-counter/` · Batch 6 · Tier 1 · **Build order 4**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2.2 `verified` flags, §3 sources, §4 `x-count-engine`)
> **Inputs:** `03_Twitter_X_Instagram_Character_Counter_Competitor_Analysis.md`, keyword file §2 #3
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**17 keywords, ≈ 13,000 searches, and the counter rows are all KD 0–14** (several rising):
- `twitter character counter` 1,000 / KD 8;
- `character limit on twitter`, `count characters for twitter`, `count twitter characters` 880 each;
- `instagram character counter` 590 / KD 0, rising;
- `instagram caption character limit` 590.

The limit questions are bigger but harder: `twitter character limit` 2,900 / KD 26 (rising), `discord character limit` 1,000, `x character limit` 880.

**The SERP is social-media SaaS lead-gen** (SocialBee, Hootsuite, Pallyy, SuperX, PostSyncer and a dozen more). Their counters exist to sell schedulers, and **none of them counts the way X does and explains it.**

**X counts characters by weight, not one by one** (docs.x.com, checked 2026-11-22):
- 280 weighted characters;
- Latin letters, punctuation and common symbols weigh 1;
- **emoji and CJK weigh 2** ("All emojis count as 2 characters, regardless of complexity");
- **every URL counts as 23**;
- attached media counts 0; auto-filled @mentions at the start of a reply don't count.

A generic character counter gives the wrong answer for any post with an emoji or a link. **Being exactly right is the whole pitch.**

### Research notes from the competitor analysis

- **Pages read:** SocialBee, Hootsuite, CharacterCounter.com/twitter, Inrō (Instagram), the official X docs. ThreadCreator redirected to Pallyy (not read).
- **SocialBee:** says "each emoji counts as 1". **Wrong**: the rule is 2. Premium given as "4,000 or 25,000 in some regions"; "70–120 characters get more engagement" with no source.
- **Hootsuite:** plain with/without-spaces count only, no URL or emoji rules; its "limits" are mostly engagement recommendations, some in words and some in characters.
- **CharacterCounter.com:** the most X fields (Premium 25,000, DM 10,000, bio 160, username 5–15, name 50) and a thread converter, but it contradicts itself on URLs ("23" vs "a fixed number"), emoji ("2" vs "may differ") and hashtags ("max two" vs "no limit").
- **Inrō** is the Instagram benchmark: 7 fields, graphemes + code points + UTF-16, cites Meta developer docs. But its comment limit contradicts its own note and some limits are unsourced.
- **0 of 4** apply X weighting correctly *and* date-and-source every limit.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | twitter character counter | 1,000 | 8 | title, H1, first sentence, ToolShell heading |
| Secondary | count characters for twitter · count twitter characters · character counter for twitter · tweet character counter · twitter character count · tweet character count | 880 · 880 · 480 · 480 · 480 · 260 | 7–14 | intro, H2 "How to count characters for Twitter", alt text of the guide |
| Secondary | character limit on twitter · twitter character limit · x character limit | 880 · 2,900 · 880 | 8–29 | H2 "Twitter (X) character limit" with the dated source |
| Secondary | how many characters are in a tweet | 390 | 13 | FAQ 2 |
| Secondary | instagram character counter · ig character counter · instagram character count | 590 · 320 · 390 | 0–12 | Instagram preset group, H2 "Instagram character counter" |
| Secondary | instagram caption character limit · instagram character limit | 590 · 720 | 11–23 | H2 "Instagram character limits" (caption 2,200 + 30 hashtags + 20 @ tags, dated) |
| Secondary | discord character limit | 1,000 | 25 | H2 "Discord, LinkedIn, Threads and YouTube limits": **only after the owner verifies Discord** (§3 failed with 403) |

## 2. Our edge

- **X-weighted count to the official rules,** in our own code (§4 `x-count-engine`): NFC, URL = 23, emoji (incl. ZWJ, skin tones, flags) = 2, CJK and other non-Latin ranges = 2, weight-1 ranges from the twitter-text v3 config.
- **Transparency panel:** X-weighted · graphemes · code points · UTF-16 units side by side, with one line on why they differ.
- **One page, many presets, each dated and sourced** (`text-limits.ts`):
  - verified on 2026-11-22: X post 280; Instagram caption 2,200 + 30 hashtags + 20 @ tags; Threads 500; LinkedIn post 3,000; Mastodon 500 (default; links = 23); YouTube title 100 and description 5,000;
  - **unverified until the owner checks** (`verified: false`, shown with a warning): X Premium, X bio/name, Instagram bio/comment/username, Discord, Bluesky, TikTok, Facebook.
- **Remaining ring** and the **exact point of overflow highlighted** (X-weighted for X, graphemes elsewhere).
- **Thread splitter:** splits at sentence, then word boundaries; adds " 1/n"; counts the suffix; never breaks a URL or an emoji; a Copy button per post.
- **Instagram helpers:** hashtag and @mention counters against 30 / 20; an approximate "…more" preview cut labelled as approximate (undocumented).
- **Privacy:** nothing is posted or stored; no "Post to X" button.

## 3. Calculator spec

### 3.1 Tabs

1. **X post** (default)
2. **Instagram**
3. **Thread splitter**
4. **Other platforms** (Threads, LinkedIn, Mastodon, YouTube, plus unverified presets with warnings)

### 3.2 Input guide diagram (above the inputs)

`XCountInputGuide.tsx`: a sample post drawn as text with weight tags under each part.

- Sample: `Hello, world! 👋 https://example.com/a/very/long/link`
- **Tags:**
  - "1 Letters, spaces, punctuation = 1 each" (under `Hello, world! `: 14);
  - "2 Emoji = 2" (under 👋);
  - "3 Any link = 23" (under the URL, however long it is);
  - total badge "40 of 280".
- **Instagram tab:** a caption box with "4 Caption 2,200", "5 Hashtags 0 / 30", "6 Mentions 0 / 20".
- **Thread tab:** three stacked posts with "1/3, 2/3, 3/3" tags.
- Live mode: the tags follow the user's own first 60 graphemes.

Checked with node: `Hello, world! ` 14 + 👋 2 + space 1 + URL 23 = **40**. Make it a unit test.

### 3.3 Inputs

| Field | Default |
|---|---|
| Text | `Hello, world! 👋` (counts 16 on load, the docs' own example) |
| Platform preset | X post (280, X-weighted) |
| Thread limit | 280; numbering " 1/n" (options: none, "1/n", "(1/n)", "🧵 1/n") |
| Thread split at | sentence, then word |
| Instagram field | caption · bio · comment |
| Show transparency panel | on |

### 3.4 Engine (`src/lib/x-count-engine.ts`)

```ts
// Config (twitter-text v3, Apache-2.0; values only, our own code):
// maxWeightedTweetLength 280, scale 100, defaultWeight 200, transformedURLLength 23,
// ranges weight 100: U+0000–U+10FF, U+2000–U+200D, U+2010–U+201F, U+2032–U+2037
xWeightedLength(text):
  t = text.normalize('NFC')
  replace each URL (our regex: scheme or www. or bare domain + TLD, trailing punctuation excluded) → +23
  for each grapheme: if emoji (Extended_Pictographic or a flag pair) → +2
                     else for each code point: in a weight-100 range → +1, else +2
splitThread(text, limit, numbering):
  sentences (shared engine) → pack greedily; a sentence over the limit splits at word boundaries
  n is unknown up front → try n = 1..50 until posts.length === n (suffix length depends on n)
  never split inside a URL or a grapheme
```

`TODO(owner)`: confirm the URL regex against the twitter-text conformance cases (Apache-2.0 data may be used as test fixtures with attribution), including bare domains like `example.com`.

**Worked examples (checked with node, 2026-11-22):**

| Text | X-weighted | Graphemes |
|---|---:|---:|
| `Hello, world! 👋` | **16** (docs example ✔) | 15 |
| `你好世界` | **8** | 4 |
| `日本語のテキスト` | **16** | 8 |
| `नमस्ते` (Devanagari, in the weight-1 range) | **6** | 3 |
| `“Hi”` (smart quotes, U+201C/D in a weight-1 range) | **4** | 4 |
| `👨‍👩‍👧‍👦` / `🇮🇳` | **2** / **2** | 1 / 1 |
| `Read this https://www.example.com/a/very/long/path?utm_source=x 🚀` | **36** (10 + 23 + 1 + 2) | 65 |
| `@friend thanks! 🙌 #tools https://example.com/x` | **49** (16 + 2 + 8 + 23) | — |
| 280 × `a` / 279 × `a` + 👋 | **280** fits / **281** is 1 over | 280 / 280 |

**Thread fixture:** our 6-sentence, 443-character sample (stored as a fixture) splits at 280 into **2 posts (275 and 175 weighted, suffix included)**, and at 140 into **5 posts (119, 97, 65, 89, 89)**.

### 3.5 Outputs

- **Headline ring:** "264 left" (or "12 over") for the chosen preset.
- **Sentence:** "This post counts 16 of 280 characters on X (the emoji counts as 2)."
- **Transparency panel:** X-weighted · graphemes · code points · UTF-16, with "Why the numbers differ".
- **Overflow highlight** from the first grapheme past the limit.
- **Instagram:** caption/bio/comment ring, hashtags n/30, mentions n/20, approximate "…more" cut marker.
- **Thread:** numbered cards, each with its weighted count and Copy.
- **Each preset shows its source link and "checked on <date>"**; unverified presets show "Unverified: check <platform>'s help page".
- Copy text, Clear. Share URL (settings only, never the text).

### 3.6 Tests

- Every worked example above; the docs' "Hello, world! 👋" = 16.
- URL forms: `http`, `https`, `www.`, bare domain, trailing `.` or `)` not included, two URLs.
- ZWJ, skin tones, keycaps, flags, variation selectors.
- NFC: `cafe` + U+0301 = `café` = 4.
- Each weight-range boundary (U+10FF vs U+1100, U+200D vs U+200E, U+201F vs U+2020, U+2037 vs U+2038).
- Thread splitter: suffix counted; no part over the limit; no URL or emoji split; n ≥ 10 changes the suffix length.
- Hashtag and mention counters.
- Presets: `verified:false` entries never feed the BLUF or headline copy.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Twitter Character Counter – X & Instagram Limits` (48; 60 with the suffix: OK) |
| Meta | `Free Twitter (X) character counter. Count a post the way X does (links 23, emoji 2) and check Instagram, Threads, LinkedIn and YouTube limits as you type.` (154) — **changed from the keyword file**, which named bio and Discord limits; both are unverified (§3), so they can't be promised in the meta. Restore Discord once verified. |
| H1 | `Twitter (X) Character Counter: Tweets, Instagram Captions and Bio Limits` |
| BLUF | "Type or paste your post and this Twitter character counter counts it the way X does: 280 characters, every link counts as 23, and each emoji counts as 2. 'Hello, world! 👋' is 16, not 15. Switch to Instagram for the 2,200-character caption limit with hashtag and mention counts." (engine + §3 sources) |
| ToolShell pills | `Counts like X: links 23, emoji 2`, `Instagram caption & hashtag limits`, `Thread splitter with 1/n`, `Limits dated & sourced` |
| Links out | Character Counter (#5), Characters to Words (#2), Word Counter (#6) |
| Links in | #2, #5, Tools hub "Text & Writing" |

## 5. Content (~1,300–1,600 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to count characters for Twitter | 4 tabs, presets | 110 |
| 2 | Twitter (X) character limit | 280, with source + checked date; Premium **only if verified**; one line on 140 → 280 history only if cited (`TODO(owner)`) | 140 |
| 3 | How X counts characters: emoji, links and other languages | Weights, URL = 23, NFC, media 0, reply mentions; worked examples | 220 |
| 4 | Writing a thread | Splitter method, numbering | 130 |
| 5 | Instagram character counter | Caption 2,200, 30 hashtags, 20 @ tags (dated, Meta developer reference); bio/comment only if verified | 170 |
| 6 | Discord, LinkedIn, Threads and YouTube limits | Table from `text-limits.ts`: value, source, checked date; unverified rows flagged | 150 |
| 7 | Why character counters disagree | Graphemes vs code points vs UTF-16 vs weighted | 140 |
| 8 | FAQ | §6 | 360 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. What is the Twitter (X) character limit?
2. How many characters are in a tweet?
3. How does X count emoji, links and mentions?
4. What is the Instagram caption character limit? (2,200; 30 hashtags; 20 @ tags)
5. Do spaces count on X? (yes, weight 1)
6. What is the X Premium post limit? (only if verified; otherwise "check X's help page; it has changed several times")
7. What is the Discord message limit? (only if verified)
8. Why do different counters show different numbers?
9. How do I split a long post into a thread?
10. How much of an Instagram caption shows before "more"? (approximate, undocumented)
11. Do hashtags count toward the limit? (yes, as characters; Instagram also caps the number at 30)

## 7. Done when

- [ ] `x-count-engine.ts` + tests (all fixtures and range boundaries); `npm run verify` passes.
- [ ] `text-limits.ts` entries carry `sourceUrl`, `checkedOn`, `verified`; unverified ones flagged on screen.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`; no platform logos.
- [ ] Registrations + docs; `graphify update .`.
