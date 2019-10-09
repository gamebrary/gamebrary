<template lang="html">
    <nav>
        <router-link
            tag="button"
            class="logo"
            :to="{ name: logoRoute }"
        >
            <img src='/static/gamebrary-logo.png' />

            {{ title }}
        </router-link>

        <settings />
    </nav>
</template>

<script>
import Settings from '@/pages/Settings';
import { mapState } from 'vuex';

export default {
    components: {
        Settings,
    },

    computed: {
        ...mapState(['user', 'platform', 'settings']),

        isLoggedIn() {
            return this.user && this.user.email;
        },

        hasSettings() {
            return this.settings && this.user;
        },

        title() {
            if (this.$route.name === 'share-list') {
                return this.$route.query && this.$route.query.list
                    ? this.$route.query.list.split('-').join(' ')
                    : 'GAMEBRARY';
            }

            return this.$route.name === 'game-board' && this.platform
                ? this.platform.name
                : 'Gamebrary';
        },

        logoRoute() {
            if (this.$route.name === 'share-list') {
                return null;
            }

            if (this.$route.name === 'game-detail' && this.platform) {
                return 'game-board';
            }

            if (this.$route.name === 'settings' && this.platform) {
                return 'game-board';
            }

            if (this.$route.name === 'game-board') {
                return 'platforms';
            }

            return null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";
    nav {
        user-select: none;
        width: 100vw;
        height: $navHeight;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 $gp;
        color: var(--header-text-color);

        .logo {
            height: $navHeight;
            font-weight: bold;
            display: flex;
            align-items: center;
            margin-left: -$gp;
            text-transform: capitalize;

            img {
                height: 24px;
                margin-right: $gp / 4;
            }
        }
    }

    img.avatar {
        width: 30px;
        height: 30px;
        border-radius: $border-radius;

        @media($small) {
            width: 30px;
            height: 30px;
        }
    }
</style>

