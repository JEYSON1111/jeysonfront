<template>
    <div class="vx-row w-full p-3">
      <!-- {{ evaluacion.areas[0][0].asignaturas[0][0].preguntas[0].pregunta.created_at }} -->
      <div class="vx-col sm:w-3/4 w-full">
      <!-- ENCABEZADO -->
      <vx-card v-bind:title="evaluacion.nombreasignatura" title-color="primary">
        <div class="vx-row w-full">
          <div class="vx-col sm:w-1/4 w-full">
              <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" style="max-width: 200px; border-radius: 5px;">
          </div>
          <div class="vx-col sm:w-3/4 w-full pt-3 text-right">
              <div v-if="revisa_admin_salle!=1"><b>Estudiante:</b> {{usuario.nombres}} {{usuario.apellidos}} - {{usuario.cedula}}<br></div>
              <div v-else>
                  <b>Estudiante:</b> {{datos_docente_revisando}}
              </div>
              <b class="mt-1">Inicia:</b> {{configuracion.fecha_inicio}} - <b class="ml-1">Finaliza:</b> {{ configuracion.fecha_fin}} <br>
              <b>Observaciones: </b> <span v-if="configuracion.observaciones !== null && configuracion.observaciones != 'null'">{{configuracion.observaciones}}</span>
              <div class="mt-1">
                <p v-for="(item,key) in arregloPeriodos" :key="key">
                  <span v-if="item.id == configuracion.n_evaluacion"><b>Evaluación Seleccionada:</b> <span class="ml-1">{{ item.nombre }}</span></span>
                </p>
                <br>
              </div>
          </div>
        </div>
      </vx-card>
      <!-- FIN ENCABEZADO -->
      <!-- SECCION RESPONDER PREGUNTAS -->
      <vx-card class="mt-5 mb-6 text-center" v-if="evaluacion_activa==1">
        <div>
          <vs-button type="line" v-for="(itemR, indexR) in evaluacion.areas" :key="indexR" @click="ver_area(indexR)" class="m-1"> {{itemR.area.nombre_area}} </vs-button>
        </div>
        <div v-for="(item, index) in evaluacion.areas" :key="index">
          <div v-bind:id="'area_activa'+index" style="display: none;" class="mt-6 text-left">
              <h5 class="ml-5">Asignaturas área: {{item.area.nombre_area}}</h5>
              <vs-collapse type="margin">
              <vs-collapse-item v-for="(itemA, indexA) in item[0].asignaturas" :key="indexA">
                  <div slot="header"> Preguntas - {{itemA.asignatura.nombre_asignatura}} </div>
                  <div  style="overflow-y: scroll; height:600px;" id="div_pregunta">
                  <div v-for="(itemP, indexP) in itemA[0].preguntas" :key="indexP" class="w-full mb-2">
                  <div :id="itemA.asignatura.id_asignatura+''+(indexP+1)" class="w-full p-3" style="display: none; min-height: 380px; vertical-align: top; background: rgb(64,105,213); background: radial-gradient(circle, rgba(64,105,213,0.073564459963673) 20%, rgba(0,101,228,0.16600143475358897) 87%);">
                      <div class="mt-2" style="font-size: 17px; min-height: 50px;" align="justify"> <b><span v-html="itemP.pregunta.descripcion"></span></b> </div>
                      <div class="mb-base text-right">
                          Pregunta de {{itemP.pregunta.nombre_tipo}} sobre {{itemP.pregunta.puntaje_pregunta}} pts.
                      </div>
                      <img @click="dataPregunta = itemP;popupMostrarImagen=true;"  v-if="itemP.pregunta.img_pregunta !== null && itemP.pregunta.img_pregunta !== 'null' && itemP.pregunta.img_pregunta !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemP.pregunta.img_pregunta" style="max-width: 400px; border-radius: 5px; mix-blend-mode: multiply;" class="mb-base">

                      <div v-if="itemP.pregunta.id_tipo_pregunta === 1" class="m-3" style="font-size: 15px;">
                          <div>
                              <!-- se carga array de preguntas de seleccion multiple -->
                              <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display: none;">
                                  {{opciones_check[itemRes.respuesta] = itemRes.respuesta}}
                              </div>
                          </div>
                          <div class="text-left mb-5" v-for="(itemO, indexO) in itemP.opciones" :key="indexO">
                              <div v-if="revision_activa===true" style="width: 10%; display: inline-block;" align="center">
                                  <span v-if="opciones_check[itemO.id_opcion_pregunta] && itemO.tipo == 1" style="color: #3DE090; font-size: 18px;">✔</span>
                                  <span v-if="opciones_check[itemO.id_opcion_pregunta] && itemO.tipo == 0" style="color: #E73A5A; font-size: 18px;"><b>X</b></span>
                              </div>

                              <div style="width: 85%; display: inline-block; text-align: left;" align="left">
                                  <vs-checkbox  :disabled="revision_activa" v-model="opciones_check[itemO.id_opcion_pregunta]" :vs-value="itemO.id_opcion_pregunta" @input="guardarSeleccion(1, itemO, itemP.opciones, itemP.pregunta.puntaje_pregunta)">
                                      {{itemO.opcion}}
                                      <img v-if="itemO.img_opcion !== null && itemO.itemO !== 'null' && itemO.itemO !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemO.img_opcion" alt="">
                                  </vs-checkbox>
                              </div>
                          </div>
                      </div>

                      <div v-if="itemP.pregunta.id_tipo_pregunta === 3 || itemP.pregunta.id_tipo_pregunta === 5"  class="m-3" style="font-size: 15px;">

                          <div>
                              <!-- se carga array de preguntas de opcion simple -->
                              <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display: none;">
                                  {{opciones[itemRes.id_pregunta] = itemRes.respuesta}}
                              </div>
                          </div>

                          <ul class="justify" v-for="(itemO, indexO) in itemP.opciones" :key="indexO">
                              <li class="mb-5">
                              <div v-if="revision_activa===true" style="width: 10%; display: inline-block;" align="center">
                              <span v-if="itemO.tipo == 1" style="color: #3DE090; font-size: 18px;">✔</span>
                              <span v-else style="color: #E73A5A; font-size: 18px;"><b>X</b></span>
                              </div>
                              <div style="width: 85%; display: inline-block;">
                              <vs-radio :disabled="revision_activa" v-model="opciones[itemO.id_pregunta]" :vs-value="itemO.id_opcion_pregunta" @input="guardarSeleccion(3, itemO, itemP.opciones, itemP.pregunta.puntaje_pregunta)">
                                  {{itemO.opcion}}
                                  <img v-if="itemO.img_opcion !== null && itemO.itemO !== 'null' && itemO.itemO !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemO.img_opcion" alt="">
                              </vs-radio>
                              </div>
                              </li>
                          </ul>
                      </div>

                  </div>
                  </div>
                  <vs-pagination :total="itemA[0].preguntas.length" v-model="current_preg[indexA]" @input="paginacion(indexA, itemA[0].preguntas.length, itemA.asignatura.id_asignatura)"></vs-pagination>
                  </div>
              </vs-collapse-item>
              </vs-collapse>
          </div>
        </div>
      </vx-card>
      <vx-card class="mt-5 mb-6 text-center p-5" v-else>
        <br>
        <h5> {{alerta_evaluacion}} </h5>
        <br><br>
        <vs-button color="success" type="border" class="m-2" @click="$router.go(-1)"><b>← Volver</b></vs-button>
        <!-- <br><br>
        <h5 v-if="tipo_revisar_activo!=1">Si no visualiza su evaluación, recargue la página.</h5> -->
      </vx-card>
      <!-- FIN SECCION RESPONDER PREGUNTAS -->
      </div>
      <!-- SECCION TIEMPO, NAVEGACION -->
      <div class="vx-col sm:w-1/4 w-full">
        <vx-card v-if="evaluacion_activa==1">
          <div align="center">
          <div v-if="revision_activa===true" class="mb-6">
              <b style="font-size: 16px;">Calificación</b> <br><br><br>
              <span style="font-size: 45px; color: #2974FE; border: 1px solid #d5d5d5; border-radius: 5px; padding: 20px; 10px; 20px; 10px;">
                  {{ calificacion }} <span style="font-size: 25px;">/ 100</span>
              </span><br><br>
          </div>
          <div v-if="revision_activa===false"> Tiempo para resolver esta evaluación: </div>
          <!-- <div class="mt-3" style="font-size: 35px; color: #2974FE;">{{configuracion.tiempo_evaluacion}} minutos</div> -->
          <div class="reloj mb-6 mt-4" style="font-size: 40px; color: #2974FE;"></div>
          <div class="mb-6">
              <vs-button v-if="evaluacion_activa==1 && revision_activa===false" color="dark" type="gradient" class="mb-6" @click="openConfirmFinalizar()">Finalizar evaluación</vs-button>
              <vs-button v-if="revisa_admin_salle==1" color="dark" type="gradient" class="mb-6" @click="openConfirmFinalizar()">Finalizar evaluación</vs-button>
          </div>
          <div class="mb-3">
              <vs-button color="success" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button>
          </div>
          </div>
        </vx-card>
      </div>
      <!-- FIN SECCION TIEMPO, NAVEGACION -->
      <!--MODALES-->
      <!--MODAL PARA MOSTRAR UNA CONFIRMACION Y LAS REGLAS DE LA EVALUACION-->
      <vs-popup classContent="popup-example" title="Advertencia" :active.sync="popupConfirmStart" @close="handleClose" :class="{ 'hide-close': !showCloseButton }">
        <!--COMENZAR EVALUACION-->
        <div v-if="intentosEvaluacion == 0">
          <p class="font-bold text-success" style="font-size:18px;text-align: center;">Al aceptar empezará a correr el tiempo, buena suerte!</p>
          <p class="mt-5 font-semibold" style="opacity: 0.8;">Advertencia:</p>
          <div class="bg-warning text-white mt-1" style="padding: 15px;border-radius: 10px;line-height: 22px;">
            <p><b><ion-icon name="warning-outline"></ion-icon></b>  No puedes cambiar de pestaña o cerrar el navegador de lo contrario tu evaluación finalizará</p>
          </div>
          <div class="flex justify-center mt-3">
            <img src="https://cdn-icons-png.flaticon.com/512/3344/3344374.png" width="150"/>
          </div>
          <div class="flex justify-center mt-5">
            <vs-button class="mr-3 mb-2" color="success" @click="acceptAlert()">Empezar</vs-button>
            <vs-button color="warning" type="border" class="mb-2" @click="volver()">← Volver</vs-button>
          </div>
        </div>
        <!--CUANDO YA INICIO LA EVALUACION-->
        <div v-if="intentosEvaluacion == 1">
          <p class="font-bold text-danger text-center" style="font-size:18px;"> Usted ha abandonado la evaluación , la próxima vez su <b>evaluación finalizará</b></p>
          <div class="flex justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2797/2797387.png" width="200"/>
          </div>
          <div class="flex justify-center">
            <!-- HTML !-->
            <button class="button-7" role="button" @click="acceptAlert()">Continuar Evaluación</button>
          </div>
        </div>
        <div v-if="intentosEvaluacion > 1">
          <p class="font-bold text-danger" style="font-size:18px;text-align: center;"><b> Evaluación suspendida</b></p>
          <div class="flex justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/3403/3403504.png" width="200"/>
          </div>
          <div class="flex justify-center">
            <!-- HTML !-->
            <vs-button color="warning" type="filled" class="mb-2 mt-3" @click="acceptAlert()">Aceptar</vs-button>
          </div>
        </div>
      </vs-popup>
      <!--MODAL PARA MOSTRAR QUE SI CAMBIA DE PESTANA SE FINALIZARA LA PRUEBA-->
      <vs-popup classContent="popup-example" title="Advertencia" :active.sync="popupIntentos">
        <p class="font-bold text-danger text-2xl">A la proximá que salgas tu <b>Evaluación Finalizará</b></p>
        <div class="flex justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/2797/2797387.png" width="200"/>
        </div>
        <div class="flex justify-center">
          <!-- HTML !-->
          <button class="button-7" role="button" @click="popupIntentos = false;">Entendido</button>
        </div>
      </vs-popup>
      <!--MODAL PARA MOSTRAR LA IMAGEN DE LA PREGUNTA-->
      <vs-popup class="holamundo" fullscreen title="Mostrar imagen" :active.sync="popupMostrarImagen">
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
    </div>
</template>
<style>
/* width */
#div_pregunta::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#div_pregunta::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_pregunta::-webkit-scrollbar-thumb {
  background: #2e85e9;
  border-radius: 10px;
}

/* Handle on hover */
#div_pregunta::-webkit-scrollbar-thumb:hover {
  background: #2e85e9;
}
/* CSS */
.button-7 {
  background-color: #0095ff;
  border: 1px solid transparent;
  border-radius: 3px;
  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.15385;
  margin: 0;
  outline: none;
  padding: 8px .8em;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  white-space: nowrap;
}

.button-7:hover,
.button-7:focus {
  background-color: #07c;
}

.button-7:focus {
  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);
}

.button-7:active {
  background-color: #0064bd;
  box-shadow: none;
}
</style>
<script>
    import imageZoom from 'vue-image-zoomer';
    import vSelect from 'vue-select'
    import $ from 'jquery'
    var x = null;
    export default {
        data(){
          return {
            usuario: [],
            evaluacion: [],
            area_activa: 0,
            opciones: [],
            opciones_check: {},
            id_evaluacion: '',
            evaluacion_activa: 0,
            alerta_evaluacion: '',
            revision_activa: false,
            configuracion: [],
            color_overlay: '',
            text_overlay: '',
            tiempo_evaluacion: 0,
            calificacion: 0,
            dataaaa: [],
            current_preg: [],
            revisa_admin_salle: 0,
            datos_docente_revisando: '',
            arregloPeriodos:[],
            //variables para intentos de evaluacion
            intentosEvaluacion:0,
            popupIntentos:false,
            popupConfirmStart:false,
            showCloseButton:false,
            //fin variables para intentos de evaluacion
            //variables para mostrar la imagen
            dataPregunta:'',
            popupMostrarImagen:false,
            //SOLO UNA VEZ CORRERA EL TIEMPO
            correrTiempo:true,
          }
        },
        components: {
          'v-select': vSelect,
          imageZoom
        },
        created(){
          let me = this
          me.getPeriodosEvaluacion()
          me.usuario = JSON.parse(localStorage.getItem('usuario'));
          me.tipo_revisar_activo = localStorage.tipo_revisar
          me.revisa_admin_salle = localStorage.revisa_admin_salle
          me.datos_docente_revisando = localStorage.datos_docente_revisando
          if( me.tipo_revisar_activo === '1' ){
              me.id_evaluacion = localStorage.id_evaluacion_salle
              me.obtener_evaluacion()
          }else{
              me.generarEvaluacion()
          }
          me.getConfiguracion()
        },
        mounted() {
          document.addEventListener("visibilitychange", this.handleVisibilityChange);
        },
        beforeDestroy() {
          document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        },
        methods: {
          handleClose() {
            let me = this;
            me.popupConfirmStart = true
          },
          volver(){
            let me = this;
            me.popupConfirmStart = false
            me.$router.go(-1)
          },
          handleVisibilityChange() {
            let me = this
            if (document.visibilityState === "hidden") {
              console.log("diconnect")
              // El usuario cambió de pestaña o minimizó el navegador
            } else {
              console.log("connect")
              if((me.intentosEvaluacion == 1 || me.intentosEvaluacion == 2 ) && (this.usuario.id_group == 13 || this.usuario.id_group == 6)){
                me.popupConfirmStart = true;
              }
              // El usuario volvió a la pestaña o maximizó el navegador
            }
          },
          getPeriodosEvaluacion() {
            let me = this;
            this.$http.get(this.$server_url+'salle/periodos')
              .then(function (response) {
                me.arregloPeriodos = response.data;
              })
              .catch(function (error) {
              })
          },
          async generarEvaluacion(){
            let me = this
            me.color_overlay = '#22c16b'
            me.text_overlay = 'Estamos preparando su evaluación, no tomará mucho tiempo'
            me.$vs.loading({ background: me.color_overlay, color: 'rgb(255, 255, 255)',  type: 'sound', text: me.text_overlay })
            await this.$http.get(this.$server_url+'generar_evaluacion_salle/' + me.usuario.idusuario+'/'+me.usuario.institucion_idInstitucion+'/'+localStorage.EvaluacionSelectSalle+'/0')
            .then(res => {
              if( res.data === 0 ){
                me.evaluacion_activa = 0
                me.revision_activa = true
                me.alerta_evaluacion = 'Lo sentimos el tiempo para resolver esta evaluación ha terminado.'
                me.$vs.loading.close()
                return
              }
              if( res.data === 1 ){
                me.evaluacion_activa = 0
                me.revision_activa = true
                me.alerta_evaluacion = 'La institución a la que pertenece necesita ser configurada, por favor comuníquese con el administrador del sistema.'
                me.$vs.loading.close()
                return
              }
              if( res.data === 2 ){
                me.evaluacion_activa = 0
                me.revision_activa = true
                me.alerta_evaluacion = 'Su evaluación ha finalizado.'
                me.$vs.loading.close()
                return
              }

              me.evaluacion         = res.data
              me.id_evaluacion      = res.data.areas[0].area.id_evaluacion
              me.intentosEvaluacion = res.data.areas[0].evaluacion[0].intentos
              if((me.intentosEvaluacion == 0 || me.intentosEvaluacion == 1 || me.intentosEvaluacion == 2) && (me.usuario.id_group == 13 || me.usuario.id_group == 6)){
                me.openConfirm()
              }
              if(me.intentosEvaluacion > 2 && (me.usuario.id_group == 13 || me.usuario.id_group == 6)){
                me.popupConfirmStart = false
              }
              me.evaluacion_activa  = 1
              me.$vs.loading.close()
            })
            .catch(function (error) {
              console.log(error);
              me.$vs.loading.close()
            })
          },
          getConfiguracion(){
            let me = this
            var InstitucionUser = ""
            if( me.tipo_revisar_activo === '1' ){
              if(me.usuario.id_group == 13 || me.usuario.id_group == 6){
                InstitucionUser = me.usuario.institucion_idInstitucion
              }else{
                InstitucionUser = localStorage.idInstitucionDocente
              }
            }else{
              InstitucionUser = me.usuario.institucion_idInstitucion
            }
            me.$http.get(this.$server_url+'salle_getConfiguracion/' + InstitucionUser+'/'+localStorage.EvaluacionSelectSalle)
            .then(res => {
              me.configuracion = res.data.configuracion[0]
              // alert(me.configuracion.ver_respuestas +'  &&  '+ me.tipo_revisar_activo)
              if( me.configuracion.ver_respuestas == 0 && me.tipo_revisar_activo == 1 ){
                console.log('no puede ver las preguntas')
                me.alerta_evaluacion = 'La revisión de sus evaluaciones está desactivada.'
                if( me.revisa_admin_salle != 1 ){ // cuando revisa el admin no se bloquea
                  me.evaluacion_activa = 0
                }
              }
            })
            .catch(function (error) {
                console.log(error);
            })
          },
          ver_area(index){
            let me = this
            for( var i=0; i<me.evaluacion.areas.length; i++ ){
              document.getElementById("area_activa"+i).style.display = "none";
            }
            document.getElementById("area_activa"+index).style.display = "block";
          },
          async guardarSeleccion(tipo_pregunta, item, opciones, puntaje){
            let me = this
            if( me.tipo_revisar_activo === 1 ){ return } // no se guardan las respuestas en modo revision
            // se obtiene la cantidad de opciones correctas de la pregunta respondida
            let cant_correctas = 0
            $.each(opciones, function(key, value){
              if(value.tipo === 1){
                  cant_correctas++
              }
            })
            let opciones_seleccionadas = []
            $.each(me.opciones_check, function(key, value){
              for( var i=0; i<opciones.length; i++ ){
                if( key == opciones[i].id_opcion_pregunta ){
                  if(value !== false ){
                      opciones_seleccionadas.push(key)
                  }
                }
              }
            })
            let puntaje_seleccion = 0
            // alert(opciones_seleccionadas.length +' <= '+ cant_correctas)
            if( opciones_seleccionadas.length <= cant_correctas ){
              if( item.tipo === 1 ){
                //si la opcion seleccionada es de tipo correcta y no ha excedido la cantidad de opciones correctas
                puntaje_seleccion = (parseFloat(puntaje)/cant_correctas).toFixed(2)
                // alert('puntaje_seleccion bien: ' + puntaje_seleccion)
              }
            }else{
              // se le resta el puntaje cuando selecciona mas opciones de las correctas
              puntaje_seleccion = parseFloat(puntaje)*(-1)
              // alert('puntaje_seleccion else: ' + puntaje_seleccion)
            }
            let dataSeleccion = {
              id_evaluacion: me.id_evaluacion,
              id_usuario: me.usuario.idusuario,
              id_pregunta: item.id_pregunta,
              id_opcion_pregunta: item.id_opcion_pregunta,
              tipo_pregunta: tipo_pregunta,
              puntaje_seleccion: puntaje_seleccion
            }
            await me.$http.post(this.$server_url+'salle_guardarSeleccion', dataSeleccion)
            .then(res => {
              console.log(res)
            })
            .catch(function (error) {
              console.log(error);
            })
          },
          openConfirm() {
            let me = this;
            me.popupConfirmStart = true
            // this.$vs.dialog({
            //   type: 'confirm',
            //   color: 'success',
            //   title: `¿Listo para empezar?`,
            //   acceptText:'Empezar',
            //   cancelText:'Cancelar',
            //   text: 'Al aceptar empezará a correr el tiempo, buena suerte!',
            //   accept: this.acceptAlert
            // })
          },
          acceptAlert() {
            let me = this
             if(me.intentosEvaluacion > 1){
              me.popupConfirmStart = false
              this.saveIntento()
              me.generarEvaluacion()
              return
            }
            me.popupConfirmStart = false
            this.saveIntento()
            document.getElementById("area_activa0").style.display = "block";
            if(me.correrTiempo){
              me.correrTiempo = false
              this.f_tiempo()
            }
          },
          saveIntento(){
            let me = this;
            //si es docentes cuantos los intentos
            if(me.usuario.id_group == 13 || me.usuario.id_group == 6){
              let formData = new FormData();
              formData.append('id_evaluacion',me.id_evaluacion);
              formData.append('id_usuario',   me.usuario.idusuario)
              formData.append('intentosEval', me.intentosEvaluacion)
              this.$http.post(this.$server_url+'save_finalizar_evalIntentos', formData)
              .then(res => {
                me.intentosEvaluacion = res.data.intentos
              })
            }
          },
          f_tiempo() {
            let me = this
            let cant_preguntas = 0
            $.each(me.evaluacion.areas, function(key, value){
              $.each(value[0].asignaturas, function(keyA, valueA){
                  $.each(valueA[0].preguntas, function(keyP, valueP){
                      cant_preguntas++
                  })
              })
            })
              // todas las preguntas tienen una duracion de 3 minutos
              var n = (cant_preguntas * 3) * 60;
              me.tiempo_evaluacion = n
              x = setInterval(function() {
                n--;
                var now = n * 1000;
                var distance = n + now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                $(".reloj").html(hours + " : " + minutes + " : " + seconds + "");
                if (distance < 60000) {
                    $(".reloj").css('color', '#FB2452');
                }
                if (distance < 0) {
                    $(".reloj").html("Fin del tiempo");
                    me.finalizarEvaluacion()
                }
              }, 1000);
            },
            openConfirmFinalizar() {
              this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `¿Está seguro de finalizar esta evaluación?`,
                text: 'Sus respuestas serán enviadas para calificar.',
                accept: this.finalizarEvaluacion,
                acceptText: 'Aceptar',
                cancelText:'Cancelar'
              })
            },
            finalizarEvaluacion(){
              let me = this
              let id_usuario_eval = me.usuario.idusuario
              if( localStorage.idusuario_evaluacion_salle ){
                id_usuario_eval = localStorage.idusuario_evaluacion_salle
              }
              let data_finalizar = {
                id_evaluacion: me.id_evaluacion,
                id_usuario: id_usuario_eval
              }
              me.$vs.loading()
              me.$http.post(this.$server_url+'salle_finalizarEvaluacion', data_finalizar)
              .then(res => {
                me.color_overlay = '#90ABF3'
                me.text_overlay = 'Estamos calificando su evaluación, pronto podrá ver sus resultados.'
                location.reload()
              })
              .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
              })
            },
            obtener_evaluacion(){
              let me = this
              me.revision_activa = true
              me.evaluacion_activa = 1
              me.color_overlay = '#22c16b'
              me.text_overlay = 'Estamos cargando su evaluación resuelta ...'
              me.$vs.loading({ background: me.color_overlay, color: 'rgb(255, 255, 255)',  type: 'sound', text: me.text_overlay })
              let id_usuario_eval = me.usuario.idusuario
              if( localStorage.idusuario_evaluacion_salle ){
                id_usuario_eval = localStorage.idusuario_evaluacion_salle
              }
              me.$http.get(this.$server_url+'obtener_evaluacion_salle/'+ me.id_evaluacion + '/' + id_usuario_eval +'/'+localStorage.EvaluacionSelectSalle)
              .then(res => {
                  me.evaluacion = res.data
                  let calificacion = 0
                  let calificacion_preg = 0
                  let cant_asignaturas = 0
                  let cant_areas = 0
                  let calificacion_pregunta = 0
                  let cant_preguntas = 0
                  let puntaje_preguntas = 0
                  let calificacion_asignatura = 0
                  let calificacion_areas = 0
                  /// ERROR EN CALCULO AQUI XQ NO ESTA CONSIDERNADO LOS VALORES NEGATIVOS COMO EN EL CONTROLADOR DE LOS REPORTES
                  $.each(me.evaluacion.areas, function(key, value){
                    cant_areas++
                    $.each(value[0].asignaturas, function(keyA, valueA){
                      cant_asignaturas++
                      $.each(valueA[0].preguntas, function(keyP, valueP){
                        cant_preguntas++
                        puntaje_preguntas += valueP.pregunta.puntaje_pregunta
                        $.each(valueP.respuestas, function(keyRes, valueRes){
                          calificacion_preg = calificacion_preg + valueRes.puntaje
                        })
                        if( calificacion_preg >= 0 && calificacion_preg <= valueP.pregunta.puntaje_pregunta ){
                        }else{
                          if( valueP.pregunta.id_tipo_pregunta != 1 ){
                            calificacion_preg = valueP.pregunta.puntaje_pregunta
                          }else{
                            calificacion_preg = 0
                          }
                        }
                        calificacion_pregunta += calificacion_preg
                        calificacion_preg = 0
                      })
                    })
                    calificacion_areas += ((calificacion_pregunta*100)/puntaje_preguntas)
                    calificacion_pregunta = 0
                    puntaje_preguntas = 0
                    calificacion_asignatura = 0
                    cant_asignaturas = 0
                  })
                  me.calificacion = (calificacion_areas/cant_areas).toFixed(2)
                  me.$vs.loading.close()
              })
              .catch(function (error) {
                  me.$vs.loading.close()
                  console.log(error);
              })
            },
            paginacion(index, tam, asign_content){
              let me = this;
              for( let i=1; i<=tam; i++ ){
                  $('#'+asign_content+''+i).css('display', 'none')
              }
              $('#'+asign_content+''+me.current_preg[index]).css('display', 'block')
            }
        },
    }
</script>
