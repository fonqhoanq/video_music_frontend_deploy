<template>
  <div id="home" class="pa-4">
    <nav-bar/>
    <v-container fluid>
      <v-alert prominent type="error" v-if="errored">
        <v-row align="center">
          <v-col class="grow">
            <div class="title">Error!</div>
            <div>
              Something went wrong, but don’t fret — let’s give it another shot.
            </div>
          </v-col>
          <v-col class="shrink">
            <v-btn @click="getVideos">Take action</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <main v-else>
        <div v-if="isLoggedIn && musicType === ''">
          <h3 class="headline font-weight-medium">Playlists</h3>
          <v-slide-group class="pa-4" multiple show-arrows>
            <v-slide-item
              v-for="(playlist, i) in loading ? 12 : playlists"
              :key="i"
            >
              <v-skeleton-loader
                type="card-avatar" 
                :loading="loading"
                class="mr-1"
              >
                <playlist-card
                  :card="{ maxWidth: 350 }"
                  :playlist="playlist"
                ></playlist-card>
              </v-skeleton-loader>
            </v-slide-item>
          </v-slide-group>
        </div>
        <div class="wrapBtn">
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== ''},
              {'black white--text': musicType == ''},
              'mr-3 mb-3']"
            @click="changeVideoType('')"
          >All</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Rock'},
              {'black white--text': musicType == 'Rock'},
              'mr-3 mb-3']"
            @click="changeVideoType('Rock')"
          >Rock</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Pop'},
              {'black white--text': musicType == 'Pop'},
              'mr-3 mb-3']"
            @click="changeVideoType('Pop')"
          >Pop</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Country Music'},
              {'black white--text': musicType == 'Country Music'},
              'mr-3 mb-3']"
            @click="changeVideoType('Country Music')"
          >Country Music</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Electronic'},
              {'black white--text': musicType == 'Electronic'},
              'mr-3 mb-3']"
            @click="changeVideoType('Electronic')"
          >Electronic</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Funk'},
              {'black white--text': musicType == 'Funk'},
              'mr-3 mb-3']"
            @click="changeVideoType('Funk')"
          >Funk</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Hip Hop'},
              {'black white--text': musicType == 'Hip Hop'},
              'mr-3 mb-3']"
            @click="changeVideoType('Hip Hop')"
          >Hip Hop</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Jazz'},
              {'black white--text': musicType == 'Jazz'},
              'mr-3 mb-3']"
            @click="changeVideoType('Jazz')"
          >Jazz</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Latin'},
              {'black white--text': musicType == 'Latin'},
              'mr-3 mb-3']"
            @click="changeVideoType('Latin')"
          >Latin</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'Soul'},
              {'black white--text': musicType == 'Soul'},
              'mr-3 mb-3']"
            @click="changeVideoType('Soul')"
          >Soul</v-btn>
          <v-btn
            :class="[
              {'grey grey--text lighten-3 text--darken-3': musicType !== 'R&B'},
              {'black white--text': musicType == 'R&B'},
              'mr-3 mb-3']"
            @click="changeVideoType('R&B')"
          >R&B</v-btn>
        </div>
        <h3 class="headline font-weight-medium">Recommended</h3>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="(video, i) in loading ? 12 : videos"
            :key="i"
            class="mx-xs-auto"
          >
            <v-skeleton-loader type="card-avatar" :loading="loading">
              <video-card
                :card="{ maxWidth: 350 }"
                :video="video"
                :channel="video.singer"
                v-on:openPlaylistDialog="handleShowSavedPlaylistDialog(video)"
                v-on:addWatchLater="handleAddWatchLater(video)"
                v-on:removeWatchLater="handleRemoveWatchLater"
              ></video-card>
            </v-skeleton-loader>
          </v-col>
          <v-col class="text-center" v-if="videos.length === 0 && !loading">
            <p>No videos yet</p>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <infinite-loading @infinite="getVideos">
              <div slot="spinner">
                <v-progress-circular
                  indeterminate
                  color="red"
                ></v-progress-circular>
              </div>
              <div slot="no-results"></div>
              <span slot="no-more"></span>
              <div slot="error" slot-scope="{ trigger }">
                <v-alert prominent type="error">
                  <v-row align="center">
                    <v-col class="grow">
                      <div class="title">Error!</div>
                      <div>
                        Something went wrong, but don’t fret — let’s give it
                        another shot.
                      </div>
                    </v-col>
                    <v-col class="shrink">
                      <v-btn @click="trigger">Take action</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </div>
            </infinite-loading>
          </v-col>
        </v-row>
      </main>
    </v-container>
    <saved-playlist-modal
      :video="currentVideo"
      :check-playlists="checkPlaylists"
      :open-dialog="showSavedPlaylistDialog"
      v-on:closeDialog="showSavedPlaylistDialog = false"
      v-on:openSnackbar="snackbar = true"
    >
    </saved-playlist-modal>
    <v-snackbar  :timeout="timeout" v-model="snackbar">
        {{ message }}
      </v-snackbar>
  </div>

</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
import { mapGetters } from 'vuex'
import PlaylistService from '@/services/PlaylistService'
import VideoCard from '@/components/VideoCard'
import VideoService from '@/services/VideoService'
import NavBar from '@/components/NavBar'
import PlaylistCard from '@/components/PlaylistCard.vue'
import SavedPlaylistModal from '@/components/SavedPlaylistModal.vue'
import OwnPlaylistService from '@/services/OwnPlaylistService'
import WatchLaterService from '@/services/WatchLaterService'
export default {
  name: 'HomeView',
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    timeout: 4000,
    show: false,
    snackbar: false,
    showSavedPlaylistDialog: false,
    message: 'Create playlist successfully!',
    videos: [],
    currentVideo: {},
    playlists: [],
    checkPlaylists: [],
    page: 1,
    musicType: ''
  }),
  computed: {
    ...mapGetters(['getCurrentUser', 'getUrl', 'isLoggedIn'])
  },
  methods: {
    async getVideos($state) {
      if (!this.loaded) {
        this.loading = true
      }
      var videos = []
      if (this.musicType === '') {
        videos = await VideoService.getAll('public', { page: this.page })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        videos = await VideoService.getByCategory({ 
          page: this.page,
          category: this.musicType 
        })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
      }
      
      if (typeof videos === 'undefined') return
      // this.videos.push(...videos.data)
      // $state.complete()
      console.log(videos.data)
      console.log(videos.data.length)
      if (videos.data.length > 0) {
        this.page += 1
        this.videos.push(...videos.data)
        if ($state) {
          $state.loaded()
          this.loaded = true
        }
      } else {
        $state.complete()
      }
      console.log(this.videos)
    },
    async getPlaylists() {
      this.loading = true
      const params = {
        user_id: this.getCurrentUser.id
      }
      const playlists = await PlaylistService.getPlaylistForUser(params)
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => {
          this.loading = false
        })
      if (typeof playlists === 'undefined') return
      this.playlists = playlists.data
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    },
    async changeVideoType (type) {
      this.musicType = type
      this.page = 1
      this.videos = []
      this.getVideos()
    },
    handleShowSavedPlaylistDialog(video) {
      this.currentVideo = video
      this.showSavedPlaylistDialog = true
      this.checkVideoPlaylist(video)
    },
    async checkVideoPlaylist(video) {
      const playlists = await OwnPlaylistService.checkVideoPlaylist({user_id: this.getCurrentUser.id, video_id: video.id})
      .catch((err) => {
        console.log(err)
      })
      if (!playlists) return
      this.checkPlaylists = playlists.data.map((playlist) => playlist.id)
    },
    async handleAddWatchLater(video) {
      await WatchLaterService.createWatchLater({
        video_id: video.id,
        user_id: this.getCurrentUser.id
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.snackbar = true
        this.message = 'Added to watch later!'
      })
    },
    async handleRemoveWatchLater(id) {
      await WatchLaterService.removeWatchLater(id)
      .catch((err) => {
        console.log(err)
      }).finally(() => {
        this.snackbar = true
        this.message = 'Removed from watch later!'
      })
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getPlaylists()
      this.getVideos()
    }
  },
  components: {
    VideoCard,
    InfiniteLoading,
    NavBar,
    PlaylistCard,
    SavedPlaylistModal
  }
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
.wrapBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
