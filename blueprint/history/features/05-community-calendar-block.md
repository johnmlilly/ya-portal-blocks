# Feature: Community Calendar block

**From build-plan:** feature 5
**Build attempt:** 1
**Branch:** feature/community-calendar-block
**Status:** verified

## Goal

Ship the Community Calendar card: an embedded calendar (today a public Google
Calendar with birthdays, anniversaries, and events) that every logged-in
member sees, with the calendar source as a field on the block that a
non-technical admin fills in from the page editor. The admin can paste a
Google calendar ID, any embed URL, or a whole `<iframe>` embed code. Any
website's embed is allowed (user decision: the calendar may move away from
Google later). The block also takes its
place in the "Community section" pattern's 2/3 column, replacing the
placeholder from feature 4.

## Design reference

`references/ya-portal-redesign.html`, the "Community" `<section>` (lines
137-160): the right `.card` with a calendar icon + "Community Calendar" `<h4>`
and the embed area (`.cal`, a placeholder there). The card uses the shared
`yamp-card` mixin from feature 4 so it matches the Community Documents card
beside it.

## In scope

- New block `yamp/community-calendar` under `src/community-calendar/`,
  following the existing block layout
- Card with a fixed calendar icon, editable heading (default "Community
  Calendar"), and an `<iframe>` embed
- A PHP helper that turns the admin's input into an embed URL, accepting a
  Google calendar ID, any `http`/`https` URL, or full `<iframe>` code; other
  input (including `javascript:` and `data:` URLs) is rejected
- Editable embed height
- Sidebar editing: heading, calendar source, height
- Editor-only notices for "not set up yet" and "couldn't read that calendar";
  nothing renders on the live page in either case
- Update the "Community section" pattern to use this block in the 2/3 column

## Out of scope

- iCal feeds or building a calendar UI; Google Calendar API access or event
  data in WordPress
- Private-calendar handling (the calendar is public)
- Choosing display options in the sidebar (month/week/agenda, colors); admins
  who want them paste an embed URL that already includes them
- The reference's "Need logo files?" note under the calendar (removed by user
  decision; not built)
- Access control / logged-out state (feature 6)

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"` - pause for review
after each step. `workflow.checkpointCommits: "enabled"` - offer a checkpoint
commit once a step is approved.

## Build steps

- [x] 1. **Embed URL helper, block scaffold, markup, and styles**
      - New `includes/calendar.php` (required once from `ya-portal-blocks.php`
        with the other includes) defining `yamp_calendar_embed_url( $input )`
        per Data / contracts: returns a safe embed URL string, or `''` for
        empty or rejected input.
      - `src/community-calendar/block.json`: `name`
        `yamp/community-calendar`, `title` "Community Calendar", `icon`
        `calendar-alt`, `category` `widgets`, `supports.html: false`, file
        entries like the other blocks, attributes `heading`, `calendar`,
        `height` (see Data / contracts).
      - `index.js` (copy), `edit.js` (`useBlockProps` + `ServerSideRender`
        with `attributes`, same import note as the other blocks).
      - `render.php`: compute the URL with the helper. If it is `''`: on the
        live page output nothing; in the editor preview
        (`wp_is_serving_rest_request()`, same approach as Formation
        Documents' all-members card) output the card with a muted notice,
        "Add your calendar in the block settings." when `calendar` is
        empty, or "Couldn't read that calendar. Paste an embed link
        (starting with https://), the full embed code, or a Google calendar
        ID." when it was rejected. Otherwise output the card (wrapper via
        `get_block_wrapper_attributes()` around an inner `.yamp-card`, head
        with the calendar icon and `<h4>` heading, head omitted when the
        heading is empty) and an `<iframe>` with `src` (`esc_url`), `title`
        (heading, or "Community Calendar" when empty; `esc_attr`),
        `loading="lazy"`, `height` from the clamped attribute, width 100%,
        no border.
      - `style.scss`: `@include yamp-card("yamp-card")`; the iframe area with
        a little inner padding and rounded corners; `height: 100%` on the
        card like Community Documents. `editor.scss`: nested-wrapper reset.
      **Done when:** `npm run build` emits `build/community-calendar/` and the
      manifest lists five blocks; `lint-js`, `lint-style`, and `php -l` on the
      touched PHP pass; a CLI smoke test of `yamp_calendar_embed_url()` covers
      every accepted and rejected input listed in Data / contracts; a CLI
      smoke render covers the live-page empty and rejected cases (no output),
      the editor notices, heading escaping, and height clamping. Manual: with
      a calendar ID set via the code editor, Playground shows the calendar
      inside the card.

- [x] 2. **Sidebar editing**
      - `edit.js`: `InspectorControls` with one `PanelBody` ("Calendar",
        open) containing a Heading `TextControl` (help: "Leave empty to hide
        the heading."), a Calendar `TextareaControl` (help: "Paste an embed
        link or the full embed code from any calendar site, or a Google
        calendar ID (Google Calendar: Settings, then your calendar, then
        Integrate calendar)."), and a Height
        `RangeControl` (300 to 1200, step 50).
      - The Calendar value is stored exactly as typed (trimming on every
        keystroke would eat spaces while typing embed code); the server
        trims and validates it. The preview shows the notice when it can't
        be read.
      **Done when:** build, `lint-js`, `lint-style` pass. Manual: pasting each
      of the three accepted forms (Google ID, an embed URL, embed code) shows
      the embed in the preview; pasting
      junk shows the "Couldn't read" notice; height changes the preview;
      values persist after save and reload; the live page shows nothing while
      the field is empty.

- [x] 3. **Use the block in the "Community section" pattern**
      - `includes/patterns.php`: replace the 2/3 column's placeholder
        paragraph with `<!-- wp:yamp/community-calendar /-->`; update the
        pattern docblock.
      **Done when:** `php -l` passes; in the editor the pattern's blocks
      all parse as valid (via `wp.blocks.parse` on the registered pattern
      content, or a manual insert); inserting it gives Community Documents
      (1/3) beside Community Calendar (2/3).

## Files / areas

- `includes/calendar.php` - new; `ya-portal-blocks.php` - `require_once` it
- `src/community-calendar/block.json`, `index.js`, `edit.js`, `render.php`,
  `style.scss`, `editor.scss` - new
- `includes/patterns.php` - swap the placeholder for the block
- Reused unchanged: `src/shared/tokens.scss`, `src/shared/documents.scss`
  (`yamp-card` mixin)

## Data / contracts

- Block name `yamp/community-calendar` (stable).
- Attributes:
  - `heading`: string, default `"Community Calendar"`; empty hides the head.
  - `calendar`: string, default `""`; the admin's raw input as typed
    (trimmed by the helper). Never
    output directly; only the helper's result reaches the page.
  - `height`: number, default `600`; clamped to 300-1200 at render.
- `yamp_calendar_embed_url( $input )` (string in, string out):
  - Empty after trim: `''`.
  - Input containing `<iframe`: take the `src="..."` value (HTML entities
    decoded) and continue with it as a URL; no `src`: `''`.
  - URL: decode HTML entities first (URLs copied out of embed code often
    contain `&amp;`), then accept any absolute `http://` or `https://` URL
    with a host
    (checked with `wp_parse_url()`); return it unchanged so query options
    survive. Any other scheme (`javascript:`, `data:`, relative paths): `''`.
    Note: browsers block `http://` embeds on an `https://` site, so the
    sidebar help points admins to `https://` links.
  - Otherwise treat it as a calendar ID: accept only if it matches
    `^[A-Za-z0-9._%+#-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$` (Google calendar IDs
    are email-shaped, e.g. `name@gmail.com` or
    `abc123@group.calendar.google.com`, or Google's holiday calendars such
    as `en.usa#holiday@group.v.calendar.google.com`); return
    `https://calendar.google.com/calendar/embed?src=<rawurlencoded ID>`, plus
    `&ctz=<rawurlencoded timezone>` when `wp_timezone_string()` is an IANA
    name (contains `/`). Anything else: `''`.
- The helper plus `esc_url()` on the `src` attribute are the only gates;
  nothing else from `calendar` is printed. Allowing any site means anyone who
  can add this block can embed any website in it. For Administrators and
  Editors that matches what WordPress already allows (raw HTML); Authors and
  Contributors, whose iframes WordPress normally strips, gain it too.
  Accepted as is by user decision during review (only trusted staff edit
  this site); revisit if less-trusted roles get editing access.
- Iframe: no `sandbox` attribute (calendar embeds such as Google's need
  scripts, popups, and their own origin to work).

## Testing

No test runner is configured, so no automated test gate. Per step: `npm run
build`, `npx wp-scripts lint-js src`, `npx wp-scripts lint-style
"src/**/*.scss"`, `php -l` on touched PHP. Step 1 adds CLI smoke tests (scratch
only) for the helper with stubbed `wp_timezone_string()` and for
`render.php` with stubbed escaping. Visual and editor behavior is a manual
Playground or live-site check; no browser evidence is claimed.

## Notes for the AI

- Mirror the other blocks' file style, comments, `yamp_` prefixes, and the
  default `ServerSideRender` import note.
- Never print `calendar` or any part of it except the helper's validated URL.
- No em dashes in copy.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9880,"specSha256":"da114cc603775d229a3f1158157dc363d57c53a73efcf81b988706f7fdf436a4","branch":"refs/heads/feature/community-calendar-block","head":"3b247e9507069dc906e229d952e2516aa994e8c0","baseRef":"refs/heads/main","baseCommit":"3b247e9507069dc906e229d952e2516aa994e8c0","sourceTree":"fd397a2970be96746f81ce1ffef19654f11514e5","absentOptional":[]} -->
