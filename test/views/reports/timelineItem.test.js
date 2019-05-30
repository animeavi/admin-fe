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

  it('changes report state from open to resolved', async (done) => {
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

  it('changes report state from open to closed', async (done) => {
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

  it('shows statuses', () => {
    const report = store.state.reports.fetchedReports[4]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })

    const statuses = wrapper.findAll(`.status-card`)
    expect(statuses.length).toEqual(2)
  })

  it('adds sensitive flag to a status', async (done) => {
    const report = store.state.reports.fetchedReports[4]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })
    expect(report.statuses[0].sensitive).toBe(false)

    const button = wrapper.find(`.status-card li.el-dropdown-menu__item`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[4].statuses[0].sensitive).toEqual(true)
    done()
  })

  it('removes sensitive flag to a status', async (done) => {
    const report = store.state.reports.fetchedReports[4]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })
    expect(report.statuses[1].sensitive).toBe(true)

    const button = wrapper.find(`.status-card:nth-child(${2}) li.el-dropdown-menu__item`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[4].statuses[1].sensitive).toEqual(false)
    done()
  })

  it('changes status visibility from public to unlisted', async (done) => {
    const report = store.state.reports.fetchedReports[4]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })
    expect(report.statuses[0].visibility).toBe('public')

    const button = wrapper.find(`.status-card li.el-dropdown-menu__item:nth-child(${3})`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[4].statuses[0].visibility).toEqual('unlisted')
    done()
  })

  it('changes status visibility from unlisted to private', async (done) => {
    const report = store.state.reports.fetchedReports[4]
    const wrapper = mount(TimelineItem, {
      store,
      localVue,
      propsData: {
        report: report
      }
    })
    expect(report.statuses[1].visibility).toBe('unlisted')

    const button = wrapper.find(`.status-card:nth-child(${2}) li.el-dropdown-menu__item:nth-child(${3})`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[4].statuses[1].visibility).toEqual('private')
    done()
  })

  it('deletes a status', async (done) => {
    const report = store.state.reports.fetchedReports[4]
    expect(report.statuses.length).toEqual(2)

    store.dispatch('DeleteStatus', { statusId: '11', reportId: '7'})
    await flushPromises()
    expect(store.state.reports.fetchedReports[4].statuses.length).toEqual(1)
    done()
  })
})
