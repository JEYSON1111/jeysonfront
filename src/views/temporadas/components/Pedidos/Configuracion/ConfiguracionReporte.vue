<template>
  <div>
    <div>
      <vs-divider>Configuración Reporte</vs-divider>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Mostrar Anticipo/Deuda</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="flex">
            <li>
              <vs-radio v-model="showReporte.permiso_anticipo_deuda" class="mr-2" vs-name="radios1permiso_anticipo_deuda" vs-value="1">Si</vs-radio>
            </li>
            <li>
              <vs-radio v-model="showReporte.permiso_anticipo_deuda" vs-name="radios1permiso_anticipo_deuda" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Mostrar Convenio</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="flex">
            <li>
              <vs-radio v-model="showReporte.permiso_convenio" class="mr-2" vs-name="radios1permiso_convenio" vs-value="1">Si</vs-radio>
            </li>
            <li>
              <vs-radio v-model="showReporte.permiso_convenio" vs-name="radios1permiso_convenio" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Mostrar Cobro Venta Directa</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="flex">
            <li>
              <vs-radio v-model="showReporte.permiso_cobro_venta_directa" class="mr-2" vs-name="radios1permiso_cobro_venta_directa" vs-value="1">Si</vs-radio>
            </li>
            <li>
              <vs-radio v-model="showReporte.permiso_cobro_venta_directa" vs-name="radios1permiso_cobro_venta_directa" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
          <vs-button class="mr-3 mb-2" icon="save" @click="updateValorLiquidacion()" icon-after>Guardar</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      showReporte:{
        permiso_anticipo_deuda:0,
        permiso_convenio:0,
        permiso_cobro_venta_directa:0,
      }
    }
  },
  props:{
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    setpermiso_anticipo_deuda:{
      type:Number,
      default:0
    },
    setpermiso_convenio:{
      type:Number,
      default:0
    },
    setpermiso_cobro_venta_directa:{
      type:Number,
      default:0
    },
  },
  mounted(){
    let me = this
    me.showReporte = {
      permiso_anticipo_deuda:       me.setpermiso_anticipo_deuda,
      permiso_convenio:             me.setpermiso_convenio,
      permiso_cobro_venta_directa:  me.setpermiso_cobro_venta_directa
    }
  },
  methods:{
    updateValorLiquidacion(){
      let me = this;
      let formData = new FormData();
      formData.append('actualizarTresCampo', 'yes')
      formData.append('verificacion_id',    me.VerificacionSelect.id);
      formData.append('campo',              'permiso_anticipo_deuda');
      formData.append('valor',              me.showReporte.permiso_anticipo_deuda);
      formData.append('campo2',             'permiso_convenio')
      formData.append('valor2',             me.showReporte.permiso_convenio)
      formData.append('campo3',             'permiso_cobro_venta_directa')
      formData.append('valor3',             me.showReporte.permiso_cobro_venta_directa)
      this.$http.post(this.$server_url+'updateVerificacion', formData)
      .then(res => {
        let datos = {
          "tipo"                            :7,
          "sendpermiso_anticipo_deuda":       me.showReporte.permiso_anticipo_deuda,
          "sendpermiso_convenio":             me.showReporte.permiso_convenio,
          "sendpermiso_cobro_venta_directa":  me.showReporte.permiso_cobro_venta_directa
        }
        me.$emit('recharge',datos)
        me.$vs.notify({
          text: 'Se guardo correctamente',
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      })
    },
  }
}
</script>
