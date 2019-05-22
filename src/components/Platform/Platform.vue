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

        <span
            v-if="ownedPlatform(platformData.code)"
            :class="['game-count', textColor]"
        >
            {{ getGameCount(platformData.code) }} Games
        </span>
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

        hexColor() {
            return this.platformData.hex || '#fff';
        },

        style() {
            return `background-color: ${this.hexColor}`;
        },

        blockClass() {
            return `height-${this.blockHeight}`;
        },

        textColor() {
            const hexColor = this.hexColor ? this.hexColor.replace('#', 0) : '#000000';

            const r = parseInt(hexColor.substr(0, 2), 16);
            const g = parseInt(hexColor.substr(2, 2), 16);
            const b = parseInt(hexColor.substr(4, 2), 16);

            // eslint-disable-next-line
            const yiq = ((r*299)+(g*587)+(b*114))/1000;

            return yiq >= 128 ? 'light' : 'dark';
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
        flex-direction: column;
        margin-bottom: $gp / 2;
        align-items: center;
        justify-content: center;
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

        .game-count {
            padding-top: $gp / 3;
            font-weight: bold;
            font-size: 12px;

            &.light {
                color: $color-white;
            }

            &.dark {
                color: $color-black;
            }
        }
    }
</style>
