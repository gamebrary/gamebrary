<template lang="html">
    <div :class="['platforms-page', { dark: darkModeEnabled }]">
        <aside>
            <panel class="positive">
                <small>
                    Gamebrary is free and open source, consider helping its development by
                    <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
                        {{ $t('settings.donate') }}
                    </a>
                    ,
                    <a href="https://github.com/romancmx/gamebrary/issues" target="_blank">
                        {{ $t('settings.reportBugs') }}
                    </a>
                    or
                    <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                        {{ $t('settings.submitFeedback') }}
                    </a>
                    .
                </small>
            </panel>

            <igdb-credit gray />
        </aside>

        <main>
            <div>
                <small>Show:</small>

                <div class="button-group">
                    <button class="small info" @click="mineOnly = true" :class="{ hollow: !mineOnly }">
                        <i class="fas fa-user-check"></i>
                        Mine
                    </button>

                    <button class="small info" @click="mineOnly = false" :class="{ hollow: mineOnly }">
                        <i class="fas fa-th"></i>
                        All
                    </button>
                </div>

                <small>Sort:</small>

                <div class="button-group">
                    <button class="small info" @click="sortBy = 'generation'" :class="{ hollow: sortBy !== 'generation' }">
                        <i class="fas fa-history"></i>
                        Chronologically
                    </button>

                    <button class="small info" @click="sortBy = 'chronological'" :class="{ hollow: sortBy !== 'chronological' }">
                        <i class="fas fa-sort-alpha-down"></i>
                        Alphabetically
                    </button>
                </div>
            </div>

            <div class="platform-list" :class="{ reverse: sortBy === 'generation'}">
                <div
                    v-for="(group, label) in filteredPlatforms"
                    :key="label"
                >
                    <div v-if="sortBy === 'generation'">
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
                                v-if="ownedPlatform(platform.code)"
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

            <div class="recommendations">
                <!-- eslint-disable-next-line -->
                <a target="_blank" href="https://www.amazon.com/gp/product/1593277431/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1593277431&linkCode=as2&tag=gamebrary-20&linkId=a253bbe3bfebd787ead2adc20dbb272b">
                    <!-- eslint-disable-next-line -->
                    <img src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=1593277431&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=gamebrary-20">
                </a>

                <div class="description">
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
        </main>
    </div>
</template>

<script>
import platforms from '@/shared/platforms';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import IgdbCredit from '@/components/IgdbCredit/IgdbCredit';
import Panel from '@/components/Panel/Panel';
import { groupBy, sortBy } from 'lodash';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        ToggleSwitch,
        IgdbCredit,
        Panel,
    },

    data() {
        return {
            platforms,
            sortBy: 'generation',
            mineOnly: false,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),
        ...mapGetters(['darkModeEnabled']),

        filteredPlatforms() {
            const availableLists = this.mineOnly
                ? this.platforms.filter(({ code }) => this.gameLists[code])
                : this.platforms;

            if (this.sortBy === 'generation') {
                return groupBy(availableLists, 'generation');
            }

            if (this.sortBy === 'chronological') {
                return groupBy(sortBy(availableLists, 'name'), '');
            }

            return groupBy(sortBy(availableLists, 'name'), '');
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
        display: grid;
        grid-template-columns: 180px auto;
        grid-gap: $gp * 2;
        min-height: calc(100vh - #{$navHeight});

        &.dark {
            color: $color-gray;
        }

        @media($small) {
            grid-template-columns: auto;
        }

        h3 {
            margin: $gp 0;
        }
    }

    .recommendations {
        background: $color-white;
        border-radius: $border-radius;
        overflow: hidden;
        max-width: 100%;
        width: 400px;
        display: grid;
        grid-template-columns: 120px auto;
        margin-top: $gp;

        img {
            max-width: 120px;
            display: block;
        }

        .description {
            padding: 0 $gp / 2 $gp / 2;
        }
    }

    .platform-list {
        display: flex;
        flex-direction: column;

        &.reverse {
            flex-direction: column-reverse;
        }
    }

    .platforms {
        margin-top: $gp;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

        grid-gap: $gp;

        a {
            position: relative;
            cursor: pointer;
            border-radius: $border-radius;
            width: auto;
            height: 80px;
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
</style>
