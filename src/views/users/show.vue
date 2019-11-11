<template>
  <main v-if="!loading">
    <header>
      <el-avatar :src="user.avatar" size="large" />
      <h1>{{ user.display_name }}</h1>
    </header>
    <el-row>
      <el-col :span="6">
        <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition el-table--medium">
          <table class="el-table__body">
            <tbody>
              <tr class="el-table__row">
                <td class="name-col">ID</td>
                <td class="value-col">
                  {{ user.id }}
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.tags') }}</td>
                <td>
                  <el-tag v-for="tag in user.tags" :key="tag">{{ tag }}</el-tag>
                  <span v-if="user.tags.length === 0">None</span>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.moderator') }}</td>
                <td>
                  <el-tag v-if="user.roles.moderator" type="success"><i class="el-icon-check" /></el-tag>
                  <el-tag v-if="!user.roles.moderator" type="danger"><i class="el-icon-error" /></el-tag>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.admin') }}</td>
                <td>
                  <el-tag v-if="user.roles.admin" type="success"><i class="el-icon-check" /></el-tag>
                  <el-tag v-if="!user.roles.admin" type="danger"><i class="el-icon-error" /></el-tag>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.local') }}</td>
                <td>
                  <el-tag v-if="user.local" type="success"><i class="el-icon-check" /></el-tag>
                  <el-tag v-if="!user.local" type="danger"><i class="el-icon-error" /></el-tag>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.deactivated') }}</td>
                <td>
                  <el-tag v-if="user.deactivated" type="success"><i class="el-icon-check" /></el-tag>
                  <el-tag v-if="!user.deactivated" type="danger"><i class="el-icon-error" /></el-tag>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.nickname') }}</td>
                <td>
                  {{ user.nickname }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="18">
          <h2 class="recent-statuses">{{ $t('userProfile.recentStatuses') }}</h2>
        </el-col>
        <el-col :span="6" class="show-private">
          <el-checkbox v-model="showPrivate" @change="onTogglePrivate">
            {{ $t('userProfile.showPrivateStatuses') }}
          </el-checkbox>
        </el-col>
      </el-row>
      <el-col :span="18">
        <el-timeline class="statuses">
          <el-timeline-item v-for="status in statuses" :timestamp="createdAtLocaleString(status.created_at)" :key="status.id">
            <el-card>
              <strong v-if="status.spoiler_text">{{ status.spoiler_text }}</strong>
              <p v-if="status.content" v-html="status.content" />
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
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </main>
</template>

<script>
export default {
  name: 'UsersShow',
  data() {
    return {
      showPrivate: false
    }
  },
  computed: {
    loading() {
      return this.$store.state.userProfile.loading
    },
    user() {
      return this.$store.state.userProfile.user
    },
    statuses() {
      return this.$store.state.userProfile.statuses
    }
  },
  mounted: function() {
    this.$store.dispatch('FetchData', { id: this.$route.params.id, godmode: false })
  },
  methods: {
    optionPercent(poll, pollOption) {
      const allVotes = poll.options.reduce((acc, option) => (acc + option.votes_count), 0)
      if (allVotes === 0) {
        return 0
      }

      return +(pollOption.votes_count / allVotes * 100).toFixed(1)
    },
    createdAtLocaleString(createdAt) {
      const date = new Date(createdAt)

      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    },
    onTogglePrivate() {
      console.log(this.showPrivate)

      this.$store.dispatch('FetchData', { id: this.$route.params.id, godmode: this.showPrivate })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
header {
  align-items: center;
  display: flex;
  margin: 22px 0;
  padding-left: 15px;
  h1 {
    margin: 0 0 0 10px;
  }
}
table {
  margin: 10px 0 0 15px;
  .name-col {
    width: 150px;
  }
}
.el-table--border::after, .el-table--group::after, .el-table::before {
  background-color: transparent;
}
.poll ul {
  list-style-type: none;
  padding: 0;
  width: 30%;
}
.image {
  width: 20%;
  img {
    width: 100%;
  }
}
.statuses {
  padding-right: 20px;
}
.show-private {
  text-align: right;
  line-height: 67px;
  padding-right: 20px;
}
.recent-statuses {
  margin-left: 40px;
}
</style>
