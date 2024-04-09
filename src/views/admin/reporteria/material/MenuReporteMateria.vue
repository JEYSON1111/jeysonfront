<template>
    <div>
        <vs-tabs align="fixed">
            <vs-tab label="Reporte Tareas">
                <div class="con-tab-ejemplo">
                    <ReporteTareasVue/>
                </div>
            </vs-tab>
            <vs-tab label="Historico actividades">
                <div class="con-tab-ejemplo">
                    <historicoActividadesVue/>
                </div>
            </vs-tab>
        </vs-tabs>
    </div>
</template>
<script>
import ReporteTareasVue from './ReporteTareas.vue';
import historicoActividadesVue from '../../../actividades/historicoActividades.vue';
export default{
    components:{
        historicoActividadesVue,
        ReporteTareasVue,
    },  
    data(){
        return{

        }
    }
}
</script>