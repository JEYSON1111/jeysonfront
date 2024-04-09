<script>
import vSelect from 'vue-select';
import ListTile from './components/ListTileComponent.vue';
import editarCapacitacionVue from '../certificados/components/editarCapacitacion.vue';
import moment from 'moment';
import * as XLSX from 'xlsx';

export default ({
  components: {
    vSelect,
    ListTile,
    editarCapacitacionVue,
  },
  data: () => ({
    title: 'Reporte de capacitaciones',
    periodo: null,
    prevPeriodo: '',
    periodos: [
      'todo',
    ],
    tiempo: 'todo',
    tiempos: [
      'todo',
      'hoy',
      'ésta semana',
      'éste mes',
      'por fechas'
    ],
    capacitador: 'todos',
    capacitadores: [],
    tipo: {
      id: null,
      label: 'todo',
    },
    tipos: [
      {
        id: null,
        label: 'todo',
      },
      {
        id: 0,
        label: 'Presencial',
      },
      {
        id: 1,
        label: 'Virtual',
      },
    ],
    capacitaciones: [],
    filtro_fecha_ini: '',
    filtro_fecha_fin: '',
    currentUser: null,
    search: '',
    isOpen: false,
    capacitacion: {},
    agenda_editar: {
      'id': '',
      'estado': '',
      'observacion': '',
      'personas': '',
      'startDate': '',
      'endDate': '',
      'link_reunion': '',
      'asistencia_activa': '',
      'hora_inicio': '',
      'hora_fin': '',
    },
    periodoSelect: null,
    tableData: [],
    meses:[
      { nombre: 'Enero', numero: 1 },
      { nombre: 'Febrero', numero: 2 },
      { nombre: 'Marzo', numero: 3 },
      { nombre: 'Abril', numero: 4 },
      { nombre: 'Mayo', numero: 5 },
      { nombre: 'Junio', numero: 6 },
      { nombre: 'Julio', numero: 7 },
      { nombre: 'Agosto', numero: 8 },
      { nombre: 'Septiembre', numero: 9 },
      { nombre: 'Octubre', numero: 10 },
      { nombre: 'Noviembre', numero: 11 },
      { nombre: 'Diciembre', numero: 12 }
    ],
    arraryStatus:[
     { nombre:'Pendiente', estado:1 },
     { nombre:'Realizada', estado:2 },
     { nombre:'Cancelada', estado:0 },
    ],
    mesSelect:'',
    estadoSelect:'',
  }),
  created() {
    this.getPeriodos();
    this.getCapacitadores();
    this.getCapacitaciones();
    this.periodo = this.periodos[0];
    this.prevPeriodo = this.periodos[0];
    this.tipo = this.tipos[0];
    this.currentUser = JSON.parse(localStorage.getItem('usuario'));
    this.periodoSelect = JSON.parse(localStorage.getItem('periodo'));
  },
  methods: {
    getPeriodos() {
      const me = this;
      me.$http.get(`${me.$server_url}get_periodos_seminarios`)
        .then((res) => {
          me.periodos = res.data.filter(p => p.idperiodoescolar != 20 && p.idperiodoescolar != 17 && p.idperiodoescolar != 15 && p.idperiodoescolar != 14 && p.idperiodoescolar > 11 && p.estado == 1)
          me.periodo = me.periodos[0];
        })
        .catch((err) => this.showError("Error al obtener los periodos"));
    },
    getCapacitadores() {
      const me = this;
      me.$http.get(`${me.$server_url}getCapacitadores`)
        .then((res) => {
          me.capacitadores = res.data;
        })
        .catch((err) => this.showError("Error al obtener los capacitadores"));
    },
    getCapacitaciones() {
      const me = this;
      me.$vs.loading();
      // Inicializa 'capacitaciones' como un array vacío
      me.capacitaciones = [];
      // Realiza una petición GET al servidor para obtener las capacitaciones
      me.$http.get(`${me.$server_url}reporte/capacitaciones`).then((res) => {
        // Añade los datos de respuesta al array 'capacitaciones'
        me.capacitaciones.push(...res.data);
        me.capacitaciones = me.capacitaciones.map((cap) => {
          // Utiliza una nueva propiedad para almacenar el número del mes
          cap.formatMes = moment(cap.fecha_inicio).format('M');
          return cap;
        });
        // Almacena las capacitaciones en el almacenamiento local del navegador
        localStorage.setItem('capacitaciones', JSON.stringify(me.capacitaciones));
        // Llama a la función 'queryData'
        this.queryData();
      }).catch((err) => {
        // Muestra un mensaje de error
        this.showError(`Error: ${err}`)
      })
        .finally(() => me.$vs.loading.close());
    },
    queryData() {
      let _capacitaciones = JSON.parse(localStorage.getItem('capacitaciones'));
      //mes - periodo - estado
      if(this.mesSelect && this.periodo && this.estadoSelect){
        _capacitaciones = _capacitaciones.filter(c => (c.periodo.idperiodoescolar == this.periodo.idperiodoescolar) && (c.formatMes == this.mesSelect) && (c.estado_capacitacion == this.estadoSelect));
        this.buildDataTable(_capacitaciones);
        return
      }
      //periodo - estado
      if(this.periodo && this.estadoSelect){
        _capacitaciones = _capacitaciones.filter(c => (c.periodo.idperiodoescolar == this.periodo.idperiodoescolar) && (c.estado_capacitacion == this.estadoSelect));
        this.buildDataTable(_capacitaciones);
        return
      }
      if(this.mesSelect && this.periodo){
        _capacitaciones = _capacitaciones.filter(c => (c.periodo.idperiodoescolar == this.periodo.idperiodoescolar) && (c.formatMes == this.mesSelect) );
        this.buildDataTable(_capacitaciones);
        return
      }
      if (this.periodo) {
        _capacitaciones = _capacitaciones.filter(c => c.periodo.idperiodoescolar == this.periodo.idperiodoescolar);
        this.buildDataTable(_capacitaciones);
        return
      }
    },
    exportData() {
      const ws = XLSX.utils.json_to_sheet(this.tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Capacitaciones');
      XLSX.writeFile(wb, 'capacitaciones.xlsx');
    },
    showError(msg) {
      this.$vs.notify({
        title: 'Error',
        text: msg,
        color: 'danger',
      });
    },
    setVal(param, val) {
      this[param] = val;
      this.queryData();
    },
    editCapacitacion(capId) {

      this.capacitacion = this.capacitaciones.find(c => c.id_seminario == capId);

      console.log('capacitacion', this.capacitacion);

      this.agenda_editar                  = {};
      this.capacitacion                   = null;
      this.capacitacion                   = this.capacitaciones.find(c => c.id_seminario == capId);
      this.capacitacion.nombreInstitucion = this.capacitacion.institucion ? this.capacitacion.institucion.nombreInstitucion : this.capacitacion.nombre_institucion_temporal;
      this.agenda_editar.id               = this.capacitacion.id_seminario;
      this.agenda_editar.titulo           = this.capacitacion.nombre;
      this.agenda_editar.personas         = this.capacitacion.cant_asistentes;
      this.agenda_editar.estado           = this.capacitacion.estado_capacitacion;
      this.agenda_editar.observacion      = this.capacitacion.observacion_admin;
      this.agenda_editar.startDate        = this.capacitacion.fecha_inicio;
      this.agenda_editar.endDate          = this.capacitacion.fecha_fin;
      this.agenda_editar.link_reunion     = this.capacitacion.link_reunion;
      this.agenda_editar.asistencia_activa = this.capacitacion.asistencia_activa;
      this.agenda_editar.hora_inicio      = this.capacitacion.hora_inicio;
      this.agenda_editar.hora_fin         = this.capacitacion.hora_fin;
      this.periodoSelect                  = this.capacitacion.periodo;
      this.isOpen                         = true;
    },
    buildDataTable(_capacitaciones) {
      // Inicializa la tabla de datos como un array vacío
      this.tableData = [];

      // Inicializa un array vacío para almacenar los datos de las capacitaciones
      const data = [];

      // Itera sobre cada capacitación en el conjunto de capacitaciones
      _capacitaciones.forEach((cap) => {
        // Crea un objeto para almacenar los datos de la capacitación
        let capacitacion = {
          'id': cap.id_seminario,
          'periodo': cap.periodo.periodoescolar,
          'institucion': cap.institucion ? cap.institucion.nombreInstitucion : cap.nombre_institucion_temporal,
          'ciudad': cap.institucion ? cap.institucion.ciudad.nombre : '-',
          'asesor': `${cap.asesor.nombres} ${cap.asesor.apellidos}`,
          'modalidad': cap.tipo == 0 ? 'Presencial' : 'Virtual',
          'programa': cap.nombre,
          'n_asistentes': cap.cant_asistentes === null ? '-' : cap.cant_asistentes,
          'estado_capacitacion':cap.estado_capacitacion,
          'fecha': moment(cap.fecha_inicio).format('ddd DD [de] MMM, YYYY'),
          'fecha_inicio':cap.fecha_inicio,
          'horario': `${cap.hora_inicio} - ${cap.hora_fin} (${this.getDuration(cap.hora_inicio, cap.hora_fin)} horas)`,
          'tipo':cap.tipo
        };
        // Itera sobre cada capacitador en la lista de capacitadores
        this.capacitadores.forEach((capacitador) => {
          // Inicializa un array vacío para almacenar los capacitadores de la capacitación
          let _capacitadores = [];

          // Si la capacitación tiene capacitadores, los divide en un array
          if (cap.capacitador != null && cap.capacitador != '') {
            _capacitadores = cap.capacitador.split(',');
          }

          // Añade una propiedad al objeto de la capacitación para cada capacitador
          // Si el capacitador está en la lista de capacitadores de la capacitación, asigna 'Asignado'
          // Si no, asigna 'Libre'
          capacitacion[capacitador.capacitador] = _capacitadores.includes(capacitador.capacitador.toString()) ? 'Asignado' : 'Libre';
        });

        // Añade el objeto de la capacitación al array de datos
        data.push(capacitacion)
      });

      // Añade todos los elementos del array de datos a la tabla de datos
      this.tableData.push(...data);
    },
    getDuration(horaInicio, horaFin) {
      const inicio = moment(horaInicio, 'HH:mm:ss');
      const fin = moment(horaFin, 'HH:mm:ss');
      const duration = moment.duration(fin.diff(inicio));
      return duration.asHours().toFixed(2);
    },
  },
  watch: {
    // Esta función se llama cuando el valor de 'periodo' cambia
    periodo(val) {
      this.prevPeriodo = val;
      // Llama a la función 'queryData' para obtener nuevos datos basados en el nuevo periodo
      this.queryData();
      // Comprueba si el nuevo valor es diferente del valor anterior
      // if (val !== this.prevPeriodo) {
      //   // Si es diferente, actualiza el valor anterior con el nuevo valor
      //   this.prevPeriodo = val;
      //   // Llama a la función 'queryData' para obtener nuevos datos basados en el nuevo periodo
      //   this.queryData();
      // }
      // Si el nuevo valor es igual al valor anterior, no hace nada
    },
    mesSelect(){
      this.queryData();
    },
    estadoSelect(){
      this.queryData();
    }
  }
})
</script>

<style>
.fixed-column {
  position: sticky;
  left: 0;
  background-color: white;
}
</style>

<template>
  <div class="w-full flex flex-col space-y-2">
    <div class="vx-row">
      <div class="sm:w-full md:w-full lg:w-1/3 xl:w-1/3 ml-3">
        <small>Período</small>
        <v-select :options="periodos" :reduce="periodos => periodos" label="periodoescolar" class="w-full" v-model="periodo" />
        <!-- <vs-select v-model="periodo" label="Periodo" :search="false" :options="periodos">
          <vs-select-item v-for="(item, index) in periodos" :key="index" :value="item"
            :text="item.periodoescolar"></vs-select-item>
        </vs-select> -->
      </div>
      <div class="sm:w-full md:w-full lg:w-1/3 xl:w-1/3 ml-3">
        <small>Meses</small>
        <v-select :options="meses" :reduce="meses => meses.numero" label="nombre" class="w-full" v-model="mesSelect" />
      </div>
      <div class="sm:w-full md:w-full lg:w-1/4 xl:w-1/4 ml-3">
        <small>Estado</small>
        <v-select :options="arraryStatus" :reduce="arraryStatus => arraryStatus.estado" label="nombre" class="w-full" v-model="estadoSelect" />
      </div>
    </div>
    <br>
    <vs-button @click="exportData" color="primary" class="btn btn-sm mt-5">
      Exportar
    </vs-button>
    <vs-table max-items="10" search stripe pagination :data="tableData">
      <template slot="header">
        <vs-chip>Cantidad {{tableData.length}}</vs-chip>
      </template>
      <template slot="thead">
        <vs-th></vs-th>
        <vs-th class="fixed-column">Capacitación</vs-th>
        <vs-th class="fixed-column" sort-key="fecha_inicio">Programa</vs-th>
        <vs-th v-for="(value, key) in tableData[0]" :key="key"
          v-if="key !== 'id' && key !== 'estado_capacitacion' && key !== 'fecha_inicio' && key !== 'tipo' && key !== 'periodo' && key !== 'institucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'modalidad' && key !== 'programa' && key !== 'n_asistentes' && key !== 'fecha' && key !== 'horario'">
          {{ key.toUpperCase().replace('_', ' ') }}
        </vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            <vs-button @click="editCapacitacion(tr.id)" color="dark" type="line" icon="edit" size="small">
              Editar
            </vs-button>
          </vs-td>
          <vs-td class="fixed-column">
            <div>
              <div style="width: 200px;" class="flex flex-col gap-2">
                <span v-if="currentUser.name_usuario == 'sguacan'"> # {{ tr.id }}</span>
                <span class="flex font-bold">{{ tr.institucion }}</span>
                <span class="text-xs">{{ tr.ciudad }}</span>
                <span class="text-xs">{{ tr.asesor }}</span>
              </div>
            </div>
          </vs-td>
          <vs-td class="fixed-column">
            <div>
              <div style="width: 200px;" class="flex flex-col gap-2">
                <span class="flex font-bold">{{ tr.programa }}</span>
                <span class="text-xs font-bold">Asistentes: <span class="font-normal">{{ tr.n_asistentes }}</span></span>
                <span class="text-xs">{{ tr.fecha }}</span>
                <span class="text-xs">{{ tr.horario}}</span>
              </div>
            </div>
            <br>
            <!--ESTADO CAPACITACION-->
            <p v-if="tr.estado_capacitacion == 0"><vs-chip color="danger"   transparent>Cancelada</vs-chip></p>
            <p v-if="tr.estado_capacitacion == 1"><vs-chip color="warning"  transparent>Pendiente</vs-chip></p>
            <p v-if="tr.estado_capacitacion == 2"><vs-chip color="success"   transparent>Realizada</vs-chip></p>
            <!--TIPO CAPACITACION-->
            <p v-if="tr.tipo == 0"><vs-chip color="dark"   transparent>Presencial</vs-chip></p>
            <p v-if="tr.tipo == 1"><vs-chip color="dark"  transparent>Virtual</vs-chip></p>
          </vs-td>
          <vs-td v-for="(value, key) in tr" :key="key"
            v-if="key !== 'id' && key !== 'fecha_inicio' &&  key !== 'estado_capacitacion' && key !== 'tipo' && key !== 'periodo' && key !== 'institucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'modalidad' && key !== 'programa' && key !== 'n_asistentes' && key !== 'fecha' && key !== 'horario'">
            <span v-if="value === 'Asignado'"
              style="padding: 0.5rem 1rem; background-color: #173F5F; border-radius: 10px;color: #fff; font-weight: bold;">
              {{ value }}
            </span>
            <span v-else-if="value === 'Libre'"
              style="padding: 0.5rem 1rem; background-color: #3CAEA3; border-radius: 10px;color: #fff; font-weight: bold;">
              {{ value }}
            </span>
            <span v-else>
              {{ value }}
            </span>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vs-popup title="Detalles capacitación:" :active.sync="isOpen">
      <editarCapacitacionVue v-if="isOpen" :agenda_editar="agenda_editar" :periodoSelect="periodoSelect"
        :capacitacion="capacitacion" :arreglo-capacitadores="capacitadores" @changeRegresar="regresar()"
        @rechargeSeminarios="getCapacitaciones(), isOpen = !isOpen" />
    </vs-popup>
  </div>
</template>
