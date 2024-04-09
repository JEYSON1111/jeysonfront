<template>
    <vx-card
    title="Códigos para ser liquidados"
    title-color="primary"
    >
        <div v-if="arregloTemporada.length =='0'">
            <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
                <p>No hay códigos para liquidar</p>
            </vs-alert>
        </div>
        <div v-if="arregloTemporada.length > 0">
            <ul>
                <vs-list>
                    <vs-list-item icon="check" title="Contrato" :subtitle="contratoLiquidacion">
                    </vs-list-item>
                    <vs-list-item icon="check" title="Institución" :subtitle="insNombre + ' ('+ciuNombre+')'">
                    </vs-list-item>
                    <vs-list-item icon="check" title="Periodo" :subtitle="arregloTemporada[0].periodo">
                    </vs-list-item>
                    <vs-list-item icon="check" title="Asesor" :subtitle="arregloTemporada[0].asesor">
                    </vs-list-item>
                </vs-list>
            </ul>
            <!-- <div>
                <div class="vx-row">
                    <div class="vx-col sm:w-2/3 w-full ml-auto" v-if="estado_verificacion == 0">
                        <vs-button class="mr-3 mb-2" @click="solicitarVerificacion()"><ion-icon name="checkmark-outline"></ion-icon> Solicitar Verificación</vs-button>
                        <vs-button color="warning" type="border" @click="$emit('ChangeRegresar',true)" class="mb-2">Cancelar</vs-button>
                    </div>
                    <div v-else class="vx-col sm:w-2/3 w-full ml-auto">
                        <p class="text-warning text-2xl">Ya existe una solicitud de verificación</p>
                    </div>
                </div>
            </div> -->
            <vs-table pagination max-items="15" search :data="codigosInstitucion">
                <template slot="header">
                    <vs-chip color="primary" class="mr-2" style="font-size:12px;">
                    Total Libros a liquidar: {{sumaTotal}}
                    </vs-chip>
                    <vs-chip color="success" class="mr-2" style="font-size:12px;">
                    Total tabla: {{ codigosInstitucion.length }}
                    </vs-chip>
                    <vs-button color="warning"  size="small" class="mr-5" style="font-size: 14px;" @click="exportToExcel()">Exportar</vs-button>
                </template>
                <template slot="thead">
                    <vs-th sort-key="serie">Serie</vs-th>
                    <vs-th sort-key="libro">Libro</vs-th>
                    <vs-th sort-key="cantidad">Cant Códigos</vs-th>
                    <vs-th sort-key="libro">Cod. Liquidacion</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].serie">
                            {{ data[indextr].serie }}
                        </vs-td>
                        <vs-td :data="data[indextr].nombrelibro">
                            {{ data[indextr].nombrelibro }}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{ data[indextr].cantidad }}
                        </vs-td>
                        <vs-td :data="data[indextr].codigo">
                            {{ data[indextr].codigo }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vx-card>
    </template>
    <script>

    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import moment from 'moment'
    import $ from 'jquery'
    import io from "socket.io-client";
    export default{
     data:()=>({
                usuario:[],
                status:"0",
                codigosInstitucion:[],
                arregloTemporada:[],
                //para la tabla seleccionada
                codigoSelected: [],
                //para exportar
                formats: ['xls', 'xlsx', 'csv', 'txt'],
                fileName:null,
                selectedFormat: 'xls',
                cellAutoWidth: true,
                activePrompt: false,
                asesor:"",
                socket: io(process.env.socket),
            }
         ),
        props:{
            contratoLiquidacion:{
                type:String,
                default:"",
            },
            estado_verificacion:{
                type:Number,
                default:0
            },
            insNombre:{
                type:String,
                default:"",
            },
            ciuNombre:{
                type:String,
                default:"",
            },

            // contratoLiquidacion:{
            //     type:String,
            //     default:"C-C23-0000039-LJ",
            // },
            // estado_verificacion:{
            //     type:Number,
            //     default:0
            // },
            // insNombre:{
            //     type:String,
            //     default:"Pan de vida",
            // },
            // ciuNombre:{
            //     type:String,
            //     default:"Guayaquil",
            // },
        },
        computed:{
            sumaTotal(){
                let me = this;
                if(me.codigosInstitucion.length >0){
                    let datos = me.codigosInstitucion.filter(p => p.cantidad)
                    let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
                    return total
                }
            },
        },
        methods:{
            //traer la liquidacion
            getLiquidacion(){
                let me = this;
                me.$vs.loading()
                this.$http.get(this.$server_url + 'temporadas/liquidacion/' + me.contratoLiquidacion)
                .then(res => {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                        text:res.data.message,
                        color:'danger',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return
                    }
                    //llenar el arreglo  de libros
                    this.arregloTemporada   = res.data.temporada
                    this.codigosInstitucion = res.data.codigos_libros;
                })
                .catch(function(e){
                    me.$vs.loading.close()
                })
            },
            OpenConfirm(){
                this.$vs.dialog({
                    type:'confirm',
                    color: 'danger',
                    title: `Confirm`,
                    text: 'Estas seguro de solicitar una verificación.',
                    accept:this.solicitarVerificacion
                })
            },
            solicitarVerificacion(){
                let me = this
                let formData = new FormData();
                formData.append('contrato',me.contratoLiquidacion);
                me.$vs.loading()
                this.$http.post(this.$server_url+'solicitarVerificacion', formData)
                .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text:'Se solicito correctamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
                let datos = {
                    id_asesor:  me.usuario.idusuario,
                    emisor:     me.usuario.idusuario,
                    grupo:      me.usuario.id_group,
                    tipo:       "verificaciones"
                }
                me.sendSocket(datos)
                me.$emit('ChangeRegresar',true)
            },
            sendSocket(datos){
                try {
                this.socket.emit("enviar", datos);
                } catch (error) {
                    console.log(error)
                }
            },
            exportToExcel() {
                let headerTitle = [ 'serie','Libro', 'Cantidad', 'Cod. Liquidacion'];
                let headerVal = [ 'serie','nombrelibro', 'cantidad','codigo'];
                this.fileName = "Codigos_a_liquidar";
                import('@/vendor/Export2Excel').then(excel => {
                    const data = this.formatJson(headerVal, this.codigosInstitucion)
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: this.fileName,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                    this.clearFields()
                    this.guardarActivo = '';
                    this.generarActivo = ' ';
                    this.textAlertCant = '';
                    this.cantidad = '';
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
        },
        components: {
            'v-select': vSelect,
            flatPickr,
        },
       created() {
           let me =this;
           me.usuario = JSON.parse(localStorage.getItem("usuario"))
           me.getLiquidacion()
        }
    }
    </script>
