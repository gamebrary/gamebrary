<template lang="html">
    <div>
        notepage

        <pre>{{ noteId }}</pre>
        <pre>{{ note }}</pre>
    </div>
</template>
<script>
export default {
    data() {
        return {
            note: {},
        }
    },

    mounted() {
        this.loadNote();
    },

    computed: {
        noteId() {
            return this.$route.params.id;
        },
    },

    methods: {
        async loadNote() {
            this.note = await this.$store.dispatch('LOAD_NOTE', this.noteId);
        },
    }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    
</style>