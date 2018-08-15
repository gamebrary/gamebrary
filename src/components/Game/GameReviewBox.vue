<template lang="html">
    <div v-if="game" class="review-box">
        <div class="game-rating" v-if="game.esrb || game.pegi">
            <img
                v-if="game.esrb"
                :src='`/static/img/esrb/${esrbRatings[game.esrb.rating]}.png`'
                :alt="game.esrb.synopsis"
            >

            <img
                v-if="game.pegi"
                :src='`/static/img/pegi/${pegiRatings[game.pegi.rating]}.png`'
                :alt="game.pegi.synopsis"
            >
        </div>
        <!-- <pre>{{ game }}</pre> -->
        <hr>
        Perspectives
        <pre>{{ game.player_perspectives }}</pre>
        <hr>
        Game Modes
        <pre>{{ game.game_modes }}</pre>
        <hr>
        Genres
        <pre>{{ game.genres }}</pre>
        <hr>
        Platforms
        <pre>{{ game.platforms }}</pre>
        <hr>
        Developers
        <pre>{{ game.developers }}</pre>
        <hr>
        Publishers
        <pre>{{ game.publishers }}</pre>
        <hr>
        Release date
        <pre>{{ releaseDate }}</pre>
        <hr>
        Rating
        <pre>{{ parseInt(game.rating) }}</pre>
        <pre>TODO: Add review/rating box with developer/publisher</pre>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    computed: {
        game() {
            return this.$store.state.activeGame;
        },

        platformId() {
            return this.$store.state.igdb.platforms.nsw;
        },

        esrbRatings() {
            return this.$store.state.igdb.esrb;
        },

        pegiRatings() {
            return this.$store.state.igdb.pegi;
        },

        releaseDate() {
            return this.game.release_dates.length ?
                moment(this.game.release_dates.find(r => r.platform === this.platformId).human).format('LL')
                : null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.review-box {
    background: #cf0;
}
</style>
