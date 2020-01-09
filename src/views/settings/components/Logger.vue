<template>
  <div v-if="!loading">
    <el-form ref="loggerData" :model="loggerData" :label-width="labelWidth">
      <setting :setting-group="logger" :data="loggerData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="consoleData" :model="consoleData" :label-width="labelWidth">
      <setting :setting-group="console" :data="consoleData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="exsysloggerData" :model="exsysloggerData" :label-width="labelWidth">
      <setting :setting-group="exsyslogger" :data="exsysloggerData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="quackData" :model="quackData" :label-width="labelWidth">
      <el-form-item label="Quack logger:"/>
      <setting :setting-group="quack" :data="quackData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'

export default {
  name: 'Logger',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    console() {
      return this.settings.description.find(setting => setting.key === ':console')
    },
    consoleData() {
      return this.settings.settings[':logger'][':console']
    },
    exsyslogger() {
      return this.settings.description.find(setting => setting.key === ':ex_syslogger')
    },
    exsysloggerData() {
      return this.settings.settings[':logger'][':ex_syslogger']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
    },
    logger() {
      return this.settings.description.find(setting => setting.group === ':logger')
    },
    loggerData() {
      return this.settings.settings[':logger'][':backends']
    },
    quack() {
      return this.settings.description.find(setting => setting.group === ':quack')
    },
    quackData() {
      return this.settings.settings[':quack']
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
