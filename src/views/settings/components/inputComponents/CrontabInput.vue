<template>
  <div>
    <el-form-item v-for="worker in workers" :label="worker" :key="worker" label-width="380px">
      <el-input
        :value="data[worker]"
        :placeholder="getSuggestion(worker) || null"
        class="input"
        @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'CrontabInput',
  props: {
    data: {
      type: Array,
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
    workers() {
      return this.setting.suggestions.map(worker => worker[1])
    }
  },
  methods: {
    getSuggestion(worker) {
      return this.setting.suggestions.find(suggestion => suggestion[1] === worker)[0]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
