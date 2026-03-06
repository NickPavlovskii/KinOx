<template>
  <transition name="overlay-slide">
    <div
      v-if="open"
      class="mobile-overlay"
    >
      <div class="mobile-search-header">
        <div class="mobile-input-wrap">
          <i :class="['pi', 'pi-search', 'mobile-search-icon']"></i>
          <input
            ref="mobileInputRef"
            type="text"
            class="mobile-input"
            placeholder="Поиск фильмов..."
            spellcheck="false"
            :value="searchQuery"
            @input="$emit('input', $event.target.value)"
            @keydown.enter.prevent="$emit('enter')"
          />
          <button
            v-if="searchQuery.length"
            class="mobile-clear-btn"
            aria-label="Очистить"
            @click="$emit('clear')"
          >
            <i :class="['pi', 'pi-times']"></i>
          </button>
        </div>
        <button
          class="mobile-cancel-btn"
          @click="$emit('close')"
        >
        Отмена
      </button>
      </div>

      <div class="mobile-results">
        <transition-group name="result-item" tag="div">
          <router-link
            v-for="movie in filteredMoviesList"
            :key="movie.id"
            :to="{ name: 'movie-details', params: { id: movie.id } }"
            class="mobile-result-item"
            @click="$emit('close')"
          >
            <img
              class="mobile-result-image"
              alt="Постер"
              :src="movie.poster?.url"
            />
            <div class="mobile-result-info">
              <h3 class="mobile-result-name">{{ movie.name }}</h3>
              <p class="mobile-result-desc">{{ movie.shortDescription }}</p>
              <div class="mobile-info-row">
                <span>
                  <i :class="['pi', 'pi-clock']"></i>
                  {{ formatDuration(movie.movieLength) }}
                </span>
                <span>
                  <i :class="['pi', 'pi-calendar']"></i>
                  {{ movie.year }}
                </span>
              </div>
            </div>
            <i :class="['pi', 'pi-chevron-right', 'mobile-result-arrow']"></i>
          </router-link>
        </transition-group>

        <div
          v-if="showEmptyState"
          class="mobile-empty"
        >
          <i
            :class="['pi', 'pi-search']"
            style="font-size: 2rem; opacity: 0.3">
          </i>
          <p>Ничего не найдено</p>
          <span>Попробуйте другой запрос</span>
        </div>

        <div
          v-if="isLoading"
          class="mobile-loading"
        >
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div
          v-if="searchQuery.trim().length === 0"
          class="mobile-hint"
        >
          <i :class="['pi', 'pi-fire']"></i>
          <p>Начните вводить название фильма</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { formatDuration } from '@/utils/format'

export default {
  name: 'MobileSearchOverlay',
  props: {
    open: { type: Boolean, default: false },
    searchQuery: { type: String, default: '' },
    filteredMoviesList: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
  },
  emits: ['input', 'enter', 'clear', 'close'],
  computed: {
    showEmptyState() {
      return this.searchQuery.trim().length >= 1 && !this.filteredMoviesList.length && !this.isLoading
    },
  },
  methods: { formatDuration },
}
</script>

<style scoped lang="scss">
$white: #fff;
$font-family: 'Questrial', sans-serif;
$overlay-bg: #16181c;
$accent: #e8b04b;

.mobile-overlay {
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0;
  background: $overlay-bg;
  z-index: 9999;
  overflow: hidden;
}

.mobile-search-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: #1a1d22;

  .mobile-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 0.6rem;
    padding: 0 0.75rem;
    gap: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: border-color 0.2s ease;

    &:focus-within {
      border-color: rgba(255, 255, 255, 0.25);
    }

    .mobile-search-icon {
      color: #888;
      font-size: 0.8rem;
      flex-shrink: 0;
    }

    .mobile-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: $white;
      font-family: $font-family;
      font-size: 0.95rem;
      padding: 0.6rem 0;
      min-width: 0;

      &::placeholder {
        color: #666;
      }
    }

    .mobile-clear-btn {
      background: none;
      border: none;
      color: #888;
      cursor: pointer;
      padding: 0.2rem;
      display: flex;
      align-items: center;
      border-radius: 50%;
      transition: color 0.2s, background 0.2s;

      i {
        font-size: 0.7rem;
      }

      &:active {
        color: $white;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .mobile-cancel-btn {
    background: none;
    border: none;
    color: $accent;
    font-family: $font-family;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.4rem 0.2rem;
    white-space: nowrap;
    flex-shrink: 0;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.7;
    }
  }
}

.mobile-results {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.4rem 0;

  &::-webkit-scrollbar {
    display: none;
  }

  .mobile-result-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1rem;
    color: $white;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition: background 0.15s ease;

    &:active {
      background: rgba(255, 255, 255, 0.05);
    }

    .mobile-result-image {
      width: 52px;
      height: 72px;
      object-fit: cover;
      border-radius: 0.3rem;
      flex-shrink: 0;
      background: #2a2d32;
    }

    .mobile-result-info {
      flex: 1;
      min-width: 0;

      .mobile-result-name {
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0 0 0.2rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mobile-result-desc {
        font-size: 0.72rem;
        color: #999;
        margin: 0 0 0.3rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .mobile-info-row {
        display: flex;
        gap: 0.6rem;
        font-size: 0.65rem;
        color: #888;

        i {
          font-size: 0.6rem;
          margin-right: 0.1rem;
        }
      }
    }

    .mobile-result-arrow {
      font-size: 0.65rem;
      color: #555;
      flex-shrink: 0;
    }
  }
}

.mobile-empty,
.mobile-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  color: #666;
  text-align: center;

  i {
    font-size: 1.8rem;
  }
  p {
    font-size: 0.9rem;
    margin: 0;
    color: #888;
  }
  span {
    font-size: 0.75rem;
  }
}

.mobile-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;

  .loading-dots {
    display: flex;
    gap: 0.4rem;

    span {
      width: 7px;
      height: 7px;
      background: #666;
      border-radius: 50%;
      animation: dot-bounce 1.2s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

.overlay-slide-enter-active {
  animation: slide-up 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.overlay-slide-leave-active {
  animation: slide-down 0.22s cubic-bezier(0.55, 0, 1, 0.45);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slide-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

.result-item-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.result-item-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>
