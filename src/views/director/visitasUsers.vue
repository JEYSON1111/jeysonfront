<template>
    <div class="mt-2">
        <vs-list-header color="success" icon="groups" title="Filtro de visitas de docentes"></vs-list-header>
        <div class="flex" style="position: relative;top:15px">
            <ul class="leftx">
                <li v-for="(tr,index) in anios" :key="index">
                    <vs-radio v-model="anioSelect" @input="getEstastica()" vs-name="radios1" :vs-value="tr.anio">{{ tr.anio }}</vs-radio>
                </li>
            </ul>
            <vs-dropdown vs-custom-content vs-trigger-click  class="ml-5">
                <vs-button type="relief" icon="event" color="warning"  class="a-icon" >
                    Seleccione el mes a filtrar
                    <vs-icon style="position: relative;top: 2px;" icon="expand_more"></vs-icon>
                </vs-button>
                <vs-dropdown-menu class="loginx">
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='enero';getMonthStartEnd(anioSelect,1)" >
                        <span class="feather icon icon-calendar" ></span> Enero
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='febrero';getMonthStartEnd(anioSelect,2)">
                        <span class="feather icon icon-calendar" ></span> Febrero
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='marzo';getMonthStartEnd(anioSelect,3)">
                        <span class="feather icon icon-calendar" ></span> Marzo
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='abril';getMonthStartEnd(anioSelect,4)">
                        <span class="feather icon icon-calendar" ></span> Abril
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='mayo';getMonthStartEnd(anioSelect,5)">
                        <span class="feather icon icon-calendar" ></span> Mayo
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='junio';getMonthStartEnd(anioSelect,6)">
                        <span class="feather icon icon-calendar" ></span> Junio
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='julio';getMonthStartEnd(anioSelect,7)">
                        <span class="feather icon icon-calendar" ></span> Julio
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='agosto';getMonthStartEnd(anioSelect,8)">
                        <span class="feather icon icon-calendar" ></span> Agosto
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='septiembre';getMonthStartEnd(anioSelect,9)">
                        <span class="feather icon icon-calendar" ></span> Septiembre
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='octubre';getMonthStartEnd(anioSelect,10)">
                        <span class="feather icon icon-calendar" ></span> Octubre
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='noviembre';getMonthStartEnd(anioSelect,11)">
                        <span class="feather icon icon-calendar" ></span> Noviembre
                    </vs-dropdown-item>
                    <vs-dropdown-item  style="width:200px" @click="mesDescripcion='diciembre';getMonthStartEnd(anioSelect,12)">
                        <span class="feather icon icon-calendar" ></span> Diciembre
                    </vs-dropdown-item>
                </vs-dropdown-menu>
            </vs-dropdown>
        </div>
        <!--Tabla-->
        <br>
        <vs-divider color="success" class="mt-5">VISITAS DEL MES {{ mesDescripcion.toUpperCase() }} DEL AÑO {{ anioseleccionado }}</vs-divider>
        <vs-table max-items="10" stripe search pagination :data="arregloVisitas">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloVisitas.length }}</b></vs-chip>
                <span @click="exportToExcel()" class="cursor-pointer">
                    <vs-chip transparent class="py-3 ml-2" style="font-weight: bold;" color="warning"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span> </vs-chip>
                </span>
            </template>
            <template slot="thead">
                <vs-th>Datos</vs-th>
                <vs-th>Visitas</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        Nombres:
                        <br>        
                        <span style="font-weight:600;  " >
                        {{ tr.usuario }} {{ tr.apellidos }}<br>
                        </span>
                        Cédula:
                        <br>  
                        <span style="font-weight:600;  " >
                        {{ tr.cedula }}<br>
                        </span>
                        
                    </vs-td>
                    <vs-td>
                       <p>Ingreso al sistema:       <span class="font-bold">{{ tr.contador15 }}</span></p>
                       <p>Libros:                   <span class="font-bold">{{ tr.contador1 }}</span></p>
                       <p>Unidades:                 <span class="font-bold">{{ tr.contador2 }}</span></p>
                       <p>Cuadernos:                <span class="font-bold">{{ tr.contador3 }}</span></p>
                       <p>Teletarea:                <span class="font-bold">{{ tr.contador4 }}</span></p>
                       <p>Proyectos:                <span class="font-bold">{{ tr.contador5 }}</span></p>
                       <p>Adaptaciones curriculares:<span class="font-bold">{{ tr.contador6 }}</span></p>
                       <p>Propuestas metodólogicas: <span class="font-bold">{{ tr.contador7 }}</span></p>
                       <p>Juegos:                   <span class="font-bold">{{ tr.contador8 }}</span></p>
                       <p>Material:                 <span class="font-bold">{{ tr.contador9 }}</span></p>
                       <p>Artículos:                <span class="font-bold">{{ tr.contador10 }}</span></p>
                       <p>Tareas:                   <span class="font-bold">{{ tr.contador11 }}</span></p>
                       <p>Pdf guia:                 <span class="font-bold">{{ tr.contador12 }}</span></p>
                       <p>Pdf sin guia:             <span class="font-bold">{{ tr.contador13 }}</span></p>
                       <p>Guia didáctica:           <span class="font-bold">{{ tr.contador14 }}</span></p>
                       <p>Planificación:            <span class="font-bold">{{ tr.contador16 }}</span></p>
                       <p>Documentos Minesterial:   <span class="font-bold">{{ tr.contador17 }}</span></p>
                       <p>Videos:                   <span class="font-bold">{{ tr.contador18 }}</span></p>
                       <p>Actividades:              <span class="font-bold">{{ tr.contador19 }}</span></p>
                       <p>Animaciones:              <span class="font-bold">{{ tr.contador20 }}</span></p>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table> 
    </div>
</template>
<script>
import moment from 'moment'
export default{
    data(){
        return{
            institucion:{},
            arregloVisitas:[],
            anios:[],
            anioSelect:'',
            anioseleccionado:'',
            yactual:null,
            menosUno:null,
            fromDate:null,
            toDate:null,
            mesDescripcion:'',
            //variables para el export a excel
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables de exportar excel
        }
    },
    created(){
        moment.locale('es');
        let me = this;
        me.institucion = JSON.parse(localStorage.getItem("institucion"))
    },
    mounted(){
        let me = this
        // me.getVisitas()
        me.yactual = moment().format('YYYY');
        me.mactual = moment().format('M');
        me.mesDescripcion = moment().format('MMMM');
        //restar Anios
        me.menosUno = me.yactual - 1;
        me.anios.push({anio:me.yactual});
        me.anios.push({anio:me.menosUno}); 
        me.anioSelect = this.anios[0].anio
        me.getMonthStartEnd(me.yactual,me.mactual)
    },
    methods:{
        getMonthStartEnd(year, month) {
            let me = this
            const startDate = new Date(year, parseInt(month-1), 1);
            const endDate = new Date(year, parseInt(month-1) + 1, 0);
            me.fromDate       = moment(startDate).format('YYYY-MM-DD')
            me.toDate         = moment(endDate).format('YYYY-MM-DD')
            me.getVisitas()
        // return { start: startDate, end: endDate };
        },
        // const { start, end } = getMonthStartEnd(2023, 11);
        getVisitas(){
            let me = this;
            me.arregloVisitas = []
            me.anioseleccionado = me.anioSelect
            me.$vs.loading()
            this.$http.get(this.$server_url + 'usuarioVisitasAll?institucion_id=' + me.institucion.institucion_id+'&fromDate='+me.fromDate+'&toDate='+me.toDate)
                .then(function (response) {
                    me.$vs.loading.close()
                    let datos = response.data
                    datos.forEach((element,index) => {
                            var cal = new Object();
                            cal.idusuario = element.idusuario
                            cal.usuario = element.usuario
                            cal.cedula = element.cedula
                            cal.email = element.email
                            let getRecursos = element.visitas
                            // cal.recursos = new Object();
                            let contador1   = getRecursos.filter(p => p.recurso == 1)           //:libro,
                            let contador2   = getRecursos.filter(p => p.recurso == 2)           //:unidades,
                            let contador3   = getRecursos.filter(p => p.recurso == 3)           //:cuadernos,
                            let contador4   = getRecursos.filter(p => p.recurso == 4)           //:teletarea,
                            let contador5   = getRecursos.filter(p => p.recurso == 5)           //:proyectos, 
                            let contador6   = getRecursos.filter(p => p.recurso == 6)           //:adaptaciones,
                            let contador7   = getRecursos.filter(p => p.recurso == 7)           //:propuestas,
                            let contador8   = getRecursos.filter(p => p.recurso == 8)           //:juegos,
                            let contador9   = getRecursos.filter(p => p.recurso == 9)           //:material,
                            let contador10  = getRecursos.filter(p => p.recurso == 10)          //:articulos,
                            let contador11  = getRecursos.filter(p => p.recurso == 11)          //:tareas,
                            let contador12  = getRecursos.filter(p => p.recurso == 12)          //:pdf guia,
                            let contador13  = getRecursos.filter(p => p.recurso == 13)          //:pdf sin guia,
                            let contador14  = getRecursos.filter(p => p.recurso == 14)          //:guia didactica,
                            let contador15  = getRecursos.filter(p => p.recurso == 15)          //:Ingreso al sistema,
                            let contador16  = getRecursos.filter(p => p.recurso == 16)         //:Planificacion,
                            let contador17  = getRecursos.filter(p => p.recurso == 17)         //:Documentos Minesterial,
                            let contador18  = getRecursos.filter(p => p.recurso == 18)         //:videos tema,
                            let contador19  = getRecursos.filter(p => p.recurso == 19)         //:actividades,
                            let contador20  = getRecursos.filter(p => p.recurso == 20)         //:animaciones
                            for (let index = 1; index <= 20; index++) {
                                try {
                                    eval("cal.contador" + index + "=" + "contador"+index+".length");
                                } catch (error) {
                                    eval("cal.contador" + index + "=" + 0);
                                }
                                
                            }
                        me.arregloVisitas.push(cal)
                    });
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
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
            let me = this;
            let headerTitle = [
                'Nombres',
                'Cédula',
                'Ingreso al sistema',
                'libro',
                'unidades',
                'cuadernos',
                'teletarea',
                'proyectos',
                'adaptaciones curriculares',
                'propuestas metodológicas',
                'juegos',
                'material',
                'articulos',
                'tareas',
                'pdf guia',
                'pdf sin guia',
                'guia didactica',
                'Planificación',
                'Documentos Minesteriales',
                'videos',
                'actividades',
                'animaciones'
            ];
            let headerVal = [
                'usuario',
                'cedula',
                'contador15',
                'contador1',
                'contador2',
                'contador3',
                'contador4',
                'contador5',
                'contador6',
                'contador7',
                'contador8',
                'contador9',
                'contador10',
                'contador11',
                'contador12',
                'contador13',
                'contador14',
                'contador16',
                'contador17',
                'contador18',
                'contador19',
                'contador20',
            ];  
            let codigoSelectedMayus = this.arregloVisitas
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            let reporte = 'Reporte visitas '+me.mesDescripcion+'-'+me.anioseleccionado+'-'+me.institucion.nombreInstitucion
            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: reporte,
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
    }
}
</script>
<style scoped>

</style>