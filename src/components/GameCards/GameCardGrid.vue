<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img
            :src="coverUrl"
            :alt="game.name"
            @click="openDetails"
        >
    </div>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
    mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .game-card {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 94.5px;
        margin-bottom: 4px;
        border-radius: $border-radius;
        overflow: hidden;
        cursor: pointer;

        img {
            width: 100%;
            height: auto;
        }
    }
</style>
