<template>
    <vx-card
    :title="sendPedido.id_pedido == 0 ? 'Crear Pedido':'Informacion Pedido #'+sendPedido.id_pedido"
    >
      <div class="vx-row">
        <div class="vx-col md:w-4/5 w-full mb-3">
          <div class="label_inputs">Institución</div>
          <v-select :options="arrayInstituciones" :reduce="arrayInstituciones => arrayInstituciones.idInstitucion" label="nombre_institucion" v-model="pedido.institucion" class="w-full" @input="buscaPedidoGenerado(pedido.institucion)" />
        </div>
        <div class="vx-col md:w-1/5 w-full mb-3">
          <div class="label_inputs">Asesor</div>
          <p style="font-weight: 500;" class="text-primary">{{pedido.asesor}}</p>
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
          <vs-input type="text" label="Ruc institución" v-model="pedido.ruc" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
          <vs-input type="text" label="Dirección institución" v-model="pedido.direccionInstitucion" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
          <div class="label_inputs">Nivel</div>
          <v-select :options="arregloNivel" :reduce="arregloNivel => arregloNivel.id" label="label" v-model="pedido.nivel" class="w-full" />
        </div>
        <!--ESC PARTICULARES-->
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
          <div class="label_inputs">Seleccione el tipo de escuela:</div>
          <v-select :options="tiposEscuelas" @input="pedido.tipo_descripcion = Eselect" :reduce="tiposEscuelas => tiposEscuelas" v-model="Eselect" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
          <vs-input type="text" label="Tipo institución(Ejem. Esc. Particulares)" disabled placeholder="Ejem. Esc. Particulares" v-model="pedido.tipo_descripcion" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
          <vs-input type="number" label="Télefono institución" v-model="pedido.telefonoInstitucion" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
          <vs-input type="text" label="Período" disabled v-model="pedido.periodo" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
          <div class="label_inputs">Tipo de venta</div>
          <v-select :options="tipos_venta" :reduce="tipos_venta => tipos_venta.id_tipo" label="tipo_venta" v-model="pedido.tipo_venta" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
          <div class="label_inputs">Fecha solicitud</div>
          <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_envio" placeholder="Fecha solicitud" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
          <div class="label_inputs">Fecha entrega</div>
          <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_entrega" placeholder="Fecha entrega" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
            <vs-input type="number" label="Comisión %" v-model="pedido.descuento" class="w-full" />
        </div>
        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3" v-if="userRoot || userAsesor">
          <small>Facturador vee:</small>
          <ul class="flex">
            <li>
              <vs-radio v-model="pedido.facturacion_vee" class="mr-3"  vs-name="radios1facturacion_vee" vs-value="0">No</vs-radio>
            </li>
            <li>
              <vs-radio v-model="pedido.facturacion_vee"  vs-name="radios1facturacion_vee" vs-value="1">Si</vs-radio>
            </li>
          </ul>
        </div>
        <!--OBSERVACION-->
        <div style="width: 100%;" class="mt-5">
          <vs-textarea  counter="500" style="width:100%;" height="200px"  label="Observación" :counter-danger.sync="counterDanger" v-model="pedido.observacion" />
        </div>
      </div>
      <div class="flex justify-center">
          <vs-button color="warning" class="mr-2" type="border" icon-pack="feather" icon="icon-save" v-if="usuario.id_group != 22" @click="guardarPedido">Guardar pedido</vs-button>
          <vs-button color="success" v-if="pedido.id_pedido > 0"  type="gradient" @click="input_comentario = ''; ver_comentarios(); popupComentarios = true">Ver comentarios</vs-button>
      </div>
      <!--MODALES-->
      <!--POPUP COMENTARIOS-->
      <vs-popup fullscreen title="Comentarios" :active.sync="popupComentarios">
        <div class="w-full" align="center">
          <vs-textarea v-model="input_comentario" class="w-ful mb-3" />
          <vs-button type="line" color="success" @click="guardar_comentario">Enviar</vs-button>
        </div>
        <vs-divider></vs-divider>
        <vs-list>
          <div :key="index" v-for="(item, index) in comentarios">
            <vs-list-header :title="item.nombres + ' ' + item.apellidos"></vs-list-header>
            <vs-list-item :subtitle="item.comentario">
              <span style="font-size: 12px;" class="m-2"> {{item.created_at}} </span>
            </vs-list-item>
          </div>
        </vs-list>
      </vs-popup>
    </vx-card>
  </template>
  <script>
  import {
    mapState
} from "vuex";
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import vSelect from 'vue-select';
  import axios from 'axios'
  import PedidosRepository from "../../../../repositories/PedidosRepository";
  export default {
      components:{
        flatPickr,
        'v-select': vSelect,
      },
      data: () => ({
        usuario:[],
        pedido:{
          id_pedido:0,
          institucion:'',
          asesor:'',
          ruc:'',
          direccionInstitucion:'',
          nivel:'',
          tipo_descripcion:'',
          telefonoInstitucion:'',
          periodo:'',
          idperiodo:'',
          tipo_venta:'',
          fecha_envio:'',
          fecha_entrega:'',
          descuento:'',
          estado:0,
          contrato_generado:'',
          id_asesor:0,
          facturacion_vee:0,
          observacion:'',
        },
        Eselect:'',
        arrayInstituciones:[],
        arrayPeriodos:[],
        arregloNivel:[
          {
            id:1,
            label:'Educación General Básica'
          },
          {
            id:2,
            label:'Bachillerato General Unificado'
          },
        ],
        tiposEscuelas:[
          "Esc. Particulares",
          "Esc. Fiscomisional",
          "Esc. Fiscal",
        ],
        tipos_venta: [
          {id_tipo: 1, tipo_venta: 'Directa'},
          {id_tipo: 2, tipo_venta: 'Comisión o lista'},
        ],
        configdateTimePicker: {
          enableTime: true,
          dateFormat: 'Y-m-d'
        },
        sendPedido:'',
        counterDanger: false,
        //variables de comentarios
        comentarios:[],
        popupComentarios:false,
        input_comentario:'',
        //fin variables de comentarios
      }),
      mounted() {
        let me = this
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.setDatos()
      },
      computed:{
        ...mapState(["auth",'userRoot','susuario','ObjectPedido','userAsesor']),
      },
      methods: {
        setDatos(){
          let me = this;
          me.sendPedido = me.ObjectPedido
          //crear
          if(me.sendPedido.id_pedido == 0){
            me.getInstituciones(me.usuario.cedula)
            me.limpiar()
          }
          //editar
          else{
            me.getInstituciones(me.sendPedido.cedula_asesor)
            me.pedido = {
              id_pedido:            me.sendPedido.id_pedido,
              estado:               me.sendPedido.estado,
              institucion:          me.sendPedido.id_institucion,
              asesor:               me.sendPedido.responsable,
              ruc:                  me.sendPedido.ruc,
              direccionInstitucion: me.sendPedido.direccionInstitucion,
              nivel:                me.sendPedido.nivel,
              tipo_descripcion:     me.sendPedido.tipo_descripcion,
              telefonoInstitucion:  me.sendPedido.telefonoInstitucion,
              periodo:              me.sendPedido.periodo,
              idperiodo:            me.sendPedido.id_periodo,
              tipo_venta:           me.sendPedido.tipo_venta,
              fecha_envio:          me.sendPedido.fecha_envio,
              fecha_entrega:        me.sendPedido.fecha_entrega,
              descuento:            me.sendPedido.descuento,
              contrato_generado:    me.sendPedido.contrato_generado,
              id_asesor:            me.sendPedido.id_asesor,
              facturacion_vee:      me.sendPedido.facturacion_vee,
              observacion:          me.sendPedido.observacion
            }
          }
        },
        getInstituciones(cedula){
          let me = this
          this.$http.get(this.$server_url+'get_instituciones_asesor/'+cedula)
          .then(res => {
              me.arrayInstituciones = res.data
          })
        },
        guardarPedido(){
          let me = this
          if(me.sendPedido.estado == 2){
            me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'No se puede modificar el pedido anulado',
              time:5000,
              })
            return false
          }
          if(me.pedido.ruc == "" || me.pedido.ruc == "null"){
            me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'El ruc no puede quedar vacio',
              time:5000,
              })
            return false
          }
          if(me.codigo_institucion_milton == '22507'){
            me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'El id institución hay que cambiar informar a soporte por favor',
              time:5000,
              })
            return false
          }
          if(me.pedido.contrato_generado == null || me.pedido.contrato_generado == "null" || me.pedido.contrato_generado == ""){
          }else{
            me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'El pedido ya tiene el contrato ' + me.pedido.contrato_generado +" No puede realizar cambios"
              })
            return false;
          }
          if(me.pedido.nivel == null || me.pedido.nivel == "" || me.pedido.nivel == undefined){
            me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'Seleccione un nivel por favor'
              })
            return false;
          }
          if( me.pedido.idperiodo == '' || me.pedido.tipo_venta == '' || me.pedido.fecha_envio == '' || me.pedido.fecha_entrega == '' || me.pedido.institucion == '' || me.pedido.direccionInstitucion == '' || me.pedido.ruc == '' || me.pedido.tipo_descripcion == '' || me.pedido.telefonoInstitucion == ''){
            me.$vs.notify({ text: 'Llene todos los campos antes de guardar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          let formData = new FormData();
          formData.append('informacionPedido',   'yes');
          formData.append('id_pedido',            me.pedido.id_pedido);
          formData.append('tipo_venta',           me.pedido.tipo_venta);
          formData.append('tipo_venta_descr',     me.pedido.tipo_venta == 1 ? 'Venta directa' : 'Comisión o lista');
          formData.append('fecha_envio',          me.pedido.fecha_envio);
          formData.append('fecha_entrega',        me.pedido.fecha_entrega);
          formData.append('institucion',          me.pedido.institucion);
          formData.append('periodo',              me.pedido.idperiodo);
          formData.append('descuento',            me.pedido.descuento);
          formData.append('id_asesor',            me.pedido.id_asesor);
          formData.append('facturacion_vee',      me.pedido.facturacion_vee);
          formData.append('observacion',          me.pedido.observacion);
          //para actualizar la institucion
          formData.append('ruc',                  me.pedido.ruc);
          formData.append('direccionInstitucion', me.pedido.direccionInstitucion);
          formData.append('nivel',                me.pedido.nivel);
          formData.append('tipo_descripcion',     me.pedido.tipo_descripcion);
          formData.append('telefonoInstitucion',  me.pedido.telefonoInstitucion);
          //fin para actualizar la institucion
          me.$vs.loading();
          //axios.post(this.$data_url+'api/guardarPedido',formData)
          this.$http.post(this.$server_url+'pedidos', formData)
          .then(res => {
            me.$vs.loading.close();
            if(res.data.status == 0){
              me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
              return
            }
            if( res.data.error ){
              alert(res.data.error)
              return
            }else{
              me.$vs.notify({
              color: 'primary',
              title: 'Mensaje',
              text: 'Se guardo correctamente'
              })
              me.rechargePedido(res.data.pedido.id_pedido)

            }
          })
          .catch(err => {
            console.log(err)
            me.$vs.loading.close();
          })
        },
        rechargePedido(id_pedido){
          let me = this
          PedidosRepository.getPedidoXID(id_pedido).then(r => { this.$store.dispatch('setPedido',r.data[0]); this.setDatos(); })
        },
        buscaPedidoGenerado(tr){
          let me = this
          //limpiar
          me.pedido.ruc                   = ""
          me.pedido.direccionInstitucion  = ""
          me.pedido.nivel                 = ""
          me.pedido.tipo_descripcion      = ""
          me.pedido.telefonoInstitucion   = ""
          if(me.pedido.institucion == null || me.pedido.institucion == "" || me.pedido.institucion == undefined){
            me.$vs.notify({
            text:'Seleccione una institución por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
          }
          //proceso
          let setValores                  = me.arrayInstituciones.filter(p => p.idInstitucion == me.pedido.institucion)[0]
          me.pedido.ruc                   = setValores.ruc
          me.pedido.direccionInstitucion  = setValores.direccionInstitucion
          me.pedido.nivel                 = setValores.nivel
          me.pedido.tipo_descripcion      = setValores.tipo_descripcion
          me.pedido.telefonoInstitucion   = setValores.telefonoInstitucion
          localStorage.setItem("institucion_selected_pedido", me.pedido.institucion)
          localStorage.setItem("id_asesor_pedido", me.pedido.id_asesor)
        },
          //METODOS PARA COMENTARIOS
        ver_comentarios(){
          let me = this
          me.$vs.loading();
          this.$http.get(this.$server_url+'get_comentarios_pedido/'+me.pedido.id_pedido)
          .then(res => {
            me.comentarios = res.data
            // me.cant_sms = res.data.length
            me.$vs.loading.close();
          })
          .catch(err => {
            me.$vs.loading.close();
          })
        },
        guardar_comentario(){
          let me = this
          let formData = new FormData();
          formData.append('id_pedido',  me.pedido.id_pedido);
          formData.append('comentario', me.input_comentario);
          formData.append('id_usuario', me.usuario.idusuario);
          formData.append('id_group',   me.usuario.id_group)
          me.$vs.loading();
          this.$http.post(this.$server_url+'guardar_comentario', formData)
          .then(res => {
            me.input_comentario = ''
            me.ver_comentarios()
            me.$vs.loading.close();
          })
          .catch(err => {
            console.log(err)
              me.$vs.loading.close();
          })
        },
        limpiar(){
          let me = this;
          me.pedido = {
            id_pedido:               0,
            estado:0,
            institucion:'',
            asesor:                   me.usuario.nombres + " "+me.usuario.apellidos,
            ruc:'',
            direccionInstitucion:'',
            nivel:'',
            tipo_descripcion:'',
            telefonoInstitucion:'',
            periodo:                me.sendPedido.periodo,
            idperiodo:              me.sendPedido.id_periodo,
            tipo_venta:'',
            fecha_envio:'',
            fecha_entrega:'',
            descuento:'',
            contrato_generado:'',
            id_asesor:                me.usuario.idusuario,
            facturacion_vee:          0,
            observacion:              ''
          }
        }
      },
  }
  </script>

  <style>
  .label_inputs{
    font-size: 12px;
    color: rgb(143, 143, 143);
    margin-top: 4px;
    padding-left: 4px;
  }

  </style>
