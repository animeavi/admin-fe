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

  it('creates a note', () => {
    const wrapper = mount(Reports, {
      store,
      localVue
    })
    const noteTextArea = wrapper.find('textarea')
    const notes = store.state.reports.fetchedReports[0].notes

    expect(noteTextArea.isVisible()).toBe(false)

    wrapper.find('.el-button--default').trigger('click')
    expect(noteTextArea.isVisible()).toBe(true)
    expect(notes.length).toBe(2)

    noteTextArea.setValue('new note')
    wrapper.find('.submit-button').trigger('click')
    const updatedNotes = store.state.reports.fetchedReports[0].notes
    expect(updatedNotes.length).toBe(3)

    wrapper.find('.new-note .el-icon-close').trigger('click')
    expect(noteTextArea.isVisible()).toBe(false)
  })

  it('deletes a note', () => {
    store.dispatch('FetchReports')
    expect(store.state.reports.fetchedReports[0].notes.length).toBe(3)

    store.dispatch('DeleteNote', { reportId: '1', noteId: '2' })
    expect(store.state.reports.fetchedReports[0].notes.length).toBe(2)
  })

  it('loads more reports on scroll', () => {
    const wrapper = mount(Reports, {
      store,
      localVue
    })
    expect(store.state.reports.fetchedReports.length).toEqual(3)

    window.dispatchEvent(new CustomEvent('scroll', { detail: 2000 }))
    expect(store.state.reports.fetchedReports.length).toEqual(6)
  })
})
