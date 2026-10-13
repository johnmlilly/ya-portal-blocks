# ya-portal-blocks - Project Overview

<!-- blueprint:source-hash c95e87430b34592675325ad5c352280abbb0cbcb9b1ba28fc7007d1dba4752aa -->

> A WordPress plugin (block set) that gives Youth Apostles members a single
> "Member Portal" page: formation documents, community documents, quick
> actions, a member directory, and the community calendar - all editable
> directly in the WordPress page editor, no custom database or admin screen.

## Problem

Youth Apostles members currently get formation documents, forms, and community
info through scattered channels (email, shared drives, ad hoc links). This
plugin gives logged-in members one page with everything in one place, and lets
a non-technical site admin manage the content by editing the portal page
itself - no code changes, no separate dashboard screen.

## Users

- **Members** - any logged-in member (Prospective, Candidate, or Full Member)
  sees the same full portal: formation documents for all three stages,
  community documents, quick actions, the calendar, and the directory. There
  is no per-stage hiding in v1.
- **Community admins/staff** - a non-technical site editor. Adds and updates
  documents, links, and the calendar by editing the block's own fields
  directly on the portal page in WordPress - the same way they'd edit any
  paragraph of text on a WordPress page.
- Access tiers: logged-out visitors see nothing; every feature below requires
  a logged-in WordPress account.

## Features

Every block owns its real, final content as editable block attributes filled
in through the WordPress page editor. No custom post type, database, or
membership-stage roles anywhere in this plan.

1. **Portal hero + search block** - welcome header and a document search
   field (decorative for now - no backing data source to search across yet).
2. **Quick actions block** - editable, reorderable link cards, starting with
   update contact info, member directory, birthdays & anniversaries, request
   logos (mailto link).
3. **Formation Documents block** (headline feature) - flexible stage columns
   (default Prospective / Candidate / Full Member; add, remove, reorder) plus
   an optional "For All Members" list above them, each an editable list of
   documents (title + type + link), same for every viewer.
4. **Community Documents block** - org-wide editable document list (contact
   list, stats, statutes, guidelines, branding guide).
5. **Community Calendar block** - embedded Google Calendar; the calendar
   URL/ID is a field on the block, editable in the page editor.
6. **Access control** - gate the portal page/blocks to logged-in members
   only, with a sensible logged-out state.
7. **Member directory page** - member directory built on WordPress's own
   user list and profile fields (no custom stage/role data).
8. **Upcoming events list (future release)** - branded "Today & upcoming"
   list from the Google Calendar API (server-side, cached, API key as a
   never-output block field). Blocked on team API access; until then a
   Community Calendar block in Google's agenda mode fills the role.

## Data model

No custom database tables, post types, or taxonomies. Every block's content
lives as **block attributes** stored in the portal page's own post content -
exactly like a paragraph or image block's settings - edited live in the
WordPress block editor.

### Document row (repeated attribute shape, used by blocks 3 and 4)

- `title` (string) - display title (e.g. "Appendix B - Basics Study Guide")
- `type` (enum) - `pdf` | `form` | `doc` | `audio`, drives the icon tile and
  badge (one shared color pair per type); unknown values render as `pdf`
- `url` (string) - link to the file (picked from the WordPress Media Library)
  or any pasted URL; empty renders a non-clickable row

Shared implementation: `includes/document-list.php` (renderer),
`src/shared/documents.scss` (styles), `src/shared/document-list-control.js`
(sidebar editor).

> Lock this shape early - the Formation Documents (3) and Community Documents
> (4) blocks both repeat it per row, and it's the one contract worth keeping
> consistent between the two blocks.

### Member (WP user)

- Native WordPress user fields only (name, email, etc.) - no custom stage or
  role field.

## Tech stack

- **WordPress plugin** - `@wordpress/scripts` (Create Block tooling), plain JS
  (no TypeScript configured)
- **PHP** - block render callbacks and Media Library integration
- No external framework, database, custom post types, or hosting platform
  beyond WordPress core

## Monetization

Not applicable - internal member tool for an existing organization, not a
commercial product.

## UI/UX

Reference: `references/ya-portal-redesign.html` (static redesign concept) and
`references/youth-apostles-brand-guide-2025.pdf` (brand guide).

- Card-based layout: hero + search, quick-action cards, "Formation Documents"
  with a full-width all-members card above one card-column per stage,
  two-column "Community" section (community
  documents + calendar)
- Brand palette: navy ink (`#152B5C`), warm off-white background (`#FBFAF7`),
  gold accent (`#998631`), green/red status colors for badges, Montserrat
  typeface
- Document rows show a colored type icon tile, the title, a matching type
  badge (PDF/FORM/DOC/AUDIO), and an open arrow when linked
- Mobile-responsive: two-column community grid collapses to one column
- Single portal page/view (block-based; no separate app routes) plus the
  member directory (feature 7)

## Deployment

- Target: an existing, already-live WordPress site (self-hosted or managed WP
  host) - no Vercel/Render, no separate app hosting
- Ships as a standard WordPress plugin: `npm run build`, then
  `npm run plugin-zip`, upload/activate on the target site
- No environment variables, workers, or cron jobs
- No dedicated health check path - relies on the host site's own uptime
