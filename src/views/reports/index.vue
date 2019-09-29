<template>
  <div class="reports-container">
    <h1>{{ $t('reports.reports') }}</h1>
    <div class="filter-container">
      <reports-filter/>
      <el-checkbox v-model="groupReports" class="group-reports-checkbox">
        Group reports by statuses
      </el-checkbox>
    </div>
    <div class="block">
      <grouped-report v-loading="loading" v-if="groupReports" :groups="groups"/>
      <report v-loading="loading" v-else :reports="reports"/>
      <div v-if="reports.length === 0" class="no-reports-message">
        <p>There are no reports to display</p>
      </div>
    </div>
  </div>
</template>

<script>
import GroupedReport from './components/GroupedReport'
import Report from './components/Report'
import ReportsFilter from './components/ReportsFilter'

export default {
  components: { GroupedReport, Report, ReportsFilter },
  computed: {
    groups() {
      return [{
        date: '19-07-2019',
        account: {
          'acct': 'user',
          'avatar': 'https://pleroma.example.org/images/avi.png',
          'avatar_static': 'https://pleroma.example.org/images/avi.png',
          'bot': false,
          'created_at': '2019-04-23T17:32:04.000Z',
          'display_name': 'User',
          'emojis': [],
          'fields': [],
          'followers_count': 1,
          'following_count': 1,
          'header': 'https://pleroma.example.org/images/banner.png',
          'header_static': 'https://pleroma.example.org/images/banner.png',
          'id': '9i6dAJqSGSKMzLG2Lo',
          'locked': false,
          'note': '',
          'pleroma': {
            'confirmation_pending': false,
            'hide_favorites': true,
            'hide_followers': false,
            'hide_follows': false,
            'is_admin': false,
            'is_moderator': false,
            'relationship': {},
            'tags': []
          },
          'source': {
            'note': '',
            'pleroma': {},
            'sensitive': false
          },
          'tags': ['force_unlisted'],
          'statuses_count': 3,
          'url': 'https://pleroma.example.org/users/user',
          'username': 'user'
        },
        actors: [
          { 'acct': 'lain', 'url': 'https://pleroma.example.org/users/lain' },
          { 'acct': 'linafilippova1', 'url': 'https://pleroma.example.org/users/linafilippova1' }
        ],
        reports: [
          {
            'actor': {
              'acct': 'lain',
              'avatar': 'https://pleroma.example.org/images/avi.png',
              'display_name': 'Roger Braun',
              'url': 'https://pleroma.example.org/users/lain'
            },
            'content': 'Please delete it',
            'created_at': '2019-04-29T19:48:15.000Z',
            'id': '9iJGOv1j8hxuw19bcm',
            'state': 'open'
          },
          { 'actor': {
            'acct': 'linafilippova1',
            'avatar': 'https://pleroma.example.org/images/avi.png',
            'display_name': 'Lina Filippova',
            'url': 'https://pleroma.example.org/users/linafilippova1'
          },
          'content': 'This is an assault',
          'created_at': '2019-03-01T19:48:15.000Z',
          'id': '9iJGOv1alksjdf3r',
          'state': 'resolve'
          }
        ],
        status: [{
          'account': {
            'acct': 'user',
            'avatar': 'https://pleroma.example.org/images/avi.png',
            'avatar_static': 'https://pleroma.example.org/images/avi.png',
            'bot': false,
            'created_at': '2019-04-23T17:32:04.000Z',
            'display_name': 'User',
            'emojis': [],
            'fields': [],
            'followers_count': 1,
            'following_count': 1,
            'header': 'https://pleroma.example.org/images/banner.png',
            'header_static': 'https://pleroma.example.org/images/banner.png',
            'id': '9i6dAJqSGSKMzLG2Lo',
            'locked': false,
            'note': '',
            'pleroma': {
              'confirmation_pending': false,
              'hide_favorites': true,
              'hide_followers': false,
              'hide_follows': false,
              'is_admin': false,
              'is_moderator': false,
              'relationship': {},
              'tags': []
            },
            'source': {
              'note': '',
              'pleroma': {},
              'sensitive': false
            },
            'tags': ['force_unlisted'],
            'statuses_count': 3,
            'url': 'https://pleroma.example.org/users/user',
            'username': 'user'
          },
          'application': {
            'name': 'Web',
            'website': null
          },
          'bookmarked': false,
          'card': null,
          'content': '<span class=\"h-card\"><a data-user=\"9hEkA5JsvAdlSrocam\" class=\"u-url mention\" href=\"https://pleroma.example.org/users/lain\">@<span>lain</span></a></span> click on my link <a href=\"https://www.google.com/\">https://www.google.com/</a>',
          'created_at': '2019-04-23T19:15:47.000Z',
          'emojis': [],
          'favourited': false,
          'favourites_count': 0,
          'id': '9i6mQ9uVrrOmOime8m',
          'in_reply_to_account_id': null,
          'in_reply_to_id': null,
          'language': null,
          'media_attachments': [],
          'mentions': [
            {
              'acct': 'lain',
              'id': '9hEkA5JsvAdlSrocam',
              'url': 'https://pleroma.example.org/users/lain',
              'username': 'lain'
            },
            {
              'acct': 'user',
              'id': '9i6dAJqSGSKMzLG2Lo',
              'url': 'https://pleroma.example.org/users/user',
              'username': 'user'
            }
          ],
          'muted': false,
          'pinned': false,
          'pleroma': {
            'content': {
              'text/plain': '@lain click on my link https://www.google.com/'
            },
            'conversation_id': 28,
            'in_reply_to_account_acct': null,
            'local': true,
            'spoiler_text': {
              'text/plain': ''
            }
          },
          'reblog': null,
          'reblogged': false,
          'reblogs_count': 0,
          'replies_count': 0,
          'sensitive': false,
          'spoiler_text': '',
          'tags': [],
          'uri': 'https://pleroma.example.org/objects/8717b90f-8e09-4b58-97b0-e3305472b396',
          'url': 'https://pleroma.example.org/notice/9i6mQ9uVrrOmOime8m',
          'visibility': 'direct'
        }]
      }]
    },
    groupReports: {
      get() {
        return this.$store.state.reports.groupReports
      },
      set() {
        this.toggleReportsGrouping()
      }
    },
    loading() {
      return this.$store.state.reports.loading
    },
    reports() {
      return this.$store.state.reports.fetchedReports
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    toggleReportsGrouping() {
      this.$store.dispatch('ToggleReportsGrouping')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.reports-container {
  .el-timeline {
    margin: 45px 45px 45px 19px;
    padding: 0px;
  }
  .filter-container {
    display: flex;
    flex-direction: column;
    margin: 22px 15px 22px 15px;
    padding-bottom: 0
  }
  .group-reports-checkbox {
    margin-top: 10px;
  }
  h1 {
    margin: 22px 0 0 15px;
  }
  .no-reports-message {
    color: gray;
    margin-left: 19px
  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .reports-container {
    h1 {
      margin: 7px 10px 15px 10px;
    }
    .filter-container {
      margin: 0 10px
    }
  }
  #app > div > div.main-container > section > div > div.block > ul {
    margin: 45px 45px 5px 19px;
  }
}
</style>
