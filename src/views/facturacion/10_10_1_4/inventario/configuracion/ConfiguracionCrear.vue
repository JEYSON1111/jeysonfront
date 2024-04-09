<template>
  <div class="mt-5">
      <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input class="w-full" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Mínimo Stock" v-model="sendValor.minimo" />
              </div>
            </div>
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Máximo Stock" v-model="sendValor.maximo" />
              </div>
            </div>
          </div>
      </div>
      <div class="flex" style="justify-content: center;">
        <vs-button class="mr-3 mb-2" style="color:white;!important" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar</vs-button>
      </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import axios from 'axios'
export default{
  components:{
    vSelect,
  },
  data(){
    return{
      ifSaveImagen:false,
      //FIN VARIABLES IMAGEN
      sendValor:{
        minimo:'',
        maximo:'',
        // estado:0,
      },
    }
  },
  props:{
    id:{
      type:Number,
      default:0
    },
    ObjectSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  created(){
    let me = this;
  },
  mounted(){
    let me = this;
    if(me.id > 0){
      me.sendValor =    {
        minimo:         me.ObjectSelect.minimo,
        maximo:         me.ObjectSelect.maximo,
        // estado:         me.ObjectSelect.estado,
      }
    }
  },
  methods:{
    subirDocumento(){
      let me = this;
      let formData = new FormData();
      formData.append('saveConfiguracion',        "yes")
      formData.append('id',                       me.id)
      formData.append('minimo',                   me.sendValor.minimo)
      formData.append('maximo',                   me.sendValor.maximo)
      formData.append('user_created',             me.usuario.idusuario)
      //informacion
      me.$vs.loading()
      this.$http.post(this.$server_url+'inventario/configuracion', formData)
      .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se guardo correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('showCreate',0)
      })
      .catch(function (error) {
          me.$vs.loading.close()
      })
    },
  }
}


</script>
<style scoped>
 .box-input{
 }
  .upload-container{
    position:relative}
    .upload-container input{
      border:1px solid #92b0b3;
      background:#217bc5;
      outline:2px dashed #92b0b3;
      outline-offset:-10px;
      padding:100px 0px 100px 130px;
      width:100%;
      color:white;
  }
    .upload-container input:hover{
      background:#2c78cf}
    .upload-container:before{
      position:absolute;
      bottom:50px;
      left:23%;
      content:" Seleccione un archivo o arrastre aqui ";
      color:#f1f9fa;
      font-weight:900
  }
    .upload-btn{
      margin-left:300px;
      padding:7px 20px}
</style>
