<template>
    <footer>
        <small>
            {{ $t('platforms.donateMessage') }}
            <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
                {{ $t('platforms.donating') }}
            </a>
            ,
            <a href="https://github.com/romancmx/gamebrary/issues" target="_blank">
                {{ $t('platforms.reportBugs') }}
            </a>
            {{$t('global.or')}}
            <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                {{ $t('platforms.submitFeedback') }}
            </a>
            .
        </small>

        <igdb-credit gray />
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
