<template lang="html">
    <div class="links" v-if="game && game.websites">
        <a
            v-for="({ category, url }, index) in game.websites"
            :key="index"
            :href="url"
            target="_blank"
        >
            <i :class="getIcon(category)" v-if="getIcon(category)" />

            <img :src="`/static/img/logos/${getId(category)}.png`" v-else>

            <md-tooltip md-direction="top">
                {{ getId(category).toUpperCase() }}
            </md-tooltip>
        </a>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            icons: {
                official: 'fas fa-globe-americas',
                facebook: 'fab fa-facebook-f',
                steam: 'fab fa-steam',
                youtube: 'fab fa-youtube',
                twitter: 'fab fa-twitter',
                instagram: 'fab fa-instagram',
                iphone: 'fab fa-app-store-ios',
                wikipedia: 'fab fa-wikipedia-w',
                reddit: 'fab fa-reddit',
            },
        };
    },
    computed: {
        ...mapState(['igdb', 'game']),
    },

    methods: {
        getIcon(id) {
            const icon = this.getId(id);

            return this.icons[icon];
        },

        getId(id) {
            return this.igdb.linkTypes[id].toLowerCase();
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";
    .links {
        display: flex;
        align-items: center;
        margin-top: $gp;
    }

    img, i {
        width: 25px;
        height: 25px;
        border-radius: $border-radius;
        margin-right: 2px;
    }

    i {
        display: flex;
        align-items: center;
        font-size: 22px;

        &:before {
            margin: 0 auto;
        }

        &.fa-globe-americas { color: #1da1f2; }
        &.fa-instagram { color: #8a3ab9; }
        &.fa-reddit { color: #ff3f18; }
        &.fa-youtube { color: #ff0000; }
        &.fa-twitter { background: #1da1f2; }
        &.fa-facebook-f { background: #3b5998; }
        &.fa-app-store-ios { color: #0076f0; }
        &.fa-steam { color: #000; }
        &.fa-twitter, &.fa-facebook-f {
            color: $nin-white;
            font-size: 18px;
        }
        &.fa-link, &.fa-wikipedia-w {
            color: $nin-dk-gray;
            font-size: 18px;
        }
    }
</style>
