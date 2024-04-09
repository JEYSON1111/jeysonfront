<template>
    <div class="mt-5">
        <p class="text-warning font-semibold">>> Asignar encuesta a la institución</p>
        <vs-divider color="warning">{{title}}</vs-divider>
        <div class="flex mb-4">
            <div class="w-1/2 p-2 bg-gray-400 text-center">
                <p>Busqueda de institucion</p>
                <vs-input icon="search" class="w-full mt-5" @keyup.enter="getInstitucion()"  v-model="filtroInstitucion"/>
            </div>
            <div class="w-1/2 p-2 bg-gray-500 text-center">
                <p>Encuestas</p>
                <v-select :options="arregloEncuestas" :reduce="arregloEncuestas => arregloEncuestas.id" label="descripcion" class="w-full mt-5" v-model="asignar.encuesta_id" />       
            </div>
        </div>
        <div class="w-full" v-if="instituciones.length > 0">
            <vs-divider color="primary">Seleccione un institucion</vs-divider>
            <vs-table max-items="5" search pagination :data="instituciones">
                <template slot="thead">
                    <vs-th sort-key="idInstitucion">#</vs-th>
                    <vs-th sort-key="nombreInstitucion">Institución (asesores)</vs-th>
                    <vs-th sort-key="nombre">Localidad</vs-th>
                    <vs-th sort-key="nombre">Periodo</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].idInstitucion ">
                            {{data[indextr].idInstitucion }}
                        </vs-td>
                        <vs-td :data="data[indextr].nombreInstitucion">
                            {{data[indextr].nombreInstitucion}}<br>
                            <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                            <small> <i style="color:red;">No existe asesor </i></small><br>
                            </div>
                            <div v-else>
                                <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
                            </div>
                            <small>{{data[indextr].fecha_registro}} </small><br>
                            <vs-chip v-if="tr.estadoInstitucion == 1" color="success">{{ tr.estado }}</vs-chip>
                            <vs-chip v-else>{{ tr.estado }}</vs-chip>
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
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Asignar institución" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success" type="filled" @click="selectInstitucion(tr)" icon-pack="feather" icon="icon-check"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </div>
                        </vs-td> 
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div class="w-full" align="center">
            <vs-button color="success" icon="save" type="gradient" @click="agregarEncuesta()">Agregar</vs-button>
        </div>
        <p class="text-warning font-semibold">>> Listado de asignaciones</p>
        <vs-divider></vs-divider>
        <EscuelasAsignadasVue @accion ="changeHandle" :arrayAsignacion="arrayAsignacion"/>
    </div>
</template>
<script>
import EscuelasAsignadasVue from './EscuelasAsignadas.vue';
import vSelect from 'vue-select'
export default{
    data(){
        return{
            usuario:[],
            filtroInstitucion:'',
            arregloEncuestas:[],
            instituciones:[],
            arrayAsignacion:[],
            asignar:{
                encuesta_id:''
            },
            datosInstitucion:{
                idInstitucion:'',
                nombreInstitucion:'',
                periodo_id:'',
            },
            title:'',
        }
    },
    watch:{
        filtroInstitucion(results){
            let me = this;
            if(me.filtroInstitucion.length > 5){
                setTimeout(function() {me.getInstitucion()}, 500);
            }else{
               me.limpiar()
            }
        },
    },  
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this
        me.getEncuestas()
        me.getAsignaciones()
    },
    methods:{
        getEncuestas() {
            let me = this;
            this.$http.get(this.$server_url+'encuesta?getEncuestas=yes')
                .then(function (res) {
                    let datos = res.data
                    me.arregloEncuestas = datos.filter(p => p.estado == 1)   
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getAsignaciones(){
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'encuesta?getEncuestaEscuela=yes')
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arrayAsignacion = res.data
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        agregarEncuesta(){
            let me = this;
            let host = location.protocol + '//' + location.hostname +':'+ location.port + '/encuesta/escuelas/'+ me.datosInstitucion.idInstitucion +'/'
            if(me.datosInstitucion.idInstitucion == null || me.datosInstitucion.idInstitucion == undefined || me.datosInstitucion.idInstitucion == ''){
                me.$vs.notify({
                text:'Debe seleccionar una institución por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.asignar.encuesta_id == null || me.asignar.encuesta_id == undefined || me.asignar.encuesta_id == '' || me.asignar.encuesta_id == 0){
                me.$vs.notify({
                text:'Debe seleccionar una encuesta por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            let formData = new FormData();
            formData.append('institucion_id',     me.datosInstitucion.idInstitucion);
            formData.append('periodo_id',         me.datosInstitucion.periodo_id);
            formData.append('encuesta_id',        me.asignar.encuesta_id);
            formData.append('link',               host)
            formData.append('user_created',       me.usuario.idusuario);  
            this.$http.post(this.$server_url+'guardarAsignacion', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 3){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return false;
                }
                // me.limpiar()
                me.getAsignaciones()
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close();
            })
        },
        selectInstitucion(tr){
            let me = this;
            me.datosInstitucion.idInstitucion       = tr.idInstitucion;
            me.datosInstitucion.nombreInstitucion   = tr.nombreInstitucion;
            me.title = 'Institución seleccionada: '+  me.datosInstitucion.nombreInstitucion
            me.datosInstitucion.periodo_id          = tr.periodo_id
            me.instituciones = []
        },
        getInstitucion() {
            let me = this;
            me.instituciones = [];
            if(me.filtroInstitucion.length < 5){
                me.$vs.notify({
                text:'Minimo 5 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'listaInsitucion?busqueda='+me.filtroInstitucion)
                .then(function (res) {
                    me.instituciones = res.data;
                    me.$vs.loading.close()
                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user',
                        time:5000,
                    })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        limpiar(){
            let me = this;
            me.datosInstitucion.idInstitucion       = '';
            me.datosInstitucion.nombreInstitucion   = '';
            me.title                                = '';
            me.datosInstitucion.periodo_id          = '';
        },
        //METODOS DE ESCUELAS ASIGNADAS
        changeHandle(e){
            let me = this;
            if(e.accion == 'eliminar') me.eliminarLink(e.id)
            if(e.accion == 'changeEstado') me.changeEstado(e.id,e.estado)
        },
        changeEstado(id,estado){
            let me = this;
            var estadoE = 0
            if(estado) estadoE = 1
            let formData = new FormData()
            formData.append('changeEstado','yes')
            formData.append('id',id)
            formData.append('estado',estadoE)
            me.$vs.loading()
            this.$http.post(this.$server_url+'encuesta',formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Se cambio de estado correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getAsignaciones()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            console.log(error)
            })

        },
        eliminarLink(id){
        let me = this
        let formData = new FormData()
        formData.append('eliminarEncuestaAsignada','yes')
        formData.append('id',id)
        me.$vs.loading()
        this.$http.post(this.$server_url+'encuesta',formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Se elimino correctamente la encuesta asignada',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getAsignaciones()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            console.log(error)
            })
        },
        //FIN METODOS ESCUELAS ASIGNADAS
    },
    components:{
        vSelect,
        EscuelasAsignadasVue,
    }
}
</script>