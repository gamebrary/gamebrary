<template lang="html">
    <nav :class="{ dark: darkModeEnabled }">
        <button class="logo" v-if="isShareList">
            <img src='/static/gamebrary-logo.png' />
            GAMEBRARY
        </button>

        <router-link
            v-else
            tag="button"
            class="logo"
            :to="{ name: homeRoute }"
        >
            <img src='/static/gamebrary-logo.png' />
            GAMEBRARY
        </router-link>

        <div class="links" v-if="user">
            <modal title="Releases" large :show-close="false" padded>
                <button class="primary filled small">
                    <i class="fas fa-bullhorn" />
                    What's new
                </button>

                <releases slot="content" />
            </modal>
        </div>
    </nav>
</template>

<script>
import Releases from '@/components/Releases/Releases';
import Modal from '@/components/Modal/Modal';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        Releases,
        Modal,
    },

    computed: {
        ...mapState(['user', 'platform']),
        ...mapGetters(['darkModeEnabled']),

        isAuthRoute() {
            return this.$route.name === 'auth';
        },

        isShareList() {
            return this.$route.name === 'share-list';
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
        padding: 0 $gp;

        .logo {
            height: $navHeight;
            font-weight: bold;
            display: flex;
            align-items: center;
            margin-left: -$gp;

            img {
                height: 24px;
                margin-right: $gp / 4;
            }
        }

        &.dark {
            background: $color-darkest-gray;
            color: $color-gray !important;
        }

        .links {
            display: flex;
            align-items: center;
        }
    }
</style>

