<template lang="html">
    <div class="game-detail-wrapper">
        <div class="game-detail" v-if="game">
            <div class="game-hero" :style="style" />

            <div class="game-detail-container">
                <div class="game-info">
                    <game-header />

                    <div class="game-details">
                        <h2>{{ game.name }}</h2>
                        {{ platform.name }}
                        <game-rating :rating="game.rating" />

                        <p class="game-description" v-html="game.summary" />

                        <tag
                            v-if="games.includes(game.id)"
                            v-for="({ games, hex }, name) in tags"
                            :key="name"
                            :label="name"
                            :hex="hex"
                            readonly
                            @action="openTags"
                            @close="removeTag(name)"
                        />

                        <game-details />

                        <div class="actions">
                            <button
                                v-if="list.games.includes(game.id)"
                                class="danger"
                                @click="removeGame"
                            >
                                <i class="far fa-trash-alt delete-game" />
                                {{ $t('gameDetail.removeFromList')}}
                            </button>

                            <button class="primary" v-else>
                                {{ $t('list.addGame') }}

                            </button>

                            <div class="tags" v-if="hasTags">
                                <button class="primary hollow" @click="openTags">
                                    <i class="fas fa-tag" />
                                    {{ $t('tags.addTag') }}
                                </button>
                            </div>
                        </div>

                        <game-notes />
                    </div>
                </div>

                <game-screenshots />
                <game-videos />
                <igdb-credit gray />
            </div>
        </div>

        <game-detail-placeholder v-else :id="id" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Tag from '@/components/Tag';
import GameHeader from '@/components/GameDetail/GameHeader';
import GameScreenshots from '@/components/GameDetail/GameScreenshots';
import GameNotes from '@/components/GameNotes';
import GameRating from '@/components/GameDetail/GameRating';
import GameVideos from '@/components/GameDetail/GameVideos';
import GameDetails from '@/components/GameDetail/GameDetails';
import IgdbCredit from '@/components/IgdbCredit';
import GameDetailPlaceholder from '@/components/GameDetail/GameDetailPlaceholder';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        IgdbCredit,
        Tag,
        GameHeader,
        GameRating,
        GameScreenshots,
        GameNotes,
        GameVideos,
        GameDetails,
        GameDetailPlaceholder,
    },

    props: {
        id: [Number, String],
        listId: [Number, String],
    },

    computed: {
        ...mapState(['game', 'user', 'platform', 'tags', 'gameLists']),

        hasTags() {
            return Object.keys(this.tags) && Object.keys(this.tags).length > 0;
        },

        style() {
            const screenshot = this.game.screenshots && this.game.screenshots.length > 0
                ? this.game.screenshots[0]
                : null;

            const screenshotUrl = screenshot && screenshot.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot.image_id}.jpg`
                : '';

            return `background: url('${screenshotUrl}') center center no-repeat; background-size: cover;`;
        },

        activePlatform() {
            return this.gameLists[this.platform.code];
        },

        list() {
            return this.activePlatform[this.listId];
        },

        coverUrl() {
            return this.game.cover && this.game.cover.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.game.cover.image_id}.jpg`
                : '/static/no-image.jpg';
        },
    },

    mounted() {
        this.loadGame(this.id);
    },

    methods: {
        removeTag(tagName) {
            this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.game.id });
            this.$bus.$emit('SAVE_TAGS', this.tags);
        },

        openTags() {
            this.$bus.$emit('OPEN_TAGS', this.id);
        },

        loadGame(gameId) {
            this.$store.commit('CLEAR_ACTIVE_GAME');

            this.$store.dispatch('LOAD_GAME', gameId)
                .then(() => {
                    if (this.game) {
                        this.$ga.event({
                            eventCategory: 'game',
                            eventAction: 'view',
                            eventLabel: 'gameViewed',
                            eventValue: `${this.platform.name} - ${this.game.name}`,
                        });

                        document.title = `${this.game.name} (${this.platform.name}) - Gamebrary`;
                    }
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Error loading game', type: 'error' });
                });
        },

        removeGame() {
            const data = {
                listId: this.listId,
                gameId: this.game.id,
            };

            this.$store.commit('REMOVE_GAME', data);

            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', {
                        message: `Removed ${this.game.name} from list ${this.list.name}`,
                        imageUrl: this.coverUrl,
                    });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .game-detail {
        display: flex;
        justify-content: center;
        min-height: calc(100vh - #{$navHeight});

        @media($small) {
            padding-top: $gp * 2;
        }
    }

    .game-hero {
        background-color: #555555;
        position: absolute;
        background-position: bottom;
        width: 100%;
        left: 0;
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
        height: 400px;
        z-index: 1;

        @media($small) {
            top: 0;
            border-radius: 0;
            padding-top: $gp;
        }
    }

    .game-details {
        margin-top: $gp;

        @media($small) {
            margin: -$gp;
            margin-top: $gp;
            padding: $gp;
            background-color: var(--modal-background);
        }
    }

    .game-info {
        display: grid;
        grid-template-columns: 180px auto;
        grid-gap: $gp * 2;
        margin: 0 $gp;

        @media($small) {
            grid-gap: 0;
            grid-template-columns: 1fr;

            .game-description {
                text-align: justify;
            }
        }

        .game-description {
            line-height: 1.4rem;
        }
    }

    .game-detail-container {
        box-shadow: 0 0 2px 0 #a5a2a2;
        width: $container-width;
        background: var(--modal-background);
        opacity: 0.95;
        max-width: 100%;
        z-index: 1;
        margin: $gp * 3;
        border-radius: $border-radius;

        @media($small) {
            margin: 0;
            border-radius: 0;
            box-shadow: none;
            margin-top: 0;
            box-shadow: none;
            background-color: rgba(255, 255, 255, .5);
            background: none;
        }
    }

    .igdb-credit {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: $gp;
    }

    .actions {
        display: flex;
        align-items: center;
        margin-top: $gp;

        button {
            margin-right: $gp;
        }
    }
</style>
