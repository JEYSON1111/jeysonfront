<template>
    <div>
        <!--PARA LOS ASESORES AGENDA-->
        <div class="mt-5">
            <div v-if="nombreInstitucion" class="flex justify-center" style="flex-wrap:wrap;">
                <vs-chip color="primary">Institución seleccionada {{ nombreInstitucion }}</vs-chip>
                <vs-chip color="success" class="ml-2">Asesor: {{ asesorNombre }}</vs-chip>
            </div>
            <vs-row v-if="seleccionadoInsitucion ==  true" class="mt-3">
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
                    <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply" type="gradient"></vs-button>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="10">
                    <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false"  @click="AsignarInstituciones()" type="relief">
                        Asignar Institución
                    </vs-button>
                </vs-col>
            </vs-row>
            <vs-row v-if="seleccionadoInsitucion == false" >
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
                </vs-col>
            </vs-row>
            <!--BUSCAR INSTITUCION-->
            <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion ==  true" class="mt-5">
                <div style="width:80%;">
                    <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
                </div>
                <div style="width:20%;margin-left:15px;">
                    <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                </div>
            </div>
            <div v-if="instituciones.length >0">
                <vs-table stripe max-items="5" search pagination :data="instituciones">
                    <template slot="header">
                        <div class="vx-row">
                            <div class="vx-col w-full m-3">
                                Cantidad: {{instituciones.length}}
                            </div>
                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                        <vs-th sort-key="nombre">Localidad</vs-th>
                        <vs-th sort-key="nombre">Periodo</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].nombreInstitucion">
                                {{data[indextr].nombreInstitucion}}<br>
                                <b>Asesor:</b>
                                <p>{{ tr.asesor }}</p>
                            </vs-td>
                            <vs-td :data="data[indextr].nombreregion">
                                {{data[indextr].nombreregion}} <br>
                                <small>{{data[indextr].ciudad}}</small>
                            </vs-td>
                            <vs-td :data="data[indextr].periodo">
                                {{data[indextr].periodo}} <br>
                                <small v-if="tr.statusPeriodo == 1" class="text-success font-bold">{{tr.estadoPeriodo}}</small>
                                <small v-else>{{tr.estadoPeriodo}}</small>
                            </vs-td>
                            <vs-td>
                                <div class="flex">
                                    <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr)">
                                        Asignar
                                    </vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
            <br />
            <div v-if="seleccionadoInsitucion == false">
                <div style="display: flex;">
                    <div class="ml-1">
                        <ul style="display:flex;">
                            <li>
                            <vs-radio color="primary" v-model="tipoCapacitacion" vs-name="radiosTipo" vs-value="0">Presencial</vs-radio>
                            </li>
                            <li class="ml-3">
                            <vs-radio color="success" v-model="tipoCapacitacion" vs-name="radiosTipo" vs-value="1">Virtual</vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>
                <br/>
                <span class="mt-5">Seleccione capacitador:</span>
                <v-select multiple :options="arregloCapacitadores"  :reduce="arregloCapacitadores => arregloCapacitadores" label="capacitador"  class="w-full mt-2" v-model="capacitadorSelect" />
                <span class="mt-5">Seleccione primero el tema luego la fecha por favor:</span>
                <v-select  :options="arregloTemas"  :reduce="arregloTemas => arregloTemas" label="tema"  class="w-full mt-2" v-model="tema" />
                <br />
                <div class="vx-row mb-3">
                    <div class="vx-col sm:w-2/2 w-full">
                        <small class="date-label">Fecha Capacitacion*</small>  
                        <datepicker class="w-full" @input="validar();formatoFechas();" name="end-date" v-model="endDate"></datepicker>                 
                    </div>
                </div>
                <div class="vx-row mb-3">
                    <div class="vx-col sm:w-1/2 w-full">
                        <small class="date-label">Hora inicio *</small>
                        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_inicio" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <small class="date-label">Hora fin *</small>
                        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_fin" />
                    </div>
                </div>
            </div>
            <div>
                <vs-divider>Capacitaciones planificadas para ese día</vs-divider>
                <div  v-if="encontrarCapacitaciones.length > 0">
                     <vs-table max-items="3" search pagination :data="encontrarCapacitaciones">
                        <template slot="header">
                            Cantidad: <span style="font-weight: bold;"> {{encontrarCapacitaciones.length}}</span>
                        </template>
                        <template slot="thead">
                            <vs-th>Tema</vs-th>
                            <vs-th>Institución</vs-th>
                            <vs-th>Hora</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{ tr.tema }}<br>
                                    Capacitador:
                                    <span>{{data[indextr].capacitador}}</span> <br>
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.estado_institucion_temporal == '1'">
                                        {{ tr.nombre_institucion_temporal }}<br>
                                        {{ tr.ciudad_temporal }}<br>
                                        Asesor:
                                        <span>{{ tr.vendedor }}</span>
                                    </div>
                                    <div v-else>
                                        {{ tr.nombreInstitucion }}<br>
                                        {{ tr.ciudad }}<br>
                                        Asesor:
                                        <span>{{ tr.vendedor }}</span>
                                    </div>  
                                </vs-td>
                            
                                <vs-td>
                                Hora inicio:
                                <span>{{tr.hora_inicio}}</span> <br>
                                Hora Fin:
                                <span>{{tr.hora_fin}}</span>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-else>
                    <p>
                        No hay capacitaciones para ese dia
                    </p>
                </div>                    
            </div>
            <vs-row class="mt-3">
                <vs-col vs-type="flex" vs-justify="right" vs-align="right" vs-w="12">
                    <vs-button @click="addEvent()" type="relief">Guardar</vs-button>
                </vs-col>
            </vs-row>
            <br><br><br><br><br><br><br><br><br><br>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
export default{
    data(){
        return{
            id:0,
            seleccionadoInsitucion:false,
            instituciones:[],
            encontrarCapacitaciones:[],
            arregloTemas:[],
            tema:'',
            tipoCapacitacion:'0',
            asesorSelect:'',
            asesorNombre:'',
            capacitadorSelect:[],
            hora_inicio: '',
            hora_fin: '',
            configdateTimePicker: {
                enableTime: true,
                enableSeconds: false,
                noCalendar: true
            },
            error:false,
            startDate_send:null,
            startDate:null,
            endDate_send:null,
            endDate:null,
            institucion_id:0,
            institucion_id_temporal:'',
            periodo_id_temporal:'',
            nombreInstitucion:'',
            busquedaInstitucion:'',
            estado_institucion_temporal:0,
        }
    },
    components:{
        vSelect,
        Datepicker,
        flatPickr,
    },
    props:{
        periodoSelect:{
            type:Object,
            default:{}
        },
        lista_asesores:{
            type:Array,
            default:[],
        },
        arregloCapacitadores:{
            type:Array,
            default:[],
        },
    },
    mounted(){
        let me = this;
        me.getTemas()
    },  
    methods:{
        getTemas() {
            let me = this;
            this.$http.get(this.$server_url + 'temasCapacitacion')
                .then(function (res) {
                    me.arregloTemas = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        AsignarInstituciones(){
            let me = this
            me.asesorSelect = ""
            me.asesorNombre = ""
            me.seleccionadoInsitucion = true;
        },
        asginarInstitucion(tr) {
            let me = this;
            me.institucion_id               = tr.idInstitucion
            me.nombreInstitucion            = tr.nombreInstitucion
            me.asesorSelect                 = tr.asesor_id
            me.asesorNombre                 = tr.asesor
            me.estado_institucion_temporal  = 0;
            me.seleccionadoInsitucion       = false;
            me.instituciones                = []
        },
        //capacitaciones de una fecha
        capacitacionesToday(fecha){
            let me = this;
             this.$http.get(this.$server_url + 'temasCapacitacion?encontrarCapacitaciones=yes&fecha=' + fecha)
                .then(function (res) {
                    me.encontrarCapacitaciones = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getInstitucion() {
            let me = this;
            me.instituciones = [];
            if (me.busquedaInstitucion.length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading()
            var url = this.$server_url +'listaInsitucion?&busqueda='+me.busquedaInstitucion
            this.$http.get(url)
            // this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula)
                .then(function (res) {
                    // me.tmpInstituciones = res.data;
                    me.instituciones = res.data;
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user',
                            time: 8000
                        })
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        addEvent() {
            let me = this;
            if(me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined){
                me.$vs.notify({ text: 'Debe seleccionar un asesor por favor.', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false
            }
            if(me.capacitadorSelect.length == 0){
                me.$vs.notify({ text: 'Debe seleccionar un capacitador por favor.', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false
            }
            if (this.institucion_id <=0 || me.institucion_id == "") {
                me.$vs.notify({ text: 'Seleccione una institución por favor', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false;
            }
            if (this.endDate_send == '' || this.hora_inicio == '' || this.hora_fin == '' || this.tema == '' || this.tema == null || this.tema == undefined) {
                me.$vs.notify({ text: 'Complete los campos por favor', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false;
            }
            //ENVIAR CAPACITADORES
            var sendcapacitadores = ""
            if(me.capacitadorSelect.length  > 0){
                const LlenarCapacitadores   = me.capacitadorSelect.map(p => p.capacitador)
                sendcapacitadores           = LlenarCapacitadores.join(',')
            }
            const obj = {
                id_seminario:                '0',
                'capacitacion':             "yes",
                idusuario:                  this.asesorSelect,
                id:                         this.id,
                nombre:                     this.tema.tema,
                title:                      this.tema.tema,
                startDate:                  this.endDate_send,
                endDate:                    this.endDate_send,
                fecha_inicio:               this.endDate_send,
                fecha_fin:                  this.endDate_send,
                classes:                    'event-success',
                label:                      'Baja',
                // observacion:             this.observacion,
                tema_id:                    this.tema.id,
                'capacitadores':            JSON.stringify(me.capacitadorSelect),
                'capacitador':              sendcapacitadores,
                hora_inicio:                this.hora_inicio.substring(0, 5),
                hora_fin:                   this.hora_fin.substring(0, 5),
                institucion_id:             this.institucion_id,
                institucion_id_temporal:    this.institucion_id_temporal,
                estado_institucion_temporal:this.estado_institucion_temporal,
                periodo_id_temporal:        this.periodo_id_temporal,
                nombreInstitucion:          this.nombreInstitucion,
                tipo:                       this.tipoCapacitacion,
                estado_capacitacion:        1,
                periodo_id:                 this.periodoSelect.idperiodoescolar
            }
            me.$vs.loading()
            this.$http.post(this.$server_url+'guardar_seminario', obj)
            .then(res => {
            me.$vs.loading.close()
            if(res.data.status == 0){
                me.$vs.notify({
                text:res.data.message,
                color:'warning',
                iconPack: 'feather',
                time:5000,
                icon:'icon-check'})
                return
            }
            me.$emit('recharge',true)
            me.$vs.notify({
                text:'Se guardo correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch((e)=>{
                me.$vs.loading.close()
            })
            
        },
        validar() {
            let me = this
            me.encontrarCapacitaciones = []
            if (this.arregloTemas == '' || this.arregloTemas == null || this.arregloTemas == undefined) {
                this.$vs.notify({
                    text: 'Debe seleccionar un tema por favor.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.endDate = ""
                return
            }
            let fecha = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
            this.$http.get(this.$server_url + 'temasCapacitacion?validarPorFecha=yes&fecha=' + fecha + '&tema_id=' + this.tema.id)
                .then(function (res) {
                    me.longitudCapacitaciones = res.data.length
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
            me.capacitacionesToday(fecha)
        },
        formatoFechas() {
            this.error = false
            this.startDate_send = moment(this.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            this.endDate_send = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        },
        regresar() {
            let me = this;
            me.seleccionadoInsitucion = false;
            me.instituciones = []
        },
    }
}
</script>