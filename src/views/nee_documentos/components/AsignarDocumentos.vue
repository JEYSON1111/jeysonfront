<template>
  <div>
    <tableFiltroUsuarioVue @changeDirector="changeHandleUsuario" v-if="externo == '0'"/>
    <div v-if="userSelect.idusuario > 0">
      <div v-if="confirmar == true">
        <vs-card class="mt-2">
          <vs-alert title="Estas seguro de quitar todo?" color="danger">
            <div class="flex">
                <vs-button color="success" @click="f_quitarTodo()" type="relief">Si, Eliminar todo</vs-button>
                <vs-button color="danger" class="ml-2" @click="confirmar = false;" type="relief">Cancelar</vs-button>
            </div>
          </vs-alert>
        </vs-card>
      </div>
      <div v-else>
        <vs-divider color="success" style="margin-top:-30px;">Documentos asignados ( {{arregloAsignados.length}} ) </vs-divider>
        <vs-collapse>
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down" style="margin-top:-20px;">
                <div slot="header">
                    Ver Asignados ( {{arregloAsignados.length}} )
                </div>
                <div class="vx-row">
                    <div class="vx-col sm:w-full text-right" v-if="arregloAsignados.length >1">
                        <vs-button type="border" color="danger" size="small" @click="confirmaQuitar()">Quitar todas <span class="feather icon icon-trash"></span></vs-button>
                    </div>
                    <div class="vx-col sm:w-full">
                        <div v-for="(item, index) in arregloAsignados" :key="index" class="m-1 p-1 asig-select text-dark">
                          {{item.documento}} - {{ item.subnivel }} <b>({{ item.periodo }})</b> &nbsp; &nbsp;
                          <vs-button @click="eliminaAsignacion(item)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                        </div>
                    </div>
                </div>
            </vs-collapse-item>
        </vs-collapse>
        <ul class="flex">
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="0"><b>{{ sumaTotal }}</b> Todo</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="1"><b>{{ SumaElemental }}</b> Elemental</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="2"><b>{{ SumaMedia }}</b> Media</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="3"><b>{{ SumaSuperior }}</b> Superior</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="4"><b>{{ SumaBachillerato }}</b> Bachillerato</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="5"><b>{{ SumaDocumentoGeneral }}</b> Documento General</vs-radio>
          </li>
        </ul>
        <listadoDocumentosVue
          :arregloTemas="arregloTemas"
          :listaDatos="tmpArregloDocumentos"
          :btnEditar="0"
          :btnEliminar="0"
          :btnAsignar="1"
          @changeAsignar="changeAsignar"
        />
      </div>
    </div>
  </div>
</template>
<script>
import tableFiltroUsuarioVue from '@/views/usuarios/tipos/components/tableFiltroUsuario'
import listadoDocumentosVue from '@/views/nee_documentos/components/listadoDocumentos'
import { format } from 'path';
export default {
  data(){
    return{
      usuario:[],
      arregloDocumentos:[],
      tmpArregloDocumentos:[],
      arregloAsignados:[],
      userSelect:{
        idusuario:0,
        nombres:'',
        institucion_id:'',
        id_group:''
      },
      documento:{},
      subnivel:0,
      msg:'',
      confirmar:false,
    }
  },
  props:{
    arregloTemas:{
      type:Array,
      default:[],
    },
    userExterno:{
      type:Object,
      default:{}
    },
    externo:{
      type:Number,
      default:0
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted() {
    let me = this;
    me.getDocumentos()
    if(me.externo == '1'){
      me.userSelect = {
        idusuario:      me.userExterno.idusuario,
        nombres:        me.userExterno.nombres+" "+me.userExterno.apellidos,
        institucion_id: me.userExterno.institucion_idInstitucion,
        id_group:       me.userExterno.id_group
      }
      me.getAsignados()
    }
  },
  components:{
    tableFiltroUsuarioVue,
    listadoDocumentosVue,
  },
  computed:{
    sumaTotal(){
      let me = this;
      let total = me.arregloDocumentos.length
      return total
    },
    SumaElemental(){
      let me = this;
      let datos       = me.arregloDocumentos.filter(p => (p.nee_subnivel == '1'));
      let resultado   = datos.length
      return resultado
    },
    SumaMedia(){
      let me = this;
      let datos       = me.arregloDocumentos.filter(p => (p.nee_subnivel == '2'));
      let resultado   = datos.length
      return resultado
    },
    SumaSuperior(){
      let me = this;
      let datos       = me.arregloDocumentos.filter(p => (p.nee_subnivel == '3'));
      let resultado   = datos.length
      return resultado
    },
    SumaBachillerato(){
      let me = this;
      let datos       = me.arregloDocumentos.filter(p => (p.nee_subnivel == '4'));
      let resultado   = datos.length
      return resultado
    },
    SumaDocumentoGeneral(){
      let me = this;
      let datos       = me.arregloDocumentos.filter(p => (p.nee_subnivel == '5'));
      let resultado   = datos.length
      return resultado
    },
  },
  methods: {
    changeHandleUsuario(e){
      let me = this
      me.userSelect = e
      if(me.userSelect.idusuario > 0) me.getAsignados()
    },
    getDocumentos() {
      let me = this;
      me.arregloDocumentos = []
      this.$http.get(this.$server_url + 'neetTema?listadoDocumentos=yes')
        .then(res => {
          me.$vs.loading.close();
          me.arregloDocumentos = res.data
          me.filtroDocumentos()
        })
        .catch(error => {
          console.log(error)
          me.$vs.loading.close();
        })
    },
    filtroDocumentos(){
      let me = this
      me.tmpArregloDocumentos = []
      if(me.subnivel == '0') me.tmpArregloDocumentos = me.arregloDocumentos
      else                   me.tmpArregloDocumentos = me.arregloDocumentos.filter(p => p.nee_subnivel == me.subnivel)
    },
    getAsignados() {
      let me = this;
      me.arregloAsignados = []
      this.$http.get(this.$server_url + 'neetTema?getAsignados=yes&idusuario='+me.userSelect.idusuario+'&institucion_id='+me.userSelect.institucion_id)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.f_notificaciones(res.data.message, 'danger', 'icon-alert-triangle')
            return
          }
          me.arregloAsignados = res.data
        })
        .catch(error => {
          console.log(error)
          me.$vs.loading.close();
        })
    },
    changeAsignar(e){
      let me = this
      me.documento = e
      me.asignarDocumento()
    },
    asignarDocumento(){
      let me = this;
      me.msg = ""
      if(me.documento.id == null || me.documento.id == "" || me.documento.id == undefined){
        me.msg = "Seleccione algun documento para asignar"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      if(me.userSelect.idusuario == null || me.userSelect.idusuario == "" || me.userSelect.idusuario == undefined){
        me.msg = "Seleccione algun usuario para asignar"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      let formData = new FormData();
      formData.append('asignarDocumento', "yes");
      formData.append('idusuario',        me.userSelect.idusuario)
      formData.append('neet_upload_id',   me.documento.id);
      formData.append('user_created',     me.usuario.idusuario)
      formData.append('institucion_id',   me.userSelect.institucion_id)
      formData.append('id_group',         me.userSelect.id_group)
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetTema', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.f_notificaciones(res.data.message, 'danger', 'icon-alert-triangle')
            return
          }
          me.$vs.notify({
            text: res.data.message,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.getAsignados()
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    confirmaQuitar() {
      let me = this;
      me.confirmar = true
    },
    f_quitarTodo() {
      let me = this;
      me.confirmar = false
      let idSelects = [];
      for (let index = 0; index < me.arregloAsignados.length; index++) {
          idSelects.push(me.arregloAsignados[index].id)
      }
      me.$vs.loading();
      let data = new FormData();
      data.append('ids', idSelects)
      this.$http.post(this.$server_url + "quitarTodasDocumentosAsignados", data)
        .then(function (res) {
          me.$vs.notify({
            text: 'Documentos quitados correctamente.',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.getAsignados();
          me.$vs.loading.close();
        });
    },
    eliminaAsignacion(item) {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + "eliminaAsignacionNeet/" + item.id)
        .then(function (res) {
          me.$vs.loading.close();
          me.$vs.notify({
            text: item.documento + ' eliminada',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.getAsignados();
        });
    },
    f_notificaciones(msj, color, icono) {
      let me = this;
      me.$vs.notify({
        text: msj,
        color: color,
        iconPack: 'feather',
        icon: icono
      })
      return;
    },
  },
}
</script>
