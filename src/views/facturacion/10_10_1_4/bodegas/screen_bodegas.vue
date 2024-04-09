<template>
  <div>
    <vx-card>
      <vs-tabs>
        <vs-tab label="Bodegas">
          <bodegas />
        </vs-tab>
		<vs-tab label="Remisión">
          <remision />
        </vs-tab>
        <vs-tab label="Motivos Remisión">
          <Motivoremision />
        </vs-tab>
        <vs-tab label="Transporte">
          <transporte />
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>
<script>
import bodegas from "./bodegas_crud.vue";
const remision = () => import("./remision_crud.vue");
const Motivoremision = () => import("./motivo_remi.vue");
const transporte = () => import("./transporte_crud.vue");

export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: {
    bodegas,
    transporte,
	remision,
    Motivoremision,
  },
};
</script>
