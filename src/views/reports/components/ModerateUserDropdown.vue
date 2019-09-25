<template>
  <el-dropdown trigger="click">
    <el-button plain size="small" icon="el-icon-files">{{ $t('reports.moderateUser') }}
      <i class="el-icon-arrow-down el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-if="showDeactivatedButton(report.account)"
        @click.native="handleDeactivation(report.account)">
        {{ report.account.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(report.account.id)"
        @click.native="handleDeletion(report.account.id)">
        {{ $t('users.deleteAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        :divided="true"
        :class="{ 'active-tag': report.account.tags.includes('force_nsfw') }"
        @click.native="toggleTag(report.account, 'force_nsfw')">
        {{ $t('users.forceNsfw') }}
        <i v-if="report.account.tags.includes('force_nsfw')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': report.account.tags.includes('strip_media') }"
        @click.native="toggleTag(report.account, 'strip_media')">
        {{ $t('users.stripMedia') }}
        <i v-if="report.account.tags.includes('strip_media')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': report.account.tags.includes('force_unlisted') }"
        @click.native="toggleTag(report.account, 'force_unlisted')">
        {{ $t('users.forceUnlisted') }}
        <i v-if="report.account.tags.includes('force_unlisted')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': report.account.tags.includes('sandbox') }"
        @click.native="toggleTag(report.account, 'sandbox')">
        {{ $t('users.sandbox') }}
        <i v-if="report.account.tags.includes('sandbox')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="report.account.local"
        :class="{ 'active-tag': report.account.tags.includes('disable_remote_subscription') }"
        @click.native="toggleTag(report.account, 'disable_remote_subscription')">
        {{ $t('users.disableRemoteSubscription') }}
        <i v-if="report.account.tags.includes('disable_remote_subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="report.account.local"
        :class="{ 'active-tag': report.account.tags.includes('disable_any_subscription') }"
        @click.native="toggleTag(report.account, 'disable_any_subscription')">
        {{ $t('users.disableAnySubscription') }}
        <i v-if="report.account.tags.includes('disable_any_subscription')" class="el-icon-check"/>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'ModerateUserDropdown',
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleDeactivation({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    },
    handleDeletion(user) {
      this.$store.dispatch('DeleteUser', user)
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleTag(user, tag) {
      user.tags.includes(tag)
        ? this.$store.dispatch('RemoveTag', { users: [user], tag })
        : this.$store.dispatch('AddTag', { users: [user], tag })
    }
  }
}
</script>
