/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'


// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
Vue.use(Vuesax)

// url server
Vue.prototype.$server_url = process.env.apiProlipa
const server_url = Vue.prototype.$server_url
Vue.prototype.$data_url = process.env.apiProlipaData
Vue.prototype.$apifacturacion_url = "http://186.4.218.168:9095/api/"
//Vue.prototype.$apiIluminar = "http://localhost:5000/"
Vue.prototype.$apiIluminar = "https://api.iluminareditores.com/"
// axios
import axiosG from 'axios'
import axios from './axios.js'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios
    // Filters
import './filters/filters.js'


// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css')

import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
    // Vue select css
    // Note: In latest version you have to add it separately
    // import 'vue-select/dist/vue-select.css';

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
//import { WebSocketLink } from 'apollo-link-ws'


const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'https://foro.prolipadigital.com.ec/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

// import * as io from "socket.io-client";
// import VueSocketIO from "vue-socket.io";

// Vue.use(
//     new VueSocketIO({
//         debug: false,
//         connection: io(process.env.socket), // options object is Optional
//         // connection: io('https://socket.prolipadigital.com.ec'), // options object is Optional
//     })
// );


// const wsLink = new WebSocketLink({
//     uri: `ws://148.72.158.159:4000`,
//     options: {
//         reconnect: true
//     }
// })

// HTTP connection to the API
// const httpLink = createHttpLink({
//     // You should use an absolute URL here
//     uri: 'http://148.72.158.159:4000',
// })

// Cache implementation
// const cache = new InMemoryCache()

// Create the apollo client
// const apolloClient = new ApolloClient({
// link: wsLink,
// uri: httpLink,
// cache,
// })

// // const apolloProvider = new VueApollo({
// defaultClient: apolloClient,
// })

window.$ = window.jQuery = require('jquery')

Vue.config.productionTip = false

store.dispatch('getUsuario')

new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
}).$mount('#app')

///FORMATEAR FECHA
Vue.mixin({
    methods: {
        fechaLarga(date) {
            var d = new Date(date);
            var dia = new Array(7);
            dia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            let hora = d.getHours()
            let minuto = d.getMinutes()
            let hhora = '';
            let mminuto = '';
            if (hora < 10) {
                hhora = `0${hora}`
            } else {
                hhora = `${hora}`
            }
            if (minuto < 10) {
                mminuto = `0${minuto}`
            } else {
                mminuto = `${minuto}`
            }
            var mesok = new Array(12);
            mesok = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            var datestring = dia[d.getDay()] + " " + d.getDate() + " de " + mesok[(d.getMonth())] + " del " + d.getFullYear() + " a las " +
                hhora + ":" + mminuto;
            return datestring;
        },
        fechaCorta(d) {
            var datestring = '';
            let date = new Date(d)
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            let hora = date.getHours()
            let minuto = date.getMinutes()
            let mmes = '';
            let dday = '';
            let hhora = '';
            let mminuto = '';

            if (month < 10) {
                mmes = `0${month}`
            } else {
                mmes = `${month}`
            }
            if (day < 10) {
                dday = `0${day}`
            } else {
                dday = `${day}`
            }
            if (hora < 10) {
                hhora = `0${hora}`
            } else {
                hhora = `${hora}`
            }
            if (minuto < 10) {
                mminuto = `0${minuto}`
            } else {
                mminuto = `${minuto}`
            }
            datestring = (`${year}-${mmes}-${dday} ${hhora}:${mminuto}`)
            return datestring;
        },
        historicoVisitas(idinstitucion, idusuario, idgrupo, idasignatura, nombreasignatura, recurso, datos) {

            console.log("historico")
                //     //recurso> (1:libro, 2:unidades, 3:cuadernos, 4:teletarea, 5:proyectos, 6:adaptaciones, 7:propuestas, 8:juegos, 9:material, 10:articulos, 11:tareas, 12:pdf guia, 13:pdf sin guia, 14:guia didactica)

            //     // datos: TIPO JSON
            //     // - user_nombre
            //     // - user_apellido
            //     // - user_email
            //     // - user_cedula
            //     // - recurso_accion: (crear - ver -descargar - eliminar)
            //     // - recurso_nombre (Libro de Mate 7, cuaderno de lengua 9, teletarea de mate 2, nombre del Proyecto, o adaptacion o propuesta, juego Sopa de letras, material Mapa politico, etc)
            //     // - recurso_detalle (nombre del libro o archivo .doc o .pdf si existe)

            //     let me = this;
            //     axiosG.post('https://foro.prolipadigital.com.ec/historico-recursos', {
            //             'idinstitucion': idinstitucion,
            //             'idusuario': idusuario,
            //             'idgrupo': idgrupo,
            //             'idasignatura': idasignatura,
            //             'nombreasignatura': nombreasignatura,
            //             'recurso': recurso,
            //             'datos': datos,
            //         })
            //         .then(res => {
            //             console.log('historico guardado')
            //         })
            //         .catch(err => {
            //             console.log('no se guardo el historico')
            //         })
        }
    },
})

export const server = server_url
