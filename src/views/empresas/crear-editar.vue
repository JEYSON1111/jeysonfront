<template>
<div class="vx-col sm:w-1/1 w-full">
    <div class="vx-row">
        <div class="vx-col w-full">
            <div>Nombre</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.nombre" placeholder="Nombre de la empresa" />
        </div>
        <div class="vx-col w-full">
            <div>Descripción corta</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.descripcion_corta" placeholder="Descripción corta" />
        </div>
        <div class="vx-col w-full">
            <div>Representante legal</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.representante" placeholder="Representante legal de la empresa" />
        </div>
        <div class="vx-col w-full">
            <div>Dirección</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.direccion" placeholder="Dirección de la empresa" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2">
            <div>Ruc</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.ruc" placeholder="Ruc" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2">
            <div>Email</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.email" placeholder="Email" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2">
            <div>Teléfono</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.telefono" placeholder="Teléfono" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2">
            <div>Tipo</div>
            <v-select class="mb-4 w-full" v-model="sendEmpresa.tipo" :options="tipoActividad" label="nombre" :reduce="tipoActividad => tipoActividad.id" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2">
            <div>Secuencial</div>
            <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.secuencial" placeholder="Numero secuencial factura" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2">
            <div>Estado</div>
            <vs-radio v-model="sendEmpresa.estado" class="ml-2" vs-name="radiosTipoestado" vs-value="1">Activa</vs-radio>
            <vs-radio v-model="sendEmpresa.estado" class="ml-2" vs-name="radiosTipoestado" vs-value="0">Inactiva</vs-radio>
        </div>
        <!-- <div class="vx-col w-full">
            <vs-button class="m-2 mb-2" :color="color_boton" type="gradient" @click="guardaEditaEmpresa()">{{data_conf.titulo_modal}}</vs-button>
        </div> -->
    </div>
    <!--upload file-->
    <div class="vx-row">
      <div class="w-full p-2">
        <div v-if="id == 0">
          <EmpresaUploadVue :ObjectPadre="sendEmpresa" :id="id" @f_creado="changeHandleCreate"/>
        </div>
        <div v-else>
          <EmpresaUploadVue :ObjectPadre="sendEmpresa" v-if="sendEmpresa.nombre" :id="id" @f_creado="changeHandleCreate"/>
        </div>
      </div>
    </div>
</div>
</template>

<script>
const EmpresaUploadVue = () => import('./components/EmpresaUpload.vue');
import vSelect from 'vue-select'
export default {
    components: {
      'v-select': vSelect,
      EmpresaUploadVue,
    },
    data() {
        return {
            sendEmpresa:{
                nombre:'',
                descripcion_corta:'',
                representante:'',
                direccion:'',
                ruc:'',
                email:'',
                telefono:'',
                secuencial:'',
                estado:1,
                tipo:0,
                archivo:'',
                url:'',
            },
            tipoActividad: [{
                "id": 0,
                "nombre": "Matriz"
            }, {
                "id": 1,
                "nombre": "Sucursal"
            }],
            color_boton: 'success',
        };
    },
    props: {
        id:{
            type:Number,
            default:0
        },
        ObjectSelect: {
            type: Object,
            default: function(){
                return {}
            }
        },
        data_conf: {
            type: Object,
            default: ''
        }
    },
    created() {

    },
    mounted() {
        let me = this;
        me.start()
    },
    methods: {
      changeHandleCreate(e){
        this.$emit('f_creado', e);
      },
      start() {
        let me = this;
        //save
        if(me.id > 0 ){
          me.sendEmpresa = {
            nombre:             me.ObjectSelect.nombre,
            descripcion_corta:  me.ObjectSelect.descripcion_corta,
            representante:      me.ObjectSelect.representante,
            direccion:          me.ObjectSelect.direccion,
            ruc:                me.ObjectSelect.ruc,
            email:              me.ObjectSelect.email,
            telefono:           me.ObjectSelect.telefono,
            secuencial:         me.ObjectSelect.secuencial,
            estado:             me.ObjectSelect.estado,
            tipo:               me.ObjectSelect.tipo,
            archivo:            me.ObjectSelect.archivo,
            url:                me.ObjectSelect.url,
          }
        }
        //edit
        else{
          me.sendEmpresa = {
            nombre:'',
            descripcion_corta:'',
            representante:'',
            direccion:'',
            ruc:'',
            email:'',
            telefono:'',
            secuencial:'',
            estado:1,
            tipo:0,
            archivo:'',
            url:'',
          }
        }
      },
    }
};
</script>
