<template lang="html">
    <at-modal
        v-model="show"
        show-close
        :show-footer="false"
        title="Add games"
        :styles="styles"
        v-if="auth"
    >
        <form @submit.prevent="search">
            <at-input v-model="searchText" placeholder="Type here" append-button size="large">
                <template slot="append">
                    <i class="icon icon-search" />
                </template>
            </at-input>
        </form>

        <div class="game-card-placeholder" v-if="loading">
            <content-placeholders-img v-for="n in 6" :key="n" />
        </div>

        <div class="results" v-else>
            <game-card
                v-for="{ id } in results"
                :key="id"
                :game-id="id"
                :listId="listId"
            />
        </div>
    </at-modal>
</template>

<script>
import GameCard from '@/components/GameCard/GameCard';

export default {
    components: {
        GameCard,
    },

    data() {
        return {
            listId: 0,
            show: false,
            searchText: '',
            loading: false,
            styles: {
                width: '95%',
                'max-width': '800px',
            },
        };
    },

    computed: {
        results() {
            return this.$store.state.results;
        },

        auth() {
            return this.$store.getters.auth;
        },
    },

    mounted() {
        this.$bus.$on('OPEN_SEARCH_MODAL', (list) => {
            this.open(list);
        });
    },

    methods: {
        open(list) {
            this.show = true;
            this.listId = list || 0;
            this.$store.dispatch('SEARCH', this.searchText);
        },

        search() {
            this.loading = true;
            this.$store.dispatch('SEARCH', this.searchText)
                .then(() => {
                    this.error = null;
                    this.loading = false;
                })
                .catch(({ data }) => {
                    this.loading = false;
                    this.error = data;
                });
        },

        close() {
            this.searchText = '';
            this.results = null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .results {
        display: grid;
        grid-template-columns: repeat(5, auto);
        grid-gap: 16px;
    }

    .game-card-placeholder {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-gap: 16px;

        .vue-content-placeholders-img {
            margin-top: 0;
        }
    }
</style>
