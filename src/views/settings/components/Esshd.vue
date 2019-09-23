<template>
  <div>
    <el-form :label-width="labelWidth">
      <el-form-item>
        <p class="expl">Before enabling this you must:
          <ol class="esshd-list">
            <li>Add <span class="code">:esshd</span> to <span class="code">mix.exs</span> as one of the
              <span class="code">extra_applications</span>
            </li>
            <li>Generate host keys in your
              <span class="code">priv</span> dir with
              <span class="code">ssh-keygen -m PEM -N "" -b 2048 -t rsa -f ssh_host_rsa_key</span>
            </li>
          </ol>
        </p>
      </el-form-item>
    </el-form>
    <el-form ref="enabled" :model="enabled" :label-width="labelWidth">
      <el-form-item label="Enabled">
        <el-switch :value="enabled.value" @change="updateSetting($event, 'enabled', 'value')"/>
      </el-form-item>
    </el-form>
    <el-form ref="privDir" :model="privDir" :label-width="labelWidth">
      <el-form-item label="Priv dir">
        <el-input :value="privDir.value" @input="updateSetting($event, 'priv_dir', 'value')"/>
        <p class="expl">You can input relative path here</p>
      </el-form-item>
    </el-form>
    <el-form ref="handler" :model="handler" :label-width="labelWidth">
      <el-form-item label="Handler">
        <el-input :value="handler.value" @input="updateSetting($event, 'handler', 'value')"/>
      </el-form-item>
    </el-form>
    <el-form ref="port" :model="port" :label-width="labelWidth">
      <el-form-item label="Port">
        <el-input :value="port.value" @input="updateSetting($event, 'port', 'value')"/>
      </el-form-item>
    </el-form>
    <el-form ref="passwordAuthenticator" :model="passwordAuthenticator" :label-width="labelWidth">
      <el-form-item label="Password authenticator">
        <el-input :value="passwordAuthenticator.value" @input="updateSetting($event, 'password_authenticator', 'value')"/>
      </el-form-item>
      <el-form-item>
        <p class="expl">Feel free to adjust the priv_dir and port number.
        Then you will have to create the key for the keys (in the example <span class="code">priv/ssh_keys</span>) and create the host keys with
          <span class="code">ssh-keygen -m PEM -N "" -b 2048 -t rsa -f ssh_host_rsa_key</span>.
          After restarting, you should be able to connect to your Pleroma instance with <span class="code">ssh username@server -p $PORT</span>
        </p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'

export default {
  name: 'Instance',
  computed: {
    ...mapGetters([
      'enabled',
      'handler',
      'passwordAuthenticator',
      'port',
      'privDir'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    toggleEsshd(value) {
      this.$store.dispatch('ToggleEsshd', value)
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
