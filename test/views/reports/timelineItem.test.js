import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import TimelineItem from '@/views/reports/components/TimelineItem'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/reports')

describe('Report in a timeline', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchReports')
    await flushPromises()
  })

  it('changes report stsatus from open to resolved', async (done) => {
    const report = store.state.reports.fetchedReports[0]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })
    expect(report.state).toBe('open')

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(${1})`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[0].state).toBe('resolved')
    done()
  })

  it('changes report stsatus from open to closed', async (done) => {
    const report = store.state.reports.fetchedReports[3]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })
    expect(report.state).toBe('open')

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(${2})`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[3].state).toBe('closed')
    done()
  })
})
