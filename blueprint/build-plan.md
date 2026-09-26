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

- [ ] 1. **Membership stage roles** - add Prospective/Candidate/Full Member WP
      roles (or capability) and a way for admins to assign a member's stage
- [ ] 2. **Formation document library** - custom post type or taxonomy
      wrapping Media Library uploads, storing stage assignment, display title,
      and type badge (PDF/FORM/DOC/AUDIO)
- [ ] 3. **Portal hero + search block** - welcome header and document search
      across the library from feature 2
- [ ] 4. **Quick actions block** - update contact info, member directory,
      birthdays & anniversaries, request logos (mailto)
- [ ] 5. **Formation Documents block** - stage-column layout (Prospective /
      Candidate / Full Member) reading from the document library, scoped to
      what the viewer's stage can see
- [ ] 6. **Community Documents block** - org-wide document list (contact list,
      stats, statutes, guidelines, branding guide) from the same library
- [ ] 7. **Community Calendar block** - embedded Google Calendar for
      birthdays/anniversaries/events
- [ ] 8. **Access control** - gate the portal page/blocks to logged-in members
      only, with a sensible logged-out state
- [ ] 9. **Member directory page** - full member directory with contact info,
      built on the roles from feature 1
