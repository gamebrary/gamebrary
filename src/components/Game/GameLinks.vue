<template lang="html">
    <div v-if="links">
        <h3>Links</h3>

        <div class="links">
            <a
                v-for="({ category, url }, index) in links"
                :key="index"
                :href="url"
                target="_blank"
            >
                <i :class="icons[linkTypes[category]]" v-if="icons[linkTypes[category]]" />
                <img :src="imgUrl(category)" v-else>

                <md-tooltip md-direction="top">
                    {{ linkTypes[category].toUpperCase() }}
                </md-tooltip>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            icons: {
                facebook: 'fab fa-facebook-f',
                steam: 'fab fa-steam',
                youtube: 'fab fa-youtube',
                twitter: 'fab fa-twitter',
                instagram: 'fab fa-instagram',
                iphone: 'fab fa-app-store-ios',
                wikipedia: 'fab fa-wikipedia-w',
                Reddit: 'fab fa-reddit',
                official: 'fas fa-link',
            },
        };
    },
    computed: {
        linkTypes() {
            return this.$store.state.igdb.linkTypes;
        },

        links() {
            return this.$store.state.activeGame.websites;
        },
    },

    methods: {
        imgUrl(category) {
            const fileName = this.linkTypes[category].toLowerCase();

            return `/static/img/logos/${fileName}.png`;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .links {
        display: grid;
        grid-template-columns: repeat(auto-fill, 30px);
        grid-gap: $gp / 2;

        a {
            border: 1px solid $nin-lt-gray;
            display: flex;
            font-size: 24px;
            align-items: center;
            text-align: center;
            text-decoration: none;
            overflow: hidden;
            border-radius: $border-radius;

            i {
                display: flex;
                align-items: center;
                text-align: center;
                width: 100%;
                height: 100%;

                &:before {
                    margin: 0 auto;
                }

                &.fa-reddit { color: #ff3f18; }
                &.fa-youtube { color: #ff0000; }
                &.fa-twitter {
                    background: #1DA1F2;
                    color: $nin-white;
                    font-size: 18px;
                }
                &.fa-facebook-f {
                    background: #3B5998;
                    color: $nin-white;
                    font-size: 18px;
                }
                &.fa-app-store-ios { color: #0076F0; }
                &.fa-steam { color: #000; }
                &.fa-link, &.fa-wikipedia-w {
                    color: $nin-dk-gray;
                    font-size: 18px;
                }
            }
        }
    }
</style>
