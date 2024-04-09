<template>
  <div>
    <vx-card title="Copiar Preguntas:" title-color="#6728CE" subtitle="Seleccione 2 instituciones">
      <!-- Your HTML code here -->
      <div>
        <div class="vx-row">
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <small>Copiar Desde:</small>
            <v-select :options="arrayInstituciones" @input="contarPreguntas()" :reduce="arrayInstituciones => arrayInstituciones" label="nombreinstitucion" class="w-full" v-model="institucion1Select" />
            </div>
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/1 xl:w-1/2 mb-6">
            <small>Copiar a:</small>
            <div class="flex">
              <v-select :options="arrayInstituciones"  :reduce="arrayInstituciones => arrayInstituciones" label="nombreinstitucion" class="w-full" v-model="institucion2Select" />
              <vs-button icon="edit" class="ml-1" @click="openConfirm();">Copiar</vs-button>
            </div>
          </div>
        </div>
        <div v-if="countPreguntas > 0">
          <vs-alert color="success" title="Preguntas a ser copiadas" active="true">
              <p class="text-center">(?)<b> {{ countPreguntas }}</b> Preguntas encontradas</p>
          </vs-alert>
        </div>
        <br><br><br><br><br><br>
       </div>
    </vx-card>
    <!--modales-->
    <vs-popup title="Resultado de la copia" :active.sync="popopMostrarResultados">
      <div v-if="popopMostrarResultados">
        <vs-list>
          <vs-list-header title="Resultados"></vs-list-header>
          <vs-list-item title="Preguntas Ingresadas">
            <p>{{ preguntasIngresadas }}</p>
          </vs-list-item>
          <vs-list-item title="Preguntas que ya existen">
            <p>{{ preguntasYaIngresadas.length }}</p>
          </vs-list-item>
        </vs-list>
        <!--boton de aceptar-->
        <div class="flex justify-center">
          <vs-button color="rgb(11, 189, 135)" @click="popopMostrarResultados = false;" type="border" icon="check">Aceptar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import vSelect from 'vue-select'
const TablaPreguntasVue = () => import('./TablaPreguntas.vue')
export default {
  components: {
    TablaPreguntasVue,
    'v-select': vSelect,
  },
  data() {
    return{
      institucion1Select: '',
      institucion2Select: '',
      countPreguntas: 0,
      arrayPreguntas: [],
      usuario:[],
      preguntasYaIngresadas: [],
      preguntasIngresadas: 0,
      popopMostrarResultados: false
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  props:{
    arrayInstituciones: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    contarPreguntas(){
      let me = this
      me.countPreguntas = 0
      if(me.institucion1Select == '' || me.institucion1Select == undefined || me.institucion1Select == null){
        me.$vs.notify({
          title: 'Aviso',
          text: 'Debe seleccionar la institución de origen',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      me.$vs.loading()
      me.$http.get(me.$server_url + 'getCountQuestions?idinstitucion='+me.institucion1Select.idinstitucion)
      .then(res => {
        me.countPreguntas = res.data.length
        me.arrayPreguntas = res.data
        me.$vs.loading.close()
      })
      .catch(err => {
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al obtener preguntas',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    openConfirm(){
      let me = this
      if(me.institucion1Select == '' || me.institucion1Select == undefined || me.institucion1Select == null){
        me.$vs.notify({
          title: 'Aviso',
          text: 'Debe seleccionar la institución de origen',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }

      if(me.institucion2Select == '' || me.institucion2Select == undefined || me.institucion2Select == null){
        me.$vs.notify({
          title: 'Aviso',
          text: 'Debe seleccionar la institución de destino',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      //si ambas son iguales
      if(me.institucion1Select == me.institucion2Select){
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar instituciones diferentes',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return;
      }
      me.$vs.dialog({
        title: 'Confirmación',
        text: `¿Desea copiar las ${me.countPreguntas} preguntas de la institución ${me.institucion1Select.nombreinstitucion} a la institución ${me.institucion2Select.nombreinstitucion}?`,
        acceptText: 'Aceptar',
        acceptColor: 'rgb(11, 189, 135)',
        acceptButtonAlign: 'center', // Center align the accept button
        accept:this.asignarPreguntas
      })
    },
    asignarPreguntas(){
      let me = this;
      // me.arrayNoIngresadas = []
      me.preguntasYaIngresadas     = []
      me.preguntasIngresadas       = 0
      me.$vs.loading()
      const formData = new FormData();
      formData.append('institucion_id', me.institucion2Select.idinstitucion);
      formData.append('user_created',   me.usuario.idusuario);
      formData.append('arrayPreguntas', JSON.stringify(me.arrayPreguntas));
      this.$http.post(this.$server_url + 'asignar_preguntas_institucion', formData)
      .then(res => {
        me.$vs.loading.close()
        //si no se asignaron preguntas
        if(res.data.preguntasIngresadas == 0){
          me.$vs.notify({
            title: 'Error',
            text: 'Preguntas ya asignadas con anterioridad',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        }else{
          //si se asignaron preguntas
          me.$vs.notify({
            title: 'Exito',
            text: `${ res.data.preguntasIngresadas } Preguntas  asignadas correctamente`,
            iconPack: 'feather',
            icon: 'icon-check',
            color: 'success',
            time:8000
          })
        }
        me.preguntasYaIngresadas = res.data.preguntasYaIngresadas
        me.preguntasIngresadas   = res.data.preguntasIngresadas
        me.popopMostrarResultados = true
      })
      .catch(function (error) {
        console.log(error);
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al asignar las preguntas',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })
    },
  },
}
</script>

