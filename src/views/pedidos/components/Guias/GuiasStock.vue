<template>
    <div>
        <vs-table max-items="10" search pagination :data="arregloStock">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloStock.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Stock bodega</vs-th>
                <vs-th>Cantidad solicitada</vs-th>
                <vs-th>Stock que quedara</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombrelibro}}<br>
                        <p><b>Código: </b>{{ tr.codigo }}</p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].stockAnterior}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].valorNew}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].nuevoStock}}<br>
                        <vs-chip v-if="tr.nuevoStock < 0" color="danger">Falta stock</vs-chip>
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
            
        }
    },
    props:{
        arregloStock:{
            type:Array,
            defaut:[],
        }
    }
}
</script>