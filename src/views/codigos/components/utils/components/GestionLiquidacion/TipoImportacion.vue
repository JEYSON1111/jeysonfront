<template>
  <div>
    <div>
      <!--MENU-->
      <!-- <nav class="breadcrumbs mt-3">
        <span class="breadcrumbs__item btnMenu activeBtn menu0 cursor-pointer" @click="filtroTipo = 0;estadoMenu();">Códigos</span>
        <span class="breadcrumbs__item btnMenu menu1 cursor-pointer"           @click="filtroTipo = 1;estadoMenu();">Paquetes</span>
      </nav> -->
      <br><br>
      <!--CODIGOS INDIVIDUALES-->
      <div v-if="filtroTipo == 0">
        <p class="text-2xl text-warning font-bold text-center" style="margin-top:-30px;">Que tipo de importación va a realizar?</p>
        <div v-if="noPaquetes == 0">
          <vs-alert color="danger" class="mt-2"><p class="text-center">!Los paquetes máximo 200 paquetes</p></vs-alert>
        </div>
        <vs-divider></vs-divider>
        <div class="flex justify-center mt-2" style="flex-wrap:wrap;">
          <vs-button class="m-3 text-white" color="primary"    @click="tipoBodega= 0;titleImportacion = 'Importacion Sticker (Activación)';validateCodigos();">Activación Sticker</vs-button>
          <vs-button class="m-3" color="success"               @click="tipoBodega= 0;titleImportacion = 'Importacion Sticker (Diágnostica)';validateCodigos();" type="border">Diágnostica Sticker</vs-button>
          <vs-button class="m-3 text-white" color="warning"    @click="tipoBodega= 1;titleImportacion = 'Importacion Activación - Diágnostico';validateCodigos();"> Activación -Diágnostica</vs-button>
          <vs-button class="m-3" color="dark"                  @click="tipoBodega= 2;titleImportacion = 'Importacion Diágnostico - Activación)';validateCodigos();" type="border"> Diágnostica -Activación</vs-button>
          <vs-button class="m-3" color="#29BCC6"               @click="tipoBodega= 3;titleImportacion = 'Importacion Paquetes';validateCodigos();" v-if="noPaquetes == 0" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
        </div>
      </div>
      <!--FIN CODIGOS INDIVIDUALES-->
      <!--PAQUETES-->
      <!-- <div v-if="filtroTipo == 1">
        <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
        <vs-divider></vs-divider>
        <div class="flex justify-center mt-2">
          <div class="mr-4">
            <span>Paquete:</span>
            <ul class="flex mt-2">
              <li>
                <vs-radio v-model="cantidadPaquete" vs-name="cantidadPaquete" vs-value="10">5</vs-radio>
              </li>
              <li>
                <vs-radio v-model="cantidadPaquete" class="ml-3" vs-name="cantidadPaquete" vs-value="20">10</vs-radio>
              </li>
            </ul>
          </div>
          <vs-button class="mr-3 mb-2 p-2" color="primary"   @click="tipoBodega= 3;titleImportacion = 'Paquete Activación - Diágnostico';validateCodigos();" type="border">Activación -Diágnostica</vs-button>
          <vs-button class="mr-2 mb-2 p-2" color="dark"      @click="tipoBodega= 4;titleImportacion = 'Paquete Diágnostico - Activación)';validateCodigos();" type="border">Diágnostica -Activación</vs-button>
        </div>
      </div> -->
      <!--FIN PAQUETES-->
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      filtroTipo:0,
      cantidadPaquete:20,
    }
  },
  props:{
    noPaquetes:{
      type: Number,
      default: function(){
        return 0
      }
    }
  },
  methods:{
    //METODOS PAQUETES
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelectPaquete',me.filtroTipo)
      var divs = document.querySelectorAll(".btnMenu");
      for (var i = 0; i < divs.length; i++) {
        divs[i].classList.remove("activeBtn");
      }
      const container = document.querySelector(".menu"+me.filtroTipo);
      container.classList.add("activeBtn");
    },
    validateCodigos(){
      let me = this;
      let datos  = {
        sendtipoBodega       : me.tipoBodega,
        sendtitleImportacion : me.titleImportacion,
        sendcantidadPaquete  : me.cantidadPaquete
      }
      me.$emit('changeTipo',datos)
    },
  }
}
</script>
<!-- <style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #000;
color:white;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style> -->
