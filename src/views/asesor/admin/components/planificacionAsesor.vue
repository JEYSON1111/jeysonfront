<template>
    <div>
        <vs-card>
            <div v-if="abrirModal == true">
                <div class="mt-3">
                    <div class="calendar__label-container flex mb-6" v-if="seleccionadoInsitucion == false">
                        <vs-chip style="width: 100px;height: 25px;margin-top: 1px;" class="text-white" :class="'bg-' + labelLocal.color">{{ labelLocal.text }}</vs-chip>
                            <span v-if="estado == 1"  style="margin-top:2px;">
                                <vs-chip color="success">Realizada</vs-chip>
                            </span>
                        <vs-dropdown vs-custom-content vs-trigger-click class="ml-auto my-2 cursor-pointer">
                            <feather-icon icon="TagIcon" svgClasses="h-5 w-5" class="cursor-pointer" @click.prevent></feather-icon>
                            <vs-dropdown-menu style="z-index: 200001">
                                <vs-dropdown-item v-for="(label, index) in calendarLabels" :key="index" @click="labelLocal = label">
                                    <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                                    <span>{{ label.text }}</span>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </div>

                    <div>

                        <vs-row v-if="seleccionadoInsitucion ==  false" class="mt-2">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null ">
                                    Sin Institución
                                </p>
                                <vs-chip color="success" v-else>
                                    Institución {{ nombreInstitucion}}
                                </vs-chip>
                            </vs-col>
                        </vs-row>
                        <vs-row v-if="seleccionadoInsitucion ==  true" class="mt-2">
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
                                <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply" type="gradient"></vs-button>
                                <vs-button size="small" class="ml-3" @click="popupAddNuevaInstitucion = true;activePromptAddEvent = false;" type="relief">Añadir nueva institución</vs-button>
                            </vs-col>

                        </vs-row>

                        <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false" size="small" style="margin:0 auto;" @click="seleccionadoInsitucion = true;" type="relief">Asignar Institución</vs-button>
                        <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion ==  true" class="mt-5">
                            <div style="width:80%;">
                                <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucionAsesor()" v-model="busquedaInstitucion" />
                            </div>

                            <div style="width:20%;margin-left:15px;">
                                <vs-button radius color="warning" @click="getInstitucionAsesor()" type="filled" icon="search"></vs-button>
                            </div>
                        </div>

                        <div v-if="institucionesAsesor.length >0">
                            <vs-table stripe max-items="5" search pagination :data="institucionesAsesor">
                                <template slot="header">
                                    <div class="vx-row">
                                        <div class="vx-col w-full m-3">
                                            Cantidad: {{institucionesAsesor.length}}
                                        </div>

                                    </div>
                                </template>
                                <template slot="thead">
                                    <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                                    <vs-th sort-key="nombre">Localidad</vs-th>
                                    <vs-th>Acciones</vs-th>
                                </template>
                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                                        <vs-td :data="data[indextr].nombreInstitucion">
                                            {{data[indextr].nombreInstitucion}}<br>

                                        </vs-td>
                                        <vs-td :data="data[indextr].nombreregion">
                                            {{data[indextr].nombreregion}} <br>
                                            <small>{{data[indextr].ciudad}}</small>
                                        </vs-td>
                                        <vs-td>
                                            <div class="flex">
                                                <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr);error=false">
                                                    Asignar
                                                </vs-button>
                                            </div>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>

                    </div>
                    <vs-row v-if="error ==  true" class="mt-3">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <vs-alert active="true" color="danger">
                                    {{messageError}}
                                </vs-alert>
                            </vs-col>
                    </vs-row>
                    <div v-if="seleccionadoInsitucion == false">
                        <br>
                        <vs-input class="w-full mb-3 " label-placeholder="Título del evento *" v-model="title"></vs-input>
                        <div class="vx-row mb-3">
                            <div class="vx-col sm:w-1/2 w-full">
                                <small class="date-label">Fecha inicio *</small>
                                <datepicker class="w-full" name="start-date" v-model="startDate" @input="formatoFechas()" :disabled="disabledFrom"></datepicker>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <small class="date-label">Fecha fin *</small>
                                <datepicker class="w-full" :disabledDates="disabledDatesTo" @input="formatoFechas()" name="end-date" v-model="endDate"></datepicker>
                            </div>
                        </div>

                        <div class="vx-row mb-3">
                            <div class="vx-col sm:w-1/2 w-full">
                                <small class="date-label">Hora inicio *</small>
                                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_inicio" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <small class="date-label">Hora fin *</small>
                                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_fin" />
                            </div>
                        </div>
                    </div>

                    <div>

                        <vs-divider color="success" v-if="seleccionadoInsitucion == false">Opciones</vs-divider>
                        <vs-row v-if="seleccionadoInsitucion == false">
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.presentacion">Presentación</vs-checkbox>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.entrega_muestras">Entregas de muestras</vs-checkbox>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.reunion">Reunión</vs-checkbox>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.seguimiento">Seguimiento</vs-checkbox>
                            </vs-col>

                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.cierre">Cierre</vs-checkbox>
                            </vs-col>
                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.cobranza">Cobranza</vs-checkbox>
                            </vs-col>
                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.post_venta">Post Venta</vs-checkbox>
                            </vs-col>
                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.retiro_cartas">Retiro de cartas</vs-checkbox>
                            </vs-col>

                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.retiro_muestras">Retiro de muestras</vs-checkbox>
                            </vs-col>

                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-switch color="danger" v-model="opciones.sinSello" style="width: 60%;">
                                    <span slot="on">Sin sello</span>
                                    <span slot="off">Con Sello</span>
                                </vs-switch>
                            </vs-col>
                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
                            </vs-col>
                            <vs-col v-if="opciones.otraEditorial == true" class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-input class="inputx w-full" placeholder="Escriba el nombre de la editorial" v-model="opciones.editorial" />
                            </vs-col>
                        </vs-row>
                    </div>

                    <vs-textarea counter="250" label="Mensaje" :counter-danger.sync="counterDanger" v-if="seleccionadoInsitucion == false" name="event-url" class="w-full mb-3 mt-4" v-model="url" />
                    <vs-row class="mt-3">
                        <vs-col vs-type="flex" vs-justify="right" vs-align="right" vs-w="12">
                            <vs-button @click="addEvent()" type="relief">Guardar</vs-button>
                            <vs-button color="warning" class="ml-2" type="relief">{{label_cancel}}</vs-button>
                        </vs-col>
                    </vs-row>
                </div>
            </div>
            <vs-collapse accordion v-if="abrirModal == false">
                <vs-collapse-item>
                    <div slot="header">
                        Registros Pendientes con Instituciones de Prolipa
                    </div>
                    <div>
                        <vs-table max-items="10" stripe search pagination :data="institucionesProlipa" class="mt-2">
                            <template slot="thead">
                                <vs-th>Datos Planificación</vs-th>
                                <vs-th>Opciones</vs-th>
                                <vs-th>Prioridad</vs-th>
                                <vs-th>Observación</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                                    <vs-td>
                                        Titulo:
                                        <br>
                                        <span style="font-weight:600;">

                                            {{ tr.title }}<br>
                                        </span>

                                        Fecha inicio:
                                        <br>
                                        <span style=" font-weight:600; ">
                                            {{ tr.startDate }}<br>
                                        </span>

                                        Fecha Fin:
                                        <br>
                                        <span style="font-weight:600;  ">
                                            {{ tr.endDate }}<br>
                                        </span>
                                        Institución:
                                        <br>
                                        <span style="font-weight:600;  ">
                                            {{ tr.nombreInstitucion }}<br>
                                        </span>
                                    </vs-td>
                                    <vs-td height="30%" width="50%">
                                        <div class="overflow-y-auto h-24">

                                            <vs-chip color="primary" v-if="tr.opciones.presentacion">
                                                Presentación
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.entrega_muestras">
                                                Entrega muestras
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.reunion">
                                                Reunión
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.seguimiento">
                                                Seguimiento
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.cierre">
                                                Cierre
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.cobranza">
                                                Cobranza
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.post_venta">
                                                Post venta
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.retiro_cartas">
                                                Retiro cartas
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.retiro_muestras">
                                                Retiro muestras
                                            </vs-chip>
                                        </div>
                                    </vs-td>
                                    <vs-td>
                                        <vs-chip color="success">
                                            {{tr.label}}
                                        </vs-chip>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.url}}
                                    </vs-td>
                                    <vs-td>
                                        <div style="display: flex;">
                                            <vx-tooltip style="display: inline-block;" text="Registrar Planificación" position="top" color="warning">
                                                <vs-button   @click="openEditPlanificacion(tr)"  size="small" color="primary" type="line" icon-pack="feather" icon="icon-bookmark">

                                                </vs-button>
                                            </vx-tooltip> &nbsp;
                                            <!-- <vx-tooltip style="display: inline-block;" text="Marcar como registrado" position="top" color="primary">
                                                <vs-button class="modal-default-button" radius @click="confirmarRegistroPendiente(tr)" size="small" color="success" type="line" icon-pack="feather" icon="icon-check-circle">
                                                </vs-button>
                                            </vx-tooltip> &nbsp; -->
                                        </div>
                                    </vs-td>

                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-collapse-item>
                <vs-collapse-item>
                    <div slot="header">
                        Registros Pendientes con Instituciones Nuevas
                    </div>
                    <div>

                        <vs-table max-items="10" stripe search pagination :data="institucionesTemporales" class="mt-2">
                            <template slot="thead">
                                <vs-th>Datos Planificación</vs-th>
                                <vs-th>Opciones</vs-th>
                                <vs-th>Prioridad</vs-th>
                                <vs-th>Observación</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                                    <vs-td>

                                        Titulo:
                                        <br>
                                        <span style="font-weight:600;  ">
                                            {{ tr.title }}<br>
                                        </span>

                                        Fecha inicio:
                                        <br>
                                        <span style=" font-weight:600; ">
                                            {{ tr.startDate }}<br>
                                        </span>

                                        Fecha Fin:
                                        <br>
                                        <span style="font-weight:600;  ">
                                            {{ tr.endDate }}<br>
                                        </span>
                                        Institución:
                                        <br>
                                        <span style="font-weight:600;  ">
                                            {{ tr.nombre_institucion_temporal }}<br>
                                        </span>
                                    </vs-td>
                                    <vs-td height="30%" width="50%">
                                        <div class="overflow-y-auto h-24">
                                            <vs-chip color="primary" v-if="tr.opciones.presentacion">
                                                Presentación
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.entrega_muestras">
                                                Entrega muestras
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.reunion">
                                                Reunión
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.seguimiento">
                                                Seguimiento
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.cierre">
                                                Cierre
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.cobranza">
                                                Cobranza
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.post_venta">
                                                Post venta
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.retiro_cartas">
                                                Retiro cartas
                                            </vs-chip>
                                            <vs-chip color="primary" v-if="tr.opciones.retiro_muestras">
                                                Retiro muestras
                                            </vs-chip>
                                        </div>
                                    </vs-td>
                                    <vs-td>
                                        <vs-chip color="success">
                                            {{tr.label}}
                                        </vs-chip>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.url}}
                                    </vs-td>
                                    <vs-td>
                                        <div style="display: flex;">
                                            <vx-tooltip style="display: inline-block;" text="Registrar Planificación" position="top" color="warning">
                                                <vs-button class="modal-default-button"  @click="openEditPlanificacion(tr)" radius size="small" color="primary" type="line" icon-pack="feather" icon="icon-bookmark">

                                                </vs-button>
                                            </vx-tooltip> &nbsp;
                                            <!-- <vx-tooltip style="display: inline-block;" text="Marcar como registrado" position="top" color="primary">
                                                <vs-button class="modal-default-button" radius @click="confirmarRegistroPendiente(tr)" size="small" color="success" type="line" icon-pack="feather" icon="icon-check-circle">
                                                </vs-button>
                                            </vx-tooltip> &nbsp; -->
                                        </div>
                                    </vs-td>

                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>

                </vs-collapse-item>

            </vs-collapse>
        </vs-card>
    </div>
</template>

<script>
import moduleCalendar from '@/store/calendar2/moduleCalendar.js'
import vSelect from 'vue-select'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    en,
    he
} from 'vuejs-datepicker/src/locale'
export default {

    data() {
      return{
        institucionesProlipa:[],
        institucionesTemporales:[],
        abrirModal:false,
         //VARIABLES DE AGREGAR PLANIFICACION

          popupFiltroInstitucion:false,
            error: false,
            messageError: "",
            ciudadSelect: '',
            popupAddNuevaInstitucion: false,
            seleccionadoInsitucion: false,
            nombreInstitucion: '',
            busquedaInstitucion: "",
            instituciones: [],
            popupaddInstitucion: false,
            opciones: {
                presentacion: false,
                entrega_muestras: false,
                reunion: false,
                seguimiento: false,
                cierre: false,
                cobranza: false,
                post_venta: false,
                retiro_cartas: false,
                retiro_muestras: false,
                sinSello: true,
                editorial: '',
                otraEditorial: false,
            },

            usuario: [],
            showDate: new Date(),
            disabledFrom: false,
            titulo: '',
            id: 0,
            title: '',
            startDate: '',
            endDate: '',
            labelLocal: {
                text: 'Baja',
                color: 'success'
            },
            startDate_send: '',
            endDate_sed: '',
            langHe: he,
            langEn: en,

            url: '',
            calendarView: 'month',

            activePromptAddEvent: false,
            label_cancel: 'Cancelar',
            calendarViewTypes: [{
                    label: 'Mes',
                    val: 'month'
                },
                {
                    label: 'Semana',
                    val: 'week'
                },
                {
                    label: 'Año',
                    val: 'year'
                }
            ],
            time: null,
            configdateTimePicker: {
                enableTime: true,
                enableSeconds: false,
                noCalendar: true
            },
            hora_inicio: '',
            hora_fin: '',
            institucion_id: '',
            counterDanger: false,
            arregloCiudad: [],
            temporalInstitucion: {
                ciudad: '',
                nombreInstitucion: '',
                region: '2',
            },
            institucion_id_temporal: '',
            estado_institucion_temporal: 0,
            periodo_id_temporal: 0,
            nombreInstitucionTemporal: '',
            filtroInstituciones:[],
            estado: '0',
            institucionesAsesor:[],
            titulo:'',
      }
    },
    components: {
        Datepicker,
        flatPickr,
        'v-select': vSelect,

    },
    mounted(){
        let me = this;
        me.getRegistrosPendientes();
         this.listaCiudades()
    },
    computed: {
        simpleCalendarEvents() {
            return this.$store.state.calendar.events
        },
        disabledDatesTo() {
            return {
                to: new Date(this.startDate)
            }
        },
        disabledDatesFrom() {
            return {
                from: new Date(this.endDate)
            }
        },
        calendarLabels() {
            return this.$store.state.calendar.eventLabels
        },
        labelColor() {
            return (label) => {
                if (label === 'business') return 'success'
                else if (label === 'work') return 'warning'
                else if (label === 'personal') return 'danger'
                else if (label === 'baja') return 'primary'
            }
        },
        windowWidth() {
            return this.$store.state.windowWidth
        }
    },
    methods:{
         //para obtener el listado de los asesores
        getRegistrosPendientes() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'seguimiento?asesor_id=' + localStorage.planificacion_asesor_id + '&pendientes=yes')
                .then(function (res) {
                    let datosProlipa = res.data.institucionesProlipa

                    for (let i = 0; i < datosProlipa.length; i++) {

                        me.institucionesProlipa.push({
                            "id": datosProlipa[i].id,
                            "id_usuario": datosProlipa[i].id_usuario,
                            "title": datosProlipa[i].title,
                            "label": datosProlipa[i].label,
                            "classes": datosProlipa[i].classes,
                            "startDate": datosProlipa[i].startDate,
                            "endDate": datosProlipa[i].endDate,
                            "hora_inicio": datosProlipa[i].hora_inicio,
                            "hora_fin": datosProlipa[i].hora_fin,
                            "url": datosProlipa[i].url,
                            "institucion_id": datosProlipa[i].institucion_id,
                            "institucion_id_temporal": datosProlipa[i].institucion_id_temporal,
                            "nombre_institucion_temporal": datosProlipa[i].nombre_institucion_temporal,
                            "estado_institucion_temporal": datosProlipa[i].estado_institucion_temporal,
                            "opciones": JSON.parse(datosProlipa[i].opciones),
                            "periodo_id": datosProlipa[i].periodo_id,
                            "estado": datosProlipa[i].estado,
                            "idperiodoescolar": datosProlipa[i].idperiodoescolar,
                            "periodo": datosProlipa[i].periodo,
                            "nombreInstitucion": datosProlipa[i].nombreInstitucion,
                            "vendedor": datosProlipa[i].vendedor
                        })
                    }

                    //para las instituciones temporales
                    let datosTemporales = res.data.institucionesTemporales

                    for (let i = 0; i < datosTemporales.length; i++) {

                        me.institucionesTemporales.push({
                            "id": datosTemporales[i].id,
                            "id_usuario": datosTemporales[i].id_usuario,
                            "title": datosTemporales[i].title,
                            "label": datosTemporales[i].label,
                            "classes": datosTemporales[i].classes,
                            "startDate": datosTemporales[i].startDate,
                            "endDate": datosTemporales[i].endDate,
                            "hora_inicio": datosTemporales[i].hora_inicio,
                            "hora_fin": datosTemporales[i].hora_fin,
                            "url": datosTemporales[i].url,
                            "institucion_id": datosTemporales[i].institucion_id,
                            "institucion_id_temporal": datosTemporales[i].institucion_id_temporal,
                            "nombre_institucion_temporal": datosTemporales[i].nombre_institucion_temporal,
                            "estado_institucion_temporal": datosTemporales[i].estado_institucion_temporal,
                            "opciones": JSON.parse(datosTemporales[i].opciones),
                            "periodo_id": datosTemporales[i].periodo_id,
                            "estado": datosTemporales[i].estado,
                            "idperiodoescolar": datosTemporales[i].idperiodoescolar,
                            "periodo": datosTemporales[i].periodo,
                            "nombreInstitucion": datosTemporales[i].nombreInstitucion,
                            "vendedor": datosTemporales[i].vendedor
                        })
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

         openEditPlanificacion(tr) {
            let datos = tr.opciones
            this.id = tr.id
            if(tr.title == null){
            }else{
                this.title = tr.title.split('(')[0]
            }
            this.startDate = tr.startDate
            this.endDate = tr.endDate
            this.url = tr.url
            if(tr.classes == null){
            }else{
                this.labelLocal = {
                    text: tr.label,
                    color: tr.classes.split('-')[1]
                }
            }

            this.startDate_send = this.startDate
            this.endDate_send = this.endDate
            this.hora_inicio = tr.hora_inicio
            this.hora_fin = tr.hora_fin
            this.label_cancel = 'Cancelar'
            this.abrirModal = true
            this.estado = tr.estado
            this.opciones.presentacion = datos.presentacion
            this.opciones.entrega_muestras = datos.entrega_muestras
            this.opciones.reunion = datos.reunion
            this.opciones.seguimiento = datos.seguimiento
            this.opciones.cierre = datos.cierre
            this.opciones.cobranza = datos.cobranza
            this.opciones.post_venta = datos.post_venta
            this.opciones.retiro_cartas = datos.retiro_cartas
            this.opciones.retiro_muestras = datos.retiro_muestras
            // this.opciones.sinSello = datos.sinSello
            this.opciones.otraEditorial = datos.otraEditorial
            if (this.opciones.otraEditorial == false) {
                this.opciones.editorial = ""
            } else {
                this.opciones.editorial = datos.editorial
            }

            if (tr.estado_institucion_temporal == "1") {
                this.nombreInstitucion = tr.nombre_institucion_temporal
                this.institucion_id_temporal = tr.institucion_id_temporal
                this.periodo_id_temporal = tr.periodo_id
                this.estado_institucion_temporal = 1
            } else {
                this.nombreInstitucion = tr.nombreInstitucion
                this.institucion_id = tr.institucion_id
                this.estado_institucion_temporal = 0

            }

        },
        agregarInstitucionTemporal() {
            let me = this;
            if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una institución por favor'
                })
                return false;
            }

            let formData = new FormData();
            formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
            formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
            formData.append('region', me.temporalInstitucion.region);
            formData.append('asesor_id', localStorage.planificacion_asesor_id);

            me.$vs.loading()
            this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
                .then(res => {

                    me.$vs.loading.close()
                    me.popupAddNuevaInstitucion = false;
                    me.abrirModal = true
                    me.seleccionadoInsitucion = false;
                    me.nombreInstitucion = me.temporalInstitucion.nombre_institucion
                    me.institucion_id_temporal = res.data.institucion_temporal_id
                    me.institucionesAsesor = []
                    me.periodo_id_temporal = res.data.periodo_id
                    me.estado_institucion_temporal = 1;

                    me.$vs.notify({
                        text: "Se guardo correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + `ciudad`).then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        regresar() {
            let me = this;
            me.seleccionadoInsitucion = false;
            me.institucionesAsesor = []
            me.error = false
        },

        asginarInstitucion(tr) {
            let me = this;
            me.institucion_id = tr.idInstitucion
            me.nombreInstitucion = tr.nombreInstitucion
            me.estado_institucion_temporal = 0;
            me.seleccionadoInsitucion = false;
            me.institucionesAsesor = []

        },

        getInstitucionAsesor() {
            let me = this;
            me.institucionesAsesor = [];
            if (me.busquedaInstitucion.length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + localStorage.planificacion_cedula)
                .then(function (res) {
                    // me.tmpInstituciones = res.data;
                    me.institucionesAsesor = res.data;
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user',
                            time: 8000
                        })
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        addEvent() {
            let me = this
            if(this.estado == 1){
                me.error = true
                me.messageError = "La Planificación ya fue registrada ya no puede ser modificada"
                me.abrirModal = true
                return false
            }
            if (this.institucion_id == "" && this.institucion_id_temporal == "") {
              if (me.longitudCapacitaciones > 1) {
                me.error = true
                me.messageError = "Existe mas de 2 capacitaciones para este libro, eliga para otro dia"
                me.abrirModal = true
                return false
               }
                me.error = true;
                me.messageError = "Seleccione una institución por favor";
                me.abrirModal = true
                return false;
            }
            if (this.title == '' || this.startDate_send == '') {
                me.error = true;
                me.messageError = "Complete todos los campos antes de guardar";
                me.abrirModal = true
                return false;
            }
             //si el asesor agrega otra editorial debe validarse que ingrese una institucion
            if (this.opciones.otraEditorial == true) {
                // si es tipo de institucion  de prolipa
                me.abrirModal = true
                if (this.opciones.editorial == "") {
                    me.error = true;
                    me.messageError = "Ha seleccionado otra editorial tiene que agregar una editorial por favor";
                    me.abrirModal = true
                    return false;
                }
                if (this.estado_institucion_temporal == 0) {
                    if (this.institucion_id == "" || this.institucion_id == null || this.institucion_id == 0 || this.institucion_id == "null") {
                        me.error = true;
                        me.messageError = "Ha seleccionado otra editorial tiene que agregar una institución por favor";
                        me.abrirModal = true
                        return false;
                    }
                }
                if (this.estado_institucion_temporal == 1) {
                    if (this.institucion_id_temporal == "" || this.institucion_id_temporal == null || this.institucion_id_temporal == 0 || this.institucion_id_temporal == "null") {
                        me.error = true;
                        me.messageError = "Ha seleccionado otra editorial tiene que agregar una institución por favor";
                        me.abrirModal = true
                        return false;
                    }
                }
            }
            const obj = {

                idusuario: localStorage.planificacion_asesor_id,
                title: this.title,
                startDate: this.startDate_send,
                endDate: this.endDate_send,
                classes: 'event-' + this.labelLocal.color,
                label: this.labelLocal.text,
                url: this.url,
                hora_inicio: this.hora_inicio.substring(0, 5),
                hora_fin: this.hora_fin.substring(0, 5),
                institucion_id: this.institucion_id,
                opciones: this.opciones,
                institucion_id_temporal: this.institucion_id_temporal,
                estado_institucion_temporal: this.estado_institucion_temporal,
                periodo_id_temporal: this.periodo_id_temporal,
                nombreInstitucion: this.nombreInstitucion,
                otraEditorial: this.opciones.otraEditorial,
                nombre_editorial: this.opciones.editorial

            }
            me.save(obj)

        },

        save(obj){
            let me = this;
            let formData = new FormData();
            me.institucionesProlipa = []
            me.institucionesTemporales = []
            formData.append('id', 0);
            formData.append('idusuario', obj.idusuario);
            formData.append('title', obj.title);
            formData.append('label', obj.label);
            formData.append('classes', obj.classes);
            formData.append('startDate', obj.startDate);
            formData.append('endDate', obj.endDate);
            formData.append('hora_inicio', obj.hora_inicio);
            formData.append('hora_fin', obj.hora_fin);
            formData.append('url', obj.url);
            formData.append('institucion_id', obj.institucion_id);
            formData.append('opciones', JSON.stringify(obj.opciones));
            formData.append('institucion_id_temporal', obj.institucion_id_temporal);
            formData.append('estado_institucion_temporal', obj.estado_institucion_temporal);
            formData.append('periodo_id_temporal', obj.periodo_id_temporal);
            formData.append('nombreInstitucion', obj.nombreInstitucion);
            formData.append('otraEditorial', obj.otraEditorial);
            formData.append('nombre_editorial', obj.nombre_editorial);
               me.$vs.loading()
              this.$http.post(this.$server_url+'save_planificacion', formData)
              .then(res => {

                  me.$vs.loading.close()
                  me.abrirModal = false;
                //   me.registrarPendiente()
                  me.limpiar();
                  me.$vs.notify({
                  text:'Planificación agregada con exito',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })
        },

           registrarPendiente() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.id);
            this.$http.post(this.$server_url + 'seguimiento-registrar', formData)
                .then(res => {
                    me.getRegistrosPendientes();
                    me.$vs.notify({
                        text: 'Se registro con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })


                })
                .catch(function (error) {
                    console.log(error + ' error');
                })

        },

        limpiar(){
            let me = this;
            me.title = "";
            me.titulo = "";
            me.hora_inicio = "";
            me.hora_fin = "";
            me.nombre_institucion = "";
            me.url = "";

        },
    }
}
</script>
