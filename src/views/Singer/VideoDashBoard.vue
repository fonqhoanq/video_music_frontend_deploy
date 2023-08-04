<template>
  <v-card class="transparent" flat>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card class="mx-auto" outlined>
          <v-card-title class="pl-5">Recent subscribers</v-card-title>  
          <v-card-actions class="d-block ml-2">
            <v-btn color="blue" text @click="subscribersDialog = true">
              See all
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col col="12" sm="6" md="8">
        <div class="wrap">
          <v-select
            v-model="selected"
            :items="timeItems"
            chips
            small-chips
            solo
            dense
            outlined
            class="mt-5 select"
            @change="getViewWeeklyChartData"
          ></v-select>
          <line-chart
            :labels="viewWeeklyLabels"
            :data-list="viewWeeklyData" 
            title-text="Daily View Chart" 
            label-text="Views"
          ></line-chart>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-4"></v-divider>
    <v-row>
      <v-col col="12" sm="12" md="12">
        <line-chart 
          :labels="viewYearlyLabels" 
          :data-list="viewYearlyData" 
          title-text="Monthly View Chart"
          label-text="Views"
        ></line-chart>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          class="elevation-3"
        ></v-data-table>
      </v-col>
    </v-row>
    <subscribers-modal
        :open-dialog="subscribersDialog"
        @closeDialog="subscribersDialog = false"
      />
  </v-card>
</template>

<script>
import SubscribersModal from '@/components/SubscribersModal'
import LineChart from '@/components/charts/LineChart.vue'
import { mapGetters } from 'vuex'
import SingerService from '@/services/SingerService'
import moment from 'moment'
export default {
  name: 'VideoDashBoard',
  components: {
    LineChart,
    SubscribersModal
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
  data: () => ({
    subscribersDialog: false,
    timeItems: ['This week', 'Last week'],
    selected: 'This week',
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
    headers: [
      { text: 'Content', value: 'content', align: 'start' },
      { text: 'Total monthly views', value: 'monthly', align: 'center' },
      { text: 'Total weekly views', value: 'weekly', align: 'center' },
      { text: 'Today views', value: 'today', align: 'center' }
    ],
    items: [{
      content: 'Total',
      monthly: 0,
      weekly: 0,
      today: 0
    }],
  }),
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
      this.viewWeeklyData.length = 0
      this.viewWeeklyLabels.length = 0
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
        const dayofweek = new Date().getDay()
        if (i == dayofweek) {
          this.items[0].today = this.viewWeeklyData[i-1]
        }
      }

    }
  },
  created() {
    this.getViewMonthlyChartData()
    this.getViewWeeklyChartData()
  }
}
</script>
