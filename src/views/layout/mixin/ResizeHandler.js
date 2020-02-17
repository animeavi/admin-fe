import store from '@/store'

const { body } = document
const mobileWidth = 480
const tabletWidth = 801
const ratio = 3

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted() {
    const isMobile = this.isMobile()
    const isTablet = this.isTablet()
    if (isMobile || isTablet) {
      store.dispatch('toggleDevice', isMobile ? 'mobile' : 'tablet')
      store.dispatch('closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - ratio < mobileWidth
    },
    isTablet() {
      const rect = body.getBoundingClientRect()
      return rect.width - ratio < tabletWidth && rect.width - ratio > mobileWidth
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        const isTablet = this.isTablet()

        if (isMobile || isTablet) {
          store.dispatch('toggleDevice', isMobile ? 'mobile' : 'tablet')
          store.dispatch('closeSideBar', { withoutAnimation: true })
        } else {
          store.dispatch('toggleDevice', 'desktop')
        }
      }
    }
  }
}
