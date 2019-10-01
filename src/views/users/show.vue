<template>
  <main v-if="!loading">
    <header>
      <el-avatar :src="user.avatar" size="large" />
      <h1>{{ user.display_name }}</h1>
    </header>
    <el-row>
      <el-col :span="8">
        <el-card class="user-profile-card">
          <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition el-table--medium">
            <table class="user-profile-table">
              <tbody>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.nickname') }}</td>
                  <td>
                    {{ user.nickname }}
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td class="name-col">ID</td>
                  <td class="value-col">
                    {{ user.id }}
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.tags') }}</td>
                  <td>
                    <el-tag v-for="tag in user.tags" :key="tag" class="user-profile-tag">{{ tag }}</el-tag>
                    <span v-if="user.tags.length === 0">—</span>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.roles') }}</td>
                  <td>
                    <el-tag v-if="user.roles.moderator" class="user-profile-tag"/>
                    <el-tag v-if="user.roles.admin" class="user-profile-tag"/>
                    <span v-if="!user.roles.moderator && !user.roles.admin">—</span>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.localUppercase') }}</td>
                  <td>
                    <el-tag v-if="user.local" type="info">{{ $t('userProfile.local') }}</el-tag>
                    <el-tag v-if="!user.local" type="info">{{ $t('userProfile.external') }}</el-tag>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td>{{ $t('userProfile.activeUppercase') }}</td>
                  <td>
                    <el-tag v-if="user.deactivated" type="success">{{ $t('userProfile.active') }}</el-tag>
                    <el-tag v-if="!user.deactivated" type="danger">{{ $t('userProfile.deactivated') }}</el-tag>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="18"><h2 class="recent-statuses-header">{{ $t('userProfile.recentStatuses') }}</h2></el-col>
          <el-col :span="6" class="show-private">
            <el-checkbox v-model="showPrivate" @change="onTogglePrivate">
              {{ $t('userProfile.showPrivateStatuses') }}
            </el-checkbox>
          </el-col>
        </el-row>
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
.recent-statuses-header {
  margin-top: 10px;
}
.statuses {
  padding: 0 20px 0 0;
}
.show-private {
  text-align: right;
  line-height: 67px;
  padding-right: 20px;
}
.user-profile-card {
  margin-left: 15px;
  margin-right: 20px;
}
.user-profile-table {
  margin: 0;
}
.user-profile-tag {
  margin: 0 4px 4px 0;
}
</style>
