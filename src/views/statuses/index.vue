<template>
  <div v-if="!loading" class="statuses-container">
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
      page: 1
    }
  },
  computed: {
    loading() {
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
      this.$store.dispatch('FetchStatusesByInstance', instance)
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
h1 {
  margin: 22px 0 0 0;
}
</style>
