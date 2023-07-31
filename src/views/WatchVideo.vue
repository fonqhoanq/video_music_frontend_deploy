<template>
    <div id="watch" ref="watch">
      <nav-bar/>
      <v-container fluid>
        <v-row>
          <v-alert prominent class="mx-auto" type="error" v-if="errored">
            <v-row align="center">
              <v-col class="grow">
                <div class="title">Error!</div>
                <div>
                  Something went wrong, but don’t fret — let’s give it another
                  shot.
                </div>
              </v-col>
              <v-col class="shrink">
                <v-btn @click="actions">Take action</v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <v-col v-else cols="11" class="mx-auto">
            <v-row>
              <v-col cols="12" sm="12" md="9" lg="9">
                <v-skeleton-loader
                  type="card-avatar, article, actions"
                  :loading="videoLoading"
                  tile
                  large
                >
                  <div ref="hello">
                    <v-responsive max-height="650">
                      <video
                        id="videoPlayer"
                        ref="videoPlayer"
                        controls
                        @ended="onVideoEnded"
                        autoplay
                        style="height: 100%; width: 100%"
                        :src="`${getUrl}${video.url}`"
                        type="video/mp4"
                        >
                      </video>
                    </v-responsive>
  
                    <v-card flat tile class="card">
                      <v-card-title class="pl-0 pb-0">{{
                        video.title
                      }}</v-card-title>
                      <div
                        class="d-flex flex-wrap justify-space-between"
                        id="btns"
                      >
                        <v-card-subtitle
                          class="pl-0 pt-0 pb-0 subtitle-1"
                          style="line-height: 2.4em;"
                        >
                          {{ video.views }} views<v-icon>mdi-circle-small</v-icon
                          >{{ dateFormatter(video.createdAt) }}
                        </v-card-subtitle>
                        <v-card-actions class="pt-0 pl-0">
                          <v-btn text @click="createFeeling('like')"
                            ><v-icon
                              :class="
                                `pr-2${
                                  feeling !== 'like'
                                    ? ' grey--text text--darken-1'
                                    : ''
                                }`
                              "
                              >mdi-thumb-up</v-icon
                            >{{ video.likes }}</v-btn
                          >
  
                          <v-btn text @click="createFeeling('dislike')"
                            ><v-icon
                              :class="
                                `pr-2${
                                  feeling !== 'dislike'
                                    ? ' grey--text text--darken-1'
                                    : ''
                                }`
                              "
                              >mdi-thumb-down</v-icon
                            >
                            {{ video.dislikes }}</v-btn
                          >
                          <v-btn
                            v-if="!isWatchLater"
                            @click="switchToWatchLater"
                            text
                            class="grey--text text--darken-1"
                          ><v-icon>mdi-playlist-plus</v-icon> Watch later</v-btn
                          >
                          <v-btn
                            v-else
                            @click="switchToWatchLater"
                            text
                            class="grey--text text--darken-1"
                          ><v-icon>mdi-playlist-remove</v-icon> Remove from watch later</v-btn
                          >
                          <v-btn
                            :href="`${video.url}`"
                            text
                            class="grey--text text--darken-1"
                            ><v-icon>mdi-download</v-icon> Download</v-btn
                          >
                          <!-- <v-btn text class="grey--text text--darken-1"
                            ><v-icon>mdi-share</v-icon> Share</v-btn
                          >
                          <v-btn text class="grey--text text--darken-1"
                            ><v-icon>mdi-playlist-plus</v-icon> Save</v-btn
                          > -->
                        </v-card-actions>
                      </div>
                    </v-card>
  
                    <v-row class="justify-space-between">
                      <v-col cols="12" sm="6" md="5" lg="5">
                        <v-card class="transparent" flat>
                          <v-list-item three-line>
                            <v-list-item-avatar
                              v-if="typeof video.singer.id !== 'undefined'"
                              size="50"
                            >
                              <img
                                v-if="video.singer.avatarUrl !== 'no-photo.jpg'"
                                :src="`${getUrl}${video.singer.avatarUrl}`"
                                :alt="`${video.singer.channelName} avatar`"
                              />
                              <v-avatar v-else color="red">
                                <span class="white--text headline ">
                                  {{
                                    video.singer.channelName
                                      .split('')[0]
                                      .toUpperCase()
                                  }}</span
                                >
                              </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content
                              v-if="video.singer"
                              class="align-self-auto"
                            >
                              <v-list-item-title
                                class="font-weight-medium mb-1"
                                >{{ video.singer.channelName }}</v-list-item-title
                              >
                              <v-list-item-subtitle
                                >{{ video.singer.subscribers }} subscribers
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="4" lg="4">
                        <div
                          class="d-flex justify-end align-center"
                          v-if="video.singer"
                        >
  
                          <v-btn
                            :class="[
                              { 'red white--text': !subscribed },
                              {
                                'grey grey--text lighten-3 text--darken-3': subscribed
                              },
                              'mt-6'
                            ]"
                            tile
                            large
                            depressed
                            :loading="subscribeLoading"
                            @click="subscribe"
                          >{{ !subscribed ? 'subscribe' : 'subscribed' }}
                          </v-btn>
  
                          <!-- <v-btn
                            v-if="
                              video.singer && video.singer.id !== getCurrentUser.id
                            "
                            :class="[
                              { 'red white--text': !subscribed },
                              {
                                'grey grey--text lighten-3 text--darken-3': subscribed
                              },
                              'mt-6'
                            ]"
                            tile
                            large
                            depressed
                            :loading="subscribeLoading"
                            @click="subscribe"
                            >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
                          > -->
                          <!-- <v-btn icon class="ml-5 mt-6"
                            ><v-icon>mdi-bell</v-icon></v-btn
                          > -->
                        </div>
                      </v-col>
                      <v-col class="pl-11" offset="1" cols="11" md="11">
                        <p>
                          {{
                            truncate
                              ? truncateText(video.description, 150)
                              : video.description
                          }}
                        </p>
                        <v-btn text @click="show" class="remove-hover-bg"
                          >Show More</v-btn
                        >
                      </v-col>
                    </v-row>
                  </div>
                </v-skeleton-loader>
  
                <v-row>
                  <v-col v-if="video && video.public">
                    <p class="mb-0">{{ video.comments }} Comments</p>
  
                    <AddComment
                      @videoCommentLength="video.comments++"
                      :videoId="video.id"
                    />
                    <CommentList
                      @videoCommentLength="video.comments--"
                      :videoId="video.id"
                    />
                  </v-col>
                </v-row>
              </v-col>
  
              <v-col cols="12" sm="12" md="3" lg="3">
                <template v-if="ownPlaylist.own_playlist_videos">
                  <v-card>
                    <v-list-item>
                      <v-list-item-title
                      class="mt-2 ml-2"
                    >
                      {{ ownPlaylist.title }}
                    </v-list-item-title>
                    </v-list-item>
                    <v-list
                      style="max-height: 500px"
                      class="overflow-y-auto"
                    >
                    <div
                    v-for="(ownPlaylist, i) in ownPlaylist.own_playlist_videos"
                    :key="i"
                    >
                      <v-list-item
                        :class="[
                          {'playing': ownPlaylist.video.id === video.id}
                          ]"
                        @click="handleOwnPlaylist(ownPlaylist.video.id)"
                      >
                        <v-list-item-content class="mr-2">
                          <div class="d-flex">
                            <v-img
                              height="60"
                              width="100"
                              class="img_url"
                              :src="`${getUrl}${ownPlaylist.video.thumbnails}`"
                            >
                            </v-img>
                            <div class="content">
                              <v-list-item-title class="title">{{
                                ownPlaylist.video.title
                              }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ ownPlaylist.video.singer.channelName }}
                              </v-list-item-subtitle>
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
        
                    </v-list>
                  </v-card>
                </template>
                <template v-if="watchLaterVideos.length > 0">
                  <v-card>
                    <v-list-item>
                        <v-icon>mdi-clock</v-icon>
                      <v-list-item-title
                        class="mt-2 ml-2"
                      >
                        Watch Later
                      </v-list-item-title>
                    </v-list-item>
                    <v-list
                      style="max-height: 500px"
                      class="overflow-y-auto"
                    >
                    <div
                    v-for="(watchLaterVideo, i) in watchLaterVideos"
                    :key="i"
                    >
                      <v-list-item
                        :class="[
                          {'playing': watchLaterVideo.video.id === video.id}
                          ]"
                        @click="handleWatchLater(watchLaterVideo.video.id)"
                      >
                        <v-list-item-content class="mr-2">
                          <div class="d-flex">
                            <v-img
                              height="60"
                              width="100"
                              class="img_url"
                              :src="`${getUrl}${watchLaterVideo.video.thumbnails}`"
                            >
                            </v-img>
                            <div class="content">
                              <v-list-item-title class="title">{{
                                watchLaterVideo.video.title
                              }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ watchLaterVideo.video.singer.channelName }}
                              </v-list-item-subtitle>
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
        
                    </v-list>
                  </v-card>
                </template>
                <template v-if="playlist.playlist_videos">
                  <v-card>
                    <v-list-item>
                      <v-list-item-title
                      class="mt-2 ml-2"
                    >
                      {{ playlist.title }}
                    </v-list-item-title>
                    </v-list-item>
                    <v-list
                      style="max-height: 500px"
                      class="overflow-y-auto"
                    >
                    <div
                    v-for="(playlist, i) in playlist.playlist_videos"
                    :key="i"
                    >
                      <v-list-item
                        :class="[
                          {'playing': playlist.video.id === video.id}
                          ]"
                        @click="handlePlayList(playlist.video.id)"
                      >
                        <v-list-item-content class="mr-2">
                          <div class="d-flex">
                            <v-img
                              height="60"
                              width="100"
                              class="img_url"
                              :src="`${getUrl}${playlist.video.thumbnails}`"
                            >
                            </v-img>
                            <div class="content">
                              <v-list-item-title class="title">{{
                                playlist.video.title
                              }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ playlist.video.singer.channelName }}
                              </v-list-item-subtitle>
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
        
                    </v-list>
                  </v-card>
                </template>
                <template v-if="topicPlaylist.playlist_videos">
                  <v-card>
                    <v-list-item>
                      <v-list-item-title
                      class="mt-2 ml-2"
                    >
                      {{ topicPlaylist.title }}
                    </v-list-item-title>
                    </v-list-item>
                    <v-list
                      style="max-height: 500px"
                      class="overflow-y-auto"
                    >
                    <div
                    v-for="(playlist, i) in topicPlaylist.playlist_videos"
                    :key="i"
                    >
                      <v-list-item
                        :class="[
                          {'playing': playlist.video.id === video.id}
                          ]"
                        @click="handleTopicPlaylist(playlist.video.id)"
                      >
                        <v-list-item-content class="mr-2">
                          <div class="d-flex">
                            <v-img
                              height="60"
                              width="100"
                              class="img_url"
                              :src="`${getUrl}${playlist.video.thumbnails}`"
                            >
                            </v-img>
                            <div class="content">
                              <v-list-item-title class="title">{{
                                playlist.video.title
                              }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ playlist.video.singer.channelName }}
                              </v-list-item-subtitle>
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
        
                    </v-list>
                  </v-card>
                </template>
                <hr class="grey--text" />
                <h4 class="mb-3 mt-3">Up next</h4>
                <v-tabs
                  class="mb-3 mt-3"
                  v-model="tab"
                  background-color="transparent"
                  show-arrows
                  centered
                  center-active
                >
                  <v-tab v-for="(item, i) in items" :key="i">
                    {{ item }}
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" class="transparent">
                  <v-tab-item>
                     <v-slide-item
                      v-for="(video, i) in loading ? 12 : videos"
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
                        <recommend-video-card
                          :video="video"
                        ></recommend-video-card>
                      </v-skeleton-loader>
                    </v-slide-item>
                    <infinite-loading :identifier="infiniteId" @infinite="getVideos">
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
                  </v-tab-item>
                  <v-tab-item>
                    <v-slide-item
                      v-for="(video, i) in loading ? 12 : singerVideos"
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
                        <recommend-video-card
                          :video="video"
                        ></recommend-video-card>
                      </v-skeleton-loader>
                    </v-slide-item>
                    <infinite-loading :identifier="infiniteId" @infinite="getSingerVideos">
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
                  </v-tab-item>
                  <v-tab-item>
                    <template
                      v-if="isLoggedIn"
                    >
                      <v-slide-item
                        v-for="(video, i) in loading ? 12 : watchedVideos"
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
                          <recommend-video-card
                            :video="video"
                          ></recommend-video-card>
                        </v-skeleton-loader>
                      </v-slide-item>
                      <infinite-loading :identifier="infiniteId" @infinite="getWatchedVideos">
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
                    </template>
                    <template
                      v-else
                    >
                      <v-card class="pt-8">
                        <v-card-text>
                          <h2 class="mb-3">Want to watch watched video?</h2>
                          <p>Sign in to watch these videos.</p>
                        </v-card-text>
                  
                        <v-divider></v-divider>
                  
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" to="/signin">
                            Sign in
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-tab-item>
                </v-tabs-items>
                
                <!-- <v-col cols="12" sm="12" md="12" lg="12"> -->
               
                <!-- </v-col> -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <signin-modal
        :openModal="signinDialog"
        :details="details"
        @closeModal="signinDialog = false"
      />
      <v-snackbar  :timeout="timeout" v-model="snackbar">
        {{ message }}
      </v-snackbar>
    </div>
  </template>
  
  <script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import InfiniteLoading from 'vue-infinite-loading'

  import VideoService from '@/services/VideoService'
  import SubscriptionService from '@/services/SubscriptionService'
  import FeelingService from '@/services/FeelingService'
  // import HistoryService from '@/services/HistoryService'
  import OwnPlaylistService from '@/services/OwnPlaylistService'
  import SigninModal from '@/components/SigninModal'
  import AddComment from '@/components/comments/AddComment'
  import CommentList from '@/components/comments/CommentList'
  import NavBar from '@/components/NavBar'
  import RecommendVideoCard from '@/components/RecommendVideoCard'
  import PlaylistService from '@/services/PlaylistService'
  import WatchLaterService from '@/services/WatchLaterService'
  export default {
    data: () => ({
      message: '',
      snackbar: false,
      timeout: 4000,
      loading: false,
      loaded: false,
      errored: false,
      videoLoading: true,
      subscribed: false,
      isWatchLater: false,
      watchLaterId: '',
      subscribeLoading: false,
      showSubBtn: true,
      feeling: '',
      video: {},
      videoId: '',
      videos: [],
      singerVideos: [],
      watchedVideos: [],
      watchLaterVideos: [],
      topicPlaylist: [],
      ownPlaylist: [],
      playlist: {},
      page: 1,
      singerPage: 1,
      watchedPage: 1,
      infiniteId: +new Date(),
      truncate: true,
      signinDialog: false,
      details: {},
      url: process.env.VUE_APP_URL,
      avatarURL: "https://www.hollywoodreporter.com/wp-content/uploads/2022/12/GettyImages-1448719385.jpg?w=1296",
      items: ['All', 'Video of singer','Watched Videos', 'Related Videos',  'Recently Uploaded Videos'],
      tab: null
    }),
    computed: {
      ...mapGetters(['getCurrentUser', 'getUrl', 'isLoggedIn'])
    },
    methods: {
      async getVideo(id) {
        this.errored = false
        this.videoLoading = true
        this.video = {}
        try {
          const video = await VideoService.getById(id)
  
          if (!video) return this.$router.push('/')
          this.video = video.data
        } catch (err) {
          this.errored = true
          console.log(err)
        } finally {
          this.videoLoading = false
          this.checkSubscription(this.video.singer.id)
          this.checkFeeling(this.video.id)
          this.checkWatchLater(this.video.id)
        }
        // if (this.getCurrentUser && this.getCurrentUser.id === this.video.singer.id) {
        //   this.showSubBtn = false
        // } else {
        //   this.showSubBtn = true
        // }
  
        if (!this.isLoggedIn) return
  
        // if (
        //   this.video.singer.id.toString() !== this.getCurrentUser.id.toString() &&
        //   this.video.status !== 'public'
        // )
        //   return this.$router.push('/')
  
        // const data = {
        //   history_type: 'watch',
        //   video_id: this.video.id,
        //   user_id: this.getCurrentUser.id
        // }
  
        // await HistoryService.createHistory(data).catch((err) => console.log(err))
      },
      async getVideos($state) {
        this.errored = false
        if (!this.loaded) {
          this.loading = true
        }
        var videos = []
        if (this.isLoggedIn) {
          videos = await VideoService.getVideosAfterWatchingCurrentVideo({
          page: this.page,
          id: this.video.id,
          user_id: this.getCurrentUser.id,
          singer_id: this.video.singer.id
         })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => (this.loading = false))
        } else {
          videos = await VideoService.getAll('public', {
            page: this.page
          })
            .catch((err) => {
              console.log(err)
              this.errored = true
            })
            .finally(() => (this.loading = false))
        }
        if (typeof videos === 'undefined') return
        if (videos.data.length) {
          this.page += 1
  
          this.videos.push(...videos.data)
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
      async getSingerVideos($state) {
        // this.getChannel()
        this.loading = true
  
        const videos = await VideoService.getBySingerId('public', {
          singer_id: this.video.singer.id,
          page: this.singerPage
        })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => (this.loading = false))
  
        if (typeof videos === 'undefined') return
  
        if (videos.data.length) {
          this.singerPage += 1
  
          this.singerVideos.push(...videos.data)
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
      async getWatchedVideos($state) {
        this.loading = true
  
        const videos = await VideoService.getWatchedVideos({
          user_id: this.getCurrentUser.id,
          page: this.watchedPage
        })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => (this.loading = false))
      
        if (typeof videos === 'undefined') return
        const cleanVideos = videos.data.filter(
          (obj, index) => 
          videos.data.findIndex((item) => item.id === obj.id) === index
        )
        // this.singerVideos = videos.data
        if (videos.data.length) {
          this.watchedPage += 1
      
          this.watchedVideos.push(...cleanVideos)
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
      async getPlaylistVideos(id) {
        this.loading = true
        const playlist = await PlaylistService.getPlaylistVideosById(id)
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
        if (!playlist) return
        this.playlist = playlist.data
      },
      async checkSubscription(id) {
        if (!this.isLoggedIn) return
  
        this.loading = true
        const sub = await SubscriptionService.checkSubscription({ 
          user_id: this.getCurrentUser.id,
          singer_id: id
         })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        if (!sub) return
  
        if (sub.data.status === 'unsubscribe') this.subscribed = false
        else this.subscribed = true
      },
      async checkFeeling(id) {
        if (!this.isLoggedIn) return
  
        this.loading = true
        const feeling = await FeelingService.checkFeeling({ 
          video_id: id,
          user_id: this.getCurrentUser.id 
         })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        if (!feeling || !feeling.data) return
        if (feeling.data.status === 'like') this.feeling = 'like'
        else if (feeling.data.status === 'dislike') this.feeling = 'dislike'
      },
      async createFeeling(type) {
        if (!this.isLoggedIn) {
          this.signinDialog = true
          this.details = {
            title:
              type === 'like' ? 'Like this video?' : "Don't like this video?",
            text: 'Sign in to make your opinion count.'
          }
          return
        }
        switch (true) {
          case type === 'like' && this.feeling === '':
            this.feeling = 'like'
            this.video.likes++
            break
          case type === 'like' && this.feeling === type:
            this.feeling = ''
            this.video.likes--
            break
          case type === 'like' && this.feeling === 'dislike':
            this.feeling = 'like'
            this.video.dislikes--
            this.video.likes++
            break
          case type === 'dislike' && this.feeling === '':
            this.feeling = 'dislike'
            this.video.dislikes++
            break
          case type === 'dislike' && this.feeling === type:
            this.feeling = ''
            this.video.dislikes--
            break
          case type === 'dislike' && this.feeling === 'like':
            this.feeling = 'dislike'
            this.video.likes--
            this.video.dislikes++
        }
  
        const feeling = await FeelingService.createFeeling({
          video_id: this.video.id,
          status: type,
          user_id: this.getCurrentUser.id
        }).catch((err) => {
          console.log(err)
        })
  
        if (!feeling) return
      },
      async checkWatchLater(id) {
        if (!this.isLoggedIn) return
  
        this.loading = true
        const watchLater = await WatchLaterService.checkWatchLater({ 
          video_id: id,
          user_id: this.getCurrentUser.id 
         })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        if (!watchLater || !watchLater.data ) return
        watchLater.data.length == 0 ? this.isWatchLater = false : this.isWatchLater = true
        if (this.isWatchLater) {
          this.watchLaterId = watchLater.data[0].id
        }
      },
      async switchToWatchLater() {
        if (!this.isLoggedIn) {
          this.signinDialog = true
          this.details = {
            title: 'Want to subscribe to this channel?',
            text: 'Sign in to subscribe to this channel.'
          }
          return
        }
        this.isWatchLater = !this.isWatchLater
        const watchLaterType = this.isWatchLater === true ? 'add' : 'remove'
        if (watchLaterType === 'add') {
          await WatchLaterService.createWatchLater({
            video_id: this.video.id,
            user_id: this.getCurrentUser.id
          }).catch((err) => {
            console.log(err)
          }).finally(() => {
            this.snackbar = true
            this.message = 'Added to watch later!'
            this.checkWatchLater(this.video.id)
          })
        } else {
          await WatchLaterService.removeWatchLater(this.watchLaterId).catch((err) => {
            console.log(err)
          }).finally(() => {
            this.snackbar = true
            this.message = 'Removed from watch later!'
          })
        }

        // if (!watchLater) return

      },
      async getWatchLaterVideos() {
        this.loading = true
        const videos = await WatchLaterService.getAll({
          user_id: this.getCurrentUser.id
        })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
        if (!videos) return
        this.watchLaterVideos = videos.data
        // this.singerVideos = videos.data
      },
      async getTopicPlaylist(id) {
        this.loading = true
        const topicPlaylist = await PlaylistService.getTopicPlaylistVideosById(id)
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
        if (!topicPlaylist) return
        this.topicPlaylist = topicPlaylist.data
      },
      async getOwnPlaylist(id) {
        this.loading = true
        const ownPlaylist = await OwnPlaylistService.getPlaylistVideoById(id)
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
        if (!ownPlaylist) return
        this.ownPlaylist = ownPlaylist.data
      },
      async subscribe() {
        if (!this.isLoggedIn) {
          this.signinDialog = true
          this.details = {
            title: 'Want to subscribe to this channel?',
            text: 'Sign in to subscribe to this channel.'
          }
          return
        }
        this.subscribeLoading = true
        this.subscribed = !this.subscribed
        const subType = this.subscribed === true ? 'subscribe' : 'unsubscribe'
        const sub = await SubscriptionService.createSubscription({
          singer_id: this.video.singer.id,
          user_id: this.getCurrentUser.id,
          status: subType
        })
          .catch((err) => console.log(err))
          .finally(() => {
            this.subscribeLoading = false
            this.message = subType === 'subscribe' ? 'Subscribe successfully!' : 'Ubsubscribe successfully!'
            this.snackbar = true
          })
  
        if (!sub) return
        if (sub.data.status === 'unsubscribe') {
          this.subscribed = false
          this.video.singer.subscribers--
        } else {
          this.subscribed = true
          this.video.singer.subscribers++
        }
      },
      async updateViews(id, duration, currentTime) {
        await VideoService.updateViews(id, {
          duration: duration,
          current_time: currentTime,
          user_id: this.getCurrentUser.id
        }).catch((err) => {
          console.log(err)
        })
  
        this.video.views++
      },
      play(e) {
        console.log(e)
      },
      actions() {
        this.getVideo()
      },
      nextVideo(videos) {
        var nextVideoId = ''
        videos.forEach((video, key) => {
          if (videos[key].video.id == this.video.id) {
            nextVideoId = videos[key + 1].video.id
          }
        })
        return nextVideoId
      },
      onVideoEnded() {
        if (this.$route.params.isWatchLaterList) {
          const id = this.nextVideo(this.watchLaterVideos)
          if (id) this.handleWatchLater(id)
        } else if (this.$route.params.isWatchOwnPlayList) {
          const id = this.nextVideo(this.ownPlaylist.own_playlist_videos)
          this.handleOwnPlaylist(id)
        } else if (this.$route.params.playlist_id) {
          const id = this.nextVideo(this.playlist.playlist_videos)
          this.handlePlayList(id)
        } else if(this.$route.params.is_topic_playlist) {
          const id = this.nextVideo(this.topicPlaylist.playlist_videos)
          this.handleTopicPlaylist(id)
        } else {
          this.$router.push({
            name: 'WatchVideo',
            params: {
              id: this.videos[0].id
            }
          })
        }
      },
      show(event) {
        if (event.target.innerText === 'SHOW MORE') {
          this.truncate = false
          event.target.innerText = 'SHOW LESS'
        } else {
          this.truncate = true
          event.target.innerText = 'SHOW MORE'
        }
      },
      truncateText(string = '', num) {
        if (string.length <= num) {
          return string
        }
        return string.slice(0, num)
      },
      dateFormatter(date) {
        return moment(date).fromNow()
      },
      handlePlayList(id) {
        this.$router.push({
          name: 'WatchVideo',
          params: {
            id: id,
            playlist_id: this.playlist.id
          }
        })
      },
      handleTopicPlaylist(id) {
        this.$router.push({
          name: 'WatchVideo',
          params: {
            id: id,
            topic_playlist_id: this.topicPlaylist.id, 
            is_topic_playlist: true
          }
        })
      },
      handleWatchLater(id) {
        this.$router.push({
          name: 'WatchVideo',
          params: {
            id: id,
            isWatchLaterList: true
          }
        })
      },
      handleOwnPlaylist(id) {
        this.$router.push({
          name: 'WatchVideo',
          params: {
            id: id,
            isWatchOwnPlayList: true,
            own_playlist_id: this.ownPlaylist.id
          }
        })
      },
    },
    components: {
      NavBar,
      AddComment,
      CommentList,
      SigninModal,
      InfiniteLoading,
      RecommendVideoCard
    },
    mounted() {
      this.getVideo(this.$route.params.id)
      if (this.isLoggedIn) {
        if (this.$route.params.playlist_id) {
          this.getPlaylistVideos(this.$route.params.playlist_id)
        }
        if (this.$route.params.isWatchLaterList) {
          this.getWatchLaterVideos()
        }
        if (this.$route.params.isWatchOwnPlayList) {
          this.getOwnPlaylist(this.$route.params.own_playlist_id)
        }
        if (this.$route.params.is_topic_playlist) {
          this.getTopicPlaylist(this.$route.params.topic_playlist_id)
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.page = 1
      ;(this.loading = false), (this.feeling = ''), (this.loaded = false), (this.subscribed = false), (this.videos = []), (this.video = {}), (this.playlist = {}), (this.topicPlaylist = []), (this.watchLaterVideos = []), (this.ownPlaylist = [])
      this.infiniteId += 1
      this.getVideo(to.params.id)
      let video = document.getElementById('videoPlayer')
      if (this.isLoggedIn) {
        this.updateViews(this.$route.params.id, video.duration, video.currentTime)
      }
      if (to.params.playlist_id) {
        this.getPlaylistVideos(to.params.playlist_id)
      }

      if (to.params.isWatchLaterList) {
        this.getWatchLaterVideos()
      }
      if (to.params.isWatchOwnPlayList) {
        this.getOwnPlaylist(to.params.own_playlist_id)
      }
      if (to.params.is_topic_playlist) {
        this.getTopicPlaylist(to.params.topic_playlist_id)
      }
      window.scroll(0, 0)
      next()
    },
    name: 'WatchVideo'
  }
  </script>
  
  <style lang="scss">
  video {
    max-width: 100%;
  }
  
  .grey-color {
    color: #7f7f7f !important;
  }
  
  #btns {
    border-bottom: 1px solid #e0d8d8;
  }
  #subscribeBtn {
    border-radius: 5px;
  }
  button.v-btn.remove-hover-bg {
    background-color: initial !important;
    &:hover {
      background-color: #f9f9f9;
    }
  }
  .cardVideo {
    border-radius: 5px;
  }
  .content {
    width: 250px;
    .title {
      white-space: normal;
      font-size: 0.9rem !important;
      font-weight: 400;
    }
  }
  .img_url {
    border: 1px;
    border-radius: 5px !important;
    margin-right: 4px;
  }
  .playing {
    background-color: #eeeeee;
  }
  </style>
  