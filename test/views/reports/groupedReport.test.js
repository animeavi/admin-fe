import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import GroupedReport from '@/views/reports/components/GroupedReport'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/reports')

describe('Grouped report', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchGroupedReports')
    await flushPromises()
  })

  it('changes state of all reports in a group', async (done) => {
    const groupedReports = store.state.reports.fetchedGroupedReports
    const wrapper = mount(GroupedReport, {
      store,
      localVue,
      propsData: {
        groupedReports
      }
    })

    expect(groupedReports[0].reports[0].state).toBe('open')
    expect(groupedReports[0].reports[1].state).toBe('resolved')

    const button = wrapper.find(`.grouped-report .el-dropdown-menu__item:nth-child(3)`)
    button.trigger('click')
    await flushPromises()

    expect(store.state.reports.fetchedGroupedReports[0].reports[0].state).toBe('closed')
    expect(store.state.reports.fetchedGroupedReports[0].reports[1].state).toBe('closed')
    done()
  })
})
