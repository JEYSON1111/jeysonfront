<template>
    <vx-card fixed-height="true">
        <!-- <vs-row vs-justify="flex-start">            
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">                
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card class="seccionmostrartodo">
                    <vs-row>                
                        <vs-input class="w" @keyup.enter="getZonaParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxnombre"/>
                        <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getZonaParametro();" icon="search"></vs-button>
                    </vs-row>
                    <vs-row>                
                        <ul  class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li> 
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda"  @input="busqueda='nombre'">Nombre</vs-radio>
                            </li>
                        </ul>  
                    </vs-row>                    
                </vs-card>
            </vs-col>
        </vs-row> -->
        <vs-button icon="add" type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Zona</vs-button>
        <vs-table max-items="10" pagination search :data="Zona">
            <template slot="header">
                        <span>Cantidad: <b> {{ Zona.length }}</b></span>
                    </template>
            <template slot="thead">
                <vs-th width="200">
                    Código
                </vs-th>
                <vs-th width="400">
                    Información Zona
                </vs-th>
                <vs-th width="50">Estado</vs-th>
                <vs-th width="100">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].idzona">
                        {{ data[indextr].idzona }}
                    </vs-td>
                    <vs-td>
                        <!-- {{ tr }} -->
                        <small><b>Zona:</b> {{tr.zn_nombre}}</small><br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.zn_estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].idzona">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.zn_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                    <!-- <vs-button v-if="tr.zn_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button> -->
                                    <vs-button v-if="tr.zn_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_zn(tr)">Desactivar Asignación</vs-button>
                                    <vs-button v-if="tr.zn_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_zn(tr)">Activar Asignación</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" title="Registro nueva Zona" :active.sync="popupActivoGuardar">
            <vs-row>         
                <!-- {{ tabZona }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Zona</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabZona.zn_nombre" />
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
        <vs-popup class="editar" :title="`Edición Zona: ${tabZona.idzona}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabZona }} -->             
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Zona</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabZona.zn_nombre" />
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
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar Zona: ${idzona}?`" :active.sync="popupActivoEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del Zona: ${idzona}?`" :active.sync="popupActivoDesactivar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="desactivar_activar_tipo_documento()" type="relief">Aceptar</vs-button>
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
            Zona: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabZona: {
                idzona: '',
                zn_nombre: '',
                zn_estado: '',
                updated_at: ''
            },
            cantidad:[],
            idzona: 0,
            busquedaxnombre: "",
            busqueda:"",
            valor:"0",
            valorBusqueda:0,
            checkBox_mostraractivos:true,
            checkBox_mostrarinactivos:false,
        }
    },
    watch: {
        valorBusqueda(newValue) {
            if (newValue === '0') {
                this.Zona = [];
            }else if (newValue === '1') {
                this.Zona = [];
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getZona();
    },
    methods: {
        getZona() {
            let me = this;
            this.checkBox_mostraractivos = true;
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetZona_todo')
            .then(res => {
            this.Zona = res.data;
            me.$vs.loading.close()
            })
            .catch(err => {
            console.log(err)
            me.$vs.loading.close()
            })
        },
        getZonaParametro() {
            let me = this;
            this.busqueda='nombre';
            if(me.busquedaxnombre.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            if(me.busquedaxnombre !== null && me.busquedaxnombre !== '' && me.busquedaxnombre !== 0){
                this.$http.get(this.$server_url+'GetZonaParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxnombre)
                // this.$http.get(this.$server_url+'GetAsignacionesParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaInstitucion)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.Zona = res.data;
                    if(me.Zona.length === 0){
                        me.$vs.notify({
                            text: 'No hay coincidencias en la búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Zona = [];
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
                            text: 'No hay institución para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    me.Zona = [];
                    me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
            }else{
                this.$http.get(this.$server_url+'GetZonaParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.valorBusqueda)
                .then(function (res) {
                    me.Zona = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.Zona = [];
                    me.$vs.loading.close()
                })           
            }
            
        },              
        //SECCION GUARDAR NUEVO Zona
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabZona.zn_nombre = ''
        },
        guardarnuevo() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            // Verificar si ya existe un registro con el mismo código de asesor-institución
            let resultado = me.Zona.find(v => v.zn_nombre == this.tabZona.zn_nombre);
            if (resultado) {
                me.$vs.notify({
                    text: 'Ya existe un registro de este Zona',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            //VALIDACION DE CAMPOS NULOS Y VACIOS            
            if (this.tabZona.zn_nombre === '' || this.tabZona.zn_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre de la Zona antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos  = {
                "idzona": this.tabZona.idzona,
                "zn_nombre": this.tabZona.zn_nombre,
                "zn_estado": this.tabZona.zn_estado,
                "user_created": usuarioObjeto.idusuario,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url+'PostRegistrar_modificar_i_zona', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getZona();
                me.$vs.notify({
                    text: 'Zona guardado con exito',
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
                    text: 'La Asignación no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getEditar(tr) {
        this.popupActivoEditar = true
        this.tabZona.idzona = tr.idzona
        this.tabZona.zn_nombre = tr.zn_nombre
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (this.tabZona.zn_nombre === '' || this.tabZona.zn_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre del Zona antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }           
            let datos  = {                
                "idzona": this.tabZona.idzona,
                "zn_nombre": this.tabZona.zn_nombre,
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
        this.$http.post(this.$server_url+'PostRegistrar_modificar_i_zona', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getZona();
                me.$vs.notify({
                    text: 'Zona editada con exito',
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
                if (error.response && error.response.status === 500) {
                    me.$vs.notify({
                        text: 'Revise los campos que esten en el formato correcto',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                me.$vs.loading.close()
                } else {
                console.log(error);
                me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Zona no se pudo editar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
            })
        },
        popup_desactivar_activar_zn(tr) {
            this.popupActivoDesactivar = true
            this.idzona = tr.idzona
            this.tabZona.zn_estado = tr.zn_estado
        },
        desactivar_activar_tipo_documento() {
            let me = this;
            let valornuevo = this.tabZona.zn_estado;
            //console.log(valornuevo+'valornuevoeatdoprocutp'+this.idzona);
            if(valornuevo == 1){
                valornuevo = 0;
                let datos  = {
                    "idzona": this.idzona,
                    "zn_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url+'Desactivar_i_zona', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getZona();
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
                    "idzona": this.idzona,
                    "zn_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url+'Desactivar_i_zona', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getZona();
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
            this.idzona = tr.idzona
        },
        getEliminar() {
            let me = this;
            let datos  = {
                "idzona": this.idzona,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_tipo_documento", datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getZona();
                    me.$vs.notify({
                        text: 'Se elimino la asignación correctamente',
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
                        text: 'No se pudo eliminar la asignación',
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
    }
}
</script>