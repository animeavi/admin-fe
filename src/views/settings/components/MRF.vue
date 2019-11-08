<template>
  <div v-if="!loading">
    <el-form ref="mrfSimple" :model="mrfSimple" :label-width="labelWidth">
      <el-form-item label="MRF Simple:"/>
      <el-form-item label="Media removal">
        <el-select :value="mrfSimple.media_removal || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'media_removal')"/>
        <p class="expl">List of instances to remove medias from</p>
      </el-form-item>
      <el-form-item label="Media NSFW">
        <el-select :value="mrfSimple.media_nsfw || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'media_nsfw')"/>
        <p class="expl">List of instances to put medias as NSFW (sensitive)</p>
      </el-form-item>
      <el-form-item label="Federated timeline removal">
        <el-select :value="mrfSimple.federated_timeline_removal || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'federated_timeline_removal')"/>
        <p class="expl">List of instances to remove from Federated (aka The Whole Known Network) Timeline</p>
      </el-form-item>
      <el-form-item label="Reject">
        <el-select :value="mrfSimple.reject || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'reject')"/>
        <p class="expl">List of instances to reject any activities from</p>
      </el-form-item>
      <el-form-item label="Accept">
        <el-select :value="mrfSimple.accept || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'accept')"/>
        <p class="expl">List of instances to accept any activities from</p>
      </el-form-item>
      <el-form-item label="Report removal">
        <el-select :value="mrfSimple.report_removal || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'report_removal')"/>
        <p class="expl">List of instances to reject reports from</p>
      </el-form-item>
      <el-form-item label="Avatar removal">
        <el-select :value="mrfSimple.avatar_removal || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'avatar_removal')"/>
        <p class="expl">List of instances to strip avatars from</p>
      </el-form-item>
      <el-form-item label="Banner removal">
        <el-select :value="mrfSimple.banner_removal || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_simple', 'banner_removal')"/>
        <p class="expl">List of instances to strip banners from</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfRejectnonpublic" :model="mrfRejectnonpublic" :label-width="labelWidth">
      <el-form-item label="MRF Reject non public:"/>
      <el-form-item label="Allow followers-only posts">
        <el-switch :value="mrfRejectnonpublic.allow_followersonly" @change="updateSetting($event, 'mrf_rejectnonpublic', 'allow_followersonly')"/>
      </el-form-item>
      <el-form-item label="Allow direct messages">
        <el-switch :value="mrfRejectnonpublic.allow_direct" @change="updateSetting($event, 'mrf_rejectnonpublic', 'allow_direct')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfHellthread" :model="mrfHellthread" :label-width="labelWidth">
      <el-form-item label="MRF Hellthread:"/>
      <el-form-item label="Delist threshold">
        <el-input-number :value="mrfHellthread.delist_threshold" :step="1" :min="0" size="large" @change="updateSetting($event, 'mrf_hellthread', 'delist_threshold')"/>
        <p class="expl">Number of mentioned users after which the message gets delisted
        (the message can still be seen, but it will not show up in public timelines and mentioned users won't get notifications about it).
        Set to 0 to disable.</p>
      </el-form-item>
      <el-form-item label="Reject threshold">
        <el-input-number :value="mrfHellthread.reject_threshold" :step="1" :min="0" size="large" @change="updateSetting($event, 'mrf_hellthread', 'reject_threshold')"/>
        <p class="expl">Number of mentioned users after which the messaged gets rejected. Set to 0 to disable.</p>
      </el-form-item>
    </el-form>
    <el-form ref="mrfKeyword" :model="mrfKeyword" :label-width="labelWidth">
      <div class="line"/>
      <el-form-item label="MRF Keyword:"/>
      <el-form-item label="Reject">
        <el-select :value="mrfKeyword.reject || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_keyword', 'reject')"/>
        <p class="expl">A list of patterns which result in message being rejected</p>
      </el-form-item>
      <el-form-item label="Federated timeline removal">
        <el-select :value="mrfKeyword.federated_timeline_removal" multiple allow-create filterable @change="updateSetting($event, 'mrf_keyword', 'federated_timeline_removal')"/>
        <p class="expl">A list of patterns which result in message being removed from federated timelines (a.k.a unlisted)</p>
      </el-form-item>
      <el-form-item label="Replace">
        <div v-for="([key, value], index) in replacePatterns" :key="index" class="setting-input">
          <el-input :value="key" placeholder="pattern" class="name-input" @input="parseReplace($event, 'key', index)"/> :
          <el-input :value="value" placeholder="replacement" class="value-input" @input="parseReplace($event, 'value', index)"/>
          <el-button icon="el-icon-minus" circle @click="deleteReplaceRow(index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addReplaceRow"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfSubchain" :model="mrfSubchain" :label-width="labelWidth">
      <el-form-item label="MRF Subchain:"/>
      <el-form-item label="Match actor:">
        <div v-for="([regExp, policies], index) in matchActor" :key="index" class="setting-input">
          <el-input :value="regExp" placeholder="Regular expression" class="name-input" @input="parseMrfSubchain($event, 'regExp', index)"/> :
          <el-select :value="policies" placeholder="Policy modules" multiple filterable allow-create class="value-input" @change="parseMrfSubchain($event, 'policies', index)">
            <el-option
              v-for="item in policiesOptions"
              :label="item.label"
              :key="item.value"
              :value="item.value"/>
          </el-select>
          <el-button icon="el-icon-minus" circle @click="deleteMrfSubchainRow(index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addMrfSubchainRow"/>
        <p class="expl">Matches a series of regular expressions against the actor field.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfMention" :model="mrfMention" :label-width="labelWidth">
      <el-form-item label="MRF Mention:"/>
      <el-form-item label="Actors">
        <el-select :value="mrfMention.actors || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_mention', 'actors')"/>
        <p class="expl">A list of actors, for which to drop any posts mentioning.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfUserAllowlist" :model="mrfUserAllowlist" :label-width="labelWidth">
      <el-form-item label="MRF User allowlist">
        <div v-for="([domain, users], index) in userAllowlist" :key="index" class="setting-input">
          <el-input :value="domain" placeholder="domain" class="name-input" @input="parseMrfUserAllowlist($event, 'domain', index)"/> :
          <el-select :value="users" placeholder="list of users" multiple filterable allow-create class="value-input" @change="parseMrfUserAllowlist($event, 'users', index)"/>
          <el-button icon="el-icon-minus" circle @click="deleteMrfUserAllowlistRow(index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addMrfUserAllowlistRow"/>
        <p class="expl">The keys in this section are the domain names that the policy should apply to. Each key should be assigned a list of users that should be allowed through by their ActivityPub ID.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfNormalizeMarkup" :model="mrfNormalizeMarkup" :label-width="labelWidth">
      <el-form-item label="MRF normalize markup:"/>
      <el-form-item label="Scrub policy">
        <el-input :value="mrfNormalizeMarkup.scrub_policy" @input="updateSetting($event, 'mrf_normalize_markup', 'scrub_policy')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfVocabulary" :model="mrfVocabulary" :label-width="labelWidth">
      <el-form-item label="MRF Vocabulary:"/>
      <el-form-item label="Accept">
        <el-select :value="mrfVocabulary.accept || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_vocabulary', 'accept')"/>
        <p class="expl">A list of ActivityStreams terms to accept.  If empty, all supported messages are accepted.</p>
      </el-form-item>
      <el-form-item label="Reject">
        <el-select :value="mrfVocabulary.reject || []" multiple allow-create filterable @change="updateSetting($event, 'mrf_vocabulary', 'reject')"/>
        <p class="expl">A list of ActivityStreams terms to reject.  If empty, no messages are rejected.</p>
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
  name: 'MRF',
  data: function() {
    return {
      removableDoubleOptions: ['replace', 'mrfUserAllowlist'],
      removableSingleOptions: ['keywordReject', 'federatedTimelineRemoval']
    }
  },
  computed: {
    ...mapGetters([
      'mrfHellthread',
      'mrfKeyword',
      'mrfMention',
      'mrfNormalizeMarkup',
      'mrfSimple',
      'mrfSubchain',
      'mrfRejectnonpublic',
      'mrfUserAllowlist',
      'mrfVocabulary'
    ]),
    matchActor() {
      return Object.keys(this.mrfSubchain.match_actor).map(key => [key, this.mrfSubchain.match_actor[key]])
    },
    policiesOptions() {
      return options.rewritePolicyOptions
    },
    replacePatterns() {
      return Object.keys(this.mrfKeyword.replace).map(key => [key, this.mrfKeyword.replace[key]])
    },
    userAllowlist() {
      return Object.keys(this.mrfUserAllowlist).map(key => [key, this.mrfUserAllowlist[key]])
    },
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
    addMrfSubchainRow() {
      const updatedValue = this.matchActor.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, 'mrf_subchain', 'match_actor')
    },
    addMrfUserAllowlistRow() {
      const updatedValue = this.userAllowlist.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.$store.dispatch('RewriteConfig', { data: { ...updatedValue, '': [] }, tab: 'mrf_user_allowlist' })
    },
    addReplaceRow() {
      const updatedValue = this.replacePatterns.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': '' }, 'mrf_keyword', 'replace')
    },
    deleteMrfSubchainRow(index) {
      const filteredValues = this.matchActor.filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'mrf_subchain', 'match_actor')
    },
    deleteMrfUserAllowlistRow(index) {
      const filteredValues = this.userAllowlist.filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.$store.dispatch('RewriteConfig', { data: updatedValue, tab: 'mrf_user_allowlist' })
    },
    deleteReplaceRow(index) {
      const filteredValues = this.replacePatterns.filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'mrf_keyword', 'replace')
    },
    parseMrfSubchain(value, inputType, index) {
      const updatedValue = this.matchActor.reduce((acc, el, i) => {
        if (index === i) {
          return inputType === 'regExp' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
        }
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'mrf_subchain', 'match_actor')
    },
    parseMrfUserAllowlist(value, inputType, index) {
      const updatedValue = this.userAllowlist.reduce((acc, el, i) => {
        if (index === i) {
          return inputType === 'domain' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
        }
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.$store.dispatch('RewriteConfig', { data: updatedValue, tab: 'mrf_user_allowlist' })
    },
    parseReplace(value, inputType, index) {
      const updatedValue = this.replacePatterns.reduce((acc, el, i) => {
        if (index === i) {
          return inputType === 'key' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
        }
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'mrf_keyword', 'replace')
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
