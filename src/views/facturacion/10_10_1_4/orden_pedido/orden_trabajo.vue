<template>
    <vx-card fixed-height="true">
      <vs-row vs-justify="flex-start">
        <vs-button type="border" color="success" class="mr-2" @click="getTemporada()"
          >Agregar orden de trabajo</vs-button
        >
        <vs-col
          type="flex"
          vs-justify="flex-start"
          vs-align="flex-start"
          class="m-2"
          vs-w="12"
        >
          <p>Búsqueda por filtros</p>
          <br />
          <vs-card class="seccionmostrartodo">
            <div>
              <div v-if="valorBusqueda == '0'">
                <vs-input
                  class="w-full"
                  @keyup.enter="getOrdenParametro()"
                  icon-after="true"
                  label-placeholder="icon-after"
                  style="margin: 0px 0px 20px 0px"
                  icon="search"
                  placeholder="Buscar"
                  v-model="busquedaxcodigo"
                />
              </div>
              <div v-if="valorBusqueda == '3'">
                <vs-row style="margin: 0px 0px 20px 0px">
                  <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <font style="font-size: 11.5px">&nbsp;Temporada:</font><br />
                    <v-select
                      :options="options1"
                      :reduce="(options1) => options1"
                      label="text"
                      class="w-full"
                      value="value"
                      placeholder="--Seleccione--"
                      v-model="region"
                    />
                  </vs-col>
                </vs-row>
                  <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <font style="font-size: 11.5px">&nbsp;Año:</font><br />
                    <v-select
                      :options="options2"
                      :reduce="(options2) => options2"
                      label="text"
                      class="w-full "
                      value="value"
                      placeholder="--Seleccione--"
                      v-model="anio"
                    />
                  </vs-col>
                </vs-row>
              </vs-row>
              </div>
              <div v-else></div>
            </div>
            <div>
              <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
                <li class="modelx"></li>
                <li style="margin: 10px 20px 0px 0px">
                  <vs-radio
                    vs-name="radios1"
                    vs-value="0"
                    v-model="valorBusqueda"
                    @input="busqueda = 'codigo'"
                    >Código</vs-radio
                  >
                </li>
                <li style="margin: 10px 10px 0px 0px">
                  <vs-radio
                    vs-name="radios2"
                    vs-value="1"
                    v-model="valorBusqueda"
                    @input="busqueda = 'pendiente'"
                    >Pendientes</vs-radio
                  >
                </li>
                <li style="margin: 10px 10px 0px 0px">
                  <vs-radio
                    vs-name="radios3"
                    vs-value="2"
                    v-model="valorBusqueda"
                    @input="busqueda = 'finalizado'"
                    >Finalizado</vs-radio
                  >
                </li>
                <li style="margin: 10px 10px 0px 0px">
                  <vs-radio
                    vs-name="radios3"
                    vs-value="3"
                    v-model="valorBusqueda"
                    @input="busqueda = 'temporada'"
                    >Temporada</vs-radio
                  >
                </li>
                <li>
                  <vs-button
                    color="warning"
                    type="filled"
                    style="margin-left: 10px"
                    @click="getOrdenParametro()"
                    icon="search"
                  ></vs-button>
                </li>
              </ul>
            </div>
          </vs-card>
        </vs-col>
      </vs-row>
      <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
      <TableOrdenesVue :Ordentrabajo="Ordentrabajo" @popup_desactivar_activar_orden="popup_desactivar_activar_orden" 
      @getDeta="getDeta" @getEditar="getEditar" @getPreguntaEliminar="getPreguntaEliminar"/>
       
      <!-- SECCION REGISTRO -->
  
      <!-- SECCION REGISTRO -->
      <vs-popup
        class="crear"
        title="Generar orden de trabajo"
        :active.sync="popupActivoGuardar"
        fullscreen
      >
        <vs-col
          vs-align="center"
          vs-lg="12"
          vs-sm="12"
          vs-xs="12"
          style="text-align: center"
          ><b style="color: blue">SELECCIONE LA TEMPORADA Y AÑO</b></vs-col
        >
        <vs-row style="height: 150px">
          <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
              <vs-col vs-justify="center" vs-align="center" vs-w="10">
                <font style="font-size: 11.5px">&nbsp;Temporada:</font><br />
                <v-select
                  :options="options1"
                  :reduce="(options1) => options1"
                  placeholder="--Seleccione--"
                  label="text"
                  class="small"
                  value="value"
                  style="height: 30px"
                  v-model="tabTemporada.temp"
                  @input="Validarselects()"
                />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
              <vs-col vs-justify="center" vs-align="center" vs-w="10">
                <font style="font-size: 11.5px">&nbsp;Año:</font><br />
                <v-select
                  :options="options2"
                  :reduce="(options2) => options2"
                  placeholder="--Seleccione--"
                  label="text"
                  class="small"
                  value="value"
                  @input="Validarselects()"
                  v-model="tabTemporada.anio"
                />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <template v-if='val== 1'>
          <vs-row style="margin-top: -80px">
            <vs-col
              vs-type="flex"
              vs-justify="center"
              vs-align="center"
              vs-w="3"
              class="mt-2"
            >
            </vs-col>
            <vs-col
              vs-align="center"
              vs-lg="12"
              vs-sm="12"
              vs-xs="12"
              style="text-align: center"
              ><b>REGISTRO DE ORDEN DE TRABAJO</b></vs-col
            >
            <vs-col
              vs-justify="center"
              vs-align="center"
              vs-lg="12"
              vs-sm="12"
              vs-xs="12"
              vs-type="flex"
            >
              <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                  <vs-input
                    label="Código:"
                    class="w-full"
                    icon="error_outline"
                    disabled
                    v-model="tabOrdenTrabajo.codigo"
                  />
                </vs-col>
              </vs-row>
              <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                  <vs-input
                    label="Fecha:"
                    class="w-full"
                    icon="error_outline"
                    disabled
                    v-model="tabOrdenTrabajo.fecha"
                  />
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col
              vs-type="flex"
              vs-justify="center"
              vs-align="center"
              vs-lg="12"
              vs-sm="12"
              vs-xs="12"
            >
              <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                  <p>Proveedor: *</p>
                  <v-select
                    :options="options4"
                    :reduce="(options4) => options4"
                    density="comfortable"
                    label="prov_nombre"
                    class="w-full"
                    value="prov_codigo"
                    placeholder="--Seleccione--"
                    v-model="tabOrdenTrabajo.prov_codigo"
                  />
                </vs-col>
              </vs-row>
              <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                  <vs-textarea
                    label="Observación: *"
                    placeholder="Escribe..."
                    class="w-full"
                    icon="mode_edit"
                    v-model="tabOrdenTrabajo.observacion"
                  />
                </vs-col>
              </vs-row>
            </vs-col>
  
            <vs-col
              vs-align="center"
              vs-lg="12"
              vs-sm="12"
              vs-xs="12"
              style="text-align: center"
              ><b>Añadir productos.</b></vs-col
            >
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col
                  vs-type="flex"
                  vs-justify="center"
                  vs-align="center"
                  vs-w="8"
                  vs-sm="9"
                  class="m-2"
                >
                  <v-select
                    :options="options3"
                    :reduce="(options3) => options3.pro_codigo"
                    label="pro_nombre"
                    class="w-full h-100"
                    placeholder="--Seleccione--"
                    v-model="pro_codigo"
                  />
                </vs-col>
                <vs-col
                  vs-type="flex"
                  vs-justify="center"
                  vs-align="center"
                  vs-w="1"
                  vs-sm="1"
                  class="m-2"
                >
                  <vs-button
                    color="success"
                    type="relief"
                    icon="add"
                    @click="add(k)"
                  ></vs-button>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col
              vs-align="center"
              vs-lg="12"
              vs-sm="12"
              vs-xs="12"
              style="text-align: center"
              ><b>Detalle de orden</b></vs-col
            >
  
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
              <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
              <br />
  
              <vs-table :data="inputs">
                    <vs-tr v-for="(input, k) in inputs" :key="k">
                      <vs-td width="50"
                        ><br /><b>{{ k + 1 }}</b></vs-td
                      >
                      <vs-td width="550">
                        <b>Libro {{input.pro_nombre}}</b></br>
                        <b>Id: </b> {{input.pro_codigo}}</br>
                      </vs-td>
                      <vs-td width="550">
                        <b>Páginas: </b> {{input.pro_int_pagina}}</br>
                        <b>Tamaño: </b> {{input.pro_tamaño}}</br>
                        <b>Acabados: </b> {{input.pro_acabados}}</br>
                        <b>Recubrimiento: </b> {{input.pro_cub_recubrimiento}}</br>
                        <b>Código Interior: </b> {{input.mat_in_codigo}}</br>
                        <b>Tintas Interior: </b> {{input.pro_int_tinta}}</br>
                        <b>Código Cubierta: </b> {{input.mat_cub_codigo}}</br>
                        <b>Tintas Cubierta:: </b> {{input.pro_cub_tintas}}</br>
                      </vs-td>
                      <vs-td width="1000">
                        <vs-input
                          label="Cantidad: *"
                          class="w-full m-1"
                          placeholder="2010"
                          icon="mode_edit"
                          type="number"
                          @keydown="filterKey"
                          v-model="input.cantidad"
                        />
  
                        <vs-input
                          label="Posible Entrega: *"
                          class="w-full"
                          type="date"
                          v-model="input.fe_entrega"
                        />
                        <vs-textarea
                          label="Observaciones: *"
                          placeholder="Escribe......"
                          icon="mode_edit"
                          class="w-full"
                          v-model="input.observacion"
                        />
                      </vs-td>
                      <vs-td>
                        <br /><br />
                        <vs-button
                          v-if="k > -1"
                          @click="remove(k)"
                          color="danger"
                          type="relief"
                          icon="delete"
                        ></vs-button>
                      </vs-td> </vs-tr
                    ><br />
              </vs-table>
            </vs-col>
          </vs-row>
          <br /><br />
          <vs-col
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            vs-w="12"
            class="mt-2"
          >
            <vs-button @click="getTemporada()" color="warning" type="relief"
              >Limpiar</vs-button
            >&emsp;
            <vs-button @click="guardarnuevo1()" color="success" type="relief"
              >Guardar</vs-button
            >&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief"
              >Cancelar</vs-button
            >
          </vs-col>
        </template>
      </vs-popup>
      <!-- detalles -->
      <vs-popup
        class="detalle"
        :title="`Detalles orden de trabajo: ${tabOrdenTrabajo.codigo}`"
        :active.sync="popupdetalle"
        fullscreen
      >
        <vs-row>
          <vs-col
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            vs-type="flex"
          >
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Código:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.codigo"
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Fecha: "
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.fecha"
                />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            vs-type="flex"
          >
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <p>Proveedor: *</p>
                <v-select
                  :options="options4"
                  :reduce="(options4) => options4"
                  density="comfortable"
                  label="prov_nombre"
                  class="w-full"
                  value="prov_codigo"
                  placeholder="--Seleccione--"
                  v-model="tabOrdenTrabajo.prov_codigo"
                  disabled
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-textarea
                  label="Observación: *"
                  placeholder="Escribe..."
                  class="w-full"
                  icon="error_outline"
                  v-model="tabOrdenTrabajo.observacion"
                  disabled
                />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            style="text-align: center"
            ><b>Detalle de orden</b></vs-col>
          <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <br />
            <vs-table :data="inputs">
                  <vs-tr v-for="(input, k) in inputs" :key="k">
                    <vs-td width="50"
                      ><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td width="550">
                      <b>Libro {{input.pro_nombre}}</b></br>
                      <b>Id: </b> {{input.pro_codigo}}</br>
                    </vs-td>
                    <vs-td width="550">
                        <b>Páginas: </b> {{input.det_or_int_paginas}}</br>
                        <b>Tamaño: </b> {{input.det_or_tamaño}}</br>
                        <b>Acabados: </b> {{input.det_or_acabados}}</br>
                        <b>Recubrimiento: </b> {{input.det_or_recubrimiento}}</br>
                        <b>Código Interior: </b> {{input.det_or_in_codigo}}</br>
                        <b>Tintas Interior: </b> {{input.det_or_in_tintas}}</br>
                        <b>Código Cubierta: </b> {{input.mat_cub_codigo}}</br>
                        <b>Tintas Cubierta:: </b> {{input.det_or_cub_tintas}}</br>
                    </vs-td>
                    <vs-td width="800">
                      <b>Cantidad: </b> {{input.det_or_cantidad}}</br>
                      <b>Posible Entrega: </b> {{input.det_or_posible_entrega}}</br>
                      <b>Observaciones: </b> {{input.det_or_observaciones}}</br>
                      
                    </vs-td> 
                    
                  </vs-tr>
            </vs-table>
          </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
          <vs-button @click="getCancelar()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
  
      <!-- SECCION EDITAR -->
      <vs-popup
        class="editar"
        :title="`Edición orden de trabajo: ${tabOrdenTrabajo.codigo}`"
        :active.sync="popupActivoEditar"
        fullscreen
      >
        <vs-row>
          <vs-col
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            vs-type="flex"
          >
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Código:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.codigo"
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Fecha: "
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.fecha"
                />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            vs-type="flex"
          >
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <p>Proveedor: *</p>
                <v-select
                  :options="options4"
                  :reduce="(options4) => options4"
                  density="comfortable"
                  label="prov_nombre"
                  class="w-full"
                  value="prov_codigo"
                  placeholder="--Seleccione--"
                  v-model="tabOrdenTrabajo.prov_codigo"
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-textarea
                  label="Observación: *"
                  placeholder="Escribe..."
                  class="w-full"
                  icon="mode_edit"
                  v-model="tabOrdenTrabajo.observacion"
                />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            style="text-align: center"
            ><b>Detalle de orden</b></vs-col
          >
  
          <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <br />
            <vs-table :data="inputs">
                  <vs-tr v-for="(input, k) in inputs" :key="k">
                    <vs-td width="50"
                      ><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td width="550">
                      <b>Libro {{input.pro_nombre}}</b></br>
                      <b>Id: </b> {{input.pro_codigo}}</br>
                    </vs-td>
                    <vs-td width="550">
                        <b>Páginas: </b> {{input.det_or_int_paginas}}</br>
                        <b>Tamaño: </b> {{input.det_or_tamaño}}</br>
                        <b>Acabados: </b> {{input.det_or_acabados}}</br>
                        <b>Recubrimiento: </b> {{input.det_or_recubrimiento}}</br>
                        <b>Código Interior: </b> {{input.det_or_in_codigo}}</br>
                        <b>Tintas Interior: </b> {{input.det_or_in_tintas}}</br>
                        <b>Código Cubierta: </b> {{input.mat_cub_codigo}}</br>
                        <b>Tintas Cubierta:: </b> {{input.det_or_cub_tintas}}</br>
                    </vs-td>
                    <vs-td width="1000">
                      
                      <vs-input
                        label="Cantidad:"
                        class="w-full m-1"
                        placeholder="2010"
                        icon="mode_edit"
                        type="number"
                        min="0"
                        @keydown="filterKey"
                        v-model="input.det_or_cantidad"
                      />
                      <vs-input
                        label="Posible Entrega: "
                        class="w-full m-1"
                        v-model="input.det_or_posible_entrega"
                      />
                      <vs-textarea
                        label="Observaciones: "
                        placeholder="Escribe......"
                        icon="mode_edit"
                        class="w-full"
                        v-model="input.det_or_observaciones"
                      />
                    </vs-td>
                    
                    <vs-td>
                      <br />
                      <vs-button
                        v-if="k > -1"
                        @click="getremove1(k, input.det_or_codigo)"
                        color="danger"
                        type="relief"
                        icon="delete"
                      ></vs-button>
                    </vs-td>
                  </vs-tr>
            </vs-table>
          </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
          <vs-button @click="getDetallar()" type="relief" icon="add">Detalles</vs-button
          >&emsp;
          <vs-button @click="editar()" type="relief" color="success" icon="edit"
            >Editar </vs-button
          >&emsp;
          <vs-button @click="getCancelar()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
  
        <vs-popup
          class="eliminar"
          :title="`¿Confirma que desea eliminar el detalle de la orden: ${tabOrdenTrabajo.codigo}?`"
          :active.sync="popupEliminar"
        >
          <vs-col
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            vs-w="3"
            class="mt-2"
          ></vs-col>
          <vs-col
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            vs-w="3"
            class="mt-2"
          >
            <vs-button
              @click="
                remove1(k, tabOrdenTrabajo.codigo);
                popupEliminar = false;
              "
              type="relief"
              >Aceptar</vs-button
            >
          </vs-col>
          <vs-col
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            vs-w="3"
            class="mt-2"
          >
            <vs-button @click="popupEliminar = false" color="danger" type="relief"
              >Cancelar</vs-button
            >
          </vs-col>
        </vs-popup>
      </vs-popup>
      <!-- añadir mas productos -->
      <vs-popup
        class="Detalle"
        :title="`Detalles Orden de trabajo: ${tabOrdenTrabajo.codigo}`"
        :active.sync="popupadd"
        fullscreen
      >
        <vs-row>
          <vs-col
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            style="text-align: center"
          >
            <vs-input
              label="Código:"
              class="w-full"
              icon="error_outline"
              disabled
              v-model="tabOrdenTrabajo.codigo"
            />
          </vs-col>
          <vs-col
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            style="text-align: center"
            ><b>Añadir productos.</b></vs-col
          >
          <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="8"
                vs-sm="9"
                class="m-2"
              >
                <v-select
                  :options="options3"
                  :reduce="(options3) => options3.pro_codigo"
                  label="pro_nombre"
                  class="w-full h-100"
                  placeholder="--Seleccione--"
                  v-model="pro_codigo"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="1"
                vs-sm="1"
                class="m-2"
              >
                <vs-button
                  color="success"
                  type="relief"
                  icon="add"
                  @click="add(k)"
                ></vs-button>
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            style="text-align: center"
            ><b>Detalle de orden</b></vs-col
          >
  
          <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <br
          /></vs-col>
  
          <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-table :data="inputs">
                  <vs-tr v-for="(input, k) in inputs" :key="k">
                    <vs-td width="50"
                      ><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td width="550">
                        <b>Libro {{input.pro_nombre}}</b></br>
                        <b>Id: </b> {{input.pro_codigo}}</br>
                      </vs-td>
                      <vs-td width="550">
                        <b>Páginas: </b> {{input.pro_int_pagina}}</br>
                        <b>Tamaño: </b> {{input.pro_tamaño}}</br>
                        <b>Acabados: </b> {{input.pro_acabados}}</br>
                        <b>Recubrimiento: </b> {{input.pro_cub_recubrimiento}}</br>
                        <b>Código Interior: </b> {{input.mat_in_codigo}}</br>
                        <b>Tintas Interior: </b> {{input.pro_int_tinta}}</br>
                        <b>Código Cubierta: </b> {{input.mat_cub_codigo}}</br>
                        <b>Tintas Cubierta:: </b> {{input.pro_cub_tintas}}</br>
                      </vs-td>
                    <vs-td width="1000">
                      <vs-input
                        label="Cantidad: *"
                        class="w-full m-1"
                        placeholder="2010"
                        icon="mode_edit"
                        type="number"
                        min="0"
                        @keydown="filterKey"
                        v-model="input.cantidad"
                      />
  
                      <vs-input
                        label="Posible Entrega: *"
                        class="w-full m-1"
                        type="date"
                        v-model="input.fe_entrega"
                      />
                      <vs-textarea
                        label="Observaciones: *"
                        placeholder="Escribe......"
                        icon="mode_edit"
                        class="w-full"
                        v-model="input.observacion"
                      />
                    </vs-td>
                    
                    <vs-td>
                      <br /><br />
                      <vs-button
                        v-if="k > -1"
                        @click="remove(k)"
                        color="danger"
                        type="relief"
                        icon="delete"
                      ></vs-button>
                    </vs-td> </vs-tr
                  ><br />
            </vs-table>
          </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
          <vs-button @click="guardarnuevo(); " color="success" type="relief"
            >Guardar</vs-button
          >&emsp;
          <vs-button @click="popupadd = false; popupActivoEditar = true;" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
  
      <vs-popup
        class="eliminar"
        :title="`¿Confirma que desea eliminar el registro: ${tabOrdenTrabajo.codigo}?`"
        :active.sync="popupActivoEliminar"
      >
        <vs-col
          vs-type="flex"
          vs-justify="center"
          vs-align="center"
          vs-w="3"
          class="mt-2"
        ></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
          <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
          <vs-button @click="getCancelar()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
  
      <vs-popup
        class="desactivar"
        :title="`¿Confirma que desea cambiar el estado de la orden de trabajo: ${tabOrdenTrabajo.codigo}?`"
        :active.sync="popupActivoDesactivar"
      >
        <vs-col
          vs-type="flex"
          vs-justify="center"
          vs-align="center"
          vs-w="3"
          class="mt-2"
        ></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
          <vs-button @click="desactivar_activar_orden()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
          <vs-button @click="getCancelar()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
    </vx-card>
  </template>
  <script>
  import Vue from "vue";
  import axios from "axios";
  import vSelect from "vue-select";
  import TableOrdenesVue from "./components/TableOrdenes.vue";
  export default {
    data() {
      return {
        k: "",
        counter: 0,
        Ordentrabajo: [],
        popupdetalle: false,
        popupActivoGuardar: false,
        popupActivoEditar: false,
        popupEliminar: false,
        popupActivoDesactivar: false,
        popupActivoEliminar: false,
        popuptemporada: false,
        popupadd: false,
        tabTemporada: {
          temp: "",
          anio: "",
        },
        changeValues: false,
        tabOrdenTrabajo: {
          codigo: "",
          fecha: "",
          serie: "",
          prov_codigo: "",
          observacion: "",
          pro_car_codigo: "",
        },
        inputs: [],
        id: "",
        idusuarioresp: "",
        pro_codigo: "",
        region: "",
        anio: "",
        val:0,
        Ordentodo: [],
        obser: "",
        Producto: [],
        busquedaxcodigo: "",
        valorBusqueda: "0",
        checkBox_mostrarinactivos: false,
        options1: [
          { text: "COSTA", value: "C" },
          { text: "SIERRA", value: "S" },
        ],
        options3: [],
        options4: [],
        options: [],
        options2: [
          { text: "2010", value: "10" },
          { text: "2011", value: "11" },
          { text: "2012", value: "12" },
          { text: "2013", value: "13" },
          { text: "2014", value: "14" },
          { text: "2015", value: "15" },
          { text: "2016", value: "16" },
          { text: "2017", value: "17" },
          { text: "2018", value: "18" },
          { text: "2019", value: "19" },
          { text: "2020", value: "20" },
          { text: "2021", value: "21" },
          { text: "2022", value: "22" },
          { text: "2023", value: "23" },
          { text: "2024", value: "24" },
          { text: "2025", value: "25" },
        ],
      };
    },
  
    components: {
      "v-select": vSelect,
      TableOrdenesVue
    },
    computed: {
   
    },
    mounted() {
      this.mostrarFechayhora();
      this.mostrarFecha();
    },
    methods: {
      filterKey(e) {
        const key = e.key;
        if (key === "." || key === "-" || key === "e" || key === "+")
          return e.preventDefault();
      },
      Validarselects() {
        let me = this;
        if (me.tabTemporada.temp == null || me.tabTemporada.temp == 0) {
          me.$vs.notify({
            text: "Seleccione..",
            color: "warning",
            iconPack: "feather",
            icon: "icon-check",
          });
          return false;
        }
        if (me.tabTemporada.anio == null || me.tabTemporada.anio == 0) {
          me.$vs.notify({
            text: "Seleccione..",
            color: "warning",
            iconPack: "feather",
            icon: "icon-check",
          });
          return false;
        }
        me.$vs.loading();
        me.val=1;
        this.getNuevo(me.tabTemporada.temp.value, me.tabTemporada.anio.value);
        me.$vs.loading.close();
      },
      getDeta(tr) {
        this.popupdetalle = true;
        this.tabOrdenTrabajo.codigo = tr.or_codigo;
        this.tabOrdenTrabajo.fecha = tr.or_fecha;
        this.tabOrdenTrabajo.observacion = tr.or_observacion;
        this.options4 = [];
        this.tabOrdenTrabajo.prov_codigo = {prov_codigo:tr.prov_codigo, prov_nombre:tr.prov_nombre};
        this.inputs = [];
  
        let me = this;
        me.$vs.loading();
        this.getprov();
        var url = "";
        url = this.$server_url + "Get_Ordendetalle?or_codigo=" + tr.or_codigo;
        this.$http
          .get(url)
          .then(function (res) {
            me.inputs = res.data;
  
            me.inputs.push();
            me.$vs.loading.close();
            if (res.data.message) {
              me.$vs.notify({
                text: res.data.message,
                color: "success",
                iconPack: "feather",
                icon: "icon-user",
              });
            }
          })
          .catch(function (error) {
            console.log(error + " error");
            this.inputs = [];
            me.$vs.loading.close();
          });
      },
      getOrden() {
        let me = this;
        let url =
          this.$server_url +
          "GetOrden_xfiltro?busqueda=undefined&razonbusqueda=" +
          me.tabOrdenTrabajo.codigo;
        me.$vs.loading();
        this.$http
          .get(url)
          .then(function (res) {
            me.Ordentrabajo = res.data;
  
            if (me.Ordentrabajo.length === 0) {
              me.$vs.notify({
                text: "No hay órden de trabajo para esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.Ordentrabajo = [];
              me.region.text = "";
              me.anio.text = "";
              me.$vs.loading.close();
            } else {
              me.$vs.loading.close();
              if (res.data.message) {
                me.$vs.notify({
                  text: res.data.message,
                  color: "success",
                  iconPack: "feather",
                  icon: "icon-user",
                });
              }
            }
          })
          .catch(function (error) {
            if (error.response && error.response.status === 404) {
              me.$vs.notify({
                text: "No hay órden de trabajo para esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.Ordentrabajo = [];
              me.$vs.loading.close();
            } else {
              console.log(error + " error");
              me.$vs.loading.close();
            }
          });
      },
      getOrdenParametro() {
        let me = this;
        let url;
        if (me.busqueda == "codigo") {
          if (me.busquedaxcodigo.length < 2) {
            me.$vs.notify({
              text: "Minimo 2 caracteres de busqueda",
              color: "warning",
              iconPack: "feather",
              icon: "icon-check",
            });
            return false;
          }
          url =
            this.$server_url +
            "GetOrden_xfiltro?busqueda=" +
            me.busqueda +
            "&razonbusqueda=" +
            me.busquedaxcodigo;
        } else if (me.busqueda == "undefined") {
          if (me.busquedaxcodigo.length < 2) {
            me.$vs.notify({
              text: "Minimo 2 caracteres de busqueda",
              color: "warning",
              iconPack: "feather",
              icon: "icon-check",
            });
            return false;
          }
          url =
            this.$server_url +
            "GetOrden_xfiltro?busqueda=" +
            me.busqueda +
            "&razonbusqueda=" +
            me.busquedaxcodigo;
        } else if (me.busqueda == "temporada") {
          let a = me.region.value + me.anio.value;
          url =
            this.$server_url +
            "GetOrden_xfiltro?busqueda=" +
            me.busqueda +
            "&razonbusqueda=" +
            a;
        } else {
          url = this.$server_url + "GetOrden_xfiltro?busqueda=" + me.busqueda;
        }
        me.$vs.loading();
        this.$http
          .get(url)
          .then(function (res) {
            me.Ordentrabajo = res.data;
  
            if (me.Ordentrabajo.length === 0) {
              me.$vs.notify({
                text: "No hay órden de trabajo para esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.Ordentrabajo = [];
              me.$vs.loading.close();
            } else {
              me.$vs.loading.close();
              if (res.data.message) {
                me.$vs.notify({
                  text: res.data.message,
                  color: "success",
                  iconPack: "feather",
                  icon: "icon-user",
                });
              }
            }
          })
          .catch(function (error) {
            if (error.response && error.response.status === 404) {
              me.$vs.notify({
                text: "No hay órden de trabajo para esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.Ordentrabajo = [];
              me.$vs.loading.close();
            } else {
              console.log(error + " error");
              me.$vs.loading.close();
            }
          });
      },
      mostrarFechayhora: function () {
        const date = new Date();
        const formatear =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2) +
          " " +
          ("0" + date.getHours()).slice(-2) +
          ":" +
          ("0" + date.getMinutes()).slice(-2) +
          ":" +
          ("0" + date.getSeconds()).slice(-2);
  
        return formatear;
      },
      mostrarFecha: function () {
        let currendate = new Date();
        let Nueva = new Date();
        Nueva.setDate(currendate.getDate() + 15);
        const res =
          Nueva.getFullYear() +
          "-" +
          ("0" + (Nueva.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + Nueva.getDate()).slice(-2);
        return res;
      },
      add(k) {
        let a, b, c, d, e, f, g, h, i, j;
        let me = this;
        let fe = me.mostrarFecha();
  
        me.$vs.loading();
        var nombre = me.pro_codigo;
        fetch(this.$server_url + "GetProductoCaracter?pro_codigo=" + nombre) // llamamos a la ruta del controlador
          .then((res) => res.json())
          .then((res) => {
            Object.entries(res[0]).forEach((elem) => {
              if (elem[0] == "pro_codigo") {
                a = elem[1];
              } else if (elem[0] == "pro_nombre") {
                b = elem[1];
              } else if (elem[0] == "pro_tama\u00f1o") {
                c = elem[1];
              } else if (elem[0] == "mat_in_codigo") {
                d = elem[1];
              } else if (elem[0] == "pro_int_tinta") {
                e = elem[1];
              } else if (elem[0] == "mat_cub_codigo") {
                f = elem[1];
              } else if (elem[0] == "pro_cub_recubrimiento") {
                g = elem[1];
              } else if (elem[0] == "pro_cub_tintas") {
                h = elem[1];
              } else if (elem[0] == "pro_acabados") {
                i = elem[1];
              } else if (elem[0] == "pro_int_pagina") {
                j = elem[1];
              }
            });
            this.inputs.push({
              id: 0,
              pro_codigo: a,
              pro_nombre: b,
              pro_int_pagina: j,
              pro_tamaño: c,
              pro_acabados: i,
              pro_cub_recubrimiento: g,
              cantidad: "",
              fe_entrega: fe,
              observacion: "",
              mat_in_codigo: d,
              pro_int_tinta: e,
              mat_cub_codigo: f,
              pro_cub_tintas: h,
            });
            me.pro_codigo = "";
  
            me.$vs.loading.close();
          })
          .catch(function (error) {
            if (error.response != "") {
              me.$vs.notify({
                text:
                  "No esta registrado las caracteristicas del producto para la orden de trabajo en esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.$vs.loading.close();
            } else {
              console.log(error + " error");
              me.$vs.loading.close();
            }
          });
      },
      remove(index) {
        let me = this;
        let preId = 0;
        preId = this.inputs[index].id;
        if (preId > 0) {
          let formData = new FormData();
          formData.append("id", preId);
  
          this.inputs.splice(index, 1);
        } else {
          this.inputs.splice(index, 1);
        }
      },
      getremove1(index, b) {
        this.popupEliminar = true;
  
        this.tabOrdenTrabajo.codigo = b;
        this.k = index;
      },
      remove1(index, b) {
        let me = this;
        let preId = 0;
        let datos = {
          det_or_codigo: b,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Eliminar_OrdenDetalle", datos)
          .then((res) => {
            preId = this.inputs[index].id;
            if (preId > 0) {
              let formData = new FormData();
              formData.append("id", preId);
  
              this.inputs.splice(index, 1);
            } else {
              this.inputs.splice(index, 1);
            }
            me.$vs.loading.close();
  
            me.$vs.notify({
              text: "Detalle de la orden eliminado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          })
          .catch(function (error) {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Detalle de la orden no se pudo eliminar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
      edit() {
        let formData = new FormData();
        formData.append("data_detalleorden", JSON.stringify(this.inputs));
        this.$vs.loading();
        this.$http
          .post(this.$server_url + "PostOrdenDetalle_Editar", formData)
          .then((res) => {
            this.$vs.loading.close();
            this.getOrden();
            this.$vs.notify({
              text: "Detalle de orden editado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          })
          .catch(function () {
            this.$vs.loading.close();
            this.$vs.notify({
              text: "Detalle de Orden de trabajo no se pudo editar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
  
      getTemporada() {
        this.val=0;
        this.popupActivoGuardar = true;
        this.tabTemporada.temp = "";
        this.tabTemporada.anio = {text:'2024', value:'24'};
        this.mostrarFecha();
      },
      
      //SECCION GUARDAR NUEVO PRODUCTO
      getDetallar() {
        this.popupadd = true;
        this.popupActivoEditar = false;
        this.inputs = [];
        this.getserie();
      },
      getNuevo(a, b) {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        me.idusuarioresp = usuarioObjeto.iniciales;
        me.tabOrdenTrabajo.observacion = "";
        me.options4 = [];
        me.pro_codigo = "";
  
        let c, d;
        let ne = [];
  
        var f = this.mostrarFechayhora();
        if (!a || !b) {
          this.$vs.notify({
            text: "seleccione los datos antes ",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        } else {
          me.$vs.loading();
          
          me.getserie();
          me.getprov();
          this.$http
            .get(this.$server_url + "Get_Codigo")
            .then((res) => {
              ne = res.data;
              c = ne[0];
              d = ne[1];
              me.id = c + "-" + a + b + "-" + me.idusuarioresp + "-" + d;
              me.$vs.loading.close();
              me.tabOrdenTrabajo.codigo = me.id;
              me.tabOrdenTrabajo.fecha = me.mostrarFechayhora();
              me.tabOrdenTrabajo.prov_codigo = "";
            })
            .catch((err) => {
              console.log(err);
              me.$vs.loading.close();
            });
          this.popupActivoGuardar = true;
          this.inputs = [];
        }
      },
      getserie() {
        let me = this;
        me.pro_codigo = "";
        me.options3 = [];
        this.$http
          .get(this.$server_url + "GetProd")
          .then((res) => {
            me.options3 = res.data;
          })
          .catch((err) => {
            console.log(err);
            me.options3 = [];
          });
      },
      getprov() {
        let me = this;
        me.options4 = [];
        this.$http
          .get(this.$server_url + "Get_provedor")
          .then((res) => {
            me.options4 = res.data;
          })
          .catch((err) => {
            console.log(err);
            me.options4 = [];
            me.$vs.loading.close();
          });
      },
      guardarnuevo1() {
        let me = this;
        var f = me.mostrarFechayhora();
        let cod = me.id;
        let a = me.tabOrdenTrabajo.prov_codigo.prov_codigo;
  
        let b = "1";
        console.log(a);
        if (me.tabOrdenTrabajo.observacion==0 ||me.tabOrdenTrabajo.observacion==null || me.tabOrdenTrabajo.prov_codigo.prov_codigo==null ) {
          me.$vs.notify({
            text: "Escriba los datos antes de guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        if (me.inputs.length == 0) {
          me.$vs.notify({
            text: "Agregue los detalles antes de guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        let datos = {
          or_codigo: cod,
          usu_codigo: me.idusuarioresp,
          or_fecha: f,
          prov_codigo: parseInt(a),
          or_estado: parseInt(b),
          or_observacion: me.tabOrdenTrabajo.observacion,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostOrden_Registrar_modificar", datos)
          .then((res) => {
            me.guardarnuevo();
            me.$vs.loading.close();
            me.Ordentrabajo = [];
            this.popupActivoEditar = false;
            this.popupActivoDesactivar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
          })
          .catch(function () {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Orden de trabajo no se pudo guardar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
  
      guardarnuevo() {
        let me = this;
        me.id = me.tabOrdenTrabajo.codigo;
        let formData = new FormData();
  
        formData.append("data_detalleorden", JSON.stringify(me.inputs));
        formData.append("or_codigo", me.id);
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostOrdenDetalle_Registra", formData)
          .then((res) => {
            me.Ordentrabajo = [];
            me.$vs.loading.close();
            me.getOrden();
            me.$vs.notify({
              text: "La orden de trabajo y los detalles se ha guardado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            this.getCancelar();
          })
          .catch(function () {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Orden de trabajo no se pudo guardar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
      getEditar(tr) {
        this.popupActivoEditar = true;
        this.tabOrdenTrabajo.codigo = tr.or_codigo;
        this.tabOrdenTrabajo.fecha = tr.or_fecha;
        this.tabOrdenTrabajo.observacion = tr.or_observacion;
        this.options4 = [];
        this.getprov();
        this.tabOrdenTrabajo.prov_codigo = {prov_codigo:tr.prov_codigo, prov_nombre:tr.prov_nombre};
        this.inputs = [];
        let me = this;
        me.$vs.loading();
        var url = "";
        url = this.$server_url + "Get_Ordendetalle?or_codigo=" + tr.or_codigo;
        this.$http
          .get(url)
          .then(function (res) {
            me.inputs = res.data;
            me.$vs.loading.close();
            if (res.data.message) {
              me.$vs.notify({
                text: res.data.message,
                color: "success",
                iconPack: "feather",
                icon: "icon-user",
              });
            }
          })
          .catch(function (error) {
            console.log(error + " error");
            this.inputs = [];
            me.$vs.loading.close();
          });
      },
      editar() {
        let me = this;
        if (!me.tabOrdenTrabajo.observacion) {
          me.$vs.notify({
            text: "Escriba los datos antes de editar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        let datos = {
          or_codigo: me.tabOrdenTrabajo.codigo,
          or_observacion: me.tabOrdenTrabajo.observacion,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostOrden_Registrar_modificar", datos)
          .then((res) => {
            me.edit();
            me.$vs.loading.close();
            this.popupActivoEditar = false;
            me.Ordentrabajo = [];
          })
          .catch(function (error) {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Orden de trabajo no se pudo EDITAR",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
      popup_desactivar_activar_orden(tr) {
        console.log("llego",tr)
        this.popupActivoDesactivar = true;
        this.tabOrdenTrabajo.codigo = tr.or_codigo;
        this.tabOrdenTrabajo.or_estado = tr.or_estado;
      },
      desactivar_activar_orden() {
        let me = this;
        let valornuevo = me.tabOrdenTrabajo.or_estado;
        if (valornuevo == 1) {
          valornuevo = 2;
          let datos = {
            or_codigo: me.tabOrdenTrabajo.codigo,
            or_estado: valornuevo,
          };
          me.$vs.loading();
           this.$http
            .post(this.$server_url + "Desactivar_Orden", datos)
            .then((res) => {
              me.$vs.loading.close();
              me.Ordentrabajo = [];
              me.$vs.notify({
                text: "Orden Finalizada",
                color: "success",
                iconPack: "feather",
                icon: "icon-check",
              });
              me.getCancelar();
            })
            .catch((error) => {
              console.log(error);
              me.$vs.loading.close();
              me.$vs.notify({
                text: "No se pudo finalizar la orden",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
            });
        } else if (valornuevo == 2) {
          valornuevo = 1;
          let datos = {
            or_codigo: me.tabOrdenTrabajo.codigo,
            or_estado: valornuevo,
          };
          me.$vs.loading();
          this.$http
            .post(this.$server_url + "Desactivar_Orden", datos)
            .then((res) => {
              me.$vs.loading.close();
              me.Ordentrabajo = [];
              me.$vs.notify({
                text: "Orden Pendiente",
                color: "success",
                iconPack: "feather",
                icon: "icon-check",
              });
              me.getCancelar();
            })
            .catch((error) => {
              console.log(error);
              me.$vs.loading.close();
              me.$vs.notify({
                text: "No se pudo poner en pendiente la orden",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
            });
        }
      },
      getPreguntaEliminar(tr) {
        this.popupActivoEliminar = true;
        this.tabOrdenTrabajo.codigo = tr.or_codigo;
      },
      getEliminar() {
        let me = this;
        console.log(this.tabOrdenTrabajo.codigo);
        let datos = {
          or_codigo: this.tabOrdenTrabajo.codigo,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Eliminar_Orden", datos)
          .then((data) => {
            me.$vs.loading.close();
            me.Ordentrabajo = [];
            me.$vs.notify({
              text: "Orden de trabajo eliminado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            me.getCancelar();
          })
          .catch(function () {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Orden de trabajo no se pudo eliminar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
      getCancelar() {
        this.popupActivoEditar = false;
        this.popupActivoGuardar = false;
        this.popupActivoEliminar = false;
        this.popupActivoDesactivar = false;
        this.popuptemporada = false;
        this.popupadd = false;
        this.popupdetalle = false;
      },
    },
  };
  </script>
  