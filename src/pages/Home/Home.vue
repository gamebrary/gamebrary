<template lang="html">
    <main>
        <public-home v-if="!user" />
        <auth-home v-else />
    </main>
</template>

<script>
import PublicHome from '@/pages/Home/PublicHome';
import AuthHome from '@/pages/Home/AuthHome';
import { mapState } from 'vuex';

export default {
    components: {
        PublicHome,
        AuthHome,
    },

    computed: {
        ...mapState(['user']),
    },
};
</script>
