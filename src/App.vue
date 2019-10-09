<template>
    <div
        id="app"
        :class="theme"
        :style="style"
        :dir="dir"
    >
        <nav-header />

        <router-view v-if="user || isPublic" />

        <div class="auth" v-else>
            <img src='/static/gamebrary-logo.png' />
            <i class="fas fa-sync-alt fa-2x fast-spin" />
            <h3>Authorizing</h3>
        </div>

        <toast />
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import Toast from '@/components/Toast';
import firebase from 'firebase/app';
import { mapState } from 'vuex';
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
    },

    computed: {
        ...mapState(['user', 'platform', 'wallpaperUrl', 'settings']),

        dir() {
            return this.settings && this.settings.language === 'ar'
                ? 'rtl'
                : 'ltr';
        },

        isPublic() {
            return this.$route.name === 'share-list';
        },

        style() {
            return this.$route.name === 'game-board' && this.wallpaperUrl
                ? `background-image: url('${this.wallpaperUrl}')`
                : null;
        },

        customWallpaper() {
            // eslint-disable-next-line
            return this.settings && this.settings.wallpapers && this.platform && this.settings.wallpapers[this.platform.code]
                ? this.settings.wallpapers[this.platform.code].url
                : '';
        },

        theme() {
            const hasPlatform = this.platform && this.platform.code;
            const hasTheme = hasPlatform
                && this.settings
                && this.settings.theme[this.platform.code];

            const isGameBoard = this.$route.name === 'game-board';

            const hasPlatformTheme = hasPlatform && hasTheme;

            return isGameBoard && hasPlatformTheme
                ? `theme-${this.settings.theme[this.platform.code]}`
                : 'theme-default';
        },
    },

    watch: {
        customWallpaper(value) {
            if (value) {
                if (this.platform) {
                    this.loadWallpaper();
                }
            } else {
                this.$store.commit('SET_WALLPAPER_URL', '');
            }
        },
    },

    mounted() {
        this.$bus.$on('SAVE_SETTINGS', this.saveSettings);
        this.$bus.$on('SAVE_TAGS', this.saveTags);
        this.$bus.$on('SAVE_NOTES', this.saveNotes);
        this.init();
    },

    beforeDestroy() {
        this.$bus.$off('SAVE_SETTINGS');
        this.$bus.$off('SAVE_TAGS');
        this.$bus.$off('SAVE_NOTES');
    },

    methods: {
        init() {
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
                    return this.initUser(user);
                }

                return this.handleAuthRedirect();
            });
        },

        handleAuthRedirect() {
            const authProvider = this.$route.params.authProvider || 'google';

            const firebaseAuthProvider = authProvider === 'twitter'
                ? new firebase.auth.TwitterAuthProvider()
                : new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithRedirect(firebaseAuthProvider)
                .catch((message) => {
                    this.$bus.$emit('TOAST', {
                        message,
                        type: 'error',
                    });
                });
        },

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
                // TOOD: move to actions
                db.collection('settings').doc(this.user.uid).set(settings, { merge: true })
                    .then(() => {
                        this.$store.commit('SET_SETTINGS', settings);
                        this.$bus.$emit('TOAST', { message: 'Settings saved' });
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', { message: 'There was an error saving your settings', type: 'error' });
                        this.$router.push({ name: 'sessionExpired' });
                    });
            }, 500),

        saveTags(tags, force) {
            if (tags) {
                // TOOD: move to actions
                db.collection('tags').doc(this.user.uid).set(tags, { merge: !force })
                    .then(() => {
                        this.$bus.$emit('TOAST', { message: 'Tags updated' });
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', { message: 'There was an error saving your tag', type: 'error' });
                        this.$router.push({ name: 'sessionExpired' });
                    });
            }
        },

        saveNotes(notes, force) {
            if (notes) {
                // TOOD: move to actions
                db.collection('notes').doc(this.user.uid).set(notes, { merge: !force })
                    .then(() => {
                        this.$bus.$emit('TOAST', { message: 'Notes updated' });
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', { message: 'There was an error saving your note', type: 'error' });
                        this.$router.push({ name: 'sessionExpired' });
                    });
            }
        },

        syncData() {
            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const gameLists = doc.data();
                        this.$store.commit('SET_GAME_LISTS', gameLists);
                    }
                });


            // TOOD: move to actions
            db.collection('settings').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const settings = doc.data();

                        this.$store.commit('SET_SETTINGS', settings);
                    }
                });

            // TOOD: move to actions
            db.collection('tags').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const tags = doc.data();

                        this.$store.commit('SET_TAGS', tags);
                    }
                });

            // TOOD: move to actions
            db.collection('notes').doc(this.user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        const notes = doc.data();

                        this.$store.commit('SET_NOTES', notes);
                    }
                });
        },

        initUser(user) {
            this.$store.commit('SET_USER', user);
            this.loadSettings();
            this.loadTags();
            this.loadLists();
            this.syncData();
        },

        loadSettings() {
            // TOOD: move to actions
            const docRef = db.collection('settings').doc(this.user.uid);

            docRef.get().then((doc) => {
                const hasData = doc && doc.exists;

                return hasData
                    ? this.$store.commit('SET_SETTINGS', doc.data())
                    : this.initSettings();
            }).catch(() => {
                this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                this.$router.push({ name: 'sessionExpired' });
            });
        },

        loadLists() {
            // TOOD: move to actions
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
                    this.$router.push({ name: 'sessionExpired' });
                });
        },

        loadTags() {
            // TOOD: move to actions
            db.collection('tags').doc(this.user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.$store.commit('SET_TAGS', data);
                    }
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },

        initList() {
            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid).set({}, { merge: true })
                .then(() => {
                    this.loadLists();
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },

        initSettings() {
            // TOOD: move to actions
            db.collection('settings').doc(this.user.uid).set({}, { merge: true })
                .then(() => {
                    this.loadSettings();
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss">
    @import url(https://fonts.googleapis.com/css?family=Fira+Sans:700|Roboto:400,400italic,700);
    @import "~styles/styles";
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    #app {
        background: var(--body-background);
        background-size: cover;
    }

    .auth {
        background: var(--body-background);
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
