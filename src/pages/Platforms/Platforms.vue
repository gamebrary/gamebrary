<template lang="html">
    <div class="platforms-page">
        <h2>Choose a platform</h2>

        <div class="tools">
            <toggle-switch
                id="ownedOnly"
                label="Show my lists only"
                v-model="ownedListsOnly"
            />

            <div class="sorting">
                <select v-model="showBy">
                    <option value="generation">Console Generation</option>
                    <option value="">Alphabetically</option>
                </select>
            </div>

            <input
                type="text"
                class="platform-filter"
                placeholder="Filter"
                autofocus
                v-model="filterText"
            />
        </div>

        <div :class="['groups', { reverse: showBy === 'generation'}]">
            <div
                v-for="(group, label) in filteredPlatforms"
                :key="label"
            >
                <div v-if="showBy === 'generation'">
                    <h2 v-if="label == 0">Computers and Arcade</h2>
                    <h2 v-else>{{ ordinalSuffix(label) }} generation</h2>
                </div>

                <div class="platforms">
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
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { groupBy, sortBy } from 'lodash';
import { mapState } from 'vuex';

export default {
    components: {
        ToggleSwitch,
    },

    data() {
        return {
            platforms,
            filterText: '',
            showBy: 'generation',
            ownedListsOnly: false,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        filteredPlatforms() {
            const availableLists = this.ownedListsOnly
                ? this.platforms.filter(({ code }) => this.gameLists[code])
                : this.platforms;

            if (this.filterText.length > 0) {
                // eslint-disable-next-line
                return groupBy(availableLists.filter(({ name }) => name.toLowerCase().includes(this.filterText.toLowerCase())), this.showBy);
            }

            return this.showBy
                ? groupBy(availableLists, this.showBy)
                : groupBy(sortBy(availableLists, 'name'), '');
        },
    },

    mounted() {
        this.ownedListsOnly = Object.keys(this.gameLists).length > 0;
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
            align-items: center;

            .sorting {
                margin-left: $gp;
                display: flex;
                align-items: center;

                select {
                    margin-bottom: 0;
                }
            }

            .platform-filter {
                width: 200px;
                margin: 0;
                margin-left: auto;
            }
        }

        .groups {
            display: flex;
            flex-direction: column;

            &.reverse {
                flex-direction: column-reverse;
            }
        }

        .platforms {
            margin-top: $gp;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: $gp;

            @media($small) {
                grid-template-columns: repeat(2, 1fr);
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
        }
    }
</style>
