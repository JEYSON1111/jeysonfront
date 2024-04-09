<template>
<div>
    <vs-popup title="Confirmar" :active.sync="popupConfirmQuitar">
        <div align="center">
            <p>¿Está seguro de eliminar este libro?</p><br>
            <vs-button color="danger" type="filled" @click="acceptAlertQuitar">Aceptar</vs-button>
        </div>
    </vs-popup>
    <vs-button @click="activePrompt = true" color="dark" type="relief">Agregar Libros</vs-button>
    <vs-prompt title="Agregar libro" @cancel="idlibro=''" @accept="acceptAlert" @close="close" acceptText="Aceptar" cancelText="Cancelar" :active.sync="activePrompt">
        <div class="con-exemple-prompt">
            <vs-alert active="true" color="success">
                Ingresa el código que se encuentra en tu libro.
            </vs-alert>
            <br>
            <vs-input icon-after="true" @keydown.space="(event) => event.preventDefault()" class="mt-4 w-full" icon="code" label-placeholder="MLE3-KJVBXXXXXX-XXX" v-model="codigo" />
        </div>
    </vs-prompt>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in libros" :key="$index">
            <vx-card class="text-center">
                <div slot="no-body">
                    <img v-if="item.weblibro != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/portada.png'" alt="Card image cap">
                    <img v-else class="responsive card-img-top" v-bind:src="$data_url+'tareas/img/'+item.portada" alt="Card image cap">
                </div>
                <p class="font-bold">
                    {{item.nombrelibro}}
                </p>
                <small>
                    {{item.descripcionlibro}}
                </small>
                <div class="w-3/3 ml-auto mt-3">
                    <vs-button color="primary" class="w-full mb-2" type="border" icon-pack="feather" @click="datolibro(item)" icon="icon-book">Libro Web</vs-button>
                </div>
            </vx-card>
        </div>
    </div>
    <vs-prompt
      @cancel="idlibro=''"
      title="Abrir Ticket"
      @accept="abrirTicket"
      @close="close"
      :active.sync="popupTicket">
        <div class="con-exemple-prompt">
            <vs-input class="inputx mb-3 w-full" disabled label="Estudiante" v-model="ticket.estudiante" />
            <vs-input class="inputx mb-3 w-full" disabled label="Institucion" v-model="ticket.nombreInstitucion" />
            <vs-input class="inputx mb-3 w-full" disabled label="Codigo" v-model="ticket.codigo" />
            <vs-input class="inputx mb-3 w-full" disabled label="Motivo" v-model="ticket.descripcion" />
            <vs-textarea counter="500" style="width:100%;" :counter-danger.sync="counterDanger" label="Mensaje (Opcional)" v-model="ticket.observacion" />
        </div>
    </vs-prompt>
</div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            counterDanger: false,
            datosEstudiante:[],
            ticket:{
                nombreInstitucion:'',
                estudiante:'',
                usuario:'',
                institucion:'',
                codigo:'',
                descripcion:'',
                observacion:'',
                cedula:'',
            },
            popupTicket:false,
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idlibro: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
            planlector: [],
            usuario: [],
            codigo: '',
            isNavOpen: false,
            idLibroSelec: null,
            popupConfirmQuitar: false,
            codigoLibroSelec: '',
            miusuario: '',

        }
    },
    watch:{
      codigo(results){
        if(results !=""){
          this.codigo = results.replace(/\s/g, "");
        }
      }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.miusuario = this.usuario
    },
    mounted() {
        localStorage.removeItem('pag_inicio');
        localStorage.removeItem('pag_fin');
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
        this.getLibros()
    },
    methods: {
        async abrirTicket(){
            let me = this;
             if(me.ticket.codigo.length >= 25){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El codigo no puede superar los 25 caracteres.'
                    })
                return false;
            }
            if(me.ticket.observacion.length >= 500){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo no puede superar los 500 caracteres.'
                    })
                return false;
            }
            let formData = new FormData();
            formData.append('cedula',               me.ticket.cedula);
            formData.append('codigo',               me.ticket.codigo);
            formData.append('institucion_id',       me.ticket.institucion);
            formData.append('usuario_id',           me.ticket.usuario);
            formData.append('group_id',             "4");
            formData.append('descripcion',          me.ticket.descripcion);
            formData.append('observacion',          me.ticket.observacion);
            formData.append('nombreInstitucion',    me.ticket.nombreInstitucion);
            formData.append('ticket_asesor',        0)
            this.$http.post(this.$server_url+'ticket', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupTicket=false;
                    me.ticket.observacion = "";
                    me.ticket.cedula = "";
                    me.ticket.codigo = "";
                    me.ticket.institucion = "";
                    me.ticket.usuario = "";
                    me.ticket.descripcion = "";
                })
                .catch(function (error) {})
        },
        async getLibros() {
            let me = this;
            me.$vs.loading()
            let region  = localStorage.region
            this.$http.get(this.$server_url+'codigos_libros_estudiante/' + me.usuario.idusuario+'/'+me.usuario.institucion_idInstitucion+'/'+localStorage.periodo_id+'/'+region+'/4')
                .then(function (response) {
                    me.libros = response.data.libros
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        datoplanlector(url) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombreplanlector
            let h_recursotipo = 1; //1 = libro
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'plan lector',
                'recurso_nombre': url.descripcionplanlector,
                'recurso_detalle': '',
            }
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.url = url.webplanlector;
            this.$router.push('/estudiante/libros/planlector');
        },
        datolibro(url) {
            let me = this;
            localStorage.url = url.weblibro;
            localStorage.puerto = url.puerto;
            localStorage.idasignatura = url.asignatura_idasignatura
            me.$vs.loading()
            let region  = localStorage.region
            this.$http.get(this.$server_url+'menu_unidades_libros/' + url.idlibro+'/'+region)
                .then(function (response) {
                    me.unidadesLibro = response.data
                    console.log(me.unidadesLibro)
                    for (let index = 0; index < me.unidadesLibro.length; index++) {
                        if (index == 0) {
                            localStorage.pag_inicio = me.unidadesLibro[index].pag_inicio
                        }
                        localStorage.pag_fin = me.unidadesLibro[index].pag_fin
                    }
                    let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                    let h_idusuario = me.miusuario.idusuario;
                    let h_idgrupo = me.miusuario.id_group;
                    let h_idasignatura = url.idasignatura
                    let h_nombreasignatura = url.nombreasignatura
                    let h_recursotipo = 1; //1 = libro
                    let datoHistorico = {
                        'user_nombre': me.miusuario.nombres,
                        'user_apellido': me.miusuario.apellidos,
                        'user_email': me.miusuario.email,
                        'user_cedula': me.miusuario.cedula,
                        'recurso_accion': 'ver',
                        'recurso_tipo': 'libro',
                        'recurso_nombre': url.nombrelibro,
                        'recurso_detalle': '',
                    }
                    me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
                    me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                    me.$vs.loading.close()
                    let route = me.$router.resolve({path: '/estudiante/libro/digital'});
                    window.open(route.href, '_blank');
                })
        },
        openConfirmQuitarLibro(item) {
            this.idLibroSelec = item.idlibro;
            this.codigoLibroSelec = item.codigo;
            this.popupConfirmQuitar = true;
        },
        acceptAlertQuitar() {
            let me = this;
            me.popupConfirmQuitar = false;
            let formData = new FormData();
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('codigo', me.codigoLibroSelec);
            formData.append('idlibro', me.idLibroSelec);
            this.$http.post(this.$server_url+'quitarlibroestudiante', formData)
                .then(function (response) {
                    me.idLibroSelec = null;
                    me.getLibros();
                    me.$vs.notify({
                        color: 'success',
                        title: 'Eliminado',
                        text: 'Libro Eliminado Correctamente'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        acceptAlert() {
          let me = this;
          let formData = new FormData();
          if (!me.codigo) {
            me.$vs.notify({
                color: 'warning',
                title: 'Ingrese un código',
            })
          } else {
            formData.append('codigo', me.codigo);
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('id_periodo', localStorage.periodo_id);
            formData.append('id_institucion', me.usuario.institucion_idInstitucion);
            this.$http.post(this.$server_url+'codigoslibros', formData)
              .then(function (response) {
                if(response.data.status == 5){
                  me.$vs.notify({
                      text: response.data.message,
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle',
                      time:6000
                  })
                  return
                }
                if (response.data.status == 0) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'danger',
                      title: 'Error',
                      text: 'El código ingresado, ya está en uso.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                    //Para abrir un ticket
                    me.ticket.codigo = response.data.codigo;
                    me.ticket.usuario = response.data.usuario;
                    me.ticket.institucion = response.data.institucion;
                    me.ticket.descripcion = "El código ingresado, ya está en uso.";
                    me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                    me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                    me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                    me.popupTicket = true;
                  }
                  else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
                if (response.data.status == 1) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'success',
                      title: 'Guardado',
                      text: 'Libro Agregado'
                  })
                }
                if (response.data.status == 2) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'warning',
                      title: 'Error',
                      text: 'El código ingresado, no existe.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                      //Para abrir un ticket
                      me.ticket.codigo = response.data.codigo;
                      me.ticket.usuario = response.data.usuario;
                      me.ticket.institucion = response.data.institucion;
                      me.ticket.descripcion = "El código ingresado, no existe";
                      me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                      me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                      me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                      me.popupTicket = true;
                  }
                  else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
                if (response.data.status == 4) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'warning',
                      title: 'Error',
                      text: 'El código ingresado, ha sido devuelto.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                      //Para abrir un ticket
                      me.ticket.codigo = response.data.codigo;
                      me.ticket.usuario = response.data.usuario;
                      me.ticket.institucion = response.data.institucion;
                      me.ticket.descripcion = "El código ingresado, ha sido devuelto";
                      me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                      me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                      me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                      me.popupTicket = true;
                  }else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
                if (response.data.status == 3) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'warning',
                      title: 'Error',
                      text: 'El código ingresado, se encuentra bloqueado.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                      //Para abrir un ticket
                      me.ticket.codigo = response.data.codigo;
                      me.ticket.usuario = response.data.usuario;
                      me.ticket.institucion = response.data.institucion;
                      me.ticket.descripcion = "El código ingresado, se encuentra bloqueado";
                      me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                      me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                      me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                      me.popupTicket = true;
                  }else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
              })
              .catch(function (error) {})
            }
        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },
    },
}
</script>
