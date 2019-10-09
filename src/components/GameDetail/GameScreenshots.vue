<template lang="html">
    <section class="game-screenshots" v-if="game.screenshots">
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
import { mapState } from 'vuex';
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

        screenshots() {
            // eslint-disable-next-line
            return this.game.screenshots
                ? this.game.screenshots.map((image, index) => {
                    const href = `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${image.image_id}.jpg`;

                    return {
                        href,
                        title: `${this.game.name} (${index + 1} of ${this.game.screenshots.length})`,
                    };
                })
                : null;
        },

        coverUrl() {
            return this.game && this.game.cover
                ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.game.cover.image_id}.jpg`
                : '/static/no-image.jpg';
        },

        thumbnails() {
            // eslint-disable-next-line
            return this.game.screenshots ? this.game.screenshots.map((image) => {
                return `https://images.igdb.com/igdb/image/upload/t_thumb/${image.image_id}.jpg`;
            }) : null;
        },
    },

    methods: {
        close() {
            this.index = null;
            this.$store.commit('SET_SLIDESHOW_OPEN', false);
        },

        openGallery(index) {
            this.index = index;
            this.$store.commit('SET_SLIDESHOW_OPEN', true);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .game-screenshots {
        padding: $gp / 2 $gp;
        text-align: center;
        margin: $gp 0;

        h3 {
            margin: 0 0 $gp / 2;
        }

        img {
            margin: 0 $gp / 4 $gp / 4;
            cursor: pointer;
            border-radius: $border-radius;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    @import "~styles/styles";

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
            &:before {
                font-size: 12px;
                font-weight: 900;
                font-family: "Font Awesome 5 Free";
                content: "\f00d";
                border: 1px solid #a5a2a2;
                border-radius: $border-radius;
                position: fixed;
                right: $gp / 2;
                top: $gp / 2;
                width: 30px;
            }
        }
    }
</style>
