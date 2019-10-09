// Identify stuff that's not being reused
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    props: {
        gameId: Number,
        listId: Number,
    },

    data() {
        return {
            showEditOptions: false,
        };
    },

    computed: {
        ...mapState(['settings', 'games', 'gameLists', 'platform', 'user', 'tags', 'activeList', 'notes']),

        showGameRatings() {
            return this.settings && !this.settings.hideGameRatings;
        },

        gameCardClass() {
            return [
                'game-card',
                this.list.view,
            ];
        },

        activePlatform() {
            return this.gameLists[this.platform.code];
        },

        note() {
            return this.notes && this.notes[this.gameId] && this.notes[this.gameId].text;
        },

        list() {
            return this.activePlatform[this.listId];
        },

        game() {
            return this.games[this.gameId];
        },

        hasTags() {
            return Object.keys(this.tags) && Object.keys(this.tags).length > 0;
        },

        coverUrl() {
            const game = this.games[this.gameId];

            return game.cover && game.cover.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
                : '/static/no-image.jpg';
        },

        addToLabel() {
            return this.list.name.length >= 25
                ? 'list'
                : this.list.name;
        },
    },

    methods: {
        openDetails() {
            this.$bus.$emit('OPEN_GAME', {
                id: this.game.id,
                listId: this.listId,
            });
        },

        openTags() {
            this.$bus.$emit('OPEN_TAGS', this.game.id);
        },

        addGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
            };

            this.$emit('added');
            this.$store.commit('ADD_GAME', data);

            this.$ga.event({
                eventCategory: 'game',
                eventAction: 'add',
                eventLabel: 'addGame',
                eventValue: data,
            });

            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', {
                        message: `Added ${this.game.name} to list ${this.list.name}`,
                        imageUrl: this.coverUrl,
                    });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },

        removeTag(tagName) {
            this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameId });
            this.$bus.$emit('SAVE_TAGS', this.tags);
        },

        removeGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
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
