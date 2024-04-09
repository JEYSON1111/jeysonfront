<template>
    <div>
        <vx-card id="seccionImprimir2">
            <h5 class="text-center font-bold">ACTA DE ENTREGA</h5>
            <h5 class="text-center font-bold mt-2">BODEGA</h5>
            <h6 class="text-right font-bold -mt20">{{ pedido.ven_codigo }}</h6>
            <div class="flex sp55" style="width: 100%;">
                <div style="width: 50%;">
                    <p class="letra2">Quito, {{ mesd }}, {{ day }} de {{ mes }} del {{ year }}</p>
                </div>
                <div style="width: 33%;" class="flex justify-end">
                    <p class="letra2 font-bold">Ref:</p>
                </div>
            </div>
            <br>
            <div clas="flex">
                <div style="width: 100%;" class="flex letra2">
                    <div style="width: 30%;">
                        <b>RESPONSABLE:</b>
                    </div>
                    <div style="width: 50%;">
                        <p>{{ pedido.asesor.toUpperCase() }}</p>
                    </div>
                </div>
            </div>
            <div clas="flex">
                <div style="width: 100%;" class="flex letra2">
                    <div style="width: 30%;">
                        <b>CI:</b>
                    </div>
                    <div style="width: 40%;">
                        <p>{{ pedido.cedula }}</p>
                    </div>
                </div>
            </div>
            <p></p>
            <p class="sp25 letra2">
                Con esta fecha, se procede a la suscripción de la presente Acta de Entrega - Recepción de los productos que se
                otorgan en calidad de <b>OBSEQUIOS SIN COSTO,</b> como parte de la PROMOCIÓN DE VENTAS.
            </p>
            <br>
            <div  v-for="(tr,key) in arregloLibros" :key="key">
                <div  class="flex letra2">
                    <div style="width: 17%;">
                        <p class="text-right mr-3">{{ tr.valor}} </p>
                    </div>
                    <div style="width: 80%;">
                        {{ tr.nombrelibro.toUpperCase() }}
                    </div>
                </div>
            </div>
            <div class="flex letra2" style="justify-content: space-between;margin-top: 30px;">
                <div style="width: 50%;">
                    <p class="font-bold">ENTREGUÉ CONFORME</p>
                </div>
                <div style="width: 50%;">
                    <p class="font-bold">RECIBÍ CONFORME</p>
                </div>
            </div>
            <div class="flex letra2" style="justify-content: space-between;margin-top: 90px;">
                <div style="width: 50%;">
                    <p class="font-bold">BODEGA</p>
                </div>
                <div style="width: 50%;">
                    <p>{{ pedido.asesor.toUpperCase() }}</p>
                    <p class="font-bold">VENDEDOR</p>
                </div>
            </div>
            <div id="ultimo-elemento" style="font-size: 10px;">
                <p v-if="pedido.facturador !=null">Por: {{ pedido.facturador.toUpperCase() }}</p>
            </div>
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
            arregloLibros:[],
            day:'',
            mes:'',
            mesd:'',
            year:'',
            anio:'',
            fecha:'',
            telefono:'',
            nombrearchivo:'',
        }
    },
    props:{
        pedido:{
            type:Array,
            default:{},
        },
    },
    created(){
        let me = this;
        moment.lang("es")
        me.day = moment().format('DD');
        me.mes = moment().format('MMMM');
        me.mesd = moment().format('dddd');
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
        me.nombrearchivo = me.pedido.ven_codigo+".pdf"
        // me.contrato = me.$route.params.id
    },
    mounted(){
        let me = this
        me.getLibros()
    },
    methods:{
        //funcion para obtener el dia de 365
        getDay(){
            const hoy = new Date(); // Crear una instancia del objeto Date
            const año = hoy.getFullYear(); // Obtener el año actual
            const diaDelAño = Math.ceil((hoy - new Date(año, 0, 1)) / 86400000); // Obtener el número del día del año actual (86400000 = número de milisegundos en un día)
            return diaDelAño;
            //console.log("Hoy es el día número " + diaDelAño + " del año " + año); // Mostrar el número del día del año actual en la consola
        },
        // getLibros(id_pedido){
        //     let me = this
        //     me.$vs.loading()
        //     this.$http.get(this.$server_url+'get_val_pedidoInfo/'+me.pedido.id_pedido)
        //     .then(res => {
        //         me.$vs.loading.close()
        //         me.$vs.notify({
        //         text: "Espere mientras se va generando el archivo...",
        //         color: 'primary',
        //         iconPack: 'feather',
        //         icon: 'icon-file',
        //         time:3000
        //         })
        //         let datos = res.data
        //         me.arregloLibros = datos.filter(p => p.valor > 0)
        //         setTimeout(function() {me.imprimirEval()}, 1000);
        //     })
        //     .catch((e) => {
        //         me.$vs.loading.close()
        //     })
        // },
        getLibros(id_pedido){
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'get_val_pedidoInfo/'+me.pedido.id_pedido)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                text: "Espere mientras se va generando el archivo...",
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-file',
                time:3000
                })
                let librosNormales        = []
                let libroPlanLector       = []
                let getNormalesOrdenado   = []
                let getPlanLectorOrdenado = []
                //proceso
                let datos                 = res.data
                if(datos.length == 0){
                    me.$vs.notify({
                        text: "No se encontraron libros",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time:2000
                    })
                    return
                }
                librosNormales            = datos.filter(p => p.valor > 0 && p.id_serie != 6)
                libroPlanLector           = datos.filter(p => p.valor > 0 && p.id_serie == 6)
                getNormalesOrdenado       = me.ordenarLibros(librosNormales)
                getPlanLectorOrdenado     = me.ordenarLibros(libroPlanLector)
                //unir array con spread operator
                me.arregloLibros          = [...getNormalesOrdenado,...getPlanLectorOrdenado]
                setTimeout(function() {me.imprimirEval()}, 1000);
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        ordenarLibros(datos){
          let me = this
          let predatos  = []
          let valores   = []
          predatos = datos.filter(p => p.valor > 0)
          valores = predatos.sort(function(a, b) {
          var nombreA = a.nombrelibro.toLowerCase();
          var nombreB = b.nombrelibro.toLowerCase();
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
          });
          return valores
        },
        imprimirEval(){
            let me = this
            var element = document.getElementById('seccionImprimir2');
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
            me.arregloContrato = []
            me.arregloLibros   = []
            me.$vs.notify({
                text: "Archivo descargado correctamente",
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-file',
                time:2000
            })
            me.$emit('change',true)
        },
    }
}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
    font-family: Arial;
}
#ultimo-elemento {
    margin-top: 300px;
}
.letra{
    padding:0px 60px 0px 0px;
    font-size: 11px;
    margin-left: 35px;
}
.letra2{
    font-size: 12px;
}
.letra3{
    display: flex;
    font-size: 11px;
    margin-left: 35px;
}
.letra4{
    margin-top: 15px;
    margin-left: 55px;
    font-size: 11px;
}
.letra5{
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    margin-left: 35px;
    font-size: 11px;
    margin-top: 105px;
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

}
.sp25{
    margin-top: 25px;
}
.sp55{
    margin-top: 55px;
}
.-mt20{
    margin-top: -20px;
}
@media print {
    td {page-break-before: always;}
    p  {page-break-before: always;}
}
.encabezado ,td,th {
    border: 1px solid rgb(227, 227, 227);
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
