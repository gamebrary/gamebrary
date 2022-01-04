<template lang="html">
  <b-alert show variant="secondary" class="game-details">
    <div v-if="platforms">
      <strong>{{ $t('board.gameModal.platforms') }}:</strong>
      <span class="text-wrap">{{ platforms }}</span>
    </div>

    <div v-if="genres">
      <strong>{{ $t('board.gameModal.genres') }}:</strong>
      <span class="text-wrap">{{ genres }}</span>
    </div>

    <div v-if="gameModes">
      <strong>{{ $t('board.gameModal.gameModes') }}:</strong>
      <span class="text-wrap">{{ gameModes }}</span>
    </div>

    <div v-if="gameDevelopers">
      <strong>{{ $t('board.gameModal.developers') }}:</strong>
      <span class="text-wrap">{{ gameDevelopers }}</span>
    </div>

    <div v-if="gamePublishers">
      <strong>{{ $t('board.gameModal.publishers') }}:</strong>
      <span class="text-wrap">{{ gamePublishers }}</span>
    </div>

    <div v-if="playerPerspectives">
      <strong>{{ $t('board.gameModal.perspective') }}:</strong>
      <span class="text-wrap">{{ playerPerspectives }}</span>
    </div>

    <div v-if="game.alternative_names">
      <strong>Also known as:</strong>
      <ul>
        <li
          v-for="alternativeName in game.alternative_names"
          :key="alternativeName.id"
        >
          {{ alternativeName.name }}
          {{ alternativeName.comment ? `(${alternativeName.comment})` : null }}
        </li>
      </ul>
    </div>

    {{ $t('board.gameModal.releaseDate') }}

    <ul class="timeline">
      <li
        class="event pb-2"
        :data-date="releaseDate.date"
        :key="releaseDate.id"
        v-for="releaseDate in timeline"
      >
        {{ releaseDate.platform }}
      </li>
    </ul>
  </b-alert>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  computed: {
    ...mapGetters(['platformNames']),

    genres() {
      return this.game && this.game.genres
        ? this.game.genres.map(({ name }) => name).join(', ')
        : null;
    },

    platforms() {
      return this.game && this.game.platforms
        ? this.game.platforms.map(({ name }) => name).join(', ')
        : null;
    },

    gameDevelopers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ developer }) => developer)
          .map(({ company }) => company.name).join(', ')
        : null;
    },

    gamePublishers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ publisher }) => publisher)
          .map(({ company }) => company.name).join(', ')
        : null;
    },

    gameModes() {
      return this.game && this.game.game_modes
        ? this.game.game_modes.map(({ name }) => name).join(', ')
        : null;
    },

    playerPerspectives() {
      return this.game && this.game.player_perspectives
        ? this.game.player_perspectives.map(({ name }) => name).join(', ')
        : null;
    },

    timeline() {
      const releaseDates = this.game && this.game.release_dates;
      const sortedActivities = releaseDates
        ? releaseDates.sort((a, b) => b.date - a.date)
        : [];

      return sortedActivities.length ? sortedActivities.map(releaseDate => ({
        ...releaseDate,
        platform: this.platformNames[releaseDate.platform] ? this.platformNames[releaseDate.platform].name : null,
        date: releaseDate.date ? this.$dayjs.unix(releaseDate.date).format('MMMM D, YYYY') : 'N/A',
      }))
        : null;
    },

    releaseDates() {
      const hasReleaseDates = this.game && this.game.release_dates;

      if (!hasReleaseDates) {
        return 'N/A';
      }

      const formattedReleaseDates = this.game.release_dates.map(({ platform, date }) => {
        const formattedDate = date
          ? this.$dayjs.unix(date).format('MMMM D, YYYY')
          : 'N/A';

        return this.platformNames[platform]
          ? `${this.platformNames[platform].name}: ${formattedDate}`
          : null;
      });

      return [...new Set(formattedReleaseDates)];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-details {
  font-size: small;
}

.timeline {
    border-left: 3px solid #727cf5;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background: rgba(114, 124, 245, 0.09);
    margin: 0 auto;
    letter-spacing: 0.2px;
    position: relative;
    line-height: 1.4em;
    font-size: 1.03em;
    padding: 50px;
    list-style: none;
    text-align: left;
    max-width: 40%;
}

@media (max-width: 767px) {
    .timeline {
        max-width: 98%;
        padding: 25px;
    }
}

.timeline .event {
    // border-bottom: 1px dashed #e8ebf1;
    // padding-bottom: 25px;
    // margin-bottom: 25px;
    position: relative;
}

@media (max-width: 767px) {
    .timeline .event {
        padding-top: 30px;
    }
}

.timeline .event:last-of-type {
    padding-bottom: 0;
    margin-bottom: 0;
    border: none;
}

.timeline .event:before,
.timeline .event:after {
    position: absolute;
    display: block;
    top: 0;
}

.timeline .event:before {
    left: -207px;
    content: attr(data-date);
    text-align: right;
    font-weight: 100;
    font-size: 0.9em;
    min-width: 120px;
}

@media (max-width: 767px) {
    .timeline .event:before {
        left: 0px;
        text-align: left;
    }
}

.timeline .event:after {
    -webkit-box-shadow: 0 0 0 3px #727cf5;
    box-shadow: 0 0 0 3px #727cf5;
    left: -55.8px;
    background: #fff;
    border-radius: 50%;
    height: 9px;
    width: 9px;
    content: "";
    top: 5px;
}

@media (max-width: 767px) {
    .timeline .event:after {
        left: -31.8px;
    }
}

.rtl .timeline {
    border-left: 0;
    text-align: right;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    border-right: 3px solid #727cf5;
}

.rtl .timeline .event::before {
    left: 0;
    right: -170px;
}

.rtl .timeline .event::after {
    left: 0;
    right: -55.8px;
}


</style>
