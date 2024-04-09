<template>
  <vx-card
  v-if="promedio_instituciones.length > 0"
  title="Cantidad evaluaciones"
  title-color="#C3CAE1"
  class="mt-5"
  > 
  <table class="styled-table">
      <thead>
          <tr>
              <th></th>
              <th> <ion-icon style="font-size:18px;position:relative;top:3px;" name="document-text-outline"></ion-icon> Total Evaluaciones</th>
              <th>Promedio</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(item,key) in promedio_instituciones" :key="key">
              <td>{{ item.nombreInstitucion }}</td>
              <td>{{ item.cant_evaluaciones }}</td>
              <td>{{ item.puntaje }}</td>
          </tr>
      </tbody>
  </table>
  </vx-card>
</template>
<script>
import moment from 'moment'
export default{
  data(){
    return{
      //VARIABLES NORMALES
      promedio_instituciones: [],
    }
  },
  props:{
    n_evaluacion:{
      type:Number,
      default:0
    },
  },
  watch:{
    n_evaluacion(results){
      let me = this;
      if(results == null || results == "null" || results == "" || results == undefined ){
        me.promedio_instituciones = []
        return
      }
      me.getReporteInstituciones()
    }
  },
  created(){
      let me = this;
  },
  mounted(){
    let me = this
    // me.getReporteInstituciones()
  },
  methods:{
    getReporteInstituciones(){
      let me = this
      me.promedio_instituciones = []
      me.$vs.loading()
      this.$http.get(this.$server_url+'reporte_evaluaciones_institucion/'+me.n_evaluacion)
      .then(res => {
        me.$vs.loading.close()
        me.promedio_instituciones = res.data.items
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
  }
}
</script>
<style scoped>
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
  background-color: #50c78e;
  color: #ffffff;
  text-align: left;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}
.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}
</style>
