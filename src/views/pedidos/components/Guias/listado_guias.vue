<template>
<div>
    <ul class="flex mt-2" style="flex-wrap:center;">
        <li>
            <vs-radio v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="0"><span style="font-weight:bold;">{{sumaPendientes}}</span> Pendientes</vs-radio>
        </li>
        <li>
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="1"><span style="font-weight:bold;">{{ SumaAprobados }}</span> Aprobados</vs-radio>
        </li>
        <li>
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="2"><span style="font-weight:bold;">{{ SumaEntregados }}</span> Entregados por bodega </vs-radio>
        </li>
    </ul>
    <vs-table search :data="tmpPedidos" max-items="10">
        <template slot="header">
            <vs-chip>Cantidad: {{ tmpPedidos.length }}</vs-chip>
            <p class="btn_lg font-semibold ml-2">Pedidos de guias periodo {{nombre_periodo}} </p>
        </template>
        <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="asesor">Asesor / Responsable</vs-th>
            <vs-th style="width: 100px;" sort-key="fecha_envio">Fechas</vs-th>
            <vs-th sort-key="asesor">Cant. guias</vs-th>
            <vs-th sort-key="asesor">Estado</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td> {{ tr.id_pedido }} </vs-td>
                <vs-td>
                    <p class="font-bold">Responsable:</p>
                    <span>{{ tr.responsable }} </span>
                    <p class="font-bold">Cédula:</p>
                    <span>{{ tr.cedula }} </span>
                </vs-td>
                <vs-td>
                    <p class="font-bold">Fecha de envio:</p>
                    <span>{{ tr.fecha_envio.substring(0,10) }} </span>
                </vs-td>
                <vs-td>
                    {{ tr.total_unidades_guias }}
                </vs-td>
                <vs-td>
                    <span v-if="tr.estado_entrega == 0"><b>Pedido:</b><span class="ml-1">Creado</span></span>
                    <span color="primary" v-if="tr.estado_entrega == 1"><b>Pedido:</b><span class="ml-1">Aprobado por facturación</span></span>
                    <span color="success" v-if="tr.estado_entrega == 2"><b>Pedido:</b><span class="ml-1">Entregado por bodega</span></span><br>
                    <div v-if="tr.ven_codigo != null">
                        <p><b>Acta:</b> {{ tr.ven_codigo }}</p>
                    </div>
                    <b v-if="tr.estado_entrega > 0">Fecha aprobacion:</b>
                    <p v-if="tr.estado_entrega > 0">{{ tr.fecha_aprobado_facturacion }}</p>
                    <b v-if="tr.estado_entrega > 1">Fecha entrega bodega:</b>
                    <p v-if="tr.estado_entrega > 1">{{ tr.fecha_entrega_bodega }}</p>
                </vs-td>
                <vs-td align="center">
                    <vs-dropdown vs-custom-content vs-trigger-click>
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <!--APROBAR ACTA-->
                            <!-- <vs-dropdown-item v-if="usuario.id_group != 11 && tr.ven_codigo == null">
                                <vx-tooltip style="display: inline-block;" text="AL PRESIONAR SE ENVIARA AL SISTEMA DE FACTURACION" position="top" color="primary">
                                 <vs-button class="w-full" color="dark"  icon-pack="feather" icon="icon-check" type="line" @click="pedido = tr;openConfirm()">Aprobar solicitud</vs-button>
                                </vx-tooltip>    
                            </vs-dropdown-item> -->
                            <!--TEST-->
                            <vs-dropdown-item v-if="usuario.id_group != 11 && tr.ven_codigo == null">
                                <vx-tooltip style="display: inline-block;" text="AL PRESIONAR SE ENVIARA AL SISTEMA DE FACTURACION" position="top" color="primary">
                                 <vs-button class="w-full" color="dark"  icon-pack="feather" icon="icon-check" type="line" @click="verResumen =false;pedido = tr;verStock()">Aprobar solicitud</vs-button>
                                </vx-tooltip>    
                            </vs-dropdown-item>
                            <!--IMPRIMIR ACTA-->
                            <vs-dropdown-item v-if="usuario.id_group != 11 && tr.ven_codigo != null">
                                <vs-button class="w-full" color="#3541D3" icon-pack="feather" icon="icon-printer" type="line" @click="pedido = tr;ImprimirActa(tr)">Imprimir acta</vs-button>
                            </vs-dropdown-item>
                            <!--RESUMEN-->
                            <vs-dropdown-item>
                                <vs-button class="w-full" v-if="usuario.id_group != 11" icon="visibility" type="line" @click="verResumen =true;pedido = tr;verStock()">Resumen</vs-button>
                            </vs-dropdown-item>
                            <vs-dropdown-item>
                                <vs-button class="w-full" v-if="usuario.id_group == 11" icon="visibility" type="line" @click="f_detalle_libros(tr)">Resumen</vs-button>
                            </vs-dropdown-item>
                            <vs-dropdown-item>
                                <vs-button class="w-full" icon-pack="feather" color="warning" icon="icon-edit" type="line" @click="ver_pedido(tr)">Editar</vs-button>
                            </vs-dropdown-item>
                            <!-- <vs-dropdown-item>
                                <vs-button class="w-full" v-if="usuario.id_group != 11 && tr.estado_entrega == 0" icon-pack="feather" icon="icon-check" @click="pedido = tr;openConfirmarAprobacion(tr);" color="primary" type="line">Aprobar solicitud</vs-button>
                            </vs-dropdown-item> -->
                            <vs-dropdown-item>
                                <vs-button class="w-full" v-if="usuario.id_group != 11" icon-pack="feather" icon="icon-file" @click="getReporteGuia(tr);" color="success" type="line">Reporte guia</vs-button>
                            </vs-dropdown-item>
                            <vs-dropdown-item>
                                <vs-button class="w-full" v-if="tr.estado_entrega == 0" color="danger" type="line" @click="confirma_delete_pedido(tr)">Eliminar pedido</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <div v-if="mostrarReporteG">
        <exportGuiasVue style="display: none;" :id_periodo="id_periodo" :id_pedido="id_pedido" @change="changeHandle" />
    </div>
    <!--EXPORTAR ACTA FACTURADOR - ASESOR-->
    <div v-if="mostrarImprimirActa">
        <exportActaGuiasVue style="display: none;" :pedido = "pedido" @change="changeHandle"/>
    </div>
    <!--MODAL CARGAR-->
    <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
        <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
        <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
    </vs-popup>
    <!--MODAL DETALLE DE LIBROS-->
    <vs-popup title="Detalle de libros" :active.sync="modalLibros">
        <vs-table max-items="100" search pagination :data="arregloLibros">
            <template slot="header">
                <div class="row">
                    <div class="col-12">Total Libros: <b>{{totalLibros}}</b></div>
                    <div class="col-12">Items: <b>{{arregloLibros.length}}</b></div>
                </div>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Cant. unidades</vs-th>
                <vs-th>Precio unitario</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].valor}}<br>
                    </vs-td>
                    <vs-td>
                        {{tr.precio}}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vs-popup>
    <!--MODAL CONFIRMAR APROBAR-->
    <vs-popup class="holamundo" fullscreen title="Stock de guias" :active.sync="popupConfirmAprobar">
        <p v-if="verResumen == false" class="font-bold text-warning text-2xl">Está seguro de aprobar la solicitud de guias?</p>
        <GuiasStockVue v-if="popupConfirmAprobar" :arregloStock="arregloStock"/>
        <vs-divider v-if="verResumen == false"></vs-divider>
        <div v-if="verResumen == false" class="flex justify-center">
            <vs-button color="primary" @click="enviarGuiasBDMilton();" type="border" icon="save">Si deseo aprobar</vs-button>
            <vs-button color="warning" class="ml-2" @click="popupConfirmAprobar = false;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
        </div>
    </vs-popup>
</div>
</template>

<script>
import exportGuiasVue from '../../../temporadas/components/exportGuias.vue';
import exportActaGuiasVue from '../../../temporadas/components/exportActaGuias.vue'
import GuiasStockVue from './GuiasStock.vue'
export default {
    data() {
        return {
            usuario: [],
            tmpPedidos: [],
            pedido: {},
            id_pedido: 0,
            popupCarga: false,
            mostrarReporteG: false,
            mostrarImprimirActa:false,
            pedidoGuiaEliminar: '',
            filtro: 0,
            arregloLibros: [],
            arregloStock:[],
            modalLibros: false,
            popupConfirmAprobar:false,
            verResumen:false,
            totalLibros: 0,
        }
    },
    components: {
        exportGuiasVue,
        exportActaGuiasVue,
        GuiasStockVue,
    },
    props: {
        pedidos: {
            type: Array,
            default: []
        },
        id_periodo: {
            type: Number,
            default: 0
        },
        nombre_periodo: {
            type: String,
            default: ''
        },
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    watch: {
        pedidos(results) {
            let me = this;
            me.tmpPedidos = []
            me.filtroTipo()
        },
    },
    mounted() {
        let me = this;
        setTimeout(() => {
            me.filtroTipo()
        }, 1000);
    },
    computed: {
        sumaPendientes() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado_entrega == 0) && (p.estado == 0 || p.estado == 1));
            let resultado = datos.length
            return resultado
        },
        SumaAprobados() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado_entrega == 1) && (p.estado == 1));
            let resultado = datos.length
            return resultado
        },
        SumaEntregados() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado_entrega == 2) && (p.estado == 1));
            let resultado = datos.length
            return resultado
        },
    },
    methods: {
        verStock(){
            let me = this;
            me.arregloStock = []
            me.$vs.loading()
            this.$http.get(this.$server_url+'guias?verStock=yes&id_pedido='+me.pedido.id_pedido)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time:3000
                        })
                        return
                    }
                    //ingresar libros en array
                    let datos = res.data
                    var predatos = []
                    predatos = datos
                    me.arregloStock = predatos.sort(function(a, b) {
                        var nombreA = a.nombrelibro.toLowerCase();
                        var nombreB = b.nombrelibro.toLowerCase();
                        var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                        var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                        nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                        nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
                        
                        if (nombreA < nombreB) {
                            return -1;
                        }
                        if (nombreA > nombreB) {
                            return 1;
                        }
                        if (numA && !numB) { // si a tiene número y b no, b va primero
                            return 1;
                        }
                        if (!numA && numB) { // si b tiene número y a no, a va primero
                            return -1;
                        }
                        if (numA && numB) { // si ambos tienen número, compararlos
                            if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                            return -1;
                            }
                            if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                            return 1;
                            }
                            return numA - numB; // comparar los números directamente
                        }
                        return 0; // si son iguales en todo, no hay diferencia
                    });
                    //open confirm
                    me.popupConfirmAprobar = true
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: "Hubo problemas con el servidor de facturacion",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:3000
                    })
                })
            
        },
        openConfirm(){
            let me = this;
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText:'aceptar',
                cancelText:'cancelar',
                text: 'Esta seguro de aprobar la solicitud de guias?',
                accept:this.enviarGuiasBDMilton
            })
        },
        enviarGuiasBDMilton(){
            let me = this
            //validacion 
            if(me.pedido.codigo_contrato == null || me.pedido.codigo_contrato == "" || me.pedido.codigo_contrato == undefined || me.pedido.iniciales == "" || me.pedido.iniciales == null || me.pedido.iniciales == "null"){
                me.$vs.notify({
                    text: 'El codigo del periodo o las iniciales del asesor no estan configuradas',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if(me.usuario.cod_usuario == null || me.usuario.cod_usuario == "null" || me.usuario.cod_usuario == "" || me.usuario.cod_usuario == undefined){
                me.$vs.notify({
                    text: 'El codigo del usuario facturador no esta configurado',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let formData = new FormData();
            formData.append('id_pedido',            me.pedido.id_pedido)
            formData.append('codigo_contrato',      me.pedido.codigo_contrato)
            formData.append('iniciales',            me.pedido.iniciales);
            formData.append('usuario_fact',         me.usuario.idusuario)
            formData.append('codigo_usuario_fact',  me.usuario.cod_usuario);
            formData.append('region_idregion',      me.pedido.region_idregion)
            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarGuiasBDMilton', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:3000
                    })
                    return
                }
                me.$vs.notify({
                    text: 'Se guardo correctamente',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.popupConfirmAprobar = false;
                me.$emit('changeGuias', true)
            })
            .catch(function (error) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'No se puedo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            })
        },
        changeHandle(e) {
            let me                  = this;
            me.popupCarga           = false
            me.mostrarReporteG      = false
            me.mostrarImprimirActa  = false
        },
        ver_pedido(item) {
            let me = this;
            localStorage.setItem("id_periodo_selected", this.id_periodo)
            localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
            this.$store.dispatch('setGuia',item)
            this.$emit('showPedido',1)
        },
        getReporteGuia(tr) {
            let me = this;
            localStorage.setItem("id_periodo_selected", this.id_periodo)
            localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
            me.id_pedido = tr.id_pedido
            me.popupCarga = true
            me.mostrarReporteG = true
        },
        ImprimirActa(){
            let me                  = this;
            me.popupCarga           = true
            me.mostrarImprimirActa  = true
        },
        confirma_delete_pedido(item) {
            console.log(item)
            let me = this;
            me.pedidoGuiaEliminar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Seguro desea eliminar este pedido?. No lo podrá recuperar',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_eliminarGuiaPedido
            })
        },
        f_eliminarGuiaPedido() {
            let me = this;
            this.$http.get(this.$server_url + 'deletePedidoGuia/' + me.pedidoGuiaEliminar.id_pedido)
                .then((result) => {
                    console.log(result.data)
                    me.$vs.notify({
                        color: 'danger',
                        text: 'Pedido eliminado correctamente'
                    })
                    this.$emit('pedidoEliminado', 1)
                }).catch((err) => {
                    console.log(err)
                });
        },
        openConfirmarAprobacion() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro de aprobar esta solicitud de guias?',
                accept: this.changeEstadoEntrega
            })
        },
        changeEstadoEntrega() {
            let me = this;
            let formData = new FormData();
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('grupo', 'facturacion')
            formData.append('estado', '1')
            me.$vs.loading();
            this.$http.post(this.$server_url + 'entregarPedido', formData)
                .then(res => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Se guardo correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('changeGuias', true)
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        filtroTipo() {
            let me = this;
            me.tmpPedidos = []
            //para ver los pedidos pendientes
            if (me.filtro == 0) {
                let datos = me.pedidos.filter(p => (p.estado_entrega == 0 && (p.estado == 1 || p.estado == 0)));
                me.tmpPedidos = datos
                return
            }
            //para ver los pedidos aprobados
            if (me.filtro == 1) {
                let datos = me.pedidos.filter(p => (p.estado_entrega == 1) && p.estado == 1);
                me.tmpPedidos = datos
                return
            }
            //para ver los pedidos entregados por bodega
            if (me.filtro == 2) {
                let datos = me.pedidos.filter(p => (p.estado_entrega == 2) && p.estado == 1);
                me.tmpPedidos = datos
                return
            }
        },
        f_detalle_libros(item) {
            let me = this
            me.modalLibros = true;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'get_val_pedidoInfo/' + item.id_pedido)
                .then(res => {
                    let datos = res.data
                    // me.arregloLibros = datos.filter(p => p.valor > 0)
                    var predatos = []
                    predatos = datos.filter(p => p.valor > 0)
                    me.arregloLibros = predatos.sort(function(a, b) {
                        var nombreA = a.nombrelibro.toLowerCase();
                        var nombreB = b.nombrelibro.toLowerCase();
                        var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                        var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                        nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                        nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
                        
                        if (nombreA < nombreB) {
                            return -1;
                        }
                        if (nombreA > nombreB) {
                            return 1;
                        }
                        if (numA && !numB) { // si a tiene número y b no, b va primero
                            return 1;
                        }
                        if (!numA && numB) { // si b tiene número y a no, a va primero
                            return -1;
                        }
                        if (numA && numB) { // si ambos tienen número, compararlos
                            if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                            return -1;
                            }
                            if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                            return 1;
                            }
                            return numA - numB; // comparar los números directamente
                        }
                        return 0; // si son iguales en todo, no hay diferencia
                    });
                    //====TOTAL LIBROS
                    me.totalLibros = datos.reduce((acc, valor) => {
                        const respuesta = acc + valor.valor
                        return respuesta
                    }, 0)
                    me.$vs.loading.close()
                })
        },
    }
}
</script>
