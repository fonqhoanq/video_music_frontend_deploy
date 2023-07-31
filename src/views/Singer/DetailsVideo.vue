<template>
  <div id="video-details" class="pa-4">
    <v-container>
      <!-- <div class="d-flex justify-space-between mb-5"> -->
      <v-btn text small class="pl-0" @click="$router.go(-1)"
        ><v-icon left>mdi-arrow-left</v-icon> Channel videos</v-btn
      >
      <template>
        <v-alert
          v-if="!validDate"
          type="error"
        >Invalid schedule time. Please select a future date and time</v-alert>
      </template>
      <h2 class="mt-5">Video details</h2>
      <v-row>
        <v-col cols="8">
          <ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
            <form @submit.prevent="handleSubmit(submit)" @reset.prevent="reset">
              <ValidationProvider
                v-slot="{ errors }"
                name="Title"
                rules="required|min:10|max:100"
              >
                <v-text-field
                  :loading="inputLoading"
                  v-model="formData.title"
                  :error-messages="errors"
                  label="Title (required)"
                  class="mb-3"
                  filled
                  dense
                  counter="100"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Description"
                rules="required|min:30|max:800"
              >
                <v-textarea
                  :loading="inputLoading"
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
                v-if="formData.visibility !== 'Schedule'"
                v-slot="{ errors }"
                name="Visibilty"
                rules="required|oneOf:Private,Public,Schedule"
              >
                <v-select
                  :loading="inputLoading"
                  :items="visibility"
                  :error-messages="errors"
                  filled
                  label="Visibilty"
                  :value="formData.visibility"
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
                    :model-value="formData.upload_video_at" 
                    v-on:invalidDate="validDate = false"
                    v-on:validDate="validDate = true"
                    @update-value="updateTime" 
                  />                  
                </div>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Cateogry"
                rules="required|min:3"
              >
                <v-select
                  :loading="categoryLoading"
                  :items="categoriesTitles"
                  :error-messages="errors"
                  filled
                  label="Categories"
                  v-model="formData.category"
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
                  :disabled="!validDate"
                  depressed
                  >Submit</v-btn
                >
              </div>
            </form>
          </ValidationObserver>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn text @click="toggleShow">Upload Thumbnails</v-btn>
          <my-upload
            field="thumbnails"
            @crop-success="cropSuccess"
            method="POST"
            v-model="show"
            :width="1280"
            :height="720"
            :url="url"
            :headers="headers"
            img-format="jpg"
            langType="en"
          ></my-upload>
          <v-responsive style="max-width: 100%">
            <div v-if="!imgDataUrl" class="px-12" id="image-placeholder">
              <v-icon>mdi-image-plus</v-icon>
            </div>
            <v-img v-else height="350" :src="imgDataUrl"></v-img>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import VideoService from '@/services/VideoService'
import CategoryService from '@/services/CategoryService'
import { mapGetters } from 'vuex'
import HashTagService from '@/services/HashTagService'
import DateTimePicker from '@/components/parts/DateTimePicker'

export default {
  name: 'DetailsVideo',
  data() {
    return {
      // dialog: this.openDialog ? this.openDialog : false,
      inputLoading: false,
      submitLoading: false,
      categoryLoading: false,
      hashTagLoading: false,
      validDate: true,
      value: 0,
      show: false,
      rules: [
        (value) =>
          !value ||
          value.size < 5000000 ||
          'Video size should be less than 5 MB!'
      ],
      categoriesTitles: [],
      categories: [],
      hashTagTitles: [],
      hashTags: [],
      visibility: ['Public', 'Private'],
      formData: {
        title: '',
        description: '',
        category: '',
        visibility: ''
      },
      // imgDataUrl: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',

      imgDataUrl: '',
      url: '',
      headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser', 'getUrl']),
  },
  methods: {
    async getVideo() {
      this.inputLoading = true
      let video = await VideoService.getById(this.$route.params.id)
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.inputLoading = false
        })

      if (!video) return
      video = video.data
      this.url = `${this.getUrl}videos/${video.id}/thumbnails`

      this.formData.title = video.title
      this.formData.description = video.description
      this.formData.visibility = this.convertToVisibility(video.status)
      this.formData.category = video.category_title
      this.formData.upload_video_at = video.upload_video_at
      this.formData.hashTags = video.hashTags.map(function(item) {
        return item['title'];
      });
      this.imgDataUrl = `${this.getUrl}${video.thumbnails}`
    },
    async submit() {
      // if (this.$route.name === 'Dashboard')
      this.submitLoading = true
      if (!this.validDate) {
        this.submitLoading = false
        return
      }
      this.formData.category = this.categories.find(
        (category) => category.title === this.formData.category
      ).id
      this.formData.hashTags = this.formData.hashTags.map((hashtag) => {
        return this.hashTags.find((hashTag) => hashTag.title === hashtag).id
      })
      
      const video = await VideoService.updateVideo(this.$route.params.id, {
        video: {
          title: this.formData.title,
          description: this.formData.description,
          category_id: this.formData.category,
          video_status: this.convertStatus(this.formData.visibility),
          hash_tags: this.formData.hashTags,
        },
        upload_video_at: this.formData.upload_video_at

      })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => (this.submitLoading = false))

      if (!video) return

      this.$router.push('/singer/videos')
    },
    async getCategories() {
      this.categoryLoading = true
      const categories = await CategoryService.getAll()
        .catch((err) => {
          console.log(err)
        })
        .finally(() => (this.categoryLoading = false))

      this.categoriesTitles = categories.data.map((category) => {
        return category.title
      })
      this.categories = categories.data
    },
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
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      console.log(field)
      this.imgDataUrl = imgDataUrl
    },
    categoryId() {
      return this.categories.indexOf(this.formData.category)
    },
    convertStatus(name) {
      if (name === 'Public') {
        return 'is_public'
      } else if (name === 'Private') {
        return 'unpublic'
      } else {
        return 'scheduling'
      }
    },
    convertToVisibility (name) {
      if (name === 'is_public') {
        return 'Public'
      } else if (name === 'unpublic') {
        return 'Private'
      } else {
        return 'Schedule'
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
    this.getVideo()
    this.getCategories()
    this.getHashTags()
  }
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
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
