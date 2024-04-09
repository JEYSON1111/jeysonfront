<template>
    <div>
        <div>
          <b>Filtro:</b>
          <ul class="flex mt-2">
              <li class="modelx">
                  <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="0">Con contratos</vs-radio>
              </li>
              <li class="ml-2">
              <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="1">Sin contrato</vs-radio>
              </li>
              <li class="ml-2">
              <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="2">Todos</vs-radio>
              </li>
              <li style="list-style: none;">
                  <vs-checkbox v-model="checkList" style="margin-left: 10px;" @input="renderType()">Mostrar todo los asesores</vs-checkbox>
              </li>
          </ul>
          <vs-divider>Region</vs-divider>
          <div class="flex justify-center">
            <ul class="flex">
              <li>
                <vs-radio v-model="region" @input="getPeriodos();TmparregloVenta=[];" vs-name="radios1region" vs-value="2" class="mr-3">Costa</vs-radio>
              </li>
              <li>
                <vs-radio v-model="region" @input="getPeriodos();TmparregloVenta=[];" vs-name="radios1region" vs-value="1">Sierra</vs-radio>
              </li>
            </ul>
          </div>
          <br>
          <div class="vx-row">
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <p> <ion-icon name="contract-outline"></ion-icon>Período anterior</p>
              <v-select :options="arregloPeriodos" @input="TmparregloVenta=[];" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelectAnterior" />
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <p> <ion-icon name="contract-outline"></ion-icon>Período despues</p>
              <v-select :options="arregloPeriodos" @input="TmparregloVenta=[];" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelectDespues" />
            </div>
          </div>
          <div class="flex justify-center">
            <vs-button color="primary" @click="getValoresVenta()" type="border" icon="save">Generar reporte</vs-button>
          </div>
        </div>
        <div v-if="TmparregloVenta.length > 0 && periodoSelectAnterior && periodoSelectDespues">
            <div class="mt-2 flex">
                <vs-button color="success" @click="ExportToExcel('xlsx')" type="border"><i class="fa-solid fa-file-excel"></i>  Exportar</vs-button>
            </div>
            <p class="mt-2">Cantidad :{{ TmparregloVenta.length }}</p>
            <table width="100%" border="1"  cellspacing="0" cellpadding="0" id="miTabla" class="mt-4">
                <vs-tr>
                  <vs-th colspan="1" rowspan="2" style="width: 150px;" class="rotar"><b>VENDEDOR</b></vs-th>
                  <vs-th colspan="1" rowspan="2" style="width: 150px;" class="rotar"><b>PERIODO ANTERIOR</b></vs-th>
                  <vs-th colspan="2" class="rotar"><b>VENTAS REALES  {{ periodoSelectAnterior.periodoescolar }} </b></vs-th>
                  <vs-th colspan="1" rowspan="2" style="width: 150px;" class="rotar"><b>PERIODO DESPUES</b></vs-th>
                  <vs-th colspan="2" class="rotar"><b>VENTA SEGUN PROMOCION   {{ periodoSelectDespues.periodoescolar }} </b></vs-th>
                  <vs-th rowspan="2">VARIACION VENTAS BRUTAS POR TEMPORADA</vs-th>
                  <vs-th rowspan="2">% DE VARIACION EN  RELACION AL PRESUPUESTO</vs-th>
                </vs-tr>
                <vs-tr>
                  <vs-th>VENTA BRUTA</vs-th>
                  <vs-th>VENTA NETA</vs-th>
                  <vs-th>VENTA BRUTA</vs-th>
                  <vs-th>VENTA NETA</vs-th>
                </vs-tr>
                <tr v-for="(tr,key) in TmparregloVenta" :key="key">
                    <td>
                        <vs-button color="success" @click="removeItemFromArr(TmparregloVenta,tr)"  type="flat" icon-pack="feather" icon="icon-x"></vs-button>
                        <p>{{ tr.asesor.toUpperCase() }}</p>
                        <p>{{ tr.iniciales}}</p>
                    </td>
                    <td>
                      {{ periodoSelectAnterior.periodoescolar }}
                    </td>
                    <td>
                        ${{ filtrarDecimal(tr.VentaBAnterior) }}
                    </td>
                    <td>
                        ${{ filtrarDecimal(tr.ventaNAnterior) }}
                    </td>
                    <vs-td>
                      {{ periodoSelectDespues.periodoescolar }}
                    </vs-td>
                    <td>
                        <p v-if="tr.ventaBrutaActual == 0">$0</p>
                        <p v-else>${{ filtrarDecimal(tr.ventaBrutaActual) }}</p>
                    </td>
                    <td>
                        <p v-if="tr.ven_neta_actual == 0">$0</p>
                        <p v-else>${{ filtrarDecimal(tr.ven_neta_actual) }}</p>
                    </td>
                    <td>${{ filtrarDecimal(tr.VariacionVentaBruta) }}</td>
                    <td>{{ tr.PorcentajeVariacionPresupuesto }} <b style="display: none;">.</b>%</td>
                </tr>
                <tr>
                    <td><b>TOTAL</b></td>
                    <td><b>${{ sumaVentaBrutaAnterior }}</b></td>
                    <td><b>${{ sumaNetaAnterior }}</b></td>
                    <td><b>${{ sumaVentaBrutaActual }}</b></td>
                    <td><b>${{ sumaVentaNetaActual }}</b></td>
                    <td><b>${{ sumaVariacionVentaBruta }}</b></td>
                </tr>
            </table>
        </div>
        <br><br><br><br>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import moment from "moment";
import * as XLSX from 'xlsx';
export default{
    data(){
        return{
            TmparregloVenta:[],
            arregloVenta:[],
            arregloPeriodos:[],
            periodoSelectAnterior:'',
            periodoSelectDespues:'',
            checkList:false,
            year:'',
            tipo:0,
            region:2,
        }
    },
    components:{
        vSelect,
    },
    mounted(){
        let me = this;
        me.year = moment().format('YYYY')
        // me.getValoresVenta()
        me.getPeriodos()
    },
    computed:{
        sumaVentaBrutaAnterior(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.VentaBAnterior)
                let total = datos.reduce((a, b) => a + (b["VentaBAnterior"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaNetaAnterior(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.ventaNAnterior)
                let total = datos.reduce((a, b) => a + (b["ventaNAnterior"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaVentaBrutaActual(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.ventaBrutaActual)
                let total = datos.reduce((a, b) => a + (b["ventaBrutaActual"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){

                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaVentaNetaActual(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.ven_neta_actual)
                let total = datos.reduce((a, b) => a + (b["ven_neta_actual"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaVariacionVentaBruta(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.VariacionVentaBruta)
                let total = datos.reduce((a, b) => a + (b["VariacionVentaBruta"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
    },
    methods:{
        getPeriodos(){
            let me = this
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                let datos = res.data
                me.arregloPeriodos = datos.filter(p => p.region_idregion == me.region)
            })
            .catch(function (error) {
            })
        },
        filtrarDecimal(numero){
            let me = this
            const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            return transformar
        },
        getValoresVenta() {
            let me = this;
            me.arregloVenta = []
            me.TmparregloVenta = []
            let msj = ""
            if(me.periodoSelectAnterior == "" || me.periodoSelectAnterior == null || me.periodoSelectAnterior == undefined){
                msj = 'Seleccione un período anterior por favor'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return
            }
            if(me.periodoSelectDespues == "" || me.periodoSelectDespues == null || me.periodoSelectDespues == undefined){
                msj = 'Seleccione un período despues por favor'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return
            }
            me.$vs.loading()
            var url = 'pruebatest?periodo_idUno='+me.periodoSelectAnterior.idperiodoescolar+'&periodo_idDos='+me.periodoSelectDespues.idperiodoescolar+'&codigoC='+me.periodoSelectAnterior.codigo_contrato+'&codigoC2='+me.periodoSelectDespues.codigo_contrato
            this.$http.get(this.$server_url+url)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        let msj = res.data.message
                        me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                        return
                    }
                    var arregloPredatos = []
                    var datos = []
                    datos = res.data
                    datos.forEach(element => {
                        var cal = new Object();
                        cal.id_asesor          = element.id_asesor
                        cal.asesor             = element.asesor
                        cal.iniciales          = element.iniciales
                        cal.cedula             = element.cedula
                        let arrayContratos     = element.ContratosDespues.contratos
                        let arraySinContratos  = element.ContratosDespues.sin_contratos[0]
                        let arrayAnterior      = element.ContratosAnterior
                        //venta actual contratos
                        cal.ConCVentaBruta     = arrayContratos.reduce((a, b) => parseFloat(a) + parseFloat((b["VEN_VALOR"] || 0)), 0);
                        cal.ConCVentaNeta      = arrayContratos.reduce((a, b) => parseFloat(a) + parseFloat((b["ven_neta"] || 0)), 0);
                        //venta actual sin contratos
                        cal.SinCVentaBruta     = parseFloat(arraySinContratos.ventaBrutaActual)
                        cal.SinCVentaNeta      = parseFloat(arraySinContratos.ven_neta_actual)
                        //venta anterior
                        cal.VentaBAnterior     = arrayAnterior.reduce((a, b) => parseFloat(a) + parseFloat((b["VEN_VALOR"] || 0)), 0);
                        cal.ventaNAnterior     = arrayAnterior.reduce((a, b) => parseFloat(a) + parseFloat((b["ven_neta"] || 0)), 0);
                        arregloPredatos.push(cal)
                    });
                    me.arregloVenta = arregloPredatos
                    console.log("uno",me.arregloVenta)
                    me.renderType()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        renderType(){
            let me = this;
            me.TmparregloVenta = []
            let preDatos = []
            preDatos     = me.arregloVenta
            var arregloPreFinal = []
            //segundos calculos
            preDatos.forEach(element => {
                var cal = new Object();
                cal.id_asesor               = element.id_asesor
                cal.asesor                  = element.asesor
                cal.iniciales               = element.iniciales
                cal.cedula                  = element.cedula
                //venta actual contratos
                cal.ConCVentaBruta          = element.ConCVentaBruta
                cal.ConCVentaNeta           = element.ConCVentaNeta
                //venta actual sin contratos
                cal.SinCVentaBruta          = element.SinCVentaBruta
                cal.SinCVentaNeta           = element.SinCVentaNeta
                //venta anterior
                cal.VentaBAnterior          = element.VentaBAnterior
                cal.ventaNAnterior          = element.ventaNAnterior
                //VENTA QUE SE MOSTRARA EN EL FRONT
                //con contratos
                var preVentaBActual         = 0
                if(me.tipo == 0){
                    cal.ventaBrutaActual    = element.ConCVentaBruta
                    cal.ven_neta_actual     = element.ConCVentaNeta
                    preVentaBActual         = element.ConCVentaBruta
                }
                //sin contratos
                if(me.tipo == 1){
                    cal.ventaBrutaActual    = element.SinCVentaBruta
                    cal.ven_neta_actual     = element.SinCVentaNeta
                    preVentaBActual         = element.SinCVentaBruta
                }
                //todos(bruta con contrato y sin contrato)
                if(me.tipo == 2){
                    cal.ventaBrutaActual    = parseFloat(element.ConCVentaBruta) + parseFloat(element.SinCVentaBruta )
                    cal.ven_neta_actual     = parseFloat(element.ConCVentaNeta)  + parseFloat(element.SinCVentaNeta )
                    preVentaBActual         = parseFloat(element.ConCVentaBruta) + parseFloat(element.SinCVentaBruta )
                }
                //VARIACION VENTAS BRUTAS => venta actual bruta - venta bruta anterior
                cal.VariacionVentaBruta     = preVentaBActual - element.VentaBAnterior
                let restaVentasBrutas       = preVentaBActual - element.VentaBAnterior
                //validar division para cero
                var prePorcentajeVariaciacionPresupuesto = 0;
                if((element.VentaBAnterior == 0)){
                    prePorcentajeVariaciacionPresupuesto = 0
                }else{
                    prePorcentajeVariaciacionPresupuesto = restaVentasBrutas / element.VentaBAnterior
                }
                //PORCENTAJE EN RELACION AL PRESUPUESTO => ( (venta actual bruta - venta bruta anterior)/venta actual bruta ) *100
                cal.PorcentajeVariacionPresupuesto = ((prePorcentajeVariaciacionPresupuesto) * 100).toFixed(0)
                arregloPreFinal.push(cal)
            });
            console.log("dos",arregloPreFinal)
            //me.TmparregloVenta = arregloPreFinal
             //FILTRO
             //si checkList es true se mostrara todo los asesores
             if(me.checkList){
              console.log("entro1")
                me.TmparregloVenta = arregloPreFinal
            }else{
              // si checkList es false se mostrara solo los asesores que tengan ventas
              console.log("entro2",arregloPreFinal)
              console.table(arregloPreFinal)
                me.TmparregloVenta = arregloPreFinal.filter(p => (p.preVentaBActual > 0 || p.VentaBAnterior > 0))
            }
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        },
        //metodo par descargar el excel
        ExportToExcel(type, fn, dl) {
          var elt = document.getElementById('miTabla');
          var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
          return dl ?
              XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
              XLSX.writeFile(wb, fn || ('ReporteVendedores.' + (type || 'xlsx')));
        },
    }
}
</script>
<style scoped>
.tabla1 {
  table-layout: fixed;
  width: 95%;
  border-collapse: collapse;
  border: none;
  margin-left: 15px;
}
.encabezado ,td,th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
}
</style>
