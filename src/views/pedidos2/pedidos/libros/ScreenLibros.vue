<template>
    <div>
        <div v-if="sendPedido.id_pedido > 0">
            <form_librosVue
              @rechargePedido="$emit('rechargePedido',true)"
              :tmpPedidos="sendPedido"
              :selectifanticipo="Boolean(sendPedido.ifanticipo)"
              :anticipoAprobado="(sendPedido.anticipo_aprobado == sendPedido.deuda) ? sendPedido.anticipo_aprobado : sendPedido.anticipo_aprobado - sendPedido.deuda"
                />
            <br><br><br>
        </div>
        <!--GENERAR CONTRATO-->
        <div class="flex justify-center">
            <vs-button type="relief" v-if="groupFacturador && (sendPedido.contrato_generado == 'null' || sendPedido.contrato_generado == null)" @click="generarContrato()">Generar Contrato</vs-button>
        </div>
        <br><br><br><br><br><br><br><br><br><br>
    </div>
</template>
<script>
  import {
    mapState
} from "vuex";
const form_librosVue = () => import('../../../pedidos/form_libros.vue')
export default{
    components:{
        form_librosVue,
    },
    data(){
        return{
            sendPedido:'',
            usuario:[],
        }
    },
    watch:{
        ObjectPedido(results){
            this.sendPedido = results
        }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador']),
    },
    mounted(){
        let me = this;
        me.sendPedido = me.ObjectPedido
        me.usuario    = me.susuario
    },
    methods:{
        generarContrato(){
        this.$vs.dialog({
          type: 'confirm',
          color: 'warning',
          title: `Confirmar`,
          acceptText:'Si, deseo generar el contrato',
          cancelText:'Cancelar',
          text: '¿Está seguro de guardar el contrato para este pedido?',
          accept: this.confirmGenerarContrato
        })
      },
      async confirmGenerarContrato(){
        let me = this
        const { contrato_generado } = me.sendPedido
        if(contrato_generado == null || contrato_generado == "" || contrato_generado == "null") {}
        else{
            me.$vs.notify({ time: 8000, text: 'Este pedido ya tiene un contrato generado: ' + me.sendPedido.contrato_generado , color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
        }
        me.$vs.loading()
        await me.$http.get(me.$server_url+'generar_contrato_pedido/'+me.sendPedido.id_pedido+'/'+me.usuario.idusuario)
        .then(res => {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({ time: 8000, text: res.data.message , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          if( res.data.error ){
            me.$vs.notify({ time: 8000, text: res.data.error , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          me.$vs.notify({ time: 8000, text: 'Se creo correctamente el contrato: ' + res.data , color: 'success', iconPack: 'feather', icon: 'icon-alert-triangle' })

          me.$emit('rechargePedido',true)
        })
        .catch(err => {
          me.$vs.notify({ time: 4000, text: 'Error al generar el contrato.' , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
          console.log(err);
          me.$vs.loading.close();
        })
      },
    }
}
</script>
