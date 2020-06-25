# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased

### Added

- Create `/statuses/:id` route that shows single status
- Add link to the user's account in Pleroma on the user's profile page
- On Reports page add links to reported account and the author of the report 
- In Notes add link to the note author's profile page 
- In Moderation log add link to the actor's profile page
- Adds MRF Activity Expiration setting

### Changed

- Statuses count changes when an instance is selected and shows the amount of statuses from an originating instance
- Add a dialog window with a confirmation when a remove button is clicked on the Settings page
- Disable tab on the Settings page if there are no settings on this tab that can be changed in Admin FE
- Settings that can't be altered in Admin FE are removed: HTTP Signatures settings, Federation publisher modules and Oban Repo
- When rendering user's profile, statuses, reports and notes check if required properties exist
- Remove ability to moderate users that don't have valid nickname
- Displays both labels and description in the header of group of settiings
- Ability to add custom values in Pleroma.Upload.Filter.Mogrify setting

### Fixed

- Send `true` and `false` as booleans if they are values of single selects on the Settings page
- Fix sorting users on Users page if there is an acount with missing nickname or ID

## [2.0.3] - 2020-04-29

### Added

- Link settings that enable registrations and invites

### Changed

- Put Instance Reboot button on all pages of admin-fe
- Make Instance Reboot button's positon fixed on Settings page
- Update jest and babel-jest
- Generate an invite link when an invite token has been generated
- Put labels on top of inputs in mobile version
- Shorten suggestions for a series of select inputs: Rewrite policy, Pleroma Authenticator, Captcha Method, Mailer adapter, Metadata providers, Rich Media parsers, TTL setters, Scrub policy, Uploader, Filters and Federation publisher modules

### Fixed

- Disable Invites tab when invites are disabled on BE

## [2.0.2] - 2020-04-01

### Added

- Ability to see local statuses in Statuses by instance section
- Ability to configure Oban.Cron settings and settings for notifications streamer
- Settings search
- Ability to set user's password and email on user's page
- Display status count by scope on Statuses page

### Changed

- Link to Pleroma docs when a non-admin user tries to log in 

### Fixed

- Fix parsing tuples in Pleroma.Upload.Filter.Mogrify and Pleroma.Emails.Mailer settings
- Fix settings submit button position on wide screens when sidebar menu is open
- Updates links for downloading remote emoji packs
- Fix parsing emails that have symbols in it

## [2.0] - 2020-02-27

### Added

- Optimistic update for actions in users module and fetching users after api function finished its execution
- Relay management
- Ability to fetch all statuses from a given instance
- Ability to confirm users' emails and resend confirmation emails
- Report notes
- Ability to moderate users on the statuses page
- Ability to moderate user on the user's page
- Ability to remove setting's updated value and set it back to initial value
- Ability to restart an application when settings that require instance reboot were changed
- Mobile and Tablet UI for all sections

### Changed

- **breaking** PleromaFE login feature relies on `admin` scope presence in PleromaFE token (older versions of PleromaFE don't support it)
- `mailerEnabled` must be set to `true` in order to require password reset (password reset currently only works via email)
- Render inputs for configuring settings based on description that comes from the BE
- Remove fetching initial data for configuring server settings
- Actions in users module (ActivateUsers, AddRight, DeactivateUsers, DeleteRight, DeleteUsers) now accept an array of users instead of one user
- Leave dropdown menu open after clicking an action
- Display checkboxes in status card and fetch statuses only when status card was rendered from Statuses by instance page
- Move statuses by instance state from local state to store state

### Fixed

- Show checkmarks when tag is applied
- Reports update (also, now it's optimistic)
- Remove duplicated success message
- Fix styles for Statuses by instance page
- Fix styles for Reports section
- Fix listing remote emoji

## [1.2.0] - 2019-09-27

### Added

- Emoji pack configuration
- Statuses page: fetch all statuses from a given instance
- Ability to require user's password reset
– Ability to track admin/moderator actions, a.k.a. "the moderation log"

## [1.1.0] - 2019-09-15

### Added

- adds ability to configure new settings (UploadS3 bucket namespace, Rate limit for Activity pub routes, Email notifications settings, MRF Vocabulary, user bio and name length and others)
- adds ability to disable certain features (settings/reports/invites)
- adds sign in via PleromaFE
- adds ability to generate invite tokens and list them on a separate tab
- adds ability to invite users via email
- adds ability to reset users passwords
- adds tests for invites and resetting password

### Changed

- removes "Dashboard" from dropdown menu
- makes all single selects clearable and allow to enter custom values in all multiple selects
- removes legacy activitypub accept_blocks setting

### Fixed

- converts maps and structs to JS objects, not array of tuples when wrapping config
- changes type of IP value from string to number
- updates error handling for users and invites modules

## [1.0.1] - 2019-08-15

### Fixed

- fixes inputs for renders_errors and rewrite_policy settings
- removes unnecessary computed properties
- enables source maps for production build

## [1.0.0] - 2019-08-14

Starting this changelog, for now we have:

- User management system
- Reports management
- Pleroma configuration (unstable)
