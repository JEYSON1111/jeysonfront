<template>
  <div>
    <vx-card title="Detalle Reporte" title-color="success" class="mb-base mt-2" subtitle="Reporte por áreas, asignaturas, etc">
      <div class="vx-row mr-1">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <span class="ml-5">Seleccione el periodo Evaluacion</span>
            <v-select :options="arregloPeriodos"  :reduce="arregloPeriodos => arregloPeriodos.id" label="nombre" class="w-full p-2" v-model="periodoSelect" />
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <span class="ml-5">Seleccione una institución</span>
            <v-select style="display: inline-block; width: 100%;" class="ml-3 mt-2" :options="arregloInstituciones" :reduce="arregloInstituciones => arregloInstituciones" label="institucion_ciudad" v-model="institucion_selected"></v-select>
            <div>
              <vx-tooltip style="display: inline-block;" text="Buscar" position="top" color="primary">
                <vs-button radius color="success" @click="buscarReporte()" class="ml-5" type="line" icon="search"></vs-button>
              </vx-tooltip>
            </div>
          </div>
      </div>
      <!--GRAFICO REPORTE AREA-->
      <div>
        <ReporteAreaSalleVue :institucion_selected="institucion_selected" :periodoSelect="periodoSelect" :searchReporte="searchReporte"/>
      </div>
      <br> <br> <br> <br> <br> <br> <br> <br> <br> <br>
    </vx-card>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import ReporteAreaSalleVue from '@/views/salle/administrador/evaluaciones/components/reporte/detalle/ReporteAreaSalle'
export default{
  data(){
    return{
      periodoSelect:'',
      institucion_selected:'',
      searchReporte:false,
    }
  },
  props:{
    arregloPeriodos:{
      type:Array,
      default:[]
    },
    arregloInstituciones:{
      type:Array,
      default:[]
    },
  },
  components:{
    'v-select': vSelect,
    ReporteAreaSalleVue,
  },
  mounted(){
    let me = this;
    setTimeout(function() {
      if(me.arregloPeriodos.length > 0){
        me.periodoSelect = parseInt(localStorage.EvaluacionSelectSalle)
      }
    }, 2000);
  },
  methods:{
    buscarReporte(){
      let me = this;
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        me.$vs.notify({
        text:'Seleccione un período evaluación por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.institucion_selected == null || me.institucion_selected == "" || me.institucion_selected == undefined){
        me.$vs.notify({
        text:'Seleccione una institución por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.searchReporte =  !me.searchReporte
    },
  }
}
</script>
