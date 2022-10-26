<template lang="html">
  <div class="d-flex mx-2">
    <div
      v-for="list in board.lists"
      :class="`ml-2 list ${list.settings.view || 'single'}`"
      :key="list.name"
    >
      <b-card no-body>
        <b-card-header class="pt-2 pb-1 px-2">
          <b-skeleton />
        </b-card-header>

        <div
          v-if="list && list.games.length"
          :class="['games', list.settings.view]"
        >
          <div v-for="n in list.games.length" :key="n">
            <b-card
              no-body
              img-top
              class="mb-1 p-1"
              v-if="list.settings.view === 'grid'"
            >
              <b-skeleton-img
                card-img="top"
                class="rounded"
                height="180px"
              />

              <b-card-body class="p-2">
                <b-skeleton class="mt-2" />
              </b-card-body>
            </b-card>

            <div
              v-else-if="list.settings.view === 'covers'"
              class="covers-grid"
            >
              <b-skeleton-img
                v-for="n in 3"
                :key="n"
                class="rounded"
                height="120px"
              />
            </div>

            <b-card
              v-else-if="!list.settings.view || list.settings.view === 'single'"
              no-body
              img-left
            >
              <b-skeleton-img
                card-img="left"
                width="94px"
                class="rounded m-1"
                height="124px"
              />

              <b-card-body class="p-2">
                <b-skeleton />
              </b-card-body>
            </b-card>

            <b-card
              v-else-if="list.settings.view === 'compact'"
              no-body
              img-left
            >
              <b-skeleton-img
                card-img="left"
                class="rounded m-1"
                width="70px"
                height="93px"
              />

              <b-card-body class="p-2">
                <b-skeleton />
              </b-card-body>
            </b-card>

            <b-card
              v-else
              no-body
              img-left

            >
              <b-card-body class="p-2">
                <b-skeleton class="m-0" />
              </b-card-body>
            </b-card>
          </div>
        </div>

        <div
          class="p-2"
          v-else
        >
          <b-skeleton height="2rem" />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .list {
    flex-shrink: 0;
    cursor: default;
    overflow: hidden;
    position: relative;
    width: 300px;
    margin-right: .5rem;
    max-height: calc(100vh - 81px);
  }

  .header {
    margin: 6px 0;
  }

  .games {
    display: grid;
    grid-gap: .5rem;
    padding: .5rem;

    &.grid {
      padding-top: .5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: .25rem;
    }
  }

  .covers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: .5rem;
  }
</style>
