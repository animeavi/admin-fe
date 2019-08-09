export const initialSettings = [
  {
    group: 'pleroma',
    key: ':instance',
    value: [
      { 'tuple': [':name', 'Pleroma'] },
      { 'tuple': [':email', 'example@example.com'] },
      { 'tuple': [':notify_email', 'noreply@example.com'] },
      { 'tuple': [':description', 'A Pleroma instance, an alternative fediverse server'] },
      { 'tuple': [':limit', 5000] },
      { 'tuple': [':remote_limit', 100000] },
      { 'tuple': [':upload_limit', 16 * 1048576] },
      { 'tuple': [':avatar_upload_limit', 2 * 1048576] },
      { 'tuple': [':background_upload_limit', 4 * 1048576] },
      { 'tuple': [':banner_upload_limit', 4 * 1048576] },
      { 'tuple': [':poll_limits', [
        { 'tuple': [':max_options', 20] },
        { 'tuple': [':max_option_chars', 200] },
        { 'tuple': [':min_expiration', 0] },
        { 'tuple': [':max_expiration', 365 * 86400] }
      ]] },
      { 'tuple': [':registrations_open', true] },
      { 'tuple': [':invites_enabled', false] },
      { 'tuple': [':account_activation_required', false] },
      { 'tuple': [':federating', true] },
      { 'tuple': [':federation_reachability_timeout_days', 7] },
      { 'tuple':
        [':federation_publisher_modules', ['Pleroma.Web.ActivityPub.Publisher', 'Pleroma.Web.Websub', 'Pleroma.Web.Salmon']] },
      { 'tuple': [':allow_relay', true] },
      { 'tuple': [':rewrite_policy', 'Pleroma.Web.ActivityPub.MRF.NoOpPolicy'] },
      { 'tuple': [':public', true] },
      { 'tuple': [':managed_config', true] },
      { 'tuple': [':static_dir', 'instance/static/'] },
      { 'tuple': [':allowed_post_formats', ['text/plain', 'text/html', 'text/markdown', 'text/bbcode']] },
      { 'tuple': [':mrf_transparency', true] },
      { 'tuple': [':extended_nickname_format', false] },
      { 'tuple': [':max_pinned_statuses', 1] },
      { 'tuple': [':no_attachment_links', false] },
      { 'tuple': [':max_report_comment_size', 1000] },
      { 'tuple': [':safe_dm_mentions', false] },
      { 'tuple': [':healthcheck', false] },
      { 'tuple': [':remote_post_retention_days', 90] },
      { 'tuple': [':skip_thread_containment', true] },
      { 'tuple': [':limit_to_local_content', ':unauthenticated'] },
      { 'tuple': [':dynamic_configuration', true] }
    ]
  },
  {
    group: 'mime',
    key: ':types',
    value: {
      'application/activity+json': ['activity+json'],
      'application/jrd+json': ['jrd+json'],
      'application/ld+json': ['activity+json'],
      'application/xml': ['xml'],
      'application/xrd+xml': ['xrd+xml']
    }
  },
  {
    group: 'cors_plug',
    key: ':max_age',
    value: 86400
  },
  {
    group: 'cors_plug',
    key: ':methods',
    value: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH', 'OPTIONS']
  },
  {
    group: 'cors_plug',
    key: ':expose',
    value: [
      'Link',
      'X-RateLimit-Reset',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-Request-Id',
      'Idempotency-Key'
    ]
  },
  {
    group: 'cors_plug',
    key: ':credentials',
    value: true
  },
  {
    group: 'cors_plug',
    key: ':headers',
    value: ['Authorization', 'Content-Type', 'Idempotency-Key']
  },
  {
    group: 'tesla',
    key: ':adapter',
    value: 'Tesla.Adapter.Hackney'
  },
  {
    group: 'pleroma',
    key: ':markup',
    value: [
      { 'tuple': [':allow_inline_images', true] },
      { 'tuple': [':allow_headings', false] },
      { 'tuple': [':allow_tables', false] },
      { 'tuple': [':allow_fonts', false] },
      { 'tuple': [':scrub_policy', [
        'Pleroma.HTML.Transform.MediaProxy',
        'Pleroma.HTML.Scrubber.Default'
      ]] }
    ]
  }
]
