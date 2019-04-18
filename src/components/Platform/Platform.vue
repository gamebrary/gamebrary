<template lang="html">
    <div @click="changePlatform" :class="['platform', { dark: darkModeEnabled }]">
        <div class="platform-logo" :style="style">
            <img
                :src='`/static/img/platforms/${platformData.code}.svg`'
                :alt="platformData.name"
            />
        </div>

        <h4>
            {{ platformData.name }}

            <small v-if="ownedPlatform(platformData.code)">
                ({{ getGameCount(platformData.code) }} Games)
            </small>
        </h4>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: {
        platformData: Object,
    },

    computed: {
        ...mapState(['gameLists', 'platform', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        style() {
            return `background-color: ${this.platformData.hex || '#fff'}`;
        },
    },

    methods: {
        changePlatform() {
            this.$store.commit('SET_PLATFORM', this.platformData);
            this.$router.push({ name: 'game-board' });
        },

        ownedPlatform(platformCode) {
            return this.gameLists && this.gameLists[platformCode];
        },

        getGameCount(platform) {
            return this.gameLists[platform]
                .map(({ games }) => games.length)
                .reduce((totalCount, listCount) => totalCount + listCount);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .platform {
        display: grid;
        grid-template-columns: 100px auto;
        grid-gap: $gp;
        align-items: center;
        margin-bottom: $gp / 2;
        cursor: pointer;
        border-radius: $border-radius;
        transition: 100ms all ease;
        color: $color-darker-gray;

        &:hover {
            transition: 100ms all ease;
            background-color: rgba(255, 255, 255, .2);
        }

        &.dark {
            color: $color-gray;

            &:hover {
                background-color: $color-darker-gray;
            }
        }
    }

    .platform-logo {
        padding: $gp / 2;
        min-height: 50px;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        border-radius: $border-radius;

        img {
            margin: 0 auto;
            width: 100%;
            height: auto;
        }
    }

    small {
        color: $color-dark-gray;

        @media($small) {
            display: flex;
        }
    }
</style>
