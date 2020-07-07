<template>
  <div class="media-proxy-cache-container">
    <div class="media-proxy-cache-header-container">
      <h1>{{ $t('mediaProxyCache.mediaProxyCache') }}</h1>
      <reboot-button/>
    </div>
    <p class="media-proxy-cache-header">Evict object from the MediaProxy cache</p>
    <div class="url-input-container">
      <el-input
        :placeholder="$t('mediaProxyCache.url')"
        v-model="url"
        clearable
        class="url-input"/>
      <el-checkbox v-model="ban">{{ $t('mediaProxyCache.ban') }}</el-checkbox>
      <el-button class="evict-button" @click="evictURL">{{ $t('mediaProxyCache.evict') }}</el-button>
    </div>
    <p class="media-proxy-cache-header">List of all banned MediaProxy URLs</p>
    <el-table
      v-loading="loading"
      :data="bannedUrls"
      class="banned-urls-table"
      @selection-change="handleSelectionChange">>
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        :label="$t('mediaProxyCache.url')"
        :min-width="isDesktop ? 320 : 120"
        prop="url"/>
      <el-table-column
        :label="$t('mediaProxyCache.actions')">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="removeUrl(scope.row.url)">{{ $t('mediaProxyCache.remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import RebootButton from '@/components/RebootButton'

export default {
  name: 'MediaProxyCache',
  components: { RebootButton },
  data() {
    return {
      url: '',
      ban: false,
      selectedUrls: []
    }
  },
  computed: {
    bannedUrls() {
      return this.$store.state.mediaProxyCache.bannedUrls
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    loading() {
      return this.$store.state.mediaProxyCache.loading
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('ListBannedUrls', 1)
  },
  methods: {
    evictURL() {
      const urls = typeof this.url === 'string' ? [this.url] : this.url
      this.$store.dispatch('PurgeUrls', { urls, ban: this.ban })
    },
    handleSelectionChange(value) {
      this.$data.selectedUrls = value
    },
    removeUrl(url) {
      const urls = typeof this.url === 'string' ? [this.url] : this.url
      this.$store.dispatch('RemoveBannedUrls', urls)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
h1 {
  margin: 0;
}
.banned-urls-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
.evict-button {
  margin-left: 15px;
}
.media-proxy-cache-header {
  margin-left: 15px;
  margin-top: 22px;
  font-weight: 500;
}
.media-proxy-cache-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 15px;
}
.url-input {
  margin-right: 15px;
}
.url-input-container {
  display: flex;
  align-items: baseline;
  margin: 15px 15px;
}

@media only screen and (max-width:480px) {
  .url-input {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
