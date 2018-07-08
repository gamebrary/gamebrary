<template>
    <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar>
            <nav-header />
        </md-app-toolbar>

        <md-app-drawer  class="md-right" :md-active.sync="showDrawer">
            <settings-panel />
        </md-app-drawer>

        <md-app-content>
            <router-view />
            <game-modal />
            <search-modal />
        </md-app-content>
    </md-app>
</template>

<script>
import GameModal from '@/components/GameModal/GameModal';
import SearchModal from '@/components/SearchModal/SearchModal';
import NavHeader from '@/components/NavHeader/NavHeader';
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel';

export default {
    name: 'App',

    components: {
        NavHeader,
        GameModal,
        SearchModal,
        SettingsPanel,
    },

    data() {
        return {
            showDrawer: false,
        };
    },

    mounted() {
        this.$bus.$on('TOGGLE_DRAWER', () => {
            this.showDrawer = !this.showDrawer;
        });
    },
};
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "~styles/variables.scss";
    @import "~vue-material/dist/theme/engine";
    @include md-register-theme("default", (primary: $nin-gray, accent: $nin-red));
    @import "~vue-material/dist/theme/all";

    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

    body {
        font-family: 'Roboto', sans-serif;
        // background: url('/static/switch-pattern-sm.png');
    }

    .md-toolbar {
        --md-theme-default-toolbarvariant: #{$nin-red};
        min-height: 36px;
        height: 48px;

        .md-toolbar-row {
            min-height: 48px;
        }
    }

    .md-content {
        padding: 0;
        height: calc(100vh - 48px);
    }

    .logo {
        margin: 0;

        img {
            height: 24px;
        }
    }
</style>
