<template>
    <div>
        <vx-card id="seccionImprimirLiquidacion">
            <p class="letra text-left"><b>REPORTE DE VERIFICACIÓN INSTITUCIÓN:</b> {{ sendPedido.nombreInstitucion.toUpperCase() }}</p>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>TEMPORADA:</b> {{ sendPedido.periodo.toUpperCase() }}</span>
                </div>
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>CONVENIO:</b> {{ sendPedido.contrato_generado.toUpperCase() }}</span>
                </div>
            </div>
            <p class="letra text-left"><b>ASESOR:</b> {{ sendPedido.asesor.toUpperCase() }}</p>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>FECHA REPORTE:</b> {{ dayM.charAt(0).toUpperCase() + dayM.slice(1) }}, {{ day }} de {{ mes }} de {{ year }}</span>
                </div>
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>% COMISIÓN:</b> {{ sendPedido.descuento }}</span>
                </div>
            </div>
            <table class="tabla2">
                <thead>
                    <tr>
                        <td colspan="1"><b>PRODUCTO</b></td>
                        <td colspan="4"><b>NOMBRE</b></td>
                        <td colspan="1"><b>CANT. VERIF.</b></td>
                        <td colspan="2"><b>VAL. UNIT.</b></td>
                        <td colspan="1"><b>VALOR</b></td>
                        <!--9 COLUMNAS-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in arregloLibros" :key="key">
                        <td>{{ tr.codigo }}</td>
                        <td colspan="4"><p class="letra">{{ tr.nombre_libro.toUpperCase() }}</p>  </td>
                        <td>{{ tr.cantidad }}</td>
                        <td colspan="2">{{ tr.precio }}</td>
                        <td>{{ tr.valor | filtrarDecimal }} </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><p class="font-bold text-right" style="font-size:10px;">VENTA:</p></td>
                        <td style="border-top: 1px solid #000;"><span>{{ valorVenta | filtrarDecimal }}</span></td>
                    </tr>
                    <tr v-if="sumaTotalValorRegalados > 0">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colspan="3"><p class="font-bold text-right" style="font-size:9px;">CÓDIGOS HIJOS DE LOS DOCENTES:</p></td>
                        <td><span>{{ sumaTotalValorRegalados | filtrarDecimal  }}</span></td>
                    </tr>
                    <tr v-for="(item,key) in arregloDescuentosVenta" :key="key">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="3">
                        <p class="font-bold text-right" style="font-size:9px;">{{ item.nombre_descuento.toUpperCase() }}</p>
                      </td>
                      <td><span>{{ filtrarDecimal(item.total_descuento) }}</span></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><p class="font-bold text-right" style="font-size:9px;">TOTAL VENTA:</p></td>
                        <td style="border-top: 1px solid #000;"><span>{{ filtrarDecimal(totalVenta) }}</span></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colspan="2"><p class="font-bold text-right" style="font-size:9px;">VALOR COMISIÓN:</p></td>
                        <td style="border-top: 2px solid #000;"><span>{{ filtrarDecimal(valorComision) }}</span></td>
                    </tr>
                    <tr v-if="deuda > 0">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><p class="font-bold text-right" style="font-size:9px;">DEUDA:</p></td>
                        <td><span>{{ filtrarDecimal(deuda) }}</span></td>
                    </tr>
                    <tr v-if="anticipo > 0">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><p class="font-bold text-right" style="font-size:9px;">ANTICIPO:</p></td>
                        <td><span>{{ filtrarDecimal(anticipo) }}</span></td>
                    </tr>
                     <tr v-if="(sendPedido.convenio_anios > 0 || sendPedido.convenio_origen > 0) && setpermiso_convenio == 1 && AnticiposConvenio > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="3">
                        <!--CONVENIO GLOBAL-->
                        <p class="font-bold text-right" style="font-size:9px;">
                        CONVENIO GLOBAL: {{ aniosConvenio }} AÑOS ({{ ObjectConvenio.anticipo_global }})
                        </p>
                      </td>
                      <td></td>
                    </tr>
                    <tr v-if="(sendPedido.convenio_anios > 0 || sendPedido.convenio_origen > 0) && setpermiso_convenio == 1 && AnticiposConvenio > 0" >
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="3">
                        <!--DENTRO DE PLATAFORMA-->
                        <p class="font-bold text-right" style="font-size:9px;">
                       {{ NumeroConvenio  }} CONVENIO
                        </p>
                      </td>
                      <td><span>{{ filtrarDecimal(AnticiposConvenio) }}</span></td>
                    </tr>
                    <tr v-if="(sendPedido.convenio_anios > 0 || sendPedido.convenio_origen > 0) && setpermiso_convenio == 1 && AnticiposConvenio > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="3">
                        <!--DENTRO DE PLATAFORMA-->
                        <p class="font-bold text-right" style="font-size:9px;">
                          (SALDO CONVENIO {{ SaldoConvenio }})
                        </p>
                      </td>
                      <td></td>
                    </tr>
                    <tr v-if="setpermiso_cobro_venta_directa == 1 && totalCobroVenta > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="3">
                        <p class="font-bold text-right" style="font-size:9px;">COBRO DE VENTA DIRECTA</p>
                      </td>
                      <td><span>{{ filtrarDecimal(totalCobroVenta) }}</span></td>
                    </tr>
                    <tr v-for="(item,key) in arregloDescuentos" :key="key">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="3">
                        <p class="font-bold text-right" style="font-size:9px;">{{ item.nombre_descuento.toUpperCase() }}</p>
                      </td>
                      <td><span>{{ filtrarDecimal(item.total_descuento) }}</span></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="font-bold text-right" style="font-size:9px;margin-left:-2px;">LIQUIDACIÓN:</p></td>
                      <td style="border: 2px solid #000;"><span>{{ filtrarDecimal(liquidacion) }}</span></td>
                    </tr>
                </tbody>
            </table>
        </vx-card>
        <div class="w-full p-2 bg-gray-400 text-center" v-if="desdeConfiguracion == 0">
          <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir pdf</vs-button>
          <vs-button color="primary" @click="imprimirExcel()" type="border">Imprimir excel</vs-button>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
          arregloLibros:[],
          arregloVerificacion:[],
          arregloDescuentos:[],
          arregloDescuentosVenta:[],
          day:'',
          dayM:'',
          mes:'',
          year:'',
          anio:'',
          fecha:'',
          nombrearchivo:'',
          valorVenta:0,
          totalVenta:0,
          comision:0,
          valorComision:0,
          anticipo:0,
          deuda:0,
          liquidacion:0,
          //VARIABLES PARA EXPORTAR A EXCEL
          formats: ['xls', 'xlsx', 'csv', 'txt'],
          fileName:null,
          selectedFormat: 'xls',
          cellAutoWidth: true,
          activePrompt: false,
          //variables convenio
          AnticiposConvenio:0,
          convenio_origen:0,
          aniosConvenio:0,
          totalDescuento:0,
          totalDescuentoVenta:0,
          NumeroConvenio:1,
          ObjectConvenio:'',
          SaldoConvenio:0,
          totalAnticipos:0,
          //fin variables convenio
          setcampoPersonalizado:0,
          setpermiso_anticipo_deuda:'',
          setpermiso_convenio:'',
          setpermiso_cobro_venta_directa:'',
        }
    },
    props:{
      VerificacionSelect:{
        type:Object,
        default:function(){
          return {}
        }
      },
      //ARREGLO LIBROS
      DetalleVerificacion:{
        type:Array,
        default:[]
      },
      //SUMA DE TODOS LOS LIBROS
      sumaTotalVALOR:{
        type:Number,
        validator(value){
        return value%1!==0
        }
      },
      sumaTotalValorRegalados:{
        type:Number,
        validator(value){
        return value%1!==0
        }
      },
      totalCobroVenta:{
        type:Number,
        validator(value){
        return value%1!==0
        }
      },
      tipoReporte:{
        type:Number,
        default:0,
      },
      desdeConfiguracion:{
        type:Number,
        default:0,
      },
      sendPedido:{
        type:Object,
        default:function(){
          return {}
        }
      },
      datosInstitucion:{
        type:Object,
        default:function(){
          return {}
        }
      }
    },
    watch:{
      watch(results){
          let me = this;
          me.sendPedido = results
      },
       sumaTotalVALOR(results){
        let me = this
        me.valorVenta = me.sumaTotalVALOR
        me.AnticiposConvenio = 0
      },
    },

    created(){
        let me = this;
        me.limpiar()
        moment.lang("es")
        me.day = moment().format('DD');
        me.dayM  = moment().format('dddd');
        me.mes = moment().format('MMMM');
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year

    },
    mounted(){
      let me = this
      me.valorVenta = me.sumaTotalVALOR
      console.log("ventaLibro",me.valorVenta)
      console.log("ventaregalado",me.sumaTotalValorRegalados)
      me.getConvenioInstitucion()
    },
    methods:{
      getConvenioInstitucion(){
        let me = this;
        me.arregloHijosConvenio = []
        me.NumeroConvenio       = 0
        me.ObjectConvenio       = {}
        me.SaldoConvenio        = 0
        me.totalAnticipos       = 0
        var url = ""
        me.$vs.loading();
        // url = this.$server_url+'convenio?getInformacionConvenio=yes&institucion_id='+me.datosInstitucion.idInstitucion+'&periodo_id='+me.datosInstitucion.id_periodo
        url = this.$server_url+'convenio?getInformacionConvenioXId=yes&idConvenio='+me.sendPedido.pedidos_convenios_id
        this.$http.get(url)
          .then(function (res) {
            if(res.data.status == 0){
              me.$vs.notify({
              text:res.data.message,
              color:'danger',
              iconPack: 'feather',
              icon:'icon-check'})
              me.$vs.loading.close()
              return
            }
            if(res.data.length == 0){
              me.getVerificacion()
              me.$vs.loading.close()
              return
            }
            if(res.data.convenio.length == 0){
              me.getVerificacion()
              me.$vs.loading.close()
              return
            }
            me.$vs.loading.close()
            me.ObjectConvenio       = res.data.convenio[0]
            me.arregloHijosConvenio = res.data.hijos_convenio
            if(me.VerificacionSelect.num_verificacion == 1){
              console.log("verif")
              me.sumarSaldoConvenio(me.arregloHijosConvenio)
            }
            me.getVerificacion()
          })
          .catch(function (error) {
            me.$vs.loading.close()
              console.log(error + ' error');
          })
      },
      sumarSaldoConvenio(tr){
        let me = this
        console.log("convenios",tr)
        let contadorConvenio = 1
        var SumTodosAnticipos = 0
        //obtener el numero de convenio
        for (let i = 0; i < tr.length; i++) {
          SumTodosAnticipos  =  SumTodosAnticipos + tr[i].totalAnticipos
          if (tr[i].contrato == me.datosInstitucion.contrato) {
            me.NumeroConvenio = contadorConvenio;
            me.totalAnticipos = tr[i].totalAnticipos
            break; // Salimos del bucle una vez que se encuentra el contrato.
          }
          contadorConvenio++;
        }
        console.log("sumaConvenio",SumTodosAnticipos)
        me.SaldoConvenio = me.ObjectConvenio.anticipo_global - SumTodosAnticipos
        me.AnticiposConvenio = me.totalAnticipos
      },
      getVerificacion(){
        let me = this;
        me.arregloVerificacion = []
        me.$vs.loading();
        this.$http.get(this.$server_url+'getVerificacionXId/'+me.VerificacionSelect.id)
        .then(res =>{
          me.totalVenta                     = 0
          me.arregloVerificacion            = res.data
          me.setpermiso_anticipo_deuda      = res.data[0].permiso_anticipo_deuda
          me.setpermiso_convenio            = res.data[0].permiso_convenio
          me.setpermiso_cobro_venta_directa = res.data[0].permiso_cobro_venta_directa
          me.arregloDescuentos              = res.data[0].descuentos
          me.arregloDescuentosVenta         = res.data[0].descuentosVenta
          me.totalDescuento                 = res.data[0].totalDescuento
          me.totalDescuentoVenta            = res.data[0].totalDescuentoVenta
          let preValoresRegalados           = res.data[0].venta_real_regalados
          //calcular valor venta
          me.totalVenta                     = me.sumaTotalVALOR - (me.totalDescuentoVenta  + preValoresRegalados)
          me.getPedidos()
        })
      },
      filtrarDecimal(numero){
        let me = this
        if(numero == 0){
          return numero
        }else{
          const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          return transformar
        }
      },
      getPedidos(){
        let me = this
        me.liquidacion = 0
        me.comision        = me.sendPedido.descuento
        me.convenio_origen = me.sendPedido.convenio_origen
        me.valorComision   = (me.totalVenta*me.comision)/100
        var preValor       = 0
        //SEGUNDO, TECER , CUARTA.....VERIFICACION
        if(me.VerificacionSelect.num_verificacion > 1){
          console.log("verif1")
          me.anticipo           = 0
          me.deuda              = 0
          me.AnticiposConvenio  = 0
        }
        //solo a primer verificacion se le  descuenta el anticipo ,deuda, convenio
        else{
          if(me.setpermiso_convenio == 0){
            me.AnticiposConvenio  = 0
          }
          //si no esta activado el check
          if(me.setpermiso_anticipo_deuda == 0){
            me.anticipo           = 0
          }
          else{
            let preAnticipo    = (me.sendPedido.anticipo_aprobado == null || me.sendPedido.anticipo_aprobado == "null" ) ? 0 : me.sendPedido.anticipo_aprobado
            me.anticipo        = preAnticipo
            let preDeuda       = (me.sendPedido.deuda == null || me.sendPedido.deuda == "null" ) ? 0 : me.sendPedido.deuda
            me.deuda           = parseFloat(preDeuda)
            preValor           = me.anticipo + me.deuda
            console.log("preValor",preValor)
            // if(me.deuda > 0){
            //   preValor = me.deuda
            // }else{
            //   preValor = me.anticipo
            // }
          }

        }
        //VENTA PERSONALIZADA
        if(me.arregloVerificacion[0].totalDescuento > 0){
          console.log("uno")
          //si existe convenio
          if(me.sendPedido.convenio_anios > 0 || me.convenio_origen > 0){
            console.log("pre1",preValor + me.totalCobroVenta + me.AnticiposConvenio + me.totalDescuento)
            me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta + me.AnticiposConvenio + me.totalDescuento)
          }
          //si no existe el convenio
          else{
            console.log("pre2",preValor + me.totalCobroVenta + me.totalDescuento)
            me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta + me.totalDescuento)
          }
        }
        //NO PERSONALIZADA
        else{
          console.log("dos",me.AnticiposConvenio)
          //si existe convenio
          if(me.sendPedido.convenio_anios > 0 || me.convenio_origen > 0){
            console.log("presub1",(preValor + me.totalCobroVenta + me.AnticiposConvenio + me.totalDescuento))
            me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta + me.AnticiposConvenio + me.totalDescuento)
          }
          //si no existe el convenio
          else{
            console.log("presub2",preValor + me.totalCobroVenta)
            me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta)
          }
        }
        //ANIOS CONVENIO
        //fuera de la plataforma
        if(me.sendPedido.convenio_origen > 0){ me.aniosConvenio = me.ObjectConvenio.convenio_anios }
        else                                         { me.aniosConvenio = me.sendPedido.convenio_anios }
        me.updateValorLiquidacion()
        me.nombrearchivo    = "Verificacion "+me.sendPedido.contrato_generado+".pdf"
        if(me.desdeConfiguracion == 0){
          me.$vs.notify({
          text: "Espere mientras se va generando el archivo...",
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-file',
          time:3000
          })
        }
        me.getLibros(me.sendPedido.id_pedido)
      },
      updateValorLiquidacion(){
        let me = this;
        let formData = new FormData();
        //DEUDA => 0  = NO; 1 = SI;
        let sendEstadoPago = 0
        if(me.liquidacion < 0)  { sendEstadoPago = 1 }
        else                    { sendEstadoPago = 2 }
        formData.append('actualizarSieteCampo', 'yes')
        formData.append('verificacion_id',    me.VerificacionSelect.id);
        //fields
        formData.append('campo',              'valor_liquidacion');
        formData.append('campo2',             'estado_pago')
        formData.append('campo3',             'valor_comision')
        formData.append('campo4',             'totalAnticipos')
        formData.append('campo5',             'totalDeuda')
        formData.append('campo6',             'totalCobroVentaDirecta')
        formData.append('campo7',             'TotalConvenio')
        //values
        formData.append('valor',              me.liquidacion);
        formData.append('valor2',             sendEstadoPago)
        formData.append('valor3',             me.valorComision)
        formData.append('valor4',             me.anticipo)
        formData.append('valor5',             me.deuda)
        formData.append('valor6',             me.totalCobroVenta)
        formData.append('valor7',             me.AnticiposConvenio)

        this.$http.post(this.$server_url+'updateVerificacion', formData)
        .then(res => {
          me.$vs.loading.close()
          if(me.desdeConfiguracion == 2){
            me.limpiar()
            me.$emit('changeHandleUpdatePayments',true)
            me.$vs.notify({
            text: `Liquidacion Verificacion ${me.VerificacionSelect.num_verificacion} guardada `,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-file',
            time:3000
            })
          }
        })
      },
      getLibros(){
        let me = this
        me.arregloAreas = []
        me.arregloLibros = []
        ///===ORDENAR ARRAY ==
        me.arregloLibros = me.DetalleVerificacion.sort(function(a, b) {
        var nombreA = a.nombre_libro.toLowerCase();
        var nombreB = b.nombre_libro.toLowerCase();
        var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
        var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
        nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
        nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
            if (nombreA < nombreB) {
                return -1;
            }
            if (nombreA > nombreB) {
                return 1;
            }
            if (numA && !numB) { // si a tiene número y b no, b va primero
                return 1;
            }
            if (!numA && numB) { // si b tiene número y a no, a va primero
                return -1;
            }
            if (numA && numB) { // si ambos tienen número, compararlos
                if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                return -1;
                }
                if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                return 1;
                }
                return numA - numB; // comparar los números directamente
            }
            return 0; // si son iguales en todo, no hay diferencia
        })
        if(me.desdeConfiguracion == 0){
          if(me.tipoReporte == 0)   setTimeout(function() {me.imprimirEval()}, 1000);
          else                      setTimeout(function() {me.imprimirExcel()}, 1000);
        }
      },
        imprimirExcel(){
          let me = this
          let headerTitle = ""
          let headerVal = ""
          //INSTITUCION
          let TitleInstitucion = []
          TitleInstitucion.push("REPORTE DE VERIFICACIÓN INSTITUCIÓN:")
          TitleInstitucion.push(me.sendPedido.nombreInstitucion.toUpperCase())
          TitleInstitucion.push("")
          TitleInstitucion.push("")
          TitleInstitucion.push("")
          //TEMPORADA - CONVENIO
          let TitleTemporada = []
          TitleTemporada.push("TEMPORADA:")
          TitleTemporada.push(me.sendPedido.periodo.toUpperCase() )
          TitleTemporada.push("")
          TitleTemporada.push("Convenio")
          TitleTemporada.push(me.sendPedido.contrato_generado.toUpperCase())
          //ASESOR
          let TitleAsesor = []
          TitleAsesor.push("ASESOR:")
          TitleAsesor.push(me.sendPedido.asesor.toUpperCase() )
          TitleAsesor.push("")
          TitleAsesor.push("")
          TitleAsesor.push("")
          //FECHA REPORTE
          let TitleFecha = []
          TitleFecha.push("FECHA REPORTE:")
          TitleFecha.push(`${ me.dayM.charAt(0).toUpperCase() }  ${ me.dayM.slice(1) } , ${ me.day } de ${ me.mes } de ${ me.year } `)
          TitleFecha.push("")
          TitleFecha.push("COMISIÓN")
          TitleFecha.push(me.sendPedido.descuento)
          let TitleEspacio = []
          TitleEspacio.push("")
          TitleEspacio.push("")
          TitleEspacio.push("")
          TitleEspacio.push("")
          TitleEspacio.push("")
          //CODIGOS
          headerTitle =
          [
            'PRODUCTO',
            'NOMBRE',
            'CANT. VERIF',
            'VAL. UNIT',
            'VALOR',
          ];
          headerVal = [
            'codigo',
            'nombre_libro',
            'cantidad',
            'precio',
            'valor',
          ];
          import('@/vendor/Export2Excel').then(excel => {
            const data = this.formatJson(headerVal, this.arregloLibros)
            let preData = data[0]
            //VENTA
            let DataVenta = []
            DataVenta.push("")
            DataVenta.push("")
            DataVenta.push("")
            DataVenta.push("VENTA")
            DataVenta.push(me.valorVenta)
            //HIJOS DE LOS DOCENTES
            let DataHijos = []
            DataHijos.push("")
            DataHijos.push("")
            DataHijos.push("")
            DataHijos.push("CÓDIGOS HIJOS DE LOS DOCENTES:")
            DataHijos.push(me.sumaTotalValorRegalados)
            //TOTAL VENTA
            let DataTotalVenta = []
            DataTotalVenta.push("")
            DataTotalVenta.push("")
            DataTotalVenta.push("")
            DataTotalVenta.push("TOTAL VENTA:")
            DataTotalVenta.push(me.totalVenta)
            //VALOR COMISION
            let DataComision = []
            DataComision.push("")
            DataComision.push("")
            DataComision.push("")
            DataComision.push("VALOR COMISIÓN:")
            DataComision.push(me.valorComision)
            //ANTICIPO
            let DataAnticipo = []
            DataAnticipo.push("")
            DataAnticipo.push("")
            DataAnticipo.push("")
            DataAnticipo.push("ANTICIPO:")
            DataAnticipo.push(me.anticipo)
            //DEUDA
            let DataDeuda = []
            DataDeuda.push("")
            DataDeuda.push("")
            DataDeuda.push("")
            DataDeuda.push("DEUDA:")
            DataDeuda.push(me.deuda)
            //CONVENIO GLOBAL
            let DataConvenioGlobal = []
            DataConvenioGlobal.push("")
            DataConvenioGlobal.push("")
            DataConvenioGlobal.push("")
            DataConvenioGlobal.push(`CONVENIO GLOBAL: ${ me.aniosConvenio } AÑOS  (${ me.ObjectConvenio.anticipo_global })`)
            DataConvenioGlobal.push("")
            //CONVENIO
            let DataConvenio = []
            DataConvenio.push("")
            DataConvenio.push("")
            DataConvenio.push("")
            DataConvenio.push(`${ me.NumeroConvenio } CONVENIO:`)
            DataConvenio.push(me.AnticiposConvenio)
            //SALDO CONVENIO
            let DataSaldoConvenio = []
            DataSaldoConvenio.push("")
            DataSaldoConvenio.push("")
            DataSaldoConvenio.push("")
            DataSaldoConvenio.push(`(SALDO CONVENIO: ${ me.SaldoConvenio })`)
            DataSaldoConvenio.push("")
            //DATA COBRO VENTA DIRECTA
            let DataCobro = []
            DataCobro.push("")
            DataCobro.push("")
            DataCobro.push("")
            DataCobro.push("COBRO DE VENTA DIRECTA:")
            DataCobro.push(me.totalCobroVenta)
            //LIQUIDACIÓN
            let DataLiquidacion = []
            DataLiquidacion.push("")
            DataLiquidacion.push("")
            DataLiquidacion.push("")
            DataLiquidacion.push("LIQUIDACIÓN:")
            DataLiquidacion.push(me.liquidacion)
            /**ENVIAR A ARRAY**/
            var sendEnviar = []
            sendEnviar.push(DataVenta)
            sendEnviar.push(DataHijos)
            //MOSTRAR PERSONALIZADO EN REPORTE DE RESTAR CON VENTA
            if(me.totalDescuentoVenta > 1)  {
              me.arregloDescuentosVenta.forEach(element => {
                let DataCuponVenta= []
                DataCuponVenta.push("")
                DataCuponVenta.push("")
                DataCuponVenta.push("")
                DataCuponVenta.push(element.nombre_descuento)
                DataCuponVenta.push(element.total_descuento)
                sendEnviar.push(DataCuponVenta)
              });
            }
            sendEnviar.push(DataTotalVenta)
            sendEnviar.push(DataComision)
            if(me.deuda > 0){
              sendEnviar.push(DataDeuda)
            }if(me.anticipo > 0){
              sendEnviar.push(DataAnticipo)
            }
            //si hay convenio lo mando al excel
            if(me.aniosConvenio > 0 && me.setpermiso_convenio == 1 && me.AnticiposConvenio > 0) {
              sendEnviar.push(DataConvenioGlobal)
              sendEnviar.push(DataConvenio)
              sendEnviar.push(DataSaldoConvenio)
            }
            if(me.totalCobroVenta  > 1 && me.totalCobroVenta > 0) { sendEnviar.push(DataCobro) }
            //MOSTRAR PERSONALIZADO EN REPORTE
            if(me.totalDescuento > 1)  {
              me.arregloDescuentos.forEach(element => {
                let DataCupon= []
                DataCupon.push("")
                DataCupon.push("")
                DataCupon.push("")
                DataCupon.push(element.nombre_descuento)
                DataCupon.push(element.total_descuento)
                sendEnviar.push(DataCupon)
              });
            }
            sendEnviar.push(DataLiquidacion)
            var data2 = [...sendEnviar]
            excel.export_json_to_excel({
              multiHeader:[TitleInstitucion,TitleTemporada,TitleAsesor,TitleFecha,TitleEspacio],
              header: headerTitle,
              data,
              data2,
              filename: this.nombrearchivo,
              autoWidth: this.cellAutoWidth,
              bookType: this.selectedFormat
            })
            this.clearFields()
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
              return v[j]
          }))
        },
        //limpiar campos para exportar de nuevo
        clearFields() {
          this.fileName = ''
          this.cellAutoWidth = true
          this.selectedFormat = 'xls'
        },
        imprimirEval(){
            let me = this
            var element = document.getElementById('seccionImprimirLiquidacion');
            var opt = {
                margin:       0.5,
                // margin:         [1.5, 0.5, 1, 1],
                filename:     me.nombrearchivo,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:    {scale: 2},
                pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' }  ,
                // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
                //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(opt).save();
            me.arregloLibros   = []
            me.$vs.notify({
                text: "Archivo descargado correctamente",
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-file',
                time:2000
            })
            me.limpiar()
            me.$emit('change',true)
        },
        limpiar(){
          let me                              = this;
          me.AnticiposConvenio                = 0
          me.convenio_origen                  = 0
          me.valorVenta                       = 0
          me.totalVenta                       = 0
          me.comision                         = 0
          me.valorComision                    = 0
          me.anticipo                         = 0
          me.deuda                            = 0
          me.liquidacion                      = 0
          me.aniosConvenio                    = 0
          me.setpermiso_anticipo_deuda        = ''
          me.setpermiso_convenio              = ''
          me.setpermiso_cobro_venta_directa   = ''
        }
    }
}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
    font-family: Arial;
}
.letra{
    padding:0px 60px 0px 0px;
    font-size: 10px;
    margin-left: 35px;
    text-align: justify;
}
.letra2{
    margin-top: 15px;
    margin-left: 60px;
    padding-right:60px;
    font-size: 11px;
    text-align: justify;
}
.letra3{
    display: flex;
    font-size: 11px;
    margin-left: 35px;
    padding-right:35px;
    text-align: justify;
}
.letra4{
    margin-top: 15px;
    margin-left: 55px;
    padding-right:55px;
    font-size: 11px;
    text-align: justify;
}
.letra5{
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    margin-left: 35px;
    padding-right:35px;
    font-size: 11px;
    margin-top: 115px;
}
.tabla1 {
  table-layout: fixed;
  width: 95%;
  border-collapse: collapse;
  border: none;
  margin-left: 15px;
}
.tabla2{
    table-layout: fixed;
    width: 90%;
    border-collapse: collapse;
    border: none;
    font-size: 11px;
    margin-top: 15px;
    margin-left: 35px;
}

@media print {
    td {page-break-before: always;}
    p  {page-break-before: always;}
}
.encabezado ,td,th {
    /* border: 1px solid rgb(227, 227, 227); */
    text-align: center;
    border-spacing: 0;
}
.rotar{
    font-size: 8px;
    /* writing-mode: vertical-lr;
     transform: rotate(180deg); */
}
.font1{
    font-size: 8px;
}
</style>
