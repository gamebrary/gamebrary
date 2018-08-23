<template lang="html">
    <div class="game-screenshots" v-if="game.screenshots">
        <h3>Screenshots ({{ game.screenshots.length }})</h3>

        <img
            v-for="({ cloudinary_id }, index) in game.screenshots"
            :key="index"
            :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${cloudinary_id}.jpg`"
            :alt="`Screenshot ${index + 1} of ${game.screenshots.length}`"
        >
    </div>
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
    .game-screenshots {
        img {
            margin-bottom: 8px;
        }
    }
</style>
