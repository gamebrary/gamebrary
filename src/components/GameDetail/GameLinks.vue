<template lang="html">
    <div class="links" v-if="hasWebsites">
        <a
            v-for="{ category, url } in game.websites"
            :key="category"
            :href="url"
            target="_blank"
        >
            <i :class="getIcon(category)" />
            {{ igdb.linkTypes[category] }}
        </a>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import igdb from '@/shared/igdb';

export default {
    data() {
        return {
            igdb,
            icons: {
                official: 'fas fa-globe-americas',
                facebook: 'fab fa-facebook-f',
                steam: 'fab fa-steam',
                youtube: 'fab fa-youtube',
                twitter: 'fab fa-twitter',
                instagram: 'fab fa-instagram',
                iphone: 'fab fa-app-store-ios',
                wikipedia: 'fab fa-wikipedia-w',
                wikia: 'fas fa-link',
                twitch: 'fab fa-twitch',
                Reddit: 'fab fa-reddit',
                reddit: 'fab fa-reddit',
            },
        };
    },
    computed: {
        ...mapState(['game']),

        hasWebsites() {
            return this.game && this.game.websites;
        },
    },

    methods: {
        getIcon(id) {
            const icon = this.igdb.linkTypes[id];

            return this.icons[icon];
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    .links {
        display: flex;
        flex-direction: column;
        margin-top: $gp;

        a {
            color: $color-blue;
            text-transform: capitalize;
            text-decoration: none;
        }
    }
</style>
