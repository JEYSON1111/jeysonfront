<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup :title="titulo_modal" :active.sync="modalEditar">
        <div class="vx-row m-2">
            <!-- {{id_unidad_libro}} -->
            <div class="vx-col w-full mb-4" align="left">
                Libro: <b> {{libroSelect.nombrelibro}} </b>
            </div>
            <div class="vx-col sm:w-full lg:w-1/4 w-full" align="left">
                <div style="font-size: 12px;">Texto unidad: </div>
                <vs-input class="inputx w-full mb-6" v-model="txt_nombre_unidad" min="0" max="20" placeholder="Texto unidad" />
            </div>
            <div class="vx-col sm:w-full lg:w-3/4 w-full" align="left">
                <div style="font-size: 12px;">Nombre unidad: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="nombre_unidad" maxlength="350" placeholder="Nombre unidad" />
            </div>
            <div class="vx-col sm:w-full lg:w-1/3 w-full" align="left">
                <div style="font-size: 12px;">número unidad: </div>
                <vs-input type="number" class="inputx w-full mb-6" v-model="unidad" min="0" max="900" placeholder="Número de unidad" />
            </div>
            <div class="vx-col sm:w-full lg:w-1/3 w-full" align="left">
                <div style="font-size: 12px;">Página inicio de unidad: </div>
                <vs-input type="number" class="inputx w-full mb-6" v-model="pag_inicio" min="0" max="900" placeholder="Página inicio" />
            </div>
            <div class="vx-col sm:w-full lg:w-1/3 w-full" align="left">
                <div style="font-size: 12px;">Página fin de unidad: </div>
                <vs-input type="number" class="inputx w-full mb-6" v-model="pag_fin" min="0" max="999" placeholder="Página fin" />
            </div>
            <div class="vx-col w-full">
                <vs-button style="display:inline" class="m-2 mb-2" type="filled" @click="guardarEdicion()"> Guardar </vs-button>
                <vs-button style="display:inline" class="m-2 mb-2" type="filled" color="warning" @click="modalEditar=false"> Cancelar </vs-button>
            </div>

        </div>
    </vs-popup>
    <vx-card>
        <vs-tabs alignment="fixed">
            <vs-tab label="Libros">
                <libros />
            </vs-tab>
            <vs-tab label="Unidades" v-if="userAdmin || permisoRoot">
                <div class="vx-row mt-4">
                    <div class="vx-col w-full mb-3" align="left">
                        <vs-button color="primary" icon-pack="feather" icon="icon-plus" @click="agregarUnidad()"> Agregar unidad</vs-button>
                    </div>
                    <div class="vx-col sm:w-1/2 lg:w-3/4 w-full" align="left">
                        <div style="font-size: 12px; ">Seleccione el libro para filtrar sus unidades: </div>
                        <v-select class="mb-4 w-full" v-model="libroSelect" :options="libros" label="nombrelibro" :reduce="libros => libros" @input="cargaUnidades()" />
                        <!-- {{libroSelect}} -->
                    </div>
                    <div class="vx-col  w-full" align="left">
                        <vs-table stripe pagination max-items="30" search :data="unidades">
                            <template slot="thead">
                                <vs-th>Unidad</vs-th>
                                <vs-th>Pagina inicio</vs-th>
                                <vs-th>Pagina fin</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td width="65%">
                                        <!-- {{ data[indextr].id_unidad_libro }} - -->
                                        {{ data[indextr].unidad }} -
                                        {{ data[indextr].nombre_unidad }}
                                    </vs-td>
                                    <vs-td width="15%">
                                        {{ data[indextr].pag_inicio }}<br>
                                    </vs-td>
                                    <vs-td width="15%">
                                        {{ data[indextr].pag_fin }}<br>
                                    </vs-td>
                                    <vs-td width="20%">
                                        <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                            <vs-button size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-edit" @click="editaContenido(data[indextr])"></vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="danger">
                                            <vs-button size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-trash" color="danger" @click="confirmaeliminar(data[indextr])"></vs-button>
                                        </vx-tooltip>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </vs-tab>
            <vs-tab label="Temas" v-if="userAdmin || permisoRoot">
                <temas />
            </vs-tab>
            <vs-tab label="Asignaturas" v-if="userAdmin || permisoRoot">
                <asignaturas />
            </vs-tab>
            <vs-tab label="Series" v-if="permisoRoot">
                <series />
            </vs-tab>
            <vs-tab label="Areas" v-if="userAdmin || permisoRoot">
                <areas />
            </vs-tab>
            <vs-tab label="Niveles" v-if="userAdmin || permisoRoot">
                <niveles />
            </vs-tab>
            <vs-tab label="Cuadernos" v-if="userAdmin || permisoRoot">
                <cuadernos />
            </vs-tab>
            <!-- <vs-tab label="videos">
                <videosVue />
            </vs-tab> -->
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import temas from "../evaluaciones/TemasComponent.vue";
import libros from "../libros/ScreenLibros.vue";
import asignaturas from "../asignaturas/asignaturas.vue";
import areas from "../areas/areas.vue";
import series from '../librosserie/series.vue'
import niveles from "../nivel/nivel.vue";
import cuadernos from '../cuadernos/cuadernos'
import videosVue from '../videos/videos.vue';
export default {
    components: {
        'v-select': vSelect,
        temas,
        libros,
        asignaturas,
        areas,
        niveles,
        cuadernos,
        videosVue,
        series,
    },
    data() {
        return {
            usuario:[],
            permisoRoot:false,
            libros: [],
            libroSelect: '',
            unidades: [],
            unidadesSelect: {},
            modalEditar: false,
            id_unidad_libro: '',
            unidad: '',
            nombre_unidad: '',
            txt_nombre_unidad: '',
            pag_inicio: '',
            pag_fin: '',
            titulo_modal: '',
            userAdmin:false,

        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        if(me.usuario.id_group == 1) { me.userAdmin = true; }
        me.getAsignaturas();
        me.getUserRoot();
    },
    methods: {
        //para obtener el listado de los usuarios root
        getUserRoot() {
        let me = this;
        this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
            .then(function (res) {
                if(res.data.status == '1'){
                    me.permisoRoot = true
                }else{
                    me.permisoRoot = false
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url+'libro_enUnidad')
                .then(res => {
                    me.libros = res.data;
                    // console.log(me.libros)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        cargaUnidades() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'unidadesX_Libro/' + me.libroSelect.idlibro)
                .then(res => {
                    me.unidades = res.data;
                    // console.log(me.unidades)
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close();
                })

        },
        agregarUnidad() {
            let me = this;
            if (me.libroSelect == '') {
                me.$vs.notify({
                    text: 'Seleccione una asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.id_unidad_libro = "";
            me.unidad = "";
            me.nombre_unidad = "";
            me.txt_nombre_unidad = "";
            me.pag_inicio = "";
            me.pag_fin = "";
            me.titulo_modal = "Agregar Unidad";
            me.modalEditar = true;
        },
        editaContenido(item) {
            let me = this;
            // console.log(item)
            me.id_unidad_libro = item.id_unidad_libro
            me.unidad = item.unidad
            me.nombre_unidad = item.nombre_unidad
            me.txt_nombre_unidad = item.txt_nombre_unidad
            me.pag_inicio = item.pag_inicio
            me.pag_fin = item.pag_fin
            me.titulo_modal = "Editar";
            me.modalEditar = true;

        },
        guardarEdicion() {
            let me = this;
            if (
                me.libroSelect == '' ||
                me.unidad == '' ||
                me.nombre_unidad == '' ||
                me.txt_nombre_unidad == '' ||
                me.pag_inicio == '' ||
                me.pag_fin == ''
            ) {
                me.$vs.notify({
                    text: 'Complete todos los campos ',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
            me.$vs.loading()

            let formData = new FormData();
            formData.append('id_unidad_libro', me.id_unidad_libro);
            formData.append('id_libro', me.libroSelect.idlibro);
            formData.append('unidad', me.unidad);
            formData.append('nombre_unidad', me.nombre_unidad);
            formData.append('txt_nombre_unidad', me.txt_nombre_unidad);
            formData.append('pag_inicio', me.pag_inicio);
            formData.append('pag_fin', me.pag_fin);
            formData.append('estado', '1');

            this.$http.post(this.$server_url+'updateUnidades', formData)
                .then(res => {
                    // console.log(res.data)
                    me.modalEditar = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Datos actualizados ',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.cargaUnidades()
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()
                })
        },
        confirmaeliminar(item) {
            let me = this;
            // console.log(item)
            me.$vs.loading();
            me.id_unidad_libro = item.id_unidad_libro;
            this.$http.get(this.$server_url+'buscar_unidad_libro/' + me.id_unidad_libro)
                .then(res => {
                    if (res.data.length > 0) {
                        me.$vs.notify({
                            title: 'No se puede eliminar',
                            time: 7000,
                            text: 'Existe almenos un tema registrado con esta unidad. TEMA: ' + res.data[0].nombre_tema,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-check'
                        })
                    } else {
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: 'Confirmar',
                            text: 'Seguro desea eliminar esta unidad?',
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                            accept: me.eliminarContenido
                        })
                    }
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        eliminarContenido() {
            let me = this;
            me.$vs.loading();
            console.log(me.id_unidad_libro)
            this.$http.get(this.$server_url+'eliminar_unidad_libro/' + me.id_unidad_libro)
                .then(res => {
                    // console.log( res.data )
                    me.$vs.notify({
                        text: 'Unidad de libro eliminada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.cargaUnidades();
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        }
    }
}
</script>
