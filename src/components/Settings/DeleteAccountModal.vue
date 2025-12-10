<template lang="html">
  <div
    class="modal fade"
    id="delete-account-modal"
    tabindex="-1"
    data-bs-backdrop="static"
    :data-bs-keyboard="!deleting"
  >
    <div class="modal-dialog">
      <div class="modal-content" :class="darkTheme ? 'bg-dark text-light' : ''">
        <div class="modal-header" :class="darkTheme ? 'bg-dark text-light border-secondary' : ''">
          <h5 class="modal-title">Delete account</h5>
          <button
            v-if="!deleting"
            type="button"
            class="btn-close"
            :class="darkTheme ? 'btn-close-white' : ''"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" :class="darkTheme ? 'bg-dark text-light' : ''">
          <div v-if="deleting" class="d-flex flex-column justify-content-center text-center">
            <div class="spinner-border mx-auto mb-5" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            Deleting account, do not close this window...
          </div>

          <div v-else>
            <p>We're sorry to see you go. Please consider submitting feedback before deleting your account.</p>
            <a
              href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
              target="_blank"
              class="btn btn-primary"
            >
              Submit feedback
            </a>

            <p class="mt-3">The following database entries will be deleted FOREVER.</p>

            <ul>
              <li>User profile</li>
              <li>Boards</li>
              <li>Tags</li>
              <li>Notes</li>
              <li>Game Progresses</li>
              <li>Liked games</li>
              <li>Wallpapers</li>
              <li>Avatars</li>
              <li>Settings</li>
            </ul>

            <button
              type="button"
              class="btn btn-danger"
              @click="deleteAccount"
              :disabled="deleting"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useTagsStore } from '@/stores/tags';
import { useNotesStore } from '@/stores/notes';
import { useProgressesStore } from '@/stores/progresses';
import { useSettingsStore } from '@/stores/settings';
import { useBoardsStore } from '@/stores/boards';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters } from '@/stores/getters';

const userStore = useUserStore();
const tagsStore = useTagsStore();
const notesStore = useNotesStore();
const progressesStore = useProgressesStore();
const settingsStore = useSettingsStore();
const boardsStore = useBoardsStore();
const wallpapersStore = useWallpapersStore();
const { darkTheme } = useAppGetters();

// Reactive state
const deleting = ref(false);

// Store state and getters
const user = computed(() => userStore.user);
const tags = computed(() => tagsStore.tags);
const notes = computed(() => notesStore.notes);
const progresses = computed(() => progressesStore.progresses);
const settings = computed(() => settingsStore.settings);
const boards = computed(() => boardsStore.boards);
const wallpapers = computed(() => wallpapersStore.wallpapers);

// Methods
const deleteAccount = async () => {
  deleting.value = true;

  await userStore.deleteAccount();
};
</script>
