<template>
  <div>
    <br>
    <div class="flex" style="flex-wrap:wrap;">
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Valor Comisión: </span>
        <span class="font-bold text-primary" style="opacity:0.6;">{{ totalValorComision | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Total Pagado: </span>
        <span class="text-success font-bold">{{ totalPagadoClientes | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Pendiente por Liquidar: </span>
        <span class="font-bold" v-if="totalPendienteLiquidar > 0">{{ totalPendienteLiquidar | filtrarDecimal }}</span>
        <span class="font-bold text-danger" v-else>{{ totalPendienteLiquidar | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Total Deudas Anteriores: </span>
        <span class="text-warning">{{ totalDeudaAnterior | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Total Deuda Próxima Temporada: </span>
        <span class="text-warning">{{ totalDeuda | filtrarDecimal }}</span>
      </div>
    </div>
    <br>
  </div>
</template>
<script>
export default {
  data() {
    return {
      totalValorComision:0,
      totalPagadoClientes:0,
      totalPendienteLiquidar:0,
      totalDeudaAnterior:0,
      totalDeuda:0,
      totalDevolucionEscuela:0,
    }
  },
  props:{
    arregloPagos:{
      type:Array,
      default:function(){
        return []
      }
    },
    sendPedido:{
      type:Array,
      default:function(){
        return []
      }
    },
  },
  mounted(){
    let me = this
    me.sumarPagos()
  },
  watch:{
    arregloPagos(){
      let me = this
      me.sumarPagos()
    }
  },
  methods:{
    sumarPagos(){
      let me = this
      me.totalPagadoClientes    = 0
      me.totalValorComision     = 0
      me.totalPendienteLiquidar = 0
      //DIFERENTE A DEUDA
      let datos = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id != 3 && p.tipo_pago_id != 5)
      if(datos.length > 0){
        let total = 0
        datos.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalPagadoClientes = total
      }
      //DEUDAS SE SUMAN APARTE PRIXIMAS
      let datos2 = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id == 3)
      if(datos2.length > 0){
        let total = 0
        datos2.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalDeuda = total
      }
      //DEUDAS SE SUMAN APARTE ANTERIORES
      let datos3 = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id == 6)
      if(datos3.length > 0){
        let total = 0
        datos3.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalDeudaAnterior = total
      }
      //DEVOLUCION DE LA ESCUELA
      let datos4 = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id == 5)
      if(datos4.length > 0){
        let total = 0
        datos4.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalDevolucionEscuela = total
      }
      //PROCEOS
      const { contrato_generado } = me.sendPedido
      if( contrato_generado == "" || contrato_generado == null ){
        me.totalPendienteLiquidar = ( me.totalValorComision - me.totalPagadoClientes ) + me.totalDevolucionEscuela
        //actualizar values
        me.updatePedido(3,'totalValorComision',me.totalValorComision,'totalPagado',me.totalPagadoClientes,'totalPendienteLiquidar',me.totalPendienteLiquidar)
      }
      else { me.getVerificaciones() }
    },
    getVerificaciones(){
      let me = this;
      me.totalValorComision     = 0

      this.$http.get(this.$server_url + "n_verificacion?getVerificacionXcontrato=yes&contrato="+me.sendPedido.contrato_generado)
      .then((res)=>{
        let datos = res.data.filter(p => p.estado == 0)
        if(datos.length > 0){
          me.totalValorComision     = 0
          datos.forEach(element => {
            me.totalValorComision += parseFloat(element.valor_comision)
          });
          me.totalPendienteLiquidar = (me.totalValorComision - me.totalPagadoClientes) + me.totalDevolucionEscuela
          //actualizar values
          me.updatePedido(3,'totalValorComision',me.totalValorComision,'totalPagado',me.totalPagadoClientes,'totalPendienteLiquidar',me.totalPendienteLiquidar)
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    updatePedido(numero,campo1,valor1,campo2,valor2,campo3,valor3){
      let me = this
      let formData = new FormData();
      if(numero == 1) { formData.append('unCampo', 'yes'); }
      if(numero == 2) { formData.append('actualizarDosCampo', 'yes'); }
      if(numero == 3) { formData.append('actualizarTresCampo', 'yes'); }
      formData.append('id_pedido',                  me.sendPedido.id_pedido);
      formData.append('campo',                      campo1)
      formData.append('campo2',                     campo2)
      formData.append('campo3',                     campo3)
      formData.append('valor',                      valor1.toFixed(2))
      formData.append('valor2',                     valor2.toFixed(2))
      formData.append('valor3',                     valor3.toFixed(2))
      this.$http.post(this.$server_url+'updateThePedido', formData)
      .then(res => {
      })
      .catch((e)=>{
      })
    },
  },
}
</script>
<style scoped>
  span{
    font-size: 19px;
  }
</style>
