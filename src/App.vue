<template>
    <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar>
            <nav-header />
        </md-app-toolbar>

        <md-app-drawer class="md-right" :md-active.sync="drawerActive" @md-closed="close">
            <settings-panel v-if="panelActive === 'settings'" />
            <game-panel v-if="panelActive === 'game'" :game-id="gameId" />
            <search-panel v-if="panelActive === 'search'" :list-id="listIndex" />
        </md-app-drawer>

        <md-app-content>
            <router-view />
        </md-app-content>
    </md-app>
</template>

<script>
import GamePanel from '@/components/GamePanel/GamePanel';
import SearchPanel from '@/components/SearchPanel/SearchPanel';
import NavHeader from '@/components/NavHeader/NavHeader';
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel';

export default {
    name: 'App',

    components: {
        NavHeader,
        GamePanel,
        SearchPanel,
        SettingsPanel,
    },

    data() {
        return {
            drawerActive: false,
            panelActive: null,
            gameId: null,
            listIndex: null,
        };
    },

    mounted() {
        this.$bus.$on('TOGGLE_DRAWER', ({ panelName, gameId, listIndex }) => {
            this.panelActive = panelName;
            this.gameId = gameId;
            this.listIndex = listIndex;
            this.drawerActive = !this.drawerActive;
        });
    },

    methods: {
        close() {
            this.panelActive = null;
            this.listIndex = 0;
            this.gameId = null;

            if (this.$route.name !== 'home') {
                this.$router.push({ name: 'home' });
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "~styles/variables.scss";
    @import "~vue-material/dist/theme/engine";
    @include md-register-theme("default", (
        primary: $nin-blue,
        accent: $nin-red,
        // theme: dark
    ));
    @import "~vue-material/dist/theme/all";

    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

    body {
        font-family: 'Roboto', sans-serif;
        background: url('/static/background-pattern.png');
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
        --md-theme-default-background: transparent;
    }

    .md-card {
        --md-theme-default-background: #{$nin-white};
    }

    .md-app {
        background: url('/static/background-pattern.png');
    }
</style>
