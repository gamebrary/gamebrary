<template lang="html">
    <div class="search-panel">
        <h4>Add game to {{ listName }}</h4>

        <md-field>
            <label>Type here</label>

            <md-input
                v-model="searchText"
                @input="search"
                ref="searchBox"
            />

            <span v-if="results && results.length && searchText && !loading" class="md-helper-text">
                {{results.length}} Results found
                <span v-if="searchText">
                     for {{ searchText }}
                </span>
            </span>
        </md-field>

        <content-placeholders v-for="n in 10" :key="n" v-if="loading">
            <content-placeholders-heading :img="true" />
        </content-placeholders>

        <game-card
            v-if="results && results.length && !loading"
            v-for="{ id } in results" :key="id"
            :game-id="id"
            :listId="listId"
            search-result
        />
    </div>
</template>

<script>
import GameCard from '@/components/GameCard/GameCard';
import { debounce } from 'lodash';

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

    methods: {
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
    @import "~styles/variables.scss";

    .search-modal {
        padding: 0 $gp;
    }

    h4 {
        margin-bottom: 0;
    }

    .vue-content-placeholders {
        padding: $gp;
    }
</style>
