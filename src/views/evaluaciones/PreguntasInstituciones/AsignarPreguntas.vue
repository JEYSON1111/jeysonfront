<template>
  <vx-card class='vx-col w-full mt-4'>
    <div class="vx-row mb-5 mt-4">
        <div class="vx-col sm:w-1/2 w-full">
            Seleccionar asignatura:
            <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="filtrarPreguntas()" />
        </div>
    </div>
    <div>
      <TablaPreguntasVue :arrayPreguntas="arrayPreguntas" @changeAsignar="changeAsignar"/>
    </div>
    <!--MODLALES-->
    <!--MODLAL PARA ASIGNAR A INSTITUCION-->
    <vs-popup classContent="popup-example" title="Preguntas que seras asignadas" :active.sync="popupAsignar" fullscreen>
      <!--select de institucion-->
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Seleccione la institución</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <v-select :options="arrayInstituciones" :reduce="arrayInstituciones => arrayInstituciones.idinstitucion" label="nombreinstitucion" class="w-full" v-model="institucionSelected" />
        </div>
      </div>
      <div class="flex justify-center">
        <vs-button color="rgb(11, 189, 135)" v-if="institucionSelected" @click="popupConfirm=true;" type="border" icon="check">Asignar preguntas a la institución</vs-button>
      </div>
      <vs-divider>{{arrayPreguntasSelected.length}} Preguntas que seras asignadas (?)</vs-divider>
      <TablaPreguntasVue v-if="popupAsignar" btnAsignar="0" :arrayPreguntas="arrayPreguntasSelected" :isMultipleEnabled="Boolean(false)"/>
      <!--POPOP DE CONFIRMACION-->
      <vs-popup title="Confirmación" :active.sync="popupConfirm">
        <ConfirmEliminarVue otroValor="1" title="Estás seguro de asignar estas preguntas a la institución?" subtitle="Si, deseo asignar" @changeConfirm="changeConfirm"/>
      </vs-popup>
    </vs-popup>
    <!--MODAL PARA MOSTRAR PREGUNTAS QUE NO SE ASIGNARON-->
    <vs-popup classContent="popup-example" title="preguntas ya asignadas con anterioridad" :active.sync="popupNoAsignadas" fullscreen>
      <TablaPreguntasVue v-if="popupNoAsignadas" :arrayPreguntas="arrayNoIngresadas" :isMultipleEnabled="Boolean(false)"/>
    </vs-popup>
  </vx-card>
  </template>

  <script>
  import vSelect from 'vue-select'
  const TablaPreguntasVue   = () => import('./TablaPreguntas.vue')
  const ConfirmEliminarVue  = () => import('../../configuracion/Reutilizable/ConfirmEliminar.vue');
  export default {
      components: {
        'v-select': vSelect,
        TablaPreguntasVue,
        ConfirmEliminarVue
      },
      data() {
          return {
              asignaturaSelected: '',
              asignaturas: [],
              asignatura: {
                  id: '',
                  label: ''
              },
              arrayPreguntas: [],
              arrayPreguntasSelected: [],
              pregSelected: '',
              show: false,
              usuario:[],
              popupAsignar:false,
              institucionSelected:'',
              popupConfirm:false,
              popupNoAsignadas:false,
          };
      },
      props: {
        arrayInstituciones: {
          type: Array,
          default: () => []
        },
        asignaturas: {
          type: Array,
          default: () => []
        }
      },
      created() {
          let me = this;
          me.usuario = JSON.parse(localStorage.getItem("usuario"))
      },
      mounted() {
          let me = this;
      },
      methods: {
        changeConfirm(e){
          let me = this;
          //cancelar
          if(e == 0) { me.popupConfirm = false;  }
          //asignar
          if(e == 1) { me.asignarPreguntas(); }
        },
        asignarPreguntas(){
          let me = this;
          me.arrayNoIngresadas = []
          if(me.institucionSelected == null || me.institucionSelected == ''){
            me.$vs.notify({
              title: 'Error',
              text: 'Debe seleccionar una institución',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
            })
            return
          }
          me.$vs.loading()
          const formData = new FormData();
          formData.append('institucion_id', me.institucionSelected);
          formData.append('user_created',   me.usuario.idusuario);
          formData.append('arrayPreguntas', JSON.stringify(me.arrayPreguntasSelected));
          this.$http.post(this.$server_url + 'asignar_preguntas_institucion', formData)
          .then(res => {
            me.$vs.loading.close()
            //si no se asignaron preguntas
            me.popupAsignar = false
            me.popupConfirm = false
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
                time:6000
              })
            }
            //preguntas que no se asignaron que estan ingresada
            if(res.data.preguntasYaIngresadas.length > 0){
              me.checkPreguntasIngresadas(res.data.preguntasYaIngresadas)
            }
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
        checkPreguntasIngresadas(preguntas){
          let me = this;
          me.arrayNoIngresadas = preguntas
          me.popupNoAsignadas = true
        },

        changeAsignar(e,datos){
          this.arrayPreguntasSelected = datos
          this.popupAsignar           = true
        },
        filtrarPreguntas() {
            let me = this;
            me.arrayPreguntas = []
            if (me.asignaturaSelected == null || me.asignaturaSelected == '') {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe seleccionar una asignatura',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
                return
            }
            me.$vs.loading()
            const formData = new FormData();
            formData.append('asignatura', me.asignaturaSelected.id);
            formData.append('idusuario',  me.usuario.idusuario);
            this.$http.post(this.$server_url + 'temas_preguntas_respuestas', formData)
            .then(res => {
              me.$vs.loading.close()
              me.arrayPreguntas = res.data
                //si esta vacio el array mostrar un alert
                if(me.arrayPreguntas.length == 0){
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No hay preguntas para esta asignatura',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }
            })
              .catch(function (error) {
                console.log(error);
                me.$vs.loading.close()
                me.$vs.notify({
                  title: 'Error',
                  text: 'Error al cargar las preguntas',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
                })
            })
        },
      }
  };
  </script>
