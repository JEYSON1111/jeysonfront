<template>
  <!--/p_pedidos-->
  <vx-card>
    <!--MENU-->
    <div v-if="groupFacturador">
        <MenuReutilizableVue
        :menus="['Pedidos', 'Guías', 'Obsequios','Facturadores','Solicitud Verificaciones']"
        activeBtnBackground="#000"
        @filtro-cambiado="cambiarFiltro"/>
        <br>
    </div>
    <div v-if="userAsesor">
        <MenuReutilizableVue
        :menus="['Pedidos', 'Guías', 'Obsequios']"
        activeBtnBackground="#000"
        @filtro-cambiado="cambiarFiltro"/>
        <br>
    </div>
    <!--COMPONENTES-->
    <div v-if="menu == 0">
        <ScreenPedidosVue :arregloPeriodos="arregloPeriodos"/>
    </div>
    <div v-if="menu == 1">
        <ScreenGuiasVue :arregloPeriodos="arregloPeriodos"/>
    </div>
    <div v-if="menu == 2">
        <h5 class="font-semibold">Obsequios</h5>
        <ScreenObsequiosFacturadorVue :arregloPeriodos="arregloPeriodos"/>
    </div>
    <div v-if="menu == 3 && (userRoot || usuario.id_group == 23)">
        <ScreenFacturadorVue/>
    </div>
    <div v-if="menu == 4 && (userRoot || usuario.id_group == 23)">
        <HistoricoSolicitudVerificacionesVue/>
    </div>
  </vx-card>
</template>
<script>
  import {
    mapState
} from "vuex";
import MenuReutilizableVue from '../configuracion/Reutilizable/MenuReutilizable.vue';
const ScreenPedidosVue                      = () => import('./pedidos/ScreenPedidos.vue');
const ScreenGuiasVue                        = () => import('./guias/ScreenGuias')
const ScreenObsequiosFacturadorVue          = () => import('../pedidos/obsequios/ScreenObsequiosFacturador.vue')
const ScreenFacturadorVue                   = () => import('./facturadores/ScreenFacturador.vue')
const HistoricoSolicitudVerificacionesVue   = () => import('../temporadas/HistoricoSolicitudVerificaciones.vue')
export default{
    components:{
        MenuReutilizableVue,
        ScreenPedidosVue,
        ScreenGuiasVue,
        ScreenObsequiosFacturadorVue,
        ScreenFacturadorVue,
        HistoricoSolicitudVerificacionesVue,
    },
    data(){
        return{
            menu:100,
            usuario:[],
            arregloPeriodos:[],
        }
    },
    computed:{
        ...mapState(["auth",'userRoot','susuario','ObjectPedido','userAsesor','groupFacturador']),
      },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me  = this
        me.getPeriodos()
        if(me.groupFacturador || me.userAsesor)     { me.menu = 0; }
        if(me.usuario.id_group == 1 && !me.userRoot)   { me.menu = 2 ; }
    },
    methods:{
        cambiarFiltro(filtro) {
            let me = this;
            me.menu = filtro
        },
        getPeriodos(){
            let me = this
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
            let datos = res.data
            if(datos.length == 0){
                localStorage.removeItem('pid')
                localStorage.removeItem('pnombre')
                me.arregloPeriodos = []
                return
            }
            if( me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1 ){
                me.arregloPeriodos = datos.filter(p => p.pedido_facturacion == 1)
            }
            if( me.usuario.id_group == 17 || me.usuario.id_group == 27 ){
                me.arregloPeriodos = datos.filter(p => p.pedido_bodega == 1)
            }
            if( me.usuario.id_group == 11 ){
                me.arregloPeriodos = datos.filter(p => p.pedido_asesor == 1)
            }
            if(me.arregloPeriodos.length == 0){
                localStorage.removeItem('pid')
                localStorage.removeItem('pnombre')
            }
            })
            .catch(function (error) {
            me.$vs.loading.close();
            })
        },
    }
}
</script>
