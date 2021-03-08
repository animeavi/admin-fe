<template>
  <div>
    <i v-if="icon" :class="icon" class="menu-item-icon"/>
    <span slot="title">{{ title }}</span>
    <el-badge :value="count" type="primary" class="count-badge" />
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    count: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.count-badge {
  margin-left: 5px;
  height: 48px;
}
.menu-item-icon {
    margin-right: 5px;
    width: 18px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
}
</style>
