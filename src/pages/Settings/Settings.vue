<template lang="html">
    <div class="settings" v-if="user" :class="{ dark: settings.nightMode }">
        <section>
            <h4>Settings</h4>
        </section>

        <section>
            <i class="fas fa-share-alt" />
            <h5>Share link</h5>

            <input class="share-link value" type="text" v-model="shareUrl" readonly />
        </section>

        <section>
            <i class="fas fa-moon" />
            <h5>Dark theme</h5>

            <span class="toggle-switch value">
                <input
                    type="checkbox"
                    id="nightMode"
                    v-model="localSettings.nightMode"
                />

                <label for="nightMode" />
            </span>
        </section>

        <section>
            <i class="far fa-envelope" />
            <h5>Receive update emails</h5>

            <span class="toggle-switch value">
                <input
                    type="checkbox"
                    id="newsletter"
                    v-model="localSettings.newsletter"
                />

                <label for="newsletter" />
            </span>
        </section>

        <section>
            <i class="fas fa-star-half-alt" />
            <h5>Show Game Ratings</h5>

            <span class="toggle-switch value">
                <input
                    type="checkbox"
                    id="gameRatings"
                    v-model="localSettings.showGameRatings"
                />

                <label for="gameRatings" />
            </span>
        </section>

        <section>
            <button @click="promptDelete" class="error small">
                <i class="fas fa-exclamation-triangle" />
                Delete Account
            </button>
        </section>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Gravatar from 'vue-gravatar';
import Panel from '@/components/Panel/Panel';
import toasts from '@/mixins/toasts';
import moment from 'moment';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        Panel,
        Gravatar,
    },

    mixins: [toasts],

    data() {
        return {
            localSettings: {},
        };
    },

    computed: {
        ...mapState(['user', 'settings']),

        dateJoined() {
            return moment(this.user.dateJoined).format('LL');
        },

        shareUrl() {
            const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';

            // eslint-disable-next-line
            return `${url}/#/share/${this.user.uid}`;
        },
    },

    watch: {
        localSettings: {
            handler(oldValue, newValue) {
                if (Object.keys(newValue).length) {
                    this.save();
                }
            },
            deep: true,
        },
    },

    mounted() {
        this.localSettings = JSON.parse(JSON.stringify(this.settings));
    },

    methods: {
        setGameView(view) {
            this.localSettings.gameView = view;
            this.save();
        },

        promptDelete() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your account data will be deleted forever.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'error',
                cancelButtonClass: 'accent',
                buttonsStyling: false,
                confirmButtonText: 'Yes, delete forever!',
            }).then(({ value }) => {
                if (value) {
                    this.deleteAccount();
                }
            });
        },

        deleteAccount() {
            // TODO: use async/await
            db.collection('settings').doc(this.user.uid).delete()
                .then(() => {
                    this.$success('Settings deleted');

                    db.collection('lists').doc(this.user.uid).delete()
                        .then(() => {
                            this.$success('Game lists deleted');
                            this.$success('Account deleted');
                            this.logout();
                        })
                        .catch(() => {
                            this.$error('Authentication error');
                        });
                })
                .catch(() => {
                    this.$error('Authentication error');
                });
        },

        save: debounce(
            // eslint-disable-next-line
            function() {
                db.collection('settings').doc(this.user.uid).set(this.localSettings, { merge: true })
                    .then(() => {
                        this.$store.commit('SET_SETTINGS', this.localSettings);
                        this.$success('Settings saved');
                    })
                    .catch(() => {
                        this.$error('There was an error saving your settings');
                    });
            }, 500),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .settings {
        background: $color-white;
        min-height: calc(100vh - #{$navHeight});

        section {
            width: 600px;
            margin: 0 auto;
            max-width: 100%;
            color: $color-dark-gray;
            border-bottom: 1px solid #f0f0f0;
            padding: $gp;
            display: flex;
            align-items: center;

            @media($small) {
                padding: $gp;
            }

            &.active {
                color: $color-green;
            }

            h5 {
                margin: 0 $gp;
            }

            .value {
                display: flex;
                margin-left: auto;
            }
        }

        .share-link {
            max-width: 340px;
            margin: 0;
        }

        &.dark {
            background: $color-darkest-gray;

            section {
                border-bottom: 1px solid $color-gray;
                color: $color-gray;
            }
        }
    }
</style>
