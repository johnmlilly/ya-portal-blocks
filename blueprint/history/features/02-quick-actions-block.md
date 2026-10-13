# Feature: Quick actions block

**From build-plan:** feature 2
**Build attempt:** 1
**Branch:** feature/quick-actions-block
**Status:** verified

## Goal

Ship the quick-actions row from the portal redesign as its own block: a
flexible list of link cards, starting with the four from the reference (Update
Contact Info, Full Member Directory, Birthdays & Anniversaries, Request Logos).
A non-technical admin edits each card's icon, label, description, and link, and
adds, removes, or reorders cards from the block's settings sidebar in the page
editor, so new actions and real URLs can be added on the live site without a
code change.

## Design reference

`references/ya-portal-redesign.html`, `.actions` / `.action` rules (lines
33-39, reduced-motion rule line 77) and the `<div class="actions">` markup
directly under the hero (four `<a class="action">` cards, each an icon tile
plus a bold label and a muted one-line description). Brand tokens come from
`src/shared/tokens.scss` (feature 1).

## In scope

- New block `yamp/quick-actions` under `src/quick-actions/`, following the
  feature 1 block layout (`block.json`, `index.js`, `edit.js`, `render.php`,
  `style.scss`, `editor.scss`)
- A variable-length, ordered list of cards; each card has an icon chosen from
  a fixed icon set, plus editable label, description, and link URL
- Default list pre-filled with the four reference cards; link URLs default to
  empty
- Editor sidebar (`InspectorControls`) with one panel per card holding its
  fields, plus add, remove, move up, and move down; canvas preview via
  `ServerSideRender`, same as feature 1
- Responsive card grid that wraps any number of cards, hover lift, visible
  keyboard focus, and reduced-motion support matching the reference

## Out of scope

- Uploading custom icons or picking from the full Dashicons/SVG library
- Drag-and-drop reordering (move up/down buttons only)
- The member directory itself (feature 7) and any birthdays/anniversaries page
- Access control / logged-out state (feature 6)
- Validating that a URL points somewhere real

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"` - pause for review
after each step. `workflow.checkpointCommits: "enabled"` - offer a checkpoint
commit once a step is approved.

## Build steps

- [x] 1. **Block scaffold, markup, and styles (defaults only)**
      - `src/quick-actions/block.json`: `name` `yamp/quick-actions`, `title`
        "Quick Actions", `icon` `screenoptions`, `category` `widgets`,
        `textdomain` `ya-portal-blocks`, `supports.html: false`, same
        editorScript/editorStyle/style/render file entries as
        `src/portal-hero-search/block.json`, and the `actions` attribute with
        its defaults (see Data / contracts).
      - `index.js`: register with `Edit`, import `style.scss` (copy feature 1).
      - `edit.js`: `useBlockProps` wrapper around
        `<ServerSideRender block="yamp/quick-actions" attributes={ attributes } />`.
      - `render.php`: if `actions` is empty or not an array, output nothing.
        Otherwise wrap in `get_block_wrapper_attributes()` and loop the cards
        in stored order. Look up the inline SVG by `icon` from a fixed map of
        the five icon keys; an unknown or missing key uses the `link` icon.
        For each card: `$url = esc_url( $action['url'] )`; non-empty renders
        `<a class="yamp-action" href="...">`, empty renders
        `<div class="yamp-action yamp-action--no-link">` (same look, not
        clickable). Label in `<b>`, description in `<span>`, both
        `esc_html`; a missing field is treated as `""`. SVGs
        `aria-hidden="true" focusable="false"`. Prefix all PHP variables
        `$yamp_`.
      - `style.scss`: `@use "../shared/tokens" as *`; port `.actions`/`.action`
        rules to `.wp-block-yamp-quick-actions` / `.yamp-action` (grid
        `repeat(auto-fit, minmax(200px, 1fr))`, card surface, border, 12px
        radius, shadow, icon tile, type sizes), `:hover` lift and
        `:focus-visible` outline on links only, and a
        `prefers-reduced-motion` override removing the transition.
      - `editor.scss`: same nested-wrapper padding/margin reset pattern as
        `src/portal-hero-search/editor.scss` if the SSR preview double-spaces.
      **Done when:** `npm run build` emits `build/quick-actions/` and the
      manifest lists both blocks; `lint-js`, `lint-style`, and `php -l
      src/quick-actions/render.php` pass. Manual: in Playground the block
      inserts and shows the four default non-link cards with the reference
      copy and icons.

- [x] 2. **Sidebar editing of existing cards**
      - `edit.js`: `InspectorControls` with one `PanelBody` per card (title =
        current label, or "Untitled card" when empty; first panel open)
        containing a `SelectControl` for Icon (options in Data / contracts)
        and `TextControl`s for Label, Description, and Link (help text: "A web
        address, or mailto:name@example.org for an email link. Leave empty to
        show the card without a link.").
      - Updates replace the edited card by index with a new object in a new
        array and call `setAttributes( { actions: next } )`.
      - Link field trims surrounding whitespace before saving.
      **Done when:** build, `lint-js`, and `lint-style` pass. Manual: in
      Playground, editing a label or icon updates the canvas preview; setting
      a URL makes that card a link on the front end; a `mailto:` link opens
      the mail client; values persist after saving and reloading the editor.

- [x] 3. **Add, remove, and reorder cards**
      - Each card panel gets "Move up", "Move down" (disabled at the ends),
        and "Remove card" (`isDestructive`) buttons.
      - An "Add card" button below the panels appends
        `{ icon: "link", label: "", description: "", url: "" }` and opens its
        panel.
      - All three operations produce a new array; no other attributes change.
      **Done when:** build, `lint-js`, and `lint-style` pass. Manual: in
      Playground, adding a fifth card, moving it to the top, and removing
      another card each update the preview immediately and persist after
      save and reload; removing every card leaves nothing on the front end.

## Files / areas

- `src/quick-actions/block.json`, `index.js`, `edit.js`, `render.php`,
  `style.scss`, `editor.scss` - new
- No change to `ya-portal-blocks.php`: `wp_register_block_types_from_metadata_collection()`
  picks up `build/quick-actions/` via the generated manifest, and the shared
  Montserrat enqueue already covers every block
- `src/shared/tokens.scss` - read only

## Data / contracts

- Block name `yamp/quick-actions` (stable).
- Attribute `actions`: `type: "array"`, an ordered list (render order = array
  order, any length including zero) of objects
  `{ icon: string, label: string, description: string, url: string }`.
  Defaults:

  | icon | label | description | url |
  |---|---|---|---|
  | `contact` | Update Contact Info | Keep the directory current | `""` |
  | `directory` | Full Member Directory | Find fellow members | `""` |
  | `birthdays` | Birthdays & Anniversaries | Celebrate the community | `""` |
  | `logos` | Request Logos | Email communications | `""` |

- `icon` key set and editor labels (SVGs from the reference; `link` is a plain
  link/chain icon added for new cards):

  | key | editor label |
  |---|---|
  | `contact` | Pencil |
  | `directory` | People |
  | `birthdays` | Cake |
  | `logos` | Palette |
  | `link` | Link |

  Unknown or missing `icon` renders as `link`.
- `url` is stored as typed (trimmed). Rendering passes it through `esc_url()`,
  which keeps `http`, `https`, and `mailto` and returns `""` for disallowed
  schemes such as `javascript:`; an empty result renders the non-link card.
- Links open in the same tab (no `target`).
- Empty list: front end renders nothing; the editor shows WordPress's standard
  empty server-render notice and the sidebar still offers "Add card".

## Testing

No test runner is configured (`AGENTS.md` Commands has no test entry), so no
automated test gate. Checks per step: `npm run build`, `npx wp-scripts lint-js
src`, `npx wp-scripts lint-style "src/**/*.scss"`, `php -l` on `render.php`.
Visual and editing behavior is a manual Playground (`npm run playground`) or
live-site check; no browser evidence is claimed by this spec.

## Notes for the AI

- Mirror feature 1's file style and comments (`src/portal-hero-search/`),
  procedural PHP, `yamp_` prefixes.
- Escape every attribute on output; editor-entered text is untrusted.
- No em dashes in any copy (coding standards writing rule).
- Import `InspectorControls` from `@wordpress/block-editor`, `__` from
  `@wordpress/i18n`, and `PanelBody`, `TextControl`, `SelectControl`, `Button`
  from `@wordpress/components`; add `@wordpress/components` to `package.json`
  if lint reports it unresolved, the same way `@wordpress/server-side-render`
  was added in feature 1.
- React list keys: cards have no stable id; use the index for panels, which is
  acceptable because each panel is fully controlled by attributes.
- A natural link for "Update Contact Info" is the site's WordPress profile
  page (`/wp-admin/profile.php`); suggest it to the admin, but the default
  stays empty.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9307,"specSha256":"3bbd980733bd09ef506a31da36a83d67941ce2d5122c6161ad8a05f2eb755f41","branch":"refs/heads/feature/quick-actions-block","head":"c5b8c280b8ac9cd6b1d2bf5d9f0daa28a52dcffb","baseRef":"refs/heads/main","baseCommit":"c5b8c280b8ac9cd6b1d2bf5d9f0daa28a52dcffb","sourceTree":"3eb943786d7b56d18cf3372625b114194aba9c9a","absentOptional":[]} -->
