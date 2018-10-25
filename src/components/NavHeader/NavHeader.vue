<template lang="html">
    <nav :class="{ 'logged-in': user}">
        <div>
            <router-link :to="{ name: 'home' }" class="logo">
                GAMEBRARY
            </router-link>
        </div>

        <div class="settings" v-if="user">
            <div v-if="platform">
                <span class="platform-name">
                    {{ platform.name }}
                </span>

                <router-link
                    tag="button"
                    class="info"
                    :to="{ name: 'platforms' }"
                >
                    <i class="fas fa-exchange-alt" />
                </router-link>
            </div>

            <router-link
                tag="button"
                class="info"
                :to="{ name: 'settings' }"
            >
                <i class="fas fa-cog" />
            </router-link>
        </div>
    </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['user', 'platform']),

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
        padding-right: 4px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: $color-white;

        &.logged-in {
            justify-content: space-between;
        }

        .platform-name {
            color: $color-light-gray;
            cursor: default;
        }

        a {
            color: $color-white;
            text-decoration: none;

            &.logo {
                padding: 0 0 0 $gp;
                text-transform: uppercase;
                font-size: 18px;
                font-weight: bold;
            }
        }

        .settings {
            display: flex;
            align-items: center;
        }
    }
</style>
