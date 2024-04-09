<template>
<div class="vx-col md:w-full w-full mt-2">
    <!-- columnas -->
    <div class="j_juego_contenedor">
        <vx-card class="pregunta" v-if="!resultados" :style="'background-color:'+colores_game[op_cl_game].bg_color">
            <div class="vx-row mb-3">
                <div class="vx-col sm:w-1/2 mt-2">
                    <vs-button color="primary" size="small" @click="modalFicha=true">Ficha técnica</vs-button>
                </div>
                <div class="vx-col sm:w-1/2 text-right">
                <vs-tooltip text="Color" color="dark"  position="right" >
                    <div @click="f_change_color_game(0)" v-if="op_cl_game==1" class="color0"></div>
                    <div @click="f_change_color_game(1)" v-if="op_cl_game==0" class="color1"></div>
                </vs-tooltip>
                </div>
            </div>
            <section>
                <div class="vx-row cabecera-juego">
                    <div class="vx-col xs:w-full sm:w-1/2">
                        <div class="b-radius p-4" :style="'background-color:' + colores_game[op_cl_game].bg_titulo">
                            <h3 :style="'color:'+colores_game[op_cl_game].txt_color_titulo"> <b> {{preguntas[0].pregunta.nombre_juego}} </b></h3>
                            <small class="p-1" :style="'color:'+colores_game[op_cl_game].txt_color_descripcion">
                                {{preguntas[turno].pregunta.descripcion_juego}}
                            </small>
                        </div>

                    </div>
                    <div class="vx-col xs:w-full d-lg-none hidden-lg sm:w-1/2">
                        <div class="vx-row w-full text-center">
                            <div class="vx-col mx-auto">
                                <span>
                                    <img style="display:inline" @click="f_comodin()" class="img-comodin img img-circle" :src="require(`@/assets/images/${colores_game[op_cl_game].img_comodin}.svg`)" />
                                </span>
                            </div>
                            <div class="vx-col text-center">
                                <h1 class="numero text-warning">
                                    <span> <i> {{numero}} </i></span> <span class="feather icon-star " icon-pack="feather" icon="icon-sun" type="border" color="warning"></span>
                                </h1>
                                <p :style="'color:'+colores_game[op_cl_game].txt_color_turno">pregunta: {{turno+1}} / {{t_preguntas}} </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-1fd">
                    <transition name="slide-fade">
                        <div class="m-5" v-if="show">
                            <div class="vx-row w-full mt-3 mx-auto">
                                <img src="@/assets/images/b1.svg" />
                            </div>
                            <div class="parent">
                                <div class="d-contenido vx-row contenido-juego">
                                    <div class="vx-col w-full  mb-6">
                                        <h3 class="p-3 d-pregunta" :style="'color:'+colores_game[op_cl_game].txt_color_pregunta" v-if="preguntas[turno].pregunta.pregunta != undefined" v-html="preguntas[turno].pregunta.pregunta"> </h3>
                                    </div>
                                    <div class="vx-col w-full">
                                        <transition name="slide-fade">
                                            <div class="vx-row">
                                                <div class="vx-col xs:w-full sm:w-2/3">
                                                    <div class="" v-for="(item, index) in preguntas[turno].opciones" :key="index" @click="getOpcion(item)" :class="pintarSeleccion" :id="'op'+item.id_opcion_contenido">
                                                        <div class="d-opcion t-size p-3" :style="'color:'+colores_game[op_cl_game].txt_color_opcion">
                                                            <span>{{letras[index]}} </span>
                                                            <span v-if="item.imagen_opcion != null">
                                                                <vs-avatar size="large" :src="$data_url+ruta_images+item.imagen_opcion" />
                                                            </span>
                                                            <span>{{item.nombre_opcion}}</span>
                                                            <!-- <span> - {{item.tipo_opcion}}</span> -->
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="vx-col sm:w-1/3" >
                                                    <!-- {{preguntas[turno].pregunta}} -->
                                                    <img @click="mostrarImagen(preguntas[turno].pregunta.imagen)" class="img-boy-game" v-if="preguntas[turno].pregunta.imagen != null " :src="$data_url+ruta_images+preguntas[turno].pregunta.imagen" />
                                                    <img class="img-boy-game" v-else src="@/assets/images/img_boy_game.svg" />
                                                </div>
                                            </div>
                                        </transition>
                                    </div>

                                </div>
                            </div>
                            <div class="vx-col w-full mx-auto">
                                <img src="@/assets/images/b2.svg" />
                            </div>
                        </div>
                    </transition>
                </div>
            </section>

            <!-- <div slot="footer">
                <vs-row vs-justify="flex-end">
                    <vs-button color="primary" type="gradient">View</vs-button>
                    <vs-button color="danger" type="gradient">Delete</vs-button>
                </vs-row>
            </div> -->

        </vx-card>
    </div>
    <!-- fin columnas -->
    <div class="caja-resultados">
        <vx-card class="mb-2 resultados" v-if="resultados">
            <h3 class="text-primary" v-if="preguntas[0].pregunta != undefined">
                <vs-button style="display:inline-block" color="success" icon-pack="feather" icon="icon-bookmark"></vs-button>
                <b> {{preguntas[0].pregunta.nombre_juego}} </b>
            </h3>
            <vs-table stripe max-items="50" search pagination :data="arr_resultados">
                <template slot="thead">
                    <vs-th width="40%" sort-key="pregunta">Pregunta</vs-th>
                    <vs-th sort-key="descripcion">Respuesta</vs-th>
                    <!-- <vs-th width="15%">Imagen</vs-th> -->
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
                        <!-- <vs-td :data="data[indextr].rutaImagen">
                        <vs-avatar size="large" @click="mostrarImagen(data[indextr].rutaImagen)" v-if="data[indextr].rutaImagen != undefined" :src="$data_url+ruta_images+data[indextr].rutaImagen" />
                    </vs-td> -->
                        <vs-td :data="data[indextr].respuesta">
                            <span style="font-size:2em" v-if="data[indextr].respuesta == 0" class="text-danger feather icon icon-thumbs-down"> </span>
                            <span style="font-size:2em" v-if="data[indextr].respuesta == 1" class="text-success feather icon icon-thumbs-up"> </span>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <div>
                <vs-alert v-if="msj_final != '' ">
                    {{msj_final}}
                </vs-alert>
            </div>
        </vx-card>
    </div>
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
            <img v-if="imagen_a_mostrar != ''" height="350" style="display:inline-block" :src="$data_url+ruta_images+imagen_a_mostrar">
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
            bg_azul: '#000046',
            letras: ['A)', 'B)', 'C)', 'D)'],
            ruta_images: 'archivos/images/imagenes_juegos/seleccionSimple/',
            msj_final: '',
            t_comodin: 1, //veces q puede usar el comodin 50/50 en el juego
            t_ctrl_comodin: 0,
            tmp_opciones_comodin: [], //respuestas para el comodin 50/50
            colores_game: [{
                'bg_titulo': '#f0fc03',
                'bg_color': '#000046',
                'img_comodin': '50-50',
                'txt_color_titulo': '#00009B',
                'txt_color_descripcion': '#00009B',
                'txt_color_pregunta': '#f0fc03',
                'txt_color_opcion': '#00009B',
                'txt_color_turno': '#ffffff',
            }, {
                'bg_titulo': '#00009B',
                'bg_color': '#fff',
                'img_comodin': '50-50-az',
                'txt_color_titulo': '#ffffff',
                'txt_color_descripcion': '#fff',
                'txt_color_pregunta': '#000',
                'txt_color_opcion': '#00009B',
                'txt_color_turno': '#00009B',
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
        me.op_cl_game = localStorage.getItem('op_color');
        if (me.op_cl_game == null) {
            me.op_cl_game = 0;
        }
        console.log(me.op_cl_game);
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
                    // console.log(res.data.items)
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
            me.preguntas[me.turno].opciones.sort(me.f_randomico);
            for (let index = 0; index < me.preguntas[me.turno].opciones.length; index++) {
                if (me.preguntas[me.turno].opciones[index].tipo_opcion == 1) {
                    me.total_opciones++;
                    me.total_opciones > 1 ? me.msj_opciones_seleccion = me.total_opciones + ' opciones' : me.msj_opciones_seleccion = '1 opción';
                }
            }
        },
        pintarSeleccion(dato) {
            let me = this;
            window.$("#op" + dato).children().removeClass('d-opcion').addClass('seleccionado');

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
                    // console.log( me.numero )
                    if (me.numero > 1000) {
                        me.numero = 1000
                    }
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
                    // console.log('correcta')
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
            if (me.total_calificacion > 10) {
                me.total_calificacion = 10
            }
            let formData1 = new FormData();
            formData1.append('id_juego', me.id_juego);
            formData1.append('codigo_curso', me.codigo_curso);
            formData1.append('id_usuario', me.usuario.idusuario);
            formData1.append('calificacion', me.total_calificacion);
            this.$http.post(this.$server_url + 'j_guardar_calificacion', formData1)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Calificación enviada a su docente, correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.msj_final = 'Calificación enviada a su docente, correctamente';
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        f_comodin() {
            let me = this;
            if (me.t_ctrl_comodin >= me.t_comodin) {
                me.$vs.notify({
                    type: 'confirm',
                    text: 'El comodín ya ha sido usado en este juego.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    position: 'bottom-center'
                })
                return
            }
            if (me.preguntas[me.turno].opciones.length <= 2) {
                me.$vs.notify({
                    type: 'confirm',
                    text: 'No podemos reducir más opciones, favor seleccione uno de los items.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    position: 'bottom-center'
                })
                return
            }
            me.$vs.dialog({
                color: 'warning',
                title: 'Comodin 50/50',
                text: 'Este comodín solo podrá usarlo 1 vez en este juego, ¿Desea aplicar el comodín?',
                accept: me.f_ejecutar_comodin,
                acceptText: 'Sí, usar comodín.',
                cancelText: 'Cancelar',
            })
        },
        f_ejecutar_comodin() {
            let me = this;
            // me.t_ctrl_comodin=0;
            me.t_ctrl_comodin++;
            me.tmp_opciones_comodin = [];
            let op_correcta = 0;
            let op_incorrecta = 0;

            // console.log('mas de 2 opciones')
            for (let index = 0; index < me.preguntas[me.turno].opciones.length; index++) {
                if (op_correcta == 0 && me.preguntas[me.turno].opciones[index].tipo_opcion == 1) {
                    op_correcta++;
                    me.tmp_opciones_comodin.push(me.preguntas[me.turno].opciones[index])
                }
                if (op_incorrecta == 0 && me.preguntas[me.turno].opciones[index].tipo_opcion == 0) {
                    op_incorrecta++;
                    me.tmp_opciones_comodin.push(me.preguntas[me.turno].opciones[index])
                }
            }
            me.preguntas[me.turno].opciones = me.tmp_opciones_comodin
            // console.log(me.tmp_opciones_comodin)
        },
        f_change_color_game(item) {
            let me = this;
            me.op_cl_game = item;
            localStorage.setItem('op_color', item);
        },
        recargar() {
            window.location.reload()
        }
    }
}
</script>

<style lang="css">
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
    top: 20px;
    right: 50px;
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

/* millonario */
.b-radius {
    /* background-color: yellow; */
    border-radius: 20px;
}

.t-azul {
    color: #00009B;
}

.t-size {
    font-size: 1.3em;
}

.t-bold {
    font-weight: 800;
}

.parent {
    min-height: 200px;
    /* background: #CCCCCC; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-image: url('../../assets/images/borde1.svg'); */
    /* background-position: 0% 0% 50% 50%; */
    background-size: cover;
    background-repeat: no-repeat;
    background-position-x: 0%;
}

.d-contenido {
    width: 90%;
    padding: 3px 10px;
    border: #058EC4 5px double;
    border-top-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.d-pregunta {
    border-color: #058EC4;
    border-style: solid;
    border-width: 0 0 1px 0px;
    width: 75%;
    margin-top: 5px;
}

.t-amarillo {
    color: yellow;
}

.d-opcion {
    background-color: white;
    margin: 10px;
    cursor: pointer;
    border-radius: 20px;
    box-shadow: rgba(211, 213, 235, 0.5) 0px 2px 2px 2px;
}

.d-opcion:hover {
    filter: brightness(1.2);
    box-shadow: rgba(122, 129, 189, 0.5) 0px 5px 5px 5px;
}

.j_juego_contenedor,
.caja-resultados {
    width: 85%;
    margin: 0 auto;
}

.img-boy-game {
    max-height: 200px;
    cursor: pointer;
}

.img-boy-game:hover {
    transform: scale(1.1);
}

.bg-1fd {
    min-height: 350px !important;
}

.seleccionado:hover {
    filter: none;
}

.seleccionado {
    background-color: yellow;
    /* cursor: initial; */
    margin: 10px;
    cursor: pointer;
    border-radius: 20px;
    /* box-shadow: 5px #999; */
    box-shadow: rgba(211, 213, 235, 0.5) 0px 2px 2px 2px;
}

.img-comodin {
    border-radius: 50%;
    height: 60px;
    cursor: pointer;
}

.img-comodin:hover,
.color0:hover,
.color1:hover {
    box-shadow: 5px #999;
    transform: scale(1.1);
}

.color0,
.color1 {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    margin: 2px;
    box-shadow: 2px 2px 5px #999;
}

.color0 {
    background-image: linear-gradient(45deg, blue 40%, yellow 50%);
}

.color1 {
    background-image: linear-gradient(45deg, white 60%, blue 30%);
}
</style>
