<template>
<div>
  <vs-chip class="mt-5 ml-4" v-if="pedido.estado_entrega == 0"><b>ESTADO:</b> <span class="ml-1">PEDIDO NO ENTREGADO AUN</span></vs-chip>
  <vs-chip class="mt-5 ml-4" color="primary" v-if="pedido.estado_entrega == 1"><b>ESTADO:</b> <span class="ml-1">PEDIDO APROBADO(FACTURADOR)</span></vs-chip>
  <vs-chip class="mt-5 ml-4" color="success" v-if="pedido.estado_entrega == 2"><b>ESTADO:</b> <span class="ml-1">PEDIDO ENTREGADO(BODEGA)</span></vs-chip>
  <br><br>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-1/5 w-full mb-3" style="margin-left: 30px;">
        <div class="label_inputs">Asesor</div>
        <p style="font-weight: 500;" class="text-primary">{{pedido.asesor.nombres}}</p>
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Periodo</div>
        <v-select disabled :options="periodos" :reduce="periodos => periodos" label="periodoescolar" v-model="pedido.periodo" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Fecha envío</div>
        <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_envio" placeholder="Fecha envío" class="w-full" />
      </div>
      <div class="vx-col lg:w-full md:w-full sm:w-full mb-3">
        <vs-textarea class="mt-2" counter="500" label="Observaciones" placeholder="Indique la, Ciudad, dirección en donde desea recibir su pedido" :counter-danger.sync="counterDanger" v-model="pedido.observacion" />
      </div>
      <div class="vx-col w-full  flex flex-grap gap-12 justify-center items-center" align="center">
        <vs-button color="warning" type="border" icon-pack="feather" icon="icon-save" v-if="( usuario.id_group == 11 || usuario.id_group == 27 ) && pedido.estado_entrega == 0" @click="guardarPedido">Guardar pedido</vs-button>
      </div>
      <!-- <div class="vx-col w-full mt-6 flex flex-grap gap-12 justify-center items-center" align="center">
        <vs-button color="warning" type="border" icon-pack="feather" icon="icon-save" v-if="usuario.id_group == 17 && pedido.estado_entrega == 0" @click="openConfirm()">Aprobar solicitud</vs-button>
      </div> -->
    </div>
</div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import axios from 'axios'
export default {
    components:{
      FormWizard,
      TabContent,
      flatPickr,
      'v-select': vSelect,
    },
    data: () => ({
      usuario:[],
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      periodos: [],
      instituciones: [],
      tipos_venta: [
        {id_tipo: 1, tipo_venta: 'Directa'},
        {id_tipo: 2, tipo_venta: 'Comisión o lista'},
        // {id_tipo: 3, tipo_venta: 'Comisión en Libros'},
        // {id_tipo: 4, tipo_venta: 'Operativa'},
        // {id_tipo: 5, tipo_venta: 'Consignación'},
      ],
      pedido:{
        id_pedido: 0,
        periodo: '',
        tipo_venta: '', 
        fecha_envio: '',
        fecha_entrega: '',
        institucion: '',
        asesor: '',
        descuento: '',
        anticipo: '',
        observacion:'',
        ruc:'',
        direccionInstitucion:'',
        nivel:'',
        tipo_descripcion:'',
        telefonoInstitucion:'',
        porcentaje_anticipo:0,
        ifanticipo:0,
        pendiente_liquidar:0,
        convenio_anios:0,
        anticipo_aprobado:0,
        contrato_generado:'',
        estado_entrega:0,
      },
      cant_sms: 0,
      responsables: [],
      modalResponsable: false,
      id_pedido: '',
      cedula_asesor: '',
      disableAsesor:false,
      counterDanger: false
    }),
    mounted() {
      let me = this
      this.usuario    = JSON.parse(localStorage.getItem('usuario'));
      console.log("uwu",me.sendPedido)
      this.id_pedido  = me.sendPedido.id_pedido
      this.pedido.periodo = {idperiodoescolar: localStorage.id_periodo_selected, periodoescolar: localStorage.nombre_periodo_selected}
      this.usuario_id = this.usuario.idusuario
      this.getPeriodos()
      this.get_datos_pedido()
      if(me.usuario.id_group == 11){
        me.disableAsesor = false
      }else{
        me.disableAsesor = true
      }
    },
    props:{
      sendPedido:{
        type:Object,
        default:function(){
          return {}
        }
      },
    },
    methods: {
      openConfirm(){
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          text: 'Esta seguro de aprobar la solicitud de guias?',
          accept:this.aprobarSolicitud
        })
      },
      aprobarSolicitud(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',me.id_pedido);
        me.$vs.loading()
        this.$http.post(this.$server_url+'entregarPedido', formData)
        .then(res => {
          me.get_datos_pedido();
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Solicitud de guia entregado con exito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      getPeriodos(){
        let me = this
        this.$http.get(this.$server_url+'get_periodos_activos')
        .then(res => {
          me.periodos = res.data
        })
      },
      guardarPedido(){
        let me = this
        if( me.pedido.periodo == '' || me.pedido.asesor == ''){
          me.$vs.notify({ text: 'Llene todos los campos antes de guardar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        let formData = new FormData();
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('fecha_envio',          me.pedido.fecha_envio);
        formData.append('periodo',              me.pedido.periodo.idperiodoescolar);
        formData.append('id_asesor',            me.pedido.asesor.idusuario);
        formData.append('id_usuario_verif',     me.usuario.idusuario);
        formData.append('observacion',          me.pedido.observacion);
        me.$vs.loading();
        //axios.post(this.$data_url+'api/guardarPedidoGuias',formData)
        this.$http.post(this.$server_url+'guardarPedidoGuias', formData)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          if( res.data.error ){
            alert(res.data.error)
          }else{
            me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'Se guardo correctamente'
            })
            me.pedido.id_pedido = res.data.pedido.id_pedido
            this.$store.dispatch('setGuia',res.data.pedido)
          }
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      },
      get_datos_pedido(){
        let me = this
        console.log(localStorage.id_pedido)
        if( localStorage.id_pedido == 0 ){
            me.pedido.asesor = {idusuario: me.usuario.idusuario, nombres: me.usuario.nombres+' '+me.usuario.apellidos}
            me.cedula_asesor = me.usuario.cedula
          return
        }
        this.$http.get(this.$server_url+'get_datos_pedido_guias/'+localStorage.id_pedido)
        .then(res => {
            me.pedido.id_pedido = res.data[0].id_pedido
            me.pedido.fecha_envio = res.data[0].fecha_envio
            me.pedido.asesor = {idusuario: res.data[0].id_asesor, nombres: res.data[0].nombres+' '+res.data[0].apellidos}
            me.cedula_asesor = res.data[0].cedula
            me.pedido.estado_entrega = res.data[0].estado_entrega
            me.pedido.observacion    = res.data[0].observacion
            //localStorage.setItem("institucion_selected_pedido", me.pedido.institucion.id_institucion)
            localStorage.setItem("id_asesor_pedido", me.pedido.asesor.idusuario)
        })
        .catch(err => {
          console.log(err)
        })
      },
      guardarInstituciones(id_pedido){
        let me = this
        //asesor
        if(me.usuario.id_group == 11){
          window.location.href = "/pedidos/guias/"+id_pedido;
          return
        }
        if(me.usuario.id_group == 27){
          window.location.href = "/pedidos/guias/bodega/"+id_pedido;
          return
        }else{
          window.location.href = "/pedidos/administrador/guias/"+id_pedido;
        }
        // this.$http.get(this.$server_url+'guardar_institucines_base_milton')
        // .then(res => {
        //   window.location.href = "/pedidos/guias/"+id_pedido;
        // })
        // .catch(err => {
        // })
      },
     
      limpiar(){
        let me = this;
        me.pedido.ruc                   = ""
        me.pedido.direccionInstitucion  = ""
        me.pedido.nivel                 = ""
        me.pedido.tipo_descripcion      = ""
        me.pedido.telefonoInstitucion   = ""
      }
    },
}
</script>

<style>
.label_inputs{
  font-size: 12px;
  color: rgb(143, 143, 143);
  margin-top: 4px;
  padding-left: 4px;
}
</style>
