<template lang="html">
    <div
        @click="changePlatform"
        :class="['platform', { dark: darkModeEnabled }, blockClass ]"
        :style="style"
    >
        <img
            :src='`/static/img/platforms/${platformData.code}.svg`'
            :alt="platformData.name"
        />

        <!-- <h4>
            {{ platformData.name }}

            <small v-if="ownedPlatform(platformData.code)">
                ({{ getGameCount(platformData.code) }} Games)
            </small>
        </h4> -->
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: {
        platformData: Object,
        blockHeight: {
            type: [String, Number],
            default: 1,
        },
        blockWidth: {
            type: [String, Number],
            default: 2,
        },
    },

    computed: {
        ...mapState(['gameLists', 'platform', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        style() {
            return `background-color: ${this.platformData.hex || '#fff'}`;
        },

        blockClass() {
            return `height-${this.blockHeight}`;
        },
    },

    methods: {
        changePlatform() {
            this.$store.commit('SET_PLATFORM', this.platformData);
            this.$router.push({ name: 'game-board' });
        },

        ownedPlatform(platformCode) {
            return this.gameLists
                && this.gameLists[platformCode]
                && Object.keys(this.gameLists[platformCode]).length;
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

    $tileHeight: 80px;

    .platform {
        padding: $gp;
        display: flex;
        margin-bottom: $gp / 2;
        align-items: center;
        border-radius: $border-radius;
        cursor: pointer;
        overflow: hidden;
        width: calc(calc(100% / 7) - 8.5px) !important;

        &.height-1 { height: $tileHeight; }
        &.height-2 { height: $tileHeight * 2 }
        &.height-3 { height: $tileHeight * 3 }

        @media($small) {
            padding: $gp / 2;
            width: calc(calc(100% / 3) - 7px) !important;
        }

        img {
            width: 100%;
            height: auto;

            max-height: 100%;
        }
    }
</style>
