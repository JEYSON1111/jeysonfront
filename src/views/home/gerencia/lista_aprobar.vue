<template>
    <div>
      <vx-card class="mt-4 mb-4" v-for="(item,index) in listaPendientes" :key="index">
          <div class="vx-row mr-1">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <div>
                <!--TIPOS-->
                <div v-if="item.convenio_anios > 0">
                  <vs-chip color="success">Convenio: {{ item.convenio_anios }} años</vs-chip>
                </div>
                <vs-chip v-if="item.tipo_pago == 0 || item.tipo_pago == null" color="warning">
                  Anticipo
                </vs-chip>
                <vs-chip v-if="item.tipo_pago == 1" color="primary">
                  Liquidación
                </vs-chip>
                <br><br>
                <p v-if="usuario.cedula == 'sgerencia'">#{{ item.pedido_id }}</p>
                <!--CONVENIO-->
                <div v-if="item.valor_sugerido">
                  <div>
                    <span>Asesor solicita más anticipo para el convenio</span>
                    <h2 class="mt-1"><small> $</small> {{ item.valor_sugerido }} </h2>
                  </div>
                  <!--SOLICITADO POR EL FACTURADOR EL ANTICIPO PARA QUE APRUEBE-->
                  <div class="flex">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled" @click="ifconvenio=1;objectSelect = item;cantidadAprobar= item.valor_sugerido;pedido = item;popupSolicitud = true;">Aprobar</vs-button>
                    <!-- <vs-button color="danger" type="border" class="p-2" @click="confirma_aprueba(item,op=1)">Rechazar</vs-button> -->
                  </div>
                </div>
                <!--ANTICIPO-->
                <div v-if="item.ifagregado_anticipo_aprobado == 2">
                  <div>
                    <span>Asesor solicita más anticipo</span>
                    <h2 class="mt-1"><small> $</small> {{ item.anticipo_solicitud_for_gerencia }} </h2>
                  </div>
                  <!--SOLICITADO POR EL FACTURADOR EL ANTICIPO PARA QUE APRUEBE-->
                  <div class="flex">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled" @click="ifconvenio=0;cantidadAprobar= item.anticipo_solicitud_for_gerencia;pedido = item;popupSolicitud = true;">Aprobar</vs-button>
                    <vs-button color="danger" type="border" class="p-2" @click="confirma_aprueba(item,op=1)">Rechazar</vs-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <!--INFORMACION-->
              <b>Asesor:</b>
              <p> {{ item.nombres }} {{ item.apellidos }} </p>
              <b class="mt-1">Institución</b>
              <p>{{ item.nombreInstitucion }}</p>
              <b>Ciudad</b>
              <p>{{ item.nombre_ciudad }}</p>
              <b>Período</b>
              <p>{{ item.periodo }}</p>
              <b>Fecha solicitud</b>
              <p> {{ item.fechaCreacionPedido }}</p>
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <!--DETALLE PEDIDO-->
              <vs-divider>Detalle pedido</vs-divider>
              <vs-button color="success" @click="pedido = item;popupMostraValoresAnteriores = true;" style="margin-left: -5px;" type="flat">Ver venta anteriores</vs-button>
              <ul class="features">
                <li>
                  <span class="icon">
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </span>
                  <span><strong>Comisión:</strong> {{ item.descuento }}%</span>
                </li>
                <li>
                  <span class="icon">
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </span>
                  <span><strong>Venta series básicas:</strong> ${{ filtrarDecimal(item.total_series_basicas) }}</span>
                </li>
                <li>
                  <span class="icon">
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </span>
                  <span><strong>Venta bruta:</strong> ${{ filtrarDecimal(item.total_venta) }}</span>
                </li>
              </ul>
              <!--OBSERVACION ASESOR-->
              <div v-if="item.observacion">
                  <vs-divider>Observación asesor</vs-divider>
                  <div class="">
                      {{ item.observacion }}
                  </div>
              </div>
            </div>
          </div>


          <!--MODAL PARA VER LOS COMENTARIOS DE LA SOLICITUD-->
          <vs-popup class="holamundo" title="Solicitud de más anticipo" :active.sync="popupSolicitud">
              <p><b>Anticipo Solicitado:</b> {{  pedido.anticipo_solicitud_for_gerencia }}</p>
              <p><b>Observación:</b> {{  pedido.anticipo_solicitud_observacion }}</p>
              <vs-divider></vs-divider>
              <div>
                  <vx-input-group class="mb-base">
                  <template slot="prepend">
                  <div class="prepend-text bg-primary">
                      <span>Aprobar valor de:</span>
                  </div>
                  </template>
                  <vs-input v-model="cantidadAprobar" type="number" placeholder="Ingrese el valor a aprobar" />
              </vx-input-group>
              </div>
              <div class="flex justify-center">
                  <vs-button color="success" v-if="ifconvenio==0" @click="f_aprobar_pago(datoAprobar=pedido,datoAprobar.op=0)" type="gradient">Aprobar anticipo</vs-button>
                  <vs-button color="success" v-if="ifconvenio=='1'" @click="updateConvenio(3,'anticipo_global',cantidadAprobar,'convenio_aprobado',3,'valor_aprobado_gerencia',cantidadAprobar)" type="gradient">Aprobar Convenio</vs-button>
                </div>
          </vs-popup>
          <!--MODAL VALORES ANTERIORES-->
          <vs-popup class="holamundo" title="Valores anteriores" :active.sync="popupMostraValoresAnteriores">
            <anticiposAnteriosVue v-if="popupMostraValoresAnteriores" :tmpPedidos="pedido"/>
          </vs-popup>
      </vx-card>
    </div>
    </template>

    <script>
    // import valoresAntererioresVue from './pedidos/components/valoresAntereriores.vue';
    const anticiposAnteriosVue = () => import('../../pedidos/components/milton/anticiposAnterios.vue')
    // import anticiposAnterios from '../../pedidos/components/milton/anticiposAnterios.vue';
    export default {
        components:{
          anticiposAnteriosVue,
        },
        data() {
            return {
                usuario:[],
                listaPendientes: [],
                pedido:{},
                datoAprobar: '',
                op: '',
                popupSolicitud:false,
                popupMostraValoresAnteriores:false,
                cantidadAprobar:0,
                ifconvenio:0,
                objectSelect:'',
            }
        },
        mounted() {
            let me = this;
            me.getPedidosGerencia();
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
        },
        methods: {
          filtrarDecimal(numero){
            let me = this
            if(numero == 0 || numero == null){
                return numero
            }else{
                const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }
          },
          getPedidosGerencia() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'listaPedidosGerencia')
              .then((res) => {
                me.$vs.loading.close();
                if(res.data.status == 0){
                  me.$vs.notify({
                  text:res.data.message,
                  color:'danger',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  return
                }
                me.listaPendientes = res.data

              }).catch((err) => {
                console.log(err)
                me.$vs.loading.close();
              });
          },
            confirma_aprueba(item, tipo) {
                let me = this;
                me.datoAprobar = item;
                me.datoAprobar.op = tipo
                me.$vs.dialog({
                    type: 'confirm',
                    color: tipo == 0 ? 'success' : 'danger',
                    title: 'Confirmar',
                    text: tipo == 0 ? '¿Aprobar pago?' : 'Rechazar pago?',
                    acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    accept: me.f_aprobar_pago
                })
            },
            updateConvenio(cantidad,campo1,valor1,campo2,valor2,campo3,valor3){
              let me = this;
              let formData = new FormData();
              formData.append('updateCamposDatos',    'yes')
              if(cantidad == 1)                       { formData.append('unCampo', 'yes') }
              if(cantidad == 2)                       { formData.append('dosCampos', 'yes') }
              if(cantidad == 3)                       { formData.append('tresCampos', 'yes') }
              formData.append('id',                   me.objectSelect.idConvenio);
              formData.append('campo1',               campo1);
              formData.append('campo2',               campo2);
              formData.append('campo3',               campo3);
              formData.append('valor1',               valor1)
              formData.append('valor2',               valor2)
              formData.append('valor3',               valor3)
              formData.append('user_created',         me.usuario.idusuario)
              formData.append('idConvenio',           me.objectSelect.idConvenio)
              this.$http.post(this.$server_url+'convenio', formData)
              .then(res => {
                  me.$vs.notify({
                  text:'Se guardo correctamente',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  me.getPedidosGerencia();
                  me.popupSolicitud = false
              })
              .catch((e)=>{
                // me.$vs.loading.close()
              })
            },
            f_aprobar_pago() {
                let me = this;
                let msj, color;
                me.datoAprobar.cantidadAprobar    = me.cantidadAprobar
                me.datoAprobar.user_created       = me.usuario.idusuario
                me.datoAprobar.id_group           = me.usuario.id_group
                me.datoAprobar.anticipo_aprobado  = me.cantidadAprobar
                me.datoAprobar.id_pedido          = me.pedido.pedido_id
                me.$vs.loading();
                this.$http.post(this.$server_url + 'aprobarPedidoGerencia', me.datoAprobar)
                    .then((result) => {
                        msj = me.datoAprobar.op == 0 ? 'Pago aprobado correctamente.' : 'Pago rechazado';
                        color = me.datoAprobar.op == 0 ? 'success' : 'danger';
                        me.f_notificaciones(msj, color, 'icon-alert-triangle')
                        me.getPedidosGerencia();
                        me.popupSolicitud = false
                        me.$vs.loading.close();
                    }).catch((err) => {
                        console.log(err)
                        me.$vs.loading.close();
                    });
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
            }

        },
    }
    </script>
    <style scoped>
      .features {
        display: flex;
        flex-direction: column;
      }
      .features li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .features li + * {
        margin-top: 0.75rem;
      }
      .features .icon {
        background-color: #1FCAC5;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
      }
      .features .icon svg {
        width: 14px;
        height: 14px;
      }
      .features + * {
        margin-top: 1.25rem;
      }

    </style>
