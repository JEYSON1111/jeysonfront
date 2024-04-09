<template>
    <div>
        <div class="con-tab-ejemplo">
            <div v-if="areas.length > 0 ">
              <vs-button color="dark" v-if="permisoRoot" @click="limpiar();popupAddTema=true;"   type="filled">Crear Area</vs-button>
                <vs-table max-items="10" search pagination :data="areas">
                    <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ areas.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th>Nombre</vs-th>
                        <vs-th>Tipo de area</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th  style="width:100px;">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombrearea}}<br>
                                
                            </vs-td>
                            <vs-td>
                                {{data[indextr].nombretipoarea}}<br>
                            </vs-td>
                            <vs-td>
                                <vs-chip v-if="tr.estado == 1" color="success">Activo</vs-chip>
                                <vs-chip v-else color="danger">Inactivo</vs-chip>
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                    <div>
                                        <vx-tooltip style="display: inline-block;" text="Editar area" position="top" color="primary">
                                            <vs-button class="modal-default-button" size="small" color="success" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                    </div>
                                    <div>
                                        <vx-tooltip v-if="tr.estado == 1" style="display: inline-block;" text="Desactivar area" position="top" color="primary">
                                            <vs-button class="modal-default-button" size="small" color="danger" @click="openConfirm(data[indextr].idarea,0)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                        <vx-tooltip v-if="tr.estado == 0" style="display: inline-block;" text="activar area" position="top" color="primary">
                                            <vs-button class="modal-default-button" size="small" color="primary" @click="openConfirm(data[indextr].idarea,1)" type="filled" icon-pack="feather" icon="icon-check"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                    </div>
                                </div>
                            </vs-td> 
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe areas aun. </p>
            </div>
        </div>
        <!--PARA LOS MODALES -->
          <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Area" :active.sync="popupAddTema">
                <vs-input class="inputx mb-3 w-full" label="Nombre Area" v-model="area.nombrearea" />
                Tipo Area:
                <v-select :options="tipos" :reduce="tipos => tipos" label="nombretipoarea" class="w-full" v-model="area.tipo" />
                 <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarArea()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>
        <!-- Modal Editar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Area" :active.sync="popupEditArea">
                <vs-input class="inputx mb-3 w-full" label="Nombre Area" v-model="area.nombrearea" />
                Tipo Area:
                <v-select :options="tipos" :reduce="tipos => tipos" label="nombretipoarea" class="w-full" v-model="area.tipo" />
                 <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarArea()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import LibroRepository from '../../repositories/LibroRepository';
export default {
    data() {
        return{
            areas:[],
            tipos:[],
            activeConfirm:false,
            popupEditArea:false,
            update:false,
            id:0,
            idarea:0,
            popupAddTema:false,
            area:{
                nombrearea:'',
                tipo:''
            },
            estado:'',
            permisoRoot:false,
            usuario:[],
        }
    },
    components: {
       'v-select': vSelect,
                
    },
    methods:{
        obtenerAreas(){ 
             //para obtener el listado de las areas
            LibroRepository.getAreas().then(r => { this.areas = r.data.area });
             //para obtener el listado de los tipos 
            LibroRepository.getAreas().then(r => { this.tipos = r.data.tipoArea }); 
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
        //para eliminar la area
         eliminarArea(idarea) {
            let me = this;
            let formData = new FormData();
            formData.append('idarea',me.idarea);
            formData.append('estado',me.estado);
            me.$vs.loading()
            this.$http.post(this.$server_url+'area-eliminar', formData)
            .then(res => {
            me.obtenerAreas();
            me.$vs.loading.close()
            me.$vs.notify({
                text:'Area eliminado con exito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
        },
        //para abrir el popup de confimacion para eliminar
        openConfirm(idarea,estado){
        this.idarea = idarea;
        this.estado = estado
        this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmacion`,
            text: 'Estas seguro de cambiar de estado.',
            accept:this.eliminarArea
        })
        },
        //para guardar las areas
         guardarArea(){
            let me = this;
             //datos que se obtienen de los inputs
                if(me.area.nombrearea.trim() === ''){
                    this.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
            let formData = new FormData();
            if(me.update){
                formData.append('idarea',     me.id);
                formData.append('nombrearea', me.area.nombrearea);
                formData.append('idtipoarea', me.area.tipo.idtipoarea);
            }else{
                formData.append('nombrearea', me.area.nombrearea);
                formData.append('idtipoarea', me.area.tipo.idtipoarea);
            }
            this.$http.post(this.$server_url+'areas', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.obtenerAreas()
                    me.popupAddTema=false,
                    me.popupEditArea=false,
                    me.update = false;
                    limpiar()
                  
                })
                .catch(function (error) {})
        },
        //para editar los campos
        openModalEditar(data={}){
            let me = this;
            me.popupEditArea = true;
            //llenar la data en los campos
            me.id = data.idarea;
            me.area.nombrearea = data.nombrearea;
            me.area.tipo = {idtipoarea:data.tipoareas_idtipoarea, nombretipoarea:data.nombretipoarea};
        },
        //para limpiar los campos
        limpiar(){
           let me = this;
           me.area.nombrearea = "";
           me.area.tipo = "";
        },
    },
    mounted() {
        this.obtenerAreas()
    },
    created(){
        console.log("diseno2")
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getUserRoot()
    }
}
</script>