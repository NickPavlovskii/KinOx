<template>
  <div class="search-wrapper">
    <form
      :class="['search', 'search-desktop',{ opened: isOpened }]"
      @click="openSearch"
    >
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        class="search-input"
        spellcheck="false"
        :placeholder="searchPlaceholder"
        @input="handleInput"
        @keydown.enter.prevent="handleEnter"
        @blur="onBlur"
      />

    <div
      class="cross"
      @click.stop="clearAndClose"
    ></div>

      <transition name="dropdown-fade">
        <div
          v-if="showDropdown"
          class="dropdown"
        >
          <router-link
            v-for="movie in filteredMoviesList"
            :key="movie.id"
            :to="{ name: 'movie-details', params: { id: movie.id } }"
            class="dropdown-item"
            @click="clearAndClose"
          >
            <img
              class="dropdown-image"
              alt="Постер"
              :src="movie.poster?.url"
            />
            <div class="dropdown-info">
              <h3 class="dropdown-name">{{ movie.name }}</h3>
              <p class="dropdown-shortDesc">{{ movie.shortDescription }}</p>
              <div class="info-row">
                <span>
                  <i class="pi pi-clock">
                  </i>{{ formatDuration(movie.movieLength)}}
                </span>
                <span>
                  <i class="pi pi-calendar"></i>
                  {{ movie.year }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </transition>
    </form>

    <button
      class="search-mobile-btn"
      aria-label="Открыть поиск"
      @click="openMobileSearch"
    >
      <i class="pi pi-search"></i>
    </button>
    <mobile-search-overlay
      ref="mobileOverlayRef"
      :open="isMobileOpen"
      :search-query="searchQuery"
      :filtered-movies-list="filteredMoviesList"
      :is-loading="isLoading"
      @input="onMobileInput"
      @enter="handleMobileEnter"
      @clear="clearMobileQuery"
      @close="closeMobileSearch"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { formatDuration } from '@/utils/format'
import MobileSearchOverlay from './MobileSearchOverlay.vue'

export default {
  name: 'SearchBox',
  components: { MobileSearchOverlay },
  data() {
    return {
      searchQuery: '',
      isOpened: false,
      isMobileOpen: false,
      isLoading: false,
      timerId: null,
    }
  },
  computed: {
    ...mapState(['movie']),
    filteredMoviesList() {
      return this.movie.filteredMovies.slice(0, 5)
    },
    searchPlaceholder() {
      return this.isOpened ? 'Поиск фильмов...' : ''
    },
    showDropdown() {
      return this.isOpened && this.searchQuery.trim().length >= 1 && this.filteredMoviesList.length
    },
  },
  watch: {
    isMobileOpen(val) {
      document.body.style.overflow = val ? 'hidden' : ''
      if (val) {
        this.$nextTick(() => this.$refs.mobileOverlayRef?.$refs.mobileInputRef?.focus())
      }
    },
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
  methods: {
    ...mapActions('movie', ['searchMovies']),
    ...mapMutations('movie', ['setSearchQuery']),

    openSearch() {
      if (!this.isOpened) {
        this.isOpened = true
        setTimeout(() => this.$refs.inputRef?.focus(), 300)
      }
    },
    clearAndClose() {
      this.searchQuery = ''
      this.isOpened = false
      this.$refs.inputRef?.blur()
    },
    onBlur() {
      setTimeout(() => {
        if (this.searchQuery === '') this.isOpened = false
      }, 200)
    },
    handleEnter() {
      this.$router.push({ path: '/search', query: { q: this.searchQuery } })
    },

    openMobileSearch() {
      this.isMobileOpen = true
    },
    closeMobileSearch() {
      this.isMobileOpen = false
      this.searchQuery = ''
      this.setSearchQuery('')
    },
    clearMobileQuery() {
      this.searchQuery = ''
      this.setSearchQuery('')
      this.$refs.mobileOverlayRef?.$refs.mobileInputRef?.focus()
    },
    onMobileInput(val) {
      this.searchQuery = val
      this.handleInput()
    },
    handleMobileEnter() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } })
        this.closeMobileSearch()
      }
    },

    handleInput() {
      this.isLoading = true
      clearTimeout(this.timerId)
      this.timerId = setTimeout(async () => {
        this.setSearchQuery(this.searchQuery)
        await this.searchMovies()
        this.isLoading = false
      }, 400)
    },
    formatDuration,
  },
}
</script>

<style scoped lang="scss">
$white: #fff;
$font-family: 'Questrial', sans-serif;
$border-width: 0.1rem;
$search-height: 1.3rem;
$search-width: 25rem;

.search-mobile-btn {
  display: none;
}

.search-desktop {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 6px;

  .search-input {
    background: none;
    border: $border-width solid $white;
    border-radius: $search-height;
    height: $search-height;
    width: $search-height;
    color: $white;
    padding: 0.2rem 0.6rem;
    font-family: $font-family;
    font-size: 0.65rem;
    letter-spacing: 0.01rem;
    transition: all 0.3s ease;
    cursor: pointer;
    min-width: $search-height;
    max-width: $search-width;

    &:focus {
      outline: none;
      width: $search-width;
      cursor: text;
    }
  }

  .cross {
    position: absolute;
    bottom: 2px;
    right: 0.3rem;
    cursor: pointer;
    width: 23px;
    height: 16px;
    transform: translateX(22px) translateY(14px);
    transition: all 0.3s 0.3s ease;

    &:before,
    &:after {
      content: '';
      display: block;
      background: $white;
      position: absolute;
      width: $border-width;
      height: 0.9rem;
      transition: all 0.3s ease;
      left: 0.45rem;
    }

    &:before { transform: rotate(-45deg); }
    &:after  { transform: rotate(-45deg); }
  }

  &.opened {
    .search-input {
      width: $search-width;
      transition-delay: 0.6s;
      cursor: text;
    }
    .cross {
      transform: translateX(4px) translateY(1px);
      transition-delay: 0s;
      &:before {
        transition-delay: 0.3s;
        transform: rotate(45deg);
      }
    }
  }

  .dropdown {
    position: absolute;
    top: calc($search-height + 0.3rem);
    width: $search-width;
    background: #1e2025;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 0.5rem;
    z-index: 999;
    padding: 0.3rem 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);

    .dropdown-item {
      display: flex;
      align-items: flex-start;
      padding: 0.4rem 0.5rem;
      color: $white;
      text-decoration: none;
      transition: background 0.15s ease;
      gap: 0.5rem;

      &:hover { background: rgba(255,255,255,0.06); }

      .dropdown-image {
        width: 32%;
        border-radius: 0.2rem;
        object-fit: cover;
        flex-shrink: 0;
      }

      .dropdown-info {
        flex: 1;
        min-width: 0;

        .dropdown-name {
          font-size: 0.7rem;
          font-weight: 600;
          margin: 0 0 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-shortDesc {
          font-size: 0.58rem;
          margin: 0 0 0.25rem;
          color: #999;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .info-row {
          display: flex;
          gap: 0.5rem;
          font-size: 0.55rem;
          color: #888;

          i { font-size: 0.5rem; margin-right: 0.15rem; }
        }
      }
    }
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 1024px) {
  .search-desktop {
    .search-input { max-width: 15rem; &:focus { width: 15rem; } }
    .dropdown { width: 15rem; }
  }
}

@media (max-width: 768px) {
  .search-desktop { display: none !important; }

  .search-mobile-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
    color: $white;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
    margin-bottom: 4px;

    i { font-size: 0.85rem; }

    &:active {
      background: rgba(255,255,255,0.15);
      transform: scale(0.93);
    }
  }
}
</style>