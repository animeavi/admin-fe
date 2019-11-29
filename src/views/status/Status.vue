<template>
  <div>
    <el-card v-if="!status.deleted" class="status-card">
      <div slot="header">
        <div class="status-header">
          <div class="status-account-container">
            <div class="status-account">
              <img :src="status.account.avatar" class="status-avatar-img">
              <h3 class="status-account-name">{{ status.account.display_name }}</h3>
            </div>
            <a :href="status.account.url" target="_blank" class="account">
              @{{ status.account.acct }}
            </a>
          </div>
          <div class="status-actions">
            <el-tag v-if="status.sensitive" type="warning" size="large">{{ $t('reports.sensitive') }}</el-tag>
            <el-tag size="large">{{ capitalizeFirstLetter(status.visibility) }}</el-tag>
            <el-dropdown trigger="click">
              <el-button plain size="small" icon="el-icon-edit" class="status-actions-button">
                {{ $t('reports.changeScope') }}<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="!status.sensitive"
                  @click.native="changeStatus(status.id, true, status.visibility)">
                  {{ $t('reports.addSensitive') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.sensitive"
                  @click.native="changeStatus(status.id, false, status.visibility)">
                  {{ $t('reports.removeSensitive') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.visibility !== 'public'"
                  @click.native="changeStatus(status.id, status.sensitive, 'public')">
                  {{ $t('reports.public') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.visibility !== 'private'"
                  @click.native="changeStatus(status.id, status.sensitive, 'private')">
                  {{ $t('reports.private') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.visibility !== 'unlisted'"
                  @click.native="changeStatus(status.id, status.sensitive, 'unlisted')">
                  {{ $t('reports.unlisted') }}
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="deleteStatus(status.id)">
                  {{ $t('reports.deleteStatus') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="status-body">
        <div v-if="status.spoiler_text">
          <strong>{{ status.spoiler_text }}</strong>
          <el-button v-if="!showHiddenStatus" size="mini" class="show-more-button" @click="showHiddenStatus = true">Show more</el-button>
          <el-button v-if="showHiddenStatus" size="mini" class="show-more-button" @click="showHiddenStatus = false">Show less</el-button>
          <div v-if="showHiddenStatus">
            <span class="status-content" v-html="status.content"/>
            <div v-if="status.poll" class="poll">
              <ul>
                <li v-for="(option, index) in status.poll.options" :key="index">
                  {{ option.title }}
                  <el-progress :percentage="optionPercent(status.poll, option)" />
                </li>
              </ul>
            </div>
            <div v-for="(attachment, index) in status.media_attachments" :key="index" class="image">
              <img :src="attachment.preview_url">
            </div>
          </div>
        </div>
        <div v-if="!status.spoiler_text">
          <span class="status-content" v-html="status.content"/>
          <div v-if="status.poll" class="poll">
            <ul>
              <li v-for="(option, index) in status.poll.options" :key="index">
                {{ option.title }}
                <el-progress :percentage="optionPercent(status.poll, option)" />
              </li>
            </ul>
          </div>
          <div v-for="(attachment, index) in status.media_attachments" :key="index" class="image">
            <img :src="attachment.preview_url">
          </div>
        </div>
        <a :href="status.url" target="_blank" class="account">
          {{ parseTimestamp(status.created_at) }}
        </a>
      </div>
    </el-card>
    <el-card v-else class="status-card">
      <div slot="header">
        <div class="status-header">
          <div class="status-account-container">
            <div class="status-account">
              <h4 class="status-deleted">{{ $t('reports.statusDeleted') }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="status-body">
        <span v-if="status.content" class="status-content" v-html="status.content"/>
        <span v-else class="status-without-content">no content</span>
      </div>
      <a v-if="status.created_at" :href="status.url" target="_blank" class="account">
        {{ parseTimestamp(status.created_at) }}
      </a>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Status',
  props: {
    status: {
      type: Object,
      required: true
    },
    page: {
      type: Number,
      required: false,
      default: 0
    },
    userId: {
      type: String,
      required: false,
      default: ''
    },
    godmode: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      showHiddenStatus: false
    }
  },
  methods: {
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    changeStatus(statusId, isSensitive, visibility) {
      this.$store.dispatch('ChangeStatusScope', { statusId, isSensitive, visibility, reportCurrentPage: this.page, userId: this.userId, godmode: this.godmode })
    },
    deleteStatus(statusId) {
      this.$confirm('Are you sure you want to delete this status?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeleteStatus', { statusId, reportCurrentPage: this.page, userId: this.userId, godmode: this.godmode })
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
    optionPercent(poll, pollOption) {
      const allVotes = poll.options.reduce((acc, option) => (acc + option.votes_count), 0)
      if (allVotes === 0) {
        return 0
      }
      return +(pollOption.votes_count / allVotes * 100).toFixed(1)
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.status-card {
  .account {
    text-decoration: underline;
    line-height: 26px;
    font-size: 13px;
  }
  .image {
    width: 20%;
    img {
      width: 100%;
    }
  }
  .show-more-button {
    margin-left: 5px;
  }
  .status-account {
    display: flex;
    align-items: center;
  }
  .status-avatar-img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .status-account-name {
    margin: 0;
    height: 22px;
  }
  .status-body {
    display: flex;
    flex-direction: column;
  }
  .status-content {
    font-size: 15px;
    line-height: 26px;
  }
  .status-card {
    margin-bottom: 15px;
  }
  .status-deleted {
    font-style: italic;
    margin-top: 3px;
  }
  .status-header {
    display: flex;
    justify-content: space-between;
  }
  .status-without-content {
    font-style: italic;
  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .el-message {
    min-width: 80%;
  }
  .el-message-box {
    width: 80%;
  }
  .status-card {
    .el-card__header {
      padding: 10px 17px;
    }
    .el-tag {
      margin: 3px 4px 3px 0;
    }
    .status-account-container {
      margin-bottom: 5px;
    }
    .status-actions-button {
      margin: 3px 0 3px;
    }
    .status-actions {
      display: flex;
      flex-wrap: wrap;
    }
    .status-header {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
