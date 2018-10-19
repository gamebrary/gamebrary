<template lang="html">
    <main>
        <public-home v-if="!auth" />
        <game-board v-if="auth" />
        <!-- <game-board v-if="auth && platform" /> -->
        <!-- <platforms v-else /> -->
    </main>
</template>

<script>
import PublicHome from '@/pages/Home/PublicHome';
import GameBoard from '@/pages/GameBoard/GameBoard';
import Platforms from '@/pages/Platforms/Platforms';
import { mapGetters, mapState } from 'vuex';

export default {
    components: {
        PublicHome,
        GameBoard,
        Platforms,
    },

    computed: {
        ...mapState(['platform', 'user']),
        ...mapGetters(['auth']),

        hasPlatforms() {
            return this.user.platforms.length > 0 || this.platform;
        },
    },

    watch: {
        platform(value) {
            // eslint-disable-next-line
            console.log('reload game board!');
            // eslint-disable-next-line
            console.log(value);
        },
    },
};
</script>
