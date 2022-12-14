<template>
  <div v-if="!item.hidden && invitesEnabled" class="menu-wrapper">
    <template
      v-if="item.children && hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item
            v-if="onlyOneChild.meta"
            :count="showCount(item) ? normalizedReportsCount : null"
            :icon="onlyOneChild.meta.icon||item.meta.icon"
            :title="generateTitle(onlyOneChild.meta.title)" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" :id="item.meta.title">
      <template slot="title">
        <item
          v-if="item.meta"
          :count="showCount(item) ? normalizedReportsCount : null"
          :icon="item.meta.icon"
          :title="generateTitle(item.meta.title)" />
      </template>

      <template v-for="child in item.children">
        <template v-if="!child.hidden">
          <sidebar-item
            v-if="child.children&&child.children.length>0"
            :is-nest="true"
            :item="child"
            :key="child.path"
            :base-path="resolvePath(child.path)"
            class="nest-menu" />

          <app-link v-else :to="resolvePath(child.path)" :key="child.name">
            <el-menu-item :index="resolvePath(child.path)" class="submenu-item">
              <item
                v-if="child.meta"
                :count="showCount(item) ? normalizedReportsCount : null"
                :icon="child.meta.icon"
                :title="generateTitle(child.meta.title)" />
            </el-menu-item>
          </app-link>
        </template>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import numeral from 'numeral'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      onlyOneChild: null
    }
  },
  computed: {
    invitesEnabled() {
      return this.basePath === '/invites' ? this.$store.state.app.invitesEnabled : true
    },
    normalizedReportsCount() {
      return numeral(this.$store.state.reports.openReportsCount).format('0a')
    }
  },
  methods: {
    hasOneShowingChild(children, parent) {
      if (parent.hasSubmenu) {
        return false
      }

      const showingChildren = children.filter(item => {
        // Temp set(will be used if only has one showing child)
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    showCount(item) {
      return item.path === '/reports'
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    generateTitle
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.submenu-item {
  padding-left: 54px !important;
}
</style>
