<template>
  <div>
    <vx-card title="Comparativa de los mejores promedios de instituciones por Período Evaluación" title-color="success" class="mb-base mt-2" subtitle="Comparación de promedios con las demás instituciones">
      <div class="vx-row mr-1">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <span class="letra1">Primer Períodos de Evaluación</span>
            <v-select :options="arregloPeriodos"  :reduce="arregloPeriodos => arregloPeriodos.id" label="nombre" class="w-full p-2" v-model="periodoSelect1" />
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <span class="letra1">Segundo Período de Evaluación</span>
            <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.id" label="nombre" class="w-full p-2" v-model="periodoSelect2" />
          </div>
      </div>
      <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-400 text-center">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-divider v-if="item.id == periodoSelect1" > <span >{{ item.nombre }}</span></vs-divider>
          </div>
          <ReporteInstitucionVue  :n_evaluacion="periodoSelect1"/>
        </div>
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 bg-gray-500 text-center">
          <div v-for="(item,key2) in arregloPeriodos" :key="key2">
            <vs-divider v-if="item.id == periodoSelect2" > <span >{{ item.nombre }}</span></vs-divider>
          </div>
          <ReporteInstitucionVue  :n_evaluacion="periodoSelect2"/>
        </div>
      </div>
      <!--CANTIDAD DE EVALUACIONES-->
      <vs-collapse accordion >
        <vs-collapse-item>
          <div slot="header">
            <ion-icon name="document-text-outline"></ion-icon> Ver cantidad evaluaciones <ion-icon style="position: relative;top:3px;" name="caret-down-outline"></ion-icon>
          </div>
           <br><br>
           <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-400 text-center">
              <div v-for="(item,key) in arregloPeriodos" :key="key">
                <vs-divider v-if="item.id == periodoSelect1" > <span >{{ item.nombre }}</span></vs-divider>
              </div>
              <ReportePromediosCantidadVue :n_evaluacion="periodoSelect1"/>
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-500 text-center">
              <div v-for="(item,key2) in arregloPeriodos" :key="key2">
                <vs-divider v-if="item.id == periodoSelect2" > <span >{{ item.nombre }}</span></vs-divider>
              </div>
              <ReportePromediosCantidadVue :n_evaluacion="periodoSelect2"/>
            </div>
          </div>
        </vs-collapse-item>
       </vs-collapse>
    </vx-card>
    <!--REPORTE DOCENTES POR PERIODOS DE EVALUACION-->
    <vx-card title="Compartiva por docentes" title-color="success" class="mb-base mt-2" subtitle="Comparativa por áreas de los evaluaciones de los docentes">
      <div class="vx-row mr-1">
        <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6">
          <span class="ml-5">Seleccione una institución</span>
          <div class="flex">
            <v-select style="display: inline-block; width: 100%;" class="ml-3 mt-2" :options="arregloInstituciones" :reduce="arregloInstituciones => arregloInstituciones" label="institucion_ciudad" v-model="institucion_selected"></v-select>
            <div>
              <vx-tooltip style="display: inline-block;" text="Buscar" position="top" color="primary">
                <vs-button radius color="success" @click="buscarReporte()" class="ml-5 mt-2" type="line" icon="search"></vs-button>
              </vx-tooltip>
            </div>
          </div>
        </div>
      </div>
      <!--REPORTE GRAFICO-->
      <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-400 text-center">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-divider v-if="item.id == periodoSelect1" > <span >{{ item.nombre }}</span></vs-divider>
          </div>
          <ReporteCompartivaAreasDocenteVue :institucion_selected="institucion_selected" :periodoSelect="periodoSelect1" :searchReporte="searchReporte"/>
        </div>
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-400 text-center">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-divider v-if="item.id == periodoSelect2" > <span >{{ item.nombre }}</span></vs-divider>
          </div>
          <ReporteCompartivaAreasDocenteVue :institucion_selected="institucion_selected" :periodoSelect="periodoSelect2" :searchReporte="searchReporte"/>
        </div>
      </div>
    </vx-card>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import ReporteInstitucionVue from './ReporteInstitucion.vue';
import ReportePromediosCantidadVue from '@/views/salle/administrador/evaluaciones/components/reporte/ReportePromediosCantidad'
import ReporteCompartivaAreasDocenteVue from './ReporteCompartivaAreasDocente.vue';
export default{
  data(){
    return{
      periodoSelect1:'',
      periodoSelect2:'',
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
  mounted(){
    let me = this;
    setTimeout(function() {
      if(me.arregloPeriodos.length > 0){
        me.periodoSelect2 = parseInt(localStorage.EvaluacionSelectSalle)
      }
    }, 2000);
  },
  components:{
    vSelect,
    ReporteInstitucionVue,
    ReportePromediosCantidadVue,
    ReporteCompartivaAreasDocenteVue,
  },
  methods:{
    buscarReporte(){
      let me = this;
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
  },
}
</script>
