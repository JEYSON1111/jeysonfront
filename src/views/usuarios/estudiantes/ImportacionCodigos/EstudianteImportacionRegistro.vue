<template>
    <div>
      <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
         <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
           <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full">
                  <b>Código</b>
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
          <h4>Estás seguro de registrar estos {{ tableData.length }} usuarios?</h4>
        </div>
        <div class="w-full" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
        </div>
      </vs-popup>
      <div>
        <div class="mb-6 mt-5" align="center">
          <div class="vx-col w-full">
            <p style="color:#12481A;">
              <i class="fa fa-file" aria-hidden="true"></i>   Estos  <b>usuarios</b>  pasarán a ser registrados  <span style="font-weight: bold;">(no ingrese más de 1000 registros en una sola carga.)</span>
            </p>
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
                            <th class="th1">cedula</th>
                            <th class="th1">nombres</th>
                            <th class="th1">apellidos</th>
                            <th class="th1">correo</th>
                            <th class="th1">institucion_id</th>
                          </tr>
                          <tr>
                            <td class="td1">123</td>
                            <td class="td1">xxx</td>
                            <td class="td1">xxx</td>
                            <td class="td1">@xxx</td>
                            <td class="td1">1</td>
                          </tr>
                      </table>
                    </div>
                  </vs-card>
                </vs-col>
              </vs-row>
          </div>
          <!-- {{tableData}} -->
          <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
              <span>Excel cargado exitosamente. ¿Está seguro de registrar estos usuarios?</span><br>
          </vs-alert>
          <vs-row v-if="tableData.length > 0 && tableData.length <= 1000 ">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)"> Registrar usuarios </vs-button>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-alert active="true">
                      Se registraron  {{ porcentaje }} usuarios
                  </vs-alert>
              </vs-col>
          </vs-row>
        </div>
      </div>
      <vs-row v-if="codigosPerdidos == true && registroProblemas.length > 0">
          <vs-card>
            <div class="header">
                <span style="font-weight:bold;" class="text-danger">Registro de usuarios con problemas</span>
            </div>
            <vs-table max-items="10" search pagination :data="registroProblemas">
                    <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ registroProblemas.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th>Cédula</vs-th>
                        <vs-th>Nombres</vs-th>
                        <vs-th>Apellidos</vs-th>
                        <vs-th>Correo</vs-th>
                        <vs-th>institucion_id</vs-th>
                        <vs-th>Problema</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].cedula}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].nombres}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].apellidos}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].correo}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].institucion_id}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].problema}}<br>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
          </vs-card>
      </vs-row>
      <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="10" search :data="tableData">
          <template slot="header">
            <h4>Registros a subir {{tableData.length}}</h4>
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
      <!--MODALES-->
    </div>
  </template>
  <script>
  import {
    mapState
  } from "vuex";
  import vSelect from 'vue-select'
  import ImportExcel from "../../../codigos/components/importExcel.vue";
  export default {
    components: {
      ImportExcel,
      vSelect,
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
        modalCedulas: false,
        registroProblemas:[],
        cedulas_no_encontradas:[],
        porcentaje:0,
      }
    },
    computed:{
      ...mapState(["auth",'userRoot','susuario','userAsesor']),
    },
    created(){
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          this.codigosPerdidos = false
      },
    methods: {
      loadDataInTable ({ results, header, meta }) {
        this.header           = header
        this.tableData        = results
        this.sheetName        = meta.sheetName
        this.codigosPerdidos  = false
        this.registroProblemas = []
      },
      procesarPagos(){
          let me = this
          let json_pagos = JSON.stringify(me.tableData)
          let formData = new FormData();
          formData.append('data_codigos',     json_pagos);
          formData.append('idusuario',        me.usuario.idusuario);
          formData.append('id_group',         4)
          me.$vs.loading()
         this.$http.post(this.$server_url+'importRegistroUsuarios', formData)
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
              text:'Cédulas procesadas exitosamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
              me.modalConfirm = false
              me.tableData = []
              me.codigosPerdidos = true
              me.registroProblemas      = res.data.registroProblemas
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
        if(!me.tableData[0].cedula || !me.tableData[0].nombres || !me.tableData[0].apellidos || !me.tableData[0].correo || !me.tableData[0].institucion_id){
              me.$vs.loading.close()
              me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
              return
          }
        me.errores = []
        $.each(me.tableData,function(key, value){
          if( !value.cedula || !value.nombres || !value.apellidos || !value.correo || !value.institucion_id){
            me.errores.push(value)
          }
        })
        console.log("errrs",me.errores)
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
    background-color: #092308;
    border-radius: 5px;
    color:white;
  }
  .td1, .th1{
   padding: 10px;
   text-align: center;
   border:none;
  }
  </style>
  