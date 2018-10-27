<template lang="html">
    <nav :style="navStyle">
        <span v-if="platform">
            <router-link :to="{ name: 'home' }" tag="button">
                <i class="fas fa-home" />
            </router-link>

            <router-link :to="{ name: 'platforms' }" tag="button" class="small">
                {{ platform.name }}
            </router-link>
        </span>

        <router-link :to="{ name: 'home' }" v-else tag="button">
            GAMEBRARY
        </router-link>

        <router-link
            v-if="user"
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
        ...mapState(['user', 'platform']),

        navStyle() {
            return this.platform ? {
                'background-color': this.platform.hex || '#555',
                color: this.platform.textHex || '#fff',
            } : '';
        },

        isHome() {
            return this.$route.name === 'home';
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

        .logo {
            font-size: 18px;
            font-weight: bold;
        }

        .small {
            padding: 0;
        }
    }
</style>
