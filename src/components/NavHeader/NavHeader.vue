<template lang="html">
    <header>
        <router-link :to="{ name: 'home' }">
            <img src="@/assets/logo.png" class="logo">
        </router-link>

        <div class="menu">
            <router-link :to="{ name: 'profile' }"  v-if="auth">
                <at-button type="primary" hollow circle icon="icon-user">
                    settings
                </at-button>
            </router-link>

            <router-link :to="{ name: 'login' }"  v-if="!auth">
                <at-button type="primary" hollow circle icon="icon-log-in">
                    Login
                </at-button>
            </router-link>

            <at-button type="primary" hollow circle icon="icon-log-in" v-if="auth" @click="logout">
                Log out
            </at-button>

            <router-link :to="{ name: 'register' }"  v-if="!auth">
                <at-button type="primary" hollow circle icon="icon-user-plus">
                    Register
                </at-button>
            </router-link>
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

    .menu {
    }

    .at-btn {
        margin-left: $gp;
        color: $nin-white;
        border-color: $nin-white;
    }
</style>

