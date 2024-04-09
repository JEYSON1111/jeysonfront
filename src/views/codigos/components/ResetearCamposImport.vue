<template>
    <vx-card
    title="Import cambiar valores por parámetros de los códigos"
    title-color="primary"
    subtitle="(Máximo 1500)"
    >
    <p class="font-bold">Observación del cambio</p>
    <vs-input icon="icon-message-square" class="w-full mt-2" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
      <vs-row v-if="codigosPerdidos == true" class="mt-5">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-alert active="true">
              <p class="text-center">Se realizo el cambio de  {{ porcentaje }} códigos</p>
          </vs-alert>
        </vs-col>
      </vs-row>
      <import-excel :onSuccess="loadDataInTable"  class="mb-4 mt-5" />
      <vs-alert v-if="tableData.length > 0" color="danger" class="mb-3 mt-2"  icon-pack="feather" icon="icon-alert-triangle">
        <p class="text-center">Excel cargado exitosamente. ¿Está seguro de cambiar estos  códigos?</p><br>
      </vs-alert>
      <vs-row v-if="tableData.length > 0 && tableData.length <= 2000 " class="mt-2">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <div class="vx-row">
            <div class="vx-col w-full flex">
              <vs-button class="mr-3 mb-2" icon="save" @click="openConfirm()">Realizar cambios</vs-button>
              <vs-button color="danger" class="mb-2"   @click="limpiar()" type="border">Resetear campos</vs-button>
            </div>
          </div>
        </vs-col>
      </vs-row>
      <!--TABLA QUE MUESTRA AL IMPORT-->
      <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="10" search :data="tableData">
          <template slot="header">
            <h4>Códigos a cambiar {{tableData.length}}</h4>
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
      <!---CAMPOS A RESETEAR-->
      <vs-divider color="primary">Campos a resetear</vs-divider>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="person" label="Id usuario" v-model="codigo.idusuario" />
              <vs-checkbox style="margin-top: 25px;" v-model="chkIdusuario"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="bookmark" label="Contrato" v-model="codigo.contrato" />
              <vs-checkbox style="margin-top: 25px;" v-model="chkContrato"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row mt-4">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="swap_horiz" label="Id Periodo" v-model="codigo.id_periodo" />
              <vs-checkbox style="margin-top: 20px;" v-model="chkId_periodo"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full flex" style="justify-content: space-between;">
              <div class="mt-5">
                  <p class="ml-2">Estado liquidacion</p>
                  <ul class="flex mt-2 ml-2">
                  <li>
                      <vs-radio v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="0">Liquidado</vs-radio>
                  </li>
                  <li>
                      <vs-radio v-model="codigo.estado_liquidacion" class="ml-3" vs-name="radiosestado_liquidacion" vs-value="1">Sin liquidar</vs-radio>
                  </li>
                  <li>
                      <vs-radio class="ml-3" v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="2">Regalado</vs-radio>
                  </li>
                  <li>
                      <vs-radio class="ml-3" v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="3">Devuelto</vs-radio>
                  </li>
                  </ul>
              </div>
              <vs-checkbox style="margin-top: 20px;"  v-model="chkEstado_liquidacion"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row mt-5">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex" style="justify-content: space-between;">
              <div>
                  <p class="ml-2">Bc_estado</p>
                  <ul class="flex mt-2 ml-2">
                  <li>
                      <vs-radio v-model="codigo.bc_estado" vs-name="radiosEstado2bc_estado" vs-value="1">Sin leer</vs-radio>
                  </li>
                  <li>
                      <vs-radio class="ml-3" v-model="codigo.bc_estado" vs-name="radiosEstado2bc_estado" vs-value="2">Leido</vs-radio>
                  </li>
                  </ul>
              </div>
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_estado"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-6 flex" style="justify-content: space-between;">
              <div>
                  <p class="ml-2">Codigos de barras</p>
                  <ul class="flex mt-2 ml-2">
                      <li>
                          <vs-radio v-model="codigo.codigos_barras" vs-name="radioscodigos_barras" vs-value="1">Si</vs-radio>
                      </li>
                      <li>
                          <vs-radio class="ml-3" v-model="codigo.codigos_barras" vs-name="radioscodigos_barras" vs-value="0">No</vs-radio>
                      </li>
                  </ul>
              </div>
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Codigos_barras"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="swap_vert" label="Bc_Institucion" v-model="codigo.bc_institucion" />
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Bc_institucion"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-6 flex">
              <vs-input class="w-full" icon="swap_vert" label="Bc_periodo" v-model="codigo.bc_periodo" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Bc_periodo"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="swap_vert" label="venta_lista_institucion" v-model="codigo.venta_lista_institucion" />
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Venta_lista_institucion"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-6 flex" style="justify-content: space-between;">
              <div>
                  <p class="ml-2">Venta estado</p>
                  <ul class="flex mt-2 ml-2">
                      <li>
                          <vs-radio v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="0">Nada</vs-radio>
                      </li>
                      <li>
                          <vs-radio class="ml-3" v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="1">Venta directa</vs-radio>
                      </li>
                      <li>
                          <vs-radio class="ml-3" v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="2">Venta lista</vs-radio>
                      </li>
                  </ul>
              </div>
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Venta_estado"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="filter" label="verif1" v-model="codigo.verif1" />
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Verif1"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-6 flex">
              <vs-input type="number" class="w-full" icon="filter" label="verif2" v-model="codigo.verif2" />
              <vs-checkbox style="margin-top: 20px;"  v-model="chkBc_Verif2"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="filter" label="verif3" v-model="codigo.verif3" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif3"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-0 flex">
              <vs-input type="number" class="w-full" icon="filter" label="verif4" v-model="codigo.verif4" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif4"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-0 flex">
              <vs-input class="w-full" icon="filter" label="verif5" v-model="codigo.verif5" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif5"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-0 flex">
              <vs-input type="number" class="w-full" icon="filter" label="verif6" v-model="codigo.verif6" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif6"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex">
              <vs-input class="w-full" icon="filter" label="verif7" v-model="codigo.verif7" />
              <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Verif7"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-6 flex">
              <vs-input type="number" class="w-full" icon="filter" label="verif8" v-model="codigo.verif8" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif8"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-0 flex">
              <vs-input class="w-full" icon="filter" label="verif9" v-model="codigo.verif9" />
              <vs-checkbox style="margin-top: 20px;"  v-model="chkBc_Verif9"></vs-checkbox>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-0 flex">
              <vs-input type="number" class="w-full" icon="filter" label="verif10" v-model="codigo.verif10" />
              <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif10"></vs-checkbox>
          </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-0 flex">
          <vs-input class="w-full" icon="filter" label="Código unión" v-model="codigo.codigo_union" />
          <vs-checkbox style="margin-top: 20px;"  v-model="chkBc_codigo_union"></vs-checkbox>
        </div>
      </div>
      <div class="vx-row mt-5">
          <div class="vx-col w-full mb-6 flex">
              <div>
                  <ul class="flex">
                      <li>
                          <vs-radio v-model="codigo.estado" vs-name="radiosEstado2" vs-value="0">Activo</vs-radio>
                      </li>
                      <li>
                          <vs-radio class="ml-3" v-model="codigo.estado" vs-name="radiosEstado2" vs-value="2">Bloqueado</vs-radio>
                      </li>
                  </ul>
              </div>
              <vs-checkbox class="ml-5" v-model="chkBc_Estado"></vs-checkbox>
          </div>
      </div>
      <!--MODAL PARA CONFIRMAR-->
      <vs-popup small title="Confirmación" :active.sync="modalConfirm">
        <div class="w-full mb-base" align="center">
          <h4>Está seguro de aplicar estos {{ arregloCodigosEnviar.length }}  códigos?</h4>
        </div>
        <div class="w-full" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" @click="guardarCodigo()"> Confirmar </vs-button>
        </div>
      </vs-popup>
    </vx-card>
</template>
<script>
import ImportExcel from './importExcel.vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
import TableSelectInstitucion from '../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue';
import gestionCodigosLista from './utils/gestionCodigosLista.vue';
export default {
    data() {
       return{
            usuario:[],
            codigo:{
                libro:'',
                idusuario:0,
                contrato:'',
                id_periodo:'',
                estado_liquidacion:1,
                bc_estado:1,
                codigos_barras:1,
                bc_institucion:0,
                bc_periodo:0,
                venta_estado:0,
                venta_lista_institucion:0,
                contador:1,
                estado:0,
                verif1:'',
                verif2:'',
                verif3:'',
                verif4:'',
                verif5:'',
                verif6:'',
                verif7:'',
                verif8:'',
                verif9:'',
                verif10:'',
                codigo_union:'',
                bc_fecha_ingreso: null,
            },
            nombreInstitucion:'',
            institucion_id:0,
            error:false,
            statusPeriodo:0,
            periodo_id:0,
            //variables para la consulta
            chkIdusuario:false,
            chkContrato:false,
            chkId_periodo:false,
            chkEstado_liquidacion:false,
            chkBc_estado:false,
            chkBc_Codigos_barras:false,
            chkBc_Bc_institucion:false,
            chkBc_Bc_periodo:false,
            chkBc_Venta_lista_institucion:false,
            chkBc_Venta_estado:false,
            chkBc_Verif1:false,
            chkBc_Verif2:false,
            chkBc_Verif3:false,
            chkBc_Verif4:false,
            chkBc_Verif5:false,
            chkBc_Verif6:false,
            chkBc_Verif7:false,
            chkBc_Verif8:false,
            chkBc_Verif9:false,
            chkBc_Verif10:false,
            chkBc_Estado:false,
            chkBc_codigo_union:false,
            //fin variables para la consulta
            informacion:[],
            tmpinformacion:[],
            arregloChangeCodigos:[],
            arregloCodigosEnviar:[],
            codigosPerdidos:false,
            popupLimit:false,
            porcentaje:0,
            tipo:'',
            //VARIABLES PARA IMPORT
            tableData: [],
            header: [],
            sheetName: '',
            errores: [],
            modalConfirm:false,
            //FIN VARIABLES PARA IMPORT
            observacion:'',
       }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted(){
        let me = this;
    },
    components: {
        'v-select': vSelect,
        flatPickr,
        TableSelectInstitucion,
        gestionCodigosLista,
        ImportExcel
    },

    methods:{
      loadDataInTable ({ results, header, meta }) {
        this.arregloCodigosEnviar = []
        this.codigosPerdidos = false
        this.header = header
        this.tableData = results
        this.sheetName = meta.sheetName
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
          if( !value.codigo){
            me.errores.push(value)
          }
        })
        if( me.errores.length > 0 ){
          me.modalErrores = true
        }else{
          me.modalConfirm = true
          me.SimplicarArray()
        }
      },
      guardarCodigo(){
        let me = this;
        if(me.observacion == '' || me.observacion == null || me.observacion == undefined){
          me.$vs.loading.close()
          me.$vs.notify({ text:'Ingrese un comentario.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
        }
        let formData = new FormData();
        formData.append('comentario',             me.observacion)
        formData.append('data_codigos',           JSON.stringify(me.arregloCodigosEnviar))
        formData.append('idusuario',              me.codigo.idusuario)
        formData.append('estado',                 me.codigo.estado)
        formData.append('contrato',               me.codigo.contrato)
        formData.append('id_periodo',             me.codigo.id_periodo)
        formData.append('verif1',                 me.codigo.verif1 == 'null' ? '': me.codigo.verif1 )
        formData.append('verif2',                 me.codigo.verif2 == 'null' ? '': me.codigo.verif2 )
        formData.append('verif3',                 me.codigo.verif3 == 'null' ? '': me.codigo.verif3 )
        formData.append('verif4',                 me.codigo.verif4 == 'null' ? '': me.codigo.verif4 )
        formData.append('verif5',                 me.codigo.verif5 == 'null' ? '': me.codigo.verif5 )
        formData.append('verif6',                 me.codigo.verif6 == 'null' ? '': me.codigo.verif6 )
        formData.append('verif7',                 me.codigo.verif7 == 'null' ? '': me.codigo.verif7 )
        formData.append('verif8',                 me.codigo.verif8 == 'null' ? '': me.codigo.verif8 )
        formData.append('verif9',                 me.codigo.verif9 == 'null' ? '': me.codigo.verif9 )
        formData.append('verif10',                me.codigo.verif10 == 'null' ? '': me.codigo.verif10 )
        formData.append('estado_liquidacion',     me.codigo.estado_liquidacion)
        formData.append('bc_estado',              me.codigo.bc_estado)
        formData.append('codigos_barras',         me.codigo.codigos_barras)
        formData.append('bc_institucion',         me.codigo.bc_institucion)
        formData.append('bc_periodo',             me.codigo.bc_periodo)
        formData.append('codigo_union',           (me.codigo.codigo_union == 'null' || me.codigo.codigo_union == '') ? '': me.codigo.codigo_union )
        //auditoria
        formData.append('institucion_id',         me.institucion_id)
        formData.append('periodo_id',             me.periodo_id)
        formData.append('user_created',           me.usuario.idusuario)
        //formData.append('old_values',           JSON.stringify(me.codigosEdit))
        formData.append('venta_estado',           me.codigo.venta_estado)
        formData.append('venta_estado',           me.codigo.venta_estado)
        formData.append('venta_lista_institucion',me.codigo.venta_lista_institucion)
        //parametros reset
        formData.append('chkIdusuario',                 me.chkIdusuario                     ? '1' : '0')
        formData.append('chkContrato',                  me.chkContrato                      ? '1' : '0')
        formData.append('chkId_periodo',                me.chkId_periodo                    ? '1' : '0')
        formData.append('chkEstado_liquidacion',        me.chkEstado_liquidacion            ? '1' : '0')
        formData.append('chkBc_estado',                 me.chkBc_estado                     ? '1' : '0')
        formData.append('chkBc_Codigos_barras',         me.chkBc_Codigos_barras             ? '1' : '0')
        formData.append('chkBc_Bc_institucion',         me.chkBc_Bc_institucion             ? '1' : '0')
        formData.append('chkBc_Bc_periodo',             me.chkBc_Bc_periodo                 ? '1' : '0')
        formData.append('chkBc_Venta_lista_institucion',me.chkBc_Venta_lista_institucion    ? '1' : '0')
        formData.append('chkBc_Venta_estado',           me.chkBc_Venta_estado               ? '1' : '0')
        formData.append('chkBc_Verif1',                 me.chkBc_Verif1                     ? '1' : '0')
        formData.append('chkBc_Verif2',                 me.chkBc_Verif2                     ? '1' : '0')
        formData.append('chkBc_Verif3',                 me.chkBc_Verif3                     ? '1' : '0')
        formData.append('chkBc_Verif4',                 me.chkBc_Verif4                     ? '1' : '0')
        formData.append('chkBc_Verif5',                 me.chkBc_Verif5                     ? '1' : '0')
        formData.append('chkBc_Verif6',                 me.chkBc_Verif6                     ? '1' : '0')
        formData.append('chkBc_Verif7',                 me.chkBc_Verif7                     ? '1' : '0')
        formData.append('chkBc_Verif8',                 me.chkBc_Verif8                     ? '1' : '0')
        formData.append('chkBc_Verif9',                 me.chkBc_Verif9                     ? '1' : '0')
        formData.append('chkBc_Verif10',                me.chkBc_Verif10                    ? '1' : '0')
        formData.append('chkBc_Estado',                 me.chkBc_Estado                     ? '1' : '0')
        formData.append('chkBc_codigo_union',           me.chkBc_codigo_union               ? '1' : '0')
        //fin variables parametros
        me.$vs.loading();
        this.$http.post(this.$server_url+'guardarCodigoParametros', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == '3'){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                    })
                    return
                }
                me.codigosPerdidos    = true
                me.modalConfirm       = false
                me.tableData          = []
                me.porcentaje         = res.data.contador
                me.$vs.notify({
                    text: "Se proceso correctamente",
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
          })
          .catch(function (error) {me.$vs.loading.close()})
      },
      SimplicarArray(){
          let me = this;
          me.arregloCodigosEnviar = []
          let p = new Promise(function(resolve,reject){
              if(me.tableData.length > 0){
                  resolve(me.tableData)
              }else{
                  reject('No hay codigos en su archivo')
              }
          });
          p.then((res) => {
              let datos = res
              datos.forEach(element => {
                  var cal = new Object();
                  cal.codigo = element.codigo
                  me.arregloCodigosEnviar.push(cal)
              });
          }).catch((e) => {
              console.log(e)
          })
      },
      limpiar(){
          let me = this
          me.codigo.idusuario=0
          me.codigo.contrato=''
          me.codigo.id_periodo=''
          me.codigo.estado_liquidacion=1
          me.codigo.bc_estado=1
          me.codigo.codigos_barras=1
          me.codigo.bc_institucion=0
          me.codigo.bc_periodo=0
          me.codigo.venta_estado=0
          me.codigo.venta_lista_institucion=0
          me.codigo.estado=0
          me.codigo.verif1=''
          me.codigo.verif2=''
          me.codigo.verif3=''
          me.codigo.verif4=''
          me.codigo.verif5=''
          me.codigo.verif6=''
          me.codigo.verif7=''
          me.codigo.verif8=''
          me.codigo.verif9=''
          me.codigo.verif10=''
          me.codigo.codigo_union=''
          //variables para la consulta
          me.chkIdusuario                  = false
          me.chkContrato                   = false
          me.chkId_periodo                 = false
          me.chkEstado_liquidacion         = false
          me.chkBc_estado                  = false
          me.chkBc_Codigos_barras          = false
          me.chkBc_Bc_institucion          = false
          me.chkBc_Bc_periodo              = false
          me.chkBc_Venta_lista_institucion = false
          me.chkBc_Venta_estado            = false
          me.chkBc_Verif1                  = false
          me.chkBc_Verif2                  = false
          me.chkBc_Verif3                  = false
          me.chkBc_Verif4                  = false
          me.chkBc_Verif5                  = false
          me.chkBc_Verif6                  = false
          me.chkBc_Verif7                  = false
          me.chkBc_Verif8                  = false
          me.chkBc_Verif9                  = false
          me.chkBc_Verif10                 = false
          me.chkBc_Estado                  = false
          me.chkBc_codigo_union            = false
          //fin variables para la consulta
      },
    },
}
</script>
