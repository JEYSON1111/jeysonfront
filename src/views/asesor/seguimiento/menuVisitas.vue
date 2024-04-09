<template>
    <div>
        <div v-if="tipoMenu == 'planificacion'">
        <agendaAsesorVue/>
        </div>
        <div v-if="tipoMenu == 'capacitaciones'">
            <capacitacionesAgendaVue/>
        </div>
    </div>

</template>

<script>
import agendaAsesorVue from '../componentes/agenda_asesor.vue'
import capacitacionesAgendaVue from '../componentes/agenda_asesor_capacitaciones.vue'
export default {
    components:{
        agendaAsesorVue,
        capacitacionesAgendaVue,
    },
      props:{
        tipo:{
            type:String,
            default:'planificacion'
        },

    },
    created(){
        let me = this;

    },
    mounted(){
        let me = this;
        me.tipoMenu = localStorage.getItem("tipo")
        if(me.tipoMenu == null){
            me.tipoMenu = "planificacion"
        }


    },
    data() {
        return{
            tipoMenu:''
        }
    },
}
</script>
