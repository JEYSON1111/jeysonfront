<template>
    <vx-card>
        <vs-alert active="true" style="height: 80px;">
            <i class="fa-solid fa-lock"></i> Desea cambiar su contraseña<br>
            <small>* La contraseña debe tener al menos <b>8</b> caracteres</small>
        </vs-alert>
        <div class="vx-row mb-6 mt-5">
            <div class="vx-col sm:w-1/3 w-full">
            <span>Nueva contraseña</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="password" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
            <span>Repetir contraseña</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="repeatpassword" />
                <p class="text-danger mt-1 font-semibold" style="font-size: 10px;">{{ msg }}</p>
            </div>
        </div>
        <div class="flex">
            <vs-button class="mr-3 mb-2" icon="check" @click="tipo = 1;msgSave='Se cambio correctamente la contraseña';changePassword()">Cambiar contraseña</vs-button>
            <vs-button color="warning" type="border" class="mb-2" @click="tipo = 0;msgSave='Se guardo correctamente';changePassword()">Recordarme en 30 días</vs-button>
        </div>
    </vx-card>
</template>
<script>
export default{
    data(){
        return{
            usuario:[],
            password:'',
            repeatpassword:'',
            msg:'',
            msgSave:'',
            //0 = no cambiar password ; 1 = cambiar password
            tipo:1,
        }
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this
        me.password = ""
        me.repeatpassword = ""
    },
    watch:{
        repeatpassword(results){
            let me = this;
            if(results.length > 2){
                if(results != me.password){
                    me.msg = 'La constraseñas no coinciden'
                }else{
                    me.msg = ''
                }
            }
        },
    },
    methods:{
        changePassword() {
            let me = this;
            if(me.tipo == 1){
                if(me.password.trim() == ""){
                me.$vs.notify({
                text:'El password no puede quedar vacio',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
                }
                if(me.password.length < 8){
                    me.$vs.notify({
                    text:'El password no puede ser menor a 8 caracteres',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                if(me.password != me.repeatpassword){
                    me.$vs.notify({
                    text:'Las contraseñas no coinciden',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
            }
            let formData = new FormData();
            formData.append('tipo',      me.tipo)
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('password',  me.password);
            me.$vs.loading()
            this.$http.post(this.$server_url+'changePassword', formData)
            .then(res => {
            me.$vs.loading.close()
            localStorage.setItem('usuario',JSON.stringify(res.data))
            me.$emit('changeRecarge',true)
            me.$vs.notify({
                text:me.msgSave,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch((e) =>{
                me.$vs.loading.close()
            })
        },
    }
}
</script>