<template lang="html">
    <div
        class="settings"
        v-if="user && localSettings" :class="{ dark: darkModeEnabled }"
    >
        <section>
            <h3>{{ $t('settings.title') }}</h3>
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

        <!-- <section>
            <i class="fas fa-language" />
            <h5>Language</h5>

            <div class="value">
                <button class="primary">🇬🇧</button>
                <button class="primary hollow">🇪🇸</button>
            </div>
        </section> -->

        <section>
            <i class="fas fa-moon" />
            <h5>{{ $t('settings.darkTheme') }}</h5>

            <toggle-switch
                id="nightMode"
                v-model="localSettings.nightMode"
            />
        </section>

        <section>
            <i class="far fa-envelope" />
            <h5>{{ $t('settings.newsletter') }}</h5>

            <toggle-switch
                id="newsletter"
                v-model="localSettings.newsletter"
            />
        </section>

        <section>
            <i class="fas fa-star-half-alt" />
            <h5>{{ $t('settings.ratings') }}</h5>

            <toggle-switch
                id="gameRatings"
                v-model="localSettings.showGameRatings"
            />
        </section>

        <section>
            <button class="hollow small info logout" @click="signOut">
                <i class="fas fa-sign-out-alt" />
                {{ $t('settings.signOut') }}
            </button>

            <button @click="promptDelete" class="error hollow small">
                <i class="fas fa-exclamation-triangle" />
                {{ $t('settings.deleteAccount') }}
            </button>
        </section>

        <section>
            <a href="https://www.paypal.me/RomanCervantes/5" class="link small" target="_blank">
                <i class="fas fa-donate" />
                {{ $t('settings.donate') }}
            </a>

            <a href="https://github.com/romancmx/gamebrary/issues" class="link small" target="_blank">
                <i class="fas fa-bug" />
                {{ $t('settings.reportBugs') }}
            </a>

            <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" class="link small" target="_blank">
                <i class="fas fa-comments" />
                {{ $t('settings.submitFeedback') }}
            </a>
        </section>

        <div class="copyright">
            <p>
                <i class="far fa-copyright" /> 2018 Gamebrary.
                <i class="fas fa-code" />
                {{ $t('global.with') }}
                <i class="fas fa-heart" /> {{ $t('global.by') }}
            <a href="https://twitter.com/romancm" target="_blank">@romancm</a></p>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Gravatar from 'vue-gravatar';
import Panel from '@/components/Panel/Panel';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { swal } from '@/shared/modals';
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
        ...mapGetters(['darkModeEnabled']),

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
                    db.collection('lists').doc(this.user.uid).delete()
                        .then(() => {
                            this.$bus.$emit('TOAST', { message: 'Account deleted' });
                            this.$store.commit('CLEAR_SESSION');
                            this.$router.push({ name: 'home' });
                        })
                        .catch(() => {
                            this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                        });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        signOut() {
            firebase.auth().signOut()
                .then(() => {
                    this.$store.commit('CLEAR_SESSION');
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    this.$bus.$emit('TOAST', { message: error, type: 'error' });
                });
        },

        save: debounce(
            // eslint-disable-next-line
            function() {
                db.collection('settings').doc(this.user.uid).set(this.localSettings, { merge: true })
                    .then(() => {
                        this.$store.commit('SET_SETTINGS', this.localSettings);
                        this.$bus.$emit('TOAST', { message: 'Settings saved' });
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', { message: 'There was an error saving your settings', type: 'error' });
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

            .toggle-switch, .value {
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
