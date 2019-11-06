<template>
  <el-form v-if="!loading" ref="endpointData" :model="endpointData" :label-width="labelWidth">
    <setting :settings-group="endpoint" :data="endpointData"/>
    <div class="line"/>
    <el-form-item class="options-paragraph-container">
      <p class="options-paragraph">Only common options are listed here. You can add more (all configuration options can be viewed
        <a
          href="https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#module-dynamic-configuration"
          rel="nofollow noreferrer noopener"
          target="_blank">here</a>)
      </p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'

export default {
  name: 'Endpoint',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'endpointData'
    ]),
    endpoint() {
      return this.$store.state.settings.description.find(setting => setting.key === 'Pleroma.Web.Endpoint')
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    },
    loading() {
      return this.$store.state.settings.loading
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
