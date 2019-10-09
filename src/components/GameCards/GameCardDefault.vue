<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img :src="coverUrl" @click="openDetails" :alt="game.name">

        <div class="game-info">
            <a v-text="game.name" @click="openDetails" v-if="list.view !== 'covers'" />

            <i class="fas fa-grip-vertical game-drag-handle" />

            <game-rating
                v-if="showGameRatings && list.view !== 'covers'"
                :rating="game.rating"
                small
                @click.native="openDetails"
            />

            <i
                v-if="note"
                :title="note"
                class="fas fa-sticky-note note"
                @click="openDetails"
            />

            <div class="game-tags" v-if="hasTags">
                <div
                    v-for="({ games, hex }, name) in tags"
                    :key="name"
                    v-if="games.includes(game.id)"
                >
                    <tag
                        v-if="games.includes(game.id)"
                        :label="name"
                        :hex="hex"
                        readonly
                        @action="openTags"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import GameCardUtils from '@/components/GameCards/GameCard';
import Tag from '@/components/Tag';

export default {
    components: {
        GameRating,
        Tag,
    },

    mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    $gameCoverWidth: 80px;

    .game-card {
        background: var(--game-card-background);
        margin-bottom: $gp / 2;
        position: relative;
        display: grid;
        grid-template-columns: $gameCoverWidth auto;
        border-radius: $border-radius;
        overflow: hidden;

        &.card-placeholder {
            background: var(--game-card-background);
            opacity: 0.3;

            .game-card-options {
                display: none;
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

            .game-tags {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-top: $gp / 4;
            }

            i.tags {
                position: absolute;
                bottom: $gp * 1.5;
                right: $gp / 4;
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
                cursor: pointer;
                margin-right: $gp / 2;
                color: var(--game-card-text-color);
            }
        }

        .game-drag-handle {
            @include drag-cursor;
            position: absolute;
            color: #e5e5e5;
            right: $gp / 3;
            top: $gp / 3;

            &:hover {
                color: #a5a2a2;
            }
        }

        .game-tag {
            margin-bottom: $gp / 3;
        }
    }

    .note {
        color: var(--note-color);
    }
</style>
