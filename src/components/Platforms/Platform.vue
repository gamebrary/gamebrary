<template lang="html">
    <div
        @click="changePlatform"
        :class="['platform', { clickable, square } ]"
        :style="style"
    >
        <img
            :src='`/static/img/platforms/logos/${platform.code}.svg`'
            :alt="platform.name"
        />

        <span v-if="showCount(platform)" class="game-count">
            <i class="fas fa-gamepad" />
            {{ getGameCount(platform.code) }}
        </span>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        platform: Object,
        square: Boolean,
        clickable: Boolean,
    },

    computed: {
        ...mapState(['gameLists', 'settings']),

        hexColor() {
            return this.platform.hex || '#fff';
        },

        style() {
            return `background-color: ${this.hexColor}`;
        },
    },

    methods: {
        showCount({ code }) {
            return this.ownedPlatform(code) && this.getGameCount(code) > 0;
        },

        changePlatform() {
            if (this.clickable) {
                this.$store.commit('SET_PLATFORM', this.platform);
                this.$router.push({ name: 'game-board' });
            }
        },

        ownedPlatform(platformCode) {
            const isOwned = this.gameLists
                && this.gameLists[platformCode]
                && Object.keys(this.gameLists[platformCode]).length;

            return isOwned && this.clickable;
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
    @import "~styles/styles";

    .platform {
        padding: $gp;
        display: flex;
        margin-bottom: $gp;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius;
        overflow: hidden;
        width: 180px;
        height: 100px;

        &.clickable {
            cursor: pointer;
        }

        @media($small) {
            padding: $gp / 2;
            width: 100%;
            height: 60px;
        }

        img {
            width: 80%;
            height: auto;

            @media($small) {
                width: auto;
                height: 70px;
                max-height: 60%;
            }
        }

        .game-count {
            padding-top: $gp / 3;
            font-weight: bold;
            font-size: 12px;
            background: var(--primary-background);
            position: absolute;
            top: 0;
            right: 0;
            padding: 0 $gp / 4;
            color: var(--primary-text-color);
            font-size: 10px;
            border-bottom-left-radius: $border-radius;
        }
    }
</style>
