<template>
    <div v-if="usuario.id_group == 1">
      <vs-card v-if="verCantidadVisitas == false">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-alert active="true" color="success">
                <p style="text-align:center;">
                  <i class="fa fa-address-book" aria-hidden="true"></i>  Gestión de visitas de los asesores
                </p>
              </vs-alert>
            </vs-col>
        </vs-row>
        <div class="vx-row mt-5">
          <!--FILTRO TIPO DE INSTITUCIONES-->
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
            <ul class="flex" style="border:1px solid #ccc;padding:10px;border-radius:10px;">
              <li class="mr-3">
                <b>Instituciones:</b>
              </li>
              <li>
                <vs-radio v-model="filtro.tipoInstitucion" @input="instituciones = []" class="mr-3"  vs-name="radios1tipoInstitucion" vs-value="1">Prolipa</vs-radio>
              </li>
              <li>
                <vs-radio v-model="filtro.tipoInstitucion" @input="instituciones = [];asesor='';filtro.asesor='';informacion=[];tmpInformacion=[];" vs-name="radios1tipoInstitucion" vs-value="2">Creadas por el asesor</vs-radio>
              </li>
            </ul>
          </div>
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
            <div class="flex">
              <vx-tooltip style="display: inline-block;" text="Agregar planificación" position="top" color="primary">
                <vs-button radius color="dark" type="line" @click="modalAgregar();update=false" icon="add"></vs-button>
              </vx-tooltip>
              <vs-button type="gradient" class="ml-5" size="small" @click="abrirCantidadVisitas();" icon="account_circle">VISITAS POR INSTITUCIÓN</vs-button>
            </div>
          </div>
        </div><!--End vx-row-->
        <vs-row class="mt-2">
          <!--FILTRO DE ASESORES-->
          <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-sm="12" vs-xs="12"  class="m-3">
            <p class="mt-4">Filtro de asesores</p>
            <v-select :options="asesores" @input="getInstitucion();asesor=filtro.asesor.idusuario" :reduce="asesores => asesores" label="vendedor" class="w-full" style="margin-top:18px;" v-model="filtro.asesor" />
          </vs-col>
          <!--FILTRO DE INSTITUCIONES-->
          <vs-col vs-type="flex" vs-justify="center" class="m-3 filtroInstituciones" vs-w="3" vs-sm="12" vs-xs="12"  vs-align="center">
            Filtro de instituciones
            <v-select :options="instituciones" @input="getAllVisitas();filtroInstitucion=true" :reduce="instituciones => instituciones" label="nombreInstitucion" class="w-full" v-model="filtro.institucion" />
          </vs-col>
          <!--FILTRO FECHAS-->
          <vs-col vs-type="flex" vs-justify="center" class="m-3" vs-w="4" vs-sm="12" vs-xs="12"  vs-align="center" v-if="tmpInformacion.length > 0">
            <div class="vx-row ml-3">
              <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-1/2 mb-6">
                <p>Fecha Visita inicio</p>
                <flat-pickr :config="configdateTimePicker2" @input="filterVisited();" v-model="filtroVisitaInicio"  placeholder="Fecha Visita Desde"  class="w-full" />
              </div>
              <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-1/2 mb-6">
                <div class="flex">
                  <div>
                    <p>Fecha Visita Fin</p>
                    <flat-pickr :config="configdateTimePicker2" @input="filterVisited();" v-model="filtroVisitaFin"  placeholder="Fecha Visita Hasta"  style="display: inline-block;width: 100%;" />
                  </div>
                  <vx-tooltip style="display: inline-block;" text="Listar Todo" position="top" color="primary">
                    <vs-button radius color="primary" @click="filtroVisitaInicio=null;filtroVisitaFin=null;filterVisited();" class="ml-2 mt-5" type="border" icon-pack="feather" icon="icon-x"></vs-button>
                  </vx-tooltip>
                  <vx-tooltip style="display: inline-block;" text="Fecha de este mes" position="top" color="primary">
                    <vs-button radius color="primary" @click="fechaMes();filterVisited();" class="ml-5 mt-5" type="border" icon-pack="feather" icon="icon-calendar"></vs-button>
                  </vx-tooltip>
                </div>
              </div>
            </div>
          </vs-col>
        </vs-row>
        <!--TABLA-->
        <div v-if="filtro.todo == true" class="mt-5">
          <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="informacion">
            <template slot="header">
              <vs-chip color="primary" style="font-size:12px;">
                Cantidad de visitas: <span style="font-weight:bold;"> {{informacion.length}}</span>
              </vs-chip>
              <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
            </template>
            <template slot="thead">
              <vs-th sort-key="nombreInstitucion">Institucion</vs-th>
              <vs-th sort-key="title">Título</vs-th>
              <vs-th sort-key="creador">Usuarios</vs-th>
              <vs-th sort-key="startDate">Fechas</vs-th>
              <vs-th sort-key="url">Observaciones</vs-th>
              <vs-th sort-key="status">Estado</vs-th>
              <vs-th  style="width:100px;">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].nombreInstitucion">
                    #id: {{data[indextr].id}}<br>
                      <div v-if="tr.estado_institucion_temporal == '1'">
                          <i class="fa-solid fa-bookmark"></i>
                          {{data[indextr].nombre_institucion_temporal}}<br>
                          {{ tr.periodo }}
                      </div>
                      <div v-else>
                          {{data[indextr].nombreInstitucion}}<br>
                          {{ tr.periodo }}
                      </div>
                      <p style="font-weight:bold;">Asesor:</p>
                      {{ data[indextr].userAsesor }}
                  </vs-td>
                  <vs-td :data="data[indextr].title">
                      {{ data[indextr].title }}
                  </vs-td>
                  <vs-td :data="data[indextr].creador">
                      <p style="font-weight:bold;">Usuario creador:</p>
                      {{ data[indextr].creador }}
                      <p style="font-weight:bold;">Usuario Finalizador:</p>
                      {{ data[indextr].finalizador }}
                  </vs-td>
                  <vs-td :data="data[indextr].startDate">
                      Fecha generar visita:
                      <span>{{tr.startDate}}</span><br>
                      Fecha que visita:
                      <span>{{tr.fecha_que_visita}}</span><br>
                      <vs-chip color="danger" v-if=" tr.dias_desface != '' && tr.dias_desface != null">{{ tr.dias_desface }} días de diferencia</vs-chip>
                  </vs-td>
                  <vs-td :data="data[indextr].url">
                      {{ data[indextr].url }}
                  </vs-td>
                  <vs-td :data="data[indextr].status">
                      <vs-chip :color="tr.estado == '0'?'success':'warning'">
                          {{ tr.estado == '0' ? 'Generada' :'Finalizada' }}
                      </vs-chip>
                  </vs-td>
                    <vs-td>
                      <div style="display: flex;">
                          <div>
                              <vx-tooltip style="display: inline-block;" text="Editar planificación" position="top" color="primary">
                                  <vs-button class="modal-default-button" size="small" @click="getInstitucionInfo(tr);openEditPlanificacion(tr);update=true" color="success" radius type="line" icon-pack="feather" icon="icon-edit"> </vs-button>
                              </vx-tooltip> &nbsp;
                              <vx-tooltip style="display: inline-block;" text="Eliminar planificación" position="top" color="primary">
                                  <vs-button class="modal-default-button" size="small" @click="openConfirmarEliminar(tr);" color="danger" radius type="line" icon-pack="feather" icon="icon-trash"> </vs-button>
                              </vx-tooltip> &nbsp;
                          </div>
                      </div>
                  </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
        <br><br><br><br><br><br>
      </vs-card>
      <vs-card v-else>
        <vs-button radius color="success" @click="verCantidadVisitas = false" type="gradient" icon="reply"></vs-button>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" class="ml-3">
            Filtro de asesores
            <v-select :options="asesores" @input="filtro.institucion='';getInstitucion();asesor=filtro.asesor.idusuario" :reduce="asesores => asesores" label="vendedor" class="w-full" v-model="filtro.asesor" />
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
              <flat-pickr :config="configdateTimePicker2" v-model="fromDate"  placeholder="Fecha Inicio" class="ml-2 mt-1" style="display: inline-block;width: 100%;" />
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
              <flat-pickr :config="configdateTimePicker2" v-model="toDate" placeholder="Fecha Fin" class="ml-2 mt-1" style="display: inline-block;width: 100%" />
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1">
              <vx-tooltip style="display: inline-block;" text="Filtrar visitas" position="top" color="primary">
                  <vs-button radius color="warning" @click="getCantidadVisitas();" type="line" icon="search"></vs-button>
              </vx-tooltip>
          </vs-col>
        </vs-row>
        <CantidadVisitasVue :ReportVisitas="ReportVisitas" :ReportVisitasTemporales = "ReportVisitasTemporales"/>
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
            <!--INSTITUCIONES-->
            <vs-row v-if="seleccionadoInsitucion ==  false" class="mt-2">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null ">
                    Sin Institución
                </p>
                <div v-else>
                  <vs-chip color="success">
                    Institución: {{ nombreInstitucion}}
                  </vs-chip>
                  <vs-chip color="dark" class="ml-2">
                    Asesor: {{ asesorSelect }}
                  </vs-chip>
                </div>
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
                    <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false"  @click="seleccionadoInsitucion = true;tipo = 1" type="relief">Asignar institución de prolipa</vs-button>
                    <vs-button color="primary" class="mt-2 ml-3" icon="info" v-if="seleccionadoInsitucion == false"  @click="seleccionadoInsitucion = true;getInstitucionCreadasByAsesor();tipo = 2;" type="relief">Institución creada por el asesor</vs-button>
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
                        <div v-if="tr.institucion_temporal_id">
                          <b>Asesor:</b>
                          <p>{{ filtro.asesor.vendedor }}</p>
                        </div>
                        <div v-else>
                          <b>Asesor:</b>
                          <p>{{ tr.nombre_asesor + " " + tr.apellido_asesor }}</p>
                        </div>
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
                      <datepicker class="w-full" name="start-date" v-model="startDate"  :disabled="disabledFrom"></datepicker>
                  </div>
                  <div class="vx-col sm:w-1/2 w-full" v-if="update == true">
                      <small class="date-label">Fecha que visitó</small>
                      <datepicker class="w-full" name="end-date" v-model="endDate"></datepicker>
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
                    <vs-checkbox color="success" v-model="opciones.capacitacion">Capacitación</vs-checkbox>
                </vs-col>
                <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                    <vs-checkbox color="success" v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
                </vs-col>
                <vs-col v-if="opciones.otraEditorial == true" class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
                    <vs-input class="inputx w-full" placeholder="Escriba el nombre de la editorial" v-model="nombre_editorial" />
                </vs-col>
            </vs-row>
          </div>
          <vs-textarea counter="250" label="Mensaje" :counter-danger.sync="counterDanger" v-if="seleccionadoInsitucion == false" name="event-url" class="w-full mb-3 mt-4" v-model="url" />
          <div class="flex justify-center mt-3">
            <vs-button @click="addEvent()" type="relief">Guardar</vs-button>
            <vs-button color="warning" class="ml-4" @click="activePromptAddEvent = false" type="relief">{{label_cancel}}</vs-button>
          </div>
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
      <!--modal exportar-->
      <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
          <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
              <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
          </vs-alert>
          <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
          <v-select v-model="selectedFormat" :options="formats" class="my-4" />
          <div class="flex">
              <!--<span class="mr-4">Cell Auto Width:</span>
              <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
          </div>
      </vs-prompt>
    </div>
</template>
<script>
import CantidadVisitasVue from './components/CantidadVisitas.vue'
import {
    CalendarView,
    CalendarViewHeader
} from 'vue-simple-calendar'
import planificacionAsesor from './components/planificacionAsesor.vue'
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
        tmpInformacion:[],
        filtroInstitucion:false,
        filtroVisitaInicio:null,
        filtroVisitaFin:null,
        activePromptAddEvent:false,

        //VARIABLES DE AGREGAR PLANIFICACION

          popupFiltroInstitucion:false,
            error: false,
            messageError: "",
            ciudadSelect: '',
            popupAddNuevaInstitucion: false,
            seleccionadoInsitucion: false,
            nombreInstitucion: '',
            asesorSelect:'',
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
                capacitacion:false,
                sinSello: false,
                otraEditorial: false,
            },
            nombre_editorial: '',
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
            tipo:1,
            verCantidadVisitas:false,
            //VARIABLES CANTIDAD DE VISITAS
            fromDate: null,
            toDate: null,
            configdateTimePicker2: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            ReportVisitas:[],
            ReportVisitasTemporales:[],
            //FIN VARIABLES PARA CANTIDAD DE VISITAS,
            //VARIABLES PARA EXPORTAR A EXCEL
            codigoSelected: [],
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            fileName:null,
            selectedFormat: 'xls',
            cellAutoWidth: true,
            activePrompt: false,
            //FIN VARIABLES PARA EXPORTAR A EXCEL

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
        }
    },
    components: {
        Datepicker,
        flatPickr,
        'v-select': vSelect,
        planificacionAsesor,
         CalendarView,
        CalendarViewHeader,
        CantidadVisitasVue,
    },
    created(){
        let me = this;
        me.getAsesores()
        me.isAdmin = localStorage.getItem("adminSeguimiento")
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.$store.registerModule('calendar', moduleCalendar)
        this.$store.dispatch('calendar/fetchEventLabels')
        this.listaCiudades()
        this.institucion_id = ""
        this.institucion_id_temporal = ""
    },
    mounted(){
      let me                = this;
      me.fechaMes()
    },
    methods:{
      fechaMes(){
        let me                = this
        const date            = new Date()
        const primerDia       = new Date(date.getFullYear(), date.getMonth(), 1)
        const ultimoDia       = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        me.fromDate           = primerDia
        me.toDate             = ultimoDia
        me.filtroVisitaInicio = moment(primerDia).format('YYYY-MM-DD')
        me.filtroVisitaFin    = moment(ultimoDia).format('YYYY-MM-DD')
      },
      dataPlanificacion(){
        let me = this;
        localStorage.setItem('planificacion_asesor_id', me.filtro.asesor.idusuario)
        localStorage.setItem('planificacion_cedula',    me.filtro.asesor.cedula)
        localStorage.setItem('planificacion_vendedor',  me.filtro.asesor.vendedor)
        me.verPlanificaciones = true
      },
      //para obtener el listado de los asesores
      getAsesores() {
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url+'seguimiento')
        .then(function (res) {
          me.asesores = res.data
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
      },
      filterVisited() {
        if (this.filtroVisitaInicio && this.filtroVisitaFin) { this.informacion = this.tmpInformacion.filter(p => p.startDate.substring(0, 10) >= this.filtroVisitaInicio && p.startDate.substring(0, 10) <= this.filtroVisitaFin); } else { this.informacion = this.tmpInformacion; }
      },
      getInstitucion() {
          let me = this;
          me.instituciones      = [];
          me.informacion        = []
          me.tmpInformacion     = []
          me.filtro.institucion = ""
          me.filtroInstitucion  = false
          if(me.filtro.asesor == null || me.filtro.asesor == undefined  || me.filtro.asesor == ""){
              me.$vs.notify({
                  text: 'Seleccione un asesor antes de filtrar las instituciones',
                  color: 'success',
                  iconPack: 'feather',
                  icon: 'icon-user',
              })
              return false
          }
          me.$vs.loading()
          //INSTITUCIONES DE PROLIPA
          if(me.filtro.tipoInstitucion == 1){
                this.$http.get(this.$server_url + 'listaInsitucionAsesor?porCedula=yes'+'&cedula=' + me.filtro.asesor.cedula)
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
          //INSTITUCIONES CREADAS POR EL ASESOR
          }if(me.filtro.tipoInstitucion == 2){
                this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes'+'&asesor_id=' + me.filtro.asesor.idusuario)
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
          me.filtro.todo = true
          me.getAllVisitas()
      },
      getAllVisitas(){
          let me = this;
          me.informacion    = []
          me.tmpInformacion = []
          if(me.filtro.asesor == null || me.filtro.asesor == undefined  || me.filtro.asesor == ""){
            me.$vs.notify({
              text: 'Seleccione un asesor antes de filtrar las instituciones',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user',
            })
            return false
          }
          localStorage.setItem('planificacion_asesor_id', me.filtro.asesor.idusuario)
          localStorage.setItem('planificacion_cedula',    me.filtro.asesor.cedula)
          localStorage.setItem('planificacion_vendedor',  me.filtro.asesor.vendedor)
          this.$http.get(this.$server_url + 'listaInsitucionAsesor?todo=yes'+'&asesor_id=' + me.filtro.asesor.idusuario)
            .then(function (res) {
              if(me.filtro.institucion){
              let datos = res.data
              //FILTRO PARA INSTITUCIONES DE PROLIPAS
              if(me.filtro.tipoInstitucion == 1){
                me.informacion = datos.filter(p => p.institucion_id == me.filtro.institucion.idInstitucion)
              //FILTRO POR INSTITUCION TEMPORAL
              }else{
                me.informacion = datos.filter(p => p.institucion_id_temporal == me.filtro.institucion.institucion_temporal_id)
              }
              }else{
              me.informacion = res.data;
              }
              me.tmpInformacion = me.informacion
              //filtro fechas
              me.filterVisited()
            })
            .catch(function (error) {
              console.log(error + ' error');
            })
      },
      abrirCantidadVisitas(){
        let me = this;
        if(me.filtro.asesor == null || me.filtro.asesor == undefined  || me.filtro.asesor == ""){
          me.$vs.notify({
            text: 'Seleccione un asesor para buscar la cantidad de visitas',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-info',
          })
          return false
        }
        me.getCantidadVisitas();
        me.verCantidadVisitas = true
      },
      getCantidadVisitas(){
        let me = this;
        me.ReportVisitas  = []
        const from = moment(me.fromDate).format('YYYY-MM-DD')
        const to = moment(me.toDate).format('YYYY-MM-DD')
        me.$vs.loading()
        this.$http.get(`${this.$server_url  }cantidadVisitas?fromDate=${  from  }&toDate=${  to}&asesor_id=${me.filtro.asesor.idusuario}`)
          .then(function (res) {
          me.$vs.loading.close()
          me.ReportVisitas = res.data.visitasInstitucion
          me.ReportVisitasTemporales = res.data.visitasInstitucionTemporal
          })
          .catch(function (e) {
          })
      },
      //funciones para add planificacion
      modalAgregar(){
        let me = this;
        me.limpiar()
        if(me.filtro.asesor == null || me.filtro.asesor == undefined  || me.filtro.asesor == ""){
          me.$vs.notify({
            text: 'Seleccione un asesor para agregar una planificación',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-info',
          })
          return false
        }
        localStorage.setItem('planificacion_asesor_id', me.filtro.asesor.idusuario)
        localStorage.setItem('planificacion_cedula',    me.filtro.asesor.cedula)
        localStorage.setItem('planificacion_vendedor',  me.filtro.asesor.vendedor)
        me.titulo = "Agregar planificación del asesor "+ me.filtro.asesor.vendedor
        me.activePromptAddEvent = true
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
            me.activePromptAddEvent = true
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
        me.seleccionadoInsitucion         = false;
        me.institucionesAsesor            = []
        me.error                          = false
      },
      asginarInstitucion(tr) {
        let me = this;
        if(me.tipo == 1){
          me.institucion_id               = tr.idInstitucion
          me.nombreInstitucion            = tr.nombreInstitucion
          me.asesorSelect                 = tr.nombre_asesor + " "+ tr.apellido_asesor
          me.estado_institucion_temporal  = 0;
          me.seleccionadoInsitucion       = false;
          me.institucionesAsesor          = []
        }else{
          me.nombreInstitucion            = tr.nombreInstitucion
          me.asesorSelect                 = me.filtro.asesor.vendedor
          me.institucion_id_temporal      = tr.institucion_temporal_id
          me.institucionesAsesor          = []
          me.periodo_id_temporal          = tr.periodo_id
          me.estado_institucion_temporal  = 1;
          me.seleccionadoInsitucion       = false;
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
        var url = ""
        url = 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&todasInstituciones=yes'
        this.$http.get(this.$server_url + url)
          .then(function (res) {
            // me.tmpInstituciones = res.data;
            me.institucionesAsesor = res.data;
            // me.filtroRegion();
            me.$vs.loading.close()
            if (res.data.message) {
              me.$vs.notify({
                text: res.data.message,
                color: 'warning',
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
             this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes'+'&asesor_id=' + me.filtro.asesor.idusuario)
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
        addEvent() {
            let me = this
            me.error = false
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
            if (this.title == '' || this.startDate == '' || this.hora_inicio == null || this.hora_fin == null) {
                me.error = true;
                me.messageError = "Campos con asterisco obligatorios";
                me.activePromptAddEvent = true
                return false;
            }
            me.error= false;
            //validar que selecciona los checkbox
            let allFalse = Object.values(me.opciones).every(option => option === false);
            if(allFalse) {
              me.error = true;
              me.messageError = "Debe marcar al menos un recuadro";
              me.activePromptAddEvent = true;
              return false;
            }
            //si el asesor agrega otra editorial debe validarse que ingrese una institucion
            if (this.opciones.otraEditorial == true) {
                // si es tipo de institucion  de prolipa
                me.activePromptAddEvent = true
                if (this.nombre_editorial == "") {
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
            let fecha1 = null
            let fecha2 = null
            if(this.startDate == null || this.startDate == undefined || this.startDate == "" || this.startDate == "null"){ fecha1 = null }  else{ fecha1 = moment(this.startDate).format('YYYY-MM-DD') }
            if(this.endDate == null || this.endDate == undefined || this.endDate == "" || this.endDate == "null"){ fecha2 = null }          else{ fecha2 = moment(this.endDate).format('YYYY-MM-DD') }
            const obj = {
                idusuario: localStorage.planificacion_asesor_id,
                id: this.id,
                title: this.title,
                startDate: fecha1,
                endDate: fecha2,
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
                nombre_editorial: this.nombre_editorial

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
            if(obj.endDate == null || obj.endDate == undefined || obj.endDate == "" || obj.endDate == "null"){
            }else{
              const format2 = "YYYY-MM-DD"
              let fAsesor = null
              let fVisita = null
              fAsesor = moment(obj.startDate).format(format2);
              fVisita = moment(obj.endDate).format(format2);
              const fecha1 = new Date(fAsesor)
              const fecha2 = new Date(fVisita)
              var resultado = (fecha2 - fecha1) / (1000 * 60 * 60 * 24);
              formData.append('dias_desface',             resultado)
              formData.append('finalizar',                "yes");
              formData.append('fecha_que_visita',         obj.endDate);
            }
            formData.append('hora_inicio',                obj.hora_inicio);
            formData.append('hora_fin',                   obj.hora_fin);
            formData.append('url',                        obj.url);
            formData.append('institucion_id',             obj.institucion_id);
            formData.append('opciones',                   JSON.stringify(obj.opciones));
            formData.append('institucion_id_temporal',    obj.institucion_id_temporal);
            formData.append('estado_institucion_temporal', obj.estado_institucion_temporal);
            formData.append('periodo_id_temporal',        obj.periodo_id_temporal);
            formData.append('nombreInstitucion',          obj.nombreInstitucion);
            formData.append('otraEditorial',              obj.otraEditorial);
            formData.append('nombre_editorial',           obj.nombre_editorial);
            formData.append('admin','yes');
            formData.append('usuario_editor',             me.usuario.idusuario)
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
            .catch(function(error){
                  me.$vs.loading()
            });
        },

        openConfirmarEliminar(tr){
            let me = this;
              me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro de eliminar la planificación',
                accept:this.eliminarPlanificacion
            })
        },
        eliminarPlanificacion(){
            let me = this;
            let formData = new FormData();
            formData.append('id', this.id);
            formData.append('desactivar','yes');
            formData.append('usuario_editor',me.usuario.idusuario)
            me.$vs.loading()
            this.$http.post(this.$server_url+'save_planificacion', formData)
              .then(res => {
                  me.$vs.loading.close()
                  me.limpiar();
                  me.getAllVisitas()
                  me.$vs.notify({
                  text:'Planificación eliminada con exito',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })
              .catch(function(error){
                   me.$vs.loading()
              });

        },
        getInstitucionInfo(tr){
          let me = this;
          if (tr.estado_institucion_temporal == "1") {
            this.asesorSelect                 = me.filtro.asesor.vendedor
          }else{
            this.$http.get(this.$server_url+`institucionActiva?idInstitucion=${tr.institucion_id}`)
              .then(function (res) {
                 if(res.data.length > 0){
                  let nombreAsesor = res.data[0].nombres + " " + res.data[0].apellidos
                  me.setNombre(nombreAsesor)
                 }
              })
              .catch(function (error) {
                  console.log(error + ' error');
              })
          }
        },
        setNombre(nombre){
          this.asesorSelect = nombre
        },
        openEditPlanificacion(tr) {
          let me = this;
          me.limpiar()
          let datos = JSON.parse(tr.opciones)
          this.id = tr.id
          if(tr.title == null){
            tr.title = ""
          }else{
            this.title = tr.title.split('(')[0]
          }
          this.startDate = tr.startDate
          this.endDate = tr.fecha_que_visita
          this.url = tr.url
          if(tr.classes == null){
          }else{
            this.labelLocal = {
              text: tr.label,
              color: tr.classes.split('-')[1]
            }
          }
          this.hora_inicio                = tr.hora_inicio
          this.hora_fin                   = tr.hora_fin
          this.label_cancel               = 'Cancelar'
          this.estado                     = tr.estado
          this.opciones.presentacion      = datos.presentacion
          this.opciones.entrega_muestras  = datos.entrega_muestras
          this.opciones.reunion           = datos.reunion
          this.opciones.seguimiento       = datos.seguimiento
          this.opciones.cierre            = datos.cierre
          this.opciones.cobranza          = datos.cobranza
          this.opciones.post_venta        = datos.post_venta
          this.opciones.retiro_cartas     = datos.retiro_cartas
          this.opciones.retiro_muestras   = datos.retiro_muestras
          this.opciones.capacitacion      = datos.capacitacion
          this.opciones.sinSello          = datos.sinSello
          this.opciones.otraEditorial     = datos.otraEditorial
          if (this.opciones.otraEditorial == false) {
              this.nombre_editorial = ""
          } else {
              this.nombre_editorial = datos.editorial
          }

          if (tr.estado_institucion_temporal == "1") {
            this.nombreInstitucion            = tr.nombre_institucion_temporal
            this.institucion_id_temporal      = tr.institucion_id_temporal
            this.periodo_id_temporal          = tr.periodo_id
            this.estado_institucion_temporal  = 1
          } else {
            this.nombreInstitucion            = tr.nombreInstitucion
            this.institucion_id               = tr.institucion_id
            this.estado_institucion_temporal  = 0
          }
          this.activePromptAddEvent           = true
        },
        limpiar(){
            let me = this;
            this.labelLocal = {
                text: 'Baja',
                color: 'success'
            }
            me.startDate                = ""
            me.endDate                  = ""
            me.hora_inicio              = ""
            me.hora_fin                 = ""
            me.title                    = "";
            me.titulo                   = "";
            me.hora_fin                 = "";
            me.nombre_institucion       = "";
            me.url                      = "";
            me.nombreInstitucion        = ""
            me.institucion_id           = ""
            me.institucion_id_temporal  = ""
            me.opciones.presentacion    = false
            me.opciones.entrega_muestras = false
            me.opciones.reunion         = false
            me.opciones.seguimiento     = false
            me.opciones.cierre          = false
            me.opciones.cobranza        = false
            me.opciones.post_venta      = false
            me.opciones.retiro_cartas   = false
            me.opciones.retiro_muestras = false
            me.opciones.capacitacion    = false
            me.opciones.sinSello        = false
            me.id = ""
        },
        //METODOS PARA EXPORTAR A EXCEL
        exportToExcel() {
            let headerTitle = [ 'Institucion','Periodo', 'Titulo', 'Asesor','Fecha genera visita','Fecha que visita','Dias de diferencia','estado', 'Usuario creador', 'Usuario finalizador'];
            let headerVal = [ 'institucionFinal','periodo', 'title','asesor','startDate','fecha_que_visita','dias_desface','status', 'creador' ,'finalizador'];
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, this.codigoSelected)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
            //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //FIN METODOS PARA EXPORTAR A EXCEL

    }
}
</script>
<style>
@media(max-width: 576px) {
  .filtroInstituciones{
    margin-top:8px;
  }
}
</style>
