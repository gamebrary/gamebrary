<template lang="html">
    <div>
        <h1>Session has expired</h1>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$store.commit('CLEAR_SESSION');
    },
};
</script>
