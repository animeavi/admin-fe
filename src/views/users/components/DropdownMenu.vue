<template>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item
      @click.native="grantRightToMultipleUsers('admin')">
      {{ $t('users.grantAdmin') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="revokeRightToMultipleUsers('admin')">
      {{ $t('users.revokeAdmin') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="grantRightToMultipleUsers('moderator')">
      {{ $t('users.grantModerator') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="revokeRightToMultipleUsers('moderator')">
      {{ $t('users.revokeModerator') }}
    </el-dropdown-item>
    <el-dropdown-item
      divided
      @click.native="activateMultipleUsers">
      {{ $t('users.activateAccount') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="deactivateMultipleUsers">
      {{ $t('users.deactivateAccount') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="deleteMultipleUsers">
      {{ $t('users.deleteAccount') }}
    </el-dropdown-item>
    <el-dropdown-item
      divided
      @click.native="toggleTagForMultipleUsers('force_nsfw')">
      {{ $t('users.forceNsfw') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('strip_media')">
      {{ $t('users.stripMedia') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('force_unlisted')">
      {{ $t('users.forceUnlisted') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('sandbox')">
      {{ $t('users.sandbox') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('disable_remote_subscription')">
      {{ $t('users.disableRemoteSubscription') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('disable_any_subscription')">
      {{ $t('users.disableAnySubscription') }}
    </el-dropdown-item>
  </el-dropdown-menu>
</template>

<script>
export default {
  methods: {
    toggleTagForMultipleUsers(tag) {
      if (tag === 'disable_remote_subscription' || tag === 'disable_any_subscription') {
        // filter users, because these actions can be applied only to local users
      }
    }
  }
}
</script>
