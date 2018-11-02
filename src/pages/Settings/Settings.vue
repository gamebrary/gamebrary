<template lang="html">
    <div class="settings" v-if="user" :class="{ dark: settings.nightMode }">
        <aside>
            <gravatar :email="user.email" />

            <div>
                <p><strong>App ID:</strong> {{ user.uid }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Joined:</strong> {{ dateJoined }}</p>
            </div>

            <div>
                <button @click="promptDelete" class="small error">
                    <i class="fas fa-exclamation-triangle" />
                    Delete Account
                </button>

                <button class="small info" @click="logout">
                    <i class="fas fa-sign-out-alt" />
                    Logout
                </button>
            </div>

            <div class="messages">
                <div class="mobile">
                    <!-- eslint-disable-next-line -->
                    <p>Gamebrary is an open source project developed during spare time. Consider donating to help pay for hosting, domain, coffee, etc. Anything helps!</p>
                    <a class="link primary small" href="https://www.paypal.me/RomanCervantes/5">
                        <i class="fas fa-donate" />
                        Donate
                    </a>

                    <a class="link warning small" href="https://github.com/romancmx/gamebrary/issues">
                        <i class="fas fa-bug" />
                        Report bugs
                    </a>

                    <a class="link info hollow small" href="https://goo.gl/forms/r0juBCsZaUtJ03qb2">
                        <i class="fas fa-comments" />
                        Submit feedback
                    </a>
                </div>

                <panel class="warning">
                    <h3>Found a bug? Report it!</h3>
                    <p>You can also use GitHub issues to request new features.</p>

                    <a class="link accent small" href="https://github.com/romancmx/gamebrary/issues">
                        <i class="fas fa-bug" />
                        Report it in GitHub
                    </a>

                    <a class="link accent small" href="https://goo.gl/forms/r0juBCsZaUtJ03qb2">
                        <i class="fas fa-comments" />
                        Submit feedback
                    </a>
                </panel>

                <panel class="positive">
                    <h3>Enjoying Gamebrary?</h3>
                    <!-- eslint-disable-next-line -->
                    <p>Gamebrary is an open source project developed during spare time. Consider donating to help pay for hosting, domain, coffee, etc. Anything helps!</p>

                    <a class="link primary hollow small" href="https://www.paypal.me/RomanCervantes/5">
                        <i class="fas fa-donate" />
                        Donate
                    </a>
                </panel>
            </div>
        </aside>

        <main class="settings-grid">
            <section>
                <i class="fas fa-share-alt" />
                <h3>Share link</h3>

                <input class="share-link value" type="text" v-model="shareUrl" readonly />
            </section>

            <section>
                <i class="fas fa-moon" />
                <h3>Night mode</h3>

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
                <i class="far fa-envelope"></i>
                <h3>Receive update emails</h3>

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
                <h3>Show Game Ratings</h3>

                <span class="toggle-switch value">
                    <input
                        type="checkbox"
                        id="gameRatings"
                        v-model="localSettings.showGameRatings"
                    />

                    <label for="gameRatings" />
                </span>
            </section>
        </main>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex';
import firebase from 'firebase';
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

        logout() {
            firebase.auth().signOut()
                .then(() => {
                    this.$store.commit('CLEAR_SESSION');
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    this.$error(error);
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
        display: grid;
        grid-template-columns: 1fr 3fr;
        min-height: calc(100vh - #{$navHeight});

        @media($small) {
            grid-template-columns: none;
        }

        aside {
            padding: $gp;
            background: $color-light-gray;

            .messages {
                border-top: 1px solid $color-gray;
                padding-top: $gp;
                margin: $gp 0 0;

                .mobile {
                    display: none;

                    @media($small) {
                        display: inline;
                    }
                }

                .panel {
                    margin-bottom: $gp;

                    @media($small) {
                        display: none;
                    }
                }
            }
        }

        main {
            section {
                color: $color-dark-gray;
                border-bottom: 1px solid $color-light-gray;
                padding: $gp * 2 $gp;
                display: flex;
                align-items: center;

                @media($small) {
                    padding: $gp;
                }

                &.active {
                    color: $color-green;
                }

                h3 {
                    margin: 0 $gp;
                }

                .value {
                    display: flex;
                    margin-left: auto;
                }
            }
        }

        h3 {
            margin: 0;
        }

        .share-link {
            max-width: 340px;
            margin: 0;
        }

        &.dark {
            background: $color-dark-gray;

            aside {
                background: #444;
                color: $color-gray;
            }

            main section {
                color: $color-gray;
            }
        }
    }
</style>
