<template>
  <div>
    <el-form ref="loggerBackends" :model="loggerBackends" :label-width="labelWidth">
      <el-form-item label="Backends">
        <el-select :value="loggerBackendsValue" multiple filterable allow-create @change="updateloggerBackends($event, 'backends', 'value')">
          <el-option
            v-for="(item, index) in loggerBackendsOptions"
            :key="index"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p class="expl"><span class="code">:console</span> is used to send logs to stdout, <span class="code">{ExSyslogger, :ex_syslogger}</span> to log to syslog, and <span class="code">Quack.Logger</span> to log to Slack</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="consoleLogger" :model="consoleLogger" :label-width="labelWidth">
      <el-form-item label="Console logger:"/>
      <el-form-item label="Level">
        <el-select :value="consoleLogger.level" clearable @change="updateSetting($event, 'console', 'level')">
          <el-option value=":debug" label=":debug - for debug-related messages"/>
          <el-option value=":info" label=":info - for information of any kind"/>
          <el-option value=":warn" label=":warn - for warnings"/>
          <el-option value=":error" label=":error - for errors"/>
        </el-select>
        <p class="expl">The level to be logged by this backend. Note that messages are filtered by the general
        <span class="code">:level</span> configuration for the <span class="code">:logger</span> application first.</p>
      </el-form-item>
      <el-form-item label="Format">
        <el-input :value="consoleLogger.format" @input="updateSetting($event, 'console', 'format')"/>
        <p class="expl">The format message used to print logs. </p>
      </el-form-item>
      <el-form-item label="Metadata">
        <el-select :value="consoleLogger.metadata || []" multiple filterable allow-create @change="updateSetting($event, 'console', 'metadata')">
          <el-option value=":all"/>
          <el-option value=":request_id"/>
          <el-option value=":line"/>
          <el-option value=":user_id"/>
          <el-option value=":application"/>
          <el-option value=":function"/>
          <el-option value=":file"/>
          <el-option value=":pid"/>
          <el-option value=":crash_reason"/>
          <el-option value=":initial_call"/>
          <el-option value=":registered_name"/>
          <el-option value=":none"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Device">
        <el-input :value="consoleLogger.device" @input="updateSetting($event, 'console', 'device')"/>
        <p class="expl">The device to log error messages to. Defaults to <span class="code">:user</span>
          but can be changed to something else such as <span class="code">:standard_error</span></p>
      </el-form-item>
      <el-form-item label="Max buffer">
        <el-input-number :value="consoleLogger.max_buffer" :step="1" :min="0" size="large" @change="updateSetting($event, 'console', 'max_buffer')"/>
        <p class="expl">Maximum events to buffer while waiting for a confirmation from the IO device (default: 32). Once the buffer is full, the backend will block until a confirmation is received.</p>
      </el-form-item>
      <el-form-item label="Colors:"/>
      <el-form-item label="Enabled">
        <el-switch :value="consoleLogger.colors.enabled" @change="processNestedData($event, 'console', 'colors', 'enabled')"/>
      </el-form-item>
      <el-form-item label="Debug message">
        <el-input :value="consoleLogger.colors.debug" @input="processNestedData($event, 'console', 'colors', 'debug')"/>
        <p class="expl">Defaults to: <span class="code">:cyan</span></p>
      </el-form-item>
      <el-form-item label="Info message">
        <el-input :value="consoleLogger.colors.info" @input="processNestedData($event, 'console', 'colors', 'info')"/>
        <p class="expl">Defaults to: <span class="code">:normal</span></p>
      </el-form-item>
      <el-form-item label="Warn message">
        <el-input :value="consoleLogger.colors.warn" @input="processNestedData($event, 'console', 'colors', 'warn')"/>
        <p class="expl">Defaults to: <span class="code">:yellow</span></p>
      </el-form-item>
      <el-form-item label="Error message">
        <el-input :value="consoleLogger.colors.error" @input="processNestedData($event, 'console', 'colors', 'error')"/>
        <p class="expl">Defaults to: <span class="code">:red</span></p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="exsyslogger" :model="exsyslogger" :label-width="labelWidth">
      <el-form-item label="ExSyslogger:"/>
      <el-form-item label="Level">
        <el-select :value="exsyslogger.level" clearable @change="updateSetting($event, 'ex_syslogger', 'level')">
          <el-option value=":debug" label=":debug - for debug-related messages"/>
          <el-option value=":info" label=":info - for information of any kind"/>
          <el-option value=":warn" label=":warn - for warnings"/>
          <el-option value=":error" label=":error - for errors"/>
        </el-select>
        <p class="expl">Logging level. It defaults to <span class="code">:info.</span></p>
      </el-form-item>
      <el-form-item label="Format">
        <el-input :value="exsyslogger.format" @input="updateSetting($event, 'ex_syslogger', 'format')"/>
        <p class="expl">The format message used to print logs.</p>
      </el-form-item>
      <el-form-item label="Formatter">
        <el-input :value="exsyslogger.formatter" @input="updateSetting($event, 'ex_syslogger', 'formatter')"/>
        <p class="expl">Formatter that will be used to format the log. It default to <span class="code">Logger.Formatter</span></p>
      </el-form-item>
      <el-form-item label="Metadata">
        <el-select :value="exsyslogger.metadata || []" multiple filterable allow-create @change="updateSetting($event, 'ex_syslogger', 'metadata')">
          <el-option value=":all"/>
          <el-option value=":request_id"/>
          <el-option value=":line"/>
          <el-option value=":user_id"/>
          <el-option value=":application"/>
          <el-option value=":function"/>
          <el-option value=":file"/>
          <el-option value=":pid"/>
          <el-option value=":crash_reason"/>
          <el-option value=":initial_call"/>
          <el-option value=":registered_name"/>
          <el-option value=":none"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Ident">
        <el-input :value="exsyslogger.ident" @input="updateSetting($event, 'ex_syslogger', 'ident')"/>
        <p class="expl">A string that’s prepended to every message, and is typically set to the app name. It defaults to <span class="code">Elixir</span></p>
      </el-form-item>
      <el-form-item label="Facility">
        <el-input :value="exsyslogger.facility" @input="updateSetting($event, 'ex_syslogger', 'facility')"/>
        <p class="expl">Syslog facility to be used. It defaults to <span class="code">:local0</span></p>
      </el-form-item>
      <el-form-item label="Options">
        <el-select :value="exsyslogger.option || []" multiple filterable allow-create @change="updateSetting($event, 'ex_syslogger', 'option')">
          <el-option value=":pid"/>
          <el-option value=":cons"/>
          <el-option value=":odelay"/>
          <el-option value=":ndelay"/>
          <el-option value=":perror"/>
        </el-select>
        <p class="expl">Syslog option to be used. It defaults to <span class="code">:ndelay.</span></p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="webhookUrl" :model="webhookUrl" :label-width="labelWidth">
      <el-form-item label="Quack logger:"/>
      <el-form-item label="Webhook URL">
        <el-input :value="webhookUrl.value" @input="updateSetting($event, 'webhook_url', 'value')"/>
      </el-form-item>
    </el-form>
    <el-form ref="level" :model="level" :label-width="labelWidth">
      <el-form-item label="Level">
        <el-select :value="level.value" clearable @change="updateSetting($event, 'level', 'value')">
          <el-option value=":debug" label=":debug - for debug-related messages"/>
          <el-option value=":info" label=":info - for information of any kind"/>
          <el-option value=":warn" label=":warn - for warnings"/>
          <el-option value=":error" label=":error - for errors"/>
        </el-select>
        <p class="expl">Logging level. It defaults to <span class="code">:info.</span></p>
      </el-form-item>
    </el-form>
    <el-form ref="meta" :model="meta" :label-width="labelWidth">
      <el-form-item label="Metadata">
        <el-select :value="meta.value || []" multiple filterable allow-create @change="updateSetting($event, 'meta', 'value')">
          <el-option value=":all"/>
          <el-option value=":module"/>
          <el-option value=":function"/>
          <el-option value=":file"/>
          <el-option value=":application"/>
          <el-option value=":line"/>
          <el-option value=":pid"/>
          <el-option value=":crash_reason"/>
          <el-option value=":initial_call"/>
          <el-option value=":registered_name"/>
          <el-option value=":none"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import { options } from './options'

export default {
  name: 'Logger',
  computed: {
    ...mapGetters([
      'consoleLogger',
      'exsyslogger',
      'level',
      'loggerBackends',
      'meta',
      'webhookUrl'
    ]),
    loggerBackendsValue() {
      return this.loggerBackends.value ? this.loggerBackends.value.map(el => JSON.stringify(el)) : []
    },
    loggerBackendsOptions() {
      return options.loggerBackendsOptions
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    processNestedData(value, tab, section, input) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][section], ...{ [input]: value }}
      this.updateSetting(updatedValue, tab, section)
    },
    updateloggerBackends(value, tab, input) {
      const parseValue = value.map(el => JSON.parse(el))
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: parseValue }})
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
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
