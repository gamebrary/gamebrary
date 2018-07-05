<template lang="html">
    <md-bottom-bar>
        <md-bottom-bar-item
            md-label="Add Game"
            md-icon="playlist_add"
            @click="addGame"
        />

        <md-bottom-bar-item
            md-label="Delete list"
            md-icon="delete_sweep"
            @click="remove"
        />
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
</style>
