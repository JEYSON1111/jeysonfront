
<template>
  <div>
    <div>
      <div class="flex justify-center">
        <div v-if="(tipoBodega == '1' || tipoBodega == '2')&& arregloProblemasDiagnostico.length > 0" class="ml-5" style="width:50%;">
          <vs-alert title="Archivo con inconvenientes" color="danger" active="true">
            <p>Existe codigos de <b>diágnostico</b> con problemas <b class="cursor-pointer" style="background:black;color:white;padding:5px;border-radius:5px;" @click="popupProblemasDiagnostico = true;"><ion-icon name="code-outline"></ion-icon> Mostrar códigos</b>
            </p>
          </vs-alert>
        </div>
        <div v-if="(tipoBodega == '3') && arregloProblemasPaquete.length > 0" class="ml-5" style="width:50%;">
          <vs-alert title="Archivo con inconvenientes" color="danger" active="true">
            <p class="text-center">Existe <b>códigos</b> con problemas <b class="cursor-pointer" style="background:black;color:white;padding:5px;border-radius:5px;" @click="popupProblemasDiagnostico = true;"><ion-icon name="code-outline"></ion-icon> Mostrar códigos</b>
            </p>
          </vs-alert>
        </div>
      </div>
      <!--BUSQUEDA DE INSTITUCIONES Y TIPO DE VENTA-->
      <vs-row class="mt-3">
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
          <div style="width:100%;display:flex;flex-wrap: wrap;">
            <div style="width:50%;">
            <p>Búsqueda de la institución</p>
              <vs-input icon="search" class="mt-2" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()"  v-model="busquedaInstitucion"/>
            </div>
            <div style="width:10%;margin-left:10px;margin-top:15px;">
              <vs-button radius color="warning" class="mt-3 ml-5" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            </div>
            <div style="width:30%;margin-top:30px;" class="flex">
              <span>
                <ul class="flex">
                  <li class="ml-5">
                    <vs-radio v-model="venta_estado" vs-name="radios1venta_estado" vs-value="1">Venta directa</vs-radio>
                  </li>
                  <li>
                    <vs-radio v-model="venta_estado" class="ml-2" vs-name="radios1venta_estado" vs-value="2">Venta lista</vs-radio>
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </vs-col>
      </vs-row>
      <!--TABLA INSTITUCIONES-->
      <vs-row v-if="instituciones.length > 0">
        <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="6" class="mt-5" style="flex-wrap:wrap;" v-if="userRoot">
          <small>Seleccione un período</small>
          <v-select :options="arrayPeriodos" @input="changePeriodo()" :reduce="arrayPeriodos => arrayPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
          <vs-table stripe max-items="50"  style="width: 100%;" search pagination :data="instituciones">
              <template slot="header">
                <div class="vx-row">
                  <div class="vx-col w-full m-3">
                      Cantidad: {{instituciones.length}}
                  </div>
                </div>
              </template>
              <template slot="thead">
                <vs-th sort-key="idInstitucion">#</vs-th>
                <vs-th sort-key="nombreInstitucion">Institución (asesor)</vs-th>
                <vs-th sort-key="nombre">Localidad</vs-th>
                <vs-th sort-key="nombre">Periodo</vs-th>
                <vs-th sort-key="nombre">Accion</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].idInstitucion ">
                    {{data[indextr].idInstitucion }}
                  </vs-td>
                  <vs-td :data="data[indextr].nombreInstitucion">
                    {{data[indextr].nombreInstitucion}}<br>
                    <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                        <small> <i style="color:red;">No existe asesor </i></small><br>
                    </div>
                    <div v-else>
                        <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
                    </div>
                    <small>{{data[indextr].fecha_registro}} </small>
                  </vs-td>
                  <vs-td :data="data[indextr].nombreregion">
                      {{data[indextr].nombreregion}} <br>
                      <small>{{data[indextr].ciudad}}</small>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.EstadoConfiguracion == 1">
                        {{ tr.periodoNombreConfigurado }}
                    </div>
                    <div v-else>
                      <small class="" >{{ tr.periodo }}</small><br>
                      <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                      <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                    </div>
                  </vs-td>
                  <vs-td>
                      <vs-button type="relief" size="small" @click="asignarInstitucion(tr)">Asignar Institución</vs-button>
                  </vs-td>
                </vs-tr>
              </template>
          </vs-table>
        </vs-col>
      </vs-row>
      <!--FILTRO RADIOS-->
      <vs-row class="mt-5 ml-2">
        <vs-divider v-if="activeTypes">Tipos</vs-divider>
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12" v-if="activeTypes">
          <ul class="flex" style="flex-wrap: wrap;">
            <li class="m-2" v-if="activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="0">Usan y liquidan</vs-radio>
            </li>
            <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="0">Usan y liquidan</vs-radio>
            </li>
            <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="1">Regalado (No entra a la liquidación)</vs-radio>
            </li>
            <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="2">Regalados y bloqueado (No usan y no liquidan)</vs-radio>
            </li>
            <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="3">BLOQUEADO (No usan y no liquidan)</vs-radio>
            </li>
            <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="4">GUIA</vs-radio>
            </li>
          </ul>
        </vs-col>
      </vs-row>
      <br><br>
      <vs-divider v-if="nombreInstitucion.length > 1">
        <p style="color:red;font-weight:bold;">Institucion asignada: <span>{{nombreInstitucion}} - <b class="text-primary">( Período: {{ periodoDescripcion }} )</b></span></p>
        <div class="flex justify-center">
          <vs-button color="danger" @click="eliminarInstitucionSeleccionada()" type="flat" icon="delete"></vs-button>
        </div>
      </vs-divider>
      <div class="vx-row" style="margin-top:-25px;">
        <!--FACTURA-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
          <div class="flex">
            <ul class="centerx">
              <li>
                <vs-checkbox  v-model="checkFactura" class="ml-5 mt-2">Guardar factura</vs-checkbox>
              </li>
            </ul>
            <vx-input-group class="mb-base px-5" v-if="checkFactura">
              <template slot="prepend">
                <div class="prepend-text bg-primary">
                  <span>Número de la factura</span>
                </div>
              </template>
              <vs-input @keydown.space="(event) => event.preventDefault()" v-model="factura" placeholder="Ejemplo. F-9999"/>
            </vx-input-group>
            <div v-if="arregloCodigosDiagnosticoNoexisten.length > 0">
              <vs-button color="dark" size="small" class="ml-2 p-3" @click="popupCodigosDiagnosticoNoexisten = true;" style="margin-top: -3px;" type="filled">MOSTRAR CÓDIGOS NO EXISTE DIÁGNOSTICO</vs-button>
            </div>
          </div>
        </div>
        <!--</FACTURA-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
          <vs-input icon="icon-message-square" class="w-full" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
        </div>
      </div>
      <vs-divider></vs-divider>
      <div class="mb-6 mt-4" align="center">
        <div class="vx-col w-full">
          <p style="color:#2D9ADA;" v-if="tableData.length == 0">
            <i class="fa fa-file" aria-hidden="true"></i>Importacion de códigos <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
          </p>
        </div>
        <vs-alert v-if="tableData.length > 0" color="warning" style="height:100px;" class="mb-3 mt-2"  icon-pack="feather" icon="icon-alert-triangle">
          <p class="text-2xl font-bold text-center">{{ titleImportacion }}</p>
          <vs-divider style="margin-top:-2px;"></vs-divider>
          <span>Excel cargado exitosamente. ¿Estás seguro de importar estos <b>{{ totalCodigos }}</b> códigos?</span><br>
        </vs-alert>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 " class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="danger"  type="relief" @click="openConfirm(0)">Importar códigos </vs-button>
          </vs-col>
        </vs-row>
        <!---CONTADOR DE CODIGOS INGRESADOS-->
        <vs-row v-if="codigosPerdidos == true" class="mt-5">
          <div v-if="tipoBodega == '1' || tipoBodega == '2'" style="width: 100%;" class="flex justify-center">
            <ul class="features flex justify-center">
              <li>
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong>Códigos Activación Importados: {{ contadorA }} </strong></span>
              </li>
              <li>
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong>Códigos Diágnostico Importados: {{ contadorD }} </strong></span>
              </li>
              <li>
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong>Total Importados: {{ contadorA+ contadorD }} </strong></span>
              </li>
              <li v-if="sumaNoIngresados > 0">
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong class="text-danger">Códigos No ingresados: {{ sumaNoIngresados }} </strong></span>
              </li>
            </ul>
          </div>
          <vs-col v-if="tipoBodega == '0'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" v>
            <vs-alert active="true" >
                Se importo   {{ porcentaje }} códigos
                <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
            </vs-alert>
          </vs-col>
        </vs-row>
        <!--RESUMEN PAQUETES-->
        <div v-if="codigosPerdidos == true && (tipoBodega == '3')">
          <vs-card v-if="arregloErroresPaquetes.length > 0">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ arregloErroresPaquetes.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Hubo problemas con algunos paquetes"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in arregloErroresPaquetes" icon="check" :title="tr.paquete" >
                      <p> {{ tr.problema }}</p>
                    </vs-list-item>
                </vs-list>
            </vs-col>
          </vs-card>
          <TableResumenPaqueteVue :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend"/>
        </div>
         <!---FIN CONTADOR DE CODIGOS INGRESADOS-->
        <br/>
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
        <!--FORMATO-->
        <div>
          <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
              <vs-card>
                <div class="header">
                  <p style="font-weight: bold;">Formato del archivo excel</p>
                  <table class="tabla">
                      <tr>
                        <th class="th1">codigo</th>
                      </tr>
                      <tr>
                        <td class="td1">xxx</td>
                      </tr>
                  </table>
                </div>
              </vs-card>
            </vs-col>
          </vs-row>
        </div>
        <!--FORMATO-->
        <vs-row >
          <vs-col v-if="codigosNoCambiados.length > 0" vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
              </vs-list-item>
            </vs-list>
          </vs-col>
          <vs-col v-if="codigosNoExisten.length > 0" vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoExisten" icon="check" :title="tr.codigo" >
              </vs-list-item>
            </vs-list>
          </vs-col>
        </vs-row>
        <vs-row>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vx-card
            title="Codigos que no se pudieron guardar"
            v-if="codigoConProblemas.length > 0"
            >
            <gestionCodigosLista :arregloCodigos="codigoConProblemas" openModal="1"/>
          </vx-card>
        </vs-row>
      </div>
      <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="10" search :data="tableData">
          <template slot="header">
            <h4>Códigos a subir {{tableData.length}}</h4>
          </template>
          <template slot="thead">
            <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
                {{ col }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vx-card>
    </div>
    <!--MODALES-->
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
      <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full">
            <b>Código</b>
          </div>
          <div class="vx-col sm:w-1/2 w-full">
            <b>Institución</b>
          </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in errores">
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full">
                <span v-if="item.codigo"> {{item.codigo}} </span>
              </div>
          </div>
        </div>
      </div>
    </vs-popup>
    <!--MODAL PARA CONFIRMAR-->
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <p class="text-2xl font-bold text-center">{{ titleImportacion }}</p>
      <vs-divider style="margin-top:-2px;"></vs-divider>
      <p class="text-center" v-if="radioRegalado == '0'">Acción: Usan y liquidan</p>
      <p class="text-center" v-if="radioRegalado == '1'">Acción: Regalado no entra a liquidacion</p>
      <p class="text-center" v-if="radioRegalado == '2'">Acción: Regalados y bloqueados (No usan ni liquidan)</p>
      <p class="text-center" v-if="radioRegalado == '3'">Acción: Bloqueados (No usan ni liquidan)</p>
      <p class="text-center" v-if="radioRegalado == '4'">Acción: GUIA</p>
      <div class="w-full mb-base mt-2" align="center">
        <h4>Está seguro de aplicar estos <span class="text-success">{{ totalCodigos }}</span> códigos? al periodo <b class="text-danger">{{  periodoDescripcion }}</b></h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO O PAQUETES-->
    <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
      <div v-if="tipoBodega == 1 || tipoBodega == 2">
        <TableProblemasDiagnosticoVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasDiagnostico="arregloProblemasDiagnostico"/>
      </div>
      <div v-if="tipoBodega == 3">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete"/>
      </div>
    </vs-popup>
    <vs-popup small title="Codigos diágnostico no existen" :active.sync="popupCodigosDiagnosticoNoexisten">
      <TableProblemasDiagnosticoVue v-if="popupCodigosDiagnosticoNoexisten" :items="5" :arregloProblemasDiagnostico="arregloCodigosDiagnosticoNoexisten"/>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado">
      <TipoImportacionVue v-if="popupConfirmTipoImportado" @changeTipo="changeTipo"/>
    </vs-popup>
      <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
      <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosLista :arregloCodigos="codigosSinCodigoUnion" openModal="0"/>
    </vs-popup>
  </div>
</template>
<script>
import gestionCodigosLista from '../../gestionCodigosLista.vue'
import ImportExcel from '@/views/codigos/components/importExcel'
import vSelect from 'vue-select'
import TableProblemasDiagnosticoVue from '../../TableProblemasDiagnostico.vue'
import TipoImportacionVue from '@/views/codigos/components/utils/components/GestionLiquidacion/TipoImportacion'
const TablaErroresPaqueteVue = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
import PeriodoRepository from '@/repositories/PeriodoRepository'
  import {
    mapState
} from "vuex";
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    TableProblemasDiagnosticoVue,
    TipoImportacionVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
  },
  data () {
    return {
      codigosPerdidos:false,
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      modalConfirm: false,
      modalErrores: false,
      errores: [],
      cedulas_no_encontradas: [],
      codigosNoExisten:[],
      codigosNoCambiados:[],
      arregloCodigosDiagnosticoNoexisten:[],
      popupCodigosDiagnosticoNoexisten:false,
      porcentaje:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      institucion_id:0,
      periodo_id:0,
      radioRegalado:'',
      venta_estado:0,
      codigosNoExisten:[],
      cantidadNoExisten:0,
      error:false,
      periodoDescripcion:'',
      ciudadDescripcion:'',
      factura:'',
      checkFactura:true,
      //VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      tipoBodega:0,
      arregloProblemasDiagnostico:[],
      popupProblemasDiagnostico:false,
      popupConfirmTipoImportado:false,
      contadorA:0,
      contadorD:0,
      titleImportacion:'Importacion Sticker (Activación)',
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      totalCodigos:0,
      //variables paquete
      cantidadPaquete:20,
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //VARIABLES PARA ERRORES CODIGOS PAQUETES
      arregloProblemasPaquete:[],
      arregloFormatoSend:[],
      arrayPaquetes:[],
      totalCodigos:0,
      arregloErroresPaquetes:[],
      codigoConProblemas:[],
      //FIN VARIABLES PARA ERRORES CODIGOS PAQUETES
      //fin variables paquetes
      observacion:'',
      activeTypes:false,
      activePaquete:false,
      //VARIABLES PARA PERIODOS EN EL ROOT
      arrayPeriodos:[],
      periodoSelect:'',
      //FIN VARIABLES PARA PERIODOS EN EL ROOT
    }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos = false
  },
  mounted(){
    let me = this;
    if(me.userRoot){ me.obtenerPeriodos() }
  },
  watch:{
    factura(results){
      if(results !=""){
        this.factura = results.replace(/\s/g, "");
      }
    }
  },
  computed:{
    sumaNoIngresados(){
      let me = this;
      if(me.codigosPerdidos){
        let total      = me.totalCodigos - (me.contadorA + me.contadorD)
        return total
      }
    },
    ...mapState(["auth",'userRoot','susuario','groupFacturador']),

  },
  methods: {
    obtenerPeriodos(){
      let me = this;
      PeriodoRepository.getPeriodos().then( p => { me.arrayPeriodos = p.data; });
    },
    changeTipo(e){
      let me = this
      if(e.sendtipoBodega == 3) { me.activeTypes = true;  me.activePaquete = true; me.radioRegalado = 0;}
      else                      { me.activeTypes = true; me.activePaquete = false; me.radioRegalado = ''}
      me.tipoBodega                 = e.sendtipoBodega
      me.titleImportacion           = e.sendtitleImportacion
      me.cantidadPaquete            = e.sendcantidadPaquete
      me.popupConfirmTipoImportado  = false;
      me.ejecutarValidacion()
    },
    ejecutarValidacion(){
      let me = this;
      if(me.tipoBodega == 1 || me.tipoBodega == 2) { me.validateCodigos() }
      if(me.tipoBodega == 3) { me.validateCodigosPaquete() }
    },
    validateCodigos(){
      let me                            = this;
      try{
        let datos                       = []
        me.arregloProblemasDiagnostico  = []
        datos                           = me.tableData
        var preValores                  = []
        //quitar types NumRow
        datos.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo.trim().toUpperCase()
          preValores.push(obj)
        });
        var getLongitud = datos.length
        var longitud    = getLongitud/2
        for(var i = 0; i<longitud;i++){
          // Creamos un nuevo array para almacenar los objetos quitados
          const nuevoArray        = [];
          let   codigoActivacion  = "";
          let   codigoDiagnostico = "";
          // Quitamos los dos primeros objetos del array original y los agregamos al nuevo array
          nuevoArray.push(preValores.splice(0, 2));
          var setear = nuevoArray.flat()
          //====VALIDACION SI SOLO HAY UN CODIGO====
          if(setear.length == 1){
            var cal = new Object
            //ACTIVACION - DIAGNOSTICO)
            if(me.tipoBodega == 1){
              cal.codigoActivacion =  setear[0].codigo
              cal.codigoDiagnostico  =  ""
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.tipoBodega == 2){
              cal.codigoDiagnostico =  setear[0].codigo
              cal.codigoActivacion  =  ""
            }
            cal.problema          =  'formato'
            me.arregloProblemasDiagnostico.push(cal)
          }
          //==SI TODO ESTA NORMAL===
          else{
            //ACTIVACION - DIAGNOSTICO)
            if(me.tipoBodega == 1){
              codigoActivacion      = setear[0].codigo;
              codigoDiagnostico     = setear[1].codigo
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.tipoBodega == 2){
              codigoDiagnostico     = setear[0].codigo
              codigoActivacion      = setear[1].codigo;
            }
            //============ACTIVACION==================================
            //VALIDACION SI NO SON STRING
            if (typeof codigoActivacion !== 'string' || typeof codigoDiagnostico !== 'string' ) {
              var cal = new Object
              cal.codigoActivacion  =  codigoActivacion
              cal.codigoDiagnostico =  codigoDiagnostico
              cal.problema          =  'formato'
              me.arregloProblemasDiagnostico.push(cal)
            }
            else{
              const activacionMinuscula = codigoActivacion.toLowerCase();
              //validar que el codigo de activacion no tenga una P
              if(activacionMinuscula.startsWith("p")){
                //validar meñique que el codigo de activacion se permita empezar por p DONDE SEA PLM no hago nada
                if(activacionMinuscula.startsWith("plm")){
                }else{
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'activacion'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
              //=============DIAGNOSTICO===================================
              //validar que el codigo de activacion tenga una P
              const diagnosticoMinuscula = codigoDiagnostico.toLowerCase();
              //validar si es meñique debe tener 2 pp
              if(activacionMinuscula.startsWith("plm")){
                //si no inicia por 2 pp
                if(!diagnosticoMinuscula.startsWith("pp")){
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'diagnostico'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
              //diferente a meñique
              else{
                if(!diagnosticoMinuscula.startsWith("p")){
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'diagnostico'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
            }
          }
        }//Fin FOR
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasDiagnostico.length > 0){
          me.popupProblemasDiagnostico = true
        }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    //==================================METODOS PAQUETES===================
    validateCodigosPaquete(){
      let me                                = this;
      try{
        me.arregloFormatoSend               = []
        const problema                      = "Problema con el paquete"
        me.arregloProblemasPaquete          = []
        let preValores                      = []
        preValores                          = JSON.parse(JSON.stringify(me.tableData));
        let datos                           = []
        preValores.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo.trim().toUpperCase()
          datos.push(obj)
        });
        //validar si son mas de 200 paquetes
        if(datos.length > 200){
          me.$vs.notify({
          text:'No puedes subir mas de 200 paquetes',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        datos.forEach(element => {
          let ifErrsPaquete                 = false
          let codigoPaquete                 = element.codigo
          //validar que el codigo sea string
          if (typeof codigoPaquete !== 'string' )   { ifErrsPaquete        = true }
          else{
            const paqueteMinuscula = codigoPaquete.toLowerCase();
            if(!paqueteMinuscula.startsWith("paq-")) { ifErrsPaquete        = true }
          }
          //si existe un errores
          if(ifErrsPaquete){
            var cal               = new Object
            cal.codigoPaquete     =  codigoPaquete
            cal.problema          =  problema
            cal.codigosHijos      =  []
            me.arregloProblemasPaquete.push(cal)
          }else{
            me.arregloFormatoSend.push({codigoPaquete:codigoPaquete})
          }
        });
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasPaquete.length > 0){ me.popupProblemasDiagnostico = true }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    //===================================FIN METODOS PAQUETES===============
    eliminarInstitucionSeleccionada(){
      let me = this;
      me.nombreInstitucion = ""
      me.instituciones = []
      me.institucion_id = 0
      me.periodo_id = 0
      me.periodoDescripcion = ""
    },
    changePeriodo(){
      let me = this
      if(me.instituciones.length > 0){
        me.instituciones.map(function (item) {
          item.EstadoConfiguracion      = 1
          item.periodo_configurado      = me.periodoSelect.idperiodoescolar
          item.periodoNombreConfigurado = me.periodoSelect.periodoescolar
        })
      }
    },
    getInstitucion() {
      let me = this;
      me.periodoSelect                        = ""
      me.codigosPerdidos                      = false
      me.instituciones                        = [];
      me.arregloCodigosDiagnosticoNoexisten   = []
      me.nombreInstitucion                    = "";
      me.institucion_id                       = 0;
      if(me.busquedaInstitucion.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?busqueda='+me.busquedaInstitucion)
        .then(function (res) {
          let datos = res.data
          me.instituciones = datos
          // if(datos.length > 0){
          //   me.instituciones = datos.filter(p => p.statusPeriodo == '1')
          // }
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
    asignarInstitucion(tr){
      let me = this;
      me.error = false
      me.nombreInstitucion     = tr.nombreInstitucion
      me.institucion_id        = tr.idInstitucion
      if(tr.EstadoConfiguracion == 1){
      me.periodo_id            = tr.periodo_configurado
      me.periodoDescripcion    = tr.periodoNombreConfigurado
      }else{
      me.periodo_id            = tr.periodo_id
      me.periodoDescripcion    = tr.periodo
      }
      me.ciudadDescripcion     = tr.ciudad
      me.instituciones = []
      //me.getPeriodo(tr.idInstitucion)
    },
    loadDataInTable ({ results, header, meta }) {
      let me = this;
      console.log("oo",results)
      this.totalCodigos                       = 0
      this.arregloProblemasDiagnostico        = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.codigosNoExisten                   = []
      this.header                             = header
      this.tableData                          = results
      me.totalCodigos                         = results.length
      me.codigosPerdidos                      = false
      this.codigosNoCambiados                 = []
      this.sheetName = meta.sheetName
      this.popupConfirmTipoImportado          = true;
      this.arregloProblemasPaquete            = []
      this.arregloResumen                     = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.arregloFormatoSend                 = []
    },
    procesarPagos(){
      let me = this
      if(me.radioRegalado === ""){
        me.$vs.notify({
        text:'Debe seleccionar un tipo por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      //si colocan usan y liquidan
      if(me.venta_estado == 0 || me.venta_estado == null || me.venta_estado == undefined || me.venta_estado == "null" || me.venta_estado == ""){
        me.$vs.notify({
        text:'Debe seleccionar un tipo de venta por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.checkFactura){
        if(me.factura == ""){
          me.$vs.notify({
          text:'Debe ingresar el número de factura por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
      }else{
        me.factura  = ""
      }
      if(me.error){
        me.$vs.notify({
        text:'La institucion no tiene periodo',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.institucion_id <= 0){
        me.$vs.notify({
        text:'Seleccione una institución por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
      }
      //si escogio tipo de importacion Diagnostico
      if(me.tipoBodega == 1 || me.tipoBodega == 2){
        if(me.arregloProblemasDiagnostico.length > 0){
          me.$vs.notify({
          text:'Existe codigos de activación con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      //si escogio tipo de paquete
      if(me.tipoBodega == 3){
        if(me.arregloProblemasPaquete.length > 0){
          me.$vs.notify({
          text:'Existe codigos del paquete con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
        if(me.arregloFormatoSend.length > 200){
          me.$vs.notify({
          text:'No puedes subir mas de 200 paquetes',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(me.arregloFormatoSend.length == 0){
          me.$vs.notify({
          text:'Hubo problemas para subir los paquetes',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      var json_pagos = ""
      if(me.tipoBodega == 3 ) {  json_pagos = JSON.stringify(me.arregloFormatoSend) }
      else                                         {  json_pagos = JSON.stringify(me.tableData) }
      let comentario = ""
      if(me.venta_estado == '1') comentario = "Venta directa "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura
      if(me.venta_estado == '2') comentario = "Venta lista "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura
      if(me.radioRegalado == 1) comentario = "Regalado "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura
      if(me.radioRegalado == 2) comentario = "Regalado y bloqueado "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura
      if(me.radioRegalado == 3) comentario = "Bloqueado "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura
      if(me.radioRegalado == 4) comentario = "CÓDIGO GUIA "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura
      let formData = new FormData();
      formData.append('data_codigos',   json_pagos);
      formData.append('id_usuario',     me.usuario.idusuario);
      formData.append('regalado',       me.radioRegalado);
      formData.append('institucion',    'yes')
      formData.append('institucion_id', me.institucion_id)
      formData.append('periodo_id',     me.periodo_id)
      // formData.append('periodo_id',     localStorage.periodoSeleccionado)
      formData.append('comentario',     comentario + ' _ ' + me.observacion)
      formData.append('factura',        me.factura)
      formData.append('venta_estado',   me.venta_estado)
      formData.append('tipoBodega',     me.tipoBodega)
      var url = ""
      //tipo importacion Anterior
      if(me.tipoBodega == '0'){
        url = this.$server_url+'codigos/import/gestion'
      }
      //tipo importacion Activacion - Diagnostico
      if(me.tipoBodega == '1' || me.tipoBodega == '2' ){
        url = this.$server_url+'codigos/import/gestion/diagnostico'
      }
      //tipo paquete
      if(me.tipoBodega == '3' ){
        url = this.$server_url+'paquetes/importPaqueteGestion'
      }
      me.$vs.loading()
      this.$http.post(url, formData)
      .then(res => {
        me.$vs.loading.close()
        me.$vs.notify({
        text:'Códigos procesados exitosamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.modalConfirm                             = false
        me.tableData                                = []
        me.codigoConProblemas                       = res.data.codigoConProblemas
        //activacion - diagnostica normal
        if( this.tipoBodega == 1 || this.tipoBodega == 2){
          me.contadorA                              = res.data.contadorA
          me.contadorD                              = res.data.contadorD
          if(res.data.CodigosDiagnosticoNoexisten.length > 0){
            me.arregloCodigosDiagnosticoNoexisten   = res.data.CodigosDiagnosticoNoexisten
            me.popupCodigosDiagnosticoNoexisten     = true
          }
        }
        //paquetes
        if( this.tipoBodega == 3 ){
          me.arregloResumen                         = res.data.arregloResumen
          me.codigoConProblemas                     = res.data.codigoConProblemas
          me.arregloErroresPaquetes                 = res.data.arregloErroresPaquetes
        }
        if( this.tipoBodega == 0){
          me.porcentaje                             = res.data.ingresados
          me.codigosNoCambiados                     = res.data.codigosNoCambiados
          me.codigosNoExisten                       = res.data.codigosNoExisten
          me.codigosSinCodigoUnion                  = res.data.codigosSinCodigoUnion
          if(me.codigosSinCodigoUnion.length > 0){
              me.popupProblemasCodigosUnion         = true
          }
        }
        me.venta_estado                             = 0
        me.factura                                  = ''
        me.observacion                              = ""
        me.codigosPerdidos                          = true
      })
      .catch(function (error) {
        me.$vs.notify({
        text:'Verifique que la información se haya guardado correctamente.',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-alert-triangle'})
        me.$vs.loading.close()
        // setTimeout(function() {location.reload()}, 1000);
      })
    },
    openConfirm(tipo) {
      let me = this
      //volver a revisar que este bien el formato del excel
      me.ejecutarValidacion()
      if( !me.tableData[0].codigo){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.arregloProblemasDiagnostico.length > 0){
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.arregloProblemasPaquete.length > 0){
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.codigo){
          me.errores.push(value)
        }
      })
      if( me.errores.length > 0 ){
        me.modalErrores = true
      }else{
        me.modalConfirm = true
      }
    },
  }
}
</script>
<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {

  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #2D9ADA;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
/*CSS IMPORTADOR TIPO BODEGA*/

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
