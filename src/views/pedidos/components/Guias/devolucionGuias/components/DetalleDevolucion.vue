<template>
    <div>
        <vs-table max-items="10" stripe search pagination :data="arregloDetalle">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arregloDetalle.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Libro</vs-th>
                    <vs-th>Cantidad devuelta</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                           {{data[indextr].nombrelibro}}<br>
                           <p><b>Código</b> {{ tr.pro_codigo }}</p>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cantidad_devuelta}}<br>
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
        arregloDetalle:{
            type:Array,
            default:[]
        },
    }
}
</script>