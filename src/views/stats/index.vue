<template>
  <div class="stats-container">
    <h1>{{ $t('stats.stats') }}</h1>
    <el-row>
      <el-col :span="5">
        <el-card v-if="!loadingStatusCounts" class="box-card">
          <div slot="header">
            <h4>{{ $t('stats.statusCounts') }}</h4>
          </div>
          <table>
            <tr>
              <td>{{ $t('stats.all') }}</td>
              <td class="number">{{ formatNumber(statusCounts.all) }}</td>
            </tr>
            <tr>
              <td>{{ $t('stats.public') }}</td>
              <td class="number">{{ formatNumber(statusCounts.public) }}</td>
            </tr>
            <tr>
              <td>{{ $t('stats.unlisted') }}</td>
              <td class="number">{{ formatNumber(statusCounts.unlisted) }}</td>
            </tr>
            <tr>
              <td>{{ $t('stats.direct') }}</td>
              <td class="number">{{ formatNumber(statusCounts.direct) }}</td>
            </tr>
            <tr>
              <td>{{ $t('stats.private') }}</td>
              <td class="number">{{ formatNumber(statusCounts.private) }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import numeral from 'numeral'
import { mapGetters } from 'vuex'

export default {
  name: 'Stats',
  computed: {
    loadingStatusCounts() {
      return this.$store.state.instance.statusCountsLoading
    },
    ...mapGetters([
      'statusCounts'
    ])
  },
  mounted() {
    this.$store.dispatch('FetchStatusCounts')
  },
  methods: {
    formatNumber(num) {
      return numeral(num).format('0,0')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.stats-container {
  padding: 0 15px;
}
table {
  width: 100%;
  td.number {
    text-align: right;
  }
}
h4 {
  margin: 0;
}
</style>
