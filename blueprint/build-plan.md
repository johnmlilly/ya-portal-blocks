# Build Plan

List the features that make up your project, high level and in rough build order.
Keep each item to one line; the details come later in `/feature`.

Plain bullets are fine. When both planning docs are ready, run `/overview`.
It adds tracking numbers and checkboxes to your feature list before generating
the project overview.

Run `/feature` to spec the next unchecked item, or `/feature 2` to pick one.
Keep completed items checked and append new features as the project grows.
Do not renumber completed features; their archived specs refer to those IDs.

Scaffolding the app and prototyping its look are pre-build steps, not features.
Start with your first real slice of functionality.

## Your features

Every block below owns its real, final content as editable block attributes -
a non-technical admin fills them in directly in the WordPress page editor
(drop the block on the page, type/paste titles and links). No custom post
type, database, or membership-stage roles anywhere in this plan: every
logged-in member sees the same content.

- [ ] 1. **Portal hero + search block** - welcome header and a document search
      field (decorative for now - no backing data source to search yet)
- [ ] 2. **Quick actions block** - update contact info, member directory,
      birthdays & anniversaries, request logos (mailto)
- [ ] 3. **Formation Documents block** - three columns (Prospective /
      Candidate / Full Member), each an editable list of documents
      (title + link + PDF/FORM/DOC/AUDIO badge), same for every viewer
- [ ] 4. **Community Documents block** - org-wide editable document list
      (contact list, stats, statutes, guidelines, branding guide)
- [ ] 5. **Community Calendar block** - embedded Google Calendar; the
      calendar URL/ID is a field on the block, editable in the page editor
- [ ] 6. **Access control** - gate the portal page/blocks to logged-in members
      only, with a sensible logged-out state
- [ ] 7. **Member directory page** - member directory built on WordPress's own
      user list and profile fields (no custom stage/role data)
