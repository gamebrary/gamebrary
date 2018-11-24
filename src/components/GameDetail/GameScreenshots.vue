<template lang="html">
    <section
        v-if="game.screenshots"
        :class="['game-screenshots', { dark: settings && settings.nightMode }]"
    >
        <h3>Screenshots</h3>

        <vue-gallery :images="screenshots" :index="index" @close="close" />

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
        ...mapState(['game', 'settings']),

        screenshots() {
            // eslint-disable-next-line
            return this.game.screenshots
                ? this.game.screenshots.map((image, index) => {
                    const url = 'https://images.igdb.com/igdb/image/upload/t_screenshot_huge/';

                    return {
                        href: `${url}${image.cloudinary_id}.jpg`,
                        title: `${this.game.name} - Screenshot ${index + 1} of ${this.game.screenshots.length}`,
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
