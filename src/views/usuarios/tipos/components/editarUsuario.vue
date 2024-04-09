<template>
<div>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="5" style="margin:10px;">
            <vs-card>
                <div class="vx-col sm:w-full md:w-1/2">
                    <vs-avatar class="text-center" size="100px" :src="$data_url+'archivos/'+'perfil/'+usuarios.foto_user" />
                </div>
            </vs-card>
        </vs-col>
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="5" style="margin:10px;">
            <vs-card>
                <div class="vx-col w-full mt-5">
                    <vs-button ref="loadableButton" id="button-with-loading" class="vs-con-loading__container" @click="generarPassword(usuarios.email)" type="relief">
                        Resetear contraseña
                    </vs-button>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuarios.nombres" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuarios.apellidos" />
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuarios.cedula" />
        </div>
        <div class="vx-col w-full sm:w-1/2" v-if="userRoot">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Usuario" v-model="usuarios.name_usuario" />
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuarios.email" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuarios.telefono" />
        </div>
    </div>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-card>
                <div class="vx-col w-full mt-5">
                    Perfil
                    <v-select :options="grupo" :reduce="grupo => grupo.id" label="deskripsi" v-model="usuarios.id_group"></v-select>
                </div>
                <div class="vx-col w-full mt-5" v-if="usuarios.id_group  == 1">
                    <div class="vx-col sm:w-2/3 w-full">
                      Capacitador:
                        <vs-radio class="m-2" color="success" v-model="usuarios.capacitador" vs-name="capacitador" vs-value="1">Si</vs-radio>
                        <vs-radio class="m-2" v-model="usuarios.capacitador" vs-name="capacitador" vs-value="0">No</vs-radio>
                    </div>
                </div>
                <div class="vx-col w-full mt-5">
                    <v-select :options="estado" :reduce="estado => estado.id" label="label" v-model="usuarios.estado_idEstado"></v-select>
                </div>
                <div class="vx-col w-full mt-5">
                    <v-select :disabled="desabilitar_boton" :options="instituciones" :reduce="instituciones => instituciones.id" label="label" v-model="usuarios.institucion_idInstitucion"></v-select>
                </div>
                <div v-if="usuarios.id_group == 11 && userRoot">
                  <vs-alert color="primary">
                    <p>* El campo de <b>iniciales</b> se usa para realizar pedidos </p>
                    <p>* El campo de <b>cli_ins_codigo</b> es el id de la tabla cliente_institucion de facturación donde se relaciona con la institución llamada prolipa Plataforma y el asesor </p>
                  </vs-alert>
                </div>
                <div class="vx-row mb-6" v-if="usuarios.id_group == 11 && userRoot">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>Iniciales</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-check" icon-no-border label="Iniciales" v-model="usuarios.iniciales" />
                    </div>
                </div>
                <div class="vx-row mb-6" v-if="usuarios.id_group == 11 && userRoot">
                  <div class="vx-col sm:w-1/3 w-full">
                      <span>Cliente ins_codigo</span>
                  </div>
                  <div class="vx-col sm:w-2/3 w-full">
                      <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-check" icon-no-border label="Cliente Facturación id" v-model="usuarios.cli_ins_codigo" />
                  </div>
                </div>
            </vs-card>
        </vs-col>
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="10" style="margin:10px;">
            <vs-card>
                <div class="vx-col w-full mt-5">
                    <vs-button color="success" @click="guardar" style="width:100%;" type="filled">Guardar</vs-button>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
export default {
    data() {
        return {
            usuario: [],
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
            cargos: [],
            grupo: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            desabilitar_boton: false,
            userRoot: false,
        }
    },
    components: {
        flatPickr,
        vSelect,
    },
    props: {
        usuarios: {
            type: Object,
            default: {},
        },
        instituciones: {
            type: Array,
            default: [],
        },
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getCargos()
        me.getPerfiles()
    },
    mounted() {
        let me = this
        me.getUserRoot(me.usuario)
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
        getPerfiles() {
            let me = this;
            this.$http.get(this.$server_url + 'obtenerPerfiles?id_group=' + me.usuario.id_group)
                .then(function (response) {
                    me.grupo = response.data;
                })
                .catch(function (error) {})
        },
        getCargos() {
            let me = this;
            this.$http.get(this.$server_url + 'traerCargos')
                .then(function (response) {
                    me.cargos = response.data;
                })
                .catch(function (error) {})
        },
        async guardar() {
            let me = this
            me.btn = false;
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('idusuario', this.usuarios.idusuario);
            formData.append('cedula', this.usuarios.cedula);
            formData.append('nombres', this.usuarios.nombres);
            formData.append('apellidos', this.usuarios.apellidos);
            formData.append('email', this.usuarios.email);
            if (me.userRoot) {
              formData.append('name_usuario', this.usuarios.name_usuario);
            } else {
              formData.append('name_usuario', this.usuarios.email);
            }
            formData.append('estado_idEstado', this.usuarios.estado_idEstado);
            formData.append('institucion_idInstitucion', this.usuarios.institucion_idInstitucion);
            formData.append('id_group', this.usuarios.id_group);
            formData.append('capacitador', this.usuarios.capacitador);
            formData.append('cli_ins_codigo',this.usuarios.cli_ins_codigo)
            if (me.usuarios.telefono == "" || me.usuarios.telefono == null || me.usuarios.telefono == undefined) {
                formData.append('telefono', "");
            } else {
                formData.append('telefono', me.usuarios.telefono);
            }
            if (this.usuarios.iniciales == null || this.usuarios.iniciales == "null") {
                formData.append('iniciales', "");
            } else {
                formData.append('iniciales', this.usuarios.iniciales);
            }
            if (me.usuarios.cargo_id == "" || me.usuarios.cargo_id == null || me.usuarios.cargo_id == undefined) {
                formData.append('cargo_id', "");
            } else {
                formData.append('cargo_id', me.usuarios.cargo_id);
            }
            if (me.usuarios.fecha_nacimiento == "" || me.usuarios.fecha_nacimiento == null || me.usuarios.fecha_nacimiento == undefined) {
                formData.append('fecha_nacimiento', "");
            } else {
                formData.append('fecha_nacimiento', me.usuarios.fecha_nacimiento);
            }
            this.$http.post(this.$server_url + 'usr', formData)
                .then(function (response) {
                  // console.log(response.data)
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Usuario guardado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                    me.$emit('saveChange', true)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        generarPassword() {
            let me = this;
            let formData = new FormData();
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            })
            formData.append('email', this.usuarios.email);
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
