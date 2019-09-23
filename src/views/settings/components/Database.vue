<template>
  <div>
    <el-form ref="database" :model="database" :label-width="labelWidth">
      <el-form-item label="Database settings:"/>
      <el-form-item label="RUM enabled">
        <el-switch :value="database.rum_enabled" @change="updateSetting($event, 'database', 'rum_enabled')"/>
        <p class="expl">RUM indexes are an alternative indexing scheme that is not included in PostgreSQL by default.
        While they may eventually be mainlined, for now they have to be installed as a PostgreSQL extension from
          <a
            href="https://github.com/postgrespro/rum"
            rel="nofollow noreferrer noopener"
            target="_blank">
            https://github.com/postgrespro/rum.
          </a>
        </p>
        <p class="expl">Their advantage over the standard GIN indexes is that they allow efficient ordering of search results by timestamp,
        which makes search queries a lot faster on larger servers, by one or two orders of magnitude.
        They take up around 3 times as much space as GIN indexes.</p>
        <p class="expl">To enable them, both the <span class="code">rum_enabled</span> flag has to be set and the following special
        migration has to be run: <span class="code">mix ecto.migrate --migrations-path priv/repo/optional_migrations/rum_indexing/</span></p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="ectoRepos" :model="ectoRepos" :label-width="labelWidth">
      <el-form-item label="Ecto repos">
        <el-select :value="ectoRepos.value || []" multiple filterable allow-create @change="updateSetting($event, 'ecto_repos', 'value')">
          <el-option label="Pleroma.Repo" value="Pleroma.Repo"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="pleromaRepo" :model="pleromaRepo" :label-width="labelWidth">
      <el-form-item label="Pleroma Repo configuration:"/>
      <el-form-item label="Name">
        <el-input :value="pleromaRepo.name" @input="updateSetting($event, 'Pleroma.Repo', 'name')"/>
        <p class="expl">The name of the Repo supervisor process</p>
      </el-form-item>
      <el-form-item label="Priv">
        <el-input :value="pleromaRepo.priv" @input="updateSetting($event, 'Pleroma.Repo', 'priv')"/>
        <p class="expl">The directory where to keep repository data, like migrations, schema and more. Defaults to <span class="code">
          priv/YOUR_REPO</span>. It must always point to a subdirectory inside the priv directory</p>
      </el-form-item>
      <el-form-item label="URL">
        <el-input :value="pleromaRepo.url" @input="updateSetting($event, 'Pleroma.Repo', 'url')"/>
        <p class="expl">An URL that specifies storage information</p>
      </el-form-item>
      <el-form-item label="Log level">
        <el-select :value="pleromaRepo.log" clearable @change="updateSetting($event, 'Pleroma.Repo', 'log')">
          <el-option :value="false" label="False - disables logging for that repository."/>
          <el-option value=":debug" label=":debug - for debug-related messages"/>
          <el-option value=":info" label=":info - for information of any kind"/>
          <el-option value=":warn" label=":warn - for warnings"/>
          <el-option value=":error" label=":error - for errors"/>
        </el-select>
        <p class="expl">The log level used when logging the query with Elixir's Logger</p>
      </el-form-item>
      <el-form-item label="Pool size">
        <el-input-number :value="pleromaRepo.pool_size" :step="1" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Repo', 'pool_size')"/>
        <p class="expl">The size of the pool used by the connection module. Defaults to <span class="code">10</span></p>
      </el-form-item>
      <el-form-item label="Telemetry prefix">
        <el-select :value="pleromaRepo.telemetry_prefix || []" multiple filterable allow-create @change="updateSetting($event, 'Pleroma.Repo', 'telemetry_prefix')">
          <el-option label=":my_app" value=":my_app"/>
          <el-option label=":repo" value=":repo"/>
          <el-option label=":query" value=":query"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Types">
        <el-input :value="pleromaRepo.types" @input="updateSetting($event, 'Pleroma.Repo', 'types')"/>
      </el-form-item>
      <el-form-item label="Telemetry event">
        <el-select :value="pleromaRepo.telemetry_event || []" multiple filterable allow-create @change="updateSetting($event, 'Pleroma.Repo', 'telemetry_event')">
          <el-option label="Pleroma.Repo.Instrumenter" value="Pleroma.Repo.Instrumenter"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Connection options:"/>
      <el-form-item label="Hostname">
        <el-input :value="pleromaRepo.hostname" @input="updateSetting($event, 'Pleroma.Repo', 'hostname')"/>
        <p class="expl">Server hostname</p>
      </el-form-item>
      <el-form-item label="Socket dir">
        <el-input :value="pleromaRepo.socket_dir" @input="updateSetting($event, 'Pleroma.Repo', 'socket_dir')"/>
        <p class="expl">Connect to Postgres via UNIX sockets in the given directory. The socket name is derived based on the port.
        This is the preferred method for configuring sockets and it takes precedence over the hostname.
        If you are connecting to a socket outside of the Postgres convention, use <span class="code">:socket</span> instead.</p>
      </el-form-item>
      <el-form-item label="Socket">
        <el-input :value="pleromaRepo.socket" @input="updateSetting($event, 'Pleroma.Repo', 'socket')"/>
        <p class="expl">Connect to Postgres via UNIX sockets in the given path. This option takes precedence over the
        <span class="code">:hostname</span> and <span class="code">:socket_dir</span></p>
      </el-form-item>
      <el-form-item label="Username">
        <el-input :value="pleromaRepo.username" @input="updateSetting($event, 'Pleroma.Repo', 'username')"/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input :value="pleromaRepo.password" @input="updateSetting($event, 'Pleroma.Repo', 'password')"/>
      </el-form-item>
      <el-form-item label="Port">
        <el-input :value="pleromaRepo.port" @input="updateSetting($event, 'Pleroma.Repo', 'port')"/>
        <p class="expl">Server port (default: 5432)</p>
      </el-form-item>
      <el-form-item label="Database">
        <el-input :value="pleromaRepo.database" @input="updateSetting($event, 'Pleroma.Repo', 'database')"/>
        <p class="expl">The database to connect to</p>
      </el-form-item>
      <el-form-item label="Maintenance database">
        <el-input :value="pleromaRepo.maintenance_database" @input="updateSetting($event, 'Pleroma.Repo', 'maintenance_database')"/>
        <p class="expl">Specifies the name of the database to connect to when creating or dropping the database. Defaults to "postgres"</p>
      </el-form-item>
      <el-form-item label="Pool">
        <el-input :value="pleromaRepo.pool" @input="updateSetting($event, 'Pleroma.Repo', 'pool')"/>
        <p class="expl">The connection pool module, defaults to <span class="code">DBConnection.ConnectionPool</span></p>
      </el-form-item>
      <el-form-item label="SSL">
        <el-switch :value="pleromaRepo.ssl" @change="updateSetting($event, 'Pleroma.Repo', 'ssl')"/>
        <p class="expl">Set to true if ssl should be used</p>
      </el-form-item>
      <el-form-item label="Connect timeout">
        <el-input-number :value="pleromaRepo.connect_timeout" :step="1000" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Repo', 'connect_timeout')"/>
        <p class="expl">The timeout for establishing new connections. Defaults to 5000</p>
      </el-form-item>
      <el-form-item label="Prepare">
        <el-select :value="pleromaRepo.prepare" clearable @change="updateSetting($event, 'Pleroma.Repo', 'prepare')">
          <el-option label="named" value=":named"/>
          <el-option label="unnamed" value=":unnamed"/>
        </el-select>
        <p class="expl">How to prepare queries, either <span class="code">:named</span> to use named queries or
        <span class="code">:unnamed</span> to force unnamed queries (default: :named)</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'

export default {
  name: 'Instance',
  computed: {
    ...mapGetters([
      'database',
      'ectoRepos',
      'pleromaRepo'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
