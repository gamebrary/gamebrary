<template lang="html">
    <div class="game-screenshots" v-if="screenshots">
        <h3>Screenshots ({{ screenshots.length }})</h3>

        <img
            v-for="({ cloudinary_id }, index) in screenshots"
            :key="index"
            :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${cloudinary_id}.jpg`"
            :alt="`Screenshot ${index + 1} of ${screenshots.length}`"
        >
    </div>
</template>

<script>
export default {
    computed: {
        screenshots() {
            return this.$store.state.activeGame.screenshots;
        },
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
