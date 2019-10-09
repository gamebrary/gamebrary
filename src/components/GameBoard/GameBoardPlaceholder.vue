<!-- TODO: Account for unique list style (100%) -->
<template lang="html">
    <div class="gameboard-placeholder">
        <div
            :class="`list ${list.view || 'single'}`"
            v-for="list in lists"
            :key="list.name"
        >
            <div class="list-header" :style="style" />

            <div class="games">
                <placeholder
                    image
                    v-for="n in list.games.length"
                    :lines="list && list.view === 'grid' ? 0 : 2"
                    :key="n"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Placeholder from '@/components/Placeholder';

export default {
    components: {
        Placeholder,
    },

    computed: {
        ...mapState(['gameLists', 'platform']),
        ...mapGetters(['brandingEnabled']),

        lists() {
            return this.gameLists && this.platform && this.gameLists[this.platform.code]
                ? this.gameLists[this.platform.code]
                : [];
        },

        style() {
            return this.brandingEnabled
                ? `background-color: ${this.platform.hex}; opacity: 0.8;`
                : null;
        },
    },

    methods: {
        randomColumn() {
            return Math.floor(Math.random() * 4) + 1;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .gameboard-placeholder {
        user-select: none;
        display: flex;
        align-items: flex-start;
    }

    .list {
        flex-shrink: 0;
        cursor: default;
        border-radius: $border-radius;
        background: var(--list-background);
        overflow: hidden;
        position: relative;
        width: $list-width;
        margin-right: $gp;
        max-height: calc(100vh - 81px);

        &.wide {
            --placeholder-image-width: 80px;
            --placeholder-image-height: 80px;
        }

        &.grid {
            --placeholder-image-width: 90px;
        }

        &.grid .games {
            padding-top: $gp / 2;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: $gp / 4;

            .placeholder {
                margin: 0;
                padding: 0;
            }
        }
    }

    .list-header {
        background: var(--list-header-background);
        height: $list-header-height;
        position: absolute;
        width: 100%;
    }

    .games {
        margin-top: $list-header-height;
        display: grid;
        grid-gap: $gp / 2 ;
        width: 100%;
        padding: $gp / 2;
    }
</style>
