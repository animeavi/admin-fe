<template>
  <div>
    <el-form ref="pleromaAuthenticator" :model="pleromaAuthenticator" :label-width="labelWidth">
      <el-form-item label="Authentication type">
        <el-select :value="pleromaAuthenticator.value" clearable @change="updateSetting($event, 'Pleroma.Web.Auth.Authenticator', 'value')">
          <el-option label="None" value=""/>
          <el-option label="Pleroma.Web.Auth.PleromaAuthenticator // Default database authenticator" value="Pleroma.Web.Auth.PleromaAuthenticator"/>
          <el-option label="Pleroma.Web.Auth.LDAPAuthenticator // LDAP authenticator" value="Pleroma.Web.Auth.LDAPAuthenticator"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="auth" :model="auth" :label-width="labelWidth">
      <el-form-item label="Authentication settings:"/>
      <el-form-item label="Auth template">
        <el-input :value="auth.auth_template" @input="updateSetting($event, 'auth', 'auth_template')"/>
        <p class="expl">Authentication form template. By default it's
          <span class="code">show.html</span> which corresponds to
          <span class="code">lib/pleroma/web/templates/o_auth/o_auth/show.html.eex.</span>
        </p>
      </el-form-item>
      <el-form-item label="OAuth consumer template">
        <el-input :value="auth.oauth_consumer_template" @input="updateSetting($event, 'auth', 'oauth_consumer_template')"/>
        <p class="expl">OAuth consumer mode authentication form template. By default it's
          <span class="code">consumer.html</span> which corresponds to
          <span class="code">lib/pleroma/web/templates/o_auth/o_auth/consumer.html.eex.</span>
        </p>
      </el-form-item>
      <el-form-item label="OAuth consumer strategies">
        <el-select :value="auth.oauth_consumer_strategies || []" multiple filterable allow-create @change="updateSetting($event, 'auth', 'oauth_consumer_strategies')"/>
        <p class="expl">The list of enabled OAuth consumer strategies; by default it's set by
          <span class="code">OAUTH_CONSUMER_STRATEGIES</span>
          environment variable. You can enter values in the following format: <span class="code">'a:foo b:baz'</span>
        </p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="ldap" :model="ldap" :label-width="labelWidth">
      <el-form-item class="options-paragraph-container">
        <p class="options-paragraph">Use LDAP for user authentication.  When a user logs in to the Pleroma
        instance, the name and password will be verified by trying to authenticate
        (bind) to an LDAP server.  If a user exists in the LDAP directory but there
        is no account with the same name yet on the Pleroma instance then a new
        Pleroma account will be created with the same name as the LDAP user name.</p>
      </el-form-item>
      <el-form-item label="LDAP Authenticator:"/>
      <el-form-item label="Enabled">
        <el-switch :value="ldap.enabled" @change="updateSetting($event, 'ldap', 'enabled')"/>
        <p class="expl">Enables LDAP authentication</p>
      </el-form-item>
      <el-form-item label="Host">
        <el-input :value="ldap.host" @input="updateSetting($event, 'ldap', 'host')"/>
        <p class="expl">LDAP server hostname</p>
      </el-form-item>
      <el-form-item label="Port">
        <el-input :value="ldap.port" @input="updateSetting($event, 'ldap', 'port')"/>
        <p class="expl">LDAP port, e.g. 389 or 636</p>
      </el-form-item>
      <el-form-item label="SSL">
        <el-switch :value="ldap.ssl" @change="updateSetting($event, 'ldap', 'ssl')"/>
        <p class="expl">True to use SSL, usually implies the port 636</p>
      </el-form-item>
      <el-form-item label="TLS">
        <el-switch :value="ldap.tls" @change="updateSetting($event, 'ldap', 'tls')"/>
        <p class="expl">True to start TLS, usually implies the port 389</p>
      </el-form-item>
      <el-form-item label="Base">
        <el-input :value="ldap.base" @input="updateSetting($event, 'ldap', 'base')"/>
        <p class="expl">LDAP base, e.g. <span class="code">'dc=example,dc=com'</span></p>
      </el-form-item>
      <el-form-item label="UID">
        <el-input :value="ldap.uid" @input="updateSetting($event, 'ldap', 'uid')"/>
        <p class="expl">LDAP attribute name to authenticate the user, e.g. when
          <span class="code">'cn'</span>, the filter will be <span class="code">'cn=username,base'</span>
        </p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="ueberauth" :model="ueberauth" :label-width="labelWidth">
      <el-form-item label="OAuth consumer mode" class="options-paragraph-container">
        <p class="options-paragraph">
          OAuth consumer mode allows sign in / sign up via external OAuth providers
          (e.g. Twitter, Facebook, Google, Microsoft, etc.). Implementation is based on Ueberauth; see the list of
          <a
            href="https://github.com/ueberauth/ueberauth/wiki/List-of-Strategies"
            rel="nofollow noreferrer noopener"
            target="_blank">
            available strategies.
          </a>
        </p>
        <p class="options-paragraph">
          Note: each strategy is shipped as a separate dependency; in order to get the strategies, run
          <span class="code">OAUTH_CONSUMER_STRATEGIES="..." mix deps.get</span>,
          e.g. <span class="code">OAUTH_CONSUMER_STRATEGIES="twitter facebook google microsoft" mix deps.get</span>.
          The server should also be started with <span class="code">OAUTH_CONSUMER_STRATEGIES="..." mix phx.server</span>
          in case you enable any strategies.
        </p>
        <p class="options-paragraph">
          Note: each strategy requires separate setup (on external provider side and Pleroma side).
          Below are the guidelines on setting up most popular strategies.
        </p>
        <p class="options-paragraph">
          Note: make sure that <span class="code">'SameSite=Lax'</span> is set in
          <span class="code">extra_cookie_attrs</span> when you have this feature enabled.
          OAuth consumer mode will not work with <span class="code">'SameSite=Strict'</span>
        </p>
        <p class="options-paragraph">For Twitter,
          <a
            href="https://developer.twitter.com/en/apps"
            rel="nofollow noreferrer noopener"
            target="_blank">
            register an app,
          </a>
          configure callback URL to <span class="code">https://&lt;your_host&gt;/oauth/twitter/callback</span>
        </p>
        <p class="options-paragraph">For Facebook,
          <a
            href="https://developers.facebook.com/apps"
            rel="nofollow noreferrer noopener"
            target="_blank">
            register an app,
          </a>
          configure callback URL to <span class="code">https://&lt;your_host&gt;/oauth/facebook/callback</span>,
          enable Facebook Login service at
          <span class="code">https://developers.facebook.com/apps/&lt;app_id&gt;/fb-login/settings/</span>
        </p>
        <p class="options-paragraph">For Google,
          <a
            href="https://console.developers.google.com/"
            rel="nofollow noreferrer noopener"
            target="_blank">
            register an app,
          </a>
          configure callback URL to <span class="code">https://&lt;your_host&gt;/oauth/google/callback</span>
        </p>
        <p class="options-paragraph">For Microsoft,
          <a
            href="https://portal.azure.com"
            rel="nofollow noreferrer noopener"
            target="_blank">
            register an app,
          </a>
          configure callback URL to <span class="code">https://&lt;your_host&gt;/oauth/microsoft/callback</span>
        </p>
        <p class="options-paragraph">
          Once the app is configured on external OAuth provider side, add app's credentials and strategy-specific settings
          per strategy's documentation (e.g.
          <a
            href="https://github.com/ueberauth/ueberauth_twitter"
            rel="nofollow noreferrer noopener"
            target="_blank">
            ueberauth_twitter
          </a>).
        </p>
      </el-form-item>
      <el-form-item label="Ueberauth:"/>
      <el-form-item label="Base path">
        <el-input :value="ueberauth.base_path" @input="updateSetting($event, 'ueberauth', 'base_path')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="facebook" :model="facebook" :label-width="labelWidth">
      <el-form-item label="Facebook:"/>
      <el-form-item label="Client ID">
        <el-input :value="facebook.client_id" @input="updateSetting($event, 'Ueberauth.Strategy.Facebook.OAuth', 'client_id')"/>
      </el-form-item>
      <el-form-item label="Client secret">
        <el-input :value="facebook.client_secret" @input="updateSetting($event, 'Ueberauth.Strategy.Facebook.OAuth', 'client_secret')"/>
      </el-form-item>
      <el-form-item label="Redirect URI">
        <el-input :value="facebook.redirect_uri" @input="updateSetting($event, 'Ueberauth.Strategy.Facebook.OAuth', 'redirect_uri')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="twitter" :model="twitter" :label-width="labelWidth">
      <el-form-item label="Twitter:"/>
      <el-form-item label="Consumer key">
        <el-input :value="twitter.consumer_key" @input="updateSetting($event, 'Ueberauth.Strategy.Twitter.OAuth', 'consumer_key')"/>
      </el-form-item>
      <el-form-item label="Consumer secret">
        <el-input :value="twitter.consumer_secret" @input="updateSetting($event, 'Ueberauth.Strategy.Twitter.OAuth', 'consumer_secret')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="google" :model="google" :label-width="labelWidth">
      <el-form-item label="Google:"/>
      <el-form-item label="Client ID">
        <el-input :value="google.client_id" @input="updateSetting($event, 'Ueberauth.Strategy.Google.OAuth', 'client_id')"/>
      </el-form-item>
      <el-form-item label="Client secret">
        <el-input :value="google.client_secret" @input="updateSetting($event, 'Ueberauth.Strategy.Google.OAuth', 'client_secret')"/>
      </el-form-item>
      <el-form-item label="Redirect URI">
        <el-input :value="google.redirect_uri" @input="updateSetting($event, 'Ueberauth.Strategy.Google.OAuth', 'redirect_uri')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="microsoft" :model="microsoft" :label-width="labelWidth">
      <el-form-item label="Microsoft:"/>
      <el-form-item label="Client ID">
        <el-input :value="microsoft.client_id" @input="updateSetting($event, 'Ueberauth.Strategy.Microsoft.OAuth', 'client_id')"/>
      </el-form-item>
      <el-form-item label="Client secret">
        <el-input :value="microsoft.client_secret" @input="updateSetting($event, 'Ueberauth.Strategy.Microsoft.OAuth', 'client_secret')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="oauth2" :model="oauth2" :label-width="labelWidth">
      <el-form-item label="OAuth 2.0 Provider:"/>
      <el-form-item label="Token expires in (s)">
        <el-input-number :value="oauth2.token_expires_in" :step="10" :min="0" size="large" @change="updateSetting($event, 'oauth2', 'token_expires_in')"/>
        <p class="expl">The lifetime in seconds of the access token</p>
      </el-form-item>
      <el-form-item label="Issue new refresh token">
        <el-switch :value="oauth2.issue_new_refresh_token" @change="updateSetting($event, 'oauth2', 'issue_new_refresh_token')"/>
        <p class="expl">Keeps old refresh token or generate new refresh token when to obtain an access token</p>
      </el-form-item>
      <el-form-item label="Clean expired token">
        <el-switch :value="oauth2.clean_expired_tokens" @change="updateSetting($event, 'oauth2', 'clean_expired_tokens')"/>
        <p class="expl">Enable a background job to clean expired oauth tokens. Defaults to false.</p>
      </el-form-item>
      <el-form-item label="Clean expired token interval">
        <el-input-number :value="oauth2.clean_expired_tokens_interval / 3600000" :step="1" :min="0" size="large" @change="updateSetting($event * 3600000, 'oauth2', 'clean_expired_tokens_interval')"/>
        <p class="expl">Interval to run the job to clean expired tokens. Defaults to 24 hours.</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Authentication',
  computed: {
    ...mapGetters([
      'pleromaAuthenticator',
      'ldap',
      'auth',
      'ueberauth',
      'oauth2',
      'facebook',
      'google',
      'twitter',
      'microsoft'
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
    onSubmit() {
      this.$store.dispatch('SubmitChanges')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
