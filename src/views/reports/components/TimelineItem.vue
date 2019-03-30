<template>
  <el-timeline-item :timestamp="item.timestamp" placement="top" class="timeline-item-container">
    <el-card>
      <h4>{{ item.header }}</h4>
      <p>{{ item.content }}</p>
      <el-collapse v-model="showNotes">
        <el-collapse-item title="Show notes" name="showNotes">
          <div v-for="note in item.notes" :key="note.id">
            <el-card class="note">
              <h4>From {{ note.author }}</h4>
              <p class="timestamp">{{ note.timestamp }}</p>
              <p class="note-text">{{ note.text }}</p>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
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
  },
  data() {
    return {
      showNotes: []
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .el-card__body {
    padding: 17px 17px 0;
  }
  .el-collapse-item__header {
    border-bottom: none;
    height: 46px;
  }
  .el-collapse-item__content {
    padding-bottom: 7px;
  }
  h4 {
    margin: 0;
    height: 17px;
  }
  .note {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
    margin-bottom: 10px;
  }
  .note-text {
    margin-bottom: 14px;
  }
  .timestamp {
    margin: 0;
    font-style: italic;
    color: gray;
  }
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {}
</style>
