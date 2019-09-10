<template lang="html">
    <nav :class="{ dark: darkModeEnabled }">
        <router-link
            tag="button"
            class="logo"
            :to="{ name: logoRoute }"
        >
            <img src='/static/gamebrary-logo.png' />

            {{ title }}
        </router-link>

        <modal large title="Settings">
            <button class="small info">
                <i class="fas fa-cog" />
            </button>

            <settings slot="content" />
        </modal>

    </nav>
</template>

<script>
import Settings from '@/pages/Settings';
import Modal from '@/components/Modal';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        Modal,
        Settings,
    },

    computed: {
        ...mapState(['user', 'platform', 'settings']),
        ...mapGetters(['darkModeEnabled']),

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
        color: $color-darkest-gray;

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

        &.dark {
            color: $color-gray !important;
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

