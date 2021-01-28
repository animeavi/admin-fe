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
import router from '@/router'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'roles',
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
        if (!localStorage.getItem('settingsTabs')) {
          await this.$store.dispatch('FetchSettings')
          const menuItems = this.tabs
          localStorage.setItem('settingsTabs', JSON.stringify(menuItems))

          menuItems.forEach(({ label, value }) => {
            router.addRoute('Settings', {
              path: value,
              component: () => import(`@/views/settings/components/${label}`),
              name: label,
              meta: { title: label }
            })
          })
          const routes = router.getRoutes().filter(item => !item.hidden)
          this.$store.dispatch('GenerateRoutes', { roles: this.roles, routes })
        }
      }
    }
  }
}
</script>
