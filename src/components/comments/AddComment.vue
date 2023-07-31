<template>
    <v-card class="transparent" flat>
      <v-list-item three-line class="pl-0">
        <v-list-item-avatar size="50">
          <v-avatar v-if="!isLoggedIn" color="primary">
            <v-icon class="white--text">mdi-account</v-icon>
          </v-avatar>
          <v-img
            v-else-if="getCurrentUser.avatarUrl !== 'no-photo.jpg'"
            :src="`${getUrl}${avatar}`"
          ></v-img>
  
          <v-avatar v-else color="red">
            <span class="white--text headline ">
              {{ getCurrentUser.username.split('')[0].toUpperCase() }}</span
            >
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content class="align-self-auto">
          <ValidationProvider
            v-slot="{ errors }"
            name="Comment"
            rules="min:10|max:255"
          >
            <v-text-field
              :error-messages="errors"
              v-model="comment"
              placeholder="Add a public comment..."
              @click="clickTextField"
              counter="255"
            >
            </v-text-field>
          </ValidationProvider>
          <div v-if="showCommentBtns" class="d-inline-block text-right">
            <v-btn text @click="showCommentBtns = !showCommentBtns">Cancel</v-btn>
            <v-btn
              id="commentBtn"
              class="blue darken-3 white--text"
              depressed
              tile
              :loading="loading"
              :disabled="comment.length < 10 || comment.length > 255"
              @click="createComment"
              >Comment</v-btn
            >
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  import CommentService from '@/services/CommentService'
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
        showCommentBtns: false,
        loading: false,
        comment: ''
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser', 'getUrl', 'isLoggedIn'])
    },
    methods: {
      async createComment() {
        if (this.comment === '') return
        this.loading = true
        const comment = await CommentService.createComment({
          text: this.comment,
          video_id: this.videoId, 
          user_id: this.getCurrentUser.id
        })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
  
        if (!comment) return
        this.comment = ''
        // comment.data.replies = []
        // comment.data.userId = this.getCurrentUser.id
  
        this.$store.dispatch('addComment', comment.data)
        this.$emit('videoCommentLength')
      },
      clickTextField() {
        if (!this.isLoggedIn) return this.$router.push('/signin')
        this.showCommentBtns = true
      }
    }
  }
  </script>
  
<style lang="scss">
#commentBtn {
  border-radius: 5px;
}
</style>
  