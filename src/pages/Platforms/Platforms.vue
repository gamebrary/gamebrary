<template lang="html">
    <div class="platforms-page">
        <h2>Choose a platform</h2>

        <div class="platforms">
            <a
                v-close-popover
                v-for="platform in platforms"
                :key="platform.name"
                :style="`background-color: ${platform.hex}`"
                @click="changePlatform(platform)"
            >
                <img
                    :src='`/static/img/platforms/${platform.code}.svg`'
                    :alt="platform.name"
                />
            </a>
        </div>
    </div>
</template>

<script>
import platforms from '@/shared/platforms';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            platforms,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),
    },

    methods: {
        changePlatform(platform) {
            this.$store.commit('SET_PLATFORM', platform);
            this.$router.push({ name: 'home' });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .platforms-page {
        width: $container-width;
        max-width: 100%;
        margin: $gp auto;
        color: $color-dark-gray;

        @media($small) {
            margin: $gp;
        }
    }

    .platforms {
        display: grid;
        grid-template-columns: repeat(auto-fill, 140px);
        grid-gap: $gp;

        a {
            cursor: pointer;
            border-radius: $border-radius;
            width: 140px;
            height: 140px;
            padding: $gp;
            display: flex;
            align-items: center;

            img {
                width: 100%;

            }
        }

    }
</style>
