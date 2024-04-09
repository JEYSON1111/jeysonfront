<template>
    <div>
      <div class="flex mt-5">
        <div style="width: 40%;">
          <p> <ion-icon name="contract-outline"></ion-icon>  Filtro de pedidos por períodos</p>
        </div>
        <div style="width: 60%;">
          <!-- idperiodoescolar -->
          <v-select :options="arregloPeriodos" @input="limpiarCache();getPedidos();updateVentaReal();" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
            <br>
        </div>
      </div>
      <vs-divider>
        <vs-button color="warning" v-if="changePeriodo == false" type="flat" icon="star">Ningun período Seleccionado</vs-button>
        <vs-button  v-else color="success" type="flat" icon="star">Periodo seleccionado: <b>{{ periodoSelect.periodoescolar }}</b></vs-button>
      </vs-divider>
      <!-- BOTON GENERAR FORMATO-->
      <div class="mt-2 flex"  v-if="changePeriodo" >
        <vs-button v-if="usuario.id_group == 23 || userRoot == true" type="gradient" class="p-2 mr-3"><ion-icon name="grid-outline"></ion-icon> <span class="ml-2" @click="verFormato();">Generar formato</span> </vs-button>
      </div>
      <br><br>
      <!--VER PEDIDOS-->
      <div v-if="changePeriodo" style="margin-top: -10px;">
        <vs-button color="primary" v-if="userAsesor" icon="add" type="border" @click="addPedido()">Crear Pedido</vs-button>
        <listado_pedidosVue class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" :pedidos="pedidos" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)"/>
      </div>
      <!--MODAL FORMATO PEDIDOS PRECIOS-->
      <vs-popup fullscreen :title="'Formato de libros del período ' +enviarPeriodo.periodoescolar" :active.sync="popupFormato">
        <vs-button  class="ml-2" color="success" v-if="userRoot == true" type="gradient"><ion-icon style="font-size:15px;" name="code-download-outline"></ion-icon> <span class="ml-2" @click="popupFormato = false;popupCargarFormato = true;">Cargar formato</span> </vs-button>
        <FormatoPedidosVue v-if="popupFormato" :enviarPeriodo="enviarPeriodo" :arregloSeries="arregloSeries"/>
      </vs-popup>
      <!--CARGAR FORMATO ANTERIOR PARA LLENAR EN EL PERIODO NUEVO-->
      <vs-popup :title="'Cargar formato para el período '" :active.sync="popupCargarFormato">
        <CargarFormatoVue v-if="popupCargarFormato" :periodoSelect="periodoSelect" @rechargeFormato="rechargeFormato"/>
      </vs-popup>
    </div>
  </template>
  <script>
  import vSelect from 'vue-select'
  import {
    mapState
} from "vuex";
  const FormatoPedidosVue         = ()  => import('@/views/pedidos/components/formato/FormatoPedidos.vue')
  const CargarFormatoVue          = ()  => import('@/views/pedidos/components/formato/CargarFormato')
  const listado_pedidosVue        = ()  => import('@/views/pedidos/listado_pedidos2.vue')
  import Codigosmix from "@/mixins/Codigosmix";
  export default{
    components:{
      vSelect,
      listado_pedidosVue,
      FormatoPedidosVue,
      CargarFormatoVue,
    },
    mixins: [Codigosmix],
    data(){
      return{
        usuario:[],
        periodoSelect:'',
        changePeriodo:false,
        popupFormato:false,
        enviarPeriodo:'',
        //variables formato
        arregloSeries:[],
        //fin variables formato
        popupCargarFormato:false,
        pedidos:[],
      }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    watch:{
      periodoSelect(results){
        let me = this;
        if(results == null || results == null || results == undefined){
          me.changePeriodo = false
          localStorage.removeItem('pid')
          localStorage.removeItem('pnombre')
        }else{
          me.changePeriodo = true
          localStorage.setItem('pid',    results.idperiodoescolar)
          localStorage.setItem('pnombre',results.periodoescolar)
          me.getPedidos()
        }
      }
    },
    created(){
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
      let me = this;
      me.getSeries()
      let searchPeriodoActive = localStorage.pid
      let searchPeriodoName   = localStorage.pnombre
      if(searchPeriodoActive){
        me.periodoSelect = { idperiodoescolar:searchPeriodoActive, periodoescolar:searchPeriodoName }
      }
    },
    props:{
      arregloPeriodos:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    methods:{
      addPedido(){
        let me = this
        let datos = {
          id_pedido:0,
          id_periodo:this.periodoSelect.idperiodoescolar,
          periodo:this.periodoSelect.periodoescolar
        }
        this.$store.dispatch('setPedido',datos)
        localStorage.setItem("id_periodo_selected",     this.periodoSelect.idperiodoescolar)
        localStorage.setItem("nombre_periodo_selected", this.periodoSelect.periodoescolar)
        me.$emit('showPedido',1)
      },
      showPedido(e){
          let me = this
          me.$emit('showPedido',e)
      },

      changeHandleRecarga(e){
        let me = this;
        me.limpiarCache()
        me.getPedidos()
      },
      updateVentaReal(){
        let me = this
        //si es asesor envio a actualizar la venta real
        if(me.userAsesor) {
          if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined ) { return }
          const { idusuario } = me.usuario; const { idperiodoescolar } = me.periodoSelect
          this.$http.get(this.$server_url+`pedigo_Pagos?updateVentaReal=1&idAsesor=${idusuario}&idPeriodo=${idperiodoescolar}`)
          .then(res => { })
        }
      },
      getPedidos(){
        let me        = this
        var ruta      = ""
        me.pedidos    = []
        if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined ) { return }
        if(me.usuario.id_group == 22) ruta = this.$server_url+'get_pedidos_periodo_facturador/'+me.periodoSelect.idperiodoescolar+'/'+me.usuario.idusuario
        else ruta = this.$server_url+'get_pedidos_periodo/'+me.periodoSelect.idperiodoescolar+'/'+me.usuario.id_group+'/'+me.usuario.idusuario
        me.$vs.loading();
        this.$http.get(ruta)
        .then(res => {
          me.$vs.loading.close();
          let datos = res.data.filter(p => p.facturacion_vee == 1)
          if(me.usuario.id_group == 22){
          // me.pedidos    = datos.filter(p =>  ( (p.ifagregado_anticipo_aprobado == 1 || p.ifagregado_anticipo_aprobado == 3 ) || (p.anticipo == 0 || p.anticipo == '' || p.anticipo == null)) )
          me.pedidos    = datos.filter(p =>  ( (p.ifagregado_anticipo_aprobado == 1 || p.ifagregado_anticipo_aprobado == 3 ) || (p.ifanticipo == 0 || p.ifanticipo == null)) )
          return
          }
          if(me.userRoot || me.userAsesor){
            me.pedidos    = res.data
            return
          }
          else{
            me.pedidos    = datos
          }
        })
        .catch((e)=>{
          me.$vs.loading.close();
        })
      },
      getSeries(){
        let me = this
        me.arregloSeries = []
        this.$http.get(this.$server_url+'series_full')
        .then(res => {
            me.arregloSeries = res.data
        })
      },
      verFormato(){
        let me = this;
        let datos  = me.arregloPeriodos
        let setear = datos.filter(p => p.idperiodoescolar == me.periodoSelect.idperiodoescolar)
        me.enviarPeriodo  = setear[0]
        me.popupFormato   = true
      },
      //Metodos para cargar formato
      rechargeFormato(e){
        let me = this;
        me.popupCargarFormato = false;
        me.popupFormato       = true;
      },
    }
  }
  </script>
