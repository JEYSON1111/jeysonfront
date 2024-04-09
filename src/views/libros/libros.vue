<template>
    <vx-card>
      <vs-popup fullscreen title="Generar link" :active.sync="popupLinkLibro">
          <div class="vx-row mb-base p-3">
            <div class="vx-col sm:w-1/2 w-full mb-3">
              <vs-input type="number" class="w-full" label="Página inicio" v-model="link.pag_ini" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-3">
              <vs-input type="number" class="w-full" label="Página fin" v-model="link.pag_fin" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-3">
              <div style="color: gray; font-size: 12px;">Fecha inicio</div>
              <flat-pickr class="w-full" :config="configdateTimePicker" v-model="link.fecha_inicio" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-3">
              <div style="color: gray; font-size: 12px;">Fecha caducidad</div>
              <flat-pickr class="w-full" :config="configdateTimePicker" v-model="link.fecha_caducidad" />
            </div>
            <div class="vx-col w-full">
              <vs-button @click="guardarLink()">Guardar link</vs-button>
            </div>
          </div>
          <vs-divider></vs-divider>
          <vs-table max-items="10" stripe search pagination :data="links" class="mb-3">
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Pág inicio</vs-th>
                <vs-th>Pág fin</vs-th>
                <vs-th>Fecha inicio</vs-th>
                <vs-th>Fecha fin</vs-th>
                <vs-th>Recurso externo</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{indextr+1}} </vs-td>
                    <vs-td> {{data[indextr].pag_ini}} </vs-td>
                    <vs-td> {{data[indextr].pag_fin}} </vs-td>
                    <vs-td> {{data[indextr].fecha_ini}} </vs-td>
                    <vs-td> {{data[indextr].fecha_fin}} </vs-td>
                    <vs-td>
                        <div v-if="tr.recurso_externo == '0'">
                            <vs-chip color="warning">No</vs-chip>
                        </div>
                        <div v-else>
                            <vs-chip color="warning">Si</vs-chip><br><br>
                            <small>Asignado a {{ tr.nombreInstitucion }}</small>
                        </div>
                    </vs-td>
                    <vs-td align="center">
                        <vx-tooltip style="display: inline-block;" text="Copiar link" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="success" @click="copiarLink(data[indextr])" type="line" icon-pack="feather" icon="icon-copy"> </vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
      </vs-popup>
      <div class="con-tab-ejemplo">
        <div>
            <!-- <vs-button color="dark" icon="add"  v-if="permisoRoot && doActions == 1" @click="limpiar();popupGuardarLibro=true;title='Guardar'" type="line">Añadir Libro </vs-button> -->
            <vs-button color="dark" icon="add" @click="limpiar();popupGuardar=true;title='Guardar';getGrupoProducto();listaSeries();" type="line">Añadir producto </vs-button>
            <vs-table max-items="20" stripe search pagination :data="arreglosLibros">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arreglosLibros.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="35%">Nombre</vs-th>
                    <vs-th v-if="doActions == 1">Pdfs</vs-th>
                    <vs-th v-if="doActions == 1">Portada</vs-th>
                    <vs-th v-if="doActions">Detalles</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            <p><b>Libro:</b> {{data[indextr].nombrelibro}}</p>
                            <p><b>Nombre Imprimir:</b> {{data[indextr].nombre_imprimir}}</p>
                            <p class="mt-1"><b>Descripción:</b> {{data[indextr].descripcionlibro}}</p>
                            <p class="mt-1"><b>Serie:</b> {{ tr.nombre_serie }}</p>
                            <p class="mt-1"><b>Código:</b> {{ tr.codigo_liquidacion }}</p>
                            <vs-chip v-if="data[indextr].serie === '0'">Sin plus</vs-chip>
                            <vs-chip v-else color="success">Plus</vs-chip>
                        </vs-td>
                        <vs-td v-if="doActions == 1">
                            <span class="enlace" @click="datolibro(tr,tr.weblibro)" >
                                <b>Weblibro :</b><span v-if="tr.weblibro"> {{ tr.weblibro}}</span><span class="text-danger" v-else> No disponible</span><br>
                            </span>
                            <span class="enlace" @click="datopdfsinguia(tr.pdfsinguia)" >
                                <b>SG :</b><span v-if="tr.pdfsinguia"> {{ tr.pdfsinguia }}</span><span class="text-danger" v-else> No disponible</span><br>
                            </span>
                            <span class="enlace" @click="datopdfconguia(tr.pdfconguia)" >
                                <b>G :</b><span v-if="tr.pdfconguia"> {{ tr.pdfconguia }}</span><span class="text-danger" v-else> No disponible</span><br>
                            </span>
                            <span class="enlace" @click="datopdfguiadidactica(tr.guiadidactica)">
                                <b>G Didactica:</b><span v-if="tr.guiadidactica"> {{ tr.guiadidactica }}</span><span class="text-danger" v-else> No disponible</span><br>
                            </span>
                            <!--LIBRO SIERRA-->
                            <vs-divider color="primary">Libro sierra</vs-divider>
                            <span class="enlace" v-if="tr.s_weblibro" @click="datolibro(tr,tr.s_weblibro)" >
                                <b>Weblibro :</b><span > {{ tr.s_weblibro}}</span><br>
                            </span>
                            <span class="enlace" v-if="tr.s_pdfsinguia" @click="datopdfsinguia(tr.s_pdfsinguia)" >
                                <b>SG :</b><span> {{ tr.s_pdfsinguia}}</span><br>
                            </span>
                            <span class="enlace" v-if="tr.s_pdfconguia" @click="datopdfconguia(tr.s_pdfconguia)" >
                                <b>G:</b><span> {{ tr.s_pdfconguia}}</span><br>
                            </span>
                            <span class="enlace" v-if="tr.s_guiadidactica" @click="datopdfguiadidactica(tr.s_guiadidactica)">
                                <b>G Didactica:</b><span> {{ tr.s_guiadidactica}}</span><br>
                            </span>
                              <!--LIBRO COSTA-->
                              <vs-divider color="success">Libro costa</vs-divider>
                              <span class="enlace" v-if="tr.c_weblibro" @click="datolibro(tr,tr.c_weblibro)" >
                                <b>Weblibro :</b><span > {{ tr.c_weblibro}}</span><br>
                            </span>
                            <span class="enlace" v-if="tr.c_pdfsinguia" @click="datopdfsinguia(tr.c_pdfsinguia)" >
                                <b>SG :</b><span> {{ tr.c_pdfsinguia}}</span><br>
                            </span>
                            <span class="enlace" v-if="tr.c_pdfconguia" @click="datopdfconguia(tr.c_pdfconguia)" >
                                <b>G:</b><span> {{ tr.c_pdfconguia}}</span><br>
                            </span>
                            <span class="enlace" v-if="tr.c_guiadidactica" @click="datopdfguiadidactica(tr.c_guiadidactica)">
                                <b>G Didactica:</b><span> {{ tr.c_guiadidactica}}</span><br>
                            </span>
                        </vs-td>
                        <vs-td v-if="doActions == 1">
                            <a @click="datolibro(tr,tr.weblibro)" style="cursor:pointer;" >
                                <img v-if="data[indextr].weblibro != null "  width="50" class="card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+data[indextr].weblibro+'/'+tr.portada" alt="Card image cap">
                                <img v-else class="card-img-top" width="50" v-bind:src="$data_url+'archivos/archivos/img/'+data[indextr].portada" alt="Card image cap">
                            </a>
                        </vs-td>
                        <vs-td v-if="doActions == 1">
                            <vx-tooltip style="display: inline-block;" text="Ver Detalles" position="top" color="warning">
                                <vs-button size="small" class="modal-default-button" color="primary" @click="verLibroSerie(tr)" type="filled" icon-pack="feather" icon="icon-bookmark"> </vs-button>
                            </vx-tooltip> &nbsp;
                        </vs-td>
                        <vs-td>
                            <template v-if="data[indextr].Estado_idEstado == '1'">
                                <p>Activado</p>
                            </template>
                            <template v-else>
                                <p>Desactivado</p>
                            </template>
                          </vs-td>
                        <vs-td>
                          <div v-if="doActions == 1">
                            <vx-tooltip style="display: inline-block;" text="Editar libro" position="top" color="success">
                                <vs-button size="small" class="modal-default-button" color="success" @click="title='Editar';openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                            </vx-tooltip> &nbsp;
                              <template v-if="data[indextr].Estado_idEstado == '1'">
                                <vx-tooltip style="display: inline-block;" text="Desactivar libro" position="top" color="danger">
                                    <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr].idlibro)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                  </vx-tooltip> &nbsp;
                              </template>
                              <template v-else>
                                  <vx-tooltip style="display: inline-block;" text="Activar libro" position="top" color="warning">
                                    <vs-button size="small" class="modal-default-button" color="primary" @click="openConfirmActivar(data[indextr].idlibro)" type="filled" icon-pack="feather" icon="icon-arrow-up-right"> </vs-button>
                                  </vx-tooltip> &nbsp;
                              </template>
                              <vx-tooltip style="display: inline-block;" text="Generar link de libro" position="top" color="dark">
                                  <vs-button size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-link" color="dark" @click="idlibro = data[indextr].idlibro; getLinksLibros(); popupLinkLibro=true;"></vs-button>
                              </vx-tooltip>
                          </div>
                          <div v-else>
                            <vx-tooltip style="display: inline-block;" text="Seleccionar libro" position="top" color="primary">
                                <vs-button class="modal-default-button" size="small" @click="$emit('changeLibroSelect',tr)" color="primary" type="filled" icon-pack="feather" icon="icon-star"> Seleccionar </vs-button>
                            </vx-tooltip> &nbsp;
                          </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
      </div>
      <!-- SECCION REGISTRO -->
      <vs-popup class="crear" title="Registro nuevo producto" :active.sync="popupGuardar">
                <vs-row>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Producto</b></vs-col>
    
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Código del producto " maxlength="6" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.pro_codigo" @input="convertirAMayusculas()" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <font style="font-size: 11.5px">&nbsp;Grupo</font><br>
                                <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gru_pro_codigo" disabled />
                                <!-- <vs-input label="Grupo" maxlength="6" placeholder="Grupo" class="w-full" icon="mode_edit"  v-model="tabProducto.gru_pro_codigo" :readonly="modoEdicion"/> -->
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col v-if="tabProducto.gru_pro_codigo === 1" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.5px">&nbsp;Serie</font><br>
                                <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries.id_serie" label="nombre_serie" placeholder="--Seleccione--" class="w-full" v-model="tabProducto.id_serie" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.pro_nombre" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Descripción " placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descripcion" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <!-- <vs-input label="Iva *" type="number" placeholder="Iva" class="w-full" icon="mode_edit" v-model="tabProducto.proIva" /> -->
                                <font style="font-size: 11.5px">&nbsp;IVA *</font><br>
                                <v-select :options="options1" :reduce="options1 => options1.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.pro_iva" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Valor " type="number" placeholder="Valor" class="w-full" icon="mode_edit" v-model="tabProducto.pro_valor" @keypress="validarValor" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <font style="font-size: 11.5px; display: inline-flex;">&nbsp;Descuento * &emsp; Formato: 0.00</font><br>
                                <vs-input type="number" id="pro-descuento-input" placeholder="Descuento" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descuento" @keypress="validarDescuento"/>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Stock " type="number" placeholder="Stock" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stock" @keypress="validarStock" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Costo " type="number" placeholder="Costo" class="w-full" icon="mode_edit" v-model="tabProducto.pro_costo" @keypress="validarCosto" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                                <vs-input label="Peso " type="number" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabProducto.pro_peso" @keypress="validarPeso"/>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="guardarnuevo()" class="mr-3 mb-2" type="relief">{{ title }}</vs-button>
                    <vs-button @click="popupGuardar = false;" type="relief" color="danger">Cancelar</vs-button>
                </vs-col>
            </vs-popup>
      <!--PARA LOS MODALES -->
      <!--MODAL PARA GUARDAR LIBRO-->
      <vs-popup classContent="popup-example" fullscreen :title="title+' Libro'" :active.sync="popupGuardarLibro">
          <div style="color:#ff0000; text-align:center; font-weight: bold;">PARA MODIFICAR EL NOMBRE, NOMBRE IMPRIMIR, DESCRIPCIÓN, CODIGO LIQUIDACIÓN Y YEAR, INGRESE EN LA SECCIÓN PRODUCTO.</div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/3 w-full mb-2">
              <vs-input class="w-full" label="Nombre" icon-pack="feather" icon="icon-book" icon-no-border  v-model="libro.nombrelibro" :readonly="modoEdicion" />
              </div>
              <div class="vx-col sm:w-1/3 w-full mb-2">
                <vs-input class="w-full" label="Nombre imprimir" icon-pack="feather" icon="icon-book" icon-no-border  v-model="libro.nombre_imprimir" :readonly="modoEdicion"/>
                </div>
              <div class="vx-col sm:w-1/3 w-full mb-2">
                  <vs-input class="w-full" label="Descripción" icon-pack="feather" icon="icon-book" icon-no-border  v-model="libro.descripcionlibro" :readonly="modoEdicion"/>
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <p class="mt-2">Seleccione la serie:</p>
                  <ul class="flex mt-2">
                      <li>
                      <vs-radio v-model="libro.serie" vs-name="radios1serie" vs-value="1">con plus</vs-radio>
                      </li>
                      <li>
                      <vs-radio v-model="libro.serie" vs-name="radios1serie" vs-value="0" class="ml-2">Sin plus</vs-radio>
                      </li>
                  </ul>
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="Web libro" icon-pack="feather" icon="icon-link" icon-no-border  v-model="libro.weblibro" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="pdf sin guia" icon-pack="feather" icon="icon-link" icon-no-border  v-model="libro.pdfsinguia" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="pdf con guia" icon-pack="feather" icon="icon-link" icon-no-border  v-model="libro.pdfconguia" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="Guia didactica Libro" icon-pack="feather" icon="icon-link" icon-no-border  v-model="libro.guiadidactica" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <p>Asignatura:</p>
                  <v-select :options="Asignaturas" :reduce="Asignaturas => Asignaturas" label="nombreasignatura" class="w-full" v-model="libro.asignatura_idasignatura" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-full w-full mb-2">
                  <vs-input class="w-full" label="Demo" icon-pack="feather" icon="icon-link" icon-no-border  v-model="libro.demo" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/3 w-full mb-2">
                  <vs-input class="w-full" label="Portada" icon-pack="feather" icon="icon-archive" icon-no-border  v-model="libro.portada" />
              </div>
              <div class="vx-col sm:w-1/3 w-full mb-2">
                  <vs-input class="w-full" label="Portada (SIERRA)" icon-pack="feather" icon="icon-archive" icon-no-border  v-model="libro.s_portada" />
              </div>
              <div class="vx-col sm:w-1/3 w-full mb-2">
                  <vs-input class="w-full" label="Portada (COSTA)" icon-pack="feather" icon="icon-archive" icon-no-border  v-model="libro.c_portada" />
              </div>
          </div>
          <!--DATOS SERIE-->
          <vs-divider color="warning">Datos serie</vs-divider>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <p>Serie:</p>
                  <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries" label="nombre_serie" class="w-full" v-model="serie.nombre_serie" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <vs-input class="w-full" label="Liquidación" icon-pack="feather" icon="icon-bar-chart" icon-no-border  v-model="serie.codigo_liquidacion" :readonly="modoEdicion" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="Year" icon-pack="feather" icon="icon-bar-chart" icon-no-border  v-model="serie.year" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <vs-input class="w-full" label="Versión" icon-pack="feather" icon="icon-bar-chart" icon-no-border  v-model="serie.version2" />
              </div>
          </div>
          <!--DATOS LIBRO SIERRA-->
          <vs-divider color="primary">Datos libro Sierra</vs-divider>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="Web libro" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.s_weblibro" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <vs-input class="w-full" label="pdf sin guia" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.s_pdfsinguia" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="pdf con guia" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.s_pdfconguia" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <vs-input class="w-full" label="Guia didactica Libro" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.s_guiadidactica" />
              </div>
          </div>
          <!--FIN DATOS LIBRO SIERRA-->
          <!--DATOS LIBRO COSTA-->
          <vs-divider color="success">Datos libro Costa</vs-divider>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="Web libro" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.c_weblibro" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <vs-input class="w-full" label="pdf sin guia" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.c_pdfsinguia" />
              </div>
          </div>
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input class="w-full" label="pdf con guia" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.c_pdfconguia" />
              </div>
              <div class="vx-col sm:w-1/2 w-full mb-6">
                  <vs-input class="w-full" label="Guia didactica Libro" icon-pack="feather" icon="icon-link-2" icon-no-border  v-model="libro.c_guiadidactica" />
              </div>
          </div>
          <!--FIN DATOS LIBRO COSTA-->
          <div class="vx-row">
              <div class="vx-col w-full">
              <vs-button @click="guardarLibro()" class="mr-3 mb-2">{{ title }}</vs-button>
              <vs-button color="warning" type="border" class="mb-2" @click="popupGuardarLibro = false;">Cancelar</vs-button>
              </div>
          </div>
      </vs-popup>
      <!-- Modal para ver la informacion libro serie de cada libro-->
      <vs-popup class="holamundo"  title="Libro - serie" :active.sync="popupVerSerie">
        <vs-list>
          <vs-list-header title="Informacion libro - serie del libro"></vs-list-header>
          <vs-list-item title="Libro" :subtitle="lsnombre"></vs-list-item>
          <vs-list-item title="Codigo liquidacion" :subtitle="lscodigo_liquidacion"></vs-list-item>
          <vs-list-item title="Año" :subtitle="lsyear"></vs-list-item>
          <vs-list-item title="Version" :subtitle="lsversion"></vs-list-item>
          <vs-list-item title="Inicial" :subtitle="lsiniciales"></vs-list-item>
          <vs-list-item title="Serie" :subtitle="lsnombre_serie"></vs-list-item>
        </vs-list>
      </vs-popup>
    </vx-card>
    </template>
    <script>
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    export default {
        data() {
            return {
                Asignaturas: [],
                libroserieArreglo:[],
                activeConfirm: false,
                popupVerSerie:false,
                id: 0,
                idlibro: 0,
                title:'',
                popupGuardarLibro:false,
                popupGuardar:false,
                unidadesLibro:[],
                arregloSeries:[],
                options1: [
                    { text: '--Seleccione--', value: null },
                    { text: 'Si', value: true },
                    { text: 'No', value: false },
                ],
                Grupos: [],
                gru_pro_codigo: 1,
                series:[],
                tabProducto: {
                    pro_codigo: '',
                    gru_pro_codigo: '',
                    pro_nombre: '',
                    pro_descripcion: '',
                    pro_iva: '',
                    pro_valor: '',
                    pro_descuento: '',
                    pro_stock: '',
                    pro_costo: '',
                    pro_peso: '',
                    pro_estado: '',                                
                    id_serie:'',
                    idlibro:'',
                    year:''
                },
                libro: {
                    nombrelibro: "",
                    nombre_imprimir:"",
                    descripcionlibro: "",
                    serie: '0',
                    weblibro: "",
                    pdfsinguia: "",
                    pdfconguia: "",
                    guiadidactica: "",
                    asignatura_idasignatura: "",
                    demo:'',
                    portada:"portada.png",
                    //SIERRA LIBROS
                    s_weblibro: "",
                    s_pdfsinguia: "",
                    s_pdfconguia: "",
                    s_guiadidactica: "",
                    s_portada:"portada.png",
                    //COSTA LIBROS
                    c_weblibro: "",
                    c_pdfsinguia: "",
                    c_pdfconguia: "",
                    c_guiadidactica: "",
                    c_portada:"portada.png",
                },
                serie:{
                    nombrelibro:'',
                    nombre_serie:'',
                    iniciales:'',
                    codigo_liquidacion:'',
                    nombre:'',
                    year:'',
                    version2:''
                },
                //para mostrar lo de libro serie
                lsnombre:"",
                lscodigo_liquidacion:"",
                lsyear:"",
                lsversion:"",
                lsiniciales:"",
                lsnombre_serie:"",
                popupLinkLibro: false,
                link:{
                  pag_ini: '',
                  pag_fin: '',
                  fecha_inicio: '',
                  fecha_caducidad: '',
                },
                configdateTimePicker: {
                  enableTime: true,
                  dateFormat: 'Y-m-d H:i:s'
                },
                links: [],
                permisoRoot:false,
                usuario:[],
                modoEdicion: false,
                numeros: 0
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr
        },
        props:{
            arreglosLibros:{
              type:Array,
              default:[],
            },
            //0 => no tendra botones; 1 => si
            doActions:{
              type:Number,
              default:1
            }
        },
        methods: {
            validarStock() {
                let stock = this.tabProducto.proStock;
                if (!/^\d+$/.test(stock) || isNaN(stock)) {
                    this.tabProducto.proStock = '';
                }
            },
            validarCosto() {
                const costo = this.tabProducto.proCosto;
                if (/^\d/.test(costo)) { // si comienza con un dígito
                 if (!/^\d{0,18}(\.\d{1,5})?$/.test(costo)) {
                    this.tabProducto.proCosto = '';
                    }
                } else if (/^[,.e]/.test(costo)) { // si comienza con una coma o un punto
                    if (!/^([,.]\d{1,5})?$/.test(costo)) {
                    this.tabProducto.proCosto = '';
                    }
                } else { // si comienza con cualquier otro caracter
                    this.tabProducto.proCosto = '';
                }
            },
            validarPeso() {
                const peso = this.tabProducto.proPeso;
                if (/^\d/.test(peso)) { // si comienza con un dígito
                 if (!/^\d{0,15}(\.\d{1,5})?$/.test(peso)) {
                    this.tabProducto.proPeso = '';
                    }
                } else if (/^[,.e]/.test(peso)) { // si comienza con una coma o un punto
                    if (!/^([,.]\d{1,5})?$/.test(peso)) {
                    this.tabProducto.proPeso = '';
                    }
                } else { // si comienza con cualquier otro caracter
                    this.tabProducto.proPeso = '';
                }
            },
            handleRadioInput(opcion) {
                // Vacía el array Productos cuando se selecciona la opción 'nombres'
                if (opcion === 'nombres') {
                    this.Productos = [];
                }
                else if(opcion === 'codigopro'){
                    this.Productos = [];
                }
            },
            validarDescuento() {
                let descuento = this.tabProducto.pro_descuento;
                // Reemplazar comas por puntos solo si hay comas en la cadena
                if (descuento.includes(',')) {
                    descuento = descuento.replace(',', '.');
                    this.tabProducto.pro_descuento = descuento;
                }
                // Validar el formato del número
                if (!/^\d{0,14}(\.\d{0,2})?$/.test(descuento)) {
                    this.tabProducto.pro_descuento = '';
                    console.log("reset");
                }
            },
            validarValor() {
                const valor = this.tabProducto.proValor;
                if (/^\d/.test(valor)) { // si comienza con un dígito
                 if (!/^\d{0,18}(\.\d{1,5})?$/.test(valor)) {
                    this.tabProducto.proValor = '';
                    }
                } else if (/^[,.e]/.test(valor)) { // si comienza con una coma o un punto
                    if (!/^([,.]\d{1,5})?$/.test(valor)) {
                    this.tabProducto.proValor = '';
                    }
                } else { // si comienza con cualquier otro caracter
                    this.tabProducto.proValor = '';
                }
            },
            getGrupoProducto() {
                let me = this;
                this.$http.get(this.$server_url+'GetGrupoProducto_todo')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                //this.Productos = resultado;
                this.Grupos = res.data;
                // console.log(this.Productos);
                // console.log(this.Grupos);
                })
                .catch(err => {
                console.log(err)
                })
            },
            convertirAMayusculas() {            
                const numerosString = this.tabProducto.pro_codigo.replace(/\D/g, '');
                this.numeros = numerosString ? parseInt(numerosString) : 0; // Asignar el valor a tabProducto.pro_codigo             
                // Extraer los números y almacenarlos en la variable 'numeros'
            },
            guardarnuevo() {
                let me = this;
                me.modoEdicion = true;
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                //VALIDACION DE CAMPOS NULOS Y VACIOS
                if (me.tabProducto.pro_codigo === '' || me.tabProducto.pro_codigo === null) {
                    this.$vs.notify({
                        text: 'Escriba el código del Producto antes de guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }
                if (me.tabProducto.gru_pro_codigo === '' || me.tabProducto.gru_pro_codigo === null) {
                    this.$vs.notify({
                        text: 'Seleccione el grupo del producto antes de guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }
                let datos  = {
                    "pro_codigo": me.tabProducto.pro_codigo,
                    "gru_pro_codigo": me.tabProducto.gru_pro_codigo,
                    "pro_nombre": me.tabProducto.pro_nombre,
                    "pro_descripcion": me.tabProducto.pro_descripcion,
                    "pro_iva": me.tabProducto.pro_iva,
                    "pro_valor": parseFloat(me.tabProducto.pro_valor),
                    "pro_descuento": parseFloat(me.tabProducto.pro_descuento),
                    "pro_stock": parseFloat(me.tabProducto.pro_stock),
                    "pro_costo": parseFloat(me.tabProducto.pro_costo),
                    "pro_peso": parseFloat(me.tabProducto.pro_peso),
                    "nombrelibro": me.tabProducto.pro_nombre,
                    "nombre_imprimir": me.tabProducto.pro_nombre,
                    "descripcionlibro": me.tabProducto.pro_descripcion,
                    "serie": 0,
                    "weblibro": null,
                    "pdfsinguia":null ,
                    "pdfconguia": null,
                    "guiadidactica": null,
                    "asignatura_idasignatura": null,
                    "portada": "portada.png",
                    "demo": null,
                    "id_serie": me.tabProducto.id_serie,
                    "codigo_liquidacion": me.tabProducto.pro_codigo,
                    "year": parseInt(me.numeros),
                    "version2": null,
                    "s_weblibro": null,
                    "s_pdfsinguia": null,
                    "s_pdfconguia": null,
                    "s_guiadidactica": null,
                    "s_portada": "portada.png",
                    "c_weblibro": null,
                    "c_pdfsinguia": null,
                    "c_pdfconguia": null,
                    "c_guiadidactica": null,
                    "c_portada": "portada.png",
                    "user_created": usuarioObjeto.idusuario,                
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url+'Registrar_modificar_producto', datos)
                // this.$http.post(this.$server_url+'guardarLibro', datos2)
                .then(res => {
                    me.$vs.loading.close()
                    me.popupGuardar = false
                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                    }else{
                        me.$vs.notify({
                            text: 'Guardado con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    }
                    limpiar()
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Producto no se pudo guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
            },
            //para obtener el listado de los usuarios root
            getUserRoot() {
                let me = this;
                this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
                    .then(function (res) {
                        if(res.data.status == '1'){
                            me.permisoRoot = true
                        }else{
                            me.permisoRoot = false
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                    })
            },
            //para obtener el listado de asignaturas
            getAsignaturas() {
                let me = this;
                me.$vs.loading();
                this.$http.get(this.$server_url + 'listaLibro')
                    .then(function (res) {
                        me.Asignaturas = res.data.asignatura
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            },
            //lista de series para usar en el select
            listaSeries(){
                let me = this
            this.$http.get(this.$server_url+`libroserie`).then(res => {
                me.arregloSeries = res.data.serieslista;
                })
                .catch(function (error) {
                console.log(error)
                })
            },
            //para ver el libro digital
            datolibro(data,url) {
                let me = this;
                let region  = localStorage.region
                 this.$http.get(this.$server_url+'menu_unidades_libros/' + data.idlibro+'/'+region)
                .then(function (response) {
                    me.unidadesLibro = response.data
                })
                .catch(function (error) {})
                localStorage.url = url;
                for (let index = 0; index < me.unidadesLibro.length; index++) {
                    if (index == 0) {
                        localStorage.pag_inicio = me.unidadesLibro[index].pag_inicio
                    }
                    localStorage.pag_fin = me.unidadesLibro[index].pag_fin
                }
                localStorage.vistalibro = 'por_unidad'
                 let route = this.$router.resolve({path: '/admin/libro/desgloselibro'});
                // let route = this.$router.resolve('/link/to/page'); // This also works.
                window.open(route.href, '_blank');
            },
            //para ver el libro sin guia en el admin
            datopdfsinguia(url) {
                let me = this
                if (url === null || url === 'null') {
                    me.$vs.notify({
                        text: 'El PDF sin guía aun no está disponible',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                localStorage.pdfsinguia = url;
                let route = this.$router.resolve({path: '/admin/libro/pdfsinguia'});
                window.open(route.href, '_blank');
            },
            //para ver el libro con guia en el admin
            datopdfconguia(url) {
                let me = this
                if (url === null || url === 'null') {
                    me.$vs.notify({
                        text: 'El PDF con guía aun no está disponible',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                localStorage.url_guia = url;
                let route = this.$router.resolve({path: '/docente/libro/pdfconguia'});
                window.open(route.href, '_blank');
            },
            datopdfguiadidactica(url) {
                let me = this
                if (url === null || url === 'null') {
                    me.$vs.notify({
                        text: 'La guía didáctica aun no está disponible',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                localStorage.url_guiadid = url;
                let route = this.$router.resolve({path: '/docente/libro/pdfguiadidactica'});
                window.open(route.href, '_blank');
            },
            //para eliminar el libro
            eliminarLibro() {
                let me = this;
                let formData = new FormData();
                formData.append('idlibro', me.idlibro);
                me.$vs.loading()
                this.$http.post(this.$server_url + 'eliminarLibro', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Libro desactivado con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('recharge',true)
                    })
            },
            //para activar el libro
            activarLibro(){
                let me = this;
                let formData = new FormData();
                formData.append('idlibro', me.idlibro);
                me.$vs.loading()
                this.$http.post(this.$server_url + 'activarLibro', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Libro Activado con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('recharge',true)
                    })
            },
            //para abrir el popup de confimacion para eliminar
            openConfirm(idlibro) {
                this.idlibro = idlibro;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirmación`,
                    text: 'Está seguro de desactivar este libro?',
                    acceptText:'Aceptar',
                    cancelText:'Cancelar',
                    accept: this.eliminarLibro
                })
            },
            openConfirmActivar(idlibro){
                 this.idlibro = idlibro;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirmación`,
                    text: 'Está seguro de activar este libro?',
                    acceptText:'Aceptar',
                    cancelText:'Cancelar',
                    accept: this.activarLibro
                })
            },
            //para guardar las areas
            guardarLibro() {
                let me = this;
                if (me.libro.nombrelibro === '' || me.libro.serie == '' || me.serie.year == '' ) {
                  this.$vs.notify({
                    text: 'Debe completar todos los campos antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                  })
                  return;
                }
                if(me.libro.nombre_imprimir == ""){
                  this.$vs.notify({
                    text: 'Debe ingresar el nombre del libro para imprimir',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                  })
                  return;
                }
                let formData = new FormData();
                formData.append('idlibro',                  me.id);
                formData.append('nombrelibro',              me.libro.nombrelibro);
                formData.append('nombre_imprimir',          me.libro.nombre_imprimir)
                formData.append('descripcionlibro',         me.libro.descripcionlibro);
                formData.append('serie',                    me.libro.serie);
                formData.append('weblibro',                 me.libro.weblibro);
                formData.append('pdfsinguia',               me.libro.pdfsinguia);
                formData.append('pdfconguia',               me.libro.pdfconguia);
                formData.append('guiadidactica',            me.libro.guiadidactica);
                formData.append('asignatura_idasignatura',  me.libro.asignatura_idasignatura.idasignatura);
                formData.append('portada',                  me.libro.portada);
                formData.append('demo',                     me.libro.demo)
                //para guardar la serie
                formData.append('id_serie',                 me.serie.nombre_serie.id_serie);
                formData.append('codigo_liquidacion',       me.serie.codigo_liquidacion);
                formData.append('year',                     me.serie.year);
                formData.append('version2',                 me.serie.version2);
                //SIERRA
                formData.append('s_weblibro',               me.libro.s_weblibro);
                formData.append('s_pdfsinguia',             me.libro.s_pdfsinguia);
                formData.append('s_pdfconguia',             me.libro.s_pdfconguia);
                formData.append('s_guiadidactica',          me.libro.s_guiadidactica);
                formData.append('s_portada',                me.libro.s_portada);
                //COSTA
                formData.append('c_weblibro',               me.libro.c_weblibro);
                formData.append('c_pdfsinguia',             me.libro.c_pdfsinguia);
                formData.append('c_pdfconguia',             me.libro.c_pdfconguia);
                formData.append('c_guiadidactica',          me.libro.c_guiadidactica);
                formData.append('c_portada',                me.libro.c_portada);
                me.$vs.loading()
                this.$http.post(this.$server_url + 'guardarLibro', formData)
                    .then(function (res) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close()
                        me.popupGuardarLibro = false
                        if(me.id == 0){
                            me.$emit('nuevoLibro',me.libro.nombrelibro)
                        }else{
                            console.log("mundo")
                            me.$emit('recharge',true)
                        }
                        limpiar()
                    })
                    .catch(function (error) {})
    
            },
            //para editar los campos
            openModalEditar(data = {}) {
                let me = this;
                //llenar la data en los campos
                me.id = data.idlibro;
                me.libro.nombrelibro            = data.nombrelibro;
                me.libro.nombre_imprimir        = data.nombre_imprimir
                me.libro.descripcionlibro       = data.descripcionlibro;
                me.libro.serie                  = data.serie;
                me.libro.weblibro               = data.weblibro;
                me.libro.pdfsinguia             = data.pdfsinguia;
                me.libro.pdfconguia             = data.pdfconguia;
                me.libro.portada                = data.portada;
                if(data.guiadidactica == null ||  data.guiadidactica == "null" ||   data.guiadidactica == "0")
                {
                    me.libro.guiadidactica = "";
                }else{
                    me.libro.guiadidactica = data.guiadidactica;
                }
                if(data.year == null ||  data.year == "null" ||   data.year == "0")
                {
                    me.serie.year = "";
                }else{
                    me.serie.year = data.year;
                }
                if(data.version == null ||  data.version == "null" ||   data.version == "0")
                {
                    me.serie.version2 = "";
                }else{
                    me.serie.version2 = data.version;
                }
                me.libro.asignatura_idasignatura = { idasignatura: data.asignatura_idasignatura, nombreasignatura: data.asignatura };
                //para  editar la tabla serie
                me.serie.nombre_serie = { id_serie: data.id_serie, nombre_serie: data.nombre_serie };
                // me.serie.iniciales = data.iniciales;
                me.serie.codigo_liquidacion = data.codigo_liquidacion;
                //DATOS LIBRO SIERRA
                me.libro.s_weblibro            = data.s_weblibro
                me.libro.s_pdfsinguia          = data.s_pdfsinguia
                me.libro.s_pdfconguia          = data.s_pdfconguia
                me.libro.s_guiadidactica       = data.s_guiadidactica
                me.libro.s_portada             = data.s_portada
                me.libro.demo                  = data.demo
                //DATOS LIBRO COSTA
                me.libro.c_weblibro            = data.c_weblibro
                me.libro.c_pdfsinguia          = data.c_pdfsinguia
                me.libro.c_pdfconguia          = data.c_pdfconguia
                me.libro.c_guiadidactica       = data.c_guiadidactica
                me.libro.c_portada             = data.c_portada
                me.popupGuardarLibro           = true;
                me.modoEdicion                 = true;
            },
            //para ver el libro serie especifico
            verLibroSerie(data={}){
                let me =this;
                me.popupVerSerie = true
                 me.$vs.loading();
                    this.$http.get(this.$server_url+'verLibroSerie?idlibro='+data.idlibro)
                    .then(res => {
                        me.lsiniciales = res.data[0].iniciales;
                        me.lsnombre= res.data[0].nombre
                        me.lscodigo_liquidacion= res.data[0].codigo_liquidacion
                        me.lsyear= res.data[0].year
                        me.lsversion= res.data[0].version
                        me.lsnombre_serie= res.data[0].nombre_serie
                        me.$vs.loading.close();
                    })
                    .catch(function (error) {
                      console.log(error)
                          me.$vs.loading.close();
                    })
            },
            //para limpiar los campos
            limpiar() {
                let me                              = this;
                me.id                               = 0
                me.libro.nombrelibro                = "";
                me.libro.nombre_imprimir            = "";
                me.libro.descripcionlibro           = "";
                me.libro.weblibro                   = "";
                me.libro.pdfsinguia                 = "";
                me.libro.pdfconguia                 = "";
                me.libro.guiadidactica              = "";
                me.libro.serie                      = "0";
                me.libro.asignatura_idasignatura    = "";
                me.libro.portada                    = "portada.png"
                me.libro.demo                       = ""
                //para limpiar la tabla serie
                me.serie.nombre_serie               = "";
                me.serie.iniciales                  = "";
                me.serie.codigo_liquidacion         = "";
                me.serie.year                       = "";
                me.serie.version2                   = "";
                //DATOS LIBRO SIERRA
                me.libro.s_weblibro                 = ""
                me.libro.s_pdfsinguia               = ""
                me.libro.s_pdfconguia               = ""
                me.libro.s_guiadidactica            = ""
                me.libro.s_portada                  = "portada.png"
                //DATOS LIBRO COSTA
                me.libro.c_weblibro                 = ""
                me.libro.c_pdfsinguia               = ""
                me.libro.c_pdfconguia               = ""
                me.libro.c_guiadidactica            = ""
                me.libro.c_portada                  = "portada.png"
                me.tabProducto.pro_codigo           = ""
                me.tabProducto.gru_pro_codigo       = 1
                me.tabProducto.pro_costo            = null
                me.tabProducto.pro_descripcion      = ""
                me.tabProducto.pro_descuento        = ""
                me.tabProducto.pro_iva              = null
                me.tabProducto.pro_nombre           = ""
                me.tabProducto.pro_peso             = ""
                me.tabProducto.pro_stock            = ""
                me.tabProducto.pro_valor            = ""
                me.tabProducto.id_serie             = ""
            },
            getLinksLibros(){
              let me = this
              me.$vs.loading();
              me.$http.get(this.$server_url + 'get_links_libro/' + me.idlibro)
              .then(res => {
                  me.links = res.data
                  me.$vs.loading.close()
              })
              .catch(function (error) { me.$vs.loading.close() })
            },
            guardarLink(){
              let me = this
              me.$vs.loading();
              let formData = new FormData();
              formData.append('id_libro', me.idlibro);
              formData.append('pag_ini', me.link.pag_ini);
              formData.append('pag_fin', me.link.pag_fin);
              formData.append('fecha_ini', me.link.fecha_inicio);
              formData.append('fecha_fin', me.link.fecha_caducidad);
              me.$http.post(this.$server_url + 'guardar_link_libro', formData)
              .then(res => {
                  me.getLinksLibros();
                  me.$vs.loading.close()
                  me.$vs.notify({ text: 'Link guardado con éxito', color: 'success', iconPack: 'feather', icon: 'icon-check' })
              })
              .catch(function (error) { me.$vs.loading.close() })
            },
            copiarLink(item){
              let me = this
                let host = location.protocol + '//' + location.hostname +':'+ location.port
                let ruta = host +'/libro_free/'+ item.pag_ini+'4.3'+item.pag_fin+'4.3'+item.fecha_ini+'4.3'+item.fecha_fin+'4.3'+item.weblibro
                var aux = document.createElement("input");
                console.log('ruta',ruta)
                aux.setAttribute("value", ruta);
                document.body.appendChild(aux);
                aux.select();
                try {
                    var status = document.execCommand('copy');
                    if (!status) {
                        me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                    } else {
                        me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                    }
                } catch (err) {
                    console.log('No se pudo copiar');
                }
                document.body.removeChild(aux);
            }
        },
        created() {
            this.usuario = JSON.parse(localStorage.getItem("usuario"))
            this.getAsignaturas();
            this.listaSeries();
            localStorage.vistalibro = 'todo'
            this.getUserRoot()
        }
    }
    </script>
    <style>
    .enlace{
        cursor:pointer;
        transition:1s ease all;
        margin-top:20px!important;
    }
    .enlace:hover{
        text-decoration:underline;
        color:#63B8EC;
    }
    </style>
    