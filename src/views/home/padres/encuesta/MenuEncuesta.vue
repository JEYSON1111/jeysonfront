<template>
    <vx-card class="mt-5">
        <small  v-if="usuario.id_group == 1" align="left">Ruta: /a_encuestas</small>
        <vs-alert color="warning" class="mt-2">
            <p class="font-bold text-center">Encuestas de satisfacción de los productos de Prolipa, dirigidos a una escuela en especifico</p>
        </vs-alert>
        <vs-tabs alignment="fixed" class="mt-4">
            <vs-tab label="Gestión de encuestas">
                <div>
                    <GenerarEncuestaVue/>
                </div>
            </vs-tab>
            <vs-tab label="Asignar encuesta">
                <div>
                   <EncuestaAsignarVue/>
                </div>
            </vs-tab>
        </vs-tabs>
    </vx-card>
</template>
<script>
import GenerarEncuestaVue from './GenerarEncuesta.vue';
import EncuestaAsignarVue from './EncuestaAsignar.vue';
export default{
    components:{
        GenerarEncuestaVue,
        EncuestaAsignarVue,
    },
    data(){
        return{
            usuario:[],
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
}
</script>