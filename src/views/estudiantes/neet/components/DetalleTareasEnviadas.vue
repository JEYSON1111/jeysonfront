<template>
    <div>
        <!--DATOS DE LAS RESPUESTAS Y FILES-->
        <div v-for="(tr,key) in arregloRespuestas" :key="key">
            <vs-divider class="mt-4"></vs-divider>
            <div class="mt-5">
                <div class="flex">
                    <vs-avatar class="letra2" style="margin-top: -1px;" icon-pack="feather" icon="icon-user" />
                    <div class="flex ml-4" style="flex-direction: column;">
                        <p class="letra2 font-bold">{{ tr.mensajero.toUpperCase() }}</p>
                        <small class="letra2" style="opacity: 0.7;">{{   elapsedTime(tr.created_at) }}</small>
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <p class="letra2" v-html="tr.mensaje">
                </p>
            </div>
            <div class="mt-5" v-if="tr.files.length > 0">
                <vs-divider position="left"><p class="letra2 font-bold">Archivos adjuntos</p></vs-divider>
            </div>
            <div class="mt-5 flex" style="flex-wrap: wrap;" v-if="tr.files.length > 0">
                <div class="adjunto flex" v-for="(item,key) in tr.files" :key="key">
                    <feather-icon icon="MenuIcon" style="color:white;" class="ml-2"/>
                    <div class="flex ml-5" style="flex-direction: column;">
                        <p class="letra2 mt-4 font-semibold">{{ item.nombre.substring(0,20) }}</p>
                        <p class="letra2 download" @click="descargar_archivo(item)" style="opacity:0.6">Descargar</p>
                    </div>
                </div>
            </div>
        </div>
        <!--CALIFICAR-->
        <div v-if="userDocente" class="mt-3 ml-3 flex justify-center">
            <button class="btnV">
                <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                <span class="ml-2">Calificación</span>
                <vs-input-number color="success" v-model="calificacion"/>
                <vs-button color="primary" @click="guardarCalificacion()" class="p-2 ml-3 mt-5" icon="check" type="filled">Calificar</vs-button>
            </button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
            id:0,
            counterDanger: false,
            attachmentArray:[],
            usuario:[],
            calificacion:'0',
        }
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        let preCalificacion =  me.estudianteTarea.tarea[0].calificacion
        if(preCalificacion == null || preCalificacion == "null"){
            me.calificacion = 0
        }else{
            me.calificacion = preCalificacion
        }
    },
    props:{
        arregloRespuestas:{
            type:Array,
            default:[]
        },
        userDocente:{
            type:Boolean,
            default:false,
        },
        estudianteTarea:{
            type:Object,
            default:{}
        },
    },
    methods:{
        descargar_archivo(item){
            let me = this
            window.open(this.$data_url+'archivos/neetFiles/tareas/' + item.archivo, '_blank');
        },
        elapsedTime(startTime) {
            const x = new Date(startTime)
            const now = new Date()
            let timeDiff = now - x
            timeDiff /= 1000
            const seconds = Math.round(timeDiff)
            timeDiff = Math.floor(timeDiff / 60)
            const minutes = Math.round(timeDiff % 60)
            timeDiff = Math.floor(timeDiff / 60)
            const hours = Math.round(timeDiff % 24)
            timeDiff = Math.floor(timeDiff / 24)
            const days = Math.round(timeDiff % 365)
            timeDiff = Math.floor(timeDiff / 365)
            const years = timeDiff
            if (years > 0) {
                return `${years + (years > 1 ? ' Años ' : ' Año ')}`
            } else if (days > 0) {
                return `Hace ${days + (days > 1 ? ' Días ' : ' Día ')}`
            } else if (hours > 0) {
                return `Hace ${hours + (hours > 1 ? ' Horas ' : ' Hora ')}`
            } else if (minutes > 0) {
                return `Hace ${minutes + (minutes > 1 ? ' Minutos ' : ' Minuto ')}`
            } else if (seconds > 0) {
                return 'Hace '+ seconds + (seconds > 1 ? ' segundos' : 'justo ahora')
            }
            return ' Justo Ahora '
        },
        guardarCalificacion(){
            let me = this
            let formData = new FormData();
            formData.append('calificarTarea',   'yes')
            formData.append('id',               me.estudianteTarea.tarea[0].id);
            formData.append('calificacion',     me.calificacion);
            me.$vs.loading()
            this.$http.post(this.$server_url+'neetTema', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            me.$emit('recharge',true)
        },
    }
}
</script>
<style scoped>
*{
    font-family: 'Arial';
}
div.scroll {
    margin:4px, 4px;
    padding:4px;
    width: 100%;
    height: 88%;
    overflow-x: hidden;
    overflow-y: auto;
    text-align:justify;
}
.letra{
    font-size: 12px;
}
.letra2{
    font-size: 11px;
}
.letra3{
    font-weight: 100!important;
}
.letra4{
    font-size: 12px;
    color: #3EA0EA;
    text-align: center;
}
.btnV{
    color:#3E4448;
    background-color:#EBF3F8;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 100;
    font-size: 11px;
    transition: 0.5s ease;
    cursor: pointer;
}

.btnV:hover{
    color: #3EA0EA;
}
.boton{
    background-color: #1c84c6;
    color: white;
    padding: 10px;
    border-color: #fff!important;
    width: 200px;
    cursor: pointer;
    transition: 0.5s ease-in;
    border: none;
    border-radius: 5px;
}
.farchivo{
    margin-bottom: -10px;
    cursor: pointer; color: gray; width: 100%;
    font-size: 11px;
    line-height: 80%;
    transition: 0.5s ease all;
    padding: 10px 10px;
}
.farchivo:hover{
    background-color: #7C7B89;
    color:white;
    border-radius: 5px;
}
.adjunto{
    margin: 5px 10px;
    color:#3E4448;
    background-color:#EBF3F8;
    width: 30%;
    height: 53px;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    border-radius: 5px;
}
.adjunto:hover{
    opacity: 0.8;
}
.download:hover{
    text-decoration: underline;
    opacity: 1;
}
/*RESPONSIVE*/
@media (max-width: 1280px) {
    .adjunto {
        width: 30%;
    }
}
@media (max-width: 1024px) {
    .adjunto {
        width: 30%;
    }
}
@media (max-width: 912px) {
    .adjunto {
        width: 40%;
    }
}
@media (max-width: 820px) {
    .adjunto {
        width: 40%;
    }
}

@media (max-width: 412px) {
    .adjunto {
        width: 100%;
    }
}
@media (max-width: 393px) {
    .adjunto {
        width: 100%;
    }
}
@media (max-width: 375px) {
    .adjunto {
        width: 100%;
    }
}
</style>
