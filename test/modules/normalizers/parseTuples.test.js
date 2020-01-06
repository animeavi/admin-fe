import { parseTuples } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Parse tuples', () => {
  it('parse tuples', () => {
    const tuples = [
      { tuple: [":enabled", false]},
      { tuple: [":host", "localhost"]},
      { tuple: [":port", 389]},
      { tuple: [':tlsopts', ['test', 'test1']]},
      { tuple: [':sslopts', [{ tuple: [":cacertfile", "path/to/file"] }, { tuple: [":verify", ":verify_peer"] }]]}
    ]
    const expectedResult = {
      ':enabled': false,
      ':host': 'localhost',
      ':port': 389,
      ':tlsopts': ['test', 'test1'],
      ':sslopts': { ':cacertfile': "path/to/file", ':verify': ":verify_peer" }
    }

    const result = parseTuples(tuples, ':ldap')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse rate limiters', () => {
    const tuples = [
      { tuple: [':authentication', { tuple: [60000, 15] }]},
      { tuple: [':app_account_creation', [{ tuple: [100, 55] }, { tuple: [150, 10] }]]}
    ]
    const expectedResult = {
      ':authentication': [60000, 15],
      ':app_account_creation': [[100, 55], [150, 10]]
    }

    const result = parseTuples(tuples, ':rate_limit')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse icons', () => {
    const tuples = [
      { tuple: [':icons', [
        { ':src': '/static/logo.png', ':type': 'image/png' },
        { ':icon': '/test/test.png'}
      ]]}
    ]
    const expectedResult = [
      [{ key: ':src', value: '/static/logo.png' }, { key: ':type', value: 'image/png' }],
      [{ key: ':icon', value: '/test/test.png' }]
    ]

    const parsed = parseTuples(tuples, ':manifest')
    expect(typeof parsed).toBe('object')
    expect(':icons' in parsed).toBeTruthy()
    expect('id' in parsed[':icons'][0][0]).toBeTruthy()

    const result = parsed[':icons'].map(icon => {
      const iconWithoutId = icon.map(el => {
        const { id, ...rest } = el
        return rest
      })
      return iconWithoutId
    })
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse retries', () => {
    const tuples = [
      { tuple: [':retries', [
        { tuple: [":federator_incoming", 5] },
        { tuple: [":federator_outgoing", 10] }
      ]]}
    ]

    const parsed = parseTuples(tuples, ':workers')
    expect(typeof parsed).toBe('object')
    expect(':retries' in parsed).toBeTruthy()
    expect(Array.isArray(parsed[':retries'])).toBeTruthy()
    expect(':federator_incoming' in parsed[':retries'][0]).toBeTruthy()
    expect('id' in parsed[':retries'][0][':federator_incoming']).toBeTruthy()
    expect(parsed[':retries'][0][':federator_incoming']['value']).toEqual(5)
  })

  it('parse objects', () => {
    const tuples = [
      { tuple: [":pleroma_fe", { ':alwaysShowSubjectInput': true, ':redirectRootNoLogin': "/main/all" }]},
      { tuple: [":masto_fe", { ':showInstanceSpecificPanel': true }]}
    ]
    const expectedResult = {
      ':masto_fe': { ':showInstanceSpecificPanel': true },
      ':pleroma_fe': { ':alwaysShowSubjectInput': true, ':redirectRootNoLogin': "/main/all" }
    }

    const result = parseTuples(tuples, ":frontend_configurations")
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })
})
