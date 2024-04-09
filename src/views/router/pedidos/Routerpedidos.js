// router.js

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default [
    {
      path: '/p_pedidos',
      name: 'p_pedidos',
      component: () => import('@/views/pedidos2/PrincipalPedidos.vue'),
    },
    // Otras rutas específicas de pedidos
  ];