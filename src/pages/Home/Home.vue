<template lang="html">
    <div>
        <game-board v-if="auth" />
        <marketing v-else />
    </div>
</template>

<script>
import Marketing from '@/pages/Marketing/Marketing';
import GameBoard from '@/pages/GameBoard/GameBoard';
import { mapGetters } from 'vuex';

export default {
    components: {
        Marketing,
        GameBoard,
    },

    computed: {
        ...mapGetters(['auth']),
    },
};
</script>
