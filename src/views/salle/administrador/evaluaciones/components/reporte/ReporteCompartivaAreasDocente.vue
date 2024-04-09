<template>
  <div>
    <div class="vx-row">
      <div class="vx-col sm:w-full mb-base">
        <!-- <vx-card title="Promedios por áreas"  v-if="data_docentes_areas.length > 0" subtitle="Comparación de promedios de todas las áreas de la institución seleccionada">
          <vue-apex-charts type="bar" height="350" :options="columnChart.chartOptions" :series="columnChart.series"></vue-apex-charts>
          <br>
        </vx-card> -->
        <div class="vx-row mb-6" v-if="data_docentes_areas.length > 0">
          <!--TOP DOCENTES POR AREAS-->
          <div style="min-width: 400px;" class="vx-col sm:w-full w-full md:w-full mb-3">
            <vx-card title="Top docentes áreas" subtitle="Docentes mejor puntuados por area">
                <div  style="overflow-y: scroll; overflow-x: hidden; height:450px;" id="div_top_area">
                  <vs-button size="small" style="padding: 7px; font-size: 12px; float: right; margin-right: 10px;" icon-pack="feather" icon="icon-download" color="#0CBFBD" @click="fileName='reporte_docentes_areas'; activePromptExcel=true">Exportar</vs-button>
                  <br><br>
                  <div :key="index" v-for="(evaluacion, index) in data_docentes_areas" class="mb-base">
                    <b style="color: #0CBFBD;">{{evaluacion.nombre_docente.toUpperCase()}} </b> <b>{{evaluacion.puntaje_evaluacion}}%</b> <br>
                    <div :key="indexA" v-for="(area, indexA) in evaluacion.areas">
                        <div style="width: 60%; display: inline-block;"><b>Área: </b> <span style="color: #3477E7;"> {{area.nombre_area}} </span></div>
                        <div style="width: 40%; display: inline-block;"><b>Puntaje: </b> <span style="color: #8B34E7;"> {{area.puntaje}}% </span> </div>
                    </div>
                  </div>
                </div>
            </vx-card>
          </div>
          <!--REPORTE MEJORES DOCENTES-->
          <div style="min-width: 400px;" class="vx-col sm:w-full w-full md:w-full mb-3">
            <vx-card title="Top docentes" subtitle="Docentes mejor puntuados en calificacion final">
              <div  style="overflow-y: scroll; overflow-x: hidden; height:450px;" id="div_top_1">
              <vue-apex-charts type="bar" height="3000" :options="barChartTopDoc.chartOptions" :series="barChartTopDoc.series"></vue-apex-charts>
              </div>
            </vx-card>
          </div>
        </div>
        <!--SELECCIONAR AREA PARA REPORTE POR ASIGNATURAS-->
        <!-- <div v-if="key_areas.length > 0">
          <ReporteAsignaturaSalleVue :key_areas="key_areas" :institucion_selected="institucion_selected" :periodoSelect="periodoSelect"/>
        </div> -->
      </div>
    </div>
    <!--MODALES-->
    <!----modal exportar--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" :active.sync="activePromptExcel">
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
      </div>
    </vs-prompt>
    <!----fin modal exportar--------->
  </div>
</template>
<script>
  import ReporteAsignaturaSalleVue from '@/views/salle/administrador/evaluaciones/components/reporte/detalle/ReporteAsignaturaSalle'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import vSelect from 'vue-select'
  import ECharts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/pie'
  import theme from '../../theme.json'
  import VueApexCharts from 'vue-apexcharts'
  ECharts.registerTheme('ovilia-green', theme)
export default{
  data(){
    return{
      //variables areas
      data_docentes_areas:[],
      columnChart: {},
      key_areas:[],
      //fin variables areas
      //variables mejores docentes
      barChartTopDoc: {},
      //fin variables mejores docentes
      //variables para exportar a excel
      activePromptExcel: false,
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      selectedFormat: 'xls',
      fileNameAs: '',
      //fin variables para exportar a excel
    }
  },
  components:{
    'v-select': vSelect,
    flatPickr,
    ECharts,
    VueApexCharts,
    ReporteAsignaturaSalleVue,
  },
  props:{
    institucion_selected:{
      type:String,
      default:''
    },
    periodoSelect:{
      type:String,
      default:''
    },
    searchReporte:{
      type:Boolean,
      default:false,
    }
  },
  watch:{
    institucion_selected(results){
      let me = this;
      me.data_docentes_areas = []
      me.columnChart         = {}
      me.key_areas           = []
      me.barChartTopDoc      = {}
      if(results && me.periodoSelect){
        me.getPromedioAreas()
      }
    },
    periodoSelect(results){
      let me = this;
      me.data_docentes_areas = []
      me.columnChart         = {}
      me.key_areas           = []
      me.barChartTopDoc      = {}
      if(results && me.institucion_selected){
        me.getPromedioAreas()
      }
    },
    searchReporte(results){
      let me = this
      me.data_docentes_areas = []
      me.columnChart         = {}
      me.key_areas           = []
      me.barChartTopDoc      = {}
      if(me.periodoSelect && me.institucion_selected){
        me.getPromedioAreas()
      }
    }
  },
  mounted(){
    let me = this;
  },
  methods: {
    getPromedioAreas(){
      let me = this
      me.data_docentes_areas = []
      me.columnChart         = []
      me.$vs.loading()
      this.$http.get(this.$server_url+'salle_promedio_areas/'+me.periodoSelect+'/'+me.institucion_selected.idInstitucion)
      .then(res => {
        if(res.data.length == 0){
          me.$vs.loading.close()
          this.$vs.notify({
          text:'No se encontro datos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.data_docentes_areas = res.data.items
        me.data_docentes_areas.sort((a, b) => {
          return b.puntaje_evaluacion - a.puntaje_evaluacion;
        });
        //grafico mejores docentes por areas
        me.graficoTopDocAreas()
        let areas = []
        //obtener los puntajes de todas las evaluaciones por area de los docentes
        $.each(res.data.items,function(key, value){
          $.each(value.areas,function(keyA, valueA){
            areas.push({ nombre_area: valueA.nombre_area, puntaje: valueA.puntaje, id_area: valueA.id_area })
          });
        });
        // console.log("ar",areas)
        let areas_agrupadas = []
        areas_agrupadas = me.groupArrayOfObjects(areas, "nombre_area")
        // console.log("or",areas_agrupadas)
        me.key_areas = []
        let key_areas_1 = []
        $.each(areas_agrupadas,function(key, value){
          key_areas_1.push(key)
          me.key_areas.push(value[0])
        });
        // console.log("uno",key_areas_1)
        // console.log("dos",me.key_areas)
        let puntajes_areas = []
        let nombre_areas = []
        for( let i=0; i<key_areas_1.length; i++){
          let acum_puntaje = 0
          $.each(areas_agrupadas[key_areas_1[i]],function(key, value){
            acum_puntaje += value.puntaje
          });
          let porcentaje_area = ((acum_puntaje * 100) / ((areas_agrupadas[key_areas_1[i]].length) * 100) ).toFixed(2)
          puntajes_areas.push(porcentaje_area)
          nombre_areas.push(key_areas_1[i])
        }
        console.log("fi1",puntajes_areas)
        console.log("fi2",nombre_areas)
        me.columnChart = {
          series: [{
            name: 'Promedio',
            data: puntajes_areas
          }],
          chartOptions: {
            colors: ['#E6AD4A','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0'],
            plotOptions: { bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%', }, },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: { categories: nombre_areas },
            yaxis: { title: { text: '(Promedio)' } },
            fill: { opacity: 1 },
          tooltip: { y: { formatter: function(val) { return val + "%" } } }
          }
        }
        me.$vs.loading.close()
      })
      .catch(function (error) {
        console.log(error);
        me.$vs.loading.close()
      })
    },
    groupArrayOfObjects(list, key) {
      return list.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    graficoTopDocAreas(){
      let me = this
      let puntaje_evaluaciones  = []
      let nombre_docentes       = []
      $.each(me.data_docentes_areas,function(key, value){
        puntaje_evaluaciones.push(value.puntaje_evaluacion)
        nombre_docentes.push(value.nombre_docente)
      });
      me.barChartTopDoc = {}
      me.barChartTopDoc = {
        series: [{
          data: puntaje_evaluaciones
        }],
        chartOptions: {
          colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
          plotOptions: { bar: { horizontal: true, } },
          dataLabels: { enabled: true },
          xaxis: { categories: nombre_docentes, }
        }
      }
    },
    //METODOS PARA EXPORTAR A EXCEL
    exportToExcel() {
      let me = this
      let excel_areas = []
      $.each(me.data_docentes_areas,function(key, value){
        $.each(value.areas,function(keyA, valueA){
            excel_areas.push({ nombre_docente: value.nombre_docente, nombre_area: valueA.nombre_area, puntaje: valueA.puntaje})
        });
      });
      let headerTitle = ['Docente', 'Area', 'Puntaje'];
      let headerVal = ['nombre_docente', 'nombre_area', 'puntaje'];
      import('@/vendor/Export2Excel').then(excel => {
        const list = excel_areas
        const data = this.formatJson(headerVal, list)
        excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileName,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
        })
      })
    },
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
  },
}
</script>
<style scoped>
.chips_selects:hover{
    background-color: black !important;
}
#div_top_1::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#div_top_1::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_top_1::-webkit-scrollbar-thumb {
  background: #ff2aa6;
  border-radius: 10px;
}

/* Handle on hover */
#div_top_1::-webkit-scrollbar-thumb:hover {
  background: #ff2da8;
}
#div_top_area::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#div_top_area::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_top_area::-webkit-scrollbar-thumb {
  background: #2ee982;
  border-radius: 10px;
}

/* Handle on hover */
#div_top_area::-webkit-scrollbar-thumb:hover {
  background: #2ee982;
}

#div_top_asignatura::-webkit-scrollbar {
  width: 10px;
}
/* Track */
#div_top_asignatura::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_top_asignatura::-webkit-scrollbar-thumb {
  background: #773BF7;
  border-radius: 10px;
}

/* Handle on hover */
#div_top_asignatura::-webkit-scrollbar-thumb:hover {
  background: #773BF7;
}
</style>

