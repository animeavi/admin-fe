<template>
  <div v-if="!loading">
    <el-form ref="frontendData" :model="frontendData" :label-width="labelWidth">
      <el-form-item>
        <p class="expl">This form can be used to configure a keyword list that keeps the configuration data for any kind of frontend.
        By default, settings for <span class="code">pleroma_fe</span> and <span class="code">masto_fe</span> are configured.
        If you want to add your own configuration your settings need to be complete as they will override the defaults.</p>
      </el-form-item>
      <setting :setting-group="frontend" :data="frontendData"/>
    </el-form>
    <el-form ref="assetsData" :model="assetsData" :label-width="labelWidth">
      <el-form-item label="Assets:"/>
      <setting :setting-group="assets" :data="assetsData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="emojiData" :model="emojiData" :label-width="labelWidth">
      <el-form-item label="Emoji:"/>
      <setting :setting-group="emoji" :data="emojiData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="chatData" :model="chatData" :label-width="labelWidth">
      <setting :setting-group="chat" :data="chatData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="markupData" :model="markupData" :label-width="labelWidth">
      <el-form-item label="Markup settings:"/>
      <setting :setting-group="markup" :data="markupData"/>
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
  name: 'Frontend',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    assets() {
      return this.settings.description.find(setting => setting.key === ':assets')
    },
    assetsData() {
      return this.settings.settings.pleroma[':assets']
    },
    chat() {
      return this.settings.description.find(setting => setting.key === ':chat')
    },
    chatData() {
      return this.settings.settings.pleroma[':chat']
    },
    emoji() {
      return this.settings.description.find(setting => setting.key === ':emoji')
    },
    emojiData() {
      return this.settings.settings.pleroma[':emoji']
    },
    frontend() {
      return this.settings.description.find(setting => setting.key === ':frontend_configurations')
    },
    frontendData() {
      return this.settings.settings.pleroma[':frontend_configurations']
    },
    markup() {
      return this.settings.description.find(setting => setting.key === ':markup')
    },
    markupData() {
      return this.settings.settings.pleroma[':markup']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
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
