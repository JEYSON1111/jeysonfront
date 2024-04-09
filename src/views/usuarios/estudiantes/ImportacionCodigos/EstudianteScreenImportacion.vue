<template>
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab label="Importacion de codigos" @click="menu = 0;">
                <vx-card title="Importación de Estudiantes y códigos">
                    <ImportCodigosEstudiantesVue class="mt-3" v-if="menu == 0"/>
                </vx-card>
            </vs-tab>
            <vs-tab label="Importacion de cursos" @click="menu =1;">
                <vx-card title="Importación de cursos">
                    <EstudianteImportCursosVue class="mt-3" v-if="menu == 1"/>
                </vx-card>
            </vs-tab>
            <vs-tab label="Importacion de registro" @click="menu =2;">
                <vx-card title="Importación de registro de Estudiantes">
                    <EstudianteImportacionRegistroVue class="mt-3" v-if="menu == 2"/>
                </vx-card>
            </vs-tab>
        </vs-tabs>
    </div>
</template>

<script>
const ImportCodigosEstudiantesVue   = () => import('./ImportCodigosEstudiantes.vue')
const EstudianteImportCursosVue     = () => import('./EstudianteImportCursos.vue')
const EstudianteImportacionRegistroVue = () => import('./EstudianteImportacionRegistro.vue');
export default {
    components: {
        ImportCodigosEstudiantesVue,
        EstudianteImportCursosVue,
        EstudianteImportacionRegistroVue
    },
    name: 'ScreenImportacion',
    data() {
        return {
            menu:0,
            // Your component's data properties here
        };
    },
    methods: {
        // Your component's methods here
    },
    mounted() {
        // Code to run when the component is mounted
    },
};
</script>

<style scoped>
/* Your component's scoped styles here */
</style>