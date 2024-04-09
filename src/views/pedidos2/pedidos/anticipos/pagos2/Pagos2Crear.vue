<template>
  <div>
    <div v-if="menu != 0">
      <vs-button color="primary" type="filled" @click="menu = 0;">◄ Regresar</vs-button>
      <br><br>
    </div>
    <!--FORMULARIO INFORMACION PAGO-->
    <div v-if="menu == 0">
      <p class="mt-5 font-bold">Crear Pago</p>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <div class="flex" style="flex-direction: column;">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Nombres" v-model="sendPago.nombres" />
            <div>
              <span class="cursor-pointer ml-1" @click="getBeneficiarios();menu=1;">
                <ion-icon name="people-circle-outline" style="font-size:18px;transform: translateY(3px);"></ion-icon>
                <small class="text-primary" style="text-decoration: underline;">Mostrar Beneficiarios</small>
              </span>
            </div>
          </div>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Apellidos" v-model="sendPago.apellidos" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-full w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="RUC" v-model="sendPago.ruc" />
        </div>

      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Banco" v-model="sendPago.banco" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6">
          <small class="label_inputs">Tipo de cuenta</small>
          <v-select :options="['Ahorros','Corriente']" v-model="sendPago.tipo_cuenta" class="w-full" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Número de Cuenta" v-model="sendPago.num_cuenta" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2" style="margin-top: -1px;">
          <small>Fecha pago:</small>
          <flat-pickr :config="configdateTimePicker" v-model="sendPago.doc_fecha"  placeholder="Fecha pago"  style="display: inline-block;width: 100%;" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-full w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-message-square" icon-no-border label-placeholder="Observación" v-model="sendPago.observacion" />
        </div>
      </div>
      <!--EVIDENCIAS-->
      <vs-divider>Evidencias:</vs-divider>
      <FormularioPagoVue :sendPedido="sendPedido" :userRoot="userRoot" :id="id" :sendPago="sendPago" :ObjectSelect="ObjectSelect" :usuario="usuario" :contrato="contrato" @showCreate="showCreate"/>
    </div>
    <!---MODAL BENEFICIARIOS-->
    <div v-if="menu == 1">
      <p class="text-warning text-2xl font-bold">Seleccione un Beneficiario por favor</p>
      <TableBeneficiariosVue class="mt-3" :arregloBeneficiarios="arregloBeneficiarios" @handleSelect="handleSelect"/>
    </div>
    <!--MODALES-->
  </div>
</template>
<script>
const FormularioPagoVue     = () => import('../../../../temporadas/components/Pedidos/Pagos/components/FormularioPago.vue')
const TableBeneficiariosVue = () => import('../../../../temporadas/components/Pedidos/Pagos/components/TableBeneficiarios.vue')
import PedidosRepository from '../../../../../repositories/PedidosRepository';
import PagosRepository from '../../../../../repositories/PagoRepository';
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
  components:{
    vSelect,
    flatPickr,
    FormularioPagoVue,
    TableBeneficiariosVue,
  },
  data() {
    return{
      sendPago:{
        nombres:'',
        apellidos:'',
        ruc:'',
        email:'',
        banco:'',
        tipo_cuenta:'',
        num_cuenta:'',
        observacion:'',
        doc_fecha:null,
      },
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:s',
        defaultDate: new Date()
      },
      //variables beneficiarios
      arregloBeneficiarios:[],
      popupBeneficiarios:false,
      //fin variables beneficiarios
      menu:0,
    }
  },
  props:{
    userRoot:{
      type:Boolean,
      default:false,
      required:true,
    },
    ObjectSelect:{
      type:Object,
      default:function(){
        return {}
      },
    },
    usuario:{
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
    contrato:{
      type:String,
      default:""
    },
    id:{
      type:Number,
      default:0,
    },
  },
  watch:{
    id(results){
      this.id = results
    },
  },
  // inject: ['getSendPedido'],
  // computed: {
  //   sendPedido(){ return this.getSendPedido(); }
  // },
  mounted(){
    let me = this;
    me.setFields()
  },
  methods:{
    setFields(){
      let me = this;
      if(me.id > 0){
        me.sendPago = {
          nombres:        me.ObjectSelect.doc_nombre,
          apellidos:      me.ObjectSelect.doc_apellidos,
          ruc:            me.ObjectSelect.doc_ruc,
          // email:'',
          banco:          me.ObjectSelect.doc_institucion,
          tipo_cuenta:    me.ObjectSelect.doc_tipo,
          num_cuenta:     me.ObjectSelect.doc_cuenta,
          observacion:    me.ObjectSelect.doc_observacion,
          doc_fecha:      me.ObjectSelect.doc_fecha
        }
      }else{
        me.sendPago ={
          nombres:'',
          apellidos:'',
          ruc:'',
          email:'',
          banco:'',
          tipo_cuenta:'',
          num_cuenta:'',
          observacion:'',
          doc_fecha:new Date(),
        }
      }
    },
    getBeneficiarios(){
      let me = this;
      PedidosRepository.getBeneficiariosXPedido(me.sendPedido.id_pedido).then(r => this.arregloBeneficiarios = r.data  )
    },
    showCreate(e){
      let me = this
      me.$emit('showCreate',e)
    },
    handleSelect(e){
      let me = this
      me.sendPago.nombres   = e.nombres
      me.sendPago.apellidos = e.apellidos
      me.sendPago.ruc       = e.cedula
      me.sendPago.email     = e.correo
      me.menu               = 0
    },
  }
}
</script>
