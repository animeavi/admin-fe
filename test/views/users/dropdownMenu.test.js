import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import DropdownMenu from '@/views/users/components/DropdownMenu'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'
import { users } from '@/api/__mocks__/users.js'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/users')

describe('Apply users actions to multiple users', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
    global.confirm = () => true
  })

  it('calls function that grants admin and moderator rights to multiple users', async (done) => {
    const wrapper = mount(DropdownMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const grantRightToMultipleUsersStub = jest.fn()
    wrapper.setMethods({ grantRightToMultipleUsers: grantRightToMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(1)`).trigger('click')
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalledWith('admin')

    wrapper.find(`.el-dropdown-menu__item:nth-child(3)`).trigger('click')
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalledWith('moderator')
    done()
  })

  it('calls function that revokes admin and moderator rights to multiple users', async (done) => {
    const wrapper = mount(DropdownMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const revokeRightToMultipleUsersStub = jest.fn()
    wrapper.setMethods({ revokeRightToMultipleUsers: revokeRightToMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(2)`).trigger('click')
    expect(wrapper.vm.revokeRightToMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.revokeRightToMultipleUsers).toHaveBeenCalledWith('admin')

    wrapper.find(`.el-dropdown-menu__item:nth-child(4)`).trigger('click')
    expect(wrapper.vm.revokeRightToMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.revokeRightToMultipleUsers).toHaveBeenCalledWith('moderator')
    done()
  })

  it('calls function that activates, deactivates and deletes multiple accounts', async (done) => {
    const wrapper = mount(DropdownMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const activateMultipleUsersStub = jest.fn()
    wrapper.setMethods({ activateMultipleUsers: activateMultipleUsersStub })
    const deactivateMultipleUsersStub = jest.fn()
    wrapper.setMethods({ deactivateMultipleUsers: deactivateMultipleUsersStub })
    const deleteMultipleUsersStub = jest.fn()
    wrapper.setMethods({ deleteMultipleUsers: deleteMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(5)`).trigger('click')
    expect(wrapper.vm.activateMultipleUsers).toHaveBeenCalled()

    wrapper.find(`.el-dropdown-menu__item:nth-child(6)`).trigger('click')
    expect(wrapper.vm.deactivateMultipleUsers).toHaveBeenCalled()

    wrapper.find(`.el-dropdown-menu__item:nth-child(7)`).trigger('click')
    expect(wrapper.vm.deleteMultipleUsers).toHaveBeenCalled()
    done()
  })

  it('calls function that applies and removes tags from multiple accounts', async (done) => {
    const wrapper = mount(DropdownMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const addTagForMultipleUsersStub = jest.fn()
    wrapper.setMethods({ addTagForMultipleUsers: addTagForMultipleUsersStub })
    const removeTagFromMultipleUsersStub = jest.fn()
    wrapper.setMethods({ removeTagFromMultipleUsers: removeTagFromMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(8) button:nth-child(1)`).trigger('click')
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalledWith('force_nsfw')

    wrapper.find(`.el-dropdown-menu__item:nth-child(9) button:nth-child(2)`).trigger('click')
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalledWith('strip_media')

    wrapper.find(`.el-dropdown-menu__item:nth-child(10) button:nth-child(1)`).trigger('click')
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalledWith('force_unlisted')

    wrapper.find(`.el-dropdown-menu__item:nth-child(11) button:nth-child(2)`).trigger('click')
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalledWith('sandbox')

    wrapper.find(`.el-dropdown-menu__item:nth-child(12) button:nth-child(1)`).trigger('click')
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalledWith('disable_remote_subscription')

    wrapper.find(`.el-dropdown-menu__item:nth-child(13) button:nth-child(2)`).trigger('click')
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalledWith('disable_any_subscription')
    done()
  })
})
