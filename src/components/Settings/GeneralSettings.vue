<template lang="html">
    <section>
        <div class="reloading">
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

        <div class="setting">
            <i class="fas fa-moon" />
            <h5>{{ $t('settings.darkTheme') }}</h5>

            <toggle-switch
                id="nightMode"
                v-model="value.nightMode"
            />
        </div>

        <div class="setting">
            <i class="far fa-envelope" />
            <h5>{{ $t('settings.newsletter') }}</h5>

            <toggle-switch
                id="newsletter"
                v-model="value.newsletter"
            />
        </div>
    </section>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';

export default {
    components: {
        ToggleSwitch,
    },

    props: {
        value: Object,
        reloading: Boolean,
    },

    computed: {
        hasLists() {
            return Object.keys(this.gameLists).length > 0;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    @import "settings";

    .reloading {
        width: 100%;
        text-align: center;
        color: $color-blue;
    }
</style>
