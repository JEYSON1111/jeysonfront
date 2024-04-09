<template>
<div class="bg-principal">

    <section class="dark">
        <div class="container py-4">
            <h1 class="h1 text-center" id="pageHeaderTitle">RECURSOS PROLIPA</h1>
            <!-- CARD -->
            <article class="postcard dark blue" v-for="(item,index) in contenidos" :key="index">
                <a class="postcard__img_link" href="#">
                    <img :src="require('@/assets/images/enlaces/'+item.imagen)" class="postcard__img" alt="Prolipa">
                </a>
                <div class="postcard__text">
                    <h1 class="postcard__title blue"> {{ item.titulo }} </h1>
                    <div class="postcard__bar"></div>
                    <div class="postcard__preview-txt">
                        {{ item.descripcion }}
                    </div>
                    <ul class="postcard__tagbox">
                        <li class="tag__item play blue">
                            <!-- <a :href="item.link" target="_blank"><i class="fas fa-play mr-2"></i>ver contenido...</a> -->
                        </li>
                        <vs-button type="border" color="light" @click="f_opciones(item)">Ver contenido</vs-button>
                    </ul>
                </div>
            </article>
            <!-- FIN CARD -->
        </div>
    </section>
</div>
</template>

<script>
export default {
    data() {
        return {
            //https://plataforma.prolipadigital.com.ec/v/eyJpdiI6IkNCNkFjYU1B
            //tamaño de la imagen  200px ancho * 250px alto
            getLink: 'eyJpdiI6IkNCNkFjYU1B',
            modalEmbed: false,
            rutaPdf: '',
            contenidos: [ {
                'titulo': 'Listado de precios',
                'descripcion': 'Le presentamos nuestros productos con sus respectivos valores, los mismos que se mantienen a nivel nacional.',
                'imagen': 'lista_precios.jpg',
                // 'url': 'https://drive.google.com/file/d/1u73xlGhP74y46oaZ41Y2vsaj7sZz6ZJw/view',
                'url':    'https://drive.google.com/file/d/12CebXJZWh_rFEYuzkIlieS5guzH93Q0-/view?usp=sharing'
            },{
                'titulo': 'Catálogo 2023',
                'descripcion': 'Prolipa, como empresa editorial genuinamente ecuatoriana, se siente complacida en ofrecer esta nueva serie de textos innovadores de 2.o a 10.o grado de EGB y de 1.o a 3.o de BGU.',
                'imagen': 'catalogo-2023.jpg',
                'url': 'https://drive.google.com/file/d/1_tyLIYV4y_fpMzlfgLQz9kUD0x_pb--l/view',
            },
            {
                'titulo': 'Plan Lector',
                'descripcion': 'Nuestro catálogo de Plan Lector incluye obras de autores nacionales y extranjeros, clásicos imprescindibles y libros informativos alusivos a la naturaleza y a la ciencia, cuyos contenidos serán referentes de calidad y probidad académica.',
                'imagen': 'plan_lector.jpg',
                'url': 'https://drive.google.com/file/d/11J6Ey0fMEuylbfNKqKFehzGnJoLzIkAJ/view',
            },
            {
                'titulo': 'Puntos de Venta - COSTA',
                'descripcion': 'Ubique nuestros puntos de venta autorizados para el régimen COSTA',
                'imagen': 'costa.jpg',
                'url': 'https://www.google.com/maps/d/u/1/viewer?mid=1ybgPb-HcYjc94aVyzFrMPVkC6CEdOsNU&ll=-2.1637759379446173%2C-76.28945105579643&z=7',
            },
            {
                'titulo': 'Puntos de Venta - SIERRA',
                'descripcion': 'Ubique nuestros puntos de venta autorizados para el régimen SIERRA',
                'imagen': 'sierra.jpg',
                'url': 'https://www.google.com/maps/d/u/1/viewer?mid=1ODed56bLVrBfyw6_r2m5DaTXhlo7_KO6&ll=-1.834583742877697%2C-79.00607800000002&z=8',
            }, ],
        }
    },
    mounted() {
        let me = this;
        let datos = me.$route.params.env
        if (datos == me.getLink) {
            // me.f_getPublicVarios()
            return
        } else {
            me.$router.push('/pages/error-404')
        }
    },
    methods: {
        f_getPublicVarios() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getTodoVarios')
                .then((result) => {
                    console.log(result.data)
                    me.contenidos = result.data;
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_opciones(item) {
            console.log(item)
            window.open(item.url);
        },
    },
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Baloo+2&display=swap");
$main-green: #79dd09 !default;
$main-green-rgb-015: rgba(121, 221, 9, 0.1) !default;
$main-yellow: #bdbb49 !default;
$main-yellow-rgb-015: rgba(189, 187, 73, 0.1) !default;
$main-red: #bd150b !default;
$main-red-rgb-015: rgba(189, 21, 11, 0.1) !default;
$main-blue: #0076bd !default;
$main-blue-rgb-015: rgba(0, 118, 189, 0.1) !default;
$card-color : #262f3e !default;

/* This pen */
body {
    font-family: "Baloo 2", cursive;
    font-size: 16px;
    color: #ffffff;
    text-rendering: optimizeLegibility;
    font-weight: initial;
}

.dark {
    // background: #110f16;
    background: white;
}

.light {
    background: #f3f5f7;
}

a,
a:hover {
    text-decoration: none;
    transition: color 0.3s ease-in-out;
}

#pageHeaderTitle {
    margin: 2rem 0;
    text-transform: uppercase;
    text-align: center;
    font-size: 2.5rem;
}

/* Cards */
.postcard {
    flex-wrap: wrap;
    display: flex;

    box-shadow: 0 4px 21px -12px rgba(0, 0, 0, 0.66);
    border-radius: 10px;
    margin: 0 0 2rem 0;
    overflow: hidden;
    position: relative;
    color: #ffffff;

    &.dark {
        // background-color: #262f3e; //color de fondo de los cards -  original 1f1f15
        background-color: $card-color;
    }

    &.light {
        background-color: #e1e5ea;
    }

    .t-dark {
        color: #18151f;
    }

    a {
        color: inherit;
    }

    h1,
    .h1 {
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
        color: #f3f5f7;
    }

    .small {
        font-size: 80%;
    }

    .postcard__title {
        font-size: 1.75rem;
        padding: 8px;
    }

    .postcard__img {
        // max-height: 100px;
        width: 100%;
        object-fit: cover;
        position: relative;
    }

    .postcard__img_link {
        display: contents;
    }

    .postcard__bar {
        width: 50px;
        height: 10px;
        margin: 10px 0;
        border-radius: 5px;
        background-color: #424242;
        transition: width 0.2s ease;
    }

    .postcard__text {
        padding: 1.5rem;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .postcard__preview-txt {
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: justify;
        height: 100%;
        padding: 8px;
    }

    .postcard__tagbox {
        display: flex;
        flex-flow: row wrap;
        font-size: 14px;
        margin: 20px 0 0 0;
        padding: 0;
        justify-content: center;

        .tag__item {
            display: inline-block;
            background: rgba(83, 83, 83, 0.4);
            border-radius: 3px;
            padding: 2.5px 10px;
            margin: 0 5px 5px 0;
            cursor: default;
            user-select: none;
            transition: background-color 0.3s;

            &:hover {
                background: rgba(83, 83, 83, 0.8);
            }
        }
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(-70deg, #424242, transparent 50%);
        opacity: 1;
        border-radius: 10px;
    }

    &:hover .postcard__bar {
        width: 100px;
    }
}

@media screen and (min-width: 769px) {
    .postcard {
        flex-wrap: inherit;

        .postcard__title {
            font-size: 2rem;
        }

        .postcard__tagbox {
            justify-content: start;
        }

        .postcard__img {
            max-width: 300px;
            max-height: 290px;
            transition: transform 0.3s ease;
        }

        .postcard__text {
            padding: 3rem;
            width: 100%;
        }

        .media.postcard__text:before {
            content: "";
            position: absolute;
            display: block;
            background: #18151f;
            top: -20%;
            height: 130%;
            width: 55px;
        }

        &:hover .postcard__img {
            transform: scale(1.1);
        }

        &:nth-child(2n+1) {
            flex-direction: row;
        }

        &:nth-child(2n+0) {
            flex-direction: row-reverse;
        }

        &:nth-child(2n+1) .postcard__text::before {
            left: -12px !important;
            transform: rotate(4deg);
        }

        &:nth-child(2n+0) .postcard__text::before {
            right: -12px !important;
            transform: rotate(-4deg);
        }
    }
}

@media screen and (min-width: 1024px) {
    .postcard__text {
        padding: 2rem 3.5rem;
    }

    .postcard__text:before {
        content: "";
        position: absolute;
        display: block;

        top: -20%;
        height: 130%;
        width: 55px;
    }

    .postcard.dark {
        .postcard__text:before {
            // background: #18151f;  //diagonal junto a la imagen
            background: $card-color;
        }
    }

    .postcard.light {
        .postcard__text:before {
            background: #e1e5ea;
        }
    }
}

/* COLORS */
.postcard .postcard__tagbox .green.play:hover {
    background: $main-green;
    color: black;
}

.green .postcard__title:hover {
    color: $main-green;
}

.green .postcard__bar {
    background-color: $main-green;
}

.green::before {
    background-image: linear-gradient(-30deg,
            $main-green-rgb-015,
            transparent 50%);
}

.green:nth-child(2n)::before {
    background-image: linear-gradient(30deg, $main-green-rgb-015, transparent 50%);
}

.postcard .postcard__tagbox .blue.play:hover {
    background: $main-blue;
}

.blue .postcard__title:hover {
    color: $main-blue;
}

.blue .postcard__bar {
    background-color: $main-blue;
}

.blue::before {
    background-image: linear-gradient(-30deg, $main-blue-rgb-015, transparent 50%);
}

.blue:nth-child(2n)::before {
    background-image: linear-gradient(30deg, $main-blue-rgb-015, transparent 50%);
}

.postcard .postcard__tagbox .red.play:hover {
    background: $main-red;
}

.red .postcard__title:hover {
    color: $main-red;
}

.red .postcard__bar {
    background-color: $main-red;
}

.red::before {
    background-image: linear-gradient(-30deg, $main-red-rgb-015, transparent 50%);
}

.red:nth-child(2n)::before {
    background-image: linear-gradient(30deg, $main-red-rgb-015, transparent 50%);
}

.postcard .postcard__tagbox .yellow.play:hover {
    background: $main-yellow;
    color: black;
}

.yellow .postcard__title:hover {
    color: $main-yellow;
}

.yellow .postcard__bar {
    background-color: $main-yellow;
}

.yellow::before {
    background-image: linear-gradient(-30deg,
            $main-yellow-rgb-015,
            transparent 50%);
}

.yellow:nth-child(2n)::before {
    background-image: linear-gradient(30deg,
            $main-yellow-rgb-015,
            transparent 50%);
}

@media screen and (min-width: 769px) {
    .green::before {
        background-image: linear-gradient(-80deg,
                $main-green-rgb-015,
                transparent 50%);
    }

    .green:nth-child(2n)::before {
        background-image: linear-gradient(80deg,
                $main-green-rgb-015,
                transparent 50%);
    }

    .blue::before {
        background-image: linear-gradient(-80deg,
                $main-blue-rgb-015,
                transparent 50%);
    }

    .blue:nth-child(2n)::before {
        background-image: linear-gradient(80deg, $main-blue-rgb-015, transparent 50%);
    }

    .red::before {
        background-image: linear-gradient(-80deg, $main-red-rgb-015, transparent 50%);
    }

    .red:nth-child(2n)::before {
        background-image: linear-gradient(80deg, $main-red-rgb-015, transparent 50%);
    }

    .yellow::before {
        background-image: linear-gradient(-80deg,
                $main-yellow-rgb-015,
                transparent 50%);
    }

    .yellow:nth-child(2n)::before {
        background-image: linear-gradient(80deg,
                $main-yellow-rgb-015,
                transparent 50%);
    }
}
</style><style scoped>
.bg-principal {
    background-color: #f5f4f9;

}

.contenido {
    margin: 2px;
    padding: 5px;
    /* max-width: 320px; */
}

.img-portada {
    width: auto !important;
    width: 100%;
    max-width: 300px;
}

.txt-descripcion {
    font-size: 14px;
    color: black;
}
</style>
