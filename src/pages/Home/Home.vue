<template lang="html">
    <main>
        <public-home v-if="!user" />
        <platforms v-if="user && !platform" />
        <div class="platform-welcome">
            <!-- TODO: add button to initialize platform library -->
        </div>
        <game-board v-if="user && platform" />
    </main>
</template>

<script>
import PublicHome from '@/pages/Home/PublicHome';
import GameBoard from '@/pages/GameBoard/GameBoard';
import Platforms from '@/pages/Platforms/Platforms';
import firebase from 'firebase';
import toasts from '@/mixins/toasts';
import { mapState } from 'vuex';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        PublicHome,
        GameBoard,
        Platforms,
    },

    mixins: [toasts],

    computed: {
        ...mapState(['platform', 'user']),

        hasPlatforms() {
            return this.user.platforms.length > 0 || this.platform;
        },
    },

    watch: {
        platform(value) {
            if (value) {
                this.loadLists();
                console.log('reload game board!');
            }
        },
    },

    mounted() {
        this.loadLists();
    },

    methods: {
        loadLists() {
            db.collection('lists').doc(this.user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        this.$store.commit('SET_GAME_LISTS', doc.data());
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                        // this.initLists();
                    }
                }).catch(() => {
                    this.$error('Authentication error');
                });
        },

        initLists() {
            // // TODO: move to init method after login
            // const payload = {}
            //
            // db.collection('lists').doc(this.user.uid).set(payload)
            //     .then(() => {
            //         console.log('set in store');
            //         console.log("Document successfully written!");
            //     })
            //     .catch(() => {
            //         this.$error('Authentication error');
            //     });
        },

        put() {
            // const payload = {
            //     'nintendo-switch': [
            //         {
            //             name: 'Owned',
            //             games: [
            //                 21062
            //             ]
            //         },
            //         {
            //             name: 'Wishlist',
            //             games: [
            //                 26766
            //             ]
            //         },
            //         {
            //             name: 'Completed',
            //             games: []
            //         },
            //         {
            //             name: 'new list',
            //             games: []
            //         }
            //     ]
            // };
            //
            // const settings = {
            //     merge: true
            // }
            //
            // db.collection('lists').doc(this.user.uid).set(payload, settings)
            //     .then(() => {
            //         console.log("Document successfully written!");
            //     })
            //     .catch(() => {
            //         this.$error('Authentication error');
            //     });
        },
    },
};
</script>
