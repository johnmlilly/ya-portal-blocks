=== Member Portal Blocks ===
Contributors:      John Lilly
Tags:              block, member portal, documents, calendar
Requires at least: 6.8
Tested up to:      6.8
Requires PHP:      7.4
Stable tag:        1.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Blocks for the Youth Apostles member portal: featured highlights, formation and community documents, quick actions, the community calendar, and fundraising.

== Description ==

Member Portal Blocks gives Youth Apostles members one page with everything they need: featured highlights, formation documents for each stage, community documents, quick links, the community calendar, and the Development (fundraising) section.

Every block keeps its content in its own settings. A site editor drops the blocks onto the portal page and edits titles, links, and lists in the block sidebar. There is no custom post type, database table, or separate admin screen. Every logged-in member sees the same content; the site's existing login requirement controls access, not this plugin.

Blocks (all in the Widgets category):

* **Portal Hero + Search** - welcome header with a search box that filters the whole portal page as you type.
* **Featured** - one spotlight item beside a short list of highlights such as the Ministry Impact Survey, the auction, prayer campaigns, and community news. Each item has a tag (Event, Survey, Prayer, or News) shown as a small colored icon.
* **Quick Actions** - editable, reorderable link cards (update contact info, member directory, birthdays and anniversaries, request logos).
* **Formation Documents** - stage columns (Prospective, Candidate, Full Member by default; add, remove, reorder) plus an optional "For All Members" list. Each document has a title, type (PDF, form, doc, audio), and link.
* **Community Documents** - one card listing org-wide documents, with the same document rows.
* **Community Calendar** - an embedded Google Calendar; the calendar URL or ID and height are block settings.
* **Development** - upcoming fundraising events beside the development office contacts and Donate, Legacy Giving, and Donor Portal buttons.

Development block details:

* Events have a date, title, time and location, and an optional link. They sort soonest first and drop off the day after their date (site timezone). With no upcoming events the card shows "No upcoming events. Check back soon."
* Contacts have a name, title, and email, and show initials in a circle. They default to Fr. Jack Peterson, YA (Director of Mission and Development) and Tyler Fabian (Senior Development Officer), both at development@youthapostles.org.
* The first giving button is highlighted. Buttons missing a label or link are hidden.

Search details:

* Typing in the hero search box hides documents, events, quick actions, featured items, contacts, and giving buttons that don't match, along with any card or block left empty. Matching ignores case and accents.
* The embedded calendar hides while a search is active, since its contents can't be searched.
* A line under the box shows the number of matches, or "Nothing on this page matches" when there are none. Clearing the box restores the page.
* Search runs in the browser on the live page only; it has no settings and does not search inside document files.

Featured block details:

* The spotlight has a tag, title, text, button label, and link. Without a link it shows without a button; with an empty title it is hidden.
* List items have a tag, title, detail line, and optional link. Items without a title are hidden; items without a link are shown but not clickable.
* If only the spotlight or only the list has content, it spans the full width.

Block patterns (Member Portal category):

* **Community section** - "Community" heading over Community Documents (1/3) beside the Community Calendar (2/3).
* **Development section** - "Development" heading and intro over the Development block.
* **Featured section** - "Featured" heading over the Featured block, for placing above Quick Actions.

== Installation ==

1. Upload the plugin zip through Plugins > Add New > Upload Plugin, or copy the plugin folder to `/wp-content/plugins/ya-portal-blocks`.
2. Activate "Member Portal Blocks" on the Plugins screen.
3. Edit the portal page, add the blocks or patterns from the Member Portal category, and fill in their content in the block sidebar.

== Frequently Asked Questions ==

= Who can see the portal? =

Whoever can see the page it is on. The plugin does no access checks of its own; the site's member login protects the portal page.

= Does the search look inside documents? =

No. It matches the text shown on the portal page, such as document titles, event details, and contact names.

= How do I change the featured items? =

Select the Featured block. Edit the Spotlight panel for the main item and the Items panel for the list (add, reorder, or remove items, and pick a tag for each). Featured items do not expire on their own, so remove them when they are out of date.

= How do I add a fundraising event? =

Select the Development block, open Events in the sidebar, and choose Add event. Set the date with the date picker. Past events hide automatically, so there is nothing to clean up.

= Where do the document files live? =

Anywhere with a link. Paste a URL, or upload the file to the Media Library and use its link.

== Changelog ==

= 1.1.0 =
* Featured block and Featured section pattern: a spotlight item beside a short list of tagged highlights.
* Hero search now filters the whole portal page as you type.

= 1.0.0 =
* Portal Hero + Search block.
* Quick Actions block.
* Formation Documents block.
* Community Documents block.
* Community Calendar block and Community section pattern.
* Development block and Development section pattern.
