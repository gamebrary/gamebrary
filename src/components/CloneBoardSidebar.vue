<template lang="html">
  <b-sidebar
    id="clone-board-sidebar"
    v-bind="sidebarRightProps"
    @shown="setBoardName"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide" title="Clone board" />

      <form @submit.prevent="cloneBoard" class="px-3">
        <b-form-group label="Board name:" label-for="boardName">
          <b-form-input
            id="boardName"
            v-model.trim="boardName"
            autofocus
            required
          />
        </b-form-group>

        <MiniBoard
          class="mb-2"
          :board="board"
          no-link
        />

        <b-button
          :variant="darkTheme ? 'secondary' : 'primary'"
          :disabled="saving"
          type="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Clone board</span>
        </b-button>
      </form>

    </template>
  </b-sidebar>
</template>

<script>
import SidebarHeader from '@/components/SidebarHeader';
import MiniBoard from '@/components/Board/MiniBoard';
import { mapState, mapGetters } from 'vuex';
import { BOARD_TYPE_KANBAN } from '@/constants';

export default {
  data() {
    return {
      boardName: '',
      saving: false,
    }
  },

  components: {
    SidebarHeader,
    MiniBoard,
  },

  computed: {
    ...mapState(['board', 'user']),
    ...mapGetters(['sidebarRightProps', 'darkTheme']),

    payload() {
      const dateCreated = Date.now();

      const isBoardOwner = this.board.owner === this.user.uid;

      const backgroundUrl = isBoardOwner
        ? this.board.backgroundUrl
        : null;

      console.log('isBoardOwner', isBoardOwner);

      // TODO: clone wallpaper when cloning board?
      return {
        type: this.board.type || BOARD_TYPE_KANBAN,
        lists: this.board.lists,
        ranked: this.board.ranked || false,
        backgroundUrl: backgroundUrl || null,
        backgroundColor: this.board?.backgroundColor || null,
        lastUpdated: this.board.lastUpdated || dateCreated,
        darkTheme: this.board.darkTheme || false,
        dateCreated: this.board.dateCreated || dateCreated,
        originalOwnerId: this.board.owner,
        isPublic: false,
        dateCreated,
        lastUpdated: dateCreated,
        originalBoardId: this.board.id,
        originalDateCreated: this.board.dateCreated || dateCreated,
        owner: this.user.uid,
        name: this.boardName,
      }
    },
  },

  methods: {
    setBoardName() {
      this.boardName = this.board.name || '';
    },

    async cloneBoard() {
      try {
        this.saving = true;

        const { id } = await this.$store.dispatch('CREATE_BOARD', this.payload);
        this.$bvToast.toast('Board cloned');
        this.saving = false;
        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
