<template>
  <vx-card
  title="Generaración de códigos"
  title-color="primary" subtitle="Ingrese el valor de los libros que desea generar"
  >
  <p class="text-success font-bold"><i class="fa-solid fa-code"></i> {{sumaSelect}} códigos seleccionados</p>
  <vs-divider></vs-divider>
  <vs-alert class="mt-4" v-if="(porcentaje > 0)">Se generaron {{porcentaje}} codigos</vs-alert>
  <div class="flex">
    <vs-button color="success" class="mt-5"  type="gradient" @click="openConfirm()">Generar códigos</vs-button>
    <vs-button color="warning" class="mt-5 ml-2" type="gradient" @click="getLibros()">Resetear</vs-button>
    <ul class="flex ml-4" style="margin-top: 30px;">
      <li>
        <vs-radio v-model="estado_codigo_fisico" vs-name="radios1" vs-value="2">Desprendido</vs-radio>
      </li>
      <li>
        <vs-radio v-model="estado_codigo_fisico" class="ml-2" vs-name="radios1" vs-value="1">Liquidado</vs-radio>
      </li>
    </ul>
  </div>
    <vs-table max-items="50" search pagination :data="arregloLibros">
      <template slot="header">
        <div>
        <p>Cantidad: <span>{{arregloLibros.length}}</span> </p>
        </div>
      </template>
      <template slot="thead">
          <vs-th>Libro</vs-th>
          <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{ tr.nombrelibro }} <br>
            <small>{{tr.codigo_liquidacion}}</small>
          </vs-td>
          <vs-td>
            <vs-input icon-after="true" label-placeholder="icon-after" min="0" type="number" icon="mode_edit" placeholder="Cantidad a generar" v-model="tr.cantidad"/>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--MODALES-->
    <vs-popup class="holamundo"  :title="porcentaje +' Codigos generados'" :active.sync="verCodigos">
      <vs-table max-items="10" search pagination :data="codigosVerificados">
          <template slot="header">
            <vs-chip color="primary">Cantidad: {{codigosVerificados.length}}</vs-chip>
          </template>
          <template slot="thead">
            <vs-th>Codigo</vs-th>
            <vs-th>libro</vs-th>
            <vs-th>Fecha create</vs-th>
            <vs-th>Estado fisico</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{data[indextr].codigo}}<br>
              </vs-td>
              <vs-td>
                {{data[indextr].libro}}<br>
              </vs-td>
              <vs-td>
                {{data[indextr].fecha_create}}<br>
              </vs-td>
              <vs-td>
                <vs-chip color="primary" v-if="tr.estado_codigo_fisico == 1">Uso Liquidado</vs-chip>
                <vs-chip color="success" v-if="tr.estado_codigo_fisico == 2">Uso Desprendidos</vs-chip>
                <vs-chip v-if="tr.estado_codigo_fisico == 0">uso normal</vs-chip>
              </vs-td>
            </vs-tr>
          </template>
      </vs-table>
    </vs-popup>
  </vx-card>
</template>
<script>
export default{
  name:'GenerateCodigosVue',
  data(){
    return{
      usuario:[],
      arregloLibros:[],
      codigosGenerado:[],
      codigosVerificados:[],
      estado_codigo_fisico:2,
      verCodigos:false,
      porcentaje:0,
      //variables de excel
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
    }
  },
  computed:{
    sumaSelect(){
        let me = this;
        let filter = []
        var suma = 0;
        filter = me.arregloLibros.filter(p => p.cantidad > 0)
        if(filter.length >0){
            let total = filter.reduce((a, b) => parseInt(a) + parseInt((b["cantidad"] || 0)), 0);
            suma = suma+ total;
        }else{
            return 0;
        }
        return suma;
    },
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.getLibros()
  },
  methods:{
    getLibros() {
      let me = this
      me.porcentaje = 0;
      this.$http.get(this.$server_url+`libros_series`).then(res => {
        me.arregloLibros = res.data;
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    openConfirm(){
      this.porcentaje = 0;
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirm`,
        text: 'Esta seguro de generar estos códigos?',
        accept:this.generarCodigos
      })
    },
    generarCodigos(){
      let me = this;
      let formData = new FormData();
      //enviar solo los que tienen mayor a 0
      let filter = []
      filter = me.arregloLibros.filter(p => p.cantidad > 0)
      formData.append('responsable',  me.usuario.idusuario);
      formData.append('data_codigos', JSON.stringify(filter));
      formData.append('estado_codigo_fisico',me.estado_codigo_fisico)
      me.$vs.loading()
        this.$http.post(this.$server_url+'generarCodigosUnicos', formData)
        .then(res => {
          me.$vs.loading.close()
          me.codigosGenerado = res.data.codigos
          me.codigosVerificados = res.data.codigosVerificados
          if(me.codigosVerificados.length > 0){
            me.verCodigos = true;
          }
          me.porcentaje      = res.data.porcentaje
          me.exportToExcel()
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'
        })
        .catch(function (error) {
            me.$vs.loading.close()
        })
      })
    },
    exportToExcel() {
      let headerTitle = ['codigo','libro'];
      let headerVal = ['codigo', 'libro',];
      let codigoSelectedMayus = this.codigosGenerado
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
        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: 'Codigos generados',
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
