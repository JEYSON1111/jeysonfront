<template>
    <div>
        <p class="font-bold text-success font-bold mt-5">RESUMEN DE LOS LIBROS SELECCIONADOS EN EL ALCANCE ID #{{ alcance.id }}</p>
        <vs-table max-items="20" search pagination :data="arregloLibros">
            <template slot="header">
              <span>Cantidad: {{arregloLibros.length}}</span>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Cant. unidades</vs-th>
                <vs-th>Precio unitario</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].valor}}<br>
                    </vs-td>
                    <vs-td>
                      {{tr.precio}}
                    </vs-td> 
                </vs-tr>
            </template>
        </vs-table>  
    </div>
</template>
<script>
export default{
    data(){
        return{
            arregloLibros:[],
        }
    },
    props:{
        alcance:{
            type:Object,
            default:{},
        }
    },
    mounted(){
        let me = this;
        me.getLibros()
    },
    methods:{
        getLibros(){
            let me = this
            this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance/'+me.alcance.id_pedido+'/'+me.alcance.id)
            .then(res => {
                let datos = res.data
                me.arregloLibros = datos.filter(p => p.valor > 0)
            })
        },
    }
}
</script>