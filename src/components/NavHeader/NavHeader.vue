<template lang="html">
    <header :class="{ dark }">
        <router-link :to="{ name: 'home' }" class="logo">
            <img src="@/assets/logo.png">
        </router-link>

        <settings-modal v-if="auth" />

        <div v-else>
            <router-link :to="{ name: 'register' }">
                Register
            </router-link>

            <router-link :to="{ name: 'login' }">
                Login
            </router-link>
        </div>
    </header>
</template>

<script>
import SettingsModal from '@/components/SettingsModal/SettingsModal';

export default {
    components: {
        SettingsModal,
    },

    data() {
        return {
            show: false,
            profile: null,
        };
    },

    computed: {
        auth() {
            return this.$store.getters.auth;
        },

        dark() {
            return this.user ? this.$store.state.user.settings.nightMode : false;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    header {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: $nin-red;
        padding: 0 12px;
        font-size: 12px;

        a, .md-icon {
            color: $nin-white !important;
        }

        a {
            margin-left: $gp / 2;

            &.logo {
                margin: 0;

                img {
                    height: 24px;
                }
            }
        }

        &.dark {
            background: $nin-black;

            .logo {
                opacity: 0.3;
            }
        }
    }
</style>
