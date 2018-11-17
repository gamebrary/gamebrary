<template lang="html">
    <nav :class="{ dark: settings && settings.nightMode }">
        <slide width="300">
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
        </slide>

        <router-link tag="button" class="logo" :to="{ name: 'home' }">
            GAMEBRARY
        </router-link>
    </nav>
</template>

<script>
import Gravatar from 'vue-gravatar';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Slide } from 'vue-burger-menu';
import { mapState } from 'vuex';

export default {
    components: {
        Gravatar,
        Slide,
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
        height: $navHeight;
        display: flex;
        justify-content: center;
        background: $color-white;
        color: $color-dark-gray;

        .logo {
            height: $navHeight;
            font-weight: bold;
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

    .profile {
        display: flex;
        align-items: center;
        background: $color-white;

        .info {
            display: flex;
            flex-direction: column;
            margin-left: $gp;
            color: $color-dark-gray;
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
    }

    .actions {
        display: flex;
        flex-direction: column;

        section {
            width: 100%;
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
</style>
