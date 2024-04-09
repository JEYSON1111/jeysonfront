<template>
  <div id="dashboard-analytics">
    <div style="display: flex;" v-if="imagenInsitucion == null || imagenInsitucion == ''" class="nombreInstitucion">
      <p class="mt-1"
        style="color:white;font-weight: 400;letter-spacing: 2px;text-align: center;margin: 0 auto;padding: 15px;font-size: 20px;">
        <i class="fa fa-graduation-cap" aria-hidden="true"></i>{{ nombreInstitucion }}
      </p>
    </div>
    <div v-else style="display: flex;height: 120px;justify-content: center;padding-top: 20px;" class="nombreInstitucion">
      <div>
        <p
          style="color:white;font-weight: 400;letter-spacing: 2px;text-align: center;margin: 0 auto;padding: 15px;font-size: 20px;">
          <i class="fa fa-graduation-cap" aria-hidden="true"></i>{{ nombreInstitucion }}
        </p>
      </div>
      <div>
        <img style="height: 58px; border-radius: 5px 10px 10px;min-height:58px;"
          :src="$data_url + 'archivos/' + 'instituciones_logos/' + imagenInsitucion" />
        <!-- <img style="width: 100px;border-radius:90px; 30px 90px"  :src="$server_url+'archivos/'+'instituciones_logos/'+imagenInsitucion"> -->
      </div>
    </div>
    <div class="vx-row mb-6">
      <!-- CARD 1: CONGRATS -->
      <div class="vx-col w-full mt-2" v-if="usuario.id_group == 10 && aplica_matricula != 1">
        <vx-card slot="no-body" class=" text-white text-center greet-user fondo-director" style="min-height: 130px;">
          <h1 class="mb-6 text-white">Bienvenido {{ usuario.nombres }} {{ usuario.apellidos }}</h1>
          <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto"><strong>DIRECTOR</strong></p>
        </vx-card>
      </div>
      <div class="vx-col w-2/3 mt-2" v-if="usuario.id_group == 10 && aplica_matricula == 1">
        <vx-card slot="no-body" class=" text-white text-center greet-user fondo-director" style="min-height: 130px;">
          <h1 class="mb-6 text-white">Bienvenido {{ usuario.nombres }} {{ usuario.apellidos }}</h1>
          <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto"><strong>DIRECTOR</strong></p>
        </vx-card>
      </div>
      <div class="vx-col w-1/3 mt-2" v-if="usuario.id_group == 10 && aplica_matricula == 1">
        <vx-card @click="$router.push('/matricula/listado_matriculas')" slot="no-body" class="text-center greet-user"
          style="cursor: pointer; min-height: 130px; border: 1px solid #0094F3;">
          <h1 class="mb-6" style="color: gray;"> Matriculación </h1>
          <p class="w-full" style="font-size: 20px;"><strong>Ver módulo</strong></p>
        </vx-card>
      </div>
      <!-- <div class="vx-col w-full mt-1" v-else-if="usuario.id_group == 12 || usuario.id_group == 13">
            <vx-card slot="no-body" class=" text-white text-center greet-user fondo-director">
                <h1 class="mb-6 text-white">Bienvenido {{ usuario.nombres }} {{ usuario.apellidos }}</h1>
                <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto"><strong>SALLE</strong></p>
            </vx-card>
        </div> -->
    </div>
    <!--NEET-->
    <div v-if="usuario.id_group == 31">
      <HomeNeetVue />
    </div>
    <div v-if="usuario.id_group == 23 || usuario.id_group == 22">
      <FacturadorAdminVue />
    </div>
    <div>
      <docenteHome v-if="usuario.id_group == 6" :ObjectInstitucion="ObjectInstitucion" :verEvaluacionSalle="verEvaluacionSalle"></docenteHome>
    </div>
    <!--asesor-->
    <div>
      <asesorHome :cantTicketsAbiertos="cantTicketsAbiertos" v-if="usuario.id_group == 11"
        :cantFormsDocente="cantFormsDocente" :cantFormsSolicitudes="cantFormsSolicitudes">
      </asesorHome>
    </div>
    <div class="vx-col w-full mb-6" v-if="usuario.id_group == 10">
      <Agenda />
    </div>
    <div class="vx-row" v-if="usuario.id_group == 12">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-user"
            color="primary"></vs-button>
          <h5 style="display: inline-block;" class="text-primary"><b>Usuarios</b></h5>
          <div class="vx-row">
            <p class="vx-col w-1/2 md:w-1/2 text-right color1">Administradores: </p>
            <p class="vx-col w-1/2 md:w-1/2 text-center numero2 color1"><b> {{ listaAdmins.length }} </b></p>
          </div>
          <div class="vx-row">
            <p class="vx-col w-1/2 md:w-1/2 text-right color1">Docentes: </p>
            <p class="vx-col w-1/2 md:w-1/2 text-center numero2 color1"><b> {{ listaDocentes.length }} </b></p>
          </div>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-home"
            color="primary"></vs-button>
          <h5 style="display: inline-block;" class="text-primary"><b>Instituciones</b></h5>
          <div class="vx-row">
            <p class="vx-col mx-auto numero1 color1"><b> {{ salleInstituciones.length }} </b></p>
          </div>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-bookmark"
            color="primary"></vs-button>
          <h5 style="display: inline-block;" class="text-primary"><b>Areas</b></h5>
          <div class="vx-row">
            <p class="vx-col mx-auto numero1 color1"><b> {{ areas_salle }} </b></p>
          </div>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-type"
            color="primary"></vs-button>
          <h5 style="display: inline-block;" class="text-primary"><b>Asignaturas</b></h5>
          <div class="vx-row">
            <p class="vx-col mx-auto numero1 color1"><b> {{ asignaturas_salle }} </b></p>
          </div>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-layers"
            color="primary"></vs-button>
          <h5 style="display: inline-block;" class="text-primary"><b>Evaluaciones</b></h5>
          <div class="vx-row">
            <p class="vx-col mx-auto numero1 color1"><b> {{ evaluaciones_salle }} </b></p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="vx-row" v-if="usuario.id_group == 14">
      <EstudiantesMatricula />
    </div> -->
    <div v-if="usuario.id_group == 4">
      <!-- <div style="display:flex;justify-content:center;width:100%;">
        <div class="vx-col w-1/3" v-if="usuario.id_group == 4 && aplica_matricula == 1">
          <vx-card @click="$router.push('/matricula/estudiante')" slot="no-body" class="text-center greet-user"
            style="cursor: pointer; min-height: 130px; border: 1px solid #0094F3;">
            <h1 class="mb-6" style="color: gray;"> Matriculación </h1>
            <p class="w-full" style="font-size: 20px;"><strong>Ver módulo</strong></p>
          </vx-card>
        </div>
      </div> -->
      <vs-card style="margin-top:20px;">
        <vs-tabs>
          <vs-tab label="Notificaciones" icon-pack="feather" icon="icon-bell">
            <h2>Notificaciones</h2>
            <vs-list>
              <vs-list-header icon-pack="feather" icon="icon-file-text" title="Tareas pendientes"
                color="warning"></vs-list-header>
              <div v-for="(item, index) in cursos" :key="index">
                <div class="ml-8" v-if="item.tareas_pendientes.length != 0">
                  <vs-list-item v-if="item.tareas_pendientes.length != 0" icon-pack="feather" icon="icon-airplay"
                    :title="item.cursos.nombre">
                  </vs-list-item>
                  <div v-for="(tarea, ind) in item.tareas_pendientes" :key="ind">
                    <div class="ml-12 vs-list--subtitle">
                      <div class="vs-row">
                        <feather-icon icon="FileTextIcon" class="inline-block m-3" icon-color="success"
                          svgClasses="w-5 h-5" />
                        <span class="text-primary">{{ tarea.descripcion }}</span>
                      </div>
                      <div class="flex flex-row ml-4 justify-between">
                        <span class="text-secundary">Fecha de inicio: {{ tarea.fecha_inicio }}</span> <span
                          class="text-danger">Fecha de final: {{ tarea.fecha_final }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <vs-list-header icon-pack="feather" icon="icon-file-text" title="Tareas entregadas"
                color="success"></vs-list-header>
              <div v-for="(item, index) in cursos" :key="index">
                <div class="ml-8" v-if="item.tareas_realizadas.length != 0">
                  <vs-list-item v-if="item.tareas_realizadas.length != 0" icon-pack="feather" icon="icon-airplay"
                    :title="item.cursos.nombre">
                  </vs-list-item>
                  <div v-for="(tarea, ind) in item.tareas_realizadas" :key="ind">
                    <div class="ml-12 vs-list--subtitle">
                      <div class="vs-row">
                        <feather-icon icon="FileTextIcon" class="inline-block m-3" icon-color="success"
                          svgClasses="w-5 h-5" />
                        <span class="text-primary">{{ tarea.descripcion }}</span>
                      </div>
                      <div class="flex flex-row ml-4 justify-between">
                        <span class="text-secundary">Fecha de inicio: {{ tarea.fecha_inicio }}</span> <span
                          class="text-success">Fecha de final: {{ tarea.fecha_final }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </vs-list>
          </vs-tab>
          <vs-tab v-if="cantidadMensajesVistos < cantidadMensajesNovistos" label="Tickets(Mensajes no leidos)" color="red"
            icon-pack="feather" icon="icon-edit">
            <ticketEstudiante />
          </vs-tab>
          <vs-tab v-else label="Tickets" color="red" icon-pack="feather" icon="icon-edit">
            <ticketEstudiante />
          </vs-tab>
        </vs-tabs>
      </vs-card>
    </div>
    <div class="vx-row" v-if="usuario.id_group == 1">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" :to="{ name: 'soporte', params: {} }" radius
            icon-pack="feather" icon="icon-credit-card" color="warning"></vs-button>
          <h5 style="display: inline-block;">Tickets</h5>

          <p>Abiertos: <b> {{ cantTicketsAbiertos }} </b></p>
          <p>Cerrados: <b> {{ cantTicketsCerrados }} </b></p>
          <vs-button color="success" class="mt-1" :to="{ name: 'soporte', params: {} }" size="small" type="relief">Ver
            Tickets</vs-button>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6" style="cursor:pointer;"
        @click="$router.push('/usuario/periodos/')">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-user"
            color="primary"></vs-button>
          <h5 style="display: inline-block;">Usuarios</h5>
          <vs-row>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
              <p style="font-weight: bold;">
                Total Activos:<span style="font-weight: 500;"> {{ usuarioActivos }}</span>
              </p>

            </vs-col>
          </vs-row>
          <vs-row style="margin-top: 5px;">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
              <p style="font-weight: bold;">
                Total Prolipa: <span style="font-weight: 500;"> {{ usuariosProlipa }}</span>
              </p>
            </vs-col>
          </vs-row>
        </div>
      </div>
      <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
            <div class="p-5 vx-card alto">
                <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-users" color="success"></vs-button>
                <h5 style="display: inline-block;">Accesos</h5>
                <p>Administradores: <b> {{a_accesos}} </b></p>
                <p>Docentes: <b> {{d_accesos}} </b></p>
                <p>Estudiantes: <b> {{e_accesos}} </b></p>
                <p>Conectados: <b> {{conectados}} </b></p>
            </div>
        </div> -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-list"
            color="success"></vs-button>
          <h5 style="display: inline-block;" class="ml-1">Formularios</h5>
          <p>Solicitudes pendientes: <b> {{ cantFormsSolicitudes }} </b></p>
          <p>Total Formularios: <b> {{ cantFormsDocente }} </b></p>
          <vs-button color="warning" @click="verSolicitudFormulario()" class="mt-2" size="small" type="relief">Ver
            Solicitudes</vs-button>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-server"
            color="warning"></vs-button>
          <h5 style="display: inline-block;">Cursos</h5>
          <p>Activos: <b> {{ t_curso1 }} </b></p>
          <p>Eliminados: <b> {{ t_curso0 }} </b></p>
        </div>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-check-circle"
            color="danger"></vs-button>
          <h5 style="display: inline-block;">Evaluaciones</h5>
          <p>Creadas: <b> {{ c_eval }} </b></p>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-search"
            color="primary"></vs-button>
          <h5 style="display: inline-block;">Preguntas</h5>
          <p>Opción múltiple: <b>{{ c_preg0 }}</b> </p>
          <p>Respuesta cerrada: <b>{{ c_preg1 }}</b> </p>
          <p>Verdadero falso: <b>{{ c_preg2 }}</b> </p>
          <p>Opción simple: <b>{{ c_preg3 }}</b> </p>
          <p>Respuesta abierta: <b>{{ c_preg4 }}</b> </p>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-aperture"
            color="success"></vs-button>
          <h5 style="display: inline-block;">Contenido Multimedia</h5>
          <p>Actividades: <b>{{ c_multi0 }}</b> </p>
          <p>Animaciones: <b>{{ c_multi1 }}</b> </p>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-package"
            color="warning"></vs-button>
          <h5 style="display: inline-block;">Juegos administrables</h5>
          <p v-for="(item, index) in c_juegos0" :key="index">
            <span> {{ item.nombre_tipo_juego }}: </span>
            <b>{{ item.cantidad }}</b>
          </p>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-slack"
            color="danger"></vs-button>
          <h5 style="display: inline-block;">Códigos libros</h5>
          <p>Usados: <b>{{ c_codigos }}</b> </p>
          <p>Creados: <b>{{ c_codigos_total }}</b> </p>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-award"
            color="primary"></vs-button>
          <h5 style="display: inline-block;">Seminarios</h5>
          <p>Realizados: <b>{{ c_semi }}</b> </p>
          <p>Encuestas: <b>{{ c_enc }}</b> </p>
        </div>
      </div>
    </div>
    <div v-if="usuario.id_group == 10">
      <div class="vx-row mr-1">
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
          <div class="p-5 vx-card alto">
            <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-home"
              color="primary"></vs-button>
            <h5 style="display: inline-block;">Instituciones</h5>
            <center>
              <h1><b> {{ instituciones_director.length }} </b></h1>
            </center>
          </div>
        </div>
      </div>
    </div>
    <vx-card v-if="usuario.id_group == 25">
      <screen_gerenciaVue />
    </vx-card>
    <!--bodega admin-->
    <div>
      <HomeBodegaAdminVue v-if="usuario.id_group == 27" />
    </div>
    <vs-popup title="Seleccione su institución" :active.sync="popupActive">
      <p class="mb-6">Por favor seleccione la institución a la que pertenece antes de continuar.</p>
      Ciudad:
      <v-select class="w-full mb-6" :options="ciudades" v-model="ciudad" @input="verInstCiudad()"
        :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      Institución:
      <v-select class="w-full mb-6" :options="instituciones" v-model="institucion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      <vs-button class="w-full mt-4 mb-1" @click="asignarInstitucion()" color="success" type="filled">Guardar</vs-button>
    </vs-popup>
    <!--MODAL PARA CAMBIAR DE PASSWORD-->
    <vs-popup class="holamundo" title="Actualización de contraseña" :active.sync="popupChangePassword"
      @close="handleClose" :class="{ 'hide-close': !showCloseButton }">
      <popupChangePasswordVue v-if="popupChangePassword" @changeRecarge="changeRecarge" />
    </vs-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from '@/components/timeline/VxTimeline'
import vSelect from 'vue-select'
import Agenda from '../../src/views/docentes/agenda_docente.vue'
import ticketEstudiante from './soporte/ticketUsuario.vue'
import docenteHome from './home/docenteHome.vue'
// import asesorHome from './home/asesorHome.vue'
const asesorHome = () => import('./home/asesorHome.vue')
import FacturadorAdminVue from './home/facturador/facturadorAdmin.vue'
// import io from 'socket.io-client';
// import EstudiantesMatricula from './gestion_matricula/estudiante/matricula_estudiante.vue'
import popupChangePasswordVue from './home/components/todos/popupChangePassword.vue'
import screen_gerenciaVue from './home/gerencia/screen_gerencia.vue'
import HomeNeetVue from '@/views/home/neet/HomeNeet'
import moment from 'moment'
const HomeBodegaAdminVue = () => import('./home/bodega/dashboardBodegaAdmin.vue')


// const HomeBodegaAdminVue = () => import('./home/bodega/HomeBodegaAdmin.vue')
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
      // socket: io("https://socket.prolipadigital.com.ec"),
      popupActive: false,
      instituciones: [],
      ciudades: [],
      ciudad: '',
      institucion: '',
      usuario: [],
      curso: [],
      cursod: [],
      tareasd: [],
      contenidos: [],
      tareasp: [],
      tarease: [],
      subscribersGained: {
        series: [{
          name: 'Subscribers',
          data: [0, 3, 20, 4]
        }],
      },
      usr_live: 0,
      usr_students: [],
      usr_teachers: [],
      linkEvaluacion: '',
      vectorLink: [],
      urlBack: '',
      urlV: [],
      urlOrigen: '',
      t_curso0: 0,
      t_curso1: 0,
      c_eval: 0,
      c_preg0: 0,
      c_preg1: 0,
      c_preg2: 0,
      c_preg3: 0,
      c_preg4: 0,
      c_multi0: 0,
      c_multi1: 0,
      c_juegos0: 0,
      c_juegos1: 0,
      c_semi: 0,
      c_enc: 0,
      c_user0: 0,
      c_user1: 0,
      c_user2: 0,
      c_user3: 0,
      c_codigos: 0,
      c_codigos_total: 0,
      c_accesos: 0,
      d_accesos: 0,
      e_accesos: 0,
      a_accesos: 0,
      conectados: 0,
      reset_storage: 50, // accesos a la plataforma, y vuelve a recargar el localStorage, para verificar cambios futuros
      cant_eval: [],
      cantArchivos: [],
      instituciones_director: [],
      //salle
      listaDocentes: '',
      listaAdmins: '',
      usuarioActivos: 0,
      usuariosProlipa: 0,
      salleInstituciones: '',
      cantTicketsAbiertos: '',
      cantTicketsCerrados: '',
      areas_salle: 0,
      asignaturas_salle: 0,
      evaluaciones_salle: 0,
      cantidadMensajesNovistos: 0,
      cantidadMensajesVistos: 0,
      aplica_matricula: 0,
      //fin salle,
      periodo: 0,
      nombreInstitucion: '',
      imagenInsitucion: '',
      //form de docente
      cantFormsDocente: 0,
      cantFormsSolicitudes: 0,
      //fin forms de docente
      //variables para change password
      popupChangePassword: false,
      showCloseButton: false,
      //fin variables para change password,
      //variables salle
      ObjectInstitucion:{},
      configuracionSalle:[],
      verEvaluacionSalle:false,
      //fin variables salle
    }
  },
  created() {
    let me = this;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    // me.formsDocente();
  },
  computed: {
    ...mapState(['cursos'])
  },
  components: {
    VueApexCharts,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    'v-select': vSelect,
    Agenda,
    ticketEstudiante,
    docenteHome,
    asesorHome,
    FacturadorAdminVue,
    // EstudiantesMatricula,
    popupChangePasswordVue,
    screen_gerenciaVue,
    HomeNeetVue,
    HomeBodegaAdminVue,
  },
  mounted() {
    let me = this
    me.getPeriodoInstitucion();
    localStorage.removeItem('grupoInst');
    this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
    if (this.linkEvaluacion) {
      this.urlBack = window.location.href
      this.urlV = this.urlBack.split('/')
      this.urlOrigen = this.urlV[0] + '/' + this.urlV[1] + '/' + this.urlV[2]
      this.vectorLink = (this.linkEvaluacion).split('-')
      this.evaluacionUrl()
    }
    this.getInstitucion();
    if (this.usuario.id_group == 4) { }
    if (this.usuario.id_group == 6) {
    }
    if (this.usuario.id_group == 1) {
      this.getConteo();
      // this.ServiceSocket()
      me.cantidadTicketsAbiertos();
      me.cantidadTicketsCerrados();
      me.getTicketsAbiertos();
      me.getCantidadUsuarios();
    };
    if (this.usuario.id_group == 10) {
      this.getInstitucionesDirector();
    }
    //salles
    if (this.usuario.id_group == 12) {
      this.getUsuariosSalle();
    }
    if (this.usuario.id_group === 29 || this.usuario.id_group === 30) {
      // Redirect to 'biblioteca' route
      this.$router.push({ name: 'biblioteca' })
    }
    //change password
    me.changePassword()
    if(this.usuario.id_group == 6 || this.usuario.id_group == 13  ){
      me.getEvaluacionSalle()
    }
  },
  methods: {

    getEvaluacionSalle(){
      let me = this
      this.$http.get(this.$server_url+'salle/periodos')
      .then(res =>{
        let datos  = res.data
        var periodoEvaluacion = 0
          if(datos.length > 0){
            let searcEvaluacionActiva = datos.filter(p => p.estado == 1)
            if(searcEvaluacionActiva.length > 0){
              periodoEvaluacion = searcEvaluacionActiva[0].id
              me.getEstadoEvaluacionSalle(periodoEvaluacion)
            }else{
            }
          }else{
          }
      })
    },
    getEstadoEvaluacionSalle(periodoEvaluacion){
      let me = this;
      me.configuracionSalle = []
      this.$http.get(this.$server_url+'institucionConfiguracionSalle/' + me.usuario.institucion_idInstitucion+'/'+periodoEvaluacion)
      .then(res => {
        me.configuracionSalle = res.data;
        if(me.configuracionSalle.length == 0){
          me.verEvaluacionSalle = false
          return
        }
        const fechaActual = moment();
        // Formatea la fecha en el formato "Y-m-d"
        const fechaFormateada = fechaActual.format("YYYY-MM-DD");
        let datos = res.data[0]
        const { fecha_fin } = datos
        let getFechaFin = fecha_fin.substring(0,10)
        if(fechaFormateada < getFechaFin ){ me.verEvaluacionSalle = true}
        else                              { me.verEvaluacionSalle = false}
      })
    },
    handleClose() {
      let me = this;
      me.popupChangePassword = true
    },
    changeRecarge(e) {
      let me = this;
      me.popupChangePassword = false
    },
    changePassword() {
      let me = this;
      //excepto los estudiantes
      if (me.usuario.id_group == 4) {
        return
      } else {
        var fecha30dias = me.usuario.fecha_change_password
        var validateF = me.esFechaValida(fecha30dias)
        var fechaActual = moment().format('YYYY-MM-DD')
        if (validateF) {
          //validar si existe la fecha despues de 30 dias
          if ((fecha30dias <= fechaActual)) {
            me.popupChangePassword = true
          }
          return
        }
        //si no tiene fecha de recordario
        if (me.usuario.change_password == 1) {
          me.popupChangePassword = true
        }
      }
    },
    esFechaValida(fecha) {
      if (fecha == null || fecha == "null" || fecha == "") {
        return false
      }
      var dateObj = new Date(fecha);
      return !isNaN(dateObj);
    },
    //para ir a las solicitudes del formulario de registro de libros de los docentes
    verSolicitudFormulario() {
      let me = this;
      localStorage.setItem('formulario', 'todo')
      me.$router.push('/formulario/solicitudes')
    },
    //para obtener el perido atual
    getPeriodoInstitucion() {
      let me = this;
      this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id=' + me.usuario.institucion_idInstitucion)
        .then(function (res) {
          me.periodo = res.data[0].periodo
          localStorage.setItem('periodo_id', res.data[0].periodo)
          localStorage.setItem('descripcion_periodo', res.data[0].descripcion)
          localStorage.setItem('nombreInstitucion', res.data[0].nombreInstitucion)
          localStorage.setItem('region', res.data[0].region)
          me.nombreInstitucion = res.data[0].nombreInstitucion
          me.imagenInsitucion = res.data[0].imgenInstitucion
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },


    //para obtener el listado de los tickets
    getTicketsAbiertos() {
      let me = this;
      // me.$vs.loading();
      this.$http.get(this.$server_url + 'ticket?cantidadTicketNotificacion=yes&id=' + me.usuario.idusuario)
        .then(function (res) {
          console.log(res.data)
          if (res.data.length > 0) {
            me.cantidadMensajesNovistos = res.data[0].cantidad
            me.cantidadMensajesVistos = res.data[0].cantidad_tickets_usuario
          }
          // me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          // me.$vs.loading.close()

        })


    },
    ServiceSocket() {
      console.log("id grupo" + this.usuario.id_group)

    },
    getCantidadUsuarios() {
      let me = this;
      this.$http.get(this.$server_url + 'traerCantidadUsuarios')
        .then(res => {
          me.usuarioActivos = res.data.usuarioActivos[0].totalactivo
          me.usuariosProlipa = res.data.usuariosProlipa[0].totalprolipa
          // me.docentesCosta = res.data.docentesCosta.length
          // me.docentesSierra = res.data.docentesSierra.length
          // me.estudiantesCosta = res.data.estudiantesCosta.length
          // me.estudiantesSierra = res.data.estudiantesSierra.length
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUsuariosSalle() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'usuarioSalle')
        .then(res => {
          me.listaDocentes = res.data.docentes;
          me.listaAdmins = res.data.admins;

          me.$vs.loading.close();
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      this.$http.get(this.$server_url + 'institucionesSalle')
        .then(res => {
          // console.log(res.data)
          me.salleInstituciones = res.data
        })
        .catch(err => {
          console.log(err)
        })

      this.$http.get(this.$server_url + 'areas_salle')
        .then(res => {
          let datos = res.data
          if (datos.length > 0) {
            let proceso = datos.filter(p => p.n_evaluacion == localStorage.EvaluacionSelectSalle)
            me.areas_salle = proceso.length
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.$http.get(this.$server_url + 'asignaturas_salle')
        .then(res => {
          let datos = res.data
          if (datos.length > 0) {
            let proceso = datos.filter(p => p.n_evaluacion == localStorage.EvaluacionSelectSalle)
            me.asignaturas_salle = proceso.length
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTarease() {
      let me = this;
      me.$vs.loading({
        color: '#046AE7'
      })
    },


    //====TICKETS======
    cantidadTicketsAbiertos() {
      let me = this;
      this.$http.get(this.$server_url + 'ticket?cantAbiertos=yes')
        .then(function (response) {
          let datos = response.data
          if (datos.length > 0) {
            if (me.usuario.id_group == '1') {
              let getInfo = datos.filter(p => p.ticket_asesor == '0')
              me.cantTicketsAbiertos = getInfo.length;
            } else {
              let getInfo = datos.filter(p => p.ticket_asesor == '1' && p.vendedorInstitucion == me.usuario.cedula)
              me.cantTicketsAbiertos = getInfo.length;
            }
          }

        })
        .catch(function (error) { })
    },
    cantidadTicketsCerrados() {
      let me = this;
      this.$http.get(this.$server_url + 'ticket?cantCerrados=yes')
        .then(function (response) {
          if (response.data.length > 0) {
            me.cantTicketsCerrados = response.data[0].cantidadC;
          }
        })
        .catch(function (error) { })
    },

    //====FIN TICKETS======
    //====FORMULARIO DOCENTE========
    formsDocente() {
      let me = this;
      this.$http.get(this.$server_url + 'formularioDocente?all=yes')
        .then(function (response) {
          me.cantFormsDocente = response.data.forms.length;
          me.cantFormsSolicitudes = response.data.solicitudes.length
        })
        .catch(function (error) { })
    },
    //====FIN FORMULARIO DOCENTE====
    contenidosDocente() {
      let me = this;
      this.$http.get(this.$server_url + 'contenidos?idusuario=' + me.usuario.idusuario)
        .then(function (response) {
          me.contenidos = response.data;
        })
        .catch(function (error) { })
    },
    cantidadArchivos() {
      let me = this;
      this.$http.get(this.$server_url + 'cant_contenido/' + me.usuario.idusuario)
        .then(function (response) {
          me.cantArchivos = response.data;
        })
        .catch(function (error) { })
    },
    getInstitucion() {
      let me = this;
      this.$http.get(this.$server_url + 'verificarInstitucion/' + me.usuario.idusuario)
        .then(function (response) {
          if (response.data[0].institucion_idInstitucion === null) {
            me.getCiudad();
            me.popupActive = true
          } else {
            me.ObjectInstitucion = response.data[0]
            me.aplica_matricula  = response.data[0].aplica_matricula
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    getCiudad() {
      let me = this;
      this.$http.get(this.$server_url + 'ciudades')
        .then(function (response) {
          me.ciudades = response.data;
        })
        .catch(function (error) { })
    },
    verInstCiudad() {
      let me = this;
      this.$http.get(this.$server_url + 'verInstitucionCiudad/' + me.ciudad.id)
        .then(function (response) {
          me.instituciones = response.data;
        })
        .catch(function (error) { })
    },
    asignarInstitucion() {
      let me = this;
      if (me.institucion === '' || me.institucion === null) {
        me.$vs.notify({
          text: 'Seleccione una institución antes de guardar',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }
      var formData = new FormData();
      formData.append("institucion", me.institucion.id);
      formData.append("usuario", me.usuario.idusuario);
      this.$http.post(this.$server_url + 'asignarInstitucion', formData)
        .then(function (response) {
          me.popupActive = false;
          me.$vs.notify({
            text: 'Institución guardada exitosamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    evaluacionUrl() {
      let me = this
      let formData = new FormData();
      formData.append("codigo", me.vectorLink[1]);
      formData.append("idusuario", me.usuario.idusuario);
      this.$http.post(this.$server_url + 'verificarCursoEstudiante', formData)
        .then(function (res) {
          if (res.data != '') {
            localStorage.evaluacionxLink = ''
            window.location.href = me.urlOrigen + '/responderEvaluacion/' + me.linkEvaluacion
          } else {
            me.addClase()
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    addClase() {
      let me = this
      let formData = new FormData();
      formData.append("codigo", me.vectorLink[1]);
      formData.append("idusuario", me.usuario.idusuario);
      this.$http.post(this.$server_url + 'addClase', formData)
        .then(function (res) {
          localStorage.evaluacionxLink = ''
          window.location.href = me.urlOrigen + '/responderEvaluacion/' + me.linkEvaluacion
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    cantidad_evaluaciones() {
      let me = this;
      console.log(me.usuario.idusuario)
      this.$http.get(this.$server_url + 'cant_evaluaciones/' + me.usuario.idusuario)
        .then(function (res) {
          me.cant_eval = res.data;
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    getConteo() {
      let me = this;
      me.c_accesos = JSON.parse(localStorage.getItem('inProlipa'));
      if (me.c_accesos == null) {
        localStorage.inProlipa = 0;
      }
      me.c_accesos++
      localStorage.inProlipa = me.c_accesos;
      if (localStorage.inProlipa > me.reset_storage) {
        localStorage.inProlipa = 0;
      }
      me.c_user0 = JSON.parse(localStorage.getItem('total_user0'));
      me.c_user1 = JSON.parse(localStorage.getItem('total_user1'));
      me.c_user2 = JSON.parse(localStorage.getItem('total_user2'));
      me.c_user3 = JSON.parse(localStorage.getItem('total_user3'));
      if (me.c_user0 == 0 || me.c_user0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_user')
          .then(function (res) {
            localStorage.total_user0 = me.c_user0 = res.data[1].cantidad;
            localStorage.total_user1 = me.c_user1 = res.data[2].cantidad;
            localStorage.total_user2 = me.c_user2 = res.data[3].cantidad;
            localStorage.total_user3 = me.c_user3 = res.data[4].cantidad;
            // console.log(me.c_user)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.t_curso0 = JSON.parse(localStorage.getItem('total_cur0'));
      me.t_curso1 = JSON.parse(localStorage.getItem('total_cur1'));
      if (me.t_curso0 == 0 || me.t_curso0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_cursos')
          .then(function (res) {
            localStorage.total_cur0 = me.t_curso0 = res.data[0].cantidad;
            localStorage.total_cur1 = me.t_curso1 = res.data[1].cantidad;
            // console.log(me.t_cursos)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_eval = JSON.parse(localStorage.getItem('total_eva'));
      if (me.c_eval == 0 || me.c_eval == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_evaluaciones')
          .then(function (res) {
            // me.c_eval = (res.data)
            localStorage.total_eva = me.c_eval = res.data[0].cantidad;
            // console.log(me.c_eval)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_preg0 = JSON.parse(localStorage.getItem('total_preg0'));
      me.c_preg1 = JSON.parse(localStorage.getItem('total_preg1'));
      me.c_preg2 = JSON.parse(localStorage.getItem('total_preg2'));
      me.c_preg3 = JSON.parse(localStorage.getItem('total_preg3'));
      me.c_preg4 = JSON.parse(localStorage.getItem('total_preg4'));
      if (me.c_preg0 == 0 || me.c_preg0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_preguntas')
          .then(function (res) {
            // me.c_preg = (res.data)
            localStorage.total_preg0 = me.c_preg0 = res.data[0].cantidad;
            localStorage.total_preg1 = me.c_preg1 = res.data[1].cantidad;
            localStorage.total_preg2 = me.c_preg2 = res.data[2].cantidad;
            localStorage.total_preg3 = me.c_preg3 = res.data[3].cantidad;
            localStorage.total_preg4 = me.c_preg4 = res.data[4].cantidad;
            // console.log(me.c_eval)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_multi0 = JSON.parse(localStorage.getItem('total_multi0'));
      me.c_multi1 = JSON.parse(localStorage.getItem('total_multi1'));
      if (me.c_multi0 == 0 || me.c_multi0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_multimedia')
          .then(function (res) {
            localStorage.total_multi0 = me.c_multi0 = res.data[0].cantidad;
            localStorage.total_multi1 = me.c_multi1 = res.data[1].cantidad;
            // console.log(me.c_multi)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_juegos0 = localStorage.getItem('total_juego0');
      if (localStorage.inProlipa > 1) {
        this.$http.get(this.$server_url + 'cant_juegos')
          .then(function (res) {
            // console.log( res.data[0].cantidad )
            localStorage.total_juego0 = (res.data[0].cantidad);
            me.c_juegos0 = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_codigos = JSON.parse(localStorage.getItem('total_cod1'));
      if (me.c_codigos == 0 || me.c_codigos == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_codigos')
          .then(function (res) {
            // me.c_codigos = (res.data[0].cantidad)
            localStorage.total_cod1 = me.c_codigos = res.data[0].cantidad;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_codigos_total = JSON.parse(localStorage.getItem('total_cod0'));
      if (me.c_codigos_total == 0 || me.c_codigos_total == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_codigostotal')
          .then(function (res) {
            // me.c_codigos_total = (res.data[0].cantidad)
            localStorage.total_cod0 = me.c_codigos_total = res.data[0].cantidad;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_semi = JSON.parse(localStorage.getItem('semin'));
      if (me.c_semi == 0 || me.c_semi == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_seminarios')
          .then(function (res) {
            // me.c_semi = (res.data)
            localStorage.semin = me.c_semi = res.data[0].cantidad;
            // console.log(me.c_semi)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_enc = JSON.parse(localStorage.getItem('total_encu'));
      if (me.c_enc == 0 || me.c_enc == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_encuestas')
          .then(function (res) {
            // me.c_semi = (res.data)
            localStorage.total_encu = me.c_enc = res.data[0].cantidad;
            // console.log(me.c_semi)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    getInstitucionesDirector() {
      let me = this;
      this.$http.get(this.$server_url + 'verInstitucionDirector?idusuario=' + me.usuario.idusuario)
        .then(res => {
          me.instituciones_director = (res.data)
        })
        .catch(err => {
          console.error(err);
        })
    },
    //para cambiar de grupo al estudiante
    cambiarGrupoMatricula(grupo) {
      let me = this;
      this.$http.get(this.$server_url + 'cambiarEstadoMatricula?grupo=' + grupo + '&idusuario=' + me.usuario.idusuario)
        .then(function (res) {
          location.reload();
          me.$router.push('/')
          localStorage.clear();
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    getEstadoMatricula(periodo) {
      let me = this;
      // let periodo = localStorage.getItem('periodo_id')
      let idusuario = me.usuario.idusuario
      this.$http.get(this.$server_url + 'valores/pensiones?periodo_id=' + periodo + '&idusuario=' + idusuario)
        .then(function (res) {
          if (res.data.length > 0) {
            me.ifMatriculado = res.data.buscarEstudianteReserva[0].estado_matricula
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
  },

}
</script>

<style lang="scss">
.hide-close .vs-popup--close {
  display: none;
}

/*! rtl:begin:ignore */
#dashboard-analytics {

  .nombreInstitucion {
    background: #00b09b;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #96c93d, #00b09b);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #96c93d, #00b09b);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    box-shadow: 5px 4px 10px #ccc;
    border-radius: 10px 5px;



  }

  .fondo-director {
    background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  }

  .alto {
    min-height: 190px;
  }

  .numero1 {
    font-size: 1.5em;
  }

  .color1 {
    color: rgb(45, 133, 171);
  }

  .con-example-images {
    max-height: 500px,
      overflow auto
  }



  .greet-user {
    position: relative;

    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }

    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media(max-width: 576px) {

    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}

/*! rtl:end:ignore */</style>

