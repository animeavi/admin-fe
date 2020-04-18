<template>
  <el-tooltip v-if="needReboot" :content="$t('settings.restartApp')" placement="bottom-end">
    <el-button type="warning" class="reboot-button" @click="restartApp">
      <span>
        <i class="el-icon-refresh"/>
        {{ $t('settings.instanceReboot') }}
      </span>
    </el-button>
  </el-tooltip>
</template>

<script>
import i18n from '@/lang'

export default {
  name: 'RebootButton',
  computed: {
    needReboot() {
      return this.$store.state.app.needReboot
    }
  },
  methods: {
    async restartApp() {
      try {
        await this.$store.dispatch('RestartApplication')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.restartSuccess')
      })
    }
  }
}
</script>
