<template lang="html">
    <section
        v-if="game.screenshots"
        :class="['game-screenshots', { dark: darkModeEnabled }]"
    >
        <h3>{{ $t('gameDetail.screenshots') }}</h3>

        <vue-gallery
            :images="screenshots"
            :index="index"
            @close="close"
        />

        <img
            v-for="(image, index) in thumbnails"
            :src="image"
            :key="image"
            @click="openGallery(index)"
        />
    </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import VueGallery from 'vue-gallery';

export default {
    components: {
        VueGallery,
    },

    data() {
        return {
            index: null,
        };
    },

    computed: {
        ...mapState(['game']),
        ...mapGetters(['darkModeEnabled']),

        screenshots() {
            // eslint-disable-next-line
            return this.game.screenshots
                ? this.game.screenshots.map((image, index) => {
                    const url = 'https://images.igdb.com/igdb/image/upload/t_screenshot_huge/';

                    return {
                        href: `${url}${image.cloudinary_id}.jpg`,
                        title: `${this.game.name} (${index + 1} of ${this.game.screenshots.length})`,
                    };
                })
                : null;
        },

        thumbnails() {
            // eslint-disable-next-line
            return this.game.screenshots ? this.game.screenshots.map((image) => {
                return `https://images.igdb.com/igdb/image/upload/t_thumb/${image.cloudinary_id}.jpg`;
            }) : null;
        },
    },

    methods: {
        close() {
            this.index = null;
        },

        openGallery(index) {
            this.index = index;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-screenshots {
        padding: $gp / 2 $gp;
        text-align: center;
        margin: $gp 0;
        background-color: $color-light-gray;

        &.dark {
            background-color: $color-dark-gray;
        }

        h3 {
            margin: 0 0 $gp / 2;
        }

        img {
            margin: 0 $gp / 4;
            cursor: pointer;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    @import "~styles/styles.scss";

    .blueimp-gallery {

        .title {
            font-size: 14px !important;
            max-width: 50vw;
            text-align: left;
        }

        .prev,
        .next,
        .close {
            visibility: hidden;

            &:before {
                visibility: visible;
            }
        }

        .prev, .next {
            background: none;
            border: 0;

            &:before {
                font-size: 30px;
                font-family: "Font Awesome 5 Free";
                font-weight: 900;
            }
        }

        .prev:before {
            content: "\f359";
        }

        .next:before {
            content: "\f35a";
        }

        .close {
            line-height: normal;
            opacity: 1;
            padding: $gp;
            position: absolute;
            font-size: 20px;
            margin: -15px 0 !important;
            top: 0;
            right: $gp * 4;
            text-decoration: none;

            &:before {
                font-size: 12px;
                font-weight: 900;
                content: "Back to game";
                border: 1px solid $color-gray;
                border-radius: $border-radius;
                padding: $gp / 2;
            }
        }
    }
</style>
