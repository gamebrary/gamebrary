<template lang="html">
    <div class="platforms-page">
        <h2>Choose a platform</h2>

        <div class="tools">
            <div class="sorting">
                <select v-model="showBy">
                    <option value="generation">Console Generation</option>
                    <option value="">Alphabetically</option>
                </select>

                <button @click="asc = !asc">
                    <i :class="`fas fa-sort-amount-${ asc ? 'down' : 'up'}`" />
                </button>

            </div>

            <input
                type="text"
                placeholder="Filter"
                autofocus
                v-model="filterText"
            />
        </div>

        <div class="groups" :class="{ asc }">
            <div v-for="(group, label) in filteredPlatforms" :key="label">
                <h2 v-if="showBy">
                    <span v-if="!isNaN(label)">{{ ordinalSuffix(label) }} generation</span>
                    <span v-else>{{ label }}</span>
                </h2>

                <div class="platforms" :class="{ asc: asc && !showBy }">
                    <a
                        v-close-popover
                        v-for="platform in group"
                        :key="platform.name"
                        :style="`background-color: ${platform.tileHex || platform.hex || '#fff'}`"
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
import { groupBy, sortBy } from 'lodash';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            platforms,
            filterText: '',
            showBy: 'generation',
            asc: true,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        filteredPlatforms() {
            if (this.filterText.length > 0) {
                // eslint-disable-next-line
                return groupBy(this.platforms.filter(({ name }) => name.toLowerCase().includes(this.filterText.toLowerCase())), this.showBy);
            }

            return this.showBy
                ? groupBy(this.platforms, this.showBy)
                : groupBy(sortBy(this.platforms, 'name'), '');
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
        margin: 0 auto;
        padding: $gp;
        color: $color-dark-gray;

        @media($small) {
            margin: 0;
        }

        .tools {
            display: flex;
            justify-content: space-between;

            .sorting {
                display: flex;
                align-items: center;

                select {
                    margin-left: $gp / 2;
                    margin-bottom: 0;
                }
            }

            input {
                width: 200px;
                margin: 0;
            }
        }

        .groups {
            display: flex;
            flex-direction: column;

            &.asc {
                flex-direction: column-reverse;
            }
        }

        .platforms {
            margin-top: $gp;
            display: flex;
            flex-direction: column;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: $gp;

            @media($small) {
                grid-template-columns: 1fr;
            }

            a {
                cursor: pointer;
                border-radius: $border-radius;
                width: auto;
                height: 140px;
                padding: $gp;
                display: flex;
                align-items: center;

                @media($small) {
                    height: 100px;
                }

                img {
                    margin: 0 auto;
                    max-width: 100%;
                    width: auto;
                    height: auto;
                    max-height: 100%;

                    @media($small) {
                        max-width: 70%;
                    }
                }
            }

            &.asc {
                background: #fc0;
            }

        }
    }
</style>
