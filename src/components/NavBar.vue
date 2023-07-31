<template>
    <nav id="navbar">
      <v-app-bar class="white" flat app clipped-left>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="font-weight-bold"
          ><router-link to="/" class="black--text" style="text-decoration: none"
            >VuraTube</router-link
          ></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <div class="d-flex searchBox" >
          <v-menu
              offset-y
              :close-on-content-click="false"
              transition="scale-transition"
            >
            <template v-slot:activator="{ on: menu }">
              <v-text-field
                flat
                hide-details
                append-icon="mdi-magnify"
                placeholder="Search"
                outlined
                dense
                v-model="searchText"
                @click:append="search"
                v-on="{ ...menu }"
              ></v-text-field>
            </template>
            <v-card class="searchCard">
              <v-list>
                <v-list-item 
                  v-for="(item, i) in historyList" 
                  :key='i' 
                  class="searchHistory"
                >
                  <v-list-item-icon @click="searchBy(item.text)">
                    <v-icon>mdi-history</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content @click="searchBy(item.text)">
                    {{ item.text }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn class="btnRemove" @click="removeSearchHistory(item.id)">
                      Remove
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon class="speechButton" v-on="{ ...tooltip}" @click.prevent="startConversion">
                <v-icon size="25" v-if="!recording">mdi-microphone</v-icon>
                <v-icon size="25" v-if="recording">mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <span>Search by voice</span>
          </v-tooltip>
        </div>
        <v-spacer></v-spacer>
       
        <v-menu offsetY>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon class="mr-7" v-on="{ ...tooltip, ...menu }"
                  ><v-icon size="25">mdi-video-plus</v-icon></v-btn>
              </template>
              <span>Create a video and more</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item router to="/studio">
              <v-list-item-icon class="mr-3"
                ><v-icon>mdi-play-box-outline</v-icon></v-list-item-icon
              >
              <v-list-item-title>Upload video</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item>
              <v-list-item-icon class="mr-3"
                ><v-icon>mdi-access-point</v-icon></v-list-item-icon
              >
              <v-list-item-title>Go live</v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-menu>
        <v-menu 
          offset-y left 
          v-if="isLoggedIn"
          >
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <div class="notiWrap">
                  <v-btn icon class="mr-7" v-on="{ ...tooltip, ...menu }"
                  ><v-icon size="25">mdi-bell-outline</v-icon>
                  </v-btn>
                  <span v-if="notiCount !== 0" class="notiCount">{{ notiCount }}</span>
                </div>
              </template>
              <span>Notifications</span>
            </v-tooltip>
          </template>

          <v-card>
            <v-list-item>
              <v-list-item-title
              class="mt-2 ml-2"
            >
              Notifications
            </v-list-item-title>
            </v-list-item>
            <v-list
              style="max-height: 500px"
              class="notification overflow-y-auto"
            >
            <div
            v-for="(notification, i) in notifications"
            :key="i"
            >
              <v-list-item
                :class="[
                {'unreadNoti': !notification.readAt}]"
                @click="updateNotification(notification)"
              >
                <v-list-item-avatar class="ml-2">
                  <v-avatar>
                    <img
                    :src="`${getUrl}${notification.avatarUrl}`"
                    />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content class="mr-2">
                  <div class="d-flex">
                    <div class="content">
                      <v-list-item-title class="title">{{
                        notification.content
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ dateFormatter(notification.createdAt) }}
                      </v-list-item-subtitle>
                    </div>
                    <v-img
                      height="60"
                      width="100"
                      class="img_url"
                      :src="`${getUrl}${notification.thumbnails}`"
                    >
                    </v-img>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>

            </v-list>
          </v-card>
        </v-menu>
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"> <v-icon size="25">mdi-apps</v-icon></v-btn>
          </template>
          <span>VuraTube apps</span>
        </v-tooltip> -->
  
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" class="mr-7">
              <v-icon size="25">mdi-bell</v-icon></v-btn
            >
          </template>
          <span>Notifications</span>
        </v-tooltip> -->
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
  
        <v-menu offset-y left v-else>
          <template v-slot:activator="{ on }">
            <v-btn small color="red" depressed fab v-on="on" class="white--text">
              <v-avatar v-if="avatar !== 'undefined'">
                <img
                  :src="`${getUrl}${avatar}`"
                />
              </v-avatar>
              <v-avatar v-else>
                <img
                  :src="`${url}`"
                />
              </v-avatar>
              <!-- <template v-else>
                <span class="headline">
                  {{ getCurrentUser.channelName.split('')[0].toUpperCase() }}
                </span>
              </template> -->
            </v-btn>
          </template>
  
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar v-if="avatar !== 'undefined'">
                    <img
                      :src="`${getUrl}${avatar}`"
                    />
                  </v-avatar>
                  <v-avatar v-else>
                    <img
                      :src="`${url}`"
                    />
                  </v-avatar>
                  <!-- <template v-else>
                    <v-avatar color="red">
                      <span class="white--text headline ">
                        {{
                          getCurrentUser.channelName.split('')[0].toUpperCase()
                        }}</span
                      >
                    </v-avatar>
                  </template> -->
                </v-list-item-avatar>
  
                <v-list-item-content>
                  <v-list-item-title class="text-capitalize">{{
                    userName
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    getCurrentUser.email
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
  
            <v-divider></v-divider>
  
            <v-list>
              <v-list-item @click="signOut">
                <v-list-item-icon>
                  <v-icon>mdi-login-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-app-bar>
  
      <v-navigation-drawer
        v-model="drawer"
        app
        :clipped="$route.name !== 'WatchVideo'"
        :temporary="$route.name === 'WatchVideo'"
        id="nav"
      >
        <div tag="div" class="v-navigation-drawer__content" v-bar>
          <v-list dense nav class="py-0" tag="div">
            <v-list-item
              :class="{
                'hidden-lg-and-up': $route.name === 'WatchVideo' ? false : true
              }"
            >
              <v-app-bar-nav-icon
                @click="drawer = !drawer"
                class="mr-5"
              ></v-app-bar-nav-icon>
              <v-toolbar-title class="font-weight-bold">VuraTube</v-toolbar-title>
            </v-list-item>
            <v-divider class="hidden-lg-and-up"></v-divider>
            <div v-for="parentItem in items" :key="parentItem.header">
              <v-subheader
                v-if="parentItem.header && isLoggedIn"
                class="pl-3 py-4 subtitle-1 font-weight-bold text-uppercase"
                >{{ parentItem.header }}</v-subheader
              >
              <template v-if="parentItem.header !== 'Own Playlists'">
                <v-list-item
                v-for="(item, i) in parentItem.header === 'Subscriptions'
                  ? items[2].pages.slice(0, channelLength)
                  : parentItem.pages"
                :key="item.title"
                class="mb-0"
                :to="
                  parentItem.header === 'Subscriptions'
                    ? '/channels/' + item.id
                    : item.link
                "
                @click="settingsMoal(item.title)"
                exact
                active-class="active-item"
              >
                <v-list-item-icon v-if="parentItem.header !== 'Subscriptions'">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-avatar v-else class="mr-5">
                  {{ i }}
                  <v-avatar
                    v-if="
                      item.avatarUrl !== 'no-photo.jpg' && item
                    "
                  >
                    <img
                      :src="
                        `${getUrl}${item.avatarUrl}`
                      "
                    />
                  </v-avatar>
                  <template v-else>
                    <v-avatar color="red">
                      <span class="white--text headline ">
                        {{
                          item.channelName.split('')[0].toUpperCase()
                        }}</span
                      >
                    </v-avatar>
                  </template>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class=" font-weight-medium subtitle-2">{{
                    parentItem.header === 'Subscriptions'
                      ? item.channelName
                      : item.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
              <template v-if="parentItem.header === 'Own Playlists'">
                <v-list-item
                v-for="(item) in items[3].pages.slice(0, playlistLength)"
                :key="item.title"
                class="mb-0"
                :to="'/own-playlists/' + item.id
                "
                exact
                active-class="active-item"
              >
                <v-list-item-icon>
                  <v-icon>mdi-playlist-music</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class=" font-weight-medium subtitle-2">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
  
              <v-btn
                id="showBtn"
                @click="moreChannels"
                v-if="
                  parentItem.header === 'Subscriptions' &&
                    isLoggedIn &&
                    items[2].pages.length > 0
                "
                block
                text
                class="text-none"
              >
                <v-icon>{{
                  channelLength === 3 ? 'mdi-chevron-down' : 'mdi-chevron-up'
                }}</v-icon>
                {{
                  channelLength === 3
                    ? `Show ${items[2].pages.length - 3} more `
                    : 'Show less'
                }}
              </v-btn>
              <v-btn
                id="showBtn"
                @click="morePlaylists"
                v-if="
                  parentItem.header === 'Own Playlists' &&
                    isLoggedIn &&
                    items[3].pages.length > 0
                "
                block
                text
                class="text-none"
              >
                <v-icon>{{
                  playlistLength === 3 ? 'mdi-chevron-down' : 'mdi-chevron-up'
                }}</v-icon>
                {{
                  playlistLength === 3
                    ? `Show ${items[3].pages.length - 3} more `
                    : 'Show less'
                }}
              </v-btn>
  
              <v-divider
                v-if="parentItem.header !== false"
                class="mt-2 mb-2"
              ></v-divider>
            </div>
  
            <span v-for="link in links" :key="link.text">
              <span v-if="link.text === 'Terms'" class="mb-2 d-block"> </span>
              <v-btn
                href
                router
                :to="link.link"
                text
                class="text-capitalize px-1"
                small
                >{{ link.text }}</v-btn
              >
            </span>
          </v-list>
        </div>
      </v-navigation-drawer>
      <settings-modal
      :open-dialog="settingsDialog"
      v-on:closeDialog="settingsDialog = false"
      />
    </nav>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  import SubscriptionService from '@/services/SubscriptionService'
  import HistoryService from '@/services/HistoryService'
  import NotificationService from '@/services/NotificationService'
  import moment from "moment";
  import OwnPlaylistService from '@/services/OwnPlaylistService';
  import SettingsModal from '@/components/SettingsModal'


  export default {
    data: () => ({
      recording: false,
      notiCount: null,
      notifications: [],
      avatar: localStorage.getItem('avatarUrl'),
      userName: localStorage.getItem('username'),
      url: "https://cdn-icons-png.flaticon.com/512/219/219988.png",
      drawer: true,
      items: [
        {
          header: null,
          pages: [
            { title: 'Home', link: '/', icon: 'mdi-home' },
            { title: 'Trending', link: '/trending', icon: 'mdi-fire' },
            {
              title: 'Subscriptions',
              link: '/subscriptions',
              icon: 'mdi-youtube-subscription'
            }
          ]
        },
        {
          header: null,
          pages: [
            // {
            //   title: 'Library',
            //   link: '#l',
            //   icon: 'mdi-play-box-multiple'
            // },
            {
              title: 'History',
              link: '/history',
              icon: 'mdi-history'
            },
            // {
            //   title: 'Your videos',
            //   link: '#yv',
            //   icon: 'mdi-play-box-outline'
            // },
  
            {
              title: 'Watch later',
              link: '/watch-later',
              icon: 'mdi-clock'
            },
  
            {
              title: 'Liked videos',
              link: '/liked-videos',
              icon: 'mdi-thumb-up'
            }
          ]
        },
        {
          header: 'Subscriptions',
          pages: [
            // {
            //   title: 'Traversy Media',
            //   link: '#tm',
            //   icon: 'mdi-badge-account'
            // },
            // {
            //   title: 'The New Boston',
            //   link: '#tn',
            //   icon: 'mdi-badge-account'
            // },
            // {
            //   title: 'Net Ninija',
            //   link: '#nn',
            //   icon: 'mdi-badge-account'
            // },
            // {
            //   title: 'Chris Hawks',
            //   link: '#ch',
            //   icon: 'mdi-badge-account'
            // }
          ]
        },
        {
          header: 'Own Playlists',
          pages: []
        },
        {
          header: 'MORE FROM VuraTube',
          pages: [
            {
              title: 'VuraTube Premium',
              link: '#vp',
              icon: 'mdi-youtube'
            },
            {
              title: 'Gaming',
              link: '#g',
              icon: 'mdi-youtube-gaming'
            },
            {
              title: 'Live',
              link: '#li',
              icon: 'mdi-access-point'
            }
          ]
        },
        {
          header: null,
          pages: [
            {
              title: 'Setting',
              link: '#sg',
              icon: 'mdi-cog'
            },
            {
              title: 'Report history',
              link: '#rh',
              icon: 'mdi-flag'
            },
            {
              title: 'Help',
              link: '#hp',
              icon: 'mdi-help-circle'
            },
            {
              title: 'Send feedback',
              link: '#f',
              icon: 'mdi-message-alert'
            }
          ]
        }
      ],
      links: [
        { text: 'About', link: '#' },
        { text: 'Press', link: '#' },
        { text: 'Copyrignt', link: '#' },
        { text: 'Contact us', link: '#' },
        { text: 'Creators', link: '#' },
        { text: 'Advertise', link: '#' },
        { text: 'Developers', link: '#' },
        { text: 'Terms', link: '#' },
        { text: 'Privacy', link: '#' },
        { text: 'Policy & Safety', link: '#' },
        { text: 'Test new features', link: '#' }
      ],
      settingsDialog: false,
      channelLength: 0,
      playlistLength: 0,
      searchText: '',
      runtimeTranscription_: '',
      lang_: "en-EN",
      historyList: [],
      deleteMessage: '',
      // user: null
    }),
    computed: {
      ...mapGetters(['getCurrentUser', 'getUrl', "isLoggedIn"])
    },
    methods: {
      async search() {
        if (!this.searchText) return
        // console.log(this.searchText == this.$route.query['search-query'])
        if (this.searchText == this.$route.query['search-query']) return
        // this.searchText = this.$route.query['search-query']
        
        this.$router.push({
          name: 'Search',
          query: { 'search-query': this.searchText }
        })
      },
      async getHistoryList() {
        const params = {
          user_id: this.getCurrentUser.id
        }
        const history = await HistoryService.getHistorySearch(params).catch(
          (err) => console.log(err)
        )
        this.historyList = history.data
      },
      searchBy(text) {
        this.searchText = text
        this.search()
      },
      async removeSearchHistory(id) {
        this.historyList = this.historyList.filter((item) => item.id != id)
        await HistoryService.deleteById(id)
        .catch((err) => {
          console.log(err)
        })
      }
      ,
      async getSubscribedChannels() {
        const params = {
          user_id: this.getCurrentUser.id
        }
        const channels = await SubscriptionService.getSubscribedChannels(
          params
        ).catch((err) => console.log(err))
        this.items[2].pages = channels.data
        this.channelLength = 3
      },
      async getOwnPlaylists() {
        const params = {
          user_id: this.getCurrentUser.id
        }
        const playlists = await OwnPlaylistService.getOwnPlaylists(params).catch(
          (err) => console.log(err)
        )
        this.items[3].pages = playlists.data
        this.playlistLength = 3
      },
      async getNotifications() {
        const params = {
          user_id: this.getCurrentUser.id
        }
        const notifications = await NotificationService.getNotifications(
          params
        ).catch((err) => console.log(err))

        if (!notifications) return
        this.notifications = notifications.data
        this.notiCount = this.notifications.filter(notification => !notification.readAt).length
      },
      async updateNotification(notification) {
        const newNotification = NotificationService.updateNotification(notification.id)
          .catch((err)=> {
            console.log(err)
          })
        if (!newNotification) return
        if (notification.notiType === 'comming_video_notification' ) return
        this.$router.push({
          name: 'WatchVideo',
          params: {id: notification.videoId}
        })
      },
      moreChannels() {
        if (this.channelLength === 3)
          this.channelLength = this.items[2].pages.length
        else this.channelLength = 3
        console.log(this.avatar)
      },
      morePlaylists() {
        if (this.playlistLength === 3)
          this.playlistLength = this.items[3].pages.length
        else this.playlistLength = 3
      },
      signOut() {
        this.$store.dispatch('logoutUser')
        this.$router.push({ name: 'Signin'})
      },
      dateFormatter(date) {
        return moment(date).fromNow();
      },
      startConversion() {
        this.recording = true
        // speechInput initialization
        window.SpeechRecognition =
        window.SpeechRecognition || 
        window.webkitSpeechRecognition
        const recognition = new window.SpeechRecognition()
        recognition.lang = this.lang_
        recognition.interimResults = true

        // record word from current speech
        recognition.addEventListener("result", event => {
          this.recording = true
          document.querySelector('.speechButton').classList.add('recording')
          var text = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("")
          this.runtimeTranscription_ = text
        })

        recognition.addEventListener("end", () => {
        this.searchText = this.runtimeTranscription_
        this.recording = false
        document.querySelector('.speechButton').blur()
        document.querySelector('.speechButton').classList.remove('recording')
        recognition.stop()
        this.search()
        })
        recognition.start()
      },
      settingsMoal(title) {
        if (title !== 'Setting') return
        this.settingsDialog = true
      },
    },
    components: {
      SettingsModal
    },
    // beforeRouteLeave(to, from, next) {
    //   this.searchText = ''
    //   next()
    // },
    // beforeRouteUpdate(to, from, next) {
    //   if (!to.query['search-query'] === '') return
    //   this.searchText = to.query['search-query']
    //   next()
    // },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (!to.query['search-query'] === '') return
        vm.searchText = to.query['search-query']
        // vm.getSearchResults(to.query['search-query'])
      })
    },
    mounted() {
      // if (this.$route.query['search-query'])
      //   this.searchText = this.$route.query['search-query']
      if (this.isLoggedIn) {
        this.getHistoryList()
        this.getOwnPlaylists()
        this.getNotifications()
        this.getSubscribedChannels()
      }
      // this.user = this.$store.getters.getCurrentUser
      // console.log(this.user)
      this.drawer = this.$vuetify.breakpoint.mdAndDown ? false : true
      // console.log(this.$route.name)
      this.drawer = this.$route.name === 'WatchVideo' ? false : this.drawer
    },
    created() {
      this.drawer = this.$route.name === 'WatchVideo' ? false : this.drawer
  
      if (!this.isLoggedIn) {
        this.items[2].header = false
        this.items[0].pages.pop()
      }
    }
  }
  </script>
  
  <style lang="scss">
  .searchBox {
    width: 800px; /* or whatever width you want. */
    max-width: 600px; /* or whatever width you want. */
    display: inline-block;
    position: relative;
    .speechButton {
      background: var(--button-color);
      box-shadow: 0 0.5rem 1rem var(--shadow);
      border-radius: 50px;
      height: 40px !important; 
      width: 40px !important;
      display: block;
      position: absolute;
      right: -12%;
      // top: -4%;
      // left: 50%;
      transform: translateX(-50%);
    }
  }
  
  .unreadNoti{
    background-color: #eeeeee;
  }
  .notification {
    padding: 0px !important;
    margin: 0px !important;
    
    // height: 300px !important;
    // overflow-y: auto !important;
   }
  .notiWrap {
    position: relative;
    .notiCount {
      position: absolute;
      right: 30px;
      top: 5px;
      min-width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 30px;
      padding: 0 2px;
      font-size: 12px;
      text-align: center;
      background-color: #f34423;
      color: white;
      font-weight: bold;
    }
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
  }
  .v-list-item__avatar {
    justify-content: center !important;
  }
  #signInBtn {
    border-radius: 5px;
  }
  #showBtn {
    .v-btn__content {
      justify-content: flex-start;
  
      i {
        margin-right: 30px;
      }
    }
  }
  #navbar {
    .active-item {
      .v-list-item__icon {
        color: red !important;
      }
    }
    .v-navigation-drawer__border {
      width: 0 !important;
    }
  
    .vuebar-element {
      height: 250px;
      width: 100%;
      max-width: 500px;
      background: #dfe9fe;
    }
  
    .vb > .vb-dragger {
      z-index: 5;
      width: 10px;
      right: 0;
    }
  
    .vb > .vb-dragger > .vb-dragger-styler {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transform: rotate3d(0, 0, 0, 0);
      transform: rotate3d(0, 0, 0, 0);
      -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
        height 100ms ease-out;
      transition: background-color 100ms ease-out, margin 100ms ease-out,
        height 100ms ease-out;
  
      margin: 5px 5px 5px 0;
      border-radius: 20px;
      height: calc(100% - 10px);
      display: block;
    }
  
    .v-navigation-drawer__content:hover .vb > .vb-dragger > .vb-dragger-styler {
      width: 10px;
      background-color: #e0e0e0;
    }
  
    .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
      background-color: rgba(48, 121, 244, 0.3);
      background-color: rgba(255, 255, 255, 0.3);
    }
  
    .vb > .vb-dragger:hover > .vb-dragger-styler {
      margin: 0px;
      width: 10px;
    }
  
    .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
      background-color: rgba(48, 121, 244, 0.5);
      margin: 0px;
      height: 100%;
    }
  
    .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
      background-color: rgba(48, 121, 244, 0.5);
    }
  }
  .searchHistory {
    font-size: 1rem;
    background-color: white;
    font-weight: 400;
    // padding: 0.5rem;
  }
  .searchHistory:hover {
    background-color: #eeeeee;
  }
  .btnRemove {
    background-color: white !important;;
    margin: 5px !important;
    font-size: 0.8rem !important;
    color: #f34423 !important;
  }
  .searchCard {
    max-width: 600px;
  }
  </style>
  