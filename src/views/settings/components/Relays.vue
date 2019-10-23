<template>
  <div v-if="!loading">
    <el-row :gutter="5">
      <el-col :span="8">
        <el-input v-model="newRelay" placeholder="Follow new relay" @keyup.enter.native="followRelay"/>
      </el-col>
      <el-col :span="8">
        <el-button @click.native="followRelay">Follow</el-button>
      </el-col>
    </el-row>
    <el-table :data="relaysTable">
      <el-table-column
        prop="instance"
        label="Instance URL"/>
      <el-table-column fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native="deleteRelay(scope.row.instance)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Relays',
  data() {
    return {
      newRelay: ''
    }
  },
  computed: {
    relays() {
      return this.$store.state.relays.fetchedRelays
    },
    relaysTable() {
      return this.relays.map(relay => {
        return { instance: relay }
      })
    },
    loading() {
      return this.$store.state.relays.loading
    }
  },
  mounted() {
    this.$store.dispatch('FetchRelays')
  },
  methods: {
    followRelay() {
      try {
        this.$store.dispatch('AddRelay', this.newRelay)
      } catch (_e) {
        return
      } finally {
        this.$store.dispatch('FetchRelays')
      }
    },
    deleteRelay(relay) {
      try {
        this.$store.dispatch('DeleteRelay', relay)
      } catch (_e) {
        return
      } finally {
        this.$store.dispatch('FetchRelays')
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
