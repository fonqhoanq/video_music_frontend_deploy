<template>
    <div id="dashboard" class="pa-4">
      <studio-nav-bar/>
      <v-container fluid>
        <div class="d-flex justify-space-between mb-5">
          <h2 @click="showData">channel dashboard</h2>
          <div class="right">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  @click="dialog = true"
                  class="mr-4 white"
                  icon
                  v-on="{ ...tooltip }"
                  ><v-icon size="25" class="small">mdi-upload</v-icon></v-btn
                >
              </template>
              <span>Upload video</span>
            </v-tooltip>
          </div>
        </div>
        <v-card flat class="transparent">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            show-arrows
            
            center-active
          >
            <v-tab v-for="(item, i) in titleItems" :key="i">
              {{ item }}
            </v-tab>
          </v-tabs>
  
          <v-container fluid>
            <v-tabs-items v-model="tab" class="transparent">
              <v-tab-item>
                <video-dash-board></video-dash-board>
              </v-tab-item>
              <v-tab-item>
                <subscriber-dash-board></subscriber-dash-board>    
              </v-tab-item>
              <v-tab-item>
                <watched-hour-dash-board></watched-hour-dash-board>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-card>
      </v-container>
      <upload-modal
        :open-dialog="dialog"
        v-on:closeDialog="dialog = false"
        v-on:openSnackbar=" snackbar = true"
        v-on:reloadPage="reloadPage"
      />
      <v-snackbar  :timeout="timeout" v-model="snackbar">
        {{ uploadMessage }}
      </v-snackbar>
    </div>
  </template>
  
  <script>
  // import SubscribersModal from '@/components/SubscribersModal'
  import UploadModal from '@/components/UploadVideoModal.vue'
  import StudioNavBar from '@/components/Singers/StudioNavBar.vue'
  import SingerService from '@/services/SingerService'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import SubscriberDashBoard from './SubscriberDashBoard.vue'
  import WatchedHourDashBoard from './WatchedHourDashBoard.vue'
  import VideoDashBoard from './VideoDashBoard.vue'
  export default {
    name: 'SingerDashBoard',
    data: () => ({
      uploadMessage: 'Upload video successfully!',
      timeout: 4000,
      snackbar: false,
      titleItems: ['Videos', 'Viewer and subscribers', 'Watched hours'],
      viewWeeklyLabels: [],
      viewWeeklyData: [],
      viewYearlyLabels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov'
      ],
      viewYearlyData: [],
      tab: null,
      loading: true,
      dialog: false,
      subscribersDialog: false,
      headers: [
        { text: 'Content', value: 'content', align: 'start' },
        { text: 'Total monthly views', value: 'monthly', align: 'center' },
        { text: 'Total weekly views', value: 'weekly', align: 'center' },
        { text: 'Today views', value: 'today', align: 'center' }
      ],
      totalMonthlyViews: 0,
      totalWeeklyViews: 0,
      todayViews: 0,
      items: [{
        content: 'Total',
        monthly: 0,
        weekly: 0,
        today: 0
      }],
      genderChartLabels: ['Male', 'Famale'],
      genderData: [10, 20],
      genderColors: ['rgba(179,181,198,0.4)', 'rgba(255,99,132,0.4)'],
      ageLabel: ['10-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50',  '51-55', '55+'],
      ageData: [10, 20, 90,30, 80, 50, 60, 40, 70, 100],

    }),
    components: {
      UploadModal,
      StudioNavBar,
      // SubscribersModal,
      SubscriberDashBoard,
      WatchedHourDashBoard,
      VideoDashBoard
    },
    computed: {
      ...mapGetters(['getCurrentSinger', 'getUrl']),
      weeklyData () {
        return this.viewWeeklyData
      },
      weeklyLabels () {
        return this.viewWeeklyLabels
      }
    },
    methods: {
      async getViewMonthlyChartData() {
        const chartData = await SingerService.getMonthlyViewChart({
          id: this.getCurrentSinger.id,
          year: 2023
        })
        .catch(err => {
          console.log(err)
        })
        if (!chartData) return
        chartData.data.forEach(item => {
          this.viewYearlyData[item.month - 1] = item.views
        })
        for (let i = 0; i < 12; i++) {
          if (!this.viewYearlyData[i]) {
            this.viewYearlyData[i] = 0
          }
          this.items[0].monthly += this.viewYearlyData[i]
        }
        console.log(this.viewYearlyData)
      },
      async getViewWeeklyChartData() {
        const chartData = await SingerService.getWeeklyViewChart({
          id: this.getCurrentSinger.id,
          year: 2023,
          this_week: this.selected == 'This week' ? true : false
        })
        .catch(err => {
          console.log(err)
        })
        if (!chartData) return
        // this.viewWeeklyLabels = []
        // this.viewWeeklyData = []
        for (var i = 1; i <= 7; i++) {
          if (this.selected == 'This week')
            this.viewWeeklyLabels.push(moment().day(i).format('D/M'))
          else if (this.selected == 'Last week') {
            this.viewWeeklyLabels.push(moment().day(i).subtract(7, 'days').format('D/M'))
          }
          this.viewWeeklyData.push(0);
        }
        for (var j = 1; j <= 7; j++) {
          if (this.selected == 'Last week') {
            chartData.data.forEach(item => {
              if (item.day == moment().day(j).subtract(7, 'days').format('D')) {
                this.viewWeeklyData[j - 1] = item.views
              }
            })
          } else {
            chartData.data.forEach(item => {
              if (item.day == moment().day(j).format('D')) {
                this.viewWeeklyData[j - 1] = item.views
              }
            })
          }
        }
        for (let i = 0; i < 7; i++) {
          this.items[0].weekly += this.viewWeeklyData[i]
        }
        this.items[0].today = this.viewWeeklyData[6]
        console.log('this.viewWeeklyLabels')
        console.log(this.viewWeeklyLabels)
        console.log(this.viewWeeklyData)
      },
      showData() {
        console.log(this.viewWeeklyLabels)
        console.log(this.viewWeeklyData)
      },
      reloadPage() {
        // window.location.reload()
        window.setInterval(() => {
          window.location.reload()
        }, 4000)
      },
    },
    created() {
      this.getViewMonthlyChartData()
      this.getViewWeeklyChartData()
    },
    mounted() {
    }
  }
  </script>
  
  <style lang="scss">
  .card {
    background: #f9f9f9 !important;
  }
  .select {
    width: 150px;
  }
  .wrap {
    display: flex;
    position: relative;
    .select {
      width: 150px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .pie {
    width: 80% !important;
    height: 80% !important;
  }
  </style>
  