<template>
<!-- NOTIFICATIONS -->
    <div>
        <!--NOTIFICACIONES PARA PEDIDOS-->
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer" @click="getNotificaciones()" v-if="usuario.id_group == 11 || userRoot == true || usuario.id_group == 23 || usuario.id_group == 22">
            <div style="display: none;">
                <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" @ChangecantidadMensajes = "changeCantidadMensajes" @rechargeVerificaciones="getNotificacionesVerificaciones"/>
            </div>
            <div v-if="contadorNoLeidos >  0">
            <p>
                <feather-icon  icon="BellIcon" style="background-color: #06d755;padding: 3px; border-radius: 50%;border:5px solid #4DE346;"
                class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="contadorNoLeidos"/>
            </p>
            </div>
            <div v-else>
                <feather-icon  icon="BellIcon"
                class="cursor-pointer mt-1 sm:mr-6 mr-2" />
            </div>
            <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
                    <div  class="notification-top text-center p-5 bg-success text-white">
                        <h3 class="text-white">Notificaciones</h3>
                        <p class="opacity-75">{{tmparregloNotificaciones.length == 0 ?'No hay Notificaciones':'lista de notificaciones'}}</p>
                    </div>
                <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                    <ul class="bordered-items" v-if="tmparregloNotificaciones.length > 0">
                        <li v-for="ntf in tmparregloNotificaciones" :key="ntf.index" class="flex justify-between px-4 py-4 notification cursor-pointer">
                            <div class="flex items-start" @click="popupNotificaciones = true;">
                                <b v-if="ntf.contadorVistos > 0" class="contador">{{  ntf.contadorVistos }}</b>
                                <!-- <feather-icon icon="FileTextIcon"></feather-icon> -->
                                <div class="mx-2" @click="verNotificacion(ntf)">
                                    <!-- <span class="font-medium block notification-title" :class="[`text-${ntf.contadorMensajes[0].comentario}`]">{{ ntf.tipo }}</span> -->
                                    <h4  style="font-size: 12px!important;">{{ ntf.nombreInstitucion }}  </h4>

                                    <small>{{ ntf.contadorMensajes[0].comentario.substring(0,35) }}...</small>
                                    <p class="mt-4" style="font-size: 10px!important;">Pedido #{{ntf.id_pedido}}</p>
                                    <p style="font-size: 10px!important;" v-if="usuario.id_group == 11">Administrador ({{ getAdministradorMensaje(ntf.contadorMensajes) }})</p>
                                    <p v-else style="font-size: 10px!important;">{{ ntf.asesor }}</p>
                                    <p style="font-size: 11px;">{{ntf.ciudad}}</p>
                                </div>
                            </div>
                            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.contadorMensajes[0].created_at) }}</small>
                        </li>
                    </ul>
                </component>
                <!-- <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                    <ul class="bordered-items">
                        <li v-for="ntf in tareasp" :key="ntf.index" class="flex justify-between px-4 py-4 notification cursor-pointer">
                            <div class="flex items-start">
                                <feather-icon icon="FileTextIcon" :svgClasses="[`text-${ntf.nombre}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>
                                <div class="mx-2">
                                    <span class="font-medium block notification-title" :class="[`text-${ntf.nombre}`]">{{ ntf.title }}</span>
                                    <small>{{ ntf.nombre }}</small>
                                </div>
                            </div>
                            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.fecha_inicio) }}</small>
                        </li>
                    </ul>
                </component> -->
                <div class="
                checkout-footer
                fixed
                bottom-0
                rounded-b-lg
                text-primary
                w-full
                p-2
                font-semibold
                text-center
                border
                border-b-0
                border-l-0
                border-r-0
                border-solid
                d-theme-border-grey-light
                cursor-pointer">
                    <span></span>
                </div>
            </vs-dropdown-menu>
            <!--MODAL CHAT NOTIFICACIONES-->
            <vs-popup classContent="popup-example" fullscreen title="Mensajes asesor - facturador" :active.sync="popupNotificaciones" @close="RecargarNotificaciones()">
                <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion"/>
            </vs-popup>
        </vs-dropdown>
        <!--NOTIFICACIONES PARA VERIFICACIONES -->
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer" @click="getNotificacionesVerificaciones()" v-if="userRoot == true || usuario.id_group == 23 || usuario.id_group == 22">
            <div>
                <div v-if="arregloNotificacionVerificacion.length >  0">
                    <p>
                        <feather-icon  icon="ActivityIcon" style="background-color: #06d755;padding: 3px; border-radius: 50%;border:5px solid #4DE346;"
                        class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="arregloNotificacionVerificacion.length"/>
                    </p>
                </div>
                <div v-else>
                    <feather-icon  icon="ActivityIcon"
                    class="cursor-pointer mt-1 sm:mr-6 mr-2" />
                </div>
                <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
                        <div  class="notification-top text-center p-5 bg-success text-white">
                            <h3 class="text-white">Notificaciones</h3>
                            <p class="opacity-75">{{arregloNotificacionVerificacion.length == 0 ?'No hay Solicitudes de verificaciones':'Solicitudes de verificaciones'}}</p>
                        </div>
                    <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                        <ul class="bordered-items" v-if="arregloNotificacionVerificacion.length > 0">
                            <li v-for="ntf in arregloNotificacionVerificacion" :key="ntf.index" class="flex justify-between px-4 py-4 notification cursor-pointer">
                                <div class="flex items-start">
                                    <feather-icon icon="FileTextIcon"></feather-icon>
                                    <div class="mx-2">
                                        <h4  style="font-size: 12px!important;">{{ ntf.nombreInstitucion }}  </h4>
                                        <p class="mt-4" style="font-size: 10px!important;">Contrato: {{ntf.contrato_generado}}</p>
                                        <p style="font-size: 10px!important;">{{ ntf.asesor }}</p>
                                        <p style="font-size: 11px;">{{ntf.ciudad}}</p>
                                        <p class="mt-1"></p>
                                        <vs-chip v-if="ntf.tipo_venta == 1" color="dark">Venta: directa</vs-chip>
                                        <vs-chip v-if="ntf.tipo_venta == 2" color="dark">Venta: Lista</vs-chip>
                                    </div>
                                </div>
                                <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.fecha_solicita_verificacion) }}</small>
                            </li>
                        </ul>
                    </component>
                    <div class="
                    checkout-footer
                    fixed
                    bottom-0
                    rounded-b-lg
                    text-primary
                    w-full
                    p-2
                    font-semibold
                    text-center
                    border
                    border-b-0
                    border-l-0
                    border-r-0
                    border-solid
                    d-theme-border-grey-light
                    cursor-pointer">
                        <span></span>
                    </div>
                </vs-dropdown-menu>
            </div>
        </vs-dropdown>
    </div>
</template>

<script>
// import io from 'socket.io-client';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Vue from 'vue'
import axios from 'axios'
import moment from "moment";
import screenNotificacionVue from '../../../../views/pedidos/notificaciones/screenNotificacion.vue'
Vue.use(axios)
Vue.filter('fecha', function (value) {
    var fechaActual = moment().format('YYYY-MM-DD')
    var fecha       = moment(String(value)).format('YYYY-MM-DD')
    var fechaInicio = new Date(fecha).getTime();
    var fechaFin    = new Date(fechaActual).getTime();
    var diff = fechaFin - fechaInicio;
    const resultado = diff/(1000*60*60*24);
    if(resultado == 0){
        return "hoy"
    }else{
        let dato = "Hace "+resultado +" dias"
        return dato
    }
});
export default {
    components: {
        VuePerfectScrollbar,
        screenNotificacionVue,
    },
    created() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    data() {
        return {
            // socket: io("http://localhost:3000/"),
            // socket: io("https://socket.prolipadigital.com.ec/"),
            condicion:0,
            notifications:[],
            arregloNotificaciones:[],
            tmparregloNotificaciones:[],
            popupNotificaciones:false,
            cambiarNotificacion:false,
            arregloNotificacionVerificacion:[],
            contadorVerificaciones:0,
            contadorNoLeidos:0,
            usuario: [],
            tareasp: [],
            tarease: [],
            userRoot: false,
            unreadNotifications: [{
                    index: 0,
                    title: 'New Message',
                    msg: 'Are your going to meet me tonight?',
                    icon: 'MessageSquareIcon',
                    time: this.randomDate({
                        sec: 10
                    }),
                    category: 'primary'
                },
                {
                    index: 1,
                    title: 'New Order Recieved',
                    msg: 'You got new order of goods.',
                    icon: 'PackageIcon',
                    time: this.randomDate({
                        sec: 40
                    }),
                    category: 'success'
                }
            ],
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: .60
            }
        }
    },
    mounted() {
        let me = this
        if(me.usuario.id_group == 1 || me.usuario.id_group == 22 || me.usuario.id_group == 23){
          this.getNotificaciones();
          this.getNotificacionesVerificaciones()
          me.getUserRoot(me.usuario);
        }
    },
    computed: {
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        },
    },
    methods: {
        getUserRoot(dato) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    console.log('pedido admin screen', result.data)
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    }
                    me.$vs.loading.close()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        RecargarNotificaciones(){
            let me = this;
            me.cambiarNotificacion = !me.cambiarNotificacion
        },
        changeCantidadMensajes(e){
            let me = this
            me.contadorNoLeidos = e
        },
        getAdministradorMensaje(tr){
            var resultado = ""
            for(let i =0; i<tr.length;i++){
            if(tr[i].id_group == "23" || tr[i].id_group == "22" || tr[i].id_group == "1"){
                resultado = tr[i].usuario
                break;
            }
            }
            return resultado;
        },
        //  socketinit(){
        //     let me = this;
        //     try {
        //         this.socket.on('enviar',(arg) => {
        //         this.getNotifications();
        //             if(arg == "Solicitud libros"){

        //                 if(me.usuario.id_group == 1){
        //                     this.condicion = 1;
        //                     me.$vs.notify({
        //                     text:'Un docente ha solicitado libros',
        //                     color:'success',
        //                     iconPack: 'feather',
        //                     icon:'icon-file',
        //                     time:5000
        //                     })
        //                     return
        //                 }
        //             }else if(arg == 'Documento Ministerial'){
        //                 this.condicion = 1;
        //                 if(me.usuario.id_group == 1 || me.usuario.id_group == 6){
        //                     me.$vs.notify({
        //                     text:'Se ha creado un nuevo documento ministerial',
        //                     color:'success',
        //                     iconPack: 'feather',
        //                     icon:'icon-file',
        //                     time:5000
        //                     })
        //                     return
        //                 }
        //             }

        //         });
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
        getNotificaciones(){
            let me = this
            var tipo = 0
            if(me.usuario.id_group == 11){
                //envia el asesor
                tipo = 0
            }else{
                //envia un facturador
                tipo = 1
            }
            this.$http.get(this.$server_url+'verNotificacionPedidos?tipo='+tipo)
            .then(function (res) {
                let datos = res.data
                var resultado = 0
                if(datos.length > 0){
                if(me.usuario.id_group == 11){
                me.arregloNotificaciones = datos.filter(p => p.id_asesor == me.usuario.idusuario)
                }else{
                    me.arregloNotificaciones = datos
                }
                me.tmparregloNotificaciones = me.arregloNotificaciones
                //contar No vistos
                resultado =  me.arregloNotificaciones.reduce((acc,valor) =>{
                const respuesta = acc+ valor.contadorVistos
                return respuesta
                },0)
                }
                me.contadorNoLeidos = resultado
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        getNotificacionesVerificaciones(){
            let me = this
            var url = ""
            if(me.usuario.id_group == 22){
               url = this.$server_url+'notificacionesVerificaciones?idFacturador='+me.usuario.idusuario
            }else{
               url = this.$server_url+'notificacionesVerificaciones'
            }
            this.$http.get(url)
            .then(function (res) {
               me.arregloNotificacionVerificacion = res.data
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        verNotificacion(tr){
            let me = this;
            if(tr.tipo == 'Documento Ministerial'){
                me.viewDocumento(tr.id_created)
            }
        },
        viewDocumento(id){
            let me = this;
            this.$http.get(this.$server_url+'getDocumentos/'+id)
                .then(function (res) {
                    console.log('xd',res.data.items[0])
                    localStorage.setItem('doc', JSON.stringify(res.data.items[0]));
                    me.$router.push('/ver/viewDocument');
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getCurso() {
            let me = this;
            this.$http.get(this.$server_url+'estudianteCurso?idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.curso = response.data;
                    me.curso.forEach(element => {
                        this.$http.get(this.$server_url+"tareaEstudianteRealizada?idcurso=" + element.idcurso + "&idusuario=" + me.usuario.idusuario).then(function (response) {
                                var respuesta = response.data;
                                respuesta.forEach(element => {
                                    me.tarease.push(element)
                                });
                            })
                            .catch(function (error) {});
                        this.$http.get(this.$server_url+"tareaEstudiantePendiente?idcurso=" + element.idcurso + "&idusuario=" + me.usuario.idusuario).then(function (response) {
                                var respuesta = response.data;
                                respuesta.forEach(element => {
                                    me.tareasp.push(element)
                                });

                            })
                            .catch(function (error) {

                            });
                    });
                })
                .catch(function (error) {})
        },
        elapsedTime(startTime) {
            const x = new Date(startTime)
            const now = new Date()
            let timeDiff = now - x
            timeDiff /= 1000

            const seconds = Math.round(timeDiff)
            timeDiff = Math.floor(timeDiff / 60)

            const minutes = Math.round(timeDiff % 60)
            timeDiff = Math.floor(timeDiff / 60)

            const hours = Math.round(timeDiff % 24)
            timeDiff = Math.floor(timeDiff / 24)

            const days = Math.round(timeDiff % 365)
            timeDiff = Math.floor(timeDiff / 365)

            const years = timeDiff

            if (years > 0) {
                return `${years + (years > 1 ? ' Años ' : ' Año ')}`
            } else if (days > 0) {
                return `Hace ${days + (days > 1 ? ' Dias ' : ' Dia ')}`
            } else if (hours > 0) {
                return `Hace ${hours + (hours > 1 ? ' Horas ' : ' Hora ')}`
            } else if (minutes > 0) {
                return `Hace ${minutes + (minutes > 1 ? ' Minutos ' : ' Minuto ')}`
            } else if (seconds > 0) {
                return 'Hace '+ seconds + (seconds > 1 ? ' segundos' : 'justo ahora')
            }

            return ' Justo Ahora'
        },
        // Method for creating dummy notification time
        randomDate({
            hr,
            min,
            sec
        }) {
            const date = new Date()

            if (hr) date.setHours(date.getHours() - hr)
            if (min) date.setMinutes(date.getMinutes() - min)
            if (sec) date.setSeconds(date.getSeconds() - sec)

            return date
        }
    }
}
</script>

<style scoped>
   .contador{
        background: #06d755;
        color: #fff;
        min-width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.75rem;
    }
</style>
