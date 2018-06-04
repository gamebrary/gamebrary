<template lang="html">
    <header :class="{ nightMode }">
        <router-link :to="{ name: 'home' }">
            <img src="@/assets/logo.png" class="logo">
        </router-link>

        <div class="menu">
            <template v-if="!auth">
                <router-link :to="{ name: 'register' }">
                    <md-button class="md-dense md-raised">Register</md-button>
                </router-link>

                <router-link :to="{ name: 'login' }">
                    <md-button class="md-dense md-raised">Login</md-button>
                </router-link>
            </template>

            <template v-else>
                <md-menu>
                    <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>menu</md-icon>
                    </md-button>

                    <md-menu-content>
                        <md-menu-item>
                            <router-link :to="{ name: 'profile' }"  v-if="auth">
                                <md-button class="md-dense md-primary">
                                    Settings
                                </md-button>
                            </router-link>
                        </md-menu-item>
                        <md-divider></md-divider>

                        <md-menu-item>
                            <md-button
                                class="md-dense md-raised md-accent"
                                @click="logout"
                            >
                                Log out
                            </md-button>
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>
            </template>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            searchText: '',
            show: false,
            profile: null,
        };
    },

    computed: {
        auth() {
            return this.$store.getters.auth;
        },

        user() {
            return this.$store.state.user;
        },

        nightMode() {
            return this.user ? this.$store.state.user.settings.nightMode : false;
        },
    },

    methods: {
        logout() {
            this.$store.commit('CLEAR_SESSION');
            this.$router.push({ name: 'home' });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    header {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: $nin-red;
        color: $nin-gray;
        padding: $gp;
    }

    .logo {
        display: inherit;
        height: 30px;
        width: auto;
        flex: 1;
    }

    .nightMode {
        background: $nin-black;

        .logo {
            opacity: 0.3;
        }

        .md-button {
            background: $nin-dk-gray !important;
        }
    }
</style>

