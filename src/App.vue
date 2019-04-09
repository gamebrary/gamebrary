<template>
    <div
        id="app"
        :class="{ dark: darkModeEnabled }"
        :style="style"
    >
        <nav-header />

        <main class="content" v-if="user || isPublic">
            <router-view />
        </main>

        <div class="auth" v-else>
            <img src='/static/gamebrary-logo.png' />
            <i class="fas fa-sync-alt fa-2x fast-spin" />
            <h3>Authorizing</h3>
        </div>

        <toast />
        <copyright-footer />
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader/NavHeader';
import Toast from '@/components/Toast/Toast';
import CopyrightFooter from '@/components/CopyrightFooter/CopyrightFooter';
import firebase from 'firebase/app';
import { mapState, mapGetters } from 'vuex';
import { debounce } from 'lodash';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
    apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
    authDomain: 'gamebrary.com',
    databaseURL: 'https://gamebrary-8c736.firebaseio.com',
    projectId: 'gamebrary-8c736',
    storageBucket: 'gamebrary-8c736.appspot.com',
    messagingSenderId: '324529217902',
});

const storage = firebase.storage().ref();
const db = firebase.firestore();

export default {
    name: 'App',

    components: {
        NavHeader,
        Toast,
        CopyrightFooter,
    },

    computed: {
        ...mapState(['user', 'platform', 'wallpaperUrl', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        isPublic() {
            return this.$route.name === 'share-list';
        },

        style() {
            return this.$route.name === 'game-board' && this.wallpaperUrl
                ? `background-image: url('${this.wallpaperUrl}')`
                : null;
        },

        customWallpaper() {
            return this.settings.wallpapers && this.settings.wallpapers[this.platform.code]
                ? this.settings.wallpapers[this.platform.code].url
                : '';
        },
    },

    watch: {
        customWallpaper(value) {
            if (value) {
                this.loadWallpaper();
            } else {
                this.$store.commit('SET_WALLPAPER_URL', '');
            }
        },
    },

    mounted() {
        this.$bus.$on('SAVE_SETTINGS', this.saveSettings);
        this.$bus.$on('SAVE_TAGS', this.saveTags);

        if (this.isPublic) {
            return;
        }

        if (this.user) {
            this.syncData();
            return;
        }

        if (this.customWallpaper) {
            this.loadWallpaper();
        }

        firebase.auth().getRedirectResult().then(({ additionalUserInfo, user }) => {
            if (additionalUserInfo && additionalUserInfo.isNewUser) {
                this.$store.dispatch('SEND_WELCOME_EMAIL', additionalUserInfo);
            }

            if (user) {
                this.init(user);
            } else {
                const GoogleAuth = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithRedirect(GoogleAuth)
                    .catch((message) => {
                        this.$bus.$emit('TOAST', {
                            message,
                            type: 'error',
                        });
                    });
            }
        });
    },

    beforeDestroy() {
        this.$bus.$off('SAVE_SETTINGS');
        this.$bus.$off('SAVE_TAGS');
    },

    methods: {
        loadWallpaper() {
            const wallpaperRef = this.customWallpaper;
            this.$store.commit('SET_WALLPAPER_URL', '');

            storage.child(wallpaperRef).getDownloadURL().then((url) => {
                this.$store.commit('SET_WALLPAPER_URL', url);
            });
        },

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

        saveTags(tags, force) {
            if (tags) {
                db.collection('tags').doc(this.user.uid).set(tags, { merge: !force })
                    .then(() => {
                        this.$bus.$emit('TOAST', { message: 'Tags updated' });
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', {
                            message: 'There was an error saving your tag',
                            type: 'error',
                        });
                    });
            }
        },

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

            db.collection('tags').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const tags = doc.data();

                        this.$store.commit('SET_TAGS', tags);
                    }
                });
        },

        init(user) {
            this.$store.commit('SET_USER', user);
            this.loadSettings();
            this.loadTags();
            this.loadLists();
            this.syncData();
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

        loadTags() {
            db.collection('tags').doc(this.user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.$store.commit('SET_TAGS', data);
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
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    #app {
        background-color: $color-gray;
        background-size: cover;

        &.dark {
            background-color: $color-darkest-gray;
        }
    }

    .auth {
        background: $color-white;
        height: 100vh;
        position: fixed;
        top: 0;
        width: 100vw;
        display: flex;
        align-items: center;
        flex-direction: column;

        img {
            width: 100px;
            margin-top: 100px;
        }

        i {
            margin: $gp;
        }
    }
</style>
