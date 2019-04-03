import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Reports from '@/views/reports/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

// jest.mock('@/api/reports')

describe('Reports', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('initially fetches reports', async (done) => {
    const wrapper = mount(Reports, {
      store,
      localVue
    })

    await wrapper.vm.$nextTick()
    const initialReports = store.state.reports.fetchedReports.length
    expect(initialReports).toEqual(3)
    done()
  })

  it('shows notes', () => {
    const wrapper = mount(Reports, {
      store,
      localVue
    })

    const note = wrapper.find('.el-collapse-item__content')
    expect(note.isVisible()).toBe(false)

    const button = wrapper.find('.el-collapse-item__header')
    button.trigger('click')
    expect(note.isVisible()).toBe(true)

    button.trigger('click')
    expect(note.isVisible()).toBe(false)
  })
})
