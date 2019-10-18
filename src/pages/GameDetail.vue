<template lang="html">
    <div class="game-detail">
        <game-detail-placeholder v-if="!game" :id="id" />

        <template v-else>
            <div class="game-detail-container">
                <pre>{{ tabs }}</pre>
                <div class="checkbox-group">
                    <span v-for="{ value } in tabs">
                        <label for="videos" :class="{ active: value === tab }">
                            <i class="fab fa-youtube" />
                            Videos
                        </label>
                        <input type="radio" id="videos" :value="value" v-model="tab" />
                    </span>
                </div>

                <!-- <component :is="gameCardComponent" /> -->

                <game-screenshots />
                <game-videos />
                <igdb-credit gray />
                <div class="game-info">
                    <div class="game-header">
                        <img :src="coverUrl" :alt="game.name" class="game-cover" />

                        <div class="game-rating" v-if="game.age_ratings">
                            <img
                                v-for="{ rating, synopsis, id } in game.age_ratings"
                                :key="id"
                                :src='`/static/img/age-ratings/${ageRatings[rating]}.png`'
                                :alt="synopsis"
                            />
                        </div>
                    </div>

                    <div class="game-details">
                        <h2>{{ game.name }}</h2>
                        {{ platform.name }}
                        <game-rating :rating="game.rating" />

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
                        <game-notes />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Tag from '@/components/Tag';
// import GameHeader from '@/components/GameDetail/GameHeader';
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
        // GameHeader,
        GameRating,
        GameScreenshots,
        GameNotes,
        GameVideos,
        GameDetails,
        GameDetailPlaceholder,
    },

    data() {
        return {
            tab: '',
            tabs: [
                {
                    value: 'videos',
                    icon: 'fab fa-youtube',
                    text: 'Videos',
                    component: 'GameVideos',
                }
            ]
        };
    },

    props: {
        id: [Number, String],
        listId: [Number, String],
    },

    computed: {
        ...mapState(['game', 'user', 'platform', 'tags', 'gameLists']),
        ...mapGetters(['ageRatings']),

        hasTags() {
            return Object.keys(this.tags) && Object.keys(this.tags).length > 0;
        },

        activePlatform() {
            return this.gameLists[this.platform.code];
        },

        list() {
            return this.activePlatform[this.listId];
        },

        coverUrl() {
            return this.game && this.game.cover
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


</style>
