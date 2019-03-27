import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Filters from '@/views/users/components/UsersFilter'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/users')

describe('Filters users', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
  })

  it('shows local users on "Local" filter click', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue,
      stubs: {
        transition: false
      }
    })

    let usersLength = store.state.users.totalUsersCount
    expect(usersLength).toEqual(3)

    const filter = wrapper.find(`li.el-select-dropdown__item:nth-child(${1})`)
    filter.trigger('click')
    await wrapper.vm.$nextTick()
    usersLength = store.state.users.totalUsersCount
    expect(usersLength).toEqual(2)

    filter.trigger('click')
    await wrapper.vm.$nextTick()
    usersLength = store.state.users.totalUsersCount
    expect(usersLength).toEqual(2)

    done()
  })

  // it('shows local users with search query', async (done) => {
  //   const wrapper = mount(Users, {
  //     store,
  //     localVue,
  //     stubs: ['users-filter']
  //   })

  //   wrapper.vm.handleDebounceSearchInput = (query) => {
  //     store.dispatch('SearchUsers', { query, page: 1 })
  //   }

  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.vm.usersCount).toEqual(3)

  //   const checkboxInput = wrapper.find('input.el-checkbox__original')
  //   checkboxInput.trigger('click')
  //   await wrapper.vm.$nextTick()
  //   const searchInput = wrapper.find('input.el-input__inner')
  //   searchInput.element.value = 'bob'
  //   searchInput.trigger('input')
  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.vm.usersCount).toEqual(0)

  //   searchInput.element.value = 'allis'
  //   searchInput.trigger('input')
  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.vm.usersCount).toEqual(1)

  //   searchInput.element.value = ''
  //   searchInput.trigger('input')
  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.vm.usersCount).toEqual(2)

  //   checkboxInput.trigger('click')
  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.vm.usersCount).toEqual(3)

  //   done()
  // })

})
