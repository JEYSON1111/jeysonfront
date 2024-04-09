<template>
  <div>
    <div>
      <vs-table max-items="50" search pagination :data="arrayReport" >
        <template slot="header">
            Cantidad: {{arrayReport.length}}
            <vs-button color="warning" size="small" class="ml-3" style="font-size: 14px;" @click="tipo= 1;activePrompt=true;">Exportar</vs-button>
        </template>
        <template slot="thead">
          <vs-th>Asesor</vs-th>
            <vs-th>Institucion</vs-th>
            <!-- <vs-th>Ciudad</vs-th> -->
            <vs-th>Cantidad de visitas</vs-th>
            <vs-th>Tipo</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{ tr.asesor }}</vs-td>
              <vs-td>
                  {{data[indextr].nombreInstitucion}}<br>
                  <small>{{tr.region}}</small>
              </vs-td>
              <!-- <vs-td>
                  {{data[indextr].ciudad}}<br>
              </vs-td> -->
              <vs-td>
                  {{data[indextr].cantidad}}<br>
              </vs-td>
              <vs-td>{{ tr.tipo }}</vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
    </vs-prompt>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'

export default {
  data() {
    return{
      arrayReport: [],
      arrayTodo: [],
      codigoSelected: [],
      //variables para el export a excel
      activePrompt:false,
      reportesActivo: 0,
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
      //fin variables para el export a excel
    }
  },
  components: {
    vSelect
  },
  mounted(){
    this.getReporte();
  },
  methods:{
    getReporte(){
      let me = this;
      me.$vs.loading()
      this.$http.get(this.$server_url+'getReporteAsesores')
        .then(function (res) {
            me.$vs.loading.close()
           me.arrayReport = res.data;
           if(me.arrayReport.length > 0){
            me.getReporteTodo();
           }
        })
        .catch(function (error) {
            me.$vs.loading.close()
            me.$vs.notify({
                title: 'Error',
                text: 'Ocurrio un error al cargar los datos',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            })
            console.log(error + ' error');
        })
    },
    getReporteTodo(){
      let me = this;
      me.arrayTodo = [];
      this.$http.get(this.$server_url+'getReporteAsesores?todo=1')
        .then(function (res) {
          let datos = res.data;
          datos = res.data;
          if(datos.length > 0){
            //voy a recorrer con un bucle y modificar con  datos.JSON.parse(tr.opciones)
            me.arrayTodo = datos.map(p => {
              p.opciones = JSON.parse(p.opciones);
              //buscar en array de arrayReport la propiedad cantidad donde sea el institucion_id igual a p.institucion_id
              let cantidad              = me.arrayReport.find(x => x.institucion_id == p.institucion_id);
              p.cantidad                = cantidad ? cantidad.cantidad : null;
              //opciones = {\"presentacion\":true,\"entrega_muestras\":false,\"reunion\":false,\"seguimiento\":false,\"cierre\":false,\"cobranza\":false,\"post_venta\":false,\"retiro_cartas\":false,\"retiro_muestras\":false,\"sinSello\":true,\"editorial\":\"\",\"otraEditorial\":false}",
              p.presentacion            = p.opciones.presentacion == true ? 'Presentacion' : '';
              p.entrega_muestras        = p.opciones.entrega_muestras == true ? 'Entrega de muestras' : '';
              p.reunion                 = p.opciones.reunion == true ? 'Reunion' : '';
              p.seguimiento             = p.opciones.seguimiento == true ? 'Seguimiento' : '';
              p.cierre                  = p.opciones.cierre == true ? 'Cierre' : '';
              p.cobranza                = p.opciones.cobranza == true ? 'Cobranza' : '';
              p.post_venta              = p.opciones.post_venta == true ? 'Post venta' : '';
              p.retiro_cartas           = p.opciones.retiro_cartas == true ? 'Retiro de cartas' : '';
              p.retiro_muestras         = p.opciones.retiro_muestras == true ? 'Retiro de muestras' : '';
              p.sinSello                = p.opciones.sinSello == true ? 'Sin sello' : 'Con sello';
              p.editorial               = p.opciones.editorial;
              p.otraEditorial           = p.opciones.otraEditorial == true ? 'Otra editorial' : '';
              p.otraEditorialText       = p.opciones.otraEditorialText;
              return p;
            })
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    //METODOS PARA EXCEL
    //para limipiar los campos del excel
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xlsx'
    },
      //metodo par descargar el excel
      exportToExcel() {
        let headerTitle = ['Asesor','Institucion','Ciclo Escolar','Sello','Estado','Observaciones','Fecha Creación','Fecha finalización','Visitas','Tipo'];
        let headerVal = ['asesor','nombreInstitucion','cicloEscolar','sinSello','estadoAgenda','observaciones2','startDate','fecha_que_visita','cantidad','tipo'];
        let codigoSelectedMayus = this.arrayTodo;
        for (var i = 0; i < codigoSelectedMayus.length; i++) {
            for (var key in codigoSelectedMayus[i]) {
                if (typeof codigoSelectedMayus[i][key] == "string") {
                    codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                }
            }
        }
        import('@/vendor/Export2Excel').then(excel => {
            const list = codigoSelectedMayus
            const data = this.formatJson(headerVal, list)
            var nombrefile = ""
            nombrefile = this.fileName
            // if(this.openModal == 1){
            //     nombrefile = this.fileName
            // }else{
            //     nombrefile = "Reporte de asesores"
            // }
            excel.export_json_to_excel({
                header: headerTitle,
                data,
                filename: nombrefile,
                autoWidth: this.cellAutoWidth,
                bookType: this.selectedFormat
            })
            this.clearFields()
            this.guardarActivo = '';
            this.generarActivo = ' ';
            this.textAlertCant = '';
            this.cantidad = '';
            this.codigoSelected = [];
        })
    },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
      },
  }
}
</script>
