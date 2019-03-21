<template lang="html">
    <footer :class="{ fixed }">
        <section>
            <i class="far fa-copyright" /> {{ moment().format('YYYY') }} Gamebrary.
        </section>

        <section>
            <i class="fas fa-code" />
            {{ $t('global.by') }}
            <a href="https://twitter.com/romancm" target="_blank">@romancm</a>
        </section>

        <section>
            <modal title="Releases" large padded v-if="latestRelease">
                <strong>
                    <i class="fab fa-github" />
                    {{ latestRelease }}
                </strong>

                <releases slot="content" />
            </modal>
        </section>
    </footer>
</template>

<script>
import moment from 'moment';
import Releases from '@/components/Releases/Releases';
import Modal from '@/components/Modal/Modal';
import { mapState } from 'vuex';

export default {
    components: {
        Releases,
        Modal,
    },

    data() {
        return {
            moment,
        };
    },

    computed: {
        ...mapState(['releases']),

        fixed() {
            return this.$route.name === 'game-board';
        },

        latestRelease() {
            return this.releases && this.releases.length
                ? this.releases[0].tag_name
                : 'nothing';
        },
    },

    mounted() {
        this.$store.dispatch('LOAD_RELEASES');
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

footer {
    bottom: 0;
    width: 100%;
    display: grid;
    grid-gap: $gp / 2;
    grid-template-columns: auto auto auto;
    justify-content: center;
    padding: $gp / 2 0;
    color: $color-dark-gray;
    font-size: 10px;

    &.fixed {
        position: fixed;
    }

    a {
        color: $color-dark-gray;
        font-weight: bold;
    }

    strong {
        cursor: pointer;
    }
}
</style>
