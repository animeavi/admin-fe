import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Settings from '@/views/settings/index'
import flushPromises from 'flush-promises'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import getters from '@/store/getters'
import _ from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/settings')

describe('Settings search', () => {
  let store
  let actions
  let appActions
  let $route
  let $router

  beforeEach(() => {
    appActions = { ...app.actions, NeedReboot: jest.fn() }
    actions = { ...settings.actions, FetchSettings: jest.fn(), GetNodeInfo: jest.fn() }
    store = new Vuex.Store({
      modules: {
        app: { ...app, actions: appActions },
        settings: { ...settings, actions },
        user: { ...user, state: { ...user.state, authHost: 'localhost:4000' }}
      },
      getters
    })
    $route = { path: '/settings/path' }
    $router = { push: jest.fn(), currentRoute: {} }
  })

  it('shows search input', async (done) => {
    const wrapper = mount(Settings, {
      store,
      mocks: {
        $route,
        $router
      },
      localVue
    })

    await flushPromises()
    const searchInput = wrapper.find('.settings-search-input')
    expect(searchInput.exists()).toBe(true)
    done()
  })

  it('changes tab when search value was selected', async (done) => {
    const wrapper = mount(Settings, {
      store,
      mocks: {
        $route,
        $router
      },
      localVue
    })
    wrapper.vm.handleSearchSelect({ group: 'Pleroma.Upload', key: 'Pleroma.Upload' })
    expect(store.state.settings.searchQuery).toBe('Pleroma.Upload')
    expect($router.push).toHaveBeenCalledWith({ path: '/settings/upload' })

    wrapper.vm.handleSearchSelect({ group: ':swoosh', key: ':serve_mailbox' })
    expect(store.state.settings.searchQuery).toBe(':serve_mailbox')
    expect($router.push).toHaveBeenCalledWith({ path: '/settings/mailer' })

    wrapper.vm.handleSearchSelect({ group: ':pleroma', key: ':admin_token' })
    expect(store.state.settings.searchQuery).toBe(':admin_token')
    expect($router.push).toHaveBeenCalledWith({ path: '/settings/instance' })

    wrapper.vm.handleSearchSelect({ group: ':media_proxy', key: ':ssl_options' })
    expect(store.state.settings.searchQuery).toBe(':ssl_options')
    expect($router.push).toHaveBeenCalledWith({ path: '/settings/media-proxy' })

    done()
  })
})
