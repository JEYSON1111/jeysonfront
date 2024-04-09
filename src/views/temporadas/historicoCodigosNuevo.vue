<template>
    <div>
        <vx-card
        title="Información de Verificaciones"
        title-color="primary"
        :subtitle="nombreInstitucion">
            <div style="display:flex;margin-left:20px;" v-if="desdePedido == 0">
              <div>
                  <vs-input icon="search" @keyup.enter="getInformacionLiquidacion()" placeholder="Buscar Contrato" v-model ="contrato"/>
              </div>
              <div>
                  <vs-button radius color="primary" @click="getInformacionLiquidacion()" type="border" style="margin-left:10px;" icon="search"></vs-button>
              </div>
            </div>
            <!--VENTA REAL-->
            <!-- <VentaRealVue v-if="contrato" :contrato="contrato"/> -->
            <!--FIN VENTA REAL-->
            <p class="text-2xl">Detalles</p>
            <vs-divider></vs-divider>
            <div>
                <br>
                <vs-chip transparent color="primary" class="ml-2">
                    Cantidad Verificaciones:  <span style="font-weight: bold;"> {{  InformacionLiquidacion.length }}</span>
                </vs-chip>
                <br/>
                <vs-table max-items="10" stripe search pagination :data="InformacionLiquidacion" style="margin-top:-40px">
                    <template slot="thead">
                        <vs-th>Contratos</vs-th>
                        <vs-th>Verificación</vs-th>
                        <vs-th>Fechas</vs-th>
                        <vs-th>Documentos</vs-th>
                        <vs-th>Accion</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                              #{{ tr.id }}
                              <br>                              {{data[indextr].contrato}}<br>
                            </vs-td>
                            <vs-td>
                              <b>Núm. verificación:</b>
                              <p>{{data[indextr].num_verificacion}}</p><br>
                              <b>Estado:</b><br>
                              <vs-chip v-if="tr.estado == '1'" color="primary">
                                Abierto
                              </vs-chip>
                              <vs-chip v-else color="warning" class="mt-2">
                                  Cerrada
                              </vs-chip>
                            </vs-td>
                            <vs-td>
                              <b>Fecha inicio:</b>
                              <p>{{tr.fecha_inicio}}</p><br>
                              <b>Fecha fin:</b>
                              <p>{{tr.fecha_fin}}</p>
                            </vs-td>
                            <vs-td>
                                <p v-if="tr.file_evidencia" class="imagen" @click="tipoDocumento ='evidencia';documento=tr.file_evidencia;openDocument(tr)">
                                    <b> Evidencia verificación
                                        <!--PDF-->
                                        <ion-icon v-if="tr.file_evidencia.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                        <!--IMAGE-->
                                        <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                                    </b>
                                </p>
                                <p v-if="tr.file_factura" class="imagen" @click="tipoDocumento ='factura';documento=tr.file_factura;openDocument(tr)">
                                    <b> Factura
                                        <!--PDF-->
                                        <ion-icon v-if="tr.file_factura.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                        <!--IMAGE-->
                                        <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                                    </b>
                                </p>
                            </vs-td>
                            <vs-td>
                              <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border" v-if="tr.estado == 0"></vs-button>
                                <vs-dropdown-menu style="width: 320px;" class="cursor">
                                    <!--VER DETALLE-->
                                    <vs-dropdown-item>
                                      <vs-button class="w-full" color="primary" @click="startDetalle(tr)" type="line" >Ver detalle </vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="desdePedido == 1 && (userFacturador || userRoot)">
                                      <!--estado => 0 = cerrada; 1 = abierta;-->
                                      <!--FACTURADOR SUBE EVIDENCIA DE VERIFICACION-->
                                      <vs-button  color="success" type="line" class="w-full" @click="pedido = tr;popupSolicitud = true;">&nbsp;&nbsp;&nbsp;Subir evidencia &nbsp;&nbsp;&nbsp;</vs-button>
                                    </vs-dropdown-item>
                                    <!--ASESOR SUBE FACTURA-->
                                    <vs-dropdown-item v-if="(userAsesor || userRoot)">
                                      <vs-button color="danger" type="line"   class="w-full" @click="pedido = tr;popupSolicitudFactura = true;">Subir Factura</vs-button>
                                    </vs-dropdown-item>
                                    <!--OBSERVACION-->
                                    <vs-dropdown-item v-if="desdePedido == 1 && (userFacturador || userRoot || userAsesor) ">
                                      <vs-button color="warning" type="line"   class="w-full" @click="pedido = tr;openObservacion()" >Observación</vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                              </vs-dropdown>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <!--DETALLE CONTRATO-->
            <!-- <p class="text-2xl mt-5">Detalle del contrato <b v-if="desdePedido == 1">{{ contratoPedido }}</b></p>
            <vs-divider></vs-divider>
            <vs-table max-items="10" id="tbl_exporttable_to_xls" search stripe pagination :data="desgloseContrato">
                <template slot="header">
                    <small>Cantidad :{{ desgloseContrato.length }}</small>
                    <vs-button class="ml-3" @click="exportToExcel()" color="success" type="border">Exportar</vs-button>
                </template>
                <template slot="thead">
                    <vs-th>Código</vs-th>
                    <vs-th>Verif1.</vs-th>
                    <vs-th>Verif2.</vs-th>
                    <vs-th>Verif3.</vs-th>
                    <vs-th>Verif4.</vs-th>
                    <vs-th>Verif5.</vs-th>
                    <vs-th>Verif6.</vs-th>
                    <vs-th>Verif7.</vs-th>
                    <vs-th>Verif8.</vs-th>
                    <vs-th>Verif9.</vs-th>
                    <vs-th>Verif10.</vs-th>
                    <vs-th>Total</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td width="10%">
                            {{tr.codigo}}
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,1)">{{ tr.verif1 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,2)">{{ tr.verif2 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,3)">{{ tr.verif3 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,4)">{{ tr.verif4 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,5)">{{ tr.verif5 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,6)">{{ tr.verif6 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,7)">{{ tr.verif7 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,8)">{{ tr.verif8 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,9)">{{ tr.verif9 }}</small>
                        </vs-td>
                        <vs-td width="5%">
                            <small style="cursor:pointer;" class="verif" @click="desdeDetalle=1;verBooks(tr,10)">{{ tr.verif10 }}</small>
                        </vs-td>
                        <vs-td width="10%">
                            {{ tr.total }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table> -->
        </vx-card>
        <!--MODALES-->
        <!--MODAL PARA DETALLES DE LA VERIFICACION -->
        <vs-popup :title="title" fullscreen :active.sync="popupDetalleVerificacion" @close="filtroMenu = 100;">
            <vs-chip style="font-size:12px;">
              Cantidad Libros: {{sumaTotal}}
            </vs-chip>
            <vs-chip style="font-size:12px;">
              Cantidad Regalados: {{ sumaTotalRegalados }}
            </vs-chip>
            <br><br>
            <!--MENU-->
            <nav class="breadcrumbs mt-3">
              <span class="breadcrumbs__item btnMenu activeBtn menuVerificacion0 cursor-pointer"           @click="filtroMenu = 0;estadoMenu();">Verificación Libros</span>
              <span v-if="!userAsesor" class="breadcrumbs__item btnMenu menuVerificacion1 cursor-pointer"  @click="filtroMenu = 1;estadoMenu();">Códigos Docentes</span>
              <span v-if="userAsesor"  class="breadcrumbs__item btnMenu menuVerificacion2 cursor-pointer"  @click="filtroMenu = 2;estadoMenu();">Valores</span>
              <span v-else             class="breadcrumbs__item btnMenu menuVerificacion2 cursor-pointer"  @click="filtroMenu = 2;estadoMenu();">Configuración General</span>
              <!-- <span                    class="breadcrumbs__item btnMenu menuVerificacion4 cursor-pointer"  @click="filtroMenu = 4;estadoMenu();">Convenios</span> -->
              <span                    class="breadcrumbs__item btnMenu menuVerificacion3 cursor-pointer"  @click="filtroMenu = 3;estadoMenu();">Porcentajes Beneficiarios</span>
              <span                    class="breadcrumbs__item btnMenu menuVerificacion4 cursor-pointer"  @click="filtroMenu = 4;estadoMenu();">Reportes</span>
              <span v-if="!userAsesor" class="breadcrumbs__item btnMenu menuVerificacion5 cursor-pointer"  @click="filtroMenu = 5;estadoMenu();">Liquidados Devueltos</span>
            </nav>
            <!--MENU-->
            <!--COMPONENTES-->
            <div>
              <div v-if="filtroMenu == 0">
                <TableVerificadosVue
                :VerificacionSelect="pedido"
                :setcobro_venta_directa="setcobro_venta_directa"
                :settipoPago="settipoPago"
                :settotalDescuento="settotalDescuento"
                :setcampoPersonalizado="setcampoPersonalizado"
                :desdePedido="desdePedido"
                :sendPedido="sendPedido"
                verTipo="2"
                :arregloVerificados="DetalleVerificacion"
                :datosInstitucion="datosInstitucion"
                :arrayCodigosVerificacion="arrayCodigosVerificacion"
                @recharge="recharge"/>
              </div>
              <div v-if="filtroMenu == 1">
                <ScreenRegaladosVue
                :userFacturador="userFacturador"
                :userRoot="userRoot"
                :userAsesor="userAsesor"
                :usuario="usuario"
                :datosInstitucion="datosInstitucion"
                :VerificacionSelect="pedido"
                :arregloRegalados="arregloRegalados"
                :desdePedido="desdePedido"
                :setcobro_venta_directa="setcobro_venta_directa"
                :setcampoPersonalizado="setcampoPersonalizado"
                :sendPedido="sendPedido"
                :settipoPago="settipoPago"
                :setPersonalizado="setPersonalizado"
                :contrato="contrato"
                :DetalleVerificacion="DetalleVerificacion"
                @recharge="recharge"
                />
              </div>
              <div v-if="filtroMenu == 2">
                <ScreenConfiguracionVerificacionVue
                :VerificacionSelect="pedido"
                :setpermiso_anticipo_deuda="setpermiso_anticipo_deuda"
                :setpermiso_convenio="setpermiso_convenio"
                :setpermiso_cobro_venta_directa="setpermiso_cobro_venta_directa"

                :sumaTotalVALOR="sumaTotalVALOR"
                :sumaTotalValorRegalados="totalRegalados"
                :DetalleVerificacion="DetalleVerificacion"
                :id_periodo="sendPedido.id_periodo"
                :tipoReporte="tipoReporte"
                :totalCobroVenta="totalCobroVenta"
                :sendPedido="sendPedido"
                :userAsesor="userAsesor"
                :datosInstitucion="datosInstitucion"
                @recharge="recharge"
                 />
              </div>
              <!-- <div v-if="filtroMenu == 4">
                <ScreenConvenioVue :datosInstitucion="datosInstitucion" @recharge="recharge"/>
              </div> -->
              <div v-if="filtroMenu == 3">
                <BeneficiariosPorcentajeVue
                :pedido="sendPedido"
                :ventaBruta="sendPedido.total_venta"
                :comision="sendPedido.descuento"
                :id_pedido="sendPedido.id_pedido"
                :contrato_generado="contrato"
                :desdeVerificacion="1"
                :VerificacionSelect="pedido"
                 />
                <registrar_beneficiariosVue
                :pedido="sendPedido"
                :desdeVerificacion="1"
                :VerificacionSelect="pedido"
                />
              </div>
              <div v-if="filtroMenu == 4">
                <div>
                  <vs-button class="m-2" @click="exportToExcelDetalle(0)" color="success" type="border">Códigos Libros</vs-button>
                  <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(1);tipoReporte=0;" color="dark" type="border">Reporte pdf</vs-button>
                  <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(1);tipoReporte=1;" color="warning" type="border">Reporte excel</vs-button>
                  <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(2);tipoVenta=1;" color="#CE2A7F" type="border">Reporte Venta Directa</vs-button>
                  <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(2);tipoVenta=2;" color="#AECF3C" type="border">Reporte Venta Lista</vs-button>
                  <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportToExcelDetalle(1);" color="#503CE5" type="border">Códigos hijos docentes</vs-button>
                </div>
              </div>
              <div v-if="filtroMenu == 5">
                <LiquidadosDevueltosVue :sendVerificacion="pedido" :contrato="contrato"/>
              </div>
            </div>
            <!--FIN COMPONENTES-->
        </vs-popup>
        <!--MODAL PARA VER LOS CODIGOS DE LA VERIFICACION -->
        <vs-popup
          :title="title2"  :active.sync="popupVerCodigos" @close="abrirModal()">
          <!-- <vs-button color="success" icon="arrow_back" @click="popupVerCodigos = false; popupDetalleVerificacion = true;" type="gradient"></vs-button> -->
            <vs-list >
                <vs-list-header  :title="ArregloVerCodigos.length +' Códigos'"></vs-list-header>
                <vs-list-item :key="indextr" v-for="(tr, indextr) in ArregloVerCodigos" :title="tr.codigo">
                </vs-list-item>
            </vs-list>
        </vs-popup>
        <!--POPUP PARA CAMBIAR DE NUMERO DE VERIFICACION-->
         <vs-popup
            style="color:rgb(255,255,255)"
            background-color="rgba(255,255,255,.6)"
            title="background" :active.sync="popupChangeLiquidacion">
        </vs-popup>
        <!--MODAL SUBIR SOLICITUD DE OBSEQUIOS-->
        <vs-popup classContent="popup-example" title="Subir evidencia" :active.sync="popupSolicitud">
            <p class="font-bold text-warning text-2xl text-center">Evidencia de verificación</p>
            <vs-divider>SUBA ARCHIVO DE LA EVIDENCIA DE VERIFICACIÓN</vs-divider>
            <UploadVerificacionVue v-if="popupSolicitud" :pedido="pedido" titlebtn="Subir evidencia" tipoDocumento='evidencia' campo_file="file_evidencia" campo_fecha="fecha_subir_evidencia" :imgOld="pedido.file_evidencia" @recharge="recharge"/>
        </vs-popup>
        <vs-popup classContent="popup-example" title="Subir Factura" :active.sync="popupSolicitudFactura">
          <p class="font-bold text-warning text-2xl text-center">Suba la factura</p>
          <vs-divider>SUBA ARCHIVO LA FACTURA</vs-divider>
          <UploadVerificacionVue v-if="popupSolicitudFactura" :pedido="pedido" titlebtn="Subir Factura" tipoDocumento='factura' campo_file="file_factura" campo_fecha="fecha_subir_factura" :imgOld="pedido.file_factura" @recharge="recharge"/>
        </vs-popup>
        <!--MODAL PARA OBSERVACION VERIFICACION-->
        <vs-popup classContent="popup-example" title="Mostrar observación" :active.sync="popupObservacion">
          <div class="vx-row mb-2">
            <div class="vx-col w-full">
              <vs-textarea :disabled="disableAsesor" counter="300" style="width:100%;" height="200px"  label="Observación" :counter-danger.sync="counterDanger" v-model="observacion" />
            </div>
          </div>
          <div class="flex justify-center">
            <vs-button color="success" @click="saveDatosVerificacion()" class="mt-2" type="gradient">Guardar comentario</vs-button>
          </div>
        </vs-popup>
        <!--MODAL PARA MOSTRAR DOCUMENTO-->
          <vs-popup class="holamundo" :title="'Documento: '+tipoDocumento" fullscreen :active.sync="popupDocumento">
            <div class="flex" style="justify-content: center;" v-if="popupDocumento">
                <image-zoom
                    :regular="$data_url+'archivos/verificaciones/'+tipoDocumento+'/'+documento"
                    :zoom-amount="3"
                    :click-zoom="true"
                    click-message="De click para aumentar"
                    img-class="img-fluid"
                    >
                </image-zoom>
            </div>
        </vs-popup>
        <!--DOWNLOAD DOCUMENTOS-->
        <div v-if="mostrarReportePdf">
            <exportLiquidacionVue
            style="display:none;"
             :VerificacionSelect="pedido"
             :sumaTotalVALOR="sumaTotalVALOR"
             :sumaTotalValorRegalados="totalRegalados"
             :DetalleVerificacion="DetalleVerificacion"
             :tipoReporte="tipoReporte"
             :totalCobroVenta="totalCobroVenta"
             :sendPedido="sendPedido"
             :datosInstitucion="datosInstitucion"
              @change="changeHandle" />
        </div>
        <div v-if="mostrarReporteTipoVenta">
          <exportTipoVentaVue
          style="display:none;"
          :tipoVenta="tipoVenta"
          :VerificacionSelect="pedido"
          :datosInstitucion="datosInstitucion"
          :sendPedido="sendPedido"
          />
        </div>
    </div>
</template>
<script>
import imageZoom from 'vue-image-zoomer';
const  UploadVerificacionVue      = () => import('./components/UploadVerificacion.vue')
const exportLiquidacionVue        = () => import('./components/exportLiquidacion.vue')
const LiquidadosDevueltosVue      = () => import('./components/Pedidos/LiquidadosDevueltos.vue')
const ScreenRegaladosVue          = () => import('./components/Pedidos/Regalados/ScreenRegalados.vue')
const BeneficiariosPorcentajeVue  = () => import('../pedidos/components/beneficiarios/BeneficiariosPorcentaje.vue')
const registrar_beneficiariosVue  = () => import('../pedidos/registrar_beneficiarios.vue')
const TableVerificadosVue         = () => import('./components/TableVerificados.vue')
import VentaRealVue from '@/views/temporadas/components/VentaReal'
import exportTipoVentaVue from './components/exportTipoVenta.vue';
import ScreenConfiguracionVerificacionVue from './components/Pedidos/Configuracion/ScreenConfiguracionVerificacion.vue';
export default {
  components:{
    UploadVerificacionVue,
    imageZoom,
    VentaRealVue,
    exportLiquidacionVue,
    exportTipoVentaVue,
    TableVerificadosVue,
    LiquidadosDevueltosVue,
    ScreenRegaladosVue,
    ScreenConfiguracionVerificacionVue,
    BeneficiariosPorcentajeVue,
    registrar_beneficiariosVue,
    // ScreenConvenioVue,
  },
    data() {
        return{
            usuario:[],
            contrato:'',
            InformacionLiquidacion:[],
            DetalleVerificacion:[],
            ArregloVerCodigos:[],
            popupDetalleVerificacion:false,
            popupVerCodigos:false,
            title:'',
            title2:'',
            verificacion_id:0,
            contContrato:0,
            popupChangeLiquidacion:false,
            nombreInstitucion:'',
            desgloseContrato:[],
            pedido:{},
            popupSolicitud:false,
            popupSolicitudFactura:false,
            popupDocumento:false,
            tipoDocumento:'',
            documento:'',
            userRoot:false,
            userFacturador:false,
            userAsesor:false,
            //VARIABLES PARA EXPORTAR A EXCEL
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            fileName:null,
            selectedFormat: 'xls',
            cellAutoWidth: true,
            activePrompt: false,
            //FIN VARIABLES PARA EXPORTAR A EXCEL
            //variables para observacion
            observacion:'',
            popupObservacion:false,
            counterDanger: false,
            disableAsesor:false,
            datosInstitucion:'',
            maximaVerificacion:0,
            desdeDetalle:0,
            //0 => REPORTE PDF; 1 => REPORTE EXCEL
            tipoReporte:0,
            tipoVenta:1,
            //fin variables para observacion
            //variables para reporte pdf
            mostrarReportePdf:false,
            mostrarReporteTipoVenta:false,
            popupCarga:false,
            //fin variables para reporte pdf
            //variables regalados
            arregloRegalados:[],
            colorx:"#56979B",
            totalRegalados:0,
            //fin variables regalados
            totalCobroVenta:0,
            sumaTotalVALOR:0,
            menuDetalle:1,
            //variables para cobro directa
            setcobro_venta_directa:0,
            settipoPago:0,
            setPersonalizado:0,
            settotalDescuento:0,
            setcampoPersonalizado:"",
            setpermiso_anticipo_deuda:0,
            setpermiso_convenio:0,
            setpermiso_cobro_venta_directa:0,
            //fin variables para cobro directa
            //variables venta real
            sumaVentaReal:0,
            arregloValoresVentaReal:[],
            //fin variables venta real
            filtroMenu:100,
            arrayAllCodigos:[],
            arrayCodigosVerificacion:[],
      }
    },
    props:{
        desdePedido:{
            type:Number,
            default:0
        },
        contratoPedido:{
            type:String,
            default:''
        },
        sendPedido:{
            type:Object,
            default:{}
        },
    },
    watch:{
        setcobro_venta_directa(results){
          let me = this;
          me.setcobro_venta_directa = results
          me.getAllCodigosXContrato()
        },
        settipoPago(results){
          let me = this;
          me.settipoPago = results
        },
        setPersonalizado(results){
          let me = this;
          me.setPersonalizado = results
        },
        settotalDescuento(results){
          let me = this;
          me.settotalDescuento = results
        },
        setcampoPersonalizado(results){
          let me = this;
          me.setcampoPersonalizado = results
        },
        setpermiso_anticipo_deuda(results){
          let me = this;
          me.setpermiso_anticipo_deuda = results
        },
        setpermiso_convenio(results){
          let me = this;
          me.setpermiso_convenio = results
        },
        setpermiso_cobro_venta_directa(results){
          let me = this;
          me.setpermiso_cobro_venta_directa = results
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getUserRoot(me.usuario);
    },
    mounted(){
      let me = this;
      me.setcobro_venta_directa     = 0
      me.settipoPago                = 0
      me.setPersonalizado           = 0
      me.settotalDescuento          = 0
      me.setcampoPersonalizado      = ""
      me.setpermiso_anticipo_deuda  = 0
      me.setpermiso_convenio        = 0
      me.setpermiso_cobro_venta_directa = 0
      me.menuDetalle = 1
      if(me.desdePedido == 1){
        me.contrato = me.contratoPedido
        me.getInformacionLiquidacion()
      }
      //user facturador
      if(me.usuario.id_group == 23 || me.usuario.id_group == 22) me.userFacturador = true
      //user asesor
      if(me.usuario.id_group == 11){
        me.userAsesor = true
        me.disableAsesor = true
      }
    },
    computed:{
        sumaTotal(){
            let me = this;
            if(me.DetalleVerificacion.length >0){
              let datos = me.DetalleVerificacion.filter(p => p.cantidad)
              let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
              return total
            }
        },
        sumaTotalRegalados(){
            let me = this;
            if(me.arregloRegalados.length >0){
              let datos = me.arregloRegalados.filter(p => p.cantidad)
              let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
              return total
            }
        },
    },
    methods: {
      estadoMenu(){
          let me = this;
          localStorage.setItem('menuSelectVerificacion',me.filtroMenu)
          var divs = document.querySelectorAll(".btnMenu");
          for (var i = 0; i < divs.length; i++) {
              divs[i].classList.remove("activeBtn");
          }
          const container = document.querySelector(".menuVerificacion"+me.filtroMenu);
          container.classList.add("activeBtn");
      },
      startDetalle(tr){
        let me = this
        me.mostrarReportePdf              = false
        me.mostrarReporteTipoVenta        = false
        me.menuDetalle                    = 1
        me.setcobro_venta_directa         = tr.cobro_venta_directa;
        me.settipoPago                    = tr.tipoPago;
        me.setPersonalizado               = tr.personalizado;
        me.settotalDescuento              = tr.totalDescuento;
        me.setcampoPersonalizado          = tr.campoPersonalizado;
        me.setpermiso_anticipo_deuda      = tr.permiso_anticipo_deuda;
        me.setpermiso_convenio            = tr.permiso_convenio;
        me.setpermiso_cobro_venta_directa = tr.permiso_cobro_venta_directa
        me.pedido                         = tr;
        me.getAllCodigosXContrato()
        me.filtroMenu                     = 0;
        me.estadoMenu();
      },
      abrirModal(){
          let me = this;
          if(me.desdeDetalle == 1){ }
          else  me.popupDetalleVerificacion=true;
      },
      //====METODOS PARA OMITIR LOS ARHIVOS
      changeHandle(e){
        let me = this;
        me.mostrarReportePdf         = false
        me.mostrarReporteTipoVenta   = false
        me.popupCarga                = false
        me.popupDetalleVerificacion  = true
      },
      filtrarDecimal(numero){
          let me = this
          if(numero == undefined){
              return 0
          }
          if(numero == 0){
              return numero
          }else{
              const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              return transformar
          }
      },
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
      verBooks(tr,num_verificacion){
          let me = this;
            me.$vs.loading();
          me.title2 = "Códigos del libro "+tr.nombre_libro
          this.$http.get(this.$server_url+'n_verificacion?buscarIdVerificacion=yes&contrato='+me.contrato+'&verCodigos=yes'+'&libro_id='+tr.libro_id+'&num_verificacion='+num_verificacion)
          .then(function (res) {
              me.ArregloVerCodigos = res.data
              me.popupVerCodigos = true;
              me.$vs.loading.close()
              if(res.data.message){
                  me.$vs.notify({
                  text: res.data.message,
                  color: 'success',
                  iconPack: 'feather',
                  icon: 'icon-user'
              })
              }
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },
      getInformacionLiquidacion() {
        let me = this;
        me.InformacionLiquidacion   = [];
        me.desgloseContrato         = []
        me.maximaVerificacion       = 0
        me.nombreInstitucion = ""
        if(me.contrato == ""){
            me.$vs.notify({
                    text: "Ingrese un contrato por favor",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                })
            return false;
        }
        me.$vs.loading();
        this.$http.get(this.$server_url+'n_verificacion?contrato='+me.contrato+'&informacion=yes')
            .then(function (res) {
              me.$vs.loading.close()
                if(res.data.verificaciones.length == 0){
                    me.$vs.notify({
                    text: 'No hay verificaciones en el contrato',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                    return
                }
                me.InformacionLiquidacion = res.data.verificaciones
                me.nombreInstitucion      = res.data.institucion[0].nombreInstitucion
                me.datosInstitucion       = res.data.institucion[0]
                me.contContrato           = res.data.length
                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                }
                //me.desgloseCodigo();
            })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      desgloseCodigo(){
        let me = this;
        me.desgloseContrato = []
        const { idInstitucion ,id_periodo } = me.datosInstitucion
          this.$http.get(this.$server_url+'n_verificacion?contrato='+me.contrato+'&historico=yes&institucion_id='+idInstitucion+'&periodo_id='+id_periodo)
            .then(function (res) {
              let datos      = res.data.formato
              if(datos.length == 0){
                me.$vs.loading.close()
                return
              }
              me.maximaVerificacion = datos[0].maximaVerificacion
              let getCodigos = res.data.codigos
              let prevalores = []
              datos.forEach(element => {
                var cal = new Object()
                cal.codigo          = element.codigo
                cal.nombre_libro    = element.nombre_libro
                cal.libro_id        = element.libro_id
                var preTotal        = 0
                var contador        = 1
                for (let index = 0; index < me.maximaVerificacion; index++) {
                    let contar = []
                    contar = getCodigos.filter(p => p[`verif${contador}`] > 0 && p.libro_id == element.libro_id)
                    if(contar.length > 0){
                        preTotal += contar.length
                        try {
                        eval("cal.verif" + contador + "=" + contar.length);
                        } catch (error) {
                            console.log("err",error)
                            eval("cal.verif" + contador + "=" + 0);
                        }
                    }
                    contador++;
                }
                cal.total           = preTotal
                prevalores.push(cal)
              });
              if(prevalores.length > 0){
                me.desgloseContrato = prevalores.sort(function(a, b) {
                var nombreA = a.codigo.toLowerCase();
                var nombreB = b.codigo.toLowerCase();
                var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final

                if (nombreA < nombreB) {
                    return -1;
                }
                if (nombreA > nombreB) {
                    return 1;
                }
                if (numA && !numB) { // si a tiene número y b no, b va primero
                    return 1;
                }
                if (!numA && numB) { // si b tiene número y a no, a va primero
                    return -1;
                }
                if (numA && numB) { // si ambos tienen número, compararlos
                    if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                    return -1;
                    }
                    if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                    return 1;
                    }
                    return numA - numB; // comparar los números directamente
                }
                return 0; // si son iguales en todo, no hay diferencia
                });
              }
              me.$vs.loading.close()
            })
        .catch(function (error) {
        })
      },
      verCodigosRegalados(tr){
        let me  = this;
        me.ArregloVerCodigos = []
        me.$vs.loading();
        me.title2 = "Códigos del libro "+tr.nombre_libro
        this.$http.get(this.$server_url+'showRegalados/'+me.datosInstitucion.idInstitucion+'/'+me.datosInstitucion.id_periodo+'/'+tr.libro_idlibro+'/'+me.pedido.num_verificacion+'/'+me.pedido.id)
        .then(function (res) {
            me.ArregloVerCodigos        = res.data
            me.popupDetalleVerificacion = false;
            me.popupVerCodigos          = true;
            me.$vs.loading.close()
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      VerCodigos(tr,filtro){
        let me  = this;
        me.$vs.loading();
        me.title2 = "Códigos del libro "+tr.nombre_libro
        this.$http.get(this.$server_url+'n_verificacion?contrato='+me.pedido.contrato+'&verCodigos=yes&verificacion_id='+tr.IdVerificacion+'&libro_id='+tr.libro_id+'&num_verificacion='+tr.verificacion_id)
        .then(function (res) {
          me.$vs.loading.close()
          let datos = res.data
          if(datos.length > 0 ){
            if(filtro == 0) me.ArregloVerCodigos = datos
            if(filtro == 1) me.ArregloVerCodigos = datos.filter(x => x.venta_estado == 1 && x.estado_liquidacion == 0)
            if(filtro == 2) me.ArregloVerCodigos = datos.filter(x => x.venta_estado == 2 && x.estado_liquidacion == 0)
            if(filtro == 3) me.ArregloVerCodigos = datos.filter(x => x.estado_liquidacion == 2)
          }else{
            me.ArregloVerCodigos = res.data
          }
          me.popupDetalleVerificacion = false;
          me.popupVerCodigos = true;
          if(res.data.message){
              me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user'
          })
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      getAllCodigosXContrato(){
        let me = this;
        me.sumaVentaReal =0
        me.arregloValoresVentaReal = []
        const { idInstitucion ,id_periodo } = me.datosInstitucion
        me.$vs.loading();
        this.$http.get(this.$server_url+'n_verificacion?contrato='+me.pedido.contrato+'&getAllCodigosXContrato=yes&IdVerificacion='+me.pedido.id+'&verificacion_id='+me.pedido.num_verificacion+'&institucion_id='+idInstitucion+'&periodo_id='+id_periodo)
        .then(function (res) {
          me.arrayAllCodigos = res.data
          me.getVentaRealXVerificacion()
          me.getRegalados();
          me.getDetallesVerificacion()
          me.$vs.loading.close();
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      getVentaRealXVerificacion(){
        let me = this;
        const { idInstitucion ,id_periodo } = me.datosInstitucion
        //si no hay codigos no hace nada
        if(me.arrayAllCodigos.length == 0){ return }
        me.sumaVentaReal            = 0
        me.arregloValoresVentaReal  = []
        let datos                   = me.arrayAllCodigos.filter(p => p.estado_liquidacion == '0' && p.bc_institucion == idInstitucion && p.estado != '2' && p.contrato == me.pedido.contrato)
        // Itera a través de los elementos del array
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.arregloValoresVentaReal.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.arregloValoresVentaReal.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion, verificacion_id, libro_idlibro, cantidad: 1,  });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
        me.arregloValoresVentaReal.map((item) => {
          item.valor = item.precio * item.cantidad
          me.sumaVentaReal += item.valor
        });
        // me.updateValorLiquidacion()

        // const { idInstitucion ,id_periodo } = me.datosInstitucion
        // this.$http.get(this.$server_url+'n_verificacion?contrato='+me.pedido.contrato+'&getVentaRealXVerificacion=yes&IdVerificacion='+me.pedido.id+'&verificacion_id='+me.pedido.num_verificacion+'&institucion_id='+idInstitucion+'&periodo_id='+id_periodo)
        // .then(function (res) {
        //   me.arregloValoresVentaReal = res.data
        //   me.sumarTotalVentaReal()
        // })
        // .catch(function (error) {
        //     console.log(error + ' error');
        //     me.$vs.loading.close()
        // })
      },

      // sumarTotalVentaReal(){
      //   let me = this;
      //     if(me.arregloValoresVentaReal.length > 0){
      //       let datos = me.arregloValoresVentaReal.filter(p => p.valor)
      //       let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
      //       me.sumaVentaReal = total
      //     }
      // },
      updateValorLiquidacion(){
        let me = this;
        let formData = new FormData();
        formData.append('verificacion_id',    me.pedido.id);
        formData.append('venta_real',         me.sumaVentaReal + me.totalRegalados);
        formData.append('venta_real_regalados',me.totalRegalados)
        this.$http.post(this.$server_url+'updateVentaReal', formData)
        .then(res => {
        })
      },
      //aqui traigo codigos normales y codigos regalados
      getDetallesVerificacion(){
        let me = this;
        me.sumaTotalVALOR             = 0
        me.DetalleVerificacion        = []
        me.arrayCodigosVerificacion   = []
        me.verificacion_id            = me.pedido.id
        const { idInstitucion ,id_periodo } = me.datosInstitucion
        me.title = "Verificación N. "+me.pedido.num_verificacion + " del contrato "+ me.pedido.contrato
        //AGRUPADO
        let datos                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '0' || p.estado_liquidacion == '2') && (p.bc_institucion == idInstitucion || p.venta_lista_institucion == idInstitucion) )
        me.arrayCodigosVerificacion = datos
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.DetalleVerificacion.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.DetalleVerificacion.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro ,cantidad: 1,  });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
        me.DetalleVerificacion.map((item) => {
          item.valor        = item.precio * item.cantidad
          me.sumaTotalVALOR += item.valor
        });
        me.updateValorLiquidacion()
        me.popupDetalleVerificacion = true
        // this.$http.get(this.$server_url+'n_verificacion?contrato='+me.pedido.contrato+'&detalles=yes&IdVerificacion='+me.pedido.id+'&verificacion_id='+me.pedido.num_verificacion+'&institucion_id='+idInstitucion+'&periodo_id='+id_periodo)
        // .then(function (res) {
        //     me.DetalleVerificacion = res.data
        //     me.sumarTotalVenta()
        //     me.popupDetalleVerificacion = true
        //     me.$vs.loading.close()
        //     if(res.data.message){
        //         me.$vs.notify({
        //         text: res.data.message,
        //         color: 'success',
        //         iconPack: 'feather',
        //         icon: 'icon-user'
        //       })
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error + ' error');
        //     me.$vs.loading.close()
        // })
      },
      // sumarTotalVenta(){
      //   let me = this;
      //     if(me.DetalleVerificacion.length >0){
      //       let datos = me.DetalleVerificacion.filter(p => p.valor)
      //       let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
      //       me.sumaTotalVALOR = total
      //     }
      // },
      getRegalados(){
        let me = this
        me.totalRegalados = 0
        me.totalCobroVenta = 0
        me.arregloRegalados = []
        const { idInstitucion ,id_periodo } = me.datosInstitucion
         //AGRUPADO
         let datos                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '2') && (p.bc_institucion == idInstitucion || p.venta_lista_institucion == idInstitucion) )
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.arregloRegalados.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.arregloRegalados.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro, cantidad: 1,  });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
        me.arregloRegalados.map((item) => {
          item.valor        = item.precio * item.cantidad
          me.totalRegalados += item.valor
        });
        if(me.arregloRegalados.length > 0){
            let prevalor        = 0
            //COBRO VENTA DIRECTA=>0 = NADA; 1 = 100%; 2 =porcentaje de la escuela;
            //tipoPago => 0 =  NADA; 1 = Cancelar Total; 2 = Descontar; 3 = Regalado = 4 personalizado
            if(me.settipoPago == 1 || me.settipoPago == 3) { me.totalCobroVenta = 0 }
            if(me.settipoPago == 2 || me.setPersonalizado == 1) {
              prevalor = me.sendPedido.descuento
              //si el cobro de venta directa esta activado
              if(me.setpermiso_cobro_venta_directa == 1){
                me.totalCobroVenta  = ( me.totalRegalados - ( me.totalRegalados * prevalor ) / 100)
              }else{
                me.totalCobroVenta = 0
              }
            }
          }

        // this.$http.get(this.$server_url+'getRegalados/'+me.datosInstitucion.idInstitucion+'/'+me.datosInstitucion.id_periodo+'/'+me.pedido.num_verificacion+'/'+me.pedido.id)
        //   .then(function (res) {
        //     me.arregloRegalados = res.data
        //     if(me.arregloRegalados.length > 0){
        //         let datos           = me.arregloRegalados.filter(p => p.valor)
        //         let total           = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
        //         me.totalRegalados   = total
        //         if(me.totalRegalados > 0){
        //           let prevalor        = 0
        //           //COBRO VENTA DIRECTA=>0 = NADA; 1 = 100%; 2 =porcentaje de la escuela;
        //           //tipoPago => 0 =  NADA; 1 = Cancelar Total; 2 = Descontar; 3 = Regalado = 4 personalizado
        //           if(me.settipoPago == 1 || me.settipoPago == 3) { me.totalCobroVenta = 0 }
        //           if(me.settipoPago == 2 || me.setPersonalizado == 1) {
        //             prevalor = me.sendPedido.descuento
        //             //si el cobro de venta directa esta activado
        //             if(me.setpermiso_cobro_venta_directa == 1){
        //               me.totalCobroVenta  = ( me.totalRegalados - ( me.totalRegalados * prevalor ) / 100)
        //             }else{
        //               me.totalCobroVenta = 0
        //             }
        //           }
        //         }
        //     }
        //     me.sumarTotalVentaReal()
        //   })
        //   .catch(function (error) {
        //       console.log(error + ' error');
        //   })
      },

      recharge(e){
          let me = this
          me.desdeDetalle = 0
          //menu modal Verificacion libros => para ver los codigos de libro seleccionado
          if(e.tipo == 2){ me.VerCodigos(e.data,e.filtro)
              return
          }
          //libros regalados
          if(e.tipo == 3){
              me.verCodigosRegalados(e.data)
              return
          }
          //actualizar cobro venta directa
          if(e.tipo == 4){
            me.getAllCodigosXContrato()
            me.setcobro_venta_directa     = e.data.sendValor
            me.settipoPago                = e.data.sendTipo
            me.settotalDescuento          = e.data.sendtotalDescuento
            me.getInformacionLiquidacion()
            return
          }
          //actualizar codigos regalados
          if(e.tipo == 5){
            me.getAllCodigosXContrato()
            me.updateValorLiquidacion()
            return
          }
          //actualizar valor personalizado
          if(e.tipo == 6){
            me.getAllCodigosXContrato()
            me.setPersonalizado           = e.data.sendValor
            me.settotalDescuento          = e.data.sendtotalDescuento
            me.setcampoPersonalizado      = e.data.sendcampoPersonalizado
            me.getInformacionLiquidacion()
          }
          //actualizar configuracion reporte
          if(e.tipo == 7){
            me.getAllCodigosXContrato()
            me.setpermiso_anticipo_deuda      = e.sendpermiso_anticipo_deuda
            me.setpermiso_convenio            = e.sendpermiso_convenio
            me.setpermiso_cobro_venta_directa = e.sendpermiso_cobro_venta_directa
            me.getInformacionLiquidacion()
          }
          //recharge only convenios
          me.popupSolicitud         = false
          me.popupSolicitudFactura  = false
      },
      openDocument(tr){
        let me = this;
        if(me.documento.substr(-3) == 'pdf'){
            let ruta = me.$data_url+'archivos/verificaciones/'+me.tipoDocumento+'/'+me.documento
            window.open(ruta,'_blank')
            return
        }
        me.popupDocumento = true;
      },
      //METODOS PARA EXPORTAR A EXCEL
      exportToExcel() {
        let headerTitle =
        [
          'Código',
          'Verif1',
          'Verif2',
          'Verif3',
          'Verif4',
          'Verif5',
          'Verif6',
          'Verif7',
          'Verif8',
          'Verif9',
          'Verif10',
          'Total',
        ];
        let headerVal = [
          'codigo',
          'verif1',
          'verif2',
          'verif3',
          'verif4',
          'verif5',
          'verif6',
          'verif7',
          'verif8',
          'verif9',
          'verif10',
          'total',
        ];
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(headerVal, this.desgloseContrato)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.contrato,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
        })
      },
      exportVerificacionPdf(tipo){
          let me = this;
          me.popupDetalleVerificacion                 = false
          me.popupCarga                               = true
          //reporte pdf o excel
          if(tipo == 1) {  me.mostrarReportePdf       = true }
          //reporte tipo de venta
          if(tipo == 2) { me.mostrarReporteTipoVenta  = true}

      },
      exportToExcelDetalle(tipoReporte){
        let headerTitle =
        [
          'Libro',
          'Código liquidación',
          'Cantidad',
          'Precio',
          'Valor',
        ];
        let headerVal = [
          'nombre_libro',
          'codigo',
          'cantidad',
          'precio',
          'valor',
        ];
        import('@/vendor/Export2Excel').then(excel => {
          let datos = []
          if(tipoReporte == 0) { datos = this.DetalleVerificacion }
          if(tipoReporte == 1) { datos = this.arregloRegalados }
          const data = this.formatJson(headerVal, datos)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: tipoReporte == 1 ? this.contrato + '_Codigos_Docentes' : this.contrato,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
      },
      //limpiar campos para exportar de nuevo
      clearFields() {
          this.fileName = ''
          this.cellAutoWidth = true
          this.selectedFormat = 'xls'
      },
      //FIN METODOS PARA EXPORTAR A EXCEL
      openObservacion(){
        let me = this;
          this.$http.get(this.$server_url+'getVerificacionXId/'+me.pedido.id)
            .then(function (res) {
              let datos = res.data
              if(datos.length > 0){
                me.observacion = datos[0].observacion
              }
              me.popupObservacion = true
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
      },
      saveDatosVerificacion(){
        let me = this;
        if(me.observacion == "" || me.observacion == null || me.observacion == undefined){
        }else{
          if(me.observacion.length > 300){
            me.$vs.notify({ text: 'Máximo 300 caracteres.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle',time:4000 })
            return
          }
        }
        let formData = new FormData();
        formData.append('id',         me.pedido.id)
        formData.append('observacion',me.observacion);
        me.$vs.loading()
        this.$http.post(this.$server_url+'saveDatosVerificacion', formData)
        .then(res => {
        me.$vs.loading.close()
        me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        me.popupObservacion = false;
      }
    },
}
</script>
<style scoped>
.verif:hover{
    background-color: cornflowerblue;
    transition: 0.5s ease;
    padding: 5px;
    border-radius: 10px;
    color: white;
}
.imagen{
    cursor:pointer;
    opacity:0.8;
    transition: 1s ease all;
}
.imagen:hover{
    text-decoration: underline;
    color:#217bc5;
    text-shadow:2px 4px 2px #ccc;
}
/*ESTILOS MENU**/

  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #000;
color:#fff;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
