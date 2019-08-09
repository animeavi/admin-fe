<template>
  <el-form ref="gopher" :model="gopher" :label-width="labelWidth">
    <el-form-item label="Enabled">
      <el-switch :value="gopher.enabled" @change="updateSetting($event, 'gopher', 'enabled')"/>
      <p class="expl">Enables the gopher interface</p>
    </el-form-item>
    <el-form-item label="IP address">
      <el-input :value="gopher.ip" placeholder="xxx.xxx.xxx.xx" @input="updateSetting($event, 'gopher', 'ip')"/>
      <p class="expl">Enables the gopher interface</p>
    </el-form-item>
    <el-form-item label="Port">
      <el-input :value="gopher.port" @input="updateSetting($event, 'gopher', 'port')"/>
      <p class="expl">Port to bind to</p>
    </el-form-item>
    <el-form-item label="Dst port">
      <el-input :value="gopher.dstport" @input="updateSetting($event, 'gopher', 'dstport')"/>
      <p class="expl">Port advertised in urls (optional, defaults to port)</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'

export default {
  name: 'Gopher',
  computed: {
    ...mapGetters([
      'gopherConfig'
    ]),
    gopher() {
      return this.gopherConfig
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
    onSubmit() {
      this.$store.dispatch('SubmitChanges')
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
