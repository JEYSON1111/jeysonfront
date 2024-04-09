<template>
    <div>
        <vs-tabs alignment="fixed">
        <vs-tab label="Verificaciones"  @click="menuTab=0">
            <div>
              <historicoCodigosNuevoVue
              :sendPedido="sendPedido"
              class="mt-2"
              :contratoPedido="sendPedido.contrato_generado"
              :desdePedido="1"
              />
            </div>
        </vs-tab>
        <vs-tab label="Seguimiento Verificaciones"  @click="menuTab=1">
            <div>
              <VerificacionTrazabilidadVue :contratoPedido="sendPedido.contrato_generado"/>
            </div>
        </vs-tab>

      </vs-tabs>
    </div>
</template>
<script>
  import {
    mapState
} from "vuex";
const historicoCodigosNuevoVue      = () => import('@/views/temporadas/historicoCodigosNuevo.vue')
const VerificacionTrazabilidadVue   = () => import('@/views/temporadas/VerificacionTrazabilidad.vue')
export default{
    components:{
        historicoCodigosNuevoVue,
        VerificacionTrazabilidadVue,
    },
    data(){
        return{
            sendPedido:'',
            menuTab:0,
        }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido']),
    },
    mounted(){
        let  me = this;
        me.sendPedido = me.ObjectPedido
    },
}
</script>
