<template>
  <div>
      <vx-card
      title="Filtro de Reportes"
      title-color="primary"
      >
      <!--MENU-->
      <div class="vx-row mt-2">
        <div class="p-6 pb-0 submenutitle menu0 active w-full sm:w-1/2 md:w-1/3 lg:w-1/6 xl:w-1/6 m-2" @click="menu = 0;estadoMenu();">
            <div class="flex justify-center">
              <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                <svg height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 370.32 370.32" xml:space="preserve">
                  <g>
                      <path style="fill:#020202;" d="M320.816,63.219L261.94,4.339C259.156,1.561,255.39,0,251.457,0H74.271
                          C58.219,0,45.16,13.06,45.16,29.112v312.095c0,16.053,13.059,29.113,29.111,29.113h221.777c16.052,0,29.111-13.06,29.111-29.113
                          V73.703C325.16,69.769,323.6,65.998,320.816,63.219z M293.547,337.907H76.773V32.414h154.088v43.577
                          c0,10.554,8.554,19.106,19.105,19.106h43.58V337.907z"/>
                      <path style="fill:#020202;" d="M103.827,149.16c0,8.284,6.716,15,15,15h132.667c8.284,0,15-6.716,15-15s-6.716-15-15-15H118.827
                          C110.542,134.16,103.827,140.876,103.827,149.16z"/>
                      <path style="fill:#020202;" d="M251.494,224.16H118.827c-8.284,0-15,6.716-15,15s6.716,15,15,15h132.667c8.284,0,15-6.716,15-15
                          S259.778,224.16,251.494,224.16z"/>
                  </g>
                </svg>
              </span>
            </div>
            <div class="truncate text-center" ><h6 class="mb-1 text-center">Reporte</h6><span class="text-center">Comparativa</span></div>
        </div>
        <div class="p-6 pb-0 submenutitle menu1 w-full sm:w-1/2 md:w-1/3 lg:w-1/6 xl:w-1/6 m-2" @click="menu = 1;estadoMenu();">
          <div class="flex justify-center">
              <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 19V6.2C5 5.0799 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.0799 19 6.2V17H7C5.89543 17 5 17.8954 5 19ZM5 19C5 20.1046 5.89543 21 7 21H19M18 17V21M15 13.5C14.7164 12.3589 13.481 11.5 12 11.5C10.519 11.5 9.28364 12.3589 9 13.5M12 7.5H12.01M13 7.5C13 8.05228 12.5523 8.5 12 8.5C11.4477 8.5 11 8.05228 11 7.5C11 6.94772 11.4477 6.5 12 6.5C12.5523 6.5 13 6.94772 13 7.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
          </div>
          <div class="truncate text-center" ><h6 class="mb-1 text-center">Detalle</h6><span class="text-center">Reporte</span></div>
        </div>
      </div>
    </vx-card>
    <div class="mt-2">
      <!--MENU SELECT-->
      <!--REPORTE PROMEDIOS COMPARATIVA-->
      <div v-if="menu == 0">
        <ScreenComparativaPromediosVue :arregloPeriodos="arregloPeriodos" :arregloInstituciones="arregloInstituciones" class="fade-in"/>
      </div>
      <!--REPORTE DETALLE AREAS - ASIGNATURAS-->
      <div v-if="menu == 1">
        <ScreenDetalleAreasVue :arregloPeriodos="arregloPeriodos" :arregloInstituciones="arregloInstituciones" class="fade-in"/>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import ScreenComparativaPromediosVue from '@/views/salle/administrador/evaluaciones/components/reporte/ScreenComparativaPromedios'
import ScreenDetalleAreasVue from '@/views/salle/administrador/evaluaciones/components/reporte/ScreenDetalleAreas'
export default{
    components:{
      ScreenComparativaPromediosVue,
      ScreenDetalleAreasVue,
    },
    data(){
      return{
        arregloPeriodos:[],
        arregloInstituciones:[],
        menu:0,
      }
    },
    mounted(){
      let me = this;
      me.getPeriodosEvaluacion()
      me.getInstituciones()
      let menuSelect = localStorage.menuReporte
      if(menuSelect){
        me.menu = menuSelect
        setTimeout(function(){  me.estadoMenu() }, 1000);
      }else{
        setTimeout(function(){  me.estadoMenu() }, 1000);
      }
    },
    methods:{
      getPeriodosEvaluacion() {
        let me = this;
        this.$http.get(this.$server_url+'salle/periodos')
        .then(function (response) {
          me.arregloPeriodos = response.data;
        })
        .catch(function (error) {
        })
      },
      getInstituciones(){
        let me = this
          this.$http.get(this.$server_url+'instituciones_salle_select')
          .then(res => {
            me.arregloInstituciones = res.data
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      estadoMenu(){
        let me = this;
        localStorage.setItem('menuReporte',me.menu)
        var divs = document.querySelectorAll(".submenutitle");
        for (var i = 0; i < divs.length; i++) {
          divs[i].classList.remove("active");
        }
        const container = document.querySelector(".menu"+me.menu);
        container.classList.add("active");
      },
    }
}
</script>
<style scoped>
.letra1{
    font-size: 11px;
}
.submenutitle{
  border:3px dashed #f2f2f2;
  cursor:pointer;
  transition:1s ease;
  border-radius:5px;
}
.active{
  border:2px solid #d1d9ea;
  border-radius:5px;
  box-shadow: 5px -2px 7px rgb(125, 165, 216);
}
.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
    padding: 10px;
    border: 1px solid #f2f2f2;
    max-height: 90%;
    margin-top: -1px!important;
}
@keyframes fadeInOpacity {
    0% {
        transform: translateX(30%);
        opacity: 0;
    }
    50% {
        transform: translateX(10%);
        opacity: 0.5;
    }
    100% {
        opacity: 1;
        transform: translateX(0%);
    }
}
</style>
