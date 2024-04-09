<template>
  <div>
    <div class="dashboard" id="rebote">
      <vs-divider>Estadisticas:</vs-divider>
      <main class="content-wrap" style="margin-top:-40px;">
          <div class="content">
              <section class="info-boxes">
                <div class="info-box active" @click="irGuias();">
                  <div class="box-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 0.999992C10.9477 0.999992 10.5 1.44771 10.5 1.99999V2.99999H9.99998C7.23864 2.99999 4.99998 5.23824 4.99998 7.99975V11C4.99998 11.7377 4.76718 12.5722 4.39739 13.4148C4.03164 14.2482 3.55875 15.0294 3.14142 15.6439C2.38188 16.7624 2.85215 18.5301 4.40564 18.8103C5.42144 18.9935 6.85701 19.2115 8.54656 19.3527C8.54454 19.4015 8.54352 19.4506 8.54352 19.5C8.54352 21.433 10.1105 23 12.0435 23C13.9765 23 15.5435 21.433 15.5435 19.5C15.5435 19.4482 15.5424 19.3966 15.5402 19.3453C17.1921 19.204 18.596 18.9903 19.5943 18.8103C21.1478 18.5301 21.6181 16.7624 20.8586 15.6439C20.4412 15.0294 19.9683 14.2482 19.6026 13.4148C19.2328 12.5722 19 11.7377 19 11V7.99975C19 5.23824 16.7613 2.99999 14 2.99999H13.5V1.99999C13.5 1.44771 13.0523 0.999992 12.5 0.999992H11.5ZM12 19.5C12.5113 19.5 13.0122 19.4898 13.4997 19.4715C13.5076 20.2758 12.8541 20.9565 12.0435 20.9565C11.2347 20.9565 10.5803 20.2778 10.5872 19.4746C11.0473 19.491 11.5191 19.5 12 19.5ZM9.99998 4.99999C8.34305 4.99999 6.99998 6.34297 6.99998 7.99975V11C6.99998 12.1234 6.65547 13.2463 6.22878 14.2186C5.79804 15.2 5.25528 16.0911 4.79599 16.7675C4.78578 16.7825 4.78102 16.7969 4.77941 16.8113C4.77797 16.8242 4.77919 16.8362 4.78167 16.8458C6.3644 17.1303 9.00044 17.5 12 17.5C14.9995 17.5 17.6356 17.1303 19.2183 16.8458C19.2208 16.8362 19.222 16.8242 19.2206 16.8113C19.2189 16.7969 19.2142 16.7825 19.204 16.7675C18.7447 16.0911 18.2019 15.2 17.7712 14.2186C17.3445 13.2463 17 12.1234 17 11V7.99975C17 6.34297 15.6569 4.99999 14 4.99999H9.99998Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0299 0.757457C16.1622 0.228068 16.7146 -0.102469 17.2437 0.0301341C17.3131 0.0476089 17.3789 0.0669732 17.4916 0.104886C17.6295 0.151258 17.8183 0.221479 18.0424 0.322098C18.4894 0.522794 19.0851 0.848127 19.6982 1.35306C20.9431 2.37831 22.2161 4.1113 22.495 6.9005C22.55 7.45005 22.149 7.94009 21.5995 7.99504C21.05 8.05 20.5599 7.64905 20.505 7.09951C20.2839 4.88869 19.3068 3.62168 18.4268 2.89692C17.9774 2.52686 17.5418 2.28969 17.2232 2.14664C17.0645 2.07538 16.9369 2.02841 16.8541 2.00057C16.8201 1.98913 16.7859 1.97833 16.7513 1.96858C16.2192 1.83203 15.8964 1.2912 16.0299 0.757457Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.97014 0.757457C7.83619 0.221662 7.29326 -0.104099 6.75746 0.0298498C6.68765 0.0473468 6.62176 0.066766 6.5084 0.104885C6.37051 0.151257 6.1817 0.221478 5.9576 0.322097C5.51059 0.522793 4.91493 0.848125 4.30179 1.35306C3.05685 2.37831 1.78388 4.1113 1.50496 6.90049C1.45001 7.45003 1.85095 7.94008 2.40049 7.99503C2.95004 8.04998 3.44008 7.64904 3.49504 7.0995C3.71612 4.88869 4.69315 3.62168 5.57321 2.89692C6.02257 2.52686 6.45815 2.28969 6.77678 2.14664C6.93548 2.07538 7.06308 2.02841 7.14589 2.00057C7.17991 1.98913 7.21413 1.97833 7.24867 1.96858C7.78081 1.83203 8.10358 1.2912 7.97014 0.757457Z" fill="#0F0F0F"></path> </g></svg>
                  </div>
                  <div class="box-content">
                      <span class="big">{{ datos.guiasSinDespachar}}</span>
                      <span class="titulo">Guias Sin despachar</span>
                  </div>
                </div>
                <div class="info-box active" @click="irGuias();">
                  <div class="box-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 11C9.55229 11 10 10.5523 10 10C10 9.44771 9.55229 9 9 9C8.44771 9 8 9.44771 8 10C8 10.5523 8.44771 11 9 11Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M17 10C17 11.66 16.4944 13.202 15.6288 14.4802C16.3586 14.9529 16.87 15.7341 16.9785 16.6391C18.6527 16.0088 19.3067 15.2776 19.6313 14.4481C19.8523 13.8833 19.9555 13.1857 19.993 12.2641C20.0235 11.5134 20.0095 10.6959 20.0028 9.73408C19.4035 9.38867 19 8.74145 19 8C19 6.89543 19.8954 6 21 6C22.1046 6 23 6.89543 23 8C23 8.73902 22.5992 9.38443 22.0031 9.73067C22.01 10.602 22.0268 11.4744 21.9914 12.3453C21.9507 13.3455 21.8352 14.3042 21.4937 15.1769C20.8285 16.877 19.4264 17.9713 17 18.7472V19C17 20.6569 15.6569 22 14 22H4C2.34315 22 1 20.6569 1 19V17C1 15.9436 1.54602 15.0147 2.37124 14.4802C1.50561 13.202 1 11.66 1 10C1 5.58172 4.58172 2 9 2C13.4183 2 17 5.58172 17 10ZM9 16C12.3137 16 15 13.3137 15 10C15 6.68629 12.3137 4 9 4C5.68629 4 3 6.68629 3 10C3 13.3137 5.68629 16 9 16ZM9 18C11.0111 18 12.8489 17.2579 14.2544 16.0327C14.6835 16.1452 15 16.5356 15 17V19C15 19.5523 14.5523 20 14 20H4C3.44772 20 3 19.5523 3 19V17C3 16.5356 3.31652 16.1452 3.74558 16.0327C5.15114 17.2579 6.98891 18 9 18Z" fill="#0F0F0F"></path> </g></svg>
                  </div>
                  <div class="box-content">
                      <span class="big">{{ datos.devueltasPendientes }}</span>
                      <span class="titulo"> Devoluciones Pendientes</span>
                  </div>
                </div>
              </section>
          </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardBodegaAdmin',
  data() {
    return {
      // Your data properties here
      datos:{
        guiasSinDespachar: 0,
        guiasDespachadas: 0,
        devueltasPendientes: 0,
        devueltasAprobadas: 0
      }
    };
  },
  mounted() {
    this.getDatos()
    // Code to run when the component is mounted
  },
  methods: {
    // Your methods here
    irGuias(){
      this.$router.push('/home/bodega')
    },
    getDatos(){
      let me = this;
      this.$http.get(this.$server_url+'guias?datosGuias=yes')
      .then(res => {
          me.datos = res.data
      })
    }
  },
};
</script>

<style scoped>
  * {
  box-sizing: border-box;
  }
   .dashboard {
      width: 100%;
      height: 100%;
      overflow-x: hidden; /* Oculta el desplazamiento horizontal */
      overflow-y: auto; /* Habilita el desplazamiento vertical */
      background: #fff;
      font-size: 16px;
      line-height: 120%;
      font-family: Open Sans, Helvetica, sans-serif;
  }


  .titulo{
  color: #99a0b0;
  font-size: 16px;
  }
  .content-wrap {
  grid-area: content;
  padding: 3em;
  overflow: auto;
  }
  .info-box{
    cursor: pointer;

  }
  .info-box{
    transition: all 0.3s;
  }
  .info-box:hover{
    transform: translateY(-8px);

  }

  .content-wrap .info-boxes {
  padding: 3em 0 2em;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  grid-gap: 2em;
  }
  .content-wrap .info-boxes .info-box {
  background: #fff;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 3em;
  border: 1px solid #ede8f0;
  border-radius: 5px;
  }
  .content-wrap .info-boxes .info-box .box-icon svg {
  display: block;
  width: 48px;
  height: 48px;
  }
  .content-wrap .info-boxes .info-box .box-icon svg path,
  .content-wrap .info-boxes .info-box .box-icon svg circle {
  fill: #99a0b0;
  }
  .content-wrap .info-boxes .info-box .box-content {
  padding-left: 1.25em;
  white-space: nowrap;
  }
  .content-wrap .info-boxes .info-box .box-content .big {
  display: block;
  font-size: 2em;
  line-height: 150%;
  color: #1b253d;
  }
  .content-wrap .info-boxes .info-box.active svg circle,
  .content-wrap .info-boxes .info-box.active svg path {
  fill: #4b84fe;
  }
  /*EFECTOS*/
  /* Animación de rebote */
  @keyframes movimiento-izquierda-derecha {
    0% {
      transform: translateX(0); /* El div no se mueve en el eje X */
    }
    50% {
      transform: translateX(-50px); /* El div se mueve hacia la derecha */
    }
    100% {
      transform: translateX(0); /* El div vuelve a su posición original */
    }
  }

  .dashboard {
    animation: movimiento-izquierda-derecha 1s ease-in-out; /* Se aplica la animación al div */
  }

/* Aplicar estilos al div */
/*media query*/
@media (max-width: 500px) {
  .titulo {
    font-size: 12px; /* Se elimina la animación */
  }
}

 </style>
