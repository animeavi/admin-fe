<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <el-input v-if="isLocal" v-model="modifyingName" placeholder="Name/Shortcode" />
      <el-input v-else :value="modifyingName" placeholder="Name/Shortcode" />
    </el-col>
    <el-col :span="6">
      <el-input v-if="isLocal" v-model="modifyingFile" placeholder="File"/>
      <el-input v-else :value="modifyingFile" placeholder="File"/>
    </el-col>

    <el-col v-if="isLocal" :span="2">
      <el-button type="primary" @click="update">Update</el-button>
    </el-col>
    <el-col v-if="isLocal" :span="2">
      <el-button type="danger" @click="remove">Remove</el-button>
    </el-col>

    <el-col v-if="!isLocal" :span="4">
      <el-popover v-model="copyToLocalVisible" placement="bottom">
        <p>Select the local pack to copy to</p>
        <el-select v-model="copyToLocalPackName" placeholder="Local pack">
          <el-option
            v-for="(_pack, name) in $store.state.emojiPacks.localPacks"
            :key="name"
            :label="name"
            :value="name" />
        </el-select>

        <p>Specify a custom shortcode (leave empty to use the same shortcode)</p>
        <el-input v-model="copyToShortcode" placeholder="Shortcode (optional)" />

        <p>Specify a custom filename (leavy empty to use the same filename)</p>
        <el-input v-model="copyToFilename" placeholder="Filename (optional)" />

        <el-button
          :disabled="!copyToLocalPackName"
          type="success"
          class="copy-to-local-button"
          @click="copyToLocal">Copy</el-button>

        <el-button slot="reference" type="primary">Copy to local pack...</el-button>
      </el-popover>
    </el-col>

    <el-col :span="2">
      <img
        :src="addressOfEmojiInPack(host, packName, file)"
        class="emoji-preview-img">
    </el-col>
  </el-row>
</template>

<style>
  .emoji-preview-img {
    max-width: 5em;
  }

  .copy-to-local-button {
    margin-top: 2em;
    float: right;
  }
</style>

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
      copyToLocalVisible: false,
      copyToShortcode: '',
      copyToFilename: ''
    }
  },

  computed: {
    modifyingName: {
      get() {
        // Return a modified name if it was actually modified, otherwise return the old name
        return this.newName !== null ? this.newName : this.name
      },
      set(val) { this.newName = val }
    },
    modifyingFile: {
      get() {
        // Return a modified name if it was actually modified, otherwise return the old name
        return this.newFile !== null ? this.newFile : this.file
      },
      set(val) { this.newFile = val }
    }
  },
  methods: {
    update() {
      this.$store.dispatch('UpdateAndSavePackFile', {
        action: 'update',
        packName: this.packName,
        oldName: this.name,
        newName: this.modifyingName,
        newFilename: this.modifyingFile
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
