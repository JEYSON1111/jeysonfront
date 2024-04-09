<template>
  <div>
    <div>
      <div v-if="calcularPagoLiquidacion">
        <exportLiquidacionVue
        :VerificacionSelect="VerificacionSelect"
        :sumaTotalVALOR="sumaTotalVALOR"
        :sumaTotalValorRegalados="totalRegalados"
        :DetalleVerificacion="DetalleVerificacion"
        :totalCobroVenta="totalCobroVenta"
        :sendPedido="sendPedido"
        :cantidadVerificaciones="cantidadVerificaciones"
        :datosInstitucion="datosInstitucion"
        :desdeConfiguracion="2"
        @changeHandleUpdatePayments="changeHandleUpdatePayments"
        />
      </div>
    </div>
  </div>
</template>
<script>
import exportLiquidacionVue from '../../../../exportLiquidacion.vue'
export default{
  components:{
    exportLiquidacionVue,
  },
  data() {
    return{
      sumaTotalVALOR:0,
      DetalleVerificacion:[],
      //REGALADOS
      totalRegalados:0,
      totalCobroVenta:0,
      arregloRegalados:[],
      //VENTA REAL
      arregloValoresVentaReal:[],
      sumaVentaReal:0,
      calcularPagoLiquidacion:false,
    }
  },
  props:{
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    cantidadVerificaciones:{
      type:Number,
      default:0,
    },
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  mounted(){
    let me = this;
    me.limpiar()
    me.getDetallesVerificacion()
    me.getRegalados()
  },
  methods:{
    changeHandleUpdatePayments(e){
      let me = this
      me.changeHandleUpdatePayments       = false
      me.limpiar()
      me.$emit('changeHandleUpdatePayments',true)
    },
    getDetallesVerificacion(){
      let me                                            = this;
      me.sumaTotalVALOR                                 = 0
      me.DetalleVerificacion                            = []
      const { id_institucion ,id_periodo }              = me.sendPedido
      const { id, num_verificacion, contrato }          = me.VerificacionSelect
      this.$http.get(this.$server_url+'n_verificacion?contrato='+contrato+'&detalles=yes&IdVerificacion='+id+'&verificacion_id='+num_verificacion+'&institucion_id='+id_institucion+'&periodo_id='+id_periodo)
      .then(function (res) {
        me.DetalleVerificacion = res.data
        me.sumarTotalVenta()
      })
      .catch(function (error) {
        console.log(error + ' error');
      })
    },
    sumarTotalVenta(){
      let me = this;
      if(me.DetalleVerificacion.length >0){
        let datos = me.DetalleVerificacion.filter(p => p.valor)
        let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
        me.sumaTotalVALOR = total
      }
    },
    //REGALADOS
    getRegalados(){
      let me = this
      me.totalRegalados   = 0
      me.totalCobroVenta  = 0
      me.arregloRegalados = []
      const { id_institucion ,id_periodo, descuento }                      = me.sendPedido
      const { id, num_verificacion,tipoPago,permiso_cobro_venta_directa }  = me.VerificacionSelect
      this.$http.get(this.$server_url+'getRegalados/'+id_institucion+'/'+id_periodo+'/'+num_verificacion+'/'+id)
        .then(function (res) {
          me.arregloRegalados = res.data
          if(me.arregloRegalados.length > 0){
            let datos           = me.arregloRegalados.filter(p => p.valor)
            let total           = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
            me.totalRegalados   = total
            if(me.totalRegalados > 0){
              //COBRO VENTA DIRECTA=>0 = NADA; 1 = 100%; 2 =porcentaje de la escuela;
              //tipoPago => 0 =  NADA; 1 = Cancelar Total; 2 = Descontar; 3 = Regalado = 4 personalizado
              if(tipoPago == 1 || tipoPago == 3) { me.totalCobroVenta = 0 }
              if(tipoPago == 2 || me.setPersonalizado == 1) {
                //si el cobro de venta directa esta activado
                if(permiso_cobro_venta_directa == 1){
                  me.totalCobroVenta  = ( me.totalRegalados - ( me.totalRegalados * descuento ) / 100)
                }else{
                  me.totalCobroVenta = 0
                }
              }
            }
          }
          me.getVentaRealXVerificacion()
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    getVentaRealXVerificacion(){
      let me = this;
      me.sumaVentaReal =0
      me.arregloValoresVentaReal = []
      const { id_institucion ,id_periodo }            = me.sendPedido
      const { id, num_verificacion, contrato }        = me.VerificacionSelect
      this.$http.get(this.$server_url+'n_verificacion?contrato='+contrato+'&getVentaRealXVerificacion=yes&IdVerificacion='+id+'&verificacion_id='+num_verificacion+'&institucion_id='+id_institucion+'&periodo_id='+id_periodo)
      .then(function (res) {
        me.arregloValoresVentaReal = res.data
        me.sumarTotalVentaReal()
      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
      })
    },
    sumarTotalVentaReal(){
      let me = this;
      if(me.arregloValoresVentaReal.length > 0){
        let datos = me.arregloValoresVentaReal.filter(p => p.valor)
        let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
        me.sumaVentaReal = total
      }
      me.updateValorLiquidacion()
    },
    updateValorLiquidacion(){
      let me = this;
      let formData = new FormData();
      formData.append('verificacion_id',    me.VerificacionSelect.id);
      formData.append('venta_real',         me.sumaVentaReal + me.totalRegalados);
      formData.append('venta_real_regalados',me.totalRegalados)
      this.$http.post(this.$server_url+'updateVentaReal', formData)
      .then(res => {
      //Calcular los valores
      me.calcularPagoLiquidacion = true
      })
    },
    limpiar(){
      let me = this
      me.sumaTotalVALOR           = 0
      me.DetalleVerificacion      = []
      //REGALADOS
      me.totalRegalados           = 0
      me.totalCobroVenta          = 0
      me.arregloRegalados         = []
      //VENTA REAL
      me.arregloValoresVentaReal  = []
      me.sumaVentaReal            = 0
      me.calcularPagoLiquidacion  = false
      //CONVENIO
      me.arregloHijosConvenio     = []
      me.NumeroConvenio           = 0
      me.ObjectConvenio           = {}
      me.SaldoConvenio            = 0
      me.totalAnticipos           = 0
    },
  }
}
</script>
