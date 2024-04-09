<template>
    <div class="mt-5">
        <div>
            <vs-popup title="Agregar tema de capacitación " :active.sync="modalAdd">
                <div class="m-2">
                    <vs-checkbox v-model="otra_area">Otra área</vs-checkbox>
                    <vs-input v-if="otra_area == 1" v-model="capacitacion.nueva_area" maxlength="300" class="mb-4 w-full" label="Nueva área" placeholder="Ingrese el nombre de la nueva área"></vs-input>
                </div>
                <div v-if="otra_area == 0">Area
                    <v-select :options="tipos" :reduce="tipos => tipos.idarea" label="nombrearea" class="w-full" v-model="areaSelect" />
                </div>
        
                <!-- {{areaSelect}} -->
                <vs-input v-model="capacitacion.tema" maxlength="300" class="mb-4 w-full" label="Tema"></vs-input>
                <vs-input v-model="capacitacion.capacitador" hidden maxlength="300" class="mb-4 w-full" label=""></vs-input>
                <vs-input v-model="capacitacion.observacion"  maxlength="300" class="mb-4 w-full" label="Observación"></vs-input>
                <label for="">Estado</label>
                <vs-switch style="width:85px" color="success" v-model="capacitacion.estado">
                    <span slot="on">Activo</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
                <vs-button class="mt-5" :color="color_boton" @click="f_verificar()" type="filled">{{txt_boton}} </vs-button>
            </vs-popup>
        </div>
        <div style="display:flex;">
            <vs-button color="primary" type="border" size="small" style="font-size: 14px;" @click="limpiar();f_agregar_cap();">Agregar Tema</vs-button>
            <vs-button color="warning" class="ml-3" icon="description" type="border" size="small" style="font-size: 14px;" @click="popupSolicitudes=true;">Solicitudes de Temas</vs-button>
            <vs-button radius color="warning" v-if="arregloSolicitudes.length > 0" class="ml-2" type="filled" icon="notifications_active"></vs-button>
        </div>
        <vs-table max-items="10" search pagination :data="capacitaciones">
            <template slot="header">
                Cantidad:<b> {{capacitaciones.length}}</b>
            </template>
            <template slot="thead">
                <vs-th>Tema</vs-th>
                <vs-th>Capacitador</vs-th>
                <vs-th>Area</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Fechas</vs-th>
                <vs-th></vs-th>

            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Tema</b>
                        <p>{{data[indextr].tema}}</p>
                        <b>Observación</b>
                        <p>{{ tr.observacion }}</p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].capacitador}}
                    </vs-td>
                    <vs-td>
                        <div v-if="data[indextr].area != null">
                            <span :key="itr" v-for="(tr, itr) in tipos">
                                <span v-if="data[indextr].area == tr.idarea"> {{tr.nombrearea}} </span>
                            </span>
                        </div>
                        <div v-if="data[indextr].nueva_area != null">
                            {{data[indextr].nueva_area}}
                        </div>
                    </vs-td>
                    <vs-td>
                        <span v-if="data[indextr].estado == 1" class="text-success">Activa</span>
                        <span v-else class="text-danger">Inactiva</span>
                    </vs-td>
                    <vs-td>
                        <small>Actualizado: {{fechaCorta(data[indextr].updated_at) }}</small><br>
                        <small>Creado: {{fechaCorta(data[indextr].created_at) }}</small>
                    </vs-td>
                    <vs-td>
                        <vs-button style="display:inline-block" @click="f_carga_datos(tr);" radius icon-pack="feather" icon="icon-edit" color="primary" type="border"></vs-button>
                        <vs-button class="ml-2" style="display:inline-block" @click="f_confirmar_elimina(tr);" radius icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--POPUP DE LISTADO DE SOLICITUDES-->
        <vs-popup class="holamundo" title="Solicitudes" fullscreen :active.sync="popupSolicitudes">
            <vs-table max-items="10" stripe search pagination :data="arregloSolicitudes">
                <template slot="thead">

                    <vs-th>Asesor</vs-th>
                    <vs-th>Tema</vs-th>
                    <vs-th>Observacion</vs-th>
                    <vs-th>Comentario Admin</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>

                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].asesor}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].tema}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].observacion}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].comentario_admin}}<br>
                        </vs-td>
                        <vs-td>
                            <span v-if="data[indextr].estado == 0"><br>
                                <vs-chip color="danger">Generado</vs-chip>
                            </span>
                            <span v-if="data[indextr].estado == 1"><br>
                                <vs-chip color="warning">Tema Creado</vs-chip>
                            </span>
                            <span v-if="data[indextr].estado == 2"><br>
                                <vs-chip color="success">No se pudo crear</vs-chip>
                            </span>
                        </vs-td>
                        <vs-td>
                            <div style="display:flex;">   
                                <vs-button radius color="success" @click="openModalEditar(tr)" type="line" icon="edit"></vs-button>
                                <vs-button type="line" style="border-radius: 10px;" class="ml-3" @click="limpiar();modalAdd = true;">Agregar Tema</vs-button>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
        <!--POPUP DE EDICION DE SOLICITUDES-->
        <vs-popup class="holamundo"  title="Enviar al asesor" :active.sync="popupEditSolicitud">
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-input label="Comentario" class="w-full" placeholder="Comentario" v-model="comentario"/>
                </vs-col>
            </vs-row>
            <vs-row class="mt-3">
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
                    <ul class="leftx">
                        <small>Estado</small>
                        <li class="mt-2">
                        <vs-radio v-model="estado" vs-name="radios1" vs-value="0">solicitud</vs-radio>
                        </li>
                        <li>
                        <vs-radio v-model="estado" vs-name="radios1" vs-value="1">Tema creado</vs-radio>
                        </li>
                        <li>
                        <vs-radio v-model="estado" vs-name="radios1" vs-value="2">No se pudo crear tema</vs-radio>
                        </li> 
                    </ul>
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button color="success" @click="GuardarEstadoSolicitud()" type="filled">Enviar</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
    </div>
</template>

<script>

import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            estado:'',
            capacitaciones: '',
            modalAdd: false,
            capacitacion: {
                'id': '',
                'nueva_area': '',
                'tema': '',
                'capacitador': '',
                'observacion':'',
                'estado': '',
            },
            tipos: [],
            areaSelect: '',
            otra_area: 0,
            txt_boton: 'Agregar',
            color_boton: 'warning',
            dato_eliminar: '',
            popupSolicitudes: false,
            popupEditSolicitud:false,
            arregloSolicitudes: [],
            id:0,
            asesor:'',
            comentario:''
         
        }
    },
    mounted() {
        let me = this;
        me.getTipoAreas();
        me.getCapacitaciones();
        me.verSolicitudes()
    },
    methods: {
        GuardarEstadoSolicitud(){
            let me = this;
            let formData = new FormData();
            formData.append('id', me.id);
            formData.append('asesor', me.asesor);
            formData.append('estado', me.estado);
            formData.append('comentario', me.comentario);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'editarSolicitudTema',formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.popupEditSolicitud = false
                    me.$vs.notify({
                    text: 'Se envio correctamente',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                    })
                    me.verSolicitudes()
                    me.popupSolicitudes = true
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        verSolicitudes() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'solicitarTema?todo=yes')
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arregloSolicitudes = res.data;
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        openModalEditar(tr){
            let me = this;
            me.id = tr.id
            me.asesor = tr.asesor_id
            me.comentario = tr.comentario_admin
            me.estado = tr.estado
            me.popupSolicitudes = false
            me.popupEditSolicitud = true
        },
        f_agregar_cap() {
            let me = this;
            me.color_boton = 'primary';
            me.txt_boton = 'Agregar';
            me.modalAdd = true;
        },
        getCapacitaciones() {
            let me = this;
            me.modalAdd = false;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'capacitacionTema')
                .then(function (res) {
                    me.capacitaciones = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getTipoAreas() {
            let me = this;
            me.$vs.loading();

            this.$http.get(this.$server_url + 'areas')
                .then(function (res) {
                    me.tipos = res.data.area
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        f_verificar() {
            let me = this;
            if (me.capacitacion.tema == "" && me.capacitacion.tema != undefined) {
                me.$vs.notify({
                    text: 'Ingrese el tema de la capacitación',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            // if (me.capacitacion.capacitador == "" && me.capacitacion.capacitador != null) {
            //     me.$vs.notify({
            //         text: 'Ingrese el el nombre del capacitador',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     })
            //     return
            // }
            if (me.otra_area == 0) {
                //si existe un area seleccionada, vaciar el input de  nueva area
                me.capacitacion.nueva_area = ''
                if (me.areaSelect == "" || me.areaSelect == 0 || me.areaSelect == null) {
                    me.$vs.notify({
                        text: 'Seleccione un área',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
            } else {
                me.areaSelect = '';
                if (me.capacitacion.nueva_area == "" || me.capacitacion.nueva_area == "null" || me.capacitacion.nueva_area == null) {
                    me.$vs.notify({
                        text: 'Ingrese el nombre de la nueva área',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
            }
            // console.log( me.capacitacion, me.areaSelect )
            // return
            if (me.capacitacion.estado == true) {
                me.capacitacion.estado = 1
            } else {
                me.capacitacion.estado = 0
            }
            let formData = new FormData();
            formData.append('id',           me.capacitacion.id);
            formData.append('area',         me.areaSelect);
            formData.append('nueva_area',   me.capacitacion.nueva_area);
            formData.append('tema',         me.capacitacion.tema);
            formData.append('capacitador',  me.capacitacion.capacitador);
            formData.append('observacion',  me.capacitacion.observacion)
            formData.append('estado',       me.capacitacion.estado);
            // console.log(me.capacitacion, me.areaSelect)
            // return
            me.$vs.loading();
            this.$http.post(this.$server_url + 'capacitacionTema', formData)
                .then(function (res) {
                    // console.log(res.data);
                    me.getCapacitaciones();
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        f_carga_datos(item) {
            let me = this;
            me.txt_boton = 'Editar';
            me.color_boton = 'warning';
            me.areaSelect = item.area
            item.estado == 1 ?
                item.estado = true :
                item.estado = false;
            item.nueva_area == null ?
                me.otra_area = 0 :
                me.otra_area = 1;
            me.capacitacion = item
            // console.log(item)
            me.modalAdd = true;
        },
        f_confirmar_elimina(item) {
            let me = this;
            // console.log(item)
            me.dato_eliminar = item.id
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Eliminar`,
                text: 'Desea eliminar este item?.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_eliminarCapacitacion
            })
        },
        f_eliminarCapacitacion() {
            let me = this;
            me.$vs.loading();
            this.$http.delete(this.$server_url + 'capacitacionTema/' + me.dato_eliminar)
                .then(function (res) {
                    // console.log(res.data);
                    me.getCapacitaciones();
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        limpiar(){
            let me = this;
            me.capacitacion = {
                'id': '',
                'nueva_area': '',
                'tema': '',
                'capacitador': '',
                'observacion':'',
                'estado': '',
            };
        }
    },
}
</script>
