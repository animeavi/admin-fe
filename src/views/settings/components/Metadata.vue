<template>
  <div v-if="!loading">
    <el-form ref="metadata" :model="metadata" :label-width="labelWidth">
      <el-form-item label="Providers">
        <el-select :value="metadata.providers || []" multiple filterable allow-create @change="updateSetting($event, 'Pleroma.Web.Metadata', 'providers')">
          <el-option value="Pleroma.Web.Metadata.Providers.OpenGraph"/>
          <el-option value="Pleroma.Web.Metadata.Providers.TwitterCard"/>
          <el-option value="Pleroma.Web.Metadata.Providers.RelMe"/>
        </el-select>
        <p class="expl">A list of metadata providers to enable.</p>
      </el-form-item>
      <el-form-item label="Unfurl NSFW">
        <el-switch :value="metadata.unfurl_nsfw" @change="updateSetting($event, 'Pleroma.Web.Metadata', 'unfurl_nsfw')"/>
        <p class="expl">If set to true nsfw attachments will be shown in previews.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="richMedia" :model="richMedia" :label-width="labelWidth">
      <el-form-item label="Rich media:"/>
      <el-form-item label="Enabled">
        <el-switch :value="richMedia.enabled" @change="updateSetting($event, 'rich_media', 'enabled')"/>
        <p class="expl">If enabled the instance will parse metadata from attached links to generate link previews.</p>
      </el-form-item>
      <el-form-item label="Ignore hosts">
        <el-select :value="richMedia.ignore_hosts || []" multiple filterable allow-create @change="updateSetting($event, 'rich_media', 'ignore_hosts')"/>
        <p class="expl">List of hosts which will be ignored by the metadata parser.</p>
      </el-form-item>
      <el-form-item label="Ignore TLD">
        <el-select :value="richMedia.ignore_tld || []" multiple filterable allow-create @change="updateSetting($event, 'rich_media', 'ignore_tld')"/>
        <p class="expl">List TLDs (top-level domains) which will ignore for parse metadata.
        Default is <span class="code">["local", "localdomain", "lan"]</span></p>
      </el-form-item>
      <el-form-item label="Parsers">
        <el-select :value="richMedia.parsers || []" multiple filterable allow-create @change="updateSetting($event, 'rich_media', 'parsers')">
          <el-option value="Pleroma.Web.RichMedia.Parsers.TwitterCard"/>
          <el-option value="Pleroma.Web.RichMedia.Parsers.OGP"/>
          <el-option value="Pleroma.Web.RichMedia.Parsers.OEmbed"/>
        </el-select>
        <p class="expl">List of Rich Media parsers</p>
      </el-form-item>
      <el-form-item label="TTL Setters">
        <el-select :value="richMedia.ttl_setters || []" multiple filterable allow-create @change="updateSetting($event, 'rich_media', 'ttl_setters')">
          <el-option value="Pleroma.Web.RichMedia.Parser.TTL.AwsSignedUrl"/>
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

export default {
  name: 'Metadata',
  computed: {
    ...mapGetters([
      'metadata',
      'richMedia'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.$store.state.settings.loading
    }
  },
  methods: {
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
