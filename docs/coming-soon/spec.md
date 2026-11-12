# Coming-soon page — behaviour spec

Source: Figma file `xWvpSkQe0eZdZ27A78wtKc`
- **Design A — "Warm"**: node `1731:30968` (cream, rounded, illustrated icons) — 1440 × 2455
- **Design B — "Clean"**: node `1638:31692` (white, square cards, "Explore →") — 1440 × 2095

Both are the same page (same route `/`), rendered by two switchable designs.
Status of each item: **[Figma]** = taken from the file, **[Proposed]** = not in the file, needs sign-off, **[Question]** = needs a decision.

## Decisions (2026-11-11)
- **Animation:** B's 12 s loop for both designs (Question 4).
- **Card hover = "Coming soon"** (Figma component variants on the Playground page: A "Category" 570:24309 → Variant4, B "Programme category" 1644:31652 → Variant2; Smart Animate ease-out 150 ms, then label/shapes fade in). Hover-capable devices only.
- **Build as drawn:** no other hover/focus states, cards and footer links are plain text, B's Provider CTA stays hidden, Figma inconsistencies kept (Question 6). Sections marked [Proposed] below for states are **not built**.
- **Email form:** native browser validation, honeypot field, plain-text confirmation ("You're on the list. We'll email you when Bloom opens."); works without JavaScript. No Turnstile, consent line or tracking events yet.
- **Responsive:** minimal collapse only (2 columns under 1024px, 1 column under 768px, illustration above the headline on phones) until mobile frames exist.
- A's page background follows the Figma frame: `#FFFBE8` (cards and inputs use `#FFFCEE`).

Code: `packages/designs/src/{warm,clean}` (A, B), shared pieces in `packages/designs/src/shared`. Preview with `/design/warm`, `/design/clean`, `/design/auto`. `SITE_MODE=full` shows the rest of the site.

Units: values below are Figma px. In code: font sizes, spacing and radii become rem (px ÷ 16); borders and hairlines stay px.

---

## 1. Shared foundations

### Font [Figma]
Manrope (Google Fonts, OFL licence), self-hosted via `next/font`. Weights used: 300, 400, 500, 600, 700.
Letter-spacing in Figma is in %, so code uses `em`: −3% = `-0.03em`.

### Colour tokens [Figma]
| Token | A | B |
|---|---|---|
| Page background | `#FFFCEE` (Surface/Cream) | `#FFFFFF` |
| Ink (headings) | `#0E1B34` | `#0E1B33` |
| Muted text | `#4A4D6A` | `#4D5C73` |
| Border | `#0E1B34`, 1.5px | `#DBE3ED`, 1px |
| Accent 1 | `#B4DCF1` (Sky) | `#E8F0FA` (card accent bar) |
| Accent 2 | `#FAEEAE` (Butter) | `#305DAB` (button) / `#144A9C` (links) |
| Brand endorsement | `#004BAD` ("BY LEARNSPACE") | same |

### Content width [Figma]
- A: 1312 content, 64 side margins at 1440. Footer uses 96 side padding.
- B: 1240 content, 100 side margins at 1440.
- Above 1440 [Proposed]: backgrounds stay full-bleed; content stays at its max width, centred.

---

## 2. Sections (top to bottom)

### 2.1 Header
| | A [Figma] | B [Figma] |
|---|---|---|
| Height | 90 (padding 28 / 64) | 84, 1px bottom rule `#DBE3ED` |
| Logo | "Bloom", Manrope Bold 28/34, −2% | "Bloom", Manrope Bold 28, link |
| Background | cream (page) | white |

Behaviour: the logo links to `/` in both designs [Proposed for A; B's Figma marks it as a link]. Header is **not sticky** (static in both files) [Figma].

### 2.2 Hero
| | A [Figma] | B [Figma] |
|---|---|---|
| Top offset | 40 below header | copy at y=67 inside a 366-tall band |
| Headline | Light 68/72, −3%; "bloom" Bold; one block, wraps naturally (780 wide) | Light 96/98, −3%; forced break after "helps"; "bloom" SemiBold |
| Supporting copy | Regular 19/30, muted; mentions additional needs | Regular 17, muted; shorter (no additional-needs sentence) |
| Gap headline → copy | 22 | 25 |
| Illustration | 418 × 275, 24 right of the text block, top-aligned | same artwork, positioned in the band (x 908–1326, y 67–342) |

**Illustration animation [Figma motion data]**
Same artwork and choreography in both: 5 groups (A-block, book, light bulb, robot, music notes) plus 16 smaller parts (sparkles, limbs, motion lines) each with their own loop of translate / rotate / scale and, for the motion lines, opacity 1 ↔ 0.2.
- B: one clean **12 s loop**, all tracks in sync.
- A: **6 s loop, but the export is broken**: every track's later keyframes are squashed into the last 0.04% of the timeline, so the figures make a visible jump at the end of each loop. **[Question 4]**
- Implementation [Proposed]: pure CSS `@keyframes` (no animation library), one keyframe set per animated layer, with the easing Figma specifies (ease-out → ease-in-out → ease-in per segment).
- Reduced motion [Proposed]: with `prefers-reduced-motion: reduce`, nothing moves; the illustration shows its resting pose.
- Off-screen [Proposed]: animation pauses when the hero is scrolled out of view (saves battery on phones).
- The illustration is decorative: `aria-hidden`, no alt text.

### 2.3 "Find a programme by interest" (8 categories)
| | A [Figma] | B [Figma] |
|---|---|---|
| Section head | overline "EXPLORE BY INTEREST" SemiBold 11, +10%; title Medium 30/34; intro Regular 14/21 | title only, Light 56/60, −2% |
| Grid | 4 × 2, cards 310 × 250, gap 24 | 4 × 2, cards 292 × 198, gap 24 |
| Card | cream fill, 1.5px ink border, radius 32, padding 18; ↗ arrow in a 4px-padded pill, top-right; title; examples; 50px icon bottom-left | white, 1px `#DBE3ED` border, radius 6, padding 38/20/8/16; 38 × 5 accent bar `#E8F0FA` at top-left; title; examples; "Explore →" Bold 12 `#144A9C` |
| Title | Medium 22/30, −0.5% (**cards 1–2 are 26px**, see Question 6) | Medium 22/26, −0.5% |
| Examples | Regular 14/21 muted | Regular 13/18 muted |
| Gap above section | 72 | section padding 78 top / 51 bottom |

Category copy is identical across designs except B adds "(STEM)" to the science title.

**Card behaviour** — **[Question 2]**. Nothing exists behind the cards yet.
- Hover / focus [Proposed]:
  - A: the Figma card has a hidden 39px butter-coloured circle (`#FAEEAE`, opacity 0) behind the ↗ arrow — reads as an intended hover fill. On hover/focus: circle fades to full opacity in 200 ms ease-out; cursor pointer.
  - B: border `#DBE3ED` → `#305DAB`, "Explore →" arrow nudges 4px right, 200 ms ease-out.
- Keyboard: each card is one focusable link; visible focus ring 2px offset 2px in the design's ink colour.

### 2.4 Special needs inclusion (4 categories)
| | A [Figma] | B [Figma] |
|---|---|---|
| Container | Sky `#B4DCF1` panel, 1.5px ink border, radius 26, padding 44, gap 28 | no panel; header + grid, 24 above |
| Head | overline "SPECIAL NEEDS INCLUSION"; title "Programmes that welcome and support every child"; intro | title "Special Needs Inclusion" Medium 22/26; intro Regular 13/18 |
| Cards | same card as 2.3 but 300 tall, 4 across, fluid width (287) | same card as 2.3, height follows content (row aligns to the tallest) |
| Note | info icon 20px + "Support information is shared by providers…" in a cream box, 1px ink border, radius 14, padding 14/18 | — (not in B) |

Card order differs: A = Physical, Cognitive & Learning, Sensory, Social/Emotional/Behavioural; B = Physical, Sensory, Cognitive & Learning, Social/Emotional/Behavioural. Built as drawn [Figma].

### 2.5 Email sign-up ("Stay in the loop")
| | A [Figma] | B [Figma] |
|---|---|---|
| Container | Butter `#FAEEAE` panel, 1.5px ink border, radius 26, padding 36/40; text left, form right | no panel; centred copy (Regular 17, 700 wide) + form, gap 40; padding 45 top / 100 bottom |
| Copy | "Stay in the loop" Medium 30/34 + "New inclusive programmes and guides for parents, in your inbox. No spam." | "Swimming in Gbagada, coding in Lekki, piano in Ojodu…" |
| Input | 340 × 50, pill, cream, 1.5px ink border, placeholder "Enter your email" Regular 16/25 | 300 × 52, radius 6, `#F5F7FB` fill, 1px `#DBE3ED`, placeholder "Enter your Email" Regular 14 |
| Button | "Subscribe", ink pill, SemiBold 16, padding 18/32 | "Stay in the loop", `#305DAB`, radius 6, 156 × 52, SemiBold 14 white |

**Behaviour [Proposed — no states are designed]**
1. Field: `type="email"`, `autocomplete="email"`, a visually hidden label "Email address" (the placeholder is not a label).
2. Submit with Enter or the button.
3. Validation on submit (not while typing): empty or invalid → inline message under the field: "Enter a valid email address." The field is not cleared.
4. Submitting: button disabled, label kept, a spinner replaces the label after 300 ms (avoids a flash on fast networks).
5. Success: the form is replaced by "You're on the list. We'll email you when Bloom opens." in the same space (no layout jump). Focus moves to that message for screen readers.
6. Already subscribed: **same success message** (never reveal whether an email is already on the list).
7. Network/server error: "Something went wrong. Please try again." Field keeps its value.
8. Works without JavaScript (plain form post, then the page reloads with the success message).
9. Bot protection: Cloudflare Turnstile in invisible mode + rate limit per IP.
10. Consent: one line under the form, "By subscribing you agree to our Privacy Policy" with a link — required under the NDPA when collecting emails. **[Question 5]**
11. Tracking: `waitlist_submit` and `waitlist_success` events, tagged with the active design (to compare A vs B).
12. B's button has a hidden 0-width `#5270A4` layer inside it — reads as an intended hover "fill sweep". Hover [Proposed]: the darker fill grows left→right across the button in 250 ms ease-out. A's button: hover darkens 8%, 150 ms.

### 2.6 Provider call-to-action (B only, hidden in Figma)
Dark `#0E1B33` band: "Help families discover what you offer." + "Become a Provider" button. **Hidden in the file — not built unless you say so.** [Question 3]

### 2.7 Footer
| | A [Figma] | B [Figma] |
|---|---|---|
| Background | Butter `#FAEEAE`, padding 80 top / 40 bottom / 96 sides, gap 64 | white, 1px top rule `#DBE3ED`, content 1240 wide, padding 57 top / 51 bottom, gap 56 |
| Brand | "Bloom" + "BY LEARNSPACE" (SemiBold 10, +12%, `#004BAD`); tagline Regular 17/26 | same lockup; tagline Regular 14 |
| Columns | TRUST: Privacy, Safeguarding, Disclaimer · PROVIDERS: List your programme, How it works, Contact us (headings SemiBold 11, +10%; links Regular 12; 180 wide, gap 75) | same |
| Bottom | 1px ink rule, then "© 2026 Learn Space Limited. Bloom is a Learnspace product." Regular 13 | 1px `#DBE3ED` rule, same text Regular 12 |

Links are plain text in Figma; none of the destination pages exist yet. **[Question 5]**
Copyright year [Proposed]: generated from the current year, not hard-coded.

---

## 3. Responsive behaviour — **[Question 1]**
Only 1440 desktop frames exist. Most Nigerian visitors will be on phones, so this is the biggest gap. Proposed rules until mobile frames exist:

| Width | Behaviour |
|---|---|
| ≥ 1280 | As designed. Content max width (A 1312 / B 1240), centred. |
| 1024–1279 | Same layout; side margins shrink to 40; grids stay 4 columns with fluid card widths; A cards keep their fixed height. |
| 768–1023 | Categories: 2 columns. Hero: illustration scales to 70% and sits to the right of the text. A's email panel: text above form. Footer: brand on top, columns below. |
| < 768 | Single column throughout; 16 side margins. Hero illustration sits **above** the headline at 280 wide. Categories: 1 column (A cards drop the fixed height; content decides). Email form: input and button full width, stacked. Footer columns side by side (2 × 1). |

Headline sizes use bounded fluid type, e.g. A `clamp(2.5rem, 1.6rem + 3.2vw, 4.25rem)` (40 → 68), B `clamp(3rem, 1.4rem + 5.4vw, 6rem)` (48 → 96). B's forced line break after "helps" only applies ≥ 768.

---

## 4. Which design a visitor sees — **[Question 7]**
No switcher appears in either file. The design system supports a user toggle, a seasonal schedule, or both (cookie `bloom-design`).

---

## 5. Inconsistencies found in the Figma
1. A, interest cards 1 and 2: titles are 26px; cards 3–8 are 22px. [Question 6]
2. A, "Creative & Expressive Arts" uses the same dumbbell icon as "Physical & Athletic". [Question 6]
3. A, the hero animation export glitch at the end of the 6 s loop (see 2.2). [Question 4]
4. "Spiritual & Soulical Development" — "Soulical" is not a standard English word. Confirm it's intended. [Question 6]
5. A, interest card title "Physical & Athletic Development " has a trailing space (harmless; trimmed in code).
6. B, email copy colour is `#55554D` (a legacy warm grey) while every other muted text in B is `#4D5C73`. [Question 6]
7. A, button text colour token `text/inverse` resolves to `#FFFFFF`, but the component's fallback is `#FFFCEE`. Building with `#FFFFFF` (the token) unless told otherwise.
8. B, layer names on the category cards ("Arts & creativity", "Sports & movement"…) don't match their visible text. No visual effect.

---

## 6. Open questions
1. **Mobile:** are there mobile/tablet frames? If not, approve section 3.
2. **Category cards:** nothing exists behind them yet. Options: (a) not clickable until launch; (b) clicking scrolls to the email form and records which category the visitor was interested in (useful demand data); (c) link to placeholder category pages.
3. **Provider CTA (B):** keep hidden, or show? Should "List your programme" let providers sign up early via `/dashboard`?
4. **A's animation:** use B's clean 12 s timing for both, or A at 6 s (B's choreography at double speed, without the glitch)?
5. **Footer links + Privacy:** content for Privacy (required before collecting emails), Safeguarding, Disclaimer, How it works; where "Contact us" goes (email address? form?).
6. **Figma inconsistencies** in section 5, items 1, 2, 4, 6: build as drawn, or fix?
7. **Design selection:** user toggle, seasonal, or a 50/50 split (each visitor keeps theirs via the cookie) to compare sign-up rates between A and B?

### Design toggle (2026-11-12)
- Source: Bloom Figma, section "Bloom temp pages" → "toggle switches — flat emoji" (1847:40899), Toggle 3 / Toggle 4 (pill knob; adjusted copies 1866:32371 / 1866:32385). Replaces the earlier Sky Switch.
- Warm shows the start side (butter `#FAEEAE` track, cream knob, wide eyes); Clean shows the end side (blue-grey `#F0F4FB` track, white knob, grin). 92×36 track with a soft inner shadow, 41×30 knob inset 3, 22px face.
- Clicking slides the knob 45px (350 ms) while track, knob colour and face cross-fade, then posts `design=<next id>` to `setDesign`. Plain form post without JS; reduced motion skips the slide.
- Code: `packages/designs/src/shared/design-toggle/` (`DesignToggle.tsx`, `faces.tsx`, CSS tokens). Pages pass `designSwitcher` to `ComingSoon`; omit it to hide the toggle.

### Figma revision (2026-11-12)
- The original page frames were replaced: B is now 1847:38920, A is now 1847:39911 (both in "Bloom temp pages").
- B: unchanged. A: header fixed at 84px; hero now the same as B's (96/98 headline with a break after "helps", 17px supporting copy 700 wide, artwork at x 988 overhanging the content edge by 30px). The supporting copy is shared (`heroLead` in `shared/content.ts`).

### Shared top (2026-11-12, user request)
- So nothing moves when switching designs, the header and hero are one shared component (`packages/designs/src/shared/masthead/`) placed as design B draws them (content 1240 wide at x 100, logo y 21, headline y 151, artwork x 908) at every breakpoint. Each design supplies only colours (`--ink`, `--muted`, `--masthead-rule`).
- Below the hero both designs use design B's grid and spacing (user request): one shared content column (`shared/layout.module.css`, 1240 wide at x 100), first section at y 528 (78px after the hero), first card row at y 636, footer content on the same column. Warm keeps its own look (cards, panel, colours); only positions follow B. Lower rows differ because Warm's cards are taller.
- Toggle state is derived from the requested design id, because the shared header keeps the same toggle instance across a switch.

## Motion (2026-11-12, user request)

Entrance and scroll motion modelled on the Horizone reference site (timings and feel only; no code or assets taken). Lives in `packages/designs/src/shared/motion/`, used by both designs.

- **Easing:** one curve for everything, `cubic-bezier(0.2, 0.7, 0.15, 1)`.
- **Page load:** logo then toggle drop 12px (0.8s, 40/120ms); headline rises word by word (28px, 1s each, 50ms apart, from 100ms); lead rises 24px (0.9s, from 450ms); illustration fades in and settles from 106% (1.6s).
- **Scroll:** section titles rise word by word; intros follow 100ms later; cards, the special-needs note, sign-up and footer blocks rise 24px (0.9s) as they come into view. Rows move together, no stagger.
- **API:** `intro(kind, className, delay)` and `reveal(kind, className, delay)` return props to spread; `<Words text>` / `<Word index>` split headings. `ScrollReveal` (rendered once in the site layout) and `motionBootScript` (in `<head>`).
- **Guarantees (all tested):**
  - Only opacity, translate and scale animate, so positions are unchanged once animations end (every element identical to before at 1440/1100/800/390, both designs; CLS 0).
  - Switching designs replays nothing: header and hero are kept by React, newly shown elements already on screen appear at once, and each finished animation is retired (`data-revealed="done"`, `data-motion-intro-done`) so a reused element can't restart.
  - Reduced motion: no motion at all. No JS: everything visible. App JS fails to load: motion switches off after 4s and everything shows.
