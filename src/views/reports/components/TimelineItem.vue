<template>
  <el-timeline-item :timestamp="item.timestamp" placement="top">
    <el-card>
      <h4>{{ item.header }}</h4>
      <p>{{ item.content }}</p>
    </el-card>
  </el-timeline-item>
</template>

<script>
export default {
  name: 'TimelineItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
