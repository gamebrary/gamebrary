<template lang="html">
    <section class="setting-box">
        <h3>General</h3>
        <div class="reloading" v-if="reloading">
            <i class="fas fa-sync-alt fast-spin" />
            <br>
            {{ $t('settings.reloading') }}
        </div>

        <div class="setting">
            <i class="fas fa-language" />
            <h5>{{ $t('settings.language') }}</h5>

            <select v-model="value.language">
                <option value="en">🇺🇸 {{ $t('settings.languages.en') }}</option>
                <option value="es">🇪🇸 {{ $t('settings.languages.es') }}</option>
                <option value="pl">🇵🇱 {{ $t('settings.languages.pl') }}</option>
                <option value="de">🇩🇪 {{ $t('settings.languages.de') }}</option>
                <option value="ar">🇦🇪 {{ $t('settings.languages.ar') }}</option>
                <option value="fr">🇫🇷 {{ $t('settings.languages.fr') }}</option>
                <option value="ja">🇯🇵 {{ $t('settings.languages.ja') }}</option>
                <option value="it">🇮🇹 {{ $t('settings.languages.it') }}</option>
                <option value="eu">🏴 {{ $t('settings.languages.eu') }}</option>
                <option value="cs">🇨🇿 {{ $t('settings.languages.cs') }}</option>
            </select>
        </div>
    </section>
</template>

<script>
import themes from '@/themes';
import ToggleSwitch from '@/components/ToggleSwitch';

export default {
    components: {
        ToggleSwitch,
    },

    props: {
        value: Object,
        reloading: Boolean,
    },

    data() {
        return {
            themes,
        };
    },

    computed: {
        hasLists() {
            return Object.keys(this.gameLists).length > 0;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .reloading {
        width: 100%;
        text-align: center;
    }

    select {
        margin: 0;
    }
</style>
