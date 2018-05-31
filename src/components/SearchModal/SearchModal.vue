<template lang="html">
    <md-dialog :md-active.sync="show" class="game-modal">
        <h1>Add game</h1>

        <form @submit.prevent="search" class="search-form">
            <md-field>
                <md-icon>search</md-icon>
                <label>Type here</label>
                <md-input v-model="searchText"></md-input>
            </md-field>
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
    </md-dialog>

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

    .game-modal {
        padding: $gp;
    }

    .results {
        overflow: auto;
    }

    .results, .game-card-placeholder {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: $gp;

        @media($medium) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media($small) {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .vue-content-placeholders-img {
        width: 180px;
        height: 120px;
        margin-top: 0;
    }
</style>
