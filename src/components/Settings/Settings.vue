<template lang="html">
    <div
        class="settings"
        :class="{ dark: darkModeEnabled }"
    >
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
                v-model="localSettings.hideGameRatings"
            />
        </section>

        <section class="actions">
            <button class="small info hollow" @click="signOut">
                <i class="fas fa-sign-out-alt" />
                {{ $t('settings.signOut') }}
            </button>

            <modal
                message="Your account data will be deleted forever."
                title="Are you sure?"
                :action-text="$t('settings.deleteAccount')"
                @action="deleteAccount"
            >
                <button class="small error">
                    <i class="fas fa-exclamation-triangle" />
                    {{ $t('settings.deleteAccount') }}
                </button>
            </modal>
        </section>

        <section>
            <small>
                Gamebrary is free and open source, consider helping its development by
                <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
                    {{ $t('settings.donate') }}
                </a>
                ,
                <a href="https://github.com/romancmx/gamebrary/issues" target="_blank">
                    {{ $t('settings.reportBugs') }}
                </a>
                or
                <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                    {{ $t('settings.submitFeedback') }}
                </a>
                .
            </small>
        </section>


        <footer>
            <small>
                <i class="far fa-copyright" /> 2018 Gamebrary.
                <i class="fas fa-code" />
                {{ $t('global.with') }}
                <i class="fas fa-heart" /> {{ $t('global.by') }}
                <a href="https://twitter.com/romancm" target="_blank">@romancm</a>
            </small>

            <igdb-credit />
        </footer>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Gravatar from 'vue-gravatar';
import Panel from '@/components/Panel/Panel';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import IgdbCredit from '@/components/IgdbCredit/IgdbCredit';
import Modal from '@/components/Modal/Modal';
import moment from 'moment';

export default {
    components: {
        Panel,
        ToggleSwitch,
        IgdbCredit,
        Modal,
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

        exitUrl() {
            return process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';
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

        deleteAccount() {
            const db = firebase.firestore();

            db.collection('settings').doc(this.user.uid).delete()
                .then(() => {
                    db.collection('lists').doc(this.user.uid).delete()
                        .then(() => {
                            this.$bus.$emit('TOAST', { message: 'Account deleted' });
                            this.exit();
                        })
                        .catch(() => {
                            this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                        });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        exit() {
            this.$store.commit('CLEAR_SESSION');
            window.location.href = this.exitUrl;
        },

        signOut() {
            firebase.auth().signOut()
                .then(() => {
                    this.exit();
                })
                .catch((error) => {
                    this.$bus.$emit('TOAST', { message: error, type: 'error' });
                });
        },

        save() {
            this.$bus.$emit('SAVE_SETTINGS', this.localSettings);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .settings {
        color: $color-dark-gray;
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: $gp -$gp 0 -$gp;

        .profile {
            display: flex;
            align-items: center;

            .info {
                display: flex;
                flex-direction: column;
                margin-left: $gp;
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
            border-bottom: 1px solid $color-light-gray;
            padding: $gp;
            display: flex;
            align-items: center;

            &.actions {
                display: grid;
                grid-gap: $gp;
                grid-template-columns: 1fr 1fr;
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

        .share-link {
            max-width: 340px;
            margin: 0;
        }

        &.dark {
            section, footer {
                color: $color-gray;
            }

            section {
                border-bottom: 1px solid $color-dark-gray;
            }
        }
    }

    footer {
        display: flex;
        align-items: center;
        flex-direction: column;

        small {
            margin-top: $gp / 2;
        }
    }
</style>
