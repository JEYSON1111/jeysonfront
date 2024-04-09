<template>
    <div>
              <!--FILTROS-->
              <vs-card>
            <div class="title">
              Filtro de verificaciones Devueltas
            </div>
            <div class="mt-5">
              <ul style="display:flex;flex-wrap: wrap;">
                <li>
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{sumaTotal}}</span> Todos</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif1 > 0">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="1"><span style="font-weight:bold;">{{SumaVerif1}}</span> Verif 1</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif2 > 0">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="2"><span style="font-weight:bold;">{{SumaVerif2}}</span>  Verif 2 </vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif3 > 0">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span style="font-weight:bold;">{{SumaVerif3}}</span>  Verif 3 </vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif4 > 0">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{SumaVerif4}}</span> Verif 4</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif5 > 0">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="5"><span style="font-weight:bold;">{{SumaVerif5}}</span>  Verif 5</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif6 > 0">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="6"><span style="font-weight:bold;">{{SumaVerif6}}</span> Verif 6  </vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif7 > 0">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="7"><span style="font-weight:bold;">{{SumaVerif7}}</span>  Verif 7</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif8 > 0">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="8"><span style="font-weight:bold;">{{SumaVerif8}}</span>  Verif 8</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif9 > 0">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="9"><span style="font-weight:bold;">{{SumaVerif9}}</span>  Verif 9</vs-radio>
                </li>
                <li class="ml-2" v-if="SumaVerif10 > 0">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="10"><span style="font-weight:bold;">{{SumaVerif10}}</span> Verif 10</vs-radio>
                </li>
              </ul>
            </div>
          </vs-card>
        <vs-table max-items="10" search pagination :data="tmparregloCodigos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ tmparregloCodigos.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Código</vs-th>
                <vs-th>Num verificación</vs-th>
                <vs-th>Fecha Devolución</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Código</b>
                        <p>{{data[indextr].codigo_libro}}<br></p>
                        <b>Contrato</b>
                        <p>{{data[indextr].devueltos_liquidados}}<br></p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].verificacion_liquidada}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].created_at}}<br>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
export default{
    data(){
        return{
          tmparregloCodigos:[],
          arregloCodigosDevueltos:[],
          codigoTipo:0,
        }
    },
    props:{
        contrato:{
            type:String,
            default:""
        },
        sendVerificacion:{
            type:Object,
            default:function(){
                return {}
            }
        },
    },
    computed:{
        sumaTotal(){
            let me = this;
            let total = me.arregloCodigosDevueltos.length
            return total
        },
        SumaVerif1(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif1');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif2(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif2');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif3(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif3');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif4(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif4');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif5(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif5');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif6(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif6');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif7(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif7');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif8(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif8');
            let resultado   = datos.length
            return resultado
        },
        SumaVerif9(){
        let me = this;
        let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif9');
        let resultado   = datos.length
        return resultado
        },
        SumaVerif10(){
            let me = this;
            let datos       = me.arregloCodigosDevueltos.filter(p => p.verificacion_liquidada == 'verif10');
            let resultado   = datos.length
            return resultado
        },
    },
    created(){
        let me = this
        me.getCodigosDevueltosLiquidados()
    },
    methods:{
        getCodigosDevueltosLiquidados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'getliquidadosDevueltos/'+me.contrato)
                .then(function (res) {
                    me.arregloCodigosDevueltos = res.data
                    me.filtroTipo()
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        filtroTipo(){
            let me = this;
            me.tmparregloCodigos = []
            let datos = me.arregloCodigosDevueltos
            //TODOS
            if(me.codigoTipo == 0){
                let primerFiltro = datos
                me.tmparregloCodigos = primerFiltro
                return
            }else{
                let primerFiltro = datos.filter(p => p.verificacion_liquidada == `verif${me.codigoTipo}`)
                me.tmparregloCodigos = primerFiltro
            }
        },
    }
}
</script>
