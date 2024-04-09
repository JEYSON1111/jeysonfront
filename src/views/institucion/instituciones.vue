<template>
    <div>
        <vx-card>
          <div v-if="verPermisosExternos == 0">
            <vs-tabs>
              <vs-tab label="Mis Instituciones" v-if="usuario.id_group == 11">
                <escuelasAsesorVue />
              </vs-tab>
              <vs-tab label="Instituciones Prolipa">
                  <div class="con-tab-ejemplo">
                      <br>
                      <div style="display:flex;flex-wrap:wrap;">
                          <div style="width:65%;display:flex;">
                              <div style="width:80%;">
                                  <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
                              </div>
                              <div style="width:20%;margin-left:10px;">
                                  <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                              </div>
                          </div>
                          <div style="width:20%;">
                              <vs-button v-if="user_autorizado == 1" color="primary" type="border" @click="institucion_id = 0; popupAddInstitucion = true;" icon-pack="feather" icon="icon-plus">Agregar</vs-button>
                          </div>
                      </div>
                      <br>
                      <vs-table stripe max-items="50" search pagination :data="instituciones">
                          <template slot="header">
                              <div class="vx-row">
                                  <div class="vx-col w-full m-3">
                                      Cantidad: {{instituciones.length}}
                                  </div>
                              </div>
                          </template>
                          <template slot="thead">
                              <vs-th sort-key="idInstitucion">#</vs-th>
                              <vs-th sort-key="nombreInstitucion">Institución (asesores)</vs-th>
                              <vs-th sort-key="nombre">Localidad</vs-th>
                              <vs-th sort-key="nombre">Periodo</vs-th>
                              <vs-th sort-key="visitas">Cod. facturación</vs-th>
                              <vs-th>Acciones</vs-th>
                          </template>
                          <template slot-scope="{data}">
                              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                  <vs-td :data="data[indextr].idInstitucion ">
                                      {{data[indextr].idInstitucion }}
                                  </vs-td>
                                  <vs-td :data="data[indextr].nombreInstitucion">
                                      {{data[indextr].nombreInstitucion}}<br>
                                      <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                                          <small> <i style="color:red;">No existe asesor </i></small><br>
                                      </div>
                                      <div v-else>
                                          <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
                                      </div>
                                      <small>{{data[indextr].fecha_registro}} </small><br>
                                      <vs-chip v-if="tr.estadoInstitucion == 1" color="success">{{ tr.estado }}</vs-chip>
                                      <vs-chip v-else>{{ tr.estado }}</vs-chip>
                                  </vs-td>
                                  <vs-td :data="data[indextr].nombreregion">
                                      {{data[indextr].nombreregion}} <br>
                                      <small>{{data[indextr].ciudad}}</small>
                                  </vs-td>
                                  <vs-td :data="data[indextr].periodo">
                                      {{data[indextr].periodo}} <br>
                                      <small v-if="tr.statusPeriodo == 1" class="text-success font-bold">{{tr.estadoPeriodo}}</small>
                                      <small v-else>{{tr.estadoPeriodo}}</small>
                                  </vs-td>
                                  <vs-td>
                                      <p> {{ tr.codigo_institucion_milton }} </p>
                                      <small class="text-warning" v-if="tr.codigo_institucion_milton == 22507">Hay que cambiar</small>
                                  </vs-td>
                                  <vs-td :data="tr.idInstitucion">
                                      <vs-dropdown vs-custom-content vs-trigger-click>
                                          <vs-button type="relief" class="a-icon">
                                              Opciones
                                              <vs-icon class="" icon="expand_more"></vs-icon>
                                          </vs-button>
                                          <vs-dropdown-menu class="loginx">
                                              <vs-dropdown-item v-if="usuario.id_group =='1' || usuario.id_group =='11' " style="width:200px" @click="irFormularioDocente(tr)">
                                                  <span class="feather icon icon-link"></span> <small class="text-success ml-1" style="font-size:13px;">Solicitudes de libros</small>
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="permisoRoot || usuario.id_group == '11' " style="width:200px" @click="sendInstitucion = tr;getPeriodosActivar();">
                                                <span class="feather icon icon-link"></span> <small class="text-primary ml-1" style="font-size:13px;">Activar a período actual</small>
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="permisoRoot == true" style="width:200px" @click="periodos(tr)">
                                                  <span class="feather icon icon-crop"></span> Ver periodos
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="getTipoVenta(tr)">
                                                  <span class="feather icon icon-shopping-cart"></span> Ver detalle de venta
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="institucion_id = tr.idInstitucion;popupAddInstitucion = true;">
                                                  <span class="feather icon icon-edit"></span> Editar
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="permisoRoot == true" style="width:200px" @click="agregarLibro(tr.idInstitucion)">
                                                  <span class="feather icon icon-gift"></span> Asignar libros gratis
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="permisoRoot == true" style="width:200px" @click="agregarLibrerias(tr.idInstitucion)">
                                                  <span class="feather icon icon-home"></span> Asignar  librerias
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="institucionSelected=tr;verDocentes(tr)">
                                                  <span class="feather icon icon-users"></span> Lista de docentes
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="verEstudiantes(tr)">
                                                  <span class="feather icon icon-user"></span> Lista de Estudiantes
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="verDocentesVisitas(tr)">
                                                  <span class="feather icon icon-filter"></span> Visitas de docentes
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="permisoRoot == true" style="width:200px" @click="confirmEliminarInstitucion(tr)">
                                                  <span class="feather icon icon-trash"></span> Eliminar institucion
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="(usuario.idusuario == '35748' || usuario.idusuario == '5103' || usuario.idusuario == '4853' && tr.aplica_matricula == 1 )" style="width:200px" @click="verMatricula(tr)">
                                                  <span class="feather icon icon-bookmark"></span> Estado matricula
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="generateEnlaceEstudiante(tr)">
                                                  <span class="feather icon icon-link"></span> Enlace estudiantes
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="sendInstitucion=tr;registroDocentes(tr)">
                                                  <span class="feather icon icon-user"></span> Registro de docentes
                                              </vs-dropdown-item>
                                              <vs-dropdown-item style="width:200px" @click="imprimirCodigosEstudiante(tr)">
                                                  <span class="feather icon icon-user"></span>Exportar Códigos de estudiantes
                                              </vs-dropdown-item>
                                              <vs-dropdown-item v-if="permisoRoot && tr.cantidad_cambio_ventana_evaluacion > 0 " style="width:200px" @click="institucionSelected=tr;getEvaluacionesInstitucion(tr)">
                                                  <span class="feather icon icon-user"></span>Reiniciar Evaluaciones
                                              </vs-dropdown-item>
                                              <!-- <vs-dropdown-item v-if="usuario.id_group =='1'" style="width:200px" @click="agregarPermisosExternos(tr)">
                                                  <span class="feather icon icon-layout"></span> Recursos externos
                                              </vs-dropdown-item> -->
                                              <!-- <vs-dropdown-item v-if="permisoRoot == true" style="width:200px" @click="VerCoincidencias(tr)">
                                                  <span class="feather icon icon-link"></span> Coincidencias de codigos de miltoN
                                              </vs-dropdown-item> -->
                                          </vs-dropdown-menu>
                                      </vs-dropdown>
                                  </vs-td>
                              </vs-tr>
                          </template>
                      </vs-table>
                  </div>
              </vs-tab>
              <vs-tab label="Instituciones Facturación" v-if="permisoRoot">
                  <institucionfacturacion/>
              </vs-tab>
              <vs-tab label="Periodos" v-if="permisoRoot">
                  <div class="con-tab-ejemplo">
                      <Periodos></Periodos>
                  </div>
              </vs-tab>
              <vs-tab label="Instituciones por ciudades">
                <InstitucionesXCiudad />
              </vs-tab>
              <vs-tab label="Ciudades" v-if="permisoRoot">
                  <Ciudades_vue />
              </vs-tab>
              <vs-tab label="Zonas" v-if="permisoRoot">
                  <Zonas_vue />
              </vs-tab>
              <vs-tab label="Contratos Facturacion" v-if="permisoRoot">
                <listadoContratoMiltonVue />
              </vs-tab>
              <vs-tab label="Periodos bodega" v-if="permisoRoot">
                <Periodo_config_institucion/>
              </vs-tab>
            </vs-tabs>
          </div>
          <div v-if="verPermisosExternos == 2">
              <vs-button size="small" color="warning" @click="verPermisosExternos = 0;" type="filled" icon="reply">Volver a instituciones</vs-button>
              <GenerarFormulario class="mt-3" :formularioInstitucion="formulario.institucion" :formularioNombreInstitucion="formulario.nombreInstitucion" :formularioPeriodo="formulario.periodoDescripcion" :formularioPeriodo_id="formulario.periodo_id" />
          </div>
        </vx-card>
        <!-- =====MODALES=======-->
        <!--Modal para periodos-->
        <vs-popup class="holamundo" fullscreen title="Periodos de la institucion" :active.sync="popupPeriodos">
            <vx-card>
                <h4>
                    {{nombreInstitucion}}
                </h4>
                <!-- <vs-button  v-if="estadoLimiteAcceso =='1' || usuario.id_group== '1'"  type="border" color="success" class="m-2" @click="abrirModal();">Agregar periodo</vs-button> -->
                <vs-button v-if="permisoRoot == true" type="border" color="success" class="m-2" @click="abrirModal();">
                    Agregar periodo
                </vs-button>
                <vs-table max-items="20" search pagination :data="listaPeriodosInstitucion" class="mt-4">
                    <template slot="header">
                        <div>
                            Cantidad: {{listaPeriodosInstitucion.length}}
                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th width="40%">Periodo escolar</vs-th>
                        <vs-th>Región</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Actualizado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="tr.periodoescolar">
                                {{tr.periodoescolar}} <br>
                                <small> {{tr.descripcion}} </small>
                            </vs-td>
                            <vs-td>
                                <vs-chip> {{tr.nombreregion}}</vs-chip>
                            </vs-td>
                            <vs-td>
                                <vs-chip v-if="tr.estado == 1" color="success"> Activo</vs-chip>
                                <vs-chip v-if="tr.estado == 0" color="danger"> Inactivo</vs-chip>
                            </vs-td>
                            <vs-td>
                                {{tr.updated_at}}
                            </vs-td>
                            <vs-td>
                                <vx-tooltip text="eliminar periodo de esta institución" position="top" color="danger" v-if="usuario.id_group== '1' ">
                                    <vs-button type="border" color="danger" class="m-2" icon-pack="feather" icon="icon-trash" @click="confirmaEliminar(tr);"></vs-button>
                                </vx-tooltip>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vx-card>
        </vs-popup>
        <vs-popup title="Periodos" fullscreen :active.sync="modalPeriodos">
            <vs-table max-items="10" search pagination :data="listaPeriodos">
                <template slot="header">
                    <vs-radio class="mb-3 m-2" color="success" v-model="f_periodos" @change="filtroPeriodos" vs-value="1">Activos</vs-radio>
                    <vs-radio class="mb-3 m-2" color="danger" v-model="f_periodos" @change="filtroPeriodos" vs-value="0">Inactivos</vs-radio>
                </template>
                <template slot="thead">
                    <vs-th>Periodo escolar</vs-th>
                    <vs-th>Fechas</vs-th>
                    <vs-th>Region</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="tr.periodoescolar">
                            {{tr.periodoescolar}} <br>
                            <small>{{tr.descripcion}}</small>
                        </vs-td>
                        <vs-td>
                            <small>Inicio: {{tr.fecha_inicial}} </small><br>
                            <small>Fin: {{tr.fecha_final}}</small>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.region_idregion == 1"> SIERRA</vs-chip>
                            <vs-chip v-if="tr.region_idregion == 2"> COSTA</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.estado == 1" color="success"> Activo</vs-chip>
                            <vs-chip v-if="tr.estado == 0" color="danger"> Inactivo</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vs-button type="filled" size="small" color="success" class="m-2" icon-pack="feather" icon="icon-plus" @click="verificarPeriodo(tr);">Agregar</vs-button>

                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
        <!--FIN DE MODALES DE PERIODOS -->
        <!--Modal para Editar Institucion-->
        <vs-popup title="Mantenimiento Institución" fullscreen :active.sync="popupAddInstitucion">
          <addInstitucionVue v-if="popupAddInstitucion" :id="institucion_id" @rechargeInstitucion="rechargeInstitucion"/>
        </vs-popup>
        <!--FIN de modal para editar institucion -->
        <!-- Modal para lista de docentes -->
        <vs-popup title="Lista usuarios" fullscreen :active.sync="popupDocentes">
            <vx-card>
                <label>Institución : </label>
                <h4> {{institucionDocente.nombreInstitucion}} </h4>
                <div v-if="usuarios.length>0">
                    <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="usuarios">
                        <template slot="header">
                            <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt=true;popupDocentes=false;">Exportar</vs-button>
                            <div> Cantidad de usuarios: &nbsp; <b>{{ usuarios.length }}</b> </div>
                            <vs-row v-if="visitasD == true">
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                                    <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                                    <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1">

                                    <vs-button radius @click="getUsuariosTipoVisitas()" color="success" type="gradient" icon="search"></vs-button>
                                </vs-col>

                            </vs-row>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="cedula">Cédula</vs-th>
                            <vs-th sort-key="nombres">Nombre</vs-th>
                            <vs-th sort-key="nombres">Visitas</vs-th>
                            <vs-th sort-key="email">Usuario</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].cedula">
                                    idusuario: {{ data[indextr].idusuario }}<br />
                                    cedula: {{ data[indextr].cedula }}
                                </vs-td>
                                <vs-td :data="data[indextr].nombres">
                                    {{ data[indextr].nombres }}
                                    {{ data[indextr].apellidos }}
                                </vs-td>
                                <vs-td :data="data[indextr].visitas">
                                    {{ data[indextr].visitas }}
                                </vs-td>
                                <vs-td :data="data[indextr].name_usuario">
                                    <span v-if="tipo== 'docente'"><b><small>usuario:</small></b> {{data[indextr].name_usuario}}<br></span>
                                    <b><small>email: </small></b> {{data[indextr].email}} <br />
                                    <b><small>cargo: </small></b> {{data[indextr].cargo}}<br>
                                    <b><small>Fecha de creacion</small>{{ tr.created_at }}</b>
                                </vs-td>
                                <vs-td>
                                    <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Asignar libros" position="top" color="success">
                                        <span v-if="tipo== 'docente' ">
                                            <vs-button size="small" icon-pack="feather" icon="icon-zap" class="mr-2" color="success" @click="popupDocentes=false;irAsignacion(tr);"></vs-button>
                                        </span>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="Visitas del usuario" position="top" color="primary">
                                        <vs-button size="small" icon-pack="feather" icon="icon-globe" class="mr-2" color="primary" @click="popupDocentes=false;verVisitas(tr)"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-else class="m-4 p-5">
                    No hay usuarios registrados en esta institución.
                </div>

            </vx-card>
        </vs-popup>
        <!-- Modal para Asignacion de libros al docente-->
        <vs-popup title="Asignación" fullscreen :active.sync="popupAsignacion">
            <vx-card>
                <vs-button icon="home" class="close btn" style="width:210px;" @click="closeBtn($event)">Regresar al listado</vs-button>
                <br />
                <div class="m-2">
                    <vs-list>
                        <vs-list-item v-if="show_inst== 'si'" title="Institución" :subtitle="user_institucion.nombreInstitucion"></vs-list-item>
                        <vs-list-item v-if="institucionSelected.periodo_id > 0" title="Período" :subtitle="institucionSelected.periodo">
                          <vs-chip v-if="institucionSelected.statusPeriodo == '1'" color="success">Activo</vs-chip>
                          <vs-chip v-else color="danger">Desactivado</vs-chip>
                       </vs-list-item>
                        <vs-list-item title="Nombre" :subtitle="user_nombre"></vs-list-item>
                        <vs-list-item title="Email" :subtitle="user_email"></vs-list-item>
                    </vs-list>
                    <vs-divider color="success">Areas seleccionadas ( {{seleccionadas.length}} ) </vs-divider>
                    <vs-collapse>
                        <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
                            <div slot="header">
                                Ver ( {{seleccionadas.length}} )
                            </div>
                            <div class="vx-row">
                                <div class="vx-col sm:w-full text-right" v-if="seleccionadas.length >1">
                                    <vs-button type="border" color="danger" size="small" @click="confirmaQuitar()">Quitar todas <span class="feather icon icon-trash"></span></vs-button>
                                    <vs-button type="filled" color="primary" size="small" @click="moverPeriodoActual()" class="ml-2">Mover a período actual<span class="feather icon icon-check"></span></vs-button>
                                </div>
                                <div class="vx-col sm:w-full mt-2">
                                  <div v-for="(item, index) in seleccionadas" :key="index" class="m-1 p-1 asig-select text-dark">
                                    {{item.nombreasignatura}} ( {{ item.periodoescolar }} )&nbsp; &nbsp;
                                      <vs-button @click="eliminaAsignacion(item)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                                  </div>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>
                </div>
                <div class="m-2">
                    <vs-divider color=primary> Areas ( {{area.length}} ) </vs-divider>
                    <vs-collapse>
                        <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down" v-for="(listItem, index) in area" :key="index" :title="listItem.name">
                            <div slot="header">
                                {{listItem.name}}
                            </div>
                            <vs-button v-for="(listIAsig, indexAsig) in listItem.children" :key="indexAsig" type="border" color="primary" class="p-2 m-1" @click="agregaAsignacion(listIAsig)">
                                {{listIAsig.name}}
                            </vs-button>
                        </vs-collapse-item>
                    </vs-collapse>
                </div>
            </vx-card>
        </vs-popup>
        <!--Modal para visitas del usuario -->
        <vs-popup title="Lista usuarios" fullscreen :active.sync="popupVistasUsuario">
            <vx-card>
                <vs-button icon="home" class="close btn" @click="closeBtn($event)">Regresar al listado</vs-button>
                <br>
                <p><b>Nombre:</b> {{datoU.nombres}} {{datoU.apellidos}} </p>
                <p><b>Email:</b> {{datoU.email}} </p>
                <p><b>Cédula:</b> {{datoU.cedula}} </p>
                <div v-if="listaVisitas.length>0">
                    <vs-table max-items="30" search pagination :data="listaVisitas">
                        <template slot="header">
                            Ultimas visitas &nbsp; <small> <i>(max. 100): </i></small> &nbsp; {{listaVisitas.length}}
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="cedula">Fecha</vs-th>
                            <vs-th sort-key="nombres">Hora</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].fecha}}
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].hora}}
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-else>
                    <p class="p-5"> No tenemos registros de este usuario en nuestra base de datos, regrese mas tardecito :) </p>
                </div>
            </vx-card>

        </vs-popup>
        <!--Modales-->
        <!----modal exportar--------->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-button radius color="warning" @click="popupDocentes = true" type="gradient" icon="reply"></vs-button>
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
                <!--<span class="mr-4">Cell Auto Width:</span>
                <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
            </div>
        </vs-prompt>
        <!--MODAL PARA REGISTRO DE DOCENTE LIBROS-->
        <vs-popup title="Asignacion" fullscreen :active.sync="popupAsignacionDocentes">
            <RegistroDocentesVue :sendInstitucion="sendInstitucion" v-if="popupAsignacionDocentes"/>
        </vs-popup>
        <!--MODAL DETALLE DE VENTA-->
        <vs-popup :title="tituloDetalleVenta" fullscreen :active.sync="popupTipoVenta">
            <RegistroVentaVue :pedido="pedido" v-if="popupTipoVenta" showAgrupado="1"/>
        </vs-popup>
        <!----fin modal exportar--------->
        <!----modal mostrar coincidencias--------->
        <!-- <vs-popup classContent="popup-example" fullscreen :title="'Asignar codigo de institucion milton '+institucionNombreEnviar + ' - ' +institucionCiudad " :active.sync="popupCoincidencia">
            <vx-input-group class="mb-base">
                <template slot="prepend">
                    <div class="prepend-text bg-primary">
                        <span>Busqueda manual</span>
                    </div>
                </template>
                <vs-input v-model="busquedaMilton" @keyup.enter="buscarCoincidencias(busquedaMilton)" placeholder="Escriba si no encontro la institucion" />
            </vx-input-group>
            <p>>>El primer codigo es el principal que se va a ir a la bd de milton</p>
            <vs-divider>Codigo de instituciones de milton</vs-divider>
            <div class="vx-col sm:w-full mt-2">
                <div v-for="(item, index) in arregloIdsCoincidencias" :key="index" class="m-1 p-1 asig-select text-dark">
                    {{item}} &nbsp; &nbsp;
                    <vs-button @click="eliminaAsignacionIdMilton(index)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                </div>
            </div>
            <div class="flex" style="justify-content: center;">
                <vs-button color="success" icon="save" @click="guadarIdsMilton()" type="filled" class="mt-2">Guardar</vs-button>
            </div>
            <vs-table max-items="10" search pagination :data="arregloCoincidencias">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: {{ arregloCoincidencias.length }}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Nombre institucion</vs-th>
                    <vs-th>Codigo institucion de milton</vs-th>
                    <vs-th>Codigo CLI_INS_CODIGO</vs-th>
                    <vs-th style="width:100px;">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            INSTITUCION:
                            <b>{{data[indextr].INSTITUCION}}</b><br>
                            Periodo:
                            <b>{{ tr.PERIODO }}</b><br>
                            Ciudad:
                            <b>{{ tr.INS_CIUDAD }}</b><br>
                            Direccion:
                            <b>{{ tr.INS_DIRECCION }}</b><br>
                            Vendedor:
                            <b>{{ tr.VENDEDOR }}</b>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].ID_INSTITUCION}}<br>
                        </vs-td>
                        <vs-td>{{ tr.CLI_INS_CODIGO }}</vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Editar area" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success" @click="AsignarCodigoMilton(tr)" type="filled" icon-pack="feather" icon="icon-edit"> Asignar codigo</vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup> -->
        <!----Fin modal mostrar coincidencias--------->
        <!--MODAL PARA CAMBIAR DE PERIODO-->
        <vs-popup classContent="popup-example" title="Actualizar a periodo actual" :active.sync="popupActualizarPeriodo">
          <vx-card v-if="popupActualizarPeriodo">
            <p><b>Insitución:</b>       {{ sendInstitucion.nombreInstitucion }}  </p>
            <p class="font-bold text-2xl text-warning mt-2">Estas seguro de cambiar al periodo {{ periodoSelect[0].periodoescolar }}?</p>
            <div class="flex justify-center mt-2">
              <vs-button class="mr-3 mb-2" @click="changePeriodo()">Si, deseo cambiar</vs-button>
              <vs-button color="warning" type="border" class="mb-2" @click="popupActualizarPeriodo = false;">Cancelar</vs-button>
            </div>
          </vx-card>
        </vs-popup>
        <!--modal de evaluaciones institucion resetar-->
        <vs-popup classContent="popup-example" title="Resetar Evaluaciones Instituciones" :active.sync="popupEvaluaciones">
            <ResetearEvaluacionesVue v-if="popupEvaluaciones" @changeEvaluacion="changeEvaluacion" :institucionSelected="institucionSelected" :arrayEvaluacionesInstitucion="arrayEvaluacionesInstitucion"/>
        </vs-popup>

    </div>
    </template>

    <script>
    import Vue from 'vue'
    import axios from 'axios'
    import DataViewSidebar from './nuevo'
    import Periodos from '../periodos/periodos.vue'
    import vSelect from 'vue-select'
    import escuelasAsesorVue from '../home/components/asesor/escuelasAsesor.vue'
    import listadoContratoMiltonVue from './components/listadoContratoMilton.vue'
    import asignarLibrosVue from './components/asignarLibros.vue'
    import moment from 'moment'
    import flatPickr from 'vue-flatpickr-component'
    import asignarRecursosExternosVue from './components/asignarRecursosExternos.vue'
    import GenerarFormulario from '../home/docentes/formulario/listadoSolicitudes.vue'
    import MenuEncuesta from '../home/padres/encuesta/MenuEncuesta.vue'
    import 'flatpickr/dist/flatpickr.css'
    import InstitucionesXCiudad from './institucionesXCiudad.vue'
    import Ciudades_vue from '../ciudades/listaCiudad.vue'
    import Zonas_vue from '../zonas/listaZona.vue'
    import Periodo_config_institucion from '../periodos/periodo_config_institucion.vue'
    import RegistroDocentesVue from './components/RegistroDocentes.vue'
    import institucionfacturacion from '../pedidos/facturacion_api/institucion.vue';
    import addInstitucionVue from './addInstitucion.vue'
    import RegistroVentaVue from '../codigos/components/utils/RevisionVenta.vue'
    const ResetearEvaluacionesVue = () => import('./components/EvaluacionesInstituciones/ResetearEvaluaciones.vue')
    export default {
        components: {
        DataViewSidebar,
        Periodos,
        "v-select": vSelect,
        escuelasAsesorVue,
        asignarLibrosVue,
        flatPickr,
        asignarRecursosExternosVue,
        GenerarFormulario,
        MenuEncuesta,
        listadoContratoMiltonVue,
        InstitucionesXCiudad,
        Ciudades_vue,
        Zonas_vue,
        Periodo_config_institucion,
        RegistroDocentesVue,
        institucionfacturacion,
        addInstitucionVue,
        RegistroVentaVue,
        ResetearEvaluacionesVue,
    },
        data() {
            return {
              institucion_id:0,
              configdateTimePicker: {
                  enableTime: true,
                  dateFormat: 'Y-m-d'
              },
              user_institucion_send: '',
              //variables para exportar a excel
              activePrompt: false,
              reportesActivo: 0,
              fileName: null,
              formats: ['xls', 'xlsx', 'csv', 'txt'],
              cellAutoWidth: true,
              selectedFormat: 'xls',
              reporteAsesorActivo: false,
              guardarActivo: '',
              generarActivo: '',
              textAlertCant: '',
              cantidad: '',
              codigoSelected: [],
              codigoTipo: '0',
              //FIN DE VARIABLES PARA EXPORTAR A EXCEL
              escuelas: [],
              popupVistasUsuario: false,
              popupAsignacion: false,
              popupDocentes: false,
              popupAddInstitucion: false,
              popupPeriodos: false,
              busquedaInstitucion: "",
              instituciones: [],
              tmpInstituciones: [],
              sidebarData: {},
              addNewDataSidebar: false,
              usuario: [],
              grupo_usuario: '',
              //para el total visitas de institucion
              visitasginstitucion: '',
              //para el total visitas de docentes
              visitasgdocente: '',
              //para el total visitas de estudiantes
              visitasgestudiantes: '',
              //para  llenar el historico por institucion
              historicoinstitucionArreglo: [],
              //para  llenar el historico para docentes
              historicoDocenteArreglo: [],
              //para llenar el historico de para estudiantes
              historicoEstudianteArreglo: [],
              //para guardar el nombre de la institucion en el localstorage
              visitasnombreinstitucion: '',
              user_autorizado: '',
              c_region: 'SIERRA',
              //=========VARIABLES PARA PERIODOS==============
              nombreInstitucion: '',
              idInstitucion: '',
              listaPeriodos: '',
              tmplistaPeriodos: '',
              listaPeriodosInstitucion: '',
              tmp: '',
              f_periodos: 1,
              modalPeriodos: false,
              id_eliminar: '',
              region: [],
              usuario: [],
              estadoLimiteAcceso: "0",
              fecha: null,
              //=========VARIABLES PARA EDITAR INSTITUCION=======
              institucion: {
                  'idInstitucion': '',
                  'nombreInstitucion': '',
                  'telefonoInstitucion': '',
                  'direccionInstitucion': '',
                  'solicitudInstitucion': '',
                  'vendedorInstitucion': '',
                  'periodoescolar': '',
                  'tipo_institucion': '',
                  'ciudad_id': '',
                  'region_idregion': '',
                  'estado': '1',
                  'matricula': '1',
                  'punto_venta': 0,
              },
              errors: {
                  'nombreInstitucion': '',
                  'telefonoInstitucion': '',
                  'direccionInstitucion': '',
                  'solicitudInstitucion': '',
                  'vendedorInstitucion': '',
                  'periodoescolar': '',
                  'tipo_institucion': '',
                  'ciudad_id': '',
                  'region_idregion': '',
              },
              titulo: '',
              ciudad: [],
              region: [],
              periodo: [],
              vendedor: [],
              usuario: '',
              limiteMegas: 1,
              porcentaje: '',
              pesoArchivo: '',
              muyPesado: '',
              msj: '',
              //===========VARIABLE PARA MODAL DE LISTA DE DOCENTES=========
              usuarios: [],
              accesosDocentes: [],
              conteoDocentes: [{
                  'idusuario': '',
                  'cantidad': 0
              }],
              accesosEstudiantes: [],
              institucionDocente: '',
              tipo: '',
              conteo: 0,
              usuario: '',
              perfil_autorizado: '',
              //===========VARIABLES PARA MODAL DE ASIGNACION DE LIBROS========
              area: [],
              asignaturadocenteselect: [],
              seleccionadas: '',
              usuarioAsignacion: '',
              user_seleccionado: '',
              user_nombre: '',
              user_email: '',
              user_institucion: '',
              show_inst: '',
              //===========VARIABLES PARA EL MODAL DE VISTAS DE USUARIO=========
              docente: '',
              listaVisitas: [],
              datoU: '',
              //para el modal para agregar permisos
              update: false,
              asignatura_id: 0,
              colegio_asignatura_id: 0,
              permisoRoot: false,
              attachments: [],
              form: new FormData,
              numeroIteM: '0',
              instituciones: [],
              errorImage: '',
              tamanioError: '',
              archivoName: '',
              file: '',
              id: 0,
              fromDate: null,
              toDate: null,
              visitasD: false,
              //variables permisos externos
              verPermisosExternos: 0,
              permisosInstitucion: '',
              permisosNombreInstitucion: '',
              //fin variables permisos externos
              value1: '',
              value2: '',
              valid: {
                  email: false,
                  password: false,
              },
              //formulario docente
              formulario: {
                  institucion: '0',
                  periodo_id: 0,
                  periodoDescripcion: '',
                  nombreInstitucion: '',
              },
              //COINCIDENCIAS
              arregloCoincidencias: [],
              arregloIdsCoincidencias: [],
              popupCoincidencia: false,
              institucionEnviar: 0,
              institucionEnviarCedula: 0,
              institucionEnviarAIniciales: '',
              institucionNombreEnviar: '',
              institucionCiudad: '',
              busquedaMilton: '',
              //FIN COINCIDENCIAS
              //variables registro de docentes
              sendInstitucion:{},
              popupAsignacionDocentes:false,
              //fin variables registro de docentes
              arregloCodigosEstudiantes:[],
              //Variables detalle de venta
              popupTipoVenta:false,
              pedido:{},
              tituloDetalleVenta:'',
              //Fin Variables detalle de venta
              //variables para asignar el periodo actual
              popupActualizarPeriodo:false,
              periodoSelect:[],
              //fin variables para asignar el periodo actual,
              institucionSelected:0,
              //variables para evaluaciones institucion
              arrayEvaluacionesInstitucion:[],
               popupEvaluaciones:false,
              //fin variables para evaluaciones institucion
            }
        },
        mounted() {
            let me = this;
            localStorage.removeItem('institucion')
            localStorage.removeItem('tipoUser')
            me.usuario = JSON.parse(localStorage.getItem('usuario'))
            me.user_autorizado = me.usuario.id_group;
            me.getUserRoot();
            const date = new Date()
            const primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
            const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            me.fromDate = primerDia
            me.toDate = ultimoDia
        },
        methods: {
            //para ir al formulario docente
            irFormularioDocente(tr) {
                let me = this;
                localStorage.setItem('formulario', 'institucion')
                me.formulario.institucion = tr.idInstitucion;
                me.formulario.nombreInstitucion = tr.nombreInstitucion
                me.formulario.periodoDescripcion = tr.periodo
                me.formulario.periodo_id = tr.periodo_id
                me.verPermisosExternos = 2;
            },
            irGestionEncuestas(tr) {
                let me = this;
                localStorage.setItem('formulario', 'institucion')
                me.formulario.institucion = tr.idInstitucion;
                me.formulario.nombreInstitucion = tr.nombreInstitucion
                me.formulario.periodoDescripcion = tr.periodo
                me.formulario.periodo_id = tr.periodo_id
                me.verPermisosExternos = 3;
            },
            fieldChange(e) {
                let me = this;
                me.errorImage = 'no'
                me.tamanioError = "no"
                this.attachments = [];
                let selectedFiles = e.target.files;
                let validar = e.target.files[0].type;
                let tamanio = e.target.files[0].size;
                if (tamanio > 1000000) {
                    me.tamanioError = "yes"
                    me.$vs.notify({
                        text: 'El tamaño de la imagen excede 1MB',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
                if (validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg') {
                    me.file = e.target.files[0]
                    for (let i = 0; i < selectedFiles.length; i++) {
                        this.attachments.push(selectedFiles[i]);
                        localStorage.setItem('nameArchivo', this.attachments[0].name)
                        me.archivoName = localStorage.getItem("nameArchivo")
                    }
                    me.errorImage = 'no'
                } else {
                    me.errorImage = 'yes'
                    me.$vs.notify({
                        text: 'Formato de imagen no aceptada solo se acepta png/jpg/jpeg',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
            },
            //para obtener el listado de los usuarios root
            getUserRoot() {
                let me = this;
                this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                    .then(function (res) {
                        if (res.data.status == '1') {
                            me.permisoRoot = true
                        } else {
                            me.permisoRoot = false
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                    })
            },
            //PERMISOS EXTERNOS
            agregarPermisosExternos(data) {
                let me = this;
                me.verPermisosExternos = 1
                me.permisosInstitucion = data.idInstitucion
                me.permisosNombreInstitucion = data.nombreInstitucion
                return false
            },
            //FIN PERMISOS EXTERNOS
            closeBtn(event) {
                this.popupAsignacion = false;
                this.popupDocentes = true;
            },

            //para ir asignar recursos externos a prolipa
            irAddRecursosExternos(data = {}) {
                let me = this;
                localStorage.setItem('institucionExterna', data.idInstitucion)
                localStorage.setItem('ciudadExterna', data.ciudad)
                me.$router.push('/recursos/asignaturas');
            },
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getInstitucion() {
                let me = this;
                me.instituciones = [];
                if (me.busquedaInstitucion.length < 5) {
                    me.$vs.notify({
                        text: 'Minimo 5 caracteres de busqueda',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
                me.$vs.loading()
                this.$http.get(this.$server_url + 'listaInsitucion?busqueda=' + me.busquedaInstitucion)
                    .then(function (res) {
                        // me.tmpInstituciones = res.data;
                        me.instituciones = res.data;
                        // me.filtroRegion();
                        me.$vs.loading.close()
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-user'
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            },
            getPeriodoInstitucion(id) {
                let me = this;
                this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id=' + id)
                    .then(function (res) {

                        localStorage.setItem('free_periodo_id', res.data[0].periodo)
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                    })
            },
            agregarLibro(id) {
                localStorage.idinstitucion = id;
                this.getPeriodoInstitucion(id)
                this.$router.push('/institucion/addlibro');
            },

            agregarLibrerias(id) {
                localStorage.idinstitucion = id;
                this.$router.push('/institucion/librerias');
            },
            verDocentes(item) {
                let me = this;
                me.usuarios = []
                me.popupDocentes = true;
                me.visitasD = false
                // console.log( item.idInstitucion )
                localStorage.institucion = JSON.stringify(item);
                localStorage.tipoUser = "docente";
                // me.$router.push('/institucion/docentes');

                localStorage.removeItem('datoUser')
                localStorage.removeItem('user_select')
                localStorage.removeItem('show_inst')
                me.usuario = JSON.parse(localStorage.getItem('usuario'));
                me.institucionDocente = JSON.parse(localStorage.getItem('institucion'))
                me.tipo = localStorage.getItem('tipoUser');
                me.perfil_autorizado = me.usuario.id_group;

                me.getUsuariosTipo();
            },
            verDocentesVisitas(item) {
                let me = this;
                me.usuarios = []
                me.visitasD = true
                me.popupDocentes = true;
                // console.log( item.idInstitucion )
                localStorage.institucion = JSON.stringify(item);
                localStorage.tipoUser = "docente";
                // me.$router.push('/institucion/docentes');

                localStorage.removeItem('datoUser')
                localStorage.removeItem('user_select')
                localStorage.removeItem('show_inst')
                me.usuario = JSON.parse(localStorage.getItem('usuario'));
                me.institucionDocente = JSON.parse(localStorage.getItem('institucion'))
                me.tipo = localStorage.getItem('tipoUser');
                me.perfil_autorizado = me.usuario.id_group;

                me.getUsuariosTipoVisitas();
            },
            confirmEliminarInstitucion(tr) {
                let me = this;
                me.id = tr.idInstitucion
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    text: 'Estas seguro de eliminar la institución',
                    accept: this.eliminarInstitucion
                })
            },
            eliminarInstitucion() {
                let me = this;
                let formData = new FormData();
                formData.append('id', me.id)
                me.$vs.loading()
                this.$http.post(this.$server_url + 'institucionEliminar', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.getInstitucion();
                        me.$vs.notify({
                            text: 'Institución eliminada con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
                    .catch(function (e) {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo eliminar la institucion',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    });
            },
            verEstudiantes(item) {
                let me = this;
                me.popupDocentes = true;
                // console.log( item.idInstitucion )
                localStorage.tipoUser = "estudiante";
                localStorage.institucion = JSON.stringify(item);
                // me.$router.push('/institucion/estudiantes');
                localStorage.removeItem('datoUser')
                localStorage.removeItem('user_select')
                localStorage.removeItem('show_inst')
                me.usuario = JSON.parse(localStorage.getItem('usuario'));
                me.institucionDocente = JSON.parse(localStorage.getItem('institucion'))
                me.tipo = localStorage.getItem('tipoUser');
                me.perfil_autorizado = me.usuario.id_group;

                me.getUsuariosTipo();
            },
            getVisitas(item, nombreInstitucion) {

                let me = this;
                axios.get('https://foro.prolipadigital.com.ec/historico-recursos?idinstitucion=' + item + '&_limit=-1')
                    .then(res => {
                        // console.log(res.data.length)
                        // me.visitas = res.data.length;
                        //para guardar las intitucion en el localstorage
                        this.historicoinstitucionArreglo = res.data;
                        localStorage.setItem("historicoinstitucionArreglo", JSON.stringify(this.historicoinstitucionArreglo));

                        //para guardar el nombre de la institucion en localstorage

                        this.visitasnombreinstitucion = nombreInstitucion
                        localStorage.setItem("visitasnombreinstitucion", JSON.stringify(this.visitasnombreinstitucion));
                        //para enviar el id de la institucion
                        localStorage.setItem("visitasid", JSON.stringify(item));

                        //para guardar las visitas generales de la institucion
                        this.visitasginstitucion = res.data.length;
                        localStorage.setItem("visitasginstitucion", JSON.stringify(this.visitasginstitucion));

                        //     //para guardar en localstorage el historico de docentes
                        me.historicoDocenteArreglo = this.historicoinstitucionArreglo.filter(p => p.idgrupo == "6");
                        //    localStorage.setItem("historicoDocenteArreglo", JSON.stringify(this.historicoDocenteArreglo));

                        //para guardar las visitas generales de los docentes
                        this.visitasgdocente = me.historicoDocenteArreglo.length;
                        localStorage.setItem("visitasgdocente", JSON.stringify(this.visitasgdocente));

                        //     //para guardar en localstorage el historico de estudiantes
                        me.historicoEstudianteArreglo = this.historicoinstitucionArreglo.filter(p => p.idgrupo == "4");
                        //    localStorage.setItem("historicoEstudianteArreglo", JSON.stringify(this.historicoEstudianteArreglo));

                        //para guardar las visitas generales de los estudiantes
                        this.visitasgestudiantes = me.historicoEstudianteArreglo.length;
                        localStorage.setItem("visitasgestudiantes", JSON.stringify(this.visitasgestudiantes));

                        me.$router.push('/reporte/institucion/');

                    })
                    .catch(err => {
                        console.log(err)
                    })
            },

            verMatricula(tr) {
                let me = this;
                localStorage.setItem('matricula_institucion', tr.idInstitucion)
                localStorage.setItem('matricula_admin', "yes")
                me.$router.push('/matricula/listado_matriculas')
            },
            periodos(item) {
                // localStorage.institucion = JSON.stringify(item);
                let me = this;
                me.popupPeriodos = true;
                let institucion = item;
                me.tmp = institucion;
                me.nombreInstitucion = me.tmp.nombreInstitucion;
                me.idInstitucion = me.tmp.idInstitucion;
                me.region = me.tmp.nombreregion;
                me.getPeriodosInstitucion();
                me.usuario = JSON.parse(localStorage.getItem('usuario'))

                me.getPeriodos();
                // this.$router.push('/institucion/periodosInstitucion');
            },

            async getSeguimiento(tr) {
                let me = this;
                this.$http.get(this.$server_url + 'escuelasAsesor?asesor_id=' + tr.asesor_id + '&desdeAdmin=yes' + '&institucion_id=' + tr.idInstitucion)
                    .then(function (response) {
                        let periodo_id = response.data[0].periodo
                        let periodo_nombre = response.data[0].descripcion
                        me.$router.push('/administrador/seguimiento/institucion')
                        localStorage.setItem('institucion_seguimiento_asesor_id', tr.asesor_id)
                        localStorage.setItem('institucion_seguimiento_id', tr.idInstitucion)
                        localStorage.setItem('institucion_seguimiento_nombre', tr.nombreInstitucion)
                        localStorage.setItem('institucion_seguimiento_periodo_id', periodo_id)
                        localStorage.setItem('institucion_seguimiento_periodo', periodo_nombre)
                        localStorage.setItem('adminSeguimiento', "yes")
                    })
                    .catch(function (error) {})
            },

            //===========METODOS DE PERIODO===========================

            getPeriodosInstitucion() {
                let me = this;
                me.$vs.loading();
                this.$http.get(this.$server_url + 'periodosXInstitucion/' + me.idInstitucion)
                    .then(res => {
                        me.listaPeriodosInstitucion = res.data;
                        // console.log(res.data);
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                    })
            },
            getPeriodos() {
                let me = this;
                this.$http.get(this.$server_url + 'periodoRegion?region=' + me.region)
                    .then(res => {
                        me.tmplistaPeriodos = res.data;
                        //capturo el periodo activo para limitar el acceso a agregar periodo
                        let filtrarPeriodoAcceso = me.tmplistaPeriodos.filter(p => p.estado == '1')
                        //capturo la fecha actual
                        var fecha = moment().add(-1, 'days').format('YYYY/MM/DD');

                        // filtro la fecha limite del periodo
                        let fechafinal = filtrarPeriodoAcceso.map(p => p.fhasta_limite)
                        //comparo si la fecha final ya se paso a la actual
                        if (Date.parse(fechafinal) < Date.parse(fecha)) {

                            me.estadoLimiteAcceso = "0";

                        } else {
                            me.estadoLimiteAcceso = "1";
                        }

                        me.filtroPeriodos();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },

            abrirModal() {
                let me = this;
                me.popupPeriodos = false;
                me.modalPeriodos = true;
            },
            filtroPeriodos() {
                let me = this;
                // console.log(me.tmplistaPeriodos)
                me.listaPeriodos = [];
                for (let index = 0; index < me.tmplistaPeriodos.length; index++) {
                    if (me.tmplistaPeriodos[index].estado == me.f_periodos) {
                        me.listaPeriodos.push(me.tmplistaPeriodos[index]);
                    }
                }
            },
            verificarPeriodo(item) {
                let me = this;
                // console.log(item.idperiodoescolar, me.idInstitucion)
                me.$vs.loading();
                let data = new FormData();
                data.append('idperiodoescolar', item.idperiodoescolar);
                data.append('idinstitucion', me.idInstitucion)
                this.$http.post(this.$server_url + 'verifica_periodo', data)
                    .then(res => {
                        // console.log(res.data)
                        if (res.data == 1) {
                            me.$vs.notify({
                                time: 8000,
                                text: 'Este periodo ya se encuentra asignado a la institucion ' + me.nombreInstitucion,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        } else {
                            me.$vs.notify({
                                text: 'Periodo agregado correctamente a la institucion ' + me.nombreInstitucion,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            me.modalPeriodos = false;
                            me.getPeriodosInstitucion();
                        }
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                    })
            },
            confirmaEliminar(item) {
                let me = this;
                me.id_eliminar = item.id;
                // console.log(me.id_eliminar)
                // return
                me.popupPeriodos = false;
                me.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: 'Confirmar',
                    text: 'Seguro desea eliminar este item?',
                    acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    accept: me.eliminarItem,
                    cancel: me.close
                })
            },
            close() {
                let me = this;
                me.popupPeriodos = true;
                this.$vs.notify({
                    color: 'danger',
                    title: 'Cerrado',
                    text: 'Has cerrado!'
                })
            },
            eliminarItem() {
                let me = this;
                this.$http.get(this.$server_url + 'eliminarPeriodosInstitucion/' + me.id_eliminar)
                    .then(res => {
                        me.$vs.notify({
                            text: 'Periodo de esta institución eliminado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getPeriodosInstitucion();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },

            //===========FIN DE METODOS DE PERIODOS======================

            //===========METODOS PARA EDITAR INSTITUCION ===============

            async getCiudadSelect() {
                let me = this;
                this.$http.get(this.$server_url + "ciudad").then(function (response) {
                    me.ciudad = response.data;
                    // console.log(me.ciudad);
                });
            },
            async getRegionSelect() {
                let me = this;
                this.$http.get(this.$server_url + "region").then(function (response) {
                    me.region = response.data;
                });
            },
            async getPeriodoSelect() {
                let me = this;
                this.$http.get(this.$server_url + "periodo").then(function (response) {
                    me.periodo = response.data;
                });
            },
            async getInstitucionEditar(idinstitucion) {
                let me = this;
                me.$vs.loading();
                this.$http.get(this.$server_url + "institucion/" + idinstitucion)
                    .then(function (response) {
                        me.institucion = response.data;
                        if (me.institucion.tipo_institucion == 1) {
                            me.institucion.tipo_institucion = 'no'
                        } else {
                            me.institucion.tipo_institucion = 'si'
                        }
                        //llenar el radio matricula
                        if (me.institucion.aplica_matricula == 1) {
                            me.institucion.matricula = '1'
                        } else {
                            me.institucion.matricula = '0'
                        }
                        me.institucion.estado = response.data.estado_idEstado
                        console.log(me.institucion)
                        me.$vs.loading.close();
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                    })
            },
            rechargeInstitucion(e){
              let me = this;
              //0 => RECARGAR ; 1 CERRAR MODAL
              if(e == 0){
                me.popupAddInstitucion = false;
                me.getInstitucion();
              }else{
                me.popupAddInstitucion = false;
              }
            },
            async getVendedor() {
                let me = this;
                this.$http.get(this.$server_url + 'listaAsesores')
                    .then(function (response) {
                        me.vendedor = response.data;
                        // console.log(me.vendedor);
                    })
                    .catch(function (error) {})
            },

            //=======FIN DE METODOS PARA EDITAR INSTITUCION============

            //=======METODOS PARA EL MODAL DE LISTA DE DOCENTES========
            getUsuariosTipo() {
                let me = this;
                me.$vs.loading()
                if (me.tipo == 'docente') {
                    this.$http.get(this.$server_url + 'docentes?idInstitucion=' + me.institucionDocente.idInstitucion)
                        .then(function (response) {
                            me.usuarios = response.data
                            me.$vs.loading.close()
                            // console.log(me.usuarios)
                        })
                        .catch(function (error) {
                            console.log(error)
                            me.$vs.loading.close()
                        })
                }
                if (me.tipo == 'estudiante') {
                    this.$http.get(this.$server_url + 'estudiantesXInstitucion/' + me.institucionDocente.idInstitucion)
                        .then(function (response) {
                            me.usuarios = response.data
                            me.$vs.loading.close()
                            // console.log(me.usuarios)
                        })
                        .catch(function (error) {
                            console.log(error)
                            me.$vs.loading.close()
                        })
                }
            },
            getUsuariosTipoVisitas() {
                let me = this;
                const from = moment(me.fromDate).format('YYYY-MM-DD')
                const to = moment(me.toDate).format('YYYY-MM-DD')
                if (me.fromDate == null) {
                    me.$vs.notify({
                        text: 'Debe escoger una fecha inicio',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false
                }
                if (me.toDate == null) {
                    me.$vs.notify({
                        text: 'Debe escoger una fecha final',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false
                }
                if (me.fromDate > me.toDate) {
                    me.$vs.notify({
                        text: 'La fecha inicio no puede mayor que la fecha final',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false
                }
                me.usuarios = []
                me.$vs.loading()
                this.$http.get(this.$server_url + 'docentesVisitas?idInstitucion=' + me.institucionDocente.idInstitucion + '&fromDate=' + from + '&toDate=' + to)
                    .then(function (response) {
                        me.usuarios = response.data
                        me.$vs.loading.close()
                        // console.log(me.usuarios)
                    })
                    .catch(function (error) {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            },
            verVisitas(item) {
                let me = this;
                // console.log(item);
                me.popupVistasUsuario = true;
                localStorage.datoUser = JSON.stringify(item);

                me.datoU = JSON.parse(localStorage.getItem('datoUser'))
                me.getVisitasDocente();
                // if (me.tipo == 'docente') {
                //     me.$router.push('/institucion/docentes/visitas');
                // }
                // if (me.tipo == 'estudiante') {
                //     me.$router.push('/institucion/estudiante/visitas');
                // }
            },
            irAsignacion(item) {

                let me = this;
                // console.log( item )
                me.popupAsignacion = true;

                localStorage.setItem('user_select', (JSON.stringify(item)));
                localStorage.setItem('show_inst', 'si'); //desde vista docentes, mostrar institucion

                me.show_inst = (localStorage.getItem('show_inst'));
                me.usuarioAsignacion = JSON.parse(localStorage.getItem('user_select'));
                me.user_seleccionado = me.usuarioAsignacion.idusuario
                me.user_nombre = me.usuarioAsignacion.nombres + ' ' + me.usuarioAsignacion.apellidos
                me.user_email = me.usuarioAsignacion.email
                me.user_institucion = JSON.parse(localStorage.getItem('institucion'))
                me.getAreaSelect();
                me.getSeleccionadas();

                // me.$router.push('/usuarios/asignaturasInstitucion');
            },

            //=======FIN DEL METODOS PARA EL MODAL DE LISTA DE DOCENTES
            //=======METODOS PARA MODAL DE ASIGNACION DE LIBROS
            getSeleccionadas() {
                let me = this;
                me.$vs.loading();
                let data = new FormData();
                data.append('idusuario', me.user_seleccionado)
                this.$http.post(this.$server_url + "asignaturasDocent", data)
                    .then(res => {
                        // console.log(res.data);
                        me.seleccionadas = res.data;
                        // me.popupDocentes = true;
                        me.$vs.loading.close();
                    });
            },
            getAreaSelect() {
                let me = this;
                me.$vs.loading();
                this.$http.get(this.$server_url + "areaSelect").then(function (response) {
                    me.area = response.data.items;
                    // console.log(me.area);
                    me.$vs.loading.close();
                });
            },

            agregaAsignacion(item) {
                let me = this;
                let data = new FormData();
                data.append('usuario_idusuario', me.user_seleccionado)
                data.append('asignatura_idasignatura', item.id)
                this.$http.post(this.$server_url + "asignar_asignatura_docentes", data)
                    .then(function (res) {
                        // console.log(res.data);
                        if (res.data > 0) {
                            me.$vs.notify({
                                time: 7000,
                                text: 'Esta asignatura ya se encuentra asignada al docente',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        } else {
                            me.$vs.notify({
                                text: 'Asignatura agregada',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            me.getSeleccionadas();
                        }
                        me.$vs.loading.close();
                    });
            },
            eliminaAsignacion(item) {
                let me = this;
                // console.log(item)
                me.$vs.loading();
                this.$http.get(this.$server_url + "eliminaAsignacion/" + item.idasignado)
                    .then(function (res) {
                        // console.log(res.data);
                        me.$vs.notify({
                            text: item.nombreasignatura + ' eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getSeleccionadas();
                        me.$vs.loading.close();
                    });
            },
            moverPeriodoActual(){
              let me = this
              console.log("user_seleccionado",me.user_seleccionado)
              console.log("periodo",me.institucionSelected.periodo_id)
              this.$http.get(this.$server_url+'moverAsignaturasPeriodo/'+me.user_seleccionado+'/'+me.institucionSelected.periodo_id)
                .then(function (res) {
                  me.$vs.notify({
                  text:'Se cambio correctamente',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  me.getSeleccionadas();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
            },
            confirmaQuitar() {
                let me = this;
                me.popupAsignacion = false
                me.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: 'Confirmar',
                    text: '¿Está seguro de eliminar este contenido?',
                    acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    accept: me.f_quitarTodo,
                    cancel: me.f_regresar
                })
            },
            f_regresar() {
                let me = this
                me.popupAsignacion = true
            },
            f_quitarTodo() {
                let me = this;
                let idSelects = [];
                for (let index = 0; index < me.seleccionadas.length; index++) {
                    idSelects.push(me.seleccionadas[index].idasignado)
                }
                // console.log(idSelects)
                me.$vs.loading();
                let data = new FormData();
                data.append('idasiguser', idSelects)
                this.$http.post(this.$server_url + "quitaTodasAsignaturas", data)
                    .then(function (res) {
                        // console.log(res.data);
                        me.$vs.notify({
                            text: 'Asignaturas quitadas correctamente.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getSeleccionadas();
                        me.$vs.loading.close();
                    });
            },

            //=======FIN DE METODOS PARA MODAL DE ASIGNACION DE LIBROS

            //METODOS PARA MODAL VISITAS DE USUARIO
            getVisitasDocente() {
                let me = this;
                axios.get('https://foro.prolipadigital.com.ec/estudiantes?idusuario=' + me.datoU.idusuario + '&_sort=updatedAt:DESC')
                    .then(res => {
                        me.listaVisitas = res.data;
                        // console.log(me.listaVisitas)
                    })
                    .catch(error => {
                        console.log(' no se conecto a consultar las visitas ')
                    })
            },

            //======FIN DE MODAL PARA VISITAS DE USUARIO

            //====PARA EXPORTAR A EXCEL LOS DOCENTES CON LAS VISITAS======
            exportToExcel() {
                let headerTitle = ['nombres', 'apellidos', 'email', 'usuario', 'cedula', 'visitas', 'Fecha creacion'];
                let headerVal = ['nombres', 'apellidos', 'email', 'name_usuario', 'cedula', 'visitas', 'created_at'];
                let codigoSelectedMayus = this.codigoSelected
                for (var i = 0; i < codigoSelectedMayus.length; i++) {
                    for (var key in codigoSelectedMayus[i]) {
                        if (typeof codigoSelectedMayus[i][key] == "string") {
                            codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                        }
                    }
                }
                import('@/vendor/Export2Excel').then(excel => {
                    const list = codigoSelectedMayus
                    const data = this.formatJson(headerVal, list)
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: this.fileName,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                    this.clearFields()
                    this.guardarActivo = '';
                    this.generarActivo = ' ';
                    this.textAlertCant = '';
                    this.cantidad = '';
                    this.codigoSelected = [];
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    return v[j]
                }))
            },
            clearFields() {
                this.fileName = ''
                this.cellAutoWidth = true
                this.selectedFormat = 'xls'
            },
            openLoadingColor(libro) {
                this.$vs.loading({
                    color: '#1A76F2'
                })

            },
            //generar enlace para el estudiante pueda ingresar los codigos
            generateEnlaceEstudiante(tr) {
                let me = this;
                let host = location.protocol + '//' + location.hostname + ':' + location.port + '/formulario/diagnostico/'
                //let host = location.protocol + '//' + location.hostname +':'+ location.port + '/formulario/diagnostico/'+ tr.idInstitucion +'/'
                if (tr.statusPeriodo == 0) {
                    me.$vs.notify({
                        text: 'La institución tiene período inactivo no se puede generar el enlace',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 6000,
                    })
                    return
                }
                let formData = new FormData();
                me.$vs.loading()
                formData.append('institucion_id', tr.idInstitucion)
                formData.append('periodo_id', tr.periodo_id)
                formData.append('link', host)
                this.$http.post(this.$server_url + 'GenerarEnlaceDiagnostico', formData)
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.copiarLink(res.data[0])
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            },
            VerCoincidencias(tr) {
                let me = this;
                var resultado = ""
                me.busquedaMilton = ""
                me.arregloCoincidencias = []
                me.arregloIdsCoincidencias = []
                me.institucionCiudad = tr.ciudad
                me.institucionEnviar = tr.idInstitucion
                me.institucionNombreEnviar = tr.nombreInstitucion
                me.institucionEnviarCedula = tr.vendedorInstitucion
                me.institucionEnviarAIniciales = tr.iniciales
                const texto = tr.nombreInstitucion;
                // Convertimos la cadena en un arreglo de palabras
                const palabras = texto.split(" ");
                if (palabras.length > 3) {
                    // Obtenemos las últimas 3 palabras del arreglo
                    const ultimasTres = palabras.slice(-3);
                    // Unimos las últimas 3 palabras en una sola cadena
                    resultado = ultimasTres.join(" ");
                } else {
                    resultado = tr.nombreInstitucion
                }
                //enviar ids coincidencias al arreglo
                if (tr.codigo_mitlon_coincidencias == "null" || tr.codigo_mitlon_coincidencias == null || tr.codigo_mitlon_coincidencias == "") {} else {
                    let transforWords = tr.codigo_mitlon_coincidencias
                    me.arregloIdsCoincidencias = transforWords.split(",")
                }
                me.buscarCoincidencias(resultado)
            },
            buscarCoincidencias(coincidencia) {
                let me = this;
                me.arregloCoincidencias = []
                me.$vs.loading();
                this.$http.get(this.$server_url + 'buscarCoincidenciaInstitucionMilton?coincidencia=' + coincidencia)
                    .then(function (res) {
                        me.$vs.loading.close()
                        if (res.data.status == 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                        }
                        me.arregloCoincidencias = res.data
                        me.popupCoincidencia = true
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            },
            AsignarCodigoMilton(tr) {
                let me = this;
                let resolve = me.arregloIdsCoincidencias.filter(p => p == tr.ID_INSTITUCION)
                if (resolve.length == 0) {
                    me.arregloIdsCoincidencias.push(tr.ID_INSTITUCION)
                }
            },
            guadarIdsMilton() {
                let me = this
                if (me.arregloIdsCoincidencias.length == 0) {
                    me.$vs.notify({
                        text: 'Debe seleccionar al menos un id',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                let valorPrimario = me.arregloIdsCoincidencias[0]
                let enviarIds = me.arregloIdsCoincidencias.join(',')
                let formData = new FormData();
                formData.append('valorPrimario', valorPrimario)
                formData.append('codigosM', enviarIds)
                formData.append('institucion_id', me.institucionEnviar)
                formData.append('cedulaAsesor', me.institucionEnviarCedula)
                formData.append('cedulaAsesorIniciales', me.institucionEnviarAIniciales)
                me.$vs.loading();
                this.$http.post(this.$server_url + 'guadarIdsMilton', formData)
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Se actualizo correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getInstitucion()
                        me.popupCoincidencia = false
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            },
            eliminaAsignacionIdMilton(value) {
                let me = this;
                me.arregloIdsCoincidencias.splice(value, 1);
            },
            copiarLink(tr) {
                let me = this;
                let ruta = tr.link
                var aux = document.createElement("input");
                aux.setAttribute("value", ruta);
                document.body.appendChild(aux);
                aux.select();
                try {
                    var status = document.execCommand('copy');
                    if (!status) {
                        me.$vs.notify({
                            text: 'Error al copiar el link',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Link copiado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                } catch (err) {
                    console.log('No se pudo copiar');
                }
                document.body.removeChild(aux);
            },
            //METODOS REGISTRO DE DOCENTES
            registroDocentes(tr){
                let me = this
                if(tr.statusPeriodo == 0){
                    me.$vs.notify({
                        text: 'La institución tiene periodo inactivo, solicite la activación a Soporte',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:6000
                    })
                    return
                }
                me.popupAsignacionDocentes = true;
            },
            //FIN METODOS REGISTRO DE DOCENTES
            //IMPRIMIR CODIGOS ESTUDIANTES
            imprimirCodigosEstudiante(tr){
                let me = this;
                var datos = tr.periodo_id + '*' + tr.idInstitucion;
                me.$vs.loading()
                this.$http.get(this.$server_url + 'getEstudianteCodigos/'+datos)
                    .then(function (response) {
                        me.$vs.loading.close()
                        if(response.data.length == 0){
                            me.$vs.notify({
                                text: 'No hay códigos registrados en esta institución',
                                color: 'danger',
                                time:6000,
                                position:'center',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return
                        }
                        me.arregloCodigosEstudiantes = response.data;
                        me.exportToExcelCodigos()
                    })
                    .catch(function (error) {   me.$vs.loading.close()})
            },
            getEvaluacionesInstitucion(){
                let me = this
                me.$vs.loading()
                const { idInstitucion, periodo_id } = me.institucionSelected
                this.$http.get(this.$server_url + `getEvaluacionesInstitucion/${idInstitucion}/${periodo_id}/`)
                    .then(function (response) {
                        me.$vs.loading.close()
                        me.arrayEvaluacionesInstitucion = response.data
                        me.popupEvaluaciones            = true
                    })
                    .catch(function (error) {   me.$vs.loading.close()})
            },
            changeEvaluacion(e){
                let me = this
                me.popupEvaluaciones = false
            },
            //METODOS PARA DETALE DE VENTA
            getTipoVenta(tr) {
                let me = this;
                me.pedido.nombreInstitucion = tr.nombreInstitucion
                me.pedido.idInstitucion     = tr.idInstitucion
                me.pedido.periodo           = tr.periodo
                me.pedido.periodo_id        = tr.periodo_id
                me.tituloDetalleVenta       = 'Detalle de venta de ' + me.pedido.nombreInstitucion
                me.popupTipoVenta           = true;
            },
            //FIN METODOS PARA DETALLE DE VENTA
            //METODOS PARA ACTIVAR AL ULTIMO PERIODO
            getPeriodosActivar(){
              let me = this
              me.$vs.loading()
              me.periodoSelect = []
              this.$http.get(this.$server_url+'get_periodos_pedidos')
              .then(res => {
                me.$vs.loading.close()
                let datos = res.data
                if(datos.length == 0 ){
                  me.$vs.notify({
                  text:'No existe períodos para activar Comuniquese con soporte',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check',
                  time:5000,
                  })
                  return
                }
                //obtener el perido activo de la region para activar a la escuela en ese periodo
                if(datos.length > 0){
                  me.periodoSelect = datos.filter(p => p.cambiar_periodo == 1 && p.region_idregion == me.sendInstitucion.region)
                  //si no existe el periodo activo para la region para poder cambiar
                  if( me.periodoSelect.length == 0 ){
                    me.$vs.notify({
                    text:'No existe un período configurado para activar Comuniquese con soporte',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:5000,
                    })
                    return
                  }
                  //si existe mas de un periodo activo para la region
                  if( me.periodoSelect.length > 1 ){
                    me.$vs.notify({
                    text:'Existe más de un período configurado para activar Comuniquese con soporte',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:5000,
                    })
                    return
                  }
                  me.popupActualizarPeriodo = true;
                }
              })
              .catch(function (error) {
                me.$vs.loading.close();
              })
            },
            changePeriodo() {
              let me = this;
              me.$vs.loading();
              let data = new FormData();
              data.append('idperiodoescolar', me.periodoSelect[0].idperiodoescolar);
              data.append('idinstitucion',    me.sendInstitucion.idInstitucion)
              this.$http.post(this.$server_url + 'verifica_periodo', data)
                .then(res => {
                  me.$vs.loading.close();
                  if (res.data == 1) {
                    me.$vs.notify({
                      time: 8000,
                      text: 'Este periodo ya se encuentra asignado a la institucion ' + me.sendInstitucion.nombreInstitucion,
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                    })
                  } else {
                    me.$vs.notify({
                      text: 'Periodo agregado correctamente a la institucion ' + me.sendInstitucion.labnombreInstitucionel,
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check'
                    })
                  }
                  me.getInstitucion()
                  me.sendInstitucion            = {}
                  me.popupActualizarPeriodo     = false;
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
            },
            //FIN METODOS PARA ACTIVAR AL ULTIMO PERIODO
             //METODOS PARA EXCEL
            //para limipiar los campos del excel
            //metodo par descargar el excel
            exportToExcelCodigos() {
                let headerTitle = ['Código','Estudiante','Libro'];
                let headerVal = ['codigo', 'estudiante','nombrelibro'];
                let codigoSelectedMayus = this.arregloCodigosEstudiantes
                for (var i = 0; i < codigoSelectedMayus.length; i++) {
                    for (var key in codigoSelectedMayus[i]) {
                        if (typeof codigoSelectedMayus[i][key] == "string") {
                            codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                        }
                    }
                }
                import('@/vendor/Export2Excel').then(excel => {
                    const list = codigoSelectedMayus
                    const data = this.formatJson(headerVal, list)
                    var nombrefile = ""
                    if(this.openModal == 1){
                        nombrefile = this.fileName
                    }else{
                        nombrefile = "Reporte_de_codigo_de_estudiantes"
                    }
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: nombrefile,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                    this.clearFields()
                    this.guardarActivo = '';
                    this.generarActivo = ' ';
                    this.textAlertCant = '';
                    this.cantidad = '';
                })
            },
        },
    }
    </script>

    <style lang="css">
    .asig-select {
        display: inline-block;
        border: 0.7px solid rgb(201, 201, 204);
        border-radius: 6px;
        font-size: 12px;
    }

    .titulo {
        background: #4CB8C4;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #3CD3AD, #4CB8C4);
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #3CD3AD, #4CB8C4);
        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        color: white;
        letter-spacing: 1px;

    }

    /* Botón para seleccionar archivos */
    button.form-file-button {
        margin-top: 10px;
        vertical-align: middle;
        color: #fff;
        background: #24A6F6;
        margin: 0;
        border: 0;
        width: 50px;
        padding: 2px 8px;
        transform: scaleX(-1);
        /* Invertir botón horizontalmente */
    }

    /* Lista de archivos */
    span.form-file-span {
        flex: 1;
        display: inline-block;
        text-align: left;
        padding: 4px 10px;
        background: #24A6F6;
        color: #fff;
        padding: 10px;
        border-radius: 5px 15px;
        cursor: pointer;
        font-size: 20px;

    }
    </style>
