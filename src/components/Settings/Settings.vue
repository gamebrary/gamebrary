<template lang="html">
    <div
        class="settings"
        :class="{ dark: darkModeEnabled }"
    >
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

        <section v-if="hasLists">
            <i class="fas fa-user-check" />
            <h5>Show only my lists</h5>

            <toggle-switch
                id="ownedListsOnly"
                v-model="localSettings.ownedListsOnly"
            />
        </section>

        <section>
            <i class="fas fa-sort-alpha-down" />
            <h5>Sort platforms alphabetically</h5>

            <toggle-switch
                id="sortListsAlphabetically"
                v-model="localSettings.sortListsAlphabetically"
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

        <footer>
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
        ...mapState(['user', 'gameLists', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        hasLists() {
            return Object.keys(this.gameLists).length > 0;
        },

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
        flex-direction: column;

        &.dark {
            color: $color-gray;

            footer {
                border-top: 1px solid $color-dark-gray;
            }
        }
    }

    section {
        padding: $gp;
        display: flex;
        align-items: center;

        &.active {
            color: $color-green;
        }

        h5 {
            margin: 0 $gp / 2;
        }

        .toggle-switch, .value {
            display: flex;
            margin-left: auto;
        }
    }

    footer {
        border-top: 1px solid $color-light-gray;
        display: grid;
        grid-gap: $gp / 2;
        padding: $gp;
        grid-template-columns: 1fr 1fr;
    }
</style>
