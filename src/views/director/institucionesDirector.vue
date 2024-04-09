<template>
<div class="vx-col md:w-full w-full mb-base">
    <div class="vx-row" v-if="institucion.length >0">
        <div class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base cursor-pointer" v-for="(item,$index) in institucion" :key="$index">
            <vx-card class="p-2 div-hover" @click="getDatos(item)">
                <div class="text-center divinst">
                    <span class="textinst text-warning font-bold" style="text-shadow: 1px 5px 8px #f2f2f2;">{{ item.nombreInstitucion }}</span>
                </div>
                <vs-avatar v-if="item.imgenInstitucion != '' && item.imgenInstitucion != null" class="mx-auto my-6 block" size="100px" :src="$data_url+'archivos/instituciones_logos/'+item.imgenInstitucion" />
                <vs-avatar v-else class="mx-auto my-6 block" size="100px" src="https://thumbs.dreamstime.com/b/escuela-edificio-de-dos-pisos-rojo-construcci%C3%B3n-dibujo-animado-estilo-plano-estructura-para-ni%C3%B1os-en-el-paisaje-urbano-215956734.jpg" />
            </vx-card>
        </div>
    </div>
    <div v-else>
        <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
            <p class="font-bold text-center">No tienes instituciones asignadas comunicate con soporte</p>
        </vs-alert>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    data() {
        return {
            usuario: [],
            users: [],
            docentes: [],
            data: [],
            institucion: [],
            usuario: [],
            inst_director: '',
            cantidad_inst: ''
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted() {
        let me = this;
        localStorage.removeItem('tipoUser');
        me.getInstitucionesDirector();
    },
    methods: {
        getInstitucionesDirector() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'verInstitucionDirector?idusuario='+me.usuario.idusuario)
            .then(res => {
                me.$vs.loading.close()
                me.institucion = res.data;
            })
            .catch(function (error) {
                console.log(error)
                me.$vs.loading.close()
            })
        },
        getDatos(item) {
            let me = this;
            // console.log(item)
            localStorage.institucion = JSON.stringify(item);
            localStorage.tipoUser = "docente";
            me.$router.push('/director/institucion/docentes');
        }
    },
}
</script>

<style>
.textinst {
    font-size: 13px;
}

.divinst {
    height: 60px;
}

.div-hover:hover {
    box-shadow: 0 15px 20px rgb(208, 205, 205);
    /* -webkit-transform: rotate(-3deg); */
}
</style>
