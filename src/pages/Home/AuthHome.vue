<template lang="html">
    <div class="auth-home">
        <game-board v-if="platform" />
        <platforms v-else />
    </div>
</template>

<script>
import GameBoard from '@/pages/GameBoard/GameBoard';
import Platforms from '@/pages/Platforms/Platforms';
import { mapState } from 'vuex';

export default {
    components: {
        GameBoard,
        Platforms,
    },

    computed: {
        ...mapState(['platform']),
    },
};
</script>
