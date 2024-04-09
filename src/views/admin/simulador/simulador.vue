<template>
    <div v-if="usuario.id_group == '1'">
        <vs-card>
            <vs-button color="primary"  @click="limpiar();popupAddSimulador=true;update = false;" style="margin:10px 0px 0px 20px;"  type="gradient" icon="library_add">Crear Simulador</vs-button>

            <div v-if="simuladores.length > 0 ">
                <br/>
            
                <vs-table max-items="10" search pagination :data="simuladores">
                    <template slot="thead">
                        
                        <vs-th>Asignatura</vs-th>
                        <vs-th>Nombre Simulador</vs-th>
                        <vs-th>Descripción</vs-th>
                        <vs-th>Enlaces</vs-th> 
                        <vs-th>Estado</vs-th> 
                        <vs-th >Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            
                            <vs-td>
                               
                                {{data[indextr].nombreasignatura}}<br>
                                
                            </vs-td>
                            <vs-td>
                           
                                {{data[indextr].nombre}}<br>
                            </vs-td>

                            <vs-td>
                             
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                             <vs-td>
                                <div>
                                    <p>Enlace Simulador:</p>
                                     <a :href="tr.link" target="_blank">{{tr.link}}</a><br>   
                                </div>

                                <template>
                                    <div v-if="tr.link_tutorial == '' || tr.link_tutorial == 'null' || tr.link_tutorial == null">
                                        
                                        
                                    </div>
                                    <div v-else>
                                        <p>Enlace Tutorial:</p>
                                        <a :href="tr.link_tutorial" target="_blank">{{tr.link_tutorial}}</a><br>   
                                    </div>
                                </template>
                          
                            </vs-td>
                            
                            <vs-td>
                                <div v-if="tr.estado == '1'">
                                    <p>Activo</p>
                                </div>
                                <div v-else>
                                    <p>Desactivado</p>    
                                </div>
                            </vs-td>
                            <vs-td>

                            <div style="display:flex;">
                                <vx-tooltip style="display: inline-block;" text="Editar simulador" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="warning" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                    </vx-tooltip> &nbsp;


                                <div v-if="tr.estado == '1'">
                                        <vx-tooltip style="display: inline-block;" text="Desactivar simulador" position="top" color="primary">
                                            <vs-button class="modal-default-button" size="small" color="danger" @click="openConfirm(data[indextr].simulador_id,0)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                        </vx-tooltip> &nbsp;  
                                </div>
                                <div v-else>
                                    <vx-tooltip style="display: inline-block;" text="Activar simulador" position="top" color="primary">
                                            <vs-button class="modal-default-button" size="small" color="success" @click="openConfirm(data[indextr].simulador_id,1)" type="filled" icon-pack="feather" icon="icon-check"> </vs-button>
                                    </vx-tooltip> &nbsp;     
                                </div>
                                
                            </div>
                              

                            </vs-td> 
                            
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>

            <div v-else style="margin:20px 0px 0px 25px;">
                <p> No existe Simuladores aun. </p>
            </div>

        </vs-card>

        <!--PARA LOS MODALES -->
          <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Simulador" :active.sync="popupAddSimulador">
               
                Asignatura:
        
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombreasignatura" class="w-full" v-model="simulador.asignatura_id" />
                <br/>
                <vs-input class="inputx mb-3 w-full" label="Nombre simulador" v-model="simulador.nombre" />
                <br/>
                <vs-textarea counter="300" style="width:100%;" label="Descripción" :counter-danger.sync="counterDanger" v-model="simulador.descripcion" />
                <vs-input class="inputx mb-3 w-full" label="Link" v-model="simulador.link" />
                <vs-input class="inputx mb-3 w-full" label="Tutorial" v-model="simulador.link_tutorial" />
                <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarSimulador()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>

       <!-- Modal Editar-->
        <div class="demo-alignment">

            <vs-popup classContent="popup-example" title="Editar Simulador" :active.sync="popupEditSimulador">
                Asignatura:
        
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombreasignatura" class="w-full" v-model="simulador.asignatura_id" />
                
                <vs-input class="inputx mb-3 w-full" label="Nombre Simulador" v-model="simulador.nombre" />
                <vs-textarea counter="300" style="width:100%;" label="Descripción" :counter-danger.sync="counterDanger" v-model="simulador.descripcion" />
                <vs-input class="inputx mb-3 w-full" label="Link" v-model="simulador.link" />
                <vs-input class="inputx mb-3 w-full" label="Tutorial" v-model="simulador.link_tutorial" />
                 <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarSimulador()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select'
export default {
    data(){
        return{
            id:0,
            counterDanger: false,
            simuladores:[],
            asignaturas:[],
            popupAddSimulador:false,
            simulador:{
                asignatura_id:'',
                nombre:'',
                descripcion:'',
                link:'',
                link_tutorial:'',
                estado:'',
            },
            popupEditSimulador:false,
            update:false,
            estado:'',
            usuario:[],
        }
    },

    components: {
        'v-select': vSelect,
                
     },

    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getSimuladores();
        me.getAsignaturas();
    },
    methods:{

        //para obtener el listado de las areas
        getSimuladores() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador')
                .then(function (res) {
                    me.simuladores = res.data.simulador;
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

          //para obtener el listado de las areas
        getAsignaturas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador')
                .then(function (res) {
                    me.asignaturas = res.data.asignaturas;
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        guardarSimulador(){
            let me = this;
          
                //datos que se obtienen de los inputs
                if(me.simulador.nombre.length < 4){
                    this.$vs.notify({
                        text:'El nombre debe tener minimo 4 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.descripcion.length < 4){
                    this.$vs.notify({
                        text:'La descripcion debe tener minimo 4 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.link.length < 8){
                    this.$vs.notify({
                        text:'El link debe tener minimo 4 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.nombre.length > 200){
                    this.$vs.notify({
                        text:'El nombre  debe tener maximo 200 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }

                if(me.simulador.link_tutorial !==null){
                    if(me.simulador.link_tutorial.length > 200){
                        this.$vs.notify({
                            text:'El link del tutorial  debe tener maximo 200 caracteres',
                            color:'warning',
                            iconPack: 'feather',
                            icon:'icon-check'})
                        return false;
                     }
                }
              

                  if(me.simulador.descripcion.length > 300){
                     this.$vs.notify({
                        text:'La descripcion debe tener maximo 300 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                         icon:'icon-check'})
                    return false;
                }

                 if(me.simulador.link.length > 200){
                     this.$vs.notify({
                        text:'El link debe tener maximo 200 caracteres',
                        color:'warning',
                        iconPack: 'feather',
                         icon:'icon-check'})
                    return false;
                }
                let formData = new FormData();

                if(me.update){
                    formData.append('simulador_id',      me.id);
                    formData.append('asignatura_id',     me.simulador.asignatura_id.idasignatura);
                    formData.append('nombre',            me.simulador.nombre);
                    formData.append('descripcion',       me.simulador.descripcion);
                    formData.append('link',              me.simulador.link);
                    formData.append('link_tutorial',     me.simulador.link_tutorial);
                    
                }else{
                    formData.append('asignatura_id',     me.simulador.asignatura_id.idasignatura);
                    formData.append('nombre',            me.simulador.nombre);
                    formData.append('descripcion',       me.simulador.descripcion);
                    formData.append('link',              me.simulador.link);
                    formData.append('link_tutorial',     me.simulador.link_tutorial);
                }
                

          
                me.$vs.loading();
                this.$http.post(this.$server_url+'simulador', formData)
                    .then(function (res) {
                        me.$vs.notify({
                            text: res.data,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.getSimuladores()
                        me.popupAddSimulador=false,
                        me.popupEditSimulador=false,
                        me.update = false;
                        limpiar()
                    
                    })
                .catch(function (error) {})
        },
       //para editar los campos
        openModalEditar(data={}){
            let me = this;
           
            me.popupEditSimulador = true;
            
            //llenar la data en los campos
             me.id = data.simulador_id;
             me.simulador.nombre = data.nombre;
             me.simulador.descripcion = data.descripcion;
             me.simulador.link = data.link;
             me.simulador.link_tutorial = data.link_tutorial;
             me.simulador.asignatura_id = {idasignatura:data.asignatura_id, nombreasignatura:data.nombreasignatura};
 
        },

        //para abrir el popup de confimacion para eliminar
        openConfirm(simulador_id,estado){
            let me = this;
            me.id = simulador_id;
            me.estado = estado;
            me.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Estás seguro de cambiar de estado?.',
                accept:me.cambiarEstado
            })
        },
        cambiarEstado(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador?cambiarEstado=yes&simulador_id='+me.id+'&estado='+me.estado)
                .then(function (res) {
                    me.getSimuladores();
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Estado cambiado con exito',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        limpiar(){
            let me = this;
            me.simulador.asignatura_id ='';
            me.simulador.nombre ='';
            me.simulador.descripcion ='';
            me.simulador.link ='';
            me.simulador.link_tutorial = '';
            me.simulador.estado ='';
        }
    }
}
</script>