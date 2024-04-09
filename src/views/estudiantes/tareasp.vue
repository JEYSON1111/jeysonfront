<template>
<div>
    <vs-table max-items="10" search pagination :data="listaTareas">
        <template slot="header">
        <h3>
          Tareas Pendientes
        </h3>
        </template>
        <template slot="thead">
            <vs-th sort-key="descripcion">Tarea</vs-th>
            <vs-th sort-key="fecha_inicio">Fecha</vs-th>
            <!-- <vs-th class="text-center"></vs-th> -->
            <vs-th class="text-center"></vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].nombre">
                    <a :href="$data_url+'tareas/'+data[indextr].url" target="_blank">
                        <div v-if="data[indextr].nombre != null">
                        <span v-if="data[indextr].nombre.length<35">{{ data[indextr].nombre}}</span>
                        <span v-else>{{ data[indextr].nombre.substring(35,0)}}....</span>
                        </div>
                    </a>
                    <br>
                    {{data[indextr].descripcion}}
                </vs-td>
                <vs-td :data="data[indextr].fecha_inicio">
                    {{data[indextr].fecha_inicio}}
                    <br>
                    {{data[indextr].fecha_final}}
                </vs-td>               
                <!-- <vs-td :data="tr.idtarea" class="text-center">
                    <div class="flex">
                        <vs-button color="primary" type="relief" @click="foro(tr)">Foro</vs-button>
                    </div>
                </vs-td> -->
                <vs-td :data="tr.idtarea" class="text-center">
                    <div class="flex">
                        <vs-button color="success" type="relief" @click="realizar(tr)">Enviar Tarea</vs-button>
                    </div>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Datepicker from 'vuejs-datepicker';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        Datepicker,
        flatPickr
    },
    data() {
        return {
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            datei: null,
            datef: null,
            activePrompt: false,
            activePrompt2: false,
            listaTareas: [],
            listaContenido: [],
            usuario: [],
            tarea: {},
            idcurso: ''
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.idcurso = localStorage.getItem('idcurso')
    },
    mounted() {
        this.getTareas();
    },
    methods: {
        getTareas(id) {
            let me = this;
            console.log('pendientes')
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"tareaEstudiantePendiente?idcurso=" + me.idcurso + "&idusuario=" + me.usuario.idusuario;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    //console.log(respuesta);
                    me.listaTareas = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
        realizar(item){
            console.log(item)
            localStorage.idtarea = item.idtarea;
            localStorage.nombre = item.nombre;
            localStorage.url = item.url;
            localStorage.descripcion = item.descripcion;
            localStorage.fecha_inicio = item.fecha_inicio;
            localStorage.fecha_final = item.fecha_final;
            this.$router.push('/estudiante/tarea');
        },
        foro(item){
            localStorage.idtarea = item.idtarea;
            localStorage.nombre = item.nombre;
            localStorage.url = item.url;
            localStorage.descripcion = item.descripcion;
            localStorage.fecha_inicio = item.fecha_inicio;
            localStorage.fecha_final = item.fecha_final;
            this.$router.push('/estudiante/foro');
        }
    },
}
</script>