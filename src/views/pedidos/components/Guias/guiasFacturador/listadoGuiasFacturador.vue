<template>
    <div>
        <ul class="flex mt-2" style="flex-wrap:center;">
            <li v-if="userAdmin == true || usuario.id_group == 27 ">
                <vs-radio v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="0"><span style="font-weight:bold;">{{sumaPendientes}}</span> Pendientes</vs-radio>
            </li>
            <li>
                <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="1"><span style="font-weight:bold;">{{ SumaAprobados }}</span> Aprobados</vs-radio>
            </li>
            <li>
                <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="2"><span style="font-weight:bold;">{{ SumaEntregados }}</span> Entregados por bodega </vs-radio>
            </li>
        </ul>
        <vs-table search :data="tmpPedidos" pagination max-items="10">
            <template slot="header">
                <vs-chip>Cantidad: {{ tmpPedidos.length }}</vs-chip>
                <p class="btn_lg font-semibold ml-2">Pedidos de guias </p>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th sort-key="asesor">Asesor / Responsable</vs-th>
                <vs-th style="width: 140px;" sort-key="fecha_envio">Fechas</vs-th>
                <vs-th style="width: 80px;" sort-key="asesor">Cant. guias</vs-th>
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
                        <p class="font-bold">Período solicitud:</p>
                        <vs-chip color="primary">{{ tr.periodo }} </vs-chip>
                    </vs-td>
                    <vs-td>
                        <p class="font-bold">Fecha de envio:</p>
                        <span>{{ tr.fecha_envio.substring(0,10) }} </span>
                    </vs-td>
                    <vs-td>
                        {{ tr.total_unidades_guias }}
                    </vs-td>
                    <vs-td>
                        <p v-if="tr.observacion != null">
                            <vx-tooltip style="display: inline-block;" text="Ver Observación asesor" position="top" color="primary">
                                <vs-button  class="modal-default-button p-2" @click="pedido=tr;popupObservacion=true;" size="small" color="dark" type="filled" icon-pack="feather" icon="icon-message-circle">Ver observación </vs-button>
                            </vx-tooltip>   
                            <p class="mt-2"></p>
                        </p>
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
                                <vs-dropdown-item v-if="( userFacturador == true )  && tr.ven_codigo == null">
                                    <vx-tooltip style="display: inline-block;" text="AL PRESIONAR SE ENVIARA AL SISTEMA DE FACTURACION" position="top" color="primary">
                                     <vs-button class="w-full" color="dark"  icon-pack="feather" icon="icon-check" type="line" @click="verResumen =false;pedido = tr;verStock(0)">Aprobar solicitud</vs-button>
                                    </vx-tooltip>    
                                </vs-dropdown-item>
                                <!--IMPRIMIR ACTA FACTURACION-->
                                <vs-dropdown-item v-if="( userAdmin == true ) && tr.ven_codigo != null">
                                    <vs-button class="w-full" color="#3541D3" icon-pack="feather" icon="icon-printer" type="line" @click="pedido = tr;ImprimirActa(0)">Imprimir acta(f)</vs-button>
                                </vs-dropdown-item>
                                <!--IMPRIMIR ACTA BODEGA-->
                                <vs-dropdown-item v-if="( usuario.id_group == 1  || usuario.id_group == 27 ) && tr.ven_codigo != null && (filtro == 1 || filtro == 2 )">
                                    <vs-button class="w-full" color="#3541D3" icon-pack="feather" icon="icon-printer" type="line" @click="pedido = tr;ImprimirActa(1)">Imprimir acta(b)</vs-button>
                                </vs-dropdown-item>
                                <!--RESUMEN-->
                                <vs-dropdown-item v-if="filtro == 0">
                                    <vs-button class="w-full"  icon="visibility" type="line" @click="verResumen =true;pedido = tr;verStock(0)">Resumen</vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="filtro == 1 || filtro == 2">
                                    <vs-button class="w-full"  icon="visibility" type="line" @click="verResumen =true;pedido = tr;verStock(1)">Resumen</vs-button>
                                </vs-dropdown-item>
                                <!--ENTREGAR GUIAS AL ASESOR(bodega)-->
                                <vs-dropdown-item v-if="(usuario.id_group == 17 || usuario.id_group == 27 || usuario.id_group == 1) && (tr.estado_entrega == 1)">
                                    <!-- <vx-tooltip style="display: inline-block;" text="MARCAR COMO GUIAS ENTREGADAS AL ASESOR(BODEGA)" position="top" color="primary"> -->
                                        <vs-button class="w-full"  icon-pack="feather" color="dark" icon="icon-book" type="line" @click="pedido = tr;openConfirm(tr);">Entregar guias</vs-button>
                                    <!-- </vx-tooltip> -->
                                </vs-dropdown-item>
                                <!--EDITAR-->
                                <vs-dropdown-item v-if="usuario.id_group == 27">
                                    <vs-button class="w-full"  icon-pack="feather" color="warning" icon="icon-edit" type="line" @click="ver_pedido(tr)">Revisar pedido</vs-button>
                                </vs-dropdown-item>
                                <!--REPORTE GUIA-->
                                <vs-dropdown-item v-if="usuario.id_group != 11">
                                    <vs-button class="w-full"  icon-pack="feather" icon="icon-file" @click="pedido = tr;getReporteGuia(tr);" color="success" type="line">Reporte guia</vs-button>
                                </vs-dropdown-item>
                                <!--ELIMINAR PEDIDO-->
                                <vs-dropdown-item v-if="tr.estado_entrega == 0">
                                    <vs-button class="w-full"  color="danger" type="line" @click="confirma_delete_pedido(tr)">Eliminar pedido</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--IMPRIMIR GUIA-->
        <div v-if="mostrarReporteG">
            <exportGuiasVue style="display: none;" :id_periodo="pedido.id_periodo" :id_pedido="pedido.id_pedido" @change="changeHandle" />
        </div>
        <!--EXPORTAR ACTA FACTURADOR - ASESOR-->
        <div v-if="mostrarImprimirActa">
            <exportActaGuiasVue v-if="mostrarImprimirActa" style="display: none;" :pedido = "pedido" @change="changeHandle"/>
        </div>
        <!--EXPORTAR ACTA BODEGA - ASESOR-->
        <div v-if="mostrarImprimirActaBodega">
            <exportActaGuiasBodegaVue v-if="mostrarImprimirActaBodega" style="display: none;" :pedido = "pedido" @change="changeHandle"/>
        </div>
        <!--MODAL CARGAR-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
            <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
            <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
        </vs-popup>
        <!--MODAL DETALLE DE LIBROS-->
        <vs-popup title="Detalle de libros" fullscreen :active.sync="modalLibros">
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
            <div v-if="NohayStock">
                <vs-alert color="danger">No hay stock no se puede aprobar</vs-alert>
            </div>
            <div v-else>
                <div v-if="verResumen == false" class="flex justify-center">
                    <vs-button color="primary" @click="enviarGuiasBDMilton();" type="border" icon="save">Si deseo aprobar</vs-button>
                    <vs-button color="warning" class="ml-2" @click="popupConfirmAprobar = false;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>
        <!--MODAL PARA VER OBSERVACION DEL FACTURADOR-->
        <vs-popup classContent="popup-example" title="Ver comentario Asesor" :active.sync="popupObservacion">
            <p class="font-bold text-warning text-2xl">Comentario Asesor:</p>
            <vs-divider style="margin-top: -2px;"></vs-divider>
            <p class="">{{ pedido.observacion }}</p>
        </vs-popup>
    </div>
    </template>
    <script>
    import exportGuiasVue from '../../../../temporadas/components/exportGuias.vue';
    import exportActaGuiasVue from '../../../../temporadas/components/exportActaGuias.vue';
    import exportActaGuiasBodegaVue from '../../../../temporadas/components/exportActaGuiasBodega.vue';
    import GuiasStockVue from '../GuiasStock.vue';
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
                mostrarImprimirActaBodega:false,
                pedidoGuiaEliminar: '',
                filtro: 0,
                arregloLibros: [],
                arregloStock:[],
                modalLibros: false,
                popupConfirmAprobar:false,
                verResumen:false,
                totalLibros: 0,
                userAdmin:false,
                userFacturador:false,
                NohayStock:false,
                popupObservacion:false,
            }
        },
        components: {
            exportGuiasVue,
            exportActaGuiasVue,
            exportActaGuiasBodegaVue,
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
            if(me.usuario.id_group == 27 || me.usuario.id_group == 17){
                me.filtro = 1
            }else{
                me.filtro = 0
            }
            //user admin
            if(me.usuario.id_group  == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1){
                me.userAdmin = true
            }
            //user facturador
            if(me.usuario.id_group  == 22 || me.usuario.id_group == 23){
                me.userFacturador = true
            }
        },
        computed: {
            sumaPendientes() {
                let me = this;
                //pendientes admin bodega
                var predatos = []
                if(me.usuario.id_group == 27){
                   predatos  = me.pedidos.filter(p => p.id_asesor == me.usuario.idusuario)
                }else{
                    predatos = me.pedidos
                }
                let datos = predatos.filter(p => (p.estado_entrega == 0) && (p.estado == 1));
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
            verStock(tipo){
                let me = this;
                me.arregloStock = []
                me.$vs.loading()
                var url = ""
                //resumen para facturacion
                if(tipo == 0){
                    var url = this.$server_url+'guias?verStock=yes&id_pedido='+me.pedido.id_pedido
                }
                //resumen para bodega
                if(tipo == 1){
                    url = this.$server_url+'guias?verStockGuiasProlipa=yes&id_pedido='+me.pedido.id_pedido+'&acta='+me.pedido.ven_codigo
                }
                this.$http.get(url)
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
                        if(tipo == 0){
                            //validate que haya stock
                            let validate = datos.filter(p => p.nuevoStock < 1)
                            if(validate.length > 0){
                                me.NohayStock = true
                            }else{
                                me.NohayStock = false
                            }
                            //fin validate que haya stock
                        }
                      
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
                formData.append('asesor_id',            me.pedido.id_asesor)
                formData.append('id_periodo',           me.pedido.id_periodo)
                formData.append('cli_ins_codigo',       me.pedido.cli_ins_codigo)
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
                    me.$emit('changeRecarge', true)
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
                me.mostrarImprimirActaBodega = false
                me.pedido               = {}
            },
            ver_pedido(item) {
                let me = this;
                localStorage.setItem("id_periodo_selected", item.id_periodo)
                localStorage.setItem("nombre_periodo_selected", item.periodo)
                this.$store.dispatch('setGuia',item)
                this.$emit('showPedido',1)
            },
            getReporteGuia(tr) {
                let me = this;
                localStorage.setItem("id_periodo_selected", tr.id_periodo)
                localStorage.setItem("nombre_periodo_selected", tr.periodo)
                me.id_pedido = tr.id_pedido
                me.popupCarga = true
                me.mostrarReporteG = true
            },
            ImprimirActa(tipo){
                let me                              = this;
                me.popupCarga                       = true
                if(tipo == 0){
                    me.mostrarImprimirActa          = true
                }
                if(tipo == 1){
                    me.mostrarImprimirActaBodega    = true
                }
               
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
                        me.$emit('changeRecarge', true)
                    }).catch((err) => {
                        console.log(err)
                    });
            },
            filtroTipo() {
                let me = this;
                me.tmpPedidos = []
                //para ver los pedidos pendientes
                if (me.filtro == 0) {
                    //bodega mostrar los pedidos pendientes de bodega
                    var predatos = []
                    if(me.usuario.id_group == 27){
                    predatos  = me.pedidos.filter(p => p.id_asesor == me.usuario.idusuario)
                    }else{
                        predatos = me.pedidos
                    }
                    let datos = predatos.filter(p => (p.estado_entrega == 0 && p.estado == 1));
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
            //====METODOS DE BODEGA======
            openConfirm(){
                this.$vs.dialog({
                    type:'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    acceptText:'aceptar',
                    cancelText:'cancelar',
                    text: 'Esta seguro de entregar esta solicitud de guias?',
                    accept:this.entregarPedido
                })
            },
            entregarPedido() {
                let me = this
                me.$vs.loading();
                let data = {
                    'id_pedido': this.pedido.id_pedido,
                    'estado': '2',
                    'grupo': 'bodega',
                    'acta':this.pedido.ven_codigo,
                    'asesor_id':this.pedido.id_asesor
                }
                this.$http.post(this.$server_url + 'entregarPedido', data)
                    .then(res => {
                        me.f_notificaciones('Pedido entregado', 'success', 'check')
                        me.$emit('changeRecarge', true)
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err)
                        me.$vs.loading.close();
                    })
            },
            f_notificaciones(msj, color, icono) {
                let me = this;
                me.$vs.notify({
                    text: msj,
                    color: color,
                    iconPack: 'feather',
                    icon: icono
                })
                return;
            },
            //====FIN METODOS DE BODEGA====
        }
    }
    </script>
    