<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
      @open="handleOpen"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
// import router from '@/router'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'tabs'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.$store.dispatch('FetchOpenReportsCount')
  },
  methods: {
    async handleOpen($event) {
      if ($event === '/settings') {
        let items = localStorage.getItem('settingsTabs')
        if (!items) {
          await this.$store.dispatch('FetchSettings')
          items = this.tabs
          localStorage.setItem('settingsTabs', JSON.stringify(items))
        }
        JSON.parse(items).forEach(item => {
          // router.addRoute('Settings', [{
          //   path: item.value,
          //   component: {
          //     template: '<span>Ioio</span>'
          //   }
          // }])
        })
      }
    }
  }
}
</script>
