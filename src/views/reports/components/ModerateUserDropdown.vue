<template>
  <el-dropdown trigger="click">
    <el-button :disabled="!account.id" plain size="small" icon="el-icon-files">{{ $t('reports.moderateUser') }}
      <i class="el-icon-arrow-down el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-if="showDeactivatedButton(account)"
        @click.native="handleDeactivation(account)">
        {{ account.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(account.id)"
        @click.native="handleDeletion(account.id)">
        {{ $t('users.deleteAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        :divided="true"
        :class="{ 'active-tag': tags.includes('force_nsfw') }"
        @click.native="toggleTag(account, 'force_nsfw')">
        {{ $t('users.forceNsfw') }}
        <i v-if="tags.includes('force_nsfw')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': tags.includes('strip_media') }"
        @click.native="toggleTag(account, 'strip_media')">
        {{ $t('users.stripMedia') }}
        <i v-if="tags.includes('strip_media')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': tags.includes('force_unlisted') }"
        @click.native="toggleTag(account, 'force_unlisted')">
        {{ $t('users.forceUnlisted') }}
        <i v-if="tags.includes('force_unlisted')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': tags.includes('sandbox') }"
        @click.native="toggleTag(account, 'sandbox')">
        {{ $t('users.sandbox') }}
        <i v-if="tags.includes('sandbox')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="account.local"
        :class="{ 'active-tag': tags.includes('disable_remote_subscription') }"
        @click.native="toggleTag(account, 'disable_remote_subscription')">
        {{ $t('users.disableRemoteSubscription') }}
        <i v-if="tags.includes('disable_remote_subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="account.local"
        :class="{ 'active-tag': tags.includes('disable_any_subscription') }"
        @click.native="toggleTag(account, 'disable_any_subscription')">
        {{ $t('users.disableAnySubscription') }}
        <i v-if="tags.includes('disable_any_subscription')" class="el-icon-check"/>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'ModerateUserDropdown',
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  computed: {
    tags() {
      return this.account.tags || []
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
