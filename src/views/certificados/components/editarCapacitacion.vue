<template>
  <div>
    <div v-if="menu == 0">
      <h5 class="mb-4">Tema: {{ agenda_editar.titulo }} </h5>
      <vs-row class="mt-2">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null">
            Sin Institución
          </p>
          <vs-chip color="success" v-else>
            Institución {{ nombreInstitucion }}
          </vs-chip>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-button color="warning" class="mt-2" size="small" @click="tipoCapacitacion = 0; menu = 1;"
            type="relief">Asignar institución de prolipa</vs-button>
          <vs-button color="primary" class="mt-2 ml-3" icon="info" size="small" @click="; tipoCapacitacion = 1; menu = 1;"
            type="relief">Institución creada por el asesor</vs-button>
        </vs-col>
      </vs-row>
      <div class="mt-3">
        <div>Marcar la capacitacion actual como:</div>
        <vs-radio class="m-3" color="warning" v-model="agenda_editar.estado" vs-name="radios2"
          vs-value="1">Pendiente</vs-radio>
        <vs-radio class="m-3" color="success" v-model="agenda_editar.estado" vs-name="radios2"
          vs-value="2">Realizada</vs-radio>
        <vs-radio class="m-3" color="danger" v-model="agenda_editar.estado" vs-name="radios2"
          vs-value="0">Cancelada</vs-radio>
        <div class="mt-3">
          <p>Fecha capacitación</p>
          <flat-pickr :config="configdateTimePicker" v-model="agenda_editar.startDate" placeholder="Fecha capacitación"
            class="m-1" style="display: inline-block;width: 100%;" />
        </div>
        <div class="flex" style="justify-content: space-between;">
          <div class="mt-3">
            <p>Hora inicio *</p>
            <flat-pickr  :config="configdateTimePickerTime" v-model="agenda_editar.hora_inicio" />
          </div>
          <div class="mt-3">
            <p>Hora fin *</p>
            <flat-pickr :config="configdateTimePickerTime" v-model="agenda_editar.hora_fin" />
          </div>
        </div>
        <div class="mt-3">
          <p>Fecha fin</p>
          <flat-pickr :config="configdateTimePicker" v-model="agenda_editar.endDate" placeholder="Fecha Fin" class="m-1"
            style="display: inline-block;width: 100%;" />
        </div>
        <div class="mt-3">
          <div style="display:flex;">
            <div>
              <vs-input type="number" v-model="agenda_editar.personas" label="Cantidad de asistentes"></vs-input>
            </div>
            <div>
              <vs-switch color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash"
                v-model="agenda_editar.asistencia_activa" style="width: 150px;margin-top:30px;margin-left:50px;">
                <span slot="on">asistencia activa</span>
                <span slot="off">asistencia inactiva</span>
              </vs-switch>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <p>Seleccione el Capacitador:</p>
          <v-select multiple :closeOnSelect="false" :options="arregloCapacitadores"
            :reduce="arregloCapacitadores => arregloCapacitadores" label="capacitador" class="w-full"
            v-model="capacitadorCapacitacion" />
        </div>
        <div class="mt-3">
          <vs-input class="w-full" v-model="agenda_editar.link_reunion" label="Link de la reunión"></vs-input>
        </div>
        <div class="mt-3">
          <vs-textarea v-model="agenda_editar.observacion" :counter="counter_long" label="observación" height="130px"
            :counter-danger.sync="counterDanger"></vs-textarea>
        </div>
        <div>
          <vs-button class="mt-5" color="primary" @click="editar_seminario();" type="filled">Aceptar</vs-button>
        </div>
      </div>
    </div>
    <!--ASIGNAR INSTITUCION PROLIPA-->
    <div v-if="menu == 1">
      <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
      <AsignarInstitucionVue :tipoCapacitacion="tipoCapacitacion" :arregloCiudad="arregloCiudad"
        @changeInstitucionCreada="changeInstitucionCreada" />
    </div>
  </div>
</template>
<script>
import AsignarInstitucionVue from './AsignarInstitucion.vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
export default {
  components: {
    'v-select': vSelect,
    flatPickr,
    AsignarInstitucionVue,
  },
  data() {
    return {
      counter_long: 200,
      counterDanger: false,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:s'
      },
      configdateTimePickerTime: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      },
      menu: 0,
      arregloCiudad: [],
      nombreInstitucion: '',
      institucion_id_temporal: 0,
      periodo_id_temporal: 0,
      estado_institucion_temporal: 0,
      institucion_id: 0,
      estado_institucion_temporal: 0,
      tipoCapacitacion: 0,
      capacitadorCapacitacion: [],
    }
  },
  props: {
    periodoSelect: {
      type: Object,
      default: {}
    },
    agenda_editar: {
      type: Object,
      default: {}
    },
    capacitacion: {
      type: Object,
      default: {}
    },
    arregloCapacitadores: {
      type: Array,
      default: []
    },
  },
  mounted() {
    let me = this;
    me.listaCiudades()
    if (me.capacitacion.estado_institucion_temporal == "1") {
      this.nombreInstitucion = me.capacitacion.nombre_institucion_temporal
      this.institucion_id_temporal = me.capacitacion.institucion_id_temporal
      this.periodo_id_temporal = me.capacitacion.periodo_id
      this.estado_institucion_temporal = 1
    } else {
      this.nombreInstitucion = me.capacitacion.nombreInstitucion
      this.institucion_id = me.capacitacion.id_institucion
      this.estado_institucion_temporal = 0
    }
    me.getCapacitadoresSelect()
  },
  created() {
    console.log(this.capacitacion)
  },
  methods: {
    //lista de ciudades para usar en el select
    listaCiudades() {
      let me = this
      this.$http.get(this.$server_url + `ciudad`).then(res => {
        me.arregloCiudad = res.data;
      })
        .catch(function (error) {
          console.log(error)
        })
    },      //lista de ciudades para usar en el select
    getCapacitadoresSelect() {
      let me = this
      me.capacitadorCapacitacion = [];
      this.$http.get(this.$server_url + `getCapacitadoresXCapacitacion/` + me.agenda_editar.id).then(res => {
        me.capacitadorCapacitacion = res.data;
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    editar_seminario() {
      let me = this
      me.$vs.loading()
      let seminario = ''
      var sendcapacitadores = ""
      if (me.capacitadorCapacitacion.length > 0) {
        const LlenarCapacitadores = me.capacitadorCapacitacion.map(p => p.capacitador)
        sendcapacitadores = LlenarCapacitadores.join(',')
      }
      seminario = {
        'capacitacion':               "yes",
        'id_seminario':               me.agenda_editar.id,
        'nombre':                     me.agenda_editar.titulo,
        'fecha_inicio':               me.agenda_editar.startDate,
        'fecha_fin':                  me.agenda_editar.endDate,
        'link_reunion':               me.agenda_editar.link_reunion,
        'cant_asistentes':            me.agenda_editar.personas,
        'observacion':                me.agenda_editar.observacion,
        'estado_capacitacion':        me.agenda_editar.estado,
        'asistencia_activa':          me.agenda_editar.asistencia_activa,
        'institucion_id':             me.institucion_id,
        'institucion_id_temporal':    me.institucion_id_temporal,
        'estado_institucion_temporal': me.estado_institucion_temporal,
        'periodo_id_temporal':        me.periodo_id_temporal,
        'nombreInstitucion':          me.nombreInstitucion,
        'capacitadores':              JSON.stringify(me.capacitadorCapacitacion),
        'capacitador':                sendcapacitadores,
        'periodo_id':                 this.periodoSelect.idperiodoescolar,
        'hora_inicio':                me.agenda_editar.hora_inicio,
        'hora_fin':                   me.agenda_editar.hora_fin,
        // 'capacitador_id':            me.capacitadorCapacitacion.idusuario,
      }
      this.$http.post(this.$server_url + 'guardar_seminario', seminario)
        .then(function (res) {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              time: 5000,
              icon: 'icon-check'
            })
            return
          }
          me.$emit('rechargeSeminarios', true)
          if (res.data.message) {
            me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            })
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
    },
    changeInstitucionCreada(e) {
      let me = this
      me.institucion_id = e.institucion_id
      me.nombreInstitucion = e.nombreInstitucion
      me.institucion_id_temporal = e.institucion_id_temporal
      me.periodo_id_temporal = e.periodo_id_temporal
      me.estado_institucion_temporal = e.estado_institucion_temporal
      me.menu = 0
    }
  }
}
</script>
