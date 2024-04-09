<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div class="layout--main" :class="[
          layoutTypeClass,
          navbarClasses,
          footerClasses,
          { 'no-scroll': isAppPage },
        ]">
        <v-idle style="display: none" @idle="onidle" @remind="onremind" :loop="false" :reminders="[10, 5]" :wait="5" :duration="3600" />
        <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" />
        <InfoEstudiante :isSidebarActive="IfinfoEstudiante" @closeInfoEstudiante="toggleDataSidebarEstudiante" :data="sidebarData" />
        <bloqueo-session :isSidebarActive="addNewDataSidebarr" />
        <v-nav-menu :navMenuItems="navMenuItems" title="Prolipa" parent=".layout--main" />
        <div id="content-area" :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]">
            <div id="content-overlay" />

            <!-- Navbar -->
            <template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
                <the-navbar-horizontal :navbarType="navbarType" :class="[
                { 'text-white': isNavbarDark && !isThemeDark },
                { 'text-base': !isNavbarDark && isThemeDark },
              ]" />

                <div style="height: 62px" v-if="navbarType === 'static'"></div>

                <h-nav-menu :class="[
                { 'text-white': isNavbarDark && !isThemeDark },
                { 'text-base': !isNavbarDark && isThemeDark },
              ]" :navMenuItems="navMenuItems" />
            </template>

            <template v-else>
                <the-navbar-vertical :navbarColor="navbarColor" :class="[
                { 'text-white': isNavbarDark && !isThemeDark },
                { 'text-base': !isNavbarDark && isThemeDark },
              ]" />
            </template>
            <!-- /Navbar -->

            <div class="content-wrapper">
                <div class="router-view">
                    <div class="router-content">
                        <transition :name="routerTransition">
                            <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" class="router-header flex flex-wrap items-center mb-6">
                                <div class="content-area__heading" :class="{
                        'pr-4 border-0 md:border-r border-solid border-grey-light':
                          $route.meta.breadcrumb,
                      }">
                                    <h2 class="mb-1">{{ routeTitle }}</h2>
                                </div>

                                <!-- BREADCRUMB -->
                                <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route" :isRTL="$vs.rtl" />

                                <!-- DROPDOWN -->
                                <!-- <vs-dropdown vs-trigger-click class="ml-auto md:block hidden cursor-pointer">
                                    <vs-button radius icon="icon-settings" icon-pack="feather" />

                                    <vs-dropdown-menu class="w-32">
                                        <vs-dropdown-item>
                                            <div @click="$router.push('/pages/profile').catch(() => {})" class="flex items-center">
                                                <feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                                <span>Profile</span>
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item>
                                            <div @click="$router.push('/apps/todo').catch(() => {})" class="flex items-center">
                                                <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                                <span>Tasks</span>
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item>
                                            <div @click="$router.push('/apps/email').catch(() => {})" class="flex items-center">
                                                <feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                                <span>Inbox</span>
                                            </div>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>

                                </vs-dropdown> -->
                            </div>
                        </transition>

                        <div class="content-area__content">
                            <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500" v-if="!hideScrollToTop">
                                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top" />
                            </back-to-top>

                            <transition :name="routerTransition" mode="out-in">
                                <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="
                        (classesStr) => $emit('setAppClasses', classesStr)
                      " />
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
            <the-footer />
        </div>
    </div>
    </template>

    <script>
    import Vue from "vue";
    import axios from "axios";
    import Vidle from "v-idle";
    import BackToTop from "vue-backtotop";
    import HNavMenu from "@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue";
    //import navMenuItems from '@/layouts/components/vertical-nav-menu/navMenuItems.js'
    import TheNavbarHorizontal from "@/layouts/components/navbar/TheNavbarHorizontal.vue";
    import TheNavbarVertical from "@/layouts/components/navbar/TheNavbarVertical.vue";
    import TheFooter from "@/layouts/components/TheFooter.vue";
    import themeConfig from "@/../VirtualConfig.js";
    import VNavMenu from "@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue";
    import DataViewSidebar from "./bloqueo";
    import BloqueoSession from "./session";
    // import io from "socket.io-client";
    import {
        mapState
    } from "vuex";
    import InfoEstudiante from "./infoEstudiante.vue";
    Vue.use(Vidle);
    Vue.use(axios);
    export default {
        components: {
            BackToTop,
            HNavMenu,
            TheFooter,
            TheNavbarHorizontal,
            TheNavbarVertical,
            VNavMenu,
            DataViewSidebar,
            BloqueoSession,
            InfoEstudiante
        },
        data() {
            return {
                activePrompt: false,
                usuario: [],
                navMenuItems: [],
                footerType: themeConfig.footerType || "static",
                hideScrollToTop: themeConfig.hideScrollToTop,
                isNavbarDark: false,
                navbarColor: themeConfig.navbarColor || "#fff",
                navbarType: themeConfig.navbarType || "floating",
                routerTransition: themeConfig.routerTransition || "none",
                routeTitle: this.$route.meta.pageTitle,
                sidebarData: {},
                addNewDataSidebar: false,
                addNewDataSidebarr: false,
                IfinfoEstudiante: false,
                // socket: io(process.env.socket),
            };
        },
        mounted() {
            let me = this;
            if (!localStorage.usuario) {
                if (this.$store.state.auth == true) {
                    console.log(this.auth);
                    this.$router.push("/home");
                } else {
                    this.$router.push("/");
                }
            }
            this.getMenu();
            this.getPeriodo();
            this.getVerInstitucionActiva();
            // if(this.usuario.id_group == 4){
            //     this.validateInformationStudent()
            // }
            if(me.usuario.id_group != 4 && me.usuario.id_group != 6 && me.usuario.id_group != 12 && me.usuario.id_group != 13){
             me.getUserRoot()
            }
        },
        watch: {
            $route() {
                this.routeTitle = this.$route.meta.pageTitle;
            },
            isThemeDark(val) {
                const color = this.navbarColor === "#046AE7" && val ? "#10163a" : "#046AE7";
                this.updateNavbarColor(color);
            },
            "$store.state.mainLayoutType"(val) {
                this.setNavMenuVisibility(val);
            },
        },
        computed: {
            ...mapState(["auth",'userRoot','susuario']),
            bodyOverlay() {
                return this.$store.state.bodyOverlay;
            },
            contentAreaClass() {
                if (this.mainLayoutType === "vertical") {
                    if (this.verticalNavMenuWidth === "default")
                        return "content-area-reduced";
                    else if (this.verticalNavMenuWidth === "reduced")
                        return "content-area-lg";
                    else return "content-area-full";
                } else return "content-area-full";
            },
            footerClasses() {
                return {
                    "footer-hidden": this.footerType === "hidden",
                    "footer-sticky": this.footerType === "sticky",
                    "footer-static": this.footerType === "static",
                };
            },
            isAppPage() {
                return this.$route.meta.no_scroll;
            },
            isThemeDark() {
                return this.$store.state.theme === "dark";
            },
            layoutTypeClass() {
                return `main-${this.mainLayoutType}`;
            },
            mainLayoutType() {
                return this.$store.state.mainLayoutType;
            },
            navbarClasses() {
                return {
                    "navbar-hidden": this.navbarType === "hidden",
                    "navbar-sticky": this.navbarType === "sticky",
                    "navbar-static": this.navbarType === "static",
                    "navbar-floating": this.navbarType === "floating",
                };
            },
            verticalNavMenuWidth() {
                return this.$store.state.verticalNavMenuWidth;
            },
            windowWidth() {
                return this.$store.state.windowWidth;
            },
        },
        methods: {
            getUserRoot() {
                let me = this;
                this.$store.dispatch('getUserInfo')
                this.$http.get(this.$server_url + 'permisos/' + this.usuario.idusuario)
                    .then((result) => {
                        //root
                        let preRoot = false
                        if(result.data.length > 0){ preRoot = true; this.$store.dispatch('setRoot',true) }
                        else{ preRoot = false; this.$store.dispatch('setRoot',false) }
                        //grupo facturador
                        if(this.usuario.id_group == 23 || this.usuario.id_group == 22 || preRoot){ this.$store.dispatch('setGroupFacturador',true) }
                        //asesor
                        if(this.usuario.id_group == 11 ) { this.$store.dispatch('setGroup',{ "grupo":11,"permiso":true }) }
                        //grupo Bodega
                        if(this.usuario.id_group == 17 || this.usuario.id_group == 27 || preRoot){ this.$store.dispatch('setGrupoBodega',true) }

                    })
                    .catch((err) => {
                        console.log(err)
                    })
                },
            onidle() {
                // alert("Se ha cerrado la sesión");
                this.addNewDataSidebarr = true

            },
            onremind(hora) {
                // Alerta segundos restantes hasta las 00:00
                //   alert(hora);
            },
            addNewData() {
                this.sidebarData = {};
                this.toggleDataSidebar(true);
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val;
            },
            toggleDataSidebarEstudiante(val = false) {
                this.IfinfoEstudiante = val;
            },
            getMenu() {
                let me = this;

                if (me.usuario.idusuario == null) {
                    return false;
                }
                me.$vs.loading();
                this.$http
                    .get(this.$server_url + "menu?idgrupo=" + me.usuario.id_group)
                    .then(function (response) {
                        me.$vs.loading.close();
                        me.navMenuItems = response.data;
                        // console.log(me.navMenuItems);
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                    });
            },
            changeRouteTitle(title) {
                this.routeTitle = title;
            },
            updateNavbarColor(val) {
                this.navbarColor = val;
                if (val === "#fff") this.isNavbarDark = false;
                else this.isNavbarDark = true;
            },
            setNavMenuVisibility(layoutType) {
                if (
                    (layoutType === "horizontal" && this.windowWidth >= 1200) ||
                    (layoutType === "vertical" && this.windowWidth < 1200)
                ) {
                    this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
                    this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");
                } else {
                    this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
                }
            },
            getPeriodo() {
                let me = this;
                this.$http
                    .get(
                        this.$server_url +
                        "periodoInstitucion?idInstitucion=" +
                        me.usuario.institucion_idInstitucion
                    )
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data == 1) {
                            me.addNewDataSidebar = false;
                        } else {
                            me.addNewDataSidebar = true;
                            localStorage.removeItem("tk");
                        }
                    })
                    .catch(function (error) {});
            },
            getVerInstitucionActiva() {
                let me = this;
                this.$http
                    .get(
                        this.$server_url +
                        "institucionActiva?idInstitucion=" +
                        me.usuario.institucion_idInstitucion
                    )
                    .then(function (response) {
                        console.log(response.data[0].estado);
                        if (response.data[0].estado == 1) {
                            me.addNewDataSidebar = false;
                        } else {
                            me.addNewDataSidebar = true;
                            localStorage.removeItem("tk");
                        }
                    })
                    .catch(function (error) {});
            },

            //metodo para validar datos del estudiante
            validateInformationStudent() {
                let me = this;
                let institucion = me.usuario.institucion_idInstitucion
                let estudiante = me.usuario.idusuario
                this.$http.get(this.$server_url + 'informationStudent?institucion_id=' + institucion + '&idusuario=' + estudiante)
                    .then(function (res) {
                        if (res.data.status == 1) {
                            me.IfinfoEstudiante = false
                        } else {
                            me.IfinfoEstudiante = true
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return
                        }

                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                    })
            },
            saveHistoricoVisitas() {
                let me = this;
                let formData = new FormData();
                formData.append('idusuario', me.usuario.idusuario)
                formData.append('institucion_id', me.usuario.institucion_idInstitucion)
                formData.append('id_group', me.usuario.id_group)
                formData.append('recurso', '15')
                formData.append('datos', 'Ingreso al sistema')
                this.$http.post(this.$server_url + 'historico', formData)
                    .then(res => {
                        console.log(res.data.message)
                    })
                    .catch(function (e) {
                        console.log(e)
                    })
            },
        },
        created() {
            let me = this;
            const color =
                this.navbarColor === "#fff" && this.isThemeDark ?
                "#10163a" :
                this.navbarColor;
            this.updateNavbarColor(color);
            this.setNavMenuVisibility(this.$store.state.mainLayoutType);
            try {
                this.usuario = JSON.parse(localStorage.getItem("usuario"));
                // console.log(this.usuario);
                if (this.usuario == null || this.usuario.length != 1) {
                    localStorage.removeItem("tk");
                    localStorage.removeItem("token");
                }
            } catch (error) {
                localStorage.removeItem("tk");
                localStorage.removeItem("token");
            }
            var hoy = new Date();
            var fecha =
                hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
            var hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
            if (this.usuario.id_group == 6) {
                var grupo = "Docente";
            }
            if (this.usuario.id_group == 4) {
                var grupo = "Estudiante";
            }
            if (this.usuario.id_group == 1) {
                var grupo = "Administrador";
            }
            var usr = new Object();
            usr.id = this.usuario.idusuario;
            usr.nombres = this.usuario.nombres;
            usr.idusuario = this.usuario.idusuario;
            usr.nombres = this.usuario.nombres;
            usr.apellidos = this.usuario.apellidos;
            usr.email = this.usuario.email;
            usr.grupo = this.usuario.id_group;
            usr.Institucion = this.usuario.nombreInstitucion;
            usr.token = localStorage.tk;
            usr.fecha = fecha + " " + hora;
            // try {
            //     this.socket.on(this.usuario.idusuario, (data) => {
            //         this.addNewDataSidebarr = true
            //     })
            //     this.socket.emit("sessionclose", usr);
            // } catch (error) {
            //     console.log(error)
            // }

            //SOCKET DE NOTIFICACIONES MENSAJES PEDIDOS
            // try {
            //     this.socket.on('enviar', (data) => {
            //         console.log("nuevo mensaje",data)
            //         if(data.tipo == 'pedidos_chat'){
            //              //si el mensaje envia un asesor
            //             if(data.grupo == 11){
            //                 if(me.usuario.id_group == 22 || me.usuario.id_group == 23){
            //                 me.$vs.notify({
            //                 text:'Tienes un nuevo mensaje del pedido',
            //                 color:'success',
            //                 iconPack: 'feather',
            //                 icon:'icon-check',
            //                 time:5000,
            //                 })
            //                 return
            //                 }
            //             }
            //             if(data.grupo == 22 || data.grupo == 23){
            //                 if(me.usuario.id_group == 11 && data.id_asesor == me.usuario.idusuario){
            //                 me.$vs.notify({
            //                     text:'Tienes un nuevo mensaje del pedido',
            //                     color:'success',
            //                     iconPack: 'feather',
            //                     icon:'icon-check',
            //                     time:5000,
            //                     })
            //                     return
            //                 }
            //             }
            //         }
            //     })
            // } catch (error) {
            //     console.log(error)
            // }

            // axios
            //     .post("https://foro.prolipadigital.com.ec/estudiantes", {
            //         idusuario: this.usuario.idusuario,
            //         cedula: this.usuario.cedula,
            //         nombres: this.usuario.nombres,
            //         apellidos: this.usuario.apellidos,
            //         email: this.usuario.email,
            //         idgrupo: this.usuario.id_group,
            //         token: localStorage.tk,
            //         fecha: fecha,
            //         hora: hora,
            //     })
            //     .then(function (response) {
            //         console.log(me.response);
            //     })
            //     .catch(function (error) {});
            this.saveHistoricoVisitas();
        },
    };
    </script>
