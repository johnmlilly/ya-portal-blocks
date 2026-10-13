# Feature: Community Documents block

**From build-plan:** feature 4
**Build attempt:** 1
**Branch:** feature/community-documents-block
**Status:** verified

## Goal

Ship the Community Documents card from the portal redesign: one org-wide,
editable list of documents (contact list, stats, statutes, guidelines,
branding guide, and so on) that every logged-in member sees. It reuses the
shared document row from feature 3 unchanged, so rows look and edit exactly
like Formation Documents: type icon tile, title, matching badge, open arrow;
title, type, and link (pasted or picked from the Media Library) edited in the
sidebar, with add, remove, and reorder.

## Design reference

`references/ya-portal-redesign.html`, the "Community" `<section>` (lines
137-160): the left `.card` with a document icon + "Community Documents" `<h4>`
and its `<ul>` of document rows. The card's look follows the feature 3 stage
card (`src/formation-documents/style.scss`, `.yamp-stage`) so all document
cards match. Rows use the shared `yamp-document-list` styles.

The reference's two-column "Community" layout and its "Community" `<h3>` are
page layout, not part of this block. Instead the plugin registers a block
pattern, "Community section", that inserts a core Heading ("Community") and a
core Columns block split 1/3 documents and 2/3 calendar (user decision: the
calendar should be the more visible of the two, reversing the reference's
1.15/0.85 split). The calendar column holds a placeholder until feature 5
adds the Calendar block to the pattern. Core Columns stacks on mobile by
default, matching the reference's one-column collapse.

## In scope

- New block `yamp/community-documents` under `src/community-documents/`,
  following the existing block layout (`block.json`, `index.js`, `edit.js`,
  `render.php`, `style.scss`, `editor.scss`)
- A single card: fixed document icon, editable heading (default "Community
  Documents"), and one variable-length document list rendered by
  `yamp_render_document_list()`
- Defaults seeded with the reference's eight documents, links empty
- Sidebar editing via the shared `DocumentListControl` (title, type, link with
  Media Library button, move up/down, remove, add)
- Extract the stage card look into a shared `yamp-card` SCSS mixin used by
  both Formation Documents and this block (no visual change to feature 3)
- A "Community section" block pattern (Heading + 1/3 | 2/3 Columns) in a
  "Member Portal" pattern category

## Out of scope

- The Community Calendar block and the "Need logo files?" note (feature 5)
- A built-in two-column layout or section `<h3>` inside this block (the
  pattern uses core Heading and Columns instead)
- The Calendar block itself; the pattern's 2/3 column gets it in feature 5
- Multiple lists or columns inside this block
- Access control / logged-out state (feature 6)
- Any change to the shared document row contract, renderer, or control

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"` - pause for review
after each step. `workflow.checkpointCommits: "enabled"` - offer a checkpoint
commit once a step is approved.

## Build steps

- [x] 1. **Shared card mixin, block scaffold, markup, and styles (defaults only)**
      - `src/shared/documents.scss`: add a `yamp-card` mixin holding the card
        surface, border, 14px radius, shadow, and head (icon + `<h4>`, bottom
        border) styles currently written out under `.yamp-stage` in
        `src/formation-documents/style.scss`; switch that file to
        `@include` it with identical output.
      - `src/community-documents/block.json`: `name`
        `yamp/community-documents`, `title` "Community Documents", `icon`
        `media-document`, `category` `widgets`, `supports.html: false`, file
        entries like the other blocks, `heading` and `documents` attributes
        with defaults (see Data / contracts).
      - `index.js` (copy), `edit.js` (`useBlockProps` + `ServerSideRender`
        with `attributes`, same import note as the other blocks).
      - `render.php`: wrapper via `get_block_wrapper_attributes()` around an
        inner `.yamp-card` element (kept separate so the editor's nested
        wrapper doesn't get the card styling twice); head with the fixed document icon and the
        `<h4>` heading (head omitted when the heading is empty); then
        `yamp_render_document_list( $documents )`, which already renders
        "No documents yet." for an empty or invalid list.
      - `style.scss`: `@include` the card and document-list mixins under
        `.wp-block-yamp-community-documents`; `height: 100%` on the card so it
        fills a Columns cell next to the calendar. `editor.scss`:
        nested-wrapper reset like the other blocks.
      **Done when:** `npm run build` emits `build/community-documents/` and the
      manifest lists all four blocks; Formation Documents' compiled CSS rules
      for the stage card are unchanged apart from order (diff the built CSS
      before and after); `lint-js`, `lint-style`, and `php -l
      src/community-documents/render.php` pass; CLI smoke render covers
      escaping, empty heading, and an empty list. Manual: in Playground the
      block shows the card with the eight seeded rows as non-links.

- [x] 2. **Sidebar editing**
      - `edit.js`: `InspectorControls` with one `PanelBody` ("Documents",
        open) containing a Heading `TextControl` (help: "Leave empty to hide
        the heading.") and `DocumentListControl` bound to `documents`.
      **Done when:** build, `lint-js`, `lint-style` pass. Manual: editing the
      heading and a row's title, type, or link updates the preview; the Media
      Library button fills a link; add, move, and remove work; values persist
      after save and reload; removing every row shows "No documents yet."

- [x] 3. **"Community section" block pattern**
      - New `includes/patterns.php` (required once from `ya-portal-blocks.php`
        after the document-list include), hooked to `init`:
        `register_block_pattern_category( 'yamp-portal', ... )` labelled
        "Member Portal", and `register_block_pattern( 'yamp/community-section', ... )`
        titled "Community section" whose content is block markup for a core
        Heading (level 3, "Community") and a core Columns block with two
        Column blocks at `33.33%` and `66.66%` width: the first contains
        `<!-- wp:yamp/community-documents /-->`, the second a core Paragraph
        placeholder ("Community Calendar goes here.") to be replaced by the
        Calendar block in feature 5.
      **Done when:** `php -l` on both PHP files passes; build passes. Manual:
      in Playground, the inserter's Patterns tab shows "Member Portal" ->
      "Community section"; inserting it gives a heading plus a 1/3 documents
      column and a 2/3 placeholder column that stack on a narrow screen.

## Files / areas

- `src/shared/documents.scss` - add `yamp-card` mixin
- `includes/patterns.php` - new; `ya-portal-blocks.php` - `require_once` it
- `src/formation-documents/style.scss` - use the mixin (no visual change)
- `src/community-documents/block.json`, `index.js`, `edit.js`, `render.php`,
  `style.scss`, `editor.scss` - new
- Reused unchanged: `includes/document-list.php`,
  `src/shared/document-list-control.js`
- Registration needs no change: the generated manifest picks up the new block

## Data / contracts

- Block name `yamp/community-documents` (stable).
- Attribute `heading`: string, default `"Community Documents"`; empty hides
  the card head.
- Attribute `documents`: array of the shared document row
  `{ title: string, type: "pdf" | "form" | "doc" | "audio", url: string }`
  (contract owned by feature 3; rendering, fallbacks, escaping, and link rules
  all come from `yamp_render_document_list()`).
- Defaults (all `url: ""`): Contact List (pdf); Membership Stats (pdf);
  Membership Growth by Year (pdf); General Statutes (pdf); Internal
  Guidelines (pdf); Consecrated Internal Guidelines (pdf); Branding Guide
  (pdf); Building Truthful Relationships – Eduardo Azcarate (audio). The
  reference's em dash in the last title is replaced with an en dash per the
  writing rule.
- Empty list: the card stays visible with "No documents yet." (same as an
  empty Formation Documents column).

## Testing

No test runner is configured, so no automated test gate. Per step: `npm run
build`, `npx wp-scripts lint-js src`, `npx wp-scripts lint-style
"src/**/*.scss"`, `php -l` on touched PHP. Step 1 adds a CLI smoke render with
stubbed escaping (scratch only) and a before/after diff of
`build/formation-documents/style-index.css`. Visual and editor behavior is a
manual Playground or live-site check; no browser evidence is claimed.

## Notes for the AI

- Do not modify `includes/document-list.php` or
  `src/shared/document-list-control.js`; if this block seems to need a change
  there, stop and raise it, since it would also change Formation Documents.
- Mirror Formation Documents' file style, comments, `yamp_` prefixes, and the
  default `ServerSideRender` import note.
- No em dashes in copy or defaults.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9113,"specSha256":"cd97a4f43155b92829616d0d257ce63811f8f7628981fd9c060301509f768cb9","branch":"refs/heads/feature/community-documents-block","head":"c953be981b3d74c8d909707c096355575ec07818","baseRef":"refs/heads/main","baseCommit":"c953be981b3d74c8d909707c096355575ec07818","sourceTree":"8c0596a1171b91fde1ab8d4de56dc3a810055015","absentOptional":[]} -->
