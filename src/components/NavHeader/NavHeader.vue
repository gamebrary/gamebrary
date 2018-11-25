<template lang="html">
    <nav :class="{ dark: settings && settings.nightMode }">
        <router-link
            tag="button"
            class="logo"
            :to="{ name: isHome ? 'platforms' : 'home' }"
        >
            GAMEBRARY
        </router-link>

        <button
            @click="showShareModal"
            v-if="showShareUrl"
            class="small share accent"
        >
            <i class="fas fa-share-alt" />
            Share
        </button>

        <slide width="300">
            <main>
                <section class="profile">
                    <gravatar :email="user.email" />

                    <div class="info">
                        <strong>{{ user.displayName }}</strong>
                        {{ user.email }}
                    </div>
                </section>

                <section class="actions">
                    <router-link :to="{ name: 'home' }">
                        <i class="fas fa-home" />
                        Home
                    </router-link>

                    <router-link :to="{ name: 'platforms' }" v-if="platform">
                        <i class="fas fa-exchange-alt" />
                        Change platform
                    </router-link>

                    <router-link :to="{ name: 'settings' }">
                        <i class="fas fa-cog" />
                        Settings
                    </router-link>

                    <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
                        <i class="fas fa-donate" />
                        Donate
                    </a>

                    <a href="https://github.com/romancmx/gamebrary/issues" target="_blank">
                        <i class="fas fa-bug" />
                        Report bugs
                    </a>

                    <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                        <i class="fas fa-comments" />
                        Submit feedback
                    </a>

                    <a @click="signOut">
                        <i class="fas fa-sign-out-alt" />
                        Sign out
                    </a>

                    <p>&copy; 2018 Gamebrary</p>
                </section>
            </main>
        </slide>
    </nav>
</template>

<script>
import Gravatar from 'vue-gravatar';
import firebase from 'firebase/app';
import 'firebase/auth';
import { swal, $error } from '@/shared/modals';
import { Slide } from 'vue-burger-menu';
import { mapState } from 'vuex';

export default {
    components: {
        Gravatar,
        Slide,
    },

    computed: {
        ...mapState(['user', 'platform', 'settings']),

        platformLogo() {
            return this.platform.useAlt
                ? `/static/img/platforms/${this.platform.code}-alt.svg`
                : `/static/img/platforms/${this.platform.code}.svg`;
        },

        isHome() {
            return this.$route.name === 'home';
        },

        showShareUrl() {
            return this.$route.name === 'home' && this.platform;
        },

        shareUrl() {
            const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';

            // eslint-disable-next-line
            return `${url}/#/s/${this.user.uid}/${this.platform.code}`;
        },
    },

    methods: {
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

        showShareModal() {
            swal({
                titleText: 'Share your list',
                html: 'Use the following URL to share this list.',
                input: 'url',
                inputValue: this.shareUrl,
                showConfirmButton: false,
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    nav {
        user-select: none;
        width: 100vw;
        height: $navHeight;
        display: flex;
        justify-content: center;
        background: $color-white;
        color: $color-dark-gray;

        .logo {
            height: $navHeight;
            font-weight: bold;
        }

        .share {
            position: fixed;
            top: $gp / 2;
            right: $gp / 2;
        }

        &.dark {
            background: $color-darkest-gray;
            color: $color-gray !important;

            .actions {
                a {
                    color: $color-gray;
                }
            }

            .profile {
                background: $color-darkest-gray;

                .info {
                    color: $color-gray;
                }
            }
        }
    }

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

    main {
        height: 100vh;
        border-right: 2px solid $color-light-gray;
        display: flex;
        flex-direction: column;

        a {
            color: $color-dark-gray;
            grid-template-columns: 40px auto;
            margin-bottom: $gp / 2;
            display: grid;
            align-items: center;
            text-decoration: none;
        }

        i, img {
            width: 40px;
            height: 40px;
            text-align: center;
            justify-content: center;
            align-items: center;
            display: flex;
        }
    }

    .bm-overlay {
        nav > div {
            background: #0008;
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 3;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    .swal2-input {
        font-size: 10px !important;
    }
</style>
