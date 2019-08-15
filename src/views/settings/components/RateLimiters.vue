<template>
  <el-form ref="rateLimiters" :model="rateLimiters" :label-width="labelWidth">
    <el-form-item label="Search:">
      <div v-if="!searchLimitAuthUsers">
        <el-input :value="searchLimitAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'search', 'scale', 'oneLimit', searchLimitAllUsers)"/> :
        <el-input :value="searchLimitAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'search', 'limit', 'oneLimit', searchLimitAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'search')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="searchLimitAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="searchLimitAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'search', 'scale', 'authUserslimit', [searchLimitUnauthUsers, searchLimitAuthUsers])"/> :
          <el-input :value="searchLimitAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'search', 'limit', 'authUserslimit', [searchLimitUnauthUsers, searchLimitAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="searchLimitUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'search', 'scale', 'unauthUsersLimit', [searchLimitUnauthUsers, searchLimitAuthUsers])"/> :
          <el-input :value="searchLimitUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'search', 'limit', 'unauthUsersLimit', [searchLimitUnauthUsers, searchLimitAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'search')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="App account creation:">
      <div v-if="!appAccountCreationAuthUsers">
        <el-input :value="appAccountCreationAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'app_account_creation', 'scale', 'oneLimit', appAccountCreationAllUsers)"/> :
        <el-input :value="appAccountCreationAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'app_account_creation', 'limit', 'oneLimit', appAccountCreationAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'app_account_creation')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="appAccountCreationAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="appAccountCreationAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'app_account_creation', 'scale', 'authUserslimit', [appAccountCreationUnauthUsers, appAccountCreationAuthUsers])"/> :
          <el-input :value="appAccountCreationAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'app_account_creation', 'limit', 'authUserslimit', [appAccountCreationUnauthUsers, appAccountCreationAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="appAccountCreationUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'app_account_creation', 'scale', 'unauthUsersLimit', [appAccountCreationUnauthUsers, appAccountCreationAuthUsers])"/> :
          <el-input :value="appAccountCreationUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'app_account_creation', 'limit', 'unauthUsersLimit', [appAccountCreationUnauthUsers, appAccountCreationAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'app_account_creation')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="Relations actions:">
      <div v-if="!relationsActionsAuthUsers">
        <el-input :value="relationsActionsAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'relations_actions', 'scale', 'oneLimit', relationsActionsAllUsers)"/> :
        <el-input :value="relationsActionsAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'relations_actions', 'limit', 'oneLimit', relationsActionsAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'relations_actions')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="relationsActionsAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="relationsActionsAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'relations_actions', 'scale', 'authUserslimit', [relationsActionsUnauthUsers, relationsActionsAuthUsers])"/> :
          <el-input :value="relationsActionsAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'relations_actions', 'limit', 'authUserslimit', [relationsActionsUnauthUsers, relationsActionsAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="relationsActionsUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'relations_actions', 'scale', 'unauthUsersLimit', [relationsActionsUnauthUsers, relationsActionsAuthUsers])"/> :
          <el-input :value="relationsActionsUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'relations_actions', 'limit', 'unauthUsersLimit', [relationsActionsUnauthUsers, relationsActionsAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'relations_actions')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="Relation ID Action:">
      <div v-if="!relationIdActionAuthUsers">
        <el-input :value="relationIdActionAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'relation_id_action', 'scale', 'oneLimit', relationIdActionAllUsers)"/> :
        <el-input :value="relationIdActionAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'relation_id_action', 'limit', 'oneLimit', relationIdActionAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'relation_id_action')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="relationIdActionAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="relationIdActionAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'relation_id_action', 'scale', 'authUserslimit', [relationIdActionUnauthUsers, relationIdActionAuthUsers])"/> :
          <el-input :value="relationIdActionAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'relation_id_action', 'limit', 'authUserslimit', [relationIdActionUnauthUsers, relationIdActionAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="relationIdActionUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'relation_id_action', 'scale', 'unauthUsersLimit', [relationIdActionUnauthUsers, relationIdActionAuthUsers])"/> :
          <el-input :value="relationIdActionUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'relation_id_action', 'limit', 'unauthUsersLimit', [relationIdActionUnauthUsers, relationIdActionAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'relation_id_action')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="Statuses actions:">
      <div v-if="!statusesActionsAuthUsers">
        <el-input :value="statusesActionsAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'statuses_actions', 'scale', 'oneLimit', statusesActionsAllUsers)"/> :
        <el-input :value="statusesActionsAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'statuses_actions', 'limit', 'oneLimit', statusesActionsAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'statuses_actions')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="statusesActionsAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="statusesActionsAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'statuses_actions', 'scale', 'authUserslimit', [statusesActionsUnauthUsers, statusesActionsAuthUsers])"/> :
          <el-input :value="statusesActionsAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'statuses_actions', 'limit', 'authUserslimit', [statusesActionsUnauthUsers, statusesActionsAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="statusesActionsUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'statuses_actions', 'scale', 'unauthUsersLimit', [statusesActionsUnauthUsers, statusesActionsAuthUsers])"/> :
          <el-input :value="statusesActionsUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'statuses_actions', 'limit', 'unauthUsersLimit', [statusesActionsUnauthUsers, statusesActionsAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'statuses_actions')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="Status ID Action:">
      <div v-if="!statusIdActionAuthUsers">
        <el-input :value="statusIdActionAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'status_id_action', 'scale', 'oneLimit', statusIdActionAllUsers)"/> :
        <el-input :value="statusIdActionAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'status_id_action', 'limit', 'oneLimit', statusIdActionAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'status_id_action')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="statusIdActionAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="statusIdActionAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'status_id_action', 'scale', 'authUserslimit', [statusIdActionUnauthUsers, statusIdActionAuthUsers])"/> :
          <el-input :value="statusIdActionAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'status_id_action', 'limit', 'authUserslimit', [statusIdActionUnauthUsers, statusIdActionAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="statusIdActionUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'status_id_action', 'scale', 'unauthUsersLimit', [statusIdActionUnauthUsers, statusIdActionAuthUsers])"/> :
          <el-input :value="statusIdActionUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'status_id_action', 'limit', 'unauthUsersLimit', [statusIdActionUnauthUsers, statusIdActionAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'status_id_action')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="Password reset:">
      <div v-if="!passwordResetAuthUsers">
        <el-input :value="passwordResetAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'password_reset', 'scale', 'oneLimit', passwordResetAllUsers)"/> :
        <el-input :value="passwordResetAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'password_reset', 'limit', 'oneLimit', passwordResetAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'password_reset')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="passwordResetAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="passwordResetAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'password_reset', 'scale', 'authUserslimit', [passwordResetUnauthUsers, passwordResetAuthUsers])"/> :
          <el-input :value="passwordResetAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'password_reset', 'limit', 'authUserslimit', [passwordResetUnauthUsers, passwordResetAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="passwordResetUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'password_reset', 'scale', 'unauthUsersLimit', [passwordResetUnauthUsers, passwordResetAuthUsers])"/> :
          <el-input :value="passwordResetUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'password_reset', 'limit', 'unauthUsersLimit', [passwordResetUnauthUsers, passwordResetAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'password_reset')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="Account confirmation resend:">
      <div v-if="!accountConfirmationResendAuthUsers">
        <el-input :value="accountConfirmationResendAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'account_confirmation_resend', 'scale', 'oneLimit', accountConfirmationResendAllUsers)"/> :
        <el-input :value="accountConfirmationResendAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'account_confirmation_resend', 'limit', 'oneLimit', accountConfirmationResendAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], 'account_confirmation_resend')"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="accountConfirmationResendAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="accountConfirmationResendAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'account_confirmation_resend', 'scale', 'authUserslimit', [accountConfirmationResendUnauthUsers, accountConfirmationResendAuthUsers])"/> :
          <el-input :value="accountConfirmationResendAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'account_confirmation_resend', 'limit', 'authUserslimit', [accountConfirmationResendUnauthUsers, accountConfirmationResendAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="accountConfirmationResendUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, 'account_confirmation_resend', 'scale', 'unauthUsersLimit', [accountConfirmationResendUnauthUsers, accountConfirmationResendAuthUsers])"/> :
          <el-input :value="accountConfirmationResendUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, 'account_confirmation_resend', 'limit', 'unauthUsersLimit', [accountConfirmationResendUnauthUsers, accountConfirmationResendAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, 'account_confirmation_resend')"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
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
  name: 'RateLimiters',
  computed: {
    ...mapGetters([
      'rateLimiters'
    ]),
    accountConfirmationResendAllUsers() {
      return this.rateLimiters.account_confirmation_resend ? this.rateLimiters.account_confirmation_resend.tuple : [null, null]
    },
    accountConfirmationResendAuthUsers() {
      return Array.isArray(this.rateLimiters.account_confirmation_resend)
        ? this.rateLimiters.account_confirmation_resend[1].tuple
        : false
    },
    accountConfirmationResendUnauthUsers() {
      return Array.isArray(this.rateLimiters.account_confirmation_resend)
        ? this.rateLimiters.account_confirmation_resend[0].tuple
        : false
    },
    appAccountCreationAllUsers() {
      return this.rateLimiters.app_account_creation ? this.rateLimiters.app_account_creation.tuple : [null, null]
    },
    appAccountCreationAuthUsers() {
      return Array.isArray(this.rateLimiters.app_account_creation)
        ? this.rateLimiters.app_account_creation[1].tuple
        : false
    },
    appAccountCreationUnauthUsers() {
      return Array.isArray(this.rateLimiters.app_account_creation)
        ? this.rateLimiters.app_account_creation[0].tuple
        : false
    },
    passwordResetAllUsers() {
      return this.rateLimiters.password_reset ? this.rateLimiters.password_reset.tuple : [null, null]
    },
    passwordResetAuthUsers() {
      return Array.isArray(this.rateLimiters.password_reset)
        ? this.rateLimiters.password_reset[1].tuple
        : false
    },
    passwordResetUnauthUsers() {
      return Array.isArray(this.rateLimiters.password_reset)
        ? this.rateLimiters.password_reset[0].tuple
        : false
    },
    relationsActionsAllUsers() {
      return this.rateLimiters.relations_actions ? this.rateLimiters.relations_actions.tuple : [null, null]
    },
    relationsActionsAuthUsers() {
      return Array.isArray(this.rateLimiters.relations_actions)
        ? this.rateLimiters.relations_actions[1].tuple
        : false
    },
    relationsActionsUnauthUsers() {
      return Array.isArray(this.rateLimiters.relations_actions)
        ? this.rateLimiters.relations_actions[0].tuple
        : false
    },
    relationIdActionAllUsers() {
      return this.rateLimiters.relation_id_action ? this.rateLimiters.relation_id_action.tuple : [null, null]
    },
    relationIdActionAuthUsers() {
      return Array.isArray(this.rateLimiters.relation_id_action)
        ? this.rateLimiters.relation_id_action[1].tuple
        : false
    },
    relationIdActionUnauthUsers() {
      return Array.isArray(this.rateLimiters.relation_id_action)
        ? this.rateLimiters.relation_id_action[0].tuple
        : false
    },
    searchLimitAllUsers() {
      return this.rateLimiters.search ? this.rateLimiters.search.tuple : [null, null]
    },
    searchLimitAuthUsers() {
      return Array.isArray(this.rateLimiters.search)
        ? this.rateLimiters.search[1].tuple
        : false
    },
    searchLimitUnauthUsers() {
      return Array.isArray(this.rateLimiters.search)
        ? this.rateLimiters.search[0].tuple
        : false
    },
    statusesActionsAllUsers() {
      return this.rateLimiters.statuses_actions ? this.rateLimiters.statuses_actions.tuple : [null, null]
    },
    statusesActionsAuthUsers() {
      return Array.isArray(this.rateLimiters.statuses_actions)
        ? this.rateLimiters.statuses_actions[1].tuple
        : false
    },
    statusesActionsUnauthUsers() {
      return Array.isArray(this.rateLimiters.statuses_actions)
        ? this.rateLimiters.statuses_actions[0].tuple
        : false
    },
    statusIdActionAllUsers() {
      return this.rateLimiters.status_id_action ? this.rateLimiters.status_id_action.tuple : [null, null]
    },
    statusIdActionAuthUsers() {
      return Array.isArray(this.rateLimiters.status_id_action)
        ? this.rateLimiters.status_id_action[1].tuple
        : false
    },
    statusIdActionUnauthUsers() {
      return Array.isArray(this.rateLimiters.status_id_action)
        ? this.rateLimiters.status_id_action[0].tuple
        : false
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    parseRateLimiter(value, input, typeOfInput, typeOfLimit, currentValue) {
      if (typeOfLimit === 'oneLimit') {
        const valueToSend = typeOfInput === 'scale' ? { 'tuple': [value, currentValue[1]] } : { 'tuple': [currentValue[0], value] }
        this.updateSetting(valueToSend, 'rate_limit', input)
      } else if (typeOfLimit === 'authUserslimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ 'tuple': [currentValue[0][0], currentValue[0][1]] }, { 'tuple': [value, currentValue[1][1]] }]
          : [{ 'tuple': [currentValue[0][0], currentValue[0][1]] }, { 'tuple': [currentValue[1][0], value] }]
        this.updateSetting(valueToSend, 'rate_limit', input)
      } else if (typeOfLimit === 'unauthUsersLimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ 'tuple': [value, currentValue[0][1]] }, { 'tuple': [currentValue[1][0], currentValue[1][1]] }]
          : [{ 'tuple': [currentValue[0][0], value] }, { 'tuple': [currentValue[1][0], currentValue[1][1]] }]
        this.updateSetting(valueToSend, 'rate_limit', input)
      }
    },
    toggleLimits(value, input) {
      this.updateSetting(value, 'rate_limit', input)
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
