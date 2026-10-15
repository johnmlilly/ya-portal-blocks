# Feature: Hero search filter

**From build-plan:** feature 11
**Build attempt:** 1
**Branch:** feature/hero-search-filter
**Status:** verified

## Goal

Make the hero search box work. Typing filters the whole portal page in the
browser: items whose text doesn't match hide, cards and blocks left with no
matches hide, and a line under the search box reports the result count.
Clearing the box restores the page.

## In scope

- Front-end filter script for the Portal Hero + Search block, loaded through
  `viewScript` in `src/portal-hero-search/block.json`.
- Searchable items (user revision during step 2 review: "filter everything"),
  each matching on the text shown:
  - document rows (Formation, including "For All Members", and Community):
    title;
  - Development events: title + time/location;
  - quick-action cards: label + description;
  - Featured spotlight: title + text; Featured list items: title + detail;
  - Development contacts: name + title + email;
  - giving buttons: label.
- The Community Calendar is an embedded iframe whose text cannot be searched,
  so it hides whenever a query is active.
- While a query is active (user decision):
  - non-matching items hide;
  - a card or block with no visible items hides (stage columns, "For All
    Members", the Formation, Community Documents, Quick Actions, Featured,
    Development, and Calendar blocks, and the Featured list, Development
    Events, and Development Contacts cards), including cards that had no
    items to begin with;
  - a results line under the search box says "1 match", "N matches", or
    "Nothing on this page matches “query”."
- Clearing the query (empty or whitespace) shows everything again and
  empties the results line.
- No editor settings, no server search, no stored data (build plan).

## Out of scope

- Hiding core blocks around the portal blocks, such as the "Community" or
  "Development" pattern headings or an empty core column. They stay visible.
- Searching inside document files or the calendar, highlighting matched
  text, keeping the query in the URL, or remembering it between visits.
- Filtering inside the editor preview (`viewScript` runs on the front end
  only; the editor keeps showing everything).

## Build loop

Per `blueprint/config.json`: `workflow.stepReview: "every"`, so pause for
review after each step. `workflow.checkpointCommits: "enabled"`, so offer a
checkpoint commit on the feature branch after each approved step.
`/complete` creates the final feature commit.

## Build steps

- [x] 1. **Search markers + results region.** Add the data attributes from
      Data / contracts in `includes/document-list.php` (each `li`),
      `src/formation-documents/render.php` (the `section` and each
      `.yamp-stage`), `src/community-documents/render.php` (the
      `.yamp-card`), and `src/development/render.php` (the events card and
      each event `li`). Add the empty results paragraph to
      `src/portal-hero-search/render.php` and style it in its `style.scss`.
      No visible change yet.
      **Done when:** `npm run build`, lint (JS on `src`, full CSS), and
      `php -l` on every touched PHP file pass; a stubbed-WordPress run
      (scratch only) of the document list and Development render shows the
      `data-yamp-search` values HTML-escaped (a title containing `"` and `<`
      stays inside the attribute); in Playground the portal page looks
      exactly as before.
- [x] 2. **Filter script.** Add `src/portal-hero-search/view.js` and
      `"viewScript": "file:./view.js"` to the hero `block.json`. Implement
      the matching, hiding, and results rules below.
      **Done when:** build and lint pass; `build/portal-hero-search/` contains
      the compiled view script and `block.json` points at it; in Playground,
      typing "packet" hides non-matching document rows, hides stage columns
      with no matches, and shows the match count; typing a word only in an
      event title shows that event and hides all document cards; typing
      "zzzz" hides every searchable card and shows the no-match message;
      clearing the box restores the page and empties the message. (Written
      for the original docs-and-events scope; step 3 extends it.)

- [x] 3. **Filter everything (scope revision).** Mark the remaining blocks
      per Data / contracts: Quick Actions (wrapper group, each card a row),
      Featured (wrapper and list groups, spotlight and list items rows),
      Development (wrapper and contacts-card groups, contacts and giving
      buttons rows, events now match title + time/location), Community
      Documents (wrapper group), Community Calendar (wrapper group, no
      rows). Change the no-match message to "Nothing on this page matches
      “%s”." and update the plans and overview to the new scope.
      **Done when:** build, lint, and `php -l` pass; a jsdom run (scratch
      only) of `view.js` over the real PHP render of all seven blocks shows:
      "survey" leaves Featured and Formation; "directory" leaves Quick
      Actions; "tyler" and "legacy" leave Development only; "zzzz" hides
      every portal block and shows the no-match message; clearing restores
      all items. In Playground the same queries behave the same way.

## Files / areas

- Edit: `includes/document-list.php`, the `render.php` of every portal block
  (`formation-documents`, `community-documents`, `community-calendar`,
  `development`, `quick-actions`, `featured`, `portal-hero-search`), and
  `src/portal-hero-search/{style.scss,block.json}`; plans and overview for
  the scope change
- New: `src/portal-hero-search/view.js`
- `@wordpress/scripts` builds `viewScript` files named in `block.json`, and
  blocks register from `build/blocks-manifest.php`, so no change to
  `ya-portal-blocks.php`. Step 2 confirms the compiled file exists.

## Data / contracts

Markup hooks (server side, escaped with `esc_attr`):

| Element | Attribute | Value |
|---|---|---|
| Searchable item (`li`, quick-action card, spotlight, giving button) | `data-yamp-search` | the item's shown text, as listed under In scope, joined with spaces |
| Card or block that can hide | `data-yamp-search-group` | (no value) |
| Results line in the hero | `class="yamp-hero__results"`, `aria-live="polite"` | empty; strings in `data-one`, `data-many`, `data-none` |

Results strings (translatable, rendered by PHP into the data attributes; the
script substitutes `%d` or `%s`):

- `data-one`: "%d match"
- `data-many`: "%d matches"
- `data-none`: "Nothing on this page matches “%s”."

Script rules (`view.js`, front end only):

- Bind to every `.yamp-hero__search input` on `input` events. No form submit
  exists, so Enter does nothing extra.
- **Normalize** the query and each `data-yamp-search` value the same way:
  `normalize('NFD')`, strip combining marks (`/[̀-ͯ]/g`), lower
  case, trim, collapse runs of whitespace. A row matches when its normalized
  value contains the normalized query.
- **Empty query** (after normalizing): remove `hidden` from every row and
  group, and set the results text to "".
- **Active query:** set `hidden` on non-matching rows and remove it from
  matching ones. Then, for each `[data-yamp-search-group]`, set `hidden` when
  it contains no visible `[data-yamp-search]` row (nested groups work because
  this checks rows, not child groups). Count the visible rows for the
  results line (`data-one` when 1, `data-many` otherwise, `data-none` with
  the raw trimmed query when 0). Set the text with `textContent`, never
  `innerHTML`.
- No search markup on the page (no hero block or no groups): the script does
  nothing and throws no error.
- Without JavaScript the box stays decorative, as it is today.

Styles: `.yamp-hero__results` uses muted 13px text, centered like the date
line, `margin: 8px 0 0`, and takes no space when empty (`:empty { display:
none; }`). `[hidden]` already hides elements; add
`[data-yamp-search-group][hidden], [data-yamp-search][hidden] { display:
none !important; }` in the hero's `style.scss` so block grid or flex rules
cannot override it.

## Testing

No unit test runner is configured (AGENTS.md). Per step: `npm run build`,
`./node_modules/.bin/wp-scripts lint-js src`, `wp-scripts lint-style`,
`php -l` on touched PHP, a stubbed-WordPress scratch run for step 1, and the
manual Playground checks in each Done when (`npm run playground` with
`npm run start`). Never run `lint-js --fix` (it rewrites the Blueprint
helpers); use `wp-scripts format <file>`. No browser-test command exists, so
no automated UI evidence will be claimed.

## Notes for the AI

- Match existing comment style and `yamp_` prefixes; the script uses plain
  DOM APIs with no new dependencies.
- The hero style file is loaded on any page with the hero block, so the
  `[hidden]` rule applies wherever search runs.
- No em dashes in copy, comments, or docs.
- Before `/complete`, check for iCloud "name 2.ext" duplicates.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":8934,"specSha256":"eaf8d107449812b6c90418c98a8168816c53bfd8880792184a0b858ea486adb4","branch":"refs/heads/feature/hero-search-filter","head":"d497de5f05bd35d2271ee19039107773adcc5bcd","baseRef":"refs/heads/main","baseCommit":"d497de5f05bd35d2271ee19039107773adcc5bcd","sourceTree":"ca261696e957e051dc2908e7eb3c6b66c80c65b4","absentOptional":[]} -->
