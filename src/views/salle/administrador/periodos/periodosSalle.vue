<template>
  <div>
    <div>
      <vs-alert active="true" class="mt-2" color="danger" v-if="filtroActivos.length > 1">
        <p class="text-center"><ion-icon name="warning-outline"></ion-icon> Existe más de 2 <b>períodos</b> de evaluación Asignados</p>
      </vs-alert>
    </div>
    <br>
    <!--FIN DEL CONTENIDO POPUP PARA AGREGAR UN Agregar / Editar-->
    <vx-card title="Periodo Evaluación" v-if="userAdminSalle">
      <vs-alert
        color="primary"
        title="Mensaje" active="true">
        <p>Solo puede estar una <b>Evaluación</b> activa, las preguntas de dicha evaluación se mostrara a los docentes</p>
      </vs-alert>
      <!--Tabla para el listado de la tabla periodos-->
      <vs-table stripe max-items="50" search pagination :data="arregloPeriodos">
        <template slot="header">
          <vs-button @click="limpiarcampos();addPeriodo();" style="margin-left: 5px;" color="success" type="filled">
              + Agregar Evaluación
          </vs-button>
        </template>
        <template slot="thead">
          <vs-th>Id</vs-th>
          <vs-th>Nombre</vs-th>
          <!-- <vs-th>Fechas</vs-th> -->
          <vs-th>Estado</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].nombre">
              {{data[indextr].id}}
            </vs-td>
            <vs-td :data="data[indextr].nombre">
              {{data[indextr].nombre}}
            </vs-td>
            <!-- <vs-td :data="data[indextr].fecha_final">
              <b>Fecha inicio:</b>
              <p>{{ tr.fecha_inicio }}</p>
              <br>
              <b>Fecha Fin:</b>
              <p>{{ tr.fecha_fin }}</p>
            </vs-td> -->
            <vs-td :data="data[indextr].estado">
              <label v-if="data[indextr].estado == '1'" class="text-success">Activo</label>
              <label v-if="data[indextr].estado == '0'" class="text-danger">Inactivo</label>
            </vs-td>
            <vs-td :data="tr">
                <div class="flex">
                  <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                    <vs-button type="line" radius size="large" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="update = true; openModal(data[indextr]);"></vs-button>
                  </vx-tooltip>
                  <vx-tooltip style="display: inline-block;" text="Desactivar" position="top" color="primary">
                    <vs-button type="line" radius v-if="data[indextr].estado == '1'" size="large" icon-pack="feather" icon="icon-x" class="mr-2" color="danger" @click="cambiarEstado(tr,0)"></vs-button>
                  </vx-tooltip>
                  <vx-tooltip style="display: inline-block;" text="Activar" position="top" color="primary">
                    <vs-button color="primary" radius v-if="data[indextr].estado == '0'" size="large" type="line" icon-pack="feather" icon="icon-check" @click="cambiarEstado(tr,1)"></vs-button>
                  </vx-tooltip>
                </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
    <!--MODALES-->
    <!--Contenido del boton agregar un periodo-->
    <div class="centerx">
      <vs-popup classContent="popup-example" :title="titleModal" :active.sync="popupActivo2">
        <div class="vx-col w-full mt-5">
          <label>Nombre</label>
          <vs-input class="inputx w-full" placeholder="Nombre" v-model="periodo.nombre" />
        </div>
        <!-- <div class="vx-col w-full mt-5">
          <label>Fecha Inicio</label>
          <flat-pickr :config="configdateTimePicker"    v-model="periodo.fecha_inicio" placeholder="Fecha Inicio" class="m-1 inputx w-full" style="display: inline-block;" />
        </div>
        <div class="vx-col w-full mt-5">
          <label>Fecha Final</label>
          <flat-pickr :config="configdateTimePicker"    v-model="periodo.fecha_fin" placeholder="Fecha Fin" class="m-1 inputx w-full" style="display: inline-block;" />
        </div> -->
        <div class="flex justify-center">
          <vs-button @click="agregarPeriodo();" class="mt-5" color="primary" type="filled">Guardar Cambios</vs-button>
        </div>
      </vs-popup>
    </div>
  </div>
  </template>
  <script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import Vue from 'vue'
  import axios from 'axios'
  import vSelect from 'vue-select'
  import moment from 'moment'
  import $ from 'jquery'
  export default {
      data: () => ({
          //para el modal
          popupActivo2: false,
          id: 0,
          titleModal: '',
          arregloPeriodos: [],
          usuario: '',
          usuario_id: '',
          periodo: {
            fecha_inicio: '',
            fecha_fin: '',
            nombre: '',
          },
          configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d'
          },
          filtroActivos:0,
          userAdminSalle:false,
      }),
      components:{
         flatPickr,
      },
      mounted() {
        let me = this;
        me.usuario    = JSON.parse(localStorage.getItem('usuario'));
        me.usuario_id = me.usuario.idusuario
        if(me.usuario.id_group == 12) me.userAdminSalle = true;
        me.getAdmin();
      },
      methods: {
        getAdmin() {
          let me = this;
          me.$vs.loading()
          this.$http.get(this.$server_url+'salle/periodos')
            .then(function (response) {
              me.$vs.loading.close()
              me.arregloPeriodos = response.data;
              let datos = response.data
              if(datos.length > 0){
                //solo puede activo 2 periodos para cambiar
                let preData = datos.filter(p => p.estado == '1')
                me.filtroActivos = preData
              }
            })
            .catch(function (error) {
              me.$vs.loading.close()
            })
        },
        addPeriodo() {
          let me = this;
          me.id = 0
          me.popupActivo2 = true;
        },
        //para agregar periodo
        agregarPeriodo() {
          let me = this;
          let formData = new FormData();
          //validacion
          if(me.periodo.nombre == ""){
            me.$vs.notify({
              text: 'Debe seleccionar un nombre por favor',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            return
          }
          formData.append('id',                   me.id);
          // formData.append('fecha_inicio',         me.periodo.fecha_inicio);
          // formData.append('fecha_fin',            me.periodo.fecha_fin);
          formData.append('nombre',               me.periodo.nombre);
          me.$vs.loading()
          this.$http.post(this.$server_url+'salle/periodos', formData)
            .then(res => {
              me.$vs.loading.close()
              me.getAdmin();
              me.popupActivo2 = false
              me.$vs.notify({
                text: 'Periodo guardado exitosamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
            })
        },
        openModal(data = {}) {
          let me = this;
          this.id                             = data.id;
          this.titleModal                     = "Modificar Período Evaluación";
          this.periodo.fecha_inicio           = data.fecha_inicio;
          this.periodo.fecha_fin              = data.fecha_fin;
          this.periodo.nombre                 = data.nombre;
          me.popupActivo2                     = true
        },
        limpiarcampos() {
          this.id                             = 0;
          this.titleModal                     = "Crear Período Evaluación";
          this.periodo.fecha_inicio           = "";
          this.periodo.fecha_fin              = "";
          this.periodo.nombre                 = "";
        },
        // desactivar el estado de la tabla
        cambiarEstado(tr,estado) {
          let me = this;
          let formData = new FormData();
          formData.append('cambiarEstadoPeriodo','yes')
          formData.append('id',     tr.id);
          formData.append('estado', estado);
          me.$vs.loading()
          this.$http.post(this.$server_url+'salle/periodos', formData)
            .then(res => {
              me.$vs.loading.close()
              me.getAdmin();
              if(res.data.status == 0){
                me.$vs.notify({
                  text: res.data.message,
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-check',
                  time:4000
                })
                return
              }
              me.$vs.notify({
                text: 'Estado actualizado correctamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
            })
            .catch((e) =>{
              me.$vs.loading.close()
            })
        },
      },
  }
  </script>
  <style scoped>
  .features {
    display: flex;
    flex-direction: column;
  }
  .features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .features li + * {
    margin-top: 0.75rem;
  }
  .features .icon {
    background-color: #1FCAC5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  .features .icon svg {
    width: 14px;
    height: 14px;
  }
  .features + * {
    margin-top: 1.25rem;
  }

  </style>


