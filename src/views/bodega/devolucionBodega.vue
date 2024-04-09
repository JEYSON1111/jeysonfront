
<template>
    <vs-card>
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
        <div class="mb-6" align="center">
            <div class="vx-col w-full">
                <p style="color:#535DD2;">
                    <i class="fa fa-file" aria-hidden="true"></i> Devolucion de codigos <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
                </p>
                <div v-if="nombreInstitucion.length > 1">
                    <p style="color:red;font-weight:bold;">Institucion asignada <span>{{nombreInstitucion}}</span></p>
                </div>
            </div>
            <!--FORMULARIO-->
            <div class="vx-row mt-5">
                <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-info" @keyup.enter="getInstitucion()"  v-model="busquedaInstitucion" icon-no-border label="Busqueda de la institución" />
                    <vs-button radius size="small" color="warning" class="mt-5 ml-5" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <p class="font-bold">Seleccion la region:</p>
                    <ul class="leftx mt-3" style="display:flex;flex-direction: row;justify-content: center;">
                        <li class="ml-2">
                        <vs-radio v-model="region" vs-name="radiosRegion" @input="getPeriodo()" vs-value="1">Sierra</vs-radio>
                        </li>
                        <li class="ml-2">
                        <vs-radio v-model="region" vs-name="radiosRegion" @input="getPeriodo()" vs-value="2">Costa</vs-radio>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="vx-row mt-4">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Cliente (Obligatorio)" v-model="cliente" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-edit" icon-no-border label="Observación (Obligatorio)" v-model="observacion" />
                </div>
            </div>
            <!--FIN FORMULARIO-->
            <!--TABLA DE INSTITUCIONES-->
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
            <!--FIN TABLA DE INSTITUCIONES-->
            <vs-switch color="success" v-model="tipo" @input="codigosPerdidos = false;" style="width:100px;" class="mt-2">
                <span slot="on">Por importación</span>
                <span slot="off">Por código</span>
            </vs-switch>
            <div v-if="tipo">
                <vs-divider>Seleccione el archivo</vs-divider>
                <div class="flex mb-4">
                    <div class="w-full p-2 bg-gray-400 text-center">
                        <import-excel :onSuccess="loadDataInTable" class="mb-4" />
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="vx-row mb-6 mt-4">
                    <div class="vx-col sm:w-1/3 w-full">
                    <span>Ingrese el código</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-pack="feather" @keyup.enter="procesarPagos()" active icon="icon-code" ref="ingreso" autofocus icon-no-border v-model="codigo" />
                    </div>
                </div>
                <div class="flex" style="justify-content:center;">
                    <vs-button @click="procesarPagos()" class="mr-3 mb-2">Devolver código</vs-button>
                </div>
            </div>
            <vs-alert v-if="tableData.length > 0" color="danger" class="mb-3 mt-2"  icon-pack="feather" icon="icon-alert-triangle">
                <span style="font-size: 20px;">Excel cargado exitosamente. ¿Está seguro de devolver estos códigos?</span><br>
            </vs-alert>
            <vs-row v-if="tableData.length > 0 && tableData.length <= 2000 " class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button class="mb-2" color="danger"  type="relief" @click="openConfirm(0)"> Devolver códigos </vs-button>
                </vs-col>
            </vs-row>
            <vs-row v-if="codigosPerdidos == true">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-alert active="true">
                      Se devolvio  {{ porcentaje }} códigos correctamente
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
            <vs-row v-if="codigosPerdidos == true">
                <vs-card v-if="codigosConLiquidacion.length > 0">
                  <div class="header">
                      <span style="font-weight:bold;font-size: 20px;color:red;">Codigos que no se pudieron devolver</span>
                  </div>
                  <vs-table multiple v-model="codigoSelected" stripe pagination max-items="25" search :data="codigosConLiquidacion">
                      <template slot="header" class="flex">
                          <p>Cantidad: {{codigosConLiquidacion.length }}</p>
                          <vs-button color="warning" size="small" class="mt-3 ml-3" style="font-size: 16px;" @click="activePrompt=true;">Exportar</vs-button>
                      </template>
                      <template slot="thead">
                          <vs-th sort-key="codigo">Código</vs-th>
                          <vs-th sort-key="estudiante">Informacion</vs-th>
                          <vs-th sort-key="estudiante">Mensaje</vs-th>
                      </template>
                      <template slot-scope="{data}">
                          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                              <vs-td :data="data[indextr].codigo">
                                  {{ tr.codigo }}
                              </vs-td>
                              <vs-td :data="data[indextr].barrasEstado">
                                  <p style="font-weight:bold;">institucion:</p>
                                  <span>{{tr.institucionBarra}}</span>
                                  <p style="font-weight:bold;">periodo:</p>
                                  <span>{{tr.periodo_barras}}</span>
                                  <p>
                                      <vs-chip color="success" v-if="tr.estado_liquidacion == '1'">
                                          Por liquidarse
                                      </vs-chip>
                                      <vs-chip color="warning" v-else-if="tr.estado_liquidacion == '2'">
                                          Regalado
                                      </vs-chip>
                                      <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '0'">
                                          Liquidado
                                      </vs-chip>
                                      <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '3'">
                                          DEVUELTO
                                      </vs-chip>
                                  </p>
                              </vs-td>
                              <vs-td>
                                  {{ tr.mensaje }}
                              </vs-td>
                          </vs-tr>
                      </template>
                  </vs-table>
                </vs-card>
            </vs-row>
        </div>
        <vs-popup fullscreen title="Códigos con problemas" :active.sync="modalLiquidacion" >
          <vs-card>
                <div class="header">
                    <span style="font-weight:bold;color: red;font-size: 20px;">Codigos que no se pudieron devolver</span>
                </div>
                <vs-table  stripe pagination max-items="25" search :data="codigosConLiquidacion">
                    <template slot="header" class="flex">
                        <p style="font-size: 15px;font-weight: bold;">Cantidad: {{codigosConLiquidacion.length }}</p>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="codigo">Código</vs-th>
                        <vs-th sort-key="estudiante">Informacion</vs-th>
                        <vs-th sort-key="estudiante">Mensaje</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].codigo">
                                {{ tr.codigo }}
                            </vs-td>
                            <vs-td :data="data[indextr].barrasEstado">
                                <p style="font-weight:bold;">institucion:</p>
                                <span>{{tr.institucionBarra}}</span>
                                <p style="font-weight:bold;">periodo:</p>
                                <span>{{tr.periodo_barras}}</span>
                                <p>
                                    <vs-chip color="success" v-if="tr.estado_liquidacion == '1'">
                                        Por liquidarse
                                    </vs-chip>
                                    <vs-chip color="warning" v-else-if="tr.estado_liquidacion == '2'">
                                        Regalado
                                    </vs-chip>
                                    <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '0'">
                                        Liquidado
                                    </vs-chip>
                                    <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '3'">
                                        DEVUELTO
                                    </vs-chip>
                                </p>
                            </vs-td>
                            <vs-td>
                                {{ tr.mensaje }}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
                </vs-card>
        </vs-popup>
        <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="10" search :data="tableData">
            <template slot="header">
            <h4>Códigos a Devolver {{tableData.length}}</h4>
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
      <div class="flex">
      </div>
    </vs-prompt>
    <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
    <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosListaVue :arregloCodigos="codigosSinCodigoUnion" openModal="0"/>
    </vs-popup>
    </vs-card>
  </template>

  <script>
  import ImportExcel from './import_excel.vue'
  import gestionCodigosListaVue from '../codigos/components/utils/gestionCodigosLista.vue';
  export default {
    components: {
      ImportExcel,
      gestionCodigosListaVue,
    },
    data () {
      return {
        codigosPerdidos:false,
        modalLiquidacion:false,
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
        codigoNoExiste:[],
        codigosConLibro:[],
        porcentaje:0,
        region:'2',
        busquedaInstitucion:'',
        nombreInstitucion:'',
        institucion_id:0,
        periodo_id:0,
        instituciones:[],
        cliente:'',
        observacion:'',
        codigosConLiquidacion:[],
        codigoSelected:[],
        tipo:false,
        codigo:'',
        //variables para el export a excel
        activePrompt:false,
        codigoSelected: [],
        reportesActivo: 0,
        fileName: null,
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        cellAutoWidth: true,
        selectedFormat: 'xls',
        //variables para codigos union
        codigosSinCodigoUnion:[],
        popupProblemasCodigosUnion:false,
        //fin variables para codigos union
      }
    },
    created(){
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.codigosPerdidos = false
    },
    mounted(){
        let me = this;
        me.getPeriodo()
        me.focusInput()
    },
    methods: {
        focusInput() {
            this.$refs.ingreso.$el.focus()
        },
        getPeriodo() {
            let me = this;
            this.$http.get(this.$server_url+'getPeriodoInvidivual?region='+me.region)
                .then(function (res) {
                    me.periodo_id = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
      loadDataInTable ({ results, header, meta }) {
        this.codigosPerdidos = false;
        this.header = header
        this.tableData = results
        this.sheetName = meta.sheetName
      },
       //PARA ASIGNAR UNA INSTITUCION
    getInstitucion() {
      let me = this;
      me.instituciones = [];
      me.nombreInstitucion = "";
      me.institucion_id = "";
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
       me.getPeriodo()
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
        if(me.cliente.trim() == ""){
            me.$vs.notify({
            text:'Debe ingresar un cliente por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
        }
        if(me.tipo == false){
            if(me.codigo.trim() == ""){
                me.$vs.notify({
                text:'Debe ingresar un codigo',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
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
        if(me.tipo){
            formData.append('data_codigos', json_pagos);
        }else{
            formData.append('codigo',me.codigo)
        }
        formData.append('id_usuario', me.usuario.idusuario);
        formData.append('usuario_editor', me.usuario.idusuario);
        formData.append('cliente', me.cliente);
        formData.append('observacion', me.observacion);
        formData.append('institucion_id', me.institucion_id);
        formData.append('periodo_id', me.periodo_id)
        this.$http.post(this.$server_url+'codigos/bodega/devolver', formData)
        .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Códigos procesados exitosamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            me.codigo = ""
            me.modalConfirm = false
            me.tableData = []
            me.codigosPerdidos = true
            me.codigosConLiquidacion = res.data.codigosConLiquidacion
            if(me.codigosConLiquidacion.length > 0){
            me.modalLiquidacion = true
            }
            me.codigosSinCodigoUnion  = res.data.codigosSinCodigoUnion
            if(me.codigosSinCodigoUnion.length > 0){
              me.popupProblemasCodigosUnion = true
            }
            me.codigosNoCambiados = res.data.codigosNoCambiados
            me.codigoNoExiste = res.data.codigoNoExiste
            me.porcentaje = res.data.cambiados
        })
            me.focusInput()

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
      //METODOS PARA EXCEL
       //para limipiar los campos del excel
       clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
           exportToExcel() {
            let headerTitle = ['codigo','liquidacion','institucion barras','periodo barras','Mensaje'];
            let headerVal = ['codigo','liquidacion','institucionBarra','periodo_barras','mensaje'];
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
    background-color: #F17F76;
    border-radius: 5px;
    color:white;
  }
  .td1, .th1{
   padding: 10px;
   text-align: center;
   border:none;
  }
  </style>
