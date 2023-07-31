<template>
  <div id="history" class="fill-height">
    <nav-bar/>
    <v-container fluid class="pt-0 pb-0 fill-height">
      <v-row class="fill-height">
        <v-col
          cols="12"
          sm="12"
          order="2"
          order-sm="2"
          order-md="1"
          order-lg="1"
          md="9"
          lg="9"
          class="pt-8 pl-8 pr-8"
        >
          <h1 class="title font-weight-medium pb-5 ml-2">{{ownPlaylist.title}}</h1>
          <template v-if="!ownPlaylist && !loading">
            <p class="text-center body-1">Haven't video yet.</p>
          </template>
          <section>
            <div
              v-for="(video, i) in loading ? 12 : ownPlaylist.videos"
              :key="i"
              class="mb-5"
            >
              <v-skeleton-loader
                class="mx-auto"
                type="list-item-avatar-three-line"
                :loading="loading"
                tile
                large
              >
                <v-card @click="playVideo(video.video.id)" class="card card-color" tile flat>
                  <v-row no-gutters v-if="video.video">
                    <v-col class="mx-auto pt-2 pb-2 pl-2 pr-2 " cols="2" sm="2" md="2" lg="2">
                      <v-img
                        class="align-center"
                        :src="
                          `${getUrl}${video.video.thumbnails}`
                        "
                      >
                      </v-img>
                    </v-col>
                    <v-col>
                      <div class="ml-2">
                        <v-card-title
                          class="pl-2 pt-0 subtitle-1 font-weight-bold d-flex justify-space-between"
                          style="line-height: 1"
                        >
                          {{ video.video.title }}
                      
                          <v-menu offset-y left>
                            <template v-slot:activator="{ on }">
                              <v-btn text v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>
                          
                            <v-card>  
                              <v-list>
                                <v-list-item
                                  @click="deleteOwnPlaylistVideo(video.video.id)"
                                >
                                  <v-list-item-icon>
                                    <v-icon>mdi-delete</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-title>Remove from {{ ownPlaylist.title }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="moveToTop(video.video.id)">
                                  <v-list-item-icon>
                                    <v-icon>mdi-format-vertical-align-top</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-title>Move to top</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="moveToBottom(video.video.id)">
                                  <v-list-item-icon>
                                    <v-icon>mdi-format-vertical-align-bottom</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-title>Move to bottom</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-card>
                          </v-menu>
                        </v-card-title>
                        <v-card-subtitle
                          v-if="video.video.singer"
                          class="pl-2 pt-2 pb-0"
                          style="line-height: 1"
                        >
                          {{ video.video.singer.channelName
                          }}<v-icon>mdi-circle-small</v-icon
                          >{{ video.video.views }} views
                        </v-card-subtitle>
                        <v-card-subtitle class="pl-2 pt-2 pb-0">
                          {{ video.video.description }}
                        </v-card-subtitle>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-skeleton-loader>
            </div>
          </section>
          <v-divider></v-divider>
          <div class="d-flex justify-space-between mt-2 ml-2">
            <h1 class="title font-weight-medium pb-5">Recommend videos</h1>
            <v-btn @click="refreshRecommendVideos" text class="text--darken-1"><v-icon>mdi-reload</v-icon> Refresh</v-btn>
          </div>
          <section>
            <div
              v-for="(video, i) in loading ? 12 : recommendVideos"
              :key="i"
              class="mb-5"
            >
              <v-skeleton-loader
                class="mx-auto"
                type="list-item-avatar-three-line"
                :loading="loading"
                tile
                large
              >
                <v-card class="card card-color" tile flat>
                  <v-row no-gutters v-if="video">
                    <v-col class="mx-auto pt-2 pb-2 pl-2 pr-2 " cols="2" sm="2" md="2" lg="2">
                      <v-img
                        class="align-center"
                        :src="
                          `${getUrl}${video.thumbnails}`
                        "
                      >
                      </v-img>
                    </v-col>
                    <v-col>
                      <div class="d-flex justify-space-between align-items-center mt-2 ml-2">
                        <div>
                          <v-card-title
                            class="pl-2 pt-0 subtitle-1 font-weight-bold d-flex justify-space-between"
                            style="line-height: 1"
                          >
                            {{ video.title }}
                        
                          </v-card-title>
                          <v-card-subtitle
                            v-if="video.singer"
                            class="pl-2 pt-2 pb-0"
                            style="line-height: 1"
                          >
                            {{ video.singer.channelName
                            }}<v-icon>mdi-circle-small</v-icon
                            >{{ video.views }} views
                          </v-card-subtitle>
                          <v-card-subtitle class="pl-2 pt-2 pb-0">
                            {{ video.description }}
                          </v-card-subtitle>
                        </div>
                        <v-btn @click="addVideoToPlaylist(video.id)" class="btnCss">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>

                    </v-col>
                  </v-row>
                </v-card>
              </v-skeleton-loader>
            </div>
          </section>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          order="1"
          order-sm="1"
          order-md="2"
          order-lg="2"
          md="3"
          lg="3"
          :class="[
            'pa-0 fix_height',
            { 'fill-height': $vuetify.breakpoint.name.smAndDown ? true : false }
          ]"
        >
          <v-card
            flat
            id="card-radiobox"
            class="fill-height fix_height lighten-4 pa-10"
          >
            <v-img
              class="align-center"
              :src="
                `${getUrl}${ownPlaylist.thumbnailUrl}`
              "
            >
            </v-img>
            <div class="titleWrap">
                <p class="title font-weight-regular mt-2 mb-2">{{ ownPlaylist.title }}</p>
                <v-btn class="btnCss titleBtn" @click="dialogDelete = true">
                  <v-icon>
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>   
              </div>
                <v-dialog v-model="dialogDelete" persistent max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline"
                        >Delete playlist</span
                      >
                    </v-card-title>
                    <v-card-text>
                      Are you sure you want to delete {{ ownPlaylist.title}}?
                      <br />
                      Note: Deleting playlists is a permanent action and cannot be undone.
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="dialogDelete = !dialogDelete"
                        >Cancel</v-btn
                      >

                      <v-btn
                        :loading="deleteBtnLoading"
                        color="blue darken-1"
                        text
                        @click="deletePlaylist"
                        >Delete Forever</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            <div>
              <p>{{ userName }}</p>
              <div class="content">
                <p class="">{{ `${ownPlaylist.videos.length} videos` }}</p>
                <p class="">No views</p>
                <p class="">Update {{dateFormatter(ownPlaylist.updated_at)}}</p>
              </div>
              <p>{{ ownPlaylist.description }}</p>
              <p>{{ ownPlaylist.status }}</p>
              <div class="wrapBtn">
                <v-btn
                @click="handleWatchPlaylist"
                class=" text--darken-1"
                ><v-icon>mdi-play</v-icon>Play All</v-btn>
                <v-btn><v-icon>mdi-shuffle-variant</v-icon>Suffle</v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar  :timeout="timeout" v-model="snackbar">
      {{ deleteMessage }}
      <v-btn color="white" text @click="snackbar = false" icon>
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import NavBar from '@/components/NavBar'
// import InfiniteLoading from 'vue-infinite-loading'
import OwnPlaylistService from '@/services/OwnPlaylistService'
import { VIcon } from 'vuetify/lib'
import VideoService from '@/services/VideoService'
export default {
  data: function() {
    return {
      dialogDelete: false,
      deleteBtnLoading: false,
      userName: localStorage.getItem('username'),
      loading: false,
      loaded: false,
      errored: false,
      snackbar: false,
      timeout: 4000,
      deleteMessage: '',
      watchLaterVideos: [],
      recommendVideos: [],
      ownPlaylist: this.$store.getters.getOwnPlaylist,
      page: 1,
      infiniteId: +new Date(),
      clearLoading: false
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser', 'getUrl'])
  },
  methods: {
    async getOwnPlaylist(id) {
      this.loading = true
      const ownPlaylist = await this.$store.dispatch('setOwnPlaylist', id)
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      if (!ownPlaylist) return
      // this.ownPlaylist = this.$store.getters.getOwnPlaylist

    },
    async getRecommendVideos(id) {
      this.loading = true
      const videos = await VideoService.getRecommendVideosForPlaylist({
        user_id: this.getCurrentUser.id,
        playlist_id: id
      })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      if (!videos) return
      this.recommendVideos = videos.data
    },
    async deleteOwnPlaylistVideo(id) {
      const video = await OwnPlaylistService.removeVideoFromPlaylist({
        video_id: id,
        own_playlist_id: this.ownPlaylist.id
      })
        .catch((err) => {
          console.log(err)
        })
        // .finally(() => {
        //   this.ownPlaylist.videos = this.ownPlaylist.videos.filter(
        //     (video) => video.id !== id
        //   )
        //   this.deleteMessage = 'Video Deleted Successfully'
        //   this.snackbar = true
        // })
      if (!video) return
      this.ownPlaylist.videos = this.ownPlaylist.videos.filter(
        (video) => video.video.id !== id
      )
      this.deleteMessage = 'Video Deleted Successfully'
      this.snackbar = true
    },
    async deletePlaylist() {
      this.deleteBtnLoading = true
      await OwnPlaylistService.deleteById(this.ownPlaylist.id)
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.deleteBtnLoading = false
        })
      this.$router.push({
        name: 'Home'
      })
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    },
    handleWatchPlaylist() {
      if (!this.ownPlaylist.videos.length) return
      this.$router.push({
        name: 'WatchVideo',
        params: {
          id: this.ownPlaylist.videos[0].video.id,
          isWatchOwnPlayList: true,
          own_playlist_id: this.ownPlaylist.id
        }
      })
    },
    playVideo(id) {
      this.$router.push({
        name: 'WatchVideo',
        params: {
          id,
          isWatchOwnPlayList: true,
          own_playlist_id: this.ownPlaylist.id
        }
      })
    },
    async addVideoToPlaylist(id) {
      const video = await OwnPlaylistService.addVideoToPlaylist({
        video_id: id,
        playlist_id: this.ownPlaylist.id
      })
        .catch((err) => {
          console.log(err)
        })
      if (!video) return
      this.recommendVideos = this.recommendVideos.filter(
        (recommendVideo) => recommendVideo.id !== id
      )
      // this.ownPlaylist.own_playlist_videos.push(video.data)
      this.$store.dispatch('addVideo', video.data)
      this.ownPlaylist = this.$store.getters.getOwnPlaylist
    },
    async refreshRecommendVideos() {
      this.getRecommendVideos(this.$route.params.id)
    },
    moveToBottom(id) {
      const video = this.ownPlaylist.videos.find(
        (video) => video.video.id === id
      )
      this.ownPlaylist.videos = this.ownPlaylist.videos.filter(
        (video) => video.video.id !== id
      )
      this.ownPlaylist.videos.push(video)
    },
    moveToTop(id) {
      const video = this.ownPlaylist.videos.find(
        (video) => video.video.id === id
      )
      this.ownPlaylist.videos = this.ownPlaylist.videos.filter(
        (video) => video.video.id !== id
      )
      this.ownPlaylist.videos.unshift(video)
    },
  },
  components: {
    NavBar,
    VIcon
},
  mounted() {
    this.getOwnPlaylist(this.$route.params.id)
    this.getRecommendVideos(this.$route.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    this.getOwnPlaylist(to.params.id)
    next()
  },
  name: 'OwnPlaylistVideo'
}
</script>

<style lang="scss" scoped>
.fix_height {
    display: block;
    overflow: hidden scroll;
    background-color: #59514b;
    color: white;
    height: 100%    !important;
    overflow-y:hidden !important;
    overflow-x:hidden !important;
}
.content {
  display: flex;
  font-size: small;
  justify-content: space-between;
  width: 100%;
}
.wrapBtn {
  display: flex;
  justify-content: space-between;
}
.card-color {
  background-color: white !important;
}
.card-color div:hover {
  background-color: #f5f5f5 !important;
}
.btnCss {
  background-color: white !important;
  color: black !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-right: 20px !important;
  margin-top: 20px !important;
}
.titleWrap {
  display: flex;
  justify-content: space-between;
  position: relative;
  .titleBtn {
    position: relative;
    top: -15px;
    background-color: #59514b !important;
    color: white !important;
  }
}
</style>
