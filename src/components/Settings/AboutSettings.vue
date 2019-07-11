<template lang="html">
    <div>
        <div class="github-buttons">
            <github-button href="https://github.com/romancmx/gamebrary/subscription" data-show-count="true" aria-label="Watch romancmx/gamebrary on GitHub">Watch</github-button>
            <github-button href="https://github.com/romancmx/gamebrary" data-show-count="true" aria-label="Star romancmx/gamebrary on GitHub">Star</github-button>
            <github-button href="https://github.com/romancmx/gamebrary/fork" data-show-count="true" aria-label="Fork romancmx/gamebrary on GitHub">Fork</github-button>
            <github-button href="https://github.com/romancmx/gamebrary/issues" data-show-count="true" aria-label="Issue romancmx/gamebrary on GitHub">Issue</github-button>
        </div>

        <vue-markdown :source="readme" v-if="readme" />

        <footer>
            <i class="far fa-copyright" /> {{ moment().format('YYYY') }} Gamebrary
        </footer>

    </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import VueMarkdown from 'vue-markdown';
import GithubButton from 'vue-github-button';

export default {
    components: {
        GithubButton,
        VueMarkdown,
    },

    data() {
        return {
            readme: null,
            moment,
        };
    },

    mounted() {
        axios.get('https://raw.githubusercontent.com/romancm/gamebrary/master/README.md')
            .then(({ data }) => {
                const formattedData = data.replace(/100px/g, '50px');

                this.readme = formattedData;
            });
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .github-buttons, footer {
        text-align: center;
    }
</style>
