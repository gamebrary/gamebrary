<template lang="html">
    <div class="game-detail-wrapper">
        <game-detail-placeholder v-if="!game" />

        <div class="game-detail" v-else :class="{ dark: darkModeEnabled }">
            <div class="game-hero" :style="style" />

            <div class="game-detail-container">
                <div class="game-info">
                    <game-header />

                    <div class="game-details">
                        <h2>{{ game.name }}</h2>
                        <game-rating :rating="game.rating" />

                        <div class="actions" v-if="list.games.includes(game.id)">
                            <button class="error tag" @click="removeGame">
                                <i class="far fa-trash-alt delete-game" />
                                Remove from list
                            </button>

                            <div class="tags" v-if="tags">
                                <button class="primary small tag" @click="openTags">
                                    <i class="fas fa-tag tags" />
                                    Add tag
                                </button>

                                <button
                                    v-for="({ games, hex }, name) in tags"
                                    :key="name"
                                    v-if="games.includes(game.id)"
                                    class="tag small game-tag"
                                    :style="`background-color: ${hex}`"
                                >
                                    {{ name }}
                                </button>
                            </div>
                        </div>

                        <p class="game-description" v-html="game.summary" />

                        <game-notes />

                        <affiliate-link />
                        <game-review-box />
                    </div>

                </div>

                <game-screenshots />
                <game-videos />
                <igdb-credit gray />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameHeader from '@/components/GameDetail/GameHeader';
import GameScreenshots from '@/components/GameDetail/GameScreenshots';
import GameNotes from '@/components/GameNotes/GameNotes';
import GameRating from '@/components/GameDetail/GameRating';
import GameVideos from '@/components/GameDetail/GameVideos';
import GameReviewBox from '@/components/GameDetail/GameReviewBox';
import AffiliateLink from '@/components/GameDetail/AffiliateLink';
import IgdbCredit from '@/components/IgdbCredit/IgdbCredit';
import GameDetailPlaceholder from '@/components/GameDetail/GameDetailPlaceholder';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        IgdbCredit,
        GameHeader,
        GameRating,
        GameScreenshots,
        GameNotes,
        GameVideos,
        GameReviewBox,
        AffiliateLink,
        GameDetailPlaceholder,
    },

    props: {
        id: [Number, String],
        listId: [Number, String],
    },

    computed: {
        ...mapState(['game', 'user', 'platform', 'tags', 'gameLists']),
        ...mapGetters(['darkModeEnabled']),

        style() {
            return this.game && this.game.screenshots
                ? `background: url(${this.getImageUrl(this.game.screenshots[0].cloudinary_id)}) center center no-repeat; background-size: cover;`
                : '';
        },

        activePlatform() {
            return this.gameLists[this.platform.code];
        },

        list() {
            return this.activePlatform[this.listId];
        },

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/';

            return this.game && this.game.cover
                ? `${url}${this.game.cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },
    },

    mounted() {
        this.loadGame(this.id);
    },

    methods: {
        getImageUrl(cloudinaryId) {
            return cloudinaryId
                ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${cloudinaryId}.jpg`
                : null;
        },

        openTags() {
            this.$bus.$emit('OPEN_TAGS', this.id);
        },

        loadGame(gameId) {
            this.$store.commit('CLEAR_ACTIVE_GAME');

            this.$store.dispatch('LOAD_GAME', gameId)
                .then(() => {
                    this.$ga.event({
                        eventCategory: 'game',
                        eventAction: 'view',
                        eventLabel: 'gameViewed',
                        eventValue: `${this.platform.name} - ${this.game.name}`,
                    });

                    document.title = `${this.game.name} (${this.platform.name}) - Gamebrary`;
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

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', {
                        message: `Removed ${this.game.name} from list ${this.list.name}`,
                        imageUrl: this.coverUrl,
                    });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-detail {
        display: flex;
        justify-content: center;
        background: $color-light-gray;
        min-height: calc(100vh - #{$navHeight});

        &.dark {
            background: $color-darkest-gray;

            .game-detail-container {
                background: $color-darkest-gray;
                color: $color-gray;
            }
        }
    }

    .game-hero {
        background-color: $color-dark-gray;
        position: absolute;
        width: 100%;
        left: 0;
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
        height: 400px;
        z-index: 1;

        @media($small) {
            background: none !important;
        }
    }

    .game-details {
        margin-top: $gp;
    }

    .game-info {
        display: grid;
        grid-template-columns: 180px auto;
        grid-gap: $gp * 2;
        margin: 0 $gp;

        @media($small) {
            grid-gap: 0;
            grid-template-columns: 1fr;
            text-align: center;

            .game-description {
                text-align: justify;
            }
        }

        .game-description {
            line-height: 1.4rem;
        }
    }

    .game-detail-container {
        background-color: rgba(255, 255, 255, 0.95);
        -webkit-box-shadow: 0 0 2px 0 $color-gray;
        box-shadow: 0 0 2px 0 $color-gray;
        width: $container-width;
        max-width: 100%;
        z-index: 1;
        margin: $gp * 3;
        border-radius: $border-radius;

        @media($small) {
            margin: 0;
            border-radius: 0;
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
    }
</style>
