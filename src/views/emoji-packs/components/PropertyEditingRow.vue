<template>
  <el-row :gutter="20" class="prop-row">
    <el-col :span="4">
      <b>{{ name }}</b>
    </el-col>
    <el-col :span="10">
      <slot/>
    </el-col>
  </el-row>
</template>

<style>
  .prop-row {
    margin-bottom: 1em;
  }
</style>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
