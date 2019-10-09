<template>
    <footer>
        <small>
            {{ $t('platforms.donateMessage') }}
            <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
                {{ $t('platforms.donating') }}
            </a>
            ,
            <a href="https://github.com/romancm/gamebrary/issues" target="_blank">
                {{ $t('platforms.reportBugs') }}
            </a>
            {{$t('global.or')}}
            <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                {{ $t('platforms.submitFeedback') }}
            </a>
            .
        </small>

        <igdb-credit />
    </footer>
</template>

<script>
import IgdbCredit from '@/components/IgdbCredit';

export default {
    components: {
        IgdbCredit,
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    footer {
        padding: $gp / 2 0;
        justify-content: center;
        display: flex;
        align-items: center;
        color: var(--header-text-color);
    }
</style>
