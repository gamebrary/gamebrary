<template lang="html">
    <div class="platforms-page">
        <h2>Choose a platform</h2>

        Sort: <select v-model="sortBy">
            <option value="generations">Console Generation</option>
            <option value="alphabetically">Alphabetically</option>
        </select>

        <div class="platforms">
            <a
                v-close-popover
                v-for="platform in sorted"
                v-if="sortBy === 'alphabetically'"
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

        <div class="generations" v-if="sortBy === 'generations'">
            <div v-for="(group, generation) in groupedByGenerations" :key="generation">
                <h2>{{ ordinalSuffix(generation) }} generation</h2>

                <div class="platforms">
                    <a
                        v-close-popover
                        v-for="platform in group"
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
        </div>
    </div>
</template>

<script>
import platforms from '@/shared/platforms';
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            platforms,
            sortBy: 'alphabetically',
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        groupedByGenerations() {
            return _.groupBy(this.platforms, 'generation');
        },

        sorted() {
            return _.sortBy(this.platforms, 'name');
        },
    },

    methods: {
        changePlatform(platform) {
            this.$store.commit('SET_PLATFORM', platform);
            this.$router.push({ name: 'home' });
        },

        ordinalSuffix(value) {
            const j = value % 10;
            const k = value % 100;

            if (j === 1 && k !== 11) {
                return `${value}st`;
            }

            if (j === 2 && k !== 12) {
                return `${value}nd`;
            }
            if (j === 3 && k !== 13) {
                return `${value}rd`;
            }

            return `${value}th`;
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
        margin-top: $gp;
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

    .generations {
        display: flex;
        flex-direction: column-reverse;
    }
</style>
