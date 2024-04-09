<template>
    <div>
        <div class="flex">
            <vs-button color="primary" size="small" @click="regresar()" icon="reply" type="border"></vs-button>
            <vs-chip color="primary" class="ml-2">{{tipoDescripcion}}</vs-chip>
        </div>
        <br><br>
        <vs-divider></vs-divider>
        <p><b>Nombre:</b> {{datoU.nombres}} {{datoU.apellidos}} </p>
        <p><b>Institución:</b> {{datoU.nombreInstitucion}} </p>
        <p><b>Email:</b> {{datoU.email}} </p>
        <p><b>Cédula:</b> {{datoU.cedula}} </p>
        <vs-table max-items="30" search pagination :data="listaVisitas">
            <template slot="header">
                Cantidad: <span class="font-bold">{{listaVisitas.length}}</span> 
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
                    <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
                    <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3">
                    <vs-button radius @click="getVisitas()" color="success" type="gradient" icon="search"></vs-button>
                    <vs-dropdown vs-custom-content vs-trigger-click  class="ml-3">
                        <vs-button type="relief"  class="a-icon" >
                            Filtro
                            <vs-icon class="" icon="expand_more"></vs-icon>
                        </vs-button>
                        <vs-dropdown-menu class="loginx">
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=15;tipoDescripcion='Ingreso al sistema'">
                                <span class="feather icon icon-crop"></span> Ingreso al sistema
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="getVisitas();tipo=1;tipoDescripcion='Libros'">
                                <span class="feather icon icon-edit"></span> Libros
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=2;tipoDescripcion='Unidades'">
                                <span class="feather icon icon-gift"></span> Unidades
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="getVisitas();tipo=3;tipoDescripcion='Cuadernos'">
                                <span class="feather icon icon-users"></span> Cuaderno
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="getVisitas();tipo=4;tipoDescripcion='Teletareas'">
                                <span class="feather icon icon-user"></span> Teletarea
                            </vs-dropdown-item>
                            <vs-dropdown-item style="width:200px" @click="getVisitas();tipo=5;tipoDescripcion='Proyectos'">
                                <span class="feather icon icon-filter"></span> Proyectos
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=6;tipoDescripcion='Adaptaciones'">
                                <span class="feather icon icon-arrow-left-circle"></span> Adaptaciones
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=7;tipoDescripcion='Propuestas'">
                                <span class="feather icon icon-arrow-left-circle"></span> Propuestas
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=8;tipoDescripcion='Juegos'">
                                <span class="feather icon icon-arrow-left-circle"></span> Juegos
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=9;tipoDescripcion='Material'">
                                <span class="feather icon icon-arrow-left-circle"></span> Material
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=10;tipoDescripcion='Articulos'">
                                <span class="feather icon icon-arrow-left-circle"></span> Articulos
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=11;tipoDescripcion='Tareas'">
                                <span class="feather icon icon-arrow-left-circle"></span> Tareas
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=12;tipoDescripcion='Pdf guia'">
                                <span class="feather icon icon-arrow-left-circle"></span> Pdf guia
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=13;tipoDescripcion='Pdf sin guia'">
                                <span class="feather icon icon-arrow-left-circle"></span> Pdf sin guia
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=14;tipoDescripcion='Guias didacticas'">
                                <span class="feather icon icon-arrow-left-circle"></span> Guia didactica
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=17;tipoDescripcion='Documentos minesteriales'">
                                <span class="feather icon icon-arrow-left-circle"></span> Documento minesterial
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=18;tipoDescripcion='Videos'">
                                <span class="feather icon icon-arrow-left-circle"></span> Videos
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=19;tipoDescripcion='Actividades'">
                                <span class="feather icon icon-arrow-left-circle"></span> Actividades
                            </vs-dropdown-item>
                            <vs-dropdown-item  style="width:200px" @click="getVisitas();tipo=20;tipoDescripcion='Animaciones'">
                                <span class="feather icon icon-arrow-left-circle"></span> Animaciones
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-col>
            </template>
            <template slot="thead">
                <vs-th v-if="tipo!=15" sort-key="nombreInstitucion">Información</vs-th>
                <vs-th sort-key="nombreInstitucion">Institucion</vs-th>
                <vs-th sort-key="nombres">Periodo</vs-th>
                <vs-th sort-key="nombreInstitucion">Tipo</vs-th>
                <vs-th sort-key="nombres">Fecha</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td v-if="tipo!=15">
                        Asignatura:
                        <br>  
                        <span style="font-weight:600;  " >
                        {{ tr.nombreasignatura }}<br>
                        </span>
                        <!-- Clave:
                        <br>  
                        <span style="font-weight:600;  " >
                        {{ tr.cedula }}<br>
                        </span> -->
                    </vs-td>
                    <vs-td>
                        {{data[indextr].nombreInstitucion}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].periodo}}
                    </vs-td>
                    <vs-td>
                        <vs-chip color="primary">{{tipoDescripcion}}</vs-chip>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].created_at}}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import moment from 'moment'
import 'flatpickr/dist/flatpickr.css';
export default{
    props:{
        datoU:{
            type:Array,
            default:[],
        }
    },
    components:{
        flatPickr,
        vSelect
    },  
    data(){
        return{
            usuario:[],
            listaVisitas:[],
            fromDate:null,
            toDate:null,
            tipo:15,
            tipoDescripcion:'Visitas de ingreso al sistema',
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
        }
    },
    created(){
        let me = this;
        me.usuario  = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        const date = new Date()
        const primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        me.fromDate = primerDia
        me.toDate = ultimoDia
        me.getVisitas()
    },
    methods:{
        regresar(){
            this.$emit('escuchar',0)
        },
        getVisitas(){
            let me = this;
            me.listaVisitas = [];
            const from = moment(me.fromDate).format('YYYY-MM-DD')
            const to = moment(me.toDate).format('YYYY-MM-DD')
               if (me.fromDate == null) {
                me.$vs.notify({
                text: 'Debe escoger una fecha inicio',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
                })
                return false
            }
            if (me.toDate == null) {
                me.$vs.notify({
                text: 'Debe escoger una fecha final',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
                })
                return false
            }
            if (me.fromDate > me.toDate) {
                me.$vs.notify({
                text: 'La fecha inicio no puede mayor que la fecha final',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
                })
                return false
            }
            this.$http.get(this.$server_url+'usuarioVisitas?idusuario='+me.datoU.idusuario+'&fromDate='+from+'&toDate='+to)
                .then(function (res) {
                    let datos = res.data 
                    me.listaVisitas = datos.filter(p => p.recurso == me.tipo);
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getHistorico(){
        let me = this
        this.$http.get(this.$server_url+`historicoActividades?tipo=`+me.tipo).then(res => {
            me.arregloHistorico = res.data;
            me.tmparregloHistorico  = res.data
            })
            .catch(function (error) {
            console.log(error)
            })
        },
    },
}
</script>