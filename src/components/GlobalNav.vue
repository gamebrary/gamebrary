<template>
  <div>
    <!-- Desktop: Left Sidebar -->
    <nav class="global-nav-desktop d-none d-md-flex flex-column" :class="darkTheme ? 'bg-dark' : 'bg-light'">
      <div class="nav-header">
        <router-link :to="{ name: 'home' }">
          <img src="/img/gamebrary-logo.png" alt="Gamebrary" width="200" class="pb-1" />
        </router-link>
        <SearchBox v-if="user" class="mt-3" />
      </div>

      <div class="nav-content flex-grow-1">
        <router-link :to="{ name: 'library' }" class="nav-item" :class="{ active: isActiveRoute('library') }">
          <i class="fa-regular fa-gamepad fa-fw" />
          <span>Library</span>
        </router-link>

        <router-link :to="{ name: 'boards' }" class="nav-item" :class="{ active: isActiveRoute('boards') }">
          <i class="fa-regular fa-rectangle-list fa-fw" />
          <span>Boards</span>
        </router-link>

        <router-link :to="{ name: 'notes' }" class="nav-item" :class="{ active: isActiveRoute('notes') }">
          <i class="fa-regular fa-notes fa-fw" />
          <span>Notes</span>
        </router-link>

        <div class="nav-divider"></div>

        <button type="button" class="nav-item" :class="{ active: isWallpapersRoute }" @click="openWallpapers">
          <i class="fa-solid fa-palette fa-fw" />
          <span>Wallpapers</span>
        </button>

        <button type="button" class="nav-item" :class="{ active: routeName === 'settings' }" @click="openSettings">
          <i class="fa-regular fa-gear fa-fw" />
          <span>Settings</span>
        </button>

        <router-link :to="{ name: 'about' }" class="nav-item" :class="{ active: routeName === 'about' }">
          <i class="fa-regular fa-circle-info fa-fw" />
          <span>About</span>
        </router-link>
      </div>

      <div class="nav-footer">
        <ProfileDockMenu />
      </div>
    </nav>

    <!-- Mobile: Bottom Nav -->
    <nav class="global-nav-mobile d-flex d-md-none" :class="darkTheme ? 'bg-dark' : 'bg-light'">
      <router-link :to="{ name: 'home' }" class="nav-item-mobile nav-logo-mobile">
        <img src="/icon512_rounded.png" alt="Gamebrary" class="nav-logo-img" />
      </router-link>

      <router-link :to="{ name: 'library' }" class="nav-item-mobile" :class="{ active: isActiveRoute('library') }">
        <i class="fa-regular fa-gamepad" />
        <span>Library</span>
      </router-link>

      <router-link :to="{ name: 'boards' }" class="nav-item-mobile" :class="{ active: isActiveRoute('boards') }">
        <i class="fa-regular fa-rectangle-list" />
        <span>Boards</span>
      </router-link>

      <router-link :to="{ name: 'notes' }" class="nav-item-mobile" :class="{ active: isActiveRoute('notes') }">
        <i class="fa-regular fa-notes" />
        <span>Notes</span>
      </router-link>

      <router-link :to="{ name: 'search' }" class="nav-item-mobile" :class="{ active: isActiveRoute('search') }">
        <i class="fa-solid fa-magnifying-glass" />
        <span>Search</span>
      </router-link>

      <div class="nav-item-mobile dropdown">
        <button type="button" class="nav-item-mobile" :class="{ active: isMoreMenuActive }" data-bs-toggle="dropdown"
          aria-expanded="false">
          <i class="fa-solid fa-ellipsis" />
          <span>More</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button type="button" class="dropdown-item" @click="openWallpapers">
              <i class="fa-solid fa-palette me-2" />
              Wallpapers
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item" @click="openSettings">
              <i class="fa-regular fa-gear me-2" />
              Settings
            </button>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <router-link :to="{ name: 'about' }" class="dropdown-item">
              <i class="fa-regular fa-circle-info me-2" />
              About
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useBoardsStore } from '@/stores/boards';
import { useAppGetters } from '@/stores/getters';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SearchBox from '@/components/SearchBox';

const route = useRoute();
const router = useRouter();
const $bus = inject('$bus');

// Pinia stores
const userStore = useUserStore();
const boardsStore = useBoardsStore();
const { darkTheme } = useAppGetters();

// Store state and getters
const user = computed(() => userStore.user);
const boards = computed(() => boardsStore.boards);
const routeName = computed(() => route?.name);

const isActiveRoute = (routeNameToCheck) => {
  if (routeNameToCheck === 'library') {
    return ['library', 'home'].includes(routeName.value);
  }
  return routeName.value === routeNameToCheck;
};

const isWallpapersRoute = computed(() => {
  return ['wallpapers'].includes(routeName.value);
});

const isMoreMenuActive = computed(() => {
  return isWallpapersRoute.value || routeName.value === 'settings' || routeName.value === 'about';
});

// Methods
const openWallpapers = () => {
  // Navigate to wallpapers page
  router.push({ name: 'wallpapers' });
};

const openSettings = () => {
  router.push({ name: 'settings' });
};
</script>

<style lang="scss" scoped>
.global-nav-desktop {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 240px;
  background-color: var(--bs-dark);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;

  .nav-header {
    padding: 1rem 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;

      .logo-text {
        font-size: 1.25rem;
        font-weight: 600;
      }
    }
  }

  .nav-content {
    overflow-y: auto;
    padding: 0.5rem 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 0.25rem;
    border: none;
    background: transparent;
    color: inherit;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    text-align: left;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background-color: var(--bs-success);
      color: var(--bs-dark);
      font-weight: 600;
    }

    .nav-badge {
      margin-left: auto;
      background-color: rgba(0, 0, 0, 0.2);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    &.active .nav-badge {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  .nav-divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 1rem 0;
  }

  .nav-footer {
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.global-nav-mobile {
  position: fixed;
  bottom: 0; // Position at the very bottom
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--bs-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem;

  .nav-item-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    flex: 1;
    padding: 0.5rem;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    font-size: 0.75rem;

    i {
      font-size: 1.25rem;
    }

    &:hover,
    &.active {
      color: var(--bs-success);
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      font-weight: 600;
    }

    &.nav-logo-mobile {
      flex: 0 0 auto;
      padding: 0.25rem;

      .nav-logo-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
    }
  }

  .dropdown-menu {
    margin-bottom: 70px;
  }
}

// Light theme adjustments
.global-nav-desktop.bg-light {
  background-color: var(--bs-light);
  border-right-color: rgba(0, 0, 0, 0.1);

  .nav-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background-color: var(--bs-success);
      color: var(--bs-dark);
    }

    .nav-badge {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .nav-divider {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .nav-footer {
    border-top-color: rgba(0, 0, 0, 0.1);
  }
}

.global-nav-mobile.bg-light {
  background-color: var(--bs-light);
  border-top-color: rgba(0, 0, 0, 0.1);

  .nav-item-mobile {
    color: rgba(0, 0, 0, 0.7);

    &:hover,
    &.active {
      color: var(--bs-success);
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
