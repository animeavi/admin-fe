import Vuex from 'vuex'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Element from 'element-ui'
import Users from '@/views/users/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/users')

describe('Users', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches initial list of users', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)
    done()
  })

  it('toggles activation status on button click', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue
    })
    await wrapper.vm.$nextTick()

    const user = store.state.users.fetchedUsers[1]
    expect(user.deactivated).toBe(false)

    wrapper.find('.el-table__fixed-body-wrapper table tr:nth-child(2) button').trigger('click')
    await wrapper.vm.$nextTick()

    const updatedUser = store.state.users.fetchedUsers[1]
    expect(updatedUser.deactivated).toBe(true)
    done()
  })

  it('starts a search on input change', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue
    })

    wrapper.vm.handleDebounceSearchInput = (query) => {
      store.dispatch('SearchUsers', { query, page: 1 })
    }

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)

    const input = wrapper.find('input.el-input__inner')
    input.element.value = 'bob'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(1)

    input.element.value = ''
    input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)

    done()
  })

  it('shows local users on checkbox click', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)

    const input = wrapper.find('input.el-checkbox__original')
    input.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(2)

    input.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)

    done()
  })

  it('shows local users with query search', async (done) => {
    const wrapper = mount(Users, {
      store,
      localVue
    })

    wrapper.vm.handleDebounceSearchInput = (query) => {
      store.dispatch('SearchUsers', { query, page: 1 })
    }

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)

    const checkboxInput = wrapper.find('input.el-checkbox__original')
    checkboxInput.trigger('click')
    await wrapper.vm.$nextTick()
    const searchInput = wrapper.find('input.el-input__inner')
    searchInput.element.value = 'bob'
    searchInput.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(0)

    searchInput.element.value = 'allis'
    searchInput.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(1)

    searchInput.element.value = ''
    searchInput.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(2)

    checkboxInput.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.usersCount).toEqual(3)

    done()
  })
})
