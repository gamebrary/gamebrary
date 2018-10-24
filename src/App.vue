<template>
    <div id="app">
        <nav-header />

        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader/NavHeader';
import firebase from 'firebase';
import { mapState } from 'vuex';

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
    },

    mounted() {
        firebase.auth().getRedirectResult().then(({ user }) => {
            if (user) {
                this.init(user);
            }
        });
    },

    methods: {
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
                this.$error('Authentication error');
            });
        },

        loadLists() {
            db.collection('lists').doc(this.user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        this.$store.commit('SET_GAME_LISTS', doc.data());
                    } else {
                        this.initList();
                    }
                })
                .catch(() => {
                    this.$error('Authentication error');
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
    @import "~styles/styles.scss";

    body {
        margin: 0;
        font-size: 14px;
    }

    #app {
        height: 100%;
        width: 100%;
        overflow: hidden;

        > main {
            height: calc(100vh - #{$navHeight});
            overflow: auto;
            background: $color-gray;
        }
    }


    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

    body {
        font-family: 'Roboto', sans-serif;
    }
</style>
