<template>
  <div>
    <div>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12" >
          <vs-card>
            <div class="header">
              <p style="font-weight: bold;" class="text-2xl">Resumen de la importación: </p>
              <!--RESUMENT TOTAL CANTIDAD-->
              <div class="flex justify-center mt-4" style="font-size:10px;">
                <ul class="features flex justify-center">
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Total Códigos Activación Importados: {{ sumaIngresadosA }} </strong></span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Total Códigos Diágnostico Importados: {{ sumaIngresadosD }} </strong></span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Total Importados: {{ sumaIngresadosA + sumaIngresadosD }} </strong></span>
                  </li>
                  <li v-if="sumaNoIngresados > 0">
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Códigos No ingresados: {{ sumaNoIngresados }} </strong></span>
                  </li>
                  <!--NO EXISTEN-->
                  <li v-if="sumaNoExisteA > 0">
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span class="text-danger"><strong>Total Códigos Activación No existen: {{ sumaNoExisteA }} </strong></span>
                  </li>
                  <li v-if="sumaNoExisteD > 0">
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span class="text-danger"><strong>Total Códigos Diágnostico No existen: {{ sumaNoExisteD }} </strong></span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Total paquetes: {{ arregloFormatoSend.length }} </strong></span>
                  </li>
                </ul>
              </div>
              <!--FIN DE TOTAL DE CODIGOS-->
              <!--RESUMEN DE LA TABLA-->
              <table class="tabla" v-if="verTabla">
                  <tr>
                    <th class="th1">Paquete</th>
                    <th class="th1" v-if="desdeRevision == 0">Problemas</th>
                    <th class="th1">{{desdeRevision == 0 ? 'Ingresados' : 'Códigos'}}</th>
                  </tr>
                  <tr v-for="(item,key) in arregloResumen" :key="key">
                    <td class="td1" style="border: 1px solid #f2f2f2;">
                      {{item.codigoPaquete}}
                      <div class="flex justify-center mt-1">
                        <vs-chip color="danger" v-if="item.mensaje == '1'">No existe el paquete</vs-chip>
                      </div>
                    </td>
                    <vs-td  v-if="desdeRevision == 0" height="40%" width="50%" style="border: 1px solid #f2f2f2;">
                      <div class="overflow-y-auto h-24" v-if="item.codigosHijos.length > 0">
                        <tr>
                          <th class="th2" style="font-size:10px;">Codigo activacion</th>
                          <th class="th2">Codigo diagnostico</th>
                          <th class="th2">Problema</th>
                        </tr>
                        <tr color="primary" :key="index" v-for="(item2,index) in item.codigosHijos">
                          <td class="td2">{{ item2.codigoActivacion }}</td>
                          <td class="td2">{{ item2.codigoDiagnostico }}</td>
                          <td class="td2">{{ item2.problema }}</td>
                        </tr>
                      </div>
                      <div v-else>
                        <p class="text-center">No hay problemas</p>
                      </div>
                    </vs-td>
                    <vs-td class="tdingreso">
                      <ul class="features flex justify-center">
                        <li>
                          <span class="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                            </svg>
                          </span>
                          <span><strong>Códigos Activación Importados: {{ item.ingresoA }} </strong></span>
                        </li>
                        <li>
                          <span class="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                            </svg>
                          </span>
                          <span><strong>Códigos Diágnostico Importados: {{ item.ingresoD }} </strong></span>
                        </li>
                        <li>
                          <span class="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                            </svg>
                          </span>
                          <span><strong>Total Importados: {{ item.ingresoA+ item.ingresoD }} </strong></span>
                        </li>
                        <!--NO EXISTEN-->
                        <li v-if="item.noExisteA > 0">
                          <span class="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                            </svg>
                          </span>
                          <span class="text-danger"><strong>Códigos Activación No existen: {{ item.noExisteA }} </strong></span>
                        </li>
                        <li v-if="item.noExisteD > 0">
                          <span class="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                            </svg>
                          </span>
                          <span class="text-danger"><strong>Códigos Diágnostico No existen: {{ item.noExisteD }} </strong></span>
                        </li>
                      </ul>
                    </vs-td>
                  </tr>
              </table>
            </div>
          </vs-card>
        </vs-col>
      </vs-row>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      verTabla:false
    }
  },
  props:{
    arregloResumen:{
      type:Array,
      default:function(){
        return []
      }
    },
    arregloFormatoSend:{
      type:Array,
      default:function(){
        return []
      }
    },
    desdeRevision:{
      type:Number,
      default:function(){
        return 0
      }
    }
  },
  computed:{
    sumaIngresadosA(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosA = me.arregloResumen.filter(p => p.ingresoA)
        let resultado = datosA.reduce((a, b) => a + (b["ingresoA"] || 0), 0);
        return resultado
      }
    },
    sumaIngresadosD(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosD    = me.arregloResumen.filter(p => p.ingresoD)
        let resultado = datosD.reduce((a, b) => a + (b["ingresoD"] || 0), 0);
        return resultado
      }
    },
    sumaNoIngresados(){
      let me = this;
      if(me.arregloResumen.length > 0){
        //activacion
        let datosA = me.arregloResumen.filter(p => p.ingresoA)
        let resultadoA = datosA.reduce((a, b) => a + (b["ingresoA"] || 0), 0);
        //diagnostico
        let datosD     = me.arregloResumen.filter(p => p.ingresoD)
        let resultadoD = datosD.reduce((a, b) => a + (b["ingresoD"] || 0), 0);
        let total      = me.totalCodigos - (resultadoA + resultadoD)
        return total
      }
    },
    sumaNoExisteA(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosD    = me.arregloResumen.filter(p => p.noExisteA)
        let resultado = datosD.reduce((a, b) => a + (b["noExisteA"] || 0), 0);
        return resultado
      }
    },
    sumaNoExisteD(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosD    = me.arregloResumen.filter(p => p.noExisteD)
        let resultado = datosD.reduce((a, b) => a + (b["noExisteD"] || 0), 0);
        return resultado
      }
    },
  },
  mounted(){
    let me = this;
    if(me.arregloResumen.length > 0){
      me.actulizarTabla()
    }
  },
  methods:{
    actulizarTabla(){
      let me = this;
      me.arregloResumen.forEach((item) => {
        if(item.codigosHijos.length > 0){
          me.verTabla = true
        }else{
        }
      })
    }
  }
}
</script>
<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {

  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #E3AC6B;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
.th2{
  color:#93938F;
  font-size: 10px;
  background-color: #E7E7BF;
  text-align: center;
  padding: 8px;
  border-radius: 5px;
}
.td2{
  font-size: 10px;
  padding: 5px;
}
.tdingreso{
  border: 1px solid #f2f2f2;border-radius:5px;padding:10px;font-size:8px;
}
/*CSS IMPORTADOR TIPO BODEGA*/

.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}
</style>
