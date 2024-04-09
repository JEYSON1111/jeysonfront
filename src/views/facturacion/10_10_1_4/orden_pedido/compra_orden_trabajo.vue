<template>
    <vx-card fixed-height="true">
      <vs-row vs-justify="flex-start">
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
              <div v-if="valorBusqueda == '2'">
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
                      class="w-full"
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
  
                <li style="margin: 10px 10px 0px 0px">
                  <vs-radio
                    vs-name="radios1"
                    vs-value="0"
                    v-model="valorBusqueda"
                    @input="busqueda = 'pendiente'"
                    >Pendientes</vs-radio
                  >
                </li>
                <li style="margin: 10px 10px 0px 0px">
                  <vs-radio
                    vs-name="radios2"
                    vs-value="1"
                    v-model="valorBusqueda"
                    @input="busqueda = 'finalizado'"
                    >Finalizado</vs-radio
                  >
                </li>
                <li style="margin: 10px 10px 0px 0px">
                  <vs-radio
                    vs-name="radios3"
                    vs-value="2"
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
      
      <vs-table  :data="Ordentrabajo">
          <vs-chip color="primary"
            >Cantidad: <b> {{ Ordentrabajo.length }}</b></vs-chip
          >
          <vs-tr>
          <vs-th> Código </vs-th>
          <vs-th>Proveedor</vs-th>
          <vs-th>Usuario Creador</vs-th>
          <vs-th>Fecha Creación</vs-th>
          <vs-th>Observación</vs-th>
          <vs-th>Estado</vs-th>
          <vs-th width="100"> Acciones </vs-th>
          </vs-tr>
          <vs-tr :key="indextr" v-for="(tr, indextr) in Ordentrabajo">
            <vs-td >
              {{ tr.or_codigo }}
            </vs-td>
            <vs-td> {{ tr.prov_nombre }} </vs-td>
            <vs-td>{{ tr.usu_codigo }} {{ tr.nombres }} {{ tr.apellidos }} </vs-td>
  
            <vs-td>{{ tr.or_fecha }}</vs-td>
            <vs-td>{{ tr.or_observacion }}</vs-td>
  
            <vs-td>
              <vs-chip v-if="tr.or_estado == 1" color="warning">Pendiente</vs-chip>
              <vs-chip v-if="tr.or_estado == 2" color="success">Finalizado</vs-chip></vs-td
            >
            <vs-td >
              <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                <vs-button
                  class="a-icons"
                  href.prevent
                  icon="more_vert"
                  type="border"
                ></vs-button>
                <vs-dropdown-menu style="width: 250px" class="cursor">
                  <vs-dropdown-item>
                    <vs-button
                      color="#FAB818"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        getEditar(tr);
                      "
                      >Ver detalles</vs-button
                    >
                     <vs-button
                      color="#8F4897"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        getVisualiza(tr);
                      "
                      >Ver Compras</vs-button
                    >
                    <vs-button
                      v-if="tr.or_estado == 1"
                      color="#046AE7"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        getDetallar(tr);
                      "
                      >Nueva compra</vs-button
                    >
                    <vs-button
                      v-if="tr.or_estado == 1"
                      color="#28C76F"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        popup_desactivar_activar_orden(tr);
                      "
                      >Finalizar orden</vs-button
                    >
                    <vs-button
                      v-if="tr.or_estado == 2"
                      color="#FAB818"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        popup_desactivar_activar_orden(tr);
                      "
                      >Pasar a pendiente orden</vs-button
                    >
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </vs-td>
          </vs-tr>
      </vs-table>
      <vs-popup
        class="Visualiza"
        :title="`Compras de la Orden de trabajo: ${tabOrdenTrabajo.codigo}`"
        :active.sync="popupvisualiza"
        fullscreen
      >
        <vs-row>
        <vs-table  search :data="Compras">
          <vs-chip color="primary"
            >Cantidad: <b> {{ Compras.length }}</b></vs-chip
          >
         <vs-tr>
          <vs-th> Código </vs-th>
          <vs-th>Factura</vs-th>
          <vs-th width="300">Fecha Creación</vs-th>
          <vs-th>Observación</vs-th>
          <vs-th>Valores</vs-th>
          <vs-th width="100" > Acciones </vs-th>
         </vs-tr>
          <vs-tr :key="k" v-for="(tr, k) in Compras">
            <vs-td >
              {{ tr.com_codigo }}
            </vs-td>
            <vs-td> {{ tr.com_factura }} </vs-td>
            <vs-td>{{ tr.com_fecha }} </vs-td>
  
            <vs-td>{{ tr.com_observacion }}</vs-td>
  
            <vs-td>
                <small><b>IVA $:</b> {{tr.com_iva }} </small><br>
                <small><b>Descuento $:</b> {{tr.com_descuento}} </small><br>
                <small><b>Total $:</b> {{tr.com_valor}} </small><br>            
              </vs-td
            >
            <vs-td >
            
                    <vs-button
                     v-if="estado == 1"
                      color="#FAB818"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        getEdita(tr);
                      "
                      >Editar</vs-button
                    >
                     <vs-button
                      color="#8F4897"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        getDeta(tr);
                      "
                      >Ver Detalles</vs-button
                    ><vs-button
                      v-if="estado == 1"
                      color="danger"
                      type="line"
                      class="w-full"
                      @click="
                        popupActivo = true;
                        getPreguntaEliminar(tr);
                      "
                      >Eliminar</vs-button
                    >
                  
            </vs-td>
          </vs-tr>
      </vs-table>
        </vs-row>
        </vs-popup>
      <!-- SECCION EDITAR -->
      <vs-popup
        class="Compra"
        :title="`Detalles Compra Nº ${com_codigo } Orden de trabajo: ${tabOrdenTrabajo.codigo}`"
        :active.sync="popupcompras"
        
      >
        <vs-row>
        <vs-col
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
            vs-xs="12"
            style="text-align: center"
            ><b>Detalles de la compra</b></vs-col
          >
  
          <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ detale.length }}</vs-divider>
            <br />
            <vs-table :data="detale">
             <template slot="thead">
                <vs-th> Nº </vs-th>
                <vs-th>Producto</vs-th>  
                <vs-th>Cantidad Solicitada</vs-th>            
                <vs-th>Cantidad Comprada</vs-th>
        </template>
              
                  <vs-tr v-for="(tr, k) in detale" :key="k" >
                    <vs-td><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td>
                      <small><b>Código #:</b> {{tr.pro_codigo }} </small><br>
                      <small><b>Precio $:</b> {{tr.det_com_valor_u}} </small><br>
                    </vs-td>
                    <vs-td >
                     {{tr.det_or_cantidad }}
                    </vs-td>
                    <vs-td >
                     {{tr.det_com_cantidad}}
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
      <!-- ver detalles  -->
      <vs-popup
        class="detalle"
        :title="`Detalles Orden de trabajo: ${tabOrdenTrabajo.codigo}`"
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
      <!-- agregar Compra -->
      <vs-popup
        class="Detalle"
        :title="`Compra de Orden de trabajo Nº: ${id }`"
        :active.sync="popupadd"
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
              <vs-col
                vs-align="center"
                vs-lg="12"
                vs-sm="12"
                vs-xs="12"
                style="text-align: center"
                ><b>Órden</b></vs-col
              >
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="CODIGO:"
                  placeholder="CODIGO:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.codigo"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="FECHA: "
                  placeholder="FECHA:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.fecha"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="10"
                vs-sm="12"
                class="m-2"
              >
                <vs-input
                  label="Proveedor: "
                  placeholder="Proveedor"
                  class="w-full"
                  disabled
                  v-model="tabOrdenTrabajo.prov_codigo"
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
              <vs-col
                vs-align="center"
                vs-lg="12"
                vs-sm="12"
                vs-xs="12"
                style="text-align: center"
                ><b>Compra</b></vs-col
              >
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Factura:*"
                  placeholder="Factura:"
                  class="w-full"
                  icon="edit"
                  v-model="tabCompraOrden.factura"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="IVA $:*"
                  placeholder="00,00"
                  class="w-full m-1"
                  icon="edit"
                  @keydown="filterKey"
                  v-model="tabCompraOrden.iva"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="Descuento $:*"
                  placeholder="00,00"
                  class="w-full m-1"
                  icon="edit"
                  @keydown="filterKey"
                  v-model="tabCompraOrden.descuento"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="Valor total $:*"
                  placeholder="00,00"
                  class="w-full m-1"
                  icon="edit"
                  v-model="tabCompraOrden.valor"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="10"
                vs-sm="12"
                class="m-2"
              >
                <vs-input
                  label="Observación:"
                  placeholder="Escribe..."
                  class="w-full"
                  @keydown="filterKey"
                  v-model="tabCompraOrden.observacion"
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
            ><b>Detalle de compra de órden</b></vs-col
          >
  
          <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <br />
            <vs-table :data="inputs">
                  <vs-tr v-for="(input, k) in inputs" :key="k">
                    <vs-td width="50"
                      ><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td width="500">
                      <b>Libro {{input.pro_nombre}}</b></br>
                      <b>Id: </b> {{input.pro_codigo}}</br>
                      <b># Páginas: </b> {{input.det_or_int_paginas}}</br>
                    </vs-td>
                    <vs-td width="500">
                      <b>Cantidad solicitada: </b> {{input.det_or_cantidad}}</br>
                      <b>Fecha Posible Entrega: </b> {{input.det_or_posible_entrega}}</br>
                     
                    </vs-td>
                    <vs-td width="500">
                      <template v-if="input.det_com_cantidad==null || input.det_com_cantidad==0">
                        <b>Cantidad Recibida: </b> {{input.det_com_cantidad=0}}</br>
                      </template>
                      <template v-else>
                        <b>Cantidad Recibida: </b> {{input.det_com_cantidad}}</br>
                      </template>
                      <b>Cantidad Pendiente: </b> {{input.pendiente=parseInt(input.det_or_cantidad)- parseInt(input.det_com_cantidad)}}</br>
                     
                    </vs-td>
                    <vs-td width="650">
                      <vs-input
                        class="w-full m-1"
                        label="Cantidad a comprar:*"
                        type="number"
                        min="0"
                        @keydown="filterKey"
                        v-model="input.cantidades"
                      />
                      <vs-input
                        class="w-full m-1"
                        label="valor Unitario:*"
                        type="number"
                        min="0"
                        @keydown="filterKey"
                        v-model="input.valorunit"
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
                    </vs-td>
                  </vs-tr>
            </vs-table>
          </vs-col>
        </vs-row>
  
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
          <vs-button @click="guardarnuevo1()" color="success" type="relief"
            >Guardar</vs-button
          >&emsp;
          <vs-button @click="getCancelar()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
      <!-- editar Compras -->
       <vs-popup
        class="Editado"
        :title="`Compra de Orden de trabajo Nº: ${id }`"
        :active.sync="popupedit"
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
            <vs-row vs-type="flex" vs-justify="center" vs-w="5">
              <vs-col
                vs-align="center"
                vs-lg="12"
                vs-sm="12"
                vs-xs="12"
                style="text-align: center"
                ><b>Órden</b></vs-col
              >
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="CODIGO:"
                  placeholder="CODIGO:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.codigo"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="FECHA: "
                  placeholder="FECHA:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.fecha"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="10"
                vs-sm="12"
                class="m-2"
              >
                <vs-input
                  label="Proveedor: "
                  placeholder="Proveedor"
                  class="w-full"
                  disabled
                  v-model="tabOrdenTrabajo.prov_codigo"
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="7">
              <vs-col
                vs-align="center"
                vs-lg="12"
                vs-sm="12"
                vs-xs="12"
                style="text-align: center"
                ><b>Compra</b></vs-col
              >
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Factura:*"
                  placeholder="Factura:"
                  class="w-full"
                  icon="edit"
                  v-model="tabCompraOrden.factura"
                  
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="IVA $:*"
                  class="w-full m-1"
                  icon="edit"
                  @keydown="filterKey"
                  v-model="tabCompraOrden.iva"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="Descuento $:*"
                  class="w-full m-1"
                  icon="edit"
                  @keydown="filterKey"
                  v-model="tabCompraOrden.descuento"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="Valor total $:*"
                  class="w-full m-1"
                  icon="edit"
                  @keydown="filterKey"
                  v-model="tabCompraOrden.valor"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="10"
                vs-sm="12"
                class="m-2"
              >
                <vs-input
                  label="Observación:"
                  placeholder="Escribe..."
                  class="w-full"
                  v-model="tabCompraOrden.observacion"
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
            ><b>Detalle de compra de órden</b></vs-col
          >
  
          <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <br />
            <vs-table :data="inputs">
                  <vs-tr v-for="(input, k) in inputs" :key="k">
                    <vs-td width="50"
                      ><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td width="500">
                      <b>Id: </b> {{input.pro_codigo}}</br>
                      <b>{{input.pro_nombre}}</b></br>
                    </vs-td>
                    <vs-td width="500">
                      <b>Cantidad solicitada: </b> {{input.det_or_cantidad}}</br>
                    </vs-td>
                    <vs-td width="650">
                      <vs-input
                        class="w-full m-1"
                        label="Cantidad compra:*"
                        type="number"
                        min="0"
                        @keydown="filterKey"
                        v-model="input.det_com_cantidad"
                      /></vs-td>
                    <vs-td width="650">
                      <vs-input
                        class="w-full m-1"
                        label="Valor unitario:*"
                        type="number"
                        min="0"
                        @keydown="filterKey"
                        v-model="input.det_com_valor_u"
                      />
                    </vs-td>
                    <vs-td>
                      <br /><br />
                      <vs-button
                        v-if="k > -1"
                        @click="remove1(k,input.det_com_codigo)"
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
          <vs-button @click="editar()" color="success" type="relief"
            >Editar</vs-button
          >&emsp;
          <vs-button @click="getCancelar()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
      <!-- detalles Compras -->
       <vs-popup
        class="Detal"
        :title="`Información Compra de Orden de trabajo Nº: ${id }`"
        :active.sync="popupdet"
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
            <vs-row vs-type="flex" vs-justify="center" vs-w="5">
              <vs-col
                vs-align="center"
                vs-lg="12"
                vs-sm="12"
                vs-xs="12"
                style="text-align: center"
                ><b>Órden</b></vs-col
              >
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="CODIGO:"
                  placeholder="CODIGO:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.codigo"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="FECHA: "
                  placeholder="FECHA:"
                  class="w-full"
                  icon="error_outline"
                  disabled
                  v-model="tabOrdenTrabajo.fecha"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="10"
                vs-sm="12"
                class="m-2"
              >
                <vs-input
                  label="Proveedor: "
                  placeholder="Proveedor"
                  class="w-full"
                  disabled
                  v-model="tabOrdenTrabajo.prov_codigo"
                />
              </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="7">
              <vs-col
                vs-align="center"
                vs-lg="12"
                vs-sm="12"
                vs-xs="12"
                style="text-align: center"
                ><b>Compra</b></vs-col
              >
              <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-input
                  label="Factura:*"
                  placeholder="Factura:"
                  class="w-full"
                  disabled
                  v-model="tabCompraOrden.factura"
                  
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="IVA $:*"
                  class="w-full m-1"
                  disabled
                  v-model="tabCompraOrden.iva"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="Descuento $:*"
                  class="w-full m-1"
                  disabled
                  v-model="tabCompraOrden.descuento"
                />
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                <vs-input
                  label="Valor total $:*"
                  class="w-full m-1"
                  disabled
                  v-model="tabCompraOrden.valor"
                />
              </vs-col>
              <vs-col
                vs-type="flex"
                vs-justify="center"
                vs-align="center"
                vs-w="10"
                vs-sm="12"
                class="m-2"
              >
                <vs-input
                  label="Observación:"
                  placeholder="Escribe..."
                  class="w-full"
                  disabled
                  v-model="tabCompraOrden.observacion"
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
            ><b>Detalle de compra de órden</b></vs-col
          >
  
          <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <br />
            <vs-table :data="inputs">
                  <vs-tr v-for="(input, k) in inputs" :key="k">
                    <vs-td width="50"
                      ><br /><b>{{ k + 1 }}</b></vs-td
                    >
                    <vs-td width="500">
                      <b>Id: </b> {{input.pro_codigo}}</br>
                    </vs-td>
                    <vs-td width="500">
                      <b>Cantidad solicitada: </b> {{input.det_or_cantidad}}</br>
                      
                    </vs-td>
                    <vs-td width="650">
                      <b>Cantidad compra: </b> {{input.det_com_cantidad}}</br>
                    </vs-td>
                    <vs-td width="650">
                      <b>Valor unitario: </b> {{input.det_com_valor_u}}</br>
                    </vs-td>
                    
                  </vs-tr>
            </vs-table>
          </vs-col>
        </vs-row>
  
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
          
          <vs-button @click="getCancel()" color="danger" type="relief"
            >Cancelar</vs-button
          >
        </vs-col>
      </vs-popup>
  <!-- Parte de eliminar -->
      <vs-popup
        class="eliminar"
        :title="`¿Confirma que desea eliminar el registro: ${cod}?`"
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
        :title="`¿Confirma finalizar la orden de trabajo: ${tabOrdenTrabajo.codigo}?`"
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
  export default {
    data() {
      return {
        k: "",
        estado: "",
        com_codigo:"",
        Ordentrabajo: [],
        popupedit:false,
        popupdet: false,
        popupvisualiza: false,
        popupcompras: false,
        popupActivoGuardar: false,
        popupActivoEditar: false,
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
          prov_codigo: "",
          observacion:"",
        },
        tabCompraOrden: {
          factura: "",
          valor: "",
          iva: "",
          descuento: "",
          observacion: "",
        },
        inputs: [],
        detale:[],
        id: "",
        idusuarioresp: "",
        pro_codigo: "",
        region: "",
        anio: "",
        prov_codigo: "",
        Compras: [],
        or_estado: "",
        Ordentodo: [],
        cod: "",
        busquedaxcodigo: "",
        valorBusqueda: "0",
        options1: [
          { text: "COSTA", value: "C" },
          { text: "SIERRA", value: "S" },
        ],
        options4: [],
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
    },
    computed: {},
    mounted() {
      this.mostrarFechayhora();
      
    },
    methods: {
      filterKey(e) {
        const key = e.key;
        if (key === "," || key === "-" || key === "e" || key === "+")
          return e.preventDefault();
      },
     
      getOrdenParametro() {
        let me = this;
        let url;
        //this.showAgregarNuevo = true;
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

          let a = me.region.value+me.anio.value;
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
              // me.filtroRegion();
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
      remove1(index, b) {
        let me = this;
        let preId = 0;
        let datos = {
          det_com_codigo: b,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Eliminar_DetalleCompraOrden", datos)
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
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
        this.$http
          .post(this.$server_url + "PostDetalleCompraOrden_Editar", formData)
          .then((res) => {
            this.$vs.loading.close();
            this.$vs.notify({
              text: "Detalle de compra orden editado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          })
          .catch(function () {
            this.$vs.loading.close();
            this.$vs.notify({
              text: "Detalle de compra Orden de trabajo no se pudo editar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
      getvisual(){
        this.popupcompras=false;
        this.popupvisualiza = true;
      },
  getVisualiza(tr){
    this.tabOrdenTrabajo.codigo = tr.or_codigo;
    this.estado=tr.or_estado;
    let me = this;
    me.popupvisualiza = false;
    me.Compras = [];
    
  
        me.$vs.loading();
        
        var url = "";
        url = this.$server_url + "Get_ComprasOrden?orden_trabajo=" + tr.or_codigo;
        this.$http
          .get(url)
          .then(function (res) {
            me.Compras = res.data;
            if(me.Compras.length>0){
              me.$vs.loading.close();
              me.popupvisualiza = true;
            
            }else{
              me.$vs.loading.close();
              me.$vs.notify({
                text: "No existe compras registradas",
                color: "danger",
                iconPack: "feather",
                icon: "icon-user",
              });
              
            }
          })
          .catch(function (error) {
            console.log(error + " error");
            me.Compras = [];
            this.popupvisualiza = false;
            me.$vs.loading.close();
          });
     
  
  },
  getCancel(){
    this.popupvisualiza = true;
    this.popupdet = false;
  
  },
  getDeta(tr){
  this.popupvisualiza = false;
        this.popupdet = true;
        this.id=tr.com_codigo;
        this.tabOrdenTrabajo.codigo = tr.orden_trabajo;
        this.tabOrdenTrabajo.fecha = tr.com_fecha;
        this.tabOrdenTrabajo.prov_codigo = tr.prov_nombre;
        this.tabCompraOrden.factura =tr.com_factura;
        this.tabCompraOrden.iva=tr.com_iva;
        this.tabCompraOrden.descuento=tr.com_descuento;
        this.tabCompraOrden.valor=tr.com_valor;
        this.tabCompraOrden.observacion = tr.com_observacion;
        this.inputs = [];
        let me = this;
        me.$vs.loading();
  
        var url = "";
        url = this.$server_url + "Get_ComparOrdendetalle?com_codigo=" + tr.com_codigo;
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
  getDetalle(tr){
    this.tabOrdenTrabajo.codigo = this.tabOrdenTrabajo.codigo;
    
    let me = this;
    me.popupvisualiza = false;
    me.popupcompras = false;
        me.$vs.loading();
        
        var url = "";
        url = this.$server_url + "Get_ComparOrdendetalle?com_codigo=" + tr.com_codigo;
        console.log(url);
        this.$http
          .get(url)
          .then(function (res) {
            me.detale = res.data;
            if(me.detale.length>0){
              me.$vs.loading.close();
              me.popupcompras = true;
            
            }else{
              me.$vs.loading.close();
              me.$vs.notify({
                text: "No existe detalles de compras registradas",
                color: "danger",
                iconPack: "feather",
                icon: "icon-user",
              });
            }
          })
          .catch(function (error) {
            console.log(error + " error");
            me.detale = [];
            this.popupcompras = false;
            me.$vs.loading.close();
          });
  },
      //SECCION GUARDAR NUEVO PRODUCTO
      getDetallar(tr) {
        this.popupActivoEditar=false;
        this.popupadd = true;
        this.tabOrdenTrabajo.fecha = this.mostrarFechayhora();
        this.tabOrdenTrabajo.codigo = tr.or_codigo;
        this.or_estado = tr.or_estado;
        this.prov_codigo=tr.prov_codigo;
        this.tabOrdenTrabajo.prov_codigo = tr.prov_nombre;
         this.tabCompraOrden.factura ="";
        this.tabCompraOrden.iva="";
        this.tabCompraOrden.descuento="";
        this.tabCompraOrden.valor="";
        this.tabCompraOrden.observacion = "";
        this.inputs = [];
        let me = this;
        me.$vs.loading();
        
        var url = "";
        url = this.$server_url + "Get_Orden1detalle?or_codigo=" + tr.or_codigo;
        this.$http
          .get(url)
          .then(function (res) {
            me.inputs = res.data;
            me.getCodigo();
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
      getCodigo() {
        let me = this;
  
        this.$http
          .get(this.$server_url + "Get_CodigoCompra")
          .then((res) => {
            let c = res.data;
  
            me.id = c + 1;
            me.$vs.loading.close();
       
          })
          .catch((err) => {
            console.log(err);
            me.$vs.loading.close();
          });
      },
      guardarnuevo1() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        me.idusuarioresp = usuarioObjeto.iniciales;
        var f = me.mostrarFechayhora();
        let cod = me.id;
  
        if (!me.tabCompraOrden.factura || !me.tabCompraOrden.valor || !me.tabCompraOrden.observacion) {
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
          com_codigo:me.id,
          prov_codigo: me.prov_codigo,
          com_responsable: me.idusuarioresp,
          com_fecha: f,
          com_factura: me.tabCompraOrden.factura,
          com_valor: me.tabCompraOrden.valor,
          com_iva: me.tabCompraOrden.iva,
          com_descuento: me.tabCompraOrden.descuento,
          com_observacion: me.tabCompraOrden.observacion,
          orden_trabajo: me.tabOrdenTrabajo.codigo,
  
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostCompraOrden_Registrar_modificar", datos)
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
              text: "Compra Orden de trabajo no se pudo guardar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
  
      guardarnuevo() {
        let me = this;
        let cod = me.id;
        let formData = new FormData();
        console.log(me.inputs);
  
        formData.append("data_detallecompra", JSON.stringify(me.inputs));
        formData.append("com_codigo", cod);
        me.$vs.loading();
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
        this.$http
          .post(this.$server_url + "PostDetalleComprarOrden_Registra", formData)
          .then((res) => {
            me.Ordentrabajo = [];
            me.$vs.loading.close();
            me.$vs.notify({
              text: "La Compra orden de trabajo y los detalles se ha guardado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            this.getCancelar();
          })
          .catch(function () {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Compra Orden de trabajo no se pudo guardar",
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
        this.tabOrdenTrabajo.prov_codigo = tr.prov_nombre;
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
      getEdita(tr) {
        this.popupvisualiza = false;
        this.popupedit = true;
        this.id=tr.com_codigo;
        this.tabOrdenTrabajo.codigo = tr.orden_trabajo;
        this.tabOrdenTrabajo.fecha = tr.com_fecha;
        this.tabOrdenTrabajo.prov_codigo = tr.prov_nombre;
        this.tabCompraOrden.factura =tr.com_factura;
        this.tabCompraOrden.iva=tr.com_iva;
        this.tabCompraOrden.descuento=tr.com_descuento;
        this.tabCompraOrden.valor=tr.com_valor;
        this.tabCompraOrden.observacion = tr.com_observacion;
        this.inputs = [];
        let me = this;
        me.$vs.loading();
  
        var url = "";
        url = this.$server_url + "Get_ComparOrdendetalle?com_codigo=" + tr.com_codigo;
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
        if (!me.tabCompraOrden.factura || !me.tabCompraOrden.valor || !me.tabCompraOrden.observacion) {
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
          com_codigo:me.id,
          com_factura: me.tabCompraOrden.factura,
          com_valor: me.tabCompraOrden.valor,
          com_iva: me.tabCompraOrden.iva,
          com_descuento: me.tabCompraOrden.descuento,
          com_observacion: me.tabCompraOrden.observacion,
  
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostCompraOrden_Registrar_modificar", datos)
          .then((res) => {
            me.edit();
            me.$vs.loading.close();
            this.popupedit = false;
            me.Ordentrabajo = [];
          })
          .catch(function (error) {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Compra Orden de trabajo no se pudo EDITAR",
              color: "danger",k: "feather",
              icon: "icon-x",
            });
          });
      },
      popup_desactivar_activar_orden(tr) {
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
          //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
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
          //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
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
        this.popupvisualiza=false; 
        this.popupActivoEliminar = true;
        this.cod = tr.com_codigo
      },
      getEliminar() {
        let me = this;
        let datos = {
          com_codigo: me.cod,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Eliminar_CompraOrden", datos)
          .then((data) => {
            me.$vs.loading.close();
            
            me.$vs.notify({
              text: "Compra orden de trabajo eliminado con exito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            me.getCancelar();
          })
          .catch(function () {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Compra orden de trabajo no se pudo eliminar",
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
        this.popupedit =false;
      },
    },
  };
  </script>
  