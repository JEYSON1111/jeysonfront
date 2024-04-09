<template>
  <div>
    <div class="vx-row mt-4">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6 flex">
          <vs-input
          :success="true"
          success-text="BUSQUEDA DE INSTITUCIÓN"
          placeholder=""
          class="w-full"
          @keyup.enter="getInstitucion()"
          v-model="busqueda"/>
          <vs-button @click="getInstitucion();" transparent icon="search" radius  class="ml-1" color="success"></vs-button>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
        <div v-if="objectSelectInstitucion.idInstitucion">
          <vs-alert color="success" @click="cleanInstitucion();" class="w-full cursor-pointer" icon-pack="feather" icon="icon-x"><p class="text-center">Seleccionado: <b>{{  objectSelectInstitucion.nombreInstitucion }}</b></p></vs-alert>
        </div>
        <div v-else>
          <vs-alert color="danger" class="w-full"><p class="text-center">!Institucion no asignada</p></vs-alert>
        </div>
      </div>
    </div>
    <!--!TABLA DE INSTITUCIONES-->
    <TableInstitucionesVue v-if="arrayInstituciones.length > 0" :arrayInstituciones="arrayInstituciones" @changeHandle="changeHandle"/>
  </div>
</template>

<script>
const TableInstitucionesVue = () => import('./TableInstituciones.vue')
export default {
  name: 'TableInstitucion',
  components:{
    TableInstitucionesVue
  },
  data() {
    return {
        busqueda:'',
        arrayInstituciones:[],
        nombreInstitucion:'',
        institucion_id:0,
        periodo_id:0,
        periodoDescripcion:'',
        ciudadDescripcion:'',
        objectSelectInstitucion:'',
      // Your data properties here
    };
  },
  methods: {
    changeHandle(data){
      this.arrayInstituciones       = []
      this.objectSelectInstitucion  = data
      this.$emit('changeHandle',data)
    },
    cleanInstitucion(){
      this.objectSelectInstitucion = ''
      this.$emit('changeHandle',{})
    },
    getInstitucion() {
      let me = this;
      me.arraryInstituciones                  = [];
      me.institucion_id                       = 0;
      if(me.busqueda == ''){
        me.$vs.notify({
        text:'Ingrese un valor de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.busqueda.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?busqueda='+me.busqueda)
        .then(function (res) {
          let datos = res.data
          me.arrayInstituciones = datos
          me.$vs.loading.close()
          if(res.data.message){
            me.$vs.notify({
            text: res.data.message,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-user'
            })
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
  },
  mounted() {
    // Code to run when the component is mounted
  },
};
</script>

<style scoped>
/* Your component styles here */
</style>
