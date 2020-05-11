import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Statuses from '@/views/statuses/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/status')
jest.mock('@/api/peers')
jest.mock('@/api/nodeInfo')

describe('Statuses', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches peers and statuses count', async (done) => {
    mount(Statuses, {
      store,
      localVue
    })

    await flushPromises()
    const statusVisibilityCount = store.state.status.statusVisibility
    expect(statusVisibilityCount.direct).toEqual(4)
    expect(statusVisibilityCount.private).toEqual(10)
    expect(statusVisibilityCount.public).toEqual(4)
    expect(statusVisibilityCount.unlisted).toEqual(10)
    done()
  })
})
