<template>
  <el-card class="note-card">
    <div slot="header">
      <div class="note-header">
        <router-link
          v-if="propertyExists(note.user, 'id')"
          :to="{ name: 'UsersShow', params: { id: note.user.id }}"
          class="router-link">
          <div class="note-actor">
            <img
              v-if="propertyExists(note.user, 'avatar')"
              :src="note.user.avatar"
              alt="avatar"
              class="note-avatar-img">
            <span v-if="propertyExists(note.user, 'nickname')" class="note-actor-name">{{ note.user.nickname }}</span>
            <span v-else class="note-actor-name deactivated">({{ $t('users.invalidNickname') }})</span>
          </div>
        </router-link>
        <el-button size="mini" @click.native="handleNoteDeletion(note.id, report.id)">
          {{ $t('reports.deleteNote') }}
        </el-button>
      </div>
    </div>
    <div class="note-body">
      <span class="note-content" v-html="note.content"/>
      {{ parseTimestamp(note.created_at) }}
    </div>
  </el-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'NoteCard',
  props: {
    report: {
      type: Object,
      required: true
    },
    note: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleNoteDeletion(noteID, reportID) {
      this.$confirm('Are you sure you want to delete this note?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeleteReportNote', { noteID, reportID })
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    },
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  a {
    text-decoration: underline;
  }
  .deactivated {
    color: gray;
  }
  .el-icon-arrow-right {
    margin-right: 6px;
  }
  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    height: 40px;
  }
  .note-actor {
    display: flex;
    align-items: center;
  }
  .note-actor-name {
    margin: 0;
    height: 28px;
  }
  .note-avatar-img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .note-body {
    display: flex;
    flex-direction: column;
  }
  .note-card {
    margin-bottom: 15px;
  }
  .note-content {
    font-size: 15px;
  }
  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 28px;
    font-size: 15px;
    font-weight: 500;
  }
  .router-link {
    text-decoration: none;
  }

  @media only screen and (max-width:480px) {
    .el-card__header {
      padding: 10px 17px;
    }
    .note-header {
      display: flex;
      flex-direction: column;
      height: 65px;
    }
    .note-actor {
      margin-bottom: 5px;
    }
    .note-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
