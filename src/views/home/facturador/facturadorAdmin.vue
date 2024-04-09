<template>
    <div>
        <div style="display: none;">
            <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" @ChangecantidadMensajes = "changeCantidadMensajes"/>
        </div>
        <div class="flex" style="flex-wrap: wrap;">
            <div class="box cyan" style="height: 220px;" @click="popupNotificaciones = true;">
                <div class="flex">
                    <h2>Notificaciones</h2>
                    <b class="message_p ml-1 mt-1">{{ cantidadMensajes }}</b>
                </div>  
                <img width="80" style="margin-top: -10px;" src="https://cdn-icons-png.flaticon.com/512/5602/5602848.png" alt="">
            </div>
            <div class="box red" style="height: 220px;" @click="$router.push('/p_pedidos')">
                <h2>Contratos</h2>
                <span v-for="(tr,index) of datos" :key="index">
                    {{tr.periodo}}: <b>{{tr.contratos}}</b><br>
                </span>
                <img width="80" style="margin-top: -45px;" src="https://cdn-icons-png.flaticon.com/512/3967/3967160.png" alt="">
            </div>
        </div>
        <vs-popup classContent="popup-example" fullscreen title="Mensajes asesor - facturador" :active.sync="popupNotificaciones" @close="RecargarNotificaciones()">
            <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion"/>
        </vs-popup>
    </div>
</template>
<script>
import screenNotificacionVue from '../../pedidos/notificaciones/screenNotificacion.vue';
import io from "socket.io-client";
export default{
    components:{
        screenNotificacionVue,
    },
    data(){
        return{
            datos:[],
            cantidadMensajes:0,
            popupNotificaciones:false,
            cambiarNotificacion:false,
            socket: io(process.env.socket),
        }
    },
    mounted(){
        let me = this;
        me.getDatos()
    },
    methods:{
        RecargarNotificaciones(){
            let me = this;
            me.cambiarNotificacion = !me.cambiarNotificacion
        },
        changeCantidadMensajes(e){
            let me = this
            me.cantidadMensajes = e
        },
        getDatos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'pedidos?homeAdmin=yes')
                .then(function (res) {
                    me.datos = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
    }
}
</script>
<style scoped>
    .row1-container {
        font-size: 15px;
        font-family: 'Poppins', sans-serif;
        background-color: hsl(0, 0%, 98%);
    }
    .attribution { 
        font-size: 11px; text-align: center; 
    }
    .attribution a { 
        color: hsl(228, 45%, 44%); 
    }

    h1:first-of-type {
        font-weight: 200;
        color: hsl(234, 12%, 34%)
    }

    h1:last-of-type {
        color: hsl(234, 12%, 34%)
    }
    @media (max-width: 400px) {
        h1 {
            font-size: 1.5rem;
        }
    }
    .box p {
        color: hsl(229, 6%, 66%);
    }
    .box {
        border-radius: 5px;
        box-shadow: 0px 30px 40px -20px hsl(229, 6%, 66%);
        padding: 30px;
        margin: 20px;  
        background-color: white;
        cursor: pointer;
        transition: 1s ease;
    }
    .box:hover{
        box-shadow: 15px 10px 15px #0000;
    }

    img {
        float: right;
    }
    /*ESTILOS NOTIFICACIONES */
    .message_p  {
        background: #06d755;
        color: #fff;
        min-width: 20px;
        height: 23px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:18px;
        width: 23px;
    }
    @media (max-width: 912px) {
        .box{
            width: 100%!important;
        }
        img{
            margin-top: -40px;
            width: 50px;
        }
    }
    @media (max-width: 820px) {
        .box{
            width: 100%!important;
        }
        img{
            margin-top: -40px;
            width: 50px;
        }
    }
    @media (max-width: 450px) {
        .box {
            height: 200px;
        }
        .img{
            margin-top: -40px;
        }
    }
    @media (max-width: 400px) {
        
        img{
            margin-top: -40px;
            width: 50px;
        }
    }
    @media (max-width: 414px) {
        .box{
            width: 100%!important;
        }
        img{
            margin-top: -40px;
            width: 50px;
        }
    }
    @media (max-width: 375px) {
        .box{
            width: 100%!important;
        }
        img{
            margin-top: -40px;
            width: 50px;
        }
    }
    @media (max-width: 280px) {
        .box{
            width: 100%!important;
        }
        img{
            margin-top: -40px;
            width: 50px;
        }
    }


    @media (max-width: 950px) and (min-width: 450px) {
        .box {
            text-align: center;
            height: 180px;
        }
    }

    .cyan {
        border-top: 3px solid hsl(180, 62%, 55%);
    }
    .red {
        border-top: 3px solid hsl(0, 78%, 62%);
    }
    .blue {
        border-top: 3px solid hsl(212, 86%, 64%);
    }
    .orange {
        border-top: 3px solid hsl(34, 97%, 64%);
    }

    h2 {
        color: hsl(234, 12%, 34%);
        font-weight: 600;
    }


    @media (min-width: 950px) {
        .row1-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .row2-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .box-down {
            position: relative;
            top: 150px;
        }
        .box {
            width: 28%;
        
        }
        .header p {
            width: 30%;
        }
        
    }
</style>