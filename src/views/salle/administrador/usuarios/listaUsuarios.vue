<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <vs-button color="primary" type="border" icon-pack="feather" icon="icon-plus" @click="agregarUsuario();">Agregar</vs-button>
        <vs-tabs alignment="fixed">
            <vs-tab :label="'Docentes ( ' + listaDocentes.length +' )'">
                <vs-table max-items="20" search pagination :data="listaDocentes" style="margin-top:-20px">
                    <template slot="thead">
                        <vs-th sort-key="nombre">Nombre</vs-th>
                        <vs-th sort-key="cedula">Cedula</vs-th>
                        <vs-th sort-key="email">Email</vs-th>
                        <vs-th sort-key="estado">Estado</vs-th>
                        <vs-th sort-key="institucion">Institucion</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombres}} {{data[indextr].apellidos}}
                            </vs-td>
                            <vs-td>
                                {{data[indextr].cedula}}
                            </vs-td>
                            <vs-td>
                                {{data[indextr].email}}
                            </vs-td>
                            <vs-td>
                                <div @click="confirmaEstado(tr)">
                                    <vs-button v-if="data[indextr].estado_idEstado == 1" color="success" size="small">Activo</vs-button>
                                    <vs-button v-if="data[indextr].estado_idEstado == 2" color="danger" size="small">Bloqueado</vs-button>
                                </div>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].institucion_ciudad}}
                            </vs-td>
                            <vs-td style="width: 350px;" align="center">
                              <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button type="relief" class="a-icon">
                                    Opciones
                                    <vs-icon class="" icon="expand_more"></vs-icon>
                                </vs-button>
                                <vs-dropdown-menu class="loginx">
                                    <vs-dropdown-item style="width:200px;" @click="user = tr;popupAsignarAsignaturas=true;">
                                        <span class="feather icon icon-book"></span> Asignaturas
                                    </vs-dropdown-item>
                                    <vs-dropdown-item style="width:200px;margin-top:5px;"  @click="editarUsuario(tr)">
                                        <span class="feather icon icon-edit"></span> Editar
                                    </vs-dropdown-item>
                                    <vs-dropdown-item style="width:200px;margin-top:5px;" @click="confirmaResetear(tr)">
                                        <span class="feather icon-corner-down-left"></span> Resetear contraseña
                                    </vs-dropdown-item>
                                    <vs-dropdown-item style="width:200px;margin-top:5px;" @click="confirmaIntento(tr)">
                                        <span class="feather icon-refresh-ccw"></span> Permitir nuevo intento de evaluación
                                    </vs-dropdown-item>
                                    <vs-dropdown-item style="width:200px;margin-top:5px;" @click="irPrevisualizacion(tr);">
                                        <span class="feather icon icon-eye"></span> Previsualizar
                                    </vs-dropdown-item>
                                    <vs-dropdown-item style="width:200px;margin-top:5px;" @click="revisarEvaluacion(tr)">
                                        <span class="feather icon icon-check"></span> Revisar Evaluación
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                              </vs-dropdown>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-tab>
            <vs-tab :label="'Administradores ( '+listaAdmins.length+' )'">
                <vs-table max-items="20" search pagination :data="listaAdmins" style="margin-top:-20px">
                    <template slot="thead">
                        <vs-th sort-key="nombre">Nombre</vs-th>
                        <vs-th sort-key="cedula">Cedula</vs-th>
                        <vs-th sort-key="email">Email</vs-th>
                        <vs-th sort-key="estado">Estado</vs-th>
                        <vs-th sort-key="institucion">Institucion</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombres}} {{data[indextr].apellidos}}
                            </vs-td>
                            <vs-td>
                                {{data[indextr].cedula}}
                            </vs-td>
                            <vs-td>
                                {{data[indextr].email}}
                            </vs-td>
                            <vs-td>
                                <div @click="confirmaEstado(tr)">
                                    <vs-button v-if="data[indextr].estado_idEstado == 1" color="success" size="small">Activo</vs-button>
                                    <vs-button v-if="data[indextr].estado_idEstado == 2" color="danger" size="small">Bloqueado</vs-button>
                                </div>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].institucion_ciudad}}
                            </vs-td>
                            <vs-td>
                              <div class="flex">
                                <vx-tooltip text="editar" position="top" style="display: inline-block" color="warning">
                                  <vs-button size="large" type="line" radius icon-pack="feather" class="mr-2" icon="icon-edit" color="warning" @click="editarUsuario(tr)"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="resetear contraseña" position="top" style="display: inline-block" color="primary">
                                  <vs-button size="large" type="line" radius icon-pack="feather" icon="icon-refresh-ccw" color="primary" @click="confirmaResetear(tr)"></vs-button>
                                </vx-tooltip>
                              </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-tab>
        </vs-tabs>
    </vx-card>
    <!--MODALES-->
    <!--MODAL PARA REVISAR LA EVALUACION-->
    <vs-popup classContent="popup-example" fullscreen title="Previsualizar Evaluación" :active.sync="popupRevisarEvaluacion">
      <RevisarEvaluacionSalleVue v-if="popupRevisarEvaluacion" :user="user" @changeReturn="changeReturn"/>
    </vs-popup>
    <!--VER ASIGNATURAS-->
    <vs-popup classContent="popup-example" fullscreen title="Asignaturas Docente" :active.sync="popupAsignarAsignaturas">
      <usuarioAsignaturaVue :desdeAdmin="1" :user="user" v-if="popupAsignarAsignaturas"/>
    </vs-popup>
    <!--EDITAR-->
    <vs-popup classContent="popup-example" fullscreen title="Mantenimiento de Docente" :active.sync="popupEditar">
      <agregarUsuarioVue :editar="editar" :user="user" v-if="popupEditar" @recharge="recharge"/>
    </vs-popup>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import RevisarEvaluacionSalleVue from '../../docente/evaluaciones/RevisarEvaluacionSalle.vue'
import usuarioAsignaturaVue from './usuarioAsignatura.vue'
import agregarUsuarioVue from './agregarUsuario.vue'
export default {
    components: {
      'v-select': vSelect,
      RevisarEvaluacionSalleVue,
      usuarioAsignaturaVue,
      agregarUsuarioVue
    },
    data() {
        return {
          listaDocentes: '',
          listaAdmins: '',
          miusuario: '',
          datoEditar: '',
          num: '',
          ///variables para previsualizar evaluacion
          user:{},
          popupEditar:false,
          popupRevisarEvaluacion:false,
          //fin variables para previsualizar evaluacion
          //variables para asignar asignaturas
          popupAsignarAsignaturas:false,
          //fin variables para asignar asignaturas ss
          editar:0,
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('datoUsuario')
        localStorage.removeItem('editar')
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario;
        me.getUsuarios();
    },
    methods: {
        recharge(e){
            let me  = this;
            if(e == 1) { me.popupEditar = false; return }
            me.popupEditar = false
            me.getUsuarios()
        },
      changeReturn(){
        let me = this;
        me.popupRevisarEvaluacion = false;
      },
      getUsuarios() {
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url+'usuarioSalle/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
              me.listaDocentes = res.data.docentes;
              me.listaAdmins = res.data.admins;
              me.$vs.loading.close();
          })
          .catch(err => {
              console.log(err)
              me.$vs.loading.close();
          })
      },
        agregarUsuario() {
          let me = this;
          me.popupEditar = true
          me.editar = 0
        },
        editarUsuario(item) {
            let me = this;
            me.editar = 1
            me.user = item
            me.popupEditar = true
        },
        confirmaEstado(item) {
            let me = this;
            let msj = '';
            console.log(item)
            me.datoEditar = item;
            if (item.estado_idEstado == 1) {
                msj = "BLOQUEAR ";
                me.num = 2;
            } else {
                msj = "ACTIVAR ";
                me.num = 1;
            }
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en ' + msj + ' a este usuario?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.estadoUsuario
            })
        },
        estadoUsuario() {
            let me = this;
            let datas = new FormData();
            datas.append('idusuario', me.datoEditar.idusuario);
            datas.append('estado', me.num);
            me.$vs.loading();
            this.$http.post(this.$server_url+'activa_desactiva_user', datas)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Usuario editado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.getUsuarios();
                })
                .catch(err => {
                    me.$vs.loading.close();
                    // console.log(err)
                })
        },
        confirmaResetear(item) {
            let me = this;
            // console.log(item)
            me.datoEditar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'La contraseña será reemplazada por el número de cédula.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.resetearClave
            })
        },
        resetearClave() {
            let me = this;
            me.$vs.loading();
            let datas = new FormData();
            datas.append('idusuario', me.datoEditar.idusuario);
            datas.append('cedula', me.datoEditar.cedula);
            this.$http.post(this.$server_url+'updatePassword', datas)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Contraseña reseteada, correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.getUsuarios();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        asignaturasUsuario(item){
            let me = this;
            localStorage.usuSalle =  (item.idusuario);
            me.$router.push('/admin/usuarioasignaturas');
        },
        confirmaIntento(item) {
            let me = this;
            me.datoEditar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Está seguro de renovar el intento para el docente seleccionado? La evaluación actual ya no será calificada.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.renovarIntento
            })
        },
        renovarIntento(){
          let me = this
          me.$vs.loading();
          let data = new FormData();
          data.append('idusuario',   me.datoEditar.idusuario);
          data.append('n_evaluacion',localStorage.EvaluacionSelectSalle)
          this.$http.post(this.$server_url+'salle_intento_eval', data)
          .then(res => {
            me.$vs.notify({
              text: 'El docente podrá rendir la evaluación una vez más',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            me.$vs.loading.close();
          })
          .catch(err => {
            console.log(err)
            me.$vs.loading.close();
          })
        },
        irPrevisualizacion(tr){
          let me = this
          me.user.nombres                     = tr.nombres
          me.user.apellidos                   = tr.apellidos
          me.user.cedula                      = tr.cedula
          me.user.institucion_idInstitucion   = tr.idInstitucion
          me.user.idusuario                   = tr.idusuario
          me.user.id_evaluacion                    = tr.id_evaluacion
          me.popupRevisarEvaluacion           = true
        },
        revisarEvaluacion(item){
          let me = this
          if( item.id_evaluacion == null || item.id_evaluacion == 'null' || item.id_evaluacion == ''){
            me.$vs.notify({
              text: 'El docente seleccionado aún no ha rendido una evaluación',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
          }else{
            let datos_docente = item.nombres + ' ' + item.apellidos + ' - ' + item.cedula
            localStorage.setItem('tipo_revisar', 1);
            localStorage.setItem('revisa_admin_salle', 1);
            localStorage.setItem('id_evaluacion_salle', item.id_evaluacion);
            localStorage.setItem('idusuario_evaluacion_salle', item.idusuario);
            localStorage.setItem('idInstitucionDocente',item.idInstitucion)
            localStorage.setItem('datos_docente_revisando', datos_docente);
            me.$router.push('/salle/docente/evaluacion');
          }
        }
    }
}
</script>
