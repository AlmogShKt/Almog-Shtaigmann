# Almog Shtaigmann — UI/UX Style Brief

## Product intent

The site presents Almog as a versatile Software Engineer whose work spans
product interfaces, APIs, data workflows, automation, testing, and engineering
systems. The portfolio and teaching areas share one identity while serving
different reading modes:

- Portfolio pages are concise, evidence-led, and outcome focused.
- Teaching pages are structured for scanning, reading, and returning later.
- English pages use LTR layout; Hebrew pages use native RTL layout.

## Visual direction

The design combines a warm, human editorial character with the clarity of a
modern product system.

- Display typography: Playfair Display for major narrative headings.
- Interface typography: DM Sans, with Rubik available for Hebrew.
- Primary identity: deep forest.
- Accent: restrained terracotta for emphasis and interaction.
- Surfaces: warm paper in light mode and layered forest-charcoal in dark mode.
- Decoration is secondary to content hierarchy and evidence.

## Semantic color contract

Components must use semantic variables from `assets/css/site-2026.css`. Feature
code must not introduce unrelated gradients or isolated brand colors.

| Token | Purpose |
| --- | --- |
| `--site-paper` | Page background |
| `--site-surface` | Alternate section background |
| `--site-card` | Cards, menus, and elevated controls |
| `--site-ink` | Primary text |
| `--site-copy` | Secondary text |
| `--site-strong` | Primary actions and high-emphasis sections |
| `--site-on-strong` | Text displayed on strong surfaces |
| `--site-accent` | Hover, focus, selected states, and selective emphasis |
| `--site-on-accent` | Accessible text and icon color on accent surfaces |
| `--site-line` | Dividers, borders, and inactive structure |

Light and dark themes redefine these tokens. Components do not contain separate
light/dark color rules unless a genuine contrast exception is required.

## Interaction hierarchy

### Primary action

- Solid `--site-strong` background.
- `--site-on-strong` text.
- One primary action per action group.
- Hover uses `--site-accent` or a subtle two-pixel lift—not a new gradient.

### Secondary action

- Transparent or card background.
- One-pixel `--site-line` or `--site-strong` border.
- Primary text color.

### Cards

- Card surface and neutral border by default.
- Accent border plus restrained shadow on hover/focus.
- The complete card is clickable when it represents one destination.
- Card headings describe the destination; generic “read more” text is secondary.

### Course promotion

- Use one compact editorial panel rather than a generic advertising billboard.
- Lead with the learner outcome, followed by a short description of the course scope.
- Show the current course brand and one clear destination button.
- Keep the panel responsive, bilingual where useful, and visually consistent with both themes.

## Theme behavior

- First visit follows the operating-system color preference.
- The header exposes a Light/Dark theme control.
- A manual choice is stored locally and reused across pages.
- The early theme initializer prevents a light-to-dark flash during navigation.
- Both themes meet the same hierarchy, focus, and interaction rules.

## Accessibility

- Visible three-pixel focus rings use the accent color.
- Interactive targets are at least 44 pixels high where practical.
- Content never depends on animation to become visible.
- Reduced-motion preferences disable nonessential transitions and animations.
- Text and controls retain readable contrast in both themes.
- Skip links and semantic landmarks support keyboard and screen-reader navigation.

## RTL and Hebrew

- Hebrew documents declare `lang="he"` and `dir="rtl"`.
- Layout uses logical properties such as `margin-inline` and `border-inline`.
- Components mirror naturally without duplicating the entire stylesheet.
- Code, URLs, and technical English fragments may opt into LTR locally.
- Rubik is the preferred Hebrew interface font.

## GitHub Pages constraints

- Public filenames and page locations remain stable.
- Internal assets use repository-safe relative paths.
- Root-relative `/assets/...` links are prohibited for this project site.
- `scripts/check-site-links.mjs` validates pages, images, stylesheets, scripts,
  CSS assets, and scripted navigation before changes reach `main`.

## Migration rule

Legacy CSS may remain temporarily for page-specific layout, but the shared
theme layer owns colors, buttons, cards, focus states, typography hierarchy,
and theme behavior. Legacy gradients and animated promotional buttons must not
override the semantic component system.
