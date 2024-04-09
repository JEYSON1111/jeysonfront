<template>
<vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>Se ha cerrado la sesión</h4>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :key="$vs.rtl">
        <div class="p-6 text-center">
            <p>
                <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
            </p>
            <div class="p-6">
                <h1>Tu sesión ha expirado.</h1>
                <!-- <p>Si desconoce este acceso, acceda a su perfil, y cambie su contraseña</p> -->
            </div>
        </div>
    </component>
    <div class="p-2 text-center" slot="footer">
        <vs-button color="danger" type="border" class="mb-2" @click="salir()">Continuar trabajando</vs-button>
    </div>
</vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        'v-select': vSelect,
        VuePerfectScrollbar
    },
    data() {
        return {
            usuario:[],
        }
    },
    mounted() {
        
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    computed: {
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar')
                }
            }
        },
        isFormValid() {
            return !this.errors.any() && this.dataName && this.dataCategory && this.dataPrice > 0
        },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        }
    },
    methods: {
        async salir() {
            let me = this
            if(me.usuario.id_group == 16){
                this.isSidebarActive = false
                await this.$store.dispatch('logout')
                this.$router.push('/docente/ingreso');
                return
            }else{
                this.isSidebarActive = false
                await this.$store.dispatch('logout')
                this.$router.push('/');
            }
        
        }
    },
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
        z-index: 52010;
    }

    ::v-deep .vs-sidebar {
        z-index: 52010;
        width: 50%;
        max-width: 50%;

        .img-upload {
            margin-top: 2rem;

            .con-img-upload {
                padding: 0;
            }

            .con-input-upload {
                width: 100%;
                margin: 0;
            }
        }
    }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
        overflow-y: auto;
    }
}
</style>
