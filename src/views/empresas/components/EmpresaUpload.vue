<template>
  <div>
    <div class="vx-row">
        <!--FIN TIPOS PAGOS FACTURACION-->
        <!--FILE-->
        <div class="vx-col w-full mb-6">
            <p class="ml-2">Logo:</p>
            <p class="mt-1"></p>
            <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                <div class=" box upload-container">
                    <input type="file" name="fileEmpresa" id="fileEmpresa" v-on:change="uploadFiles()" />
                </div>
                <br>
            </div>
            <!--BASE-->
            <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                <div class="flex" style="justify-content: center;">
                    <div class="flex" style="flex-direction: column;">
                        <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/facturacion/empresa/'+imgOld" style="border-radius: 5px;margin: 0 auto;">
                        <small class="mt-1 ml-2">{{ imgOld }}</small>
                    </div>
                    <vs-button radius type="line" @click="ifSaveImagen = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div>
            <!--LOCAL-->
            <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                    <div class="flex" style="flex-direction: column;">
                        <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                        <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                        <small class="mt-1 ml-2">{{ tr.name }}</small>
                    </div>
                    <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div>
        </div>
    </div>
    <div class="flex" style="justify-content: center;">
      <vs-button class="mr-3 mb-2" style="color:white;!important" color="success" icon-pack="feather" icon="icon-save" @click="subirDocumento()">Guardar</vs-button>
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
      //VARIABLES IMAGEN
      attachmentArray:[],
      tipoFile:'',
      ifSaveImagen:false,
      imgOld:'',
      ifImagenBd:false,
      //FIN VARIABLES IMAGEN
    }
  },
  props:{
    id:{
      type:Number,
      default:0
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    ObjectPadre:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  created(){
    let me = this;
  },
  mounted(){
    let me = this;
    me.attachmentArray = []
    if(me.id > 0){
      me.imgOld         = me.ObjectPadre.url
      if(me.imgOld){
        me.ifSaveImagen = true
        me.ifImagenBd   = true
      }
    }else{
      me.ifSaveImagen = false
    }
  },
  watch:{
    ObjectPadre(results){
      this.ObjectPadre = results
    },
  },
  methods:{
    removeItemFromArr (arr, item) {
        let me = this;
        const i = arr.indexOf(item)
        arr.splice(i, 1)
        document.getElementById("fileEmpresa").value = ''
    },
    uploadFiles(){
        let me = this;
        me.attachmentArray = []
        var archivo = document.getElementById("fileEmpresa").files[0];
        me.tipoFile  = ""
        if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile = "img"
        else me.tipoFile = "other"
        var reader = new FileReader();
        if (me) {
            reader.readAsDataURL(archivo );
            reader.onloadend = function () {
                var cal = new Object();
                cal.file = archivo
                cal.img  = reader.result
                cal.tipo = me.tipoFile
                cal.name = archivo.name
                me.attachmentArray.push(cal)
            }
        }
    },
    subirDocumento(){
      let me = this;
      let formData = new FormData();
      if(me.ifSaveImagen == false && me.attachmentArray.length == 0 && me.ifImagenBd){
        formData.append('archivo',        'no')
        formData.append('url',            'no')
      }
      formData.append('id',               me.id);
      formData.append('tipo',             me.ObjectPadre.tipo);
      formData.append('nombre',           me.ObjectPadre.nombre);
      formData.append('descripcion_corta',me.ObjectPadre.descripcion_corta);
      formData.append('representante',    me.ObjectPadre.representante);
      formData.append('direccion',        me.ObjectPadre.direccion);
      formData.append('ruc',              me.ObjectPadre.ruc);
      formData.append('email',            me.ObjectPadre.email);
      formData.append('telefono',         me.ObjectPadre.telefono);
      formData.append('secuencial',       me.ObjectPadre.secuencial);
      formData.append('estado',           me.ObjectPadre.estado);
      this.$http.post(this.$server_url + 'empresa', formData)
      .then(res => {
        let getId = res.data.id
        me.$vs.notify({
        text:"Se guardo correctamente",
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.saveEvidencia(getId)
          // this.$emit('f_creado', 1);
      })
      .catch(err => {
          console.log(err);
      })
    },
    saveEvidencia(getId){
      let me = this
      //files
      let imgsEnviar = []
      let formData = new FormData();
      if(me.ifSaveImagen || me.attachmentArray.length == 0){
        formData.append('noSendFiles','yes')
        this.$emit('f_creado', 1);
        return
      }else{
        me.attachmentArray.forEach(element => {
        imgsEnviar.push(element.file)
        });
        for(let i=0; i<this.attachmentArray.length;i++){
            formData.append('archivos[]',              imgsEnviar[i]);
        }
      }
      formData.append('id',                   getId)
      formData.append('saveArchivos',         'yes')
      formData.append('imgOld',               me.imgOld)
      formData.append('archivoEmpresa',       'yes')
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      axios.post(this.$data_url + 'api/guardarDatosPedido', formData, config)
      .then(function (res) {
        me.regresar()
      })
      .catch(function (error) {
      })
    },
    regresar(){
      this.$emit('f_creado', 1);
    }
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
