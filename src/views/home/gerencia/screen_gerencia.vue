<template>
<div>
    <div>
        <vs-tabs>
            <vs-tab label="Aprobaciones pendientes">
                <Lista_aprobar />
            </vs-tab>
            <vs-tab label="Valores aprobados">
                <PedidosPeriodos />
            </vs-tab>
            <vs-tab label="detalles pedidos">
                <Listado_de_Contratos />
            </vs-tab>
            <vs-tab label="Reportes">
                <ScreenReporteVue />
            </vs-tab>
            <!-- <vs-tab label="Obsequios">
                <ScreenObsequiosGerenciaVue />
            </vs-tab> -->
        </vs-tabs>
    </div>
</div>
</template>

<script>
import Lista_aprobar from './lista_aprobar.vue';
import PedidosPeriodos from './pedidosPeriodos.vue';
import Listado_de_Contratos from '../../pedidos/gerencia/listado_de_Contratos.vue'
import ScreenReporteVue from '../../pedidos/gerencia/reportes/ScreenReporte'
import ScreenObsequiosGerenciaVue from '../../pedidos/obsequios/gerencia/ScreenObsequiosGerencia'
export default {
    data() {
        return {};
    },
    mounted() {},
    methods: {},
    components: {
        Lista_aprobar,
        PedidosPeriodos,
        Listado_de_Contratos,
        ScreenReporteVue,
        ScreenObsequiosGerenciaVue,
    }
}
</script>
