import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/reports')

describe('Reports filter', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchReports')
    await flushPromises()
  })

  it('shows open reports when "Open" filter is applied', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(5)

    store.dispatch('SetFilter', 'open')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(2)

    done()
  })

  it('shows resolved reports when "Resolved" filter is applied', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(5)

    store.dispatch('SetFilter', 'resolved')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(2)

    done()
  })

  it('shows closed reports when "Closed" filter is applied', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(5)

    store.dispatch('SetFilter', 'closed')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(3)

    done()
  })

  it('shows all users after removing filters', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(5)

    store.dispatch('SetFilter', 'open')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(2)

    store.dispatch('SetFilter', '')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(5)

    done()
  })
})
