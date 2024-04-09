<template>
  <vs-card>
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
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estos códigos </h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div class="mb-6" align="center">
      <div class="vx-col w-full">
        <p style="font-weight: 100;opacity: 0.5;" class="text-2xl">Import Ingreso de códigos</p>
        <vs-divider></vs-divider>
        <p style="color:#1F340E;">
          <i class="fa fa-file" aria-hidden="true"></i>  Ingreso de códigos  <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
        </p>
      </div>
      <!-- Textarea -->
      <div v-if="libroSelect" class="flex justify-center mt-3">
        <!-- HTML !-->
        <button class="button-33 mt-2" role="button">Libro Seleccionado: {{ libroSelect.nombrelibro }}</button>
        <vx-tooltip style="display: inline-block;" text="Seleccionar otro libro" position="top" color="primary">
          <vs-button radius color="warning" size="small" class="ml-2 mt-4" type="border" icon-pack="feather" @click="libroSelect='';" icon="icon-x"></vs-button>
        </vx-tooltip>
        <!-- <ul class="leftx mt-2 ml-5">
          <li>
            <vs-radio v-model="pruebaDiagnostica" vs-name="radios1pruebaDiagnostica" vs-value="0">Activación</vs-radio>
          </li>
          <li>
            <vs-radio v-model="pruebaDiagnostica" class="ml-3 mt-1" vs-name="radios1pruebaDiagnostica" vs-value="1">Diagnostica</vs-radio>
          </li>
        </ul> -->
      </div>
      <div v-else>
        <ScreenLibrosImportVue @changeLibroSelect="changeLibroSelect"/>
      </div>
      <!--Comentario-->
      <vs-input icon="icon-message-square" class="w-full mt-5" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
      <!-- /Textarea -->
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
          <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos</span><br>
      </vs-alert>
      <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 ">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="primary"  type="relief" icon="code" @click="openConfirm(0)">Subir códigos </vs-button>
          </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true">
                Se guardo  {{ porcentaje }} códigos
            </vs-alert>
        </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-card v-if="CodigosNoIngresados.length > 0">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <p>Cantidad <span>{{ CodigosNoIngresados.length }}</span></p>
              <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron ingresar"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in CodigosNoIngresados" icon="check" :title="tr.codigo" >
              </vs-list-item>
            </vs-list>
          </vs-col>
        </vs-card>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vx-card
        title="Estos códigos ya existen"
        title-color="danger"
        >
          <gestionCodigosLista :arregloCodigos="CodigosExisten"/>
        </vx-card>
      </vs-row>
    </div>
    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="20" search :data="tableData">
        <template slot="header">
          <h4>Códigos a subir {{ tableData.length }}</h4>
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
  </vs-card>
</template>
<script>
import gestionCodigosLista from './utils/gestionCodigosLista.vue'
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
import ScreenLibrosImportVue from '../../libros/ScreenLibrosImport.vue'
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    ScreenLibrosImportVue,
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
      CodigosNoIngresados:[],
      CodigosExisten:[],
      libroSelect:'',
      // pruebaDiagnostica:0,
      codigosEnviar:[],
      observacion: '',
    }
  },
  created(){
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.codigosPerdidos = false
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos  = false
      this.header           = header
      let datos             = results
      let preValores        = []
      this.codigosEnviar    = []
      //quitar types NumRow
      datos.forEach(element => {
        var obj = new Object();
        const validateCodigo = element.codigo.toLowerCase();
        if(validateCodigo.startsWith("p")){
          obj.diagnostica  = 1
        }else{
          obj.diagnostica  = 0
        }
        obj.codigo = element.codigo.toUpperCase()
        preValores.push(obj)
      });
      this.codigosEnviar = preValores
      this.tableData = results
      this.sheetName = meta.sheetName
    },
    procesarPagos(){
      let me = this
      if(me.libroSelect.idlibro == null || me.libroSelect.idlibro == "" || me.libroSelect.idlibro == undefined){
        me.$vs.notify({
        text:'Area eliminado con exito',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.observacion == '' || me.observacion == null || me.observacion == undefined){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Ingrese un comentario.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.observacion.length < 5){
        me.$vs.loading.close()
        me.$vs.notify({ text:'El comentario debe tener al menos 5 caracteres.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.$vs.loading()
      let json_codigos = JSON.stringify(me.codigosEnviar)
      let formData = new FormData();
      formData.append('data_codigos',      json_codigos);
      formData.append('id_usuario',        me.usuario.idusuario);
      formData.append('idlibro',           me.libroSelect.idlibro)
      formData.append('anio',              me.libroSelect.year)
      formData.append('libro',             me.libroSelect.nombre)
      formData.append('serie',             me.libroSelect.nombre_serie)
      formData.append('periodo_id',        localStorage.periodo_id)
      formData.append('comentario',        me.observacion)
      // formData.append('pruebaDiagnostica', me.pruebaDiagnostica)
      this.$http.post(this.$server_url+'codigos/ingreso', formData)
      .then(res => {
        me.$vs.loading.close()
        me.$vs.notify({
        text:'Códigos procesados exitosamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.modalConfirm         = false
        me.tableData = []
        me.codigosPerdidos      = true
        me.CodigosNoIngresados  = res.data.CodigosNoIngresados
        me.CodigosExisten       = res.data.CodigosExisten
        me.porcentaje           = res.data.cambiados
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
      if( !me.tableData[0].codigo){
            me.$vs.loading.close()
            me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
            return
        }
      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.codigo ){
          me.errores.push(value)
        }
      })
      if( me.errores.length > 0 ){
        me.modalErrores = true
      }else{
        me.modalConfirm = true
      }
    },
    changeLibroSelect(e){
      let me = this;
      me.libroSelect = ''
      me.libroSelect = e
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
  background-color: #1F340E;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}
</style>
