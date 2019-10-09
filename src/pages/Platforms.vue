<template lang="html">
    <div class="platforms-page">
        <div class="platforms">
            <platform
                v-for="platform in filteredPlatforms"
                :key="platform.name"
                :platform="platform"
                clickable
            />
        </div>

        <page-footer />
    </div>
</template>

<script>
import Masonry from 'masonry-layout';
import platforms from '@/platforms';
import Platform from '@/components/Platforms/Platform';
import PageFooter from '@/components/Platforms/PageFooter';
import { sortBy } from 'lodash';
import { mapState } from 'vuex';

let msnry = null;

export default {
    components: {
        Platform,
        PageFooter,
    },

    data() {
        return {
            platforms,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform', 'settings']),

        // TODO: move to getter and replace other instances
        hasLists() {
            return Object.keys(this.gameLists).length > 0;
        },

        ownedListsOnly() {
            return this.settings && this.settings.ownedListsOnly;
        },

        filteredPlatforms() {
            const availableLists = this.ownedListsOnly
                ? this.platforms.filter(({ code }) => this.gameLists[code])
                : this.platforms;

            if (msnry) {
                msnry.reloadItems();
                msnry.layout();
            }

            return this.settings && this.settings.sortListsAlphabetically
                ? sortBy(availableLists, 'name')
                : availableLists;
        },
    },

    mounted() {
        this.initGrid();
    },

    methods: {
        initGrid() {
            msnry = new Masonry('.platforms', {
                itemSelector: '.platform',
                gutter: 16,
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .platforms-page {
        min-height: calc(100vh - #{$navHeight});
        padding: $gp / 2 $gp;
    }

    .platforms {
        display: flex;
        flex-direction: column;
    }
</style>
