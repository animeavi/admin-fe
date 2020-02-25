import _ from 'lodash'

export const tabs = {
  'activity-pub': {
    label: 'settings.activityPub',
    activitypub: () => this.settings.description.find(setting => setting.key === ':activitypub'),
    activitypubData: () => _.get(this.settings.settings, [':pleroma', ':activitypub']) || {},
    user: () => this.settings.description.find(setting => setting.key === ':user'),
    userData: () => _.get(this.settings.settings, [':pleroma', ':user']) || {}
  },
  'authentication': {
    label: 'settings.auth'
  },
  'auto-linker': {
    label: 'settings.autoLinker'
  },
  'esshd': {
    label: 'settings.esshd'
  },
  'captcha': {
    label: 'settings.captcha'
  },
  'frontend': {
    label: 'settings.frontend'
  },
  'gopher': {
    label: 'settings.gopher'
  },
  'http': {
    label: 'settings.http'
  },
  'instance': {
    label: 'settings.instance'
  },
  'job-queue': {
    label: 'settings.jobQueue'
  },
  'logger': {
    label: 'settings.logger'
  },
  'mailer': {
    label: 'settings.mailer'
  },
  'media-proxy': {
    label: 'settings.mediaProxy'
  },
  'metadata': {
    label: 'settings.metadata'
  },
  'mrf': {
    label: 'settings.mrf'
  },
  'rate-limiters': {
    label: 'settings.rateLimiters'
  },
  'relays': {
    label: 'settings.relays'
  },
  'web-push': {
    label: 'settings.webPush'
  },
  'upload': {
    label: 'settings.upload'
  },
  'other': {
    label: 'settings.other'
  }
}
