<template lang="html">
    <div>
        <game-board v-if="auth" />
        <marketing v-else />
    </div>
</template>

<script>
import Marketing from '@/pages/Marketing/Marketing';
import GameBoard from '@/pages/GameBoard/GameBoard';

export default {
    components: {
        Marketing,
        GameBoard,
    },

    computed: {
        auth() {
            return this.$store.getters.auth;
        },
    },
};
</script>
