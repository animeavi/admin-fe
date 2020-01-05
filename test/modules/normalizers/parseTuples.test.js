import { parseTuples } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Parse tuples', () => {
  it('parse tuples', () => {
    //string, boolean, int, array
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

    const result = parsed[':icons'].map(icon => {
      const iconWithoutId = icon.map(el => {
        const { id, ...rest } = el
        return rest
      })
      return iconWithoutId
    })
    expect(_.isEqual(expectedResult, result)).toBeTruthy()
  })
})
