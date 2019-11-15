<template>
  <div v-if="!loadingPeers" class="statuses-container">
    <h1>
      {{ $t('statuses.statuses') }}
    </h1>
    <div class="filter-container">
      <el-select v-model="selectedInstance" :placeholder="$t('statuses.instanceFilter')" @change="handleFilterChange">
        <el-option
          v-for="(instance,index) in instances"
          :key="index"
          :label="instance"
          :value="instance"/>
      </el-select>
    </div>
    <status v-for="status in statuses" :key="status.id" :status="status" />
    <div v-if="statuses.length > 0" class="statuses-pagination">
      <el-button @click="handleLoadMore">{{ $t('statuses.loadMore') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Status from '../status/Status'

export default {
  name: 'Statuses',
  components: {
    Status
  },
  data() {
    return {
      selectedInstance: '',
      page: 1,
      pageSize: 2
    }
  },
  computed: {
    loadingPeers() {
      return this.$store.state.peers.loading
    },
    ...mapGetters([
      'instances',
      'statuses'
    ])
  },
  created() {
  },
  mounted() {
    this.$store.dispatch('FetchPeers')
  },
  methods: {
    handleFilterChange(instance) {
      this.page = 1

      this.$store.dispatch('FetchStatusesByInstance', { instance, page: this.page, pageSize: this.pageSize })
    },
    handleLoadMore() {
      this.page = this.page + 1

      this.$store.dispatch('FetchStatusesPageByInstance', {
        instance: this.selectedInstance,
        page: this.page,
        pageSize: this.pageSize
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.statuses-container {
  padding: 0 15px;
}
.filter-container {
  margin: 22px 15px 15px 0;
}
.statuses-pagination {
  padding: 15px 0;
  text-align: center;
}
h1 {
  margin: 22px 0 0 0;
}
</style>
