
<template>
<div class="vx-row">
    <div class="vx-col w-full">
        <vx-card he title-color="primary">
            <vue-dropzone class="vx-card" ref="dropzone" id="drop1" @vdropzone-complete="guardar" :options="dropzoneOptions"></vue-dropzone>
        </vx-card>
        <!-- <vs-table max-items="10" search pagination :data="listaContenido">
            <template slot="thead">
                <vs-th>Archivo</vs-th>
                <vs-th>Fecha de registro</vs-th>
                <vs-th>Eliminar</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombre">
                        <a v-bind:href="'./'+data[indextr].url" target="_blank">
                            <p>
                                {{data[indextr].nombre}}
                            </p>
                        </a>
                    </vs-td>
                    <vs-td :data="data[indextr].updated_at">
                        {{data[indextr].updated_at}}
                    </vs-td>
                    <vs-td :data="tr">
                        <div class="flex">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="quitarContenido(tr.idcontenido)"></vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table> -->
        <div class="vx-row">
            <div class="vx-col w-full mt-4 sm:w-1/4 md:w-1/4 lg:w-2/4 xl:w-4/4  mt-3" v-for="(item,$index) in listaContenido" :key="$index">
                <vx-card class="text-center">
                    <vs-alert color="#fff" active="true" class="responsive card-img-top">
                        <a v-bind:href="$data_url+'tareas/'+item.url" :download="item.nombre" target="_blank">
                            <p>
                                {{item.nombre}}
                            </p>
                        </a>
                    </vs-alert>
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-file" />
                    <p class="mt-2">{{item.updated_at}}</p>
                    <vs-button type="line" v-if="item.curso_idcurso != null" @click="quitarContenido(item.idcontenido)" line-origin="right" color="danger">Eliminar</vs-button>
                </vx-card>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview
    },
    data() {
        return {
            asignaturas: [],
            listaContenido: [],
            idasignatura: '',
            file: [],
            dropzoneOptions: {
                url: './',
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> Click o arrastra un archivo aquí.",
                chunking: true,
                thumbnailWidth: 150,
                maxFilesize: 200.5,
                addRemoveLinks: true,
                headers: {
                    "My-Awesome-Header": "header value"
                }
            },
        }
    },
    mounted() {
        this.getAsignaturas();
        this.getContenido();
    },
    methods: {
        async getAsignaturas() {
            let me = this;
            // this.$http.get(this.$server_url+"asignatura/"+me.usuario.idusuario)
            this.$http.get(this.$server_url+"asignatura/5763")
                .then(function (response) {
                    me.asignaturas = response.data
                })
                .catch(function (error) {})
        },
        async guardar(file) {
            let me = this
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('idcurso', localStorage.idcurso);
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            axios.post(this.$data_url+'api/addContenido', formData,config)
                .then(function (response) {
                    me.getContenido();
                    me.file = '';
                    me.$refs.dropzone.removeAllFiles();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        async quitarContenido(id) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http
                .get(this.$server_url+"eliminarContenido?id=" + id)
                .then(function (response) {
                    me.getContenido();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        me.errors = error.response.data.errors;
                    }
                });
        },
        async getContenido() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"getContenido?idcurso="+localStorage.idcurso+"&idasignatura=" + me.idasignatura;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.listaContenido = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {});
        },
        async getContenidoTodo() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"getContenidoTodo?idcurso="+localStorage.idcurso+"&idusuario=5763&todo=1";
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.listaContenido = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
}
</script>
