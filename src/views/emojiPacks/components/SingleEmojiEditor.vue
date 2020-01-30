<template>
  <div>
    <div v-if="isLocal" class="emoji-container">
      <img
        :src="addressOfEmojiInPack(host, packName, file)"
        class="emoji-preview-img">
      <el-input v-model="emojiName" :placeholder="$t('settings.shortcode')" class="emoji-info"/>
      <el-input v-model="emojiFile" :placeholder="$t('settings.file')" class="emoji-info"/>
      <div class="emoji-buttons">
        <el-button type="primary" @click="update">{{ $t('settings.update') }}</el-button>
        <el-button @click="remove">{{ $t('settings.remove') }}</el-button>
      </div>
    </div>

    <div v-if="!isLocal" class="emoji-container">
      <img
        :src="addressOfEmojiInPack(host, packName, file)"
        class="emoji-preview-img">
      <el-input :value="emojiName" :placeholder="$t('settings.shortcode')" class="emoji-info"/>
      <el-input :value="emojiFile" :placeholder="$t('settings.file')" class="emoji-info"/>
      <el-popover v-model="copyPopoverVisible" placement="left-start" popper-class="copy-popover">
        <p>{{ $t('settings.selectLocalPack') }}</p>
        <el-select v-model="copyToLocalPackName" :placeholder="$t('settings.localPack')">
          <el-option
            v-for="(_pack, name) in localPacks"
            :key="name"
            :label="name"
            :value="name" />
        </el-select>
        <p>{{ $t('settings.specifyShortcode') }}</p>
        <el-input v-model="copyToShortcode" :placeholder="$t('settings.leaveEmptyShortcode')"/>
        <p>{{ $t('settings.specifyFilename') }}</p>
        <el-input v-model="copyToFilename" :placeholder="$t('settings.leaveEmptyFilename')"/>
        <el-button
          :disabled="!copyToLocalPackName"
          type="primary"
          class="copy-to-local-button"
          @click="copyToLocal">{{ $t('settings.copy') }}</el-button>
        <el-button slot="reference" type="primary" class="emoji-button">{{ $t('settings.copyToLocalPack') }}</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>

import { addressOfEmojiInPack } from '@/api/emojiPacks'
export default {
  props: {
    host: {
      type: String,
      required: true
    },
    packName: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    isLocal: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      newName: null,
      newFile: null,
      copyToLocalPackName: null,
      copyPopoverVisible: false,
      copyToShortcode: '',
      copyToFilename: ''
    }
  },
  computed: {
    emojiName: {
      get() {
        // Return a modified name if it was modified, otherwise return the old name
        return this.newName !== null ? this.newName : this.name
      },
      set(val) { this.newName = val }
    },
    emojiFile: {
      get() {
        // Return a modified name if it was modified, otherwise return the old name
        return this.newFile !== null ? this.newFile : this.file
      },
      set(val) { this.newFile = val }
    },
    localPacks() {
      return this.$store.state.emojiPacks.localPacks
    }
  },
  methods: {
    update() {
      this.$store.dispatch('UpdateAndSavePackFile', {
        action: 'update',
        packName: this.packName,
        oldName: this.name,
        newName: this.emojiName,
        newFilename: this.emojiFile
      }).then(() => {
        this.newName = null
        this.newFile = null

        this.$store.dispatch('ReloadEmoji')
      })
    },
    remove() {
      this.$confirm('This will delete the emoji, are you sure?', 'Warning', {
        confirmButtonText: 'Yes, delete the emoji',
        cancelButtonText: 'No, leave it be',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('UpdateAndSavePackFile', {
          action: 'remove',
          packName: this.packName,
          name: this.name
        }).then(() => {
          this.newName = null
          this.newFile = null

          this.$store.dispatch('ReloadEmoji')
        })
      })
    },
    copyToLocal() {
      this.$store.dispatch('UpdateAndSavePackFile', {
        action: 'add',
        packName: this.copyToLocalPackName,
        shortcode: this.copyToShortcode.trim() !== '' ? this.copyToShortcode.trim() : this.name,
        fileName: this.copyToFilename.trim() !== '' ? this.copyToFilename.trim() : this.file,
        file: this.addressOfEmojiInPack(this.host, this.packName, this.file)
      }).then(() => {
        this.copyToLocalPackName = null
        this.copyToLocalVisible = false
        this.copyToShortcode = ''
        this.copyToFilename = ''

        this.$store.dispatch('ReloadEmoji')
      })
    },
    addressOfEmojiInPack
  }
}
</script>

<style>
.copy-popover {
  width: 330px
}
.emoji-buttons {
  place-self: center;
  min-width: 200px
}
.emoji-container {
  display: grid;
  grid-template-columns: 7% 35% 35% 20%;
  justify-content: space-between;
  grid-column-gap: 1%;
  margin-bottom: 10px;
}
.emoji-preview-img {
  max-width: 100%;
  place-self: center;
}
.emoji-info {
  place-self: center;
}
.copy-to-local-button {
  margin-top: 12px;
  float: right;
}
</style>
