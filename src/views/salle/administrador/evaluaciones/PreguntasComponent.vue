<template>
<div>
  <!--LISTADO DE Pregunta-->
  <vx-card title-color="primary" title="Banco de preguntas" subtitle="Seleccione una área y una asignatura para visualizar las preguntas">
    <!--FILTRO DE EVALUACION-->
    <div class="flex mt-5">
      <div style="width: 40%;">
        <p> <ion-icon name="contract-outline"></ion-icon>  Filtro por Evalución período</p>
      </div>
      <div style="width: 60%;">
        <!-- idperiodoescolar -->
        <v-select :options="arregloPeriodos" @input="getAreas()" :reduce="arregloPeriodos => arregloPeriodos.id" label="nombre" class="w-full" v-model="periodoSelect" />
      </div>
    </div>
    <!--FILTRO AREA Y ASIGNATURA-->
    <div class="vx-row mt-3">
      <!------------FILTROS BUSQUEDA PREGUNTAS-------------------->
      <div class="vx-col sm:w-1/2 w-full">
          Área
          <v-select :options="areas" :reduce="areas => areas" label="nombre_area" v-model="area_buscar" @input="getAsignaturasFiltro()"></v-select>
      </div>
      <div class="vx-col sm:w-1/2 w-full">
        Asignatura
        <v-select :options="asignaturas_filtro" :reduce="asignaturas_filtro => asignaturas_filtro" label="nombre_asignatura" v-model="asignatura_buscar" @input="getPreguntas()"></v-select>
      </div>
      <!------------FIN FILTROS BUSQUEDA PREGUNTAS------------------->
    </div>
    <!--TABLA DE PREGUNTAS-->
    <!-- HTML !-->
    <div class="mt-5" v-if="asignatura_buscar">
      <ul class="flex">
        <li>
          Preguntas:
        </li>
        <li class="ml-3">
          <vs-radio v-model="tipoFiltro" @input="getPreguntas()" vs-name="radios1tipoFiltro" vs-value="1">Activas</vs-radio>
        </li>
        <li class="ml-2">
          <vs-radio v-model="tipoFiltro" @input="getPreguntas()" vs-name="radios1tipoFiltro" vs-value="0">Inactivas</vs-radio>
        </li>
      </ul>
    </div>
    <vs-table class="mt-3" v-if="arregloPreguntas" multiple stripe v-model="pregSelected" pagination max-items="25" search :data="arregloPreguntas">
        <template slot="header">
          <div class="flex mt-2">
            <p><vs-chip color="primary">Cantidad {{ arregloPreguntas.length }}</vs-chip></p>
            <vs-button @click="active1!=active1; popupTipoPreg=true; editarActivo=false;  limpiar();cargarModalTipo();" size="small" style="font-size: 14px;" color="dark" class="ml-3" type="filled">Crear pregunta</vs-button>
            <button class="button-33 ml-3"  @click="openMoverPreguntas()" role="button"><ion-icon class="mt-1" name="checkmark-outline"></ion-icon>Mover Preguntas : {{ pregSelected.length  }}</button>
          </div>
        </template>
        <template slot="thead">
            <vs-th style="width: 110px;">Imagen</vs-th>
            <vs-th sort-key="pregunta">Pregunta</vs-th>
            <vs-th style="width: 170px;" sort-key="id_tipo_pregunta">Detalles</vs-th>
            <vs-th style="width: 120px;">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
                <img @click="dataPregunta = tr;popupMostrarImagen=true;" v-if="data[indextr].pregunta.img_pregunta!='' && data[indextr].pregunta.img_pregunta!='null' && data[indextr].pregunta.img_pregunta!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+data[indextr].pregunta.img_pregunta" class="img-responsive" width="100px" style="border-radius: 5px;">
                <img v-else v-bind:src="$server_url+'img/salle/img_preguntas/logos/question_mark.png'" alt="imágen de referencia" class="img-responsive" width="100px" style="border-radius: 5px;">
            </vs-td>
            <vs-td :data="data[indextr].pregunta.descripcion">
                <div class="text-justify">
                  <span v-html="data[indextr].pregunta.descripcion"></span>
                </div>
                <vs-collapse>
                  <vs-collapse-item>
                    <div slot="header"> ver opciones </div>
                      <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                      <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                      <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                      <div style="width: 100%" class="text-justify"> {{ item.opcion }}<br></div>
                      <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="100px"></div>
                    </div>
                  </vs-collapse-item>
                </vs-collapse>
            </vs-td>
            <vs-td :data="data[indextr].pregunta.nombre_tipo">
                <b>Tipo:</b>
                <p>{{data[indextr].pregunta.nombre_tipo}}</p>
                <b>Período Evaluación:</b>
                {{ data[indextr].pregunta.periodo }}<br><br>
                <b>Fecha creación:</b>
                <p>{{ tr.pregunta.created_at }}</p>
                <b>Id pregunta:</b>
                <p>{{ tr.pregunta.id_pregunta }}</p>
            </vs-td>
            <vs-td :data="data[indextr].id">
                <vx-tooltip style="display: inline-block;" text="Editar pregunta" position="top" color="primary">
                    <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="popupTipoPreg=true; editarFormulario(data[indextr]);" color="primary" type="line"></vs-button>
                </vx-tooltip>
                <!-- <vx-tooltip style="display: inline-block;" text="Eliminar pregunta" position="top" color="danger">
                    <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="id_preguntaActiva = data[indextr].pregunta.id_pregunta; confirmarEliminarPreg()" color="danger" type="line"></vs-button>
                </vx-tooltip> -->
            </vs-td>

        </vs-tr>
        </template>
    </vs-table>
    <vs-button v-else @click="active1!=active1; popupTipoPreg=true; limpiar();cargarModalTipo();" size="small" style="font-size: 14px;" color="dark" class="mt-5" type="filled">Crear pregunta</vs-button>
    <!--MODALES-->
    <!------ELEGIR TIPO PREGUNTA--------->
    <vs-popup fullscreen classContent="popup-example" title="Crear Preguntas" :active.sync="popupTipoPreg">
      <div class="flex">
        <!-------BOTONES TIPOS PREGUNTA------------>
        <div  v-if="editarActivo===false" style="width: 30%;" class="mr-2">
          <vx-card>
            <div class="text-center mb-base" >
                <h5>Tipos de pregunta</h5>
            </div>
            <div class="btn-group" align="center">
                <vs-button type="line" color="dark" class="w-full mb-1" @click="pregTipo = 5; limpiar(); cargarModalTipo(); puntaje_pregunta = 1; ">Selección simple</vs-button> <br>
                <vs-button type="line" color="dark" class="w-full mb-1" @click="pregTipo = 1; limpiar(); cargarModalTipo(); puntaje_pregunta = 1; ">Opción múltiple</vs-button> <br>
                <vs-button type="line" color="dark" class="w-full mb-1" @click="pregTipo = 3; limpiar(); cargarModalTipo(); puntaje_pregunta = 0.5">Verdadero/Falso</vs-button> <br>
                <vs-button type="line" color="dark" class="w-full mb-1" @click="pregTipo = 2; limpiar(); cargarModalTipo(); puntaje_pregunta = 2; ">Pregunta cerrada</vs-button>
            </div>
          </vx-card>
        </div>
        <!-------FIN BOTONES TIPOS PREGUNTA------------>
        <div style="width: 100%;">
          <!-------INICIO MODAL CREAR PREGUNTAS--------->
          <CrearPreguntaSalleVue
          v-if="popupTipoPreg"
          :usuario              = "usuario"
          :editarActivo         = "editarActivo"
          :guardadoActivo       = "guardadoActivo"
          :pregTipo             = "pregTipo"
          :puntaje_pregunta     = "puntaje_pregunta"
          :arregloPeriodos      = "arregloPeriodos"
          :periodoSelect        = "periodoSelect"
          :titPregTipo          = "titPregTipo"
          :txtPregTipo          = "txtPregTipo"
          :areas                = "areas"
          :asignaturas          = "asignaturas"
          :active1              = "active1"
          :area_pregunta        = "area_pregunta"
          :asignatura_pregunta  = "asignatura_pregunta"
          :preguntaSelect       = "preguntaSelect"
          @changeRecharge       = "changeRecharge"
          />
          <!-------FIN MODAL CREAR PREGUNTAS--------->
        </div>
      </div>
    </vs-popup>
    <!--MODAL PARA MOVER PREGUNTAS-->
    <vs-popup classContent="popup-example" fullscreen title="Mover Preguntas" :active.sync="popupMoverPreguntas">
      <PreguntasMoverVue v-if="popupMoverPreguntas" :pregSelected="pregSelected" :arregloPeriodos="arregloPeriodos" @changeRecharge="changeRecharge" @changeMove="changeMove" :arregloPreguntas="arregloPreguntas"/>
    </vs-popup>
     <!--MODAL PREGUNTAS MOVIDAS-->
     <vs-popup classContent="popup-example" fullscreen title="Algunas preguntas no se guardaron" :active.sync="popupIngresados">
      <p class="font-bold text-2xl text-success text-center">Se movieron {{ ingresadas }} preguntas</p>
      <vs-divider></vs-divider>
      <PreguntasTableIngresadosVue v-if="popupIngresados" :PreguntasNoIngresadas="PreguntasNoIngresadas" :arregloPeriodos="arregloPeriodos" :arregloPreguntas="arregloPreguntas"/>
    </vs-popup>
    <br><br><br><br><br><br><br><br><br><br>
    <br><br><br><br><br><br><br><br><br><br>
    <!--MODAL PARA MOSTRAR LA IMAGEN DE LA PREGUNTA-->
    <vs-popup class="holamundo" title="Mostrar imagen" fullscreen :active.sync="popupMostrarImagen">
      <div class="flex" style="justify-content: center;" v-if="popupMostrarImagen">
        <image-zoom
            :regular="$data_url+'archivos/img/salle/img_preguntas/'+dataPregunta.pregunta.img_pregunta"
            :zoom-amount="3"
            :click-zoom="true"
            click-message="De click para aumentar"
            img-class="img-fluid"
            >
        </image-zoom>
      </div>
    </vs-popup>
  </vx-card>
</div>
</template>

<script>
  import imageZoom from 'vue-image-zoomer';
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import axios from 'axios'
  import vSelect from 'vue-select'
  import $ from 'jquery'
  import PreguntasMoverVue from '@/views/salle/administrador/evaluaciones/components/Preguntas/PreguntasMover'
  import PreguntasTableIngresadosVue from './components/Preguntas/PreguntasTableIngresados.vue';
  import CrearPreguntaSalleVue from './CrearPreguntaSalle.vue';
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import {
      quillEditor
  } from "vue-quill-editor";
  export default {
    data(){
      return {
        asignatura: {id: '', label: ''},
        arregloPreguntas: [],
        editarActivo: false,
        guardadoActivo:false,
        popupEditPreg: false,
        popupTipoPreg: false,
        pregSelected: [],
        pregTipo: 1,
        titPregTipo: '',
        txtPregTipo: '',
        active1: true,
        usuario: [],
        url: '',
        id_pregunta_creada: null,
        opcionselecradio: '',
        asignaturaSelected: '',
        tipos: [
            { id: "1", label: "Opción múltiple", }, { id: "2", label: "Respuesta cerrada", }, { id: "3", label: "Verdadero/Falso", }, { id: "5", label: "Selección simple"}
        ],
        img_preg_old: '',
        areas: [{nombre_area: '',}],
        area_pregunta: {},
        asignaturas: [{nombre_asignatura: '',}],
        asignatura_pregunta: {},
        area_buscar: '',
        asignatura_buscar: '',
        asignaturas_filtro: [],
        //VARIABLES DE PERIODOS EVALUACION
        arregloPeriodos:[],
        periodoSelect:'',
        //FIN VARIABLES DE PERIODOS DE EVALUACION
        //VARIABLES PARA MOVER PREGUNTAS A OTRA EVALUACION
        popupMoverPreguntas:false,
        popupIngresados:false,
        ingresadas:0,
        PreguntasNoIngresadas:[],
        //FIN VARIABLES PARA MOVER PREGUTNAS A OTRA EVALUACION
        tipoFiltro:1,
        //variables para mostrar la imagen
        dataPregunta:'',
        popupMostrarImagen:false,
        preguntaSelect:"",
        puntaje_pregunta:1,
      }
    },
    components: {
      'v-select': vSelect,
      flatPickr,
      CrearPreguntaSalleVue,
      PreguntasMoverVue,
      quillEditor,
      PreguntasTableIngresadosVue,
      imageZoom,
    },
    created(){
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem('usuario'));
      // this.getAreas()
    },
    mounted(){
      let me = this;
      me.getPeriodosEvaluacion()
    },
    methods: {
      changeRecharge(e){
        let me = this
        if(e == 1) {
          me.popupTipoPreg = false
          me.popupMoverPreguntas = false;
        }
        //para editar
        if(e == 3)    {
          me.editarActivo = false
          me.guardadoActivo = true;
        }
        //para bloquear el boton de guardar pregunta y solo puede agregar opciones a la pregunta
        if(e == 4)    me.guardadoActivo = true;
        me.getPreguntas()
      },
      getPeriodosEvaluacion() {
        let me = this;
        this.$http.get(this.$server_url+'salle/periodos')
          .then(function (response) {
            me.arregloPeriodos = response.data;
            let getEvaluacionSelect = localStorage.EvaluacionSelectSalle
            //si ya existe el periodo seleccionado lo asigno
            if(getEvaluacionSelect){
              me.periodoSelect = parseInt(getEvaluacionSelect)
              me.getAreas()
              return
            }
            if(me.arregloPeriodos.length > 0){
              me.periodoSelect = me.arregloPeriodos[0].id
              me.getAreas()
            }
          })
          .catch(function (error) {
          })
      },
      getAreas(){
        let me                = this
        me.areas              = []
        me.asignaturas        = []
        me.arregloPreguntas   = []
        me.pregSelected       = []
        me.area_buscar        = ""
        me.asignatura_buscar  = ""
        if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
          me.$vs.notify({
          text:'Seleccione una Evaluación Período por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        this.$http.get(this.$server_url+'areas_salle')
        .then(res => {
          let datos = res.data
          if(datos.length > 0){
            me.areas = datos.filter(p => p.n_evaluacion == me.periodoSelect)
          }
        })
        .catch(function (error) {
            console.log(error);
        })
      },
      getAsignaturas(){
        let me = this
        this.$http.get(this.$server_url+'asignaturas_area_salle/' + me.area_pregunta.id_area)
        .then(res => {
            me.asignaturas = res.data;
        })
        .catch(function (error) {
            console.log(error);
        })
      },
      getAsignaturasFiltro(){
          let me = this
          me.arregloPreguntas   = []
          me.pregSelected       = []
          me.asignatura_buscar  = ""
          this.$http.get(this.$server_url+'asignaturas_area_salle/' + me.area_buscar.id_area)
          .then(res => {
              me.asignaturas_filtro = res.data;
          })
          .catch(function (error) {
              console.log(error);
          })
      },
      editarFormulario(item){
        let me                  = this;
        me.pregTipo             = item.pregunta.id_tipo_pregunta;
        me.area_pregunta        = {id_area: item.pregunta.id_area, nombre_area: item.pregunta.nombre_area}
        me.asignatura_pregunta  = {id_asignatura: item.pregunta.id_asignatura, nombre_asignatura: item.pregunta.nombre_asignatura};
        me.preguntaSelect       = item
        me.getAsignaturas()
        me.cargarModalTipo()
        me.editarActivo         = true
      },
      getPreguntas(){
        let me = this
        me.arregloPreguntas     = []
        me.asignatura_pregunta  = me.asignatura_buscar
        me.area_pregunta        = me.area_buscar
        me.pregSelected         = []
        let datos = me.asignatura_buscar.id_asignatura+'*'+me.periodoSelect+'*'+me.tipoFiltro
        me.$vs.loading()
        this.$http.get(this.$server_url+'preguntas_salle/' + datos)
        .then(res => {
          me.$vs.loading.close()
          me.arregloPreguntas = res.data.items;
          if(me.arregloPreguntas == undefined){
            me.$vs.notify({
            text:'No se encontro registros de preguntas',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
        })
      },
      limpiar(){
        this.editarActivo     = false;
        this.puntaje_pregunta = 1;
        this.preguntaSelect   = ""
        this.editarActivo =false; this.guardadoActivo = false;
        this.editarActivo =false; this.guardadoActivo = false;
        this.editarActivo =false; this.guardadoActivo = false;
        this.editarActivo =false; this.guardadoActivo = false;
      },
      confirmarEliminarPreg(){
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: 'Confirmar',
          text: '¿Está seguro de eliminar esta pregunta?',
          accept: this.eliminarPregunta
        })
      },
      eliminarPregunta(){
        let me = this;
        me.$vs.loading()
        this.$http.get(this.$server_url+`eliminar_pregunta_salle/` + me.id_preguntaActiva).then(() => {
          me.getPreguntas()
          me.$vs.notify({
              text:'Pregunta eliminada',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
          me.$vs.loading.close()
        })
        .catch(function (error) {

        })
      },
      cargarModalTipo(){
        switch (this.pregTipo) {
          case 1:
              this.titPregTipo='Crear pregunta de opción múltiple.';
              this.txtPregTipo='Esta pregunta puede tener una o varias opciones correctas. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
              break;
          case 2:
              this.titPregTipo='Crear pregunta cerrada';
              this.txtPregTipo='Esta pregunta debe ser respondida de forma escrita. La respuesta correcta debe contener palabras clave para poder comparar con la respuesta del estudiante.';
              break;
          case 3:
              this.titPregTipo='Crear pregunta de Verdadero o Falso';
              this.txtPregTipo='Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
              break;
          case 4:
              this.titPregTipo='Crear pregunta de tipo dicotómica (Si o No)';
              this.txtPregTipo='Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
              break;
          case 5:
              this.titPregTipo='Crear pregunta de selección simple';
              this.txtPregTipo='Esta pregunta puede tener solo una opción correcta. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
              break;
        }
      },
      //METODOS PARA MOVER PREGUNTAS
      openMoverPreguntas(){
        let me = this;
        if(me.pregSelected.length == 0){
          me.$vs.notify({
          text:'Seleccione preguntas para mover por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.popupMoverPreguntas = true;
      },
      changeMove(e){
        let me = this
        me.PreguntasNoIngresadas  = []
        me.popupMoverPreguntas    = false;
        me.pregSelected           = []
        me.ingresadas             = e.ingresadas
        me.PreguntasNoIngresadas  = e.PreguntasNoIngresadas
        if(me.PreguntasNoIngresadas.length > 0){
          me.popupIngresados      = true
        }
      },
      //FIN METODOS PARA MOVER PREGUNTAS
    },
    }
</script>
<style scoped>
/**BOTON SELECCIONADO */
/* CSS */
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}
</style>
