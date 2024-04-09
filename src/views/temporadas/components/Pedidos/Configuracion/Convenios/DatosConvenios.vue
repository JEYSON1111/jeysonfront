<template>
  <div>
    <vs-table :data="arrayInformation"   max-items="2" search pagination>
      <template slot="thead">
        <vs-th>#</vs-th>
        <vs-th>Datos</vs-th>
        <vs-th>Observación</vs-th>
        <vs-th>Valores</vs-th>
        <vs-th>Años</vs-th>
        <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{ tr.id }}</vs-td>
          <vs-td :data="tr.email">
            <b>Institución:</b>
            <p>{{ tr.nombreInstitucion }}</p>
            <b>Período:</b>
            <p>{{ tr.periodo }}</p>
            <b>Estado valor Global:</b>
            <p v-if="tr.convenio_aprobado == 0">Convenio aprobado facturador</p>
            <p v-if="tr.convenio_aprobado == 1" class="font-bold text-warning">Convenio solicitado a gerencia ${{ tr.valor_sugerido }} </p>
            <p v-if="tr.convenio_aprobado == 2" class="text-danger">Convenio anulado por  gerencia ${{ tr.valor_sugerido }} </p>
            <p v-if="tr.convenio_aprobado == 3" class="font-bold text-success">Convenio aprobado por gerencia ${{ tr.valor_aprobado_gerencia }} </p>
            <b>Estado convenio:</b>
            <p>
              <vs-chip color="warning" v-if="tr.estado == 1">En curso</vs-chip>
              <vs-chip color="success" v-else>Finalizado</vs-chip>
            </p>
          </vs-td>
          <vs-td :data="tr.observacion">
            {{ tr.observacion }}
            <template slot="edit" v-if="groupFacturador">
              <vs-input v-model="tr.observacion" class="inputx" placeholder="Observación" @keyup.enter="convenioSelect=tr;updateValor('observacion',tr.observacion)"/>
              <vs-button radius color="success" @click="convenioSelect=tr;updateValor('observacion',tr.observacion)"  style="position: relative;left:20px;top:10px;" type="gradient" icon="save"></vs-button>
            </template>
          </vs-td>
          <vs-td :data="tr.anticipo_global">
            <b>Anticipo Global:</b>
            <p>{{ tr.anticipo_global }}</p>
            <template slot="edit" v-if="groupFacturador">
              <vs-input v-model="tr.anticipo_global" class="inputx" placeholder="Anticipo global" @keyup.enter="convenioSelect=tr;updateValor('anticipo_global',tr.anticipo_global)"/>
              <vs-button radius color="success" @click="convenioSelect=tr;updateValor('anticipo_global',tr.anticipo_global)"  style="position: relative;left:20px;top:10px;" type="gradient" icon="save"></vs-button>
            </template>
          </vs-td>
          <vs-td :data="tr.convenio_anios">
            <p>{{ tr.convenio_anios }}</p>
            <template slot="edit" v-if="groupFacturador">
              <vs-input type="number" v-model="tr.convenio_anios" class="inputx" placeholder="Años convenios" @keyup.enter="convenioSelect=tr;updateValor('convenio_anios',tr.convenio_anios)"/>
              <vs-button radius color="success" @click="convenioSelect=tr;updateValor('convenio_anios',tr.convenio_anios)"  style="position: relative;left:20px;top:0px;" type="gradient" icon="save"></vs-button>
            </template>
          </vs-td>
          <vs-td>
            <vx-tooltip text="Aprobar Convenio" position="top" color="warning" style="display: inline-block; z-index: 3;">
                <vs-button size="small" class="m-2" @click="id=tr.doc_codigo;ObjectSelect=tr;popupConfirmConvenioAprobado=true;" icon-pack="feather" icon="icon-check" color="success" type="gradient">Aprobar </vs-button>
              </vx-tooltip>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--modales-->
    <vs-popup classContent="popup-example" title="Aprobar Convenio Global" :active.sync="popupConfirmConvenioAprobado">
      <AprobarAnticipoAprobadoVue v-if="popupConfirmConvenioAprobado" ifconvenio="1" :sendConvenio="ObjectSelect" :sendPedido="sendPedido" :usuario="usuario" :userRoot="Boolean(userRoot)" @changeHandle="changeHandle"/>
    </vs-popup>
  </div>
</template>
<script>
const AprobarAnticipoAprobadoVue = () => import('../../../../../pedidos2/pedidos/anticipos/pagos2/components/AprobarAnticipoAprobado.vue')
export default {
  components:{
      AprobarAnticipoAprobadoVue,
    },
  data(){
  
    return{
      convenioSelect:'',
      popupConfirmConvenioAprobado:false,
      ObjectSelect:'',
    }
  },
  props:{
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    idConvenio:{
      type:Number,
      default:0,
    },
    arrayInformation:{
      type:Array,
      default:function(){
        return []
      }
    },
    groupFacturador:{
      type:Boolean,
      default:false
    },
    userRoot:{
      type:Boolean,
      default:false
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  watch:{
    arrayInformation(results){
      this.arrayInformation = results
    }
  },
  methods:{
    changeHandle(e){
      let me = this
      if(e == 0) { me.popupConfirmConvenioAprobado = false; }
      if(e == 1) { me.popupConfirmConvenioAprobado = false;  me.$emit('changeRecharge',1) }
    },
    updateValor(campo,valor){
      let me = this;
      if(campo == 'convenio_anios'){
        if( valor < 2 ){
          me.$emit('changeRecharge',3)
          $(".content-tr-expand").hide()
          me.$vs.notify({
          text:'El convenio no puede ser menor a 2 años',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
      }
      if(campo == 'anticipo_global'){
        //validacion anticipo global
        if(valor < 0 || valor == "" || valor == null){
          me.$emit('changeRecharge',3)
          $(".content-tr-expand").hide()
          me.$vs.notify({
          text:'El convenio global no puede ser menor a 0',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
      }
      let formData = new FormData();
      formData.append('updateCamposDatos',    'yes')
      formData.append('unCampo',              'yes')
      formData.append('id',                   me.convenioSelect.id);
      formData.append('campo1',               campo);
      formData.append('valor1',               valor)
      formData.append('user_created',         me.usuario.idusuario)
      formData.append('idConvenio',          me.convenioSelect.id)
      this.$http.post(this.$server_url+'convenio', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$emit('changeRecharge',1)
          $(".content-tr-expand").hide()
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.$emit('changeRecharge',3)
        $(".content-tr-expand").hide()
        me.$vs.notify({
          text:'Se guardo con éxito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          $(".content-tr-expand").hide()
      })
      .catch((e)=>{
        // me.$vs.loading.close()
      })
    },
  }
}
</script>
