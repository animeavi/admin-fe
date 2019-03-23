<template>
  <el-select v-model="value" placeholder="Select filter">
    <el-option-group
      v-for="group in filters"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      filters: [{
        label: 'By user type',
        options: [{
          label: 'Show local',
          value: 'showLocal'
        }, {
          label: 'Show external',
          value: 'showExternal'
        }]
      }, {
        label: 'By status',
        options: [{
          label: 'Show Active',
          value: 'showActive'
        }, {
          label: 'Show Deactivated',
          value: 'showDeactivated'
        }]
      }],
      value: ''
    }
  }
}
</script>
