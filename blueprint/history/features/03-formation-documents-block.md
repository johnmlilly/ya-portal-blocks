# Feature: Formation Documents block

**From build-plan:** feature 3
**Build attempt:** 1
**Branch:** feature/formation-documents-block
**Status:** verified

## Goal

Ship the portal's headline block: a "Formation Documents" section with a
flexible set of stage columns, starting with three (Prospective Members,
Candidates, Full Members), each an
editable list of documents, plus an optional full-width "For All Members"
list above the columns for general documents relevant to every member. Each
document shows a colored type icon tile, its title, a matching type badge
(PDF / FORM / DOC / AUDIO), and an open arrow. Every logged-in member sees the
same lists.
A non-technical admin adds, removes, and reorders columns, sets each column's
icon and heading, and edits each document's title, type, and link from the block's settings sidebar, picking files from the WordPress
Media Library or pasting an external form URL. This feature also locks the
shared document-row contract that the Community Documents block (feature 4)
reuses.

## Design reference

`references/ya-portal-redesign.html`:

- CSS: section head (lines 41-46), formation path, stage cards, document rows,
  and badges (lines 48-66)
- Markup: the `<section>` at lines 97-134 (section `<h3>`, `.path` grid of
  three `.stage` cards, each a `.stage-head` with icon + `<h4>` and a `<ul>` of
  `<a class="doc">` rows: badge, title, arrow)

Brand tokens come from `src/shared/tokens.scss`.

## In scope

- New block `yamp/formation-documents` under `src/formation-documents/`,
  following the existing block layout (`block.json`, `index.js`, `edit.js`,
  `render.php`, `style.scss`, `editor.scss`)
- Editable section heading (default "Formation Documents")
- A variable-length, ordered list of stage columns (default three); each has
  an icon chosen from a fixed icon set and an editable heading; add, remove,
  move up, move down
- Per stage, a variable-length ordered list of documents using the shared
  document-row shape; add, remove, move up, move down
- Link entry by Media Library picker or by typing/pasting a URL
- Defaults seeded with the reference's document titles and types, links empty
- An "all members" document list (attribute `general`) with its own editable
  heading (default "For All Members"), rendered as a full-width card above the
  stage columns; hidden on the front end while it has no documents
- Shared, reusable pieces for feature 4: the PHP row renderer, the SCSS
  document-row styles, and the JS document-list editor control
- Responsive column grid, row hover, visible keyboard focus

## Out of scope

- Per-stage visibility by member stage (no stage/role data exists, by plan)
- Custom or uploaded column icons
- The Community Documents block itself (feature 4)
- Search integration with the hero search bar
- Access control / logged-out state (feature 6)
- Uploading files from anywhere other than the standard Media Library modal

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"` - pause for review
after each step. `workflow.checkpointCommits: "enabled"` - offer a checkpoint
commit once a step is approved.

## Build steps

- [x] 1. **Shared document row + block scaffold, markup, and styles (defaults only)**
      - New `includes/document-list.php` (required once from
        `ya-portal-blocks.php`, after the `ABSPATH` guard) defining
        `yamp_render_document_list( $documents )`, returning the `<ul class="yamp-docs">` markup for an array of document
        rows (see Data / contracts), or `<p class="yamp-docs__empty">No
        documents yet.</p>` when the array is empty or invalid. Escape every
        field (`esc_html`, `esc_url`); row with an empty escaped URL renders as
        a non-link `<div class="yamp-doc yamp-doc--no-link">`. `npm run
        plugin-zip` packages `includes/**` by default, so no zip config
        change is needed.
      - `src/shared/documents.scss`: a `yamp-document-list` mixin holding the
        `.yamp-docs` / `.yamp-doc` row, per-type icon tile and badge
        (shared color pairs), title, open arrow, hover,
        `:focus-visible`, and empty-text styles.
      - `src/formation-documents/block.json`: `name`
        `yamp/formation-documents`, `title` "Formation Documents", `icon`
        `media-document`, `category` `widgets`, `supports.html: false`, file
        entries like the other blocks, and `heading` + `stages` attributes with
        defaults (see Data / contracts).
      - `index.js` (copy), `edit.js` (`useBlockProps` +
        `ServerSideRender` with `attributes`, same import note as the other
        blocks).
      - `render.php`: if `stages` is empty or not an array, output nothing.
        Otherwise wrapper via `get_block_wrapper_attributes()`, `<h3>`
        section heading (omitted when empty), `.yamp-path` grid; for each
        stored stage (skip non-arrays), a `.yamp-stage` card with the inline
        SVG for its `icon` from a fixed map (unknown or missing: `document`),
        `<h4>` heading, and `yamp_render_document_list()`.
      - `style.scss`: section head, `.yamp-path` grid
        `repeat(auto-fit, minmax(300px, 1fr))`, stage card and head, and
        `@include yamp-document-list`. `editor.scss`: nested-wrapper reset
        like the other blocks.
      **Done when:** `npm run build` emits `build/formation-documents/` and the
      manifest lists all three blocks; `lint-js`, `lint-style`, and `php -l`
      on `ya-portal-blocks.php`, `includes/document-list.php`, and
      `src/formation-documents/render.php` pass;
      a CLI smoke render with stubbed WP escaping covers escaping, a
      `javascript:` URL, and an empty stage. Manual: in
      Playground the block shows three columns with the seeded rows as
      non-links.

- [x] 2. **Sidebar editing: headings and document fields**
      - `src/shared/document-list-control.js`: a controlled component
        `DocumentListControl( { documents, onChange } )` rendering, per row, a
        `TextControl` Title, a `SelectControl` Type (PDF, Form, Doc, Audio),
        and a `TextControl` Link (trimmed). Pure: emits a new array via
        `onChange`, never mutates.
      - `edit.js`: `InspectorControls` with a "Section" panel (Heading
        `TextControl`) and one `PanelBody` per stage (title = stage heading,
        or "Untitled column"; one panel open at a time via a single
        `openIndex`, as in Quick Actions) containing a column Icon
        `SelectControl`, a column Heading `TextControl`, and
        `DocumentListControl`.
      **Done when:** build, `lint-js`, `lint-style` pass. Manual: editing a
      heading, a document title, type, or link updates the preview; a set
      link makes the row clickable on the front end; values persist after
      save and reload.

- [x] 3. **Media Library picker, and add/remove/reorder for rows and columns**
      - `DocumentListControl`: per row, a Media Library icon button
        (`admin-media`, tooltip "Choose from Media Library") beside the Link
        field, using `MediaUpload` inside `MediaUploadCheck` (from
        `@wordpress/block-editor`); the Link field stays a plain text input
        so a custom URL can be pasted. The button sets
        `url` to the selected attachment's URL and, only when the
        row's title is empty, `title` to the attachment title. Users without
        upload permission see no button and can still paste a link.
      - Per row: "Move up", "Move down" (disabled at the ends), "Remove"
        (`isDestructive`). Below the rows: "Add document" appending
        `{ title: "", type: "pdf", url: "" }`.
      - `edit.js`, per column panel: "Move column up", "Move column down"
        (disabled at the ends), "Remove column" (`isDestructive`); the open
        panel follows a moved column. Below the column panels: "Add column"
        appending `{ icon: "document", heading: "", documents: [] }` and
        opening its panel.
      **Done when:** build, `lint-js`, `lint-style` pass. Manual: choosing a
      PDF from the Media Library fills the link (and title when blank);
      adding, moving, and removing rows updates the preview and persists
      after save and reload; removing all rows from a stage shows "No
      documents yet." on the front end; adding a fourth column, moving it
      first, and removing another column update the preview and persist;
      removing every column leaves nothing on the front end.

## Files / areas

- `includes/document-list.php` - new, `yamp_render_document_list()`
- `ya-portal-blocks.php` - `require_once` the include
- `src/shared/documents.scss`, `src/shared/document-list-control.js` - new,
  shared with feature 4
- `src/formation-documents/block.json`, `index.js`, `edit.js`, `render.php`,
  `style.scss`, `editor.scss` - new
- Registration needs no change: the generated manifest picks up the new block

## Data / contracts

- Block name `yamp/formation-documents` (stable).
- **Document row (shared with feature 4, locked):**
  `{ title: string, type: "pdf" | "form" | "doc" | "audio", url: string }`.
  (Redesigned during step 2 review: badges restyled to match the icon tiles
  so both document blocks share one look.)
  - Per type, one shared color pair used by both the icon tile and the badge:
    `pdf` red / red-soft, `form` brand / brand-soft, `doc` green /
    green-soft, `audio` gold / gold-soft. Unknown or missing `type` renders
    as `pdf`.
  - Leading icon tile (decorative inline SVG, `aria-hidden`): `pdf` file with
    down arrow, `form` clipboard check, `doc` file with text lines, `audio`
    headphones.
  - Badge: small uppercase pill (PDF, FORM, DOC, AUDIO) after the title, same
    color pair as the tile.
  - Trailing open arrow (decorative SVG, `aria-hidden`) on linked rows only,
    muted; darkens on hover.
  - `url` stored trimmed; rendered through `esc_url()` (allows http, https,
    mailto, and site-relative); empty result renders a non-link row.
  - Links open in the same tab (no `target`).
- Attribute `heading`: string, default `"Formation Documents"`; empty hides
  the `<h3>`.
- Attribute `general`: `{ heading: string, documents: DocumentRow[] }`,
  default `{ heading: "For All Members", documents: [] }`. Renders above the
  columns as a full-width `.yamp-stage--general` card (people icon, `<h4>`
  heading, documents in a responsive multi-column list) on the front end only
  when `documents` is a non-empty array. In the editor preview (a REST
  request, detected with `wp_is_serving_rest_request()`) the card always
  renders, showing "No documents yet." when empty, so admins can find it. Edited in its own sidebar panel with a
  Heading field and `DocumentListControl`; step 3's row add/remove/reorder
  applies here too.
- Attribute `stages`: ordered array (render order = array order, any length
  including zero) of `{ icon: string, heading: string, documents: DocumentRow[] }`.
- Column `icon` key set and editor labels (SVGs from the reference, plus a
  plain document icon for new columns):

  | key | editor label |
  |---|---|
  | `sprout` | Sprout |
  | `cross` | Cross |
  | `cross-bold` | Bold cross |
  | `document` | Document |

  Unknown or missing `icon` renders as `document`.
- Defaults (all `url: ""`; en dashes as in the reference, no em dashes):
  - `sprout`, "Prospective Members": Appendix B – Basics Study Guide;
    Appendix C – YAs Prayer & Council; Appendix E – Basics Survey;
    Appendix F – Prospective Candidate Interview; Prospective Candidate
    Packet
  - `cross`, "Candidates": Sharing Group List (4/2/2022); 2024
    Formation Schedule; Candidate Formation Packet; St. Francis
    of Assisi Packet; Appendix K – Blank Formation Form;
    Six-Month Candidate Interview
  - `cross-bold`, "Full Members": Sharing Group List (4/2/2022); Appendix H –
    First Interview; Appendix I – Second Interview; Appendix J
    – Sponsor's Assessment; Instructions for Ministry Recommendation;
    Healthy and Holy Policy
- Empty stage: renders "No documents yet." in muted text inside the card.
- Empty `stages`: front end renders nothing; the editor shows WordPress's
  standard empty server-render notice and the sidebar still offers "Add
  column".

## Testing

No test runner is configured, so no automated test gate. Per step: `npm run
build`, `npx wp-scripts lint-js src`, `npx wp-scripts lint-style
"src/**/*.scss"`, `php -l` on touched PHP. Step 1 adds a CLI smoke render of
`yamp_render_document_list()` and `render.php` with stubbed escaping
functions (scratch only, not committed). Visual and editor behavior is a
manual Playground or live-site check; no browser evidence is claimed.

## Notes for the AI

- Mirror Quick Actions patterns: SSR preview, immutable attribute updates,
  single `openIndex` for panels, `__next40pxDefaultSize` /
  `__nextHasNoMarginBottom` on controls, `yamp_` PHP prefixes.
- Keep `DocumentListControl` free of stage-specific logic so feature 4 can
  drop it in unchanged.
- Escape everything editor-entered; icons and badge labels come from fixed
  server-side maps keyed by validated values.
- Media Library: attachment URLs are absolute site URLs; store as-is.
- No em dashes in copy or defaults.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":13192,"specSha256":"743884f4ce46986250e21bf4a2a989f4290367bc557fb41a98be37bcd1159b0f","branch":"refs/heads/feature/formation-documents-block","head":"44587e7403391aab7327e23025a9f1aa556e66e2","baseRef":"refs/heads/main","baseCommit":"44587e7403391aab7327e23025a9f1aa556e66e2","sourceTree":"23744237c79cec29d3f9a43d6b0a2b538d4dfc99","absentOptional":[]} -->
