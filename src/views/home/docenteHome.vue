<template>
    <div>
      <div v-if="menu == 0">
        <vx-card
          title="Evaluación Salle"
          title-color="success"
          v-if="ObjectInstitucion.tipo_institucion == 2 && verEvaluacionSalle">
          <div>
            <listaEvaluacionesVue/>
          </div>
        </vx-card>
        <vx-card>
          <div class="vx-row ">
            <!--NECESIDADES EDUCATIVAS-->
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6" v-if="arregloAsignados.length > 0">
              <vs-card actionable class="p-5 vx-card alto">
                <div class="padre padrea">
                  <div class="hijo1 colora">
                    <h3 style="">Necesidades educativas</h3>
                  </div>
                  <div class="hijo2">
                    <img src="@/assets/images/home/docenteHome/neet.png" @click="menu = 1;"  style="transition:2s ease;border-radius: 10px;" width="100" alt="login" class="img-responsive mx-auto">
                    <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;position: absolute;bottom:45px;">{{ arregloAsignados.length }}</p>
                  </div>
                </div>
              </vs-card>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <vs-card actionable class="p-5 vx-card alto">
                <div class="padre padreb">
                  <div class="hijo1 hijo1b">
                    <h3 style="">Libros</h3>
                  </div>
                  <div class="hijo2">
                    <img src="@/assets/images/home/docenteHome/libros.png"  @click="irLibros()" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                    <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_libros}}</p>
                  </div>
                </div>
              </vs-card>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
                <vs-card actionable class="p-5 vx-card alto">
                    <div class="padre padrec">
                        <div class="hijo1 hijo1c">
                            <h3 style="">Evaluaciones</h3>
                        </div>
                        <div class="hijo2">
                            <img src="@/assets/images/home/docenteHome/exam.png" @click="irCurso()" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                            <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_evaluaciones}}</p>
                        </div>
                    </div>
                </vs-card>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <vs-card actionable class="p-5 vx-card alto">
              <div class="padre padrea">
                <div class="hijo1 hijo1a">
                  <h3 style="">Seminarios</h3>
                </div>
                <div class="hijo2">
                  <img src="@/assets/images/home/docenteHome/meeting.png" @click="irSeminario()"  style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                  <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_seminarios}}</p>
                </div>
              </div>
              </vs-card>
            </div>
          </div>
        </vx-card>
        <br/>
        <vx-card >
          <div class="vx-row">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-base">
              <vs-card actionable class="contenedor-perfil padreb">
                  <div class="hijo1 hijo1b">
                      <h3 style="">Datos del usuario</h3>
                  </div>
                  <div class="hijo2 contenido-perfil">
                      <div style="width:20%">
                          <img src="@/assets/images/home/docenteHome/teacher.png" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                      </div>
                      <div style="width:62%">
                          <p class="titulo-perfil">Nombres:     <span style="color:#000;opacity:0.7;">{{usuario.nombres}}</span></p>
                          <p class="titulo-perfil">Apellidos:   <span style="color:#000;opacity:0.7;">{{usuario.apellidos}}</span></p>
                          <p class="titulo-perfil">Email:       <span style="color:#000;opacity:0.7;">{{usuario.email}}</span></p>
                          <p class="titulo-perfil">Usuario:     <span style="color:#000;opacity:0.7;">{{usuario.name_usuario}}</span></p>
                          <p class="titulo-perfil">Institución:  <span style="color:#000;opacity:0.7;">{{nombreInstitucion}}</span></p>
                      </div>
                      <div style="width:18%">
                          <div>
                              <vs-button color="success"  icon="account_circle" size="small" @click="irPerfil()"  type="relief">Perfil</vs-button>
                          </div>
                          <br/>
                            <div>
                                <vs-button color="danger" icon="close" size="small" @click="logout()"  type="relief">Salir</vs-button>
                          </div>
                      </div>
                  </div>
              </vs-card>
            </div>
            <div v-if="estadisticaVisitas > 0" class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base">
              <reportePastelDocente/>
            </div>
          </div>
        </vx-card>
        <br/>
        <vx-card>
          <div class="vx-col w-full mb-6">
            <Agenda/>
          </div>
        </vx-card>
      </div>
      <vx-card
      title="Listado de Necesidades Educativas"
      v-else
      >
        <vs-button type="border" color="primary"  @click="menu = 0;">← Regresar</vs-button>
        <NeetDocenteVue :arregloAsignados="arregloAsignados" :arregloTemas="arregloTemas"/>
      </vx-card>
    </div>
</template>
<script>
import axios from 'axios'
import Agenda from '../docentes/agenda_docente.vue'
import reportePastelDocente from './components/docente/docentePastel.vue'
import VxCard from '../../components/vx-card/VxCard.vue'
import NeetDocenteVue from '@/views/home/neet/NeetDocente'
import NeetRepository from '@/repositories/NeetRepository'
import listaEvaluacionesVue from '../salle/docente/evaluaciones/listaEvaluaciones.vue'
export default {
    data() {
      return{
        usuario: [],
        nombreInstitucion:'',
        historicoDocenteArreglo:[],
        individuald:[],
        cant_libros:0,
        cant_evaluaciones:0,
        cant_seminarios:0,
        estadisticaVisitas:'',
        //variables para necesidades educativas
        arregloAsignados:[],
        menu:0,
        arregloTemas:[],
        //fin variables para necesidades educativas
      }
    },
    components:{
      Agenda,
      reportePastelDocente,
      VxCard,
      NeetDocenteVue,
      listaEvaluacionesVue,
    },
    props:{
      ObjectInstitucion:{
        type:Object,
        default:function(){
          return {}
        }
      },
      verEvaluacionSalle:{
        type:Object,
        default:false
      }
    },
    methods: {
      getSeminarios() {
        let me = this;
        this.$http.get(this.$server_url+'get_seminarios_docente/'+me.usuario.idusuario)
        .then(function (res) {
            me.cant_seminarios = res.data.length
        })
        .catch(function (error) {
        })
      },
      //cantidad de libros del docente
      async getLibros() {
        let me = this;
        this.$http.get(this.$server_url+'libros?idusuario=' + me.usuario.idusuario+'&periodo_id='+localStorage.periodo_id)
          .then(function (response) {
            me.cant_libros = response.data.length;
          })
          .catch(function (error) {
          })
      },
      //cantidad de evaluaciones del docente
      async getEvaluaciones() {
        let me = this;
        this.$http.get(this.$server_url+'cantEvaluacionesDocente?idusuario=' + me.usuario.idusuario+'&id_institucion='+me.usuario.institucion_idInstitucion)
          .then(function (response) {
            me.cant_evaluaciones = response.data.length;
          })
          .catch(function (error) {

          })
      },
      getNecesidadesEducativas(){
        let me = this
        const { idusuario,institucion_idInstitucion } = me.usuario
        NeetRepository.getNecesidadesEducativasxUsuario(idusuario,institucion_idInstitucion).then( r => { me.arregloAsignados = r.data })
      },
      //ir a al vistas de cursos
      irCurso(){
        let me = this;
        me.$router.push('/cursosevaluaciones')
      },
      //ir a la vista de libros
      irLibros(){
          let me = this;
          me.$router.push('/docente/libros2')
      },
      //ur a ka vista de seminario
      irSeminario(){
          let me = this;
          me.$router.push('/docente/seminarios')
      },
      //para ir al perfil
      irPerfil(){
        let me = this;
        me.$router.push('/perfil');
      },
      async logout() {
        await this.$store.dispatch('logout')
        this.$router.push('/');
      },
    },
    created() {
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted(){
      let me = this;
      me.nombreInstitucion = localStorage.nombreInstitucion
      me.getEvaluaciones();
      me.getSeminarios();
      me.getNecesidadesEducativas()
      let getPeriodo = localStorage.periodo_id
      if(getPeriodo == undefined || getPeriodo == ""){
        setTimeout(function(){
          me.getLibros();
        }, 5000);
      }else{
         me.getLibros();
      }
    }
}
</script>

<style scoped>
.contenedor-perfil{
  width: 100%;
  border-radius: 20px 0px;
  padding: 0px;
}
.padre{
    width: 100%;

    display: flex;
    flex-direction: column;
    height: 175px;
    border: 1px solid none;
    border-radius: 10px;
    padding: 0px;

}
.padrea{
    box-shadow: 1px  3px 5px rgba(73, 128, 150, 0.6);
}
.padreb{
    box-shadow: 1px  3px 5px rgba(202, 119, 98, 0.6);
}
.padrec{
    box-shadow: 1px  3px 5px rgba(112, 212, 154, 0.6);
}
.hijo1{
    text-align: center;
    border-radius: 10px;
    width: 100%;

}
.colora{
  background: #FDC830;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #F37335, #FDC830);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #F37335, #FDC830); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.hijo1a{
    background: #2193b0;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #6dd5ed, #2193b0);
    background: linear-gradient(to right, #6dd5ed, #2193b0);
}
.hijo1b{
   background: #FF416C;  /* fallback for old browsers */
   background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
   background: linear-gradient(to right, #FF4B2B, #FF416C);
}
.hijo1c{
    background: #11998e;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #38ef7d, #11998e);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
.hijo1 > h3{
    color: white;
    font-weight: 300;
    letter-spacing: 2px;
    padding: 5px;


}
.hijo2{
    margin-top: 10px;
    cursor:pointer;

    /* margin: auto; */

}

.contenido-perfil{
    display: flex;
    flex-wrap: wrap;
    padding: 15px;
    overflow: hidden;
}
.titulo-perfil{
    color:#2A9FF6;
    padding: 5px;
}


</style>
