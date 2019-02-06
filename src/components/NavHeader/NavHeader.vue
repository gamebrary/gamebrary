<template lang="html">
    <nav :class="{ dark: darkModeEnabled }">
        <router-link
            tag="button"
            class="logo"
            :to="{ name: homeRoute }"
        >
            <img src='/static/gamebrary-logo.png' />
            GAMEBRARY
        </router-link>

        <modal
            title="Settings"
            :show-close="false"
            v-if="user"
        >
            <button>
                <i class="fas fa-cog" />
            </button>

            <settings slot="content" v-if="settings" />
        </modal>
    </nav>
</template>

<script>
import Settings from '@/components/Settings/Settings';
import Modal from '@/components/Modal/Modal';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        Settings,
        Modal,
    },

    computed: {
        ...mapState(['user', 'platform', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        isAuthRoute() {
            return this.$route.name === 'auth';
        },

        homeRoute() {
            if (this.$route.name === 'game-detail' && this.platform) {
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

