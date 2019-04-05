<template lang="html">
    <div :class="['gameboard-placeholder', { dark: darkModeEnabled }]">
        <div class="list" v-for="list in lists" :key="list.name">
            <div class="list-header" />

            <div class="games">
                <div class="game">
                    <placeholder
                        image
                        v-for="n in list.games.length"
                        :lines="2"
                        :key="n"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Placeholder from '@/components/Placeholder/Placeholder';

export default {
    components: {
        Placeholder,
    },

    computed: {
        ...mapState(['gameLists', 'platform']),
        ...mapGetters(['darkModeEnabled']),

        lists() {
            return this.gameLists && this.platform && this.gameLists[this.platform.code]
                ? this.gameLists[this.platform.code]
                : [];
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
    @import "~styles/styles.scss";

    .gameboard-placeholder {
        user-select: none;
        display: flex;
        align-items: flex-start;
    }

    .list {
        flex-shrink: 0;
        cursor: default;
        border-radius: $border-radius;
        background: $color-white;
        overflow: hidden;
        position: relative;
        width: $list-width;
        margin-right: $gp;
        max-height: calc(100vh - 81px);
    }

    .dark .list {
        background: $color-dark-gray;
    }

    .list-header {
        background: $color-dark-gray;
        height: $list-header-height;
        position: absolute;
        width: 100%;
    }

    .games {
        margin-top: $list-header-height;
        width: 100%;
        padding: $gp / 2;
    }

    .placeholder {
        padding-right: $gp;
        margin-bottom: $gp / 2;
    }
</style>
