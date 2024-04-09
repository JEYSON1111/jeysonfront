<template>
<div class="vx-col md:w-full w-full mb-base">
    <div class="j_juego_contenedor" v-if="!resultados">
        <vx-card :style="'background:'+colores_game[op_cl_game].bg_card">
            <div>
                <div class="vx-row">
                    <!-- titulo -->
                    <div class="vx-col xs:w-full sm:w-2/3 p-2 bri-4" :style="'background:'+colores_game[op_cl_game].bg_titulo">
                        <h3 v-if="preguntas[0].pregunta != undefined" :style="'color:'+colores_game[op_cl_game].txt_color_titulo">
                            <vs-button style="display:inline-block" color="success" icon-pack="feather" icon="icon-bookmark"></vs-button>
                            {{preguntas[0].pregunta.nombre_juego}}
                        </h3>
                    </div>
                    <div class="vx-col xs:w-2/3 sm:w-1/3 text-right p-2 pl-5 pr-5 brd-4" :style="'background:'+colores_game[op_cl_game].bg_color">
                        <transition name="slide-fade">
                            <div class="cj-radio pr-6" :style="'background:'+colores_game[op_cl_game].bg_color1">
                                <h1 class="numero text-warning">
                                    <span> <i> {{numero}} </i></span> <span class="feather icon-star " icon-pack="feather" icon="icon-sun" type="border" color="warning"></span>
                                </h1>
                                <p :style="'color:'+colores_game[op_cl_game].txt_color_turno">pregunta: {{turno+1}} / {{t_preguntas}} </p>
                            </div>
                        </transition>
                    </div>
                    <!-- fin titulo -->
                    <div class="vx-col sm:w-full mt-4 text-right">
                        <vs-button color="warning" size="small" @click="modalFicha=true">Ficha técnica</vs-button>
                    </div>
                    <!-- pregunta -->
                    <div class="vx-col sm:w-full p-4 text-white">
                        <vx-card class="mb-2 pregunta" v-if="!resultados">
                            <transition name="slide-fade">
                                <div class="vx-col w-full m-5" v-if="show">
                                    <center>
                                        <h2 :style="'color:'+colores_game[op_cl_game].txt_color_pregunta" v-if="preguntas[turno].pregunta.pregunta != undefined" v-html="preguntas[turno].pregunta.pregunta"> </h2>
                                        <p class="m-2" v-if="preguntas[turno].pregunta.imagen != undefined"> <img @click="mostrarImagen(preguntas[turno].pregunta.imagen)" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+preguntas[turno].pregunta.imagen" alt="" class="alto-maximo card-img-top img-responsive"> </p>
                                    </center>
                                </div>
                            </transition>
                        </vx-card>
                    </div>
                    <!-- fin pregunta -->
                    <!-- cards-opciones -->
                    <div class="vx-col sm:w-full mb-2 respuestas" v-if="!resultados">
                        <transition name="slide-fade">
                            <div class="vx-col w-full mx-auto" v-if="show==true">
                                <span v-if="total_opciones>1"><i> seleccione <b>{{msj_opciones_seleccion }}</b> </i> </span>
                                <center>
                                    <div class="contenedor-df-1 vx-row">
                                        <div class="vx-col enlinea sm:w-1/2 p-4" v-for="(item, index) in preguntas[turno].opciones" :key="index" @click="getOpcion(item)" :class="pintarSeleccion" :id="'op'+item.id_opcion_contenido">
                                            <vx-card class="df-1 m-1">
                                                <div class="triangulo"></div>
                                                <div class="texto-num"> {{index+1}} </div>
                                                <div :style="'color:'+colores_game[op_cl_game].txt_color_opcion" class="size-text-1 p-4">
                                                    {{item.nombre_opcion}}
                                                </div>
                                                <div>
                                                    <center>
                                                        <img v-if="item.imagen_opcion != undefined" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+item.imagen_opcion" class="card-img-top img-opcion">
                                                    </center>
                                                </div>
                                            </vx-card>
                                        </div>
                                    </div>
                                </center>
                            </div>
                        </transition>
                    </div>
                    <!-- fin cards-opciones -->
                </div>
            </div>
        </vx-card>
    </div>

    <!-- <vx-card class="mb-2 respuestas" v-if="!resultados">
        <transition name="slide-fade">
            <div class="vx-col w-full mx-auto mb-base" v-if="show==true">
                <span> seleccione <b>{{msj_opciones_seleccion }}</b></span>
                <center>
                    <div class="columnDiv m-2 p-3" v-for="(item, index) in preguntas[turno].opciones" :key="index" @click="getOpcion(item)" :class="pintarSeleccion" :id="'op'+item.id_opcion_contenido">
                        <div class="contentDiv" v-if="item.imagen_opcion != undefined">
                            <div>
                                {{item.nombre_opcion}}
                            </div>
                            <div>
                                <center>
                                    <img v-if="item.imagen_opcion != undefined" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+item.imagen_opcion" class="card-img-top img-opcion">
                                </center>
                            </div>
                        </div>
                        <div v-else>
                            <div style="font-size: 20px;">
                                {{item.nombre_opcion}}
                            </div>
                            <div>
                                <center>
                                    <img v-if="item.imagen_opcion != undefined" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+item.imagen_opcion" class="card-img-top img-opcion">
                                </center>
                            </div>
                        </div>
                    </div>

                </center>
            </div>
        </transition>
    </vx-card> -->
    <vx-card class="mb-2 resultados j_juego_contenedor" v-if="resultados">
        <vs-table stripe max-items="50" search pagination :data="arr_resultados">
            <template slot="thead">
                <vs-th width="40%" sort-key="pregunta">Pregunta</vs-th>
                <vs-th width="30" sort-key="descripcion">Respuesta</vs-th>
                <vs-th width="15%">Imagen</vs-th>
                <vs-th width="15%"></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].pregunta">
                        <span v-html="tr.pregunta"></span>
                    </vs-td>
                    <vs-td :data="data[indextr].descripcion">
                        {{data[indextr].descripcion}}
                    </vs-td>
                    <vs-td :data="data[indextr].rutaImagen">
                        <vs-avatar size="large" @click="mostrarImagen(data[indextr].rutaImagen)" v-if="data[indextr].rutaImagen != undefined" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+data[indextr].rutaImagen" />
                    </vs-td>
                    <vs-td :data="data[indextr].respuesta">
                        <span style="font-size:2em" v-if="data[indextr].respuesta == 0" class="text-danger feather icon icon-thumbs-down"> </span>
                        <span style="font-size:2em" v-if="data[indextr].respuesta == 1" class="text-success feather icon icon-thumbs-up"> </span>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
    <div>
        <transition name="slide-fade2">
            <div class="icono_ok" v-if="icono_ok">
                <span v-if="resp_ok" class="feather icon-thumbs-up text-success" type="border" color="success" style="font-size:4em"></span>
                <span v-if="resp_no" class="feather icon-thumbs-down text-danger" type="border" color="danger" style="font-size:4em"></span>
            </div>
        </transition>
    </div>

    <vs-popup title="Guardar calificación" :active.sync="modalCalificacion">
        <h5 class="mb-base p-5">¿Desea enviar esta calificación, para que registre su docente?</h5>
        <vs-button size="small" style="display: inline-block;font-size: 13px;" class="m-1" type="relief" color="primary" @click="guardarCalificacion()">Si, enviar calificación</vs-button>
        <vs-button size="small" style="display: inline-block;font-size: 13px;" class="m-1" type="relief" color="danger" @click="recargar()">No, intentar nuevamente </vs-button>
    </vs-popup>
    <!-- MODAL PARA MOSTRAR IMAGEN -->
    <vs-popup title="Imagen" title-color="primary" :active.sync="modalImagen" class="p-5">
        <center>
            <img v-if="imagen_a_mostrar != ''" height="350" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+imagen_a_mostrar">
        </center>
    </vs-popup>
    <vs-popup title="Ficha técnica" title-color="primary" :active.sync="modalFicha" class="p-5">
        <div class="vx-row">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Bloque curricular</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.bloque_curricular" class="mb-6 w-full"></p>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Grado</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.grado" class="mb-6 w-full"></p>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Destrezas</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.destrezas" class="mb-6 w-full"></p>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Habilidades</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.habilidades" class="mb-6 w-full"></p>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Elaborado por</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.elaborado_por" class="mb-6 w-full"></p>
            </div>
            <div class="vx-col sm:w-1/3 w-full">
                <span>Intencion didáctica</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.intencion_didactica" class="mb-6 w-full"></p>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Consigna</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.consigna" class="mb-6 w-full"></p>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Consideraciones</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <p v-html="preguntas[0].pregunta.consideraciones" class="mb-6 w-full"></p>
            </div>
        </div>
    </vs-popup>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            titulo_juego: '',
            descripcion_juego: '',
            titulo_categoria: '',
            compara: '',
            icono_ok: false,
            hayimagenes: false,
            numero: 0,
            juega: true,
            t_preguntas: 0,
            puntaje_total: 0,
            show: true,
            respuesta_correcta: '',
            num_incremento: 0,
            turno: 0,
            resultados: false,
            arr_resultados: [],
            mezclar_array: [],
            id_juego: '',
            preguntas: [{
                'pregunta': ''
            }],
            modalImagen: false,
            modalFicha: false,
            imagen_a_mostrar: '',
            modalCalificacion: false,
            total_calificacion: 0,
            total_opciones: 0,
            msj_opciones_seleccion: '',
            contar_click: 0,
            resp_ok: false,
            resp_no: false,
            codigo_curso: '',
            usuario: [],
            previsualizar: '',
            colores_game: [{
                'bg_titulo': '#343a40',
                'bg_card': '#ffeeb9',
                'bg_color': 'radial-gradient(circle, #84c366 0%, #16a966 50%)',
                'bg_color1': 'white',
                'txt_color_pregunta': '#000',
                'txt_color_titulo': '#fff',
                'txt_color_opcion': '#000',
                'txt_color_turno': '#000',
            }],
            op_cl_game: 0,
        }
    },
    created() {
        let me = this;
        me.previsualizar = me.$route.params.codigo
        let data_juego = JSON.parse(localStorage.getItem('curso_juego'));
        me.id_juego = me.$route.params.id
        // alert(data_juego.codigo)
        if (data_juego !== null) {
            me.codigo = data_juego.codigo
            me.codigo_curso = data_juego.codigo
        } else {
            me.codigo = '_'
            me.codigo_curso = '_'
        }

        me.getPreguntas();
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.respuesta_correcta = '1'; //especificar el valor de la respuesta correcta para comparar, 0 - 1 - OK - VERDADERO - SI - BIEN, etc
        me.puntaje_total = 1000; //puntaje total del juego
        me.num_incremento = 1; //numero a incrementar para el efecto del contador, si el puntaje es 10, el num_incremento deberia ser menor
        me.arr_resultados = [];
        me.titulo_juego = '';
        me.descripcion_juego = '';
        me.titulo_categoria = '';
    },
    methods: {
        f_randomico(a, b) {
            if (Math.random() < 0.5) return -1;
            else return 1;
        },
        getPreguntas() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'pregunta_opciones/' + me.id_juego)
                .then(res => {
                    if (res.data.items != undefined) {
                        me.preguntas = res.data.items;
                        me.t_preguntas = me.preguntas.length; //total de preguntas a jugar
                        me.preguntas.sort(me.f_randomico); //mezclar el array d preguntas, y mostrar preguntas aleatorias
                        me.f_contarOpciones();
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        f_contarOpciones() {
            let me = this;
            me.total_opciones = 0;
            me.contar_click = 0;
            for (let index = 0; index < me.preguntas[me.turno].opciones.length; index++) {
                if (me.preguntas[me.turno].opciones[index].tipo_opcion == 1) {
                    me.total_opciones++;
                    me.total_opciones > 1 ? me.msj_opciones_seleccion = me.total_opciones + ' opciones' : me.msj_opciones_seleccion = '1 opción';
                }
            }
        },
        pintarSeleccion(dato) {
            let me = this;
            window.$("#op" + dato).children().addClass('seleccionado');

        },
        getOpcion(item) {
            let me = this;
            let inc = 0; //inicia el contador
            let c_pregunta = me.puntaje_total / me.t_preguntas; //valor de cada pergunta
            if (me.total_opciones > 1) {
                //si la pregunta actual, tiene mas de 1 opcion correcta
                c_pregunta = c_pregunta / me.total_opciones
            }
            const contar = () => {
                inc++;
                if (inc < (c_pregunta + me.num_incremento)) {
                    me.numero += 1; //incrementar elpuntaje
                    setTimeout(contar, 2);
                } else {
                    me.numero; //mostrar el puntaje
                    me.total_calificacion = me.numero / 100;
                }
            }
            const avanzar = () => {
                setTimeout(function () {
                    me.show = false; //ocultar las opciones de respuestas
                    setTimeout(function () {
                        me.turno++;
                        if (me.turno < me.t_preguntas) {
                            me.f_contarOpciones()
                            me.show = true; //mostrar la opciones
                            me.juega = true; //habilitar las respuestas
                            me.preguntas[me.turno].opciones.sort(me.f_randomico); //mezclar las respuestas de la pregunta actual
                        } else {
                            me.resultados = true;
                            me.turno--;
                            me.modalCalificacion = true;
                        }
                    }, 1000);
                }, 1300);
            }
            if (me.juega) {
                me.contar_click++;
                me.icono_ok = true;
                me.resp_ok = false;
                me.resp_no = false;
                if (item.tipo_opcion == me.respuesta_correcta) {
                    //si tiene mas de una respuesta, no permitir dar clic en la opcion ya seleccionada
                    if (!window.$("#op" + item.id_opcion_contenido).children().hasClass('seleccionado')) {
                        me.resp_ok = true;
                        contar(); //si la respuestas es correcta, aumenta el puntaje
                    }
                } else {
                    me.resp_no = true;
                }
                if (!window.$("#op" + item.id_opcion_contenido).children().hasClass('seleccionado')) {
                    me.pintarSeleccion(item.id_opcion_contenido)
                }
                setTimeout(function () {
                    me.icono_ok = false;
                }, 1000);
                if (me.contar_click == me.total_opciones) {
                    me.juega = false; //bloquear las respuestas
                    avanzar();
                }
                // me.compara = item.id_opcion_contenido //pinta la casilla al dar clic, la id d la opcion desde la DB
                //guardar los resultados para el informe
                me.arr_resultados.push({
                    "pregunta": me.preguntas[me.turno].pregunta.pregunta,
                    "id": item.id_opcion_contenido,
                    "descripcion": item.nombre_opcion,
                    "respuesta": item.tipo_opcion,
                    "rutaImagen": item.imagen_opcion,
                });
            }
            // console.log(  me.id_juego,me.codigo_curso,me.usuario.idusuario,me.total_calificacion )
        },
        mostrarImagen(item) {
            let me = this;
            me.imagen_a_mostrar = item;
            me.modalImagen = true;
        },
        guardarCalificacion() {
            let me = this;
            me.modalCalificacion = false;
            // console.log(me.id_juego,
            //     me.codigo_curso.codigo,
            //     me.usuario.idusuario,
            //     me.total_calificacion)
            me.$vs.loading();

            let formData1 = new FormData();
            formData1.append('id_juego', me.id_juego);
            formData1.append('codigo_curso', me.codigo_curso);
            formData1.append('id_usuario', me.usuario.idusuario);
            formData1.append('calificacion', me.total_calificacion);
            this.$http.post(this.$server_url + 'j_guardar_calificacion', formData1)
                .then(res => {
                    console.log(res.data)
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

<style lang="css">
.alto-maximo {
    max-height: 200px;
}

.opt-seleccion {
    border: #c7c7c7 1px solid;
    border-radius: 10px;
    cursor: pointer;
    width: 260px;
    height: 220px;
    font-size: 1.2em;
    display: inline-block;

}

.opt-seleccion:hover {
    filter: brightness(1.2);
    border: #2b2525 2px solid;
    box-sizing: inherit
}

.seleccionado:hover {
    filter: none;
}

.seleccionado {
    background-color: #84c366;
    cursor: initial;
    color: aliceblue;
}
.img-opcion {
    max-height: 140px;
    max-width: 210px;
    mix-blend-mode: multiply;
}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active below version 2.1.8 */
    {
    transform: translateX(20px);
    opacity: 0;
}

.icono_ok {
    position: absolute;
    top: 40%;
    right: 10%;
}

/* //////////////////// */
.slide-fade2-enter-active {
    transition: all .3s ease;
}

.slide-fade2-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade2-enter,
.slide-fade2-leave-to

/* .slide-fade-leave-active below version 2.1.8 */
    {
    transform: translateY(50px);
    opacity: 0;
}

.contentDiv {
    font-weight: bold;
    text-align: center;
    width: 250px;
    height: 250px;
    font-family: 'Droid Sans', sans-serif;
    color: #666666;
    font-size: 12px;
    /* line-height: 22px; */
    overflow: hidden;
    text-overflow: ellipsis;
    border: rgb(170, 167, 167) solid 1px;
    border-radius: 12px;
    cursor: pointer;
}

.contentDiv:hover {
    filter: brightness(1.2);
    box-shadow: rgb(127, 129, 129) 0px 5px 5px 5px;
}

.columnDiv {
    display: inline-block;
    width: 200px;
    height: 150px;
    cursor: pointer;
    box-shadow: rgb(208, 218, 218) 0px 3px 3px 3px;
    margin: 10px;
}

.columnDiv:hover {
    box-shadow: rgb(185, 196, 196) 5px;
    transform: scale(1.1);
}

.j_juego_contenedor,
.caja-resultados {
    width: 90%;
    margin: 0 auto;
}

.ancho-caja {
    width: 85%;
    margin: 0 auto;

}

.contenedor-df-1 {
    display: inline-block;
}

.df-1 {
    cursor: pointer;
    box-shadow: rgb(208, 218, 218) 0px 3px 3px 3px;
    min-width: 200px;
    padding: 5px;
}

.df-1:hover {
    transform: scale(1.03);
}

.enlinea {
    display: inline-block;
}

.cj-radio {
    border-radius: 20px;
}

.brd-4 {
    border-radius: 0 10px 10px 0;
}

.bri-4 {
    border-radius: 10px 0 0 10px;
}

.triangulo {
    width: 0;
    height: 0;
    border-top: 70px solid #84c366;
    border-left: 70px solid transparent;
    position: absolute;
    z-index: 10;
    right: -4%;
    top: -11%;
}

.texto-num {
    position: absolute;
    z-index: 20;
    right: 0%;
    top: -9%;
    color: white;
    font-family: Arial;
    font-size: 1.4em;
}

.size-text-1 {
    font-size: 16px;
}
@media (max-width: 575px) {
  .df-1 {
    cursor: pointer;
    box-shadow: rgb(208, 218, 218) 0px 3px 3px 3px;
    min-width: 350px;
    padding: 5px;
}
}
@media (max-width: 440px) {
  .df-1 {
    cursor: pointer;
    box-shadow: rgb(208, 218, 218) 0px 3px 3px 3px;
    max-width: 75%px;
    padding: 5px;
}
}
</style>
