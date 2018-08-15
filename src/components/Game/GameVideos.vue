<template lang="html">
    <div class="game-videos no-wrap" v-if="videos">
        <h3>Videos ({{ videos.length }})</h3>

        <div
            class="game-video"
            v-for="{ video_id } in videos"
            :key="video_id"
        >
            <iframe
                :src="`https://www.youtube.com/embed/${video_id}?rel=0&autohide=1`"
                frameborder="0"
                width="426"
                height="240"
                allow="autoplay; encrypted-media"
                allowfullscreen
            />
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        videos() {
            return this.$store.state.activeGame.videos;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .game-video {
        margin-bottom: $gp / 2;
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        padding-top: 25px;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100% !important;
        }
    }
</style>
