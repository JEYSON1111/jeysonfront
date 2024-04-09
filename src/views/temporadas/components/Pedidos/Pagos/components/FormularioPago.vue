<template>
    <div class="mt-5">
      <div class="vx-row mb-6">
        <div class="vx-col w-1/2">
          <span>Tipo de Pago:</span>
          <v-select :options="arrayTiposPagos"  :reduce="arrayTiposPagos => arrayTiposPagos.id" label="nombre" class="w-full" v-model="sendValor.tipo_pago_id" />
          <div v-if="sendValor.tipo_pago_id">
            <vs-alert v-if="sendValor.tipo_pago_id == 4" class="mt-3" color="warning">!Solo puede existir un pago de convenio por contrato</vs-alert>
            <vs-alert v-if="sendValor.tipo_pago_id == 3" class="mt-3" color="warning">El valor de las deudas tienen que ir con negativo - <b>(Estas deudas apareceran en el proximo año)</b></vs-alert>
          </div>
        </div>
        <div class="vx-col w-1/2">
          <span>Forma de pago:</span>
          <v-select :options="arrayFormasPagos"  :reduce="arrayFormasPagos => arrayFormasPagos.tip_pag_codigo" label="tip_pag_nombre" class="w-full" v-model="sendValor.forma_pago_id" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-1/2">
          <span>Varios Documentos:</span>
          <ul class="flex mt-3">
            <li>
              <vs-radio v-model="sendValor.unicoEvidencia" class="mr-3" vs-name="radios1unicoEvidencia" vs-value="0">No</vs-radio>
            </li>
            <li>
              <vs-radio v-model="sendValor.unicoEvidencia" vs-name="radios1unicoEvidencia" vs-value="1">Si</vs-radio>
            </li>
          </ul>
        </div>
        <div class="vx-col w-1/2" v-if="sendValor.tipo_pago_id == 1">
          <span>Registar como Anticipo del Pedido:</span>
          <ul class="flex mt-3">
            <li>
              <vs-radio v-model="sendValor.ifAntAprobado" class="mr-3" vs-name="radios1ifAntAprobado" vs-value="0">No</vs-radio>
            </li>
            <li>
              <vs-radio v-model="sendValor.ifAntAprobado" vs-name="radios1ifAntAprobado" vs-value="1">Si</vs-radio>
            </li>
          </ul>
        </div>
        <!--varias evidencias-->
        <div v-if="sendValor.unicoEvidencia == 1">
          <div>
            <vs-alert active="true" color="warning" class="ml-5">
              Varios Documentos tienen utilidad para <b>Gift cards</b> que tienen varios registros asi como los registros de <b>Convenio</b>
            </vs-alert>
          </div>
        </div>
      </div>
      <!--EVIDENCIAS-->
      <div >
        <div class="vx-row" v-if="sendValor.unicoEvidencia == 0 ">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <!--TIPOS PAGOS FACTURACION-->
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input class="w-full" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Valor" v-model="sendValor.valor" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Código / Número documento" v-model="sendValor.doc_numero" />
              </div>
            </div>
          </div>
          <!--FIN TIPOS PAGOS FACTURACION-->
          <!--FILE-->
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <p>Evidencia:</p>
              <p class="mt-1"></p>
              <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                  <div class=" box upload-container">
                      <input type="file" name="filePago" id="filePago" v-on:change="uploadFiles()" />
                  </div>
                  <br>
              </div>
              <!--BASE-->
              <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                  <div class="flex" style="justify-content: center;">
                      <div class="flex" style="flex-direction: column;">
                          <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/pedidos/pagos/'+imgOld" style="border-radius: 5px;margin: 0 auto;">
                          <small class="mt-1 ml-2">{{ imgOld }}</small>
                      </div>
                      <vs-button radius type="line" @click="ifSaveImagen = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </div>
              </div>
              <!--LOCAL-->
              <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                  <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                      <div class="flex" style="flex-direction: column;">
                          <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                          <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                          <small class="mt-1 ml-2">{{ tr.name }}</small>
                      </div>
                      <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </div>
              </div>
          </div>
        </div>
        <div v-else>
          <div class="flex mt-5" style="justify-content: center;" v-if="id == 0">
            <vs-button class="mr-3 mb-2" style="color:white;!important" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar Pago</vs-button>
          </div>
          <vs-alert class="mt-3"  v-if="id == 0" title="Mensaje" color="rgb(231, 154, 23)" active="true">
            En los pagos de varios Documentos <b>GUARDE</b> primero para habilitar el boton para subir varias evidencias
          </vs-alert>
          <div v-else>
            <div class="flex mt-5" style="justify-content: center;">
              <vs-button class="mr-3 mb-2" style="color:white;!important" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar Pago</vs-button>
            </div>
            <ScreenGiftCardVue class="mt-3" :ObjectPadre="ObjectPadre"/>
          </div>
        </div>
        <div class="flex mt-5" style="justify-content: center;" v-if="sendValor.unicoEvidencia == 0">
          <vs-button class="mr-3 mb-2" style="color:white;!important" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar Pago</vs-button>
        </div>
      </div>
      <br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import axios from 'axios'
const ScreenGiftCardVue = () => import('./gitCard/ScreenGiftCard.vue')
	export default{
    components:{
      vSelect,
      ScreenGiftCardVue,
    },

    data(){
      return{
        //VARIABLES IMAGEN
        attachmentArray:[],
        tipoFile:'',
        ifSaveImagen:false,
        //FIN VARIABLES IMAGEN
        sendValor:{
          valor:'',
          doc_numero:'',
          idusuario:'',
          distribuidor_temporada_id:'',
          forma_pago_id:'',
          tipo_pago_id:1,
          calculo:0,
          unicoEvidencia:0,
          ifAntAprobado:0,
        },
        saldoDisponible:0,
        arregloDistribuidorValores:[],
        arregloTiposPagosFacturacion:[],
        arrayFormasPagos:[],
        arrayTiposPagos:[],
        pagoAnterior:0,
        pagoId:0,
        ObjectPadre:'',
      }
    },
    provide() {
      return this.setProps();
    },
    props:{
      userRoot:{
        type:Boolean,
        default:false,
        required:true,
      },
        id:{
          type:Number,
          default:0
        },
        ObjectSelect:{
          type:Object,
          default:function(){
            return {}
          }
        },
        sendPago:{
          type:Object,
          default:function(){
            return {}
          }
        },
        usuario:{
          type:Object,
          default:function(){
            return {}
          }
        },
        imgOld:{
            type:String,
            default:'',
        },
        sendPedido:{
          type:Object,
          default:function(){
            return {}
          },
        },
    },
    watch:{
      totalPorPagar(results){
        let me = this;
        me.totalPorPagar = results
      },
      id(results){
        let me = this;
        me.id = results
      }
    },
    // inject: ['getSendPedido'],
    // computed: {
    //   sendPedido(){ return this.getSendPedido(); }
    // },
    created(){
      let me = this;
      me.getFormasPagos()
      me.getTiposPagos()
    },
    mounted(){
      let me = this;
      me.pagoId   = me.id
      me.ObjectPadre = me.ObjectSelect
      me.attachmentArray = []
      if(me.id > 0){
        me.sendValor ={
          valor:                      me.ObjectSelect.doc_valor,
          doc_numero:                 me.ObjectSelect.doc_numero,
          idusuario:                  me.ObjectSelect.idusuario,
          distribuidor_temporada_id:  me.ObjectSelect.distribuidor_temporada_id,
          forma_pago_id:              me.ObjectSelect.forma_pago_id,
          tipo_pago_id:               me.ObjectSelect.tipo_pago_id,
          calculo:                    me.ObjectSelect.calculo,
          unicoEvidencia:             me.ObjectSelect.unicoEvidencia,
          ifAntAprobado:              me.ObjectSelect.ifAntAprobado
        }
        me.imgOld                   = me.ObjectSelect.url
        if(me.imgOld){
          me.ifSaveImagen = true
        }
      }
    },
    methods:{
      setProps() {
        return {
          idPago: this.id,
        };
      },
      getDistribuidoresTemporadas() {
        let me = this;
        me.arregloDistribuidorValores = []
        const { idusuario } = me.sendValor
        if(idusuario == null || idusuario == "" || idusuario == undefined){
          me.$vs.notify({
          text:'Seleccione un distribuidor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        var url = ""
        url = this.$server_url + 'distribuidor?getDistribuidorTemporadas=yes'
        this.$http.get(url)
          .then(res => {
            me.arregloDistribuidorValores = res.data.filter(p => p.idusuario == me.sendValor.idusuario)
            me.selectSaldo()
          })
          .catch(error => {
            console.log(error)
          })
      },
      getTiposPagos(){
        let me  = this
        var url = ""
        url = this.$server_url + 'pedigo_Pagos?getTiposPagos=yes'
        this.$http.get(url)
          .then(res => {
            me.arrayTiposPagos = res.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      getFormasPagos(){
        let me  = this
        var url = ""
        url = this.$server_url + 'pedigo_Pagos?getFormasPago=yes'
        this.$http.get(url)
          .then(res => {
            me.arrayFormasPagos = res.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      selectSaldo(){
        let me = this;
        const { distribuidor_temporada_id } = me.sendValor
        if(distribuidor_temporada_id == null || distribuidor_temporada_id == "" || distribuidor_temporada_id == undefined){
          me.saldoDisponible = ""
          return
        }
        let preSaldo      = me.arregloDistribuidorValores.filter(p => p.id == me.sendValor.distribuidor_temporada_id)
        me.getSaldoDisponible()
      },
      getSaldoDisponible(){
        let me = this
        var url = ""
        url = this.$server_url + `distribuidor?getDistribuidorTemporadasXId=yes&id=${me.sendValor.distribuidor_temporada_id}`
      this.$http.get(url)
        .then(res => {
          const { saldo_actual, pendienteAprobar } = res.data[0]
          me.saldoDisponible  = saldo_actual  - pendienteAprobar
        })
        .catch(error => {
          console.log(error)
        })
      },
      removeItemFromArr (arr, item) {
          let me = this;
          const i = arr.indexOf(item)
          arr.splice(i, 1)
          document.getElementById("filePago").value = ''
      },
      uploadFiles(){
          let me = this;
          me.attachmentArray = []
          var archivo = document.getElementById("filePago").files[0];
          me.tipoFile  = ""
          if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile = "img"
          else me.tipoFile = "other"
          var reader = new FileReader();
          if (me) {
              reader.readAsDataURL(archivo );
              reader.onloadend = function () {
                  var cal = new Object();
                  cal.file = archivo
                  cal.img  = reader.result
                  cal.tipo = me.tipoFile
                  cal.name = archivo.name
                  me.attachmentArray.push(cal)
              }
          }
      },
      subirDocumento(){
        let me = this;
        const { forma_pago_id,tipo_pago_id } = me.sendValor
        if(tipo_pago_id == null || tipo_pago_id == "" || tipo_pago_id == undefined || tipo_pago_id == 0){
          me.$vs.notify({
            text: "Debe seleccionar un Tipo de pago",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        if(forma_pago_id == null || forma_pago_id == "" || forma_pago_id == undefined || forma_pago_id == 0){
          me.$vs.notify({
            text: "Debe seleccionar una forma de pago",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        // //VALIDACION DISTRIBUIDOR
        // if(me.tipo == 4){
        //   const { idusuario, valor, distribuidor_temporada_id  } = me.sendValor
        //   if(idusuario == null || idusuario == "" || idusuario == undefined || distribuidor_temporada_id == null || distribuidor_temporada_id == "" || distribuidor_temporada_id == undefined){
        //     me.$vs.notify({
        //       text: `Seleccione información distribuidor`,
        //       color: 'warning',
        //       iconPack: 'feather',
        //       icon: 'icon-alert-triangle'
        //     })
        //     return
        //   }
        // }
        if(me.sendValor.tipo_pago_id == 3){
          if(me.sendValor.valor > 0){
            me.$vs.notify({
              text: `El valor de las deudas tienen que ir con negativo -`,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
        }
        let formData = new FormData();
        formData.append('saveValorPago',            "yes")
        formData.append('unicoEvidencia',           me.sendValor.unicoEvidencia)
        formData.append('id',                       me.id)
        formData.append('doc_valor',                me.sendValor.valor)
        formData.append('doc_numero',               me.sendValor.doc_numero)
        formData.append('user_created',             me.usuario.idusuario)
        formData.append('forma_pago_id',            me.sendValor.forma_pago_id)
        formData.append('distribuidor_temporada_id',me.sendValor.distribuidor_temporada_id)
        formData.append('tipo_pago_id',             me.sendValor.tipo_pago_id)
        //ANTICIPO PEDIDO
        if(me.sendValor.tipo_pago_id == 1){        formData.append('ifAntAprobado', me.sendValor.ifAntAprobado)   }
        else{                                       formData.append('ifAntAprobado', 0)                            }
        //informacion
        formData.append('doc_nombre',               me.sendPago.nombres)
        formData.append('doc_apellidos',            me.sendPago.apellidos)
        formData.append('doc_ruc',                  me.sendPago.ruc)
        formData.append('doc_cuenta',               me.sendPago.num_cuenta)
        formData.append('doc_tipo',                 me.sendPago.tipo_cuenta)
        formData.append('doc_institucion',          me.sendPago.banco)
        formData.append('doc_observacion',          me.sendPago.observacion)
        formData.append('doc_fecha',                me.sendPago.doc_fecha)
        formData.append('ven_codigo',               me.sendPedido.contrato_generado)
        formData.append('institucion_id',           me.sendPedido.id_institucion)
        formData.append('periodo_id',               me.sendPedido.id_periodo)
        formData.append('id_pedido',                me.sendPedido.id_pedido)
        if(me.userRoot){ formData.append('permisoPago','yes') }
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
            var getId       = res.data.doc_codigo
            me.$vs.notify({
            text:"Se guardo correctamente",
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            var datos = {
              tipo:2,
              setId:getId
            }
            me.ObjectPadre = res.data
            me.$emit('showCreate',datos)
            if(me.sendValor.unicoEvidencia == 1){
              return
            }else{
              me.saveEvidencia(getId)
            }
        })
        .catch(function (error) {
            me.$vs.loading.close()
        })
      },
      saveEvidencia(getId){
        let me = this
        //files
        let imgsEnviar = []
        let formData = new FormData();
        if(me.ifSaveImagen || me.attachmentArray.length == 0){
          formData.append('noSendFiles','yes')
          return
        }else{
          me.attachmentArray.forEach(element => {
          imgsEnviar.push(element.file)
          });
          for(let i=0; i<this.attachmentArray.length;i++){
              formData.append('archivos[]',              imgsEnviar[i]);
          }
        }
        formData.append('id',                   getId)
        formData.append('saveArchivos',         'yes')
        formData.append('imgOld',               me.imgOld)
        formData.append('archivoPago',          'yes')
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post(this.$data_url + 'api/guardarDatosPedido', formData, config)
        .then(function (res) {
          document.getElementById("filePago").value = '';
          me.attachmentArray                        = []
        })
        .catch(function (error) {
        })
      }
    }
  }


</script>
<style scoped>
   .box-input{
   }
    .upload-container{
      position:relative}
      .upload-container input{
        border:1px solid #92b0b3;
        background:#217bc5;
        outline:2px dashed #92b0b3;
        outline-offset:-10px;
        padding:100px 0px 100px 130px;
        width:100%;
        color:white;
    }
      .upload-container input:hover{
        background:#2c78cf}
      .upload-container:before{
        position:absolute;
        bottom:50px;
        left:23%;
        content:" Seleccione un archivo o arrastre aqui ";
        color:#f1f9fa;
        font-weight:900
    }
      .upload-btn{
        margin-left:300px;
        padding:7px 20px}
</style>
