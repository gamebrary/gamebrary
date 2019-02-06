<template>
    <div id="app">
        <nav-header />

        <main :class="{ 'logged-in': user && !isPublic }">
            <router-view />
        </main>

        <toast />
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader/NavHeader';
import Toast from '@/components/Toast/Toast';
import firebase from 'firebase/app';
import { debounce } from 'lodash';
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
        Toast,
    },

    computed: {
        ...mapState(['user', 'platform']),

        isPublic() {
            return this.$route.name === 'shareList';
        },
    },

    mounted() {
        if (this.isPublic) {
            return;
        }

        this.$bus.$on('SAVE_SETTINGS', this.saveSettings);

        if (this.user) {
            this.syncData();

            if (!this.platform) {
                this.$router.push({ name: 'platforms' });
            }
        } else {
            firebase.auth().getRedirectResult().then(({ user }) => {
                if (user) {
                    this.init(user);
                    this.syncData();
                    this.$router.push({ name: 'platforms' });
                } else {
                    const GoogleAuth = new firebase.auth.GoogleAuthProvider();

                    firebase.auth().signInWithRedirect(GoogleAuth)
                        .catch((error) => {
                            /* eslint-disable */
                            console.log(error);
                        });
                }
            });
        }
    },

    beforeDestroy() {
        this.$bus.$off('SAVE_SETTINGS');
    },

    methods: {
        saveSettings: debounce(
            // eslint-disable-next-line
            function(settings) {
                db.collection('settings').doc(this.user.uid).set(settings, { merge: true })
                    .then(() => {
                        this.$store.commit('SET_SETTINGS', settings);
                        this.$bus.$emit('TOAST', { message: 'Settings saved' });
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', { message: 'There was an error saving your settings', type: 'error' });
                    });
            }, 500),

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
                this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
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
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
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
