<template>
    <div>
        <vx-card id="seccionImprimir">
        <!-- <div class="w-full flex flex-wrap gap-10 items-center text-xl justify-end">
            <vs-radio color="warning" v-model="tipo_form" vs-value="textos" vs-name="tipo_textos" @input="activar_tipo()">Textos</vs-radio>
            <vs-radio color="warning" v-model="tipo_form" vs-value="guias" vs-name="tipo_guias" @input="activar_tipo()">Guías</vs-radio>
        </div> -->
            <table class="encabezado">
                <thead>
                    <tr>
                        <th colspan="4" class="test">NOTA DE PEDIDO DIGITAL T.{{arregloPedidos[0].region }} {{ year}} (2)</th>
                        <th colspan="2"></th>
                        <th colspan="1" class="test">RELACIONADO</th>
                        <th colspan="2"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Temporada:</td>
                        <td colspan="1">{{ arregloPedidos[0].region.substring(0,1) }}</td>
                        <td colspan="2" class="font1">Tipo de venta</td>
                        <td colspan="1">{{ arregloPedidos[0].tipo_venta }}</td>
                        <td colspan="1" class="font1">Nivel</td>
                        <td colspan="1">
                            <p v-if="arregloPedidos[0].nivel == 1 ">Educación General Básica</p>
                            <p v-if="arregloPedidos[0].nivel == 2 ">Bachillerato General Unificado</p>
                            <p v-else></p>
                        </td>
                        <td colspan="1" class="font1">ZONA</td>
                        <td colspan="1">{{ arregloPedidos[0].nombre_ciudad }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Año:</td>
                        <td colspan="1">{{ year.substring(2,4) }}</td>
                        <td colspan="1" class="font1">Fecha env:</td>
                        <td colspan="1">{{ arregloPedidos[0].fecha_envio.substring(0,10) }}</td>
                        <td colspan="1" class="font1">Fch ent:</td>
                        <td colspan="1">{{ arregloPedidos[0].fecha_entrega.substring(0,10) }}</td>
                        <td colspan="3" rowspan="2" class="font1">VERSION: {{ year }}-{{ mes }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Institución:</td>
                        <td colspan="3">{{ arregloPedidos[0].nombreInstitucion.toUpperCase()}}</td>
                        <td colspan="1" class="font1">Tipo Institución</td>
                        <td colspan="1">{{ arregloPedidos[0].tipo_descripcion }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Responsable pedido:</td>
                        <!-- <td colspan="3">{{ arregloPedidos[0].asesor.toUpperCase()}}</td> -->
                        <td colspan="3">{{ arregloPedidos[0].beneficiario.toUpperCase()}}</td>
                        <td colspan="1" class="font1">Telf:</td>
                        <td colspan="1">{{ telefono }}</td>
                        <td colspan="2" class="font1">Cod. Vendedor:</td>
                        <td colspan="1">{{ arregloPedidos[0].iniciales }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">RUC:</td>
                        <td colspan="3">{{ arregloPedidos[0].ruc }}</td>
                        <td colspan="1" class="font1">Banco:</td>
                        <td colspan="1">{{ arregloPedidos[0].banco }}</td>
                        <td colspan="2" class="font1">Cuenta Nº</td>
                        <td colspan="1">{{ arregloPedidos[0].num_cuenta }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Ciudad:</td>
                        <td colspan="3">{{ arregloPedidos[0].nombre_ciudad.toUpperCase() }}</td>
                        <!-- <td colspan="1" class="font1">Beneficiario</td> -->
                        <!-- <td colspan="1">{{ arregloPedidos[0].beneficiario }}</td> -->
                        <td colspan="1" class="font1">Tipo de cuenta</td>
                        <td colspan="1">{{ arregloPedidos[0].tipo_cuenta }}</td>
                        <td colspan="2" class="font1">Anticipo sugerido: </td>
                        <td colspan="1">$.{{ arregloPedidos[0].anticipo }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Dirección:</td>
                        <td colspan="3">{{ arregloPedidos[0].direccionInstitucion.toUpperCase() }}</td>
                        <td colspan="1" class="font1">Dscto %</td>
                        <td colspan="1">{{porcentaje_descuento}}%</td>
                        <td colspan="2" class="font1">Anticipo aprobado:</td>
                        <td colspan="1">$.{{ arregloPedidos[0].anticipo_aprobado }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">TOTAL VENTA:</td>
                        <td colspan="1" class="input_totales">$.{{ total_usd.toFixed(2) }}</td>
                        <td colspan="1">COMI</td>
                        <td colspan="1" class="input_totales">$.{{ ((total_usd*porcentaje_descuento)/100).toFixed(2) }}</td>
                        <td colspan="2" class="font1">TOTAL UNIDADES</td>
                        <td colspan="3" class="input_totales">{{ total_unidades }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">VENTA NETA:</td>
                        <td colspan="1" class="input_totales">$.{{ SumaNeta }}</td>
                        <td colspan="2"></td>
                        <td colspan="2">Correo electónico</td>
                        <td colspan="3">{{ arregloPedidos[0].email }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Observación:</td>
                        <td colspan="8">{{ arregloPedidos[0].observacion }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="width: 100px;" class="font1">Asesor:</td>
                        <td colspan="8"><p style="text-align: left;">{{ arregloPedidos[0].asesor.toUpperCase() }}</p></td>
                    </tr>
                </tbody>
            </table>
            <div>
                <div :key="index" v-for="(item, index) in series">
                    <div slot="header" class="text-center">
                        <p v-if="index > 0" style="height: 15px;"></p>
                        <b>SERIE {{item.nombre_serie.toUpperCase()}}</b>
                    </div>
                    <div class="w-full" style="overflow-x:auto;">
                        <table class="table_pedidos">
                            <tr class="text-center">
                            <td rowspan="3" style="width: 100px;"><b>Áreas</b></td>
                            <td colspan="20"><b>Niveles</b></td>
                            <td rowspan="3" style="width: 70px;"><b>PVP</b></td>
                            </tr>
                            <tr class="text-center">
                            <td colspan="2"><b>1</b></td> <td colspan="2"><b>2</b></td> <td colspan="2"><b>3</b></td> <td colspan="2"><b>4</b></td> <td colspan="2"><b>5</b></td> <td colspan="2"><b>6</b></td> <td colspan="2"><b>7</b></td> <td colspan="2"><b>8</b></td> <td colspan="2"><b>9</b></td> <td colspan="2"><b>10</b></td>
                            </tr>
                            <tr class="text-center">
                            <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                            </tr>
                            <tr class="text-center" align="center" :key="indextr" v-for="(tr, indextr) in item.areas">
                            <td class="font1"> <b>{{tr.nombrearea}}</b> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+0" :hidden="!tr.n1" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n1 == '' || tr.n1 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+1" :disabled="usuario.id_group==11 ? !tr.n1 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+2" :disabled="!tr.n2" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n2 == '' || tr.n2 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+3" :disabled="usuario.id_group==11 ? !tr.n2 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+4" :disabled="!tr.n3" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n3 == '' || tr.n3 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+5" :disabled="usuario.id_group==11 ? !tr.n3 : true" /></td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+6" :disabled="!tr.n4" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n4 == '' || tr.n4 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+7" :disabled="usuario.id_group==11 ? !tr.n4 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+8" :disabled="!tr.n5" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n5 == '' || tr.n5 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+9" :disabled="usuario.id_group==11 ? !tr.n5 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+10" :disabled="!tr.n6" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n6 == '' || tr.n6 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+11" :disabled="usuario.id_group==11 ? !tr.n6 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+12" :disabled="!tr.n7" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n7 == '' || tr.n7 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+13" :disabled="usuario.id_group==11 ? !tr.n7 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+14" :disabled="!tr.n8" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n8 == '' || tr.n8 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+15" :disabled="usuario.id_group==11 ? !tr.n8 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+16" :disabled="!tr.n9" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n9 == '' || tr.n9 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+17" :disabled="usuario.id_group==11 ? !tr.n9 : true" /> </td>
                            <td> <input class="input_pvp_tabla t_guia" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+18" :disabled="!tr.n10" /> </td>
                            <td> <input :class="['input_pvp_tabla t_texto', (tr.n10 == '' || tr.n10 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+19" :disabled="usuario.id_group==11 ? !tr.n10 : true" /> </td>
                            <td><input class="input_pvp_tabla input_pvp" readonly type="number" :id="item.id_serie+'_'+tr.idarea+'_'+20" :value="tr.pvp" /> </td>
                            </tr>
                            <tr class="text-center">
                            <td> <b style="font-size: 7px;">TOTAL TEXTOS</b> </td>
                            <td colspan="7" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie_'+item.id_serie" type="number" /> </td>
                            <td colspan="6" style="font-size: 7px;"> <b>TOTAL USD</b> </td>
                            <td colspan="8" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_usd_serie_'+item.id_serie" type="number" /> </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div>
                    <p style="height: 15px;"></p>
                    <div slot="header" class="text-center"> <b>PLAN LECTOR</b> </div>
                    <div class="w-full" style="overflow-x:auto;">
                        <table class="table_pedidos">
                            <tr class="text-center">
                            <td><b>LIBRO</b></td>
                            <td><b>GUÍA</b></td>
                            <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                            <td style="width: 100px;">&nbsp;<b>PVP</b>&nbsp;&nbsp;</td>
                            </tr>
                            <tr class="text-center" align="center" :key="index" v-for="(item, index) in series_plan_lector">
                                <td class="font1"> <b>{{item.nombrelibro}}</b> </td>
                                <td> <input class="input_pvp_tabla t_guia" type="number" :id="6+'_'+item.id_libro+'_'+0" @blur="guardar_valor(item.id_libro, 6, 0,-1)"  :disabled="disableAsesor"/> </td>
                                <td> <input class="input_pvp_tabla t_texto" type="number" :id="6+'_'+item.id_libro+'_'+1" @blur="guardar_valor(item.id_libro, 6, 1,-1)" :disabled="disableAsesor" /> </td>
                                <td> <input class="input_pvp_tabla input_pvp" readonly type="number" :value="item.pvp" :id="6+'_'+item.id_libro+'_'+20" /> </td>
                            </tr>
                            <tr class="text-center">
                            <td colspan="2"> <b style="font-size: 12px;">TOTAL TEXTOS</b> </td>
                            <td colspan="2" style="font-size: 12px;"> <b>TOTAL USD</b> </td>
                            </tr>
                            <tr class="text-center">
                                <td colspan="2" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie_'+6" type="number" /> </td>
                                <td colspan="2" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_usd_serie_'+6" type="number" /> </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <!-- <div class="w-full text-right">
                <b>
                    CANTIDAD DE UNIDADES TOTAL : <div style="width: 120px; display: inline-block;">{{total_unidades}} </div><br>
                    VENTA BRUTA : <div style="width: 120px; display: inline-block;">{{total_usd.toFixed(2)}} </div><br>
                    {{porcentaje_descuento}}% COMISION: <div style="width: 120px; display: inline-block;">{{((total_usd*porcentaje_descuento)/100).toFixed(2)}} </div><br>
                </b>
            </div> -->
        </vx-card>
        <div class="w-full p-2 bg-gray-400 text-center">
            <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
        </div>
    </div>
</template>
<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import vSelect from 'vue-select';
    import html2pdf from "html2pdf.js"
    import moment from "moment";
    export default {
        components:{
          FormWizard,
          TabContent,
          flatPickr,
          'v-select': vSelect,
        },
        data: () => ({
            usuario: [],
            series: [],
            series_plan_lector: [],
            arregloPedidos:[],
            tipo_form: 'textos',
            // id_periodo: '',
            id_pedido: '',
            total_usd: 0,
            total_unidades: 0,
            porcentaje_descuento: 0,
            disableAsesor:false,
            mes:'',
            year:'',
            telefono:'',
        }),
        props:{
            id_beneficiario_pedido:{
                type:Number,
                default:0
            },
            id_pedido:{
                type:Number,
                default:0
            },
            id_periodo:{
                type:Number,
                default:0
            },
            contrato:{
                type:String,
                default:'',
            }
        },
        mounted() {
            let me = this;
            moment.locale("es")
            me.mes = moment().format('MMMM');
            me.year = moment().format('YYYY')
            // this.id_periodo = me.$route.params.periodo_id
            // this.id_pedido = me.$route.params.id_pedido
            this.usuario = JSON.parse(localStorage.getItem('usuario'))
            this.usuario_id = this.usuario.idusuario
            this.getSeries()
            this.getLibrosPlanLector()
            me.getPedidos()
            this.disableAsesor = true
        },
        computed:{
            SumaNeta(){
                let me = this;
                let valor = me.total_usd.toFixed(2) - ((me.total_usd*me.porcentaje_descuento)/100).toFixed(2)
                return valor.toFixed(2)
            },
        },
        methods: {
            getPedidos(){
                let me = this
                me.$vs.loading();
                this.$http.get(this.$server_url+'get_pedidos_periodo_Only_pedido/'+me.id_pedido+'/'+me.id_beneficiario_pedido)
                .then(res => {
                    me.$vs.loading.close();
                    me.arregloPedidos = res.data
                    if(me.arregloPedidos[0].telefonoInstitucion == "" || me.arregloPedidos[0].telefonoInstitucion == null || me.arregloPedidos[0].telefonoInstitucion == 0){
                        me.telefono = ""
                    }else{
                        me.telefono = me.arregloPedidos[0].telefonoInstitucion
                    }
                    me.$vs.notify({
                        text: "Espere mientras se va generando el archivo...",
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-file',
                        time:3000
                    })
                    setTimeout(function() {me.imprimirEval()}, 2000)
                })
            },
            imprimirEval(){
                let me = this
                var element = document.getElementById('seccionImprimir');
                var opt = {
                    margin:         [0, 0, 0.5, 0],
                    filename:       "Reportepedido.pdf",
                    image:          { type: 'jpeg', quality: 0.98 },
                    html2canvas:    {dpi: 192, scale: 3, letterRendering: true},
                    pagebreak:      {mode: 'avoid-all'},
                    //jsPDF:          { unit: 'in', format: 'letter', orientation: 'portrait' }
                    jsPDF: {unit: 'pt', format: 'a4', orientation: 'portrait'}                };
                html2pdf().from(element).set(opt).save();
                me.arregloContrato = []
                me.arregloLibros   = []
                me.telefono        = ''
                me.$vs.notify({
                    text: "Archivo descargado correctamente",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-file',
                    time:2000
                })
                me.$emit('change',true)
            },
            getSeries(){
                let me = this
                this.$http.get(this.$server_url+'series_formato_periodo/'+me.id_periodo)
                .then(res => {
                    me.series = res.data
                    me.getLibrosPlanLector()
                })
            },
            getLibrosPlanLector(){
                let me = this
                this.$http.get(this.$server_url+'get_pvp_planes_periodo/'+me.id_periodo)
                .then(res => {
                    me.series_plan_lector = res.data
                    me.get_val_pedido()
                })
            },
            get_val_pedido(){
                let me = this
                if(!me.id_pedido){
                return
                }
                this.$http.get(this.$server_url+'get_val_pedido/'+me.id_pedido)
                .then(res => {
                    me.porcentaje_descuento = res.data[0].descuento
                    $.each(res.data,function(key, value){
                    try {
                        // console.log(value.id_serie+'_'+value.id_area+'_'+value.tipo_val + ' == ' + value.valor)
                        document.getElementById(value.id_serie+'_'+value.id_area+'_'+value.tipo_val).value = value.valor
                    } catch (error) {
                    }
                    });
                    me.activar_tipo()

                    let array_series = []
                    array_series = me.groupArrayOfObjects(res.data, "id_serie")
                    me.total_usd = 0
                    me.total_unidades = 0
                    $.each(array_series,function(key, value){

                        let array_areas_serie = []
                        array_areas_serie = me.groupArrayOfObjects(value, "id_area")

                        // console.log(value[0].id_serie)
                        let total_serie = 0;
                        let total_libros = 0;
                        var val_pvp_area = 0
                        $.each(array_areas_serie,function(key_1, value_1){ // recorre las areas de cada serie
                            let sum_celdas_area = 0;

                            $.each(value_1,function(key_2, value_2){ // recorre las celdas de cada area; tipo_val = posicion celda
                            // console.log('value_2.tipo_val: '+value_2.tipo_val+' value_2.valo: '+value_2.valor)
                                if( parseInt(value_2.tipo_val) % 2 != 0 ){ //sumar solo cantidades de textos
                                total_libros += value_2.valor
                                sum_celdas_area += value_2.valor
                                }
                            });

                            //valor de pvp de area
                            val_pvp_area = document.getElementById(value[0].id_serie+'_'+value_1[0].id_area+'_'+20).value //obtiene el pvp de cada area
                            // console.log('sum_celdas_area*val_pvp_area = '+sum_celdas_area+' * '+val_pvp_area)
                            total_serie += (sum_celdas_area*val_pvp_area)
                        });

                        document.getElementById('total_textos_serie_'+value[0].id_serie).value = total_libros
                        document.getElementById('total_usd_serie_'+value[0].id_serie).value = total_serie.toFixed(2)

                        me.total_usd = me.total_usd + parseFloat(total_serie);
                        me.total_unidades = me.total_unidades + parseInt(total_libros);
                        // me.guardarTotalPedido()
                    });


                })
                .catch(err => {
                    // console.log(err);
                })
            },
            async guardar_valor(id, serie, index,libro){
                let me = this
                if( document.getElementById(serie+'_'+id+'_'+index).value == '' ){ // no guardar cuando no se digita algo
                return;
                }
                let valor = document.getElementById(serie+'_'+id+'_'+index).value
                if(valor == 0){
                document.getElementById(serie+'_'+id+'_'+index).value = ''
                }
                me.$vs.loading();
                let formData = new FormData();
                formData.append('id_pedido', me.id_pedido);
                formData.append('valor', document.getElementById(serie+'_'+id+'_'+index).value);
                formData.append('tipo_val', index);
                formData.append('id_serie', serie);
                formData.append('id_area', id);
                if(libro == '-1') {
                    formData.append('plan_lector',id)
                    formData.append('libro','0')
                }else{
                    formData.append('plan_lector','0')
                    formData.append('libro',libro)
                }
                await this.$http.post(this.$server_url+'save_val_pedido', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if(res.data.status == 0){
                    me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
                    me.getSeries()
                    return
                    }
                    if(res.data.status == 2){
                    me.getSeries()
                    }
                    me.$vs.notify({ text: 'Guardado correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                    me.get_val_pedido()
                })

            },
            async guardarTotalPedido(){
                let me = this
                let total_usd_format = me.total_usd.toFixed(2)
                await me.$http.get(me.$server_url+'guardar_total_pedido/' + me.id_pedido + '/' + total_usd_format + '/' + me.total_unidades)
                .then(res => {
                // console.log('total actualizado: ' + total_usd_format)
                })
            },
            groupArrayOfObjects(list, key) {
                return list.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            activar_tipo(){
                if( this.tipo_form == 'textos' ){
                $('.t_texto').css('display', 'block');
                $('.t_guia').css('display', 'none');
                }else{
                $('.t_guia').css('display', 'block');
                $('.t_texto').css('display', 'none');
                }

            }
        },
    }
</script>
<style scoped>
    @media print {
        td,tr {page-break-before: always;}

        table,td {page-break-after: always;}
    }

    *{
        font-size: 7px;
        font-weight: bold;
    }
    input[type=number].input_pvp_tabla::-webkit-inner-spin-button,
    input[type=number].input_pvp_tabla::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }
    input[type=number].input_pvp_tabla { -moz-appearance:textfield; }

    input[type=number].input_pvp_tabla {
      width: 100%;
      height: 100%;
      border: none;
      font-size: 9px !important;
      text-align: center;
      color: rgb(60, 108, 192);
      padding-top: -100px !important;
    }
    table.table_pedidos tr:hover {
      background-color: #CCF7EF;
      border: 2px solid rgb(118, 255, 177);
      color: black!important;

    }

    input[type=number].input_pvp_tabla:hover {
      background-color: #CCF7EF;
      color: black!important;
    }

    table.table_pedidos td{
      border: 1px solid rgb(227, 227, 227);
      height: 18px;
    }
    table.table_pedidos th {
      border: 1px solid rgb(227, 227, 227);
      height: 18px;
    }

    table.table_pedidos {
      width: 90%;
      margin: 0 auto;
      border-collapse: collapse;
    }

    .input_totales{
      background-color:#31B10C;
      color: white !important;
      font-weight: bold;
    }
    .input_pvp{
      background-color: #fcfcd9;
      color: black!important;
      border-radius: 0%;
      width: 100%;
      height: 100%;
    }
    .test{
      color:black!important;
      background-color: #fcfcd9;

    }
    .test:hover{
      color:black;
    }
    .encabezado{
        width: 90%;
        margin: 0 auto;
    }
    /*estilos del encabezado*/
    .encabezado ,td, th {
        border: 1px solid rgb(227, 227, 227);
        text-align: center;
        border-spacing: 0;
    }
    .font1{
        background-color: #fcfcd9;
        color: black!important;;
        font-weight: bold;
    }
</style>
