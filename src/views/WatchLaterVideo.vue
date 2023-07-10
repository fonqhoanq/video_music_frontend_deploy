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
          class="pt-8 pl-8"
        >
          <h1 class="title font-weight-medium pb-5">Watch later</h1>
            <template v-if="watchLaterVideos.length <= 0 && !isLoggedIn">
              <div class="center">
                <v-icon class="icon">mdi-clock-plus-outline</v-icon>
                <h2>Keep track of what you watch</h2>
                <p class="body-1">Watch later video isn't viewable when signed out.</p>
                <v-btn
                 id="signInBtn"
                  tile
                  outlined
                  color="blue"
                  class="font-weight-bold"
                  v-if="!isLoggedIn"
                  router
                  to="/signin"
                >
                  <v-icon left size="26">mdi-account-circle</v-icon> Sign in
                </v-btn>
              </div>
            </template>
            <template v-else-if="watchLaterVideos.length <= 0 && isLoggedIn">
              <div class="center">
                <v-icon class="icon">mdi-clock-plus-outline</v-icon>
                <h2>Keep track of what you watch</h2>
                <p class="body-1">Watch later videos is empty.</p>
              </div>
            </template>
            <template v-else>
              <section>
                <div
                  v-for="(watchLaterVideo, i) in loading ? 12 : watchLaterVideos"
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
                    <v-card @click="playVideo(watchLaterVideo.video.id)" class="card card-color" tile flat>
                      <v-row no-gutters v-if="watchLaterVideo">
                        <v-col class="mx-auto pt-2 pb-2 pl-2 pr-2 " cols="3" sm="3" md="3" lg="3">
                          <v-img
                            class="align-center"
                            :src="
                              `${getUrl}${watchLaterVideo.video.thumbnails}`
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
                              {{ watchLaterVideo.video.title }}
  
                          
                              <v-menu offset-y left>
                                <template v-slot:activator="{ on }">
                                  <v-btn text v-on="on">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                  </v-btn>
                                </template>
                              
                                <v-card>  
                                  <v-list>
                                    <v-list-item
                                      @click="deleteWatchLaterVideo(watchLaterVideo.id)"
                                    >
                                      <v-list-item-icon>
                                        <v-icon>mdi-delete</v-icon>
                                      </v-list-item-icon>
                                      <v-list-item-title>Remove from watch later</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="moveToTop(watchLaterVideo.id)">
                                      <v-list-item-icon>
                                        <v-icon>mdi-format-vertical-align-top</v-icon>
                                      </v-list-item-icon>
                                      <v-list-item-title>Move to top</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="moveToBottom(watchLaterVideo.id)">
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
                              class="pl-2 pt-2 pb-0"
                              style="line-height: 1"
                            >
                              {{ watchLaterVideo.video.singer.channelName
                              }}<v-icon>mdi-circle-small</v-icon
                              >{{ watchLaterVideo.video.views }} views
                            </v-card-subtitle>
                            <v-card-subtitle class="pl-2 pt-2 pb-0">
                              {{ watchLaterVideo.video.description }}
                            </v-card-subtitle>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-skeleton-loader>
                </div>
                <infinite-loading
                  :identifier="infiniteId"
                  @infinite="getWatchLaterVideos"
                >
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
              </section>
            </template>

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
            v-if="watchLaterVideos.length > 0 && watchLaterVideos[0].video"
            id="card-radiobox"
            class="fill-height fix_height lighten-4 pa-10"
          >
            <v-img
              class="align-center"
              :src="
                `${getUrl}${watchLaterVideos[0].video.thumbnails}`
              "
            >
            </v-img>
            <p class="title font-weight-regular mt-2 mb-2">Watch later</p>
            <div>
              <p>{{ userName }}</p>
              <div class="content">
                <p class="pr-2">{{ `${watchLaterVideos.length} videos` }}</p>
                <p class="pr-2">No views</p>
                <p class="pr-2">Update today</p>
              </div>
              <div class="wrapBtn">
                <v-btn
                @click="handleWatchLater"
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
import InfiniteLoading from 'vue-infinite-loading'
import WatchLaterService from '@/services/WatchLaterService'
export default {
  data: () => ({
    userName: localStorage.getItem('username'),
    loading: false,
    loaded: false,
    errored: false,
    snackbar: false,
    timeout: 4000,
    deleteMessage: '',
    watchLaterVideos: [],
    page: 1,
    infiniteId: +new Date(),
    clearLoading: false
  }),
  computed: {
    ...mapGetters(['getCurrentUser', 'getUrl', 'isLoggedIn'])
  },
  methods: {
    async getWatchLaterVideos($state) {
      this.errored = false
      if (!this.loaded) {
        this.loading = true
      }

      const params = {
        page: this.page,
        user_id: this.getCurrentUser.id
      }

      const watchLaterVideos = await WatchLaterService.getAll(params)
        .catch((err) => {
          this.errored = true
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      if (!watchLaterVideos) return
      if (watchLaterVideos.data.length) {
        this.page += 1

        this.watchLaterVideos.push(...watchLaterVideos.data)
        if ($state) {
          $state.loaded()
        }

        this.loaded = true
      } else {
        if ($state) {
          $state.complete()
        }
      }
    },
    async deleteWatchLaterVideo(id) {
      await WatchLaterService.removeWatchLater(id)
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.watchLaterVideos = this.watchLaterVideos.filter(
            (watchLaterVideo) => watchLaterVideo.id.toString() !== id.toString()
          )
          this.deleteMessage = 'Watch Later Video Deleted Successfully'
          this.snackbar = true
        })
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    },
    handleWatchLater() {
      if (!this.watchLaterVideos.length) return
      this.$router.push({
        name: 'WatchVideo',
        params: {
          id: this.watchLaterVideos[0].video.id,
          isWatchLaterList: true
        }
      })
    },
    playVideo(id) {
      this.$router.push({
        name: 'WatchVideo',
        params: {
          id,
          isWatchLaterList: true
        }
      })
    },
    moveToBottom(id) {
      const index = this.watchLaterVideos.findIndex(
        (watchLaterVideo) => watchLaterVideo.id.toString() === id.toString()
      )
      const watchLaterVideo = this.watchLaterVideos[index]
      this.watchLaterVideos.splice(index, 1)
      this.watchLaterVideos.push(watchLaterVideo)
    },
    moveToTop(id) {
      const index = this.watchLaterVideos.findIndex(
        (watchLaterVideo) => watchLaterVideo.id.toString() === id.toString()
      )
      const watchLaterVideo = this.watchLaterVideos[index]
      this.watchLaterVideos.splice(index, 1)
      this.watchLaterVideos.unshift(watchLaterVideo)
    },
  },
  components: {
    InfiniteLoading,
    NavBar
  },
  mounted() {
    this.getWatchLaterVideos()
  },
  name: 'WatchLaterVideo'
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
  justify-content: flex-start;
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
.center {
  margin: auto;
  width: 50%;
  padding: 10px;
  text-align: center;
  .icon {
    font-size: 100px;
    color: black;
  }
}
</style>
