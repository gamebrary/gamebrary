<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img
            :src="coverUrl"
            :alt="game.name"
            @click="openDetails"
        >

        <!-- TODO: put all these actions in game modal -->
        <div class="actions">
            <i class="fas fa-grip-vertical game-drag-handle" />
            <i class="fas fa-tag tags" @click="openTags" v-if="hasTags" />
            <i class="far fa-trash-alt delete-game" @click="removeGame" />
        </div>
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
    }

    .actions {
        background-color: $color-dark-gray-transparent;
        color: $color-white;
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: $gp / 4 0;

        font-size: 12px;
    }
</style>
