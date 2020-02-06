<template>
  <div v-if="!loading" class="form-container">
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
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

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
      return _.get(this.settings.settings, [':logger', ':console']) || {}
    },
    exsyslogger() {
      return this.settings.description.find(setting => setting.key === ':ex_syslogger')
    },
    exsysloggerData() {
      return _.get(this.settings.settings, [':logger', ':ex_syslogger']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '120px' : '280px'
    },
    loading() {
      return this.settings.loading
    },
    logger() {
      return this.settings.description.find(setting => setting.group === ':logger')
    },
    loggerData() {
      return _.get(this.settings.settings, [':logger', ':backends']) || {}
    },
    quack() {
      return this.settings.description.find(setting => setting.group === ':quack')
    },
    quackData() {
      return _.get(this.settings.settings, [':quack']) || {}
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
