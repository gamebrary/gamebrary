<template lang="html">
    <nav>
        <platforms-dropdown />

        <strong>gamebrary</strong>

        <div class="links">
            <template v-if="auth">
                <router-link tag="button" class="info" :to="{ name: 'admin' }" v-if="user.admin">
                    <i class="fas fa-screwdriver" />
                </router-link>

                <router-link tag="button" class="info" :to="{ name: 'settings' }">
                    <i class="fas fa-cog" />
                </router-link>
            </template>

            <template v-else>
                <router-link tag="button" class="info" :to="{ name: 'login' }">
                    Login
                </router-link>

                <router-link tag="button" class="primary" :to="{ name: 'register' }">
                    Register
                </router-link>
            </template>
        </div>
    </nav>
</template>

<script>
import PlatformsDropdown from '@/components/PlatformsDropdown/PlatformsDropdown';
import { mapGetters, mapState } from 'vuex';

export default {
    components: {
        PlatformsDropdown,
    },

    data() {
        return {
            msg: 'test',
        };
    },

    computed: {
        ...mapState(['user']),
        ...mapGetters(['auth']),
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
        justify-content: space-between;

        a {
            color: $color-white;
        }

        strong {
            color: $color-white;
            text-transform: uppercase;
            font-size: 18px;
        }
    }
</style>
