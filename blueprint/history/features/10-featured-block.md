# Feature: Featured block

**From build-plan:** feature 10
**Build attempt:** 1
**Branch:** feature/featured-block
**Status:** verified

## Goal

A "Featured" section above Quick Actions that highlights time-sensitive
items (Ministry Impact Survey, the auction, prayer campaigns, community news):
one spotlight item beside a short list of tagged items, all edited by content
editors in the block sidebar like the other portal blocks.

## Design reference

`references/ya-portal-redesign.html`, the "Featured" `<section>` and its CSS
(`.feat-grid`, `.tag`, `.t-event`/`.t-survey`/`.t-prayer`/`.t-news`,
`.spotlight`, `.btn-light`, `.feat-list`, `.feat-row`). Spotlight: white card,
4px gold left border, navy title, muted text, small navy button. List: white
card, tagged rows with dividers. Grid 1.3fr | 1fr, one column under 820px.
Tokens from `src/shared/tokens.scss`, card shell from the `yamp-card` mixin in
`src/shared/documents.scss`.

## In scope

- New dynamic block `yamp/featured` (server-rendered like the other blocks):
  - **Spotlight card:** tag icon, title, text, button. The whole card is one
    link when it has a usable URL.
  - **List card:** rows with a tag icon, title, detail line, and an open
    arrow when linked.
- Fixed tag set (user decision): `event`, `survey`, `prayer`, `news`, shown as
  small colored icon tiles (user revision; see render rules).
- Defaults (user decision): the weekly-email items from the mockup (see Data /
  contracts).
- Sidebar editing: a Spotlight panel (Tag select, Title, Text, Button label,
  Link) and an Items panel (Tag select, Title, Detail, Link; add, move up or
  down, remove).
- Empty handling: hide the parts that have no content (see Data / contracts).
- Block pattern "Featured section": core h3 "Featured" + the block, for
  placing above Quick Actions.
- Move the sidebar list editor from `src/development/edit.js` into
  `src/shared/row-list.js` so both blocks share it, and give it a select-field
  option for tags.

## Out of scope

- Hero search filtering (feature 11; it filters documents and Development
  events, not featured items).
- Scheduling or automatic expiry of featured items. Editors remove stale items
  by hand.
- Images, more than one spotlight, or tags outside the fixed set.

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"`, so pause for
review after each step. `workflow.checkpointCommits: "enabled"`, so offer a
checkpoint commit on the feature branch after each approved step.
`/complete` creates the final feature commit.

## Build steps

- [x] 1. **Block and front-end render.** Create `src/featured/` (`block.json`,
      `index.js`, `edit.js`, `render.php`, `style.scss`, `editor.scss`)
      following `src/development/`. Attributes and defaults per Data /
      contracts. `edit.js` shows `ServerSideRender` only. `render.php`
      implements every render rule below. Styles follow the mockup.
      **Done when:** `npm run build` succeeds, the block's JS and CSS lint
      cleanly, and `php -l` passes. A stubbed-WordPress run of `render.php`
      (scratch only) shows: the defaults render a spotlight and four rows;
      a spotlight with an empty URL renders as a non-clickable card with no
      button; an unknown tag falls back to the `news` icon; a `javascript:` URL row is
      not clickable; untitled rows are skipped; empty content renders the
      empty message. In Playground the block inserts and matches the mockup,
      stacking under 820px.
- [x] 2. **Shared row editor + sidebar.** Move `RowList` from
      `src/development/edit.js` to `src/shared/row-list.js` (named export),
      with no behavior change. Move the `.yamp-dev-editor__row`,
      `__row-title`, and `__help` rules from `src/development/editor.scss`
      into `src/shared/row-list.scss`, renamed `.yamp-row-editor__*`, and
      import that stylesheet from `row-list.js`. Add optional `options` on a
      field definition, which renders a `SelectControl` instead of a
      `TextControl`. Update `src/development/edit.js` to import both. Add the
      Featured sidebar: a Spotlight panel (fields above) and an Items panel
      using `RowList`, with help text: "Items without a title are not shown.
      Items without a link are shown but cannot be clicked."
      **Done when:** the Development sidebar still adds, edits, moves, and
      removes events, contacts, and buttons exactly as before, with the same
      bordered rows; in the Featured sidebar, changing a tag swaps its
      icon, editing the spotlight updates the preview, and adding, moving,
      and removing items works; lint and build pass.
- [x] 3. **Pattern + final pass.** Register `yamp/featured-section` in
      `includes/patterns.php` (category `yamp-portal`): core h3 "Featured" +
      the block. Run lint (JS on `src`, full CSS), `npm run build`, and
      `php -l` on the touched PHP.
      **Done when:** inserting the "Featured section" pattern gives the
      heading and block; Tab reaches the spotlight and each linked row with a
      visible focus ring; all checks pass.

## Files / areas

- New: `src/featured/{block.json,index.js,edit.js,render.php,style.scss,editor.scss}`
- New: `src/shared/row-list.js`, `src/shared/row-list.scss` (moved from the
  Development block)
- Edit: `src/development/edit.js` and `src/development/editor.scss` (use the
  shared editor; no behavior change), `includes/patterns.php` (new pattern)
- Reuse: `src/shared/tokens.scss`, the `yamp-card` mixin
- No change to `ya-portal-blocks.php`: blocks register from
  `build/blocks-manifest.php`.

## Data / contracts

All content is block attributes. `block.json`:

| Attribute | Type | Default |
|---|---|---|
| `spotlight` | object `{ tag, title, text, buttonLabel, url }` | `survey` / "Ministry Impact Survey" / "Help capture the full footprint of Youth Apostles across every location. We use it for the blog, the annual report to the bishop, and donor meetings. Haven't finished phase 2? Please complete it soon." / "Take the survey" / `""` (survey link not known yet) |
| `items` | array of `{ tag, title, detail, url }` | see rows below |

Default `items`:

| tag | title | detail | url |
|---|---|---|---|
| `event` | Auction: A Night at the Races | Nov 7 · Donate silent-auction items or fill a table | `https://www.youthapostles.org/auction` |
| `prayer` | Beneath Mary's Mantle | 100-day prayer campaign for Mount St. Mary's, ends Dec 8 | `""` |
| `prayer` | Share a ministry prayer intention | Email Liz with the intention and its end date | `mailto:liz.garcia@youthapostles.org` |
| `news` | New diaspora coordinator | Jim Engbert takes over from Ben Kolodziej | `""` |

Render rules (`render.php`):

- **Tag:** a value outside `event|survey|prayer|news` renders as `news`. Each
  tag shows as a small icon tile (30px, soft color fill, colored icon, like
  the document type icons). Colors: event and survey gold, prayer green,
  news light navy. Icons: event =
  calendar, survey = clipboard check, prayer = cross, news = megaphone. A
  visually hidden label ("Event: ", "Survey: ", etc.) is read by screen
  readers. Icon and label come from a static map, never from the stored
  value. The class is `yamp-feat__icon--<tag>`. (Changed from colored text
  badges to colored icon tiles at user request during step 1 review.)
- **Spotlight:** shown when its trimmed `title` is non-empty. With a URL that
  passes `esc_url` it renders as `<a>`, and the button shows `buttonLabel`
  followed by "→" (no button when the label is empty). Without a usable URL
  it renders as a `div` with no button. Empty `text` omits the paragraph.
- **Items:** rows with an empty trimmed `title` are skipped. With a usable URL
  the row is an `<a>` with an arrow; otherwise it is a non-clickable `div`.
  Empty `detail` omits the line. Rows render in stored order.
- **Layout:** with both a spotlight and at least one item, two columns. With
  only one of them, that card spans the full width (`yamp-feat--single`
  modifier). With neither, the block shows "No featured items yet." in muted
  text, styled like the documents' empty state.
- **Escaping:** all text via `esc_html`, attributes via `esc_attr`/`esc_url`.
  SVGs are static markup only. `mailto:` links are allowed (core `esc_url`
  keeps them).
- **Arrows:** the row arrow is decorative, `aria-hidden="true"`. The button's
  "→" is wrapped in an `aria-hidden` span so screen readers hear only the
  label.

## Testing

No unit test runner is configured (see AGENTS.md). Gates per step: lint
(`./node_modules/.bin/wp-scripts lint-js src`, `wp-scripts lint-style`),
`npm run build`, `php -l` on touched PHP, plus a stubbed-WordPress scratch run
of `render.php` (not committed) and the manual Playground checks in each Done
when. Do not run `lint-js --fix` at all, even on one file: it rewrites the
Blueprint `run-state.mjs` helpers. Use `wp-scripts format <file>` instead. No browser-test command exists, so no automated UI
evidence will be claimed.

## Notes for the AI

- Follow `src/development/` for structure, comments, `yamp_` prefixed PHP
  variables, guarded helper functions, and `__( …, 'ya-portal-blocks' )`
  strings.
- Keep the default `ServerSideRender` import (WP 6.8 support).
- No em dashes in copy, comments, or docs (coding standards).
- Before `/complete`, check for iCloud "name 2.ext" duplicates.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9368,"specSha256":"d713d767d47e6e2145daf6026ab95bf3d6fe433de3a117e77400bb58fa73925b","branch":"refs/heads/feature/featured-block","head":"a45d2abcd9cfef943ee3b468d64044bbbcbbf8b8","baseRef":"refs/heads/main","baseCommit":"a45d2abcd9cfef943ee3b468d64044bbbcbbf8b8","sourceTree":"a35ed7c91b46f6225cdbc14619b20fa59e938b4c","absentOptional":[]} -->
