<template lang="html">
  <b-card no-body class="mb-2">
    <b-row no-gutters class="game-card" v-if="game && game.name">
      <b-col md="3">
        <b-card-img
          :src="coverUrl"
          :alt="game.name"
        />
      </b-col>

      <b-col md="9">
        <b-card-body body-class="p-2">
          <b-card-title class="mb-2" title-tag="h6">
            {{ game.name }}
          </b-card-title>

          <b-button
            @click="addGame"
            variant="primary"
          >
            {{ $t('list.addGame') }}
          </b-button>

          <b-form-rating
            v-if="gameRating"
            class="p-0"
            inline
            :value="gameRating"
            readonly
            variant="warning"
            size="sm"
            no-border
          />
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],
};
</script>
