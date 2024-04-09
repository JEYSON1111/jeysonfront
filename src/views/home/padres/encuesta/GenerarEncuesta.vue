<template>
    <div>
        <div v-if="verSolicitud == true">
            <vs-button type="border" icon="reply" size="small" @click="verSolicitud = false;getForms();" text-color="#7367F0">Regresar al listado</vs-button>    
            <!-- <verSolicitudesVue :id = "formulario_id"/> -->
        </div>
        <vx-card
            v-else
            :title="title"
            title-color="success"
            subtitle="Una vez creado la encuesta podra asignar a las instituciones que desea">
             <div class="w-full p-2 bg-gray-400 text-center">
                <div class="flex">
                    <p class="font-medium">Cantidad encuestas: {{arregloEncuestas.length}}</p>
                </div>
                <vs-divider></vs-divider>
             </div>
            <vs-table search :data="arregloEncuestas" stripe pagination max-items="5">
                <template>
                <div slot="header" class="flex">
                  <vs-button class="ml-4" color="rgb(62, 201, 214)" @click="popupAgregar = true;limpiar();" icon="add" type="filled">Generar Encuesta</vs-button>
                </div>
                </template>
                <template slot="thead">
                <vs-th sort-key="nombreInstitucion">Encuesta</vs-th>
                <vs-th sort-key="nombreInstitucion">Estado</vs-th>
                <vs-th sort-key="nombreInstitucion">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].descripcion">
                        {{tr.descripcion}}
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Desactivado</vs-chip>
                    </vs-td>
                    <vs-td>
                    <div class="flex"> 
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="warning" @click="openEditar(data[indextr]);generar=false;formulario_id = tr.id;" type="line" icon-pack="feather" icon="icon-edit">
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
        </vx-card>
         <!--MODAL PARA AGREGAR-->
        <vs-popup classContent="popup-example" fullscreen  title="Generar Encuesta" :active.sync="popupAgregar">
            <vs-tabs :color="colorx">
            <vs-tab @click="colorx = 'success'" label="Información">
                <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Descripción</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-edit" icon-no-border v-model="formulario.descripcion" />
                </div>
                </div>
                <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Estado</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <ul class="flex">
                    <li>
                        <vs-radio v-model="formulario.estado" vs-name="radiosEstado2" vs-value="1">Activo</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-2" v-model="formulario.estado" vs-name="radiosEstado2" vs-value="0">Desactivado</vs-radio>
                    </li>
                    </ul> 
                </div>
                </div>
                <div class="vx-row">
                <div class="vx-col sm:w-2/3 w-full ml-auto">
                    <vs-button class="mr-3 mb-2" @click="guardarEncuesta()">Guardar</vs-button>
                    <vs-button color="warning" type="border" class="mb-2" @click="popupAgregar = false;">Cancelar</vs-button>
                </div>
                </div>
            </vs-tab>
            <vs-tab @click="colorx = 'danger'" label="Asignar preguntas">
                <div v-if = "formulario.id == 0" class="con-tab-ejemplo">
                    <small>Debe crear la encuesta para asignar preguntas para la encuesta</small>
                </div>
                <div v-else>
                    <EncuestaPreguntasVue
                    :encuesta_id="formulario.id"
                    />
                    <!-- <asesorSelectBookVue :formulario_id = "formulario_id" :formularioNombreInstitucion = "formularioNombreInstitucion" :formularioPeriodo="formularioPeriodo"/> -->
                </div>
            </vs-tab>
            </vs-tabs>
        </vs-popup>
    </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import EncuestaPreguntasVue from './EncuestaPreguntas.vue';
// import verSolicitudesVue from './components/verSolicitudes.vue';
// import asesorSelectBookVue from './components/asesorSelectBook.vue';
export default {
    data() {
        return{
            arregloEncuestas:[],
            usuario:[],
            id:0,
            popupAgregar:false,
            popupEditar:false,
            verSolicitud:false,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            formulario:{
              toDate:null,
              descripcion:'',
              institucion:'',
              periodo:'',
              estado:'1',
            },
            formulario_id:'',
            tipo:1,
            title:'',
            colorx:'success'
        }
    },
    components:{
        flatPickr,
        EncuestaPreguntasVue,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getEncuestas();
    },
    mounted(){
        let me = this;
        me.title = "Listado de encuestas"
    },
    methods:{
        getEncuestas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'encuesta?getEncuestas=yes')
                .then(function (res) {
                    me.$vs.loading.close();
                    me.arregloEncuestas = res.data    
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                })
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
        openEditar(tr){
          let me = this;
          me.formulario.id          = tr.id
          me.formulario.descripcion = tr.descripcion
          me.formulario.estado      = tr.estado
          me.popupAgregar           = true
        },
        guardarEncuesta(){
          let me = this;
          let formData = new FormData();
          me.$vs.loading()
          formData.append('id',               me.formulario.id)
          formData.append('user_created',     me.usuario.idusuario)
          formData.append('descripcion',      me.formulario.descripcion)
          formData.append('periodo_id',       localStorage.periodo_id)
          formData.append('estado',           me.formulario.estado)
          this.$http.post(this.$server_url+'encuesta', formData)
              .then(function (res) {
                  me.$vs.loading.close()
                  me.$vs.notify({
                      text: res.data.message,
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  me.getEncuestas()
                  if(me.formulario.id == 0){
                    console.log("hola")
                    me.popupAgregar   = true;
                    me.formulario.id  = res.data.datos.id
                  } 
                  else{
                    me.popupEditar  = false;
                    limpiar()
                  }
                  
              })
              .catch(function (error) {me.$vs.loading.close()})
        },
         openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar la encuesta?',
                accept:this.eliminarEncuesta
            })
        },
        eliminarEncuesta(){
        let me = this
        me.$vs.loading()
        this.$http.delete(this.$server_url+'encuesta/'+me.id)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Se elimino correctamente el formulario',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getEncuestas()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            console.log(error)
            })
        },
        limpiar(){
          let me = this;
          me.formulario.id          = 0
          me.formulario.descripcion = ""
          me.formulario.estado      = 1
        },
    }
}
</script>
