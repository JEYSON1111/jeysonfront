<template>
    <div class="h-screen flex w-full" id="page-login">
        <div class="w-full sm:m-0 m-4">
            <vx-card>

                <div slot="no-body" class="full-page-bg-color">
                    <div class="container">
                        <div class="forms-container">
                            <div class="signin-signup">
                            <form class="sign-in-form">
                              <!-- <div>
                                <p>Contador: {{ contador }}</p>
                                <button @click="incrementarContador">Incrementar</button>
                              </div> -->
                                <h2 class="title font-bold">Bienvenidos</h2>
                                <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input type="text" v-model="user.email" placeholder="Usuario" />
                                </div>
                                <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" v-on:keyup.enter="login" v-model="user.password" placeholder="Contraseña" />
                                </div>
                                <span @click="login" style="cursor: pointer;">
                                    <input type="button" value="Iniciar sesión" class="btn solid" />
                                </span>
                                <div class="text-danger p-1 text-sm text-center mx-auto justify-center">{{ errors }}</div>
                                <div class="text-right p-3" style="margin-top: -10px;">
                                    <router-link to="/restaurar">Olvidé mi contraseña</router-link>
                                </div>
                                <p class="social-text" style="margin-top: -5px;">O accede a nuestros servicios</p>
                                <div class="social-media mt-2">
                                  <div class="flex" style="flex-direction:column;width:50%;">
                                      <a class="social-icon" style="cursor: pointer;" @click="popupPreguntasFaq=true">
                                          <img width="50" height="50" style="border-radius: 50%;box-shadow: 5px 10px 15px #f2f2f2;" src="https://cdn-icons-png.flaticon.com/512/9210/9210850.png"/>
                                      </a>
                                    <span class="mt-2" style="font-size:12px;">Preguntas Frecuentes</span>
                                  </div>
                                  <div class="flex" style="flex-direction:column;width:50%;">
                                      <a class="social-icon" style="cursor: pointer;" @click="irWebinar()">
                                        <img width="50" height="50" style="border-radius: 50%;box-shadow: 5px 10px 15px #f2f2f2;" src="https://cdn-icons-png.flaticon.com/512/2475/2475180.png"/>
                                      </a>
                                    <span class="mt-2" style="font-size:12px;">Webinars</span>
                                  </div>
                                  <div class="flex" style="flex-direction:column;width:50%;">
                                      <a class="social-icon" style="cursor: pointer;" @click="irRecursos()">
                                          <img width="50" height="50" style="border-radius: 50%;box-shadow: 5px 10px 15px #f2f2f2;" src="https://cdn-icons-png.flaticon.com/128/4714/4714654.png"/>
                                      </a>
                                    <span class="mt-2" style="font-size:12px;">Recursos</span>
                                  </div>
                                </div>
                            </form>
                            <form  class="sign-up-form">
                                <!-- <Registro/> -->
                                <h2 class="title">Registro</h2>
                                <RegistroEstudiante @nuevoUser="changeHandle" v-if="showRegistro == 1"/>
                                <!-- <div class="input-field">
                                    <i class="fas fa-user"></i>
                                    <input type="text" placeholder="Username" />
                                </div>
                                <div class="input-field">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" placeholder="Email" />
                                </div>
                                <div class="input-field">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" placeholder="Password" />
                                </div>
                                <input type="submit" class="btn" value="Registrame" />
                                <p class="social-text" style="margin-top: -5px;">O accede a nuestros servicios</p>
                                <div class="social-media mt-2">
                                    <vx-tooltip style="display: inline-block;" text="Preguntas Frecuentes" position="top" color="primary">
                                        <a class="social-icon" @click="popupPreguntasFaq=true">
                                            <img width="50" style="border-radius: 50%;box-shadow: 5px 10px 15px #f2f2f2;" src="https://cdn-icons-png.flaticon.com/512/9210/9210850.png"/>
                                        </a>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="Webinars" position="top" color="primary">
                                        <a class="social-icon" @click="irWebinar()">
                                            <img width="50" style="border-radius: 50%;box-shadow: 5px 10px 15px #f2f2f2;" src="https://cdn-icons-png.flaticon.com/512/2475/2475180.png"/>
                                        </a>
                                    </vx-tooltip>
                                </div> -->
                            </form>
                            </div>
                        </div>
                        <div class="panels-container">
                            <div class="panel left-panel">
                                <div class="content">
                                    <h3 class="text-white text-3xl">Eres estudiante nuevo/a ?</h3>
                                    <p>
                                    Registrate para acceder a las tareas, evaluaciones, cursos,
                                    proyectos!
                                    </p>
                                    <button class="btn transparent" @click="showRegistro=1;sign_up_btn()" id="sign-up-btn">
                                    Registrarme
                                    </button>
                                </div>
                                <div class="imagen">
                                    <img src="./img/log.svg" class="image" alt="" />
                                </div>
                            </div>
                            <div class="panel right-panel">
                                <div class="content">
                                    <h3 class="text-white text-3xl">Bienvenido a Prolipa</h3>
                                    <p>
                                    Si ya tienes una cuenta inicia sesión, disfruta del contenido que tenemos para ti!
                                    </p>
                                    <button class="btn transparent" @click="sign_in_btn()"  id="sign-in-btn">
                                    Iniciar sesión
                                    </button>
                                </div>
                                <div class="imagen">
                                    <img src="./img/register.svg" class="image" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <!--Modales-->
        <!--Modal de Preguntas Frecuentes-->
        <div class="centerx">
            <vs-popup
            fullscreen
             title="Preguntas Frecuentes" :active.sync="popupPreguntasFaq">
                <div>
                    <vs-collapse accordion >
                      <vs-collapse-item :key="indextr" v-for="(item, indextr) in preguntasFaq">
                        <div slot="header" style="color:#4EA6EA;font-weight:bold;font-size:25px;">
                          {{ item.pregunta }}
                        </div>
                        <p v-text="item.descripcion">
                        </p>
                        <br/>
                        <div>
                          <video-embed :src="item.video"></video-embed>
                        </div>
                        <br>
                        <div v-if="item.url == null">
                        </div>
                        <div v-else>
                          <img width="700" :src="$server_url+'preguntas_frecuentes/'+item.url"/>
                        </div>
                        <br><br>
                      </vs-collapse-item>
                    </vs-collapse>
                </div>
            </vs-popup>
        </div>
    </div>
    </template>
    <script>
    import RegistroEstudiante from './RegistroEstudiante.vue'
    import {
        mapState,
        mapActions
    } from 'vuex'
    import Vue from 'vue'
    import Embed from 'v-video-embed'
    // global register
    Vue.use(Embed);
    import Carousel from './components/carousel/Carousel.vue';
    import CarouselSlide from './components/carousel/CarouselSlide';
    export default {
        data() {
            return {
                popupPreguntasFaq: false,
                user: {
                    email: '',
                    password: '',
                },
                checkbox_remember_me: false,
                popupIrRegistro: false,
                slides: 's1.jpg',
                inc: 1,
                rdn: 1,
                x: true,
                repeticiones: 30,
                anterior: '',
                cadena: '',
                preguntasFaq: [],
                showRegistro:0,
            }
        },
        components: {
            Carousel: Carousel,
            CarouselSlide: CarouselSlide,
            RegistroEstudiante,
        },
        computed: {
            ...mapState(['usuario']),
            ...mapState(['auth']),
            ...mapState(['errors']),
            ...mapState(['contador'])
        },
        mounted() {
          this.getUsuario();
          // this.slides = 's' + Math.ceil(Math.random() * 6) + '.jpg';
          // this.getSlides();
          this.preguntasfaq();
        },
        methods: {
          // ...mapActions(['incrementar','prueba']),
          incrementarContador(e) {
            e.preventDefault();
            // this.incrementar(); // Llamada a la acción utilizando mapActions
            // this.prueba()
            this.$store.dispatch('incrementar',"variable :V")
            this.$store.dispatch('prueba')
          },
          changeHandle(e){
              const container = document.querySelector(".container");
              container.classList.remove("sign-up-mode");
          },
          sign_in_btn(){
          const container = document.querySelector(".container");
          container.classList.remove("sign-up-mode");
          },
          sign_up_btn(){
              const container = document.querySelector(".container");
              container.classList.add("sign-up-mode");
          },
          irWebinar() {
            let route = this.$router.resolve({
                path: '/webinar/presentacion'
            });

            window.open(route.href, '_blank');
          },
            irRecursos(){
              let me = this;
              let ruta = "https://plataforma.prolipadigital.com.ec/v/eyJpdiI6IkNCNkFjYU1B"
              window.open(ruta,'_blank')
            },
            //traer las preguntas frecuentes
            async preguntasfaq() {
                let me = this;
                await this.$http.get(this.$server_url + "preguntasfaq")
                    .then(function (response) {
                        me.preguntasFaq = response.data
                    })
                    .catch(function (error) {
                        console.log(error)
                    });

            },
            async getUsuario() {
                await this.$store.dispatch('getUsuario', this.user);
                if (this.$store.state.auth == true) {
                    return await this.$router.push('/home');
                } else {

                }
            },
            async login(e) {
              let me = this;
              e.preventDefault();
              if(me.user.email.trim() == "" || me.user.password.trim() == ""){
                  me.$vs.notify({
                  text:'Por favor ingrese su usuario y su password',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return
              }
              await this.$store.dispatch('login', this.user);
              if (localStorage.getItem("bloqueoUser") == "yes") {
                  this.$store.dispatch('logout')
                  // alert("bloqueado")
                  me.$vs.notify({
                      text: 'Su usuario se encuentra bloqueado, por favor envíe un correo a soporte@prolipa.com.ec, para reestablecer su acceso',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-check',
                      time: 8000
                  })
                  return await this.$router.push('/');
              } else {
                if(me.auth){
                  return await this.$router.push('/home');
                }
                // return await this.$router.push('/home');
              }
            },
            getSlides() {
              let me = this;
              // console.log('slides')
              me.inc++;
              me.rdn = Math.ceil(Math.random() * 6);
              me.slides = 's' + me.rdn + '.jpg';
            },
        },
    }
    </script>

<style scoped>
    *{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h2,h3,
input {
    font-family: 'Inter', sans-serif;
}

.container {
  width: 100%;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  min-width: 100vw;
  background-color: #fff;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
  opacity: 0.5;
}

.btn {
  width: 150px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  /* width: 100%!important; */
  width: 700px;
  /* height: 700px; */
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}
@media (max-width: 1024px) {
  .image{
    width: 600px;
  }
}
@media (max-width: 912px) {
  .image{
    width: 500px;
  }
}
@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }
  .imagen{
        display: none;
    }
  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
@media(max-width: 375px) {
    .imagen{
        display: none;
    }
    .tab{
        z-index: 100000;
    }
    .right-panel{
        display: none;
    }
    /* .container:before {
    content: "";
    position: none;
    height: 2000px;
    width: 2000px;
    top: -10%;
    right: 48%;
    transform: translateY(-50%);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
    z-index: 6;
    } */
}
@media(max-width: 360px) {
    .imagen{
        display: none;
    }
    .tab{
        z-index: 100000;
    }
    .right-panel{
        display: none;
    }
    /* .container:before {
    content: "";
    position: none;
    height: 2000px;
    width: 2000px;
    top: -10%;
    right: 48%;
    transform: translateY(-50%);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
    z-index: 6;
    } */
}
</style>
