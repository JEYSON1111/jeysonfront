<template>
<div>
    <!-- modal responables -->
    <vs-prompt title="Responsable" @close="getResponsables(); popupBeneficiario=true" buttons-hidden :active.sync="modalResponsable">
        <registrarResponsable/>
    </vs-prompt>
    <!-- FIN modal responables -->
    <vs-popup title="Registrar Beneficiarios" fullscreen :active.sync="popupBeneficiario">
      <div class="vx-row w-full mb-6">
        <!-- responsable - datos facturacion -->
        <div class="vx-col w-full mb-3" v-if="editar == false">
            <div class="w-full flex flex-wrap gap-1 items-center">
              <vs-input icon="search" class="w-full mt-5" @keyup.enter="getResponsables()" label-placeholder="Filtre por cedula" v-model="filtroCedula"/>
              <!-- <small class="mt-2" v-if="ifCrearBeneficiario"><span class="text-warning">El usuario no existe.</span> <span style="text-decoration: underline;cursor: pointer;" @click="ir_crea_responsable" class="text-primary"> Crear beneficiario</span></small> -->
              <vs-chip color="danger" class="mt-2" v-if="ifCrearBeneficiario"><span>El usuario no existe, complete el siguiente formulario.</span></vs-chip>
            </div>
        </div>
        <div class="w-full" v-if="responsables.length > 0">
            <vs-divider>Seleccione el beneficiario</vs-divider>
            <vs-table max-items="5" search pagination :data="responsables">
                <template slot="thead">
                    <vs-th>Nombres</vs-th>
                    <vs-th>Cedula</vs-th>
                    <vs-th>Perfil</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombres_responsable}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cedula}}<br>
                        </vs-td>
                        <vs-td>
                          {{data[indextr].rol}}<br>
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Asignar beneficiario" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success" type="filled" @click="selectBeneficiario(tr)" icon-pack="feather" icon="icon-check"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <template v-if="ifCrearBeneficiario && responsables.length == 0">
            <!--REGISTRAR NUEVO USUARIO-->
            <vs-divider>Registrar nuevo beneficiario</vs-divider>
            <div class="vx-col w-1/2 mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Registre la cédula" v-model="beneficiario.num_identificacion" class="w-full" />
            </div>
            <div class="vx-col w-1/2 mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Nombres" v-model="beneficiario.nombres" class="w-full" />
            </div>
            <div class="vx-col w-1/2 mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Apellidos" v-model="beneficiario.apellidos" class="w-full" />
            </div>
            <div class="vx-col w-1/2 mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Correo"  v-model="beneficiario.correo" class="w-full" />
            </div>
            <div class="vx-col w-1/2 mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Teléfono" v-model="beneficiario.telefono" class="w-full" />
            </div>
            <vs-divider></vs-divider>
        </template>
        <!--FIN DE REGISTRAR USUARIO-->
        <!--DATOS-->
        <div class="vx-col w-1/2 mb-3" v-if="ifCrearBeneficiario == false && responsables.length == 0" >
            <vs-input label="Nombres" v-model="beneficiario.nombres" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="ifCrearBeneficiario == false && responsables.length == 0" >
            <vs-input label="Apelidos" v-model="beneficiario.apellidos" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="responsables.length == 0">
            <div class="label_inputs" >Tipo identificación</div>
            <v-select :options="tipos_identificacion" v-model="beneficiario.tipo_identificacion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="ifCrearBeneficiario == false && responsables.length == 0" >
            <vs-input label="Correo" v-model="beneficiario.correo" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3"  v-if="ifCrearBeneficiario == false && responsables.length == 0">
            <vs-input label="Número de identificación" readonly="true" v-model="beneficiario.num_identificacion" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="responsables.length == 0">
            <vs-input label="Dirección" v-model="beneficiario.direccion" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="responsables.length == 0">
          <vs-input type="number" label="Comisión %" v-model="beneficiario.comision" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="responsables.length == 0">
            <vs-input label="Banco(Opcional)" v-model="beneficiario.banco" class="w-full" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="responsables.length == 0">
            <div class="label_inputs">Tipo de cuenta(Opcional)</div>
            <v-select :options="['Ahorros','Corriente']" v-model="beneficiario.tipo_cuenta" class="w-full" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>
        <div class="vx-col w-1/2 mb-3" v-if="responsables.length == 0">
            <vs-input type="text" label="Número de cuenta(Opcional)" v-model="beneficiario.num_cuenta" class="w-full" />
        </div>
        <div class="vx-col w-full mb-3" v-if="responsables.length == 0">
            <vs-textarea label="Observacion" v-model="beneficiario.observacion" class="w-full" />
        </div>
        </div>
        <div class="w-full" align="center" v-if="responsables.length == 0">
            <vs-button color="success" type="gradient" @click="saveBeneficario()">Guardar</vs-button>
        </div>
    </vs-popup>
    <!--FIN MODAL-->
    <br>
    <div v-if="tipo == 3">
      <vs-alert title="Advertencia" color="danger" active="true">
        <p>Los valores de comisiones para los beneficiarios no es la correcta</p>
      </vs-alert>
    </div>
    <div class="w-full mb-4">
      <vs-table search :data="arregloPorcentajes">
        <template slot="header">
          <h5>Listado de beneficiarios  / <span style="font-size=12px;font-weight: bold;">cantidad: {{arregloPorcentajes.length}}</span></h5>
          <vs-button class="px-3 py-2 ml-3" color="dark" type="gradient" @click="responsables = [];setInstitucion();ifCrearBeneficiario = false;editar = false; id_beneficiario=0; beneficiario= { responsable: '', tipo_identificacion: '', num_identificacion: '', direccion: '', correo: '', comision: '', banco: '', tipo_cuenta: '', num_cuenta: '', telefono: '', observacion: '', nombres:'',apellidos:'',telefono:''};  popupBeneficiario=true" v-if="(usuario_creador.id_group == 11 || usuario_creador.id_group == 22  || usuario_creador.id_group == 23) && detalles == 0 && desdeVerificacion == '0'">Agregar beneficiario</vs-button>
        </template>
        <template slot="thead">
          <vs-th>#</vs-th>
          <vs-th sort-key="nombres_beneficiario">Beneficiario</vs-th>
          <vs-th sort-key="comision">Comisión</vs-th>
          <vs-th v-if="desdeVerificacion == '0' || desdeVerificacion == '2'" sort-key="comision">Porcentajes VENTA BRUTA</vs-th>
          <vs-th sort-key="comision" v-if="ventaReal > 0">Porcentajes VENTA REAL </vs-th>
          <vs-th sort-key="banco">Banco</vs-th>
          <vs-th style="width: 250px;" v-if="(usuario_creador.id_group == 11 || userRoot) && desdeVerificacion == '0' ">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ indextr+1 }}</vs-td>
            <vs-td>
              <b class="font-bold">Beneficiario:</b>
              <p>{{ tr.beneficiario }} </p>
              <b class="font-bold">Cédula:</b>
              <p>{{ tr.cedula }} </p>
              <b>Correo:</b>
              <p>{{ tr.correo }} </p>
              <p class="mt-1">
                <vs-chip v-if="tr.id_usuario == pedido.id_responsable">Principal</vs-chip>
              </p>
            </vs-td>
            <vs-td>{{ tr.comision }} </vs-td>
            <!--PORCENTAJE VENTA BRUTA-->
            <vs-td v-if="desdeVerificacion == '0' || desdeVerificacion == '2'">
              <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6">
                <ul class="features">
                  <li v-if="userRoot || usuario_creador.idusuario == 68990">
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Porcentaje:</strong> <span class="font-semibold"> {{ tr.porcentaje.toFixed(2) }}%</span> </span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>comisión Venta Bruta:</strong> <span class="font-semibold"> ${{ filtrarDecimal(tr.valorPorcentaje) }}</span> </span>
                  </li>
                </ul>
              </div>
            </vs-td>
            <!--PORCENTAJES REALES-->
            <vs-td v-if="ventaReal > 0">
              <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6">
                <ul class="features">
                  <li v-if="userRoot || usuario_creador.idusuario == 68990">
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Porcentaje:</strong> <span class="font-semibold"> {{ tr.porcentajeReal.toFixed(2) }}%</span></span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>comisión Venta Real:</strong> <span class="font-semibold"> ${{ filtrarDecimal(tr.valorPorcentajeReal) }}</span></span>
                  </li>
                </ul>
              </div>
            </vs-td>
            <vs-td>
              <b>Banco:</b>
              <p>{{ tr.banco }} </p>
              <b>Número de cuenta:</b>
              <p>{{ tr.num_cuenta }} </p>
              <b>Tipo de cuenta:</b>
              <p>{{ tr.tipo_cuenta }} </p>
            </vs-td>
            <vs-td align="center" v-if="(usuario_creador.id_group == 11 || userRoot) && desdeVerificacion == '0'">
              <vs-button color="success" type="gradient" size="small" class="m-1" @click="setInstitucion();editar=true; openEditBeneficiario(tr)" v-if="detalles == 0">Editar</vs-button>
              <vs-button color="danger"  type="gradient" size="small" class="m-1" @click="eliminar_beneficiario(tr)" v-if="detalles == 0">Eliminar</vs-button>
              <vs-button color="primary" v-if="( tr.id_usuario != pedido.id_responsable)"  type="gradient" size="small" class="m-1" @click="asignarComoPrincipal(tr)" >Asignar como principal</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
import registrarResponsable from './registrar_responsable.vue'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        registrarResponsable
    },
    props:{
      detalles:{
        type:Number,
        default:0,
      },
      pedido_idBusqueda:{
        type:Number,
        default:0,
      },
      pedido:{
        type:Object,
        default:{},
      },
      desdeVerificacion:{
        type:Number,
        default:0,
      },
      VerificacionSelect:{
        type:Object,
        default:function(){
          return {}
        }
      }
    },
    data() {
      return {
        usuario:[],
        responsables: [],
        beneficiarios: [],
        beneficiario: { responsable: '', tipo_identificacion: '', num_identificacion: '', direccion: '', correo: '', comision: '', banco: '', tipo_cuenta: '', num_cuenta: '', telefono: '', observacion: '',nombres:'',apellidos:'',telefono:''},
        tipos_identificacion: [ 'CI', 'RUC', 'PAS', ],
        id_pedido: '',
        id_asesor_pedido: '',
        id_beneficiario: '',
        id_institucion: '',
        popupBeneficiario: false,
        modalResponsable: false,
        usuario_creador: [],
        filtroCedula:'',
        arregloResponsables:[],
        ifCrearBeneficiario:false,
        editar:false,
        userRoot:false,
        //variables para calculo de porcentajes
        arregloPorcentajes:[],
        ventaBruta:0,
        valorComision:0,
        ventaReal:0,
        valorComisionReal:0,
        comision:0,
        tipo:0,
      }
    },
    watch:{
        filtroCedula(results){
            let me = this;
            if(me.filtroCedula.length > 5){
                setTimeout(function() {me.getResponsables()}, 500);
            }else{
                me.beneficiario.num_identificacion  = '';
                me.beneficiario.correo              = '';
            }
        },
    },
    created() {
    },
    mounted() {
        let me = this;
        me.usuario_creador = JSON.parse(localStorage.getItem('usuario'));
       // me.id_institucion = localStorage.institucion_selected_pedido
        me.id_asesor_pedido = localStorage.id_asesor_pedido
        me.id_pedido        = me.pedido.id_pedido
        // me.getResponsables()
        me.getBeneficiarios()
        me.getUserRoot(me.usuario_creador);
    },
    methods: {
        getUserRoot(dato) {
          let me = this;
          this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
            .then((result) => {
              if (result.data.length > 0) {
                me.userRoot = true;
              }
            })
            .catch((err) => {
              console.log(err)
            })
        },
        asignarComoPrincipal(tr){
            let me = this;
            let formData = new FormData();
            formData.append('id_pedido',     tr.id_pedido);
            formData.append('id_responsable',tr.id_usuario);
            me.$vs.loading()
            this.$http.post(this.$server_url+'asignarBeneficiarioPrincipal', formData)
            .then(res => {
            me.pedido.id_responsable = res.data
            me.$vs.loading.close()
            me.$vs.notify({
              text:'Se asigno correctamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
            })
            me.$emit('rechargePedido',true)
            .catch((e)=>{
                me.$vs.loading.close()
            })
        },
        openEditBeneficiario(tr){
            let me = this;
            me.id_beneficiario                  = tr.id_beneficiario_pedido
            me.beneficiario.idusuario           = tr.id_usuario
            me.beneficiario.num_identificacion  = tr.cedula
            me.beneficiario.tipo_identificacion = tr.tipo_identificacion
            me.beneficiario.direccion           = tr.direccion
            me.beneficiario.correo              = tr.correo
            me.beneficiario.comision            = tr.comision
            me.beneficiario.banco               = tr.banco
            me.beneficiario.tipo_cuenta         = tr.tipo_cuenta
            me.beneficiario.num_cuenta          = tr.num_cuenta
            me.beneficiario.observacion         = tr.observacion
            me.beneficiario.nombres             = tr.nombres
            me.beneficiario.apellidos           = tr.apellidos
            me.popupBeneficiario = true;
        },
        selectBeneficiario(tr){
          let me = this;
          me.beneficiario.num_identificacion  = tr.cedula;
          me.beneficiario.correo              = tr.email;
          me.beneficiario.idusuario           = tr.idusuario
          me.beneficiario.nombres             = tr.nombres
          me.beneficiario.apellidos           = tr.apellidos
          me.beneficiario.telefono            = tr.telefono
          me.responsables = []
        },
        getResponsables(){
            let me = this
            if(me.filtroCedula.length < 5){
              me.$vs.notify({
              text:'Minimo 5 caracteres para la búsqueda',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return;
            }
            this.$http.get(this.$server_url+'get_responsables_pedidos?cedula='+me.filtroCedula)
            .then(res => {
                me.responsables = res.data
                if(me.responsables.length == 0){
                  me.ifCrearBeneficiario = true;
                  me.beneficiario.num_identificacion = me.filtroCedula
                }else{
                  me.ifCrearBeneficiario = false
                }
            })
        },
        getBeneficiarios(){
          let me = this
          me.beneficiarios = []
          me.arregloPorcentajes = []
          var pedidoId = 0;
          if(me.detalles == 1){
              pedidoId = me.pedido_idBusqueda
          }else{
              pedidoId = me.pedido.id_pedido
          }
          var url = ""
          //tipoUrl => 0 => VENTA REAL GENERAL; 1 => VENTA REAL POR VERIFICACION
          if(me.desdeVerificacion == '0' || me.desdeVerificacion == '2') {
            url = this.$server_url+'getBeneficiarios/'+pedidoId+'/0/0'
          }else{
            url = this.$server_url+'getBeneficiarios/'+pedidoId+'/1/'+me.VerificacionSelect.id
          }
          this.$http.get(url)
          // this.$http.get(this.$server_url+'get_beneficiarios_pedidos/'+pedidoId)
          .then(res => {
            if(res.data.status == 0){
              me.$vs.notify({
                text: res.data.message,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time:5000,
              })
              return
            }
            me.beneficiarios        = res.data
            if(me.beneficiarios.length > 0){
              let totalAlcances     = me.beneficiarios[0].total_alcances
              me.comision           = me.beneficiarios[0].descuento
              me.ventaBruta         = me.beneficiarios[0].total_venta + totalAlcances
              me.ventaReal          = me.beneficiarios[0].ventaReal
              me.valorComisionReal  = me.beneficiarios[0].valorComisionReal
              me.valorComision      = (me.ventaBruta * me.comision) / 100
              me.renderPorcentajes()
            }
            // me.popupBeneficiario = false
            me.ifCrearBeneficiario  = false
          })
        },
        renderPorcentajes(){
          let me = this;
          me.tipo = me.getTipo()
          console.log("tipo",me.tipo)
          //si es igual a comision 40% por ejemplo
          if(me.tipo == 1){
            me.beneficiarios.forEach(element => {
              var cal = new Object();
              cal.beneficiario            = element.beneficiario
              cal.nombres                 = element.nombres
              cal.apellidos               = element.apellidos
              cal.cedula                  = element.cedula
              cal.id_beneficiario_pedido  = element.id_beneficiario_pedido
              cal.id_pedido               = element.id_pedido
              cal.id_usuario              = element.id_usuario
              cal.cod_usuario             = element.cod_usuario
              cal.tipo_identificacion     = element.tipo_identificacion
              cal.direccion               = element.direccion
              cal.correo                  = element.correo
              cal.comision                = element.comision
              cal.valor                   = element.valor
              cal.banco                   = element.banco
              cal.tipo_cuenta             = element.tipo_cuenta
              cal.num_cuenta              = element.num_cuenta
              cal.observacion             = element.observacion
              cal.porcentaje              = ((element.comision * 100)/ me.comision)
              let prePorcentaje           =  ((element.comision * 100)/ me.comision)
              cal.porcentajeReal          = ((element.comision * 100)/ element.comisionReal)
              let prePorcentajeReal       = ((element.comision * 100)/ element.comisionReal)
              cal.valorPorcentaje         = (me.valorComision * prePorcentaje) / 100
              cal.valorPorcentajeReal     = (element.valorComisionReal * prePorcentajeReal) / 100
              me.arregloPorcentajes.push(cal)
            })
          }
          //si es igual al 100%
          if(me.tipo == 2){
            me.beneficiarios.forEach(element => {
              var cal = new Object();
              cal.beneficiario            = element.beneficiario
              cal.cedula                  = element.cedula
              cal.nombres                 = element.nombres
              cal.apellidos               = element.apellidos
              cal.id_beneficiario_pedido  = element.id_beneficiario_pedido
              cal.id_pedido               = element.id_pedido
              cal.id_usuario              = element.id_usuario
              cal.cod_usuario             = element.cod_usuario
              cal.tipo_identificacion     = element.tipo_identificacion
              cal.direccion               = element.direccion
              cal.correo                  = element.correo
              cal.comision                = element.comision
              cal.valor                   = element.valor
              cal.banco                   = element.banco
              cal.tipo_cuenta             = element.tipo_cuenta
              cal.num_cuenta              = element.num_cuenta
              cal.observacion             = element.observacion
              cal.porcentaje              = element.comision
              cal.porcentajeReal          = element.comision
              cal.valorPorcentaje         = (me.valorComision * element.comision) / 100
              cal.valorPorcentajeReal     = (me.valorComisionReal * element.comision) / 100
              me.arregloPorcentajes.push(cal)
            })
          }
          if(me.tipo == 3){
            me.beneficiarios.forEach(element => {
              var cal = new Object();
              cal.beneficiario            = element.beneficiario
              cal.cedula                  = element.cedula
              cal.nombres                 = element.nombres
              cal.apellidos               = element.apellidos
              cal.id_beneficiario_pedido  = element.id_beneficiario_pedido
              cal.id_pedido               = element.id_pedido
              cal.id_usuario              = element.id_usuario
              cal.cod_usuario             = element.cod_usuario
              cal.tipo_identificacion     = element.tipo_identificacion
              cal.direccion               = element.direccion
              cal.correo                  = element.correo
              cal.comision                = element.comision
              cal.valor                   = element.valor
              cal.banco                   = element.banco
              cal.tipo_cuenta             = element.tipo_cuenta
              cal.num_cuenta              = element.num_cuenta
              cal.observacion             = element.observacion
              cal.porcentaje              = 0
              cal.porcentajeReal          = 0
              cal.valorPorcentaje         = 0
              cal.valorPorcentajeReal     = 0
              me.arregloPorcentajes.push(cal)
            })
          }
          if(me.desdeVerificacion == '0' || me.desdeVerificacion == '2'){
            me.updatePedido()
          }
        },
        getTipo(){
          let me = this;
          //TOTAL COMISION
          let total = me.beneficiarios.reduce((a, b) => a + (b["comision"] || 0), 0);
          //si es igual a comision 40% por ejemplo
          if(total == me.comision){
            return 1
          }
          //si es igual al 100
          if(total == 100){
            return 2
          }
          else{
            return 3
          }
        },
        updatePedido(){
          let me = this;
          if(me.arregloPorcentajes.length == 0)        { return }
          let formData = new FormData();
          formData.append('todo',                     'yes')
          formData.append('beneficiarios',             JSON.stringify(me.arregloPorcentajes));
          this.$http.post(this.$server_url+'updateBeneficiarios', formData)
          .then(res => {
          })
        },
        filtrarDecimal(numero){
          let me = this
          if(numero == 0 || numero == null){
              return numero
          }else{
              const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              return transformar
          }
        },
        async saveBeneficario(){
            let me = this;
            if( me.responsable == '' || me.beneficiario.tipo_identificacion == '' || me.beneficiario.num_identificacion == '' || me.beneficiario.ciudad == '' || me.beneficiario.direccion == '' || me.beneficiario.comision == ''){
                me.$vs.notify({ color: 'warning', title: 'Alerta', text: 'Complete todos los campos antes de guardar.' })
                return
            }
            //registrar un nuevo beneficiario (registrar nuevo usuario)
            if(me.ifCrearBeneficiario){
                me.guardarNuevoBeneficiario()
            }else{
                me.guardar_beneficiario()
            }
        },
        async guardarNuevoBeneficiario() {
            let me = this
            if(me.id_institucion == "undefined" || me.id_institucion == "" || me.id_institucion == null || me.id_institucion == undefined){
                me.$vs.notify({ color: 'warning', title: 'Alerta', text: 'Seleccione una institución.' })
            }
            if( me.beneficiario.nombres == '' || me.beneficiario.apellidos == '' || me.beneficiario.correo == '' ||  me.beneficiario.telefono == '' || me.beneficiario.direccion == ''){
                me.$vs.notify({ color: 'warning', title: 'Alerta', text: 'Complete todos los campos antes de guardar.' })
                return
            }
            me.$vs.loading();
            let formData = new FormData();
            formData.append('cedula',                   this.beneficiario.num_identificacion);
            formData.append('nombres',                  this.beneficiario.nombres);
            formData.append('apellidos',                this.beneficiario.apellidos);
            formData.append('email',                    this.beneficiario.correo);
            formData.append('telefono',                 this.beneficiario.telefono);
            formData.append('institucion_idInstitucion',this.id_institucion);
            formData.append('idcreadorusuario',         this.usuario_creador.idusuario);
            formData.append('direccion',                me.beneficiario.direccion);
            this.$http.post(this.$server_url+'guardar_responsable_pedido', formData)
            .then(function (response) {
                me.$vs.loading.close();
                if(response.data.status == 0){
                    me.$vs.notify({ color: 'danger', title:'Error' , text: response.data.message, time:4000})
                    return
                }
                me.$vs.notify({ color: 'success', title: 'Éxito', text: 'Responsable registrado correctamente.' })
                me.beneficiario.idusuario = response.data.idusuario
                me.guardar_beneficiario()
            })
            .catch(function (error) {
              me.$vs.loading.close()
                if (error.response.status == 422) {
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.cedula[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.nombres[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.apellidos[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.email[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.password[0] })
                    } catch (error) {
                    }
                }
            })
        },
        async guardar_beneficiario() {
            let me = this
            me.$vs.loading();
            let formData = new FormData();
            formData.append('id_beneficiario',     me.id_beneficiario);
            formData.append('id_pedido',           me.id_pedido);
            formData.append('institucion',         localStorage.institucion_selected_pedido);
            formData.append('nombres',             me.beneficiario.nombres)
            formData.append('apellidos',           me.beneficiario.apellidos)
            formData.append('telefono',            me.beneficiario.telefono)
            if(me.usuario_creador.id_group == 11){
                formData.append('id_asesor',          me.usuario_creador.idusuario);
                formData.append('id_responsable',     me.usuario_creador.idusuario);
            }else{
                formData.append('id_responsable',      me.id_asesor_pedido);
                formData.append('id_asesor',           me.id_asesor_pedido);
            }
            formData.append('idusuario',           me.beneficiario.idusuario)
            formData.append('tipo_identificacion', me.beneficiario.tipo_identificacion);
            formData.append('num_identificacion',  me.beneficiario.num_identificacion);
            formData.append('direccion',           me.beneficiario.direccion);
            formData.append('comision',            me.beneficiario.comision);
            formData.append('valor',               0); // valor calculado de la comision
            formData.append('banco',               me.beneficiario.banco);
            formData.append('tipo_cuenta',         me.beneficiario.tipo_cuenta);
            formData.append('num_cuenta',          me.beneficiario.num_cuenta);
            formData.append('correo',              me.beneficiario.correo);
            formData.append('observacion',         me.beneficiario.observacion);
            formData.append('id_group',            me.usuario_creador.id_group)
            this.$http.post(this.$server_url+'save_beneficiarios_pedido', formData)
            .then(res => {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:8000
                    })
                    return
                }
                if(res.data.error){
                    me.$vs.notify({
                    text:res.data.error,
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:8000
                    })
                    return
                }
                me.popupBeneficiario = false
                me.getBeneficiarios()
                me.$emit('rechargePedido',true)
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close();
            })
        },
        UpdateFechaCreacionPedido(id_pedido) {
            let me = this;
            this.$http.get(this.$server_url+'UpdateFechaCreacionPedido/'+id_pedido)
            .then(function (res) {
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        eliminar_beneficiario(item){
            let me = this
            me.id_beneficiario = item.id_beneficiario_pedido
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este beneficiario?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.confirm_eliminar_beneficiario
            })
        },
        confirm_eliminar_beneficiario(){
            let me = this
            me.$vs.loading();
            let formData = new FormData();
            formData.append('id_pedido',       me.id_pedido)
            formData.append('id_beneficiario', me.id_beneficiario)
            this.$http.post(this.$server_url+'eliminar_beneficiario_pedido',formData)
            .then(res => {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    this.$vs.notify({
                    text:'Debe completar todos los campos antes de guardar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                me.getBeneficiarios()
                me.$emit('rechargePedido',true)
            })
            .catch((err) =>{
                me.$vs.loading.close();
            })
        },
        setInstitucion(){
            this.id_institucion = localStorage.institucion_selected_pedido
        },
    },
}
</script>
<style scoped>
.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}

</style>
