<template>
  <vx-card
  :title="titulo"
  title-color="primary"
  >
    <div class="p-6">
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
            </div>
            <div class="vx-col sm:w-1/3 w-full">
                <vs-avatar v-if="institucion.imgenInstitucion != ''" class="mx-auto my-6 block" size="100px" :src="$data_url+'archivos/instituciones_logos/'+institucion.imgenInstitucion" />
                <vs-avatar v-else class="mx-auto my-6 block" size="100px" src="https://foro.prolipadigital.com.ec/uploads/icono_institucion_6e40e174fa.jpg" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Cambiar logo institución</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <input type="file" id="file" class="w-full" icon-pack="feather" icon="icon-image" icon-no-border @change="obtenerImagen" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" />
                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                <p class="text-danger"> {{msj}} </p>
                <div class="v-row text-left" v-if="porcentaje > 0">
                    <vs-progress style="height:25px" :percent="porcentaje" color="success"> {{porcentaje}}% </vs-progress>
                </div>
            </div>
        </div>
      <div class="vx-row mb-6">
        <input type="text" v-model="institucion.idInstitucion" hidden>
        <div class="vx-col sm:w-1/3 w-full">
          <span>Nombre</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" icon-no-border v-model="institucion.nombreInstitucion" />
          <span class="text-danger text-sm" v-show="errors.nombreInstitucion">{{ errors.nombreInstitucion }}</span>
        </div>
      </div>
      <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
              <span>Dirección</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
              <vs-input class="w-full" icon-no-border v-model="institucion.direccionInstitucion" />
              <span class="text-danger text-sm" v-show="errors.direccionInstitucion">{{ errors.direccionInstitucion }}</span>
          </div>
      </div>
      <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
              <span>Teléfono</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-no-border v-model="institucion.telefonoInstitucion" />
            <span class="text-danger text-sm" v-show="errors.telefonoInstitucion">{{ errors.telefonoInstitucion }}</span>
          </div>
        </div>
      <div class="vx-row mb-6" v-if="usuario.id_group == 1">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Id institución FACTURACIÓN</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
              <vs-input class="w-full" icon-no-border v-model="institucion.codigo_institucion_milton" />
              <span class="text-danger text-sm" v-show="errors.codigo_institucion_milton">{{ errors.codigo_institucion_milton }}</span>
          </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span class="mt-1">Región</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
            <ul class="demo-alignment">
                <li>
                    <vs-radio v-model="institucion.region_idregion" vs-value="2">Costa</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="institucion.region_idregion" vs-value="1">Sierra</vs-radio>
                </li>
            </ul>
            <span class="text-danger text-sm" v-show="errors.region_idregion">{{ errors.region_idregion }}</span>
        </div>
      </div>
      <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
              <span>Salle</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
              <ul class="demo-alignment">
                  <li>
                      <vs-radio v-model="institucion.tipo_institucion" vs-value="si">Si</vs-radio>
                  </li>
                  <li>
                      <vs-radio v-model="institucion.tipo_institucion" vs-value="no">No</vs-radio>
                  </li>
              </ul>
              <span class="text-danger text-sm" v-show="errors.tipo_institucion">{{ errors.tipo_institucion }}</span>
          </div>
      </div>
      <div class="vx-row mb-6" v-if="permisoRoot == true">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Aplica matricula</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
            <ul class="demo-alignment">
                <li>
                    <vs-radio v-model="institucion.matricula" vs-value="1">Si</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="institucion.matricula" vs-value="0">No</vs-radio>
                </li>
            </ul>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Estado</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
            <ul class="demo-alignment">
                <li>
                    <vs-radio v-model="institucion.estado" vs-name="radiosEstado" vs-value="1">Activo</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="institucion.estado" vs-name="radiosEstado" vs-value="2">Desactivado</vs-radio>
                </li>
            </ul>
        </div>
      </div>
      <div class="vx-row mb-6" v-if="permisoRoot == true">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Punto de venta</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
            <ul class="demo-alignment">
                <li>
                    <vs-radio v-model="institucion.punto_venta" vs-name="radiosEstadopunto_venta" vs-value="1">Si</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="institucion.punto_venta" vs-name="radiosEstadopunto_venta" vs-value="0">No</vs-radio>
                </li>
            </ul>
        </div>
      </div>
      <div class="vx-row mb-6" v-if="permisoRoot == true">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Evaluaciones Personalizadas</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
            <ul class="demo-alignment">
                <li>
                    <vs-radio v-model="institucion.evaluacion_personalizada" vs-name="radiosevaluacion_personalizada" vs-value="1">Si</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="institucion.evaluacion_personalizada" vs-name="radiosevaluacion_personalizada" vs-value="0">No</vs-radio>
                </li>
            </ul>
        </div>
      </div>
      <div class="vx-row mb-6" v-if="permisoRoot == true">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Evaluaciones cambio de ventana ( 0 = quiere decir que no se controla ) </span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" type="number" min="0"  max="5" icon-no-border v-model="institucion.cantidad_cambio_ventana_evaluacion" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Ciudad</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="ciudad" :reduce="ciudad => ciudad.idciudad" label="nombre" v-model="institucion.ciudad_id"></v-select>
            <span class="text-danger text-sm" v-show="errors.ciudad_id">{{ errors.ciudad_id }}</span>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Zona</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="zona" :reduce="zona => zona.idzona" label="zn_nombre" v-model="institucion.zona_id"></v-select>
            <span class="text-danger text-sm" v-show="errors.zona_id">{{ errors.zona_id }}</span>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Vendedor</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <v-select :options="vendedor" :reduce="vendedor => vendedor.cedula" label="nombres" v-model="institucion.vendedorInstitucion"></v-select>
          <span class="text-danger text-sm" v-show="errors.vendedorInstitucion">{{ errors.vendedorInstitucion }}</span>
        </div>
      </div>
      <div class="vx-row mb-6" v-if="permisoRoot == true">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Porcentaje máximo obsequios</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-no-border v-model="institucion.maximo_porcentaje_autorizado" />
        </div>
      </div>
      <div class="p-2 text-center" slot="footer">
        <div class="flex flex-wrap mt-4">
            <vs-button color="danger" type="border" class="mb-2 m-2" @click="volver()">Cancelar</vs-button>
            <vs-button color="success" type="border" class="mb-2 m-2" @click="guardar(institucion)"> {{titulo}} </vs-button>
            <div class="w-1/3 ml-auto">
            </div>
            <div class="w-1/3 ml-auto">
            </div>
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    props: {
      id:{
        type:Number,
        defaut:0,
      },
      xciudad: {
        type: String,
        default: "no"
      }
    },
    components: {
      'v-select': vSelect,
    },
    data() {
        return {
            institucion: {
                'idInstitucion': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'ciudad_id': '',
                'region_idregion': '',
                'estado': '1',
                'matricula': '0',
                'punto_venta': 0,
                'evaluacion_personalizada': 0,
                'cantidad_cambio_ventana_evaluacion': 0,
                'zona_id': '',
                'maximo_porcentaje_autorizado':45
            },
            errors: {
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'ciudad_id': '',
                'region_idregion': '',
                'zona_id': '',
                'maximo_porcentaje_autorizado':45
            },
            titulo: '',
            zona: [],
            ciudad: [],
            region: [],
            periodo: [],
            vendedor: [],
            usuario: '',
            limiteMegas: 1,
            porcentaje: '',
            pesoArchivo: '',
            muyPesado: '',
            msj: '',
            permisoRoot: false,
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getCiudadSelect();
        me.getZonaSelect();
        me.getRegionSelect();
        me.getVendedor();
        if (me.id == 0) {
          me.titulo = "Agregar institución";
        }else{
          me.titulo = "Editar institución";
          me.getInstitucion(me.id)
        }
        me.getUserRoot()
    },
    methods: {
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                .then(function (res) {
                    if (res.data.status == '1') {
                        me.permisoRoot = true
                    } else {
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        obtenerImagen(e) {
            let me = this;
            me.file = e.target.files[0];
            // console.log(me.file)
            me.muyPesado = false;
            me.pesoArchivo = (me.file.size / me.bytes).toFixed(2);
            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
                me.msj = 'El archivo que intenta, pesa ' + me.pesoArchivo + ' mb. y excede el peso permitido, favor verifique';
            }
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url + "ciudad").then(function (response) {
                me.ciudad = response.data;
                // console.log(me.ciudad);
            });
        },
        async getZonaSelect() {
            let me = this;
            this.$http.get(this.$server_url + "zonas")
            .then(function (response) {
                me.zona = response.data;
                // console.log(me.zona);
            });
        },
        async getRegionSelect() {
            let me = this;
            this.$http.get(this.$server_url + "region").then(function (response) {
                me.region = response.data;
            });
        },
        async getPeriodoSelect() {
            let me = this;
            this.$http.get(this.$server_url + "periodo").then(function (response) {
                me.periodo = response.data;
            });
        },
        async getInstitucion(idinstitucion) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "institucion/" + idinstitucion)
              .then(function (response) {
                  me.institucion = response.data;
                  if (me.institucion.tipo_institucion == 1) {
                      me.institucion.tipo_institucion = 'no'
                  } else {
                      me.institucion.tipo_institucion = 'si'
                  }
                  me.institucion.estado = response.data.estado_idEstado
                  me.institucion.matricula = response.data.aplica_matricula == 1 ?
                  me.institucion.matricula = 1 :
                  me.institucion.matricula = 0;
                  me.$vs.loading.close();
              })
              .catch(function (error) {
                  me.$vs.loading.close();
              })
        },
        guardar(data) {
            let me = this;
            this.errors = {
                'idInstitucion': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'ciudad_id': '',
                'region_idregion': '',
                'zona_id': '',
                'maximo_porcentaje_autorizado':45
            }
            var asesor_id = 0
            if (me.institucion.vendedorInstitucion == "" || me.institucion.vendedorInstitucion == null || me.institucion.vendedorInstitucion == undefined) {} else {
                //obtener el id del asesor
                let datos = me.vendedor
                let obtenerId = datos.filter(p => p.cedula == me.institucion.vendedorInstitucion)
                asesor_id = obtenerId[0].idusuario
            }
            if(me.institucion.maximo_porcentaje_autorizado < 30 ){
                me.$vs.notify({
                text:'El porcentaje máximo de descuento no puede ser menor a 30',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.loading();
            let formData = new FormData();
            formData.append('imagenInstitucion',            me.file);
            formData.append('idInstitucion',                me.institucion.idInstitucion);
            formData.append('nombreInstitucion',            me.institucion.nombreInstitucion);
            formData.append('telefonoInstitucion',          me.institucion.telefonoInstitucion);
            formData.append('direccionInstitucion',         me.institucion.direccionInstitucion);
            formData.append('solicitudInstitucion',         0);
            formData.append('codigo_institucion_milton',    me.institucion.codigo_institucion_milton);
            formData.append('vendedorInstitucion',          me.institucion.vendedorInstitucion);
            formData.append('tipo_institucion',             me.institucion.tipo_institucion == 'si' ? '2' : '1');
            formData.append('idcreadorinstitucion',         me.usuario.idusuario);
            formData.append('ciudad_id',                    me.institucion.ciudad_id);
            formData.append('estado',                       me.institucion.estado)
            formData.append('region_idregion',              me.institucion.region_idregion);
            formData.append('aplica_matricula',             me.institucion.matricula)
            formData.append('punto_venta',                  me.institucion.punto_venta)
            formData.append('evaluacion_personalizada',     me.institucion.evaluacion_personalizada)
            formData.append('cantidad_cambio_ventana_evaluacion', me.institucion.cantidad_cambio_ventana_evaluacion)
            formData.append('zona_id',                      me.institucion.zona_id)
            formData.append('asesor_id',                    asesor_id)
            formData.append('maximo_porcentaje_autorizado', me.institucion.maximo_porcentaje_autorizado);
            if (me.file == undefined) {
                this.$http.post(this.$server_url + "institucion", formData)
                    .then(function (response) {
                        me.file = '';
                        window.$("#file").val('');
                        me.$vs.notify({
                            color: 'success',
                            text: 'Institucion agregada correctamente',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        //0 => RECARGAR ; 1 CERRAR MODAL
                        me.$emit('rechargeInstitucion',"0");
                        me.$vs.loading.close();
                    })
                    .catch(function (error) {
                        if (error.response.status == '422') {
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.nombreInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.telefonoInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.direccionInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.solicitudInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.vendedorInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.ciudad_id[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {}
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.region_idregion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                        }
                        me.$vs.loading.close();
                    })
            } else {
            formData.append('enviarArchivo', "yes");
                axios.post(this.$data_url + "api/institucion", formData)
                    .then(function (response) {
                        me.file = '';
                        window.$("#file").val('');
                        me.$vs.notify({
                            color: 'success',
                            text: 'Institucion agregada correctamente',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$vs.loading.close();
                        me.volver();
                    })
                    .catch(function (error) {
                        if (error.response.status == '422') {
                            console.log(error.response.data);
                            me.errors.nombreInstitucion = error.response.data.errors.nombreInstitucion[0];
                            me.errors.telefonoInstitucion = error.response.data.errors.telefonoInstitucion[0];
                            me.errors.direccionInstitucion = error.response.data.errors.direccionInstitucion[0];
                            me.errors.solicitudInstitucion = error.response.data.errors.solicitudInstitucion[0];
                            me.errors.vendedorInstitucion = error.response.data.errors.vendedorInstitucion[0];
                            me.errors.ciudad_id = error.response.data.errors.ciudad_id[0];
                            me.errors.region_idregion = error.response.data.errors.region_idregion[0];
                        }
                        me.$vs.loading.close();
                    })
            }

        },
        async getVendedor() {
            let me = this;
            this.$http.get(this.$server_url + 'listaAsesores')
                .then(function (response) {
                    me.vendedor = response.data;
                    // console.log(me.vendedor);
                })
                .catch(function (error) {})
        },
        volver() {
            let me = this;
            //0 => RECARGAR ; 1 CERRAR MODAL
            me.$emit('rechargeInstitucion',"1");
        }
    }
}
</script>
