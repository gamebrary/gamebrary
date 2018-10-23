<template lang="html">
    <form @submit.prevent="search" class="game-search">
        <input ref="searchInput" type="text" v-model="searchText" placeholder="Type here">

        <div class="search-results" v-if="!loading && filteredResults.length > 0">
            <game-card
                v-for="{ id } in filteredResults"
                v-if="!list.games.includes(id)"
                :key="id"
                :game-id="id"
                :listId="listId"
                @added="added"
                search-result
            />
        </div>

        <div v-if="!loading && filteredResults.length === 0">
            No results
        </div>

        <content-placeholders v-for="n in 3" :key="n" v-if="loading">
            <content-placeholders-heading :img="true" />
        </content-placeholders>
    </form>
</template>

<script>
import GameCard from '@/components/GameCard/GameCard';
import { debounce } from 'lodash';
import { mapState } from 'vuex';

export default {
    components: {
        GameCard,
    },

    props: {
        listId: {
            type: [Number, String, Boolean],
            required: true,
            default: 0,
        },
    },

    data() {
        return {
            searchText: '',
            loading: false,
            styles: {
                width: '95%',
                'max-width': '800px',
            },
        };
    },

    computed: {
        ...mapState(['results', 'user']),

        list() {
            return this.user.lists[this.listId];
        },

        filteredResults() {
            return this.results.filter(({ id }) => !this.list.games.includes(id));
        },
    },

    watch: {
        searchText(value) {
            if (value) {
                this.search();
            }
        },
    },

    mounted() {
        this.$refs.searchInput.focus();
    },

    methods: {
        added() {
            this.$emit('added');
        },

        search: debounce(
            // eslint-disable-next-line
            function() {
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
            }, 300),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-search {
        background: $color-light-gray;
        margin-top: 30px;
        padding: $gp / 2;
    }

    .search-results {
        // min-height: 120px;
        overflow: auto;
        max-height: calc(100vh - 160px);
    }

    input {
        margin: 0 0 $gp / 2;
    }

    .vue-content-placeholders {
        margin-bottom: $gp / 2;
    }
</style>
