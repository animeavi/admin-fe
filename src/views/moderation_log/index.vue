<template>
  <div v-if="!loading" class="moderation-log-container">
    <h1>{{ $t('moderationLog.moderationLog') }}</h1>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="9">
        <el-select
          v-model="user"
          class="user-select"
          clearable
          placeholder="Filter by admin/moderator"
          @change="fetchLogWithFilters">
          <el-option-group
            v-for="group in users"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.nickname"
              :value="item.id" />
          </el-option-group>
        </el-select>
      </el-col>
      <el-col :span="6" class="search-container">
        <el-input
          v-model="search"
          placeholder="Search logs"
          clearable
          @input="handleDebounceSearchInput" />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="9" class="date-container">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="dateRange"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End date"
          unlink-panels
          @change="fetchLogWithFilters" />
      </el-col>
    </el-row>
    <el-timeline>
      <el-timeline-item
        v-for="(logEntry, index) in log"
        :key="index"
        :timestamp="normalizeTimestamp(logEntry.time)">
        {{ logEntry.message }}
      </el-timeline-item>
    </el-timeline>
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :hide-on-single-page="true"
        :page-size="50"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchLogWithFilters" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import debounce from 'lodash.debounce'

export default {
  data() {
    return {
      dateRange: '',
      search: '',
      user: '',
      currentPage: 1
    }
  },
  computed: {
    loading() {
      return this.$store.state.moderationLog.logLoading &&
             this.$store.state.moderationLog.adminsLoading
    },
    log() {
      return this.$store.state.moderationLog.fetchedLog
    },
    total() {
      return this.$store.state.moderationLog.logItemsCount
    },
    users() {
      return [
        {
          label: 'Admins',
          options: this.$store.state.moderationLog.admins.users
        },
        {
          label: 'Moderators',
          options: this.$store.state.moderationLog.moderators.users
        }
      ]
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.fetchLogWithFilters()
    }, 500)
  },
  mounted() {
    this.$store.dispatch('FetchModerationLog')
    this.$store.dispatch('FetchAdmins')
  },
  methods: {
    normalizeTimestamp(timestamp) {
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
    },
    fetchLogWithFilters() {
      const filters = _.omitBy({
        start_date: this.dateRange ? this.dateRange[0].toISOString() : null,
        end_date: this.dateRange ? this.dateRange[1].toISOString() : null,
        user_id: this.user,
        search: this.search,
        page: this.currentPage
      }, val => val === '' || val === null)

      this.$store.dispatch('FetchModerationLog', filters)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.moderation-log-container {
  margin: 0 15px;
}
h1 {
  margin: 22px 0 20px 0;
}
.el-timeline {
  margin: 25px 45px 0 0;
  padding: 0px;
}
.user-select {
  margin: 0 0 20px;
  width: 350px;
}
.search-container {
  text-align: right;
}
.pagination {
  text-align: center;
}
</style>
