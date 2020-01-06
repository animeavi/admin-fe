import { parseTuples } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Parse tuples', () => {
  it('parse tuples', () => {
    const tuples = [
      { tuple: [':enabled', false]},
      { tuple: [':host', 'localhost']},
      { tuple: [':port', 389]},
      { tuple: [':tlsopts', ['test', 'test1']]},
      { tuple: [':sslopts', [{ tuple: [':cacertfile', 'path/to/file'] }, { tuple: [':verify', ':verify_peer'] }]]}
    ]
    const expectedResult = {
      ':enabled': false,
      ':host': 'localhost',
      ':port': 389,
      ':tlsopts': ['test', 'test1'],
      ':sslopts': { ':cacertfile': 'path/to/file', ':verify': ':verify_peer' }
    }

    const result = parseTuples(tuples, ':ldap')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse rate limiters setting', () => {
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

  it('parse icons setting', () => {
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

  it('parse retries setting', () => {
    const tuples = [
      { tuple: [':retries', [
        { tuple: [':federator_incoming', 5] },
        { tuple: [':federator_outgoing', 10] }
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
      { tuple: [':pleroma_fe', { ':alwaysShowSubjectInput': true, ':redirectRootNoLogin': '/main/all' }]},
      { tuple: [':masto_fe', { ':showInstanceSpecificPanel': true }]}
    ]
    const expectedResult = {
      ':masto_fe': { ':showInstanceSpecificPanel': true },
      ':pleroma_fe': { ':alwaysShowSubjectInput': true, ':redirectRootNoLogin': '/main/all' }
    }

    const result = parseTuples(tuples, ':frontend_configurations')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse ip', () => {
    const tuples = [
      { tuple: [':enabled', false]},
      { tuple: [':ip', { tuple: [0, 0, 0, 0] }]}
    ]
    const expectedResult = { ':enabled': false, ':ip': '0.0.0.0' }

    const result = parseTuples(tuples, ':gopher')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse prune setting that is a tuple', () => {
    const tuples = [
      { tuple: [':verbose', false]},
      { tuple: [':prune', { tuple: [':maxlen', 1500] }]},
      { tuple: [':queues', [
        { tuple: [':activity_expiration', 10]},
        { tuple: [':federator_incoming', 50]}
      ] ]}
    ]
    const expectedResult = {
      ':verbose': false,
      ':prune': [':maxlen', 1500],
      ':queues': { ':activity_expiration': 10, ':federator_incoming': 50 } }

    const result = parseTuples(tuples, 'Oban')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse prune setting that is an atom', () => {
    const tuples = [{ tuple: [':prune', ':disabled' ]}]
    const expectedResult = { ':prune': [':disabled'] }

    const result = parseTuples(tuples, 'Oban')
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse mrf_keyword settings', () => {
    const tuples = [
      { tuple: [':reject', ['foo', '~r/foo/iu'] ]},
      { tuple: [':replace', [{ tuple: ['pattern', 'replacement']}, { tuple: ['foo', 'bar']}]]}
    ]
    const expectedResult = {
      ':reject': ['foo', '~r/foo/iu'],
      ':replace': [{ 'pattern': { value:'replacement' }}, { 'foo': { value:'bar' }}]
    }

    const parsed = parseTuples(tuples, ':mrf_keyword')
    expect(typeof parsed).toBe('object')
    expect(':reject' in parsed).toBeTruthy()
    expect(':replace' in parsed).toBeTruthy()

    const result = { ...parsed, ':replace': parsed[':replace'].map(el => {
      const key = Object.keys(el)[0]
      const { id, ...rest } = el[key]
      return { [key]: rest }
    })}
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse assets settings', () => {
    const tuples = [
      { tuple: [':mascots', [
        { tuple: [':pleroma_fox_tan', { ':mime_type': 'image/png', ':url': '/images/pleroma-fox-tan-smol.png'}]},
        { tuple: [':pleroma_fox_tan_shy', { ':mime_type': 'image/png', ':url': '/images/pleroma-fox-tan-shy.png'}]}
      ]]},
      { tuple: [':default_mascot', ':pleroma_fox_tan']}
    ]
    const expectedResult = {
      ':default_mascot': ':pleroma_fox_tan',
      ':mascots': [
        { ':pleroma_fox_tan': { ':mime_type': 'image/png', ':url':'/images/pleroma-fox-tan-smol.png' }},
        { ':pleroma_fox_tan_shy': { ':mime_type': 'image/png', ':url':'/images/pleroma-fox-tan-shy.png' }}]
    }

    const parsed = parseTuples(tuples, ':assets')
    expect(typeof parsed).toBe('object')
    expect(':default_mascot' in parsed).toBeTruthy()
    expect(':mascots' in parsed).toBeTruthy()

    const result = { ...parsed, ':mascots': parsed[':mascots'].map(el => {
      const key = Object.keys(el)[0]
      const { id, ...rest } = el[key]
      return { [key]: rest }
    })}
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse groups setting in emoji group', () => {
    const tuples = [{ tuple: [':groups', [{ tuple: [':Custom', ['/emoji/*.png', '/emoji/**/*.png']]}]]}]
    const expectedResult = { ':groups': [{ ':Custom': { value: ['/emoji/*.png', '/emoji/**/*.png']}}] }

    const parsed = parseTuples(tuples, ':emoji')

    expect(typeof parsed).toBe('object')
    expect(':groups' in parsed).toBeTruthy()
    const result = { ...parsed, ':groups': parsed[':groups'].map(el => {
      const key = Object.keys(el)[0]
      const { id, ...rest } = el[key]
      return { [key]: rest }
    })}
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })

  it('parse match_actor setting in mrf_subchain group', () => {
    const tuples = [{ tuple: [":match_actor",
      { '~r/https:\/\/example.com/s': ["Elixir.Pleroma.Web.ActivityPub.MRF.DropPolicy"]}]}]
    const expectedResult = { ":match_actor":
      [{ '~r/https:\/\/example.com/s': { value: ["Elixir.Pleroma.Web.ActivityPub.MRF.DropPolicy"] }}]}

    const parsed = parseTuples(tuples, ':mrf_subchain')

    expect(typeof parsed).toBe('object')
    expect(':match_actor' in parsed).toBeTruthy()
    const result = { ...parsed, ':match_actor': parsed[':match_actor'].map(el => {
      const key = Object.keys(el)[0]
      const { id, ...rest } = el[key]
      return { [key]: rest }
    })}
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })
})
