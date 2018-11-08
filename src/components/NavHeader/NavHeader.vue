<template lang="html">
    <nav :class="{ open, dark: settings && settings.nightMode }">
        <button @click="toggleMenu" class="logo">
            GAMEBRARY
            <i class="fas fa-angle-up" v-if="open" />
            <i class="fas fa-angle-down" v-else />
        </button>

        <div class="menu" :class="{ open }" @click="toggleMenu">
            <div class="profile">
                <gravatar :email="user.email" />

                <div class="info">
                    <strong>{{ user.displayName }}</strong>
                    {{ user.email }}
                </div>
            </div>

            <div class="actions">
                <section>
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
                </section>

                <section>
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
                </section>

                <section>
                    <a @click="signOut">
                        <i class="fas fa-sign-out-alt" />
                        Sign out
                    </a>
                </section>
            </div>

            <p>&copy; 2018 Gamebrary</p>
        </div>
    </nav>
</template>

<script>
import Gravatar from 'vue-gravatar';
import firebase from 'firebase/app';
import 'firebase/auth';
import { mapState } from 'vuex';

export default {
    components: {
        Gravatar,
    },

    data() {
        return {
            open: false,
        };
    },
    computed: {
        ...mapState(['user', 'platform', 'settings']),

        routeName() {
            return this.$route.name;
        },

        platformLogo() {
            return this.platform.useAlt
                ? `/static/img/platforms/${this.platform.code}-alt.svg`
                : `/static/img/platforms/${this.platform.code}.svg`;
        },
    },

    methods: {
        toggleMenu() {
            this.open = !this.open;
        },

        signOut() {
            firebase.auth().signOut()
                .then(() => {
                    this.$store.commit('CLEAR_SESSION');
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    this.$error(error);
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    nav {
        user-select: none;
        position: fixed;
        z-index: 1;
        width: 100vw;
        min-height: $navHeight;
        max-height: $navHeight;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all 300ms ease-out;
        background: rgba(255, 255, 255, 0.98);
        color: $color-dark-gray;

        &.open {
            transition: all 300ms ease-out;
            top: 0;
            width: 100vw;
            min-height: 100vh;
            max-height: auto;
            overflow: visible;
        }

        .logo {
            height: $navHeight;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-weight: bold;

            i {
                margin: 0 $gp / 2;
                color: $color-gray;
            }
        }

        .profile {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: $gp;
            padding: $gp;

            .info {
                display: flex;
                flex-direction: column;
                margin-left: $gp;
            }

            img {
                width: 60px;
                height: 60px;
                border-radius: 100%;
                border: 2px solid $color-white;
                box-shadow: 0 0 2px 0px $color-dark-gray;

                @media($small) {
                    width: 40px;
                    height: 40px;
                }
            }

            h2, h3 {
                margin: 0;
            }
        }

        .menu {
            opacity: 0;
            transition: all 300ms ease-out;
            width: 100vw;
            height: 0;
            color: $color-gray;
            display: flex;
            align-items: center;
            flex-direction: column;

            &.open {
                height: calc(100vh - #{$navHeight});
                opacity: 1;
                width: 100vw;
            }
        }

        .actions {
            section {
                border-bottom: 1px solid $color-light-gray;
                margin-bottom: $gp;
            }

            a {
                color: $color-dark-gray;
                grid-template-columns: 50px auto;
                grid-gap: $gp;
                margin-bottom: $gp;
                display: grid;
                align-items: center;
                text-decoration: none;
                font-weight: bold;

                @media($small) {
                    margin-bottom: $gp / 2;
                }
            }

            i, img {
                width: 50px;
                height: 50px;
                padding: $gp / 2;
                border-radius: 100%;
                text-align: center;
                justify-content: center;
                align-items: center;
                display: flex;
                align-items: center;
                background: $color-gray;
                border: 2px solid $color-white;
                box-shadow: 0 0 2px 0px $color-dark-gray;
                color: $color-white;

                @media($small) {
                    width: 40px;
                    height: 40px;
                }
            }
        }

        &.dark {
            background: $color-darkest-gray;
            color: $color-gray !important;

            .actions {
                section {
                    border-bottom: 1px solid $color-dark-gray;
                }

                a {
                    color: $color-gray;
                }

                i, img {
                    background: $color-dark-gray;
                    border: 2px solid $color-gray;
                }
            }
        }
    }
</style>
