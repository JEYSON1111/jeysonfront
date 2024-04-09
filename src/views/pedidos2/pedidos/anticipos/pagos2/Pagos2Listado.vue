<template>
  <div>
    <div>
      <vs-table stripe :data="arregloPagos" class="mt-3" max-items="5" search pagination>
        <template slot="header">
          <div class="flex">
              <vs-chip>Cantidad: {{ arregloPagos.length }}</vs-chip>
          </div>
          <br>
        </template>
        <template slot="thead">
            <vs-th width="10%">#</vs-th>
            <vs-th width="20%">Documento</vs-th>
            <vs-th width="30%">Contrato</vs-th>
            <vs-th width="10%">Observación</vs-th>
            <vs-th width="30%">Acción</vs-th>
        </template>
        <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ tr.doc_codigo }}</vs-td>
            <vs-td>
              <div class="flex" v-if="tr.ifAntAprobado == 0">
                <p class=""><vs-chip v-if="tr.estado == 0" color="warning">Pendiente</vs-chip></p>
                <p class=""><vs-chip v-if="tr.estado == 1" color="success">Aprobado</vs-chip></p>
                <p class=""><vs-chip v-if="tr.estado == 2" color="danger">Anulado</vs-chip></p>
              </div>
              <div :class="sendPedido.ifagregado_anticipo_aprobado == 0 || sendPedido.ifagregado_anticipo_aprobado == 2  ?  'mt-2 bg-warning' :  'mt-2 bg-success'" v-if="tr.ifAntAprobado == 1"  style="color:white;padding:5px;border-radius: 10px;">
                <p class="font-bold mt-2">Anticipo Pedido:</p>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 0">Sin aprobar</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 1 && sendPedido.anticipo_aprobado > 0">Anticipo aprobado por admin facturador</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 2" class="font-bold">!Anticipo solicitado a gerencia ${{ sendPedido.anticipo_solicitud_for_gerencia }}</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 3"><b>ANTICIPO APROBADO POR GERENCIA <span class="text-success">$ {{ sendPedido.anticipo_aprobado_gerencia }}</span></b></small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 4" class="text-danger">Anticipo solicitado: rechazado</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 5" class="text-success">Gerencia aprueba anticipo sugerido</small>
              </div>
              <p  class="mt-3" style="font-weight:bold;">Doc valor:  <span  class="text-success font-bold">{{ data[indextr].doc_valor | filtrarDecimal }}</span></p>
              <p style="font-weight:bold;">Tipo de pago:</p>
              <span>{{ tr.tipo_pagos.nombre }}</span>
              <p style="font-weight:bold;">Forma de pago:</p>
              <p>{{ tr.forma_pagos.tip_pag_nombre }}</p>
              <div v-if="tr.unicoEvidencia == 0">
                <p style="font-weight:bold;" >Doc. Número:</p>
                <span>{{ data[indextr].doc_numero }}</span>
              </div>
              <p style="font-weight:bold;">Doc. Nombre:</p>
              <span>{{ data[indextr].doc_nombre }}</span>
              <p style="font-weight:bold;">Doc. Apellidos:</p>
              <span>{{ data[indextr].doc_apellidos }}</span>
              <!-- <p style="font-weight:bold;">Doc. Ci:</p>
              <span>{{ data[indextr].doc_ci }}</span> -->
              <p style="font-weight:bold;">Doc. Institución:</p>
              <span>{{ data[indextr].doc_institucion }}</span>
              <p style="font-weight:bold;">Doc. Tipo:</p>
              <span>{{ data[indextr].doc_tipo }}</span>
              <p style="font-weight:bold;">Doc. Fecha:</p>
              <span>{{ data[indextr].doc_fecha }}</span>
              <div v-if="tr.unicoEvidencia == 0">
                <p v-if="!tr.archivo">
                  <b class="text-danger"> Solicitud de evidencias: No subida </b>
                  </p>
                  <p v-else class="imagen" @click="openDocument(tr)">
                      <b> Evidencia:
                          <!--PDF-->
                          <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                          <!--IMAGE-->
                          <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                      </b>
                  </p>
              </div>
          </vs-td>
          <vs-td>
            {{ tr.ven_codigo }}
            <div v-if="tr.pedido_pagos_hijo.length > 0">
              <vs-collapse accordion >
                <vs-collapse-item  style="position:relative;left:-50px;">
                  <div slot="header">
                    <p class="font-bold"> Ver varias Evidencias </p>
                  </div>
                  <vs-row>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
                      <vs-card>
                        <div class="header">
                          <p style="font-weight: bold;">Varias Documentos </p>
                          <table class="tabla">
                              <tr>
                                <th class="th1">Valor</th>
                                <th class="th1">Num. Documento</th>
                                <th class="th1">Evidencia</th>
                              </tr>
                              <tr v-for="(item,key) in tr.pedido_pagos_hijo" :key="key">
                                <td class="td1">{{  item.valor }}</td>
                                <td class="td1">{{ item.codigo }}</td>
                                <td class="td1">
                                  <p v-if="!item.archivo">
                                    <b class="text-danger"> Solicitud de evidencias: No subida </b>
                                    </p>
                                    <p v-else class="imagen" @click="openDocument(item)">
                                        <b> Evidencia:
                                            <!--PDF-->
                                            <ion-icon v-if="item.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                            <!--IMAGE-->
                                            <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                                        </b>
                                    </p>
                                </td>
                              </tr>
                          </table>
                        </div>
                      </vs-card>
                    </vs-col>
                  </vs-row>
                </vs-collapse-item>
                </vs-collapse>
            </div>
          </vs-td>
            <vs-td height="30%" width="30%">
              <div class="overflow-y-auto h-24">
                {{ tr.doc_observacion }}
              </div>
            </vs-td>
            <vs-td align="center">
              <div v-if="tr.estado == 0">
                <!--facturador-->
                <div v-if="usuario.id_group == 22">
                  <!--anticipo del pedido-->
                  <div v-if="tr.ifAntAprobado == 1">
                    <vs-button v-if="tr.estado == 0 && sendPedido.ifagregado_anticipo_aprobado == 0" size="small" class="m-2" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago(tr);"  icon-pack="feather" icon="icon-check" color="success" type="gradient">Cerrar Pago </vs-button>
                    <vs-button v-if="tr.estado == 0 && sendPedido.ifagregado_anticipo_aprobado > 0" size="small" class="m-2" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago(tr);"  icon-pack="feather" icon="icon-check" color="success" type="gradient">Cerrar Pago </vs-button>
                  </div>
                  <!--otros pagos-->
                  <div v-if="tr.ifAntAprobado == 0">
                    <vs-button v-if="tr.estado == 0" size="small" class="m-2" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago(tr);" icon-pack="feather" icon="icon-check" color="success" type="gradient">Cerrar Pago </vs-button>
                  </div>
                </div>
                <!--facturador admin y root-->
                <div v-if="usuario.id_group == 23 || userRoot">
                  <!--anticipo del pedido-->
                  <div v-if="tr.ifAntAprobado == 1">
                    <vs-button size="small" class="m-2" @click="id=tr.doc_codigo;ObjectSelect=tr;popupConfirmAnticipoAprobado=true;"  icon-pack="feather" icon="icon-check" color="primary" type="gradient">{{ sendPedido.ifagregado_anticipo_aprobado == 0 ? 'Aprobar Anticipo solicitado' : 'Cambiar Anticipo solicitado' }}  </vs-button>
                    <vs-button size="small" class="m-2 mt-3" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago(tr);"  icon-pack="feather" icon="icon-check" color="success" type="gradient">Cerrar Pago </vs-button>
                  </div>
                  <!--otros pagos-->
                  <div v-if="tr.ifAntAprobado == 0">
                    <vs-button v-if="tr.estado == 0" size="small" class="m-2" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago(tr);" icon-pack="feather" icon="icon-check" color="success" type="gradient">Cerrar Pago </vs-button>
                  </div>
                </div>
              </div>
              <div v-else>
                <vx-tooltip style="display: inline-block;" text="Vuelva nuevamente a habilitar el Pago" position="top" color="primary">
                  <vs-button size="small"  v-if="usuario.id_group == 23 || userRoot" icon-pack="feather" icon="icon-settings" class="m-3" @click="ObjectSelect=tr;confirmReAbriPago(tr)" color="primary" type="gradient">Reabrir pago</vs-button>
                </vx-tooltip>
              </div>
              <vx-tooltip text="Editar pago" position="top" color="warning" style="display: inline-block; z-index: 3;">
                <vs-button  size="small"  icon-pack="feather" icon="icon-edit" class="m-3" @click="id=tr.doc_codigo;ObjectSelect=tr;$emit('showCreate',1,tr);" color="warning" type="gradient">Editar</vs-button>
              </vx-tooltip>
              <vx-tooltip text="Eliminar pago" position="top" color="danger" style="display: inline-block; z-index: 3;">
                <vs-button v-if="userRoot" size="small"  icon-pack="feather" class="m-3" icon="icon-x" @click="ObjectSelect=tr;openConfirmEliminarPago(tr)" color="danger" type="gradient">Eliminar</vs-button>
              </vx-tooltip>
              <vx-tooltip text="Eliminar pago" position="top" color="danger" style="display: inline-block; z-index: 3;">
                <vs-button v-if="tr.estado == 0 && (usuario.id_group == 22 || usuario.id_group == 23)" class="m-2" size="small" icon-pack="feather" icon="icon-x" @click="ObjectSelect=tr;openConfirmEliminarPago(tr)" color="danger" type="gradient">Eliminar</vs-button>
              </vx-tooltip>
            </vs-td>
        </vs-tr>
        </template>
      </vs-table>
    </div>
    <!---MODALES-->
    <!--MODAL PARA APROBAR EL ANTICIPO APROBADO-->
    <vs-popup classContent="popup-example" title="Aprobar Anticipo del pedido" :active.sync="popupConfirmAnticipoAprobado">
      <AprobarAnticipoAprobadoVue v-if="popupConfirmAnticipoAprobado" :sendPedido="sendPedido" :usuario="usuario" :userRoot="Boolean(userRoot)" @changeHandle="changeHandle"/>
    </vs-popup>
  </div>
</template>
<script>
import axios from 'axios'
const AprobarAnticipoAprobadoVue = () => import('./components/AprobarAnticipoAprobado.vue')
export default {
  components:{
    AprobarAnticipoAprobadoVue,
  },
  data() {
    return{
      ObjectSelect:'',
      popupConfirmAnticipoAprobado:false,

    }
  },
  // inject: ['getSendPedido'],
  // computed: {
  //   sendPedido(){ return this.getSendPedido(); }
  // },
  props:{
    arregloPagos:{
      type:Array,
      default:function(){
        return []
      }
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    usuario:{
      type:Object,
      default:function(){
        return{}
      }
    },
    userRoot:{
      type:Boolean,
      default:false,
    },
    groupFacturador:{
      type:Boolean,
      default:false,
    }
  },
  watch:{
    arregloPagos(results){
      this.arregloPagos = results
    },
    sendPedido(results){
      this.sendPedido = results
    }
  },
  mounted(){
    let me  = this
  },
  methods:{
    rechargePedido(e){
      let me = this
      me.$emit('rechargePedido',e)
    },
    changeHandle(e){
      let me = this
      if(e == 0) { me.popupConfirmAnticipoAprobado = false; }
      if(e == 1) { me.popupConfirmAnticipoAprobado = false; me.rechargePedido();   me.$emit('rechargeValores',true) }
    },
    openDocument(tr){
      let me = this;
      let ruta = me.$data_url+'archivos/pedidos/pagos/'+tr.url
      window.open(ruta,'_blank')
    },
    openConfirmAprobarPago(tr){
      let me = this;
      //si es anticipo del pedido verificar que este aprobado por el facturador
      if(tr.ifAntAprobado == 1){
        if(me.sendPedido.ifagregado_anticipo_aprobado == 0){
          me.$vs.notify({
            text: 'El anticipo del pedido no esta aprobado por el facturador No puede cerrar el pago',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time:6000,
          })
          return
        }
      }
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirmar`,
        acceptText:'Si, deseo aprobar el pago',
        cancelText:'Cancelar',
        text: 'Estás seguro de aprobar el pago?',
        accept:this.aprobarPago
      })
    },
    aprobarPago(){
      let me = this;
      let formData = new FormData();
      formData.append('aprobarPagoVerificacion',  'yes')
      formData.append('doc_codigo',               me.ObjectSelect.doc_codigo);
      formData.append('contrato',                 me.sendPedido.contrato_generado)
      formData.append('user_created',             me.usuario.idusuario);
      formData.append('periodo_id',               me.sendPedido.id_periodo)
      formData.append('institucion_id',           me.sendPedido.id_institucion)
      formData.append('id_pedido',                me.sendPedido.id_pedido)
      formData.append('valor',                    me.ObjectSelect.doc_valor)
      formData.append('tipo_pago_id',             me.ObjectSelect.tipo_pago_id)
      formData.append('doc_observacion',          me.ObjectSelect.doc_observacion)
      me.$vs.loading()
      this.$http.post(this.$server_url+'pedigo_Pagos', formData)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
            text: res.data.message,
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time:5000,
          })
          return
        }
        me.$vs.notify({
          text: res.data.message,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.$emit('rechargeValores',true)
      })
      .catch(function (error) {
        me.$vs.loading.close()
      })
    },
    openConfirmEliminarPago(){
        let me = this;
        if(me.ObjectSelect.ifAntAprobado == 1){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo eliminar el registro del pago',
            cancelText:'Cancelar',
            text: 'Estás seguro de eliminar el registro del pago?',
            accept:this.eliminarPagoAnticipo
          })
          return
        }
        const { doc_observacion ,tipo_pago_id } = me.ObjectSelect
        if(tipo_pago_id == 1 && doc_observacion &&  doc_observacion.toLowerCase().includes("deuda")){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo eliminar el registro del pago',
            cancelText:'Cancelar',
            text: 'Estás seguro de eliminar el registro del pago?',
            accept:this.eliminarValorPagoDeuda
          })
          return
        }
        else{
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo eliminar el registro del pago',
            cancelText:'Cancelar',
            text: 'Estás seguro de eliminar el registro del pago?',
            accept:this.eliminarValorPago
          })
        }
      },
      eliminarValorPago(){
        let me = this;
        let formData = new FormData()
        formData.append('eliminarRegistroPago',         "yes")
        formData.append('doc_codigo',                   me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                    me.sendPedido.id_pedido)
        formData.append('user_created',                 me.usuario.idusuario)
        me.$vs.loading()
        axios.post(this.$data_url + 'api/guardarDatosPedido', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.setHistoricoPagoEliminado()
          // me.$emit('rechargeValores',true)
        })
        .catch(function (error) {
            me.$vs.loading.close()
        })
      },
      setHistoricoPagoEliminado(){
        let me = this
        let formData = new FormData()
        formData.append('eliminarPagoNormal',       "yes")
        formData.append('doc_codigo',                me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                 me.sendPedido.id_pedido)
        formData.append('user_created',              me.usuario.idusuario)
        formData.append('old_values',                JSON.stringify(me.ObjectSelect))
        formData.append('ven_codigo',                me.ObjectSelect.ven_codigo)
        formData.append('periodo_id',                me.ObjectSelect.periodo_id)
        formData.append('institucion_id',            me.ObjectSelect.institucion_id)
        formData.append('id_pedido',                 me.ObjectSelect.id_pedido)
        formData.append('tipo_pago_id',              me.ObjectSelect.tipo_pago_id)
        formData.append('forma_pago_id',             me.ObjectSelect.forma_pago_id)
        formData.append('doc_observacion',           me.ObjectSelect.doc_observacion)
        this.$http.post(this.$server_url+'eliminarPagos', formData)
        .then(function (res) {
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      },
      eliminarPagoAnticipo(){
        let me = this
        let formData = new FormData()
        formData.append('eliminarPagoAnticipo',      "yes")
        formData.append('doc_codigo',                me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                 me.sendPedido.id_pedido)
        formData.append('user_created',              me.usuario.idusuario)
        me.$vs.loading()
        this.$http.post(this.$server_url+'eliminarPagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      },
      eliminarValorPagoDeuda(){
        let me = this
        let formData = new FormData()
        formData.append('eliminarPagoDeuda',         "yes")
        formData.append('doc_codigo',                me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                 me.sendPedido.id_pedido)
        formData.append('doc_valor',                 me.ObjectSelect.doc_valor)
        formData.append('user_created',              me.usuario.idusuario)
        me.$vs.loading()
        this.$http.post(this.$server_url+'eliminarPagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      },
      confirmReAbriPago(){
        let me = this
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          acceptText:'Si, deseo reabrir el pago',
          cancelText:'Cancelar',
          text: 'Estás seguro de reabrir el pago?',
          accept:this.reAbriPago
        })
      },
      reAbriPago(){
        let me = this
        let formData = new FormData()
        formData.append('reabrirPagos',        "yes")
        formData.append('id_pedido',           me.sendPedido.id_pedido)
        formData.append('doc_codigo',          me.ObjectSelect.doc_codigo)
        formData.append('user_created',        me.usuario.idusuario)
        formData.append('tipo_pago_id',        me.ObjectSelect.tipo_pago_id)
        formData.append('forma_pago_id',       me.ObjectSelect.forma_pago_id)
        formData.append('doc_observacion',     me.ObjectSelect.doc_observacion)
        me.$vs.loading()
        this.$http.post(this.$server_url+'pedigo_Pagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se reabrio correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      }
  }
}
</script>
