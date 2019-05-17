<template lang="html">
    <div :class="['platforms-page', { dark: darkModeEnabled }]">

        <div
            v-masonry
            transition-duration="0.3s"
            item-selector=".platform"
            column-width="100"
            gutter="8"
        >
            <platform
                v-for="platform in filteredPlatforms"
                :key="platform.name"
                :platform-data="platform"
                :block-height="platform.height"
                :block-width="platform.width"
            />
        </div>

        <footer>
            <small>
              {{ $t('platforms.donateMessage') }}
                <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
                    {{ $t('settings.donate') }}
                </a>
                ,
                <a href="https://github.com/romancmx/gamebrary/issues" target="_blank">
                    {{ $t('settings.reportBugs') }}
                </a>
                {{$t('global.or')}}
                <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                    {{ $t('settings.submitFeedback') }}
                </a>
                .
            </small>

            <igdb-credit gray />
        </footer>
    </div>
</template>

<script>
import platforms from '@/shared/platforms';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import IgdbCredit from '@/components/IgdbCredit/IgdbCredit';
import Platform from '@/components/Platform/Platform';
import Panel from '@/components/Panel/Panel';
import { sortBy } from 'lodash';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        ToggleSwitch,
        IgdbCredit,
        Platform,
        Panel,
    },

    data() {
        return {
            platforms,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        ownedListCount() {
            return Object.keys(this.gameLists).length;
        },

        hasLists() {
            return Object.keys(this.gameLists).length > 0;
        },

        ownedListsOnly() {
            return this.settings && this.settings.ownedListsOnly;
        },

        sortedByGeneration() {
            return this.settings && !this.settings.sortListsAlphabetically;
        },

        filteredPlatforms() {
            const availableLists = this.ownedListsOnly
                ? this.platforms.filter(({ code }) => this.gameLists[code])
                : this.platforms;

            this.$redrawVueMasonry();

            return this.settings && this.settings.sortListsAlphabetically
                ? sortBy(availableLists, 'name')
                : sortBy(availableLists, 'generation').reverse();
        },
    },

    methods: {
        groupLabel(label) {
            return label === '0'
                ? this.$t('platforms.computersArcade')
                : `${this.ordinalSuffix(label)} ${this.$t('platforms.generation')}`;
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
        color: $color-dark-gray;
        min-height: calc(100vh - #{$navHeight});
        padding: 0 $gp;

        &.dark {
            color: $color-gray;

            .group-label {
                background-color: $color-darkest-gray;
            }
        }
    }

    .platforms {
        display: flex;
        flex-direction: column;

        &.reverse {
            flex-direction: column-reverse;
        }
    }

    .group-label {
        position: sticky;
        top: 0;
        padding: $gp / 3 0;
        background-color: $color-gray;
    }

    footer {
        padding: $gp / 2 0;
        justify-content: center;
        display: flex;
        align-items: center;

        a {
            color: $color-dark-gray;
        }
    }

    .item {
        overflow: hidden;
        width: 300px;
        height: 200px;
        border-radius: $border-radius;
        padding: $gp;
    }
</style>
