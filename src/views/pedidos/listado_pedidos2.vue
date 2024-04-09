<template>
  <div>
    <!--MOSTRAR VERIFICACIONES; TRAZABILIDAD-->
    <!-- <div v-if="menu == 2">
      <br>
      <vs-button color="primary" class="ml-4" type="border" @click="menu = 1;">← Regresar</vs-button>
      <vs-tabs alignment="fixed">
        <vs-tab label="Verificaciones"  @click="menuTab=0">
            <div>
              <historicoCodigosNuevoVue
              :sendPedido="pedido"
              class="mt-2"
              :contratoPedido="pedido.contrato_generado"
              :desdePedido="1"
              />
            </div>
        </vs-tab>
        <vs-tab label="Trazabilidad"  @click="menuTab=1">
            <div>
              <VerificacionTrazabilidadVue :contratoPedido="pedido.contrato_generado"/>
            </div>
        </vs-tab>
        <vs-tab label="Pagos" @click="menuTab=2">
          <div v-if="menuTab == 2">
            <ScreenPagosVue :contrato="pedido.contrato_generado" :sendPedido="pedido"/>
          </div>
      </vs-tab>
      </vs-tabs>
    </div> -->
    <!--LISTADO PEDIDOS-->
    <div v-if="menu == 1">
      <!--MENU OPCIONES-->
      <vs-button color="primary" v-if="activeMenu == false" @click="activeMenu = true;" type="line"><ion-icon name="grid-outline"></ion-icon> Mostrar menú</vs-button>
      <div class="vx-row" v-if="activeMenu">
        <vx-card class="fade-in vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6"
        >
          <!--DIFERENTE DE BODEGA-->
          <div v-if="!userBodega">
            <div class="header-sidebar">
              <h4>
                <div>
                  <span style="opacity:0.8;" class="text-primary"><ion-icon name="apps-outline" style="position: relative;top:2px;"></ion-icon> Menú de opciones</span>
                  <!-- <vs-button size="small" v-if="userFacturador" class="ml-2" @click="getPedidos()" style="margin-top: -10px;" type="relief">Recargar pedidos</vs-button> -->
                  <vs-button size="small" v-if="userRoot" class="ml-2" @click="llenarPedidos()" style="margin-top: -10px;" type="relief">llenar información en temporadas</vs-button>
                  <vs-button size="small" v-if="userFacturador" class="ml-2" @click="$emit('changeRecarge',true)" style="margin-top: -10px;" type="relief">Recargar pedidos</vs-button>
                </div>
                <vs-button color="primary" icon="close" @click="activeMenu = false;" type="flat"></vs-button>
              </h4>
            </div>
            <vs-divider></vs-divider>
            <!--Opciones-->
            <div class="vx-row">
              <!--PENDIENTES-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                <span class="menutitle"><ion-icon name="cash-outline"></ion-icon> Pendientes <small style="font-size:11px;">(Sin contratos)</small></span>
                <div class="submenu">
                  <span class="submenutitle menu1"  v-if="userAdminFacturador || userRoot || userFacturador || userAsesor" @click="filtro = 1;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Sin anticipos: <b>{{ SumaSinAnticipo }}</b></span>
                  <span class="submenutitle menu2"  v-if="userAdminFacturador || userRoot || userAsesor"                   @click="filtro = 2;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Con anticipo (sin aprobar): <b>{{ SumaConAnticipoSinAprobar }}</b></span>
                  <span class="submenutitle menu13" v-if="userAdminFacturador || userRoot"                   @click="filtro = 13;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalPendientes }}</b></span>
                </div>
              </div>
              <!--APROBADOS-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6" v-if="userAdminFacturador || userRoot || userFacturador || userAsesor">
                <span class="menutitle"><ion-icon name="cash-outline"></ion-icon> Aprobados <small style="font-size:11px;">(Sin contratos)</small></span>
                <div class="submenu">
                  <span class="submenutitle menu3"  @click="filtro = 3;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Con anticipo (aprobado): <b>{{ SumaConAnticipoAprobados }}</b></span>
                </div>
              </div>
              <!--GERENCIA-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6" v-if="userAdminFacturador || userRoot || userFacturador">
                <span class="menutitle"><ion-icon name="people-circle-outline"></ion-icon> Gerencia <small style="font-size:11px;">(Sin contratos)</small></span>
                <div class="submenu">
                  <span class="submenutitle menu4"  v-if="userAdminFacturador || userRoot"                   @click="filtro = 4;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Solicitud anticipos: <b>{{ SumaSolicitudAnticipos }}</b></span>
                  <span class="submenutitle menu5"  v-if="userAdminFacturador || userRoot || userFacturador" @click="filtro = 5;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Anticipos aprobados: <b>{{ SumaAnticiposGerenciaAprobados }}</b></span>
                  <span class="submenutitle menu6"  v-if="userAdminFacturador || userRoot"                   @click="filtro = 6;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Anticipos anulados:  <b>{{ SumaAnticiposGerenciaAnulados }}</b></span>
                  <span class="submenutitle menu14" v-if="userAdminFacturador || userRoot"                   @click="filtro = 14;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Total:     <b>{{ SumaTotalGerencia }}</b></span>
                </div>
              </div>
              <!--CONTRATOS-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                <span class="menutitle"><ion-icon name="albums-outline"></ion-icon> Contratos</span>
                <div class="submenu">
                  <span class="submenutitle menu7" @click="filtro = 7;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Con anticipos: <b>{{ SumaContratosConAnticipoAprobados }}</b></span>
                  <span class="submenutitle menu8" @click="filtro = 8;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Sin anticipos: <b>{{ SumaContratoSinAnticipo }}</b></span>
                  <span class="submenutitle menu15" v-if="userAdminFacturador || userRoot"                   @click="filtro = 15;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalContratos }}</b></span>
                </div>
              </div>
              <!--CHEQUES-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6" v-if="userAdminFacturador || userRoot">
                <span class="menutitle"><ion-icon name="wallet-outline"></ion-icon> Cheques</span>
                <div class="submenu">
                  <span class="submenutitle menu9" @click="filtro = 9;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Cheques generados: <b>{{ SumaEntregaCheques }}</b></span>
                  <span class="submenutitle menu10" @click="filtro = 10;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Pagaré generados: <b>{{ SumaSolicitudesPagares }}</b></span>
                  <span class="submenutitle menu11" @click="filtro = 11;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Pagaré recibidos: <b>{{ SumaPagareFisicosEntregados }}</b></span>
                  <span class="submenutitle menu16" v-if="userAdminFacturador || userRoot"                   @click="filtro = 16;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalCheques }}</b></span>
                </div>
              </div>
              <!--ALCANCE-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                <span class="menutitle"><ion-icon name="wallet-outline"></ion-icon> Alcance</span>
                <div class="submenu">
                  <span class="submenutitle menu17" @click="filtro = 17;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Pendientes: <b>{{ SumaAlcancePendientes }}</b></span>
                  <span class="submenutitle menu18" @click="filtro = 18;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Aprobados:  <b>{{ SumaAlcanceCerrados }}</b></span>
                </div>
              </div>
              <!--OTROS-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                <span class="menutitle"><ion-icon name="contract-outline"></ion-icon> Otros</span>
                <div class="submenu">
                  <span class="submenutitle menu100 text-warning font-bold" @click="filtro = 100;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Todos: <b>{{ sumaTotal }}</b></span>
                  <span class="submenutitle menu19" @click="filtro = 19;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Anulados: <b>{{ SumaAnulados }}</b></span>
                </div>
              </div>
              <!--TIPOS DE VENTAS-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                <span class="menutitle"><ion-icon name="contract-outline"></ion-icon> Tipo de venta <small style="font-size:11px;">(contratos)</small></span>
                <div class="submenu">
                  <span class="submenutitle menu20"  @click="filtro = 20;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Venta directa: <b>{{ SumaVentaDirecta }}</b></span>
                  <span class="submenutitle menu21" @click="filtro = 21;filtroTipo();estadoMenu();"><ion-icon name="caret-forward-outline"></ion-icon> Venta lista: <b>{{ SumaVentaLista }}</b></span>
                </div>
              </div>
            </div>
            <vs-divider>Filtro por:</vs-divider>
            <vs-row>
              <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <ul class="flex">
                  <li>
                    <vs-radio v-model="tipoFecha" @input="titleFecha='Fecha envio'" vs-name="radios1tipoFecha" vs-value="0">Fecha envio</vs-radio>
                  </li>
                  <li>
                    <vs-radio v-model="tipoFecha" class="ml-2" @input="titleFecha='Fecha entrega';" vs-name="radios1tipoFecha" vs-value="1">Fecha Entrega</vs-radio>
                  </li>
                </ul>
              </vs-col>
              <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
              <flat-pickr :config="configdateTimePicker" v-model="fechaSelect" @input="filtrarFechas()" :placeholder="titleFecha" class="m-1" style="display: inline-block;width: 100%;" />
              <vx-tooltip style="display: inline-block;" text="Limpiar filtro" position="top" color="primary">
                <vs-button v-if="fechaSelect" radius color="primary" type="border" icon-pack="feather" @click="fechaSelect='';filtrarFechas()" icon="icon-x"></vs-button>
              </vx-tooltip>
              </vs-col>
            </vs-row>
          </div>
          <!--BODEGA-->
          <div v-if="userBodega">
            <p>Filtrar por:</p>
            <ul class="flex mt-2">
              <li>
                <vs-radio v-model="tipoBodega" @input="filtroBodega();" class="mr-2" vs-name="radios1filterBodega" vs-value="0">Todos</vs-radio>
              </li>
              <li>
                <vs-radio v-model="tipoBodega" @input="filtroBodega();" class="mr-2" vs-name="radios1filterBodega" vs-value="1"><b>{{ SumarPedidosNoentregadosSinContrato }}</b> Pedidos sin contrato (Sin contrato)</vs-radio>
              </li>
              <li>
                <vs-radio v-model="tipoBodega" @input="filtroBodega();" class="mr-2" vs-name="radios1filterBodega" vs-value="2"><b>{{ SumarPedidosNoentregadosConContrato }}</b> Pedidos sin Entregar (Contratos)</vs-radio>
              </li>
              <li>
                <vs-radio v-model="tipoBodega" @input="filtroBodega();" vs-name="radios1filterBodega" color="success" vs-value="3"><b>{{ SumaPedidosEntregados }}</b> Pedidos Entregados </vs-radio>
              </li>
            </ul>
          </div>
          <!--venta real asesor todos los contratos-->
            <!--TOTAL VENTA BRUTA-->
          <div class="flex">
            <div class="p-6 pb-0" v-if="totalRealContratos > 0">
              <div class="flex justify-center">
                  <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                    <feather-icon icon="ShoppingBagIcon"  svgClasses="h-8 w-7" class="ml-1" />
                  </span>
              </div>
              <div class="flex justify-center">
                  <h2 class="mb-1 font-bold" style="opacity:0.7;color:#1E9080;">${{ totalRealContratos | filtrarDecimal }}</h2>
              </div>
              <div class="ml-4"><span class="">Total Venta Real Contratos</span></div>
            </div>
          </div>
        </vx-card>
      </div>
      <!--MENU OPCIONES-->
      <!--TABLA-->
      <div>
        <vs-table max-items="20"  multiple v-model="codigoSelected" search :data="tmpPedidos" pagination>
          <template slot="header">
            <vs-chip color="primary" class="ml-1">Cantidad: {{tmpPedidos.length}}</vs-chip>
            <h5 v-if="!userBodega" class="ml-2">Pedidos período {{ periodoSelect.periodoescolar }} </h5>
            <!-- <span @click="tipoExportacion=0;tryExport()" class="cursor-pointer">
              <vx-tooltip style="display: inline-block;" text="Seleccione los registros a exportar" position="top" color="primary">
                <vs-chip transparent class="py-3 ml-2" style="font-weight: bold;" color="warning"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span> </vs-chip>
              </vx-tooltip>
            </span> -->
            <span @click="tipoExportacion=1;tryExport()" class="cursor-pointer">
              <vx-tooltip style="display: inline-block;" text="Seleccione los registros a exportar" position="top" color="primary">
                <vs-chip transparent class="py-3 ml-5" style="font-weight: bold;" color="dark"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar Reporte Venta</span> </vs-chip>
              </vx-tooltip>
            </span>
            <span @click="popupReportes=true;" class="cursor-pointer" v-if="groupFacturador">
              <vx-tooltip style="display: inline-block;" text="Exportar promocion" position="top" color="primary">
                <vs-chip transparent class="py-3 ml-5" style="font-weight: bold;" color="dark"><i class="fa-solid fa-download"></i><span class="ml-2">REPORTE PROMOCIÓN TEXTOS</span> </vs-chip>
              </vx-tooltip>
            </span>
          </template>
          <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="nombreInstitucion">Institución</vs-th>
            <vs-th sort-key="fecha_envio">Fechas</vs-th>
            <vs-th>Venta</vs-th>
            <vs-th>Detalle V.</vs-th>
            <vs-th>Contrato generado</vs-th>
            <vs-th sort-key="asesor">Pagos</vs-th>
            <vs-th >Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{ tr.id_pedido }}
                <p class="mt-1" style="margin-left:-5px;" v-if="groupFacturador">
                  <vs-chip  v-if="tr.notificados == 1" color="#314278">Notificado</vs-chip>
                </p>
              </vs-td>
              <vs-td>
                <b>Tipo de venta</b>
                {{tr.tipo_venta_descr}}
                <p v-if="userBodega" class="mt-1">
                  <vs-chip color="primary">{{ tr.periodoescolar }}</vs-chip>
                </p>
                <p class="font-bold">Institución:
                  <small v-if="usuario.cedula == 'facturadorm'">{{ tr.codigo_institucion_milton }}</small>
                  <small v-if="usuario.name_usuario == 'sguacan'">{{ tr.id_institucion }}</small>
                </p>
                <span>{{ tr.nombreInstitucion }} </span>
                <p><b>Ciudad:</b> {{ tr.nombre_ciudad }}</p>
                <p class="font-bold">Asesor:</p>
                <span>{{ tr.responsable }} ( {{ tr.iniciales }} )</span>
                <p><b>Cédula:</b> {{ tr.cedula_asesor }}</p>
              </vs-td>
              <vs-td>
                <p class="font-bold">Fecha de solicitud:</p>
                <span>{{ tr.fecha_envio.substring(0,10) }} </span>
                <p class="font-bold">Fecha de entrega:</p>
                <span>{{ tr.fecha_entrega.substring(0,10) }} </span>
                <div v-if="tr.estado_entrega == 2">
                  <p class="font-bold">Fecha de entrega Bodega:</p>
                  <span>{{ tr.fecha_entrega_bodega }} </span>
                </div>
                <div>
                  <p class="font-bold">Fecha de actualización:</p>
                  <span>{{ tr.updated_at }} </span>
                </div>
              </vs-td>
              <vs-td>
                <p class="font-bold">Total unidades:</p>
                <span v-if="tr.alcanceUnidades == null">{{ tr.total_unidades }} </span>
                <span v-else>{{  parseInt(tr.total_unidades) + parseInt(tr.alcanceUnidades) }}</span>
                <p class="font-bold">Venta bruta:</p>
                <span>{{ tr.TotalVentaReal | filtrarDecimal}} </span>
                <!-- <span v-if="tr.contador_alcance == null">{{ tr.total_venta }} </span>
                <span v-else>{{  parseFloat(tr.total_venta) + parseFloat(tr.contador_alcance) }}</span> -->
                <div v-if="tr.ven_neta > 0">
                  <p class="font-bold">Venta Neta:</p>
                  <span>{{ tr.ven_neta | filtrarDecimal }} </span>
                </div>
              </vs-td>
              <vs-td>
                <p class="font-bold">Comisión:</p>
                <span>{{ tr.descuento }} </span>
                <div v-if="tr.ifanticipo == 1">
                  <p class="font-bold">Anticipo sugerido:</p>
                  <span>{{ tr.anticipo }} </span>
                  <p class="font-bold">Anticipo aprobado:</p>
                  <span>{{ tr.anticipo_aprobado }} </span>
                </div>
                <div v-if="tr.convenio_anios > 0">
                  <p class="font-bold">Convenio:</p>
                  <span>{{ tr.convenio_anios }} </span>
                </div>
              </vs-td>
              <vs-td>
                <span class="cursor-pointer" v-if="tr.facturacion_vee == 0" @click="pedido=tr;popupGenerarContratoManual = true">
                  <vs-chip color="danger" >
                    Generar contrato
                  </vs-chip>
                </span><br>
                <p class="font-bold">Contrato:</p>
                <span>{{ tr.contrato_generado }} </span>
                <label v-if="tr.contrato_generado == null">
                </label>
                <label v-else>
                  <p>
                    <span v-if="tr.estado_entrega == 2" color="primary">
                      <b>bodega</b> : Entregado
                    </span>
                    <span v-else color="warning">
                      <b>bodega</b> : Pendiente
                    </span>
                  </p>
                </label>
                <!--CHEQUE-->
                <p v-if="tr.historicoEstado == 6 || tr.historicoEstado == 7 && groupFacturador" @click="mostrarDocumento = true;pedido=tr;popupEnviarCheque = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b> Cheque:</b> enviado desde contabilidad</span></p>
                <p v-if="tr.historicoEstado > 7" @click="mostrarDocumento = true;pedido=tr;popupEnviarCheque = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b> Cheque:</b> entregado</span></p>
                <!--PAGARE-->
                <p v-if="tr.historicoEstado == 9" @click="mostrarDocumento = true;pedido=tr;popupRecibirPagare = true;" class="cursor-pointer"><span><i class="fa-solid fa-camera"></i><b> Pagaré:</b> subido</span></p>
                <p v-if="tr.historicoEstado > 9" @click="mostrarDocumento = true;pedido=tr;popupRecibirPagare = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b>Pagaré:</b> recibido (facturador)</span></p>
                <p v-if="tr.historicoEstado > 10" @click="mostrarDocumento = true;pedido=tr;popupRecibirPagare = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b>Pagaré:</b> recibido (contabilidad)</span></p>
                <div class="mt-1">
                  <p class="mt-1" v-if="tr.facturacion_vee == 0 && userAsesor">
                    <vs-chip color="danger">Facturador no puede ver</vs-chip>
                  </p>
                  <vs-chip v-if="tr.estado == 0" color="warning">
                    Pedido incompleto
                  </vs-chip>
                  <vs-chip v-if="tr.estado == 1">
                    Activo
                  </vs-chip>
                  <vs-chip v-if="tr.estado == 2" color="danger">
                    Anulado
                  </vs-chip>
                </div>
                <p class="mt-1">
                  <vs-chip color="#5E4BE5" v-if="tr.ifagregado_anticipo_aprobado == 3">
                    Aprobado por Gerencia
                  </vs-chip>
                </p>
                <p class="mt-1 cursor-pointer" v-if="tr.verificaciones > 0" @click="pedido = tr; ver_pedido(tr)"><vs-chip><b>Verificaciones:  {{ tr.verificaciones }} </b></vs-chip></p><br><br>
                <p class="mt-1 cursor-pointer" v-if="tr.estado_verificacion > 0"
                  @click="pedido = tr; popupCodigosLiquidarse=true;"
                >
                  <vs-chip color="warning">Verificación pendiente</vs-chip>
                </p>
              </vs-td>
              <vs-td>
                <!-- <b>Total Liquidaciones:</b>
                <p>{{ tr.TotalLiquidaciones | filtrarDecimal }}</p> -->
                <b>Total Comision:</b>
                <p>{{ tr.totalValorComision | filtrarDecimal }}</p>
                <b v-if="tr.totalPagado  > 0">Total Pagado a Clientes:</b>
                <p v-if="tr.totalPagado > 0" class="text-success">{{ tr.totalPagado | filtrarDecimal }}</p>
                <b v-if="tr.totalPendienteLiquidar > 0" >Pendiente Liquidar:</b>
                <p v-if="tr.totalPendienteLiquidar > 0" class="text-danger"> {{ tr.totalPendienteLiquidar | filtrarDecimal }}</p>
                <div v-if="tr.deuda > 0">
                  <p class="font-bold">Deuda anterior:</p>
                  <span class="text-danger">{{ tr.deuda }} </span>
                </div>
                <div v-if="tr.totalDeudaProxima > 0">
                  <p class="font-bold">Deuda proximo año :</p>
                  <span class="text-danger">{{ tr.totalDeudaProxima }} </span>
                </div>
                <!-- <b v-if="(Math.abs(parseFloat(tr.PProlipaAumentar - tr.PProlipaDisminuir))) > 0">Total Pagado a la Empresa:</b>
                <p v-if="(Math.abs(parseFloat(tr.PProlipaAumentar - tr.PProlipaDisminuir))) > 0">{{ (Math.abs(parseFloat(tr.PProlipaAumentar - tr.PProlipaDisminuir))) | filtrarDecimal }}</p> -->
              </vs-td>
              <vs-td align="center">
                <vs-dropdown vs-custom-content vs-trigger-click>
                  <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                  <vs-dropdown-menu style="width: 320px;" class="cursor">
                    <div v-if="!userBodega">
                      <!--TRANSABILIDAD-->
                      <!-- <vs-dropdown-item v-if="groupFacturador">
                        <vs-button class="w-full" color="primary" @click="pedido=tr;popupMostrarTransabilidad = true;" type="line" ><ion-icon name="cellular-outline"></ion-icon> Trazabilidad </vs-button>
                      </vs-dropdown-item> -->
                      <vs-dropdown-item>
                        <!--VER PEDIDO-->
                          <vs-button  color="success" type="line" class="w-full" @click="ver_pedido(tr)">&nbsp;&nbsp;&nbsp;Ver pedido&nbsp;&nbsp;&nbsp;</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.estado == 1 && tr.historicoEstado < 4 && groupFacturador">
                        <!--ANULAR PEDIDO-->
                        <vs-button color="danger" type="line"   class="w-full" @click="pedido = tr;anular_pedido(tr)">Anular pedido</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.estado == 0 && userAsesor">
                        <!--ANULAR PEDIDO-->
                        <vs-button color="danger" type="line"   class="w-full" @click="pedido = tr;anular_pedido(tr)">Anular pedido</vs-button>
                      </vs-dropdown-item>
                      <!--GENERAR PEDIDO-->
                      <vs-dropdown-item v-if="tr.estado == 2 && userAsesor">
                        <!--GENERAR PEDIDO-->
                        <vs-button color="#5BB9E5" type="line" class="w-full" @click="pedido = tr;ConfirmgenerarNuevoPedido(tr)">&nbsp;&nbsp;&nbsp;Generar pedido&nbsp;&nbsp;&nbsp;</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.estado == 1 && groupFacturador">
                        <!--REPORTE PEDIDO-->
                        <vs-button icon-pack="feather" class="w-full" icon="icon-file" @click="pedido = tr;chooseBeneficiarioPedido(tr,1);" color="success" type="line">Reporte pedido</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.contrato_generado !=null && tr.estado == 1 && groupFacturador">
                      <!--IMPRIMIR REPORTE CONTRATO WORD-->
                        <vs-button class="w-full"  @click="tipoFile = 0;generarReportePdfContrato(tr,2)" color="primary" type="line">Reporte contrato word</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.contrato_generado !=null && tr.estado == 1 && groupFacturador">
                        <!--IMPRIMIR REPORTE CONTRATO PDF-->
                        <vs-button class="w-full" icon="picture_as_pdf" @click="tipoFile = 1;generarReportePdfContrato(tr,2)" color="#6A33D2" type="line">Reporte contrato pdf</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="groupFacturador && tr.contrato_generado !=null && tr.estado == 1 && (tr.tipo_venta == '1' || tr.tipo_venta == '2') && (tr.contadorAlcanceAbierto > 0 || tr.contadorAlcanceCerrado > 0)">
                        <!--ALCANCE-->
                        <vs-button  class="w-full"  @click="pedido = tr;verAlcance(tr);" color="warning" type="line">Alcance</vs-button>
                      </vs-dropdown-item>
                      <!--ALCANCE ASESOR-->
                      <vs-dropdown-item v-if="userAsesor && tr.contrato_generado !=null && tr.estado == 1">
                        <!--ALCANCE-->
                        <vs-button icon-pack="feather" class="w-full"   icon="icon-file" @click="pedido = tr;verAlcance(tr);" color="warning" type="line">Alcance</vs-button>
                      </vs-dropdown-item>
                      <!--SOLICITAR VERIFICACION-->
                      <vs-dropdown-item v-if="tr.contrato_generado !=null && tr.estado == 1 && (userRoot || userAsesor || groupFacturador)">
                          <vs-button icon-pack="feather" class="w-full"  icon="icon-users" @click="pedido = tr;SolicitarVerificacion(tr);" color="dark" type="line">Solicitar Verificación</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="groupFacturador && tr.contrato_generado !=null && tr.estado == 1 && (tr.tipo_venta == '1' || tr.tipo_venta == '2') && (tr.contadorAlcanceAbierto > 0 || tr.contadorAlcanceCerrado > 0)">
                        <!--TRANSABILIDAD ALCANCE-->
                        <vs-button class="w-full" color="dark" @click="pedido=tr;popupMostrarTransabilidadAlcance = true;" type="line" ><ion-icon name="cellular-outline"></ion-icon> Trazabilidad Alcance</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.convenio_anios > 0 && tr.contrato_generado !=null && tr.estado == 1 && groupFacturador">
                        <!--CONVENIO-->
                        <vs-button class="w-full" icon-pack="feather" icon="icon-printer" @click="pedido= tr;chooseBeneficiarioPedido(tr,3)" color="#3D21C6" type="line">Imprimir convenio</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.anticipo_aprobado > 0 && tr.contrato_generado !=null && tr.estado == 1">
                        <!--IMPRIMIR PAGARE-->
                        <vs-button class="w-full"  icon-pack="feather" type="line" icon="icon-upload-cloud" @click="pedido=tr;chooseBeneficiarioPedido(tr,4)" color="#5BB9E5">Imprimir Pagaré</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.historicoEstado == 6 && tr.estado == 1 && groupFacturador">
                        <!--MARCAR COMO RECIBIDO EL CHEQUE DE CONTABILIDAD-->
                        <vs-button class="w-full" icon-pack="feather" icon="icon-credit-card" @click="pedido = tr;popupRecibiCheque = true" color="warning" type="line">Marcar como recibido cheque</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.historicoEstado == 7 && tr.estado == 1 && groupFacturador">
                        <!--MARCAR CHEQUE COMO ENTREGADO AL ASESOR-->
                        <vs-button class="w-full" icon-pack="feather" icon="icon-credit-card" @click="pedido = tr;popupEnviarCheque = true" color="dark" type="line">Entrega de cheque a asesor</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item v-if="tr.historicoEstado == 9 && tr.estado == 1 && groupFacturador">
                        <!--MARCAR PAGARE COMO RECIBIDO POR EL ASESOR-->
                        <vs-button  class="w-full"  icon-pack="feather" icon="icon-file" @click="mostrarDocumento=false;pedido = tr;popupRecibirPagare = true;" color="dark" type="line">Marcar pagaré recibido</vs-button>
                      </vs-dropdown-item>
                      <!--VER INFORMACION VERIFICACIONES-->
                      <!-- <vs-dropdown-item v-if="tr.verificaciones > 0">
                        <vs-button icon-pack="feather" class="w-full" icon="icon-activity" @click="pedido = tr; VerVerificaciones(tr)" color="#7AD40E" type="line">Ver Verificación</vs-button>
                      </vs-dropdown-item> -->
                      <!--LIQUIDAR CONTRATO-->
                      <vs-dropdown-item v-if="tr.estado_verificacion > 0 && groupFacturador">
                        <vs-button icon-pack="feather" class="w-full" icon="icon-shopping-bag" @click="pedido = tr; openConfirmLiquidar(tr)" color="#500ED4" type="filled">Liquidar Contrato</vs-button>
                      </vs-dropdown-item>
                      <!--NOTIFICACION REVISACION-->
                      <vs-dropdown-item v-if="userRoot || userAdminFacturador">
                        <vs-button icon-pack="feather" v-if="tr.notificados == 0 && tr.contrato_generado == null" class="w-full text-normal" icon="icon-check"  @click="pedido = tr; notificarPedido(1)" color="#C74BDE" type="line">Marcar como notificado</vs-button>
                        <vs-button icon-pack="feather" v-if="tr.notificados == 1" class="w-full" icon="icon-check" @click="pedido = tr; notificarPedido(0)" color="#C74BDE" type="line">Quitar notificado</vs-button>
                      </vs-dropdown-item>
                    </div>
                    <div v-if="userBodega || usuario.name_usuario == 'facturadorm'">
                      <vs-dropdown-item>
                        <vs-button icon-pack="feather" class="w-full" icon="icon-airplay" @click="pedido = tr;onlyVer = 1; popupEntregarPedido = true;" color="dark" type="line">Ver Detalle</vs-button>
                      </vs-dropdown-item>
                      <vs-dropdown-item  v-if="tipoBodega == 2 && userBodega">
                        <vs-button icon-pack="feather" class="w-full" icon="icon-activity" @click="pedido = tr;onlyVer = 0;popupEntregarPedido = true;" color="#7AD40E" type="line">Entregar pedido</vs-button>
                      </vs-dropdown-item>
                    </div>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
    <!--DOWNLOAD DOCUMENTOS-->
    <div v-if="mostrarReporte">
      <exportPedidoVue style="display:none;" :id_beneficiario_pedido="id_beneficiario_pedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" @change="changeHandle" />
    </div>
    <div v-if="mostrarReporteC">
      <exportContratoVue style="display:none;" :tipoFile="tipoFile" :beneficiario="beneficiario" :id_beneficiario_pedido="id_beneficiario_pedido" :contrato="contrato" @change="changeHandle" />    </div>
    <!--Export convenio-->
    <div v-if="mostrarReporteConvenio">
      <exportConvenioVue style="display:none;" :empresaSelected="empresaSelected" :anioEmpieza="anioEmpieza" :aniosAnteriorSelect="aniosAnteriorSelect" :id_beneficiario_pedido="id_beneficiario_pedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" @change="changeHandle" />
    </div>
    <!--IMPRIMIR PAGARE-->
    <div v-if="mostrarPagareAsesor">
      <exportPagareVue style="display:none;" :empresaSelected="empresaSelected" :aniosAnteriorSelect="aniosAnteriorSelect" :id_beneficiario_pedido="id_beneficiario_pedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" :contrato="contrato" @change="changeHandle" />
    </div>
    <!--FIN DOWNLOAD DOCUMENTOS-->
    <!--MODALES-->
    <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
      <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
      <img  class="mt-2"  style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png"/>
    </vs-popup>
    <!--MODAL PARA SELECCIONAR UN BENEFICIARIO-->
    <!--MODAL PARA GENERAR CONTRATO MANUAL-->
    <vs-popup class="holamundo" fullscreen :title="'Colocar contrato al pedido #'+pedido.id_pedido" :active.sync="popupGenerarContratoManual">
      <generarContratoVue v-if="popupGenerarContratoManual" :pedido="pedido" @changeContratoManual="changeContratoManual"/>
    </vs-popup>
    <!--ESCOGER BENEFICIARIOS-->
    <vs-prompt
      title="Seleccione un beneficiario para poder generar el reporte"
      @cancel="close"
      cancelText="Cancelar"
      acceptText="Generar"
      @accept="acceptAlert"
      @close="close"
      :active.sync="activePrompt">
        <div class="con-exemple-prompt">
          <p class="mt-2">Seleccione el Beneficiario</p>
          <v-select :options="arregloBeneficiarios" :reduce="arregloBeneficiarios => arregloBeneficiarios" label="beneficiarioComision" class="w-full" v-model="beneficiario" />
        </div>
        <!--TIPO 2 => Reporte contrato -->
        <div v-if="tipo == 3 || tipo == 4">
          <p class="mt-4">Seleccione la empresa por favor</p>
          <v-select :options="arrayEmpresas" :reduce="arrayEmpresas => arrayEmpresas" label="descripcion_corta" class="w-full" v-model="empresaSelected" />
        </div>
        <div v-if="tipo == 3">
          <p class="mt-4">Seleccione el año que comienza el convenio</p>
          <v-select :options="arregloAniosAnteriores" :reduce="arregloAniosAnteriores => arregloAniosAnteriores" class="w-full" v-model="anioEmpieza" />
        </div>
        <div v-if="tipo == 4 || tipo == 3">
          <p class="mt-4">Seleccione el año final para calcular los dias</p>
          <v-select :options="arregloAniosAnteriores" :reduce="arregloAniosAnteriores => arregloAniosAnteriores" class="w-full" v-model="aniosAnteriorSelect" />
        </div>
    </vs-prompt>
    <!--MODAL PARA VER LA TRANSABILIDAD-->
    <!-- <vs-popup class="holamundo" title="Ver trazabilidad" :active.sync="popupMostrarTransabilidad">
      <div v-if="popupMostrarTransabilidad">
        <screenTransabilidaVue :pedido="pedido"/>
      </div>
    </vs-popup> -->
    <!--MODAL PARA VER LA TRANSABILIDAD ALCANCE-->
    <vs-popup class="holamundo" title="Ver trazabilidad Alcance" :active.sync="popupMostrarTransabilidadAlcance">
      <div v-if="popupMostrarTransabilidadAlcance">
        <screenTransabilidaAlcanceVue :pedido="pedido"/>
      </div>
    </vs-popup>
    <!--MODAL PARA MARCAR COMO RECIBIO EL CHEQUE-->
    <vs-popup class="holamundo" title="Marcar como recibi el cheque" :active.sync="popupRecibiCheque">
      <div v-if="popupRecibiCheque">
        <div class="flex" style="justify-content: center;">
          <img width="500" :src="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque"/>
        </div>
        <vs-button color="success" @click="changeEstadoHistorico(7)" class="mt-5" type="gradient">Recibi el cheque</vs-button>
      </div>
    </vs-popup>
    <!--MODAL PARA ENVIAR CHEQUE ASESOR-->
    <vs-popup class="holamundo" title="Cheque para el asesor" fullscreen :active.sync="popupEnviarCheque">
      <div v-if="popupEnviarCheque">
        <div class="flex" style="justify-content: center;">
          <image-zoom
              :regular="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque"
              :zoom-amount="3"
              :click-zoom="true"
              click-message="De click para aumentar"
              img-class="img-fluid"
              >
          </image-zoom>
          <img width="500" v-if="mostrarDocumento == false" :src="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque"/>
        </div>
        <div class="flex" style="justify-content: center;" v-if="mostrarDocumento == false">
          <vs-button color="success" @click="changeEstadoHistorico(8)" class="mt-5" type="gradient">Entregue cheque al asesor</vs-button>
        </div>
      </div>
    </vs-popup>
    <!--FIN MODAL PARA ENVIAR CHEQUE ASESOR-->
    <!--MODAL PARA MARCAR COMO RECIBIDO PAGARE-->
    <vs-popup class="holamundo" title="Pagaré subido por el asesor" :active.sync="popupRecibirPagare">
      <div v-if="popupRecibirPagare">
        <div class="flex" style="justify-content: center;">
          <img width="500" :src="$data_url+'archivos/pedidos/pagare/'+pedido.evidencia_pagare"/>
        </div>
        <div class="flex" style="justify-content: center;" v-if="mostrarDocumento == false">
            <vs-button color="success" @click="changeEstadoHistorico(10)" class="mt-5" type="gradient">Recibi el pagaré fisico por parte del asesor</vs-button>
        </div>
      </div>
    </vs-popup>
    <!--MODAL PARA EXPORTAR A EXCEL-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="popupExport">
      <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
        <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
      </vs-alert>
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
    </vs-prompt>
    <!--MODAL PARA ENTREGAR PEDIDO (BODEGA)-->
    <vs-popup class="holamundo" fullscreen title="Detalle pedido" :active.sync="popupEntregarPedido">
      <pedidosDetalleVue :onlyVer="onlyVer" @changeRecarge="recargarPedidos()" v-if="popupEntregarPedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" :pedido="pedido"/>
    </vs-popup>
    <!--MODAL PARA VER CODIGOS A LIQUIDAR-->
    <vs-popup class="holamundo" fullscreen title="Códigos a liquidar" :active.sync="popupVerLiquidacion">
      <div v-if="popupVerLiquidacion">
        <LiquidacionVentaDirectaVue :pedido="pedido" @ChangeRecarge="recargarPedidos"/>
        <!--VENTA DIRECTA-->
        <!-- <div v-if="pedido.tipo_venta == 1">
            <p>Verificación venta directa</p>
            <LiquidacionVentaDirectaVue :pedido="pedido" @ChangeRecarge="recargarPedidos"/>
        </div> -->
        <!--VENTAS LISTA-->
        <!-- <div v-if="pedido.tipo_venta == 2">
            <p>Verificación venta lista</p>
            <LiquidacionCodigosVue
                :contratoLiquidacion="pedido.contrato_generado"
                :estado_verificacion="pedido.estado_verificacion"
                :insNombre="pedido.nombreInstitucion"
                :ciuNombre="pedido.nombre_ciudad"
                @ChangeRegresar="recargarPedidos"
            /> -->
        <!-- </div> -->
      </div>
    </vs-popup>
    <!--MODAL PARA CODIGOS A LIQUIDARSE-->
    <vs-popup fullscreen title="Codigos a liquidarse" :active.sync="popupCodigosLiquidarse">
      <LiquidacionCodigosVue
        v-if="popupCodigosLiquidarse"
        :contratoLiquidacion="pedido.contrato_generado"
        :estado_verificacion="pedido.estado_verificacion"
        :insNombre="pedido.nombreInstitucion"
        :ciuNombre="pedido.nombre_ciudad"
        @ChangeRegresar="recargarPedidos"
      />
    </vs-popup>
    <!--popup REPORTES PEDIDOS-->
    <vs-popup :title="'Reportes de pedidos del período '" fullscreen :active.sync="popupReportes">
      <PedidoScreenReportesVue v-if="popupReportes" :periodoSelect="periodoSelect"/>
    </vs-popup>
  </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
const exportContratoVue             = () => import('../temporadas/components/exportContrato.vue')
const exportPedidoVue               = () => import('../temporadas/components/exportContrato2.vue')
const exportConvenioVue             = () => import('../temporadas/components/exportConvenio.vue')
// const screenTransabilidaVue         = () => import('./transabilidad/screenTransabilida.vue')
const screenTransabilidaAlcanceVue  = () => import('@/views/pedidos/transabilidad/screenTransabilidaAlcance')
const exportPagareVue               = () => import('../temporadas/components/exportPagare.vue')
const generarContratoVue            = () => import('./components/milton/generarContrato.vue')
// const historicoCodigosNuevoVue      = () => import('../temporadas/historicoCodigosNuevo.vue')
// const VerificacionTrazabilidadVue   = () => import('../temporadas/VerificacionTrazabilidad.vue')
const pedidosDetalleVue             = () => import('../temporadas/components/pedidosDetalle.vue')
const LiquidacionVentaDirectaVue    = () => import('./asesor/contratos/LiquidacionVentaDirecta.vue')
const LiquidacionCodigosVue         = () => import('./asesor/contratos/LiquidacionCodigos.vue')
const PedidoScreenReportesVue       = () => import('../pedidos2/pedidos/reportes/PedidoScreenReportes.vue');
import moment from "moment";
import imageZoom from 'vue-image-zoomer';
export default{
  components:{
    vSelect,
    // screenTransabilidaVue,
    screenTransabilidaAlcanceVue,
    exportContratoVue,
    exportPedidoVue,
    exportConvenioVue,
    exportPagareVue,
    imageZoom,
    generarContratoVue,
    // historicoCodigosNuevoVue,
    // VerificacionTrazabilidadVue,
    flatPickr,
    pedidosDetalleVue,
    // ScreenPagosVue,
    LiquidacionVentaDirectaVue,
    LiquidacionCodigosVue,
    PedidoScreenReportesVue,
  },
  data(){
    return{
      usuario:[],
      // pedidos:[],
      tmpPedidos:[],
      arregloBeneficiarios:[],
      pedido:{},
      contrato:'',
      filtro:1,
      id_periodo:0,
      popupMostrarTransabilidad:false,
      popupMostrarTransabilidadAlcance:false,
      popupMostrarPedido:false,
      //variables modales files export
      mostrarReporte:false,
      popupCarga:false,
      mostrarReporteC:false,
      mostrarReporteConvenio:false,
      mostrarPagareAsesor:false,
      activePrompt:false,
      //variables modales filex export
      //files de beneficiarios
      id_beneficiario_pedido:'',
      beneficiario:'',
      tipo:'',
      //fin files de beneficiarios
      userFacturador:false,
      userAdminFacturador:false,
      userBodega:false,
      tipoFile:0,
      //variables historico
      popupRecibiCheque:false,
      popupEnviarCheque:false,
      popupRecibirPagare:false,
      mostrarDocumento:false,
      //fin variables historico
      popupGenerarContratoManual:false,
      activeMenu:true,
      //variables para verificaciones
      menu:1,
      //fin variables para verificaciones
      //variables para exportar
      fileName: null,
      popupExport: false,
      codigoSelected: [],
      reportesActivo: 0,
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
      tipoExportacion: 0,
      //fin variables para exportar excel
      //variables para filtrar fechas
      fechaSelect: null,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      flatpickrOptions: {
        locale: 'es',
        // Otras opciones de configuración...
      },
      //tipoFecha => 0 = fecha envio; 1 = fecha entrega
      tipoFecha:0,
      titleFecha:'Fecha envio',
      //fin variables para filtrar fechas
      //variables para anios anteriores
      arregloAniosAnteriores:[],
      aniosAnteriorSelect:'',
      anioEmpieza:'',
      //fin variables para anios anteriores
      //variables bodega//
      tipoBodega:2,
      popupEntregarPedido:false,
      //fin variables bodega
      menuTab:0,
      //variables para solicitar verificacion
      popupVerLiquidacion:false,
      popupCodigosLiquidarse:false,
      //fin variables para solicitar verificacion
      //Apis para empresas
      arrayEmpresas:[],
      empresaSelected: '',
      //fin Apis para empresas
      totalRealContratos:0,
      popupReportes:false,
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
    me.id_periodo = me.periodoSelect.idperiodoescolar
    me.nombre_periodo = me.periodoSelect.periodoescolar
  },
  mounted(){
    let me = this;
    me.generateHistorico()
    me.getAniosAnteriores()
    me.anioEmpieza = moment().format('YYYY')
    //user permisos
    if(me.usuario.id_group == 22)                               me.userFacturador       = true
    if(me.usuario.id_group == 23)                               me.userAdminFacturador  = true
    if(me.usuario.id_group  == 27) me.userBodega = true
    //fin user permisos
    //menu bodega
    if(me.userBodega){
      me.filtroBodega()
    }
    //menu
    else{
      let menuSelect = localStorage.menuSelect
      if(menuSelect){
        me.filtro = menuSelect
        setTimeout(function(){  me.filtroTipo() }, 1000);
      }else{
        setTimeout(function(){  me.filtroTipo() }, 1000);
      }
    }
  },
  props:{
    periodoSelect:{
      type:Object,
      default:{},
    },
    pedidos: {
      type: Array,
      default: []
    },
    userAsesor:{
      type:Boolean,
      default:false,
    },
    userRoot:{
      type:Boolean,
      default:false,
    },
    groupFacturador:{
      type:Boolean,
      default:false,
    },
  },
  watch:{
    periodoSelect(results){
      let me = this;
      me.id_periodo = me.periodoSelect.idperiodoescolar
      me.nombre_periodo = me.periodoSelect.periodoescolar
      me.getTotalVentaRealContratos()
    },
    pedidos(results) {
      let me = this;
      me.tmpPedidos = []
      if(me.userBodega){
        me.filtroBodega()
      }else{
        me.filtroTipo()
      }
    },
  },
  computed:{
    sumaTotal(){
      let me = this;
      let total = me.pedidos.length
      return total
    },
    SumaSinAnticipo(){
      let me = this;
      let datos       = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0 ) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 0));
      let resultado   = datos.length
      return resultado
    },
    SumaConAnticipoSinAprobar(){
      let me = this;
      let datos       = me.pedidos.filter( p => (p.estado == 1 || p.estado == 0 ) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1) &&  ( (p.ifagregado_anticipo_aprobado == 0) ) );
      let resultado   = datos.length
      return resultado
    },
    SumaConAnticipoAprobados(){
      let me = this;
      let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && p.ifagregado_anticipo_aprobado == 1 );
      let resultado   = datos.length
      return resultado
    },
    SumaAnulados(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 2 );
      let resultado   = datos.length
      return resultado
    },
    //CHEQUES
    SumaEntregaCheques(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.historicoEstado == 6 || p.historicoEstado == 7) );
      let resultado   = datos.length
      return resultado
    },
    SumaSolicitudesPagares(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.historicoEstado == 9));
      let resultado   = datos.length
      return resultado
    },
    SumaPagareFisicosEntregados(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.historicoEstado == 10 || p.historicoEstado == 11));
      let resultado   = datos.length
      return resultado
    },
    //FIN CHEQUES
    //GERENCIA
    SumaSolicitudAnticipos(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2));
      let resultado   = datos.length
      return resultado
    },
    SumaAnticiposGerenciaAprobados(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 3));
      let resultado   = datos.length
      return resultado
    },
    SumaAnticiposGerenciaAnulados(){
      let me = this
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 4));
      let resultado   = datos.length
      return resultado
    },
    //FIN GERENCIA
    SumaContratoSinAnticipo(){
      let me = this;
      let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado != null)) && p.ifanticipo == 0 );
      let resultado   = datos.length
      return resultado
    },
    SumaContratosConAnticipoAprobados(){
      let me = this;
      let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado != null)) && p.ifanticipo == 1 );
      let resultado   = datos.length
      return resultado
    },
    //===TOTAL PENDIENTES=========
    SumaTotalPendientes(){
      let me = this;
      let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1 || p.ifanticipo == 0) &&  ( (p.ifagregado_anticipo_aprobado == 0) ) );
      let resultado   = datos.length
      return resultado
    },
    //===FIN TOTAL PENDIENTES=====
    //===TOTAL GERENCIA=========
    SumaTotalGerencia(){
      let me = this;
      let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2 || p.ifagregado_anticipo_aprobado == 3 || p.ifagregado_anticipo_aprobado == 4));
      let resultado   = datos.length
      return resultado
    },
    //===FIN TOTAL GERENCIA=====
    //===TOTAL CONTRATOS========
    SumaTotalContratos(){
      let me = this;
      let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado != null)) && (p.ifanticipo == 1 || p.ifanticipo == 0 ) );
      let resultado   = datos.length
      return resultado
    },
    //===FIN TOTAL CONTRATOS====
    //===TOTAL CHEQUES==========
    SumaTotalCheques(){
      let me = this;
      let datos       = me.pedidos.filter( p => p.estado == 1 && ( p.historicoEstado == 6 || p.historicoEstado == 7 || p.historicoEstado == 9 || p.historicoEstado == 10 || p.historicoEstado == 11));
      let resultado   = datos.length
      return resultado
    },
    //===FIN TOTAL CHEQUES======
    //===ALCANCE================
    //ALCANCES PENDIENTES
    SumaAlcancePendientes(){
      let me = this;
      let datos       = me.pedidos.filter( p => p.estado == 1 && ( p.contadorAlcanceAbierto > 0));
      let resultado   = datos.length
      return resultado
    },
    //ALCANCE CERRADOS O APROBADOS
    SumaAlcanceCerrados(){
      let me = this;
      let datos       = me.pedidos.filter( p => p.estado == 1 && ( p.contadorAlcanceCerrado > 0));
      let resultado   = datos.length
      return resultado
    },
    //===FIN ALCANCE============
    //===TIPOS DE VENTA=========
    //venta directa
    SumaVentaDirecta(){
      let me = this;
      let datos       = me.pedidos.filter( p => p.tipo_venta == 1 && p.estado == 1  && (( p.contrato_generado != null)));
      let resultado   = datos.length
      return resultado
    },
    SumaVentaLista(){
      let me = this;
      let datos       = me.pedidos.filter( p => p.tipo_venta == 2 && p.estado == 1  && (( p.contrato_generado != null)));
      let resultado   = datos.length
      return resultado
    },
    //===FIN TIPOS DE VENTA=====
    //========================FILTROS PARA BODEGA============================
    SumarPedidosNoentregadosSinContrato() {
      let me = this;
      let datos = me.pedidos.filter(p => (p.estado_entrega == 0) && p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == ""));
      let resultado   = datos.length
      return resultado
    },
    SumarPedidosNoentregadosConContrato() {
      let me = this;
      let datos = me.pedidos.filter(p => (p.estado_entrega == 0) && p.estado == 1 && ((p.contrato_generado != null)));      let resultado   = datos.length
      return resultado
    },
    SumaPedidosEntregados() {
      let me = this;
      let datos = me.pedidos.filter(p => (p.estado_entrega == 2) && p.estado == 1);
      let resultado = datos.length
      return resultado
    },
    //========================FIN FILTROS PARA BODEGA========================
  },
  methods:{
    getAniosAnteriores(){
      let me = this;
      me.arregloAniosAnteriores = []
      // Obtener la fecha actual
      var fechaActual = new Date();
      // Obtener el año actual
      var añoActual = fechaActual.getFullYear();
      // Array para almacenar los últimos 5 años anteriores
      var ultimosCincoAñosAnteriores = [];
      // Array para almacenar los próximos 10 años
      var proximosCincoAños = [];
      // Calcular los últimos 5 años anteriores
      for (var i = 1; i <= 5; i++) {
        ultimosCincoAñosAnteriores.push(añoActual - i);
      }
      // Calcular los próximos 10 años
      for (var i = 0; i <= 10; i++) {
        proximosCincoAños.push(añoActual + i);
      }
      var todosLosAños          =  [...ultimosCincoAñosAnteriores,...proximosCincoAños]
      // Ordenar el array en orden ascendente
      todosLosAños.sort(function(a, b) {
        return a - b;
      });
      // Imprimir los próximos 5 años
      me.arregloAniosAnteriores =  todosLosAños
    },
    llenarPedidos(){
      let me = this;
      this.$http.get(this.$server_url+'llenarInformacionContrato')
      .then(res => {
        console.log(res.data)
        me.$vs.notify({
        text:'Se guardo correctamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    },
    changeContratoManual(e){
      let me = this
      me.popupGenerarContratoManual = false;
      me.$emit('changeRecarge',true)
      // me.getPedidos()
    },
    generateHistorico(){
      let me = this;
      this.$http.get(this.$server_url+'pedidosConAnticipo')
      .then(res => {
      })
    },
    filtroTipo(){
      let me = this;
      me.estadoMenu()
      me.tmpPedidos = []
      me.tmparregloFiltroFecha = []
      me.fechaSelect  = ""
      //para ver todos
      if(me.filtro == 100){
        let total = me.pedidos
        me.tmpPedidos = total
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los pedidos sin anticipo
      if(me.filtro == 1){
        let datos       = me.pedidos.filter( p => (p.estado == 1 || p.estado == 0) && ((p.contrato_generado == null || p.contrato_generado == "")) && ( p.ifanticipo == 0 ));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los pedidos con anticipo(sin aprobar)
      if(me.filtro == 2){
        let datos       = me.pedidos.filter( p => (p.estado == 1 || p.estado == 0) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1) &&  ( (p.ifagregado_anticipo_aprobado == 0) ) );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //======Todos pendientes==========
      if(me.filtro == 13){
        let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1 || p.ifanticipo == 0) &&  ( (p.ifagregado_anticipo_aprobado == 0) ) );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //======Fin todos pendientes======
      //para ver los pedidos con anticipo(aprobados)
      if(me.filtro == 3){
        let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && p.ifagregado_anticipo_aprobado == 1 );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los solicitudes de anticipos a gerencia
      if(me.filtro == 4){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los anticipos solicitados al gerente aprobados
      if(me.filtro == 5){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 3));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los anticipos solicitados al gerente anulados
      if(me.filtro == 6){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 4));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los contratos con anticipos
      if(me.filtro == 7){
        let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado != null)) && p.ifanticipo == 1 );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los contratos sin anticipos
      if(me.filtro == 8){
        let datos       = me.pedidos.filter(p => (p.estado == 1) && (( p.contrato_generado != null)) && (p.ifanticipo == 0 || p.ifanticipo == null) );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver las entregas para el asesor(cheques generados)
      if(me.filtro == 9){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.historicoEstado == 6 || p.historicoEstado == 7) );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver las posibles entregas de pagares
      if(me.filtro == 10){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.historicoEstado == 9));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //para ver los pagares entregados fisicos
      if(me.filtro == 11){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.historicoEstado == 10 || p.historicoEstado == 11));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //===TOTAL GERENCIA======
      if(me.filtro == 14){
        let datos       = me.pedidos.filter( p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2 || p.ifagregado_anticipo_aprobado == 3 || p.ifagregado_anticipo_aprobado == 4));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //===TOTAL CONTRATOS=====
      if(me.filtro == 15){
        let datos       = me.pedidos.filter( p => (p.estado == 1) && ((p.contrato_generado != null)) );
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //==FIN TOTAL CONTRATOS===
      //===TOTAL CHEQUES========
      if(me.filtro == 16){
        let datos       = me.pedidos.filter( p => p.estado == 1 && ( p.historicoEstado == 6 || p.historicoEstado == 7 || p.historicoEstado == 9 || p.historicoEstado == 10 || p.historicoEstado == 11));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //===ALCANCE=============
      //Alcance pendientes
      if(me.filtro == 17){
        let datos       = me.pedidos.filter( p => p.estado == 1 && ( p.contadorAlcanceAbierto > 0));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //Alcance cerrado
      if(me.filtro == 18){
        let datos       = me.pedidos.filter( p => p.estado == 1 && ( p.contadorAlcanceCerrado > 0));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //===FIN ALCACANCE=======
      //para ver los pedidos anulados
      if(me.filtro == 19){
        let datos       = me.pedidos.filter( p => p.estado == 2);
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //TIPO VENTA=============
      //Venta directa
      if(me.filtro == 20){
        let datos       = me.pedidos.filter( p => p.tipo_venta == 1 && p.estado == 1  && (( p.contrato_generado != null)));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
        //Venta Lista
        if(me.filtro == 21){
        let datos       = me.pedidos.filter( p => p.tipo_venta == 2 && p.estado == 1  && (( p.contrato_generado != null)));
        me.tmpPedidos   = datos
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
      //==FIN TOTAL CHEQUES
      else{
        let total = me.pedidos
        me.tmpPedidos = total
        me.tmparregloFiltroFecha = me.tmpPedidos
        return
      }
    },
    filtroBodega(){
      let me = this;
      me.tmpPedidos = []
      //para ver los pedidos pendientes
      if (me.tipoBodega == 0) {
        //bodega mostrar los pedidos pendientes de bodega
        let datos = me.pedidos
        me.tmpPedidos = datos
        return
      }
      //para ver los pedidos sin contratos
      if (me.tipoBodega == 1) {
        let datos = me.pedidos.filter(p => (p.estado_entrega == 0) && p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == ""));
        me.tmpPedidos = datos
        return
      }
       //para ver los pedidos con contratos  sin entrega
       if (me.tipoBodega == 2) {
        let datos = me.pedidos.filter(p => (p.estado_entrega == 0) && p.estado == 1 && ((p.contrato_generado != null)));
        me.tmpPedidos = datos
        return
      }
      //para ver los pedidos entregados por bodega
      if (me.tipoBodega == 3) {
        let datos = me.pedidos.filter(p => (p.estado_entrega == 2) && p.estado == 1);
        me.tmpPedidos = datos
        return
      }
    },
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelect',me.filtro)
      var divs = document.querySelectorAll(".submenutitle");
      for (var i = 0; i < divs.length; i++) {
        divs[i].classList.remove("active");
      }
      const container = document.querySelector(".menu"+me.filtro);
      container.classList.add("active");
    },
    ver_pedido(item){
      let me = this
      this.$store.dispatch('setPedido',item)
      localStorage.setItem("id_periodo_selected", this.id_periodo)
      localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
      localStorage.setItem("contrato_generado", item.contrato_generado)
      localStorage.setItem("pedido_desde_admin", 'activo')
      me.$emit('showPedido',1)
      // this.$router.push('/pedidos/administrador/'+item.id_pedido)
    },
    SolicitarVerificacion(tr){
      let me = this;
      if(tr.id_pedido == null || tr.id_pedido == ""){
        me.$vs.notify({
        text:'Su contrato no tiene pedido en plataforma',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.popupVerLiquidacion = true;
    },
    anular_pedido(item){
      let me = this
      me.id_pedido = item.id_pedido
      me.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirmar`,
        text: '¿Está seguro en eliminar este pedido?',
        acceptText: 'Aceptar',
        cancelText: 'Cancelar',
        accept: me.confirm_anular_pedido
      })
    },
    confirm_anular_pedido(item){
      let me = this
      me.$vs.loading();
      this.$http.get(this.$server_url+'anular_pedido_asesor/'+me.id_pedido+'/'+me.usuario.idusuario+'/'+me.pedido.contrato_generado)
      .then(res => {
        me.$vs.loading.close();
        if(res.data.status == 0){
          me.$vs.notify({
            text: res.data.message,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        me.$vs.notify({
          text: 'Se anulo correctamente',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.$emit('changeRecarge',true)
        // me.getPedidos()
      })
      .catch(function (error) {
        me.$vs.notify({
          text: 'No se pudo guardar',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.$vs.loading.close();
      })
    },
    changeEstadoHistorico(estado){
      let me = this
      let formData = new FormData();
      formData.append('id_pedido',  me.pedido.id_pedido);
      formData.append('estado',     estado);
      if(estado == 7 ) formData.append('campo','fecha_facturador_recibe_cheque')
      if(estado == 8 ) formData.append('campo','fecha_envio_cheque_for_asesor')
      if(estado == 10 ) formData.append('campo','fecha_que_recibe_orden_firmada')
      me.$vs.loading();
      this.$http.post(this.$server_url+'cambiarEstadoHistorico', formData)
      .then(function (res) {
        me.$vs.loading.close();
        me.$emit('changeRecarge',true)
        // me.getPedidos()
        me.pedido = {}
        me.popupEnviarCheque = false
        me.popupRecibirPagare = false
        me.popupRecibiCheque  = false
        me.$vs.notify({
          text: 'Se registro correctamente',
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      })
      .catch(function (error) {  me.$vs.loading.close(); })
    },
    //====METODOS PARA EMITIR LOS ARHIVOS
    changeHandle(e){
      let me = this;
      me.mostrarReporte         = false
      me.popupCarga             = false
      me.mostrarReporteC        = false
      me.mostrarReporteConvenio = false
      me.mostrarPagareAsesor    = false
    },
    acceptAlert(){
      let me = this
      if(me.beneficiario == "" || me.beneficiario == null || me.beneficiario == undefined){
        me.$vs.notify({
        text:'Seleccione un beneficiario por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        me.activePrompt = true
        return
      }
      //si es export pagare obligo a pedir un año
      if(me.tipo == 4 || me.tipo == 3){
        if(me.aniosAnteriorSelect == null || me.aniosAnteriorSelect == "" || me.aniosAnteriorSelect == undefined){
          me.$vs.notify({
          text:'Seleccione un año final a calcular por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        //EMPRESA
        if(me.empresaSelected == "" || me.empresaSelected == null || me.empresaSelected == undefined){
          me.$vs.notify({
          text:'Seleccione una empresa por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          me.activePrompt = true
          return
        }
      }
      //si es convenio obligatorio seleccionar el año que empieza el convenio
      if(me.tipo == 3){
        if(me.anioEmpieza == null || me.anioEmpieza == "" || me.anioEmpieza == undefined){
          me.$vs.notify({
          text:'Seleccione el año que comienza el convenio por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
      }
      me.id_beneficiario_pedido = me.beneficiario.id_beneficiario_pedido
      me.popupCarga                              = true
      if(me.tipo == 1) me.mostrarReporte         = true
      if(me.tipo == 2) me.mostrarReporteC        = true
      if(me.tipo == 3) me.mostrarReporteConvenio = true
      if(me.tipo == 4) me.mostrarPagareAsesor    = true
    },
    chooseBeneficiarioPedido(tr,tipo){
      let me            = this;
      me.getBeneficiarios(tr.id_pedido)
      me.getEmpresas()
      me.tipo           = tipo
      me.contrato       = tr.contrato_generado
      me.activePrompt   = true
    },
    generarReportePdfContrato(tr,tipo){
      let me = this;
      if(tr.contrato_generado == "null" || tr.contrato_generado == null || tr.contrato_generado == "" || tr.contrato_generado == undefined){
        me.$vs.notify({
          text: "No se puede visualizar el reporte del contrato porque no tiene código de contrato",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time:7000
        })
        return
      }
      me.getBeneficiarios(tr.id_pedido)
      me.tipo             = tipo
      me.activePrompt     = true
      me.contrato         = tr.contrato_generado
    },
    getBeneficiarios(pedido){
      let me = this
      me.arregloBeneficiarios = []
      me.beneficiario         = ''
      this.$http.get(this.$server_url+'get_beneficiarios_pedidos/'+pedido)
      .then(res => {
        me.arregloBeneficiarios = res.data
      })
    },
    getEmpresas(){
      let me = this
      me.arrayEmpresas   = []
      me.empresaSelected = ''
      this.$http.get(this.$server_url+'empresa/')
      .then(res => {
        me.arrayEmpresas = res.data
      })
    },
    close(){
      this.$vs.notify({
        color:'danger',
        title:'Mensaje',
        text:'Has cancelado la generación del reporte!'
      })
    },
    //====FIN METODOS PARA EMITIR ARCHIVOS
    //metodos para alcance
    verAlcance(tr){
      let me = this;
      this.$store.dispatch('setPedido',tr)
      me.$emit('showPedido',2)
    },
    //====METODOS PARA VERIFICACIONES========
    VerVerificaciones(tr){
      let me = this
      if(tr.id_pedido == null || tr.id_pedido == ""){
        me.$vs.notify({
        text:'Su contrato no tiene pedido en plataforma',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.menu = 2
    },
    openConfirmLiquidar(){
      let me = this
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirmar`,
        acceptText:'Si, deseo realizar la liquidación',
        text: `Estás seguro de liquidar el contrato ${ me.pedido.contrato_generado }?`,
        accept:this.LiquidarContrato
      })
    },
    LiquidarContrato(){
      let me  =this;
      me.$vs.loading()
      this.$http.get(this.$server_url+'nliquidacion/liquidar/'+me.pedido.contrato_generado)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == '0'){
            me.$vs.notify({
            text:res.data.message,
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'})
            return
          }else{
            me.$emit('changeRecarge',true)
            me.$vs.notify({
            text:'Se realizo la liquidación correctamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
    },
    /**
     * Calcula el total de la venta real de contratos.
     *
     * @returns {void}
     */
    getTotalVentaRealContratos() {
      let me = this;
      if(me.usuario.id_group == 11){
        me.totalRealContratos = 0
        me.$http.get(this.$server_url+`pedigo_Pagos?getVentaRealXAsesor=1&idAsesor=${me.usuario.idusuario}&idPeriodo=${me.id_periodo}`)
        .then(function (res) {
          let datos = res.data
          if(datos.length>0){
            datos.forEach(element => {
              me.totalRealContratos += element.TotalVentaReal
            });
          }
        })
      }
    },
    //====FIN METODOS PARA VERIFICACIONES====
    //====METODOS PARA EXCEL=====
    //para limipiar los campos del excel
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    //metodo par descargar el excel
    exportToExcel() {
      let me = this
      let predatos = []
      predatos    = me.codigoSelected
      //aumentar una propiedad llamada comisionAsesor en el array de predatos con un map
      predatos.map(function(item){
        let TotalVentaReal = 0
        let valorDescuento = 0
        let ven_neta       = 0
        let waitTotalVentaReal = 0
        //venta real
        waitTotalVentaReal  = item.TotalVentaReal
        console.log("uno",waitTotalVentaReal)
        console.log("dos",waitTotalVentaReal.toFixed(2))
        if(item.TotalVentaReal == null || item.TotalVentaReal == ""){ item.TotalVentaReal = 0 ;  }
        else                                            { TotalVentaReal = item.TotalVentaReal.toFixed(2); }
        //valorDescuento
        if(item.valorDescuento == null || item.valorDescuento == ""){ item.valorDescuento = 0 ;  }
        else                                            { valorDescuento = item.valorDescuento.toFixed(2); }
        //ven_neta
        if(item.ven_neta == null || item.ven_neta == ""){ item.ven_neta = 0 ;  }
        else                                            { ven_neta = item.ven_neta.toFixed(2); }
        let prevalores   = 0
        //venta neta
        if(item.ven_neta == null || item.ven_neta == ""){ item.venta = 0 ;  }
        else                                            { prevalores = (item.ven_neta * 0.02).toFixed(2); }
        item.comisionAsesor = prevalores
        item.TotalVentaReal = TotalVentaReal
        item.valorDescuento = valorDescuento
        item.ven_neta       = ven_neta
      })
      //array final
      console.log("uwu",predatos)
      let headerTitle = []; let headerVal = [];
      //para exportar los pedidos
      if(me.tipoExportacion == 0){
        headerTitle = [
          'Contrato',
          'Tipo de venta' ,
          'Asesor',
          'Cédula asesor',
          'Institución',
          'Ciudad',
          'Fecha envio',
          'Fecha entrega',
          'Total unidades',
          'Venta bruta',
          'Venta Real',
          'Comisión',
          'Anticipo aprobado',
          'Estado'
        ];
        headerVal = [
          'contrato_generado',
          'tipo_venta_descr',
          'responsable',
          'cedula',
          'nombreInstitucion',
          'nombre_ciudad',
          'fecha_envio',
          'fecha_entrega',
          'total_unidades',
          'total_venta',
          'TotalVentaReal',
          'descuento',
          'anticipo_aprobado',
          'estadoPedido'
        ];
      }
      //para exportar el reporte de venta
      if(me.tipoExportacion == 1){
        headerTitle = [
          'CONTRATO',
          'ASESOR',
          'TIPO DE VENTA' ,
          'ESTADO' ,
          'CATEGORIA',
          'ESTABLECIMIENTO',
          'DEUDA ANTERIOR',
          'DEUDA PRÓXIMA',
          'VENTAS BRUTAS',
          'COMISIÓN',
          'VALOR DE ESCUELA',
          'VENTAS NETAS',
          'COMISION ASESOR 2%',
          'CIUDAD',
          'PERÍODO'
        ];
        headerVal = [
          'contrato_generado',
          'responsable',
          'tipo_venta_descr',
          '',
          'tipo_descripcion',
          'nombreInstitucion',
          'deuda',
          'totalDeudaProxima',
          'TotalVentaReal',
          'descuento',
          'valorDescuento',
          'ven_neta',
          'comisionAsesor',
          'nombre_ciudad',
          'periodo'
        ];
      }
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
    //==FIN METODOS PARA EXPORTAR EXCEL=====
    tryExport(){
      let me = this
      if(me.codigoSelected.length == 0){
        me.$vs.notify({
        text:'Debe seleccionar filas de la tabla para exportar por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.popupExport=true
    },
    //==METODOS PARA FILTRO FECHAS===
    filtrarFechas(){
      let me = this;
      me.tmpPedidos = []
      if(me.fechaSelect == null || me.fechaSelect == "" || me.fechaSelect == undefined){
        me.tmpPedidos = me.tmparregloFiltroFecha
        return
      }
      //fecha envio
      if(me.tipoFecha == 0){
        me.tmpPedidos = me.tmparregloFiltroFecha.filter(p => p.f_fecha_envio == me.fechaSelect)
        return
      }
      //fecha entrega
      if(me.tipoFecha == 1){
        me.tmpPedidos = me.tmparregloFiltroFecha.filter(p => p.f_fecha_entrega == me.fechaSelect)
        return
      }
    },
    //===METODOS NOTIFICAR REVISION==
    notificarPedido(notificados){
      let me = this;
      let formData = new FormData();
      formData.append('changeRevisonNotificacion','yes')
      formData.append('id_pedido',                me.pedido.id_pedido);
      formData.append('notificados',              notificados);
      me.$vs.loading()
      this.$http.post(this.$server_url+'actualizarPedido', formData)
      .then(function (res) {
        me.$vs.loading.close()
        me.$vs.notify({
          text: res.data.message,
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.recargarPedidos()
      })
      .catch(function (error) {  me.$vs.loading.close() })
    },
    //==FIN METODOS NOTIFICAR REVISION===
    recargarPedidos(){
      let me = this;
      me.$emit('changeRecarge',true)
      me.popupVerLiquidacion = false
      me.popupEntregarPedido = false
    },
    ///====METODOS ASESOR====
    //METODOS PARA GENERAR UN NUEVO PEDIDO A PARTIR DE UN PEDIDO ANULADO
    ConfirmgenerarNuevoPedido(tr){
    let me = this;
    this.$vs.dialog({
      type:'confirm',
      color: 'danger',
      title: `Confirmar`,
      acceptText:'Aceptar',
      cancelText:'Cancelar',
      text: 'Estas seguro de generar un nuevo pedido con los mismos datos',
      accept:this.generarNuevoPedido
    })
  },
  generarNuevoPedido(){
    let me = this;
    let formData = new FormData();
    formData.append('id_pedido',            0);
    formData.append('pedidoAnterior',       me.pedido.id_pedido);
    formData.append('tipo_venta',           me.pedido.tipo_venta);
    formData.append('tipo_venta_descr',     me.pedido.tipo_venta_descr);
    formData.append('fecha_envio',          me.pedido.fecha_envio);
    formData.append('fecha_entrega',        me.pedido.fecha_entrega);
    formData.append('institucion',          me.pedido.id_institucion);
    formData.append('periodo',              me.pedido.id_periodo);
    formData.append('descuento',            me.pedido.descuento);
    formData.append('anticipo',             me.pedido.anticipo);
    formData.append('id_asesor',            me.pedido.id_asesor);
    formData.append('observacion',          me.pedido.observacion);
    if(me.pedido.imagen == 'undefined'){
      formData.append('imagen',             "");
    }else{
      formData.append('imagen',               me.pedido.imagen);
    }
    formData.append('ifanticipo',           me.pedido.ifanticipo);
    formData.append('convenio_anios',       me.pedido.convenio_anios)
    formData.append('anticipo_aprobado',    0)
    formData.append('ifagregado_anticipo_aprobado', 0)
    formData.append('id_responsable',       me.pedido.id_responsable)
    formData.append('generarNuevo',         'yes')
    me.$vs.loading()
    this.$http.post(this.$server_url+'pedidos',formData)
    .then(res => {
    me.$vs.loading.close()
    if(res.data.status == 0){
      me.$vs.notify({
      text:res.data.message,
      color:'danger',
      iconPack: 'feather',
      icon:'icon-check'})
      return
    }
    me.$vs.notify({
      text:'Se genero un nuevo pedido correctamente',
      color:'success',
      iconPack: 'feather',
      icon:'icon-check'})
    })
    me.recargarPedidos()
  },
  filtrarDecimal2(numero){
    let me = this
    //o o null o si no es numero
    if(numero == 0 || numero == null || isNaN(numero)){
        return numero
    }else{
      var numeroRedondeado = numero;
      // Reemplazar el punto decimal con una coma
      var numeroConComa = numeroRedondeado.replace('.', ',');
      return numeroConComa;
    }
  },
  }
}
</script>
<style lang="scss" scoped>
.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    > button {
      margin-left: 10px;
    }
  }
}
.active{
  font-weight: bold;
  color:#269CE3;
  background-color: #F0F5F9;
  padding:2px 0px;
  border-radius: 5px;
}
.menutitle{
  font-weight: bold;
  font-size: 17px;
}
.submenu{
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}
.submenutitle{
  padding: 5px 0px;
  margin-top: 8px;
  cursor: pointer;
  transition: 0.2s ease-in all;
  font-size: 12px;
}
.submenutitle:hover{
  text-decoration: underline;
  color:#41A7E5;
}
.fade-in {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.2s;
}
@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

</style>
