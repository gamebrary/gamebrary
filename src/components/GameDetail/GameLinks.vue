<template lang="html">
    <div class="game-links" v-if="hasWebsites">
        <h4>Links</h4>
        <div class="links">
            <a
                v-for="{ category, url } in game.websites"
                :key="category"
                :href="url"
                :class="linkTypes[category].name"
                target="_blank"
            >
                <template v-if="linkTypes[category].icon">
                    <i
                        :class="linkTypes[category].icon"
                        :title="$t(`gameDetail.links.${linkTypes[category].name}`)"
                    />
                </template>

                <template v-else>
                    <i class="fas fa-link"/>
                    <small>{{ $t(`gameDetail.links.${linkTypes[category].name}`) }}</small>
                </template>
            </a>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            linkTypes: {
                1: { name: 'official', icon: 'fas fa-home' },
                2: { name: 'wikia', icon: 'fas fa-heart' },
                3: { name: 'wikipedia', icon: 'fab fa-wikipedia-w' },
                4: { name: 'facebook', icon: 'fab fa-facebook-square' },
                5: { name: 'twitter', icon: 'fab fa-twitter' },
                6: { name: 'twitch', icon: 'fab fa-twitch' },
                8: { name: 'instagram', icon: 'fab fa-instagram' },
                9: { name: 'youtube', icon: 'fab fa-youtube' },
                10: { name: 'iphone', icon: 'fab fa-app-store-ios' },
                11: { name: 'ipad' },
                12: { name: 'android', icon: 'fab fa-android' },
                13: { name: 'steam', icon: 'fab fa-steam' },
                14: { name: 'reddit', icon: 'fab fa-reddit' },
                15: { name: 'discord', icon: 'fab fa-discord' },
                16: { name: 'google_plus', icon: 'fab fa-google' },
                17: { name: 'tumblr', icon: 'fab fa-tumblr' },
                18: { name: 'linkedin', icon: 'fab fa-linkedin' },
                19: { name: 'pinterest', icon: 'fab fa-pinterest' },
                20: { name: 'soundcloud', icon: 'fab fa-soundcloud' },
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
            const icon = this.linkTypes[id];

            return this.icons[icon];
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .game-links {
        border-top: 1px solid #e5e5e5;
        margin-top: $gp;
        padding-top: $gp;
    }

    .links {
        display: grid;
        grid-template-columns: repeat(auto-fill, 30px);
        margin-top: $gp / 2;

        a {
            height: 40px;
            font-size: 20px;
            display: flex;
            flex-direction: column;
            text-decoration: none;
        }
    }
</style>
