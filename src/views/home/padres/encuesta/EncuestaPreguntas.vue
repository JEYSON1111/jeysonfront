<template>
    <div>
        <div v-if="statusEliminar" class="w-full"  align="center">
        
                <p>Esta seguro de eliminar la pregunta</p>
                <div class="flex justify-center">
                    <vs-button color="danger" @click="eliminarPregunta()" text-color="#fff">Si, Eliminar</vs-button> 
                    <vs-button color="success" text-color="#fff" class="ml-2" @click="statusEliminar = false">Cancelar</vs-button>   
                </div>
        </div>
        <div v-else>
            <div class="vx-col w-full mb-2" style="padding: 10px;">
                <vs-divider position="left" color="success">Crear preguntas</vs-divider>
                <div class="vx-row mb-2" id="editar">
                    <div class="vx-col w-full mb-1">
                        <vs-textarea class="mt-2" @keyup.enter="opcion.pregunta_id = 0;cargarOpcion()" label="Nombre Pregunta" v-model="opcion.opcion" height="60px"/>
                    </div>
                    <div class="vx-row w-full">
                        <div class="vx-col sm:w-1/2 w-full mb-1" align="left">
                            <vs-button color="success" type="flat" icon-pack="feather" icon="icon-plus" @click="opcion.pregunta_id = 0;cargarOpcion()">Agregar Pregunta</vs-button>
                            <!-- <vs-button color="primary" class="w-full" type="flat" icon-pack="feather" icon="icon-edit-1" @click="confirmEditarOpcion(opcion)">Editar</vs-button> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full">
                <vs-divider position="center" color="primary">Preguntas agregadas</vs-divider>
                <vs-chip v-if="arregloOpciones.length > 0">Cantidad preguntas: {{arregloOpciones.length}} </vs-chip><br><br>
                <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in arregloOpciones">
                    <div class="vx-col sm:w-4/5 w-full">
                        <vs-input class="w-full" v-model="item.pregunta"/>
                        <div class="vx-row mt-3" align="center">
                        <div class="vx-col sm:w-1/3 w-full">
                            <vs-button color="primary" type="line" icon-pack="feather" icon="icon-edit-1" size="small" @click="editarOpcion(item)">Editar</vs-button>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full">
                            <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="quitarOpcion(item)">Eliminar</vs-button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>  
    </div>
</template>
<script>
export default{
    data(){
        return{
            usuario:[],
            opcion:{
                opcion:'',
                pregunta_id:0,
                pregunta:'',
            },
            arregloOpciones:[],
            editarOpcionActiva:false,
            statusEliminar:false,
        }
    },
    props:{
        encuesta_id:{
            type:Number,
            default:0
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted(){
        let me = this;
        me.getPreguntas()
    },
    methods:{
        getPreguntas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'encuesta?getPreguntas=yes&encuesta_id='+me.encuesta_id)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.arregloOpciones = res.data    
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                })
        },
        editarOpcion(tr){
            let me = this;
            me.opcion.pregunta_id = tr.id
            me.opcion.pregunta    = tr.pregunta
            me.cargarOpcion()
        },
        quitarOpcion(tr){
            let me = this
            me.opcion.pregunta_id = tr.id
            me.statusEliminar     = true
        },
        eliminarPregunta(){
            let me = this;
            me.$vs.loading()
            const formData = new FormData();
            formData.append('eliminarPregunta','yes')
            formData.append('id',me.opcion.pregunta_id)
            this.$http.post(this.$server_url+'encuesta', formData)
            .then(res => {
                me.opcion.opcion        = ''
                me.opcion.pregunta_id   = 0
                me.$vs.notify({
                      text: "Se elimino correctamente la pregunta",
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                })
                me.getPreguntas()
                me.statusEliminar = false
            })
            .catch(function (error) {
                console.log(error);
            })
        },  
        cargarOpcion(){
            let me = this;
            if(me.opcion.pregunta_id > 0){
                if(me.opcion.pregunta.length < 5){
                    me.$vs.notify({
                        text: 'Mínimo 5 caracteres para agregar la pregunta',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
            }else{
                if(me.opcion.opcion.length < 5){
                    me.$vs.notify({
                        text: 'Mínimo 5 caracteres para agregar la pregunta',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }    
            }
           
            me.$vs.loading()
            const formData = new FormData();
            formData.append('guardarOpciones','yes')
            formData.append('id',               me.opcion.pregunta_id)
            formData.append('encuesta_id',      me.encuesta_id);
            if(me.opcion.pregunta_id > 0){
                formData.append('pregunta',     me.opcion.pregunta);
            }else{
                formData.append('pregunta',     me.opcion.opcion);
            }
            formData.append('user_created',     me.usuario.idusuario);
            this.$http.post(this.$server_url+'encuesta', formData)
            .then(res => {
                me.opcion.opcion        = ''
                me.opcion.pregunta_id   = 0
                me.$vs.notify({
                      text: res.data.message,
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                })
                me.getPreguntas()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
    }
}
</script>