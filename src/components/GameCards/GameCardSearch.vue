<!-- TODO: finish game card, make it default card? -->
<template lang="html">
  <b-card
    v-if="game"
    :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
    :img-alt="game.name"
    class="mb-3 cursor-pointer border-0"
    img-left
    @click="handleClick"
  >
    <b-card-text>
      <GameRibbon :game="game" />

      <b-button
        variant="transparent"
        squared
        class="ml-2 mt-1 p-0"
        :disabled="!user"
        @click.stop.prevent="$bus.$emit('SELECT_GAME', game.id)"
      >
        <i :class="[isLiked ? 'fa-solid': 'fa-regular' , 'fa-heart text-primary']" />
      </b-button>

      <strong
        class="text-center pb-5 d-flex justify-content-center"
      >
        {{ game.name }}
      </strong>
      {{ gamePlatformsText }}
    </b-card-text>
  </b-card>
</template>

<script>
import { getImageUrl } from '@/utils';
import { mapState } from 'vuex';
import { NO_IMAGE_PATH, IMAGE_SIZE_COVER_SMALL, PLATFORMS } from '@/constants';
import GameRibbon from '@/components/GameRibbon';
import slugify from 'slugify'

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

  props: {
    game: {
      type: Object,
      required: true,
    },
    noLink: Boolean,
  },

  components: {
    GameRibbon,
  },

  computed: {
    ...mapState(['user', 'boards', 'games']),

    isLiked() {
      return this.games?.[this.game?.id];
    },

    noImage() {
      return NO_IMAGE_PATH === this.gameCoverUrl;
    },

    gamePlatformsText() {
      return this.game?.platforms.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
    },
  },

  methods: {
    handleClick() {
      if (this.noLink) return this.$emit('click');

      const { id } = this.game;
      const slug = slugify(this.game.slug, { lower: true });

      this.$router.push({ name: 'game', params: { id, slug }});
    },
  },
};
</script>
