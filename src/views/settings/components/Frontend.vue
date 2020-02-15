<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="frontendData" :model="frontendData" :label-width="labelWidth">
      <setting :setting-group="frontend" :data="frontendData"/>
    </el-form>
    <el-form ref="assetsData" :model="assetsData" :label-width="labelWidth">
      <el-form-item class="grouped-settings-header">
        <span class="label-font">{{ $t('settings.assets') }}</span>
      </el-form-item>
      <setting :setting-group="assets" :data="assetsData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="emojiData" :model="emojiData" :label-width="labelWidth">
      <el-form-item class="grouped-settings-header">
        <span class="label-font">{{ $t('settings.emoji') }}</span>
      </el-form-item>
      <setting :setting-group="emoji" :data="emojiData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="chatData" :model="chatData" :label-width="labelWidth">
      <setting :setting-group="chat" :data="chatData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="markupData" :model="markupData" :label-width="labelWidth">
      <el-form-item class="grouped-settings-header">
        <span class="label-font">{{ $t('settings.markup') }}</span>
      </el-form-item>
      <setting :setting-group="markup" :data="markupData"/>
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
      return _.get(this.settings.settings, [':pleroma', ':assets']) || {}
    },
    chat() {
      return this.settings.description.find(setting => setting.key === ':chat')
    },
    chatData() {
      return _.get(this.settings.settings, [':pleroma', ':chat']) || {}
    },
    emoji() {
      return this.settings.description.find(setting => setting.key === ':emoji')
    },
    emojiData() {
      return _.get(this.settings.settings, [':pleroma', ':emoji']) || {}
    },
    frontend() {
      return this.settings.description.find(setting => setting.key === ':frontend_configurations')
    },
    frontendData() {
      return _.get(this.settings.settings, [':pleroma', ':frontend_configurations']) || {}
    },
    markup() {
      return this.settings.description.find(setting => setting.key === ':markup')
    },
    markupData() {
      return _.get(this.settings.settings, [':pleroma', ':markup']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '120px' : '280px'
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
