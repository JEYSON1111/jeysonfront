<template>
  <vx-card
  >
    <p v-if="pedido.contrato_generado" class="font-semibold" style="opacity: 0.4;">{{ pedido.contrato_generado }}</p>
    <div  class="flex" style="flex-wrap: wrap;margin-top: -10px;" >
      <!--TOTAL VENTA BRUTA-->
      <!-- <div class="p-6 pb-0" v-if="totalRealContratos > 0">
        <div class="flex justify-center">
            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
              <feather-icon icon="ShoppingBagIcon"  svgClasses="h-8 w-7" class="ml-1" />
            </span>
        </div>
        <div class="flex justify-center">
            <h2 class="mb-1 font-bold" style="opacity:0.7;color:#1E9080;">${{ totalRealContratos | filtrarDecimal }}</h2>
        </div>
        <div class="ml-4"><span class="">Total Venta Real Contratos</span></div>
      </div> -->
      <template>
        <!--VENTA BRUTA PEDIDO-->
        <!-- <div class="p-6 pb-0" v-if="arregloAlcance.length > 0">
          <div class="flex justify-center">
              <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                  <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M732.1 399.3C534.6 356 696.5 82.1 425.9 104.8s-527.2 645.8-46.8 791.7 728-415 353-497.2z" fill="#464BD8" /><path d="M539.5 838.8c-1.4 0-2.9-0.3-4.2-1L330.1 730.3a8.95 8.95 0 0 1-3.8-12.1L529 331.1a8.92 8.92 0 0 1 8-4.8c1.4 0 2.9 0.3 4.2 1l205.2 107.5c4.4 2.3 6.1 7.7 3.8 12.1L547.4 834a8.92 8.92 0 0 1-7.9 4.8z" fill="#514DDF" /><path d="M537 335.3l205.2 107.5-202.7 387-205.2-107.4L537 335.3m0-17.9c-1.8 0-3.6 0.3-5.3 0.8-4.5 1.4-8.3 4.6-10.5 8.8L318.4 714.1a17.9 17.9 0 0 0 7.6 24.2l205.2 107.5c2.6 1.4 5.4 2 8.3 2 1.8 0 3.6-0.3 5.3-0.8 4.5-1.4 8.3-4.6 10.5-8.8L758.1 451a17.88 17.88 0 0 0-7.6-24.1L545.3 319.4c-2.5-1.3-5.4-2-8.3-2z" fill="#151B28" /><path d="M538.4 835.5c-1 0-2-0.2-2.9-0.5l-254-87a8.98 8.98 0 0 1-5.6-11.4L440 257.4c1.3-3.7 4.7-6.1 8.5-6.1 1 0 1.9 0.2 2.9 0.5l254 87c2.2 0.8 4.1 2.4 5.1 4.5s1.2 4.6 0.4 6.8l-164 479.3c-0.8 2.2-2.4 4.1-4.5 5.1-1.3 0.7-2.6 1-4 1z" fill="#FFFFFF" /><path d="M448.6 260.4l254 87-164.2 479.1-254-87 164.2-479.1m0-17.9c-2.7 0-5.4 0.6-7.9 1.8a18.1 18.1 0 0 0-9.1 10.3L267.5 733.7c-3.2 9.4 1.8 19.5 11.1 22.7l254 87c1.9 0.6 3.8 1 5.8 1 2.7 0 5.4-0.6 7.9-1.8 4.3-2.1 7.5-5.8 9.1-10.3l164.1-479.2c3.2-9.4-1.8-19.5-11.1-22.7l-254-87c-1.9-0.6-3.9-0.9-5.8-0.9z" fill="#151B28" /><path d="M448.6 323c-6.9 0-13.7-1.1-20.3-3.4-2.2-0.8-4.1-2.4-5.1-4.5s-1.2-4.6-0.4-6.8l17.4-50.8c1.3-3.7 4.7-6.1 8.5-6.1 1 0 1.9 0.2 2.9 0.5l50.8 17.4c2.2 0.8 4.1 2.4 5.1 4.5s1.2 4.6 0.4 6.8a62.83 62.83 0 0 1-59.3 42.4z" fill="#FFFFFF" /><path d="M448.6 260.4l50.8 17.4a53.82 53.82 0 0 1-50.8 36.3c-5.8 0-11.6-0.9-17.4-2.9l17.4-50.8m0-17.9c-7.4 0-14.4 4.7-16.9 12.1l-17.4 50.8c-1.5 4.5-1.2 9.4 0.9 13.7 2.1 4.3 5.8 7.5 10.3 9.1 7.5 2.6 15.3 3.9 23.2 3.9a71.6 71.6 0 0 0 67.7-48.4c1.5-4.5 1.2-9.4-0.9-13.7a18.1 18.1 0 0 0-10.3-9.1l-50.8-17.4c-2-0.7-3.9-1-5.8-1z" fill="#151B28" /><path d="M685.1 407.1c-1 0-2-0.2-2.9-0.5a62.74 62.74 0 0 1-39-79.6c1.3-3.7 4.7-6.1 8.5-6.1 1 0 1.9 0.2 2.9 0.5l50.8 17.4c4.7 1.6 7.2 6.7 5.6 11.4L693.6 401c-0.8 2.2-2.4 4.1-4.5 5.1-1.3 0.7-2.6 1-4 1z" fill="#FFFFFF" /><path d="M651.7 330l50.8 17.4-17.4 50.8a53.8 53.8 0 0 1-33.4-68.2m0-17.9c-2.7 0-5.4 0.6-7.9 1.8a18.1 18.1 0 0 0-9.1 10.3c-12.8 37.3 7.2 78.1 44.5 90.9 1.9 0.7 3.9 1 5.8 1 7.4 0 14.4-4.7 16.9-12.1l17.4-50.8c1.5-4.5 1.2-9.4-0.9-13.7a18.1 18.1 0 0 0-10.3-9.1L657.5 313c-1.8-0.6-3.8-0.9-5.8-0.9z" fill="#151B28" /><path d="M335.3 765.9c-1 0-2-0.2-2.9-0.5L281.6 748c-2.2-0.8-4.1-2.4-5.1-4.5s-1.2-4.6-0.4-6.8l17.4-50.8c0.8-2.2 2.4-4.1 4.5-5.1a8.9 8.9 0 0 1 6.8-0.4 62.74 62.74 0 0 1 39 79.6c-0.8 2.2-2.4 4.1-4.5 5.1-1.3 0.5-2.7 0.8-4 0.8z" fill="#FFFFFF" /><path d="M301.9 688.8c28.1 9.6 43 40.1 33.4 68.2l-50.8-17.4 17.4-50.8m0-17.9c-2.7 0-5.4 0.6-7.9 1.8a18.1 18.1 0 0 0-9.1 10.3l-17.4 50.8c-3.2 9.4 1.8 19.5 11.1 22.7l50.8 17.4c1.9 0.6 3.8 1 5.8 1 2.7 0 5.4-0.6 7.9-1.8 4.3-2.1 7.5-5.8 9.1-10.3 6.2-18.1 5-37.5-3.4-54.7-8.4-17.2-23-30-41.1-36.2-1.9-0.7-3.9-1-5.8-1z" fill="#151B28" /><path d="M538.4 835.5c-1 0-1.9-0.2-2.9-0.5l-50.8-17.4c-2.2-0.8-4.1-2.4-5.1-4.5s-1.2-4.6-0.4-6.8a62.75 62.75 0 0 1 59.2-42.4c6.9 0 13.8 1.1 20.4 3.4 2.2 0.8 4.1 2.4 5.1 4.5s1.2 4.6 0.4 6.8l-17.4 50.8a9.01 9.01 0 0 1-8.5 6.1z" fill="#FFFFFF" /><path d="M538.4 772.8c5.8 0 11.7 0.9 17.5 2.9l-17.4 50.8-50.8-17.4a53.56 53.56 0 0 1 50.7-36.3m0-17.9v17.9-17.9a71.6 71.6 0 0 0-67.7 48.4c-3.2 9.4 1.8 19.5 11.1 22.7l50.8 17.4c1.9 0.6 3.8 1 5.8 1 2.7 0 5.4-0.6 7.9-1.8 4.3-2.1 7.5-5.8 9.1-10.3l17.4-50.8c3.2-9.4-1.8-19.5-11.1-22.7-7.6-2.6-15.4-3.9-23.3-3.9z" fill="#151B28" /><path d="M493.6 692.4c-16.4 0-32.6-2.7-48.3-8.1-1-0.4-2.2-0.7-3.4-1.3a148.5 148.5 0 0 1-97.2-143c0-0.8 0.2-1.7 0.4-2.4l27.6-80.6c0.3-0.8 0.7-1.5 1.2-2.2 27.9-37.8 72.7-60.3 119.7-60.3 16.4 0 32.6 2.7 48.2 8.1 51.5 17.6 89.2 61.9 98.4 115.5 1.7 9.5 2.5 19.2 2.3 28.8 0 0.8-0.2 1.6-0.4 2.4l-27.6 80.6c-0.3 0.8-0.7 1.5-1.2 2.2-28 37.7-72.7 60.3-119.7 60.3z" fill="#FFFFFF" /><path d="M493.5 402.6c15.1 0 30.5 2.5 45.6 7.6 50.3 17.2 84.6 60.1 93 109.2 1.6 8.9 2.4 18.1 2.2 27.2l-27.6 80.6a141.19 141.19 0 0 1-113.1 57.1c-15.1 0-30.5-2.5-45.7-7.6-1-0.3-2-0.7-3-1.2-0.1 0-0.2-0.1-0.2-0.1-57.7-21.3-93.3-76.6-91.9-135.2l27.6-80.6c26.4-35.8 68.7-57 113.1-57m0-16.3c-49.6 0-96.8 23.8-126.3 63.6-1 1.3-1.8 2.8-2.3 4.4l-27.6 80.6c-0.5 1.6-0.8 3.2-0.9 4.9a156.78 156.78 0 0 0 102.3 150.7l3.8 1.5c16.5 5.7 33.6 8.5 50.9 8.5 49.6 0 96.7-23.8 126.2-63.6 1-1.3 1.8-2.8 2.3-4.4l27.6-80.6c0.5-1.6 0.8-3.2 0.9-4.9 0.3-10.1-0.6-20.4-2.4-30.5a156.69 156.69 0 0 0-103.8-121.7c-16.3-5.6-33.4-8.5-50.7-8.5z" fill="#151B28" /><path d="M634.3 546.6l-27.6 80.6c-35.5 48-99.2 69.8-158.8 49.4-1-0.3-2-0.7-3-1.2-0.1 0-0.2-0.1-0.2-0.1-43.1-31.7-62.9-88.9-44.6-142.2 22.5-65.7 94-100.7 159.6-78.3a125.1 125.1 0 0 1 72.5 64.4 140 140 0 0 1 2.1 27.4z" fill="#2AEFC8" /><path d="M456.5 496.9c-11 5.4-18 10.7-22.3 23.3-4.8 14.1 1.3 26.5 14.5 31 34.1 11.7 45.7-54.8 94.4-38.1 21.3 7.3 31.1 25.7 26.7 47.7l22.3 7.6-4.2 12.2-22.1-7.6c-6.4 14-18.5 25.7-30.3 32l-8.6-11.7c11.4-6.4 22.1-15.5 26.9-29.6 5.9-17.3-0.5-29.3-15.1-34.3-38.1-13.1-50.7 53.1-94.9 37.9-19.7-6.7-29.4-24.9-25.7-44.9l-22.3-7.6 4.2-12.2 22.1 7.6c6.3-13.8 16.3-20.7 27.4-25.6l7 12.3z" fill="" /></svg>
              </span>
          </div>
          <div class="flex justify-center">
            <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ pedido.TotalVentaReal | filtrarDecimal }}</h2>
          </div>
          <div class="ml-4"><span class="">Venta bruta pedido</span></div>
        </div> -->
        <!--TOTAL ALCANCE-->
        <div class="p-6 pb-0" v-if="arregloAlcance.length > 0">
          <div class="flex justify-center">
              <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                <svg fill="#000000" width="28px" height="28px" viewBox="0 0 24 24" id="up-direction-circle" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><path id="secondary" d="M12,3a9,9,0,1,0,9,9A9,9,0,0,0,12,3Zm2,9v5H10V12H8l3.18-4.61a1,1,0,0,1,1.64,0L16,12Z" style="fill: rgb(44, 169, 188); stroke-width: 2;"></path><path id="primary" d="M14,12v5H10V12H8l3.18-4.61a1,1,0,0,1,1.64,0L16,12ZM12,3a9,9,0,1,0,9,9A9,9,0,0,0,12,3Z" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></svg>
              </span>
          </div>
          <div class="flex justify-center">
            <h2 class="mb-1 font-bold text-warning" style="opacity:0.7;">${{ totalAlcance | filtrarDecimal }}</h2>
          </div>
          <div class="ml-4"><span class="">Total Alcances</span></div>
        </div>
        <!--TOTAL VENTA BRUTA-->
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                  <feather-icon icon="ShoppingCartIcon"  svgClasses="h-8 w-7" class="ml-1" />
                </span>
            </div>
            <div class="flex justify-center">
                <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ totalVentaBruta | filtrarDecimal }}</h2>
            </div>
            <div class="ml-4"><span class="">Total Venta Bruta</span></div>
        </div>
        <!--COMISION ESCUELA-->
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                  <feather-icon icon="PercentIcon"  svgClasses="h-8 w6" class="ml-1" />
                </span>
            </div>
            <div class="flex justify-center">
                <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">{{ pedido.descuento }}%</h2>
            </div>
            <div class="truncate"><span class="">Comisión Escuela</span></div>
        </div>
        <!--=======VALORES VENTA REAL O NETA======-->
        <div class="p-6 pb-0" v-if="pedido.contrato_generado">
          <div class="flex justify-center">
            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
              <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M951.87 253.86c0-82.18-110.05-144.14-256-144.14s-256 61.96-256 144.14c0 0.73 0.16 1.42 0.18 2.14h-0.18v109.71h73.14v-9.06c45.77 25.81 109.81 41.33 182.86 41.33 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98h-73.12v73.14h73.12c67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0 28.27-72.93 71-182.86 71l-25.89 0.12c-15.91 0.14-31.32 0.29-46.34-0.11l-1.79 73.11c8.04 0.2 16.18 0.27 24.48 0.27 7.93 0 16-0.05 24.2-0.12l25.34-0.12c67.44 0 127.02-13.35 171.81-35.69 6.97 7.23 11.04 14.41 11.04 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c67.44 0 127.01-13.35 171.81-35.69 6.98 7.22 11.05 14.4 11.05 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c145.95 0 256-61.96 256-144.14 0-0.68-0.09-1.45-0.11-2.14h0.11V256h-0.18c0.03-0.72 0.2-1.42 0.2-2.14z m-438.86 0c0-28.27 72.93-71 182.86-71s182.86 42.73 182.86 71c0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98z" fill="#0F1F3C" /><path d="M330.15 365.71c-145.95 0-256 61.96-256 144.14 0 0.73 0.16 1.42 0.18 2.14h-0.18v256c0 82.18 110.05 144.14 256 144.14s256-61.96 256-144.14V512h-0.18c0.02-0.72 0.18-1.42 0.18-2.14 0-82.18-110.05-144.15-256-144.15zM147.29 638.93c0-6.32 4.13-13.45 11.08-20.62 44.79 22.33 104.36 35.67 171.78 35.67 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.72-182.86-70.97z m182.86-200.07c109.93 0 182.86 42.73 182.86 71 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98c0-28.27 72.93-71 182.86-71z m0 400.14c-109.93 0-182.86-42.73-182.86-71 0-6.29 4.17-13.43 11.11-20.6 44.79 22.32 104.34 35.66 171.75 35.66 67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0.01 28.26-72.92 70.99-182.85 70.99z" fill="#0F1F3C" /></svg>
            </span>
          </div>
          <div class="flex justify-center">
              <h2 class="mb-1 font-bold text-success">${{ pedido.ven_neta | filtrarDecimal }}</h2>
          </div>
          <div class="truncate"><span class="ml-5 text-success">VENTA NETA</span></div>
        </div>
      </template>
    </div>
    <div v-if="tipo == 3">
      <vs-alert title="Advertencia" color="danger" active="true">
        <p>Los valores de comisiones para los beneficiarios no es la correcta</p>
      </vs-alert>
    </div>
  </vx-card>
</template>
<script>
  import {
    mapState
} from "vuex";
export default{
  data(){
    return{
      arregloBeneficiarios:[],
      arregloPorcentajes:[],
      arregloAlcance:[],
      valorComision:0,
      tipo:0,
      totalAlcance:0,
      totalVentaBruta:0,
      ventaReal:0,
      comisionReal:0,
      valorComisionReal:0,
      totalRealContratos:0,
    }
  },
  props:{
    desdeVerificacion:{
      type:Number,
      default:0
    },
    pedido:{
      type:Object,
      default:function(){
        return {}
      },
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      },
    },
  },
  watch:{
    pedido(results){
      let me = this
      me.getAlcances()
      me.getValoresBeneficiarios()
    },
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
  },
  mounted(){
    let me = this;
    me.getAlcances()
    me.getValoresBeneficiarios()
    me.getTotalVentaRealContratos()
  },
  methods:{
    getTotalVentaRealContratos(){
      let me = this;
      me.totalRealContratos = 0
      const { id_asesor , id_periodo  } = me.pedido
      me.$http.get(this.$server_url+`pedigo_Pagos?getVentaRealXAsesor=1&idAsesor=${id_asesor}&idPeriodo=${id_periodo}`)
      .then(function (res) {
        let datos = res.data
        if(datos.length>0){
          datos.forEach(element => {
            me.totalRealContratos += element.TotalVentaReal
          });
        }
      })
    },
    getAlcances(){
      let me = this;
      me.arregloAlcance = []
      this.$http.get(this.$server_url+'getAlcancePedido?id_pedido='+me.pedido.id_pedido)
      .then(function (res) {
        let datos = res.data
        //estado alcance => 0 = abierto; 1 = cerrado; 2 = rechazado;
        if(datos.length > 0){
          let datos2 = datos.filter(p => p.estado_alcance == 1 && p.venta_bruta > 0)
          if(datos2.length > 0){
            datos2.forEach(element => {
              var cal             = new Object();
              cal.id              = element.id
              cal.id_periodo      = element.id_periodo
              cal.id_pedido       = element.id_pedido
              cal.venta_bruta     = element.venta_bruta
              cal.total_unidades  = element.total_unidades
              me.arregloAlcance.push(cal)
            });
            //sumar total alcance
            let getValoresAlcance = me.arregloAlcance.filter(p => p.venta_bruta)
            let total = getValoresAlcance.reduce((a, b) => a + (b["venta_bruta"] || 0), 0);
            me.totalAlcance      = total
          }
        }
        me.totalVentaBruta = me.pedido.TotalVentaReal
        me.valorComision = (me.totalVentaBruta * me.pedido.descuento) / 100
      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
      })
    },
    getValoresBeneficiarios(){
      let me = this;
      var url = ""
      //tipoUrl => 0 => VENTA REAL GENERAL; 1 => VENTA REAL POR VERIFICACION
      if(me.desdeVerificacion == '0') {
        url = this.$server_url+'getBeneficiarios/'+me.pedido.id_pedido+'/0/0'
      }else{
        url = this.$server_url+'getBeneficiarios/'+me.pedido.id_pedido+'/1/'+me.VerificacionSelect.id
      }
      this.$http.get(url)
        .then(function (res) {
          let datos = res.data
          if(datos.length>0){
            me.ventaReal          =  datos[0].ventaReal
            me.comisionReal       =  datos[0].comisionReal
            me.valorComisionReal  =  datos[0].valorComisionReal
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
  }
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
