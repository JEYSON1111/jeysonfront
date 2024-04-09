<template>
  <div>
    <div v-if="desdePedido == 1" class="flex justify-start mt-5">
      <div v-if="setcobro_venta_directa == '0'">
        <p v-if="!userAsesor"  class="text-danger text-center">Cobro de venta directa no configurado <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span> </p>
      </div>
      <div v-if="setcobro_venta_directa == '1'">
        <p class="text-success text-center">Cobro venta directa 100%   <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span></p>
      </div>
      <div v-if="setcobro_venta_directa == '2'">
        <p class="text-success text-center">Cobro venta directa Comision %{{ sendPedido.descuento  }} de la escuela <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span></p>
      </div>
      <div v-if="setcobro_venta_directa == '3'">
        <p class="text-success text-center">% Descuento Personalizado</p>
      </div>
    </div>
    <ul class="flex mt-5">
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="0">Todo <b>{{ sumaTodos }}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="1">Venta directa <b>{{ sumaVentaDirecta }}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="2">Venta lista <b>{{ sumaVentaLista}}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="3">Regalados <b>{{ sumaRegalados }}</b></vs-radio>
      </li>
    </ul>
    <div>
      <vs-table max-items="10" search pagination :data="tmpCodigos" class="">
        <template slot="header">
          <vs-chip>Cantidad de filas: {{ tmpCodigos.length }}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th>Código Liquidación</vs-th>
            <vs-th>Cantidad</vs-th>
            <vs-th>Precio</vs-th>
            <vs-th>Valor</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].nombre_libro}}<br>
                </vs-td>
                <vs-td>
                    {{data[indextr].codigo}}<br>
                </vs-td>
                <vs-td>
                    {{tr.cantidad}}
                </vs-td>
                <vs-td>
                {{tr.precio}}
                </vs-td>
                <vs-td>
                ${{ tr.valor | filtrarDecimal }}
                </vs-td>
                <vs-td>
                    <vs-button color="success" type="relief" @click="verCodigos(tr)" icon="code">Ver códigos</vs-button>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      usuario:[],
      userAsesor:false,
      titleTipoPago:'',
      tmpCodigos:[],
      filtro:0,
    }
  },
  props:{
      arregloVerificados:{
          type:Array,
          default:[]
      },
      verTipo:{
          type:Number,
          default:2
      },
      desdePedido:{
          type:Number,
          default:0
      },
      sendPedido:{
          type:Object,
          default:{}
      },
      setcobro_venta_directa:{
        type:Number,
        default:0
      },
      settipoPago:{
        type:Number,
        default:0,
      },
      datosInstitucion:{
        type:Object,
        default:function(){
          return {}
        }
      },
      arrayCodigosVerificacion:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      setcobro_venta_directa(results){
        let me = this;
        me.setcobro_venta_directa = results
        me.setearWords()
      },
      settipoPago(results){
        let me = this
        me.settipoPago = results
        me.setearWords()
      },
      arrayCodigosVerificacion(results){
        let me = this
        me.arrayCodigosVerificacion = results
        me.tmpCodigos = me.arrayCodigosVerificacion
        me.filtroCodigos()
      }
    },
    created(){
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
      let me  =this
      if(me.usuario.id_group == 11) me.userAsesor = true
      me.tmpCodigos = me.arrayCodigosVerificacion
      me.filtroCodigos()
      me.setearWords()
    },
    computed:{
      //sumar la cantidad de todos los codigos
      sumaTodos(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.length
        return resultado
      },
      //suma los que tiene venta directa
      sumaVentaDirecta(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.filter(x => x.venta_estado == '1' && x.estado_liquidacion == '0').length
        return resultado
      },
      //suma los que tiene venta lista
      sumaVentaLista(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.filter(x => x.venta_estado == '2' && x.estado_liquidacion == '0').length
        return resultado
      },
      //suma los que tiene regalados
      sumaRegalados(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.filter(x => x.estado_liquidacion == 2).length
        return resultado
      },
    },
    methods:{
      setearWords(){
        let me = this;
        if(me.settipoPago  == 0) me.titleTipoPago = "Tipo pago no configurado"
        if(me.settipoPago  == 1) me.titleTipoPago = "Cancelar Total"
        if(me.settipoPago  == 2) me.titleTipoPago = "Descontar"
        if(me.settipoPago  == 3) me.titleTipoPago = "Regalado"
      },
      verCodigos(tr){
        let me = this;
        let datos = {
          tipo:me.verTipo,
          filtro:me.filtro,
          data:tr
        }
        me.$emit('recharge',datos)
      },
      filtroCodigos(){
        let me = this;
        me.tmpCodigos = []
        let datos     = []
        if(me.filtro == 0) datos = me.arrayCodigosVerificacion
        if(me.filtro == 1) datos = me.arrayCodigosVerificacion.filter(x => x.venta_estado == 1 && x.estado_liquidacion == 0)
        if(me.filtro == 2) datos = me.arrayCodigosVerificacion.filter(x => x.venta_estado == 2 && x.estado_liquidacion == 0)
        if(me.filtro == 3) datos = me.arrayCodigosVerificacion.filter(x => x.estado_liquidacion == 2)
        console.log("uwu",datos)
        //agrupar
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.tmpCodigos.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.tmpCodigos.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro ,cantidad: 1,  });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
        me.tmpCodigos.map((item) => {
          item.valor        = item.precio * item.cantidad
          me.sumaTotalVALOR += item.valor
        });
      }
    }
}
</script>
