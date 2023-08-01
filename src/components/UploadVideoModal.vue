<template>
    <v-dialog
      v-model="dialog"
      persistent
      transition="fab-transition"
      max-width="1000"
    >
      <v-card>
        <div class="d-flex justify-space-between mb-5" id="modal-header">
          <v-card-title class="py-3">Upload Video</v-card-title>
          <div class="mt-3 mr-2">
            <v-btn text>
              Upload With Classic
            </v-btn>
            <v-btn icon text @click="closeModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
  
        <v-card-text
          v-if="!uploaded"
          class="d-flex flex-column align-center my-md-12 py-md-12 my-sm-8 py-sm-8 my-xs-0 py-xs-0 my-12 py-12"
        >
          <div v-if="!uploading" class="text-center">
            <div>
              <v-btn
                icon
                class="grey lighten-2 mb-4"
                style="height: 104px;width: 104px;"
                @click="selectFile"
                ><v-icon x-large class="grey--text text--darken-1"
                  >mdi-upload</v-icon
                ></v-btn
              >
            </div>
  
            <ValidationProvider
              rules="required|size:20000"
              v-slot="{ errors }"
              name="file"
              ref="provider"
            >
              <v-file-input
                @change="uploadVideo"
                v-model="selectedFile"
                accept="video/mp4/webm"
                placeholder="Pick an video"
                prepend-icon="mdi-video"
                :error-messages="errors"
                ref="fileInput"
              ></v-file-input>
            </ValidationProvider>
            <v-btn
              type="submit"
              depressed
              @click="$refs.fileInput.$refs.input.click()"
              class="blue darken-3 flat white--text mt-4"
              >Select File</v-btn
            >
          </div>
  
          <v-progress-circular
            v-else
            :rotate="360"
            :size="100"
            :width="15"
            :value="value"
            color="teal"
          >
            {{ value }}
          </v-progress-circular>
        </v-card-text>
        <v-card-text v-else>
          <h2 class="mb-6">Details</h2>
          <template>
            <v-alert
              v-if="!validDate"
              type="error"
            >Invalid schedule time. Please select a future date and time</v-alert>
          </template>
          <v-row>
            <v-col
              order="last"
              order-sm="last"
              order-md="first"
              order-lg="first"
              order-xl="first"
              cols="12"
              sm="12"
              md="8"
              lg="8"
            >
              <ValidationObserver 
                ref="form"
                v-slot="{ handleSubmit }"
              >
                <form @submit.prevent="handleSubmit(submit)">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Title"
                    rules="required|min:10|max:100"
                  >
                    <v-text-field
                      v-model="formData.title"
                      :error-messages="errors"
                      label="Title (required)"
                      class="mb-3"
                      filled
                      dense
                      counter="100"
                      max-length="100"
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Description"
                    rules="required|min:30|max:800"
                  >
                    <v-textarea
                      filled
                      auto-grow
                      :error-messages="errors"
                      label="Description"
                      placeholder="Tell viewers about your video"
                      rows="5"
                      counter="800"
                      max-length="800"
                      v-model="formData.description"
                      row-height="20"
                    ></v-textarea>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="visibility"
                    rules="required|min:3"
                  >
                    <v-select
                      :items="visibility"
                      :error-messages="errors"
                      filled
                      label="visibility"
                      v-model="formData.visibility"
                    ></v-select>
                  </ValidationProvider>
                  <ValidationProvider
                    v-if="formData.visibility === 'Schedule'"
                    name="Schedule At"
                  >
                    <div class="dateWrap">
                      <p class="title">Schedule At</p>
                      <date-time-picker
                        class="mb-4 ml-2 date"
                        v-model="formData.upload_video_at" 
                        @update-value="updateTime" 
                        v-on:invalidDate="validDate = false"
                        v-on:validDate="validDate = true"  
                      />                  
                    </div>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Cateogry"
                    rules="required|min:3"
                  >
                    <v-select
                      :items="categoriesTitles"
                      :error-messages="errors"
                      filled
                      label="Categories"
                      v-model="formData.category"
                      :loading="categoryLoading"
                    ></v-select>
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="HashTag"
                    rules="required"
                  >
                    <v-select
                      :items="hashTagTitles"
                      :error-messages="errors"
                      filled
                      label="Hash Tags"
                      multiple
                      v-model="formData.hashTags"
                      :loading="hashTagLoading"
                    ></v-select>
                  </ValidationProvider>
  
                  <div class="mt-6 d-flex justify-space-between">
                    <v-btn
                      :loading="submitLoading"
                      type="submit"
                      class="primary"
                      :disabled="!validDate || imgDataUrl == ''"
                      depressed
                      >Submit</v-btn
                    >
                  </div>
                </form>
              </ValidationObserver>
            </v-col>
            <v-col
              order-sm="1"
              cols="12"
              sm="12"
              md="4"
              lg="4"
              class="text-center"
            >
              <v-btn text @click="toggleShow">Upload Thumbnails</v-btn>
              <my-upload
                field="thumbnails"
                @crop-success="cropSuccess"
                @crop-upload-success="cropUploadSuccess"
                v-model="show"
                :width="1280"
                :height="720"
                :url= "url"
                :headers="headers"
                img-format="jpg|png"
                langType="en"
              ></my-upload>
              <v-responsive width="330" class="mx-auto">
                <div v-if="!imgDataUrl" class="px-12" id="image-placeholder">
                  <v-icon>mdi-image-plus</v-icon>
                </div>
                <v-img
                  v-else
                  max-width="330"
                  height="350"
                  :src="imgDataUrl"
                ></v-img>
              </v-responsive>
              <p v-if="imgDataUrl == ''" class="red--text">
                Please upload thumbnail
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-if="!uploaded">
          <p class="text-center grey--text caption px-12 px-xs-0">
            By submitting your videos to YouTube, you acknowledge that you agree
            to YouTube's Terms of Service and Community Guidelines. Please be sure
            not to violate others' copyright or privacy rights. Learn more
          </p>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import myUpload from 'vue-image-crop-upload'
  import VideoService from "@/services/VideoService";
  import { mapGetters } from 'vuex'
  import HashTagService from '@/services/HashTagService'
  import DateTimePicker from '@/components/parts/DateTimePicker'

  // import CategoryService from "@/services/CategoryService";
  export default {
    name: "UploadModal",
    props: ["openDialog"],
    data: function () {
      return {
        valid: false,
        uploaded: false,
        uploading: false,
        submitLoading: false,
        categoryLoading: false,
        hashTagLoading: false,
        validDate: true,
        interval: {},
        value: 0,
        show: false,
        rules: [
          (value) =>
            !value ||
            value.size > 5000000 ||
            `Video size should be less than 15 MB!, ${value.size}`,
        ],
        categoriesTitles: ["Pop", "Rock", "Country Music", "Electronic", "Funk", "Hip hop", "Jazz", "Latin", "Soul", "R&B"],
        categories: ["Pop", "Rock", "Country Music", "Electronic", "Funk", "Hip hop", "Jazz", "Latin", "Soul", "R&B"],
        visibility: ["Private", "Public", "Schedule"],
        selectedHashTags: [],
        hashTagTitles: [],
        hashTags: [],
        selectedFile: [],
        formData: {
          id: "",
          title: "",
          description: "",
          category: "",
          visibility: "",
        },
        imgDataUrl: "",
        url: "",
        headers: { Authorization: `Bearer ${this.$store.getters.getToken}` },
      };
    },
    computed: {
      ...mapGetters(['getCurrentSinger', 'getUrl']),
      dialog() {
        return this.openDialog;
      },
    },
    methods: {
      async uploadVideo(e) {
        const { valid } = await this.$refs.provider.validate(e);
  
        if (!valid) return;
        this.uploading = true;
        const fd = new FormData();
     
        fd.append("url", this.selectedFile);
        fd.append("singer_id", this.getCurrentSinger.id);
        fd.append("category_id", 1);
        let video = await VideoService.uploadVideo(fd, {
          onUploadProgress: (uploadEvent) => {
            this.value = Math.round(
              (uploadEvent.loaded / uploadEvent.total) * 100
            );
          },
        })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.uploaded = true;
            this.uploading = false;
          });

        video = video.data;
        this.formData.id = video.id;
        // this.formData.title = video.title;
        // this.formData.description = video.description;
        // this.formData.cateogry = video.cateogry;
        this.url = `https://vuratubeapi.store/videos/${video.id}/thumbnails`;
        // this.interval = setInterval(() => {
        //   if (this.value === 100) {
        //     this.uploaded = true
        //     clearInterval(this.inte-rval)
        //   }
        //   this.value += 10
        // }, 1000)
        // }
        // }
      },
      async submit() {
        this.submitLoading = true;
        this.formData.hashTags = this.formData.hashTags.map((hashtag) => {
          return this.hashTags.find((hashTag) => hashTag.title === hashtag).id
        })
        const video = await VideoService.updateVideo(this.formData.id,{
          video: {
            title: this.formData.title,
            description: this.formData.description,
            category_id: this.categoryId(),
            video_status: this.convertStatus(),
            hash_tags: this.formData.hashTags,
            singer_id: this.getCurrentSinger.id
          },
          upload_video_at: this.formData.upload_video_at
        })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.submitLoading = false;
            this.uploaded = false;
            this.$emit("openSnackbar");
            this.$emit("reloadPage");
          });
  
        if (!video) return;
        this.formData.title = '';
        this.formData.description = '';
        this.formData.category = '';
        this.formData.visibility = "";
        this.imgDataUrl = "";
        this.selectedFile = [];
        this.closeModal();
  
        // this.$router.push("/studio");
        // this.$router.push({ name: 'SingerStudio' });
      },
      // async getCategories() {
      //   this.categoryLoading = true;
      //   const categories = await CategoryService.getAll()
      //     .catch((err) => {
      //       console.log(err);
      //     })
      //     .finally(() => (this.categoryLoading = false));
  
      //   this.categoriesTitles = categories.data.data.map((category) => {
      //     return category.title;
      //   });
      //   this.categories = categories.data.data;
      // },
      async getHashTags() {
        this.hashTagLoading = true
        const hashTags = await HashTagService.getAll()
          .catch((err) => {
            console.log(err)
          })
          .finally(() => (this.hashTagLoading = false))

        this.hashTagTitles = hashTags.data.map((hashTag) => {
          return hashTag.title
        })
        this.hashTags = hashTags.data
      },
      closeModal() {
        this.$emit("closeDialog");
      },
      selectFile() {
        this.$refs.fileInput.$refs.input.click();
      },
      toggleShow() {
        this.show = !this.show;
      },
      cropSuccess(imgDataUrl, field) {
        console.log("-------- crop success --------");
        console.log(field);
        this.imgDataUrl = imgDataUrl;
      },
      cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
      cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			},
      categoryId() {
        return this.categories.indexOf(this.formData.category) + 1
      },
      convertStatus() {
       if (this.formData.visibility === 'Public') {
         return 'is_public'
       } else if (this.formData.visibility === 'Private') {
         return 'unpublic'
       } else {
         return 'scheduling'
       }
      },
      updateTime(value) {
      this.formData.upload_video_at = value
      }
    },
    components: {
      myUpload, DateTimePicker
    },
    mounted() {
      // this.getCategories();
      this.getHashTags()
    },
  }
  </script>
  
  <style lang="scss">
  #modal-header {
    border-bottom: 1px solid rgb(238, 232, 232);
  }
  
  #image-placeholder {
    padding-top: 8em;
    padding-bottom: 8em;
    border: 2px dashed rgb(209, 209, 209);
  }
  .dateWrap {
    background: #f0f0f0;
    .title {
      font-size: 12px !important;
      font-weight: 350;
      margin: 0 0 0 10px !important;
    }
    .date {
      color: #21375a !important;
    }
  }
  </style>
  