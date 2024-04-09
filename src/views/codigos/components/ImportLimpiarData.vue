
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
        <h4>Está seguro de aplicar estas códigos?</h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <vs-card>
      <div slot="header">
        <p>Generar devolucion</p>
      </div>
      <div v-if="tipo == '1'">
          <vs-row class="mt-3">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
                <div style="width:95%;display:flex;">
                  <div style="width:95%;">
                  <p style="margin-left:30px;">Busqueda de la institución</p>
                    <vs-input icon="search" class="mt-2" style="width:95%;margin-left: 30px;" placeholder="Search" @keyup.enter="getInstitucion()"  v-model="busquedaInstitucion"/>
                  </div>
                  <div style="width:10%;margin-left:20px;margin-top:15px;">
                      <vs-button radius color="warning" class="mt-3 ml-5" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                  </div>
                </div>
            </vs-col>
        </vs-row>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
              <vs-table stripe max-items="50" v-if="instituciones.length > 0" style="width: 100%;" search pagination :data="instituciones">
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
                      <!-- <vs-th sort-key="nombre">Estado Periodo</vs-th> -->
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
                          <!-- <vs-td>
                            <small class="" >{{ tr.periodo }}</small><br>
                            <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                            <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                          </vs-td> -->
                          <vs-td>
                              <vs-button type="relief" @click="asignarInstitucion(tr)">Asignar Institucion</vs-button>
                          </vs-td>
                      </vs-tr>
                  </template>
              </vs-table>
          </vs-col>
        </vs-row>
        <vs-row class="mt-2">
          <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-input label="Cliente"  v-model="cliente" style="width:95%;" placeholder="Nombre"/>
          </vs-col>
        </vs-row>
        <vs-row class="mt-3">
          <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="6">
            <ul class="leftx" style="display:flex;flex-direction: row;">
              <li class="mt-1 ml-10">Región</li>
              <li class="ml-2">
              <vs-radio v-model="region" vs-name="radiosRegion" @input="getPeriodos()" vs-value="1">Sierra</vs-radio>
              </li>
              <li class="ml-2">
              <vs-radio v-model="region" vs-name="radiosRegion" @input="getPeriodos()" vs-value="2">Costa</vs-radio>
              </li>
            </ul>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <ul class="leftx" style="display:flex;flex-direction: row;">
              <li>Devolver liquidados</li>
              <li class="ml-2">
              <vs-radio v-model="dLiquidado" vs-name="radiosdLiquidado" vs-value="0">No</vs-radio>
              </li>
              <li class="ml-2">
              <vs-radio v-model="dLiquidado" vs-name="radiosdLiquidado" vs-value="1">Si</vs-radio>
              </li>
            </ul>
         </vs-col>
        </vs-row>
        <div class="vx-col w-full mt-3">
            <p style="margin-left: 30px;">Seleccione el periodo:</p>
            <v-select  style="width:95%;margin-left: 30px;" :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodo"  v-model="periodo" />
        </div>
        <br>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-textarea counter="500" style="width:95%;" label="Observacion" :counter-danger.sync="counterDanger" v-model="observacion" />
            </vs-col>
        </vs-row>
      </div>
      <div class="mb-6 mt-5" align="center">
          <div class="vx-col w-full">
            <p style="color:#B251E3;">
              <i class="fa fa-file" aria-hidden="true"></i>{{title}}<span style="font-weight: bold;"> (No ingrese más de 1000 registros en una sola carga.)</span>
            </p>
            <div v-if="nombreInstitucion.length > 1">
              <p style="color:red;font-weight:bold;">Institucion asignada <span>{{nombreInstitucion}}</span></p>
            </div>
          </div>
          <br/>
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
          <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
              <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
          </vs-alert>
          <vs-row v-if="tableData.length > 0 && tableData.length <= 1000 ">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)">devolver codigos </vs-button>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-alert active="true" style="height: 60px;">
                      Se devolvio  {{ porcentaje }} códigos
                      <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
                  </vs-alert>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
             <vs-card>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                    <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                      <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                        <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                      </vs-list-item>
                  </vs-list>
              </vs-col>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
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
              <span style="font-weight:bold;">Codigos que ya ha sido liquidados / o estan en otra institución</span>
          </div>
          <gestionCodigosListaVue :arregloCodigos="codigosConLiquidacion" openModal="1"/>
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
     <!--MODAL PARA EXPORTAR A EXCEL-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
      <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
          <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
      </vs-alert>
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
    </vs-prompt>
    <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
    <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosListaVue :arregloCodigos="codigosSinCodigoUnion" openModal="0"/>
    </vs-popup>
  </div>
</template>
<script>
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
import gestionCodigosListaVue from './utils/gestionCodigosLista.vue'
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosListaVue,
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
      codigosConLiquidacion:[],
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
      //variables para el export a excel
      activePrompt:false,
      codigoSelected: [],
      reportesActivo: 0,
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
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
      tipo:'1',
      title:'Estos códigos van a ser devueltos seran quitados el usuario, venta_estado, etc. Mientras no esten liquidados ni Leidos',
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      dLiquidado:0,
    }
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
        this.getPeriodos()
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos  = false;
      this.header           = header
      this.tableData        = results
      this.sheetName        = meta.sheetName
    },
    procesarPagos(){
      let me = this
      if(me.institucion_id <= 0){
          me.$vs.notify({
          text:'Seleccione una institución por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
      }
      if(me.tipo == 1){
        if(me.cliente.trim() == ""){
          me.$vs.notify({
          text:'Debe ingresar un cliente por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
      }
      if(me.periodo == undefined  || me.periodo == null || me.periodo == ""){
        me.$vs.notify({
        text:'Seleccione un periodo',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
        }
      }
      if(me.observacion == ""){
          me.$vs.notify({
          text:'Debe ingresar una observación',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        if(me.observacion.length < 5){
          me.$vs.notify({
          text:'La observación debe tener al menos 5 caracteres',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }

        me.$vs.loading()
        let json_pagos = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_codigos',   json_pagos);
        formData.append('admin',          'yes')
        formData.append('id_usuario',     me.usuario.idusuario);
        formData.append('usuario_editor', me.usuario.idusuario);
        formData.append('cliente',        me.cliente);
        formData.append('observacion',    me.observacion);
        formData.append('institucion_id', me.institucion_id);
        formData.append('periodo_id',     me.periodo.idperiodoescolar)
        if(me.dLiquidado == 1)            formData.append('dLiquidado',     me.dLiquidado)
        this.$http.post(this.$server_url+'codigos/bodega/devolver', formData)
        .then(res => {
          me.codigosConLiquidacion = res.data.codigosConLiquidacion
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
          me.modalConfirm           = false
          me.tableData              = []
          me.codigosPerdidos        = true
          me.codigosNoCambiados     = res.data.codigosNoCambiados
          me.codigosSinCodigoUnion  = res.data.codigosSinCodigoUnion
          if(me.codigosSinCodigoUnion.length > 0){
            me.popupProblemasCodigosUnion = true
          }
          me.codigoNoExiste         = res.data.codigoNoExiste
          me.porcentaje             = res.data.cambiados
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
      me.tipo_selected = tipo
      if( !me.tableData[0].codigo){
            me.$vs.loading.close()
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
     busquedaFiltroEstudiante(){
      let me = this;
      me.estudiantesCursos = [];
      if(me.razonBusqueda.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading();
        //para los administradores
        this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.valorBusqueda+'&razonBusqueda='+me.razonBusqueda)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == '0'){
            me.$vs.notify({
            text: res.data.message,
            color:'primary',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }else{
            me.estudiantesCursos = res.data
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
    },

    asignarUsuario(tr){
       let me = this;
       me.datos.usuario = tr.name_usuario
       me.datos.idusuario  = tr.idusuario
       me.estudiantesCursos = []
    },
      //lista de ciudades para usar en el select
    getPeriodos() {
      let me = this
      this.$http.get(this.$server_url + 'periodo?porAllEstados=yes&region='+me.region).then(res => {
              me.arregloPeriodos = res.data;
          })
          .catch(function (error) {
              console.log(error)
          })
    },

     //PARA ASIGNAR UNA INSTITUCION
    getInstitucion() {
      let me                = this;
      me.instituciones      = [];
      me.nombreInstitucion  = "";
      me.institucion_id     = "";
      me.cliente            = "";
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
            me.instituciones = res.data;
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
       me.nombreInstitucion = tr.nombreInstitucion
       me.cliente           = tr.nombreInstitucion
       me.institucion_id    = tr.idInstitucion
       me.instituciones     = []
       me.getPeriodo(tr.idInstitucion)
     },

      //METODOS PARA EXCEL
       //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
           exportToExcel() {
            let headerTitle = ['codigo','institucion estudiante','periodo estudiante',  'estudiante','cedula', 'estado','liquidacion','código de barras','bc_estado','venta estado','institucion barras','periodo barras'];
            let headerVal = ['codigo', 'nombreInstitucion','periodo','estudiante','cedula', 'codigoEstado','liquidacion','status','barrasEstado','ventaEstado','institucionBarra','periodo_barras'];
            let codigoSelectedMayus = this.codigoSelected
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
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
  background-color: #BE75E3;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
