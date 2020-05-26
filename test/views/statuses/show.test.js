import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import StatusShow from '@/views/statuses/show'
import storeConfig from './statusShowStore.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

const $route = {
  params: {
    id: '9vJOO3iFPyjNaEhJ5s'
  }
}

jest.mock('@/api/app')
jest.mock('@/api/status')
jest.mock('@/api/peers')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/users')

describe('Status show page', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it(`fetches single status and user's statuses`, async (done) => {
    const wrapper = mount(StatusShow, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link'],
      mocks: {
        $route
      }
    })
    await flushPromises()

    expect(wrapper.find('.status-container').isVisible()).toBe(true)
    expect(store.state.status.fetchedStatus.id).toBe('9vJOO3iFPyjNaEhJ5s')
    expect(store.state.status.fetchedStatus.account.display_name).toBe('dolin')
    expect(store.state.userProfile.statuses.length).toEqual(3)
    done()
  })
})
