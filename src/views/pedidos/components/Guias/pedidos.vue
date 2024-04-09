<template>
  <div>
    <vx-card title="Detalle Pedido - Guia" title-color="success">
      <formpedidos ref="formpedidos" :sendPedido="sendPedido" v-if="id_pedido === 0 || id_pedido > 0"/>
      <vs-divider>Valores de las guias</vs-divider>
      <formlibros ref="formlibros" v-if="id_pedido > 0" :id_pedido="id_pedido"/>
    </vx-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
import vSelect from 'vue-select';
import formpedidos from './form_pedido.vue'
import formlibros from './form_libros.vue'
import axios from 'axios'
export default {
    components:{
      'v-select': vSelect,
      formpedidos,
      formlibros,
    },
    data: () => ({
      usuario: [],
      id_pedido: 0,
      sendPedido:'',
    }),
    computed: {
      ...mapState(["auth", "userRoot", "susuario", "groupFacturador", "groupBodega","userAsesor","ObjectGuia"]),
    },
    watch:{
      ObjectGuia(results){
        this.id_pedido = results.id_pedido
      },
    },
    mounted() {
      let me = this
      this.usuario   = JSON.parse(localStorage.getItem('usuario'));
      me.sendPedido  = me.ObjectGuia
      this.id_pedido = me.sendPedido.id_pedido
    },
    methods: {
    },
}
</script>
