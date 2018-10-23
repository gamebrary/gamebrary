<template lang="html">
    <nav :class="{ 'logged-in': user}">
        <router-link :to="{ name: 'home' }" v-if="!platform">
            GAMEBRARY
        </router-link>

        <div class="settings">
            <platforms-dropdown />

            <router-link
                tag="button"
                class="info"
                :to="{ name: 'settings' }"
                v-if="user"
            >
                <i class="fas fa-cog" />
            </router-link>
        </div>
    </nav>
</template>

<script>
import PlatformsDropdown from '@/components/PlatformsDropdown/PlatformsDropdown';
import { mapState } from 'vuex';

export default {
    components: {
        PlatformsDropdown,
    },

    computed: {
        ...mapState(['user']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    nav {
        height: $navHeight;
        width: 100%;
        background: $color-dark-gray;
        padding-right: 4px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        &.logged-in {
            justify-content: space-between;
        }

        a {
            color: $color-white;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 0 $gp;
            text-decoration: none;
        }

        .settings {
            display: flex;
        }
    }
</style>
