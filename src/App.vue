<template>
    <div id="app">
        <nav-header />

        <main :class="{ 'logged-in': user && !isPublic }">
            <router-view />
        </main>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader/NavHeader';
import firebase from 'firebase/app';
import { $error } from '@/shared/modals';
import 'firebase/auth';
import 'firebase/firestore';
import { mapState } from 'vuex';

firebase.initializeApp({
    apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
    authDomain: 'gamebrary.com',
    databaseURL: 'https://gamebrary-8c736.firebaseio.com',
    projectId: 'gamebrary-8c736',
    storageBucket: 'gamebrary-8c736.appspot.com',
    messagingSenderId: '324529217902',
});

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    name: 'App',

    components: {
        NavHeader,
    },

    computed: {
        ...mapState(['user']),

        isPublic() {
            return this.$route.name === 'shareList';
        },
    },

    mounted() {
        firebase.auth().getRedirectResult().then(({ user }) => {
            if (user) {
                this.init(user);
                this.syncData();
            }
        });

        if (this.user) {
            this.syncData();
        }
    },

    methods: {
        syncData() {
            db.collection('lists').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const gameLists = doc.data();
                        this.$store.commit('SET_GAME_LISTS', gameLists);
                    }
                });


            db.collection('settings').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const settings = doc.data();

                        this.$store.commit('SET_SETTINGS', settings);
                    }
                });
        },

        init(user) {
            this.$store.commit('SET_AUTHORIZING_STATUS', false);
            this.$store.commit('SET_USER', user);
            this.loadSettings();
            this.loadLists();
        },

        loadSettings() {
            const docRef = db.collection('settings').doc(this.user.uid);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    this.$store.commit('SET_SETTINGS', doc.data());
                } else {
                    this.initSettings();
                }
            }).catch(() => {
                $error('Authentication error');
            });
        },

        loadLists() {
            db.collection('lists').doc(this.user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.$store.commit('SET_GAME_LISTS', data);
                    } else {
                        this.initList();
                    }
                })
                .catch(() => {
                    $error('Authentication error');
                });
        },

        initList() {
            db.collection('lists').doc(this.user.uid).set({}, { merge: true })
                .then(() => {
                    this.loadLists();
                });
        },

        initSettings() {
            db.collection('settings').doc(this.user.uid).set({}, { merge: true })
                .then(() => {
                    this.loadSettings();
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss">
    @import url(https://fonts.googleapis.com/css?family=Fira+Sans:700|Roboto:400,400italic,700);
    @import "~styles/styles.scss";

    body {
        background: $color-dark-gray;
        margin: 0;
        font-size: 14px;
    }

    #app > main {
        background: $color-gray;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: "Fira Sans", sans-serif;
        font-weight: 700;
    }

    body, p, a, li, blockquote {
        font-family: "Roboto", sans-serif;
        font-weight: 400;
    }
</style>
