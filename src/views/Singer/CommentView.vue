<template>
    <div id="comment" class="pa-4 pl-0">
      <studio-nav-bar/>
      <!-- <v-container fluid> -->
      <h2>channel comments</h2>
  
      <!-- <v-row> -->
      <v-tabs v-model="tab" id="tab" class="mt-5">
        <v-tab>
          Uploads
        </v-tab>
        <v-tab>
          Live
        </v-tab>
      </v-tabs>
  
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <template>
            <v-card flat>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Filter"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                no-data-text="No comments available, please upload comment."
                :headers="headers"
                :items="comments"
                :search="search"
                :loading="loading"
                loading-text="Loading... Please wait"
              >
                <template v-slot:top>
                  <v-dialog v-model="dialogDelete" persistent max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span class="headline"
                          >Permanently delete this comment?</span
                        >
                      </v-card-title>
  
                      <v-card-text>
                        <v-container>
                          <v-card class="card" tile flat>
                            <v-row no-gutters>
                              <v-col cols="3" sm="2" md="5" lg="5">
                                <v-img
                                  class="align-center"
                                  :src="`${url}${itemToDelete.thumbnails}`"
                                >
                                </v-img>
                              </v-col>
                              <v-col>
                                <div class="ml-2">
                                  <v-card-title
                                    class="pl-2 subtitle-1 font-weight-bold"
                                    style="line-height: 1"
                                  >
                                    {{ itemToDelete.title }}
                                  </v-card-title>
  
                                  <v-card-subtitle
                                    class="pl-2 pt-2 pb-0"
                                    style="line-height: 1"
                                  >
  
                                    Published
                                    {{ dateFormatter(itemToDelete.createdAt) }}
                                    <br />
                                    {{ itemToDelete.views }} views
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
                          @click="dialogDelete = !dialogDelete"
                          >Cancel</v-btn
                        >
  
                        <v-btn
                          :loading="deleteBtnLoading"
                          color="blue darken-1"
                          text
                          @click="deleteItem"
                          >Delete Forever</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </template>
                <template v-slot:[`item.created_at`]="{ item }">
                    <div>
                        {{ dateFormatter(item.created_at) }}
                    </div>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn v-if="item.status !== 'Answered'" icon href text class="mr-2">
                    <v-icon @click="replyBtn(item)">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    href
                    text
                    class="mr-2 red--text"
                    router
                    :to="`/watch/${item.id}`"
                  >
                    <v-icon>
                      mdi-youtube
                    </v-icon>
                  </v-btn>
                  <v-btn icon text @click.stop="deleteBtn(item)">
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </template>
        </v-tab-item>
        <v-tab-item>
          live
        </v-tab-item>
      </v-tabs-items>
      <!-- </v-row> -->
      <!-- </v-container> -->
      <reply-comment-dialog
      :open-dialog="dialogReply"
      :item-to-comment="itemToComment"
      v-on:closeDialog="dialogReply = false"
      v-on:repliedDialog="closeDialogReply"
      ></reply-comment-dialog>
      <v-snackbar v-model="snackbar">
        Comment deleted successfully
        <v-btn color="white" text @click="snackbar = false" icon>
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-snackbar>
    </div>
</template>

<script>
import StudioNavBar from '@/components/Singers/StudioNavBar.vue'
import { mapGetters } from 'vuex'
import CommentService from "@/services/CommentService";
import moment from "moment";
import ReplyCommentDialog from "@/components/Singers/ReplyCommentModal.vue";
export default {
  data: () => ({
    loading: false,
    deleteBtnLoading: false,
    snackbar: false,
    dialogDelete: false,
    dialogReply: false,
    tab: null,
    search: "",
    url: process.env.VUE_APP_URL,
    headers: [
      {
        text: "Comment",
        align: "start",
        value: "comment",
      },
      { text: "Video", value: "video_title" },
      { text: "Commented At", value: "created_at" },
      { text: "User", value: "user_name" },
      { text: 'Status', value: 'status' },      
      { text: "Actions", value: "actions", sortable: false },
    ],
    comments: [],
    itemToDelete: {},
    itemToComment: {},
  }),
  components: {
    StudioNavBar,
    ReplyCommentDialog
  },
  computed: {
    ...mapGetters(['getCurrentSinger', 'getUrl'])
  },
  methods: {
    async getComments() {
      this.loading = true;

      const comments = await CommentService.getBySinger({
        singer_id: this.getCurrentSinger.id
      })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.loading = false));

      if (!comments) return;
      console.log(comments)
      this.comments = comments.data;
    },
    editItem(item) {
      this.$router.push({ name: `Detailscomment`, params: { id: item.id } });
    },
    deleteBtn(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    replyBtn(item) {
        console.log('item')
        console.log(item)
      this.dialogReply = true;
      this.itemToComment = item;
    },
    async deleteItem() {
      this.deleteBtnLoading = true;
      await CommentService.deleteById(this.itemToDelete.id)
        .catch((err) => console.log(err))
        .finally(() => {
          this.comments = this.comments.filter(
            (comment) => this.itemToDelete.id !== comment.id
          );
          this.deleteBtnLoading = false;
          this.dialogDelete = false;
          this.itemToDelete = {};
          this.snackbar = true;
        });
    },
    dateFormatter(date) {
      return moment(date).fromNow();
    },
    closeDialogReply() {
      this.dialogReply = false;
      window.location.reload();
    },
  },
  mounted() {
    this.getComments();
  },
  beforeRouteUpdate(to, from, next) {
    this.getComments();
    next();
  },
};
</script>

<style lang="scss">
// .card,
// #tab .v-tabs-bar {
//   background: #f9f9f9 !important;
// }
</style>
  