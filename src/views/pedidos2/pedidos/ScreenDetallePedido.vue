<template>
    <div>
        <!--MENU-->
        <div class="flex" style="flex-wrap:wrap;">
          <vx-tooltip style="display: inline-block;" text="Refrescar pedido" position="top" color="primary">
            <vs-button radius color="success" type="gradient" icon-pack="feather" icon="icon-refresh-ccw" @click="rechargePedido();"></vs-button>
          </vx-tooltip>
          <vs-button line-position="top" type="line"          @click="menu = 0;">Institución</vs-button>
          <vs-button line-position="top" color="danger"       @click="menu = 2;" v-if="sendPedido.id_pedido > 0" type="line">Beneficiario</vs-button>
          <vs-button line-position="top" line-origin="left"   @click="menu = 1;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="success" type="line">Libros</vs-button>
          <vs-button line-position="top" line-origin="left"   @click="menu = 3;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0 && !groupFacturador" color="warning" type="line">Convenios</vs-button>
          <vs-button line-position="top" line-origin="right"  @click="rechargePedido();menu = 4;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="dark" type="line">{{groupFacturador ? 'Pagos':'Anticipos'}}</vs-button>
          <vs-button line-position="top" type="line"          @click="menu = 5;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0">Verificaciones</vs-button>
          <vs-button line-position="top" line-origin="left"   @click="menu = 6;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="success" type="line">Seguimiento pedido</vs-button>
        </div>
        <!--VENTA REAL-->
        <div v-if="sendPedido.id_pedido">
            <BeneficiariosPorcentajeVue :pedido="sendPedido"/>
        </div>
        <br>
        <!--COMPONENTES-->
        <div v-if="menu == 0">
            <ScreenInstitucion />
        </div>
        <!--LIBROS-->
        <div v-if="menu == 1">
            <ScreenLibrosVue @rechargePedido="rechargePedido"/>
        </div>
        <!--BENEFICIARIO-->
        <div v-if="menu == 2 && sendPedido.id_pedido">
            <registrar_beneficiariosVue :pedido="sendPedido" @rechargePedido="rechargePedido"/>
        </div>
        <!--CONVENIO-->
        <!-- <div v-if="menu == 3 && groupFacturador  || userAsesor || sendPedido.pedidos_convenios_id > 1"> -->
        <div v-if="menu == 3">
            <ScreenConvenioVue :datosInstitucion="datosInstitucion"/>
        </div>
        <!--ANTICIPOS-->
        <div v-if="menu == 4 && sendPedido.id_pedido">
            <ScreenAnticiposVue @rechargePedido="rechargePedido"/>
        </div>
        <!--VERIFICACIONES-->
        <div v-if="menu == 5 && sendPedido.contrato_generado">
            <ScreenVerificacionesVue/>
        </div>
        <!--TRAZABILIDAD-->
        <div v-if="menu == 6 && sendPedido.id_pedido">
            <screenTransabilidaVue :pedido="sendPedido"/>
        </div>
    </div>
</template>
<script>
  import {
    mapState
} from "vuex";
import PedidosRepository from "../../../repositories/PedidosRepository";
const BeneficiariosPorcentajeVue    = () => import('../../pedidos/components/beneficiarios/BeneficiariosPorcentaje.vue')
const ScreenInstitucion             = () => import('./institucion/ScreenInstitucion.vue')
const ScreenLibrosVue               = () => import('./libros/ScreenLibros.vue')
const registrar_beneficiariosVue    = () => import('../../pedidos/registrar_beneficiarios.vue')
const ScreenConvenioVue             = () => import('../../temporadas/components/Pedidos/Configuracion/Convenios/ScreenConvenio.vue')
const ScreenAnticiposVue            = () => import('./anticipos/ScreenAnticipos.vue')
const ScreenVerificacionesVue       = () => import('../verificaciones/ScreenVerificaciones.vue')
const screenTransabilidaVue         = () => import('../../pedidos/transabilidad/screenTransabilida.vue')
export default{
    components:{
        ScreenInstitucion,
        ScreenLibrosVue,
        BeneficiariosPorcentajeVue,
        registrar_beneficiariosVue,
        ScreenConvenioVue,
        ScreenAnticiposVue,
        ScreenVerificacionesVue,
        screenTransabilidaVue,
    },
    data(){
        return{
            menu:0,
            sendPedido:'',
            datosInstitucion:'',
        }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    watch:{
      ObjectPedido(results){
          let me = this
          me.sendPedido = me.ObjectPedido
      },
    },
    mounted(){
        let me = this;
        me.sendPedido              = me.ObjectPedido
        me.datosInstitucion        = {
          idInstitucion           :me.sendPedido.id_institucion,
          nombreInstitucion       :me.sendPedido.nombreInstitucion,
          id_periodo              :me.sendPedido.id_periodo,
        }
        me.updateVentaReal()
    },
    methods:{
        rechargePedido(){
          let me = this
          PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => { this.$store.dispatch('setPedido',r.data[0]); })
        },
        updateVentaReal(){
          let me = this
          if(me.groupFacturador) {
              //si es asesor envio a actualizar la venta real
              if(me.sendPedido.id_periodo == null || me.sendPedido.id_periodo == undefined){  }
              else{
                const { id_asesor, id_periodo } = me.sendPedido;
                this.$http.get(this.$server_url+`pedigo_Pagos?updateVentaReal=1&idAsesor=${id_asesor}&idPeriodo=${id_periodo}`)
                .then(res => { })
              }
          }
        },
    }
}

</script>
