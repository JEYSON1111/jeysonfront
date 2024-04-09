<template>
    <div>
        
        <div v-if="tickets.length >0 ">
             <br>
            <!-- <vs-button color="dark" @click="limpiar();popupAddTema=true;"   type="filled">Crear Area</vs-button> -->
            <vs-table max-items="10" search pagination :data="tickets" style="margin-top:-40px">
                <template slot="thead">
                    
                    <vs-th>Grupo</vs-th>
                    <vs-th>Asunto</vs-th>
                    <vs-th>Codigo</vs-th>
                    <vs-th>Fecha</vs-th>
                    <vs-th>Usuario</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        
                        <vs-td>
                            {{data[indextr].rol}}<br>
                            
                        </vs-td>
                        <vs-td>
                            {{data[indextr].descripcion}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].codigo}}<br>
                        </vs-td>
                        <vs-td>
                            {{ tr.fecha_ticket }}
                        </vs-td>
                        <vs-td>
                            <p style="color:coral;font-size:12px;letter-spacing:1px;">Nombre: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.usuario }}</span></p>
                            <p style="color:coral;font-size:12px;letter-spacing:1px;">Cedula: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.cedula }}</span></p>
                            <p style="color:coral;font-size:12px;letter-spacing:1px;">Email: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.email }}</span></p>
                            <p style="color:coral;font-size:12px;letter-spacing:1px;">Institucion: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.nombreInstitucion }}</span></p>
                        </vs-td>

                        <vs-td>
                            <div v-if="tr.estado == '1'">
                                <p>Abierto</p>
                            </div>
                            <div v-else>
                                <p>Cerrada</p>    
                            </div>
                        </vs-td>

                        <vs-td>
                            <div style="display:flex;">
                                <vx-tooltip style="display: inline-block;" text="Siguimiento del ticket" position="top" color="primary">
                                  <vs-button class="modal-default-button" size="small" color="success" @click="SeguimientoTicket(tr.ticket_id,tr.descripcion,tr.usuario,tr.email,tr.estado)" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                </vx-tooltip> &nbsp;


                                <vx-tooltip v-if="tr.estado =='1'" style="display: inline-block;"  text="Cerrar ticket" position="top" color="primary">
                                  <vs-button class="modal-default-button" @click="openConfirm(tr.ticket_id)" size="small" color="danger"  type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                </vx-tooltip> &nbsp;

                            </div>
                       
                        </vs-td>
                       
                        
                    </vs-tr>
                </template>
            </vs-table>   
        </div>
        <div v-else class="p-3">
            <p> No existe tickets abiertos aun. </p>
         </div>
    </div>
</template>

<script>
export default {
    data() {
      return{
        tickets:[],
        usuario:[],
        ticket_id:'',
      }  
    },
      created () {
  
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.getTicketsAbiertos();
    },
    methods:{
      //para obtener el listado de los tickets
        getTicketsAbiertos() {
            let me = this;
            me.$vs.loading();
      
            this.$http.get(this.$server_url+'ticket/'+me.usuario.idusuario)
                .then(function (res) {
                    me.tickets = res.data
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        //para dar seguimiento al ticket
        SeguimientoTicket(ticket_id,asunto,usuario,email,estado){
            let me = this;
           
            localStorage.setItem("ticket_id",ticket_id);
            localStorage.setItem("asunto",asunto);
            localStorage.setItem("usuario_ticket",usuario);
            localStorage.setItem("email_ticket",email);
            localStorage.setItem("estado_ticket",estado);
            localStorage.setItem("ticketAyuda","yes");
            me.$router.push('/usuario/ticket/abierto/');

        },

        openConfirm(ticket_id){
            let me =this;
          
            me.ticket_id = ticket_id;
            me.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Estas seguro/a de cambiar de estado el ticket.',
                accept:me.cerrarTicket
            })
      },
        cerrarTicket(){
           
             let me = this;
            me.$vs.loading();
      
            this.$http.get(this.$server_url+"ticket?estadoChange=yes&estado=0&ticket_id="+me.ticket_id)
                .then(function (res) {
                                   
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Ticket cambiado con exito',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})

                    me.getTicketsAbiertos();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        }
    },
}
</script>