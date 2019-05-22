<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img
            :src="coverUrl"
            :alt="game.name"
            @click="openDetails"
        >

        <i
            v-if="isDraggable"
            class="fas fa-grip-vertical game-drag-handle"
        />
    </div>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
    mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-card {
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: $color-black;
        border-radius: $border-radius;
        overflow: hidden;

        &.dark {
            img {
                opacity: 0.8;
            }

            .actions {
                color: $color-gray;
            }
        }

        &.card-placeholder {
            background: $color-light-gray;
            outline: 1px dashed $color-gray;
            opacity: 0.6;
            flex-direction: row;

            img {
                max-height: 100px;
                width: auto;
            }
        }
    }

    img {
        width: 100%;
        height: auto;
        display: flex;
        align-self: center;
        cursor: pointer;
    }

    .game-drag-handle {
        @include drag-cursor;
        position: absolute;
        color: $color-white;
        top: $gp / 4;
        right: $gp / 4;
        padding: $gp / 4;
        font-size: 12px;
    }
</style>
