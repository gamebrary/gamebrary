<!-- deprecated -->
<template lang="html">
    <md-bottom-bar>
        <md-button @click="addGame">
            <i class="fas fa-plus" />
            Add game
        </md-button>

        <!-- <md-bottom-bar-item
            md-label="Delete list"
            md-icon="delete_sweep"
            @click="remove"
        /> -->
    </md-bottom-bar>
</template>

<script>
export default {
    methods: {
        addGame() {
            this.$emit('add');
        },

        remove() {
            this.$emit('remove');
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .md-raised {
        box-shadow: none;
    }
</style>

