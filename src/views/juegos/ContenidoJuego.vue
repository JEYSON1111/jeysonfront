<template>
<div>
    <vs-prompt @cancel="activePromptEliminar=false;" @accept="eliminarJuego()" @close="activePromptEliminar=false;" :active.sync="activePromptEliminar" color="danger" title="Confirmar" acceptText="Aceptar" cancelText="Cancelar">
        <div class="con-exemple-prompt">
            ¿Está seguro de eliminar este juego?
        </div>
    </vs-prompt>

    <vx-card v-bind:title="nombre_tipo_juego">
        <!-----listado juegos--------->
        <p>Cantidad: <b>{{juegos.length}}</b></p>
        <vs-table stripe pagination max-items="25" search :data="juegos" v-if="juegos != undefined &&juegos.length>0">
            <template slot="header">
                <vs-button color="primary" class="mr-2" type="border" icon-pack="feather" @click="$router.go(-1)" icon="icon-arrow-left">Volver</vs-button>

                <vs-button @click="irCrearjuego('')" color="dark" type="filled">Crear juego</vs-button>
            </template>

            <template slot="thead">
                <vs-th sort-key="nombre_juego">Juegos</vs-th>
                <vs-th sort-key="temas">Unidad - tema</vs-th>
                <vs-th sort-key="creador">Creador</vs-th>
                <!-- <vs-th sort-key="fecha">Fecha</vs-th> -->
                <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                    <vs-td :data="data[indextr].nombre_juego">
                        <b>{{data[indextr].temas[0].nombreasignatura}}</b> <br>
                        <b>{{ data[indextr].nombre_juego.toUpperCase() }}</b><br>
                        <!-- <b>Descripción:</b> {{ data[indextr].descripcion_juego }}<br> -->
                        <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                        <b>Puntos:</b> {{ data[indextr].puntos }}<br/>
                        <b>{{ tr.statusJuego }}</b>
                    </vs-td>
                    <vs-td height="80px" width="40%">
                        <div class="overflow-y-auto h-24">
                        <div :data="item" :key="index" v-for="(item, index) in data[indextr].temas">
                            <div class="mb-2">Unidad {{item.unidad}} <br> {{item.nombre_tema}}</div>
                        </div>
                        </div>
                    </vs-td>
                    <!-- <vs-td>
                <b>Inicio:</b> {{ data[indextr].fecha_inicio }}<br><br>
                <b>Fin:</b> {{ data[indextr].fecha_fin }}
            </vs-td> -->
                    <vs-td :data="data[indextr].id_group">
                        <div v-if="data[indextr].id_group === 1"> Prolipa </div>
                        <div v-else>Docentes</div>
                    </vs-td>
                    <vs-td :data="data[indextr].id" style="width: 260px;">
                        <vx-tooltip style="display: inline-block;" text="Editar juego" position="top" color="success">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="irCrearjuego(data[indextr])" color="success" type="line"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Previsualizar juego" position="top" color="primary">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="previsualizarJuego(data[indextr])" color="primary" type="line"></vs-button>
                        </vx-tooltip>

                        <vx-tooltip style="display: inline-block;" text="Eliminar juego" position="top" color="danger">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="juegoElimin=data[indextr].id_juego; openConfirmEliminar();" color="danger" type="line"></vs-button>
                        </vx-tooltip>

                        <vx-tooltip style="display: inline-block;" text="Copiar link de juego" position="top" color="warning">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-link" @click="copiarLink(data[indextr]);" color="warning" type="line"></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <div v-else>
            <vs-button style="display:inline-block" color="primary" class="mr-2" type="border" @click="$router.go(-1)">Volver</vs-button>
            <vs-button style="display:inline-block" @click="irCrearjuego('')" color="dark" type="filled">Crear juego</vs-button>
        </div>
        <!------fin listado juegos--------->
    </vx-card>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default {
    data() {
        return {
            juegos: [],
            usuario: [],
            tabActivo: 1,
            id_juego: '',
            id_tipo_juego: '',
            nombre_tipo_juego: '',
            juegoElimin: [],
            activePromptEliminar: false,
            url_juego: '',
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr,
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.id_tipo_juego = localStorage.getItem('id_tipo_juego')
        me.nombre_tipo_juego = localStorage.getItem('nombre_tipo_juego')
    },
    mounted() {
        let me = this
        me.getJuegos()
    },
    methods: {
        getJuegos() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'juegos_prolipa_admin_tipo/' + me.id_tipo_juego)
                .then(res => {
                    me.juegos = res.data.items;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        irCrearjuego(item) {
            let me = this
            localStorage.setItem('data_juego', JSON.stringify(item));
            console.log(item,me.id_tipo_juego)

            switch (me.id_tipo_juego) {
                case '1':
                    me.$router.push('/crear_juego_ponchadoAdmin')
                    break;
                case '2':
                    me.$router.push('/crear_juego_sopaAdmin')
                    break;
                case '3':
                    me.$router.push('/crearJuegoSeleccionSimple')
                    break;
                case '4':
                    me.$router.push('/crearJuegoMillonario')
                    break;
                case '5':
                    me.$router.push('/crearJuegoMemoriaAdmin')
                    break;
                case '6':
                    me.$router.push('/crearJuegoRompecabezas')
                    break;
                default:
                    break;
            }
        },
        openConfirmEliminar() {
            let me = this;
            me.activePromptEliminar = true;
        },
        eliminarJuego() {
            let me = this;
            this.$http.get(this.$server_url + `j_juegos_eliminar/${me.juegoElimin}`).then(res => {
                    me.getJuegos()
                    me.$vs.notify({
                        text: 'Juego eliminado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {

                })
        },
        copiarLink(item) {
            let me = this
            let date = new Date()
            // let fecha_actual = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

            // if( fecha_actual < item.fecha_inicio || fecha_actual > item.fecha_fin ){
            //     me.$vs.notify({
            //     text:'Este juego aún no está disponible. Verifique las fechas de inicio y fin.',
            //     color:'warning',
            //     iconPack: 'feather',
            //     icon:'icon-alert-triangle'})
            //     return
            // }

            switch (me.id_tipo_juego) {
                case '1':
                    me.url_juego = 'ponchado'
                    break;
                case '2':
                    me.url_juego = 'sopa_letras'
                    break;
                case '3':
                    me.url_juego = 'jugarSeleccionSimple'
                    break;
                case '4':
                    me.url_juego = 'jugarMillonario'
                    break;
                case '6':
                    me.url_juego = 'rompecabezas'
                    break;
                default:
                    break;
            }

            let link = window.location.host + '/' + me.url_juego + '/' + item.id_juego + '/previsualizar'
            var aux = document.createElement("input");
            aux.setAttribute("value", link);
            document.body.appendChild(aux);
            aux.select();

            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        },
        previsualizarJuego(item) {
            let url_juego = ''
            let id_tipo = parseInt(item.id_tipo_juego)
            console.log(item)
            // return
            switch (id_tipo) {
                case 1:
                    url_juego = 'ponchado'
                    break;
                case 2:
                    url_juego = 'sopa_letras'
                    break;
                case 3:
                    url_juego = 'jugarSeleccionSimple'
                    break;
                case 4:
                    url_juego = 'jugarMillonario'
                    break;
                case 6:
                    url_juego = 'rompecabezas'
                    break;
                default:
                    break;
            }

            window.open('/' + url_juego + '/' + item.id_juego + '/previsualizar', "_blank");

        },

    },
}
</script>

<style>
.btnwizard {
    width: 65px;
    height: 65px;
    font-size: 22px;
    padding: 0px;
    border-radius: 100%;
    border: 2px solid rgb(29, 90, 182);
    background-color: white;
    color: rgb(29, 90, 182);
    cursor: pointer;
}
</style>
