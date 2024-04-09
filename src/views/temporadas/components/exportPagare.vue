<template>
    <div>
        <vx-card id="seccionImprimir2" v-if="arregloContrato.length > 0" style="padding-left: 35px!important;margin-right: 10px!important;">
            <h6 class="text-center font-bold">PAGARE A LA ORDEN</h6>
            <p class="mt-3 letra">
               POR USD. $ {{ arregloContrato[0].anticipo_aprobado }}
            </p>
            <p class="letra" style="margin-top: 30px;">
                Debo y pagaré incondicionalmente a la orden de
                <b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b>
                a {{ getDay(arregloContrato[0]) }} días vista, en la ciudad de Quito
                o en el lugar que se me reconvenga, la cantidad
                de $ {{ arregloContrato[0].anticipo_aprobado }}
                ( <span>{{ numeroALetras(arregloContrato[0].anticipo_aprobado).toUpperCase() }}</span> DÓLARES DE LOS ESTADOS UNIDOS DE NORTE AMERICA).
                Al cual se sumarán los intereses sobre la cantidad indicada a
                la tasa del interés fijada por el directorio del Banco Central del Ecuador.
            </p>
            <p class="letra" style="margin-top: 15px;">
                El presente pagaré autoriza al acreedor a que en caso
                de incumplimiento del pago en el plazo acordado,
                el Acreedor podrá declarar vencida la totalidad de
                la obligación y demandar el incumplimiento de
                la totalidad de la misma más el interés legal
                y de mora permitido acorde con las regulaciones establecidas
                por el directorio del Banco Central del Ecuador, más todos
                los gastos judiciales, extrajudiciales, y honorarios profesionales
                que ocasione su cobro, siendo prueba suficiente de ello la simple
                aseveración del acreedor.
            </p>
            <p class="letra" style="margin-top: 15px;">
                Al fiel cumplimiento de lo estipulado me obligo
                con todos mis bienes presentes y futuros.
            </p>
            <p class="letra" style="margin-top: 15px;">
                Renuncio domicilio y me someto a los jueces de lo civil
                que tengan jurisdicción en la ciudad
                de Quito y al trámite ejecutivo conforme la ley.
            </p>
            <p class="letra" style="margin-top: 15px;">
                Expresamente acepto que el acreedor transfiera en cualquier
                momento los derechos que emanan del presente documento,
                sin que sea necesario que se me haga notificación alguna.
            </p>
            <p class="letra" style="margin-top: 15px;">
                Excuso de presentación para el pago, así
                como los avisos por falta de este hecho. Sin protesto.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <!-- Quito, {{ day }} de {{ mes }} del {{ year }} -->
                Quito, {{ getFechaContrato(arregloContrato[0]) }}
            </p>
            <p class="letra" style="margin-top: 110px;">
                FIRMA __________________
            </p>
            <p class="letra mt-1">
                CC.: {{ arregloContrato[0].cedula_beneficiario }}
            </p>
            <p class="letra mt-1">
                Dirección: {{ arregloContrato[0].direccionBenefiario.toUpperCase() }}
            </p>
            <p class="letra mt-1">
                Ciudad: {{ arregloContrato[0].nombre_ciudad.toUpperCase() }}
            </p>
            <p class="letra mt-1">
                {{ arregloContrato[0].beneficiario.toUpperCase() }}
            </p>
            <p class="letra mt-1">
                DEUDOR
            </p>
        </vx-card>
        <div class="w-full p-2 bg-gray-400 text-center">
            <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
        </div>
    </div>

</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
            arregloContrato:[],
            // contrato:'',
            day:'',
            mes:'',
            anio:'',
            fecha:'',
            telefono:'',
            nombrearchivo:'',
            year:'',
            //fecha generar contrato
            yearGenerar:'',
            mesGenerar:'',
            dayGenerar:'',
        }
    },
    props:{
      id_beneficiario_pedido:{
        type:Number,
        default:0
      },
      id_pedido:{
        type:Number,
        default:0
      },
      contrato:{
        type:String,
        default:''
      },
      aniosAnteriorSelect:{
        type:String,
        default:''
      },
      empresaSelected:{
        type:Object,
        default:function(){
          return {}
        }
      }
    },
    created(){
      let me = this;
      moment.lang("es")
      me.day = moment().format('DD');
      me.mes = moment().format('MMMM');
      me.year = moment().format('YYYY')
      me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
      me.nombrearchivo = 'Pagare -'+ me.contrato+".pdf"
      //me.contrato = me.$route.params.id
    },
    mounted(){
      let me = this
      me.getPedidos()
    },
    methods:{
      getPedidos(){
        let me = this
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_pedidos_periodo_Only_pedido/'+me.id_pedido+'/'+me.id_beneficiario_pedido)
        .then(res => {
            me.$vs.loading.close();
            me.arregloContrato = res.data
            me.$vs.notify({
            text: "Espere mientras se va generando el archivo...",
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-file',
            time:3000
            })
            setTimeout(function() {me.imprimirEval()}, 1000);
        })
      },
      imprimirEval(){
        let me = this
        var element = document.getElementById('seccionImprimir2');
        var opt = {
            margin:       0.5,
            // margin:         [1, 0.5, 0.5, 1],
            filename:     me.nombrearchivo,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:    {scale: 3, letterRendering: true},
            //pagebreak:      {mode: 'avoid-all',before: "#page2"},
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            //jsPDF: {unit: 'pt', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().from(element).set(opt).save();
        me.arregloContrato = []
        me.$vs.notify({
            text: "Archivo descargado correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-file',
            time:2000
        })
        me.$emit('change',true)
      },
      getDay(item){
          let me = this
          const fechaGenerarC =  item.fecha_generar_contrato.substring(0,10)
          var preFechaLimite = ""
          var preyear        = me.aniosAnteriorSelect
            //costa -> hasta 30 de septiembre
            if(item.tregion == 2){
            return me.calculoFechaLimite(preyear,2,fechaGenerarC)
            //preFechaLimite = preyear + "-"+ '09'+"-"+"30"
          }
          //sierra -> hasta 31 de diciembre
          else{
            return me.calculoFechaLimite(preyear,1,fechaGenerarC)
              //preFechaLimite = preyear + "-"+ '12'+"-"+"31"
          }
        },
        calculoFechaLimite(fechaFin,region,fechaGenerarC){
          let me = this;
          //SIERRA
          if(region == 1){
            return me.obtenerDiasXAnio(region,fechaGenerarC,fechaFin)
          }
          //COSTA
          const arrayDeAnios = me.generarArrayDeAnios(me.year, fechaFin);
          var anioUltimo = 0
          if(arrayDeAnios.length > 1){
            anioUltimo = arrayDeAnios.length -1
          }
          let  resultadoDays = 0
          for(let i = 0; i< arrayDeAnios.length; i++){
            let FInicio = ""
            let FFin    = ""
            var anioEnCurso = arrayDeAnios[i]
            var result      = 0
            if(arrayDeAnios.length == 1){
              if(i == 0){
                //fecha inicio del contrato
                FInicio = fechaGenerarC
                FFin    = arrayDeAnios[i] + "-"+ '09'+"-"+"30"
                // result = me.obtenerDiasXAnio(region,FInicio,arrayDeAnios[i])+1
                result = me.obtenerDiasXAnio(region,FInicio,FFin)+1
              }
            }else{
              if(i == 0){
                //fecha inicio del contrato
                FInicio = fechaGenerarC
                FFin    = arrayDeAnios[i] + "-"+ '12'+"-"+"31"
                // result = me.obtenerDiasXAnio(region,FInicio,arrayDeAnios[i])+1
                result = me.obtenerDiasXAnio(region,FInicio,FFin)+1
              }
              if(i == anioUltimo){
                //fecha inicio del año
                FInicio = anioEnCurso+'/01/01'
                FFin    = arrayDeAnios[i] + "-"+ '09'+"-"+"30"
                result = me.obtenerDiasXAnio(region,FInicio,FFin) +1
              }
              if(i != anioUltimo && i != 0){
                //fecha inicio del año
                FInicio = anioEnCurso+'/01/01'
                FFin    = arrayDeAnios[i] + "-"+ '12'+"-"+"31"
                result = me.obtenerDiasXAnio(region,FInicio,FFin) +1
              }
            }
            console.log("ii",result)
            resultadoDays += result
          }
          if(arrayDeAnios.length == 1){
            resultadoDays = resultadoDays
            return resultadoDays
          }else{
            console.log("uno",resultadoDays)
            resultadoDays = resultadoDays
            console.log("dos",resultadoDays)
            return resultadoDays
          }
        },
        obtenerDiasXAnio(region,FInicio,FFin){
          let me = this;
          var preFechaLimite = ""
            //costa -> hasta 30 de septiembre
            if(region == 2){
              // preFechaLimite = FFin + "-"+ '09'+"-"+"30"
              preFechaLimite = FFin

            }
            //sierra -> hasta 31 de diciembre
            else{
              preFechaLimite = FFin + "-"+ '12'+"-"+"31"
            }
            var fechaInicio = new Date(FInicio);
            var fechaFin = new Date(preFechaLimite);
            //proceso de calcular los dias
            // Calcular la cantidad de tiempo en milisegundos entre las dos fechas
            var tiempoMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
            // Convertir la cantidad de tiempo de milisegundos a días
            var diasEntreFechas = tiempoMilisegundos / (1000 * 3600 * 24);
            // Redondear el resultado a un número entero
            diasEntreFechas = Math.round(diasEntreFechas);
            return diasEntreFechas
        },
        generarArrayDeAnios(inicio, fin) {
            const arrayAnios = [];
            for (let i = inicio; i <= fin; i++) {
              arrayAnios.push(i);
            }
          return arrayAnios;
        },
      getFechaContrato(item){
        let me = this;
        const fechaGenerarC =  item.fecha_generar_contrato.substring(0,10)
        me.dayGenerar       = moment(fechaGenerarC).format('DD');
        me.mesGenerar       = moment(fechaGenerarC).format('MMMM');
        me.yearGenerar      = moment(fechaGenerarC).format('YYYY')
        var resultado       = me.dayGenerar +" de "+me.mesGenerar + " "+me.yearGenerar
        return resultado
      },
      numeroALetras(numero) {
        let unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        let especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        let decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        let centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
        let bloques = ['', 'mil', 'millón', 'mil millones', 'billón', 'mil billones', 'trillón', 'mil trillones'];

        if (numero === 0) {
            return 'cero';
        }

        if (numero < 0) {
            return 'menos ' + numeroALetras(Math.abs(numero));
        }

        let palabras = [];
        let indiceBloque = 0;

        while (numero > 0) {
            let bloque = numero % 1000;
            if (bloque !== 0) {
            let palabrasBloque = [];
            let centenasBloque = Math.floor(bloque / 100);
            let decenasBloque = bloque % 100;
            let unidadesBloque = bloque % 10;
            if (centenasBloque === 1 && decenasBloque === 0 && unidadesBloque === 0) {
                palabrasBloque.push('cien');
            } else if (centenasBloque !== 0) {
                palabrasBloque.push(centenas[centenasBloque]);
            }
            if (decenasBloque >= 10 && decenasBloque <= 19) {
                palabrasBloque.push(especiales[decenasBloque - 10]);
            } else if (decenasBloque !== 0) {
                palabrasBloque.push(decenas[Math.floor(decenasBloque / 10)]);
            }
            if (decenasBloque !== 1 && unidadesBloque !== 0) {
                palabrasBloque.push(unidades[unidadesBloque]);
            }
            palabrasBloque.push(bloques[indiceBloque]);
            palabras.push(palabrasBloque.join(' '));
            }
            indiceBloque++;
            numero = Math.floor(numero / 1000);
        }
        return palabras.reverse().join(' ');
      },
    },

}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
    font-family: Arial;
}
.letra{
    padding:0px 60px 0px 0px;
    font-size: 11px;
}
table {
  table-layout: fixed;
  width: 90%;
  border-collapse: collapse;
  border: none;
}
th{
    text-decoration: underline;
}
thead th:nth-child(1) {
  width: 10%;
}

thead th:nth-child(2) {
  width: 30%;
}

thead th:nth-child(3) {
  width: 15%;
}

thead th:nth-child(4) {
  width: 15%;
}
thead th:nth-child(5) {
  width: 20%;
}
@media print {
    td {page-break-before: always;}
    p  {page-break-before: always;}
}
/* th, td {
  padding: 20px;
} */
</style>
