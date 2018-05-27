<template lang="html">
    <div>
        <lists v-if="auth" />
        <marketing v-else />
    </div>
</template>

<script>
import Marketing from '@/pages/Marketing/Marketing';
import Lists from '@/pages/Lists/Lists';

export default {
    components: {
        Marketing,
        Lists,
    },

    computed: {
        auth() {
            return this.$store.getters.auth;
        },
    },
};
</script>
