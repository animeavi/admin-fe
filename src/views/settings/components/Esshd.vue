<template>
  <div>
    <el-form ref="esshdData" :model="esshdData" :label-width="labelWidth">
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
      <setting :settings-group="esshd" :data="esshdData"/>
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
import Setting from './Setting'

export default {
  name: 'Instance',
  components: { Setting },
  computed: {
    ...mapGetters([
      'esshdData'
    ]),
    esshd() {
      return this.$store.state.settings.description.find(setting => setting.group === ':esshd')
    },
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
