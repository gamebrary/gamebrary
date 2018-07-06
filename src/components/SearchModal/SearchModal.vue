<template lang="html">
    <md-drawer
        v-if="show"
        class="md-right"
        :md-active.sync="show"
    >
        <md-subheader>
            Add game to {{ listName }}
        </md-subheader>

        <input
            ref="searchBox"
            class="searchBox"
            type="text"
            placeholder="Search"
            v-debounce="500"
            v-model.lazy="searchText"
        />

        <small v-if="results.length && searchText && !loading" class="search-result-text">
            {{results.length}} Results found
            <span v-if="searchText">
                 for {{ searchText }}
            </span>
        </small>

        <content-placeholders v-for="n in 10" :key="n" v-if="loading">
            <content-placeholders-heading :img="true" />
        </content-placeholders>

        <div class="search-results" v-if="results.length && !loading">
            <game-card
                v-for="{ id } in results" :key="id"
                :game-id="id"
                :listId="listId"
                search-result
            />
        </div>
    </md-drawer>
</template>

<script>
import debounce from 'v-debounce';
import GameCard from '@/components/GameCard/GameCard';

export default {
    components: {
        GameCard,
    },

    directives: { debounce },

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

        listName() {
            return this.$store.state.user.lists[this.listId].name;
        },
    },

    watch: {
        searchText() {
            this.search();
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

            this.$nextTick(() => {
                if (this.$refs.searchBox) {
                    this.$refs.searchBox.focus();
                }
            });
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

    .vue-content-placeholders {
        padding: $gp;
    }

    .searchBox {
        margin: 0 $gp;
        text-indent: $gp / 4;
        height: 32px;
        width: calc(100% - 32px);
        border-radius: $border-radius;
        border: 1px solid $nin-gray;
    }

    .search-result-text {
        padding: $gp;
    }

    .search-results {
        padding: $gp;
    }
</style>
