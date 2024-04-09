<template>
<vx-card title="Mi Perfil">
    <div  style="display: flex;justify-content: center">
    <div v-if="usuario.foto_user == 'default.png' ">
        <vs-avatar   :src="activeUserInfo.photoURL" alt="user-img" size="120px" class="rounded-full shadow-md cursor-pointer block" />
    </div>
    <div v-else>
        <vs-avatar style="margin-auto;display:block;" :src="$data_url+'archivos/'+'perfil/'+usuario.foto_user" alt="user-img" size="120px" class="rounded-full shadow-md cursor-pointer block" />
    </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            Foto de Perfil
            <vs-input type="file" class="w-full" icon-pack="feather" icon="icon-user" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" icon-no-border @change="obtenerImagen" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" disabled icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario.cedula" />
        </div>
    </div>


    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario.nombres" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario.apellidos" />
        </div>
    </div>

    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full" disabled icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario.email" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" type="tel"  icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario.telefono" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full"  icon-pack="feather" icon="icon-mail" icon-no-border label="Nacionalidad" v-model="usuario.nacionalidad" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <ul class="flex mt-5">
                <li>
                <vs-radio v-model="usuario.sexo" vs-name="radios1" vs-value="hombre">Hombre</vs-radio>
                </li>
                <li>
                <vs-radio  v-model="usuario.sexo" class="ml-2" vs-name="radios1" vs-value="mujer">Mujer</vs-radio>
                </li>
            </ul>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            Grado:
             <v-select :options="cursos" :reduce="cursos => cursos" label="nombrenivel" class="w-full" v-model="usuario.curso" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            Paralelo
             <v-select id="paralelo" :options="paralelos" :reduce="paralelos => paralelos" label="descripcion" class="w-full" v-model="usuario.paralelo" />
        </div>
    </div>
     <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Fecha Nacimiento</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
              <flat-pickr :config="configdateTimePicker" v-model="usuario.fecha_nacimiento" placeholder="Fecha Nacimiento" class="m-1" style="display: inline-block;width: 100%" />
        </div>
    </div>
    <div class="vx-row mb-6" v-if="user.id_group == 11">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Iniciales</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" type="tel" disabled  icon-pack="feather" icon="icon-check" icon-no-border label="Iniciales" v-model="usuario.iniciales" />
        </div>
    </div>


    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Ciudad</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <p>{{ usuario.ciudad }}</p>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Institución</span>
            <vs-input class="w-full" type="tel" hidden icon-pack="feather" v-model="usuario.institucion_idInstitucion" />

        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <p>{{ usuario.nombreInstitucion }}</p>
        </div>
    </div>
    <div class="vx-row text-center">
        <vs-button  @click="guardar" class="w-full mr-3 mb-2" color="success">Guardar</vs-button>
    </div>
</vx-card>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview,
        flatPickr
    },
    data() {
        return {
            file: [],
            user:[],
            usuario: [],
            error: '',
            password: '',
            passwordc: '',
            btn: true,
            ciudad: [],
            instituciones: [],
            idregion: '',
            idciudad: '',
            ciudadSelect:'',
            institucion_estudiante: [],
             configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            paralelos:[],
            cursos:[],

        }
    },
    created() {
        this.infoRegistro();
        this.user = JSON.parse(localStorage.getItem('usuario'));
        this.institucion_estudiante = {idInstitucion: this.usuario.institucion_idInstitucion, nombreInstitucion: this.usuario.nombreInstitucion}
    },
    mounted() {
        let me = this;
        me.getCiudadSelect();
        me.getInstituciones();
        me.userInfo();
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.AppActiveUser
        }
    },
    methods: {
        infoRegistro() {
            let me = this;
            this.$http.get(this.$server_url+'infoRegistro')
                .then(function (res) {
                    me.paralelos = res.data.paralelos
                    me.cursos = res.data.cursos  

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    

                })
        },
        userInfo(){
            let me = this;
            this.$http.get(this.$server_url+'userInformacion?idusuario='+me.user.idusuario)
                .then(function (res) {
                    me.usuario = res.data[0]
                    me.usuario.curso = {orden:me.usuario.curso, nombrenivel:me.usuario.nombrenivel};
                    me.usuario.paralelo = {paralelo_id:me.usuario.paralelo, descripcion:me.usuario.descripcion};
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                
                })
        },
        verificar() {
            var n = this.password.localeCompare(this.passwordc);
            if (n == 0) {
                this.btn = false;
                this.error = ""
            } else {
                this.btn = true;
                this.error = "Contraseñas no coinciden"
            }
        },
        async guardar() {
            let me = this
             if(me.usuario.nombres.length >= 200){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Los nombres no pueden un maximo de 200 caracteres'
                    })
                return false;
            }

            if(me.usuario.apellidos.length >= 200){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Los apellidos no pueden un maximo de 200 caracteres'
                    })
                return false;
            }

            if(me.usuario.telefono.length >= 20){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El telefono no puede tener un maximo de 20 caracteres'
                    })
                return false;
            }

            if(me.usuario.email.length >= 200){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El email no puede un maximo de 200 caracteres'
                    })
                return false;
            }

            if(me.usuario.cedula.length >= 20){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'La cedula no puede un maximo de 20 caracteres'
                    })
                return false;
            }

            let formData = new FormData();
            formData.append('archivo', me.file);
            formData.append('idusuario', this.usuario.idusuario);
            formData.append('cedula', this.usuario.cedula);
            formData.append('nombres', this.usuario.nombres);
            formData.append('apellidos', this.usuario.apellidos);
            formData.append('email', this.usuario.email);
            formData.append('telefono', this.usuario.telefono);
            formData.append('nacionalidad', this.usuario.nacionalidad);
            formData.append('fecha_nacimiento', this.usuario.fecha_nacimiento);
            if(this.usuario.iniciales == null || this.usuario.iniciales == "null" ){
                formData.append('iniciales', ""); 
            }else{
                 formData.append('iniciales', this.usuario.iniciales);
            }
            if(this.usuario.curso == null || this.usuario.curso == undefined || this.usuario.curso == ""){

            }else{
                 formData.append('curso', this.usuario.curso.orden);
            }
             if(this.usuario.paralelo == null || this.usuario.paralelo == undefined || this.usuario.paralelo == ""){

            }else{
                formData.append('paralelo', this.usuario.paralelo.paralelo_id);
            }
            formData.append('genero', this.usuario.sexo);
            // formData.append('password', this.password);
             me.$vs.loading();
            formData.append('institucion_idInstitucion', this.usuario.institucion_idInstitucion);

            axios.post(this.$data_url+'api/perfil', formData)
                .then(function (response) {

                   me.file = '';
                    me.$vs.loading.close();
                    localStorage.setItem('usuario', JSON.stringify(response.data[0]));
                      
                    location.reload();
                    me.userInfo()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        obtenerImagen(e) {
            let file = e.target.files[0];
            this.file = file;
        },
        getInstituciones() {
            let me = this;
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        getInstitucion() {
            let me = this;
            me.institucion_estudiante = []
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                    // console.log( me.instituciones )
                })
                .catch(function (error) {})
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url+"ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
