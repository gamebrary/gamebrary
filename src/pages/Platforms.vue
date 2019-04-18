<template lang="html">
    <div :class="['platforms-page', { dark: darkModeEnabled }]">
        <div :class="['platform-list', { reverse: sortedByGeneration }]">
            <div v-for="(group, label) in filteredPlatforms" :key="label">
                <h4 v-if="sortedByGeneration">{{ groupLabel(label) }}</h4>

                <platform
                    v-for="platform in group"
                    :key="platform.name"
                    :platform-data="platform"
                />
            </div>
        </div>

        <div class="open-source-message">
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

            <igdb-credit gray />
        </div>
    </div>
</template>

<script>
import platforms from '@/shared/platforms';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import IgdbCredit from '@/components/IgdbCredit/IgdbCredit';
import Platform from '@/components/Platform/Platform';
import Panel from '@/components/Panel/Panel';
import { groupBy, sortBy } from 'lodash';
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

            return this.settings && this.settings.sortListsAlphabetically
                ? groupBy(sortBy(availableLists, 'name'), '')
                : groupBy(availableLists, 'generation');
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
        }
    }

    h4 {
        position: sticky;
        top: $gp;
    }

    .platform-list {
        display: flex;
        flex-direction: column;

        &.reverse {
            flex-direction: column-reverse;
        }
    }

    .platforms {
        // margin-top: $gp;
        // display: grid;
        // grid-template-columns: auto;
        // grid-gap: $gp;
        // grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        margin: 0;

        @media($small) {
        }
    }

    .open-source-message {
        margin-top: $gp;
        justify-content: center;
        display: flex;
        align-items: center;

        a {
            color: $color-dark-gray;
        }
    }
</style>
