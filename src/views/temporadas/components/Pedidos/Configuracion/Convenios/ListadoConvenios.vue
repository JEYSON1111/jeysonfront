<template>
  <div>
    <vs-alert color="primary">Apruebe el convenio para que se registre automaticamente el convenio</vs-alert>
    <vs-table :data="arrayAgreements" v-if="menu == 0" class="mt-2">
      <template slot="thead">
        <vs-th width="10%">Convenio #</vs-th>
        <vs-th>Datos</vs-th>
        <vs-th>Valor</vs-th>
        <vs-th v-if="showSuggested">Valor sugerido</vs-th>
        <vs-th v-if="!showSuggested && groupFacturador">Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{ indextr + 1  }}
          </vs-td>
          <vs-td>
            <b>Contrato:</b>
            <p>{{ tr.ven_codigo }}</p>
            <b>Fecha creación:</b>
            <p>{{ tr.doc_fecha | fecha }}</p>
            <b>Estado:</b>
            <p>
              <vs-chip color="primary" v-if="tr.estado == 1">Activo</vs-chip>
              <vs-chip color="danger" v-else>Desactivado</vs-chip>
            </p>
          </vs-td>
          <vs-td :data="tr.doc_valor">
            <b>Valor:</b>
            <p>{{ tr.doc_valor | filtrarDecimal }}</p>
          </vs-td>
          <vs-td v-if="showSuggested">
            <p class="text-success">{{ tr.valueSuggested | filtrarDecimal }}</p>
          </vs-td>
          <vs-td v-if="!showSuggested && groupFacturador">
            <vx-tooltip style="display: inline-block;" text="Editar Contrato" position="top" color="primary">
              <vs-button class="modal-default-button" size="small" color="success" @click="$emit('changeRecharge',2,tr)" type="filled" icon-pack="feather" icon="icon-edit"> Editar</vs-button>
            </vx-tooltip> &nbsp;
            <vx-tooltip style="display: inline-block;" text="Eliminar contrato" position="top" color="primary">
              <vs-button class="modal-default-button" size="small" color="danger" @click="convenioSelect=tr;menu = 1;" type="filled" icon-pack="feather" icon="icon-x-square">Eliminar </vs-button>
            </vx-tooltip> &nbsp;
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vx-card v-if="menu == 1" :title="'Eliminar contrato '+convenioSelect.ven_codigo">
      <ConfirmEliminarVue @changeConfirm="changeConfirm"/>
    </vx-card>
  </div>
</template>
<script>
const ConfirmEliminarVue = () => import('../../../../../configuracion/Reutilizable/ConfirmEliminar.vue')
// import ConfirmEliminarVue from '../../../../../configuracion/Reutilizable/ConfirmEliminar.vue';
export default {
  components:{
    ConfirmEliminarVue,
  },
  data(){
    return{
      menu:0,
      convenioSelect:'',
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
    arrayAgreements:{
      type:Array,
      default:function(){
        return []
      }
    },
    showSuggested:{
      type:Boolean,
      default:false,
    },
    setAnticipoGlobal:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    groupFacturador:{
      type:Boolean,
      default:false,
    },
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  watch:{
    showSuggested(results){
      this.showSuggested = results
    },
    arrayAgreements(results){
      this.arrayAgreements = results
    }
  },
  mounted(){
    let me = this
  },
  methods:{
    changeConfirm(e){
      let me = this
      if(e == 0) { me.menu = 0 }
      else { me.eliminarConveniohijo() }
    },
    eliminarConveniohijo(){
      let me = this
      let formData = new FormData();
      formData.append('eliminarHijoConvenio', 'yes')
      formData.append('id',                   me.convenioSelect.doc_codigo);
      formData.append('user_created',         me.usuario.idusuario)
      formData.append('idConvenio',           me.idConvenio)
      this.$http.post(this.$server_url+'eliminarConvenio', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.menu = 0;
        me.$emit('changeRecharge',1)
        me.$vs.notify({
          text:'Se elimino con éxito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      .catch((e)=>{
        // me.$vs.loading.close()
      })
    },
  }
}
</script>
