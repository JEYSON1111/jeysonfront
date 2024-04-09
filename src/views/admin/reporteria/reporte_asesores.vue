<template>
<div>
    <vs-tabs>
      <vs-tab label="Reportes asesores" @click="menu = 0">
        <div class="con-tab-ejemplo">
          <MenuReporteriaAsesorVue/>
        </div>
      </vs-tab>
      <vs-tab label="Redactores">
        <div class="con-tab-ejemplo" @click="menu =1">
          <reportesRedactores/>
        </div>
      </vs-tab>
      <vs-tab label="Reporte material" @click="menu = 2">
        <MenuReporteMateriaVue/>
      </vs-tab>
      <vs-tab label="Reporte Vendedores" @click="menu = 3">
        <ReporteVentaVendedor2Vue v-if="menu == 3"/>
      </vs-tab>
    </vs-tabs>
</div>
</template>
<script>
import MenuReporteriaAsesorVue from './asesor/MenuReporteriaAsesor.vue';
import reportesRedactores from '../../asesor/admin/reportesRedactores.vue';
import MenuReporteMateriaVue from './material/MenuReporteMateria.vue';
const ReporteVentaVendedor2Vue = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaVendedor2.vue')
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import VueApexCharts from 'vue-apexcharts';
import {
    mapState
} from "vuex";
export default{
    components:{
      flatPickr,
      'v-select': vSelect,
      VueApexCharts,
      reportesRedactores,
      MenuReporteriaAsesorVue,
      MenuReporteMateriaVue,
      ReporteVentaVendedor2Vue,
    },
    mounted(){
      let me = this;
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    data(){
        return{
          menu:0,
        }
    },
    methods:{
    }
}
</script>
