<template>
    <div>
      <div v-if="!comments">
        <p>No comment yet, leave a comment</p>
      </div>
      <div v-for="(comment) in loading ? 4 : comments" :key="comment.id">
        <v-skeleton-loader type="list-item-avatar-two-line" :loading="loading">
          <v-card class="transparent" flat>
            <v-list-item three-line class="pl-0 mt-2">
              <v-list-item-avatar
                v-if="typeof comment.user !== 'undefined'"
                size="50"
              >
                <v-img
                  v-if="comment.user.avatarUrl !== 'no-photo.jpg'"
                  class="elevation-6"
                  :src="`${getUrl}${comment.user.avatarUrl}`"
                ></v-img>
                <v-avatar v-else color="red">
                  <span class="white--text headline ">
                    {{
                      comment.user.username.split('')[0].toUpperCase()
                    }}</span
                  >
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="d-flex mb-0">
                  <v-list-item-title
                    v-if="comment.user"
                    class="font-weight-medium caption mb-0 d-flex"
                    >{{ comment.user.username }}
                    <span class="pl-2 font-weight-light grey--text">
                      {{ dateFormatter(comment.createdAt) }}</span
                    >
                  </v-list-item-title>
                  <v-menu bottom left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
  
                    <v-list v-if="isLoggedIn">
                      <v-list-item>
                        <v-list-item-title
                          ><v-icon>mdi-trash</v-icon>Delete</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <v-list-item-subtitle
                  class="mt-n2 black--text text--darken-4"
                  >{{ comment.text }}</v-list-item-subtitle
                >
  
                <div>
                  <v-btn
                    text
                    small
                    :ripple="false"
                    @click.stop="showReply(`${'reply' + comment.id}`)"
                    >Reply</v-btn
                  >
                </div>
                <div class="d-none" :ref="`${'reply' + comment.id}`">
                  <v-list-item three-line class="pl-0">
                    <v-list-item-avatar
                      v-if="typeof comment.user !== 'undefined'"
                      class="mt-2"
                      size="40"
                    >
                      <v-avatar v-if="!isLoggedIn" color="primary">
                        <v-icon class="white--text">mdi-account</v-icon>
                      </v-avatar>
                      <template v-else>
                        <v-img
                          v-if="getCurrentUser.avatarUrl !== 'no-photo.jpg'"
                          class="elevation-6"
                          :src="`${getUrl}${avatar}`"
                        ></v-img>
                        <v-avatar v-else color="red">
                          <span class="white--text headline ">
                            {{
                              getCurrentUser.username.split('')[0].toUpperCase()
                            }}</span
                          >
                        </v-avatar>
                      </template>
                    </v-list-item-avatar>
                    <v-list-item-content class="align-self-auto mt-0 pt-0">
                      <v-form :ref="`form${comment.id}`">
                        <v-text-field
                          :ref="`${'input' + comment.id}`"
                          class="pt-0 mt-0 body-2"
                          placeholder="Add a public comment..."
                          @click="clickTextField"
                          :value="repliesInput[`input${comment.id}`]"
                        >
                        </v-text-field>
                      </v-form>
                      <div
                        :ref="comment.id + 'btns'"
                        class="d-inline-block text-right"
                        v-if="isLoggedIn"
                      >
                        <v-btn text @click="hideReply(comment.id)" small
                          >Cancel</v-btn
                        >
                        <v-btn
                          class="blue darken-3 white--text"
                          depressed
                          tile
                          small
                          :loading="btnLoading && i == index"
                          @click="
                            index = i
                            addReply($event, comment.id)
                          "
                          >Reply</v-btn
                        >
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <!-- </v-list-item-action> -->
                </div>
                <v-expansion-panels>
                  <v-expansion-panel class="transparent elevation-0">
                    <v-expansion-panel-header
                      v-if="comment.replies && (comment.replies.length > 0 || comment.singer_replies.length > 0)"
                      class="blue--text text--darken-4 py-0"
                      >{{
                        comment.replies.length + comment.singer_replies.length
                      }}
                      replies</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <v-list-item
                        three-line
                        class="pl-0 mt-2"
                        v-for="reply in comment.replies"
                        :key="reply.id"
                      >
                        <v-list-item-avatar
                          v-if="typeof reply !== 'undefined'"
                          size="50"
                        >
                          <v-img
                            v-if="reply.user.avatarUrl !== 'no-photo.jpg'"
                            class="elevation-6"
                            :src="
                              `${getUrl}${reply.user.avatarUrl}`
                            "
                          ></v-img>
                          <v-avatar v-else color="red">
                            <span class="white--text headline ">
                              {{
                                reply.user.username
                                  .split('')[0]
                                  .toUpperCase()
                              }}</span
                            >
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <div class="d-flex mb-0">
                            <v-list-item-title
                              v-if="reply.user"
                              class="font-weight-medium caption mb-0 d-flex"
                              >{{ reply.user.username }}
                              <span class="pl-2 font-weight-light grey--text">
                                {{ dateFormatter(reply.createdAt) }}</span
                              >
                            </v-list-item-title>
                            <v-menu bottom left v-if="isLoggedIn">
                              <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
  
                              <v-list>
                                <v-list-item
                                >
                                  <v-list-item-title
                                    ><v-icon>mdi-trash</v-icon
                                    >Delete</v-list-item-title
                                  >
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                          <v-list-item-subtitle
                            class="mt-n2 black--text text--darken-4"
                            >{{ reply.text }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        three-line
                        class="pl-0 mt-2"
                        v-for="reply in comment.singer_replies"
                        :key="reply.id"
                      >
                        <v-list-item-avatar
                          v-if="typeof reply !== 'undefined'"
                          size="50"
                        >
                          <v-img
                            v-if="reply.singer.avatarUrl !== 'no-photo.jpg'"
                            class="elevation-6"
                            :src="
                              `${getUrl}${reply.singer.avatarUrl}`
                            "
                          ></v-img>
                          <v-avatar v-else color="red">
                            <span class="white--text headline ">
                              {{
                                reply.singer.username
                                  .split('')[0]
                                  .toUpperCase()
                              }}</span
                            >
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <div class="d-flex mb-0">
                            <v-list-item-title
                              v-if="reply.singer"
                              class="font-weight-medium caption mb-0 d-flex"
                              >{{ reply.singer.username }}
                              <span class="pl-2 font-weight-light grey--text">
                                {{ dateFormatter(reply.createdAt) }}</span
                              >
                            </v-list-item-title>
                            <v-menu bottom left v-if="isLoggedIn">
                              <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
  
                              <v-list>
                                <v-list-item
                                >
                                  <v-list-item-title
                                    ><v-icon>mdi-trash</v-icon
                                    >Delete</v-list-item-title
                                  >
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                          <v-list-item-subtitle
                            class="mt-n2 black--text text--darken-4"
                            >{{ reply.text }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-skeleton-loader>
      </div>
      <v-snackbar v-model="snackbar">
        Comment deleted successfully
        <v-btn color="white" text @click="snackbar = false" icon>
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-snackbar>
    </div>
  </template>
  
  <script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  
  import CommentService from '@/services/CommentService'
  import ReplyService from '@/services/ReplyService'
  export default {
    props: {
      videoId: {
        type: Number,
        required: true
      }
    },
    data: function() {
      return {
        avatar: localStorage.getItem('avatarUrl'),
        repliesInput: {},
        comments: this.$store.getters.getComments.data,
        commentsLength: false,
        index: -1,
        btnLoading: false,
        url: process.env.VUE_APP_URL,
        snackbar: false,
        loading: false
      }
    },
    computed: {
      ...mapGetters(['isLoggedIn', 'getCurrentUser', 'getUrl'])
    },
    methods: {
      async getComments() {
        this.loading = true
        const comments = await this.$store
          .dispatch('setComments', this.videoId)
          .catch((err) => console.log(err))
          .finally(() => (this.loading = false))
        if (!comments) return
        this.comments = comments.data
      },
      async deleteComment(id) {
        if (!this.isLoggedIn) return
        // this.$store.dispatch('deleteComment', id)
        this.comments = this.comments.filter(
          (comment) => comment.id.toString() !== id.toString()
        )
  
        this.snackbar = true
        await CommentService.deleteById(id).catch((err) => {
          console.log(err)
        })
  
        await this.$store
          .dispatch('setComments', this.videoId)
          .catch((err) => console.log(err))
        this.comments = this.$store.getters.getComments.data
        this.$emit('videoCommentLength')
      },
      async addReply(event, id) {
        if (!this.isLoggedIn) return
        if (this.$refs[`input${id}`][0].$refs.input.value == '') return
  
        this.btnLoading = true
        // console.log((event.target.loading = true))
        this.$refs[`form${id}`][0].reset()
        // console.log(this.$refs[`input${id}`][0].$refs.input.value)
  
        const reply = await ReplyService.createReply({
          comment_id: id,
          user_id: this.getCurrentUser.id,
          text: this.$refs[`input${id}`][0].$refs.input.value
        })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.btnLoading = false
            // this.$store.dispatch('setComments', this.videoId)
          })
        reply.data.user = this.$store.getters.getCurrentUser
        reply.data.user.avatarUrl = this.avatar
        // this.$store.dispatch('addComment', reply.data.data)
        let comment = this.comments.find(
          (comment) => comment.id.toString() === id.toString()
        )
        // console.log(comment)
        if (!comment.replies) {
          // console.log('1')
          // comment.replies = []
          comment.replies.push(reply.data)
        } else {
          // console.log('2')
          comment.replies.unshift(reply.data)
          // this.comments
          //   .find((comment) => comment.id === id)
          //   .replies.unshift(reply.data.data)
        }
  
        // console.log(
        //   this.$store.getters.getComments.data.find(
        //     (comment) => comment.id === id
        //   )
        // )
        // this.comments
        //   .find((comment) => comment.id === id)
        //   .replies.unshift(reply.data.data)
      },
      clickTextField() {
        if (!this.isLoggedIn) return this.$router.push('/signin')
      },
      showReply(id) {
        this.$refs[id][0].classList.toggle('d-none')
      },
      hideReply(id) {
        this.$refs[`form${id}`][0].reset()
        this.$refs['reply' + id][0].classList.toggle('d-none')
      },
      dateFormatter(date) {
        return moment(date).fromNow()
      }
    },
  
    mounted() {
      this.getComments()
    }
  }
  </script>
  
  <style lang="scss">
  .v-application--is-ltr .v-expansion-panel-header__icon {
    margin-left: initial;
  }
  
  .v-expansion-panel::before {
    box-shadow: initial;
  }
  </style>
  