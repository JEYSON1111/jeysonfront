<template>
  <vx-card title="Preguntas Asignadas:" title-color="success" subtitle="Seleccione la institución">
    <!-- Your HTML code here -->
    <div>
      <div class="vx-row">
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
          <small>Asignatura</small>
          <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="arrayPreguntas=[];"/>
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/1 xl:w-1/2 mb-6">
          <small>Institución</small>
          <div class="flex">
            <v-select :options="arrayInstituciones" @input="obtenerPreguntas();" :reduce="arrayInstituciones => arrayInstituciones.idinstitucion" label="nombreinstitucion" class="w-full" v-model="institucionSelected" />
            <vs-button icon="search" class="ml-1" @click="obtenerPreguntas();">Buscar</vs-button>
          </div>
        </div>
      </div>
      <div>
        <TablaPreguntasVue
        :arrayPreguntas="arrayPreguntas"
        @changeAsignar="changeAsignar"
        :isMultipleEnabled="Boolean(false)"
        :isbtnQuitar="Boolean(true)"
        :acciones="Boolean(true)"
        @changeHandle="obtenerPreguntas"
        />
      </div>
      <br><br><br><br><br><br>
     </div>
  </vx-card>
</template>

<script>
import vSelect from 'vue-select'
const TablaPreguntasVue = () => import('./TablaPreguntas.vue')
export default {
  name: 'ListadoPreguntasAsignadas',
  components: {
    'v-select': vSelect,
    TablaPreguntasVue,
  },
  data() {
    return {
      institucionSelected: '',
      arrayPreguntas: [],
      asignaturaSelected: '',
    };
  },
  mounted() {
    // Code to run when the component is mounted
  },
  props: {
    arrayInstituciones: {
      type: Array,
      default: () => [],
    },
    asignaturas:{
      type: Array,
      default: () => [],
    }
  },
  methods: {
    // Your methods here
    obtenerPreguntas(){
      let me = this;
      me.arrayPreguntas = [];
      if(me.institucionSelected == '' || me.institucionSelected == null || me.institucionSelected == undefined){
        me.$vs.notify({
          title: 'Error',
          text: 'Seleccione una institución',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return;
      }
      if(me.asignaturaSelected == '' || me.asignaturaSelected == null || me.asignaturaSelected == undefined){
        me.$vs.notify({
          title: 'Error',
          text: 'Seleccione una asignatura',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return;
      }
      let formData = new FormData();
      formData.append('institucion_id', me.institucionSelected);
      formData.append('id_asignatura',  me.asignaturaSelected.id);
      me.$vs.loading({color: 'rgb(11, 189, 135)'});
      this.$http.post(this.$server_url + 'preguntas_x_institucion',formData).then(res => {
        me.$vs.loading.close();
        me.arrayPreguntas = res.data;
        if(me.arrayPreguntas.length == 0){
          me.$vs.notify({
            title: 'Advertencia',
            text: 'No hay preguntas asignadas a esta institución',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        }
      })
      .catch(err => {
        me.$vs.loading.close();
        console.log(err);
        me.$vs.notify({
          title: 'Error',
          text: 'Error al obtener las preguntas',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
      });
    },
  },

};
</script>

<style scoped>
/* Your component styles here */
</style>
