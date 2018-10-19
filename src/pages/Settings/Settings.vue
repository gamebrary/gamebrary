<template lang="html">
    <div class="settings">
        <aside>
            <gravatar :email="user.email" />

            <div>
                <p><strong>App ID:</strong> {{ user._id }}</p>
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
                    <input type="checkbox" id="nightMode" v-model="settings.nightMode" />
                    <label for="nightMode" />
                </span>
            </section>

            <section>
                <i class="fas fa-star-half-alt" />
                <h3>Show Game Ratings</h3>

                <span class="toggle-switch value">
                    <input type="checkbox" id="gameRatings" v-model="settings.showGameRatings" />
                    <label for="gameRatings" />
                </span>
            </section>

            <!-- <section>
                <i class="fas fa-th-large" />
                <h3>Game Card Layout</h3>

                <div class="value">
                    <button
                        :class="{ primary: settings.gameView === 'cover'}"
                        @click="setGameView('cover')"
                    >
                        <i class="fas fa-portrait" />
                        Game cover only
                    </button>

                    <button
                        :class="{ primary: settings.gameView === 'detailed' || !settings.gameView}"
                        @click="setGameView('detailed')"
                    >
                        <i class="far fa-id-card" />
                        Detailed view
                    </button>
                </div>
            </section> -->

            <panel class="positive">
                <p>
                    <i class="fas fa-comments" />
                    Have ideas, requests, feedback?
                </p>

                <a class="link accent small" href="https://goo.gl/forms/r0juBCsZaUtJ03qb2">
                    Submit feedback
                </a>
            </panel>

            <panel class="info">
                <p>
                    <i class="fas fa-bug" />
                    Found a bug?
                </p>

                <a class="link accent small" href="https://github.com/romancmx/gamebrary/issues">
                    Report it in GitHub
                </a>
            </panel>
        </main>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex';
import Gravatar from 'vue-gravatar';
import Panel from '@/components/Panel/Panel';
import toasts from '@/mixins/toasts';
import moment from 'moment';

export default {
    components: {
        Panel,
        Gravatar,
    },

    mixins: [toasts],

    data() {
        return {
            settings: {},
        };
    },

    computed: {
        ...mapState(['user']),

        dateJoined() {
            return moment(this.user.dateJoined).format('LL');
        },

        shareUrl() {
            const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';

            // eslint-disable-next-line
            return `${url}/#/share/${this.user._id}`;
        },
    },

    watch: {
        settings: {
            handler(oldValue, newValue) {
                if (Object.keys(newValue).length) {
                    this.save();
                }
            },
            deep: true,
        },
    },

    mounted() {
        this.settings = this.user.settings
            ? JSON.parse(JSON.stringify(this.user.settings))
            : {};
    },

    methods: {
        setGameView(view) {
            this.settings.gameView = view;
            this.save();
        },

        promptDelete() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your account data will be deleted forever.',
                // type: 'warning',
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
            this.$store.commit('CLEAR_SESSION');
            this.$router.push({ name: 'home' });
        },

        deleteAccount() {
            this.$store.dispatch('DELETE_USER')
                .then(() => {
                    this.$swal({
                        position: 'bottom-end',
                        title: 'Account deleted',
                        type: 'success',
                        toast: true,
                        showConfirmButton: false,
                        timer: 1500,
                    });

                    this.logout();
                });
        },

        save: debounce(
            // eslint-disable-next-line
            function() {
                this.$store.dispatch('UPDATE_SETTINGS', this.settings)
                    .then(() => {
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
            grid-template-columns: auto;
        }

        aside {
            padding: $gp;
            background: $color-light-gray;
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

        .panel {
            width: 46%;
            float: left;

            @media ($small) {
                width: 90%;
            }
        }

        .share-link {
            max-width: 340px;
            margin: 0;
        }
    }
</style>
