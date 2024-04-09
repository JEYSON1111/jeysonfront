<template>
    <div>
        <vx-card v-bind:title="titPregTipo" title-color="primary" v-bind:subtitle="txtPregTipo">
            <vs-tabs alignment="fixed">
              <vs-tab label="Pregunta">
                <div class="vx-row">
                  <div class="flex justify-center">
                    <p v-for="(item,key) in arregloPeriodos" :key="key">
                      <vs-chip class="ml-2" v-if="item.id == periodoSelect">Período Evaluación Seleccionada: <b class="ml-1">{{ item.nombre }}</b></vs-chip>
                    </p>
                    <br>
                  </div>
                </div>
                  <div class="vx-row mb-5 mt-4">
                    <!------------SELEC TEMA PREGUNTA-------------------->
                    <div class="vx-col sm:w-1/2 w-full">
                      Área
                      <v-select :options="areas" :reduce="areas => areas" label="nombre_area" v-model="area_pregunta" @input="getAsignaturas()"></v-select>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        Asignatura
                        <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombre_asignatura" v-model="asignatura_pregunta"></v-select>
                    </div>
                    <!------------FIN SELEC TEMA PREGUNTA-------------------->
                  </div>
                  <div class="vx-row mb-5">
                      <div class="vx-col w-full">
                          <div style="border: 1px solid #d5d5d5; border-radius: 10px; padding: 5px 5px 5px 5px;" align="center" class="mb-2">
                              <input type="file" name="file1" id="file1" class="inputfile" style="display: none;" v-on:change="mostrarImg(1,1)">
                              <label for="file1" style="margin-bottom: -10px; margin-right: 10px; cursor: pointer; color: gray; width: 49%; font-size: 11px; line-height: 80%;">
                                  Click aquí para subir imagen
                              </label>
                              <label @click="quitarImagen(1)" style="margin-bottom: -10px; margin-left: 10px; cursor: pointer; color: red; width: 49%; font-size: 11px;">
                                  Click aquí para quitar imagen
                              </label>
                              <div v-if="src_imagen_pregunta==='' || src_imagen_pregunta===null || src_imagen_pregunta==='null' || src_imagen_pregunta===this.$server_url+'img/salle/img_preguntas/null'"></div>
                              <img id="img1" class="img-responsive mb-2" v-bind:src="src_imagen_pregunta" style="max-width: 400px; border-radius: 5px;" v-else>
                          </div>
                      </div>
                      <div class="vx-col w-full mt-3">
                        <p>Nombre Pregunta</p>
                        <quill-editor class="w-full h-25 alto mt-2" style="height:80px;" v-model="pregunta.descripcion"></quill-editor>
                      </div>
                      <div class="vx-col sm:w-1/4 w-full" style="margin-top: 50px;">
                          <vs-input disabled type="number" class="mb-4 w-full mt-5" label="Puntaje" placeholder="Puntaje" v-model="puntaje_pregunta"/>
                      </div>
                      <div v-if="editarActivo===true" class="vx-col sm:w-1/4 w-full pt-5" align="center" style="margin-top: 50px;">
                        <vs-switch  color="success" @input="CambiarEstadoPreguntaSalle()" v-model="activoPregunta">
                          <span slot="on">Activado</span>
                          <span slot="off">Desactivado</span>
                        </vs-switch>
                      </div>
                      <div class="vx-col sm:w-1/4 w-full pt-5" align="center" style="margin-top: 50px;">
                          <vs-button class="w-full mt-5 p-3" title="Transformar pregunta a respuesta simple o viceversa" icon-pack="feather" icon="icon-loader" color="warning" @click="transformarPregunta()"> Transformar pregunta </vs-button>
                      </div>
                      <div class="vx-col sm:w-1/4 w-full mb-2" align="right" style="margin-top: 50px;">
                          <div v-if="editarActivo">
                              <vs-button class="w-full mt-10" @click="editarPregunta" type="filled">Editar pregunta</vs-button>
                          </div>
                          <div v-else>
                              <vs-button class="w-full mt-10" v-if="guardadoActivo == false" color="success" type="filled" @click="agregar()">Guardar pregunta</vs-button>
                          </div>
                      </div>
                  </div>
              </vs-tab>
              <!-------INICIO TAB OPCIONES PREG TIPO 1, 5----->
              <vs-tab label="Opciones" v-if="pregTipo===1 || pregTipo===5">
                  <div class="vx-col w-full mb-2" style="padding: 10px;">
                    <div class="vx-row">
                      <div class="flex justify-center">
                        <p v-for="(item,key) in arregloPeriodos" :key="key">
                          <vs-chip class="ml-2" v-if="item.id == periodoSelect">Período Evaluación Seleccionada: <b class="ml-1">{{ item.nombre }}</b></vs-chip>
                        </p>
                        <br>
                      </div>
                    </div>
                  <vs-divider position="left" color="success">Crear opciones</vs-divider>
                  <div class="vx-row mb-2" id="editar">
                      <div class="vx-col w-full mb-1">
                          <div style="border: 1px solid #d5d5d5; border-radius: 5px; padding: 5px 5px 5px 5px;" align="center">
                              <input type="file" name="file2" id="file2" class="inputfile" style="display: none;" v-on:change="mostrarImg(2,2)">
                              <label for="file2" style="margin-bottom: -10px; margin-right: 10px; cursor: pointer; color: gray; width: 49%; font-size: 11px;">
                                  Click aquí para subir imagen
                              </label>
                              <label @click="quitarImagen(2)" style="margin-bottom: -10px; margin-left: 10px; cursor: pointer; color: red; width: 49%; font-size: 11px;">
                                  Click aquí para quitar imagen
                              </label>
                              <div v-if="src_imagen_opcion==='' || src_imagen_opcion===null || src_imagen_opcion==='null' || src_imagen_opcion===this.$server_url+'archivos/img/salle/img_preguntas/'"></div>
                              <img id="img2" style="max-width: 400px; border-radius: 5px;" class="img-responsive mb-2" v-bind:src="src_imagen_opcion" v-else>
                          </div>
                          <vs-textarea class="mt-2" label="Nombre Opción" v-model="opcion.opcion" height="60px"/>
                      </div>
                      <div class="vx-row w-full" v-if="pregTipo===1 || pregTipo===5">
                          <div class="vx-col sm:w-1/2 w-full" align="center">
                              <vs-switch style="width: 100px;" color="success" class="mt-3 mb-5" v-model="opcion.tipo">
                                  <span slot="on">Correcta</span>
                                  <span slot="off">Incorrecta</span>
                              </vs-switch>
                          </div>
                          <div class="vx-col sm:w-1/2 w-full mb-1" align="center">
                              <vs-button v-if="editarOpcionActiva===false" color="success" type="flat" icon-pack="feather" icon="icon-plus" @click="cargarOpcion()">Agregar</vs-button>
                              <vs-button v-else color="primary" class="w-full" type="flat" icon-pack="feather" icon="icon-save" @click="confirmEditarOpcion(opcion)">Actualizar Opción</vs-button>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div class="vx-col w-full">
                  <vs-divider position="center" color="primary">Opciones agregadas</vs-divider>
                  <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">
                      <div class="vx-col sm:w-1/5 w-full" align="center">
                        <img v-if="item.img_opcion" style="border-radius: 5px;" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion" width="100%">
                      </div>
                      <div class="vx-col sm:w-4/5 w-full text-center">
                          {{item.opcion}}
                          <div class="vx-row" align="center">
                          <div class="vx-col sm:w-1/3 w-full">
                              <vs-switch style="width: 100px;" disabled="true" color="success" class="mt-3 mb-5" v-model="item.tipo">
                                  <span slot="on">Correcta</span>
                                  <span slot="off">Incorrecta</span>
                              </vs-switch>
                          </div>
                          <div class="vx-col sm:w-1/3 w-full">
                              <vs-button color="primary" type="line" icon-pack="feather" icon="icon-edit-1" size="small" @click="editarOpcionActiva=true; editarOpcion(item)">Editar</vs-button>
                          </div>
                          <div class="vx-col sm:w-1/3 w-full">
                              <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="quitarOpcion(item)">Eliminar</vs-button>
                          </div>
                          </div>
                          <vs-divider></vs-divider>
                      </div>
                  </div>
                  </div>
              </vs-tab>
              <!-------FIN TAB OPCIONES PREG TIPO 1, 5----->
              <!-------INICIO TAB OPCIONES PREG TIPO 3, 4----->
              <vs-tab label="Respuesta" v-if="pregTipo===3 || pregTipo===4">
                  <div v-if="pregTipo===3" class="mt-6">
                  <div>
                      <vx-card class="mb-4 mt-6">
                          <vs-radio v-model="opcion.opcion" vs-name="radios1opcion" vs-value="Verdadero">Verdadero</vs-radio>
                      </vx-card>
                      <vx-card class="mb-4">
                          <vs-radio v-model="opcion.opcion" vs-name="radios1opcion" vs-value="Falso">Falso</vs-radio>
                      </vx-card>
                  </div>
                  </div>
                  <div class="vx-col w-full mt-6" align="right">
                      <vs-button  color="primary" type="filled" icon-pack="feather" icon="icon-edit-1" @click="editarOpcionesVF()">Guardar opción</vs-button>
                      <!-- <vs-button v-else color="success" type="filled" @click="editarActivo=true;cargarOpcionesVF()">Guardar</vs-button> -->
                  </div>
              </vs-tab>
              <!-------FIN TAB OPCIONES PREG TIPO 3, 4----->
              <!-------INICIO TAB OPCIONES PREG CERRADA-------->
              <vs-tab label="Palabras Clave" v-if="pregTipo===2">
                  <div class="vx-row mt-6">
                      <div class="vx-col w-full">
                          <vs-alert :active.sync="active1" closable icon-pack="feather" close-icon="icon-x" class="mb-3">
                              Ejemplo: Forma correcta: <span style="color: green;">24, mayo, 1822</span> - Forma Incorrecta: <span style="color: red;">24 de mayo, 1822 </span>
                          </vs-alert>
                          <div style="color: #1A76FA;" class="mb-4 w-full">Evite usar caracteres especiales como: punto, signos de expresión etc...</div>
                          <vs-textarea class="mb-3" label="Palabras clave de la respuesta" placeholder="Escriba las palabras clave de la respuesta separadas por una coma (,)." v-model="palabras_clave"  height="70px"/>
                      </div>
                  </div>
                  <div class="vx-row w-full">
                      <div class="vx-col sm:w-1/2 w-full">
                          <vs-input type="number" class="mb-2 w-full" label="Cantidad de coincidencias" v-model="pregunta.cant_coincidencias"/>
                      </div>
                      <div class="vx-col sm:w-1/2 w-full mt-5">
                          <vs-button class="w-full" v-if="editarActivo===true" @click="editarPalabrasclave" type="filled">Editar</vs-button>
                          <vs-button class="w-full" v-else @click="cargarOpcionAbierta" color="success" type="filled">Guardar</vs-button>
                      </div>
                  </div>
              </vs-tab>
              <!------FIN TAB OPCION TIPO PREG ABIERTA----->
            </vs-tabs>
          </vx-card>
    </div>
</template>
<script>
  import axios from 'axios'
  import vSelect from 'vue-select'
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import {
      quillEditor
  } from "vue-quill-editor";
export default{
    components:{
        quillEditor,
        vSelect,
    },
    data(){
        return{
            pregunta: {descripcion: '', tema: {id: '', label: ''}, respuesta: '', opcion1: '', opcion2: '', opcion3: '', img_pregunta: '', img_respuesta: '', img_opcion1: '', img_opcion2: '', img_opcion3: '', puntaje_pregunta: '', cant_coincidencias: 0},
            opcion: {id_opcion_pregunta: '', id_pregunta: '', opcion: '', img_opcion: '', tipo: ''},
            opciones: [],
            img_opcion_old:'',
            src_imagen_opcion:'',
            src_imagen_pregunta:'',
            activoPregunta:true,
            id_opcion_tipo234:'',
            palabras_clave:'',
            editarOpcionActiva:false,
            id_preguntaActiva: '',
        }
    },
    props:{
        usuario:{
            type:Object,
            default:{}
        },
        arregloPeriodos:{
            type:Array,
            default:[]
        },
        periodoSelect:{
            type:String,
            default:""
        },
        editarActivo:{
            type:Boolean,
            default:false,
        },
        guardadoActivo:{
            type:Boolean,
            default:false
        },
        pregTipo:{
            type:Number,
            default:1
        },
        titPregTipo:{
            type:String,
            default:""
        },
        txtPregTipo:{
            type:String,
            default:""
        },
        areas:{
            type:Array,
            default:[]
        },
        asignaturas:{
            type:Array,
            default:[]
        },
        active1:{
            type:Boolean,
            default:false,
        },
        area_pregunta:{
            type:Object,
            default:{}
        },
        asignatura_pregunta:{
            type:Object,
            default:{}
        },
        preguntaSelect:{
            type:String,
            default:""
        },
        puntaje_pregunta:{
            type:Number,
            default:1
        },
    },
    watch:{
        guardadoActivo(results){
            if(results == false){
                console.log("aaaak")
                this.limpiar()
            }
        },
    },
    mounted(){
        let me = this
        this.limpiar()
        if(me.editarActivo){
            me.editarFormulario()
        }
    },
    methods:{
        editarFormulario(){
            let me = this;
            let dataE               = me.preguntaSelect
            console.log("aaa",dataE)
            if(dataE.pregunta.estado == 1){
            me.activoPregunta               = true
            }else{
            me.activoPregunta               = false
            }
            me.pregunta                     = dataE.pregunta
            me.id_preguntaActiva            = dataE.pregunta.id_pregunta;
            me.img_preg_old                 = dataE.pregunta.img_pregunta;
            if(dataE.pregunta.img_pregunta!=''){
                me.src_imagen_pregunta = this.$data_url+'archivos/img/salle/img_preguntas/'+dataE.pregunta.img_pregunta;
            }
            ///mostrar opciones
            if(me.pregTipo == 3){
            if(dataE.opciones.length > 0){
                let preOpciones             = dataE.opciones.filter(p => p.tipo == '1')
                me.opcion                   = preOpciones[0]
            }
            }else{
            me.opcion = {}
            }
            me.opciones                     = dataE.opciones
            if(dataE.opciones.length > 0){
            me.palabras_clave               = dataE.opciones[0].opcion;
            me.pregunta.cant_coincidencias  = dataE.opciones[0].cant_coincidencias;
            me.id_opcion_tipo234            = dataE.opciones[0].id_opcion_pregunta;
            }
        },
        agregar(){
            let me = this;
            if( me.pregunta.descripcion.trim() === '' || me.puntaje_pregunta === '' || me.puntaje_pregunta === undefined || me.asignatura_pregunta === null || me.asignatura_pregunta === undefined){
            me.$vs.notify({
            text:'Debe completar todos los campos antes de guardar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
            return;
            }
            if( me.asignatura_pregunta.id_asignatura === '' || me.asignatura_pregunta.id_asignatura === undefined ){
            me.$vs.notify({
            text:'Seleccione una asignatura antes de guardar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
            return;
            }
            me.$vs.loading()
            let fileImgPreg
            fileImgPreg = document.getElementById("file1").files[0];
            me.pregunta.file1 = fileImgPreg;
            const formData = new FormData();
            formData.append('descripcion',      me.pregunta.descripcion);
            formData.append('img_pregunta',     fileImgPreg);
            formData.append('id_tipo_pregunta', me.pregTipo);
            formData.append('id_asignatura',    me.asignatura_pregunta.id_asignatura);
            formData.append('puntaje_pregunta', me.puntaje_pregunta);
            formData.append('editor',           me.usuario.idusuario);
            formData.append('n_evaluacion',     me.periodoSelect)
            formData.append('estado',           1)
            axios.post(this.$data_url+'api/preguntas_salle', formData)
            .then(res => {
                me.id_preguntaActiva    = res.data.id_pregunta;
                me.$vs.loading.close()
                me.$emit('changeRecharge',4)
                me.$vs.notify({
                text:'Pregunta creada exitosamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error + ': error al crear pregunta');
            })
        },
        editarPregunta(){
            let me = this;
            if( me.pregunta.descripcion.trim() === '' || me.puntaje_pregunta === '' || me.puntaje_pregunta === undefined || me.asignatura_pregunta === null || me.asignatura_pregunta === undefined){
            me.$vs.notify({
                text:'Debe completar todos los campos antes de guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
            return;
            }
            if( me.asignatura_pregunta.id_asignatura === '' || me.asignatura_pregunta.id_asignatura === undefined ){
            me.$vs.notify({
                text:'Seleccione una asignatura antes de guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
            return;
            }
            me.$vs.loading()
            let fileImgPreg = document.getElementById("file1").files[0];
            if(fileImgPreg === undefined ){
                fileImgPreg = me.pregunta.img_pregunta;
            }
            const formData = new FormData();
            formData.append('id_pregunta',      me.pregunta.id_pregunta);
            formData.append('id_tipo_pregunta', me.pregTipo);
            formData.append('id_asignatura',    me.asignatura_pregunta.id_asignatura);
            formData.append('descripcion',      me.pregunta.descripcion);
            formData.append('img_pregunta',     fileImgPreg);
            formData.append('img_pregunta_old', me.img_preg_old);
            formData.append('puntaje_pregunta', me.puntaje_pregunta);
            formData.append('editor',           me.usuario.idusuario);
            formData.append('n_evaluacion',     me.periodoSelect);
            formData.append('estado',           me.pregunta.estado)
            axios.post(this.$data_url+'api/preguntas_salle', formData).then(res => {
            me.$emit('changeRecharge',2)
            me.img_preg_old = res.data.img_pregunta
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Pregunta editada correctamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
                me.$vs.loading.close()
            })
        },
        limpiar(){
            let me = this;
            this.src_imagen_pregunta        = '';
            this.src_imagen_opcion          = '';
            this.opciones                   = [];
            this.pregunta.descripcion       = '';
            this.pregunta.cant_coincidencias='';
            this.pregunta.opcion            = '';
            this.opcion.opcion              = '';
            this.opcion.tipo                = '';
            this.palabras_clave             = '';
            this.editarOpcionActiva         = false
            this.id_preguntaActiva          = '';
        },
        editarOpcion(item){
            let me                          = this;
            //cargar formulario de opciones
            me.img_opcion_old               = ""
            location.href                   = '#editar'
            me.img_opcion_old               = item.img_opcion
            document.getElementById("file2").value = '';
            me.opcion                       = item
            me.src_imagen_opcion            = this.$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion;
        },
        confirmEditarOpcion(item){
            let me                          = this;
            me.editarOpcionActiva           = false;
            let fileImgOpcion;
            fileImgOpcion = document.getElementById("file2").files[0];
            if(fileImgOpcion === undefined ){
                fileImgOpcion = item.img_opcion;
            }
            let tipo = 0;
            if( me.opcion.tipo === true || me.opcion.tipo === 1 ){
                tipo = 1;
            }
            const formData = new FormData();
            formData.append('opcion',               me.opcion.opcion);
            formData.append('tipo',                 tipo);
            formData.append('img_opcion',           fileImgOpcion);
            formData.append('img_opcion_old',       me.img_opcion_old);
            formData.append('id_opcion_pregunta',   item.id_opcion_pregunta);
            formData.append('id_pregunta',          item.id_pregunta);
            formData.append('cant_coincidencias',   0);
            formData.append('n_evaluacion',         me.periodoSelect);
            axios.post(this.$data_url+'api/editar_opcion_salle', formData)
            .then(res => {
                me.opciones             = res.data;
                me.editarOpcionActiva   = false;
                me.opcion.opcion        = '';
                me.opcion.tipo          = '';
                me.src_imagen_opcion    = '';
                me.$emit('changeRecharge',2)
                me.$vs.notify({
                text:'Opción editada correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        mostrarImg(file, img){
            let me                  = this;
            me.src_imagen_opcion    = ' ';
            me.src_imagen_pregunta  = ' ';
            var archivo = document.getElementById("file"+file).files[0];
            var reader = new FileReader();
            if (me) {
                reader.readAsDataURL(archivo );
                reader.onloadend = function () {
                    document.getElementById("img"+img).src = reader.result;
                }
            }
        },
        quitarOpcion(item){
            let me = this;
            axios.get(this.$data_url+'api/quitar_opcion_salle/'+item.id_opcion_pregunta)
            .then(res => {
                me.removeItemFromArr(me.opciones, item)
                me.$emit('changeRecharge',2)
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        removeItemFromArr (arr, item) {
          const i = arr.indexOf(item)
          arr.splice(i, 1)
        },
        quitarImagen(id){
          let me = this
          document.getElementById('file' + id).value = null;
          if( document.getElementById("img" + id) ){
            document.getElementById("img" + id).src = '';
          }
          if( id === 1 ){
            me.img_preg_old = ''
          }else{
            me.img_opcion_old = ''
          }
        },
        editarPalabrasclave(){
          let me = this;
          if( me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0){
              me.$vs.notify({
              text:'Ingrese la cantidad de coincidencias de palabras clave.',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return
          }
          var cantCoin = parseInt(me.pregunta.cant_coincidencias)
          if( me.id_opcion_tipo234 != '' ){
              let palabrasV = me.palabras_clave.replace(/ /gi, '')
              const formData = new FormData();
              formData.append('opcion', palabrasV);
              formData.append('tipo', 1);
              formData.append('img_opcion', '');
              formData.append('img_opcion_old', '');
              formData.append('id_opcion_pregunta', me.id_opcion_tipo234);
              formData.append('id_pregunta', me.pregunta.id_pregunta);
              formData.append('cant_coincidencias', cantCoin);
              formData.append('n_evaluacion',         me.periodoSelect);
              me.$vs.loading()
              axios.post(this.$data_url+'api/editar_opcion_salle', formData)
              .then(res => {
                me.$vs.loading.close()
                  me.opciones           = res.data;
                  me.editarOpcionActiva = false;
                  me.opcion.opcion      = '';
                  me.opcion.tipo        = '';
                  me.src_imagen_opcion  = '';
                  me.$emit('changeRecharge',2)
                  me.$vs.loading.close()
                  me.$vs.notify({
                  text:'Palabras clave guardada correctamente',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })
              .catch(function (error) {
                  me.$vs.loading.close()
                  console.log(error);
              })
          }else{
              me.cargarOpcionAbierta()
          }
        },
        cargarOpcion(){
            let me = this;
            if( me.id_preguntaActiva === '' ){
                me.$vs.notify({
                    text:'Debe crear una pregunta antes de cargar las opciones.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
            }else{
                me.$vs.loading()
                const formData = new FormData();
                let fileImgPreg = document.getElementById("file2").files[0];
                let tipo = 0;
                if( me.opcion.tipo === true ){
                    tipo = 1;
                }
                formData.append('opcion',               me.opcion.opcion);
                formData.append('id_pregunta',          me.id_preguntaActiva);
                formData.append('img_opcion',           fileImgPreg);
                formData.append('tipo',                 tipo);
                formData.append('cant_coincidencias',   0);
                formData.append('n_evaluacion',         me.periodoSelect);
                axios.post(this.$data_url+'api/cargar_opcion_salle', formData)
                .then(res => {
                    me.opciones             = res.data;
                    me.opcion.opcion        = '';
                    me.opcion.tipo          = '';
                    me.src_imagen_opcion    = '';
                    document.getElementById("file2").value = '';
                    me.$vs.loading.close()
                    me.$emit('changeRecharge',2)
                    //notify guardado
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            }
        },
        cargarOpcionAbierta(){
            let me = this;
            if( me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0){
            me.$vs.notify({
            text:'Ingrese la cantidad de coincidencias de palabras clave.',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
            }
            if( me.id_preguntaActiva === '' ){
            me.$vs.notify({
            text:'Debe crear una pregunta antes de cargar las opciones.',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            }else{
            let tipo = 6;
            let palabrasV = me.palabras_clave.replace(/ /gi, '')
            const formData = new FormData();
            formData.append('opcion',               palabrasV);
            formData.append('tipo',                 tipo);
            formData.append('img_opcion',           null);
            formData.append('id_pregunta',          me.id_preguntaActiva);
            formData.append('cant_coincidencias',   parseInt(me.pregunta.cant_coincidencias));
            formData.append('n_evaluacion',         me.periodoSelect);   
            me.$vs.loading()
            axios.post(this.$data_url+'api/cargar_opcion_salle', formData)
            .then(res => {
                me.id_opcion_tipo234       = res.data[0].id_opcion_pregunta
                me.opciones             = res.data;
                me.opcion.opcion        = '';
                me.opcion.tipo          = '';
                me.src_imagen_opcion    = '';
                me.$emit('changeRecharge',2)
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Palabras clave guardadas correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })
            }
        },
        cargarOpcionesVF(){
            let me = this;
            if( me.id_preguntaActiva === '' ){
                me.$vs.notify({
                text:'Debe crear una pregunta antes de cargar las opciones.',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
            }else{
                me.$vs.loading()
                const formData = new FormData();
                formData.append('opcion',       me.opcion.opcion);
                formData.append('id_pregunta',  me.id_preguntaActiva);
                formData.append('img_opcion', null);
                formData.append('tipo', 1);
                formData.append('cant_coincidencias', 0);
                this.$http.post(this.$server_url+'cargar_opcion_vf_salle', formData)
                .then(res => {
                    // me.opcion.opcion        = '';
                    // me.opcion.tipo          = '';
                    me.editarActivo            = true
                    me.src_imagen_opcion       = '';
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Opción guardada correctamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    me.$emit('changeRecharge',3)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            }
        },
        editarOpcionesVF(){
            let me = this;
            me.$vs.loading()
            const formData = new FormData();
                formData.append('opcion',       me.opcion.opcion);
                formData.append('id_pregunta',  me.id_preguntaActiva);
                formData.append('img_opcion', null);
                formData.append('tipo', 1);
                formData.append('id_opcion', 1);
                formData.append('cant_coincidencias', 0);
            this.$http.post(this.$server_url+'cargar_opcion_vf_salle', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$emit('changeRecharge',2)
                me.$vs.notify({
                text:'Opción guardada correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })
        },
        transformarPregunta(){
            let me = this
            me.$vs.loading()
            const formData = new FormData();
            formData.append('id_pregunta', me.pregunta.id_pregunta);
            formData.append('id_tipo_pregunta', me.pregTipo);
            this.$http.post(this.$server_url+'transformar_preguntas_salle', formData).then(res => {
            me.$vs.notify({
            text:'Pregunta transformada correctamente.',
            color:'primary',
            iconPack: 'feather',
            icon:'icon-check'})
            me.$emit('changeRecharge',1)
            me.$vs.loading.close()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            })
        },
        //METODOS PARA CAMBIAR ESTADO PREGUNTA
        CambiarEstadoPreguntaSalle(){
            let me        = this
            let est       = 0
            if(me.activoPregunta){
            est         = 1
            }else{
            est         = 0
            }
            me.pregunta.estado = est
            let formData  = new FormData();
            formData.append('id_pregunta',    me.pregunta.id_pregunta);
            formData.append('estado',         est)
            me.$vs.loading()
            this.$http.post(this.$server_url+'CambiarEstadoPreguntaSalle', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Se cambio de estado correctamente',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            })
            me.$emit('changeRecharge',2)
            })
        },
       //FIN METODOS PARA CAMBIAR ESTADO PREGUNTA
    }
}       
</script>