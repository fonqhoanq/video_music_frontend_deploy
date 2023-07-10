<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="fab-transition"
    max-width="250"
    id="settings"
  >
    <v-card tile>
      <div class="d-flex justify-space-between mb-5" id="modal-header">
        <v-card-title class="py-3">Settings</v-card-title>

        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text>
        <v-row>
          <v-col
            order="last"
            order-sm="last"
            order-md="first"
            order-lg="first"
            order-xl="first"
            cols="12"
            sm="12"
            md="12"
            lg="12"
            class="pt-0"
          >
            <v-checkbox
            v-for="(playlist, index) in playlists"
            multiple
            :key="playlist.id"
            :value="playlist.id"
            :label="playlist.title"
            :hide-details="index !== playlists.length - 1"
            v-model="check"
            v-on:change="handleAddVideoToPlaylist"
            >
            <v-icon>mdi-lock-outline</v-icon>
            </v-checkbox>
            <div v-if="!isCreateNewPlaylist">
              <h3 @click="isCreateNewPlaylist = true">
                <v-icon>mdi-plus</v-icon>
                Create new playlist
              </h3>
            </div>
            <div v-else>
              <ValidationObserver
                ref="personalInfoForm"
                v-slot="{ handleSubmit, reset }"
              >
                <form
                  @submit.prevent="handleSubmit(submit)"
                  @reset.prevent="reset"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Playlist Title"
                    rules="required|min:3|max:50"
                  >
                    <v-text-field
                      v-model="formData.title"
                      :error-messages="errors"
                      label="Playlist Title"
                      filled
                      dense
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Playlist Description"
                    rules="required|min:3|max:255"
                  >
                    <v-text-field
                      v-model="formData.description"
                      :error-messages="errors"
                      label="Playlist Description"
                      filled
                      dense
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Visibility"
                    rules="required|min:3"
                  >
                    <v-select
                      :items="visibility"
                      :error-messages="errors"
                      filled
                      label="Visibility"
                      v-model="formData.visibility"
                    ></v-select>
                  </ValidationProvider>
  
                  <v-btn
                    :loading="loading"
                    type="submit"
                    class="primary "
                    depressed
                    >Create</v-btn
                  >
                </form>
              </ValidationObserver>
            </div>
            
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import OwnPlaylistService from '@/services/OwnPlaylistService'
// import myUpload from "/home/dell/vue_video_pj/node_modules/vue-image-crop-upload/upload-2.vue";
export default {
  name: 'SettingsModal',
  props: {
    openDialog: {
      type: Boolean,
      required: true
    },
    video: {
      type: Object,
      required: false
    },
    checkPlaylists: {
      type: Array,
      required: false
    }
  },
  data: function() {
    return {
      showCurrentPassword: false,
      check: [],
      showNewPassword: false,
      valid: false,
      interval: {},
      value: 0,
      show: false,
      playlists: [],
      isCreateNewPlaylist: false,
      visibility: ["Private", "Public", "Unlisted"],
      rules: [
        (value) =>
          !value ||
          value.size < 5000000 ||
          'Video size should be less than 5 MB!'
      ],
      categories: ['People', 'Technology', 'Fashion'],
      visibilty: ['Public', 'Private'],
      currentLength: 0,
      formData: {
        channelName: this.$store.getters.getCurrentUser.username,
        email: this.$store.getters.getCurrentUser.email,
        currentPassword: '',
        newPassword: ''
      },
      loading: false,
      imgDataUrl: `${this.$store.getters.getUrl}${this.$store.getters.getCurrentUser.avatarUrl}`,
      url: `http://54.199.17.60/users/${this.$store.getters.getCurrentUser.id}/avatar`,
      headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser', 'getUrl']),
    dialog() {
      return this.openDialog
    }
  },
  methods: {
    async submit() {
      this.loading = true
      const ownPlaylist = await OwnPlaylistService.createOwnPlaylist({
          own_playlist: {
              title: this.formData.title,
              playlist_status: this.convertStatus(),
              description : this.formData.description,
              user_id: this.getCurrentUser.id
          },
          video_id: this.video.id
        }
      ).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
      if (ownPlaylist) {
        this.$emit('closeDialog')
        this.$emit('openSnackbar')
        this.formData.title = ''
        this.formData.description = ''
        this.formData.visibility = ''
      }

      this.closeModal()
    },
    getCheckData() {
      this.check = this.checkPlaylists
      this.currentLength = this.check.length
    },
    async getPlaylists() {
      const playlists = await OwnPlaylistService.getOwnPlaylists({user_id: this.getCurrentUser.id})
      .catch((err) => {
        console.log(err)
      })
      if (!playlists) return
      this.playlists = playlists.data
    },
    async handleAddVideoToPlaylist() {
      if (this.check.length === 0) return
      if (this.check.length > this.currentLength) {
        const ownPlaylist = await OwnPlaylistService.addVideoToPlaylist(
        {
          own_playlist_video: {
            video_id: this.video.id,
          },
          playlists: this.check
        }).catch((err) => {
          console.log(err)
        })
        if (!ownPlaylist) return
        this.currentLength = this.check.length
      } else {
        await OwnPlaylistService.removeVideoFromPlaylist(
          {
            own_playlist_video: {
              video_id: this.video.id,
            },
            playlists: this.check
          }).catch((err) => {
            console.log(err)
          })
        this.currentLength = this.check.length
      }
      // this.$emit('closeDialog')
      // this.$emit('openSnackbar')
    },
    closeModal() {
      this.$emit('closeDialog')
      this.formData.title = ''
      this.formData.description = ''
      this.formData.visibility = ''
      this.isCreateNewPlaylist = false
    },
    toggleShow() {
      this.show = !this.show
    },
    convertStatus() {
     if (this.formData.visibility === 'Public') {
       return 'is_public'
     } else if (this.formData.visibility === 'Private') {
       return 'unpublic'
     } else {
       return 'unlisted'
     }
    }
  },
  created() {
    this.getCheckData()
  },
  mounted() {
    this.getPlaylists()
  },
  watch: {
    checkPlaylists: function() {
      this.getCheckData()
    }
  }
}
</script>

<style lang="scss">
#modal-header {
  border-bottom: 1px solid rgb(238, 232, 232);
}

#settings-image-placeholder {
  padding-top: 7em;
  padding-bottom: 7em;
  border: 2px dashed rgb(209, 209, 209);
  border-radius: 50%;
}

@media (max-width: 700px) {
  .vue-image-crop-upload {
    .vicp-wrap {
      width: 95%;
      height: 550px;
      .vicp-step2 .vicp-crop {
        .vicp-crop-left {
          float: none;

          .vicp-range {
            margin: auto;
            margin-top: 30px;
          }

          & * {
            margin-left: auto;
            margin-right: auto;
          }
        }
        .vicp-crop-right {
          float: none;
          margin-top: 30px;
          .vicp-preview .vicp-preview-item {
            display: inline-block;
            float: none;
          }
          & * {
            margin-left: auto;
            margin-right: auto;
          }
        }
      }
    }
  }
}
</style>
