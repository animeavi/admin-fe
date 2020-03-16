import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Settings from '@/views/settings/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

describe('Settings search', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('shows search input', async (done) => {
    const wrapper = mount(Settings, {
      store,
      localVue
    })

    await flushPromises()
    const searchInput = wrapper.find('.settings-search-input')
    expect(searchInput.exists()).toBe(true)
    done()
  })
})
