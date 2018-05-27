<template lang="html">
    <div class="empty-state">
        <h2 class="page-title">You don't have any games in your collection</h2>
        <at-button
            type="primary"
            hollow
            @click="addGame"
            size="large"
        >
            Add your first one
        </at-button>
    </div>
</template>

<script>
export default {
    methods: {
        addGame() {
            this.$bus.$emit('OPEN_SEARCH_MODAL');
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .empty-state {
        @include container-xs;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
</style>
