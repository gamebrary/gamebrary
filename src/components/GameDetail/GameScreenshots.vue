<template lang="html">
    <section v-if="game.screenshots">
        <h3>Screenshots ({{ game.screenshots.length }})</h3>

        <div class="gallery">
            <img
                v-for="({ cloudinary_id }, index) in game.screenshots"
                :key="cloudinary_id"
                :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${cloudinary_id}.jpg`"
                :alt="`Screenshot ${index + 1} of ${game.screenshots.length}`"
            >
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['game']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .gallery {
        display: grid;
        grid-template-columns: 50% 50%;

        @media($small) {
            grid-template-columns: 100%;
        }

        img {
            padding: $gp / 4;
            width: 100%;
            height: auto;
        }
    }
</style>
