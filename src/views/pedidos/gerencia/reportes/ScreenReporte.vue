<template>
    <div>
        <div class="flex mt-5">
            <vs-button color="primary" @click="menu = 1;" type="border">Reporte vendedores</vs-button>
            <vs-button color="primary" @click="menu = 2;" class="ml-2" type="border">Reporte instituciones venta</vs-button>
            <vs-button color="primary" @click="menu = 3;" class="ml-2" type="border">Reporte Trazabilidad</vs-button>
        </div>
        <div>
            <div v-if="menu == 1"><ReporteVentaVendedorVue class="mt-5"/></div>
            <div v-if="menu == 2"><ReporteInstitucionVentaVue class="mt-5"/></div>
            <div v-if="menu == 3"><ReporteTrasabilidadVue class="mt-5"/></div>
        </div>
    </div>
</template>
<script>
import ReporteVentaVendedorVue from './ReporteVentaVendedor2'
import ReporteInstitucionVentaVue from './ReporteInstitucionVenta'
import ReporteTrasabilidadVue from './ReporteTrasabilidad'
export default{
    data(){
        return{
            menu:1,
        }
    },
    components:{
        ReporteVentaVendedorVue,
        ReporteInstitucionVentaVue,
        ReporteTrasabilidadVue,
    }
}
</script>