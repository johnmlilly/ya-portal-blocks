# Feature: Development block

**From build-plan:** feature 9
**Build attempt:** 1
**Branch:** feature/development-block
**Status:** verified

## Goal

A "Development" (fundraising) section on the member portal: an editable list
of upcoming fundraising events beside the development office contacts
(Fr. Jack Peterson, Tyler Fabian) and Donate / Legacy Giving / Donor Portal
buttons. A non-technical editor maintains everything in the block sidebar.

## Design reference

`references/ya-portal-redesign.html` - the "Development" `<section>` and its
CSS (`.event`, `.date-chip`, `.contact`, `.avatar`, `.btns`, `.btn`,
`.btn-primary`). Two cards side by side (events 1.15fr | contacts .85fr),
stacked below 820px. Tokens from `src/shared/tokens.scss`; card shell from
the `yamp-card` mixin in `src/shared/documents.scss`.

## In scope

- New dynamic block `yamp/development` (server-rendered, like the other
  portal blocks) with two cards:
  - **Events card** - heading (default "Upcoming Events"), event rows: gold
    date chip (month abbr + day), title, time/location line, open arrow when
    linked.
  - **Contacts card** - heading (default "Development Contacts"), contact
    rows: initials avatar, name, title, email (row is a `mailto:` link),
    then a row of small giving buttons, the first styled primary (navy).
- Upcoming-only behavior (user decision): events sort soonest first and an
  event stops showing the day after its date (site timezone).
- Empty state (user decision): no upcoming events shows "No upcoming events.
  Check back soon." inside the events card; contacts card unaffected.
- Sidebar editing for events, contacts, and giving buttons (add, edit,
  move up/down, remove), matching the Quick Actions sidebar pattern.
- Block pattern "Development section": core h3 "Development" + paragraph
  "Support our community’s mission through fundraising events and giving."
  + the block (mirrors the existing Community section pattern).

## Out of scope

- Pulling events from youthapostles.org, Google Calendar, or any API (the
  public /support page has no events; feature 8 owns calendar-API work).
- Online donation processing; buttons only link out.
- Per-contact phone numbers or photos; access control (site handles login).

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"` - pause for
review after each step. `workflow.checkpointCommits: "enabled"` - offer a
checkpoint commit on the feature branch after each approved step.
`/complete` creates the final feature commit.

## Build steps

- [x] 1. **Scaffold the block.** Create `src/development/` (`block.json`,
      `index.js`, `edit.js`, `render.php`, `style.scss`, `editor.scss`)
      following `src/quick-actions/`. Attributes and defaults per Data /
      contracts. `edit.js` renders `ServerSideRender` only (sidebar comes in
      later steps). `render.php` outputs the two-card grid with headings;
      events card shows the empty message; contacts card renders the final
      contact rows and giving buttons from the attribute defaults, so step 3
      only adds sidebar editing. Styles from the mockup, `editorStyle` wrapper fix copied from
      `src/quick-actions/editor.scss`.
      **Done when:** `npm run build` succeeds; in Playground the "Development"
      block inserts, shows both cards matching the mockup (empty-events
      message, two contacts, three buttons), stacks under 820px wide;
      `npm run lint:js` and `npm run lint:css` pass.
- [x] 2. **Events: render rules + sidebar.** `render.php` filters, sorts,
      and renders events per Data / contracts (date chip in a `<time>`
      element, optional link, empty message). `edit.js` adds an "Events"
      sidebar list: Date (`TextControl type="date"`), Title,
      Time & location, Link; help text: "Events without a title or date, or
      whose date has passed, are not shown."
      **Done when:** in Playground, adding three events (one yesterday, one
      today, one next month, entered out of order) shows today's then next
      month's, soonest first, and hides yesterday's; an event with a link
      opens it, one without is not clickable; removing all events shows the
      empty message; lint passes.
- [x] 3. **Contacts + giving buttons sidebar.** `edit.js` adds "Contacts"
      (Name, Title, Email) and "Giving buttons" (Label, Link) sidebar lists
      with add / move / remove. Render rules per Data / contracts (initials,
      invalid email, primary first button, skip incomplete buttons).
      **Done when:** editing a contact's name updates its initials; an
      invalid email renders a non-clickable row with no email line;
      reordering buttons moves the navy style to the new first button; a
      button with an empty label or link disappears; lint passes.
- [x] 4. **Pattern + final pass.** Register `yamp/development-section` in
      `includes/patterns.php` (category `yamp-portal`). Run `npm run format`
      on touched files if needed, `npm run lint:js`, `npm run lint:css`,
      `npm run build`.
      **Done when:** inserting the "Development section" pattern in Playground
      gives the heading, subtitle, and block; keyboard Tab reaches each event
      link, contact, and button with a visible focus ring; all three commands
      pass.

## Files / areas

- New: `src/development/{block.json,index.js,edit.js,render.php,style.scss,editor.scss}`
- Edit: `includes/patterns.php` (new pattern)
- Reuse: `src/shared/tokens.scss`, `yamp-card` mixin in
  `src/shared/documents.scss`, sidebar pattern in `src/quick-actions/edit.js`
- No change needed to `ya-portal-blocks.php`: blocks register from
  `build/blocks-manifest.php` (`--blocks-manifest`), so a new `src/` block
  directory is picked up by `npm run build`.

## Data / contracts

All content is block attributes (no CPT, options, or DB). `block.json`:

| Attribute | Type | Default |
|---|---|---|
| `eventsHeading` | string | `"Upcoming Events"` |
| `events` | array of Event | `[]` (no fabricated events) |
| `contactsHeading` | string | `"Development Contacts"` |
| `contacts` | array of Contact | Fr. Jack Peterson, YA / Director of Mission and Development / development@youthapostles.org; Tyler Fabian / Senior Development Officer / development@youthapostles.org |
| `givingLinks` | array of Link | Donate → `https://www.youthapostles.org/support?form=donate`; Legacy Giving → `https://www.youthapostles.org/waystogive`; Donor Portal → `https://donor.youthapostles.org` |

- **Event** `{ date, title, details, url }` - `date` string `YYYY-MM-DD`
  (from the browser date input); `details` free text ("6:30 PM · Location
  TBD"); `url` optional.
  - Shown only when `title` is non-empty and `date` parses strictly as
    `Y-m-d` (`DateTimeImmutable::createFromFormat('!Y-m-d', …, wp_timezone())`
    and re-formats to the same string) and `date >= today` where today is
    `current_datetime()->format('Y-m-d')` (site timezone). String compare of
    `Y-m-d` values is valid.
  - Sorted ascending by `date`; ties keep entry order (index tiebreak -
    `usort` is not stable before PHP 8, plugin supports 7.4).
  - Chip: month via `wp_date('M', …)` uppercased with `mb_strtoupper`
    (localized month names may be multibyte), day via
    `'j'`, wrapped in `<time datetime="Y-m-d">`. No year shown.
  - `url` through `esc_url`; empty result → non-clickable row, no arrow.
  - Empty `details` → line omitted.
- **Contact** `{ name, title, email }`.
  - Initials: text before the first comma, split on whitespace, drop words
    ending in `.` (e.g. "Fr."), take first letter of first and last
    remaining word, uppercase (`mb_substr`/`mb_strtoupper`); one word → one
    letter; none → no avatar text. Avatar `aria-hidden="true"`.
  - Email: `sanitize_email`, then `is_email`. Valid → whole row is
    `<a href="mailto:…">` (via `esc_url`) and email line shown. Invalid or
    empty → plain `div` row, no email line. Contacts with empty name are
    skipped.
- **Link** `{ label, url }` - skipped when `label` empty or `esc_url(url)`
  empty. First rendered button gets the primary class.
- Uppercasing: WP core polyfills `mb_substr` but not `mb_strtoupper`; use
  `mb_strtoupper` when `function_exists`, else `strtoupper`.
- All text output via `esc_html`; attributes via `esc_attr`/`esc_url`.
  Static SVG only.
- Render-time filtering means a full-page cache can show a past event until
  the cache refreshes; acceptable, no cache handling in this feature.

## Testing

No unit test runner configured (AGENTS.md). Gates per step: `npm run
lint:js`, `npm run lint:css`, `npm run build`, plus the manual Playground
checks in each Done when (`npm run playground` + `npm run start`). No
browser-test command exists; no automated UI evidence will be claimed.

## Notes for the AI

- Follow `src/quick-actions/` structure, comment style, `yamp_` prefixed PHP
  variables, and `__( …, 'ya-portal-blocks' )` strings.
- Keep `ServerSideRender` default import (WP 6.8 support; see comment in
  `src/quick-actions/edit.js`).
- Events grid: `grid-template-columns: 1.15fr .85fr`, one column under
  820px (mockup breakpoint).
- Before `/complete`, check for iCloud "name 2.ext" duplicates.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9208,"specSha256":"c62878d9c84f3438535c574af9f62c299a0eb9862f99eac05ae2223eaa0930a2","branch":"refs/heads/feature/development-block","head":"de654ca691ca95a7438c0d3be5adde258a802cf3","baseRef":"refs/heads/main","baseCommit":"de654ca691ca95a7438c0d3be5adde258a802cf3","sourceTree":"7fdece477485b0ed0434b4ec8b6cb41ea7f14420","absentOptional":[]} -->
