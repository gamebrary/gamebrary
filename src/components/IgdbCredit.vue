<template lang="html">
    <a :href="href" class="igdb-credit" target="_blank">
        <img :src="`/static/img/igdb-logo.svg`" />
        <strong>{{ $t('igdbCredit.poweredByIgdb') }}</strong>
    </a>
</template>

<script>
export default {
    props: {
        linkable: Boolean,
    },

    computed: {
        href() {
            return this.linkable
                ? 'https://www.igdb.com/'
                : null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .igdb-credit {
        color: #3eb87a;
        display: flex;
        align-items: center;
        text-decoration: none;
        font-size: 11px;

        img {
            height: 40px;
        }
    }
</style>
