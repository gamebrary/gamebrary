<template lang="html">
    <div class="game-videos no-wrap" v-if="game.videos">
        <h3>Videos ({{ game.videos.length }})</h3>

        <!-- TODO:
            - create gallery with thumbs
            - create video gallery, simple ui
            - if more than one video, show sidebar
            - use youtube max res image
            - keep it simple
        -->

        <div
            class="game-video"
            v-for="{ video_id } in game.videos"
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
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['game']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-video {
        margin-bottom: $gp / 2;
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        padding-top: 25px;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 50% !important;

            @media($small) {
                width: 100%;
                height: 100% !important;
            }
        }
    }
</style>
