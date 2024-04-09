<template>
<div>
    <vx-card>
        <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="regresar()">Regresar</vs-button>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario.nombres" />
                <span v-if="errors.nombres" class="text-danger text-sm">{{ errors.nombres[0] }}</span>
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario.apellidos" />
                <span v-if="errors.apellidos" class="text-danger text-sm">{{ errors.apellidos[0] }}</span>

            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario.cedula" />
                <span v-if="errors.cedula" class="text-danger text-sm">{{ errors.cedula[0] }}</span>
            </div>
            <div class="vx-col w-full sm:w-1/2" v-if="userRoot">
                <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Usuario" v-model="usuario.name_usuario" />
                <span v-if="errors.name_usuario" class="text-danger text-sm">{{ errors.name_usuario[0] }}</span>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-1/2">
              <div class="flex">
                <vs-switch color="success" v-if="tmp_user.id_group == 1" class="mr-2" style="width: 100px;position: relative;top:30px;" v-model="chkValidarEmail">
                  <span slot="on">Con correo</span>
                  <span slot="off">Sin correo</span>
                </vs-switch>
                <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario.email" />
              </div>
                <span v-if="errors.email" class="text-danger text-sm">{{ errors.email[0] }}</span>
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario.telefono" />
                <span v-if="errors.telefono" class="text-danger text-sm">{{ errors.telefono[0] }}</span>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/3 w-full">
                <p>Perfil</p>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="grupo" :reduce="grupo => grupo.id" label="deskripsi" v-model="usuario.id_group"></v-select>
                <span v-if="errors.id_group" class="text-danger text-sm">{{ errors.id_group[0] }}</span>
            </div>
        </div>
        <div class="vx-row mb-4" v-if="usuario.id_group  == 1 || userRoot">
            <div class="vx-col sm:w-1/3 w-full">
                <p>Capacitador</p>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
              <vs-radio class="m-2" color="success" v-model="capacitador" vs-name="capacitador" vs-value="1">Si</vs-radio>
              <vs-radio class="m-2" v-model="capacitador" vs-name="capacitador" vs-value="0">No</vs-radio>
            </div>
        </div>
        <div class="vx-row mb-4" v-if="userRoot && usuario.id_group  == 11">
          <div class="vx-col sm:w-1/3 w-full">
              <p>Id cliente Institucion</p>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" type="tel" icon-pack="feather" icon-no-border v-model="usuario.cli_ins_codigo" />
          </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Estado</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="estado" :reduce="estado => estado.id" label="label" v-model="usuario.estado_idEstado"></v-select>
                <span v-if="errors.estado_idEstado" class="text-danger text-sm">{{ errors.estado_idEstado[0] }}</span>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Ciudad</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select @input="filtrarInstituciones()" :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="ciudadSelect" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Institución</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="arregloTraeInstitucion" :reduce="arregloTraeInstitucion => arregloTraeInstitucion" label="nombreInstitucion" class="w-full" v-model="usuario.institucion_idInstitucion" />
            </div>
        </div>
        <div class="vx-row text-center">
            <vs-button @click="guardar()" class="w-full mr-3 mb-2" color="success">Agregar</vs-button>
        </div>
        <br><br><br><br><br>
    </vx-card>
    <!--MODALES-->
    <!--Modal añadir cargos-->
    <vs-popup background-color="rgba(255,255,255,.6)" title="Añadir cargos" :active.sync="popupAddCargo">
        <vs-table max-items="5" search pagination :data="cargos" v-if="editCargo == false">
            <template slot="header">
                <div>
                    <vs-button type="line" style="border-radius: 10px;" icon="add" @click="editCargo = true;limpiar();update=false;">Añadir</vs-button>
                </div>
            </template>
            <template slot="thead">
                <vs-th>Cargo</vs-th>
                <vs-th style="width:100px;">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].cargo}}<br>
                    </vs-td>
                    <vs-td>
                        <div style="display:flex;">
                            <vx-tooltip style="display: inline-block;" text="Editar cargo" position="top" color="primary">
                                <vs-button size="small" class="modal-default-button" color="success" @click="editarCargo(tr);update=true" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                            </vx-tooltip> &nbsp;

                            <div>

                                <vx-tooltip v-if="tr.estado == 1" style="display: inline-block;" text="Desactivar cargo" position="top" color="primary">
                                    <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirmCargo(tr,0);" icon-pack="feather" type="filled" icon="icon-trash"> </vs-button>
                                </vx-tooltip> &nbsp;

                                <vx-tooltip v-if="tr.estado == 0 && tmp_user.id_group == 1" style="display: inline-block;" text="Activar cargo" position="top" color="primary">
                                    <vs-button size="small" class="modal-default-button" color="warning" @click="openConfirmCargo(tr,1);" icon-pack="feather" type="filled" icon="icon-check"> </vs-button>
                                </vx-tooltip> &nbsp;

                            </div>

                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--PARA EDITAR CARGO-->
        <div v-if="editCargo == true">
            <vs-button radius color="success" type="filled" @click="editCargo = false" icon="reply"></vs-button>
            <vs-row class="mt-4">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-input label="Cargo" class="w-full" placeholder="Cargo" v-model="cargo.cargo" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button color="success" @click="guardarCargo()" type="relief">Guardar</vs-button>
                </vs-col>
            </vs-row>
        </div>
    </vs-popup>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        Datepicker,
        flatPickr,
    },
    data() {
        return {
          capacitador: 0,
            editCargo: false,
            popupAddCargo: false,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            usuario: {},
            estado: [{
                    id: 1,
                    label: "Activo"
                },
                {
                    id: 2,
                    label: "Bloqueado"
                },
                {
                    id: 4,
                    label: "Eliminado"
                }
            ],
            usuario: {
                'cedula': '',
                'nombres': '',
                'apellidos': '',
                'correo': '',
                'name_usuario': '',
                'telefono': '',
                'id_group': '',
                'cli_ins_codigo':'',
                'estado_idEstado': '',
                'institucion_idInstitucion': '',
                'idcreadorusuario': '',
                'cargo_id': '',
                'fecha_nacimiento': ''
            },
            error: '',
            password: '',
            passwordc: '',
            btn: false,
            ciudad: [],
            institucion: '',
            instituciones: [],
            grupo: [],
            idregion: '',
            idciudad: '',
            ciudadSelect: '',
            errors: {},
            arregloInstitucion: [],
            //para traer las ciudades
            arregloCiudad: [],
            //arreglo para filtrar las instituciones por ciudades
            arregloTraeInstitucion: [],
            //para el select de la ciudades
            ciudadSelect: '',
            op_agregar: 0,
            tmp_user: '',
            cargos: [],
            cargo: {
                id: '',
                cargo: '',
                estado: '',
            },
            userRoot: false,
            chkValidarEmail:true,
        }
    },
    mounted() {
        let me = this;
        me.tmp_user = JSON.parse(localStorage.getItem('usuario'));
        // console.log( me.tmp_user.idusuario )
        me.usuario.idcreadorusuario = me.tmp_user.idusuario;
        me.getPerfiles();
        me.listaCiudades();
        me.getCargos();
        me.getUserRoot(me.tmp_user);
    },
    methods: {
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
        limpiar() {
            let me = this;
            me.cargo.id = "";
            me.cargo.cargo = "";
        },
        editarCargo(tr) {
            let me = this;
            me.cargo.id = tr.id
            me.cargo.cargo = tr.cargo
            me.editCargo = true
        },
        openConfirmCargo(tr, estado) {
            let me = this;
            me.popupAddCargo = false;
            me.cargo.id = tr.id
            me.cargo.estado = estado
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar el cargo',
                accept: this.eliminarCargo,
                cancel: this.cancelar
            })
        },
        cancelar() {
            let me = this;
            me.popupAddCargo = true
        },
        eliminarCargo() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.cargo.id)
            formData.append('estado', me.cargo.estado)
            formData.append('eliminar', "yes")
            formData.append('usuario_id', me.tmp_user.idusuario)
            me.$vs.loading()
            this.$http.post(this.$server_url + 'cargo', formData)
                .then(res => {
                    me.getCargos();
                    me.popupAddCargo = true
                    me.editCargo = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        guardarCargo() {
            let me = this;
            if (me.cargo.cargo == "") {
                me.$vs.notify({
                    text: 'Debe agregar un cargo para guardar',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false
            }
            let formData = new FormData();
            if (me.update == true) {
                formData.append('id', me.cargo.id)
            }
            formData.append('cargo', me.cargo.cargo)
            formData.append('usuario_id', me.tmp_user.idusuario)
            me.$vs.loading()
            this.$http.post(this.$server_url + 'cargo', formData)
                .then(res => {
                    me.getCargos();
                    me.editCargo = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        guardar() {
            let me = this;
            if (me.usuario.cedula == '') {
                me.$vs.notify({
                    text: 'Falta la cedula',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.usuario.nombres == '' || me.usuario.apellidos == '') {
                me.$vs.notify({
                    text: 'Falta los nombres',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.usuario.name_usuario == '' && me.userRoot == true) {
                me.$vs.notify({
                    text: 'Falta usuario',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.usuario.email == '') {
                me.$vs.notify({
                    text: 'Falta email',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.usuario.id_group == '') {
                me.$vs.notify({
                    text: 'Falta perfil',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.usuario.estado == '') {
                me.$vs.notify({
                    text: 'Falta estado',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.usuario.institucion_idInstitucion == '') {
                me.$vs.notify({
                    text: 'Falta institucion',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            let data = new FormData();
            data.append('cedula', me.usuario.cedula);
            data.append('nombre', me.usuario.nombres);
            data.append('apellido', me.usuario.apellidos);
            if (me.userRoot) {
                data.append('name_usuario', me.usuario.name_usuario);
            } else {
                data.append('name_usuario', me.usuario.email);
            }
            data.append('telefono', me.usuario.telefono);
            data.append('grupo', me.usuario.id_group);
            data.append('p_ingreso', me.usuario.p_ingreso);
            data.append('idInstitucion', me.usuario.institucion_idInstitucion.idInstitucion);
            data.append('idcreadorusuario', me.usuario.idcreadorusuario);
            data.append('modificado_por', me.usuario.idcreadorusuario);
            data.append('estado', me.usuario.estado_idEstado);
            data.append('capacitador', me.capacitador);
            data.append('cli_ins_codigo',me.usuario.cli_ins_codigo)
            var validarEmail = 0
            if(me.chkValidarEmail){
              validarEmail = 1
              data.append('email', me.usuario.email);
            }else{
              data.append('email', me.usuario.email+"s");
            }
              data.append('validarEmail',validarEmail)
            if (me.usuario.cargo_id == "" || me.usuario.cargo_id == null || me.usuario.cargo_id == undefined) {
                data.append('cargo_id', "");
            } else {
                data.append('cargo_id', me.usuario.cargo_id.id);
            }
            if (me.usuario.fecha_nacimiento == "" || me.usuario.fecha_nacimiento == null || me.usuario.fecha_nacimiento == undefined) {
                data.append('fecha_nacimiento', "");
            } else {
                data.append('fecha_nacimiento', me.usuario.fecha_nacimiento);
            }
            me.$vs.loading();
            me.$http.post(me.$server_url + 'add_user_ad', data)
                .then(function (response) {
                    console.log(response.data)
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Usuario guardado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                    me.regresar();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    if (error.response.status == 422) {
                        try {
                            me.errors = error.response.data.errors
                            console.log(me.errors)
                        } catch (error) {

                        }
                    }
                })
        },
        getCargos() {
            let me = this;
            this.$http.get(this.$server_url + 'traerCargos')
                .then(function (response) {
                    let datos = response.data
                    let obtener = datos.filter(p => p.estado > 0)
                    if (me.tmp_user.id_group == 11) {
                        me.cargos = obtener;
                    } else {
                        me.cargos = response.data;
                    }

                })
                .catch(function (error) {})
        },
        getPerfiles() {
            let me = this;
            this.$http.get(this.$server_url + 'obtenerPerfiles?id_group=' + me.tmp_user.id_group)
                .then(function (response) {
                    console.log(response.data)
                    me.grupo = response.data;
                })
                .catch(function (error) {})
        },
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + `ciudad`).then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getInstitucion() {
            let me = this;
            this.$http.get(this.$server_url + 'institucion')
                .then(function (response) {
                    me.instituciones = response.data;
                    console.log(me.instituciones)
                })
                .catch(function (error) {})
        },
        filtrarInstituciones() {
            let me = this;
            if (me.ciudadSelect == null) return

            me.arregloTraeInstitucion = []

            me.$vs.loading()
            const formData = new FormData();
            formData.append('ciudad_id', me.ciudadSelect.idciudad);

            this.$http.post(this.$server_url + 'traerinstituciones', formData).then(res => {
                    me.arregloTraeInstitucion = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })

        },
        regresar() {
            this.$emit('escuchar', this.op_agregar);
        },
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
