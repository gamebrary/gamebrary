<template lang="html">
    <div class="releases-placeholder">
        <div class="release" v-for="n in 3" :key="n">
            <div class="release-info">
                <button class="link info small hollow" disabled />

                <placeholder :lines="2" />
            </div>

            <placeholder :lines="3" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Placeholder from '@/components/Placeholder/Placeholder';

export default {
    components: {
        Placeholder,
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .release {
        border-bottom: 1px solid $color-light-gray;
        margin: $gp 0;
        padding-bottom: $gp / 2;
    }

    .release-info {
        display: grid;
        grid-template-columns: 50px 30%;
        grid-gap: $gp;
    }
</style>
