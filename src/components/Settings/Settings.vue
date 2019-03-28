<template lang="html">
    <div
        class="settings"
        :class="{ dark: darkModeEnabled }"
    >
        <!-- <section>
            <div class="profile">
                <gravatar :email="user.email" />

                <div class="info">
                    <strong>{{ user.displayName }}</strong>
                    {{ user.email }}
                </div>
            </div>
        </section> -->

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
            <button class="small tiny accent hollow" @click="signOut">
                <i class="fas fa-sign-out-alt" />
                {{ $t('settings.signOut') }}
            </button>

            <modal
                message="Your account data will be deleted forever."
                title="Are you sure?"
                :action-text="$t('settings.deleteAccount')"
                @action="deleteAccount"
            >
                <button class="small tiny error hollow">
                    <i class="fas fa-exclamation-triangle" />
                    {{ $t('settings.deleteAccount') }}
                </button>
            </modal>
        </section>
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
import ListOptions from '@/components/Lists/ListOptions';

export default {
    components: {
        ListOptions,
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

        isGameBoard() {
            return this.$route.name === 'game-board';
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
            padding: $gp;
            display: flex;
            align-items: center;

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

        .actions {
            border-top: 1px solid $color-light-gray;
            display: grid;
            grid-gap: $gp / 2;
            padding-bottom: 0;
            grid-template-columns: 1fr 1fr;
        }

        .share-link {
            max-width: 340px;
            margin: 0;
        }

        &.dark {
            section, footer {
                color: $color-gray;
            }

            .actions {
                border-top: 1px solid $color-gray;
            }
        }
    }
</style>
