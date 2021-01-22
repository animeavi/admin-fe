import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Filters from '@/views/users/components/UsersFilter'
import flushPromises from 'flush-promises'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import userProfile from '@/store/modules/userProfile'
import users from '@/store/modules/users'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/settings')
jest.mock('@/api/users')

describe('Filters users', () => {
  let store
  let actions

  beforeEach(async() => {
    actions = { ...users.actions, ToggleUsersFilter: jest.fn(), ToggleActorTypeFilter: jest.fn() }
    store = new Vuex.Store(({ 
      modules: {
        app,
        settings,
        user,
        userProfile,
        users: { ...users, actions }
      },
      getters: {}
    }))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
  })

  it('enables local and active filters when component is mounted, toggles local filter on button click', () => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(1, expect.anything(), ['local', 'active'], undefined)

    const filter = wrapper.find(`li.el-select-dropdown__item:nth-child(${1})`)
    filter.trigger('click')

    expect(actions.ToggleUsersFilter).toHaveBeenCalled()
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalled()
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(2, expect.anything(), ['active'], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), [], undefined)
  })
})
