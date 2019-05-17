<template lang="html">
    <a :href="href" class="igdb-credit" target="_blank" :class="{ gray }">
        <img :src="`/static/img/igdb-logo${logo}.svg`" />
        <strong>{{ $t('igdbCredit.poweredBy') }}</strong>
    </a>
</template>

<script>
export default {
    props: {
        gray: Boolean,
        linkable: Boolean,
    },

    computed: {
        logo() {
            return this.gray
                ? '-gray'
                : '';
        },

        href() {
            return this.linkable
                ? 'https://www.igdb.com/'
                : null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .igdb-credit {
        color: $color-igdb-green;
        display: flex;
        align-items: center;
        text-decoration: none;
        font-size: 11px;

        &.gray {
            color: $color-dark-gray;
        }

        img {
            height: 40px;
        }
    }
</style>
