<template>
    <vx-card>
        <div v-if="tipo != 0">
            <vs-button color="primary" type="border" @click="tipo = 0;getObsequios()">← Regresar</vs-button>
        </div>
        <div v-if="tipo == 1"><crearPedidoVue :userAdmin="userAdmin" :userAsesor="userAsesor" :userFacturador="userFacturador" :arregloPeriodo="arregloPeriodo" :periodo_id="periodo_id" @changeRecharge="changeRecharge" :id="id" :pedido="pedido"/></div>
        <div v-if="tipo == 0">
            <vs-button class="btn_lg p-2 ml-1" @click="tipo = 1;id = 0; pedido={};" color="warning" type="line" icon-pack="feather" icon="icon-plus" icon-after>Solicitar obsequios</vs-button>
            <listadoObsequioVue :periodo_id="periodo_id" :arregloObsequios="arregloObsequios" @changeRecharge="changeRecharge" @changeEdit="changeEdit"/>
        </div>
    </vx-card>
</template>
<script>
import crearPedidoVue from './asesor/mantenimiento/crearPedido.vue';
import listadoObsequioVue from './asesor/mantenimiento/listadoObsequio'
export default{
    data(){
        return{
            id:0,
            tipo:0,
            periodo_id:0,
            usuario:[],
            arregloObsequios:[],
            arregloPeriodo:[],
            pedido:{},
            userAsesor:false,
            userAdmin:false,
            userFacturador:false,
        }
    },
    components:{
        crearPedidoVue,
        listadoObsequioVue,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.periodo_id = me.$route.params.id
        me.getObsequios();
        me.getInfoPeriodo();
        if(me.usuario.id_group == 1) { me.userAdmin = true }
        if(me.usuario.id_group == 11) { me.userAsesor = true }
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
            this.$http.get(this.$server_url+'obsequio?listadoObsequioAsesor=yes&periodo_id='+me.periodo_id)
                .then(function (res) {
                    let datos = res.data
                    if(datos.length > 0){
                      if(me.userAdmin){
                        me.arregloObsequios = datos
                      }else{
                        me.arregloObsequios = datos.filter(p => p.asesor_id == me.usuario.idusuario)
                      }
                    }else{
                        me.arregloObsequios = []
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
            this.$http.get(this.$server_url+'periodo/'+me.periodo_id)
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
