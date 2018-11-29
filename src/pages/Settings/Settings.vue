<template lang="html">
    <div class="settings" v-if="user" :class="{ dark: settings && settings.nightMode }">
        <section>
            <h3>Settings</h3>
        </section>

        <section>
            <div class="profile">
                <gravatar :email="user.email" />

                <div class="info">
                    <strong>{{ user.displayName }}</strong>
                    {{ user.email }}
                </div>
            </div>
        </section>

        <section>
            <i class="fas fa-moon" />
            <h5>Dark theme</h5>

            <toggle-switch
                id="nightMode"
                v-model="localSettings.nightMode"
            />
        </section>

        <section>
            <i class="far fa-envelope" />
            <h5>Receive update emails</h5>

            <toggle-switch
                id="newsletter"
                v-model="localSettings.newsletter"
            />
        </section>

        <section>
            <i class="fas fa-star-half-alt" />
            <h5>Show Game Ratings</h5>

            <toggle-switch
                id="gameRatings"
                v-model="localSettings.showGameRatings"
            />
        </section>

        <section>
            <button class="hollow small info logout" @click="signOut">
                <i class="fas fa-sign-out-alt" />
                Sign out
            </button>

            <button @click="promptDelete" class="error hollow small">
                <i class="fas fa-exclamation-triangle" />
                Delete Account
            </button>
        </section>

        <section>
            <a href="https://www.paypal.me/RomanCervantes/5" class="link small" target="_blank">
                <i class="fas fa-donate" />
                Donate
            </a>

            <a href="https://github.com/romancmx/gamebrary/issues" class="link small" target="_blank">
                <i class="fas fa-bug" />
                Report bugs
            </a>

            <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" class="link small" target="_blank">
                <i class="fas fa-comments" />
                Submit feedback
            </a>
        </section>

        <div class="copyright">
            <p>
                <i class="far fa-copyright" /> 2018 Gamebrary.
                <i class="fas fa-code" /> with <i class="fas fa-heart" /> by
            <a href="https://twitter.com/romancm" target="_blank">@romancm</a></p>
        </div>
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
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { $success, $error, swal } from '@/shared/modals';
import moment from 'moment';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        Panel,
        ToggleSwitch,
        Gravatar,
    },

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
            swal({
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
                    $success('Settings deleted');

                    db.collection('lists').doc(this.user.uid).delete()
                        .then(() => {
                            $success('Game lists deleted');
                            $success('Account deleted');
                            this.logout();
                        })
                        .catch(() => {
                            $error('Authentication error');
                        });
                })
                .catch(() => {
                    $error('Authentication error');
                });
        },

        signOut() {
            firebase.auth().signOut()
                .then(() => {
                    this.$store.commit('CLEAR_SESSION');
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    $error(error);
                });
        },

        save: debounce(
            // eslint-disable-next-line
            function() {
                db.collection('settings').doc(this.user.uid).set(this.localSettings, { merge: true })
                    .then(() => {
                        this.$store.commit('SET_SETTINGS', this.localSettings);
                        $success('Settings saved');
                    })
                    .catch(() => {
                        $error('There was an error saving your settings');
                    });
            }, 500),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .settings {
        background: $color-white;
        color: $color-dark-gray;
        display: flex;
        align-items: center;
        flex-direction: column;
        min-height: calc(100vh - #{$navHeight});

        .profile {
            display: flex;
            align-items: center;

            .info {
                display: flex;
                flex-direction: column;
                margin-left: $gp;
                color: $color-dark-gray;
            }

            img {
                width: 40px;
                height: 40px;
                border-radius: 100%;
                border: 2px solid $color-white;
                box-shadow: 0 0 2px 0px $color-dark-gray;

                @media($small) {
                    width: 40px;
                    height: 40px;
                }
            }
        }

        section {
            width: 600px;
            margin: 0 auto;
            max-width: 100%;
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

            .toggle-switch {
                display: flex;
                margin-left: auto;
            }
        }

        .logout {
            margin-right: $gp;
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

    .copyright {
        text-align: center;
        margin-top: auto;
        padding: $gp;

        p {
            margin: $gp / 3 0;
        }

        a {
            color: $color-dark-gray;
            text-decoration: none;
            font-weight: bold;
        }
    }
</style>
