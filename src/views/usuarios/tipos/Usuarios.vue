<template>
    <div>
    <br>
        <div v-if="op_agregar==0" >
            <vs-card v-if="user.id_group == 1 || user.id_group == 11 || user.id_group == 23 || user.id_group == 22">
                <vs-row vs-justify="flex-start">
                    <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                        <div class="flex">
                            <vs-button type="border" icon-pack="feather" icon="icon-user-plus" @click="agrega_nuevo_user()">
                                Agregar usuario
                            </vs-button>
                        </div>
                        <br/>
                        <p>Filtro de busquedas</p>
                        <br>
                        <vs-card>
                            <div style="">
                                <vs-input class="w-full" @keyup.enter="busquedaFiltroEstudiante()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Ingrese el criterio de busqueda"  v-model="usuario.razonBusqueda"/>
                            </div>
                            <div style="">
                                <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                                    <li class="modelx">
                                    </li>
                                    <li style="margin:10px 20px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='email'">Email</vs-radio>
                                    </li>
                                    <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda"  @input="busqueda='cedula'">Cedula</vs-radio>
                                    </li>
                                    <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="2" v-model="valorBusqueda"  @input="busqueda='usuario'">Usuario</vs-radio>
                                    </li>
                                    <li>
                                        <vs-button color="warning" type="filled" style="margin-left:10px;" @click="busquedaFiltroEstudiante();" icon="search"></vs-button>
                                    </li>
                                </ul>
                            </div>
                        </vs-card>
                    </vs-col>
                </vs-row>
                <vs-row>
                    <vs-col  type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                        <vs-table max-items="3"  pagination :data="estudiantesCursos">
                        <template slot="thead">
                            <vs-th style="width:40%;">Datos Personales</vs-th>
                            <vs-th style="width:10%;">Perfil</vs-th>
                            <vs-th style="width:20%;">Accion</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                                <vs-td>
                                    {{ tr.idusuario }}
                                    <br/>
                                    Nombres:
                                    <br>
                                    <span style="font-weight:600;">
                                    {{ tr.nombres }} {{ tr.apellidos }}<br>
                                    </span>
                                    usuario:
                                    <br>
                                    <span style="font-weight:600;">
                                    {{ tr.name_usuario }}<br>
                                    </span>
                                    Clave:
                                    <br>
                                    <span style="font-weight:600;">
                                    {{ tr.cedula }}<br>
                                    </span>
                                    Email:
                                    <br>
                                    <span style=" font-weight:600;">
                                    {{ tr.email }}<br>
                                    </span>
                                    Institucion:
                                    <br>
                                    <span  style="font-weight:600;">
                                    {{ tr.nombreInstitucion }}<br>
                                    </span>
                                    Cargo:
                                    <br>
                                    <span  style="font-weight:600;">
                                    {{ tr.cargo }}<br>
                                    </span>
                                    <template>
                                        <div v-if="tr.estado_idEstado == 1" style="margin-top:-10px">
                                            <vs-chip color="primary">
                                                <p>Activo</p>
                                            </vs-chip>
                                        </div>
                                        <div v-else>
                                            <vs-chip color="danger">
                                                <p>Desactivado</p>
                                            </vs-chip>
                                        </div>
                                    </template>
                                </vs-td>
                                <vs-td>
                                    {{ tr.perfil }}
                                   <vs-chip v-if="tr.change_password == 0 && tr.fecha_change_password == null" color="primary">Contraseña actualizada</vs-chip>
                                   <vs-chip v-if="tr.capacitador == 1" color="success">Capacitador</vs-chip>
                                </vs-td>
                                <vs-td align="center">
                                    <vs-dropdown vs-custom-content vs-trigger-click>
                                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                                            <div v-if="userRoot || user.id_group == 11 || user.id_group == 1">
                                              <!--VER CURSOS ESTUDIANTE-->
                                              <vs-dropdown-item v-if="tr.id_group == 4">
                                                  <vs-button color="success" type="line"   class="w-full" @click="verCursos(tr.idusuario)">Ver cursos estudiante</vs-button>
                                              </vs-dropdown-item>
                                              <!--VER LIBROS ESTUDIANTE-->
                                              <vs-dropdown-item v-if="tr.id_group == 4">
                                                  <vs-button color="primary" type="line"   class="w-full" @click="verLibrosEstudiante(tr.idusuario,tr.institucion_idInstitucion)">Ver libros estudiante</vs-button>
                                              </vs-dropdown-item>
                                              <!--VER HISTORICO INSTITUCIONES-->
                                              <vs-dropdown-item v-if="tr.id_group == 4">
                                                  <vs-button color="dark" type="line"   class="w-full" @click="getHistoricoChangeInstitucion(tr)">Ver historico instituciones</vs-button>
                                              </vs-dropdown-item>
                                              <!--ASIGNAR LIBROS-->
                                              <vs-dropdown-item v-if="tr.id_group == '6' || tr.id_group == '10' || tr.id_group == '9'">
                                                  <vs-button color="#5E4BE5" type="line"   class="w-full" @click="irAsignacion(tr)">Asignar libros</vs-button>
                                              </vs-dropdown-item>
                                              <vs-dropdown-item>
                                                <vs-button color="#97AADB" type="line"   class="w-full" @click="userSelect=tr;openConfirmResetear(tr)">Resetear password</vs-button>
                                              </vs-dropdown-item>
                                              <!--DOCUMENTOS NEET-->
                                              <vs-dropdown-item>
                                                <vs-button color="#569B58" type="line" class="w-full" @click="userSelect=tr;getTemas();irAsignacionNEE(tr)">Asignar Documentos NEE</vs-button>
                                              </vs-dropdown-item>
                                            </div>
                                            <!--EDITAR-->
                                            <vs-dropdown-item>
                                                <vs-button color="warning" type="line" class="w-full" @click="popupActivo=true;getEdit(tr)">Editar</vs-button>
                                            </vs-dropdown-item>
                                            <!--VISITAS DEL USUARIO-->
                                            <vs-dropdown-item>
                                                <vs-button color="primary" type="line" class="w-full" @click="getVisitas(tr)">Visitas del usuario</vs-button>
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                            </vs-tr>
                        </template>
                        </vs-table>
                    </vs-col>
                </vs-row>
            </vs-card>
            <vx-card>
                <vs-collapse v-if="arregloHistorico.length > 0">
                    <vs-collapse-item>
                        <div slot="header">
                            <p style="color:#2A9FF6;"><span><i class="fa-solid fa-flag"></i> Histórico del estudiante: <b>{{ datosHistorico.nombre }}</b> </span> </p>
                        </div>
                        <div>
                            <vs-table max-items="5" search pagination :data="arregloHistorico">
                                <template slot="header">
                                    <vs-chip tranparent color="primary">Cantidad {{ arregloHistorico.length }}</vs-chip>
                                </template>
                                <template slot="thead">
                                    <vs-th>Editor</vs-th>
                                    <vs-th>Institución Anterior</vs-th>
                                    <vs-th>Institución Nueva</vs-th>
                                    <vs-th>Período</vs-th>
                                    <vs-th>Fecha</vs-th>
                                </template>
                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                        <vs-td>
                                            {{data[indextr].editor}}<br>
                                        </vs-td>
                                        <vs-td>
                                            {{data[indextr].institucionAnterior}}<br>
                                        </vs-td>
                                        <vs-td>
                                            {{data[indextr].institucionNueva}}<br>
                                        </vs-td>
                                        <vs-td>
                                            {{data[indextr].periodo}}<br>
                                        </vs-td>
                                        <vs-td>
                                            {{data[indextr].created_at}}<br>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </vx-card>
        </div>
        <div v-if="op_agregar==1">
            <registro @escuchar="variableHijo"></registro>
        </div>
        <vs-card v-if="op_agregar == 3">
            <visitasUsuario @escuchar="variableHijo" :datoU="datoU"/>
        </vs-card>
        <!--Modal de Editar-->
        <vs-popup class="editpop"  fullscreen title="Editar" :active.sync="popupActivo">
            <editarUsuarioVue @saveChange="changeHandle" :usuarios="usuarios" :instituciones="instituciones"/>
        </vs-popup>
        <!-- MODAL PARA LOS CURSOS DE ESTUDIANTES -->
        <vs-popup class="holamundo"  title="Cursos del estudiante" :active.sync="popupCursosEstudiantes">
            <vs-list>
                <vs-chip color="primary">
                    Cantidad de Cursos {{ cantidad_cursos }}
                </vs-chip>
                <br><br>
                <vs-list-header color="success" title="Codigos de cursos"></vs-list-header>
                <vs-list-item :key="index" v-for="(item, index) in cursosCodigos" :title="item.codigo" ></vs-list-item>
            </vs-list>
         </vs-popup>
        <!-- FIN MODAL PARA LOS CURSOS DE LOS ESTUDIANTES-->
        <!-- MODAL PARA LOS LIBROS DE ESTUDIANTES -->
        <vs-popup class="holamundo"  title="Libros del estudiante" :active.sync="popupLibrosEstudiantes">
            <vs-table max-items="10" search pagination :data="codigosLibros">
                <template slot="header">
                    <vs-chip color="primary">
                        Cantidad de libros: {{ codigosLibros.length }}
                    </vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>
                    Codigo
                    </vs-th>
                    <vs-th>
                    Periodo
                    </vs-th>
                    <vs-th>
                    Ultima actualizacion
                    </vs-th>
                    <vs-th>
                    Datos Verificación
                    </vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                        <vs-td :data="data[indextr].codigo">
                            <b>Libro:</b>
                            <p>{{ tr.nombrelibro }}</p>
                            <b>Código:</b>
                        {{data[indextr].codigo}}
                        <p style="font-weight:bold;">Estado_liquidacion:</p>
                        <span>{{tr.liquidacion}}</span>
                        <p style="font-weight:bold;">Estado:</p>
                        <span>
                        {{ tr.codigoEstado }}<br>
                        </span>
                        </vs-td>
                        <vs-td :data="data[indextr].descripcion">
                            {{data[indextr].descripcion}}
                        </vs-td>
                        <vs-td :data="data[indextr].updated_at">
                            {{data[indextr].updated_at}}
                        </vs-td>
                        <vs-td>
                            <span style=" font-weight:600; ">
                                <vs-chip color="primary" v-if="tr.verif1 >0">Verificación Nº 1</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif2 >0">Verificación Nº 2</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif3 >0">Verificación Nº 3</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif4 >0">Verificación Nº 4</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif5 >0">Verificación Nº 5</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif6 >0">Verificación Nº 6</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif7 >0">Verificación Nº 7</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif8 >0">Verificación Nº 8</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif9 >0">Verificación Nº 9</vs-chip>
                                <vs-chip color="primary" v-if="tr.verif10 >0">Verificación Nº 10</vs-chip>
                            </span>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
        <!-- FIN MODAL PARA LOS LIBROS DE LOS ESTUDIANTES-->
        <!-- Modal para Asignacion de libros al docente-->
        <vs-popup title="Asignacion" fullscreen :active.sync="popupAsignacion">
            <vx-card>
                <br/>
                <div class="m-2">
                    <vs-list>
                        <vs-list-item v-if="show_inst== 'si'" title="Institución" :subtitle="user_institucion"></vs-list-item>
                        <vs-list-item v-if="periodo.periodo_id > 0" title="Período" :subtitle="periodo.descripcion">
                           <vs-chip v-if="periodo.estado == 1" color="success">Activo</vs-chip>
                           <vs-chip v-else color="danger">Desactivado</vs-chip>
                        </vs-list-item>
                        <vs-list-item title="Nombre" :subtitle="user_nombre"></vs-list-item>
                        <vs-list-item title="Email" :subtitle="user_email"></vs-list-item>
                    </vs-list>
                    <vs-divider color="success">Areas seleccionadas ( {{seleccionadas.length}} ) </vs-divider>
                    <vs-collapse>
                        <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
                            <div slot="header">
                                Ver ( {{seleccionadas.length}} )
                            </div>
                            <div class="vx-row">
                                <div class="vx-col sm:w-full text-right" v-if="seleccionadas.length >1">
                                    <vs-button type="border" color="danger" size="small" @click="confirmaQuitar()">Quitar todas <span class="feather icon icon-trash"></span></vs-button>
                                    <vs-button type="filled" color="primary" size="small" @click="moverPeriodoActual()" class="ml-2">Mover a período actual<span class="feather icon icon-check"></span></vs-button>
                                  </div>
                                <div class="vx-col sm:w-full">
                                    <div v-for="(item, index) in seleccionadas" :key="index" class="m-1 p-1 asig-select text-dark">
                                      {{item.nombreasignatura}} ( {{ item.periodoescolar }} )&nbsp; &nbsp;
                                        <vs-button @click="eliminaAsignacion(item)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                                    </div>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>
                </div>
                <div class="m-2">
                    <vs-divider color=primary> Areas ( {{area.length}} ) </vs-divider>
                    <vs-collapse>
                        <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down" v-for="(listItem, index) in area" :key="index" :title="listItem.name">
                            <div slot="header">
                                {{listItem.name}}
                            </div>
                            <vs-button v-for="(listIAsig, indexAsig) in listItem.children" :key="indexAsig" type="border" color="primary" class="p-2 m-1" @click="agregaAsignacion(listIAsig)">
                                {{listIAsig.name}}
                            </vs-button>
                        </vs-collapse-item>
                    </vs-collapse>
                </div>
            </vx-card>
        </vs-popup>
        <vs-popup title="Asignacion Documentos NEET" fullscreen :active.sync="popupAsignacionNEE">
          <vs-list>
            <vs-list-item v-if="show_inst== 'si'" title="Institución" :subtitle="user_institucion"></vs-list-item>
            <vs-list-item v-if="periodo.periodo_id > 0" title="Período" :subtitle="periodo.descripcion">
              <vs-chip v-if="periodo.estado == 1" color="success">Activo</vs-chip>
              <vs-chip v-else color="danger">Desactivado</vs-chip>
            </vs-list-item>
            <vs-list-item title="Nombre" :subtitle="userSelect.nombres+' '+userSelect.apellidos"></vs-list-item>
            <vs-list-item title="Cédula" :subtitle="userSelect.cedula"></vs-list-item>
            <vs-list-item title="Email" :subtitle="userSelect.email"></vs-list-item>
          </vs-list>
          <br><br>
          <AsignarDocumentosVue v-if="popupAsignacionNEE" :arregloTemas="arregloTemas" :userExterno="userSelect" externo="1"/>
        </vs-popup>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import registro from '../agrega_usuario.vue'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import moment from 'moment'
import 'flatpickr/dist/flatpickr.css';
import asignarLibrosVue from '../../institucion/components/asignarLibros.vue';
import visitasUsuario from './components/visitasUsuario.vue'
import editarUsuarioVue from './components/editarUsuario.vue';
import AsignarDocumentosVue from '@/views/nee_documentos/components/AsignarDocumentos'
export default {
    components:{
      'v-select': vSelect,
      registro,
      flatPickr,
      asignarLibrosVue,
      visitasUsuario,
      editarUsuarioVue,
      AsignarDocumentosVue,
    },
    data() {
        return {
            popupAsignacion:false,
            op_agregar: 0,
            popupVistaUsuarios:false,
            popupCursosEstudiantes:false,
            popupLibrosEstudiantes:false,
            valorBusqueda:"2",
            codigosLibros:[],
            estudiantesCursos : [],
            estudiantesCodigos :[],
            busqueda:"usuario",
            estudiantes:[],
            usuario:{
                razonBusqueda:"",
            },
            popupActivo:false,
            instituciones:[],
            usuarios:{
                idusuario:"",
                cedula:"",
                nombres:"",
                apellidos:"",
                email:"",
                name_usuario:"",
                telefono:"",
                estado_idEstado:"",
                institucion_idInstitucion:"",
                id_group:"",
                fecha_nacimiento:'',
                cargo_id:'',
                iniciales:'',
                foto_user:'',
                capacitador:''
            },
            docente: '',
            listaVisitas: [],
            datoU:'',
            cantidad_cursos:"",
            cursosCodigos:[],
            user:[],
            seleccionadas:'',
            area:[],
            user_institucion:'',
            user_email:'',
            show_inst:'',
            user_nombre:'',
            fromDate:null,
            toDate:null,
            //variables para el historico
            datosHistorico:{
                nombre:''
            },
            arregloHistorico:[],
            //fin variables para el historico
            periodo:{
                periodo_id:0,
                estado:0,
                descripcion:'',
            },
            userRoot: false,
            //VARIABLES NEE
            popupAsignacionNEE:false,
            userSelect:{},
            arregloTemas:[],
            //FIN VARIABLES NEE
            userFacturadores:false,
        };
    },
    mounted() {
        let me = this;
        me.user = JSON.parse(localStorage.getItem('usuario'))
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
        me.getUserRoot(me.user);
        if(me.user.id_group == 22 || me.user.id_group == 23){
            me.userFacturadores = true
        }
    },
    methods:{
      changeHandle(e){
            let me = this
            me.busquedaFiltroEstudiante();
            me.popupActivo = false;
        },
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        //agregar usuario
        agrega_nuevo_user() {
            let me = this;
            me.op_agregar = 1;
        },
        listaUsuarios(){
            let me = this;
            me.op_agregar = 2;
        },
        variableHijo(valor) {
            let me = this;
            me.op_agregar = valor;
        },
        //====METODOS NEET
        irAsignacionNEE(item){
          let me = this;
          me.getPeriodo(item);
          me.popupAsignacionNEE = true;
        },
        getTemas(){
          let me = this
          this.$http.get(this.$server_url+`neetTema?listadoTemas=yes`).then(res => {
            me.arregloTemas = res.data;
            })
            .catch(function (error) {
              console.log(error)
            })
        },
        //asignacion del usuario docente
        //FIN METODOS NEETT
       irAsignacion(item) {
            let me = this;
            localStorage.setItem('user_select', (JSON.stringify(item)));
            localStorage.setItem('show_inst', 'si'); //desde vista docentes, mostrar institucion
            me.show_inst            = (localStorage.getItem('show_inst'));
            me.usuarioAsignacion    = JSON.parse(localStorage.getItem('user_select'));
            me.user_seleccionado    = me.usuarioAsignacion.idusuario
            me.user_nombre          = me.usuarioAsignacion.nombres + ' ' + me.usuarioAsignacion.apellidos
            me.user_email           = me.usuarioAsignacion.email
            me.user_institucion     = item.nombreInstitucion
            me.getAreaSelect();
            me.getSeleccionadas();
            me.getPeriodo(item);
            me.popupAsignacion = true;
        },
         //=======METODOS PARA MODAL DE ASIGNACION DE LIBROS
        getPeriodo(tr){
            let me = this
            this.$http.get(this.$server_url + "institucionTraerPeriodo?institucion_id="+tr.institucion_idInstitucion)
            .then(function (res) {
                if(res.data.length == 0){
                    me.periodo.periodo_id   = 0
                    me.periodo.estado       = 0
                    me.periodo.descripcion  = ""
                }
                let datos                   = res.data[0]
                me.periodo.periodo_id       = datos.periodo
                me.periodo.estado           = datos.estado
                me.periodo.descripcion      = datos.descripcion
            });
        },
        getSeleccionadas() {
            let me = this;
            me.$vs.loading();
            let data = new FormData();
            data.append('idusuario', me.user_seleccionado)
            this.$http.post(this.$server_url + "asignaturasDocent", data)
                .then(res => {
                    // console.log(res.data);
                    me.seleccionadas = res.data;
                    // me.popupDocentes = true;
                    me.$vs.loading.close();
                });
        },
        getAreaSelect() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "areaSelect").then(function (response) {
                me.area = response.data.items;
                // console.log(me.area);
                me.$vs.loading.close();
            });
        },
        getVisitas(tr){
            let me = this;
            me.datoU = tr;
            me.op_agregar=3;
        },
        agregaAsignacion(item) {
            let me = this;
            let data = new FormData();
            if(me.periodo.periodo_id == 0){
                me.$vs.notify({time: 4000,text: 'La institución no tiene período',color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return
            }
            if(me.periodo.estado == 0){
                me.$vs.notify({time: 4000,text: 'La institución tiene período inactivo',color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return
            }
            data.append('usuario_idusuario', me.user_seleccionado)
            data.append('asignatura_idasignatura', item.id)
            this.$http.post(this.$server_url + "asignar_asignatura_docentes", data)
                .then(function (res) {
                    // console.log(res.data);
                    if (res.data > 0) {
                        me.$vs.notify({
                            time: 7000,
                            text: 'Esta asignatura ya se encuentra asignada al docente',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Asignatura agregada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getSeleccionadas();
                    }
                    me.$vs.loading.close();
                });
        },
        eliminaAsignacion(item) {
            let me = this;
            // console.log(item)
            me.$vs.loading();
            this.$http.get(this.$server_url + "eliminaAsignacion/" + item.idasignado)
                .then(function (res) {
                    // console.log(res.data);
                    me.$vs.notify({
                        text: item.nombreasignatura + ' eliminada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                    me.$vs.loading.close();
                });
        },
        confirmaQuitar() {
            let me = this;
            me.popupAsignacion = false
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este contenido?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_quitarTodo,
                cancel:me.f_regresar
            })
        },
        moverPeriodoActual(){
          let me = this
          this.$http.get(this.$server_url+'moverAsignaturasPeriodo/'+me.user_seleccionado+'/'+me.periodo.periodo_id)
            .then(function (res) {
              me.$vs.notify({
              text:'Se cambio correctamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
              me.getSeleccionadas();
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        f_regresar(){
            let me = this
            me.popupAsignacion = true
        },
        f_quitarTodo() {
            let me = this;
            let idSelects = [];
            for (let index = 0; index < me.seleccionadas.length; index++) {
                idSelects.push(me.seleccionadas[index].idasignado)
            }
            me.$vs.loading();
            let data = new FormData();
            data.append('idasiguser', idSelects)
            this.$http.post(this.$server_url + "quitaTodasAsignaturas", data)
                .then(function (res) {
                    // console.log(res.data);
                     me.$vs.notify({
                        text: 'Asignaturas quitadas correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                    me.$vs.loading.close();
                });
        },
        //=======FIN DE METODOS PARA MODAL DE ASIGNACION DE LIBROS
        busquedaFiltroEstudiante(){
            let me = this;
            me.estudiantesCursos = [];
            me.arregloHistorico  = [];
            if(me.usuario.razonBusqueda.length < 5){
                me.$vs.notify({
                text:'Minimo 5 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading();
            if(me.user.id_group == 11){
                //PARA LOS ASESORES
                this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.busqueda+'&razonBusqueda='+me.usuario.razonBusqueda+'&asesor=yes')
                .then(function (res) {
                     me.$vs.loading.close()
                     if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return false;
                    }else{
                        me.estudiantesCursos = res.data
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
            }else{
                //para los administradores
                this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.busqueda+'&razonBusqueda='+me.usuario.razonBusqueda)
                .then(function (res) {
                     me.$vs.loading.close()
                     if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return false;
                    }else{
                        var datos = res.data
                        if(me.userFacturadores){
                            datos  = res.data.filter(p => p.id_group != 1)
                        }
                        me.estudiantesCursos = datos
                    }
                    if(me.estudiantesCursos.length == 0){
                        me.$vs.notify({
                        text: 'No se encontro resultados',
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
            }
        },
        //historico de cambios instituciones
        getHistoricoChangeInstitucion(tr){
            let me = this;
            me.arregloHistorico = []
            me.datosHistorico.nombre = tr.nombres + " " + tr.apellidos
            me.$vs.loading();
            this.$http.get(this.$server_url+'gestionEstudiante?getHistorico=yes&idusuario='+tr.idusuario)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.length == 0){
                        me.$vs.notify({
                        text: 'No hay historico del estudiante',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return false;
                    }
                    me.arregloHistorico = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //editar
        getEdit(data={}){
            let me = this;
            console.log(data)
            me.usuarios = data
        },
        //para ver los libros de los estudiantes
        verLibrosEstudiante(idusuario,institucion_idInstitucion){
            let me = this;
            me.$vs.loading();
            let libro = "yes"
            this.$http.get(this.$server_url+'busquedaFiltroEstudiante?libroEstudiante='+libro + '&idusuario='+idusuario +'&institucion='+institucion_idInstitucion)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.codigosLibros = res.data.codigos;
                    me.popupLibrosEstudiantes = true;
                   if(res.data.message){
                          me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                   }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
      //para ver los cursos de los estudiantes
      verCursos(idusuario){
          let me = this;
          me.$vs.loading();
          let busquedaCurso = "yes"
          this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busquedaCurso='+busquedaCurso + '&idusuario='+idusuario)
          .then(function (res) {
              me.$vs.loading.close()
              me.cantidad_cursos = res.data.cantidad[0].cantidad_cursos;
              me.cursosCodigos = res.data.codigos;
              me.popupCursosEstudiantes = true;
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },
      openConfirmResetear(){
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirmar`,
        acceptText:'Si, deseo resetear',
        cancelText:'Cancelar',
        text: 'Estas seguro de resetear el password?',
        accept:this.generarPassword
      })
      },
      generarPassword(tr) {
        let me = this;
        let formData = new FormData();
        this.$vs.loading({
            background: this.backgroundLoading,
            color: this.colorLoading,
            container: "#button-with-loading",
            scale: 0.45
        })
        formData.append('email', me.userSelect.email);
        this.$http.post(this.$server_url + 'restaurarPassword', formData)
            .then(function (response) {
                me.$vs.notify({
                    text: 'Use el número de cédula para acceder al perfil del usuario.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-lock'
                })
                me.$vs.loading.close("#button-with-loading > .con-vs-loading")
            })
            .catch(function (error) {
                me.$vs.notify({
                    text: 'Error en el proceso',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-lock'
                })
                me.$vs.loading.close("#button-with-loading > .con-vs-loading")
            })
      },
    }
}
</script>
