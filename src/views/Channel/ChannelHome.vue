<template>
    <div id="channel-home">
      <nav-bar/>
      <v-parallax
        height="230"
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
      ></v-parallax>
      <div class="nav-bgcolor">
        <div id="channel-header">
          <v-container class="py-0">
            <v-row class="justify-space-between">
              <v-col cols="12" sm="5" md="5" lg="5" offset-md="1">
                <v-skeleton-loader
                  type="list-item-avatar-two-line"
                  :loading="loading"
                  class="mr-1"
                >
                  <v-card class="transparent" flat>
                    <v-list-item three-line>
                      <v-list-item-avatar size="80">
                        <v-img
                          v-if="channel.avatarUrl !== 'no-photo.jpg'"
                          :src="`${getUrl}${channel.avatarUrl}`"
                        ></v-img>
  
                        <v-avatar v-else color="red" size="60">
                          <span class="white--text headline ">
                            {{
                              channel.channelName.split('')[0].toUpperCase()
                            }}</span
                          >
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content class="align-self-auto">
                        <v-list-item-title class="headline mb-1">{{
                          channel.channelName
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ channel.subscribers }} subscribers
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-skeleton-loader>
              </v-col>
              <v-col cols="12" sm="5" md="3" lg="3" v-if="!loading">
                <v-btn
                  v-if="getCurrentUser && channel.id !== getCurrentUser.id"
                  :class="[
                    { 'red white--text': !subscribed },
                    { 'grey grey--text lighten-3 text--darken-3': subscribed },
                    'mt-6'
                  ]"
                  tile
                  large
                  depressed
                  :loading="subscribeLoading"
                  @click="subscribe"
                  >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
                >
                <!-- <template v-else-if="!getCurrentUser" -->
                <v-btn
                  v-else-if="showSubBtn"
                  :class="[
                    { 'red white--text': !subscribed },
                    { 'grey grey--text lighten-3 text--darken-3': subscribed },
                    'mt-6'
                  ]"
                  tile
                  large
                  depressed
                  :loading="subscribeLoading"
                  @click="subscribe"
                  >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
                >
                <!-- <v-btn icon class="ml-5 mt-6"><v-icon>mdi-bell</v-icon></v-btn> -->
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-card flat class="transparent">
          <v-tabs
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
  
          <v-container fluid>
            <v-tabs-items v-model="tab" class="transparent">
              <v-tab-item>
                <v-card class="transparent" flat>
                  <v-card-title>Uploads</v-card-title>
                  <!-- <v-sheet class="mx-auto"> -->
                  <v-slide-group class="pa-4" multiple show-arrows>
                    <v-slide-item
                      v-for="(video, i) in loading ? 5 : videos"
                      :key="i"
                    >
                      <v-skeleton-loader
                        type="card-avatar"
                        :loading="loading"
                        width="250px"
                        class="mr-1"
                      >
                        <video-card
                          :card="{ maxWidth: 250, type: 'noAvatar' }"
                          :video="video"
                          :channel="video.singer"
                        ></video-card>
                      </v-skeleton-loader>
                    </v-slide-item>
                  </v-slide-group>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card class="transparent" flat>
                  <v-card-title>Uploads</v-card-title>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                      v-for="(video, i) in loading ? 10 : videos"
                      :key="i"
                      class="mx-xs-auto"
                    >
                      <v-skeleton-loader type="card-avatar" :loading="loading">
                        <video-card
                          :card="{ maxWidth: 350 }"
                          :video="video"
                          :channel="video.singer"
                        ></video-card>
                      </v-skeleton-loader>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card class="transparent" flat>
                  <v-card-title>Uploads</v-card-title>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                      v-for="(video, i) in loading ? 10 : videos"
                      :key="i"
                      class="mx-xs-auto"
                    >
                      <v-skeleton-loader type="card-avatar" :loading="loading">
                        <video-card
                          :card="{ maxWidth: 350 }"
                          :video="video"
                          :channel="video.singer"
                        ></video-card>
                      </v-skeleton-loader>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-card>
      </div>
      <signin-modal
        :openModal="signinDialog"
        :details="details"
        @closeModal="signinDialog = false"
      />
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  
  import SingerService from '@/services/SingerService'
  import VideoService from '@/services/VideoService'
  import SubscriptionService from '@/services/SubscriptionService'
  
  import VideoCard from '@/components/VideoCard'
  import SigninModal from '@/components/SigninModal'
  import NavBar from '@/components/NavBar'

  export default {
    data: () => ({
      tab: null,
      loading: false,
      errored: false,
      subscribed: false,
      subscribeLoading: false,
      showSubBtn: true,
      url: process.env.VUE_APP_URL,
      items: ['Home', 'Videos', 'Playlists', 'Community', 'Channels', 'about'],
      videos: {},
      channel: {},
      signinDialog: false,
      details: {}
    }),
    computed: {
      ...mapGetters(['isLoggedIn', 'getCurrentUser', 'getUrl'])
    },
    components: {
      VideoCard,
      SigninModal,
      NavBar
    },
    methods: {
      async getChannel(id) {
        // console.log(this.$route.params.id)
        this.loading = true
        this.errored = false
        const channel = await SingerService.getSingerById(id)
          .catch((err) => {
            this.errored = true
            console.log(err)
            this.$router.push('/')
          })
          .finally(() => (this.loading = false))
  
        if (!channel) return
        this.channel = channel.data
        // console.log(channel)
        // if (this.getCurrentUser && this.getCurrentUser.id === this.channel.id) {
        //   this.showSubBtn = false
        // } else {
        //   this.showSubBtn = true
        // }
        this.showSubBtn = true
        this.getVideos()
  
        this.checkSubscription(this.channel.id)
        // console.log(channel)
      },
      async getVideos() {
        // this.getChannel()
        this.loading = true
  
        const videos = await VideoService.getBySingerId('public', {
          singer_id: this.channel.id
        })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => (this.loading = false))
  
        if (typeof videos === 'undefined') return
  
        this.videos = videos.data
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
        // console.log(sub.data)
        if (!sub) return
  
        if (sub.data.status === 'unsubscribe') this.subscribed = false
        else this.subscribed = true
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
          singer_id: this.channel.id,
          user_id: this.getCurrentUser.id,
          status: subType
        })
          .catch((err) => console.log(err))
          .finally(() => {
            this.subscribeLoading = false
          })
  
        if (!sub) return
        if (sub.data.status === 'unsubscribe') {
          this.subscribed = false
          this.channel.subscribers--
        } else {
          this.subscribed = true
          this.channel.subscribers++
        }
  
        // console.log(this.subscribed)
      },
    },
    mounted() {
      this.getChannel(this.$route.params.id)
    },
    beforeRouteUpdate(to, from, next) {
      this.getChannel(to.params.id)
      next()
    }
  }
  </script>
  
  <style>
  .nav-bgcolor {
    background: #f9f9f9;
  }
  
  .card {
    background: #f9f9f9 !important;
  }
  
  .v-tab {
    margin-right: 4em;
  }
  
  #channel-home .v-list-item--link:before {
    background-color: transparent;
  }
  </style>
  