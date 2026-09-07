# TCG Ticker portal and admin — visual design alignment only

Please implement a presentation-only update in this tcg-tracker repository for both:
- Customer portal: https://tcg-ticker.legnalabs.com/portal
- Admin: https://tcg-ticker.legnalabs.com/admin

I love the design of the new Legna Labs TCG Ticker landing page. Bring the portal and admin into that same visual family: colours, typography, text formatting, spacing, surfaces, buttons, forms, tables, imagery and link styling. Refine the writing where it helps clarity, while preserving the exact meaning and all operational information.

## Non-negotiable: preserve every capability and behaviour

This is NOT a functionality change request. No existing functionality may be removed, changed, broken or silently simplified. A visual improvement that introduces a functional regression is not acceptable.

Before editing, inspect this repository, its instructions, the current portal and admin implementations, shared components and existing tests. Establish a baseline inventory of routes, screens, controls, workflows, permissions, state transitions and responsive behaviour that actually exist. Include loading, empty, error, success, disabled and confirmation states. Preserve that inventory throughout the work.

Keep existing business logic, API contracts, request payloads, endpoints, authentication, authorisation, role boundaries, sessions, data models, persistence, validation, calculations, limits, pricing-source behaviour, refresh behaviour, device communication and integrations unchanged. Preserve every existing workflow, including card/device management and administrative operations wherever present. Do not infer or introduce capabilities from the landing-page copy.

Preserve routes, query parameters, deep links, navigation destinations, downloads, external-link destinations, form submissions, event handlers, keyboard interactions, confirmation safeguards and automation/test hooks. Do not rename machine-readable values when refining visible text. Never use colour alone to convey statuses, and preserve distinctions between status, primary actions and destructive actions.

Do not change dependencies, architecture, routing, state management, backend code or database schemas simply to accomplish this redesign. Prefer scoped CSS, design tokens and small presentational component changes. If a desired visual change truly requires a functional change, leave that behaviour intact and report the limitation instead of making the change.

Do not mutate real customer data, pair/reset real devices, execute destructive admin actions, send messages, or trigger external side effects for visual testing. Use the repository's existing test fixtures or an isolated test environment. Report any flows that cannot be safely verified.

## Source of truth for the visual direction

The reference is the NEW landing-page implementation in the LegnaLabs repository, not an older public version and not the other Legna Labs product pages. The full HTML, route CSS, shared base CSS and page script are embedded below as a snapshot. Read them before implementing.

Local reference files, when available:
- /Users/rpiloto/Desktop/LegnaLabs/tcg-ticker/index.html
- /Users/rpiloto/Desktop/LegnaLabs/tcg-ticker/styles.css
- /Users/rpiloto/Desktop/LegnaLabs/css/styles.css
- /Users/rpiloto/Desktop/LegnaLabs/tcg-ticker/page.js
- /Users/rpiloto/Desktop/LegnaLabs/assets/tcg-ticker/

The preview was served at http://localhost:3010/tcg-ticker/; it may need to be started again. Its intended public URL is https://legnalabs.com/tcg-ticker/, but do not assume the new version is deployed there. Do not edit the LegnaLabs reference repository as part of this task.

The product is named **TCG Ticker**. Keep existing identifiers and repository names unchanged.

## Design direction to carry across

- Off-white page background: #f7f5ef.
- Ink text: #202120.
- Primary red: #bf2927; hover: #9f2220.
- Muted body text around #52534e / #555650, secondary text around #62635b.
- Subtle borders: #d9d8d0.
- Secondary surfaces: #eeede5 and #eae7de.
- Dark contrasting surface: #232523, used sparingly where appropriate.
- Visible keyboard focus: #1263bb, with a clear outline and offset.
- System sans-serif typography, confident headings with restrained negative letter spacing, readable body text and occasional small uppercase section labels.
- Solid buttons with modest rounding, restrained image rounding, quiet separators and generous but purposeful spacing.
- Clean, understated presentation. Avoid decorative gradients, excessive cards, heavy shadows and unnecessary animation.

The landing page loads shared CSS first and route-specific CSS second. The final appearance is determined by that cascade. Do not copy the shared site's gold/brown defaults into the applications or paste its entire stylesheet globally. Extract the relevant design language into the applications' existing styling system without causing style leakage.

Adapt the design to the purpose of each interface. The portal should feel friendly and easy to use; the admin should retain efficient information density and scannable operational data. Do not insert a marketing hero, giant product imagery, purchase prompts or landing-page spacing ahead of working controls. Preserve the practical hierarchy, findability and usability of existing functions.

## Typography, writing and formatting

Unify headings, field labels, descriptions, helper text, tables, alerts, empty states, buttons and links. Use concise, calm and specific language consistent with the landing page. This includes writing style and formatting, not only font selection.

You may improve visible microcopy when its meaning is unchanged. Retain all important instructions, technical identifiers that users need, units, source names, numeric precision, validation rules, warning severity and error details. Do not rename established actions in a way that makes them harder to recognise. Preserve translations/localisation conventions wherever present.

Avoid invented claims, features or promises. Do not add urgency, countdowns, promotions, testimonials, subscriptions or upsells. Do not describe market prices as real-time or live. Where a freshness explanation is appropriate, use:

“TCG Ticker checks for updated market data hourly. The source data itself may update less frequently, so prices can remain unchanged between checks.”

Retain existing technical terminology where necessary for actual administrative work; marketing copy must not erase operational meaning.

## Images and links

Use actual product assets only where they improve orientation or identity without crowding the working interface. The prepared originals are at:
/Users/rpiloto/Desktop/Projects/tcg-tracker/listing-assets/etsy-2026-09/

Optimised WebP sizes and the preserved transparent PNG are in:
/Users/rpiloto/Desktop/LegnaLabs/assets/tcg-ticker/

Copy only needed assets into this repository's established asset location; preserve originals. Do not create runtime dependencies on another local checkout. Preserve the product's geometry, colours, screen, texture and appearance. Do not replace useful existing card images, device information or data with decorative product imagery. Use responsive sizing, meaningful alt text and explicit image dimensions.

Restyle existing links consistently while preserving their destinations and actions. Do not add, remove or redirect navigation merely to match the landing page. Preserve safe external-link attributes and accessible new-tab indications where applicable. Do not add Etsy purchase CTAs to operational screens as part of this request.

## Implementation and validation

1. Inspect the reference and both applications; record the functional baseline before editing.
2. Apply a coherent shared visual theme using the current stack and conventions. Keep the changes narrowly presentational.
3. Cover all existing portal and admin screens and interaction states, not only their first viewport. Preserve forms, tables, sorting/filtering/pagination, dialogs and navigation wherever present.
4. Run the repository's existing checks, formatting, build and tests. Compare failures with the baseline; do not weaken assertions or remove tests to make the redesign pass. Add focused regression coverage only where needed to protect interactions touched by markup changes.
5. Start the local application and visually inspect both portal and admin at desktop, tablet and mobile sizes. Check small screens and enlarged text, overflow, clipping, contrast, keyboard navigation, focus visibility, readable forms and accessible controls. Capture screenshots and fix any issues.
6. Verify the baseline workflows remain equivalent, including auth/role boundaries, form behaviour, validation, navigation and critical operations in a safe test environment. Check that changed markup did not detach handlers, break selectors, or alter submitted values. Do not claim complete functional verification if access or test data is missing.
7. Review the final diff specifically for accidental changes to business logic, APIs, stored values, permissions, actions or destinations. Revert any unintended functional changes.
8. Deliver the local preview URLs, screenshots, a concise account of the visual changes and an explicit validation report distinguishing verified behaviour from anything untested. Do not deploy as part of this task.

Acceptance: both applications should clearly belong to the same TCG Ticker design family as the reference, with their existing functionality and operational meaning fully preserved. No functional scope expansion or regression is acceptable.

---

# Embedded reference source — visual reference only

The following files are a complete text snapshot of the landing page and its stylesheet dependencies. They are reference material, not replacements for the portal/admin implementation. Product images remain external binary assets at the paths above.

## tcg-ticker/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TCG Ticker | Pokémon TCG Price Tracker for Your Desk | Legna Labs</title>
<meta name="description" content="Meet TCG Ticker, a Wi-Fi Pokémon card price tracker for your desk. Follow your favourite cards on a round colour display. Handmade, with Cardmarket and TCGplayer pricing. Shop on Etsy.">
<link rel="canonical" href="https://legnalabs.com/tcg-ticker/">
<meta property="og:type" content="product">
<meta property="og:title" content="TCG Ticker — Your favourite cards. At a glance.">
<meta property="og:description" content="A physical Pokémon TCG price tracker made for your desk. Choose your cards online, follow their market prices, and give your collection a little more presence.">
<meta property="og:url" content="https://legnalabs.com/tcg-ticker/">
<meta property="og:site_name" content="Legna Labs">
<meta property="og:image" content="https://legnalabs.com/assets/tcg-ticker/social.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="900">
<meta property="og:image:alt" content="Red, black and off-white TCG Ticker displaying a Pokémon card market estimate on a desk">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TCG Ticker | Pokémon TCG Price Tracker">
<meta name="twitter:description" content="Your favourite cards. At a glance. Meet the Wi-Fi card price display made for collectors.">
<meta name="twitter:image" content="https://legnalabs.com/assets/tcg-ticker/social.jpg">
<meta name="twitter:image:alt" content="TCG Ticker on a desk, showing a card price on its round colour screen">
<link rel="icon" type="image/png" href="/assets/favicon/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png">
<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/tcg-ticker/styles.css">
<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Product", "name": "TCG Ticker", "url": "https://legnalabs.com/tcg-ticker/", "image": ["https://legnalabs.com/assets/tcg-ticker/social.jpg"], "description": "A Wi-Fi-connected desk display for Pokémon TCG collectors. Follow market estimates for up to five cards in rotation on a 1.28-inch round colour screen.", "brand": {"@type": "Brand", "name": "TCG Ticker"}, "material": "3D-printed PLA", "color": "Red, black and off-white", "category": "Trading card price display", "sameAs": "https://3dpiloto.etsy.com/listing/4559016202/pokemon-card-price-tracker-pokemon-tcg"}</script>
<script src="/tcg-ticker/page.js" defer></script>
</head>
<body class="ticker-page">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
<div class="container site-header-inner">
<a href="/" class="brand"><img src="/assets/legna-logo-main.png" alt="" width="60" height="60" class="brand-logo"><div><div class="brand-name">Legna Labs</div><div class="brand-tagline">Unique Solutions for Smart Experiences</div></div></a>
<button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>
<nav class="nav-links" id="site-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/#projects">Projects</a><a href="/#about">About</a><a href="/#contact">Contact</a></nav>
</div></header>
<main id="main">
<section class="ticker-hero container">
<div class="ticker-intro"><p class="eyebrow"><span class="new-label">New</span> A desk companion for collectors</p><h1>TCG Ticker<span>Your favourite cards.<br>At a glance.</span></h1><p class="lede">Keep the cards you care about in sight. A physical, Wi-Fi-connected Pokémon TCG price tracker with a little collector spirit.</p><div class="hero-actions"><a class="ticker-buy" href="https://3dpiloto.etsy.com/listing/4559016202/pokemon-card-price-tracker-pokemon-tcg" target="_blank" rel="noopener noreferrer">Buy now on Etsy <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><a class="text-link" href="#details">See the details <span aria-hidden="true">↓</span></a></div><p class="purchase-note">Shop on Etsy · See current price, availability &amp; delivery</p></div>
<figure class="hero-product"><img src="/assets/tcg-ticker/tcg-ticker-transparent-960.webp" srcset="/assets/tcg-ticker/tcg-ticker-transparent-480.webp 480w, /assets/tcg-ticker/tcg-ticker-transparent-960.webp 960w, /assets/tcg-ticker/tcg-ticker-transparent-1440.webp 1440w" sizes="(max-width: 720px) 92vw, 50vw" width="1302" height="1208" alt="TCG Ticker in red, black and off-white, with a card market price on its round screen" fetchpriority="high"><figcaption>Made for your desk. Inspired by your collection.</figcaption></figure>
</section>
<div class="ticker-spec-strip"><div class="container"><span><strong>1.28″</strong> round colour display</span><span><strong>5 cards</strong> in rotation</span><span><strong>Wi-Fi</strong> connected</span><span><strong>Handmade</strong> PLA enclosure</span></div></div>
<section id="details" class="ticker-section container split"><div class="photo"><img src="/assets/tcg-ticker/04-display-detail-960.webp" srcset="/assets/tcg-ticker/04-display-detail-480.webp 480w, /assets/tcg-ticker/04-display-detail-960.webp 960w, /assets/tcg-ticker/04-display-detail-1440.webp 1440w" sizes="(max-width: 720px) 92vw, 50vw" width="1445" height="1088" alt="Close-up of the TCG Ticker screen displaying card information and a market estimate" loading="lazy" decoding="async"></div><div><p class="eyebrow">Small screen. Collector essentials.</p><h2>A little window into<br>your collection.</h2><p>From your latest pull to the card on your wishlist, keep an eye on market estimates without opening another tab.</p><dl class="feature-rows"><div><dt>Know the card</dt><dd>Card name, set, collector number and finish.</dd></div><div><dt>Follow the price</dt><dd>Market price in your chosen currency, with price variation when supported by the selected pricing source.</dd></div><div><dt>Keep your favourites in view</dt><dd>Up to five selected cards rotate on the round colour screen.</dd></div></dl><p class="small">Images show example card prices, not current valuations.</p></div></section>
<section class="setup-section"><div class="container ticker-section"><p class="eyebrow">From unboxing to your first card</p><h2>Plug in. Pick cards. Enjoy the view.</h2><ol class="steps"><li><span class="step-number">01</span><h3>Get connected</h3><p>Power your ticker with the included USB-C cable. Follow the printed guide to connect it to 2.4 GHz Wi-Fi.</p></li><li><span class="step-number">02</span><h3>Make it yours</h3><p>Use your device code card and the online customer portal to select the cards you want to follow.</p></li><li><span class="step-number">03</span><h3>Give it a spot</h3><p>Place it on your desk or collector shelf. Your chosen cards appear in rotation, with hourly market-data checks.</p></li></ol></div></section>
<section class="ticker-section container split portal-section"><div><p class="eyebrow">Your cards. Your preferences.</p><h2>A collection worth<br>keeping close.</h2><p>Manage your selection through a customer-friendly online portal. Save up to ten cards, then choose up to five for the display rotation.</p><p>Follow prices from <strong>Cardmarket or TCGplayer</strong> and choose a currency including <strong>EUR, USD or GBP</strong>. When an exact price is unavailable, the ticker supports fallback pricing.</p><p class="small">Pricing coverage and price variation depend on the selected source and card.</p><a class="ticker-buy" href="https://3dpiloto.etsy.com/listing/4559016202/pokemon-card-price-tracker-pokemon-tcg" target="_blank" rel="noopener noreferrer">Buy now on Etsy <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></div><figure class="photo"><img src="/assets/tcg-ticker/05-usd-display-960.webp" srcset="/assets/tcg-ticker/05-usd-display-480.webp 480w, /assets/tcg-ticker/05-usd-display-960.webp 960w, /assets/tcg-ticker/05-usd-display-1440.webp 1440w" sizes="(max-width: 720px) 92vw, 50vw" width="1448" height="1086" alt="TCG Ticker showing a card market price in USD" loading="lazy" decoding="async"><figcaption>Your favourite cards, in a currency that suits you.</figcaption></figure></section>
<section class="lifestyle"><div class="container split"><div class="lifestyle-image"><img src="/assets/tcg-ticker/06-collector-shelf-lifestyle-960.webp" srcset="/assets/tcg-ticker/06-collector-shelf-lifestyle-480.webp 480w, /assets/tcg-ticker/06-collector-shelf-lifestyle-960.webp 960w, /assets/tcg-ticker/06-collector-shelf-lifestyle-1440.webp 1440w" sizes="(max-width: 720px) 92vw, 50vw" width="1445" height="1088" alt="TCG Ticker displayed on a shelf beside a trading card collection" loading="lazy" decoding="async"></div><div class="lifestyle-copy"><p class="eyebrow">A place in your everyday</p><h2>For the desk.<br>For the shelf.<br>For the collector.</h2><p>A compact, Poké Ball-inspired enclosure brings a familiar splash of red to your setup. A thoughtful Pokémon collector gift, or a small treat for your own collection.</p><a href="#in-the-box" class="text-link">Meet the physical details <span aria-hidden="true">↓</span></a></div></div></section>
<section id="in-the-box" class="ticker-section container split"><div><p class="eyebrow">A small object with character</p><h2>Handmade.<br>Ready for your setup.</h2><p>The red, black and off-white enclosure is 3D-printed in PLA. Its visible print texture is part of the handmade finish.</p><dl class="specs"><div><dt>Size</dt><dd>Approx. 10 cm / 3.9 inches in diameter</dd></div><div><dt>Screen</dt><dd>1.28-inch round colour display</dd></div><div><dt>Connection</dt><dd>2.4 GHz Wi-Fi</dd></div><div><dt>In the box</dt><dd>TCG Ticker, USB-C cable, printed setup guide and device code card</dd></div></dl></div><div class="photo"><img src="/assets/tcg-ticker/02-primary-bright-studio-960.webp" srcset="/assets/tcg-ticker/02-primary-bright-studio-480.webp 480w, /assets/tcg-ticker/02-primary-bright-studio-960.webp 960w, /assets/tcg-ticker/02-primary-bright-studio-1440.webp 1440w" sizes="(max-width: 720px) 92vw, 50vw" width="1448" height="1086" alt="Handmade TCG Ticker with a textured PLA enclosure on a wooden surface" loading="lazy" decoding="async"></div></section>
<section class="faq-section container"><p class="eyebrow">A few things to know</p><h2>Before you make it yours.</h2><details open><summary>How fresh are the prices?</summary><p>TCG Ticker checks for updated market data hourly. The source data itself may update less frequently, so prices can remain unchanged between checks.</p></details><details><summary>Will the price match my exact card or listing?</summary><p>Displayed prices are market estimates and may differ from individual listings or completed sales because of condition, language, seller location, shipping and market changes. Fallback pricing may be used when an exact price is unavailable.</p></details><details><summary>How many cards can I follow?</summary><p>Save up to ten cards in the online customer portal and display up to five cards in rotation on your TCG Ticker.</p></details><details><summary>What do I need to set it up?</summary><p>A USB power source, a 2.4 GHz Wi-Fi network and access to the online customer portal. A USB-C cable, printed setup guide and device code card are included.</p></details><details><summary>Where do I buy it and check delivery?</summary><p>Order through the Etsy listing. It has the current price, available quantities, delivery estimates and shop policies. <a class="ticker-buy" href="https://3dpiloto.etsy.com/listing/4559016202/pokemon-card-price-tracker-pokemon-tcg" target="_blank" rel="noopener noreferrer">Buy now on Etsy <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></p></details></section>
<section class="final-section"><div class="container"><p class="eyebrow">Your next desk companion</p><h2>Give your favourite cards<br>a place in your day.</h2><p>Meet TCG Ticker on Etsy.</p><a class="ticker-buy" href="https://3dpiloto.etsy.com/listing/4559016202/pokemon-card-price-tracker-pokemon-tcg" target="_blank" rel="noopener noreferrer">Buy now on Etsy <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><p class="purchase-note">Current pricing, availability and any shop offers are shown on Etsy.</p></div></section>
<aside class="data-note container" aria-label="Pricing information"><strong>About market prices</strong><p>TCG Ticker checks for updated market data hourly. The source data itself may update less frequently, so prices can remain unchanged between checks.</p><p>Displayed prices are market estimates and may differ from individual listings or completed sales because of condition, language, seller location, shipping and market changes.</p></aside>
</main><footer class="site-footer"><div class="container"><div class="footer-inner"><div>© <span id="year">2026</span> Legna Labs. All rights reserved.</div><div class="footer-links"><a href="/#projects">All projects</a><a href="mailto:support@legnalabs.com">Contact</a></div></div><p class="trademark">This is an independently designed product. It is not manufactured, licensed, sponsored or endorsed by Nintendo, The Pokémon Company, Game Freak or Creatures Inc. Pokémon and related names and marks belong to their respective owners.</p></div></footer>
</body></html>
```

## tcg-ticker/styles.css

```css
/* Product identity is scoped to this route; studio styles remain shared. */
.ticker-page { --ticker-red: #bf2927; --ticker-ink: #202120; background: #f7f5ef; color: var(--ticker-ink); }
.ticker-page .container { max-width: 1200px; padding-inline: 28px; }
.ticker-page .site-header { background: #f7f5eff5; border-color: #deddd6; }
.ticker-page .brand { text-decoration: none; color: inherit; margin-left: 0; }
.ticker-page .brand-name { color: var(--ticker-ink); }
.ticker-page a:focus-visible, .ticker-page button:focus-visible, .ticker-page summary:focus-visible { outline: 3px solid #1263bb; outline-offset: 5px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.skip-link { position: fixed; top: -100px; left: 20px; z-index: 100; padding: 10px 20px; background: white; color: #202120; }
.skip-link:focus { top: 10px; }
.ticker-hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 35px; padding-block: 58px 48px; }
.eyebrow { text-transform: uppercase; letter-spacing: .14em; font-size: .75rem; font-weight: 700; margin: 0 0 22px; }
.new-label { display: inline-block; background: var(--ticker-red); color: white; padding: 4px 8px; margin-right: 8px; border-radius: 3px; }
.ticker-page h1 { margin: 0; font-size: 1.1rem; font-weight: 650; }
.ticker-page h1 > span { display: block; font-size: clamp(2.3rem, 4.2vw, 3.5rem); font-weight: 750; letter-spacing: -.055em; line-height: 1.08; margin-top: 15px; }
.lede { max-width: 455px; font-size: 1.1rem; line-height: 1.7; margin: 24px 0; color: #52534e; }
.ticker-buy { display: inline-flex; gap: 25px; align-items: center; justify-content: center; padding: 14px 23px; min-height: 50px; border-radius: 5px; background: var(--ticker-red); color: #fff; font-size: 1rem; font-weight: 650; text-decoration: none; }
.ticker-buy:hover { background: #9f2220; }
.text-link { color: inherit; font-size: .9rem; font-weight: 650; text-underline-offset: 5px; }
.purchase-note { font-size: .8rem; color: #5e5f58; margin-top: 15px; }
.ticker-page figure { margin: 0; }
.hero-product { text-align: center; }
.hero-product img { display: block; width: 100%; height: auto; max-height: 490px; object-fit: contain; }
.ticker-page figcaption { font-size: .8rem; color: #61625c; margin-top: 12px; }
.ticker-spec-strip { border-block: 1px solid #d9d8d0; }
.ticker-spec-strip > div { display: flex; justify-content: space-between; gap: 20px; padding-block: 23px; font-size: .9rem; }
.ticker-spec-strip strong { margin-right: 5px; }
.ticker-section { padding-block: 88px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
.ticker-page h2 { font-size: clamp(1.9rem, 3vw, 2.65rem); letter-spacing: -.045em; line-height: 1.14; margin: 0 0 23px; }
.ticker-page h3 { font-size: 1.2rem; letter-spacing: -.02em; margin: 14px 0 8px; }
.ticker-page p { line-height: 1.7; }
.photo img, .lifestyle-image img { display: block; width: 100%; height: auto; border-radius: 8px; }
.feature-rows { margin-top: 28px; }
.feature-rows > div { border-top: 1px solid #d9d8d0; padding: 15px 0; }
.feature-rows dt { font-weight: 650; }
.feature-rows dd { margin: 4px 0 0; color: #555650; }
.small { color: #62635b; font-size: .875rem; }
.setup-section { background: #eeede5; }
.steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 48px; list-style: none; padding: 15px 0 0; margin-bottom: 0; }
.step-number { color: var(--ticker-red); font-size: .875rem; font-weight: 700; }
.steps p { margin: 0; color: #555650; }
.portal-section .ticker-buy { margin-top: 12px; }
.lifestyle { background: #232523; color: #fff; padding-block: 55px; }
.lifestyle-copy p { color: #dedfd8; }
.lifestyle-copy .eyebrow { color: #ddd0a7; }
.specs > div { display: grid; grid-template-columns: 100px 1fr; gap: 20px; border-top: 1px solid #d9d8d0; padding: 13px 0; }
.specs dt { font-weight: 650; }
.specs dd { margin: 0; color: #555650; }
.faq-section { padding-bottom: 85px; }
.faq-section details { border-bottom: 1px solid #d9d8d0; padding: 19px 0; }
.faq-section summary { cursor: pointer; font-weight: 650; padding-right: 15px; }
.faq-section details p { max-width: 850px; color: #555650; margin-bottom: 0; }
.faq-section .ticker-buy { margin-top: 15px; }
.final-section { text-align: center; background: #eae7de; padding: 64px 0; }
.data-note { padding-block: 38px; font-size: .875rem; color: #5c5d56; }
.data-note p { margin: 8px 0; }
.ticker-page .site-footer { margin: 0; background: #f0eee7; border-top: 1px solid #d9d8d0; }
.trademark { font-size: .8rem; color: #5c5d56; padding-bottom: 16px; max-width: 980px; }
section[id] { scroll-margin-top: 110px; }
@media (max-width: 900px) { .split { gap: 32px; } .ticker-spec-strip > div { flex-wrap: wrap; justify-content: center; } .steps { gap: 25px; } }
@media (max-width: 720px) {
 .ticker-page .container { padding-inline: 22px; }
 .ticker-page .brand-logo { width: 42px; height: 42px; }
 .ticker-page .brand-tagline { display: none; }
 .ticker-page .site-header-inner { min-height: 70px; }
 .ticker-page .nav-links { background: #f7f5ef; }
 .ticker-hero { grid-template-columns: 1fr; gap: 22px; padding-block: 28px 25px; }
 .ticker-intro { display: contents; }
 .ticker-hero .eyebrow { margin-bottom: -8px; font-size: .68rem; }
 .ticker-page h1 > span { font-size: clamp(2.05rem, 8vw, 3rem); margin-top: 7px; }
 .hero-product { grid-row: 3; }
 .hero-product img { max-height: 265px; }
 .hero-product figcaption { display: none; }
 .lede { margin: 0; font-size: 1rem; line-height: 1.5; }
 .ticker-hero .purchase-note { margin: -10px 0 0; }
 .ticker-spec-strip > div { display: grid; grid-template-columns: 1fr 1fr; font-size: .8rem; gap: 15px; }
 .ticker-spec-strip strong { display: block; }
 .split { grid-template-columns: 1fr; gap: 30px; }
 .ticker-section { padding-block: 50px; }
 .steps { grid-template-columns: 1fr; gap: 28px; }
 .steps li { padding-left: 44px; position: relative; }
 .step-number { position: absolute; left: 0; top: 17px; }
 .lifestyle { padding-block: 28px 42px; }
 .faq-section { padding-bottom: 50px; }
 .ticker-page .footer-inner { align-items: flex-start; }
 .ticker-page .footer-links { flex-wrap: wrap; }
}
@media (max-width: 720px) and (max-height: 740px) {
 .ticker-hero { gap: 16px; padding-top: 20px; }
 .hero-product img { max-height: 185px; }
 .ticker-hero .eyebrow { margin-bottom: 0; }
 .ticker-hero .purchase-note { margin-top: -5px; }
}

```

## css/styles.css

```css
/* ===== Base ===== */
*,
*::before,
*::after {
    box-sizing: border-box;
}

:root {
    --legna-gold: #f5a623;
    --legna-gold-soft: #ffd68a;
    --legna-brown: #5c3b1a;
    --legna-text: #2d1a0c;
    --legna-bg: #fff7e9;
    --legna-accent: #2bb3b1;
    --legna-card: #ffffff;
    --legna-border: #f2e2c9;
    --legna-radius-lg: 18px;
    --legna-radius-md: 10px;
    --legna-shadow-soft: 0 14px 30px rgba(0, 0, 0, 0.08);
}

html,
body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
        "Segoe UI", sans-serif;
    background: radial-gradient(circle at top, #fffdf6 0, var(--legna-bg) 50%, #fbeed9 100%);
    color: var(--legna-text);
}

body {
    line-height: 1.6;
    min-height: 100vh;
    /* ⬅ add this */
    display: flex;
    /* ⬅ add this */
    flex-direction: column;
    /* ⬅ add this */
}

/* ===== Layout helpers ===== */
.container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}

/* ===== Header / Nav ===== */
.site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(12px);
    background: rgba(255, 247, 233, 0.92);
    border-bottom: 1px solid rgba(242, 226, 201, 0.8);
}

.site-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 10px;
}

.brand-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.brand-name {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--legna-brown);
}

.brand-tagline {
    font-size: 0.8rem;
    color: rgba(45, 26, 12, 0.7);
}

.nav-links {
    display: flex;
    gap: 18px;
    font-size: 0.95rem;
}

.nav-links a {
    text-decoration: none;
    color: rgba(45, 26, 12, 0.8);
    padding: 6px 10px;
    border-radius: 999px;
    transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.nav-links a:hover {
    background: rgba(245, 166, 35, 0.12);
    color: var(--legna-brown);
    transform: translateY(-1px);
}

/* ===== Hero ===== */
.hero {
    padding: 60px 0 40px;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;              /* optional */
  align-items: start;  /* optional */
}

.hero-kicker {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.8rem;
    color: rgba(92, 59, 26, 0.7);
    margin-bottom: 10px;
}

.hero-title {
    font-size: clamp(2.2rem, 4vw, 2.9rem);
    line-height: 1.12;
    color: var(--legna-brown);
    margin-bottom: 12px;
}

.hero-highlight {
    background: linear-gradient(90deg, var(--legna-gold), var(--legna-accent));
    -webkit-background-clip: text;
    color: transparent;
}

.hero-text {
    font-size: 1rem;
    color: rgba(45, 26, 12, 0.8);
    margin-bottom: 22px;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    border-radius: 999px;
    border: none;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.1s ease, box-shadow 0.15s ease, background 0.2s ease,
        color 0.2s ease;
}

.btn-primary {
    background: linear-gradient(135deg, var(--legna-gold), var(--legna-gold-soft));
    color: #3b2a1a;
    box-shadow: 0 12px 24px rgba(245, 166, 35, 0.33);
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 30px rgba(245, 166, 35, 0.4);
}

.btn-ghost {
    background: transparent;
    color: var(--legna-brown);
    border: 1px dashed rgba(92, 59, 26, 0.4);
}

.btn-ghost:hover {
    background: rgba(255, 255, 255, 0.7);
}

.hero-meta {
    margin-top: 16px;
    font-size: 0.85rem;
    color: rgba(45, 26, 12, 0.7);
}

.hero-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.hero-badge {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(43, 179, 177, 0.3);
    color: rgba(45, 26, 12, 0.8);
    background: rgba(255, 255, 255, 0.9);
}

.hero-logo-card {
    justify-self: center;
    background: radial-gradient(circle at top, #fff 0, #ffe9c1 80%);
    border-radius: 26px;
    padding: 28px 26px;
    box-shadow: var(--legna-shadow-soft);
    text-align: center;
    max-width: 280px;
}

.hero-logo-card img {
    width: 140px;
    height: 140px;
    object-fit: contain;
    margin-bottom: 10px;
}

.hero-logo-name {
    font-weight: 700;
    color: var(--legna-brown);
    margin-bottom: 4px;
}

.hero-logo-tagline {
    font-size: 0.85rem;
    color: rgba(45, 26, 12, 0.7);
}

/* ===== Sections ===== */
.section {
    padding: 30px 0 50px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
    gap: 12px;
}

.section-title {
    font-size: 1.5rem;
    color: var(--legna-brown);
}

.section-subtitle {
    font-size: 0.9rem;
    color: rgba(45, 26, 12, 0.75);
}

.hero-subtitle {
    font-size: 1.1rem;
    line-height: 1.5;
    color: rgba(45, 26, 12, 0.9);
    margin: 0.4rem 0 0.9rem;
}

/* ===== Project cards ===== */
.projects-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.3fr);
    gap: 20px;
}

@media (max-width: 880px) {
    .hero-inner {
        display: block;
    }

    .hero-logo-card {
        order: -1;
    }

    .projects-grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .hero-inner>div {
        max-width: 720px;
        /* controls line length */
        margin: 0 auto;
        /* centers the hero content */
    }
}

.cta-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 14px 0 10px;
}

.cta-pill {
    font-size: 0.78rem;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.12);
    color: rgba(45, 26, 12, 0.85);
    border: 1px solid rgba(245, 166, 35, 0.35);
}

.project-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: var(--legna-radius-lg);
    padding: 18px 18px 16px;
    border: 1px solid var(--legna-border);
    box-shadow: var(--legna-shadow-soft);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
}

.project-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.project-chip {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(43, 179, 177, 0.1);
    color: rgba(45, 26, 12, 0.85);
}

.project-title-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
}

.project-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--legna-brown);
}

.project-tagline {
    font-size: 0.85rem;
    color: rgba(45, 26, 12, 0.65);
}

.project-description {
    margin-top: 8px;
    font-size: 0.9rem;
    color: rgba(45, 26, 12, 0.8);
}

.project-footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    font-size: 0.8rem;
}

.pill-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    padding: 6px 11px;
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.12);
    color: var(--legna-brown);
    text-decoration: none;
}

.pill-link span {
    font-size: 1rem;
}

/* smaller supporting project card */
.project-card-secondary {
    background: rgba(255, 255, 255, 0.85);
    border-radius: var(--legna-radius-lg);
    padding: 16px;
    border: 1px dashed rgba(92, 59, 26, 0.25);
    font-size: 0.88rem;
}

/* ===== Footer ===== */
.site-footer {
    border-top: 1px solid rgba(242, 226, 201, 0.8);
    padding: 18px 0 24px;
    font-size: 0.8rem;
    color: rgba(45, 26, 12, 0.7);
}

.footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.footer-links {
    display: flex;
    gap: 12px;
}

.footer-links a {
    color: rgba(45, 26, 12, 0.8);
    text-decoration: none;
}

/* ===== Product page specific ===== */
.hero.product-hero {
    padding-top: 40px;
}

.product-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
    gap: 30px;
}

@media (max-width: 880px) {
    .product-layout {
        grid-template-columns: minmax(0, 1fr);
    }
}

.product-card {
    background: rgba(255, 255, 255, 0.97);
    border-radius: 20px;
    padding: 20px 20px 18px;
    border: 1px solid var(--legna-border);
    box-shadow: var(--legna-shadow-soft);
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    font-size: 0.75rem;
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.14);
    color: var(--legna-brown);
    margin-bottom: 10px;
}

.feature-list {
    list-style: none;
    padding-left: 0;
    margin: 10px 0 4px;
}

.feature-list li {
    margin-bottom: 6px;
    padding-left: 18px;
    position: relative;
    font-size: 0.9rem;
}

.feature-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--legna-gold);
}

.product-gallery-column {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
}

.phone-frame {
    position: relative;
    width: 280px;
    max-width: 100%;
    aspect-ratio: 9 / 19.5;
    border-radius: 32px;
    padding: 10px;
    background: #1b120c;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
    overflow: hidden;
}


.phone-screen {
    position: absolute;
    inset: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    object-fit: contain;
    background: #000;
    border-radius: inherit;
    display: none;
    opacity: 0;
    transform: translateX(0);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.phone-screen.is-active {
    display: block;
    opacity: 1;
    transform: translateX(0);
}


.phone-nav {
    position: absolute;
    inset-inline: 18px;
    bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
}

.product-gallery-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* center everything including dots */
}

.phone-dots-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 12px;
}

.phone-dots {
    display: flex;
    gap: 8px;
}

.phone-nav button {
    pointer-events: auto;
    border: none;
    border-radius: 999px;
    padding: 6px 9px;
    font-size: 0.8rem;
    background: rgba(0, 0, 0, 0.55);
    color: #fdf5e6;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.phone-dots {
    position: static;
    margin-top: 14px;
    display: flex;
    justify-content: center;
    gap: 6px;
    pointer-events: auto;
    transform: none;
    left: auto;
    bottom: auto;
}

.phone-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.12);
    border: none;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7);
    transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.phone-dot.is-active {
    background: rgba(0, 0, 0, 0.55);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
    transform: scale(1.2);
}

.store-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
}

/* specific style for the Google Play badge */
.store-btn-google {
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
}

.store-btn-google img {
    display: block;
    height: 60px;
    /* adjust if you want it bigger/smaller */
    width: auto;
}

.product-meta {
    max-width: 900px;
    /* you can change to 100% if you want full width */
    margin: 40px 0 0;
    /* no auto centering, aligns with container padding */
    text-align: left;
    /* keep text left-aligned */
    /* no padding-left here – let .container handle the 20px left padding */
}

.product-meta-title {
    margin: 0 0 10px;
    font-size: 1.3rem;
    color: var(--legna-brown);
    text-align: left;
    /* ⬅ ensure title is left aligned */
}

.product-meta p {
    font-size: 0.95rem;
    margin-bottom: 8px;
    color: rgba(45, 26, 12, 0.85);
}

.hero-text {
    font-size: 1.15rem;
    line-height: 1.7;
    color: rgba(45, 26, 12, 0.85);
    margin: 1.25rem 0 1.25rem;
    max-width: none;
    width: 100%;
}

.hero-subtext {
    font-size: 1.05rem;
    line-height: 1.7;
    color: rgba(45, 26, 12, 0.75);
    margin: 1.25rem 0 1.25rem;
    max-width: none;
    width: 100%;
}

.store-btn {
    margin-top: 12px;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
}

.store-btn span {
    font-size: 1.1rem;
}

.policy-links-inline {
    margin-top: 14px;
    font-size: 0.85rem;
}

.policy-links-inline a {
    color: var(--legna-brown);
    text-decoration: none;
}

.cxradar-form {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
}

.cxradar-form input[type="email"] {
    min-width: 240px;
    flex: 1;
    max-width: 420px;
    border: 1px solid var(--legna-border);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 0.92rem;
    color: var(--legna-text);
    background: #fff;
}

.cxradar-form input[type="email"]:focus {
    outline: 2px solid rgba(43, 179, 177, 0.35);
    outline-offset: 1px;
}

.cxradar-msg {
    font-size: 0.84rem;
    margin: 8px 0 0;
    min-height: 1.1rem;
}

.value-points {
    margin: 0 0 10px;
    padding-left: 18px;
}

.value-points li {
    margin-bottom: 7px;
    font-size: 0.92rem;
    color: rgba(45, 26, 12, 0.88);
}

.trust-note {
    margin: 4px 0 14px;
    font-size: 0.86rem;
    color: rgba(45, 26, 12, 0.74);
}

.trust-note a {
    color: var(--legna-brown);
}

/* ===== Legal pages ===== */
.legal-page {
    padding: 40px 0 50px;
}

.legal-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid var(--legna-border);
    box-shadow: var(--legna-shadow-soft);
    padding: 22px 22px 18px;
}

.legal-title {
    font-size: 1.6rem;
    color: var(--legna-brown);
    margin-bottom: 10px;
}

.legal-meta {
    font-size: 0.85rem;
    color: rgba(45, 26, 12, 0.7);
    margin-bottom: 16px;
}

.reel-page-hero {
    padding-bottom: 56px;
}

.reel-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 28px;
    align-items: start;
}

.reel-page-copy {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.reel-form-card,
.reel-result-shell,
.reel-seo-card,
.reel-mycookbook-card {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid var(--legna-border);
    box-shadow: var(--legna-shadow-soft);
    border-radius: 24px;
}

.reel-form-card {
    padding: 24px;
}

.reel-input-label {
    display: block;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--legna-brown);
    margin-bottom: 10px;
}

.reel-url-input {
    width: 100%;
    padding: 15px 16px;
    border-radius: 16px;
    border: 1px solid rgba(92, 59, 26, 0.18);
    font-size: 1rem;
    color: var(--legna-text);
    background: #fffef9;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.reel-url-input:focus {
    outline: none;
    border-color: rgba(43, 179, 177, 0.8);
    box-shadow: 0 0 0 4px rgba(43, 179, 177, 0.14);
}

.reel-inline-note,
.reel-inline-error,
.reel-status-message,
.reel-rate-note,
.reel-draft-note,
.reel-captcha-note {
    margin: 10px 0 0;
    font-size: 0.9rem;
}

.reel-inline-note,
.reel-rate-note,
.reel-draft-note,
.reel-captcha-note {
    color: rgba(45, 26, 12, 0.72);
}

.reel-captcha-shell {
    margin-top: 14px;
    padding: 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(92, 59, 26, 0.08);
}

.reel-captcha-container {
    min-height: 65px;
}

.reel-inline-error,
.reel-status-message[data-state="error"] {
    color: #9a3412;
}

.reel-status-message {
    min-height: 1.3rem;
    color: rgba(45, 26, 12, 0.82);
}

.reel-submit-btn,
.reel-app-btn {
    width: 100%;
    min-height: 52px;
    font-size: 1rem;
    margin-top: 16px;
}

.reel-submit-btn:disabled {
    opacity: 0.7;
    cursor: progress;
}

.reel-page-aside {
    min-width: 0;
}

.reel-result-shell {
    padding: 22px;
    position: sticky;
    top: 92px;
    background:
        radial-gradient(circle at top right, rgba(43, 179, 177, 0.16), transparent 32%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 249, 239, 0.98));
}

.reel-result-empty h2,
.reel-result-card h2,
.reel-section-block h3 {
    margin-top: 0;
    color: var(--legna-brown);
}

.reel-result-card {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.reel-result-top {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.reel-result-label {
    margin: 0 0 6px;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(92, 59, 26, 0.62);
}

.reel-result-title {
    margin-bottom: 0;
    font-size: clamp(1.6rem, 2vw, 2rem);
}

.reel-meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.reel-meta-item {
    padding: 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(92, 59, 26, 0.1);
}

.reel-meta-item span {
    display: block;
    font-size: 0.78rem;
    color: rgba(45, 26, 12, 0.65);
    margin-bottom: 4px;
}

.reel-meta-item strong {
    color: var(--legna-brown);
    font-size: 0.98rem;
}

.reel-section-block {
    padding: 18px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(92, 59, 26, 0.08);
}

.reel-section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.reel-copy-btn {
    padding: 8px 12px;
    font-size: 0.85rem;
}

.reel-list,
.reel-token-list {
    margin: 0;
    padding-left: 18px;
}

.reel-list li,
.reel-token-list li {
    margin-bottom: 9px;
    color: rgba(45, 26, 12, 0.88);
}

.reel-list-ordered {
    padding-left: 0;
    list-style: none;
}

.reel-token-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-left: 0;
    list-style: none;
}

.reel-token-list li {
    margin-bottom: 0;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.12);
    border: 1px solid rgba(245, 166, 35, 0.24);
}

.reel-warning-list li {
    background: rgba(154, 52, 18, 0.08);
    border-color: rgba(154, 52, 18, 0.15);
}

.reel-cta-card {
    margin-top: 18px;
}

.reel-promo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-top: 16px;
}

@media (max-width: 960px) {
    .reel-layout {
        grid-template-columns: minmax(0, 1fr);
    }

    .reel-result-shell {
        position: static;
        top: auto;
    }
}

@media (max-width: 640px) {
    .reel-form-card,
    .reel-result-shell {
        padding: 18px;
        border-radius: 20px;
    }

    .reel-meta-grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .reel-section-heading {
        flex-direction: column;
        align-items: stretch;
    }

    .reel-promo-actions {
        flex-direction: column;
        align-items: stretch;
    }
}

.legal-card h2 {
    font-size: 1.05rem;
    margin-top: 18px;
    margin-bottom: 8px;
    color: var(--legna-brown);
}

.legal-card p {
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem 3rem;
    align-items: start;
}

.team-member {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.team-photo {
    width: 80px;
    height: 80px;
    background: #f4e9dd;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #c59555;
}

.team-name {
    font-size: 1.15rem;
    font-weight: 600;
}

.team-role {
    font-size: 0.95rem;
    color: rgba(45, 26, 12, 0.75);
    margin: 0.25rem 0;
}

.team-links a {
    font-size: 0.95rem;
    color: #c59555;
    margin-right: 1rem;
    text-decoration: none;
}

@media (max-width: 700px) {
    .team-grid {
        grid-template-columns: 1fr;
        /* stacks vertically on mobile */
    }

    .brand-tagline {
        display: none;
    }
}

main {
    flex: 1;
    /* ⬅ makes main take remaining height and pushes footer down */
}

/* Hamburger button (desktop: hidden) */
.nav-toggle {
    display: none;
    border: none;
    background: none;
    padding: 6px;
    margin-left: auto;
    margin-right: 10px;
    /* NEW — push left slightly */
    cursor: pointer;
}

.nav-toggle span {
    display: block;
    width: 20px;
    height: 2px;
    border-radius: 999px;
    background: rgba(45, 26, 12, 0.85);

    +span {
        margin-top: 4px;
    }
}

/* Mobile nav */
@media (max-width: 720px) {
    .site-header-inner {
        gap: 8px;
    }

    .nav-toggle {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .nav-links {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        padding: 10px 20px 14px;
        background: rgba(255, 247, 233, 0.98);
        border-bottom: 1px solid rgba(242, 226, 201, 0.9);
        display: none;
        /* hidden by default */
        flex-direction: column;
        gap: 6px;
    }

    .nav-links a {
        padding: 8px 10px;
        border-radius: 10px;
    }

    .nav-links.is-open {
        display: flex;
        /* shown when toggled */
    }
}

/* HAMBURGER → X ANIMATION */
.nav-toggle.is-open span:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
}

.nav-toggle.is-open span:nth-child(2) {
    opacity: 0;
}

.nav-toggle.is-open span:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
}

/* Smooth animation */
.nav-toggle span {
    transition: transform 0.25s ease, opacity 0.25s ease;
}
@media (max-width: 880px) {
    .hero-inner {
        display: block;
        padding: 40px 0;        /* reduce vertical spacing */
    }

    .hero-inner > div {
        max-width: 700px;       /* controls readable width */
        margin: 0 auto;         /* center the text */
        padding: 0 10px;        /* prevent touching edges */
    }

}

```

## tcg-ticker/page.js

```javascript
"use strict";

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.classList.toggle("is-open", open);
  nav.classList.toggle("is-open", open);
}
toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
window.matchMedia("(min-width: 721px)").addEventListener("change", () => setMenu(false));
document.querySelector("#year").textContent = new Date().getFullYear();

```
