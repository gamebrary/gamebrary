<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img :src="coverUrl" @click="openDetails" :alt="game.name">

        <div class="game-info">
            <a v-text="game.name" @click="openDetails" />

            <game-rating
                v-if="showGameRatings && list.view !== 'covers'"
                :rating="game.rating"
                small
                @click.native="openDetails"
            />

            <button
                class="success small add-game-button"
                @click="addGame"
            >
                {{ $t('list.addGame') }}
            </button>
        </div>
    </div>
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
    components: {
        GameRating,
    },

    mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    $gameCoverWidth: 80px;

    .game-card {
        background-color: $color-white;
        margin-top: $gp / 2;
        position: relative;
        display: grid;
        grid-template-columns: $gameCoverWidth auto;
        border-radius: $border-radius;
        overflow: hidden;

        &.dark {
            background: $color-gray;

            img {
                opacity: 0.9;
            }
        }

        img {
            width: $gameCoverWidth;
            height: auto;
            display: flex;
            align-self: center;
            cursor: pointer;
        }

        .game-info {
            padding: $gp / 2 $gp;
            width: 100%;
            display: flex;
            flex-direction: column;

            button {
                margin-top: $gp / 2;
                align-self: flex-start;
            }

            .game-rating, a {
                display: inline-flex;
                font-weight: bold;
            }

            &:hover {
                a {
                    text-decoration: underline;
                }
            }

            a {
                color: $color-darkest-gray;
                cursor: pointer;
                margin-right: $gp / 2;
            }
        }
    }
</style>
