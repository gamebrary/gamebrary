<template lang="html">
  <div class="d-flex mx-2">
    <div
      v-for="(list, index) in board.lists"
      :class="`ms-2 list`"
      :key="index"
    >
      <div
        class="card"
        :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
      >
        <div class="card-header pt-2 pb-1 px-2">
          <div class="placeholder-glow">
            <span class="placeholder col-7"></span>
          </div>
        </div>

        <div
          v-if="list && list.games.length"
          class="games"
        >
          <div v-for="n in list.games.length" :key="n">
            <div
              v-if="getListView(list) === 'grid'"
              class="card mb-1 p-1"
              :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
            >
              <div class="placeholder-glow">
                <div class="placeholder rounded" style="height: 160px; width: 100%;"></div>
              </div>

              <div class="card-body p-2">
                <div class="placeholder-glow mt-2">
                  <span class="placeholder col-12"></span>
                </div>
              </div>
            </div>

            <div
              v-else
              class="card d-flex"
              :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
            >
              <div class="card-body p-2">
                <div class="placeholder-glow m-0">
                  <span class="placeholder col-12"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="p-2"
          v-else
        >
          <div class="placeholder-glow">
            <span class="placeholder col-12" style="height: 2rem;"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const board = computed(() => store.state.board);
const darkTheme = computed(() => store.getters.darkTheme);

const getListView = (list) => {
  if (list?.vertical) return 'vertical';
  if (list?.smallCover) return 'covers';
  if (list?.hideCover) return 'compact';
  if (list?.hideTitle) return 'single';
  return 'grid';
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
    max-height: calc(100svh - 81px);
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
