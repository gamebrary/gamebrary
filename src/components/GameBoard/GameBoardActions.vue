<template lang="html">
    <div class="game-board-actions">
        <div class="actions">
            <button
                class="small info"
                :title="$t('list.add')"
                @click="addList"
            >
                <i class="fas fa-plus" />
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal';
import ListAdd from '@/components/Lists/ListAdd';

export default {
    components: {
        Modal,
        ListAdd,
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform']),

        list() {
            return this.gameLists[this.platform.code];
        },
    },

    methods: {
        addList() {
            this.$store.commit('SET_ADDING_LIST_STATUS', true);
        },

        update(force) {
            this.$emit('update', force);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "src/styles/styles.scss";

    .game-board-actions {
        padding-right: $gp;
    }

    .actions {
        display: grid;
        grid-gap: $gp;
        align-items: center;
        flex-direction: column;
    }

    small {
        background: $color-white;
        margin-bottom: $gp / 2;
        display: block;
        padding: $gp / 2;
        border-radius: $border-radius;
    }
</style>
