<template>
<div class="vx-row w-full">
    <div class="vx-col sm:w-2/3 w-full">
      <vx-card>
        <div>
          <vs-table max-items="20" search pagination :data="listaEvaluaciones" style="margin-top:-20px">
                <template slot="header">
                    <b>Evaluaciones resueltas</b>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td class="text-center">
                          <p v-for="(item,key) in arregloPeriodos" :key="key">
                            <span v-if="item.id == periodoSelect">Periodo Evaluación -  <b class="ml-1">{{ item.nombre }}</b></span>
                          </p>
                        </vs-td>
                        <vs-td align="center">
                            <vs-button :disabled="ver_respuestas_activo" color="warning" size="small" icon-pack="feather" icon="icon-eye" @click="revisarEvaluacion(data[indextr].id_evaluacion)">revisar</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
          </vs-table>
          <div v-if="ver_respuestas_activo===true">La revision de preguntas no está activada para su institución</div>
        </div>
    </vx-card>
    </div>
    <div class="vx-col sm:w-1/3 w-full">
      <vx-card align="center">
        <div id="div-with-loading" class="vs-con-loading__container mb-3 mt-3">
            <div v-if="evaluacionOk===true">
                <vs-button color="success" icon-pack="feather" icon="icon-inbox" @click="resolverEvaluacion()">Resolver evaluación</vs-button> <br>
            </div>
            <div v-else>
                <b :style="`color: ${eval_color}`"> {{mensajeEvaluacion}}</b>
            </div>
        </div>
        <vs-divider></vs-divider>
        <br>
        <vs-button class="mb-3" color="warning" icon-pack="feather" icon="icon-grid" @click="asignaturasUsuario()">Mis asignaturas</vs-button>
      </vx-card>
    </div>
</div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
export default {
    data() {
      return {
        usuario: [],
        listaEvaluaciones: [],
        asignaturasDocente: 0,
        configuracion: [],
        fechaLocal: '',
        evaluacionOk: false,
        mensajeEvaluacion: '',
        eval_color: '#2196f3',
        ver_respuestas_activo: false,
        arregloPeriodos:[],
      }
    },
    components: {
      'v-select': vSelect,
    },
    async created() {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
      let me = this;
      me.getPeriodosEvaluacion()
      me.verificarAsginaturasDocente();
    },
    methods: {
      getPeriodosEvaluacion() {
        let me = this;
        this.$http.get(this.$server_url+'salle/periodos')
          .then(function (response) {
            me.arregloPeriodos = response.data;
            let getEvaluacionSelect = localStorage.EvaluacionSelectSalle
            //si ya existe el periodo seleccionado lo asigno
            if(getEvaluacionSelect){
              me.periodoSelect = parseInt(getEvaluacionSelect)
              return
            }
            if(me.arregloPeriodos.length > 0){
              me.periodoSelect = me.arregloPeriodos[0].id
            }
          })
          .catch(function (error) {
          })
      },
      verificarAsginaturasDocente() {
        let me = this;
        this.$http.get(this.$server_url+'asignaturas_docente_salle/' + me.usuario.idusuario+'/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
            me.asignaturasDocente = res.data.asignaturas.length
          })
          .catch(err => {
          })
          me.$vs.loading({
            container: '#div-with-loading',
            scale: 1,
            type:'material',
          });
        this.$http.get(this.$server_url+'institucionConfiguracionSalle/' + me.usuario.institucion_idInstitucion+'/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
            me.$vs.loading.close();
            me.configuracion = res.data;
            if( me.configuracion[0].ver_respuestas == 0 ){
              me.ver_respuestas_activo = true
            }
            me.getEvaluacionesResueltas()
          })
          .catch(err => {
            console.log(err)
            me.$vs.loading.close('#div-with-loading > .con-vs-loading');
          })
      },
      asignaturasUsuario() {
        let me = this;
        me.$router.push('/docente/usuarioasignaturas');
      },
      verPromedios(item) {
        let me = this;
        if (me.configuracion[0].ver_respuestas == 0) {
          me.$vs.notify({
            text: 'Los resultados aún no estan disponibles, un administrador de La Salle, lo habilitará más adelante.',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
      },
      resolverEvaluacion() {
        let me = this;
        localStorage.setItem('tipo_revisar', 0);
        me.$router.push('/salle/docente/evaluacion');
      },
      revisarEvaluacion(id_evaluacion) {
        let me = this;
        localStorage.setItem('tipo_revisar', 1);
        localStorage.setItem('id_evaluacion_salle', id_evaluacion);
        me.$router.push('/salle/docente/evaluacion');
      },
      async getEvaluacionesResueltas(){
        let me = this
        me.$vs.loading();
        await me.$http.get(this.$server_url+'evaluaciones_resueltas_salle/' + me.usuario.idusuario+'/'+localStorage.EvaluacionSelectSalle)
        .then(res => {
          me.$vs.loading.close();
          me.listaEvaluaciones = res.data
          let date_actua = new Date()
          me.fechaLocal = moment(date_actua, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          if (me.configuracion !== undefined && me.configuracion.length > 0) {
            if (me.fechaLocal > me.configuracion[0].fecha_inicio && me.fechaLocal < me.configuracion[0].fecha_fin ) {
              // se valida que no permita dar mas evaluaciones de las permitidas en la configuracion, teniendo el cuenta el periodo.
              var evaluaciones_periodo_actual = 0
              var d = new Date();
              var anio_actual = d.getFullYear();
              $.each(me.listaEvaluaciones, function(key, value){
                  console.log((((value.updated_at).split(' '))[0]).split('-')[0] +' == '+ anio_actual)
                  if( (((value.updated_at).split(' '))[0]).split('-')[0] == anio_actual ){
                      evaluaciones_periodo_actual++
                  }
              });
              if( evaluaciones_periodo_actual < me.configuracion[0].cant_evaluaciones ){
                  me.evaluacionOk = true;
                  me.mensajeEvaluacion = 'La evaluación estará disponible hasta el día ' + me.fechaLarga(me.configuracion[0].fecha_fin);
                  me.eval_color = '#4caf50';
              }else{
                  me.evaluacionOk = false
              }
            } else {
              me.evaluacionOk = false
              console.log(me.fechaLocal +' < '+ me.configuracion[0].fecha_inicio)
              if (me.fechaLocal < me.configuracion[0].fecha_inicio) {
                  me.mensajeEvaluacion = 'La próxima evaluación estará activa el día: ' + me.fechaLarga(me.configuracion[0].fecha_inicio);
                  me.eval_color = '#2196f3';
              } else {
                  me.mensajeEvaluacion = 'Horario no permitido para rendir la evaluación.';
                  me.eval_color = '#737893';
              }
            }
          } else {
            me.evaluacionOk = false
            me.mensajeEvaluacion = 'Su institucion no está configurada, comuníquese con el administrador.';
            me.eval_color = '#998159';
          }
          me.$vs.loading.close('#div-with-loading > .con-vs-loading');
        })
        .catch(err => {
            me.$vs.loading.close();
        })
      },

    },
}
</script>
