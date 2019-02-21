<template lang="html">
    <div :class="['platforms-page', { dark: darkModeEnabled }]">
        <div class="tools">
            <div class="sorting">
                <select v-model="showBy">
                    <option value="generation">{{ $t('platforms.options.generation') }}</option>
                    <option value="">{{ $t('platforms.options.alphabetically') }}</option>
                </select>
            </div>

            <input
                type="text"
                class="platform-filter"
                autofocus
                v-model="filterText"
                :placeholder="$t('global.filter')"
            />

            <toggle-switch
                id="ownedOnly"
                v-model="ownedListsOnly"
                :label="$t('platforms.ownLists')"
            />
        </div>

        <div :class="['groups', { reverse: showBy === 'generation'}]">
            <div
                v-for="(group, label) in filteredPlatforms"
                :key="label"
            >
                <div v-if="showBy === 'generation'">
                    <h3 v-if="label == 0">{{ $t('platforms.computersArcade') }}</h3>
                    <h3 v-else>{{ ordinalSuffix(label) }} {{ $t('platforms.generation') }}</h3>
                </div>

                <div class="platforms">
                    <a
                        v-for="platform in group"
                        :key="platform.name"
                        :style="`background-color: ${platform.hex || '#fff'}`"
                        @click="changePlatform(platform)"
                    >
                        <div
                            v-if="!ownedListsOnly && ownedPlatform(platform.code)"
                            class="owned-platform"
                        >
                            <i class="fas fa-check" />
                        </div>

                        <img
                            :src='`/static/img/platforms/${platform.code}.svg`'
                            :alt="platform.name"
                        />
                    </a>
                </div>
            </div>
        </div>

        <div class="consoles-book">
            <!-- eslint-disable-next-line -->
            <a target="_blank" href="https://www.amazon.com/gp/product/1593277431/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1593277431&linkCode=as2&tag=gamebrary-20&linkId=a253bbe3bfebd787ead2adc20dbb272b">
                <!-- eslint-disable-next-line -->
                <img src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=1593277431&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=gamebrary-20">
            </a>

            <div class="description">
                <h3>Book recommendation</h3>
                <p>
                    <strong>
                        <a href="https://www.amazon.com/gp/product/1593277431/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1593277431&linkCode=as2&tag=gamebrary-20&linkId=a253bbe3bfebd787ead2adc20dbb272b" target="_blank">The Game Console: A Photographic History from Atari to Xbox</a>
                    </strong>
                </p>

                <p>
                    <small>
                        <strong>GAMEBRARY</strong> gets a small referral commission when
                        you use our affiliate link to purchase this book. the earnings will go
                        towards supporting the ongoing development of Gamebrary.
                    </small>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import platforms from '@/shared/platforms';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { groupBy, sortBy } from 'lodash';
import { mapState, mapGetters } from 'vuex';

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
        ...mapGetters(['darkModeEnabled']),

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

    methods: {
        ownedPlatform(platformCode) {
            return this.gameLists && this.gameLists[platformCode];
        },

        changePlatform(platform) {
            this.$store.commit('SET_PLATFORM', platform);
            this.$router.push({ name: 'game-board' });
        },

        ordinalSuffix(value) {
            const j = value % 10;
            const k = value % 100;

            if (j === 1 && k !== 11) {
                return `${value}${this.$t('platforms.st')}`;
            }

            if (j === 2 && k !== 12) {
                return `${value}${this.$t('platforms.nd')}`;
            }
            if (j === 3 && k !== 13) {
                return `${value}${this.$t('platforms.rd')}`;
            }

            return `${value}${this.$t('platforms.th')}`;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .platforms-page {
        padding: 0 $gp $gp;
        color: $color-dark-gray;

        &.dark {
            color: $color-gray;
        }

        .groups {
            display: flex;
            flex-direction: column;

            &.reverse {
                flex-direction: column-reverse;
            }
        }

        h3 {
            margin: $gp 0;
        }
    }

    .tools {
        margin-top: $gp;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        grid-gap: $gp;
        align-items: center;

        .sorting {
            align-items: center;

            select {
                margin-bottom: 0;
            }
        }

        .platform-filter {
            margin: 0;
        }
    }

    .platforms {
        margin-top: $gp;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

        grid-gap: $gp;

        a {
            position: relative;
            cursor: pointer;
            border-radius: $border-radius;
            width: auto;
            height: 100px;
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

            .owned-platform {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: flex-end;
                box-shadow:inset 0 0 0 2px $color-green;

                i {
                    background: $color-green;
                    width: 16px;
                    font-size: 9px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: $border-radius;
                    color: $color-white;
                }
            }
        }
    }

    .consoles-book {
        max-width: 100%;
        background: $color-white;
        display: grid;
        grid-gap: $gp;
        width: 400px;
        margin-top: $gp * 2;
        grid-template-columns: 180px auto;
        border-radius: $border-radius;
        overflow: hidden;

        h3 {
            margin-top: $gp;
        }

        img {
            width: 100%;
            display: block;
        }

        .description {
            padding-right: $gp;
        }
    }
</style>
