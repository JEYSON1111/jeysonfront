<template>
    <div>
        <vs-table search :data="arrayAsignacion" stripe pagination max-items="5">
                <template>
                <div slot="header" class="flex">
                    <p>Cantidad: {{arrayAsignacion.length}}</p>
                  <!-- <vs-button class="ml-4" v-if="tipoData == 'institucion'" color="rgb(62, 201, 214)" @click="popupAgregar = true;limpiar();" icon="add" type="filled">Generar Formulario</vs-button> -->
                </div>
                </template>
                <template slot="thead">
                <vs-th sort-key="nombreInstitucion">Datos</vs-th>
                <vs-th sort-key="nombreInstitucion">Enlace</vs-th>
                <vs-th sort-key="nombreInstitucion">Encuesta</vs-th>
                <vs-th sort-key="nombreInstitucion">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombreInstitucion">
                        <p class="font-bold">Institución:</p>
                        <span>{{ tr.nombreInstitucion }}</span><br>
                        <p class="font-bold">Período:</p>
                        <span>{{ tr.periodo }}</span><br>
                        <p class="font-bold">Editor:</p>
                        <span>{{ tr.editor }}</span><br>
                    </vs-td>
                    <vs-td :data="data[indextr].nombreInstitucion">
                        <p class="font-bold">Link:</p>
                        <span style="cursor:pointer;" @click="openEnlace(tr)" target class="text-primary">{{ tr.link }}</span><br>
                        <p class="font-bold">Estado:</p>
                        <vs-switch color="success" @click="changeEstado(tr)" v-model="tr.estado">
                        <span slot="on">Activo</span>
                        <span slot="off">Desactivado</span>
                        </vs-switch> 
                    </vs-td>
                    <vs-td>
                        <p class="font-bold">Nombre encuesta:</p>
                        <span>{{ tr.encuesta }}</span><br>
                        <p class="font-bold">Usuarios que ha realizado la encuesta:</p>
                        <span>{{ tr.contador }}</span><br>
                    </vs-td>
                    <vs-td>
                    <div class="flex"> 
                        <vx-tooltip style="display: inline-block;" text="Copiar link" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="success" @click="copiarLink(data[indextr])" type="line" icon-pack="feather" icon="icon-copy">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Ver estadisticas" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="warning" @click="verEstadisticas = true;total_encuestados=tr.contador;nombre_encuesta=tr.encuesta;encuestas_escuela_id = tr.id;encuesta_id=tr.encuesta_id;" type="line" icon-pack="feather" icon="icon-info">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Ver preguntas" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="dark" @click="verPreguntas(data[indextr])" type="line" icon-pack="feather" icon="icon-help-circle">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr])" type="line" icon-pack="feather" icon="icon-trash">
                            </vs-button>
                        </vx-tooltip>
                    </div>
                    </vs-td>
                </vs-tr>
                </template>
        </vs-table>
        <!--MODALES-->
        <!--MODAL PARA VER LOS RESULTADOS DE LA ENCUESTA-->
        <vs-popup class="holamundo" fullscreen  title="Resultados de la encuesta" :active.sync="verEstadisticas">
            <verEstadisticasVue
            v-if="verEstadisticas"
            :encuestas_escuela_id="encuestas_escuela_id"
            :encuesta_id="encuesta_id"
            :total_encuestados="total_encuestados"
            :nombre_encuesta = "nombre_encuesta"
            />
        </vs-popup>
        <!--MODAL PARA VER LAS PREGUNTAS DE LA ENCUESTA-->
        <vs-popup class="holamundo"  title="Preguntas de la encuesta" :active.sync="popupPreguntas">
            <vs-list v-for="(item,key) in arregloPreguntas" :key="key">
                <vs-list-item :title="key+1+'. '+item.pregunta"></vs-list-item>
            </vs-list>
        </vs-popup>
    </div>
</template>
<script>
import verEstadisticasVue from './verEstadisticas.vue'
export default{
    data(){
        return{
            arregloPreguntas:[],
            popupPreguntas:false,
            verEstadisticas:false,
            encuestas_escuela_id:0,
            encuesta_id:0,
            total_encuestados:0,
            nombre_encuesta:'',
        }
    },
    watch:{
        arrayAsignacion(results){
            let me = this;
            me.arrayAsignacion = results
        }
    },
    props:{
        arrayAsignacion:{
            type:Array,
            default:[],
        },
    },
    methods:{
        verPreguntas(tr){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'encuesta?getPreguntas=yes&encuesta_id='+tr.encuesta_id)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.arregloPreguntas = res.data    
                    me.popupPreguntas   = true
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                })
    
        },
        changeEstado(tr){
            let me = this
            var estadoE = 0
            if(tr.estado == 0 || tr.estado == false){
                estadoE = 1
            }
            let datos = {
                accion:'changeEstado',
                id:tr.id,
                estado:estadoE
            }
            me.$emit('accion',datos)
        },  
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar?',
                accept:this.eliminarLink
            })
        },
        eliminarLink(){
            let me = this;
            let datos = {
                accion:'eliminar',
                id:me.id
            }
            me.$emit('accion',datos)
        },
        openEnlace(tr){
            window.open(tr.link)
        },
         copiarLink(tr){
            let me = this;
            let ruta = tr.link
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                } else {
                    me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
        },
    },
    components:{
        verEstadisticasVue,
    },
}
</script>