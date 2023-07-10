<template>
    <v-card
      class="content-bg card mx-auto"
      :max-width="350"
      flat
      tile
      @click="handlePlayList"
    >
    <figure>
      <v-img
        v-if="playlist.playlist_videos[0]"
        class="img-video"
        :src="`${getUrl}${playlist.playlist_videos[0].video.thumbnails}`"
  
      ></v-img>
      <figcaption class="text"><v-icon style="color:white">mdi-play</v-icon>Play All</figcaption>
    </figure>
      <v-row no-gutters>
        <v-col>
          <v-card-title
            class="pl-2 pt-3 subtitle-1 font-weight-bold"
            style="line-height: 1.2rem"
          >
            <v-icon>mdi-playlist-play</v-icon>
            {{ playlist.title }}
          </v-card-title>
  
          <v-card-subtitle class="pl-2 pb-0">
              The Weeknd, Daft Punk, Drake and many more artists
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
</template>
  
<script>
  import moment from "moment";
  import { mapGetters } from 'vuex'
  export default {
    name: "PlaylistCard",
    props: {
      playlist: {
        type: Object,
        required: true,
      },
      card: Object,
    },
    data() {
      return {
        url: process.env.VUE_APP_URL,
        avatarURL: "https://www.hollywoodreporter.com/wp-content/uploads/2022/12/GettyImages-1448719385.jpg?w=1296"
      };
    },
    computed: {
      ...mapGetters(['getCurrentUser', 'getUrl'])
    },
    methods: {
      dateFormatter(date) {
        return moment(date).fromNow();
      },
      handlePlayList() {
        this.$router.push({
          name: 'WatchVideo',
          params: {
            id: this.playlist.playlist_videos[0].video.id,
            playlist_id: this.playlist.id
          }
        })
      }
    },
  };
</script>
  
<style lang="scss">
.card-action {
  border-radius: 10px 10px 10px 10px !important;
  padding-top: 15px;
  border: 1px;
}
.img-video {
  max-width: 350px;
  border: 1px;
  border-radius: 10px 10px 10px 10px !important;
}
figure {
  position: relative;
}

figcaption {
  position: absolute;
  inset: 2px;  
  display: none;
}

.v-card:hover figcaption {
  display: flex;
}


/* for visualization only */
figure {
  display: inline-block;
}

figcaption {
  font-size: 1.2rem;
  color: white;
  font-weight: bold;

  padding: 1em;
  justify-content: center;
  align-items: center;
  background-color: rgba(3, 3, 3, 0.5);
}
</style>
  