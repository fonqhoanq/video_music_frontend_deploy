<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline"
          >Reply contents</span
        >
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="message" label="Reply" placeholder="Enter reply content">
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <v-container>
          <v-card class="card" tile flat>
            <v-row no-gutters>
              <v-col cols="3" sm="2" md="5" lg="5">
                <v-img
                  class="align-center"
                  :src="`${getUrl}${itemToComment.thumbnails}`"
                >
                </v-img>
              </v-col>
              <v-col>
                <div class="ml-2">
                  <v-card-title
                    class="pl-2 subtitle-1 font-weight-bold"
                    style="line-height: 1"
                  >
                    {{ itemToComment.video_title }}
                  </v-card-title>
                  <v-card-subtitle
                    class="pl-2 pt-2 pb-0"
                    style="line-height: 1"
                  >
                    Published
                    {{ dateFormatter(itemToComment.createdAt) }}
                    <br />
                    {{ itemToComment.views }} views
                  </v-card-subtitle>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="closeModal"
          >Cancel</v-btn
        >
        <v-btn
          :loading="replyBtnLoading"
          :disabled="message === ''"
          color="blue darken-1"
          text
          @click="replyComment"
          >Reply</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import SubscriptionService from '@/services/SubscriptionService'
import moment from 'moment'
import ReplyService from '@/services/ReplyService';
export default {
  name: 'ReplyCommentDialog',
  props: {
    openDialog: {
        type: Boolean,
        default: false
    },
    itemToComment: {
      type: Object,
      required: true
    }},
  data: function() {
    return {
      replyBtnLoading: false,
      message: '',
      url: process.env.VUE_APP_URL,
      headers: [
        {
          text: 'Channel',
          align: 'start',
          value: 'channel'
        },
        { text: 'Date Subscribed', value: 'createdAt' },
        { text: 'Subcriber count', value: 'subscriberId.subscribers' }
        // { text: 'Actions', value: 'actions', align: 'end', sortable: false }
      ],
      subscribers: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getCurrentSinger', 'getUrl']),
    dialog() {
      return this.openDialog
    }
  },
  methods: {
    async getSubscribers() {
      this.loading = true
      const subscribers = await SubscriptionService.getSubscribers(this.getCurrentSinger.id)
        .catch((err) => console.log(err))
        .finally(() => {
          this.loading = false
        })

      if (!subscribers) return
      this.subscribers = subscribers.data
      console.log('sub')
      console.log(this.subscribers)

      // console.log(subscribers)
    },
    dateFormatter(date) {
      return moment(date).fromNow();
    },
    // initialize() {
    //   this.subscribers = [
    //     {
    //       channelName: 'Brad Traversy',
    //       avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    //       createdAt: 'Apr 20, 2020',
    //       subscribers: 5
    //     },
    //     {
    //       channelName: 'John Doe',
    //       avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    //       createdAt: 'Apr 20, 2020',
    //       subscribers: 10
    //     }
    //   ]
    // },
    subscribe(item) {
      console.log(item)
    },
    closeModal() {
      console.log(this.itemToComment)
      this.$emit('closeDialog')
    },
    async replyComment() {
      console.log(this.message)
    this.replyBtnLoading = true
      const reply = await ReplyService.createSingerReply(
        {
            text: this.message,
            comment_id: this.itemToComment.id,
            singer_id: this.getCurrentSinger.id
        }
      ).catch((err) => console.log(err))
        if (!reply) return
        this.replyBtnLoading = false
        this.$emit('repliedDialog')
    }
  },
  mounted() {
    // this.initialize()
    this.getSubscribers()
  }
}
</script>
