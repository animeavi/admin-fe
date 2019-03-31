<template>
  <el-timeline-item :timestamp="item.timestamp" placement="top" class="timeline-item-container">
    <el-card>
      <div class="header-container">
        <h4>{{ item.header }}</h4>
        <el-button plain size="small" @click="toggleNoteInput">Reply</el-button>
      </div>
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
        <div v-show="showNewNoteInput" class="new-note">
          <div class="header-container">
            <p>New note</p>
            <i class="el-icon-close" @click="toggleNoteInput"/>
          </div>
          <el-input v-model="note" :rows="2" type="textarea" autofocus/>
        </div>
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
      showNotes: [],
      showNewNoteInput: false,
      note: ''
    }
  },
  methods: {
    toggleNoteInput() {
      this.$data.showNewNoteInput = !this.$data.showNewNoteInput
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .el-card__body {
    padding: 17px 17px 0;
  }
  .el-collapse-item__header {
    height: 46px;
  }
  .el-collapse-item__content {
    padding-bottom: 7px;
  }
  .el-icon-arrow-right {
    margin-right: 6px;
  }
  .el-icon-close {
    padding: 10px 5px 10px 10px;
    cursor: pointer;
  }
  h4 {
    margin: 0;
    height: 17px;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .new-note {
    margin-bottom: 17px;
    p {
      font-size: 13px;
      font-weight: 500;
      height: 17px;
      margin: 13px 0 7px;
    }
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
