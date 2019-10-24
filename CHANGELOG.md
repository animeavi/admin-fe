# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased

### Changed

- moves emoji pack configuration from the main menu to settings tab, redesigns it and fixes bugs
- `mailerEnabled` must be set to `true` in order to require password reset (password reset currently only works via email)
- remove fetching initial data for configuring server settings
- Actions in users module (ActivateUsers, AddRight, DeactivateUsers, DeleteRight, DeleteUsers) now accept an array of users instead of one user
- Leave dropdown menu open after clicking an action

### Added

- Optimistic update for actions in users module and fetching users after api function finished its execution
- Relay management

### Fixed

- Show checkmarks when tag is applied

## [1.2.0] - 2019-09-27

### Added

- Emoji pack configuration
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
