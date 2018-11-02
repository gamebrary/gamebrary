<template lang="html">
    <nav :style="navStyle" :class="{ dark: settings.nightMode }" v-if="user">
        <router-link
            :to="{ name: 'platforms' }"
            tag="button"
            v-if="platform && routeName === 'home'"
        >
            {{ platform.name }}
        </router-link>

        <router-link
            :to="{ name: 'home' }"
            tag="button"
            v-else-if="routeName === 'game-detail' || routeName === 'settings'"
        >
            <i class="fas fa-chevron-left" />
        </router-link>

        <router-link
            :to="{ name: 'home' }"
            tag="button"
            v-else
        >
            <i class="fas fa-chevron-left" v-if="platform" />
        </router-link>

        <router-link
            v-if="routeName !== 'settings'"
            :to="{ name: 'settings' }" tag="button"
        >
            <i class="fas fa-cog" />
        </router-link>
    </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['user', 'platform', 'settings']),

        navStyle() {
            return this.platform ? {
                'background-color': this.platform.hex || '#555',
                color: this.platform.textHex || '#fff',
            } : '';
        },

        routeName() {
            return this.$route.name;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    nav {
        height: $navHeight;
        width: 100%;
        background: $color-dark-gray;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $color-white;
        transition: all 300ms ease;

        &.dark {
            background: #333 !important;
            color: $color-gray !important;
        }

        .logo {
            font-size: 18px;
            font-weight: bold;
        }

        .small {
            padding: 0;
        }
    }
</style>
