<template>
<div>
    <vs-tabs alignment="fixed" v-if="menu > 0">
      i
        <vs-tab label="Generar códigos" v-if="userRoot">
            <vs-tabs class="mt-4">
                <vs-tab label="Elegir libro" icon-pack="feather" icon="icon-book">
                    <vs-divider></vs-divider>
                    <GenerarCodigosVue />
                </vs-tab>
                <vs-tab label="Generar códigos" icon-pack="feather" icon="icon-code">
                    <vs-divider></vs-divider>
                    <GenerateCodigosVue />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Búsqueda">
            <vs-tabs class="mt-4">
                <vs-tab label="Buscar" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <seccionBuscarVue />
                </vs-tab>
                <vs-tab label="Filtrar códigos" v-if="userRoot" icon-pack="feather" icon="icon-code">
                    <vs-divider></vs-divider>
                    <FacturadoresCodigosVue />
                </vs-tab>
                <vs-tab label="Gestión códigos" v-if="userRoot" icon-pack="feather" icon="icon-box">
                    <vs-divider></vs-divider>
                    <gestionCodigosVue />
                </vs-tab>
                <vs-tab label="Listado códigos bloqueados" v-if="userRoot" icon-pack="feather" icon="icon-box">
                    <vs-divider></vs-divider>
                    <bloqueoCodigosVue />
                </vs-tab>
                <vs-tab label="Codigos en Histórico" v-if="userRoot" icon="code">
                    <vs-divider></vs-divider>
                    <BuscarEnHistorico />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Importaciones">
            <MenuImportacionesVue class="mt-3" />
        </vs-tab>
        <vs-tab label="Paquetes" v-if="userRoot">
            <MenuPaquetesVue />
        </vs-tab>
        <vs-tab label="Grafitex" v-if="userRoot">
            <MenuGrafitexVue />
        </vs-tab>
        <vs-tab label="Temporadas-contratos" v-if="userRoot">
            <vs-tabs class="mt-4">
                <vs-tab label="Temporadas" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <temporadasVue />
                </vs-tab>
                <vs-tab label="Historial liquidación códigos" icon-pack="feather" icon="icon-code">
                    <vs-divider></vs-divider>
                    <vs-tabs alignment="center">
                        <vs-tab label="Verificación Nueva" icon="account_balance">
                            <div>
                                <historicoCodigosNuevoVue />
                            </div>
                        </vs-tab>
                        <vs-tab label="Pedidos" icon="bookmark">
                            <div>
                                <pedidosBusquedaVue />
                            </div>
                        </vs-tab>
                    </vs-tabs>
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Verificaciones" v-if="userRoot">
            <vs-tabs class="mt-4">
                <vs-tab label="Buscar Verificaciones" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <BusquedaVerificacionVue />
                </vs-tab>
                <vs-tab label="Historico Verificaciones" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <BusquedaVerificacionHistoricoVue />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
    </vs-tabs>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from 'vue'
const GenerarCodigosVue                 = () => import('./components/GenerarCodigos/GenerarCodigos.vue')
const GenerateCodigosVue                = () => import('./components/GenerateCodigos.vue')
const gestionCodigosVue                 = () => import('./components/gestionCodigos.vue')
const MenuImportacionesVue              = () => import('./components/MenuImportaciones.vue')
const seccionBuscarVue                  = () => import('./components/seccionBuscar.vue')
const FacturadoresCodigosVue            = () => import('./FacturadoresCodigos.vue')
const bloqueoCodigosVue                 = () => import('./components/codigosBloqueados.vue')
const temporadasVue                     = () => import('../temporadas/temporada')
const historicoCodigosNuevoVue          = () => import('../temporadas/historicoCodigosNuevo.vue')
const pedidosBusquedaVue                = () => import('../temporadas/pedidosBusqueda.vue')
const BusquedaVerificacionVue           = () => import('../temporadas/BuscarVerificacionyDetalle.vue')
const BusquedaVerificacionHistoricoVue  = () => import('../temporadas/BuscarVerificacionyDetalle_Historico.vue')
const MenuPaquetesVue                   = () => import('./paquetes/MenuPaquetes.vue')
const MenuGrafitexVue                   = () => import('./grafitex/MenuGrafitex.vue')
const BuscarEnHistorico                 = ()=>import('./buscar_en_historico.vue')
import Codigosmix from "@/mixins/Codigosmix";
export default {
    data() {
        return {
            usuario: [],
            menu: 0,
        }
    },
    mixins: [Codigosmix],
    components: {
      GenerarCodigosVue,
        GenerateCodigosVue,
        gestionCodigosVue,
        MenuImportacionesVue,
        seccionBuscarVue,
        FacturadoresCodigosVue,
        bloqueoCodigosVue,
        temporadasVue,
        historicoCodigosNuevoVue,
        pedidosBusquedaVue,
        BusquedaVerificacionVue,
        BusquedaVerificacionHistoricoVue,
        MenuPaquetesVue,
        MenuGrafitexVue,
        BuscarEnHistorico,
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor']),
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.limpiarCache()
    },
    mounted() {
        let me = this;
        me.menu = 1
    },
    methods: {}
}
</script>
