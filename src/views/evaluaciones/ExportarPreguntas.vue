<template>
    <vx-card
    title="Exportar preguntas del banco de preguntas"
    title-color="primary"
    subtitle="Seleccione un libro y una unidad para filtrar"
    style="min-height: 100vh;"
    >
    <small v-if="usuario.id_group == 1" align="left">Ruta: /a_exportarPreguntas</small>
        <div class="vx-row w-full mb-5 mt-2">
            <div class="vx-col sm:w-1/2 w-full">
                Asignatura
                <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                Unidad
                <v-select class="mb-2" v-model="unidadSelected" :options="unidades" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                Banco
                <v-select v-model="bancoSelected" class="w-full" :options="bancos" @input="getPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
        </div>
        <div v-if="preguntas.length > 0" class="flex mt-3">
            <vs-button @click="ExportToDoc()"  color="#3dd495"  gradient-color-secondary="rgb(130, 207, 23)" type="gradient"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span></vs-button>
            <vs-chip class="ml-2 mt-2" color="primary">Total temas: {{ preguntas.length }}</vs-chip>
        </div>
        <div id="MainHTML" class="mt-3" v-if="preguntas.length > 0">
            <div v-for="(tr,index) in preguntas" :key="index">
                <h2 class="p-2">TEMA: {{ tr.nombre_tema.toUpperCase() }}</h2>
                    <vs-table stripe :data="tr.items.items" no-data-text="No hay preguntas de este tema">
                        <template slot="thead">
                            <vs-th sort-key="pregunta">Pregunta</vs-th>
                            <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
                        </template>
                        <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].descripcion">
                                <b>{{indextr+1}}. {{ data[indextr].descripcion }}</b><br>
                                <img v-if="data[indextr].img_pregunta!='' && data[indextr].img_pregunta!='null' && data[indextr].img_pregunta!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+data[indextr].img_pregunta" class="img-responsive" width="50" height="50" style="border-radius: 5px;">
                                <div slot="header">
                                    Opciones
                                </div>
                                <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                                <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                                <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                                <div style="width: 100%"> {{ item.opcion }}<br></div>
                                <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="50" height="50"></div>
                                </div>
                            </vs-td>
                            <vs-td :data="data[indextr].nombre_tipo">
                                {{data[indextr].nombre_tipo}}
                            </vs-td>
                        </vs-tr>
                        </template>
                    </vs-table>
             
            </div>
        </div>
    </vx-card>
</template>
<script>

import vSelect from 'vue-select'
export default{
    data(){
        return{
            usuario:[],
            asignaturas:[],
            unidades:[],
            temas:[],
            datoEnviar:[],
            asignaturaSelected:'',
            unidadSelected:'',
            tema_ambito:'',
            preguntas: [],
            unidades: [
                { id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }
            ],
            bancoSelected: {id:'3',label:'Ambas'},
            bancos: [
                {id:'1',label:'Preguntas de Prolipa'},
                // {id:'2',label:'Solo mis preguntas'},
                {id:'3',label:'Todo'},
            ],
        }
    },
    components:{
        vSelect,
    },
    mounted(){
        let me = this;
        me.getAsignaturas()
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    methods:{
        ExportToDoc(){
            let me = this;
            if(me.asignaturaSelected == "" || me.asignaturaSelected == undefined || me.asignaturaSelected == null){
                me.$vs.notify({
                text:'Seleccione una asignatura y una unidad',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return 
            }
            if(me.unidadSelected == "" || me.unidadSelected == undefined || me.unidadSelected == null){
                me.$vs.notify({
                text:'Seleccione una asignatura y una unidad',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return 
            }
            let filename = ""
            filename = me.asignaturaSelected.label + " - " +me.unidadSelected.label
            var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
            var EndHtml = "</body></html>";
            //complete html
            var html = HtmlHead +document.getElementById("MainHTML").innerHTML+EndHtml;
            //specify the type
            var blob = new Blob(['\ufeff', html], {
                type: 'application/msword'
            });
            // Specify link url
            var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
            // Specify file name
            filename = filename?filename+'.doc':'document.doc';
            // Create download link element
            var downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            if(navigator.msSaveOrOpenBlob ){
                navigator.msSaveOrOpenBlob(blob, filename);
            }else{
                // Create a link to the file
                downloadLink.href = url;
                // Setting the file name
                downloadLink.download = filename;
                //triggering the function
                downloadLink.click();
            }
            document.body.removeChild(downloadLink);
        },
        getAsignaturas(){
            let me = this;
            this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                me.asignaturas = res.data;
                me.$vs.loading.close()
            })
        },  
        filtrarPreguntas(){
            let me = this;
            me.preguntas.id = ''
            me.datoEnviar   = []
            me.preguntas    = []
            if( me.asignaturaSelected.id === undefined ){
                me.$vs.notify({
                    text:'Seleccione una asignatura antes de filtrar por Unidades',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            if( me.asignaturaSelected.id===113 || me.asignaturaSelected.id===114 || me.asignaturaSelected.id===115 ){
                me.tema_ambito = 'Ámbito'
            }else{
                me.tema_ambito = 'Tema'
            }
            if( me.unidadSelected.id === undefined ){
                return;
            }
            me.temas      = []
            me.datoEnviar = []
            me.preguntas  = []
            //me.pregunta.tema.id = ''
            this.$http.get(this.$server_url+'temasignunidadExport?asignatura='+me.asignaturaSelected.id+'&unidad='+me.unidadSelected.id)
            .then(res => {
                me.temas = res.data;
                me.getPreguntas()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        getPreguntas(){
            let me = this;
            me.preguntas = []
            me.datoEnviar = []
            if(me.bancoSelected == "" || me.bancoSelected == undefined || me.bancoSelected == null){
                me.$vs.notify({
                    text: "Seleccione los tipos de preguntas a mostrar",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            //enviar solo los ids
            me.temas.forEach(element => {
                var cal         = new Object();
                cal.id          = element.id
                cal.nombre_tema = element.nombre_tema
                me.datoEnviar.push(cal)
            });
            let formData = new FormData();
            me.$vs.loading()
            formData.append('temas',JSON.stringify(me.datoEnviar));
            this.$http.post(this.$server_url+'preguntasxUnidadytema',formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.length == 0){
                    me.$vs.notify({
                        text: "No hay datos que mostrar",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                //FILTRAR(PROLIPA - TODO)
                let filtro = me.bancoSelected.id
                let datos = res.data
                //PROLIPA
                if(filtro == 1){
                    me.preguntas = datos.filter(p => p.idusuario != me.usuario)
                }else{
                    me.preguntas = datos;
                }
            })
            .catch((error) =>{
                me.$vs.loading.close()
            })
        },
    }
}
</script>