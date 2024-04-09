
<template>
  <div>
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
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.Id_institucion"> {{item.Id_institucion}} </span>
              </div>
               <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.comentario"> {{item.comentario}} </span>
              </div>
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.venta_estado"> {{item.venta_estado}} </span>
              </div>
          </div>
        </div>
       </div>
    </vs-popup>
    <vs-popup title="Códigos no encontrados" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()"  style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(235,147,25); background: linear-gradient(90deg, rgba(235,147,25,1) 28%, rgba(255,166,0,1) 100%); color: white; border-radius: 5px; padding: 10px;">
        <div class="vx-row">
          <div class="vx-col w-full" align="center">
           <b>Codigos a las que no se aplicaron correctamente</b>
          </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in cedulas_no_encontradas">
          <div class="vx-row">
              <div class="vx-col w-full" align="center"> <span> {{item}} </span> </div>
          </div>
        </div>
       </div>
    </vs-popup>
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Estás seguro de aplicar estas códigos?</h4>
      </div>
      <p v-if="tipoBodega == 3" class="text-center font-bold">Importación Paquetes</p>
      <p v-if="tipoBodega == 0" class="text-center font-bold">Importación Códigos Normales</p>
      <div class="w-full" align="center">
        <vs-button class="mb-2 mt-3" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <vs-card>
      <div slot="header">
          <p style="color:#2468D0;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Activar Devolución</span> </p>
      </div>
      <div>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-textarea counter="200" style="width:95%;" label="Motivo de activacion de la devolución" :counter-danger.sync="counterDanger" v-model="observacion" />
          </vs-col>
        </vs-row>
      </div>
      <div class="mb-6 mt-5" align="center">
          <div class="vx-col w-full">
            <p style="color:#2468D0;">
              <i class="fa fa-file" aria-hidden="true"></i>Estos códigos van a ser activados de la devolucion<span style="font-weight: bold;"> (No ingrese más de 1000 registros en una sola carga.)</span>
            </p>
            <p>En los paquetes no ingrese mas de <b>200 paquetes</b> </p>
          </div>
          <br/>
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
            <TableResumenPaqueteVue v-if="arregloResumen.length > 0" :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend"/>
          </div>
          <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
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
          <!-- {{tableData}} -->
          <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle" style="height: 90px;">
              <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
              <b>{{titleImportacion}}</b>
          </vs-alert>
          <vs-row v-if="tableData.length > 0 && tableData.length <= 1000 ">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)">Activar códigos </vs-button>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true && tipoBodega == '0'">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-alert active="true">
                    Se activo  {{ porcentaje }} códigos de la devolucion
                    <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
                  </vs-alert>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
             <vs-card>
              <vs-col vs-type="flex" v-if="codigosNoCambiados.length > 0" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                    <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                      <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                        <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                      </vs-list-item>
                  </vs-list>
              </vs-col>
              <vs-col vs-type="flex" v-if="codigoNoExiste.length > 0" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                    <p>Cantidad <span>{{ codigoNoExiste.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
                      <vs-list-item :key="s" v-for="(tr, s) in codigoNoExiste" icon="check" :title="tr.codigo" >
                      </vs-list-item>
                  </vs-list>
              </vs-col>
            </vs-card>
          </vs-row>
      </div>
    </vs-card>
    <vs-row v-if="codigosPerdidos == true">
        <vs-card>
          <div class="header">
              <span style="font-weight:bold;">Códigos con problemas</span>
          </div>
          <TableRadiosCodigosListaVue :arregloCodigos="codigoSinDevolucion" openModal="1"/>
          <!-- <gestionCodigosListaVue :arregloCodigos="codigoSinDevolucion" openModal="1"/> -->
        </vs-card>
    </vs-row>
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
    <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
    <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosListaVue :arregloCodigos="codigosSinCodigoUnion" openModal="0"/>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado">
      <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
      <p class="text-danger mt-2 text-center">!Los paquetes máximo 200 paquetes</p>
      <vs-divider></vs-divider>
      <div class="flex justify-center mt-2" style="flex-wrap: wrap;">
        <vs-button class="m-3" color="primary"   @click="tipoBodega= 0;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Códigos)';">Códigos</vs-button>
        <vs-button class="m-3" color="#29BCC6"   @click="tipoBodega= 3;  popupConfirmTipoImportado=false;titleImportacion = 'Importacion Paquetes';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
      </div>
      <div class="flex justify-center">
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO O PAQUETES-->
    <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
      <div v-if="tipoBodega == 3">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete"/>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
import gestionCodigosListaVue from '@/views/codigos/components/utils/gestionCodigosLista'
const TablaErroresPaqueteVue      = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue      = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
const TableRadiosCodigosListaVue  = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue')
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosListaVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
    TableRadiosCodigosListaVue
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
      tipo_selected: '',
      cedulas_no_encontradas: [],
      modalCedulas: false,
      codigosNoCambiados:[],
      codigoSinDevolucion:[],
      codigoNoExiste:[],
      porcentaje:0,
      usuarioSeleccionado:'',
      razonBusqueda:'',
      valorBusqueda:'cedula',
      estudiantesCursos:[],
      region:'2',
      periodos:[],
      periodo:{
        getPeriodo:''
      },
      datos:{
        usuario:'',
        idusuario:'',
        periodo:'',
      },
      codigosNoExisten:[],
      cantidadNoExisten:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      institucion_id:'',
      cliente:'',
      observacion:'',
      counterDanger: false,
      arregloPeriodos:[],
      periodo:'',
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      //variables paquetes
      popupConfirmTipoImportado:false,
      arregloFormatoSend:[],
      arregloProblemasPaquete:[],
      arregloResumen:[],
      arregloErroresPaquetes:[],
      tipoBodega:0,
      titleImportacion:'',
      popupProblemasDiagnostico:false,
      //fin variables paquetes
    }
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
    },
  methods: {
    ejecutarValidacion(){
      let me = this;
      if(me.tipoBodega == 3) { me.validateCodigosPaquete() }
    },
    //==================================METODOS PAQUETES===================
    validateCodigosPaquete(){
      let me                                = this;
      try{
        me.arregloFormatoSend               = []
        const problema                      = "Problema con el paquete"
        me.arregloProblemasPaquete          = []
        let datos                           = JSON.parse(JSON.stringify(me.tableData));
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
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos            = false;
      this.header                     = header
      this.tableData                  = results
      this.sheetName                  = meta.sheetName
      this.popupConfirmTipoImportado  = true;
      this.arregloFormatoSend         = []
      this.arregloProblemasPaquete    = []
      this.arregloResumen             = []
      this.arregloErroresPaquetes     = []
      this.codigoNoExiste             = []
    },
    procesarPagos(){
      let me = this
      if(me.observacion.trim() == ""){
          me.$vs.notify({
          text:'Debe ingresar el motivo de la activacion de los codigos que han sido devueltos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
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
      if(me.tipoBodega == 3 ) { json_pagos = JSON.stringify(me.arregloFormatoSend) }
      else                    { json_pagos = JSON.stringify(me.tableData) }
      let formData = new FormData();
      formData.append('data_codigos', json_pagos);
      formData.append('id_usuario', me.usuario.idusuario);
      formData.append('usuario_editor', me.usuario.idusuario);
      formData.append('periodo_id',   localStorage.periodo_id);
      formData.append('observacion', me.observacion);
      //tipo paquete
      var url = ""
      if(me.tipoBodega == '3' ){
        url = this.$server_url+'paquetes/activar_devolucion_paquete'
      }else{
        url = this.$server_url+'codigos/devolucion/activar'
      }
      me.$vs.loading()
      this.$http.post(url,formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
        me.$vs.notify({
        text:'Códigos procesados exitosamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.modalConfirm       = false
        me.tableData          = []
        me.codigosPerdidos    = true
        //paquetes
          if( this.tipoBodega == 3 ){
          me.arregloResumen               = res.data.arregloResumen
          me.codigoSinDevolucion          = res.data.codigoConProblemas
          me.arregloErroresPaquetes       = res.data.arregloErroresPaquetes
        }else{
          me.codigoSinDevolucion          = res.data.codigoSinDevolucion
          me.codigosNoCambiados           = res.data.codigosNoCambiados
          me.codigoNoExiste               = res.data.codigoNoExiste
          me.porcentaje                   = res.data.cambiados
          me.codigosSinCodigoUnion        = res.data.codigosSinCodigoUnion
          if(me.codigosSinCodigoUnion.length > 0){
            me.popupProblemasCodigosUnion = true
          }
        }
      })
      .catch(function (error) {
        me.$vs.notify({
        text:'Verifique que la información se haya guardado correctamente.',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-alert-triangle'})
        me.$vs.loading.close()
      })
    },
    openConfirm(tipo) {
      let me = this
      me.tipo_selected = tipo
      if( !me.tableData[0].codigo){
            me.$vs.loading.close()
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
    recargar(){
      location.reload()
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
  background-color: #2468D0;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
