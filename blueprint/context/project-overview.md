# ya-portal-blocks - Project Overview

<!-- blueprint:source-hash 7aae9120a4b1ec52fd9cb5e0af624904c943466d9f160b71df5b660c4f8a7e8f -->

> A WordPress plugin (block set) that gives Youth Apostles members a single
> "Member Portal" page: formation documents by membership stage, a member
> directory, and the community calendar.

## Problem

Youth Apostles members currently get formation documents, forms, and community
info through scattered channels (email, shared drives, ad hoc links). This
plugin gives logged-in members one page with the documents and actions
relevant to their membership stage, plus a directory and calendar.

## Users

- **Prospective Members** - study guides, application/interview forms for that
  stage
- **Candidates** - candidate packets, schedules, interview forms for that stage
- **Full Members** - ongoing formation docs, sponsor assessments, ministry and
  policy documents
- **Community admins/staff** - assign member stages, manage which documents
  belong to which stage, keep the directory current
- Access tiers: logged-out visitors see nothing; every feature below requires
  a logged-in WordPress member account

## Features

1. **Membership stage roles** - Prospective/Candidate/Full Member WP roles (or
   capability), with an admin way to assign a member's stage. Foundational:
   later document scoping and the directory depend on this.
2. **Formation document library** - custom post type/taxonomy wrapping Media
   Library uploads, storing stage assignment, display title, and type badge
   (PDF/FORM/DOC/AUDIO). Foundational data store for features 3, 5, 6.
3. **Portal hero + search block** - welcome header and search across the
   document library.
4. **Quick actions block** - update contact info, member directory, birthdays
   & anniversaries, request logos (mailto link).
5. **Formation Documents block** (headline feature) - stage-column layout
   (Prospective / Candidate / Full Member) reading from the document library,
   scoped to what the viewer's own stage can see.
6. **Community Documents block** - org-wide document list (contact list,
   stats, statutes, guidelines, branding guide) from the same library.
7. **Community Calendar block** - embedded Google Calendar for
   birthdays/anniversaries/events.
8. **Access control** - gate the portal page/blocks to logged-in members only,
   with a sensible logged-out state.
9. **Member directory page** - full member directory with contact info, built
   on the stage roles from feature 1.

## Data model

No custom database tables. Everything rides on WordPress core tables (users,
usermeta, posts/postmeta, media).

### Member (WP user)

- Native WP user fields (name, email, etc.)
- `stage` (role/capability) - one of `prospective`, `candidate`,
  `full_member`; set via WP roles or a capability, assigned by admins
- Contact info - extends existing WP user fields as needed

### Formation Document (custom post type wrapping Media Library)

- `title` (string) - display title (e.g. "Appendix B - Basics Study Guide")
- `type` (enum) - `pdf` | `form` | `doc` | `audio`, drives the badge shown
- `stage` (enum, nullable) - `prospective` | `candidate` | `full_member`, or
  null for org-wide "Community Documents"
- `attachment` (relationship) - WP Media Library attachment or external form
  URL (forms link out rather than storing a file)

> Lock the `type` and `stage` enums early - the Formation Documents (5) and
> Community Documents (6) blocks both query on them.

## Tech stack

- **WordPress plugin** - `@wordpress/scripts` (Create Block tooling), plain JS
  (no TypeScript configured)
- **PHP** - block render callbacks, WP roles/capabilities, Media Library
  integration
- No external framework, database, or hosting platform beyond WordPress core

## Monetization

Not applicable - internal member tool for an existing organization, not a
commercial product.

## UI/UX

Reference: `references/ya-portal-redesign.html` (static redesign concept) and
`references/youth-apostles-brand-guide-2025.pdf` (brand guide).

- Card-based layout: hero + search, quick-action cards, "Formation Documents"
  with one card-column per stage, two-column "Community" section (community
  documents + calendar)
- Brand palette: navy ink (`#152B5C`), warm off-white background (`#FBFAF7`),
  gold accent (`#998631`), green/red status colors for badges, Montserrat
  typeface
- Document rows show a colored type badge (PDF/FORM/DOC/AUDIO) and a
  download/open icon
- Mobile-responsive: two-column community grid collapses to one column
- Single portal page/view (block-based; no separate app routes) plus the
  member directory (feature 9)

## Deployment

- Target: an existing, already-live WordPress site (self-hosted or managed WP
  host) - no Vercel/Render, no separate app hosting
- Ships as a standard WordPress plugin: `npm run build`, then
  `npm run plugin-zip`, upload/activate on the target site
- No environment variables, workers, or cron jobs
- No dedicated health check path - relies on the host site's own uptime
