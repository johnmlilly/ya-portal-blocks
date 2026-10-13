# Feature: Portal hero + search block

**From build-plan:** feature 1
**Build attempt:** 1
**Branch:** feature/portal-hero-search-block
**Status:** verified

## Goal

Ship the first real, uploadable member-portal block: the welcome header and
document search bar from `references/ya-portal-redesign.html`, styled to the
brand guide, so it can be built and tested on a live WordPress site. Search
stays decorative for now - there is no document data source in this plan to
search across yet (documents live as free-form content in other blocks, not a
queryable store). This step also lays down the shared brand tokens and font
loading that the next four visual blocks (features 2-5) reuse.

## Design reference

`references/ya-portal-redesign.html`, `.hero` section only (lines 82-87): the
`<h2>Welcome back, John</h2>` heading, intro paragraph, and the `.search` input
with its magnifying-glass icon. Brand palette and font come from that file's
`:root` custom properties and Google Fonts `Montserrat` import.

## In scope

- Repurpose the existing scaffold block (`src/ya-portal-blocks/`) into this
  block, renamed to `src/portal-hero-search/` - this project has no other real
  block yet, so there is nothing worth keeping the placeholder for
- A shared SCSS partial with the brand palette as SCSS variables, for this and
  the next four blocks to `@use`
- One shared font enqueue (Montserrat) in the main plugin file, loaded on both
  front end and editor, for every portal block to share
- Heading personalized with the viewing WordPress user's real display name
  (plain `wp_get_current_user()`, unrelated to the later stage/role work)
- A subtle current-date line under the heading, e.g. "Tuesday, October 13"
  (added during review at the user's request)
- A non-functional search `<input>` matching the reference visually (no JS
  wiring, no results)

## Out of scope

- Any real search behavior or filtering
- Quick actions, Formation/Community Documents, or the calendar (features 2-5)
- Access control / logged-out state (feature 6) - this block just reads the
  current user when there is one and falls back to generic copy otherwise

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"` - pause for review
after this step. `workflow.checkpointCommits: "enabled"` - offer a checkpoint
commit once it's approved.

## Build steps

- [x] 1. **Shared brand tokens + font, and the hero/search block**
      - Add `src/shared/tokens.scss`: SCSS variables for the reference's
        palette (`$yamp-bg`, `$yamp-surface`, `$yamp-ink`, `$yamp-muted`,
        `$yamp-line`, `$yamp-brand`, `$yamp-brand-soft`, `$yamp-gold`,
        `$yamp-gold-soft`, `$yamp-green`, `$yamp-green-soft`, `$yamp-red`,
        `$yamp-red-soft`, `$yamp-shadow`) and the `Montserrat` font stack.
        Not a block itself - a plain partial the blocks `@use`.
      - In `ya-portal-blocks.php`, add `yamp_enqueue_portal_font()` that
        `wp_enqueue_style`s the Google Fonts Montserrat stylesheet, hooked to
        `enqueue_block_assets` (fires on both front end and editor).
      - Rename `src/ya-portal-blocks/` to `src/portal-hero-search/`:
        - `block.json`: `name` -> `yamp/portal-hero-search`, `title` ->
          "Portal Hero + Search", `icon` -> `search`, description updated,
          drop the unused `viewScript` entry
        - `render.php`: real markup - a heading ("Welcome back, `{display
          name}`" when logged in, else "Welcome back"), the intro paragraph,
          and the search icon + input, wrapped in
          `get_block_wrapper_attributes()`. Escape all output.
        - `edit.js`: use `<ServerSideRender block="yamp/portal-hero-search" />`
          (from `@wordpress/server-side-render`) so the editor preview reuses
          `render.php` instead of duplicating markup
        - `editor.scss` / `style.scss`: `@use '../shared/tokens'`, style the
          hero and search bar to match the reference (card search field,
          rounded corners, shadow, Montserrat type)
        - delete `view.js` (front end has no interactive behavior yet) and its
          `block.json` reference
      **Done when:** `npm run build` completes without error and produces the
      renamed block's compiled output under `build/portal-hero-search/`;
      `php -l ya-portal-blocks.php` and `php -l src/portal-hero-search/render.php`
      report no syntax errors. Uploading the built plugin to a live WordPress
      site and confirming the block inserts and matches the reference visually
      is a manual `/check`-time step - no WordPress runtime is available in
      this workspace.

- [x] 2. **Current date under the heading** (user request during review)
      - `render.php`: after the `<h2>`, output a `<p class="yamp-hero__date">`
        wrapping a `<time datetime="Y-m-d">` with `wp_date()` in the
        translatable format `l, F j` (site timezone and locale, e.g.
        "Tuesday, October 13"). Escape output.
      - `style.scss`: subtle styling - small (13px), medium weight, muted
        color, tight spacing under the heading.
      **Done when:** `npm run build`, `lint-js`, `lint-style`, and `php -l` on
      `render.php` all pass. Visual check in Playground or the live site.

- [x] 3. **Hero layout tweaks** (user request during review)
      - Center the heading and date line.
      - Remove the intro paragraph (markup and styles) for now.
      - Search placeholder becomes "Search…" (aria-label stays
        "Search documents").
      **Done when:** `npm run build`, `lint-js`, `lint-style`, and `php -l` on
      `render.php` all pass. Visual check in Playground or the live site.

## Files / areas

- `src/shared/tokens.scss` - new
- `ya-portal-blocks.php` - add font enqueue
- `src/ya-portal-blocks/*` -> renamed to `src/portal-hero-search/*`
  (`block.json`, `index.js`, `edit.js`, `render.php`, `editor.scss`,
  `style.scss`); `view.js` removed

## Data / contracts

- Block name: `yamp/portal-hero-search` (stable - later features reference
  blocks by name if they ever need to)
- No block attributes yet - copy is static and the input is decorative; this
  plan has no document data source to wire real search to
- Shared SCSS token names listed above are the stable contract features 2-5
  `@use`

## Testing

No test runner is configured for this project (`AGENTS.md` Commands has no
`test` entry), so per `coding-standards.md` this step carries no automated test
gate. Available checks: `npm run build` (compiles JS/SCSS/PHP copy) and
`php -l` on the touched PHP files. Visual/functional confirmation on a real
WordPress site happens at `/check`, not in this workspace.

## Notes for the AI

- Keep the plugin's existing procedural PHP style (`yamp_` prefix, no
  classes), matching `yamp_ya_portal_blocks_block_init()`.
- Follow the writing rule in `coding-standards.md`: no em dashes in generated
  copy - rephrase the reference's intro paragraph with a comma or colon
  instead of the "—" it uses.
- `wp_register_block_types_from_metadata_collection()` in
  `ya-portal-blocks.php` auto-discovers every block folder under `build/`; no
  PHP registration change is needed when adding the next four blocks.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":7188,"specSha256":"5383673806b64f6c1ff53373f43f9b32856533aff0f7f6e57896e5dec935ee5a","branch":"refs/heads/feature/portal-hero-search-block","head":"4a530737f5ebe724f52367568873553907affe32","baseRef":"refs/heads/main","baseCommit":"3639600676ca2b4f4625e373c93de4df2c846ce9","sourceTree":"1bca3c44117b9fbe332f1db89cedb76b3c3a8d76","absentOptional":[]} -->
