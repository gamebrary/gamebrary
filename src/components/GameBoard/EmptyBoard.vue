<template lang="html">
    <div class="empty-board">
        <h2>Hello!</h2>
        <p>We've created a few lists for you, feel free to rename them by clicking on the title</p>
        <md-button
            class="md-dense md-raised md-primary"
            @click="addGame"
        >
            Add your first game!
        </md-button>
    </div>
</template>

<script>
export default {
    methods: {
        addGame() {
            this.$bus.$emit('TOGGLE_DRAWER', {
                panelName: 'search',
                listIndex: 0,
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .empty-board {
        padding: 0 $gp;
    }
</style>
