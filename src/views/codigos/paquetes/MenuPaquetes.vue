<template>
  <vx-card
  :title="title"
  title-color="primary"
  subtitle="Gestión de Paquetes"
  >
    <div>
      <vs-button type="gradient" class="mr-2 btna" @click="title='Generar Paquetes';   menu = 0;"><ion-icon name="code-slash-outline"></ion-icon> Generar</vs-button>
      <vs-button type="gradient" class="mr-2 btna" @click="title='Buscar Paquete';     menu = 1;"><ion-icon name="search-outline"></ion-icon> Buscar</vs-button>
      <vs-button type="gradient" class="mr-2 btna" @click="title='Importar Paquetes';  menu = 2;"><ion-icon name="medkit-outline"></ion-icon> Importar</vs-button>
      <vs-button type="gradient" class="mr-2 btna" @click="title='Importar Ingresar Paquetes';  menu = 3;"><ion-icon name="code-download-outline"></ion-icon> Ingreso paquetes</vs-button>
      <vs-button type="gradient" class="mr-2 btna" @click="title='Importar Eliminar Paquetes';  menu = 4;"><ion-icon name="code-download-outline"></ion-icon> Eliminar</vs-button>
    </div>
    <vs-divider></vs-divider>
    <!--MENU-->
    <div>
      <div v-if="menu == 0"><GenerarCodigosPaquetesVue/></div>
      <div v-if="menu == 1"><MenuBusquedaPaqueteVue/></div>
      <div v-if="menu == 2"><ImportPaquetes2Vue/></div>
      <div v-if="menu == 3"><PaquetesIngresarCodigosVue/></div>
      <div v-if="menu == 4"><PaquetesEliminarVue/></div>
    </div>
  </vx-card>
</template>
<script>
import GenerarCodigosPaquetesVue from '@/views/codigos/paquetes/components/GenerarCodigosPaquetes'
import MenuBusquedaPaqueteVue from './components/MenuBusquedaPaquete.vue'
const ImportPaquetes2Vue         = () => import('./version2/paquetes/ImportPaquetes2.vue')
const PaquetesIngresarCodigosVue = () => import('./components/IngresarCodigos/PaquetesIngresarCodigos.vue')
const PaquetesEliminarVue        = () => import('./components/EliminarPaquetes/PaquetesEliminar.vue')
export default{
  data(){
    return{
      menu:0,
      title:'Generar Paquetes'
    }
  },
  components:{
    GenerarCodigosPaquetesVue,
    ImportPaquetes2Vue,
    MenuBusquedaPaqueteVue,
    PaquetesIngresarCodigosVue,
    PaquetesEliminarVue,
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/general/general.scss';
    .btna{
        font-size: 14px!important;
        @include button-1;
        background-color:var(--colorazul);
    }
    .btna:hover{
        opacity: 0.7;
    }
</style>
