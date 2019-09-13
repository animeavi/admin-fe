<template>
  <div />
</template>

<script>
import { Loading } from 'element-ui'
import { authenticateWithPleromaFE } from '@/services/pleromaAuth'
import i18n from '@/lang'

export default {
  name: 'LoginPleroma',
  async mounted() {
    const loadingInstance = Loading.service({ fullscreen: true })

    try {
      await authenticateWithPleromaFE(this.$store)
    } catch (error) {
      this.$message.error(i18n.t('login.pleromaFELoginFailed'))
    }

    loadingInstance.close()
    this.$router.push({ path: '/users/index' })
    this.$message.success(i18n.t('login.pleromaFELoginSucceed'))
  }
}
</script>
