import { checkPartialUpdate } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Partial update', () => {
  it('partial update for settings that do not allow partial update', () => {
    const settings = { ':auto_linker': { ':opts':
      { ':strip_prefix': true, ':new_window': false, ':rel': 'ugc', ':truncate': 3 }
    }}
    const updatedSettings = { ':auto_linker': { ':opts': { ':new_window': false }}}
    const description = [{
      children: [
        { key: ':strip_prefix', type: 'boolean' },
        { key: ':truncate', type: ['integer', false] },
        { key: ':new_window', type: 'boolean' }],
      description: 'Configuration for the auto_linker library',
      group: ':auto_linker',
      key: ':opts',
      label: 'Opts',
      type: 'group'
    }]

    const expectedData = { ':auto_linker': { ':opts': {
      ':strip_prefix': ['boolean', true],
      ':new_window': ['boolean', false],
      ':rel': ['', 'ugc'],
      ':truncate': [['integer', false], 3]
    }}}
    const updatedData = checkPartialUpdate(settings, updatedSettings, description)
    expect(_.isEqual(updatedData, expectedData)).toBeTruthy()
  })

  it('partial update for settings that allow partial update', () => {
    const settings = { ':pleroma': { 'Pleroma.Captcha': { ':enabled': true, ':seconds_valid': 70, ':method': 'Pleroma.Captcha.Kocaptcha' }}}
    const updatedSettings = { ':pleroma': { 'Pleroma.Captcha': { ':seconds_valid': ['integer', 70] }}}
    const description = [{
      children: [],
      description: 'Captcha-related settings',
      group: ':pleroma',
      key: 'Pleroma.Captcha',
      label: 'Pleroma.Captcha',
      type: 'group'
    }]

    const expectedData = { ':pleroma': { 'Pleroma.Captcha': { ':seconds_valid': ['integer', 70] }}}
    const updatedData = checkPartialUpdate(settings, updatedSettings, description)
    expect(_.isEqual(updatedData, expectedData)).toBeTruthy()
  })
})
