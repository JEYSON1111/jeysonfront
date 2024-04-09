<template>
<div class='vx-col w-full mt-4'>
    <section>
        <vs-button class="m-2 mb-2" color="success" type="gradient" style="width: 150px" @click="ObjectSelect='';id=0;setSave();">Agregar</vs-button>
    </section>
    <section name="lista">
        <vs-table max-items="10" search pagination :data="listaEmpresas">
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Direccion</vs-th>
                <vs-th>Email</vs-th>
                <vs-th>Seccuencial</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      <b>Nombre:</b>
                      <p>{{ tr.nombre }}</p>
                      <b>Descripción Corta</b>
                      <p>{{tr.descripcion_corta}}</p>
                      <b>RUC:</b>
                      <p>{{tr.ruc}}</p>
                      <b>Representante:</b>
                      <p>{{tr.representante}}</p>
                        <p v-if="!tr.archivo">
                          <b class="text-danger"> Logo: No subida </b>
                        </p>
                        <p v-else class="imagen cursor-pointer" @click="openDocument(tr)">
                          <b> Logo:
                            <!--PDF-->
                            <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                              <!--IMAGE-->
                            <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                          </b>
                        </p>
                    </vs-td>
                    <vs-td>
                        {{tr.direccion}}<br>
                        {{tr.telefono}}
                    </vs-td>
                    <vs-td>
                        {{tr.email}}<br>
                        <span v-if="tr.tipo == 0"> Matriz </span>
                        <span v-if="tr.tipo == 1"> Sucursal </span>
                    </vs-td>
                    <vs-td>
                        {{tr.secuencial}}<br>
                    </vs-td>
                    <vs-td :data="tr.secuencia">
                        <vs-button size="large" icon-pack="feather" icon="icon-edit" color="orange" @click="ObjectSelect=tr;id=tr.id;setSave(tr);"> </vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </section>
    <vs-popup classContent="popup-example" :title="id == 0 ?'Guardar Empresa':'Editar Empresa'" :active.sync="popupEdit">
        <CrearEditarVue v-if="popupEdit" :ObjectSelect="ObjectSelect" :id="id"   @f_creado="f_recarga" :data_conf="data_conf"/>
    </vs-popup>
</div>
</template>

<script>
const CrearEditarVue = () => import('./crear-editar.vue')
export default {
    components: {
        CrearEditarVue
    },
    data() {
        return {
            id:0,
            listaEmpresas: [],
            popupEdit: false,
            data_conf: {
                titulo_modal: '',
                color_boton: '',
            },
            ObjectSelect:''
        };
    },
    created() {},
    mounted() {
        let me = this;
        me.getEmpresas();
    },
    methods: {
      openDocument(tr){
        let me = this;
        let ruta = me.$data_url+'archivos/facturacion/empresa/'+tr.url
        window.open(ruta,'_blank')
      },
        setSave(dato){
            let me = this;
            me.data_conf = {
                titulo_modal: '',
                color_boton: '',
            }
            if (dato != null) {
                me.data_conf = {
                    titulo_modal: "Editar empresa",
                    color_boton: "orange",
                    tipo : 0, //edita
                }

              } else {
                me.data_conf = {
                  titulo_modal: "Agregar empresa",
                  color_boton: "success",
                  tipo : 1, //nuevo registro
                }
            }
            me.popupEdit = true;
        },
        getEmpresas() {
            let me = this;
            me.listaEmpresas = []
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    // console.log(res.data)
                    me.listaEmpresas = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        f_recarga(e) {
            let me = this;
            console.log(e)
            me.popupEdit = false;
            if (e == 1) {
                me.getEmpresas();
            }
        }
    }
};
</script>
