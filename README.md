# Member Portal (ya-portal-blocks)

WordPress block plugin for the Youth Apostles member portal. It puts featured
highlights, formation documents, community documents, quick actions, the community calendar, and the
Development (fundraising) section on one page that a non-technical editor
maintains in the block editor.

All content lives in block attributes on the portal page. There is no custom
post type, database table, or admin screen, and the plugin does no access
control: the existing site's member login protects the page.

## Blocks

| Block | Name | What it shows |
|---|---|---|
| Portal Hero + Search | `yamp/portal-hero-search` | Welcome header and a document search bar (decorative for now) |
| Featured | `yamp/featured` | Spotlight item beside a short list of tagged highlights |
| Quick Actions | `yamp/quick-actions` | Editable, reorderable link cards |
| Formation Documents | `yamp/formation-documents` | Stage columns plus an optional "For All Members" list of documents |
| Community Documents | `yamp/community-documents` | One card of org-wide documents |
| Community Calendar | `yamp/community-calendar` | Embedded Google Calendar (URL/ID and height are settings) |
| Development | `yamp/development` | Upcoming fundraising events, development contacts, giving buttons |

### Featured block

- **Spotlight:** tag, title, text, button label, link. No link means no
  button; an empty title hides it.
- **Items:** tag, title, detail, optional link. Untitled items are hidden;
  unlinked items are not clickable.
- **Tags:** fixed set (Event, Survey, Prayer, News), shown as small colored
  icon tiles with a screen-reader label. Unknown values show as News.
- Defaults come from the weekly email (Ministry Impact Survey, auction,
  prayer campaigns, news); editors keep them current by hand.

### Development block

- **Events:** date, title, time and location, optional link. Sorted soonest
  first; an event hides the day after its date (site timezone). Empty state:
  "No upcoming events. Check back soon."
- **Contacts:** name, title, email, initials avatar. Defaults: Fr. Jack
  Peterson, YA and Tyler Fabian, both `development@youthapostles.org`. A
  contact without a valid email shows but is not clickable.
- **Giving buttons:** Donate, Legacy Giving, Donor Portal by default; the
  first button is highlighted, and incomplete buttons are hidden.

## Patterns

Registered in `includes/patterns.php` under the "Member Portal" category:

- `yamp/community-section` - Community heading, documents (1/3) beside calendar (2/3)
- `yamp/development-section` - Development heading and intro over the Development block
- `yamp/featured-section` - Featured heading over the Featured block (place above Quick Actions)

## Development

Requires Node.js and npm. Built with `@wordpress/scripts`.

```sh
npm install
npm run start        # watch build
npm run build        # production build
npm run lint:js
npm run lint:css
npm run format
npm run plugin-zip   # package ya-portal-blocks.zip
npm run playground   # local WordPress at http://127.0.0.1:9400 (no Docker)
```

Run `npm run playground` alongside `npm run start` and refresh after each
rebuild. Playground content resets when the server stops.

No unit test runner is configured yet.

## Layout

```
ya-portal-blocks.php   plugin bootstrap, block registration, Montserrat font
includes/              shared PHP: document list, calendar URL helper, patterns
src/<block>/           one folder per block (block.json, edit.js, render.php, styles)
src/shared/            brand tokens, document-list styles, sidebar list editors
references/            redesign mockup and brand guide
blueprint/             planning docs, feature specs, and build history
```

## Deploy

Run `npm run build` then `npm run plugin-zip`, upload the zip on the target
site's Plugins screen, and activate "Member Portal". Requires WordPress 6.8+
and PHP 7.4+.

## License

GPL-2.0-or-later
