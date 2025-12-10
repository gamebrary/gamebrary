<template lang="html">
  <div>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
    <p>Paragraph</p>

    <div class="mb-5">
      <button
        v-for="variant in variants"
        :key="variant"
        type="button"
        class="btn me-2 mb-2"
        :class="`btn-${variant}`"
        @click="variantSelected = variant"
      >
        {{ variant }}
      </button>
    </div>


    <div class="mb-5">
      <div class="alert alert-primary" role="alert">Primary Alert</div>
      <div class="alert alert-secondary" role="alert">Secondary Alert</div>
      <div class="alert alert-success" role="alert">Success Alert</div>
      <div class="alert alert-danger" role="alert">Danger Alert</div>
      <div class="alert alert-warning" role="alert">Warning Alert</div>
      <div class="alert alert-info" role="alert">Info Alert</div>
      <div class="alert alert-light" role="alert">Light Alert</div>
      <div class="alert alert-dark" role="alert">Dark Alert</div>
    </div>

    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="devToolsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Dropdown Button
      </button>
      <ul class="dropdown-menu" aria-labelledby="devToolsDropdown">
        <li><a class="dropdown-item" href="#">First Action</a></li>
        <li><a class="dropdown-item" href="#">Second Action</a></li>
        <li><a class="dropdown-item" href="#">Third Action</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item active" href="#">Active action</a></li>
        <li><a class="dropdown-item disabled" href="#">Disabled action</a></li>
      </ul>
    </div>

    <button
      type="button"
      class="btn btn-danger me-3"
      @click="expireSession"
    >
      Expire session
    </button>

    <button
      type="button"
      class="btn btn-warning"
      @click="clearGameCache"
    >
      Clear game cache
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useGamesStore } from '@/stores/games';

const userStore = useUserStore();
const gamesStore = useGamesStore();

const variantSelected = ref('white');
const variants = ref([
  'black',
  'danger',
  'dark',
  'info',
  'light',
  'muted',
  'primary',
  'secondary',
  'success',
  'warning',
  'white',
]);

const expireSession = () => {
  userStore.setSessionExpired(true);
};

const clearGameCache = () => {
  gamesStore.clearCacheGameData();
};
</script>
