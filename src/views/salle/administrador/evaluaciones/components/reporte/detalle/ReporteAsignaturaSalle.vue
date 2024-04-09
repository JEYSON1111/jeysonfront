<template>
  <div>
    <vx-card class="mb-base" :title="'Área: ' + area_selected" subtitle="Seleccione una área para visualizar sus información">
      <!-- <div class="chips_selects" :style="'cursor: pointer; color: white; margin: 3px; padding: 3px 6px 3px 2px; border-radius: 20px; display: inline-block; background-color: '+colores[index]" :key="index" v-for="(chip, index) in key_areas" @click="getPromedioAsignaturas(chip)">
        <div style="font-size: 12px; display: inline-block; background-color: #d5d5d5; border-radius: 100%; width: 27px; padding-top: 5px; padding-bottom: 5px; text-align: center; margin-right: 2px;"> {{(chip.nombre_area).substr(0,2).toUpperCase()}} </div>
        {{chip.nombre_area}}
      </div> -->
      <div class="chips_selects" :style="'cursor: pointer; color: white; margin: 3px; padding: 3px 6px 3px 2px; border-radius: 20px; display: inline-block; background-color: #99A4C9;'" :key="index" v-for="(chip, index) in key_areas" @click="getPromedioAsignaturas(chip)">
        <div style="font-size: 12px; display: inline-block; background-color: #d5d5d5; border-radius: 100%; width: 27px; padding-top: 5px; padding-bottom: 5px; text-align: center; margin-right: 2px;"> {{(chip.nombre_area).substr(0,2).toUpperCase()}} </div>
        {{chip.nombre_area}}
      </div>
    </vx-card>
    <!--PROMEDIO POR ASIGNATURAS-->
    <vx-card v-if="area_selected" title="Promedios por asignaturas" subtitle="Comparación de asignaturas del área seleccionada" class="mb-base">
      <vue-apex-charts type="bar" height="350" :options="barChart.chartOptions" :series="barChart.series"></vue-apex-charts>
    </vx-card>
    <!--SELECCIONAR REPORTE POR ASIGNATURAS-->
    <!-- <vx-card class="mb-base" :title="'Asignatura: ' + asignatura_selected" subtitle="Seleccione una asignatura para visualizar sus información">
      <div class="chips_selects" :style="'cursor: pointer; color: white; margin: 3px; padding: 3px 6px 3px 2px; border-radius: 20px; display: inline-block; background-color: #E1B64A;'" :key="index" v-for="(chip, index) in key_asignaturas" @click="getPromedioPreguntas(chip)">
        <div style="font-size: 12px; display: inline-block; background-color: #d5d5d5; border-radius: 100%; width: 27px; padding-top: 5px; padding-bottom: 5px; text-align: center; margin-right: 2px;"> {{(chip.nombre_asignatura).substr(0,2).toUpperCase()}} </div>
        {{chip.nombre_asignatura}}
      </div>
    </vx-card> -->
    <!---->
    <!--MEJORES DOCENTES POR ASIGNATURA-->
    <div class="vx-row mb-6" v-if="area_selected">
      <div style="min-width: 400px;" class="vx-col sm:w-1/2 w-1/2 md:w-1/2 mb-3">
        <vx-card title="Top docentes asignaturas" subtitle="Docentes mejor puntuados por asignatura del área seleccionada">
          <div  style="overflow-y: scroll; overflow-x: hidden; height:450px;" id="div_top_asignatura">
            <vs-button size="small" style="padding: 7px; font-size: 12px; float: right; margin-right: 10px;" icon-pack="feather" icon="icon-download" color="#0CBFBD" @click="fileNameAs='reporte_docentes_asignaturas'; activePromptExcelAsignaturas=true">Exportar</vs-button>
            <br><br>
            <div :key="index" v-for="(evaluacion, index) in data_docentes_asignaturas" class="mb-base">
              <b style="color: #E75AE3;">{{evaluacion.nombre_docente.toUpperCase()}} </b> <b>{{evaluacion.puntaje_evaluacion}}%</b> <br>
              <div :key="indexA" v-for="(area, indexA) in evaluacion.asignaturas">
                <div style="width: 60%; display: inline-block;"><b>Asignatura: </b> <span style="color: #AC5AE7;"> {{area.nombre_asignatura}} </span></div>
                <div style="width: 40%; display: inline-block;"><b>Puntaje: </b> <span style="color: #3B76F7;"> {{area.puntaje}}% </span></div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <!--MODALES-->
    <!----modal exportar asignaturas--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcelAsignaturas" accept-text="Exportar" :active.sync="activePromptExcelAsignaturas">
      <vs-input v-model="fileNameAs" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
      </div>
    </vs-prompt>
    <!----fin modal exportar--------->
  </div>
</template>
<script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import vSelect from 'vue-select'
  import ECharts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/pie'
  import theme from '../../../theme.json'
  import VueApexCharts from 'vue-apexcharts'
  ECharts.registerTheme('ovilia-green', theme)
export default{
  data(){
    return{
      colores: ['#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0', '#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F'],
      area_selected:'',
      data_docentes_asignaturas: [],
      key_asignaturas:[],
      barChart: {},
      asignatura_selected:'',
      //variables para exportar a excel
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      selectedFormat: 'xls',
      fileNameAs: '',
      activePromptExcelAsignaturas: false,
      //fin variables para exportar a excel
    }
  },
  watch:{
    institucion_selected(results){
      let me = this;
      me.data_docentes_asignaturas  = []
      me.barChart                   = {}
      me.key_asignaturas            = []
    },
    periodoSelect(results){
      let me = this;
      me.data_docentes_asignaturas  = []
      me.barChart                   = {}
      me.key_asignaturas            = []
    }
  },
  props:{
    key_areas:{
      type:Array,
      default:[]
    },
    institucion_selected:{
      type:String,
      default:''
    },
    periodoSelect:{
      type:String,
      default:''
    },
  },
  components:{
    'v-select': vSelect,
    flatPickr,
    ECharts,
    VueApexCharts,
  },
  methods:{
    getPromedioAsignaturas(area){
      let me = this
      me.data_docentes_asignaturas  = []
      me.barChart                   = {}
      me.area_selected              = area.nombre_area
      me.$vs.loading()
      this.$http.get(this.$server_url+'salle_promedio_asignatura/'+me.periodoSelect+'/'+me.institucion_selected.idInstitucion+'/'+area.id_area)
      .then(res => {
        me.data_docentes_asignaturas = res.data.items
        if(me.data_docentes_asignaturas.length == 0){
          return
        }
        me.data_docentes_asignaturas.sort((a, b) => {
          return b.puntaje_evaluacion - a.puntaje_evaluacion;
        });
        let asignaturas = []
        $.each(res.data.items,function(key, value){
          $.each(value.asignaturas,function(keyA, valueA){
              asignaturas.push({nombre_asignatura: valueA.nombre_asignatura, puntaje: valueA.puntaje })
          });
        });
        let asignaturas_agrupadas = []
        asignaturas_agrupadas     = me.groupArrayOfObjects(asignaturas, "nombre_asignatura")
        me.key_asignaturas        = []
        let key_asignaturas_1     = []
        $.each(asignaturas_agrupadas,function(key, value){
          //obtener las asignaturas
          key_asignaturas_1.push(key)
          //obtener las asignaturas pero para recorrer con un bucle
          me.key_asignaturas.push(value[0])
        });
        var puntajes_asignaturas  = []
        var nombre_asignaturas    = []
        for( let i=0; i<key_asignaturas_1.length; i++){
          let acum_puntaje = 0
          $.each(asignaturas_agrupadas[key_asignaturas_1[i]],function(key, value){
            acum_puntaje += value.puntaje
          });
          let porcentaje_asignatura = ((acum_puntaje) / ((asignaturas_agrupadas[key_asignaturas_1[i]].length)) ).toFixed(2)
          puntajes_asignaturas.push(porcentaje_asignatura)
          nombre_asignaturas.push(key_asignaturas_1[i])
        }
        me.barChart = {}
        me.barChart = {
          series: [{
            data: puntajes_asignaturas
          }],
          chartOptions: {
            colors: ['#60C1CF', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
            plotOptions: { bar: { horizontal: true, } },
            dataLabels: { enabled: true },
            xaxis: { categories: nombre_asignaturas, }
          }
        }
        me.$vs.loading.close()
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error);
      })
    },
    groupArrayOfObjects(list, key) {
      return list.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
      }, {});
    },
    //METODOS PARA EXPORTAR EXCEL
    exportToExcelAsignaturas() {
      let me = this
      let excel_asignaturas = []
      $.each(me.data_docentes_asignaturas, function(key, value){
        $.each(value.asignaturas,function(keyA, valueA){
            excel_asignaturas.push({ nombre_docente: value.nombre_docente, nombre_asignatura: valueA.nombre_asignatura, puntaje: valueA.puntaje})
        });
      });
      let headerTitle = ['Docente', 'Asignatura', 'Puntaje'];
      let headerVal = ['nombre_docente', 'nombre_asignatura', 'puntaje'];
      import('@/vendor/Export2Excel').then(excel => {
        const list = excel_asignaturas
        const data = this.formatJson(headerVal, list)
        excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileNameAs,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
        })
      })
    },
    clearFields() {
      this.fileNameAs = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
  }
}
</script>
