<template>
  <div>
    <el-form ref="instance" :model="instance" :label-width="labelWidth">
      <el-form-item label="Name">
        <el-input :value="instance.name" @input="updateSetting($event, 'instance', 'name')"/>
        <p class="expl">The instance’s name</p>
      </el-form-item>
      <el-form-item label="Email">
        <el-input :value="instance.email" @input="updateSetting($event, 'instance', 'email')"/>
        <p class="expl">Email used to reach an Administrator/Moderator of the instance</p>
      </el-form-item>
      <el-form-item label="Notify email">
        <el-input :value="instance.notify_email" @input="updateSetting($event, 'instance', 'notify_email')"/>
        <p class="expl">Email used for notifications</p>
      </el-form-item>
      <el-form-item label="Description">
        <el-input :value="instance.description" @input="updateSetting($event, 'instance', 'description')"/>
        <p class="expl">The instance’s description, can be seen in nodeinfo and <span class="code">/api/v1/instance</span></p>
      </el-form-item>
      <el-form-item label="Limit">
        <el-input-number :value="instance.limit" :step="1000" :min="0" size="large" @change="updateSetting($event, 'instance', 'limit')"/>
        <p class="expl">Posts character limit (CW/Subject included in the counter)</p>
      </el-form-item>
      <el-form-item label="Remote limit">
        <el-input-number :value="instance.remote_limit" :step="1000" :min="0" size="large" @change="updateSetting($event, 'instance', 'remote_limit')"/>
        <p class="expl">Hard character limit beyond which remote posts will be dropped</p>
      </el-form-item>
      <el-form-item label="Upload limit (MB)">
        <el-input-number :value="instance.upload_limit / 1048576" :step="1" :min="0" size="large" @change="updateSetting($event * 1048576, 'instance', 'upload_limit')"/>
        <p class="expl">File size limit of uploads (except for avatar, background, banner)</p>
      </el-form-item>
      <el-form-item label="Avatar upload limit (MB)">
        <el-input-number :value="instance.avatar_upload_limit / 1048576" :step="1" :min="0" size="large" @change="updateSetting($event * 1048576, 'instance', 'avatar_upload_limit')"/>
        <p class="expl">File size limit of user’s profile avatars</p>
      </el-form-item>
      <el-form-item label="Background upload limit (MB)">
        <el-input-number :value="instance.background_upload_limit / 1048576" :step="1" :min="0" size="large" @change="updateSetting($event * 1048576, 'instance', 'background_upload_limit')"/>
        <p class="expl">File size limit of user’s profile backgrounds</p>
      </el-form-item>
      <el-form-item label="Banner upload limit (MB)">
        <el-input-number :value="instance.banner_upload_limit / 1048576" :step="1" :min="0" size="large" @change="updateSetting($event * 1048576, 'instance', 'banner_upload_limit')"/>
        <p class="expl">File size limit of user’s profile banners</p>
      </el-form-item>
      <el-form-item label="User bio length">
        <el-input-number :value="instance.user_bio_length" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'user_bio_length')"/>
        <p class="expl">A user bio maximum length (default: 5000)</p>
      </el-form-item>
      <el-form-item label="User name length">
        <el-input-number :value="instance.user_name_length" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'user_name_length')"/>
        <p class="expl">A user name maximum length (default: 100)</p>
      </el-form-item>
      <el-form-item label="Poll limits:"/>
      <el-form-item label="Max options">
        <el-input-number :value="instance.poll_limits.max_options" :step="1" :min="0" size="large" @change="processNestedData($event, 'instance', 'poll_limits', 'max_options')"/>
        <p class="expl">Maximum number of options</p>
      </el-form-item>
      <el-form-item label="Max characters per option">
        <el-input-number :value="instance.poll_limits.max_option_chars" :step="1" :min="0" size="large" @change="processNestedData($event, 'instance', 'poll_limits', 'max_option_chars')"/>
        <p class="expl">Maximum number of characters per option</p>
      </el-form-item>
      <el-form-item label="Minimum expiration (days)">
        <el-input-number :value="instance.poll_limits.min_expiration" :step="1" :min="0" size="large" @change="processNestedData($event, 'instance', 'poll_limits', 'min_expiration')"/>
        <p class="expl">Minimum expiration time</p>
      </el-form-item>
      <el-form-item label="Max expiration (days)">
        <el-input-number :value="instance.poll_limits.max_expiration / 86400" :step="1" :min="0" size="large" @change="processNestedData($event * 86400, 'instance', 'poll_limits', 'max_expiration')"/>
        <p class="expl">Maximum expiration time</p>
      </el-form-item>
      <el-form-item label="Registrations open">
        <el-switch :value="instance.registrations_open" @change="updateSetting($event, 'instance', 'registrations_open')"/>
        <p class="expl">Enable registrations for anyone, invitations can be enabled when false</p>
      </el-form-item>
      <el-form-item label="Invites enabled">
        <el-switch :value="instance.invites_enabled" @change="updateSetting($event, 'instance', 'invites_enabled')"/>
        <p class="expl">Enable user invitations for admins (depends on <span class="code">registrations_open: false)</span>.</p>
      </el-form-item>
      <el-form-item label="Account activation required">
        <el-switch :value="instance.account_activation_required" @change="updateSetting($event, 'instance', 'account_activation_required')"/>
        <p class="expl">Require users to confirm their emails before signing in</p>
      </el-form-item>
      <div class="line"/>
      <el-form-item label="Federating">
        <el-switch :value="instance.federating" @change="updateSetting($event, 'instance', 'federating')"/>
        <p class="expl">Enable federation with other instances</p>
      </el-form-item>
      <el-form-item label="Fed. replies max depth">
        <el-input-number :value="instance.federation_incoming_replies_max_depth" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'federation_incoming_replies_max_depth')"/>
        <p class="expl">Max. depth of reply-to activities fetching on incoming federation, to prevent out-of-memory situations while fetching very long threads. Lower this value if you experience out-of-memory crashes.</p>
      </el-form-item>
      <el-form-item label="Fed. reachability timeout">
        <el-input-number :value="instance.federation_reachability_timeout_days" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'federation_reachability_timeout_days')"/>
        <p class="expl">Timeout (in days) of each external federation target being unreachable prior to pausing federating to it</p>
      </el-form-item>
      <el-form-item label="Federation publisher modules">
        <el-select :value="instance.federation_publisher_modules || []" multiple filterable allow-create @change="updateSetting($event, 'instance', 'federation_publisher_modules')">
          <el-option
            v-for="item in federationPublisherModulesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Allow relay">
        <el-switch :value="instance.allow_relay" @change="updateSetting($event, 'instance', 'allow_relay')"/>
        <p class="expl">Enable Pleroma’s Relay, which makes it possible to follow a whole instance</p>
      </el-form-item>
      <el-form-item label="Rewrite policy">
        <el-select :value="rewritePolicy || []" multiple filterable allow-create @change="updateSetting($event, 'instance', 'rewrite_policy')">
          <el-option
            v-for="item in rewritePolicyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p
          v-for="item in rewritePolicyExplanations"
          :key="item"
          class="expl">{{ getRewritePolicyExpl(item) }}</p>
      </el-form-item>
      <el-form-item label="Public">
        <el-switch :value="instance.public" @change="updateSetting($event, 'instance', 'public')"/>
        <p class="expl">Makes the client API in authentificated mode-only except for user-profiles. Useful for disabling the Local Timeline and The Whole Known Network</p>
      </el-form-item>
      <el-form-item label="Quarantined instances">
        <el-select :value="instance.quarantined_instances || []" multiple filterable allow-create @change="updateSetting($event, 'instance', 'quarantined_instances')">
          <el-option
            v-for="item in quarantinedInstancesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p class="expl">List of ActivityPub instances where private (DMs, followers-only) activities will not be send</p>
      </el-form-item>
      <div class="line"/>
      <el-form-item label="Managed config">
        <el-switch :value="instance.managed_config" @change="updateSetting($event, 'instance', 'managed_config')"/>
        <p class="expl">Whenether the config for pleroma-fe is configured in this config or in <span class="code">static/config.json</span></p>
      </el-form-item>
      <el-form-item label="Static directory">
        <el-input :value="instance.static_dir" @input="updateSetting($event, 'instance', 'static_dir')"/>
      </el-form-item>
      <el-form-item label="Allowed post formats">
        <el-select :value="instance.allowed_post_formats || []" multiple filterable allow-create @change="updateSetting($event, 'instance', 'allowed_post_formats')">
          <el-option label="text/plain" value="text/plain"/>
          <el-option label="text/html" value="text/html"/>
          <el-option label="text/markdown" value="text/markdown"/>
          <el-option label="text/bbcode" value="text/bbcode"/>
        </el-select>
        <p class="expl">MIME-type list of formats allowed to be posted (transformed into HTML)</p>
      </el-form-item>
      <el-form-item label="MRF transparency">
        <el-switch :value="instance.mrf_transparency" @change="updateSetting($event, 'instance', 'mrf_transparency')"/>
        <p class="expl">Make the content of your Message Rewrite Facility settings public (via nodeinfo)</p>
      </el-form-item>
      <el-form-item label="MRF transparency exclusions">
        <el-select :value="instance.mrf_transparency_exclusions || []" multiple filterable allow-create @change="updateSetting($event, 'instance', 'mrf_transparency_exclusions')"/>
      </el-form-item>
      <el-form-item label="Scope copy">
        <el-switch :value="instance.scope_copy" @change="updateSetting($event, 'instance', 'scope_copy')"/>
        <p class="expl">Copy the scope <span class="code">(private/unlisted/public)</span> in replies to posts by default</p>
      </el-form-item>
      <el-form-item label="Subject line behavior">
        <el-select :value="instance.subject_line_behavior" clearable @change="updateSetting($event, 'instance', 'subject_line_behavior')">
          <el-option label="Email" value="email">Email / Copy and preprend re:, as in email</el-option>
          <el-option label="Masto" value="masto">Masto / Copy verbatim, as in Mastodon</el-option>
          <el-option label="Noop" value="noop">Noop / Don't copy the subject</el-option>
        </el-select>
        <p class="expl">Allows changing the default behaviour of subject lines in replies</p>
      </el-form-item>
      <el-form-item label="Always show subject input">
        <el-switch :value="instance.always_show_subject_input" @change="updateSetting($event, 'instance', 'always_show_subject_input')"/>
        <p class="expl">When set to false, auto-hide the subject field when it's empty</p>
      </el-form-item>
      <el-form-item label="Extended nickname format">
        <el-switch :value="instance.extended_nickname_format" @change="updateSetting($event, 'instance', 'extended_nickname_format')"/>
        <p class="expl">Set to <span class="code">true</span> to use extended local nicknames format (allows underscores/dashes). This will break federation with older software for theses nicknames</p>
      </el-form-item>
      <el-form-item label="Max pinned statuses">
        <el-input-number :value="instance.max_pinned_statuses" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'max_pinned_statuses')"/>
        <p class="expl">The maximum number of pinned statuses. '0' will disable the feature</p>
      </el-form-item>
      <el-form-item label="Autofollowed nicknames">
        <el-select :value="instance.autofollowed_nicknames || []" multiple filterable allow-create @change="updateSetting($event, 'instance', 'autofollowed_nicknames')">
          <el-option
            v-for="item in autofollowedNicknamesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p class="expl">Set to nicknames of (local) users that every new user should automatically follow</p>
      </el-form-item>
      <el-form-item label="No attachment links">
        <el-switch :value="instance.no_attachment_links" @change="updateSetting($event, 'instance', 'no_attachment_links')"/>
        <p class="expl">Set to true to disable automatically adding attachment link text to statuses</p>
      </el-form-item>
      <el-form-item label="Welcome message">
        <el-input :value="instance.welcome_message" @input="updateSetting($event, 'instance', 'welcome_message')"/>
        <p class="expl">A message that will be send to a newly registered users as a direct message</p>
      </el-form-item>
      <el-form-item label="Welcome user nickname">
        <el-input :value="instance.welcome_user_nickname" @input="updateSetting($event, 'instance', 'welcome_user_nickname')"/>
        <p class="expl">The nickname of the local user that sends the welcome message</p>
      </el-form-item>
      <el-form-item label="Max report comment size">
        <el-input-number :value="instance.max_report_comment_size" :step="100" :min="0" size="large" @change="updateSetting($event, 'instance', 'max_report_comment_size')"/>
        <p class="expl">The maximum size of the report comment</p>
      </el-form-item>
      <el-form-item label="Safe DM mentions">
        <el-switch :value="instance.safe_dm_mentions" @change="updateSetting($event, 'instance', 'safe_dm_mentions')"/>
        <p class="expl">If set to true, only mentions at the beginning of a post will be used to address people in direct messages. This is to prevent accidental mentioning of people when talking about them</p>
      </el-form-item>
      <el-form-item label="Healthcheck">
        <el-switch :value="instance.healthcheck" @change="updateSetting($event, 'instance', 'healthcheck')"/>
        <p class="expl">If set to true, system data will be shown on <span class="code">/api/pleroma/healthcheck</span></p>
      </el-form-item>
      <el-form-item label="Remote post retention days">
        <el-input-number :value="instance.remote_post_retention_days" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'remote_post_retention_days')"/>
        <p class="expl">The default amount of days to retain remote posts when pruning the database.</p>
      </el-form-item>
      <el-form-item label="Skip thread containment">
        <el-switch :value="instance.skip_thread_containment" @change="updateSetting($event, 'instance', 'skip_thread_containment')"/>
        <p class="expl">Skip filter out broken threads.</p>
      </el-form-item>
      <el-form-item label="Limit to local content">
        <el-select :value="instance.limit_to_local_content" clearable @change="updateSetting($event, 'instance', 'limit_to_local_content')">
          <el-option label="Unauthenticated" value=":unauthenticated"/>
          <el-option label="All" value=":all"/>
          <el-option label="False" value="false"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Dynamic configuration">
        <el-switch :value="instance.dynamic_configuration" @change="updateSetting($event, 'instance', 'dynamic_configuration')"/>
        <p class="expl">Allow transferring configuration to DB with the subsequent customization from Admin API</p>
      </el-form-item>
      <el-form-item label="Max account fields">
        <el-input-number :value="instance.max_account_fields" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'max_account_fields')"/>
        <p class="expl">The maximum number of custom fields in the user profile (Default: 4)</p>
      </el-form-item>
      <el-form-item label="Max remote account fields">
        <el-input-number :value="instance.max_remote_account_fields" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'max_remote_account_fields')"/>
        <p class="expl">The maximum number of custom fields in the remote user profile (Default: 10)</p>
      </el-form-item>
      <el-form-item label="Account field name length">
        <el-input-number :value="instance.account_field_name_length" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'account_field_name_length')"/>
        <p class="expl">An account field name maximum length (Default: 255)</p>
      </el-form-item>
      <el-form-item label="Account field value length">
        <el-input-number :value="instance.account_field_value_length" :step="1" :min="0" size="large" @change="updateSetting($event, 'instance', 'account_field_value_length')"/>
        <p class="expl">An account field value maximum length (Default: 255)</p>
      </el-form-item>
      <el-form-item label="External user synchronization">
        <el-switch :value="instance.external_user_synchronization" @change="updateSetting($event, 'instance', 'external_user_synchronization')"/>
        <p class="expl">Enabling following/followers counters synchronization for external users.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="uriSchemes" :model="uriSchemes" :label-width="labelWidth">
      <el-form-item label="URI schemes">
        <el-select :value="uriSchemes.valid_schemes || []" multiple filterable allow-create @change="updateSetting($event, 'uri_schemes', 'valid_schemes')">
          <el-option
            v-for="item in uriSchemesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <p class="expl">List of the scheme part that is considered valid to be an URL</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="adminToken" :model="adminToken" :label-width="labelWidth">
      <el-form-item label="Admin token">
        <el-input :value="adminToken.value" @input="updateSetting($event, 'admin_token', 'value')"/>
        <p class="expl">Allows to set a token that can be used to authenticate with the admin api without using an actual user by giving it as the <span class="code">admin_token</span> parameter.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="scheduledActivity" :model="scheduledActivity" :label-width="labelWidth">
      <el-form-item label="Scheduled activity:"/>
      <el-form-item label="Daily user limit">
        <el-input-number :value="scheduledActivity.daily_user_limit" :step="5" :min="0" size="large" @change="updateSetting($event, 'Pleroma.ScheduledActivity', 'daily_user_limit')"/>
        <p class="expl">The number of scheduled activities a user is allowed to create in a single day (Default: 25)</p>
      </el-form-item>
      <el-form-item label="Total user limit">
        <el-input-number :value="scheduledActivity.total_user_limit" :step="10" :min="0" size="large" @change="updateSetting($event, 'Pleroma.ScheduledActivity', 'total_user_limit')"/>
        <p class="expl">The number of scheduled activities a user is allowed to create in total (Default: 300)</p>
      </el-form-item>
      <el-form-item label="Enabled">
        <el-switch :value="scheduledActivity.enabled" @change="updateSetting($event, 'Pleroma.ScheduledActivity', 'enabled')"/>
        <p class="expl">Whether scheduled activities are sent to the job queue to be executed</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="fetchInitialPosts" :model="fetchInitialPosts" :label-width="labelWidth">
      <el-form-item label="Fetch initial posts">
        <el-switch :value="fetchInitialPosts.enabled" @change="updateSetting($event, 'fetch_initial_posts', 'enabled')"/>
        <p class="expl">If enabled, when a new user is federated with, fetch some of their latest posts</p>
      </el-form-item>
      <el-form-item label="Pages">
        <el-input-number :value="fetchInitialPosts.pages" :step="1" :min="0" size="large" @change="updateSetting($event, 'fetch_initial_posts', 'pages')"/>
        <p class="expl">The amount of pages to fetch</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="suggestions" :model="suggestions" :label-width="labelWidth">
      <el-form-item label="Suggestions:"/>
      <el-form-item label="Enabled">
        <el-switch :value="suggestions.enabled" @change="updateSetting($event, 'suggestions', 'enabled')"/>
      </el-form-item>
      <el-form-item label="Third party engine">
        <el-input :value="suggestions.third_party_engine" @input="updateSetting($event, 'suggestions', 'third_party_engine')"/>
      </el-form-item>
      <el-form-item label="Timeout">
        <el-input-number :value="suggestions.timeout" :step="1000" :min="0" size="large" @change="updateSetting($event, 'suggestions', 'timeout')"/>
      </el-form-item>
      <el-form-item label="Limit">
        <el-input-number :value="suggestions.limit" :step="1" :min="0" size="large" @change="updateSetting($event, 'suggestions', 'limit')"/>
      </el-form-item>
      <el-form-item label="Web">
        <el-input :value="suggestions.web" @input="updateSetting($event, 'suggestions', 'web')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="pleromaUser" :model="pleromaUser" :label-width="labelWidth">
      <el-form-item label="Restricted nicknames">
        <el-select :value="pleromaUser.restricted_nicknames || []" multiple filterable allow-create @change="updateSetting($event, 'Pleroma.User', 'restricted_nicknames')">
          <el-option
            v-for="item in restrictedNicknamesOptions"
            :key="item.value"
            :value="item.value"/>
        </el-select>
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
import { options } from './options'

export default {
  name: 'Instance',
  computed: {
    ...mapGetters([
      'adminToken',
      'fetchInitialPosts',
      'instance',
      'pleromaUser',
      'scheduledActivity',
      'suggestions',
      'uriSchemes'
    ]),
    autofollowedNicknamesOptions() {
      return options.autofollowedNicknamesOptions
    },
    federationPublisherModulesOptions() {
      return options.federationPublisherModulesOptions
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    },
    quarantinedInstancesOptions() {
      return options.quarantinedInstancesOptions
    },
    restrictedNicknamesOptions() {
      return options.restrictedNicknamesOptions
    },
    rewritePolicy() {
      return typeof this.instance.rewrite_policy === 'string' ? [this.instance.rewrite_policy] : this.instance.rewrite_policy
    },
    rewritePolicyExplanations() {
      return this.rewritePolicy ? this.rewritePolicy.filter(policy => options.rewritePolicyOptions.find(el => el.value === policy)) : []
    },
    rewritePolicyOptions() {
      return options.rewritePolicyOptions
    },
    uriSchemesOptions() {
      return options.uriSchemesOptions
    }
  },
  methods: {
    getRewritePolicyExpl(value) {
      const policy = options.rewritePolicyOptions.find(el => el.value === value)
      return policy.expl
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
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
