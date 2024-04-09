<template>
    <div>
      <div v-if="groupFacturador">
        <listadoGuiasFacturadorVue :pedidos="arregloGuias" @changeRecarge="getGuias" />
      </div>
      <div v-if="userAsesor">
        <div class="flex mt-5">
            <div style="width: 40%;">
                <p> <ion-icon name="contract-outline"></ion-icon>  Filtro de guias por período</p>
            </div>
            <div style="width: 60%;">
                <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                <br>
            </div>
        </div>
        <vs-divider>
        <vs-button color="warning" v-if="changePeriodo == false" type="flat" icon="star">Ningun período Seleccionado</vs-button>
        <vs-button  v-else color="success" type="flat" icon="star">Periodo seleccionado: <b>{{ periodoSelect.periodoescolar }}</b></vs-button>
        </vs-divider>
        <div v-if="changePeriodo">
            <div v-if="menu != 0">
                <vs-button class="mb-2 p-2" @click="menu = 0;" style="display: inline-block;" icon-pack="feather" icon="icon-chevron-left" color="primary">Volver a pedidos</vs-button>
            </div>
            <div v-if="menu == 0">
                <listado_pedidos_asesorVue  :periodoSelect="periodoSelect" @showPedido="showPedido"/>
            </div>
            <div v-if="menu == 1">
                <pedidosGuiasVue/>
            </div>
        </div>  
      </div>
    </div>
  </template>
  
  <script>
  import vSelect from 'vue-select'
  import { mapState } from "vuex";
  const listadoGuiasFacturadorVue = () => import('../../pedidos/components/Guias/guiasFacturador/listadoGuiasFacturador.vue');
  const listado_pedidos_asesorVue = () => import('../../pedidos/listado_pedidos_asesor.vue')
  const pedidosGuiasVue           = () => import('../../pedidos/components/Guias/pedidos.vue')
  export default {
    components: {
      vSelect,
      listadoGuiasFacturadorVue,
      listado_pedidos_asesorVue,
      pedidosGuiasVue,
    },
    data() {
      return {
        arregloGuias: [],
        periodoSelect:'',
        changePeriodo:false,
        menu:0,
      };
    },
    computed: {
      ...mapState(["auth", "userRoot", "susuario", "groupFacturador", "groupBodega","userAsesor","ObjectGuia"]),
    },
    mounted() {
        let me = this
        if(!me.userAsesor){
            this.getGuias();
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
        }
      },
    },
    methods: {
        showPedido(e){
            let me = this
            me.menu = e
        },
        async getGuias() {
            let me = this
            try {
            this.$vs.loading();
            const response = await this.$http.get(this.$server_url + 'get_pedidos_guias');
            this.$vs.loading.close();
    
            const datos = response.data;
            if (datos.length === 0) {
                this.arregloGuias = [];
                return;
            }
            if (this.groupFacturador) {
                this.arregloGuias = datos.filter(p => p.pedido_facturacion === 1);
                return 
            } else if (this.groupBodega) {
                this.arregloGuias = datos.filter(p => p.pedido_bodega === 1);
                return 
            } else if (this.userAsesor) {
                this.arregloGuias = datos.filter(p => p.pedido_asesor === 1);
                return 
            }
            } catch (error) {
            console.error("Error al obtener guías:", error);
            this.$vs.loading.close();
            }
        },
    },
  };
  </script>
  