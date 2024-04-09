<template>
  <div>
    <vx-card>
      <vs-tabs>
        <vs-tab label="Comparación de pagos">
          <Comparacion />
        </vs-tab>
        <vs-tab label="Tipo Documento">
          <TipoDocumento />
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>
<script>

import Comparacion from "./comparacionliq.vue";
import TipoDocumento from "./tipo_documento_crud.vue"; 


export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: {
	Comparacion,
  TipoDocumento
  },
};
</script>
