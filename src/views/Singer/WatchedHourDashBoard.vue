<template>
  <div>
    <v-row class="mt-6">
      <v-col col="12" sm="3" md="1"></v-col>
      <v-col col="12" sm="3" md="3">
        <pie-chart
          :labels="favoriteLabels"
          :data-list="favoriteData"
          title-text="Video Quality Chart"
          :colors="genderColors"
        ></pie-chart>
      </v-col>
      <v-col col="12" sm="3" md="1"></v-col>
      <v-col col="12" sm="3" md="7">
        <bar-chart
          :labels="viewYearlyLabels"
          :data-list="hoursData"
          title-text="Watched Hours Chart"
          label-text="Hours"
        ></bar-chart>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" sm="12" md="12">
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          class="elevation-3"
        ></v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import SingerService from '@/services/SingerService'
import { mapGetters } from 'vuex'

export default {
  name: 'WatchedHourDashBoard',
  components: {
      PieChart,
      BarChart
  },
  data: () => ({
    favoriteLabels: ['Like', 'Dislike'],
    favoriteData: [],
    hoursData: [],
    // hoursData: [10, 20, 90,30, 80, 50, 60, 40, 70, 100],
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
    genderColors: ['rgba(255,99,132,0.4)', 'rgba(179,181,198,0.4)'],
    ageData: [10, 20, 90,30, 80, 50, 60, 40, 70, 100],
    headers: [
      { text: 'Content', value: 'content', align: 'start' },
      { text: 'Watched hours', value: 'hours', align: 'center' },
      { text: 'Current month hours', value: 'current', align: 'center' },
      { text: 'Likes', value: 'likes', align: 'center' },
      { text: 'Dislikes', value: 'dislikes', align: 'center' }
    ],
    items: [{
      content: 'Total',
      hours: 0,
      likes: 0,
      dislikes: 0,
      current: 0
    }],
  }),
  computed: {
    ...mapGetters(['getCurrentSinger', 'getUrl']),
  },
  methods: {
    async getWatchedHourData() {
      const hourData = await SingerService.getWatchedHourChart({
        id: this.getCurrentSinger.id,
        year: 2023
      })

      if (!hourData) {
        return
      }
      hourData.data.forEach((item) => {
        this.hoursData[item.month - 1] = item.total/60
      })
      const d = new Date();
      let month = d.getMonth()
      for (let i = 0; i < 12; i++) {
        if (!this.hoursData[i]) {
          this.hoursData[i] = 0
        }
        this.items[0].hours += this.hoursData[i]
        if (month == i) {
          this.items[0].current = parseFloat(this.hoursData[i]).toFixed(2)
        }
      }
      this.items[0].hours = parseFloat(this.items[0].hours).toFixed(2)
    },
    async getFeelingData() {
      const feelingData = await SingerService.getFeelingChart({
        id: this.getCurrentSinger.id,
      })

      if (!feelingData) {
        return
      }
      this.favoriteData[0] = this.items[0].likes = feelingData.data[0].like_count
      this.favoriteData[1] = this.items[0].dislikes = feelingData.data[0].dislike_count
    },
  },
  created() {
    this.getWatchedHourData()
    this.getFeelingData()
  }
}
</script>
