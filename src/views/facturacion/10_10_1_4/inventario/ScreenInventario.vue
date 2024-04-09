<template>
  <div>
    <div class="mt-5">
      <div class="flex">
        <vs-button line-position="top" type="line"          @click="menu = 0;">Configuracion</vs-button>
          <!-- <vs-button line-position="top" color="danger"       @click="menu = 2;" v-if="sendPedido.id_pedido > 0" type="line">Beneficiario</vs-button>
          <vs-button line-position="top" line-origin="left"   @click="menu = 1;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="success" type="line">Libros</vs-button>
          <vs-button line-position="top" line-origin="left"   @click="menu = 3;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="warning" type="line">Convenios</vs-button>
          <vs-button line-position="top" line-origin="right"  @click="menu = 4;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="dark" type="line">Anticipos</vs-button>
          <vs-button line-position="top" type="line"          @click="menu = 5;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0">Verificaciones</vs-button>
          <vs-button line-position="top" line-origin="left"   @click="menu = 6;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="success" type="line">Seguimiento pedido</vs-button> -->
      </div>
      <!--componentes-->
      <div>
        <div v-if="menu == 0">
          <ScreenConfiguracionVue/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const ScreenConfiguracionVue = () => import('./configuracion/ScreenConfiguracion.vue')
export default {
  components:{
    ScreenConfiguracionVue,
  },
  data() {
    return{
      menu:0,
    }
  },
}
</script>
