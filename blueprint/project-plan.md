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

- Document search across the documents on the page (decorative for v1 - no
  backing data source yet, may become a simple client-side filter later)
- Quick actions: update contact info, full member directory, birthdays &
  anniversaries, request logo files (mailto link)
- Formation Documents section, three columns (Prospective / Candidate / Full
  Member), each an editable list of documents (PDF/FORM/DOC/AUDIO badge +
  title + link) that the site editor fills in directly in the block, visible
  to every logged-in member
- Community Documents section (org-wide docs: contact list, membership stats,
  statutes, guidelines, branding guide), same editable-list pattern
- Community Calendar (Google Calendar embed; the calendar's URL/ID is a field
  on the block itself, editable in the page editor)
- Access limited to logged-in members (no per-stage visibility restriction)

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
  "Formation Documents" section with one card-column per stage, a two-column
  "Community" section (community documents + calendar)
- Brand palette from the redesign concept: navy ink (`#152B5C`), warm off-white
  background (`#FBFAF7`), gold accent (`#998631`), green/red status colors for
  badges, Montserrat typeface
- Document rows show a colored type badge (PDF/FORM/DOC/AUDIO) and a
  download/open icon
- Mobile-responsive (two-column community grid collapses to one column)

## 8. Deployment - Where and how will this ship?

- Target: an existing, already-live WordPress site (self-hosted or managed WP
  host) - not Vercel/Render, no separate app hosting
- Ships as a standard WordPress plugin: build with `npm run build`, package
  with `npm run plugin-zip`, upload/activate on the target site
- No environment variables, workers, or cron jobs anticipated for MVP
- No dedicated health check path (relies on the host WordPress site's own
  uptime)
