<template>
    <div>
        <div v-if="ifvisual == 0">
            <ListadoPrincipalPedidosVue @showPedido="showPedido" :arregloPeriodos="arregloPeriodos"/>
        </div>
        <div v-if="ifvisual != 0">
            <vs-button class="mb-2 p-2" @click="ifvisual = 0;" style="display: inline-block;" icon-pack="feather" icon="icon-chevron-left" color="primary">Volver a pedidos</vs-button>
        </div>
        <!--SUBMENU DE PEDIDOS-->
        <div v-if="ifvisual == 1">
            <br><br>
            <ScreenDetallePedidoVue/>
        </div>
        <!--Alcances-->
        <div v-if="ifvisual == 2">
            <listadoAlcanceVue/>
        </div>
    </div>
</template>
<script>
const ListadoPrincipalPedidosVue = () => import('./ListadoPrincipalPedidos.vue')
const ScreenDetallePedidoVue     = () => import('./ScreenDetallePedido.vue')
const listadoAlcanceVue          = () => import('../../pedidos/alcance/listadoAlcance.vue')
export default{
    components:{
        ListadoPrincipalPedidosVue,
        ScreenDetallePedidoVue,
        listadoAlcanceVue,
    },
    data(){
        return{
            ifvisual:0
        }
    },
    props:{
        arregloPeriodos:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    methods:{
        showPedido(e){
          let me = this
          me.ifvisual = e
        }
    }
}
</script>