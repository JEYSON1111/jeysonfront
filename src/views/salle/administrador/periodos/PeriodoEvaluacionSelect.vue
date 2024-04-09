<template>
  <div>
    <div v-if="windowWidth < 992 && usuario.id_group == 12">
      <vs-dropdown vs-custom-content vs-trigger-click>
        <vs-button type="filled" class="a-icon">
          <p v-for="(item,key) in arregloPeriodos" :key="key">
            <span v-if="item.id == periodoSelect"><span class="ml-1">{{ item.nombre }}</span></span>
          </p>
          <vs-icon class="" icon="expand_more"></vs-icon>
        </vs-button>
        <vs-dropdown-menu class="loginx">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-dropdown-item style="width:200px; margin-top: 5px;" @click="periodoSelect = item.id;changeEvaluacionPeriodo();">
                <span class="feather icon icon-check"></span> {{ item.nombre }}
            </vs-dropdown-item>
          </div>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>
    <div v-if="windowWidth < 992 && usuario.id_group == 13">
      <vs-dropdown vs-custom-content vs-trigger-click>
        <vs-button type="filled" class="a-icon">
          <p v-for="(item,key) in arregloPeriodos" :key="key">
            <span v-if="item.id == periodoSelect"><span class="ml-1">{{ item.nombre }}</span></span>
          </p>
          <!-- <vs-icon class="" icon="expand_more"></vs-icon> -->
        </vs-button>
        <!-- <vs-dropdown-menu class="loginx">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-dropdown-item style="width:200px; margin-top: 5px;" @click="periodoSelect = item.id;changeEvaluacionPeriodo();">
                <span class="feather icon icon-check"></span> {{ item.nombre }}
            </vs-dropdown-item>
          </div>
        </vs-dropdown-menu> -->
      </vs-dropdown>
    </div>
    <div v-if="windowWidth >= 992">
      <div v-if="usuario.id_group == 13">
          <vx-card v-if="errorPeriodoEvaluacion == false">
            <p class="text-success font-bold"><ion-icon name="star-outline" style="position: relative;top:1px;"></ion-icon> Periodo Evaluacion: {{ nombrePeriodoEvaluacion }}</p>
          </vx-card>
          <vs-alert active="true" color="warning" v-else>
            No hay un período activo configurado
          </vs-alert>
      </div>
      <div v-if="usuario.id_group == 12" class="flex mt-5 ml-3" style="width: 500px;border-radius:10px;background: #f2f2f2;">
        <div style="width: 40%;">
          <p class="mt-2 ml-1 text-success"> <ion-icon name="contract-outline"></ion-icon> Período Evaluación </p>
        </div>
        <div style="width: 60%;">
          <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.id" @input="changeEvaluacionPeriodo()" label="nombre" class="w-full" v-model="periodoSelect" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
  data(){
    return{
      usuario:[],
      arregloPeriodos:[],
      periodoSelect:'',
      nombrePeriodoEvaluacion:'',
      errorPeriodoEvaluacion:false,
    }
  },
  components:{
    vSelect,
  },
  props:{
    mobil:{
      type:Number,
      default:0
    },
  },
  mounted(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    if(me.usuario.id_group == 12 || me.usuario.id_group == 13 || me.usuario.id_group == 6){
      me.getPeriodosEvaluacion()
    }
  },
  computed:{
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods:{
    getPeriodosEvaluacion() {
      let me = this;
      me.errorPeriodoEvaluacion = false;
      this.$http.get(this.$server_url+'salle/periodos')
        .then(function (response) {
          me.arregloPeriodos = response.data;
          //docentes
          if(me.usuario.id_group == 13 || me.usuario.id_group == 6){
            let datos  = response.data
            if(datos.length > 0){
              let searcEvaluacionActiva = datos.filter(p => p.estado == 1)
              if(searcEvaluacionActiva.length > 0){
                me.nombrePeriodoEvaluacion  = searcEvaluacionActiva[0].nombre
                localStorage.setItem('EvaluacionSelectSalle',searcEvaluacionActiva[0].id)
                me.periodoSelect = searcEvaluacionActiva[0].id
              }else{
                me.errorPeriodoEvaluacion = true
              }
            }else{
              me.errorPeriodoEvaluacion = true
            }
            return
          }
          let getEvaluacionSelect = localStorage.EvaluacionSelectSalle
          //si ya existe el periodo seleccionado lo asigno
          if(getEvaluacionSelect){
            me.periodoSelect = parseInt(getEvaluacionSelect)
            return
          }
          //si no existe le pongo el ultimo periodo
          if(me.arregloPeriodos.length > 0){
            me.periodoSelect = me.arregloPeriodos[0].id
            localStorage.setItem('EvaluacionSelectSalle',me.arregloPeriodos[0].id)
          }
        })
        .catch(function (error) {
        })
    },
    changeEvaluacionPeriodo(){
      let me = this;
      console.log("rap",me.periodoSelect)
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        localStorage.removeItem('EvaluacionSelectSalle')
        setInterval(() => {
          location.reload()
        }, 1000)
        return
      }
      localStorage.setItem('EvaluacionSelectSalle',me.periodoSelect)
      location.reload()
    },
  }
}
</script>
