<template>
    <div>
      <vx-card>
        <vs-tabs>
            <vs-tab label="Generar orden de trabajo">
                <orden />
            </vs-tab>
            <vs-tab label="Proveedor">
                <proveedor />
            </vs-tab>
            <vs-tab label="Recibir orden de trabajo">
                <compra />
            </vs-tab>
          <vs-tab label="Característica del producto">
              <producto_caracteristica />
          </vs-tab>
          <vs-tab label="Producto">
              <producto />
          </vs-tab>
          <vs-tab label="Grupo Producto">
              <grupo_producto />
          </vs-tab>
          <vs-tab label="Material Cubierta Exterior">
              <material_cubierta_exterior />
          </vs-tab>
          <vs-tab label="Material Cubierta Interior">
              <material_cubierta_interior />
          </vs-tab>
          <!-- <vs-tab label="Institución">
              <institucionfacturacion />
          </vs-tab> -->
        </vs-tabs>
      </vx-card>
    </div>
  </template>
<script>
import orden from "./orden_trabajo.vue";
import compra from "./compra_orden_trabajo.vue";
import proveedor from "./proveedor.vue";
import producto_caracteristica from './producto_caracteristica.vue';
import producto from './producto_crud.vue';
import grupo_producto from './grupo_producto_crud.vue';
import material_cubierta_exterior from './material_cubierta_exterior_crud.vue';
import material_cubierta_interior from './material_cubierta_interior_crud.vue';
// import institucionfacturacion from './institucion.vue';


export default {
    data() {
        return {};
    },
    mounted() {},
    methods: {},
    components: {
        orden,
        compra,
        proveedor,
        producto_caracteristica,
        producto,
        grupo_producto,
        material_cubierta_exterior,
        material_cubierta_interior,
        // institucionfacturacion,
    }
}
</script>
