<template>
  <vx-card
  class="mt-5"
  >
    <div v-if="columnInstituciones.length  == 0">
      <p>No hay datos que mostrar</p>
    </div>
    <div id="chart" style="width: 100%;" v-else>
      <apexchart type="bar" height="500" :options="columnInstituciones.chartOptions" :series="columnInstituciones.series"></apexchart>
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
          },
        },
        yaxis: {
          labels: {
          },
        },
      },
      //VARIABLES NORMALES
      columnInstituciones: [],
    }
  },
  props:{
    n_evaluacion:{
      type:Number,
      default:0
    },
  },
  watch:{
    n_evaluacion(results){
      let me = this;
      if(results == null || results == "null" || results == "" || results == undefined ){
        me.promedio_instituciones = []
        me.columnInstituciones    = []
        return
      }
      me.getReporteInstituciones()
    }
  },
  created(){
      let me = this;
  },
  mounted(){
    let me = this
    // me.getReporteInstituciones()
  },
  methods:{
    getReporteInstituciones(){
      let me = this
      me.promedio_instituciones = []
      me.columnInstituciones    = []
      me.$vs.loading()
      this.$http.get(this.$server_url+'reporte_evaluaciones_institucion/'+me.n_evaluacion)
      .then(res => {
          me.promedio_instituciones = res.data.items
          let promedios = []
          let instituciones = []
          $.each(me.promedio_instituciones,function(key, value){
              promedios.push(value.puntaje)
              instituciones.push(value.nombreInstitucion)
              // me.pie.series[0].data.push({
              //     value: value.puntaje,
              //     name: value.nombreInstitucion
              // })
          });
          me.columnInstituciones = {
            series: [{
              name: 'Promedio',
              data: promedios
            }],
            chartOptions: {
              colors: ['#28C76F'],
              // chart: { type: 'bar', height: 50,  },
              plotOptions: { bar: { horizontal: true, endingShape: 'rounded', columnWidth: '75%', },  },
              dataLabels: { enabled: true , formatter: function (val, opts) { return val + "%" },},
              stroke: { show: true, width: 1, colors: ['transparent'] },
              xaxis: { categories: instituciones },
              yaxis: {  labels: { maxWidth: 500, style: { fontSize: '9px'}, }, },
              fill: { opacity: 1 },
              tooltip: { y: { formatter: function(val) { return val + "%" } } }
            }
          }
          me.$vs.loading.close()
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
  }
}
</script>
