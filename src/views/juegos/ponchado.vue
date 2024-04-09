<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup title="Guardar calificación" :active.sync="modalCalificacion">
        <div v-if="previsualizar === 'previsualizar'">
            <h5>Este juego esta en modo de previsualización, no se permite calificar.</h5>
        </div>
        <div v-else>
            <h5 class="mb-base p-5">¿Desea enviar esta calificación, para que registre su docente?</h5>
            <vs-button size="small" style="display: inline-block;font-size: 13px;" class="m-1" type="relief" color="primary" @click="guardarCalificacion()">Si, enviar calificación</vs-button>
            <vs-button size="small" style="display: inline-block;font-size: 13px;" class="m-1" type="relief" color="danger" @click="recargar()">No, intentar nuevamente </vs-button>
        </div>
    </vs-popup>
    <vs-popup title="Ficha técnica" :active.sync="popUpFicha">
        <div v-for="(itemF,$indexF) in infoJuego" :key="$indexF">
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Nombre del juego:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.nombre_juego}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Asignatura:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.temas[0].nombreasignatura}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Bloque curricular:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.bloque_curricular}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Grado:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.grado}}
                </div>
            </div>
            <!--<div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Unidad:</b>
                </div>
                <div v-for="(itemU,$indexU) in itemF.temas" :key="$indexU">
                    {{itemU.unidad}}
                </div>
            </div>-->
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Tema:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    <div v-for="(itemT,$indexT) in itemF.temas" :key="$indexT">
                        Unidad {{itemT.unidad}}<br>
                        {{itemT.nombre_tema}}<br><br>
                    </div>
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Destreza(s) que apoya:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.destrezas}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Habilidades que desarrolla:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.habilidades}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Intencion didáctica:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.intencion_didactica}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Consigna o sugerencia metodológica:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.consigna}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Consideraciones previas:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.consideraciones}}
                </div>
            </div>
            <div class="vx-row w-full mb-base">
                <div class="vx-col sm:w-1/3 w-full" align="right">
                    <b>Elaborado por:</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full" align="left">
                    {{itemF.elaborado_por}}
                </div>
            </div>
        </div>
    </vs-popup>
    <!-- <div v-if="juego_realizado===false"> -->
    <div>
        <div v-for="(item,$index) in infoJuego" :key="$index" class="mt-4">
            <vx-card>
                <h3>{{item.nombre_juego}}</h3>
                <div class="vx-row text-left">
                    <div class="vx-col sm:w-1/2">
                        <h5 class="text-left">
                            <small>Tiempo restante:</small> <b :class="colorTexto"> {{reloj}}</b>
                        </h5>
                    </div>
                    <div class="vx-col sm:w-1/2 text-right">
                        <vs-button class="text-right" size="small" color="primary" type="border" @click="popUpFicha=true" style="padding: 5px 10px 5px 10px; font-size: 14px;">Ficha</vs-button>
                    </div>
                </div>
            </vx-card>
            <section v-if="inicio_fin">
                <div class="vx-row mismo-alto">
                    <div class="vx-col sm:w-2/3">
                        <vx-card class="mt-4">
                            <div class="text-left">Palabras restantes: <b> {{a_jugar}}</b> </div>
                            <div class="v-row text-left">
                                <vs-progress :percent="porcentaje_aciertos" color="success"> {{porcentaje_aciertos}}% </vs-progress>
                                <vs-progress :percent="porcentaje_errores" color="danger"> {{porcentaje_errores}}% </vs-progress>
                            </div>
                            <div class="text-center mt-4 mb-base">
                                <h4 class="">{{palabra_descripcion}}</h4>
                            </div>
                            <div class="row ponchado">
                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                    <div class="cadena-escritura animate__animated"></div>
                                    <h2 class="text-center m-3">
                                        <span v-for="(p,index) in palabra_escrita" :key="index">
                                            <vs-button v-if="p != '*'" type="border" class="letra pt-2 pb-2 pr-4 pl-4 m-1">{{p}}</vs-button>
                                            <span v-else> - </span>
                                        </span>
                                    </h2>
                                    <div class="vx-row text-center">
                                        <div class="vx-col md:w-1/1 ml-6 mr-6 mb-base">
                                            <span v-for="(itemL, indexL) in letras" :key="indexL">
                                                <vs-button size="small" style="display: inline-block;font-size: 13px;" class="m-1" type="gradient" color="primary" @click="comparar(itemL, indexL)" :class="{success:color_botones[indexL] == true }" :disabled="botones[indexL]">
                                                    {{itemL}}
                                                </vs-button>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-col sm:w-1/3 text-center">
                        <vx-card class="p-5 mt-4">
                            <div class="text-right">
                                <vs-button type="border" v-if="boton_siguiente" @click="f_siguiente">Siguiente Palabra</vs-button>
                            </div>
                            <div class="w-full container-ponchado" align="center">
                                <img class="medida-imagen imagen-ponchado" v-bind:src="$data_url+'archivos/images/imagenes_juegos/ponchado/'+imgUrl+'.png'">
                            </div>
                        </vx-card>
                    </div>
                </div>
            </section>
            <section v-else>
                <vx-card class="mt-3">

                    <div align="center" class="mt-4">
                        <vs-table stripe pagination max-items="25" search :data="encontradas_total">
                            <template slot="header">
                                <h3>Resultados</h3>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="nombre_evaluacion">Palabra</vs-th>
                                <vs-th sort-key="fecha">Encontrada</vs-th>
                                <vs-th sort-key="fecha">Puntaje</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].palabra">
                                        {{ data[indextr].palabra }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].presionadas">
                                        {{ data[indextr].presionadas }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].presionadas">
                                        {{ data[indextr].calificacion }}
                                    </vs-td>
                                </vs-tr>
                                <vs-tr>
                                    <vs-td> </vs-td>
                                    <vs-td><b>Promedio</b></vs-td>
                                    <vs-td><b>{{total_calificacion}} </b></vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <p>Palabras a responder: <b>{{total_jugar}} </b></p>
                    <p>Palabras completadas: <b>{{encontradas_total.length}} </b></p>
                </vx-card>

            </section>
        </div>
    </div>

    <!-- <div v-else class="text-center">
        <vx-card>
            Este juego ya fue realizado.
        </vx-card>
    </div> -->
</div>
</template>

<script src="https://code.jquery.com/jquery-3.5.0.js"></script><script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import $ from "jquery"
Vue.filter('upper', function (value) {
    return value.toUpperCase()
})
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            popUpFicha: false,
            infoJuego: [],
            total_jugar: 0,
            a_jugar: 5,
            letras: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Á", "É", "Í", "Ó", "Ú", '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            presionado: 'gradient',
            estado: true,
            tmp: '',
            palabra_buscar: '',
            presionada: '',
            reloj: '',
            x: null,
            game: true,
            win: false,
            lost: false,
            contador_aciertos: 0,
            errores: 7, //maximo de errores permitidos en cada palabra -  imagenes para el ahorcado
            contador_errores: 0,
            aleatorio: 0,
            palabra_escrita: [],
            botones: [],
            color_botones: [],
            grupo_palabras_total: [],
            grupo_descripcion: [],
            grupo_palabras: [],
            grupo_george: [],
            contadorFlag: 0,
            palabra_descripcion: '',
            palabra_longitud: 0,
            encontradas_total: [],
            inicio_fin: true,
            boton_siguiente: false,
            rel: null,
            segundos: 0,
            minutos: 0,
            x: null,
            porcentaje_aciertos: 0,
            porcentaje_errores: 0,
            calificacion_tmp: 0,
            total_calificacion: 0,
            colorTexto: 'negro',
            usuario: [],
            calificaciones: [],
            imgUrl: 'ah1',
            imgExtension: '.png',
            id_juego: '',
            juego_realizado: false,
            modalCalificacion: false,
            codigo_curso: '',
            previsualizar: '',
        }
    },
    mounted() {
        this.getDatos();
    },
    created() {
        let me = this;
        me.id_juego = me.$route.params.id
        me.previsualizar = me.$route.params.codigo
        me.codigo_curso = JSON.parse(localStorage.getItem('curso_juego'));
        // console.log( me.codigo_curso.codigo )
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        //if (me.usuario.id_group === 4) {
        let formData = new FormData();
        formData.append('id_juego', me.id_juego);
        formData.append('idusuario', me.usuario.idusuario);
        this.$http.post(this.$server_url+'calificacion_estudiante', formData)
            .then(res => {
                me.calificaciones = res.data;
                if (me.calificaciones.length > 0) {
                    me.juego_realizado = true
                    me.$vs.notify({
                        text: 'Nuevo intento',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    //me.$router.go(-1);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        //}
    },
    methods: {
        getDatos() {
            let me = this;
            me.inicio_fin = true;
            me.imgUrl = 'ah1';
            me.porcentaje_aciertos = 0;
            me.porcentaje_errores = 0;
            me.boton_siguiente = false;
            me.game = true;
            me.win = false;
            me.lost = false;
            me.palabra_escrita = [];
            me.botones = [];
            me.color_botones = [];
            me.contador_aciertos = 0;
            me.contador_errores = 0;
            me.palabra_longitud = 0;
            window.$(".imagen-ponchado-ganar").hide();
            me.$vs.loading()

            this.$http.get(this.$server_url+'juego_y_contenido/' + me.id_juego)
                .then(res => {
                    me.infoJuego = res.data.items;
                    // console.log(me.infoJuego[0])
                    me.grupo_palabras_total = me.infoJuego[0].preguntas
                    me.calificacion_tmp = me.infoJuego[0].puntos
                    for (let i = 0; i < me.grupo_palabras_total.length; i++) {
                        me.grupo_palabras.push(me.grupo_palabras_total[i].respuesta)
                        me.grupo_descripcion.push(me.grupo_palabras_total[i].pregunta)
                    }
                    me.$vs.loading.close()
                    if (this.a_jugar > this.grupo_palabras_total.length) {
                        this.a_jugar = this.grupo_palabras_total.length
                    }
                    this.total_jugar = this.a_jugar
                    this.f_tiempo(this.infoJuego[0].duracion);
                    this.generarAleatorio();
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()

                })
        },
        generarAleatorio() {
            if (this.a_jugar == 0) {
                clearInterval(this.x);
                this.modalCalificacion = true;
                return this.inicio_fin = false
            }

            window.$(".imagen-ponchado").show('slow');
            window.$(".imagen-ponchado").removeClass('gana-palabra-ponchado')
            this.imgUrl = 'ah1';
            this.porcentaje_aciertos = 0;
            this.porcentaje_errores = 0;
            this.boton_siguiente = false;
            this.game = true;
            this.win = false;
            this.lost = false;
            this.palabra_escrita = [];
            this.botones = [];
            this.color_botones = [];
            this.contador_aciertos = 0;
            this.contador_errores = 0;
            this.palabra_longitud = 0;
            this.aleatorio = Math.floor(Math.random() * this.grupo_palabras.length)
            // console.log(this.grupo_palabras)
            for (let i = 0; i < this.grupo_palabras[this.aleatorio].length; i++) {
                if (this.grupo_palabras[this.aleatorio][i] != " ") {
                    this.palabra_longitud++;
                    //calcular la longitud de la palabra sin espacios en blanco, para los aciertos
                }
                if (this.grupo_palabras[this.aleatorio][i] == " ") {
                    this.palabra_escrita.push('*')
                } else {
                    this.palabra_escrita.push('')
                }
            }

            this.palabra_buscar = this.mayusculas(this.grupo_palabras[this.aleatorio])
            this.palabra_descripcion = this.grupo_descripcion[this.aleatorio]
            console.log(this.palabra_buscar, this.grupo_palabras)
        },
        comparar(caracter, posicion) {

            if (this.game) {
                this.contadorFlag = 0;
                this.botones[posicion] = true;
                for (let i = 0; i < this.palabra_buscar.length; i++) {
                    if (caracter == this.palabra_buscar[i]) {
                        this.palabra_escrita[i] = caracter
                        this.contador_aciertos++;
                        this.porcentaje_aciertos = (this.contador_aciertos * 100) / this.palabra_longitud
                        this.contadorFlag++
                    }
                }
                // console.log( this.palabra_escrita )
                if (this.contadorFlag == 0) {
                    window.$(".imagen-ponchado").hide()
                    this.contador_errores++;
                    this.imgUrl = 'ah' + (this.contador_errores + 1);
                    this.porcentaje_errores = (this.contador_errores * 100) / this.errores
                    window.$(".imagen-ponchado").animate({
                        height: 'toggle',
                        opacity: 'toggle'
                    }, 'slow');
                }
                if (this.contador_aciertos == this.palabra_longitud) {
                    window.$(".imagen-ponchado").hide()
                    this.imgUrl = 'ganar';
                    window.$(".imagen-ponchado").addClass('gana-palabra-ponchado')
                    this.win = true
                    this.game = false;
                    this.$vs.notify({
                        text: 'Lo conseguiste, continua así',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    window.$(".imagen-ponchado").animate({
                        height: 'toggle',
                        opacity: 'toggle'
                    }, 'slow');
                }
                if (this.contador_errores == this.errores) {
                    this.lost = true;
                    this.game = false;
                    this.$vs.notify({
                        text: 'ohhh, más suerte la próxima',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
                if (!this.game) {
                    this.encontradas_total.push({
                        palabra: this.palabra_buscar,
                        presionadas: this.palabra_escrita.join(""),
                        calificacion: ((this.contador_aciertos * this.calificacion_tmp) / this.palabra_longitud).toFixed(2)
                    })
                    this.grupo_palabras.splice(this.aleatorio, 1)
                    this.grupo_descripcion.splice(this.aleatorio, 1)
                    this.boton_siguiente = true;
                    this.total_calificacion = 0;
                    for (let index = 0; index < this.encontradas_total.length; index++) {
                        this.total_calificacion += parseFloat(this.encontradas_total[index].calificacion);
                        console.log(this.encontradas_total[index].calificacion)
                    }
                    this.total_calificacion = (this.total_calificacion / this.encontradas_total.length).toFixed(2);
                    console.log(this.total_calificacion, this.encontradas_total.length)
                }

            }
        },
        f_siguiente() {
            this.a_jugar--;
            this.generarAleatorio();
        },
        mayusculas(value) {
            if (value >= 0 && value <= 9) {
                console.log('son numeritos')
                return value;
            } else {
                return value.toUpperCase()
            }
        },
        f_tiempo(numero) {
            let me = this;
            let n = numero * 60,
                now, distance,
                hours,
                minutes,
                seconds,
                conteoSegundos = 1000;
            me.x = setInterval(function () {
                n--;
                now = n * 1000;
                // Find the distance between now and the count down date
                distance = n + now;

                // Time calculations for days, hours, minutes and seconds
                // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                me.reloj = (hours + "h " + minutes + "m " + seconds + "s ");
                // If the count down is over, write some text 
                if (distance < 1) {
                    clearInterval(me.x);
                    me.colorTexto = 'rojo';
                    me.modalCalificacion = true;
                    me.boton_siguiente = false;
                    me.$vs.notify({
                        text: 'Se agotó el tiempo.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.inicio_fin = false
                }
            }, conteoSegundos);
        },
        guardarCalificacion() {
            let me = this;
            me.modalCalificacion = false;
            me.boton_siguiente = false;
            // console.log(me.id_juego,
            //     me.codigo_curso.codigo,
            //     me.usuario.idusuario,
            //     me.total_calificacion)
            me.$vs.loading();

            let formData1 = new FormData();
            formData1.append('id_juego', me.id_juego);
            formData1.append('codigo_curso', me.codigo_curso.codigo);
            formData1.append('id_usuario', me.usuario.idusuario);
            formData1.append('calificacion', me.total_calificacion);
            this.$http.post(this.$server_url+'j_guardar_calificacion', formData1).then(res => {
                    me.$vs.notify({
                        text: 'Calificación enviada a su docente, correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        recargar() {
            window.location.reload()
        }
    }
}
</script>

<style>
.stars {
    display: inline-block;
    /* text-shadow: 2px 2px 0 #AAA; */
    font-size: 4em;
}

.alfabeto,
.estrellas {
    /*max-width: 500px;*/
    height: auto;
    /*margin: 0 auto;*/
    padding: 20px;
    line-height: 30px;
    text-align: center;
}

.estrellas {
    color: #444;
}

.rojo {
    color: red;
}

.negro {
    color: #444;
}

.container-ponchado {
    height: 310px;
    ;
}

.medida-imagen {
    width: 175px;
    height: 300px;
}

.gana-palabra-ponchado {
    animation: rotating 2s linear infinite alternate;
    mix-blend-mode: multiply;
}

@-webkit-keyframes rotating {
    0% {
        -webkit-transform: rotate(0deg);
    }

    25% {
        -webkit-transform: rotate(3deg);
    }

    50% {
        -webkit-transform: rotate(0deg);
    }

    75% {
        -webkit-transform: rotate(-3deg);
    }

    100% {
        -webkit-transform: rotate(0deg);
    }
}
</style>
