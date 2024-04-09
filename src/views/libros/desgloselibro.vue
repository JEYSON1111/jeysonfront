<template>
<div>
    <vx-card>
        <center>
          <h2 v-if="libros[0]"><b>{{libros[0].nombrelibro}}</b></h2>
        </center>
        <vs-collapse :type="type">
            <vs-collapse-item icon-pack="feather" v-if="usuario.id_group !=16 || acordeon.libro == '1'" icon-arrow="icon-book">
                <div slot="header">
                    Libro
                </div>
                <div class="vx-row w-full mb-6" v-if="libros[0]">
                    <template v-if="usuario.id_group == 16">
                      <div class="vx-col md:w-1/4 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="libros[0].weblibro!== null && libros[0].weblibro!== '' && libros[0].weblibro!== 'null' && libro.libroweb == '1'">
                          <vx-card v-if="libros[0] && libro.todo == '1'" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datolibro(libros[0])">
                              <div slot="no-body">
                                  <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_libro_web.png'">
                              </div>
                              <div class="mt-2">
                                  <div class="w-3/3 mt-2 ml-auto">
                                      <p class="font-bold">
                                          Libro Web
                                      </p>
                                  </div>
                              </div>
                          </vx-card>
                          <vx-card v-else class="text-center" style="min-height: 250px; cursor: pointer;" @click="datolibro()">
                              <div slot="no-body">
                                  <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_libro_web.png'">
                              </div>
                              <div class="mt-2">
                                  <div class="w-3/3 mt-2 ml-auto">
                                      <p class="font-bold">
                                          Libro Web
                                      </p>
                                  </div>
                              </div>
                          </vx-card>


                      </div>
                    </template>
                    <template v-else>
                      <div class="vx-col md:w-1/4 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="libros[0].weblibro!== null && libros[0].weblibro!== '' && libros[0].weblibro!== 'null'">
                          <vx-card v-if="libros[0]" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datolibro(libros[0])">
                              <div slot="no-body">
                                  <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_libro_web.png'">
                              </div>
                              <div class="mt-2">
                                  <div class="w-3/3 mt-2 ml-auto">
                                      <p class="font-bold">
                                          Libro Web
                                      </p>
                                  </div>
                              </div>
                          </vx-card>
                      </div>
                    </template>
                    <template v-if="usuario.id_group == 16">
                      <div class="vx-col w-1/2 md:w-1/4 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="libros[0].pdfconguia!== null && libros[0].pdfconguia!== '' && libros[0].pdfconguia!== 'null'  && libro.libro_con_guia == '1'">
                          <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="datopdfconguia(libros[0])">
                              <div slot="no-body">
                                  <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf2.png'">
                              </div>
                              <div class="mt-2">
                                  <div class="w-3/3 mt-2 ml-auto">
                                      <p class="font-bold">
                                          Pdf con guía
                                      </p>
                                  </div>
                              </div>
                          </vx-card>
                      </div>
                    </template>
                    <template v-else>
                      <div class="vx-col w-1/2 md:w-1/4 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="libros[0].pdfconguia!== null && libros[0].pdfconguia!== '' && libros[0].pdfconguia!== 'null'">
                        <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="datopdfconguia(libros[0])">
                            <div slot="no-body">
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf2.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Pdf con guía
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                      </div>
                    </template>
                    <template v-if="usuario.id_group == 16">
                        <div class="vx-col w-1/2 md:w-1/4 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="libros[0].id_serie !== 6 && libros[0].guiadidactica!== null && libros[0].guiadidactica!== '' && libros[0].guiadidactica!== 'null'  && libro.guia_didactica == '1'">
                            <!-- 6  plan lector-->
                            <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="datopdfguiadidactica(libros[0])">
                                <div slot="no-body">
                                    <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf1.png'">
                                </div>
                                <div class="mt-2">
                                    <div class="w-3/3 mt-2 ml-auto">
                                        <p class="font-bold">
                                            Guía didáctica
                                        </p>
                                    </div>
                                </div>
                            </vx-card>
                        </div>
                    </template>
                    <template v-else>
                        <div class="vx-col w-1/2 md:w-1/4 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="libros[0].id_serie !== 6 && libros[0].guiadidactica!== null && libros[0].guiadidactica!== '' && libros[0].guiadidactica!== 'null'">
                        <!-- 6  plan lector-->
                            <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="datopdfguiadidactica(libros[0])">
                                <div slot="no-body">
                                    <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf1.png'">
                                </div>
                                <div class="mt-2">
                                    <div class="w-3/3 mt-2 ml-auto">
                                        <p class="font-bold">
                                            Guía didáctica
                                        </p>
                                    </div>
                                </div>
                            </vx-card>
                        </div>
                    </template>
                    <div class="vx-col w-1/2 md:w-1/4 xl:w-1/4 mt-3" style="min-height: 250px;" v-for="item in unidadesLibro" :key="item.id_unidad">
                        <vx-card class="text-center" style="min-height: 250px; cursor: pointer;overflow: hidden;" @click="iractividades(item)">
                            <div slot="no-body" style="margin-bottom: -130px;">
                                <img class="responsive card-img-top imagencard" style="min-height: 250px;" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/portadas/unidad'+item.unidad+'.jpg'">
                            </div>
                            <div class="letrascard" slot="no-body">
                                <p class="font-bold">
                                    <span v-if="item.txt_nombre_unidad == '' || item.txt_nombre_unidad == 'null' || item.txt_nombre_unidad === null">
                                    Unidad
                                    </span>
                                    <span v-else>
                                    {{item.txt_nombre_unidad}}
                                    </span>
                                    {{item.unidad}}
                                </p>
                                <small>
                                    {{item.nombre_unidad}}
                                </small>
                            </div>
                        </vx-card>
                    </div>

                </div>
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" v-if="usuario.id_group !=16 || acordeon.curso == '1'" icon-arrow="icon-folder">
                <div slot="header">
                    Cursos
                </div>
                <cursosLibroDocente />
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" v-if="usuario.id_group !=16 || acordeon.cuaderno == '1'" icon-arrow="icon-book">
                <div slot="header">
                    Cuadernos
                </div>
                <div class="vx-row w-full mb-6" v-if="cuadernos.length > 0">
                    <div class="vx-col w-1/2 md:w-1/2 xl:w-1/4 mt-3" v-for="(item,$index) in cuadernos" :key="$index">
                        <vx-card class="text-center mb-6">
                            <div slot="no-body">
                                <img v-if="item.webcuaderno != '' " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/cuadernodigital/'+item.webcuaderno+'/portada.jpg'" alt="Card image cap">
                                <img v-else class="responsive card-img-top" v-bind:src="$data_url+'img/'+item.portada" alt="Card image cap">
                            </div>
                            <div class="mt-4">
                                <p class="font-bold">
                                    {{item.nombrecuaderno}}
                                </p>
                                <small>
                                    {{item.descripcioncuaderno}}
                                </small>
                            </div>
                            <div class="mt-4" v-if="usuario.id_group == 16">
                                <div class="w-3/3 mt-2 ml-auto" v-if="cuaderno.guia == '1'">
                                    <vs-button v-if="item.pdfconguia!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfconguia_cuaderno(item)" icon-after>Pdf con guía</vs-button>
                                </div>
                                <div class="w-3/3 mt-2 ml-auto" v-if="cuaderno.didactica == '1'">
                                    <vs-button v-if="item.guiadidactica!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfguiadidactica_cuaderno(item)" icon-after>Guía didáctica</vs-button>
                                </div>
                                <div class="w-3/3 mt-2 ml-auto mt-3" v-if="cuaderno.web == '1'">
                                    <vs-button v-if="item.webcuaderno!== null" color="primary" class="w-full" type="border" icon-pack="feather" @click="datocuaderno_cuaderno(item)" icon="icon-book">Cuaderno Web</vs-button>
                                </div>
                            </div>
                            <div class="mt-4" v-else>
                                <div class="w-3/3 mt-2 ml-auto">
                                    <vs-button v-if="item.pdfconguia!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfconguia_cuaderno(item)" icon-after>Pdf con guía</vs-button>
                                </div>
                                <div class="w-3/3 mt-2 ml-auto">
                                    <vs-button v-if="item.guiadidactica!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfguiadidactica_cuaderno(item)" icon-after>Guía didáctica</vs-button>
                                </div>
                                <div class="w-3/3 mt-2 ml-auto mt-3">
                                    <vs-button v-if="item.webcuaderno!== null" color="primary" class="w-full" type="border" icon-pack="feather" @click="datocuaderno_cuaderno(item)" icon="icon-book">Cuaderno Web</vs-button>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                </div>

                <div v-else>No tiene cuadernos para este libro</div>
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" v-if="usuario.id_group !=16 || acordeon.planificacion == '1'" icon-arrow="icon-file">
                <div slot="header">
                    Planificaciones
                </div>
                <div class="vx-col w-full mb-6 mt-6">
                    <vx-card>
                        <vs-list>
                            <!-- <vs-list-header title="Planificaciones" color="primary"></vs-list-header> -->
                            <vs-list-item v-for="(item,$index) in planificaciones" :key="$index" v-bind:title="item.nombreplanificacion" v-bind:subtitle="item.descripcionplanificacion">
                                <template slot="avatar">
                                    <vs-avatar color="primary" icon-pack="feather" icon="icon-download" />
                                </template>
                                <div v-if="usuario.id_group == 16">
                                    <vs-button @click="verPlanificacion(item)" v-if="planificacion.visualizar == '1'" class="btn_ver mr-1" target="_blank" color="success">Vizualizar</vs-button>
                                    <vs-button v-if="grupo_usuario != 9 && planificacion.descargar == '1'" @click="descargarPlanificacion(item)"  class="btn_ver"  color="primary">Descargar</vs-button>
                                </div>
                                <div v-else>
                                    <vs-button @click="verPlanificacion(item)" class="btn_ver mr-1" target="_blank" color="success">Vizualizar</vs-button>
                                    <vs-button v-if="grupo_usuario != 9" @click="descargarPlanificacion(item)"  class="btn_ver"  color="primary">Descargar</vs-button>
                                </div>

                            </vs-list-item>
                        </vs-list>
                    </vx-card>
                </div>
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" v-if="usuario.id_group !=16 || acordeon.recursos_adicional == '1'" icon-arrow="icon-folder">
                <div slot="header">
                    Recursos adicionales
                </div>
                <div class="vx-row">
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/director/institucion/docentes/contenidos/libro/zonadiversion')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_juego.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Zona de diversión
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario == 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/colegios/docente/tipos_juegos_docente')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_juego.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Zona de diversión
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario != 10 && grupo_usuario !=16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/docente/tipos_juegos_docente')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_juego.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Zona de diversión
                                    </p>
                                </div>
                            </div>
                        </vx-card>

                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10 " class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/director/institucion/docentes/contenidos/libro/materialapoyo')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_material.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Material de apoyo
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario != 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="irMaterial()">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_material.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Material de apoyo
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/director/institucion/docentes/contenidos/libro/propuestas2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/propuesta.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Propuestas metodológicas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario == 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/colegios/propuestas2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/propuesta.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Propuestas metodológicas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario != 10 && grupo_usuario != 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/propuestas2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/propuesta.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Propuestas metodológicas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/director/institucion/docentes/contenidos/libro/adaptaciones2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/adaptacion.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Adaptaciones curriculares
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario == 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/colegios/adaptaciones2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/adaptacion.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Adaptaciones curriculares
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card  v-if="grupo_usuario != 10 && grupo_usuario != 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/adaptaciones2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/adaptacion.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Adaptaciones curriculares
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/director/institucion/docentes/contenidos/libro/ver_aticulos')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_articulo.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Artículos pedagógicos
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario == 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/colegios/docente/ver_articulos')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_articulo.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Artículos pedagógicos
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario != 10 && grupo_usuario != 16" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/docente/ver_articulos')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_articulo.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Artículos pedagógicos
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="simulador > 0 && grupo_usuario == 6">
                        <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/simulador/docente')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/glosario/simulacion.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Simuladores
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="documentos.length > 0">
                        <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/ministerio/docente')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/ministerio.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Documentos Ministeriales
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <!--FICHAS-->
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/lista/fichas')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/libro/ficha.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Fichas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <!--NECESIDADES EDUCATIVAS-->
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="ifHaveNecesidad">
                      <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/lista/necesidades-educativas')">
                        <div>
                          <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/home/docenteHome/neet.png">
                        </div>
                        <div class="mt-2">
                          <div class="w-3/3 mt-2 ml-auto">
                            <p class="font-bold">
                              Necesidades Educativas
                            </p>
                          </div>
                        </div>
                      </vx-card>
                  </div>
              </div>
            </vs-collapse-item>
        </vs-collapse>
    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import cursosLibroDocente from '../docentes/cursos.vue'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        cursosLibroDocente
    },
    mixins: [historicoMixin],
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idlibro: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
            usuario: [],
            unidadesLibro: [],
            planificaciones: [],
            type: 'margin',

            val_cuaderno: '',
            idcuaderno: '',
            valMultipe_cuaderno: {
                value1: '',
                value2: ''
            },
            select_cuaderno: [],
            cuadernos: [],
            usuario_cuaderno: [],
            datoU: '',
            idusuario: '',
            grupo_usuario: '',
            miusuario: '',
            simulador: 0,
            documentos:[],
            //====VARIABLES PARA RECURSOS EXTERNOS
            acordeon:{
                libro:'1',
                curso:'1',
                cuaderno:'1',
                planificacion:'1',
                recursos_adicional:'1',
            },
            libro:{
                libroweb:'1',
                libro_con_guia:'1',
                guia_didactica:'1',
                unidades:'1',
                todo:'1',
            },
            curso:{
                ver:'1',
                agregar:'1',
                editar:'1',
                eliminar:'1',
            },
            cuaderno:{
                guia:'1',
                didactica:'1',
                web:'1',
            },
            planificacion:{
                descargar:'1',
                visualizar:'1',
            },
            //variables para recursos adicionales
            mijuego:{
                agregar:'1',
                editar:'1',
                eliminar:'1',
                ver:'1',
                asignar:'1',
            },
            juegoProlipa:{
                asignar:'1',
                ver:'1',
                previsualizar:'1',
            },
            materialDigital:{
                ver:'1',
                previsualizar:'1',
                asignar:'1',
            },
            materialpdf:{
                subir:'1',
                ver:'1',
                descargar:'1',
                asignar:'1',
            },
            propuesta:{
                ver:'1',
            },
            adaptacion:{
                ver:'1',
            },
            articulo:{
                lengua:'1',
                matematica:'1',
                naturales:'1',
                sociales:'1',
                ensenanza:'1',
            },
            documentom:{
                ver:'1',
            },
            permisosExternos:'',
            link:'',
          //fin de variables para recursos adicionales
          //FIN DE VARIABLES PARA RECURSOS EXTERNOS
          //variables necesidades educativas
          ifHaveNecesidad:false,
          //fin variables necesidades educativas
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        let me = this
        this.$vs.loading()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.miusuario = this.usuario;
        this.grupo_usuario = this.miusuario.id_group;
        this.idusuario = this.miusuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }
        this.idlibro = localStorage.getItem('idlibro')
        localStorage.vistalibro = 'todo'
    },
    mounted() {
      let me = this
      localStorage.removeItem('url');
      localStorage.removeItem('indexUnidad');
      localStorage.removeItem('valUnidad');
      localStorage.removeItem('idUnidad');
      localStorage.removeItem('pag_inicio');
      localStorage.removeItem('pag_fin');
      this.getLibros()
      this.getCuadernos()
      this.getSimuladores();
      this.getDocumentos();
      this.getIfNecesidadEducativa()
    },
    methods: {
      //METODOS PARA GENERAR LINK
        getLinksLibros(){
        let me = this
        me.$http.get(this.$server_url + 'colegios_get_links_libro?id_libro=' + localStorage.idlibro+'&institucion_id='+me.usuario.institucion_idInstitucion)
        .then(res => {
            let datos = res.data[0]
            me.link  = datos.link
        })
        .catch(function (error) { })
      },
      irMaterial(){
        let me = this
        if(me.usuario.id_group == 16){
            me.$router.push('/colegios/lista/materialapoyo')
        }else{
            me.$router.push('/lista/materialapoyo')
        }
      },
      getDocumentos() {
        let me = this;
        this.$http.get(this.$server_url + 'getDocumentosDocente?idasignatura=' + localStorage.getItem("idasignatura"))
          .then(res => {
              me.documentos = res.data
              console.log(res.data)
          })
          .catch(error => {
              console.log('no se conecto a los documentos ministeriales ' + error)
          })
      },
      //para obtener el listado de los simuladores para el docente
      getSimuladores() {
        let me = this;
        this.$http.get(this.$server_url + 'simulador?asignatura=yes&idasignatura=' + localStorage.getItem("idasignatura"))
          .then(function (res) {
            me.simulador = res.data.length;
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      async getLibros() {
          let me = this;
          let idlibro = localStorage.getItem('idlibro')
          let region  = localStorage.region
          this.$http.get(this.$server_url + 'desgloselibrousuario/' + idlibro+'/'+region)
            .then(function (response) {
                me.libros = response.data
                localStorage.nombrelibroSelec = me.libros[0].nombrelibro
                localStorage.carpetaLibroSelec = response.data[0].weblibro
            })
            .catch(function (error) {}),
            this.$http.get(this.$server_url + 'menu_unidades_libros/' + idlibro+'/'+region)
            .then(function (response) {
                me.unidadesLibro = response.data
                // console.log(me.unidadesLibro)
            })
            .catch(function (error) {}),

            this.$http.get(this.$server_url + 'planificacion_asignatura/' + idlibro)
            .then(function (response) {
                me.planificaciones = response.data
                me.$vs.loading.close()
            })
            .catch(function (error) {})
        },
        getCuadernos() {
            let me = this;
            let formData = new FormData();
            if(me.usuario.id_group == 16){
                formData.append('institucion_id', me.usuario.institucion_idInstitucion);
                formData.append('asignatura_id', localStorage.idasignatura);
                this.$http.post(this.$server_url + 'colegios_cuadernos_usuario_libro', formData)
                .then(function (response) {
                    me.cuadernos = response.data
                })
                .catch(function (error) {})
            }else{
                formData.append('id_usuario', me.idusuario);
                formData.append('id_asignatura', localStorage.idasignatura);
                this.$http.post(this.$server_url + 'cuadernos_usuario_libro', formData)
                .then(function (response) {
                    me.cuadernos = response.data
                })
                .catch(function (error) {})
            }
        },
        datolibro(url) {
            let me = this;
            // console.log(url)
            localStorage.url = url.weblibro;
            for (let index = 0; index < me.unidadesLibro.length; index++) {
                if (index == 0) {
                    localStorage.pag_inicio = me.unidadesLibro[index].pag_inicio
                }
                localStorage.pag_fin = me.unidadesLibro[index].pag_fin

            }
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.idasignatura
            let h_nombreasignatura = url.nombreasignatura
            let h_recursotipo = 1; //1 = libro
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'libro',
                'recurso_nombre': url.nombrelibro,
                'recurso_detalle': 'libro completo',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.vistalibro = 'por_unidad'
            // this.$router.push('/docente/libro/digital');
            let route = this.$router.resolve({
                path: '/docente/libro/digital'
            });

            window.open(route.href, '_blank');
        },
        abrirLibroLink(){
            let me = this
            window.open(me.link,'_blank');
        },
        datopdfsinguia(url) {
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = url;
            window.open('/docente/libro/pdfsinguia', '_blank');
        },
        datopdfconguia(url) {
            let me = this
            // console.log(url)
            // return
            if (me.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (url.pdfconguia === null || url.pdfconguia === 'null') {
                me.$vs.notify({
                    text: 'El PDF con guía aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.idasignatura
            let h_nombreasignatura = url.nombreasignatura
            let h_recursotipo = 12; //12 = pdf con guia
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'pdf con guia',
                'recurso_nombre': url.pdfconguia,
                'recurso_detalle': 'libro pdf guia',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.url_guia = url.pdfconguia;
            window.open('/docente/libro/pdfconguia', '_blank');
        },
        datopdfguiadidactica(url) {
            let me = this
            if (me.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (url.guiadidactica === null || url.guiadidactica === 'null') {
                me.$vs.notify({
                    text: 'La guía didáctica aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.idasignatura
            let h_nombreasignatura = url.nombreasignatura
            let h_recursotipo = 14; //12 = guia didactica
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'guia didactica',
                'recurso_nombre': url.guiadidactica,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.url_guiadid = url.guiadidactica;
            window.open('/docente/libro/pdfguiadidactica', '_blank');
        },
        datocuaderno_cuaderno(url) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.descripcioncuaderno
            let h_recursotipo = 3; //3 = cuaderno
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'cuaderno',
                'recurso_nombre': url.nombrecuaderno,
                'recurso_detalle': 'cuaderno completo',
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)

            localStorage.url = url.webcuaderno;
            window.open('/docente/cuaderno/digital', '_blank');
            // this.$router.push('/docente/cuaderno/digital');
        },
        datopdfsinguia_cuaderno(url) {
            localStorage.url = url;
            window.open('/docente/cuaderno/pdfsinguia', '_blank');
        },
        datopdfconguia_cuaderno(url) {
            // console.log( url )
            // return
            let me = this
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = url.pdfconguia;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombrecuaderno
            let h_recursotipo = 12; //12 = pdf con guia
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'pdf con guia',
                'recurso_nombre': url.pdfconguia,
                'recurso_detalle': 'cuaderno pdf con guia',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
           window.open('/docente/cuaderno/pdfconguia', '_blank');
        },
        datopdfguiadidactica_cuaderno(url) {
            let me = this
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombrecuaderno
            let h_recursotipo = 14; //14 = guia didactica
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'guia didactica',
                'recurso_nombre': url.guiadidactica,
                'recurso_detalle': 'cuaderno guia didactica',
            }
             me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)

            localStorage.url = url.guiadidactica;
            window.open('/docente/cuaderno/pdfguiadidactica', '_blank');
        },
        iractividades(item) {

            let me = this;
            localStorage.url = item.weblibro
            localStorage.indexUnidad = item.unidad
            localStorage.valUnidad = item.unidad
            localStorage.idUnidad = item.id_unidad_libro
            localStorage.pag_inicio = item.pag_inicio
            localStorage.pag_fin = item.pag_fin

            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 1; //1 = libro
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'libro unidad',
                'recurso_nombre': 'unidad ' + item.unidad,
                'recurso_detalle': item.nombre_unidad,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            if (this.grupo_usuario == 10) {
                // perfil director
                this.$router.push('/director/institucion/docentes/contenidos/libro/unidad');
            }
            if (this.grupo_usuario == 16){
                this.$router.push('/colegios/docente/libro/desgloseunidad');
            }
            else {
                this.$router.push('/docente/libro/desgloseunidad');
            }
        },
        irCursosLibro() {
            if (this.grupo_usuario == 16){
                this.$router.push('/colegios/docente/cursos');
            }
            else {
                this.$router.push('/docente/cursos')
            }
        },
        setAltImg(event) {
            event.target.src = this.$data_url + '/archivos/upload/icono_unidades.png';
        },
        volver() {
            let me = this;
            me.$router.push('/docente/libros2');

        },
        verPlanificacion(item) {
            let me = this
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 16; //16 = planificacion
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'planificacion',
                'recurso_nombre': item.nombreplanificacion,
                'recurso_detalle': item.descripcionplanificacion,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            // :href="$data_url+'archivos/upload/planificacion/'+item.webplanificacion"
            window.open('https://view.officeapps.live.com/op/embed.aspx?src=' + this.$data_url + 'archivos/upload/planificacion/' + item.webplanificacion)
        },
        descargarPlanificacion(item){
            let me = this
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 16; //16 = planificacion
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descargar',
                'recurso_tipo': 'planificacion',
                'recurso_nombre': item.nombreplanificacion,
                'recurso_detalle': item.descripcionplanificacion,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            let ruta = me.$data_url+'archivos/upload/planificacion/'+item.webplanificacion
            window.open(ruta,'_blank')
            //:href="$data_url+'archivos/upload/planificacion/'+item.webplanificacion
        },
        //*********NECESIDADES EDUCATIVAS****
        getIfNecesidadEducativa(){
          let me = this
          this.$http.get(this.$server_url+'ifAsignadoUsuario/'+me.usuario.idusuario+'/'+localStorage.periodo_id)
            .then(function (res) {
              if(res.data.length > 0){
                me.ifHaveNecesidad = true
              }else{
                me.ifHaveNecesidad = false
              }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
    },
}
</script>

<style>
.letrascard {
    padding: 10px 0px 10px 0px;
    color: white;
    font-size: 17px;
    position: relative;
    -webkit-box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.52);
    -moz-box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.52);
    box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.52);
}

.btn_ver {
    font-size: 14px;
    padding: 5px 15px 5px 15px !important;
}

.imagencard {
    border-radius: 6px;
}
</style>
