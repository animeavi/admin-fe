<template>
  <div>
    <el-form ref="frontend" :model="frontend" :label-width="labelWidth">
      <el-form-item>
        <p class="expl">This form can be used to configure a keyword list that keeps the configuration data for any kind of frontend.
        By default, settings for <span class="code">pleroma_fe</span> and <span class="code">masto_fe</span> are configured.
        If you want to add your own configuration your settings need to be complete as they will override the defaults.</p>
      </el-form-item>
      <el-form-item label="Pleroma FE:"/>
      <el-form-item label="Theme">
        <el-select :value="frontend.pleroma_fe.theme" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'theme')">
          <el-option
            v-for="item in themeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p class="expl">Which theme to use</p>
      </el-form-item>
      <el-form-item label="Background">
        <el-input :value="frontend.pleroma_fe.background" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'background')"/>
        <div class="upload-container">
          <p class="text">or</p>
          <el-upload
            :http-request="sendBackgroundPleroma"
            :multiple="false"
            :show-file-list="false"
            action="/api/v1/media">
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </div>
        <p class="expl">URL of the background, unless viewing a user profile with a background that is set</p>
      </el-form-item>
      <el-form-item label="Logo">
        <el-input :value="frontend.pleroma_fe.logo" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'logo')"/>
        <div class="upload-container">
          <p class="text">or</p>
          <el-upload
            :http-request="sendLogoPleroma"
            :multiple="false"
            :show-file-list="false"
            action="/api/v1/media">
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </div>
        <p class="expl">URL of the logo</p>
      </el-form-item>
      <el-form-item label="Logo mask">
        <el-switch :value="frontend.pleroma_fe.logoMask" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'logoMask')"/>
        <p class="expl">Whether to use only the logo's shape as a mask (true) or as a regular image (false)</p>
      </el-form-item>
      <el-form-item label="Logo margin (em)">
        <el-input-number :value="frontend.pleroma_fe.logoMargin" :step="0.1" :min="0" size="large" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'logoMargin')"/>
        <p class="expl">What margin to use around the logo</p>
      </el-form-item>
      <el-form-item label="Redirect URL">
        <el-input :value="frontend.pleroma_fe.redirectRootNoLogin" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'redirectRootNoLogin')"/>
        <p class="expl">Relative URL which indicates where to redirect when a user is logged in</p>
      </el-form-item>
      <el-form-item label="Redirect for anonymous user">
        <el-input :value="frontend.pleroma_fe.redirectRootLogin" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'redirectRootLogin')"/>
        <p class="expl">Relative URL which indicates where to redirect when a user isn’t logged in</p>
      </el-form-item>
      <el-form-item label="Show instance panel">
        <el-switch :value="frontend.pleroma_fe.showInstanceSpecificPanel" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'showInstanceSpecificPanel')"/>
        <p class="expl">Whenether to show the instance’s specific panel</p>
      </el-form-item>
      <el-form-item label="Scope options enabled">
        <el-switch :value="frontend.pleroma_fe.scopeOptionsEnabled" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'scopeOptionsEnabled')"/>
      </el-form-item>
      <el-form-item label="Formatting options enabled">
        <el-switch :value="frontend.pleroma_fe.formattingOptionsEnabled" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'formattingOptionsEnabled')"/>
      </el-form-item>
      <el-form-item label="Collapse msg with subject">
        <el-switch :value="frontend.pleroma_fe.collapseMessageWithSubject" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'collapseMessageWithSubject')"/>
        <p class="expl">When a message has a subject (aka Content Warning), collapse it by default</p>
      </el-form-item>
      <el-form-item label="Scope copy">
        <el-switch :value="frontend.pleroma_fe.scopeCopy" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'scopeCopy')"/>
        <p class="expl">Copy the scope <span class="code">(private/unlisted/public)</span> in replies to posts by default</p>
      </el-form-item>
      <el-form-item label="Subject line behavior">
        <el-select :value="frontend.pleroma_fe.subjectLineBehavior" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'subjectLineBehavior')">
          <el-option label="Email" value="email">Email / Copy and preprend re:, as in email</el-option>
          <el-option label="Masto" value="masto">Masto / Copy verbatim, as in Mastodon</el-option>
          <el-option label="Noop" value="noop">Noop / Don't copy the subject</el-option>
        </el-select>
        <p class="expl">Allows changing the default behaviour of subject lines in replies</p>
      </el-form-item>
      <el-form-item label="Post content type">
        <el-input :value="frontend.pleroma_fe.postContentType" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'postContentType')"/>
      </el-form-item>
      <el-form-item label="Always show subject input">
        <el-switch :value="frontend.pleroma_fe.alwaysShowSubjectInput" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'alwaysShowSubjectInput')"/>
        <p class="expl">When set to false, auto-hide the subject field when it's empty</p>
      </el-form-item>
      <el-form-item label="Hide post statistics">
        <el-switch :value="frontend.pleroma_fe.hidePostStats" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'hidePostStats')"/>
        <p class="expl">Hide notices statistics(repeats, favorites, …)</p>
      </el-form-item>
      <el-form-item label="Hide user statistics">
        <el-switch :value="frontend.pleroma_fe.hideUserStats" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'hideUserStats')"/>
        <p class="expl">Hide profile statistics(posts, posts per day, followers, followings, …)</p>
      </el-form-item>
      <el-form-item label="Login method">
        <el-input :value="frontend.pleroma_fe.loginMethod" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'loginMethod')"/>
      </el-form-item>
      <el-form-item label="Web push notifications">
        <el-switch :value="frontend.pleroma_fe.webPushNotifications" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'webPushNotifications')"/>
      </el-form-item>
      <el-form-item label="No attachment links">
        <el-switch :value="frontend.pleroma_fe.noAttachmentLinks" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'noAttachmentLinks')"/>
      </el-form-item>
      <el-form-item label="NSFW Censor image">
        <el-input :value="frontend.pleroma_fe.nsfwCensorImage" @input="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'nsfwCensorImage')"/>
      </el-form-item>
      <el-form-item label="Show features panel">
        <el-switch :value="frontend.pleroma_fe.showFeaturesPanel" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'showFeaturesPanel')"/>
      </el-form-item>
      <el-form-item label="Minimal scopes mode">
        <el-switch :value="frontend.pleroma_fe.minimalScopesMode" @change="processNestedData($event, 'frontend_configurations', 'pleroma_fe', 'minimalScopesMode')"/>
      </el-form-item>
      <div class="line"/>
      <el-form-item label="Masto FE:"/>
      <el-form-item label="Theme">
        <el-select :value="frontend.masto_fe.theme" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'theme')">
          <el-option
            v-for="item in themeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p class="expl">Which theme to use</p>
      </el-form-item>
      <el-form-item label="Background">
        <el-input :value="frontend.masto_fe.background" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'background')"/>
        <div class="upload-container">
          <p class="text">or</p>
          <el-upload
            :http-request="sendBackgroundMasto"
            :multiple="false"
            :show-file-list="false"
            action="/api/v1/media">
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </div>
        <p class="expl">URL of the background, unless viewing a user profile with a background that is set</p>
      </el-form-item>
      <el-form-item label="Logo">
        <el-input :value="frontend.masto_fe.logo" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'logo')"/>
        <div class="upload-container">
          <p class="text">or</p>
          <el-upload
            :http-request="sendLogoMasto"
            :multiple="false"
            :show-file-list="false"
            action="/api/v1/media">
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </div>
        <p class="expl">URL of the logo</p>
      </el-form-item>
      <el-form-item label="Logo mask">
        <el-switch :value="frontend.masto_fe.logoMask" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'logoMask')"/>
        <p class="expl">Whether to use only the logo's shape as a mask (true) or as a regular image (false)</p>
      </el-form-item>
      <el-form-item label="Logo margin (em)">
        <el-input-number :value="frontend.masto_fe.logoMargin" :step="0.1" :min="0" size="large" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'logoMargin')"/>
        <p class="expl">What margin to use around the logo</p>
      </el-form-item>
      <el-form-item label="Redirect URL">
        <el-input :value="frontend.masto_fe.redirectRootNoLogin" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'redirectRootNoLogin')"/>
        <p class="expl">Relative URL which indicates where to redirect when a user is logged in</p>
      </el-form-item>
      <el-form-item label="Redirect for anonymous user">
        <el-input :value="frontend.masto_fe.redirectRootLogin" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'redirectRootLogin')"/>
        <p class="expl">Relative URL which indicates where to redirect when a user isn’t logged in</p>
      </el-form-item>
      <el-form-item label="Show instance panel">
        <el-switch :value="frontend.masto_fe.showInstanceSpecificPanel" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'showInstanceSpecificPanel')"/>
        <p class="expl">Whenether to show the instance’s specific panel</p>
      </el-form-item>
      <el-form-item label="Scope options enabled">
        <el-switch :value="frontend.masto_fe.scopeOptionsEnabled" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'scopeOptionsEnabled')"/>
      </el-form-item>
      <el-form-item label="Formatting options enabled">
        <el-switch :value="frontend.masto_fe.formattingOptionsEnabled" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'formattingOptionsEnabled')"/>
      </el-form-item>
      <el-form-item label="Collapse msg with subjects">
        <el-switch :value="frontend.masto_fe.collapseMessageWithSubject" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'collapseMessageWithSubject')"/>
        <p class="expl">When a message has a subject (aka Content Warning), collapse it by default</p>
      </el-form-item>
      <el-form-item label="Scope copy">
        <el-switch :value="frontend.masto_fe.scopeCopy" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'scopeCopy')"/>
        <p class="expl">Copy the scope <span class="code">(private/unlisted/public)</span> in replies to posts by default</p>
      </el-form-item>
      <el-form-item label="Subject line behavior">
        <el-select :value="frontend.masto_fe.subjectLineBehavior" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'subjectLineBehavior')">
          <el-option label="Email" value="email">Email / Copy and preprend re:, as in email</el-option>
          <el-option label="Masto" value="masto">Masto / Copy verbatim, as in Mastodon</el-option>
          <el-option label="Noop" value="noop">Noop / Don't copy the subject</el-option>
        </el-select>
        <p class="expl">Allows changing the default behaviour of subject lines in replies</p>
      </el-form-item>
      <el-form-item label="Post content type">
        <el-input :value="frontend.masto_fe.postContentType" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'postContentType')"/>
      </el-form-item>
      <el-form-item label="Always show subject input">
        <el-switch :value="frontend.masto_fe.alwaysShowSubjectInput" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'alwaysShowSubjectInput')"/>
        <p class="expl">When set to false, auto-hide the subject field when it's empty</p>
      </el-form-item>
      <el-form-item label="Hide post statistics">
        <el-switch :value="frontend.masto_fe.hidePostStats" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'hidePostStats')"/>
        <p class="expl">Hide notices statistics(repeats, favorites, …)</p>
      </el-form-item>
      <el-form-item label="Hide user statistics">
        <el-switch :value="frontend.masto_fe.hideUserStats" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'hideUserStats')"/>
        <p class="expl">Hide profile statistics(posts, posts per day, followers, followings, …)</p>
      </el-form-item>
      <el-form-item label="Login method">
        <el-input :value="frontend.masto_fe.loginMethod" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'loginMethod')"/>
      </el-form-item>
      <el-form-item label="Web push notifications">
        <el-switch :value="frontend.masto_fe.webPushNotifications" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'webPushNotifications')"/>
      </el-form-item>
      <el-form-item label="No attachment links">
        <el-switch :value="frontend.masto_fe.noAttachmentLinks" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'noAttachmentLinks')"/>
      </el-form-item>
      <el-form-item label="NSFW Censor image">
        <el-input :value="frontend.masto_fe.nsfwCensorImage" @input="processNestedData($event, 'frontend_configurations', 'masto_fe', 'nsfwCensorImage')"/>
      </el-form-item>
      <el-form-item label="Show features panel">
        <el-switch :value="frontend.masto_fe.showFeaturesPanel" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'showFeaturesPanel')"/>
      </el-form-item>
      <el-form-item label="Minimal scopes mode">
        <el-switch :value="frontend.masto_fe.minimalScopesMode" @change="processNestedData($event, 'frontend_configurations', 'masto_fe', 'minimalScopesMode')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="assets" :model="assets" :label-width="labelWidth">
      <el-form-item label="Assets:"/>
      <el-form-item label="Default mascot">
        <el-select :value="assets.default_mascot" @change="updateSetting($event, 'assets', 'default_mascot')"/>
        <p class="expl">An element from mascots - This will be used as the default mascot on MastoFE
        (default: <span class="code">:pleroma_fox_tan</span>)</p>
      </el-form-item>
      <el-form-item label="Mascots">
        <div v-for="([name, url, mimeType], index) in mascots" :key="index" class="mascot-container">
          <div class="mascot-name-container">
            <el-input :value="name" placeholder="Name" class="mascot-name-input" @input="parseMascots($event, 'name', index)"/>
            <el-button icon="el-icon-minus" circle @click="deleteMascotsRow(index, 'emoji', 'groups')"/>
          </div>
          <el-input :value="url" placeholder="URL" class="mascot-input" @input="parseMascots($event, 'url', index)"/>
          <el-input :value="mimeType" placeholder="Mime type" class="mascot-input" @input="parseMascots($event, 'mimeType', index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addRowToMascots"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="emoji" :model="emoji" :label-width="labelWidth">
      <el-form-item label="Emoji:"/>
      <el-form-item label="Location of emoji files">
        <el-select :value="emoji.shortcode_globs || []" multiple filterable allow-create @change="updateSetting($event, 'emoji', 'shortcode_globs')">
          <el-option label="/emoji/custom/**/*.png" value="/emoji/custom/**/*.png"/>
        </el-select>
        <p class="expl">Location of custom emoji files. <span class="code">*</span> can be used as a wildcard.</p>
      </el-form-item>
      <el-form-item label="Pack extensions">
        <el-select :value="emoji.pack_extensions || []" multiple filterable allow-create @change="updateSetting($event, 'emoji', 'pack_extensions')"/>
        <p class="expl">A list of file extensions for emojis, when no <span class="code">emoji.txt</span> for a pack is present. </p>
      </el-form-item>
      <el-form-item label="Group">
        <div v-for="([key, value], index) in groups" :key="index" class="setting-input">
          <el-input :value="key" placeholder="key" class="name-input" @input="parseGroups($event, 'key', index)"/> :
          <el-select :value="value" multiple filterable allow-create class="value-input" @change="parseGroups($event, 'value', index)"/>
          <el-button icon="el-icon-minus" circle @click="deleteGroupsRow(index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addRowToGroups"/>
      </el-form-item>
      <el-form-item label="Location of JSON-manifest">
        <el-input :value="emoji.default_manifest" @input="updateSetting($event, 'emoji', 'default_manifest')"/>
        <p class="expl">Location of the JSON-manifest. This manifest contains information about the emoji-packs you can download. Currently only one manifest can be added (no arrays).</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="chat" :model="chat" :label-width="labelWidth">
      <el-form-item label="Chat enabled">
        <el-switch :value="chat.enabled" @input="updateSetting($event, 'chat', 'enabled')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="markup" :model="markup" :label-width="labelWidth">
      <el-form-item label="Markup settings:"/>
      <el-form-item label="Allow inline images">
        <el-switch :value="markup.allow_inline_images" @input="updateSetting($event, 'markup', 'allow_inline_images')"/>
      </el-form-item>
      <el-form-item label="Allow headings">
        <el-switch :value="markup.allow_headings" @input="updateSetting($event, 'markup', 'allow_headings')"/>
      </el-form-item>
      <el-form-item label="Allow tables">
        <el-switch :value="markup.allow_tables" @input="updateSetting($event, 'markup', 'allow_tables')"/>
      </el-form-item>
      <el-form-item label="Allow fonts">
        <el-switch :value="markup.allow_fonts" @input="updateSetting($event, 'markup', 'allow_fonts')"/>
      </el-form-item>
      <el-form-item label="Scrub policy">
        <el-select :value="markup.scrub_policy || []" multiple filterable allow-create @change="updateSetting($event, 'markup', 'scrub_policy')">
          <el-option label="Pleroma.HTML.Transform.MediaProxy" value="Pleroma.HTML.Transform.MediaProxy"/>
          <el-option label="Pleroma.HTML.Scrubber.Default" value="Pleroma.HTML.Scrubber.Default"/>
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
  name: 'Frontend',
  computed: {
    ...mapGetters([
      'assetsConfig',
      'frontendConfig',
      'emojiConfig',
      'chatConfig',
      'markupConfig'
    ]),
    assets() {
      return this.assetsConfig
    },
    chat() {
      return this.chatConfig
    },
    emoji() {
      return this.emojiConfig
    },
    frontend() {
      return this.frontendConfig
    },
    groups() {
      return Object.keys(this.emojiConfig.groups).map(key => [key, this.emojiConfig.groups[key]])
    },
    markup() {
      return this.markupConfig
    },
    mascots() {
      return Object.keys(this.assetsConfig.mascots)
        .map(mascotName =>
          [mascotName, this.assetsConfig.mascots[mascotName].url, this.assetsConfig.mascots[mascotName].mime_type])
    },
    themeOptions() {
      return options.themeOptions
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    addRowToGroups() {
      const updatedValue = this.groups.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, 'emoji', 'groups')
    },
    addRowToMascots() {
      const updatedValue = this.mascots.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
      }, {})
      this.updateSetting({ ...updatedValue, '': { url: '', mime_type: '' }}, 'assets', 'mascots')
    },
    deleteGroupsRow(index) {
      const filteredValues = this.groups.filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'emoji', 'groups')
    },
    deleteMascotsRow(index) {
      const filteredValues = this.mascots.filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
      }, {})
      this.updateSetting(updatedValue, 'assets', 'mascots')
    },
    parseGroups(value, inputType, index) {
      const updatedValue = this.groups.reduce((acc, el, i) => {
        if (index === i) {
          return inputType === 'key' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
        }
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'emoji', 'groups')
    },
    parseMascots(value, inputType, index) {
      const updatedValue = this.mascots.reduce((acc, el, i) => {
        if (index === i) {
          if (inputType === 'name') {
            return { ...acc, [value]: { url: el[1], mime_type: el[2] }}
          } else if (inputType === 'url') {
            return { ...acc, [el[0]]: { url: value, mime_type: el[2] }}
          } else {
            return { ...acc, [el[0]]: { url: el[1], mime_type: value }}
          }
        }
        return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
      }, {})
      this.updateSetting(updatedValue, 'assets', 'mascots')
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
    },
    sendBackgroundMasto({ file }) {
      this.$store.dispatch('UploadMedia', { file, tab: 'frontend_configurations', inputName: 'masto_fe', childName: 'background' })
    },
    sendBackgroundPleroma({ file }) {
      this.$store.dispatch('UploadMedia', { file, tab: 'frontend_configurations', inputName: 'pleroma_fe', childName: 'background' })
    },
    sendLogoMasto({ file }) {
      this.$store.dispatch('UploadMedia', { file, tab: 'frontend_configurations', inputName: 'masto_fe', childName: 'logo' })
    },
    sendLogoPleroma({ file }) {
      this.$store.dispatch('UploadMedia', { file, tab: 'frontend_configurations', inputName: 'pleroma_fe', childName: 'logo' })
    },
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
