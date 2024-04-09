<template>
    <div>
        <vs-table max-items="20" search pagination :data="arregloResultados">
            <template slot="header">
                <vs-list>
                    <vs-list-item title="Nombre encuesta: " :subtitle="nombre_encuesta"></vs-list-item>
                    <vs-list-item title="Total Encuestados: " :subtitle="total_encuestados"></vs-list-item>
                    <vs-list-item title="Cantidad preguntas: " :subtitle="arregloResultados.length">
                        <vs-button color="warning" size="small" class="ml-3" @click="exportToExcel">Exportar</vs-button>
                    </vs-list-item>
                </vs-list>
            </template>
            <template slot="thead">
                <vs-th>Pregunta</vs-th>
                <vs-th>total si</vs-th>
                <vs-th>total no</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].pregunta}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].siR}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].noR}}<br>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
         <!--MODAL PARA EXPORTAR A EXCEL-->
         <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        </vs-prompt>
    </div>
</template>
<script>
export default{
    data(){
        return{
            arregloResultados:[],
            //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables para el export a excel
        }
    },
    props:{
        encuestas_escuela_id:{
            type:Number,
            default:0
        },
        encuesta_id:{
            type:Number,
            default:0
        },
        total_encuestados:{
            type:Number,
            default:0
        },
        nombre_encuesta:{
            type:String,
            default:'',
        }
    },
    methods:{
        getResultados() {
            let me = this;
            this.$http.get(this.$server_url+'getResultadoEncuestas?encuestas_escuela_id='+me.encuestas_escuela_id+'&encuesta_id='+me.encuesta_id)
                .then(function (res) {
                   me.arregloResultados = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        //METODOS PARA EXCEL
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['Pregunta','Si','No'];
            let headerVal = ['pregunta', 'siR','noR'];  
            let codigoSelectedMayus = this.arregloResultados
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: 'ReportePreguntas',
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
    },
    created(){
        let me = this;
        me.getResultados()
    },
}
</script>