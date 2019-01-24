<template lang="html">
    <nav :class="{ dark: darkModeEnabled }">
        <router-link
            tag="button"
            class="logo"
            :to="{ name: homeRoute }"
            v-if="!isAuthRoute"
        >
            <img src='/static/gamebrary-logo.png' />
            GAMEBRARY
        </router-link>

        <router-link
            v-if="showSettings"
            tag="button"
            :to="{ name: 'settings' }"
        >
            <i class="fas fa-cog" />
        </router-link>
    </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapState(['user', 'platform']),
        ...mapGetters(['darkModeEnabled']),

        showSettings() {
            return this.$route.name !== 'settings' && this.user;
        },

        isAuthRoute() {
            return this.$route.name === 'auth';
        },

        homeRoute() {
            return this.$route.name === 'settings' && this.platform
                ? 'game-board'
                : 'platforms';
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
        justify-content: space-between;
        align-items: center;
        background: $color-white;

        .logo {
            height: $navHeight;
            font-weight: bold;
            display: flex;
            align-items: center;

            img {
                height: 24px;
                margin-right: $gp / 4;
            }
        }

        &.dark {
            background: $color-darkest-gray;
            color: $color-gray !important;
        }
    }
</style>

