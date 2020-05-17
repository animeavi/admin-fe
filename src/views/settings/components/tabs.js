export const tabs = {
  'activity-pub': {
    label: 'settings.activityPub',
    settings: [':activitypub', ':user']
  },
  'authentication': {
    label: 'settings.auth',
    settings: [':auth', ':ldap', ':oauth2', 'Pleroma.Web.Auth.Authenticator']
  },
  'auto-linker': {
    label: 'settings.autoLinker',
    settings: [':opts']
  },
  'esshd': {
    label: 'settings.esshd',
    settings: [':esshd']
  },
  'captcha': {
    label: 'settings.captcha',
    settings: ['Pleroma.Captcha', 'Pleroma.Captcha.Kocaptcha']
  },
  'frontend': {
    label: 'settings.frontend',
    settings: [':assets', ':chat', ':emoji', ':frontend_configurations', ':markup', ':static_fe']
  },
  'gopher': {
    label: 'settings.gopher',
    settings: [':gopher']
  },
  'http': {
    label: 'settings.http',
    settings: [':cors_plug', ':http', ':http_security', ':web_cache_ttl']
  },
  'instance': {
    label: 'settings.instance',
    settings: [':admin_token', ':instance', ':manifest', 'Pleroma.User', 'Pleroma.ScheduledActivity', ':uri_schemes', ':feed', ':streamer']
  },
  'job-queue': {
    label: 'settings.jobQueue',
    settings: ['Pleroma.ActivityExpiration', 'Oban', ':workers']
  },
  'logger': {
    label: 'settings.logger',
    settings: [':console', ':ex_syslogger', ':quack', ':logger']
  },
  'mailer': {
    label: 'settings.mailer',
    settings: [':email_notifications', 'Pleroma.Emails.Mailer', 'Pleroma.Emails.UserEmail', ':swoosh', 'Pleroma.Emails.NewUsersDigestEmail']
  },
  'media-proxy': {
    label: 'settings.mediaProxy',
    settings: [':media_proxy']
  },
  'metadata': {
    label: 'settings.metadata',
    settings: ['Pleroma.Web.Metadata', ':rich_media']
  },
  'mrf': {
    label: 'settings.mrf',
    settings: [':mrf_simple', ':mrf_rejectnonpublic', ':mrf_hellthread', ':mrf_keyword', ':mrf_subchain', ':mrf_mention', ':mrf_normalize_markup', ':mrf_vocabulary', ':mrf_object_age', ':modules']
  },
  'rate-limiters': {
    label: 'settings.rateLimiters',
    settings: [':rate_limit']
  },
  'relays': {
    label: 'settings.relays',
    settings: ['relays']
  },
  'web-push': {
    label: 'settings.webPush',
    settings: [':vapid_details']
  },
  'upload': {
    label: 'settings.upload',
    settings: ['Pleroma.Upload.Filter.AnonymizeFilename', 'Pleroma.Upload.Filter.Mogrify', 'Pleroma.Uploaders.S3', 'Pleroma.Uploaders.Local', 'Pleroma.Upload']
  },
  'other': {
    label: 'settings.other',
    settings: [':mime', 'Pleroma.Plugs.RemoteIp']
  }
}
