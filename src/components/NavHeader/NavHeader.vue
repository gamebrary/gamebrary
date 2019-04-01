<template lang="html">
    <nav :class="{ dark: darkModeEnabled }">
        <router-link
            tag="button"
            class="logo"
            :to="{ name: homeRoute }"
        >
            <img src='/static/gamebrary-logo.png' />

            {{ title }}
        </router-link>

        <modal popover>
            <gravatar :email="user.email" class="avatar" v-if="user && user.email" />

            <settings slot="content" v-if="settings && user" />
        </modal>
    </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Modal from '@/components/Modal/Modal';
import Settings from '@/components/Settings/Settings';
import Gravatar from 'vue-gravatar';

export default {
    components: {
        Gravatar,
        Settings,
        Modal,
    },

    computed: {
        ...mapState(['user', 'platform', 'settings']),
        ...mapGetters(['darkModeEnabled']),

        title() {
            if (this.$route.name === 'share-list') {
                return this.$route.query && this.$route.query.list
                    ? this.$route.query.list.split('-').join(' ')
                    : 'GAMEBRARY';
            }

            return this.$route.name === 'game-board' && this.platform
                ? this.platform.name
                : 'GAMEBRARY';
        },

        homeRoute() {
            if (this.$route.name === 'share-list') {
                return null;
            }

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

