<template lang="html">
    <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
            <md-button class="md-icon-button md-accent md-raised" @click="goHome">
                <md-icon>home</md-icon>
            </md-button>
        </div>

        <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-accent md-raised" @click="showDrawer" v-if="auth">
                <md-icon>settings</md-icon>
            </md-button>

            <template v-else>
                <md-button class="md-accent md-raised" v-if="showRegister" @click="goRegister">
                    Register
                </md-button>

                <md-button class="md-accent md-raised" v-if="showLogin" @click="goLogin">
                    Login
                </md-button>
            </template>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['auth']),

        dark() {
            return this.user ? this.$store.state.user.settings.nightMode : false;
        },

        showRegister() {
            return this.$route.name !== 'register';
        },

        showLogin() {
            return this.$route.name !== 'login';
        },
    },

    methods: {
        showDrawer() {
            this.$bus.$emit('TOGGLE_DRAWER', { panelName: 'settings' });
        },

        goHome() {
            this.$router.push({ name: 'home' });
        },

        goRegister() {
            this.$router.push({ name: 'register' });
        },

        goLogin() {
            this.$router.push({ name: 'login' });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .md-button.md-raised:not([disabled]) {
        box-shadow: none;
    }
</style>
