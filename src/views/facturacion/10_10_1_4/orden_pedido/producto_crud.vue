<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button>
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card class="seccionmostrartodo">
                    <div>
                        <vs-input v-if="valorBusqueda !== '2'" class="w-full" @keyup.enter="getProductoParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxcodigo"/>
                    </div>
                    <div>
                        <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li>
                            <li style="margin:10px 20px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='codigopro'">Iniciales</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"  @input="busqueda='nombres'">Nombres</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios2" vs-value="2" v-model="valorBusqueda"  @input="getProductos_inactivos()">Mostrar inactivos</vs-radio>
                            </li>
                            <li>
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getProductoParametro();" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <vs-table max-items="10" pagination search :data="Productos"> 
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Productos.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th width="200">
                    Código
                </vs-th>
                <vs-th colspan="2" width="500">
                    Información Producto
                </vs-th>
                <vs-th>Estado</vs-th>
                <vs-th width="100">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].pro_codigo">
                        {{ data[indextr].pro_codigo }}
                    </vs-td>
                    <vs-td>
                        <!-- {{ tr }} -->
                        <small><b>Grupo:</b> {{tr.gru_pro_nombre}} </small><br>
                        <small><b>Nombres:</b> {{tr.pro_nombre}}</small><br>
                        <small><b>Descripción:</b> {{tr.pro_descripcion}}</small><br>
                        <small><b>Iva:</b> 
                            <template v-if="data[indextr].pro_iva == true">
                                Si
                            </template>
                            <template v-else-if="data[indextr].pro_iva == false">
                                No
                            </template>
                            <template v-else-if="data[indextr].pro_iva == null">
                                Vacio
                            </template>
                        </small><br>
                        <small><b>Valor:</b> {{tr.pro_valor}}</small><br>
                    </vs-td>
                    <vs-td>
                        <small><b>Descuento:</b> {{tr.pro_descuento}}</small><br>
                        <small><b>Stock:</b> {{tr.pro_stock}}</small><br>
                        <small><b>Costo:</b> {{tr.pro_costo}}</small><br>
                        <small><b>Peso:</b> {{tr.pro_peso}}</small><br>
                        <small v-if="tr.gru_pro_codigo == 1"><b>Serie:</b> {{tr.nombre_serie}}</small><br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.pro_estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].pro_codigo">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.pro_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                    <vs-button v-if="tr.pro_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_producto(tr)">Desactivar producto</vs-button>
                                    <vs-button v-if="tr.pro_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_producto(tr)">Activar producto</vs-button>
                                    <vs-button color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" title="Registro nuevo producto" :active.sync="popupActivoGuardar">
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
                            <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gru_pro_codigo" @input="handleSelectInput"  />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col v-if="tabProducto.gru_pro_codigo === 1" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;Serie</font><br>
                            <v-select :options="series" :reduce="series => series.id_serie" label="nombre_serie" placeholder="--Seleccione--" class="w-full" v-model="tabProducto.id_serie" />
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
                <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!-- SECCION EDITAR -->
        <!-- <vs-popup class="editar" :title="`Edición producto: ${tabProducto.pro_codigo}`" :active.sync="popupActivoEditar"> -->
        <vs-popup class="editar" :title="`Edición producto`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabProducto }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;">
                    
                    <b>Información Producto</b>                    
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Codigo de producto" placeholder="Codigo" class="w-full" icon="mode_edit" v-model="tabProducto.pro_codigo" />                       
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 11.5px">&nbsp;Grupo</font><br>
                            <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gru_pro_codigo"  />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col v-if="tabProducto.gru_pro_codigo === 1" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">&nbsp;Serie</font><br>
                            <v-select :options="series" :reduce="series => series.id_serie" label="nombre_serie" placeholder="--Seleccione--" class="w-full" v-model="tabProducto.id_serie" />
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
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <!-- <vs-input label="Iva *" type="number" placeholder="Iva" class="w-full" icon="mode_edit" v-model="tabProducto.proIva" /> -->
                            <vs-select label="Iva" class="w-full" v-model="tabProducto.pro_iva">
                                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in options1" />
                            </vs-select>
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
                            <vs-input type="number" id="pro-descuento-input" placeholder="Descuento" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descuento" @keypress="validarDescuento" />
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
                <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${pro_codigo}?`" :active.sync="popupActivoEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del producto: ${pro_codigo}?`" :active.sync="popupActivoDesactivar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="desactivar_activar_producto()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </vx-card>
    </template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
export default {
    data() {
        return{
            options1: [
                { text: '--Seleccione--', value: null },
                { text: 'Si', value: true },
                { text: 'No', value: false },
            ],
            Productos: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
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
            series:[],
            libros:[],
            pro_codigo: null,
            idlibro: null,
            id_serie: null,
            pro_codigo_antiguo: 0,
            id_serie_antiguo: null,
            Grupos: [],
            Producto_sinfiltro: [],
            Producto_inactivos: [],
            busquedaxcodigo: "",
            valorBusqueda:"0",
            checkBox_mostrarinactivos:false,
            busqueda:'',
            numeros: 0
            //showAgregarNuevo: false,
        }
    },
    watch: {
        valorBusqueda(newValue) {
            if (newValue === '0') {
                this.Productos = [];
            }else if (newValue === '1') {
                this.Productos = [];
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getGrupoProducto();
        this.getProducto();
        this.getLibros()
        this.listaSeries();
    },
    methods: {
        handleSelectInput(selectedItem) {
            if (selectedItem === 1) {
                // Llama a tu función aquí
                this.funcionPrueba();
            }
        },
        funcionPrueba(){
            console.log('prueba')
        },
        convertirAMayusculas() {            
            const numerosString = this.tabProducto.pro_codigo.replace(/\D/g, '');
            this.numeros = numerosString ? parseInt(numerosString) : 0; // Asignar el valor a tabProducto.pro_codigo             
            // Extraer los números y almacenarlos en la variable 'numeros'

            // Convertir el texto a mayúsculas
            this.tabProducto.pro_codigo = this.tabProducto.pro_codigo.toUpperCase();
            this.pro_codigo_antiguo = this.tabProducto.pro_codigo;
            this.id_serie_antiguo = this.tabProducto.id_serie;
        },
        ObtenerCodigo() {
            const codigoActual = this.tabProducto.pro_codigo;
            this.pro_codigo_antiguo = codigoActual;// Asignar el valor a tabProducto.pro_codigo            
        },
        isGrupoProhibido(gru_pro_codigo) {
            // Aquí puedes colocar la lógica para verificar si el grupo es prohibido
            if (gru_pro_codigo === 1) {
                // Muestra la notificación de error
                this.$vs.notify({
                    text: 'No puedes guardar con este grupo',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
                return true; // Devuelve true si el grupo es prohibido
            } else {
                return false; // Devuelve false si el grupo no es prohibido
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
        getLibros() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getLibroP')
                .then(function (res) {
                    me.libros = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getProducto() {
            let me = this;
            this.$http.get(this.$server_url+'GetProducto')
            //axios.get(this.$apifacturacion_url + 'f_Producto')
            .then(res => {
            //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
            //this.Productos = resultado;
            this.Producto_sinfiltro = res.data;
            // console.log(this.Productos);
            // console.log(this.Grupos);
            })
            .catch(err => {
            console.log(err)
            })
        },
        getProductos_inactivos() {
            let me = this;
            this.busquedaxcodigo = '';
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetProducto_Inactivo')
            //axios.get(this.$apifacturacion_url + 'f_Producto')
            .then(res => {
                //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                //this.Productos = resultado;
                this.Productos = res.data;
                if(me.Productos.length === 0){
                    me.$vs.notify({
                        text: 'No hay productos inactivos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.Productos = [];
                    me.$vs.loading.close()
                }else{
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                    }   
                }
                // console.log(this.Productos);
                // console.log(this.Grupos);
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close()
            })
        },
        getProductoParametro() {
            let me = this;
            this.checkBox_mostrarinactivos = false;
            this.tabProducto.gru_pro_codigo;
            //this.showAgregarNuevo = true;
            if(me.busquedaxcodigo.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            this.$http.get(this.$server_url+'GetProductoActivosxFiltro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            .then(function (res) {
                // me.tmpVenta = res.data;
                // let resultado = res.data.filter(c => c.cliCi !== 0);
                me.Productos = res.data;
                if(me.Productos.length === 0){
                    me.$vs.notify({
                        text: 'No hay productos para esta búsqueda',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.Productos = [];
                    me.$vs.loading.close()
                }else{
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                    }   
                }
            })
            .catch(function (error) {
                if (error.response && error.response.status === 404) {
                    me.$vs.notify({
                        text: 'No hay productos para esta búsqueda',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                me.Productos = [];
                me.$vs.loading.close()
                } else {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                }
            })
        },
        //lista de series para usar en el select
        listaSeries(){
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+`GetSeriesL`).then(res => {
                me.series = res.data;
                me.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error)
                me.$vs.loading.close();
            })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabProducto.pro_codigo = ''
            this.tabProducto.gru_pro_codigo = null
            this.tabProducto.pro_costo = null
            this.tabProducto.pro_descripcion = ''
            this.tabProducto.pro_descuento = ''
            this.tabProducto.pro_iva = null
            this.tabProducto.pro_nombre = ''
            this.tabProducto.pro_peso = ''
            this.tabProducto.pro_stock = ''
            this.tabProducto.pro_valor = ''
            this.tabProducto.id_serie = ''
        },
        guardarnuevo() {
            let me = this;
            let resultado = me.Producto_sinfiltro.filter(v => v.pro_codigo == this.tabProducto.pro_codigo);
            let resultado2 = me.series.filter(v => v.codigo_liquidacion == this.tabProducto.pro_codigo);
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if(resultado.length>0 || resultado2.length>0 )
            {
                me.$vs.notify({
                        text: 'Ya existe un registro con ese código de producto',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
            }
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabProducto.pro_codigo === '' || this.tabProducto.pro_codigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProducto.gru_pro_codigo === '' || this.tabProducto.gru_pro_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione el grupo del producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos  = {
                "pro_codigo": this.tabProducto.pro_codigo,
                "gru_pro_codigo": this.tabProducto.gru_pro_codigo,
                "pro_nombre": this.tabProducto.pro_nombre,
                "pro_descripcion": this.tabProducto.pro_descripcion,
                "pro_iva": this.tabProducto.pro_iva,
                "pro_valor": parseFloat(this.tabProducto.pro_valor),
                "pro_descuento": parseFloat(this.tabProducto.pro_descuento),
                "pro_stock": parseFloat(this.tabProducto.pro_stock),
                "pro_costo": parseFloat(this.tabProducto.pro_costo),
                "pro_peso": parseFloat(this.tabProducto.pro_peso),
                "nombrelibro": this.tabProducto.pro_nombre,
                "nombre_imprimir": this.tabProducto.pro_nombre,
                "descripcionlibro": this.tabProducto.pro_descripcion,
                "serie": 0,
                "weblibro": null,
                "pdfsinguia":null ,
                "pdfconguia": null,
                "guiadidactica": null,
                "asignatura_idasignatura": null,
                "portada": "portada.png",
                "demo": null,
                "id_serie": this.tabProducto.id_serie,
                "codigo_liquidacion": this.tabProducto.pro_codigo,
                "year": parseInt(this.numeros),
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
                // this.getProducto();
                this.getProductoParametro();
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
                this.popupActivoEditar = false;
                this.popupActivoDesactivar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
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
        getEditar(tr) {
            this.popupActivoEditar = true
            this.tabProducto.pro_codigo = tr.pro_codigo
            this.pro_codigo_antiguo = tr.pro_codigo
            this.tabProducto.gru_pro_codigo = tr.gru_pro_codigo
            this.id_serie_antiguo = tr.gru_pro_codigo
            this.tabProducto.pro_nombre = tr.pro_nombre
            this.tabProducto.pro_descripcion = tr.pro_descripcion
            this.tabProducto.pro_iva = tr.pro_iva
            this.tabProducto.pro_valor = tr.pro_valor
            this.tabProducto.pro_descuento = tr.pro_descuento
            this.tabProducto.pro_stock = tr.pro_stock
            this.tabProducto.pro_costo = tr.pro_costo
            this.tabProducto.pro_peso = tr.pro_peso        
            this.tabProducto.id_serie = tr.id_serie
            this.tabProducto.idlibro = tr.idlibro
            this.tabProducto.year = tr.year
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (this.tabProducto.pro_codigo === '' || this.tabProducto.pro_codigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Vendedor antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProducto.gru_pro_codigo === '' || this.tabProducto.gru_pro_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione un grupo antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if(this.tabProducto.gru_pro_codigo === 1 || this.tabProducto.gru_pro_codigo === '1' ){
                let datos  = {
                    "pro_codigo": this.tabProducto.pro_codigo,
                    "pro_codigo_antiguo": this.pro_codigo_antiguo,
                    "gru_pro_codigo": this.tabProducto.gru_pro_codigo,
                    "pro_nombre": this.tabProducto.pro_nombre,
                    "pro_descripcion": this.tabProducto.pro_descripcion,
                    "pro_iva": this.tabProducto.pro_iva,
                    "pro_valor": parseFloat(this.tabProducto.pro_valor),
                    "pro_descuento": parseFloat(this.tabProducto.pro_descuento),
                    "pro_stock": parseFloat(this.tabProducto.pro_stock),
                    "pro_costo": parseFloat(this.tabProducto.pro_costo),
                    "pro_peso": parseFloat(this.tabProducto.pro_peso),
                    "nombrelibro": this.tabProducto.pro_nombre,
                    "nombre_imprimir": this.tabProducto.pro_nombre,
                    "descripcionlibro": this.tabProducto.pro_descripcion,
                    "idlibro": this.tabProducto.idlibro,
                    "id_serie": this.tabProducto.id_serie,
                    "codigo_liquidacion": this.tabProducto.pro_codigo,
                    "year": parseInt(this.numeros),
                    "user_created": usuarioObjeto.idusuario,          
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url+'Registrar_modificar_producto', datos)
                // this.$http.post(this.$server_url+'guardarLibro', datos2)
                .then(res => {
                    me.$vs.loading.close()
                    //this.getProducto();
                    this.getProductoParametro();
                    if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                            })
                    }else{
                        me.$vs.notify({
                            text: 'Guardado con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    }
                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
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
            }else{
                if (this.id_serie_antiguo == 1 ) {
                    me.$vs.notify({
                        text: 'No tiene permitido cambiar de grupo',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }else{
                    let datos  = {
                        "pro_codigo": this.tabProducto.pro_codigo,
                        "gru_pro_codigo": this.tabProducto.gru_pro_codigo,
                        "pro_codigo_antiguo": this.pro_codigo_antiguo,
                        "pro_nombre": this.tabProducto.pro_nombre,
                        "pro_descripcion": this.tabProducto.pro_descripcion,
                        "pro_iva": this.tabProducto.pro_iva,
                        "pro_valor": parseFloat(this.tabProducto.pro_valor),
                        "pro_descuento": parseFloat(this.tabProducto.pro_descuento),
                        "pro_stock": parseFloat(this.tabProducto.pro_stock),
                        "pro_costo": parseFloat(this.tabProducto.pro_costo),
                        "pro_peso": parseFloat(this.tabProducto.pro_peso),
                    }
                    me.$vs.loading()
                    //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                    this.$http.post(this.$server_url+'Registrar_modificar_producto', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        //this.getProducto();
                        this.getProductoParametro();
                        me.$vs.notify({
                            text: 'Producto guardado con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popupActivoEditar = false;
                        this.popupActivoDesactivar = false;
                        this.popupActivoGuardar = false;
                        this.popupActivoEliminar = false;
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
                }
            }
        },
        popup_desactivar_activar_producto(tr) {
            this.popupActivoDesactivar = true
            this.pro_codigo = tr.pro_codigo
            this.tabProducto.pro_estado = tr.pro_estado
        },
        desactivar_activar_producto() {
        let me = this;
        let valornuevo = this.tabProducto.pro_estado;
        console.log(valornuevo+'valornuevoeatdoprocutp'+this.pro_codigo);
        if(valornuevo == 1){
            valornuevo = 0;
            let datos  = {
                "pro_codigo": this.pro_codigo,
                "pro_estado": valornuevo,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url+'Desactivar_producto', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getProductoParametro();
                me.$vs.notify({
                    text: 'Cambio de estado exitoso',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoDesactivar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(error => {
                console.log(error);
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'No se pudo realizar el cambio de estado',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        }else if (valornuevo == 0){
            valornuevo = 1;
            let datos  = {
                "pro_codigo": this.pro_codigo,
                "pro_estado": valornuevo,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url+'Desactivar_producto', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getProductos_inactivos();
                me.$vs.notify({
                    text: 'Cambio de estado exitoso',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoDesactivar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(error => {
                console.log(error);
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'No se pudo realizar el cambio de estado',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        }
        
        },        
        getPreguntaEliminar(tr) {
            this.popupActivoEliminar = true
            this.pro_codigo = tr.pro_codigo
            this.id_serie = tr.id_serie
            this.idlibro = tr.idlibro
        },
        getEliminar() {
            let me = this;
            let datos  = {
                "pro_codigo": this.pro_codigo,
                "idLibro": this.idLibro,
                "idSerie": this.idSerie
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_producto", datos)
                .then(data => {
                    me.$vs.loading.close()
                    //this.getProducto();
                    this.getProductoParametro();
                    me.$vs.notify({
                        text: 'Producto eliminado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })

                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Producto no se pudo eliminar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
        },
    },
    // created(){
    //     let url = "https://localhost:7252/api/Vendedor";
    //     axios.get(url).then((response) => this.Vendedores = response.data);
    //     // fetch("https://localhost:7252/api/Vendedor/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Vendedores = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>