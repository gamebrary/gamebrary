// Identify stuff that's not being reused
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    props: {
        gameId: Number,
        listId: Number,
        searchResult: Boolean,
    },

    data() {
        return {
            showEditOptions: false,
        };
    },

    computed: {
        ...mapState(['settings', 'games', 'gameLists', 'platform', 'user', 'tags', 'activeList', 'notes']),

        ...mapGetters(['darkModeEnabled']),

        showGameRatings() {
            return this.settings && !this.settings.hideGameRatings;
        },

        gameCardClass() {
            return [
                'game-card',
                this.list.view,
                {
                    'search-result': this.searchResult,
                    dark: this.darkModeEnabled,
                },
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
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/';

            return this.games && this.games[this.gameId].cover
                ? `${url}${this.games[this.gameId].cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },

        addToLabel() {
            return this.list.name.length >= 25
                ? 'list'
                : this.list.name;
        },
        isDraggable() {
            return this.list.sortOrder === 'sortByCustom' || this.list.sortOrder === null;
        }
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

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    if (this.game.name.toLowerCase().includes('mortal kombat')) {
                        const toastySound = new Audio('http://localhost:4000/static/sounds/toasty.mp3');
                        toastySound.play();

                        this.$bus.$emit('TOAST', {
                            message: 'Dan Forden',
                            type: 'warning',
                            imageUrl: '/static/img/toasty.png',
                        });

                        return;
                    }

                    this.$bus.$emit('TOAST', {
                        message: `Added ${this.game.name} to list ${this.list.name}`,
                        imageUrl: this.coverUrl,
                    });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
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
