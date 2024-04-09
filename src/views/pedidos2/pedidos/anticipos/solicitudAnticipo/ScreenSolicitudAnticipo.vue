<template>
  <div>
    <vx-card>
        <!-- tab 2 content -->
          <div class="vx-col lg:w-full md:w-full sm:w-full mb-base">
            <!--ANTICIPO SUGERIDO-->
            <div>
              <li style="list-style: none;">
                <vs-checkbox :disabled="((userAsesor || userRoot || userFacturador) && (pedido.deuda == 0 || pedido.deuda == null )) ? false : true " v-model="pedido.ifanticipo" @input="verDocumentosAnteriores()">Solicitar anticipo</vs-checkbox>
              </li>
              <div class="flex">
                <div>
                  <p class="text-danger font-bold mt-2 ml-2">Anticipo Sugerido </p>
                  <vs-input type="number" disabled v-model="ObjectPedido.anticipo" class="mt-1" />
                </div>
                <div class="ml-3">
                  <p class="text-danger font-bold mt-2 ml-2">ANTICIPO SOLICITADO POR LA ESCUELA </p>
                  <vs-input :disabled="userAsesor && pedido.ifanticipo ? false : true" type="number" v-model="pedido.anticipoAsesor" class="mt-1" />
                </div>
              </div>
            </div>
            <!--ANTICIPO APROBADO-->
            <div v-if="groupFacturador">
              <div style="width: 100%!important;" >
                <vs-divider>Documentos Pagos</vs-divider>
                <ScreenPagosVue :sendPedido="pedido"/>
                <br>
              </div>
            </div>
          </div>
           <!--VISTA OBSERVACION-->
           <div style="width: 100%;" class="mt-5" v-if="!userAsesor">
            <vs-divider>Observación Pedido</vs-divider>
            <vs-textarea  counter="500" style="width:100%;" height="200px"  label="Observación" :counter-danger.sync="counterDanger" v-model="pedido.observacion" />
          </div>
          <vs-divider v-if="pedido.ifanticipo == 1">
            <div class="flex">
              <p>Documentos</p>
            </div>
          </vs-divider>
          <div v-if="pedido.ifanticipo == 1" class="flex" style="width: 100%;justify-content: space-between;flex-wrap: wrap;">
            <!--====UPLOAD CEDULA===-->
            <div style="width: 40%;" class="contenedor-file" v-if="pedido.ifanticipo > 0">
              <p style="text-align: center;margin-left: -10px;"><i class="fa-solid fa-cloud"></i> Foto de la copia de la cédula imagen/pdf (Máximo 5 MB)</p>
              <div class="box-input" v-show="attachmentArray.length == 0 && verImg == false">
                <div class=" box upload-container">
                    <input type="file" name="file10" id="file10" class="file10" v-on:change="uploadFiles" />
                </div>
                <br>
              </div>
              <!--IMAGEN DE LA BASE-->
              <div class="box-input" v-if="attachmentArray.length == 0 && verImg == true">
                <div class="flex" style="justify-content: center;">
                  <div class="flex" style="flex-direction: column;">
                    <img id="img1" v-if="img_opcion_old.substr(-3) == 'pdf'"  @click="verArchivo(0)" width="200" class="img-responsive mb-2 ml-1 cursor-pointer" src="@/assets/images/file-icons/pdf.png" style="border-radius: 5px;margin: 0 auto;">
                    <img id="img1" v-else width="200" @click="verImagen(0)" class="img-responsive mb-2 ml-1 cursor-pointer"  v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old" style="border-radius: 5px;margin: 0 auto;">
                    <small class="mt-1 ml-2 text-center">{{ img_opcion_old }}</small>
                  </div>
                  <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                    <vs-button radius type="line" v-if="disableAsesor == false" @click="verImg = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </vx-tooltip>
                  </div>
              </div>
              <!--ARRAY IMAGENES-->
              <div class="flex mt-1" style="margin-top: -10px;" v-if="attachmentArray.length > 0" >
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                    <div class="flex" style="flex-direction: column;">
                      <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                      <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                      <small class="mt-1 ml-2 text-center">{{ tr.name }}</small>
                    </div>
                    <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                      <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr,0)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                    </vx-tooltip>
                  </div>
              </div>
            </div>
            <!--=====UPLOAD RUC===-->
            <div style="width: 40%;" class="contenedor-file" v-if="pedido.ifanticipo > 0">
              <p style="text-align: center;margin-left: -10px;"><i class="fa-solid fa-cloud"></i> Archivo del RUC imagen/pdf (Máximo 5 MB)</p>
              <br>
              <div class="box-input" v-show="attachmentArray_ruc.length == 0 && verImg_ruc == false">
                <div class=" box upload-container">
                  <input type="file" name="file11" id="file11" class="file11" v-on:change="uploadFilesRUC" />
                </div>
                <br>
              </div>
              <!--IMAGEN DE LA BASE-->
              <div class="box-input" v-if="attachmentArray_ruc.length == 0 && verImg_ruc == true">
                <div class="flex" style="justify-content: center;">
                  <div class="flex" style="flex-direction: column;">
                    <img id="img1" v-if="img_opcion_old_ruc.substr(-3) == 'pdf'"  @click="verArchivo(1)" width="200" class="img-responsive mb-2 ml-1 cursor-pointer" src="@/assets/images/file-icons/pdf.png" style="border-radius: 5px;margin: 0 auto;">
                    <img id="img1" v-else width="200" @click="verImagen(1)" class="img-responsive mb-2 ml-1 cursor-pointer"  v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc" style="border-radius: 5px;margin: 0 auto;">
                    <small class="mt-1 ml-2 text-center">{{ img_opcion_old_ruc }}</small>
                  </div>
                  <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                    <vs-button radius type="line" v-if="disableAsesor == false" @click="verImg_ruc = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </vx-tooltip>
                  </div>
              </div>
              <!--ARRAY IMAGENES-->
              <div class="flex mt-1" style="margin-top: -10px;" v-if="attachmentArray_ruc.length > 0" >
                <div class="flex" v-for="(tr,key) in attachmentArray_ruc" :key="key" style="margin: 0 auto;">
                    <div class="flex" style="flex-direction: column;">
                      <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                      <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                        <small class="mt-1 ml-2">{{ tr.name }}</small>
                    </div>
                    <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                      <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray_ruc,tr,1)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                    </vx-tooltip>
                  </div>
              </div>
            </div>
          </div>
          <!--BOTONES PARA GUADAR/CARGAR DOCUMENTOS-->
          <div class="vx-row" v-if="(userRoot || userFacturador || usuario.idusuario == ObjectPedido.id_asesor) && ObjectPedido.ifanticipo == 1 && tmpPedidos.estado !=2 ">
            <div class="vx-col sm:w-2/3 w-full mt-2 ml-3 flex">
              <vs-button @click="subirDocumentosDespuesContrato()" v-if="ObjectPedido.contrato_generado != null" color="warning" type="border" icon-pack="feather" icon="icon-file-text" class="mb-2">Guardar documentos</vs-button>
            </div>
          </div>
          <div class="flex justify-center">
            <vs-button v-if="pedido.ifanticipo == 1 && arregloDocumentosAnteriores.length > 0" @click="cargarTodosDocumentos(2)" class="mr-3 mb-2 p-2" icon-pack="feather" icon="icon-corner-down-left">Cargar Documentos Anteriores</vs-button>
            <vs-button @click="guardarPedido()" color="success" type="border" icon-pack="feather" icon="icon-file-text" class="mb-2">Guardar</vs-button>
          </div>

          <!--FIN BOTONES PARA GUARDAR/CARGAR DOCUMENTOS-->

          <!--VISTA COMENTARIO-->

          <!--FIN VISTA COMENTARIO-->
          <!--VISTA VALORES ANTICIPOS ANTERIORES-->
          <div v-if="verAnticipos">
            <anticiposAnteriosVue :tmpPedidos="ObjectPedido" :anticipoAprobado="pedido.anticipo_aprobado" @sendDeuda="changeAnticipo"/>
          </div>
          <!--FIN VISTA VALORES ANTICIPOS ANTERIORES-->
          <!--FIN POPUP COMENTARIOS-->
          <!--VER CEDULA-->
          <vs-popup class="holamundo" fullscreen  title="Mostrar foto de evidencia" :active.sync="popupImagen">
            <div v-if="popupImagen">
              <image-zoom
                :regular="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old"
                :zoom-amount="3"
                :click-zoom="true"
                click-message="De click para aumentar"
                img-class="img-fluid"
                >
              </image-zoom>
            </div>
          </vs-popup>
          <!--VER RUC-->
          <vs-popup class="holamundo" fullscreen  title="Mostrar File RUC" :active.sync="popupRuc">
            <div v-if="popupRuc">
                <image-zoom
                :regular="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc"
                :zoom-amount="3"
                :click-zoom="true"
                click-message="De click para aumentar"
                img-class="img-fluid"
                >
              </image-zoom>
            </div>

            <!-- <img style="border-radius: 5px;" v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc"> -->
          </vs-popup>

      <!--MODALES-->
      <!--MODAL PARA AGREGAR DOCUMENTOS ANTERIORES-->
      <vs-popup classContent="popup-example" fullscreen title="Documentos Anteriores" :active.sync="popupMostrarDocumentosAnteriores">
        <documentosAnterioresVue :tmpPedidos="ObjectPedido" v-if="popupMostrarDocumentosAnteriores" :arregloDocumentosAnteriores="arregloDocumentosAnteriores" @rechargeDocumentos="rechargeDocumentos"/>
      </vs-popup>
    </vx-card>
  </div>
</template>
<script>
import Vue from 'vue';
import imageZoom from 'vue-image-zoomer';
import vSelect from 'vue-select';
import axios from 'axios'
// const pedidos_evidencia_aprobacionVue = () => import('../../../../pedidos/components/pedidos_evidencia_aprobacion.vue')
const ScreenPagosVue                  = () => import('../pagos2/ScreenPagos2.vue')
const anticiposAnteriosVue            = () => import('../../../../pedidos/components/milton/anticiposAnterios.vue')
const documentosAnterioresVue         = () => import('../../../../pedidos/components/documentosAnteriores/documentosAnteriores.vue')
import PagosRepository from '../../../../../repositories/PagoRepository';
export default {
    components:{
      'v-select': vSelect,
      ScreenPagosVue,
      anticiposAnteriosVue,
      // pedidos_evidencia_aprobacionVue,
      imageZoom,
      documentosAnterioresVue,
    },
    data: () => ({
      usuario: [],
      id_pedido: '',
      txt_finalizar: 'Finalizar',
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
        pendiente_liquidar:0,
        convenio_anios:'',
        anticipo_aprobado:0,
        contrato_generado:'',
        ifanticipo:false,
        ifagregado_anticipo_aprobado:0,
        deuda:0,
        periodo_deuda:'',
        region_idregion:0,
        historicoEstado:0,
        estado:0,

      },
      tmpPedidos:[],
      porcentaje_descuento_series_basicas:0,
      counterDanger: false,
      //variables para images
      src_imagen_opcion:'',
      img_opcion_old:'',
      verImg:false,
      popupImagen:false,
      errorImage:'no',
      tamanioError:'no',
      //fin variables para images
      //variables para ruc
      src_imagen_opcion_ruc:'',
      img_opcion_old_ruc:'',
      verImg_ruc:false,
      popupRuc:false,
      errorImage_ruc:'no',
      tamanioError_ruc:'no',
      //fin variables para ruc
      disableAsesor:false,
      disableFacturador:false,
      disableAsesorFacturador:false,
        //variables de coincidencias
      arregloIdsCoincidencias:[],
      verAnticipos:false,
      userRoot:false,
      //variable subir imagen
      attachmentArray:[],
      attachmentArray_ruc:[],
      tmpFiles:[],
      checkFueraPlataforma:false,
      //variables para documentos anteriores
      arregloDocumentosAnteriores:[],
      popupMostrarDocumentosAnteriores:false,
      //fin variables para documentos anteriores
      //modificarAnticipoAprobado => 0 =NO; 1 SI;
      modificarAnticipoAprobado:0,
      userFacturador:false,
      campo:'',
    }),
    props:{
      ObjectPedido:{
        type:Object,
        default:function(){
            return {}
        },
        required:true
      },
      userAsesor:{
        type:Boolean,
        default:false,
      },
      groupFacturador:{
        type:Boolean,
        default:false,
      },
    },
    watch:{
      ObjectPedido(results){
        let me = this
        me.sendPedido = me.ObjectPedido
        me.pedido     = results
      }
    },
    mounted() {
      let me = this;
      me.pedido = me.ObjectPedido
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      if(me.usuario.id_group == 23) me.userFacturador = true
      me.getUserRoot(me.usuario);
      if( this.usuario.id_group == 22 || this.usuario.id_group == 23 ){
        this.txt_finalizar = 'Generar contrato'
      }
      if(this.ObjectPedido.id_pedido == 0){
        localStorage.id_pedido = ''
      }else{
        localStorage.id_pedido = this.ObjectPedido.id_pedido
        me.updateDocumentos()
      }
      this.get_datos_pedido()
      this.cargarTodosDocumentos(1)
    },
    methods: {
      changeAnticipoA(e){
        let me = this
        if(e.tipo == 'guardarAnticipo'){
          me.pedido.ifagregado_anticipo_aprobado = 1
          me.pedido.anticipo_aprobado = e.value
          //si modifica el facturador o admin el anticipo aprobado lo guardare en un historico
          me.modificarAnticipoAprobado = e.modificarAnticipoAprobado
          me.updatePedido(2,'anticipo_aprobado',e.value,'ifagregado_anticipo_aprobado',1)
          return
        }
        if(e.tipo == 'guardarAnticipoContrato'){
          me.pedido.anticipo_aprobado = e.value
          me.saveAnticipoContrato()
        }
        if(e.tipo == 'guardar'){
          me.get_datos_pedido()
          return
        }
      },
      getUserRoot(dato) {
        let me = this;
        this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
          .then((result) => {
            if (result.data.length > 0) {
              me.userRoot = true;
            }
            if(this.usuario.id_group == 11 || this.userRoot == true){
              this.disableAsesor = false
              this.disableFacturador = true
            }else{
              this.disableAsesor = true
              this.disableFacturador = false
            }
          })
          .catch((err) => {
              console.log(err)
          })
      },
      //metodo para actualizar la deuda en el anticipo
      changeAnticipo(e){
        let me = this
        // me.pedido.ifanticipo                   = true
        me.pedido.deuda                        = Math.abs(e.setDeuda)
        // me.pedido.anticipo_aprobado            = Math.abs(e.setDeuda)
        me.pedido.periodo_deuda                = "Deuda período "+ e.periodo
        // me.pedido.ifagregado_anticipo_aprobado = 1
        me.guardarDeuda()
      },
      guardarDeuda(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',                    me.pedido.id_pedido);
        // formData.append('ifanticipo',                   1);
        formData.append('deuda',                        me.pedido.deuda)
        // formData.append('anticipo_aprobado',            me.pedido.anticipo_aprobado)
        formData.append('periodo_deuda',                me.pedido.periodo_deuda)
        // formData.append('ifagregado_anticipo_aprobado', 1)
        this.$http.post(this.$server_url+'guardarPedidoDeuda', formData)
        .then(function (res) {

        })
        .catch(function (error) {})
      },
      //fin metodos para las deudas anteriores
      get_datos_pedido(){
        let me = this
        this.$http.get(this.$server_url+'get_datos_pedido/'+me.pedido.id_pedido)
        .then(res => {
          let datos = res.data.pedido[0]
          me.tmpFiles   = res.data.files
          me.img_opcion_old                 = datos.imagen
          //RUC
          me.img_opcion_old_ruc             = datos.doc_ruc
          me.getIdsMilton(datos)
          //fin datos institucion
          //SETEAR CEDULA
          if(me.img_opcion_old == null || me.img_opcion_old == "" || me.img_opcion_old == "null"){
            me.verImg = false;
          }else{
            me.verImg = true;
          }
          //SETEAR RUC
          if(me.img_opcion_old_ruc == null || me.img_opcion_old_ruc == "" || me.img_opcion_old_ruc == "null"){
            me.verImg_ruc = false;
          }else{
            me.verImg_ruc = true;
          }
          //FIN SETEAR
          if(datos.ifanticipo == 1){
            me.pedido.ifanticipo = true
          }
          if(datos.ifanticipo == 0){
            me.pedido.ifanticipo = false
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      getIdsMilton(tr){
        let me = this
        var preCoincicias2 = ''
        var preArreglo = []
        if(tr.codigo_mitlon_coincidencias == "null" || tr.codigo_mitlon_coincidencias == null || tr.codigo_mitlon_coincidencias == ""){
        }else{
          let transforWords = tr.codigo_mitlon_coincidencias
          preCoincicias2 = transforWords.split(",")
        }
        //si no coincidencias en campo codigo milton coincidenias
        if(preCoincicias2 == ""){
        }else{
          preArreglo.push(preCoincicias2)
        }
        //setear array
        me.arregloIdsCoincidencias = preArreglo.flat()
        //no agregar ids duplicados
        let resolve = me.arregloIdsCoincidencias.filter( p => p == tr.codigo_institucion_milton )
        if(resolve.length == 0){
          me.arregloIdsCoincidencias.push(tr.codigo_institucion_milton)
        }
        me.verAnticipos = true
      },
      verImagen(archivo){
        let me = this;
        //cedula
        if(archivo == 0) { me.popupImagen = true }
        else             { me.popupRuc = true }
      },
      verArchivo(tip){
        let me = this;
        var url
        //tipo = 0 cedula ; 1 = ruc
        if(tip == 0){
          url = this.$data_url+'archivos/pedidos/img/img_cedula/'+me.img_opcion_old
        }else{
          url = this.$data_url+'archivos/pedidos/img/img_cedula/'+me.img_opcion_old_ruc
        }
        window.open(url)
      },
      uploadFiles(e){
        let me = this;
        me.attachmentArray    = []
        me.verImg             = false
        me.src_imagen_opcion  = ' ';
        me.errorImage = 'no'
        me.tamanioError="no"
        let validar = e.target.files[0].type;
        let tamanio = e.target.files[0].size;
        if(tamanio > 5000000){
          me.tamanioError="yes"
          me.$vs.notify({
          text:'El tamaño de la imagen excede 5MB',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg' || validar == 'application/pdf'){
          me.errorImage = 'no'
        }else{
          me.errorImage = 'yes'
          me.$vs.notify({
          text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg/pdf',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //var archivo = document.getElementById("file1").files[0];
        var archivo = e.target.files[0];
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
      uploadFilesRUC(e){
        let me = this;
        me.attachmentArray_ruc    = []
        me.verImg_ruc             = false
        me.src_imagen_opcion_ruc  = ' ';
        me.errorImage_ruc         = 'no'
        me.tamanioError_ruc       = "no"
        let validar = e.target.files[0].type;
        let tamanio = e.target.files[0].size;
        if(tamanio > 5000000){
          me.tamanioError_ruc     = "yes"
          me.$vs.notify({
          text:'El tamaño de la imagen excede 5MB',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg' || validar == 'application/pdf'){
          me.errorImage_ruc = 'no'
        }else{
          me.errorImage_ruc = 'yes'
          me.$vs.notify({
          text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg/pdf',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //var archivo = document.getElementById("file1").files[0];
        var archivo = e.target.files[0];
        me.tipoFile_ruc  = ""
        if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile_ruc = "img"
        else me.tipoFile_ruc = "other"
        var reader = new FileReader();
        if (me) {
          reader.readAsDataURL(archivo );
          reader.onloadend = function () {
            var cal = new Object();
            cal.file = archivo
            cal.img  = reader.result
            cal.tipo = me.tipoFile_ruc
            cal.name = archivo.name
            me.attachmentArray_ruc.push(cal)
          }
        }
      },
      removeItemFromArr (arr, item,archivo) {
        //cedula
        if(archivo == 0){
          this.verImg = false
          document.getElementById("file10").value = '';
        }else{
          this.verImg_ruc = false
          document.getElementById("file11").value = '';
        }
        const i = arr.indexOf(item)
        arr.splice(i, 1)
      },
      //guadar el estado para el facturador pueda ver o no

      //GUADAR EL ANTICIPO DESPUES DEL CONTRATO
      saveAnticipoContrato(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('anticipo_aprobado',    me.pedido.anticipo_aprobado)
        formData.append('contrato',             me.pedido.contrato_generado)
        formData.append('user_created',         me.usuario.idusuario)
        formData.append('id_group',             me.usuario.id_group)
        me.$vs.loading()
        this.$http.post(this.$server_url+'guardarAnticipoAprobadoContrato', formData)
        .then(res => {
          me.$vs.loading.close()
          me.get_datos_pedido()
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch((e)=>{
          me.$vs.loading.close()
        })
      },
      updatePedido(numero,campo,valor,campo2,valor2){
        let me = this
        let formData = new FormData();
        if(numero == 1) { formData.append('unCampo', 'yes'); }
        if(numero == 2) { formData.append('actualizarDosCampo', 'yes'); }
        formData.append('id_pedido',                  me.pedido.id_pedido);
        formData.append('campo',                      campo)
        formData.append('campo2',                     campo2)
        formData.append('valor',                      valor)
        formData.append('valor2',                     valor2)
        me.$vs.loading()
        this.$http.post(this.$server_url+'updateThePedido', formData)
        .then(res => {
          me.$vs.loading.close()
          me.$emit('rechargePedido',true)
          me.get_datos_pedido()
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch((e)=>{
          me.$vs.loading.close()
        })
      },
      guardarPedido(){
        let me = this
        if(me.pedido.estado == 2){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'No se puede modificar el pedido anulado',
            time:5000,
            })
          return false
        }
        var fileImgPreg = ""
        var fileImgPreg_ruc = ""
        if(me.pedido.ifanticipo > 0){
          if(me.verImg == false){
            //subir la foto de la cedula de anticipo
            if(me.attachmentArray.length == 0){
              me.$vs.notify({
                text: "Suba la foto de la cédula para evidencia del anticipo",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          if(me.verImg_ruc == false){
            //subir la archivo para el RUC
            if(me.attachmentArray_ruc.length == 0){
              me.$vs.notify({
                text: "Suba el archivo del ruc por favor",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          //VALIDACION CEDULA
          if(me.tamanioError == 'yes'){
            me.$vs.notify({
            text:'El tamaño de la imagen de la cedula excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage == 'yes'){
            me.$vs.notify({
            text:'El formato de la imagen de la cedula solo se acepta jpg/png/jpeg',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          //VALIDACION RUC
          if(me.tamanioError_ruc == 'yes'){
            me.$vs.notify({
            text:'El tamaño del archivo del ruc excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage_ruc == 'yes'){
            me.$vs.notify({
            text:'El formato del archivo del ruc solo se acepta jpg/png/jpeg/',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.pedido.anticipoAsesor > 0){
            //si el anticipo que quiere el asesor es menor que el anticipo  sugerido
            // if(me.pedido.anticipoAsesor < me.pedido.anticipo){
            //   me.$vs.notify({
            //   text:'El anticipo que desea no puede ser menor que el anticipo segerido',
            //   color:'warning',
            //   iconPack: 'feather',
            //   icon:'icon-check'})
            //   return false;
            // }
          }
        }
        //CEDULA
        if(document.getElementById("file10") != null){
          fileImgPreg     = document.getElementById("file10").files[0];
        }
        if(document.getElementById("file11") != null){
          fileImgPreg_ruc = document.getElementById("file11").files[0];
        }
        //RUC
        //actualizar fecha creacion pedido
        if(me.pedido.id_pedido > 0 && me.usuario.id_group == 11){
          me.UpdateFechaCreacionPedido(me.pedido.id_pedido)
        }
        let formData = new FormData();
        me.$vs.loading()
        formData.append('id_pedido',            me.pedido.id_pedido);
        // formData.append('anticipo',             me.pedido.anticipo);
        //cedula
        formData.append('imagen',               fileImgPreg);
        formData.append('img_opcion_old',       me.img_opcion_old)
        //ruc
        formData.append('doc_ruc',              fileImgPreg_ruc);
        formData.append('img_opcion_old_ruc',   me.img_opcion_old_ruc)
        let ianticipo = 0
        if(me.pedido.ifanticipo) {
          ianticipo = 1
        }
        else{
          ianticipo = 0
        }
        formData.append('ifanticipo',           ianticipo);
        formData.append('anticipoAsesor',       me.pedido.anticipoAsesor)
        // formData.append('convenio_anios',       me.pedido.convenio_anios)
        //fin para actualizar la institucion
        me.$vs.loading();
        axios.post(this.$data_url+'api/guardarPedido',formData)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          if( res.data.error ){
            alert(res.data.error)
            return
          }else{
            me.src_imagen_opcion     = '';
            me.src_imagen_opcion_ruc = "";
            if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
              document.getElementById("file10").value = '';
              document.getElementById("file11").value = '';
            }

          }
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargePedido',true)
          me.get_datos_pedido()
          me.generateAnticipoAprobado()
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
      //===METODOS PARA ACTUALIZAR DOCUMENTOS ANTERIORES=====
      updateDocumentos(){
        let me = this;
        this.$http.get(this.$server_url+'updateDocumentoAnterior/'+me.ObjectPedido.id_pedido+'/'+'0')
          .then(function (res) {
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      //===METODOS DOCUMENTOS ANTERIORES========
      rechargeDocumentos(e){
        let me = this;
        //0 => only recharge; 1 => recharge and load pedido
        if(e == 0){
          me.popupMostrarDocumentosAnteriores = false;
        }
        if(e == 1){
          me.popupMostrarDocumentosAnteriores = false;
          me.get_datos_pedido()
          me.updateDocumentos()
          setTimeout(function(){
            me.pedido.ifanticipo = true
          }, 2000);
        }
      },
      verDocumentosAnteriores(){
        let me = this
        let mensaje = ""
        if(me.pedido.ifanticipo){
          mensaje = "activar anticipo"
        }else{
          mensaje = "desactivar anticipo"
        }
        if(me.userFacturador || me.userRoot){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo cambiar',
            cancelText:'Cancelar',
            text: `Estas seguro de ${mensaje} .`,
            accept:this.acceptCambiarAnticipo
          })
          return
        }
        if(me.pedido.ifanticipo){
          me.cargarTodosDocumentos(2)
        }
      },
      cargarTodosDocumentos(proceso){
        let me = this;
        me.$vs.loading()
          this.$http.get(this.$server_url+'getTraerDocumentoDocente/'+me.ObjectPedido.id_pedido)
          .then(function (res) {
            me.$vs.loading.close()
            let datos = res.data
            me.arregloDocumentosAnteriores       = datos.filter(p => p.id_periodo != me.ObjectPedido.id_periodo)
            if(proceso == 2 && me.arregloDocumentosAnteriores.length > 0) {  me.popupMostrarDocumentosAnteriores = true }
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },
      acceptCambiarAnticipo(){
        let me = this;
        me.campo = 'ifanticipo'
        let valor = 0
        if(me.pedido.ifanticipo){
          valor = 1
        }else{
          valor = 0
        }
        me.actualizarPedido(valor)
      },
      //===FIN METODOS DOCUMENTOS ANTERIORES====
      //===METODOS SUBIR DOCUMENTOS DESPUES DEL CONTRATO===
      subirDocumentosDespuesContrato(){
        let me = this
        if(me.ObjectPedido.estado == 2){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'No se puede modificar el pedido anulado',
            time:5000,
            })
          return false
        }
        var fileImgPreg = ""
        var fileImgPreg_ruc = ""
        if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
          if(me.verImg == false){
            //subir la foto de la cedula de anticipo
            if(me.attachmentArray.length == 0){
              me.$vs.notify({
                text: "Suba la foto de la cédula para evidencia del anticipo",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          if(me.verImg_ruc == false){
            //subir el archivo para el RUC
            if(me.attachmentArray_ruc.length == 0){
              me.$vs.notify({
                text: "Suba el archivo del ruc por favor",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          //VALIDACION CEDULA
          if(me.tamanioError == 'yes'){
            me.$vs.notify({
            text:'El tamaño de la imagen de la cedula excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage == 'yes'){
            me.$vs.notify({
            text:'El formato de la imagen de la cedula solo se acepta jpg/png/jpeg/pdf',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          //VALIDACION RUC
          if(me.tamanioError_ruc == 'yes'){
            me.$vs.notify({
            text:'El tamaño del archivo del ruc excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage_ruc == 'yes'){
            me.$vs.notify({
            text:'El formato del archivo del ruc solo se acepta jpg/png/jpeg/pdf',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
        }
        //CEDULA
        if(document.getElementById("file10") != null){
          fileImgPreg     = document.getElementById("file10").files[0];
        }
        //RUC
        if(document.getElementById("file11") != null){
          fileImgPreg_ruc = document.getElementById("file11").files[0];
        }
        let formData = new FormData();
        me.actualizarPedidoSinValor("documentos Imagenes")
        me.$vs.loading()
        formData.append('id_pedido',            me.pedido.id_pedido);
        //cedula
        formData.append('imagen',               fileImgPreg);
        formData.append('img_opcion_old',       me.img_opcion_old)
        //ruc
        formData.append('doc_ruc',              fileImgPreg_ruc);
        formData.append('img_opcion_old_ruc',   me.img_opcion_old_ruc)
        //fin para actualizar la institucion
        me.$vs.loading();
        axios.post(this.$data_url+'api/guardarDocumentosDespuesContrato',formData)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          if( res.data.error ){
            alert(res.data.error)
            return
          }else{
            me.src_imagen_opcion     = '';
            me.src_imagen_opcion_ruc = "";
            if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
              document.getElementById("file10").value = '';
              document.getElementById("file11").value = '';
            }
          }
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.getPedidos()
          me.updateDocumentos()
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      },
      actualizarPedidoSinValor(campo){
          let me = this;
          let formData = new FormData();
          //noCambios cuando no voy a actualizar nada solo voy a poner en el historico que hubo cambio en el convenio
          formData.append('noCambios',  "yes")
          formData.append('campo',      campo)
          formData.append('id_pedido',  me.pedido.id_pedido);
          formData.append('valor',      "");
          formData.append('user_created',me.usuario.idusuario)
          this.$http.post(this.$server_url+'actualizarPedido', formData)
          .then(function (res) {
          })
          .catch(function (error) {})
        },
      //===FIN METODOS PARA SUBIR DOCUMENTOS DESPUES DEL CONTRATO====
      //===METODOS ROOT========
      actualizarPedido(valor){
        let me = this;
        let formData = new FormData();
        formData.append('actualizarCampo','yes')
        formData.append('campo',      me.campo)
        formData.append('id_pedido',  me.pedido.id_pedido);
        formData.append('valor',      valor);
        formData.append('user_created',me.usuario.idusuario)
        this.$http.post(this.$server_url+'actualizarPedido', formData)
        .then(function (res) {
          me.$vs.notify({
            text: res.data.message,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.get_datos_pedido()
        })
        .catch(function (error) {})
      },
      //===FIN METODOS ROOT====
  },
}
</script>
<style scoped>
  @media(max-width: 540px) {
    .text-convenio{
      display: none;
    }
  }
  @media(max-width: 414px) {
    .text-anticipoA{
      width: 100%!important;
    }
    .btnGuardar{
      margin: 0 auto;
      margin-top: -20px;
    }
    .text-convenio{
      display: none;
    }
    .text-observacion{
      width: 100%!important;
      margin-top: -30px!important;
    }

    .text-imagen{
      margin-top: 10px;
      width: 100%!important;
    }
  }
  @media(max-width: 414px) {
    .deuda{
      width: 100%!important;
    }
  }
  @media(max-width: 1280px) {
    .contenedor-file{
      width: 80%!important;
      margin: 0 auto;
    }
  }
  @media(max-width: 540px) {
    .contenedor-file{
      width: 100%!important;
    }
    .upload-container input{
      padding:100px 0px 100px 77px!important;
      font-size: 12px!important;
    }
  }
  @media(max-width: 414px) {
    .contenedor-file{
      width: 100%!important;
    }
    .upload-container input{
      padding:100px 0px 100px 17px!important;
      font-size: 8px!important;
    }
  }
  @media(max-width: 375px) {
    .upload-container input{
      padding:100px 0px 100px 17px!important;
      font-size: 8px!important;
    }
    .text-convenio{
      display: none;
    }
    .text-observacion{
      width: 100%!important;
      margin-top: -30px!important;
    }
    .text-imagen{
      margin-top: 10px;
      width: 100%!important;
    }
    .text-anticipoA{
      width: 100%!important;
    }
    .btnGuardar{
      margin: 0 auto;
      margin-top: -10px;
    }
  }
  /*Estilos para subir foto */
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
      left:26%;
      font-size: 13px;
      content:" Seleccione una archivo o arrastrelo ";
      color:#f1f9fa;
      font-weight:900;
    }
    input[type=file]::file-selector-button {
      margin-right: 10px;
      border: none;
      background: #000;
      padding: 10px 20px;
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      transition: background .2s ease-in-out;
    }
  input[type=file]::file-selector-button:hover {
    background: #0d45a5;
  }
</style>
