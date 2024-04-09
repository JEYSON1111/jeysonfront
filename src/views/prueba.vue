<template>
  <vx-card
  >


      <vs-divider>Grafico estadístico</vs-divider>
      <p style="display: none;">{{ series }}</p>
      <div id="chart" style="width: 100%;">
      <apexchart
        type="bar"
        height="430"
        :options="options"
        :series="[series[0]]"
      ></apexchart>
    </div>
  </vx-card>
</template>
<script>
import chart from "vue-apexcharts";
import moment from 'moment'
export default{
  components: { apexchart: chart },
  data(){
      return{
          arregloTransabilidad:[],
          tmpArreglo:[],
          datosMostrar:[],
          series: [{
            data: [44, 55, 41, 64, 22, 43, 21]
          }, {
            data: [53, 32, 33, 52, 13, 44, 32]
          }],
          options: {
            chart: {
              type: 'bar',
              height: 430,
            },
            plotOptions: {
              bar: {
                horizontal: true,
                dataLabels: {
                  position: 'top',
                },
              }
            },
            dataLabels: {
              enabled: true,
              offsetX: -6,
              style: {
                fontSize: '12px',
                colors: ['#fff']
              }
            },
            stroke: {
              show: true,
              width: 1,
              colors: ['#fff']
            },
            tooltip: {
              shared: true,
              intersect: false
            },
            xaxis: {
              categories: ['Universidad pruebas xd Pera', 'Manzana', 'Melon', 'Papaya', 'Queso', 'Atun', 'Jugo'],
              labels: {
                useHTML: true,
              },
            },
            yaxis: {
              labels: {
                useHTML: true,
              },
            },
          },
      }
  },
  props:{
      pedido:{
          type:Array,
          default:{}
      },
  },
  created(){
      let me = this;
  },
  mounted(){
      let me = this

  },
  methods:{

  }
}
</script>
