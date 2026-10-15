# Project Plan

> One of the two planning docs you provide. Use as much detail as the project
> needs, including rationale, constraints, examples, edge cases, and explicit
> exclusions that should guide later feature work. Draft it directly, develop it
> through any AI conversation, or optionally run `/discovery` for a guided deep
> planning session. The content is always yours to direct. When it is filled in,
> run `/overview` to generate the project overview from this plus `build-plan.md`.

## 1. Problem - What problem are we solving?

Youth Apostles (a lay community/formation organization) members currently get
formation documents, forms, and community info through scattered channels
(email, shared drives, ad hoc links). This plugin builds a "Member Portal" as
a set of WordPress blocks so logged-in members land on one page with formation
documents, community documents, quick actions, a member directory, and the
community calendar - all editable directly in the WordPress page editor by a
non-technical site admin, no custom database or dashboard screen required.

## 2. Users - Who is this for?

- **Members** (Prospective, Candidate, or Full Member - the portal shows the
  same full set of formation documents to any logged-in member; there is no
  per-stage hiding in v1) - need study guides, packets, schedules, interview
  forms, and ongoing formation/policy documents
- **Community admins/staff** - a non-technical site editor who drops the
  blocks onto the portal page and adds/updates documents, links, and the
  calendar directly in the WordPress page editor - no separate admin screen,
  no code changes, no database of documents to manage

## 3. Features - What does the MVP need?

- Document search: the hero search box live-filters the portal page in the
  browser. For now it matches document rows (Formation and Community
  Documents) and Development events by title; non-matching rows hide as you
  type and clearing the box restores them. No server search, no editor
  settings
- Featured section above the quick actions: one spotlight item (tag, title,
  short text, button) beside a short list of featured items (tag, title,
  detail line, optional link) for time-sensitive highlights such as the
  Ministry Impact Survey, the annual auction, prayer campaigns, and community
  news. Tags come from a fixed set: Event, Survey, Prayer, News
- Quick actions: an editable, reorderable row of link cards (icon, label,
  description, link), starting with update contact info, full member
  directory, birthdays & anniversaries, and request logo files (mailto link)
- Formation Documents section: a flexible set of stage columns (starting with
  Prospective / Candidate / Full Member, each with its own icon and heading;
  columns can be added, removed, and reordered), each an editable list of
  documents (title + type + link), plus an optional "For All Members" list
  above the columns for general documents relevant to every member. The site
  editor fills it in directly in the block; links can be pasted or picked
  from the Media Library. Visible to every logged-in member
- Community Documents section (org-wide docs: contact list, membership stats,
  statutes, guidelines, branding guide), same editable-list pattern
- Community Calendar (Google Calendar embed; the calendar's URL/ID is a field
  on the block itself, editable in the page editor)
- Development (fundraising) section: an editable list of upcoming
  fundraising events (date, title, time/location, optional link) that sort
  soonest first and hide the day after their date, beside the development
  office contacts (Fr. Jack Peterson, YA and Tyler Fabian, both
  development@youthapostles.org) and Donate / Legacy Giving / Donor Portal
  buttons
- Access limited to logged-in members, enforced by the existing site's own
  login requirement, not by this plugin (no per-stage visibility restriction)

## 4. Data - What are we storing?

- No database of documents and no membership-stage roles. Every block's
  content (document rows, calendar URL, quick-action links) is a WordPress
  block attribute: it lives in the portal page's own content, typed in
  directly through the block editor, the same way you'd edit a paragraph of
  text on any WordPress page
- **Members**: plain WordPress users - no custom role or stage field. The
  member directory (feature 7) uses WordPress's built-in user list and
  profile fields (name, email) as-is
- **Community events**: not stored locally - sourced from an embedded Google
  Calendar
- **Fundraising events, development contacts, giving links**: Development
  block attributes (event: date `YYYY-MM-DD`, title, details, url; contact:
  name, title, email; link: label, url)
- **Featured items**: Featured block attributes (spotlight: tag, title, text,
  button label, url; list item: tag, title, detail, url). `tag` is one of
  `event`, `survey`, `prayer`, `news`
- No custom database tables, custom post types, or taxonomies anywhere in the
  plan; everything rides on WordPress core (users, posts/postmeta for the
  portal page itself)

## 5. Tech - What stack are we using?

- WordPress plugin, blocks built with `@wordpress/scripts` (Create Block
  tooling), plain JS (no TypeScript configured)
- PHP for block render callbacks, WP roles/capabilities, and Media Library
  integration
- No external framework, database, or hosting platform beyond WordPress core

## 6. Monetize - How will this make money?

Not applicable - internal member tool for an existing organization, not a
commercial product.

## 7. UI/UX - How should this look and feel?

Reference: `references/ya-portal-redesign.html` (static redesign concept) and
`references/youth-apostles-brand-guide-2025.pdf` (brand guide - colors,
typography, logo usage).

- Clean, card-based layout: hero + search, a row of quick-action cards, a
  "Formation Documents" section with a full-width all-members card above one
  card-column per stage, a two-column
  "Community" section (community documents + calendar), and a two-column
  "Development" section (events + contacts and giving buttons)
- "Featured" section between the hero and the quick actions: a white
  spotlight card with a gold left accent and a small navy button, beside a
  list card of tagged rows. Tag colors: Event and Survey gold, Prayer green,
  News light navy
- Brand palette from the redesign concept: navy ink (`#152B5C`), warm off-white
  background (`#FBFAF7`), gold accent (`#998631`), green/red status colors for
  badges, Montserrat typeface
- Document rows show a colored type icon tile, the title, a matching type
  badge (PDF/FORM/DOC/AUDIO, same color pair as the tile), and an open arrow
  when linked; this row design is shared by every document block
- Mobile-responsive (two-column community grid collapses to one column)

## 8. Deployment - Where and how will this ship?

- Target: an existing, already-live WordPress site (self-hosted or managed WP
  host) - not Vercel/Render, no separate app hosting
- Ships as a standard WordPress plugin: build with `npm run build`, package
  with `npm run plugin-zip`, upload/activate on the target site
- No environment variables, workers, or cron jobs anticipated for MVP
- No dedicated health check path (relies on the host WordPress site's own
  uptime)
