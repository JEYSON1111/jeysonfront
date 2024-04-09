<template>
    <div>
        
        <vs-card>
             <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-alert active="true" color="success">
                        <p style="text-align:center;">
                          <i class="fa fa-address-book" aria-hidden="true"></i>  Gestión de visitas del asesor
                        </p>
                    </vs-alert>
                </vs-col>
            </vs-row>

            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6" style="padding:10px;20px;">
                    <ul class="leftx" style="display:flex;flex-direction: row;">
                        Instituciones:
                        <vs-row style="background-color:">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
                                <li class="ml-4">
                                    <vs-radio v-model="filtro.tipoInstitucion" @input="instituciones = [];getInstitucion();" vs-name="radioFiltro"  vs-value="1">Prolipa</vs-radio>
                                </li>
                            </vs-col>
                             <vs-col vs-type="flex" vs-justify="right"  vs-align="right" vs-w="9">
                                <li class="ml-1">
                                    <vs-radio v-model="filtro.tipoInstitucion"  @input="instituciones = [];getInstitucion();" vs-name="radioFiltro" vs-value="2">Creadas por el asesor</vs-radio>
                                </li>
                            </vs-col>
                        </vs-row>
                    </ul>

                </vs-col>

              
                <vs-col vs-type="flex" vs-justify="center" class="ml-5" vs-align="center" vs-w="5">
                     Filtro de instituciones
                     <v-select :options="instituciones" @input="getAllVisitas();filtroInstitucion=true" :reduce="instituciones => instituciones" label="nombreInstitucion" class="w-full" v-model="filtro.institucion" />
                </vs-col>
            </vs-row>

            <vs-table max-items="10" stripe search pagination :data="informacion">
                <template slot="header">
                    <div style="display:flex">
                        <div>
                                Cantidad de visitas: <span style="font-weight:bold;">{{informacion.length}}</span>
                        </div>
                               
                    </div>
                </template>
                <template slot="thead">
                    
                    <vs-th>Institución</vs-th>
                    <vs-th>Título</vs-th>
                    <vs-th>Asesor</vs-th>
                    <vs-th>Fecha</vs-th>
                    <vs-th>Observaciones</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th  style="width:100px;">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            
                            <div v-if="tr.estado_institucion_temporal == '1'">
                                {{data[indextr].nombre_institucion_temporal}}<br>
                                {{ tr.periodo }}
                            </div>
                            <div v-else>
                                {{data[indextr].nombreInstitucion}}<br>
                                {{ tr.periodo }}
                            </div>
                            
                        </vs-td>
                        <vs-td> 
                        
                            {{tr.title}}<br>
                            
                        </vs-td>
                        <vs-td>
                            {{tr.asesor}}<br>
                        </vs-td>
                        <vs-td>
                            Fecha generar visita:
                            <span>{{tr.fecha_genera_visita}}</span><br>
                            Fecha que visita:
                            <span>{{tr.fecha_que_visita}}</span>
                            
                        </vs-td>
                        <vs-td>  
                            {{tr.observacion}}<br>
                        </vs-td>
                        <vs-td>
                            <vs-chip :color="tr.estado == '0'?'success':'warning'">
                                {{ tr.estado == '0' ? 'Generada' :'Finalizada' }}
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Editar planificación" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" @click="openEditPlanificacion(tr);update=true" color="success" radius type="line" icon-pack="feather" icon="icon-edit"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </div>
                        </vs-td>     
                    </vs-tr>
                </template>
            </vs-table>
        </vs-card>
          <!--MODALES-->
        <!--MODAL PARA AGREGAR PLANIFICACION-->
           <vs-popup background-color="rgba(255,255,255,.6)" fullscreen :title="titulo" :active.sync="activePromptAddEvent">
                <div  class="mt-3">
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

                        <vs-row>
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
                                <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false" size="small"  @click="seleccionadoInsitucion = true;tipo = 1" type="relief">Asignar institución de prolipa</vs-button>
                                <vs-button color="primary" class="mt-2 ml-3" icon="info" v-if="seleccionadoInsitucion == false" size="small"  @click="seleccionadoInsitucion = true;getInstitucionCreadasByAsesor();tipo = 2;" type="relief">Institución creada por el asesor</vs-button>
                            </vs-col>
                        </vs-row>
                        
                        <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion ==  true && tipo == 1" class="mt-5">
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
                            <div class="vx-col sm:w-1/2 w-full" v-if="update == true">
                                <small class="date-label">Fecha que visitó</small>
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

                        <vs-divider color="success" v-if="seleccionadoInsitucion == false">Opcioness</vs-divider>
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
                            
                            <vs-col class="mt-2"  vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-switch color="danger" disabled v-model="opciones.sinSello" style="width: 60%;">
                                    <span slot="on">Sin sello</span>
                                    <span slot="off">Con Sello</span>
                                </vs-switch>
                            </vs-col>
                            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-checkbox color="success" disabled v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
                            </vs-col>
                            <vs-col v-if="opciones.otraEditorial == true" class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                                <vs-input class="inputx w-full" disabled placeholder="Escriba el nombre de la editorial" v-model="opciones.editorial" />
                            </vs-col>
                        </vs-row>
                    </div>

                    <vs-textarea counter="250" label="Mensaje" :counter-danger.sync="counterDanger" v-if="seleccionadoInsitucion == false" name="event-url" class="w-full mb-3 mt-4" v-model="url" />
                    <vs-row class="mt-3">
                        <vs-col vs-type="flex" vs-justify="right" vs-align="right" vs-w="12">
                            <vs-button @click="addEvent()" type="relief">Guardar</vs-button>
                            <vs-button color="warning" class="ml-2" @click="activePromptAddEvent = false" type="relief">{{label_cancel}}</vs-button>
                        </vs-col>
                    </vs-row>
                </div>
        </vs-popup>

        <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->
        <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución" :active.sync="popupAddNuevaInstitucion">
            <vs-button size="small" color="success" radius="" @click="popupAddNuevaInstitucion=false;activePromptAddEvent=true;" icon="reply" type="gradient"></vs-button>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="vx-col w-full mt-5">

                        Seleccione una ciudad:
                        <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                    </div>
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-input label="Escriba un nombre para la institución" class="w-full" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
                </vs-col>
            </vs-row>

            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <ul class="leftx" style="display:flex;flex-direction: row;">

                        <li class="ml-2">
                            <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                        </li>
                        <li class="ml-2">
                            <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="2">Costa</vs-radio>
                        </li>

                    </ul>
                </vs-col>
            </vs-row>
            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="agregarInstitucionTemporal();error = false" type="gradient">Agregar Institución</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>

     
    </div>
</template>

<script>
import vSelect from 'vue-select'
import moment from 'moment'
import visitasVue from "../../../../asesor/seguimiento/components/visitas.vue";
import {
    CalendarView,
    CalendarViewHeader
} from 'vue-simple-calendar'
import moduleCalendar from '@/store/calendar2/moduleCalendar.js'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    en,
    he
} from 'vuejs-datepicker/src/locale'
export default{
    components:{
        vSelect,
        CalendarView,
        CalendarViewHeader,
        Datepicker,
        flatPickr,
    },
    data(){
        return{
            filtroInstitucion:false,
            usuario:[],
            informacion:[],
            filtro:{
                institucion:'',
                tipoInstitucion:'1',
             },
            verPlanificaciones:false,
         asesores:[],
         filtro:{
             asesor:'',
             institucion:'',
             tipoInstitucion:'1',
             todo:false
         },
        instituciones:[],
        asesor:'',
        informacion:[],
        filtroInstitucion:false,
        activePromptAddEvent:false,

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
            update:false,
            tipo:1
          
        }
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
        },
     },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getAllVisitas(); 
        this.$store.registerModule('calendar', moduleCalendar)
        this.$store.dispatch('calendar/fetchEventLabels')
        this.listaCiudades()
        this.institucion_id = ""
        this.institucion_id_temporal = ""
    },
    mounted(){
        let me = this;
        me.getInstitucion();  
    },

 
    methods:{
        //visitas registradas del asesor
       getAllVisitas(){
            let me = this;
            me.informacion = []
            this.$http.get(this.$server_url + 'listaInsitucionAsesor?todo=yes'+'&asesor_id=' + me.usuario.idusuario)

                .then(function (res) {
                   if(me.filtroInstitucion == true){
                      let datos = res.data
                      //FILTRO PARA INSTITUCIONES DE PROLIPA
                      if(me.filtro.tipoInstitucion == 1){
                            me.informacion = datos.filter(p => p.institucion_id == me.filtro.institucion.idInstitucion) 
                      //FILTRO POR INSTITUCION TEMPORAL       
                      }else{
                            me.informacion = datos.filter(p => p.institucion_id_temporal == me.filtro.institucion.institucion_temporal_id)
                      }         
                   }else{
                      me.informacion = res.data;
                   } 
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },

        getInstitucion() {
            let me = this;
            me.instituciones = [];
            me.filtroInstitucion = false
            me.$vs.loading()
            //INSTITUCIONES DE PROLIPA
            if(me.filtro.tipoInstitucion == 1){
                  this.$http.get(this.$server_url + 'listaInsitucionAsesor?porCedula=yes'+'&cedula=' + me.usuario.cedula)
                .then(function (res) {
                    me.instituciones = res.data;
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
            //INSTITUCIONES CREADAS POR EL ASESOR
            }if(me.filtro.tipoInstitucion == 2){
                  this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes'+'&asesor_id=' + me.usuario.idusuario)
                .then(function (res) {
                    // me.tmpInstituciones = res.data;
                    me.instituciones = res.data;
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
            }
           
            me.getAllVisitas()
        },

         openEditPlanificacion(tr) {
            this.labelLocal = {
                text: 'Baja',
                color: 'success'
            }
            let datos = JSON.parse(tr.opciones)
            this.id = tr.id
            if(tr.title == null){
                tr.title = ""
            }else{
                this.title = tr.title.split('(')[0]
            } 
            this.startDate = tr.fecha_genera_visita
            this.endDate = tr.fecha_que_visita
            this.url = tr.observacion
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
            this.activePromptAddEvent = true
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
            if(me.tipo == 1){
                me.institucion_id = tr.idInstitucion
                me.nombreInstitucion = tr.nombreInstitucion
                me.estado_institucion_temporal = 0;
                me.seleccionadoInsitucion = false;
                me.institucionesAsesor = []
            }else{
                me.nombreInstitucion = tr.nombreInstitucion
                me.institucion_id_temporal = tr.institucion_temporal_id
                me.institucionesAsesor = []
                me.periodo_id_temporal = tr.periodo_id
                me.estado_institucion_temporal = 1;
                me.seleccionadoInsitucion = false;
            }
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
            this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula)
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
        //instituciones creadas por el asesor
         getInstitucionCreadasByAsesor() {
            let me = this;
            me.institucionesAsesor = [];
           
             this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes'+'&asesor_id=' + me.usuario.idusuario)
                .then(function (res) {
                    me.institucionesAsesor = res.data;
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

          formatoFechas() {
            this.startDate_send = moment(this.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            this.endDate_send = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            // alert(' frmat:  '+this.endDate_send)
        },

        addEvent() {
            let me = this
            me.error = false
      
            if(me.startDate_send == 'Invalid date'){
                this.startDate_send = this.startDate
            }

            if(me.endDate_send == 'Invalid date'){
                this.endDate_send = this.endDate
            }
            
        
            if (this.institucion_id == "" && this.institucion_id_temporal == "") {
              if (me.longitudCapacitaciones > 1) {
                me.error = true
                me.messageError = "Existe mas de 2 capacitaciones para este libro, eliga para otro dia"
                me.activePromptAddEvent = true
                return false
               }
                me.error = true;
                me.messageError = "Seleccione una institución por favor";
                me.activePromptAddEvent = true
                return false;
            }    
            if (this.title == '' || this.startDate_send == '' || this.hora_inicio == null || this.hora_fin == null) {
                me.error = true;
                me.messageError = "Campos con asterisco obligatorios";
                me.activePromptAddEvent = true
                return false;
            }

             //validar que selecciona los checkbox
            if(me.opciones.presentacion == false && me.opciones.entrega_muestras == false && me.opciones.reunion == false && me.opciones.seguimiento == false && me.opciones.cierre == false && me.opciones.cobranza == false && me.opciones.post_venta == false && me.opciones.retiro_cartas == false && me.opciones.retiro_muestras == false)
            {
                me.error = true;
                me.messageError = "Debe marcar al menos un recuadro";
                me.activePromptAddEvent = true
                return false;
            }
      
             //si el asesor agrega otra editorial debe validarse que ingrese una institucion
            if (this.opciones.otraEditorial == true) {
                // si es tipo de institucion  de prolipa
                me.activePromptAddEvent = true
                if (this.opciones.editorial == "") {
                    me.error = true;
                    me.messageError = "Ha seleccionado otra editorial tiene que agregar una editorial por favor";
                    me.activePromptAddEvent = true
                    return false;
                }
                if (this.estado_institucion_temporal == 0) {
                    if (this.institucion_id == "" || this.institucion_id == null || this.institucion_id == 0 || this.institucion_id == "null") {
                        me.error = true;
                        me.messageError = "Ha seleccionado otra editorial tiene que agregar una institución por favor";
                        me.activePromptAddEvent = true
                        return false;
                    }
                }
                if (this.estado_institucion_temporal == 1) {
                    if (this.institucion_id_temporal == "" || this.institucion_id_temporal == null || this.institucion_id_temporal == 0 || this.institucion_id_temporal == "null") {
                        me.error = true;
                        me.messageError = "Ha seleccionado otra editorial tiene que agregar una institución por favor";
                        me.activePromptAddEvent = true
                        return false;
                    }
                }
            }
            const obj = {
                idusuario: me.usuario.idusuario,
                id: this.id,
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

            if (this.id != 0,1) {
               me.save(obj)
            } else {
                me.save(obj,0)
            }
        },

        save(obj,tipo){
            let me = this;
            let formData = new FormData();
            if(tipo == 0){
               formData.append('id', 0);
            }else{
             formData.append('id', this.id);
            }
            
            formData.append('idusuario', obj.idusuario);
            formData.append('title', obj.title);
            formData.append('label', obj.label);
            formData.append('classes', obj.classes);
            formData.append('startDate', obj.startDate);
            if(obj.endDate == null || obj.endDate == undefined || obj.endDate == ""){
            }else{
                formData.append('finalizar', "yes");
                formData.append('fecha_que_visita', obj.endDate);
            }
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
            formData.append('usuario_editor',me.usuario.idusuario)
            me.$vs.loading()
              this.$http.post(this.$server_url+'save_planificacion', formData)
              .then(res => {

                  me.$vs.loading.close()
                  me.activePromptAddEvent = false;
                  me.limpiar();
                  me.getAllVisitas()
                  me.$vs.notify({
                  text:'Planificación agregada con exito',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })
        },

        limpiar(){
            let me = this;
            this.labelLocal = {
                text: 'Baja',
                color: 'success'
            }
            me.startDate = ""
            me.endDate = ""
            me.hora_inicio = ""
            me.hora_fin = ""
            me.title = "";
            me.titulo = "";
            me.hora_inicio = "";
            me.hora_fin = "";
            me.nombre_institucion = "";
            me.url = "";
            me.nombreInstitucion = ""
            me.institucion_id = ""
            me.institucion_id_temporal = ""
            me.opciones.presentacion = false
            me.opciones.entrega_muestras = false
            me.opciones.reunion = false
            me.opciones.seguimiento = false
            me.opciones.cierre = false
            me.opciones.cobranza = false
            me.opciones.post_venta = false
            me.opciones.retiro_cartas = false
            me.opciones.retiro_muestras = false
            me.opciones.sinSello = true
        },
    }
}
</script>