<template>
  <div class="media-proxy-cache-container">
    <div class="media-proxy-cache-header-container">
      <h1>{{ $t('mediaProxyCache.mediaProxyCache') }}</h1>
      <reboot-button/>
    </div>
    <div class="url-input-container">
      <el-input
        :placeholder="$t('mediaProxyCache.url')"
        v-model="url"
        clearable
        class="url-input"/>
      <el-checkbox v-model="ban">{{ $t('mediaProxyCache.ban') }}</el-checkbox>
      <el-button class="evict-button" @click="evictURL">{{ $t('mediaProxyCache.evict') }}</el-button>
    </div>
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
      ban: false
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
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
h1 {
  margin: 0;
}
.evict-button {
  margin-left: 5px;
}
.media-proxy-cache-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 15px;
}
.url-input {
  width: 350px;
  margin-right: 15px;
}
.url-input-container {
  margin: 15px 15px;
}

@media only screen and (max-width:480px) {
  .url-input {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
