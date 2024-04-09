<template>
 <vx-card>
    <div>
      <b>Seleccione un libro para mostrar las planificaciones:</b>
      <v-select :options="arrayBooks" :reduce="arrayBooks => arrayBooks.asignatura_idasignatura" label="nombrelibro" class="w-full mt-2" @input="getPlanificacion()" v-model="bookSelect" />
    </div>
    <vs-table max-items="20" search pagination :data="lista">
        <template slot="header">
            <div class="vx-row">
                <div class="vx-col sm:w-full">
                    Cantidad: {{lista.length}}
                </div>
            </div>
        </template>
        <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="nombreasignatura" width="40%">Asignatura</vs-th>
            <vs-th sort-key="nombreplanificacion">Planificacion</vs-th>
            <vs-th sort-key="Estado_idEstado">Estado</vs-th>
            <vs-th sort-key="nombre" width="10%">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{indextr+1}}
                </vs-td>
                <vs-td :data="tr.nombreasignatura">
                    {{tr.nombreasignatura}}
                </vs-td>
                <vs-td :data="tr.nombreplanificacion">
                    {{tr.nombreplanificacion}}<br>
                    <small>{{tr.descripcionplanificacion}}</small> <br>
                    <i class="text-primary cursor-pointer" @click="verPlanificacion(tr.webplanificacion)"><u>{{tr.webplanificacion}}</u></i><br>
                    <p style="font-weight:bold;">Fecha create</p>
                    <small>{{tr.created_at}}</small>
                    <p style="font-weight:bold;">Usuario creador</p>
                    <span>{{tr.usuario}}</span>
                </vs-td>

                <vs-td>
                    <div v-if="tr.Estado_idEstado =='1'">
                    <vs-chip color="primary"><p>Activo</p></vs-chip>

                    </div>
                    <div v-else>
                          <vs-chip color="danger"><p>Inactivo</p></vs-chip>
                    </div>
                </vs-td>
                <vs-td>
                    <vx-tooltip style="display: inline-block;" text="Descargar" position="top" color="primary">
                        <vs-button type="border" size="small" color="success" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-download-cloud" @click="descargarPlanificacion(tr)"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                        <vs-button type="border" size="small"  style="display: inline-block;" class="p-2 ml-1" icon-pack="feather" icon="icon-edit" @click="editaContenido(tr)"></vs-button>
                    </vx-tooltip>
                      <vx-tooltip v-if="permisoRoot == true" style="display: inline-block;" text="Eliminar" position="top" color="danger">
                        <vs-button type="border" size="small" style="display: inline-block;" class="p-2 ml-1" icon-pack="feather" icon="icon-trash" color="danger" @click="confirmaEliminar(tr.idplanificacion)"></vs-button>
                    </vx-tooltip>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
  </vx-card>
</template>
<script>
import LibroRepository from '../../repositories/LibroRepository';
import vSelect from 'vue-select'
export default {
  components:{
    vSelect,
  },
    data() {
        return {
            lista:[],
            eliminarId:'',
            permisoRoot:false,
            usuario:[],
            arrayBooks:[],
            bookSelect:'',
        }
    },
    props:{
      libroSelecionado:{
        type:Number,
        default:0
      },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
      let me = this
      me.getBooks()
      if(me.libroSelecionado > 0){
        me.bookSelect = me.libroSelecionado
        this.getPlanificacion()
      }
      // this.getPlanificacion()
      this.getUserRoot()
    },
    methods: {
        descargarPlanificacion(item){
            let me = this
            let ruta = me.$data_url+'archivos/upload/planificacion/'+item.webplanificacion
            window.open(ruta,'_blank')
        },
         //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
                .then(function (res) {

                    if(res.data.status == '1'){
                        me.permisoRoot = true
                    }else{
                        me.permisoRoot = false
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');


                })
        },
        getPlanificacion() {
            let me = this;
            me.lista = []
            if(me.bookSelect == null || me.bookSelect == "" || me.bookSelect == undefined){
              me.$vs.notify({
              text:'Seleccione un libro por favor',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              me.$emit('changeBookSelect',0)
              return
            }
            me.$emit('changeBookSelect',me.bookSelect)
            me.$vs.loading();
            this.$http.get(this.$server_url + 'planificaciones?getPlanificacionesXIdAsignatura=yes&asignatura_idasignatura='+me.bookSelect)
                .then(res => {
                    me.lista = res.data;
                    me.$vs.loading.close();
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                })
        },
        getBooks() {  LibroRepository.getAllBooks().then(r => { this.arrayBooks = r.data }); },
        verPlanificacion(web) {
            console.log(web)
            window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/upload/planificacion/' + web, '_blank');
        },
        editaContenido(planificacion){
            var item = {}
            item.planificacion = planificacion
            item.menu = {
                plista: false,
                pnuevo: false,
                peditar: true
            }
            this.$emit('item',item)
        },
        confirmaEliminar(id) {
            let me = this;
            me.eliminarId = id;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar esta tarea?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminar
            })
        },
        eliminar() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('idplanificacion', me.eliminarId);
            formData.append('eliminarFisico','yes');
            formData.append('Estado_idEstado', 4);
            this.$http
                .post(this.$data_url+"api/eliminarPlanificacion",formData)
                .then(function (response) {
                    me.$vs.loading.close();
                    me.getPlanificacion()
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    if (error.response.status == 422) {
                        me.errors = error.response.data.errors;
                    }
                });
        },
    },
}
</script>
