<template>
  <div>
    <div class="flex" style="flex-wrap: wrap">
      
      <vs-button
        type="gradient filled"
        @click="tipo = 0"
        class="ml-2 py-2"
        v-if="permisoRoot"
        >Ordén de producción</vs-button
      >
      <vs-button
        type="gradient filled"
        @click="tipo = 2"
        class="ml-2 py-2"
        v-if="permisoRoot"
        >Inventario</vs-button
      >
      <vs-button
        type="gradient filled"
        @click="tipo = 3"
        class="ml-2 py-2"
        v-if="permisoRoot"
        >Bodegas</vs-button
      >
      <vs-button
        type="gradient filled"
        @click="tipo = 4"
        class="ml-2 py-2"
        v-if="permisoRoot"
        >Administración</vs-button
      >
      <vs-button
        type="gradient filled"
        @click="tipo = 5"
        class="ml-2 py-2"
        v-if="permisoRoot"
        >Empresas</vs-button
      >
    </div>
    <!--Órden de producción-->
    <vx-card v-if="tipo == 0 && permisoRoot" class="mt-5" :permisoRoot="permisoRoot">
      <orden_produccion />
    </vx-card>
    <!--Órden de producción-->
    
    <div v-if="tipo == 2">
      <ScreenInventarioVue />
    </div>
    <!--Bodegas-->
    <vx-card v-if="tipo == 3 && permisoRoot" class="mt-5" :permisoRoot="permisoRoot">
      <bodegas />
    </vx-card>
    <vx-card v-if="tipo == 4 && permisoRoot" class="mt-5" :permisoRoot="permisoRoot">
      <administracion />
    </vx-card>
    <!-- empresa -->
    <vx-card v-if="tipo == 5 && permisoRoot" class="mt-5" :permisoRoot="permisoRoot">
      <empresa />
    </vx-card>
  </div>
</template>
<script>
import orden_produccion from "./orden_pedido/screen_orden.vue";
import bodegas from "./bodegas/screen_bodegas.vue";
import administracion from "./documentoliq/screen_documentoliq.vue";
import empresa from "../../empresas/lista.vue";
const ScreenInventarioVue = () => import("./inventario/ScreenInventario.vue");
// import producto from './producto_crud.vue';

export default {
  data() {
    return {
      tipo: 0,
      permisoRoot: false,
    };
  },
  created() {
    let me = this;
    me.usuarioAcceso = JSON.parse(localStorage.getItem("usuario"));
    me.getUserRoot();
  },
  methods: {
    getUserRoot() {
      let me = this;
      this.$http
        .get(
          this.$server_url +
            "permisos?permiso=yes&usuario_id=" +
            me.usuarioAcceso.idusuario
        )
        .then(function (res) {
          if (res.data.status == "1") {
            me.permisoRoot = true;
          } else {
            me.permisoRoot = false;
            me.$vs.notify({
              text: "No tiene permisos necesarios para acceder a esta sección",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          }
        })
        .catch(function (error) {
          console.log(error + " error");
        });
    },
  },
  components: {
    orden_produccion,
    ScreenInventarioVue,
    bodegas,
    administracion,
    empresa,
  },
};
</script>
