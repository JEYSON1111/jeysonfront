<template>
    <div>
        <div class="flex mt-5">
            <div style="width: 40%;">
                <p> <ion-icon name="contract-outline"></ion-icon>  Filtro de pedidos por período</p>
            </div>
            <div style="width: 60%;">
                <!-- idperiodoescolar -->
                <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
            </div>
        </div>
        <vs-divider>
            <vs-button color="warning" v-if="changePeriodo == false" type="flat" icon="star">Ningun período Seleccionado</vs-button>
            <vs-button  v-else color="success" type="flat" icon="star">Periodo seleccionado: <b>{{ periodoSelect.periodoescolar }}</b></vs-button>
        </vs-divider>
        <div v-if="changePeriodo">
            <div v-if="tipo != 0">
                <vs-button color="primary" type="border" @click="tipo = 0;getObsequios()">← Regresar</vs-button>
            </div>
            <div v-if="tipo == 1"><crearPedidoVue :userRoot="userRoot" :userAdmin="userAdmin" :userAsesor="userAsesor" :userFacturador="userFacturador" :arregloPeriodo="arregloPeriodo" :periodo_id="periodoSelect.idperiodoescolar" @changeRecharge="changeRecharge" :id="id" :pedido="pedido"/></div>
            <div v-if="tipo == 0">
                <vs-button class="btn_lg p-2 ml-1" @click="tipo = 1;id = 0; pedido={};" color="warning" type="line" icon-pack="feather" icon="icon-plus" icon-after>Solicitar obsequios</vs-button>
                <listadoObsequioVue :userRoot="userRoot" :userAdmin="userAdmin" :periodo_id="periodoSelect.idperiodoescolar" :arregloObsequios="arregloObsequios" @changeRecharge="changeRecharge" @changeEdit="changeEdit"/>
            </div>
        </div>
        <br><br><br>
    </div>
</template>
<script>
import { mapState } from "vuex";
import vSelect from 'vue-select';
import crearPedidoVue from './asesor/mantenimiento/crearPedido.vue';
import listadoObsequioVue from './asesor/mantenimiento/listadoObsequio'
export default{
    components:{
        crearPedidoVue,
        listadoObsequioVue,
        vSelect,
    },
    data(){
        return{
            id:0,
            tipo:0,
            periodo_id:0,
            usuario:[],
            arregloObsequios:[],
            arregloPeriodo:[],
            pedido:{},
            periodoSelect:'',
            changePeriodo:false,
            userAdmin:false,
            userFacturador:false,
        }
    },
    watch:{
        periodoSelect(results){
            let me = this;
            if(results == null || results == null || results == undefined){
                me.changePeriodo = false
                localStorage.removeItem('oid')
                localStorage.removeItem('onombre')
            }else{
                me.changePeriodo = true
                localStorage.setItem('oid',    results.idperiodoescolar)
                localStorage.setItem('onombre',results.periodoescolar)
                me.getObsequios()
                me.getInfoPeriodo()
            }
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
    computed: {
      ...mapState(["auth", "userRoot", "susuario", "groupFacturador", "groupBodega","userAsesor","ObjectGuia"]),
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.getObsequios();
        //mantener el periodo seleccionado aunque recarge la pagina
        let searchPeriodoActive = localStorage.oid
        let searchPeriodoName   = localStorage.onombre
        if(searchPeriodoActive){
        me.periodoSelect = { idperiodoescolar:searchPeriodoActive, periodoescolar:searchPeriodoName }
        }
        if(me.usuario.id_group == 1) { me.userAdmin = true }
        //user facturador
        if(me.usuario.id_group == 22 || me.usuario.id_group == 23){ me.userFacturador = true }
    },
    methods:{
      changeEdit(e){
          let me      = this;
          me.pedido   = {}
          me.id       = e.id
          me.pedido   = e
          me.tipo     = 1
      },
      changeRecharge(e){
          let me  = this;
          me.tipo = 0
          me.getObsequios()
      },
      getObsequios() {
          let me = this;
          me.$vs.loading();
          this.$http.get(this.$server_url+'obsequio?listadoObsequioAsesor=yes&periodo_id='+me.periodoSelect.idperiodoescolar)
              .then(function (res) {
                 let datos = res.data
                  if(me.userAsesor) {
                    me.arregloObsequios = datos.filter(p => p.asesor_id == me.usuario.idusuario)
                  }else{
                    me.arregloObsequios = datos
                  }
                  me.$vs.loading.close()
              })
              .catch(function (error) {
                  console.log(error + ' error');
                  me.$vs.loading.close()
              })
      },
      getInfoPeriodo(){
        let me = this;
        me.arregloPeriodo = ''
        this.$http.get(this.$server_url+'periodo/'+me.periodoSelect.idperiodoescolar)
            .then(function (res) {
                me.arregloPeriodo = res.data
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
      }
    }
}
</script>
