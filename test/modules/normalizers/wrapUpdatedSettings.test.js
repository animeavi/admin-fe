import { wrapUpdatedSettings } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Wrap settings', () => {
  it('wraps values without keys with type atom', () => {
    const settings = { ':level': { _value: ['atom', 'warn'] }}
    const result = wrapUpdatedSettings(':quack', settings, {})
    const expectedResult = [{ group: ':quack', key: ':level', value: ':warn' }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps :backends setting in group :logger', () => {
    const settings = { ':backends': { _value:
      [['atom', 'tuple', 'module'], [':console', 'Quack.Logger', ':ex_syslogger']]
    }}
    const result = wrapUpdatedSettings(':logger', settings, {})
    const expectedResult = [{
      group: ':logger',
      key: ':backends',
      value: [':console', 'Quack.Logger', { 'tuple': ['ExSyslogger', ':ex_syslogger'] }]
    }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps :types setting in group :mime', () => {
    const settings = { ':types': { _value: ['map', {
      'application/ld+json': [['list', 'string'], ['activity+json']],
      'application/xml': [['list', 'string'], ['xml']],
      'application/xrd+xml': [['list', 'string'], ['xrd+xml']]
    }]}}
    const result = wrapUpdatedSettings(':mime', settings, {})
    const expectedResult = [{
      group: ':mime',
      key: ':types', value: {
        'application/ld+json': ['activity+json'],
        'application/xml': ['xml'],
        'application/xrd+xml': ['xrd+xml']
      }
    }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })
})
