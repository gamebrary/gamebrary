<template lang="html">
  <b-card class="mt-4" no-body>
    <b-tabs card>
      <b-tab title="Game details" active>
        <template v-slot:title>
          <b-skeleton width="80px" />
        </template>
        <dl class="row">
          <dt class="col-sm-3">{{ $t('board.gameModal.platforms') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.genres') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.gameModes') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.developers') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.publishers') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.perspective') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.timeToBeat') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>

          <dt class="col-sm-3">{{ $t('board.gameModal.ageRatings') }}</dt>
          <dd class="col-sm-9">
            <b-skeleton />
          </dd>
        </dl>
      </b-tab>

      <b-tab title="Game details">
        <template v-slot:title>
          <b-skeleton width="80px" />
        </template>
      </b-tab>

      <b-tab title="Game details">
        <template v-slot:title>
          <b-skeleton width="80px" />
        </template>
      </b-tab>
    </b-tabs>
  </b-card>
  <!-- <div class="game-detail-placeholder">
    <div class="game-hero" />

    <div class="game-detail-container">
      <div class="game-detail">
        <img :src="coverUrl" :alt="gamePreviewData.name" class="game-cover">

        <div>
          <h2>{{ gamePreviewData.name }}</h2>
          <placeholder :lines="3" />
        </div>

      </div>
    </div>
  </div> -->
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    id: {
      type: [Number, String],
      default: null,
    },
  },

  computed: {
    ...mapState(['games']),

    gamePreviewData() {
      return this.games[this.id];
    },

    coverUrl() {
      const game = this.games[this.id];

      return game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .game-detail-placeholder {
    display: flex;
    justify-content: center;
    background: var(--modal-background);
    min-height: calc(100vh - 48px);
  }

  .game-hero {
    position: absolute;
    width: 100%;
    left: 0;
    height: 400px;
    z-index: 2;

    @media(max-width: 780px) {
      display: none;
    }
  }

  .game-cover {
    border: 5px solid #a5a2a2;
    background-size: contain;
    width: 100%;
    height: auto;

    @media(max-width: 780px) {
      border: 3px solid #a5a2a2;
      height: auto;
      width: auto;
      min-width: auto;
      max-width: 100%;
    }
  }

  .game-detail-container {
    -webkit-box-shadow: 0 0 2px 0 #a5a2a2;
    box-shadow: 0 0 2px 0 #a5a2a2;
    width: 900px;
    max-width: 100%;
    z-index: 2;
    margin: 3rem;
    padding: 1rem 0;
    border-radius: var(--border-radius);

    @media(max-width: 780px) {
      margin: 0;
      padding-top: 3rem;
      border-radius: 0;
    }
  }

  .game-detail {
    display: grid;
    grid-template-columns: 180px auto;
    grid-gap: 2rem;
    margin: 0 1rem;

    @media(max-width: 780px) {
      grid-template-columns: auto;
    }
  }

  .game-cover {
    --placeholder-image-width: 175px;
    --placeholder-image-height: 220px;

    @media(max-width: 780px) {
      --placeholder-image-width: 240px;
      --placeholder-image-height: 300px;
      width: 240px;
      margin: 0 auto;
    }
  }

  .game-title {
    --placeholder-text-height: 30px;
    width: 50%;

    @media(max-width: 780px) {
      width: 50%;
      margin: 0 auto;
    }
  }

  .game-rating {
    margin-bottom: 1rem;
  }
</style>
