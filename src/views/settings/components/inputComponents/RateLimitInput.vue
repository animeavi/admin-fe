<template>
  <div>
    <div v-if="!rateLimitAuthUsers">
      <el-input :value="rateLimitAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, setting.key, 'scale', 'oneLimit', rateLimitAllUsers)"/> :
      <el-input :value="rateLimitAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, setting.key, 'limit', 'oneLimit', rateLimitAllUsers)"/>
      <div class="limit-button-container">
        <el-button icon="el-icon-plus" circle @click="toggleLimits([{ '': '' }, { '': '' }], setting.key)"/>
        <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
      </div>
    </div>
    <div v-if="rateLimitAuthUsers">
      <el-form-item label="Authenticated users:">
        <el-input :value="rateLimitAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, setting.key, 'scale', 'authUserslimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/> :
        <el-input :value="rateLimitAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, setting.key, 'limit', 'authUserslimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/>
      </el-form-item>
      <el-form-item label="Unauthenticated users:">
        <el-input :value="rateLimitUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, setting.key, 'scale', 'unauthUsersLimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/> :
        <el-input :value="rateLimitUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, setting.key, 'limit', 'unauthUsersLimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/>
      </el-form-item>
      <div class="limit-button-container">
        <el-button icon="el-icon-minus" circle @click="toggleLimits({ '': '' }, setting.key)"/>
        <p class="expl limit-expl">Set limit for all users</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RateLimitInput',
  props: {
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    setting: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingGroup: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    rateLimitAllUsers() {
      return this.data[this.setting.key] ? this.data[this.setting.key] : ['', '']
    },
    rateLimitAuthUsers() {
      return this.data[this.setting.key] && Array.isArray(this.data[this.setting.key][0])
        ? this.data[this.setting.key][0]
        : false
    },
    rateLimitUnauthUsers() {
      return this.data[this.setting.key] && Array.isArray(this.data[this.setting.key][1])
        ? this.data[this.setting.key][1]
        : false
    }
  },
  methods: {
    parseRateLimiter(value, input, typeOfInput, typeOfLimit, currentValue) {
      if (typeOfLimit === 'oneLimit') {
        const valueToSend = typeOfInput === 'scale' ? { [value]: currentValue[1] } : { [currentValue[0]]: value }
        this.updateSetting(valueToSend, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else if (typeOfLimit === 'authUserslimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ [currentValue[0][0]]: currentValue[0][1] }, { [value]: currentValue[1][1] }]
          : [{ [currentValue[0][0]]: currentValue[0][1] }, { [currentValue[1][0]]: value }]
        this.updateSetting(valueToSend, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else if (typeOfLimit === 'unauthUsersLimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ [value]: currentValue[0][1] }, { [currentValue[1][0]]: currentValue[1][1] }]
          : [{ [currentValue[0][0]]: value }, { [currentValue[1][0]]: currentValue[1][1] }]
        this.updateSetting(valueToSend, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      }
    },
    toggleLimits(value, input) {
      this.updateSetting(value, this.settingGroup.group, this.settingGroup.key, input)
    },
    updateSetting(value, group, key, input, type) {
      const updatedSettings = Array.isArray(value)
        ? value.map(element => { return { 'tuple': Object.entries(element)[0] } })
        : { 'tuple': Object.entries(value)[0] }
      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedSettings, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
