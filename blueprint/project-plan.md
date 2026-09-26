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
a set of WordPress blocks so logged-in members land on one page with the
documents and actions relevant to their membership stage, a member directory,
and the community calendar.

## 2. Users - Who is this for?

- **Prospective Members** - early in discernment, need study guides and
  application/interview forms for that stage
- **Candidates** - in formation, need candidate packets, schedules, interview
  forms for that stage
- **Full Members** - need ongoing formation docs, sponsor assessments,
  ministry/policy documents
- **Community admins/staff** - manage which documents belong to which stage,
  keep the member directory and contact info current

## 3. Features - What does the MVP need?

- Document search across all portal documents
- Quick actions: update contact info, full member directory, birthdays &
  anniversaries, request logo files (mailto link)
- Formation Documents section, split into stage columns (Prospective /
  Candidate / Full Member), each listing documents tagged PDF, FORM, DOC, or
  AUDIO with a download/open action
- Community Documents section (org-wide docs: contact list, membership stats,
  statutes, guidelines, branding guide)
- Community Calendar (Google Calendar embed for birthdays/anniversaries/events)
- Access limited to logged-in members; document visibility scoped by the
  viewer's membership stage where applicable

## 4. Data - What are we storing?

- **Members**: WordPress users, membership stage tracked via WP user
  role/capability (Prospective / Candidate / Full Member), plus profile
  contact info (existing WP user fields, extended as needed)
- **Documents**: stored in the WordPress Media Library; each document needs
  metadata for stage (if formation-specific), display title, and type badge
  (PDF/FORM/DOC/AUDIO) - likely a custom taxonomy or post type wrapping media
  attachments rather than raw media library entries alone
- **Community events**: not stored locally - sourced from an embedded Google
  Calendar
- No custom database tables anticipated for MVP; relies on WP core tables
  (users, usermeta, posts/postmeta, media)

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
