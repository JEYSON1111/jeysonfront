<template>
    <div>
      <!-- MENU -->
      <nav class="breadcrumbs mt-3" style="display:flex;flex-wrap:wrap">
        <span v-for="(menu, index) in menus"  :key="index" :class="['breadcrumbs__item', 'btnMenu', {'activeBtn': filtro === index, 'customBackground': filtro === index}]" @click="cambiarFiltro(index)">{{ menu }}</span>
      </nav>
    </div>
  </template>

  <script>
  export default {
    props: {
      menus: {
        type: Array,
        required: true,
      },
      fondo: {
        type: String,
        default: 'red', // Color de fondo predeterminado
      },
    },
    data() {
      return {
        filtro: 0,
      };
    },
    mounted(){
        let me = this;
        console.log('d',this.$refs)
    },
    methods: {
      cambiarFiltro(index) {
        this.filtro = index;
        this.$emit('filtro-cambiado', index); // Emitir un evento cuando se cambia el filtro
      },
    },
  };
  </script>

  <style scoped>
  * {
    color: black;
  }

  /* MENU */
  .activeBtn {
    color: white !important;
  }

  .customBackground {
    background-color: var(--fondo, #457fa6); /* Uso de variable CSS para el color de fondo */
  }

  /** ESTILOS SUB MENU */
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
    color: black;
    cursor: pointer;
  }

  .breadcrumbs__item:hover:after,
  .breadcrumbs__item:hover {
    background: #E38A3B;
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
  </style>
