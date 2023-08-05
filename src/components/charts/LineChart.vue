<template>
  <LineChart :data="chartData" :options="chartOptions"  />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js/auto'
import { Line as LineChart } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'App',
  components: {
    LineChart
  },
  props: {
    labels: {
      type: Array,
      required: true
    },
    dataList: {
      type: Array,
      required: true
    },
    titleText: {
      type: String,
      default: 'Custom Chart Title'
    }, 
    labelText: {
      type: String,
      default: 'Label'
    }
  },
  watch: {
    labels: {
      handler() {
        this.dataLine.labels = this.labels
      },
      immediate: true
    },
    dataList: {
      handler() {
        this.dataLine.datasets[0].data = this.dataList
      },
      immediate: true
    }
  },
  data() {
    return {
      dataLine: {
        labels: this.labels,
        datasets: [
          {
            label: this.labelText,
            backgroundColor: '#f87979',
            data: this.dataList
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: true,
                text: this.titleText,
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
      }
    }
  },
  computed: {
    chartData() {
      return this.dataLine
    },
    chartOptions() {
      return this.options
    }
  },
  mounted() {
    this.renderChart(this.dataLine, this.options)
  }
}
</script>
